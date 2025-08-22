import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

export const requireAuth = ClerkExpressRequireAuth({
  onError: (error) => {
    console.error("Auth error:", error);
  },
});

export const extractUserId = (req, res, next) => {
  if (req.auth && req.auth.userId) {
    req.userId = req.auth.userId;
    next();
  } else {
    res.status(401).json({ error: "Unauthorized - No user ID found" });
  }
};
