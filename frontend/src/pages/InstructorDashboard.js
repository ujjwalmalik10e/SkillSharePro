// src/pages/InstructorDashboard.js
import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import "../styles/instructor.css";
export default function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState({});
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
const handlePdfUpload = async (courseId) => {
  try {
    const file = selectedFiles[courseId];

    if (!file) {
      alert("Please select a PDF first.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);

    const res = await api.post(
      `/pdf/upload/${courseId}`,
      formData
    );

    alert(res.data.message);
    fetchCourses();
  } catch (err) {
    console.error(err);
    alert("Upload failed");
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

  if (loading)
  return (
    <div className="instructor-loading">
      <div className="instructor-loader" />
      <p>Loading your workspace...</p>
    </div>
  );

  return (
  <div className="instructor-page">
    <div className="instructor-header">
      <div>
        <p className="instructor-label">INSTRUCTOR WORKSPACE</p>

        <h1>Instructor Dashboard</h1>

        <p className="instructor-subtitle">
          Create courses, manage resources and guide your students.
        </p>
      </div>

      <button
        onClick={() => setShowForm(!showForm)}
        className="instructor-create-button"
      >
        {showForm ? "Cancel" : "+ Create Course"}
      </button>
    </div>

    {showForm && (
      <form
        onSubmit={handleCreateCourse}
        className="create-course-form"
      >
        <div className="create-form-heading">
          <p>NEW COURSE</p>
          <h2>Create a course</h2>
        </div>

        <input
          type="text"
          placeholder="Course Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Course Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <button type="submit">
          Add Course
        </button>
      </form>
    )}

    {courses.length === 0 ? (
      <div className="instructor-empty">
        <span>01</span>
        <h2>No courses created yet.</h2>
        <p>
          Create your first course and start sharing learning resources.
        </p>
      </div>
    ) : (
      <div className="instructor-courses-grid">
        {courses.map((course, courseIndex) => (
          <div
            key={course._id}
            className="instructor-course-card"
          >
            <div className="instructor-course-top">
              <span className="course-index">
                {String(courseIndex + 1).padStart(2, "0")}
              </span>

              <span className="course-status">
                ACTIVE
              </span>
            </div>

            <h2>{course.title}</h2>

            <p className="instructor-course-description">
              {course.description}
            </p>

            <div className="dashboard-divider" />

            <div className="dashboard-section">
              <p className="dashboard-section-label">
                COURSE RESOURCES
              </p>

              <div className="pdf-upload-area">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) =>
                    setSelectedFiles((prev) => ({
                      ...prev,
                      [course._id]: e.target.files[0],
                    }))
                  }
                />

                <button
                  onClick={() =>
                    handlePdfUpload(course._id)
                  }
                >
                  Upload PDF
                </button>
              </div>

              {!course.resources ||
              course.resources.length === 0 ? (
                <p className="dashboard-muted">
                  No resources uploaded.
                </p>
              ) : (
                <div className="instructor-resources">
                  {course.resources.map(
                    (resource, index) => (
                      <a
                        key={index}
                        href={resource.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="instructor-resource"
                      >
                        <span className="resource-pdf-icon">
                          PDF
                        </span>

                        <span>{resource.fileName}</span>
                      </a>
                    )
                  )}
                </div>
              )}
            </div>

            <div className="dashboard-divider" />

            <div className="dashboard-section">
              <p className="dashboard-section-label">
                ENROLLED STUDENTS
              </p>

              {course.studentsEnrolled.length === 0 ? (
                <p className="dashboard-muted">
                  No students enrolled.
                </p>
              ) : (
                <div className="student-list">
                  {course.studentsEnrolled.map(
                    (student) => (
                      <div
                        key={student._id}
                        className="student-row"
                      >
                        <div className="student-info">
                          <span className="student-avatar">
                            {(student.name ||
                              student.email ||
                              "S")[0].toUpperCase()}
                          </span>

                          <span>
                            {student.name ||
                              student.email}
                          </span>
                        </div>

                        <button
                          onClick={() =>
                            handleUnenroll(
                              course._id,
                              student._id
                            )
                          }
                          className="student-remove-button"
                        >
                          Remove
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            <div className="course-danger-zone">
              <button
                onClick={() =>
                  handleDeleteCourse(course._id)
                }
              >
                Delete Course
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
}
