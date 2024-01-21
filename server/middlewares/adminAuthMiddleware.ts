import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/userModel";
import { NextFunction, Request, Response } from "express";

interface User {
  userId: any;
}

declare global {
  namespace Express {
    interface Request {
      userId?: User;
    }
  }
}

const adminProtect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    let token;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
    if (token) {
      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET_KEY as string
        ) as JwtPayload;

        // const che=await User.findById(decoded?.userId ).select('-password')
        // const userId = decoded?.userId;
        // req.userId=userId
        next();
      } catch (error) {
        res.status(401);
        throw new Error("Not authorized,invalid token");
      }
    } else {
      res.status(401);
      throw new Error("Not authorized,no token");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Error");
  }
};

export { adminProtect };
