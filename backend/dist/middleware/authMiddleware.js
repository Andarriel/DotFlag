"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasRole = void 0;
const roleHierarchy = ['Guest', 'User', 'Coach', 'Moderator', 'Admin', 'Owner'];
const hasRole = (requiredRole) => {
    return (req, res, next) => {
        const userRole = req.session.role;
        if (!userRole) {
            return res.status(403).json({ message: 'Forbidden: No role assigned.' });
        }
        const userLevel = roleHierarchy.indexOf(userRole);
        const requiredLevel = roleHierarchy.indexOf(requiredRole);
        if (userLevel >= requiredLevel) {
            return next();
        }
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions.' });
    };
};
exports.hasRole = hasRole;
