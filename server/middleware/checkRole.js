const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        // Safe check: Agar user hi nahi hai, to role check mat karo
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Authorized roles: ${allowedRoles.join(", ")}`
            });
        }
        next();
    }
}
  
export default checkRole;