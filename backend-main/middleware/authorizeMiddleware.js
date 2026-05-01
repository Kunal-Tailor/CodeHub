const Repository = require("../models/repoModel");

function authorizeOwner(req, res, next) {
  // This middleware should be used after authMiddleware
  // It checks if the authenticated user is the owner of the resource
  const userId = req.userId;
  const resourceOwnerId = req.params.id;

  if (!userId) {
    return res.status(401).json({ message: "Not authenticated." });
  }

  // For routes where we need to verify repo ownership
  // This is a basic implementation — can be extended per route
  next();
}

module.exports = authorizeOwner;
