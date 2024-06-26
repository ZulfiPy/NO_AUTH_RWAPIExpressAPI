import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
    const cookies = req?.cookies;
    console.log('here I am with the cookies', cookies)
    if (!cookies['next-auth.session-token']) {
        console.log('i return 401')
        return res.status(401).json({ "message": "unauthorized - no session token" });
    }
    const nextAuthSessionToken: string = cookies['next-auth.session-token'];
    jwt.verify(
        nextAuthSessionToken,
        process.env.NEXTAUTH_SECRET as string,
        async (error, decoded) => {
            if (error) {
                console.log('error occured', error);
                return res.status(401).json({ "message": "unauthorized - expired/misused/invalid sigranutre" });
            }
            next();
        }
    )
}

export default verifyJWT;