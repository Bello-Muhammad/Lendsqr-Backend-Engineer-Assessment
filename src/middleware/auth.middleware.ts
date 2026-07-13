import type { Request, Response, NextFunction } from "express";
import { db } from "../database/database";

export async function fauxAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. Faux authorization token missing." });
  }

  const userIdStr = authHeader.split(" ")[1];

  if(!userIdStr) {
    return res.status(401).json({ error: "Access denied. Faux authorization token missing." });
  }
  
  try {
    const user = await db("users").where({ id: parseInt(userIdStr, 10) }).first();
    if (!user) {
      return res.status(401).json({ error: "Invalid auth credentials context." });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ error: "Authentication system failure." });
  }
}