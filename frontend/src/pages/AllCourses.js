import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

export default function AllCourses({ searchTerm = "" }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  const [questions, setQuestions] = useState({});
const [answers, setAnswers] = useState({});
const [loadingAI, setLoadingAI] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const [, payload] = token.split(".");
        const decoded = JSON.parse(atob(payload));
        setUser(decoded);
      } catch (err) {
        console.error("Invalid token");
      }
    }
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses");
      setCourses(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return alert("Please log in first");

      await api.post(
        `/courses/${courseId}/enroll`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Successfully enrolled!");
      fetchCourses();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to enroll");
    }
  };

  const handleUnenroll = async (courseId) => {
    try {
      const token = localStorage.getItem("token");

      await api.post(
        `/courses/${courseId}/unenroll`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Successfully unenrolled!");
      fetchCourses();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to unenroll");
    }
  };

  const handleAskAI = async (courseId, resourceIndex) => {
  const key = `${courseId}-${resourceIndex}`;

  if (!questions[key]?.trim()) {
    alert("Please enter a question.");
    return;
  }

  try {
    setLoadingAI((prev) => ({
      ...prev,
      [key]: true,
    }));

    const res = await api.post("/gemini/ask", {
      courseId,
      resourceIndex,
      question: questions[key],
    });

    setAnswers((prev) => ({
      ...prev,
      [key]: res.data.answer,
    }));
  } catch (err) {
    setAnswers((prev) => ({
      ...prev,
      [key]: err.response?.data?.message || "AI failed",
    }));
  } finally {
    setLoadingAI((prev) => ({
      ...prev,
      [key]: false,
    }));
  }
};

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCardColor = (id) => {
    const colors = [
      "#fee2e2",
      "#fef3c7",
      "#dcfce7",
      "#dbeafe",
      "#ede9fe",
      "#fce7f3",
      "#cffafe",
      "#f3e8ff",
    ];

    return colors[id.charCodeAt(id.length - 1) % colors.length];
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f4ff, #e0e7ff)",
        padding: "40px 20px",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 30 }}>
        All Courses
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {filteredCourses.length > 0 ? (
          filteredCourses.map((c) => {
            const isEnrolled =
              user && c.studentsEnrolled?.includes(user.id);

            return (
              <div
                key={c._id}
                style={{
                  background: getCardColor(c._id),
                  borderRadius: "10px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  padding: "20px",
                }}
              >
                <h3>{c.title}</h3>

                <p>{c.description}</p>

                <div
                  style={{
                    fontSize: 13,
                    color: "#555",
                    marginBottom: 10,
                  }}
                >
                  Instructor:{" "}
                  {c.instructor?.name ||
                    c.instructor?.email ||
                    "Unknown"}
                </div>

                {!isEnrolled ? (
                  <>
                    <p
                      style={{
                        color: "#666",
                        fontStyle: "italic",
                      }}
                    >
                      🔒 Resources available after enrollment.
                    </p>

                    {user?.role === "user" && (
                      <button
                        onClick={() => handleEnroll(c._id)}
                        style={{
                          background: "#2563eb",
                          color: "white",
                          border: "none",
                          padding: "8px 12px",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                      >
                        Enroll
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <p
                      style={{
                        color: "green",
                        fontWeight: "bold",
                      }}
                    >
                      ✅ Enrolled
                    </p>

                    <h4>Resources</h4>

                      {c.resources?.length > 0 ? (
                        <div>
                          {c.resources.map((resource, index) => {
                            const key = `${c._id}-${index}`;

                            return (
                              <div
                                key={index}
                                style={{
                                  border: "1px solid #ddd",
                                  borderRadius: "8px",
                                  padding: "12px",
                                  marginBottom: "12px",
                                  background: "#fff",
                                }}
                              >
                                <a
                                  href={resource.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    display: "block",
                                    marginBottom: "10px",
                                    fontWeight: "bold",
                                    textDecoration: "none",
                                  }}
                                >
                                  📄 {resource.fileName}
                                </a>

                                <input
                                  type="text"
                                  placeholder="Ask AI about this PDF..."
                                  value={questions[key] || ""}
                                  onChange={(e) =>
                                    setQuestions((prev) => ({
                                      ...prev,
                                      [key]: e.target.value,
                                    }))
                                  }
                                  style={{
                                    width: "100%",
                                    padding: "8px",
                                    marginBottom: "10px",
                                    borderRadius: "6px",
                                    border: "1px solid #ccc",
                                  }}
                                />

                                <button
                                  onClick={() => handleAskAI(c._id, index)}
                                  disabled={loadingAI[key]}
                                  style={{
                                    background: "#2563eb",
                                    color: "white",
                                    border: "none",
                                    padding: "8px 12px",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                  }}
                                >
                                  {loadingAI[key] ? "Thinking..." : "💬 Ask AI"}
                                </button>

                                {answers[key] && (
                                  <div
                                    style={{
                                      marginTop: "12px",
                                      background: "#f8fafc",
                                      border: "1px solid #ddd",
                                      borderRadius: "6px",
                                      padding: "10px",
                                      whiteSpace: "pre-wrap",
                                    }}
                                  >
                                    <strong>🤖 SkillShare AI</strong>
                                    <hr />
                                    {answers[key]}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p>No resources uploaded yet.</p>
                      )}
                            

                    <br />

                    <button
                      onClick={() => handleUnenroll(c._id)}
                      style={{
                        marginTop: 12,
                        background: "#dc2626",
                        color: "white",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      Unenroll
                    </button>
                  </>
                )}
              </div>
            );
          })
        ) : (
          <p>No courses found.</p>
        )}
      </div>
    </div>
  );
}