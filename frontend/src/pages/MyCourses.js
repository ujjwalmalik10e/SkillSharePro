import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to view your courses.");
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/courses/my-courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data.courses || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleUnenroll = async (courseId) => {
    if (!window.confirm("Are you sure you want to unenroll from this course?")) return;

    const token = localStorage.getItem("token");
    try {
      await api.post(
        `/courses/unenroll/${courseId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCourses(courses.filter((c) => c._id !== courseId));
      alert("You have been unenrolled successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to unenroll");
    }
  };

  if (loading) return <div>Loading your courses...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fff7ed, #fef3c7)",
        padding: "40px 20px",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 30 }}>My Enrolled Courses</h2>

      {courses.length === 0 ? (
        <p style={{ textAlign: "center" }}>You are not enrolled in any courses yet.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          {courses.map((c, i) => {
            const colors = ["#e0f2fe", "#fef9c3", "#d9f99d", "#fbcfe8", "#fde68a"];
            const bgColor = colors[i % colors.length];
            return (
              <div
                key={c._id}
                style={{
                  background: bgColor,
                  borderRadius: "10px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  padding: "20px",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
                }}
              >
                <h3 style={{ color: "#1e293b" }}>{c.title}</h3>
                <p style={{ fontSize: 14, color: "#555" }}>
                  {c.description?.slice(0, 80)}...
                </p>
                <div style={{ fontSize: 12, color: "#475569", marginTop: 8 }}>
                  Instructor: {c.instructor?.name || c.instructor?.email || "Unknown"}
                </div>
                <h4 style={{ marginTop: 15 }}>Resources</h4>

                {!c.resources || c.resources.length === 0 ? (
                  <p>No resources available.</p>
                ) : (
                  <ul>
                    {c.resources.map((resource, index) => (
                      <li key={index}>
                        <a
                          href={resource.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {resource.fileName}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
                <button
                  onClick={() => handleUnenroll(c._id)}
                  style={{
                    marginTop: 15,
                    backgroundColor: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 12px",
                    cursor: "pointer",
                    transition: "transform 0.2s ease, background-color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.1)";
                    e.currentTarget.style.backgroundColor = "#dc2626";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.backgroundColor = "#ef4444";
                  }}
                >
                  Unenroll
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
