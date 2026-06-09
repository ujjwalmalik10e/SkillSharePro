import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedCourse, setExpandedCourse] = useState(null); // dropdown toggle
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses/admin/all-courses", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCourses(res.data.courses);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleUnenroll = async (courseId, studentId) => {
    try {
      await api.post(
        `/courses/${courseId}/remove/${studentId}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Student unenrolled successfully");
      fetchCourses();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to unenroll student");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await api.delete(`/courses/admin/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCourses(courses.filter((c) => c._id !== id));
      alert("Course deleted successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete course");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ color: "#0a2752ff" }}>Manage Courses</h2>
      {courses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {courses.map((course, i) => {
            const isExpanded = expandedCourse === course._id;
            const filteredStudents = course.studentsEnrolled.filter((student) =>
              student.name?.toLowerCase().includes(searchQuery.toLowerCase())
            );

            return (
              <div
                key={course._id}
                style={{
                  background: `hsl(${i * 40}, 70%, 85%)`,
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.03)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <p>
                  <strong>Instructor:</strong>{" "}
                  {course.instructor?.name || "Unknown"}
                </p>
                <p>
                  <strong>Enrolled:</strong> {course.studentsEnrolled.length}
                </p>

                <button
                  onClick={() =>
                    setExpandedCourse(isExpanded ? null : course._id)
                  }
                  style={{
                    background: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 10px",
                    cursor: "pointer",
                    marginTop: "8px",
                  }}
                >
                  {isExpanded ? "Hide Students" : "Manage Students"}
                </button>

                {isExpanded && (
                  <div
                    style={{
                      marginTop: "10px",
                      background: "rgba(255,255,255,0.7)",
                      borderRadius: "8px",
                      padding: "10px",
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "6px",
                        marginBottom: "8px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                      }}
                    />
                    {filteredStudents.length === 0 ? (
                      <p style={{ fontSize: "0.9rem" }}>No matching students.</p>
                    ) : (
                      <ul
                        style={{
                          listStyle: "none",
                          padding: 0,
                          maxHeight: "200px",
                          overflowY: "auto",
                        }}
                      >
                        {filteredStudents.map((student) => (
                          <li
                            key={student._id}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              background: "#fff",
                              borderRadius: "6px",
                              padding: "6px 10px",
                              marginTop: "6px",
                              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            }}
                          >
                            <span>{student.name || "Unknown Student"}</span>
                            <button
                              onClick={() =>
                                handleUnenroll(course._id, student._id)
                              }
                              style={{
                                background: "#dc3545",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                padding: "4px 8px",
                                cursor: "pointer",
                                fontSize: "0.85rem",
                              }}
                            >
                              Unenroll
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                <button
                  onClick={() => handleDelete(course._id)}
                  style={{
                    background: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    cursor: "pointer",
                    marginTop: "12px",
                    width: "100%",
                  }}
                >
                  Delete Course
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
