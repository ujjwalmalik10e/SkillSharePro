import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import "../styles/courses.css";
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
  <div className="courses-page">
    <div className="courses-header">
      <span className="courses-label">EXPLORE LEARNING</span>
      <h1>Discover Courses</h1>
      <p>
        Explore courses, enroll and access intelligent learning resources.
      </p>
    </div>

    <div className="courses-grid">
      {filteredCourses.length > 0 ? (
        filteredCourses.map((c) => {
          const isEnrolled =
            user && c.studentsEnrolled?.includes(user.id);

          return (
            <div key={c._id} className="course-card">
              <div className="course-card-number">COURSE</div>

              <h3>{c.title}</h3>

              <p className="course-description">
                {c.description}
              </p>

              <div className="course-instructor">
                Instructor:{" "}
                {c.instructor?.name ||
                  c.instructor?.email ||
                  "Unknown"}
              </div>

              {!isEnrolled ? (
                <>
                  <p className="course-locked">
                    Resources available after enrollment.
                  </p>

                  {user?.role === "user" && (
                    <button
                      onClick={() => handleEnroll(c._id)}
                      className="course-primary-button"
                    >
                      Enroll
                    </button>
                  )}
                </>
              ) : (
                <>
                  <p className="course-enrolled">
                    Enrolled
                  </p>

                  <h4 className="resources-title">
                    Resources
                  </h4>

                  {c.resources?.length > 0 ? (
                    <div className="resources-list">
                      {c.resources.map((resource, index) => {
                        const key = `${c._id}-${index}`;

                        return (
                          <div
                            key={index}
                            className="resource-card"
                          >
                            <a
                              href={resource.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="resource-link"
                            >
                              {resource.fileName}
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
                              className="resource-input"
                            />

                            <button
                              onClick={() =>
                                handleAskAI(c._id, index)
                              }
                              disabled={loadingAI[key]}
                              className="course-primary-button"
                            >
                              {loadingAI[key]
                                ? "Thinking..."
                                : "Ask SkillShare AI"}
                            </button>

                            {answers[key] && (
                              <div className="ai-answer">
                                <strong>SkillShare AI</strong>
                                <p>{answers[key]}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="no-resources">
                      No resources uploaded yet.
                    </p>
                  )}

                  <button
                    onClick={() => handleUnenroll(c._id)}
                    className="course-danger-button"
                  >
                    Unenroll
                  </button>
                </>
              )}
            </div>
          );
        })
      ) : (
        <p className="no-courses">No courses found.</p>
      )}
    </div>
  </div>
);
}