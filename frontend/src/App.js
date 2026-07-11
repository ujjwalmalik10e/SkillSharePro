// src/App.js
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import AllCourses from "./pages/AllCourses";
import Login from "./pages/Login";
import Register from "./pages/Register";
import InstructorDashboard from "./pages/InstructorDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageCourses from "./pages/admin/ManageCourses";
import Home from "./pages/Home";
import "./navbar.css";
function AppContent() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

const hideNavbar =
  location.pathname === "/login" ||
  location.pathname === "/register";
  // Load user from token on initial render
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const [, payload] = token.split(".");
        const decoded = JSON.parse(atob(payload));
        setUser(decoded);
      } catch (err) {
        console.error("Invalid token");
        localStorage.removeItem("token");
      }
    }
  }, []);

  const handleLogout = () => {
  localStorage.removeItem("token");
  setUser(null);
  navigate("/");
};

  return (
    <>
      {/* Navbar */}
      {!hideNavbar && (
  <div className="navbar-wrapper">
    <nav className="main-navbar">
      <Link to="/" className="navbar-brand">
        <span className="navbar-logo">SS</span>
        <span>SkillShare Pro</span>
      </Link>

      <div className="navbar-links">
        <Link to="/">Home</Link>

        <Link to="/courses">Courses</Link>
        <a href="#contact" className="navbar-link">
  Contact Us
</a>
        {user?.role === "instructor" && (
          <Link to="/instructor">Instructor</Link>
        )}

        {user?.role === "admin" && (
          <Link to="/admin/dashboard">Admin</Link>
        )}
      </div>

      <div className="navbar-actions">
        {!user ? (
          <>
            <Link to="/login" className="navbar-login">
              Login
            </Link>

            <Link to="/register" className="navbar-register">
              Get Started
            </Link>
          </>
        ) : (
          <>
            <span className="navbar-role">
              {user.role}
            </span>

            <button
              onClick={handleLogout}
              className="navbar-logout"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  </div>
)}
      {/* Page content */}
      <div>
        

        <Routes>
          <Route path="/" element={<Home user={user} />} />
<Route path="/courses" element={<AllCourses />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/instructor" element={<InstructorDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/manage-users" element={<ManageUsers />} />
          <Route path="/admin/manage-courses" element={<ManageCourses />} />
        </Routes>
      </div>
    </>
  );
}
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
export default App;
