import User from '../models/User.js';

export async function requireAuth(req, res, next) {
  try {
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(401).json({error:'Unauthorized. Missing x-user-id header.'});
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({error:'User not found in database.'});
    }

    if (user.status === 'inactive') {
      return res.status(403).json({error:'Your account is inactive.'});
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth error:', err);
    res.status(500).json({error:'Internal server error during authentication'});
  }
}

export function allowRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({error:'Not authenticated'});
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({error:`Access denied. Requires one of: ${allowedRoles.join(', ')}`});
    }

    next();
  };
}
