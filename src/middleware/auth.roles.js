import { ApiError } from "../utils/ApiError.js";

export const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    // Here we are returning the middleware in a function as it requires the parameter of role and that is the parameter of this function
    const userRole = req.user?.role; // "could be 'user', 'admin', 'manager', etc..."

    if (!userRole) {
      throw new ApiError(403, "User not received");
    }

    if (!allowedRoles.includes(userRole))
      throw new ApiError(403, "You are not authorized to access this page");

    next();
  };
};
