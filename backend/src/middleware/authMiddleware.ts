import { Request, Response, NextFunction } from 'express';

type Role = 'Owner' | 'Admin' | 'Moderator' | 'Coach' | 'User' | 'Guest';

const roleHierarchy: Role[] = ['Guest', 'User', 'Coach', 'Moderator', 'Admin', 'Owner'];

export const hasRole = (requiredRole: Role) => {
  return (req: Request, res: Response, next: NextFunction) => {
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