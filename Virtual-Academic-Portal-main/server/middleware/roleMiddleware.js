// // =======================
// // ROLE-BASED MIDDLEWARE
// // =======================

// // Only STUDENTS
// const isStudent = (req, res, next) => {
//   if (req.user.role !== "student") {
//     return res.status(403).json({ message: "Access denied: Students only" });
//   }
//   next();
// };

// // Only TEACHERS
// const isTeacher = (req, res, next) => {
//   if (req.user.role !== "teacher") {
//     return res.status(403).json({ message: "Access denied: Teachers only" });
//   }
//   next();
// };

// // Only ADMINS
// const isAdmin = (req, res, next) => {
//   if (req.user.role !== "admin") {
//     return res.status(403).json({ message: "Access denied: Admins only" });
//   }
//   next();
// };

// module.exports = {
//   isStudent,
//   isTeacher,
//   isAdmin,
// };


const isStudent = (req, res, next) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Access denied: Students only" });
  }
  next();
};

const isTeacher = (req, res, next) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({ message: "Access denied: Teachers only" });
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next();
};

module.exports = {
  isStudent,
  isTeacher,
  isAdmin,
};
