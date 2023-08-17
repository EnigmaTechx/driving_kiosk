const isDriver = (req, res, next) => {
  if (req.session.user.UserType === "Driver") {
    next();
  } else {
    req.session.error = "You are not authorized to access this page";
    res.redirect("/dashboard");
  }
};

const isAuthorized = (req, res, next) => {
  if (!req.session.user.UserType) {
    req.session.error = "Please login to access this page";
    res.redirect("/login");
  }
};

const isAdmin = (req, res, next) => {
  if (req.session.user.UserType === "Admin") {
    next();
  } else {
    req.session.error = "Only Admins can access this page";
    res.redirect("/dashboard");
  }
};

const isExaminer = (req, res, next) => {
  if (req.session.user.UserType === "Examiner") {
    next();
  } else {
    req.session.error = "Only Examiners can access this page";
    res.redirect("/dashboard");
  }
};

export default isDriver;
export { isAdmin, isAuthorized, isExaminer };
