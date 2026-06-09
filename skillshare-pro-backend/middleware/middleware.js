import jwt from "jsonwebtoken";

// ✅ Verify JWT Token for any logged-in user
export const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info to request
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};

// ✅ Allow only Admins
export const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

// ✅ Allow only Instructors
export const verifyInstructor = (req, res, next) => {
  if (req.user.role !== "instructor") {
    return res.status(403).json({ message: "Access denied. Instructors only." });
  }
  next();
};

// ✅ Allow only regular Users
export const verifyUser = (req, res, next) => {
  if (!req.user || req.user.role !== "user") {
    return res.status(403).json({ message: "Access denied. Users only." });
  }
  next();
};
