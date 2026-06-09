// src/pages/InstructorDashboard.js
import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

export default function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch instructor's created courses
  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses/my-created-courses", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCourses(res.data.courses);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteCourse = async (courseId) => {
  try {
    await api.delete(`/courses/${courseId}`);
    setCourses((prev) => prev.filter((c) => c._id !== courseId));
    alert("Course deleted successfully!");
  } catch (err) {
    console.error(err);
    alert("Failed to delete course");
  }
};
  useEffect(() => {
    fetchCourses();
  }, []);

  // Handle course creation
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await api.post(
        "/courses/create",
        { title, description },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("Course created successfully!");
      setTitle("");
      setDescription("");
      setShowForm(false);
      fetchCourses(); // refresh list
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create course");
    }
  };

  // Handle student removal (force unenroll)
  const handleUnenroll = async (courseId, studentId) => {
    try {
      await api.post(
        `/courses/${courseId}/remove/${studentId}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("Student unenrolled successfully!");
      fetchCourses();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to unenroll student");
    }
  };

  if (loading) return <div>Loading courses...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ color: "#0a2752ff" }}>Instructor Dashboard</h2>

      {/* CREATE COURSE BUTTON */}
      <button
        onClick={() => setShowForm(!showForm)}
        style={{
          backgroundColor: "#0a2752ff",
          color: "white",
          border: "none",
          borderRadius: "8px",
          padding: "10px 16px",
          marginTop: 10,
          marginBottom: 20,
          cursor: "pointer",
          transition: "0.2s",
        }}
        onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
      >
        {showForm ? "Cancel" : "Create Course"}
      </button>

      {/* COURSE CREATION FORM */}
      {showForm && (
        <form
          onSubmit={handleCreateCourse}
          style={{
            backgroundColor: "#f4f6fb",
            padding: 20,
            borderRadius: 10,
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            marginBottom: 30,
          }}
        >
          <input
            type="text"
            placeholder="Course Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{
              display: "block",
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
          <textarea
            placeholder="Course Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{
              display: "block",
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              marginBottom: "10px",
              height: "80px",
            }}
          ></textarea>
          <button
            type="submit"
            style={{
              backgroundColor: "#0a2752ff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "8px 14px",
              cursor: "pointer",
              transition: "0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            Add Course
          </button>
        </form>
      )}

      {/* NO COURSES */}
      {courses.length === 0 && (
        <div style={{ color: "#666", fontStyle: "italic" }}>
          No courses created yet.
        </div>
      )}

      {/* COURSE LIST */}
      <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
        {courses.map((course) => (
          <div
            key={course._id}
            style={{
              backgroundColor: "#f9fafc",
              padding: 20,
              borderRadius: 10,
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              transition: "0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.03)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            <h3 style={{ color: "#0a2752ff", marginBottom: "8px" }}>
              {course.title}
            </h3>
            <p style={{ color: "#333", marginBottom: "12px" }}>
              {course.description}
            </p>
            
            <h4 style={{ color: "#0a2752ff", fontSize: "16px", marginBottom: "8px" }}>
              Enrolled Students:
            </h4>

            {course.studentsEnrolled.length === 0 ? (
              <p style={{ color: "#666", fontStyle: "italic" }}>No students enrolled.</p>
            ) : (
              <ul style={{ paddingLeft: "20px" }}>
                {course.studentsEnrolled.map((student) => (
                  <li key={student._id} style={{ marginBottom: "8px" }}>
                    {student.name || student.email}
                    <button
                      onClick={() => handleUnenroll(course._id, student._id)}
                      style={{
                        marginLeft: "10px",
                        backgroundColor: "#d9534f",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "4px 8px",
                        cursor: "pointer",
                        transition: "0.2s",
                      }}
                      onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
                      onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                    >
                      Unenroll
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={() => handleDeleteCourse(course._id)}
              style={{
                backgroundColor: "#e74c3c",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "6px",
                cursor: "pointer",
                marginTop: "10px",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            >
              Delete Course
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}
