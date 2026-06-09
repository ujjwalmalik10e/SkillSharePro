import express from "express";
import Course from "../models/Course.js";
import { verifyToken,verifyAdmin, verifyInstructor, verifyUser } from "../middleware/middleware.js";

const router = express.Router();

// ✅ Instructor creates a new course
router.post("/create", verifyToken, verifyInstructor, async (req, res) => {
  try {
    const { title, description } = req.body;
    const newCourse = new Course({
      title,
      description,
      instructor: req.user.id,
    });
    await newCourse.save();
    res.status(201).json({ message: "Course created successfully", course: newCourse });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ User enrolls in a course
router.post("/:courseId/enroll", verifyToken, verifyUser, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // prevent duplicate enrollment
    if (course.studentsEnrolled.includes(req.user.id))
      return res.status(400).json({ message: "Already enrolled" });

    course.studentsEnrolled.push(req.user.id);
    await course.save();
    res.json({ message: "Enrolled successfully", course });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Public route - view all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().populate("instructor", "name email");
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
// ✅ Admin: View all courses with instructor + enrolled students
router.get("/admin/all-courses", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("instructor", "name email role")
      .populate("studentsEnrolled", "name email")
      .select("title description instructor studentsEnrolled createdAt");

    res.json({
      message: "All courses with instructor and enrolled students",
      totalCourses: courses.length,
      courses,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
// ✅ User: View courses the logged-in user is enrolled in
router.get("/my-courses", verifyToken, verifyUser, async (req, res) => {
  try {
    const courses = await Course.find({ studentsEnrolled: req.user.id })
      .populate("instructor", "name email")
      .select("title description instructor createdAt");

    res.json({
      message: "Courses you are enrolled in",
      totalCourses: courses.length,
      courses,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Instructor: View all courses they created + enrolled students
router.get("/instructor/my-courses", verifyToken, verifyInstructor, async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id })
      .populate("studentsEnrolled", "name email") // show enrolled students' info
      .select("title description studentsEnrolled createdAt");

    res.json({
      message: "Courses created by you (with enrolled students)",
      totalCourses: courses.length,
      courses,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
// ✅ Instructor: View all courses created by this instructor
router.get("/my-created-courses", verifyToken, verifyInstructor, async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id })
      .populate("studentsEnrolled", "name email")
      .select("title description studentsEnrolled createdAt");

    res.json({
      message: "Courses you have created",
      totalCourses: courses.length,
      courses,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
// ✅ Instructor or Admin removes a student from their course (force unenroll)
router.post("/:courseId/remove/:studentId", verifyToken, async (req, res) => {
  try {
    const { courseId, studentId } = req.params;
    const course = await Course.findById(courseId);

    if (!course) return res.status(404).json({ message: "Course not found" });

    // Only the instructor of that course or an admin can remove a student
    if (course.instructor.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to remove students from this course" });
    }

    // Convert both IDs to strings before comparing, to ensure proper removal
    const before = course.studentsEnrolled.length;
    course.studentsEnrolled = course.studentsEnrolled.filter(
      (id) => id.toString() !== studentId.toString()
    );

    if (course.studentsEnrolled.length === before) {
      return res.status(400).json({ message: "Student was not enrolled in this course" });
    }

    await course.save();
    res.json({ message: "Student removed successfully", course });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/user/enrolled", verifyToken, verifyUser, async (req, res) => {
  try {
    const courses = await Course.find({ studentsEnrolled: req.user.id });
    res.json({ message: "Your enrolled courses", courses });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
// ✅ Get all courses a user is enrolled in
router.get("/my-enrollments", verifyToken, async (req, res) => {
  try {
    const courses = await Course.find({ studentsEnrolled: req.user.id })
      .populate("instructor", "name email")
      .select("title description instructor createdAt");
      
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ User unenrolls from a course
router.post("/:courseId/unenroll", verifyToken, verifyUser, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // check if user is actually enrolled
    if (!course.studentsEnrolled.includes(req.user.id))
      return res.status(400).json({ message: "You are not enrolled in this course" });

    // remove user from studentsEnrolled array
    course.studentsEnrolled = course.studentsEnrolled.filter(
      (studentId) => studentId.toString() !== req.user.id
    );
    await course.save();

    res.json({ message: "Unenrolled successfully", course });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
// ✅ Instructor deletes a course they created
router.delete("/:courseId", verifyToken, verifyInstructor, async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);

    if (!course) return res.status(404).json({ message: "Course not found" });

    // ensure only the instructor who created it can delete
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this course" });
    }

    await Course.findByIdAndDelete(courseId);

    // ⬇️ Clean up from users' enrolled lists
    // await User.updateMany(
    //   { enrolledCourses: courseId },
    //   { $pull: { enrolledCourses: courseId } }
    // );

    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
// ✅ Admin deletes a course
router.delete("/admin/:courseId", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.courseId);
    if (!deletedCourse)
      return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
