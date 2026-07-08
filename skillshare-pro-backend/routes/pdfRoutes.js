import express from "express";
import upload from "../middleware/upload.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import pdfParse from "pdf-parse-new";
import Course from "../models/Course.js";

const router = express.Router();

router.post(
  "/upload/:courseId",
  upload.single("pdf"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "No file uploaded",
        });
      }
      
      const pdfData = await pdfParse(req.file.buffer);
      const extractedText = pdfData.text;
      console.log("Characters:", extractedText.length);
      console.log(JSON.stringify(extractedText));
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "auto",
            folder: "SkillSharePro",
            public_id: req.file.originalname.replace(".pdf", ""),
            use_filename: true,
            unique_filename: true,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
      
      const { courseId } = req.params;

      const course = await Course.findById(courseId);

      if (!course) {
        return res.status(404).json({
          message: "Course not found",
        });
      }

      course.resources.push({
        fileName: req.file.originalname,
        fileUrl: result.secure_url,
        extractedText,
      });

      await course.save();

      res.json({
        message: "PDF uploaded successfully",
        resource: {
          fileName: req.file.originalname,
          fileUrl: result.secure_url,
          extractedCharacters: extractedText.length,
        },
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "Upload failed",
      });
    }
  }
);

export default router;