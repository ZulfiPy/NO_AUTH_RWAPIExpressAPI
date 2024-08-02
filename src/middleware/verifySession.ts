import { Request, Response, NextFunction } from "express";
import { db, usersTable, sessionsTable } from "../lib/db";
import { eq } from "drizzle-orm";

declare module "express" {
    interface Request {
        username?: string
    }
}

const verifySession = async (req: Request, res: Response, next: NextFunction) => {
    const cookies = req?.cookies;
    if (!cookies['auth_session']) {
        console.log("i return 401, because I don't have cookies")
        return res.status(401).json({ "message": "unauthorized - no session token" });
    }
    const authSession: string = cookies['auth_session'];
    console.log('cookie persists')
    const sessionDBResponse = await db.select().from(sessionsTable).where(eq(sessionsTable.id, authSession));
    const session = sessionDBResponse[0];

    const userDBResponse = await db.select().from(usersTable).where(eq(usersTable.id, session.userId));
    const user = userDBResponse[0];

    if (!session && !user) {
        console.log('session or user not found in db, verifySession check not passed');
        return res.status(401).json({ 'message': 'unauthorized - expires/misused/invalid signature' });
    }
    console.log('session and user found in db, verifySession check passed');
    req.username = user.username;
    next();
}

export default verifySession;