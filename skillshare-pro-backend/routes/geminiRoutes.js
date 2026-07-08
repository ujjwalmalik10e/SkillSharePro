import express from "express";
import genAI from "../config/gemini.js";
import Course from "../models/Course.js";

const router = express.Router();

router.post("/ask", async (req, res) => {
  try {
    const { courseId, resourceIndex, question } = req.body;

    if (!courseId || resourceIndex === undefined || !question) {
      return res.status(400).json({
        message: "courseId, resourceIndex and question are required.",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const resource = course.resources[resourceIndex];

    if (!resource) {
      return res.status(404).json({
        message: "Resource not found",
      });
    }

    if (!resource.extractedText || resource.extractedText.trim() === "") {
      return res.status(400).json({
        message: "No extracted text found for this PDF.",
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are an AI tutor.

Answer ONLY using the document below.
If the answer is not present in the document, reply:
"I couldn't find that information in the uploaded PDF."

DOCUMENT:
${resource.extractedText}

QUESTION:
${question}
`;

    const result = await model.generateContent(prompt);

    const response = await result.response;

    res.json({
      answer: response.text(),
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Gemini failed",
      error: err.message,
    });
  }
});

export default router;