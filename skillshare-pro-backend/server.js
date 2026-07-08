import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { verifyToken, verifyAdmin, verifyInstructor, verifyUser } from "./middleware/middleware.js";
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import cloudinary from "./config/cloudinary.js";
import pdfRoutes from "./routes/pdfRoutes.js";
import geminiRoutes from "./routes/geminiRoutes.js";
dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:3000",
  "https://skillshare-frontend-nu.vercel.app",
  credentials: true,
}));
app.use(express.json());
app.use("/api/admin", adminRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/gemini", geminiRoutes);
// ✅ MongoDB Connection
console.log("MONGO URI EXISTS:", !!process.env.MONGO_URI);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// ✅ Base route
app.get("/", (req, res) => {
  res.send("SkillShare Pro API Running 🚀");
});

// ✅ Auth routes
app.use("/api/auth", authRoutes);
// course routes
app.use("/api/courses", courseRoutes);

// ✅ Protected Routes for each role

// Generic protected route (any logged-in user)
app.get("/api/user/profile", verifyToken, (req, res) => {
  res.json({
    message: "Welcome User",
    user: req.user,
  });
});

// Admin only
app.get("/api/admin/dashboard", verifyToken, verifyAdmin, (req, res) => {
  res.json({
    message: "Welcome Admin",
    user: req.user,
  });
});

// Instructor only
// Protected instructor route
// Instructor only
app.get("/api/instructor/dashboard", verifyToken, verifyInstructor, (req, res) => {
  res.json({
    message: "Welcome Instructor",
    user: req.user,
  });
});



// Regular user only
app.get("/api/student/dashboard", verifyToken, verifyUser, (req, res) => {
  res.json({
    message: "Welcome Student",
    user: req.user,
  });
});

const PORT = process.env.PORT || 5000;
console.log("Cloudinary Configured:", !!cloudinary.config().cloud_name);
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
