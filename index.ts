import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { corsOptions } from "./src/config/corsOptions";
import { credentials } from "./src/middleware/credentials";
import cookieParser from "cookie-parser";
import verifyJWT from "./src/middleware/verifyJWT";

import tasksRouter from "./src/routes/api/tasks";
import customersRouter from "./src/routes/api/customers";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;


// set 'Access-Control-Allow-Credentials' middleware
app.use(credentials);

// CORS - Cross-Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

// built-in middleware for json
app.use(express.json())

// middleware for parsin cookies
app.use(cookieParser())

// jwt verify middleware
app.use(verifyJWT)

// routes
// API routes protected with passport.js authentication and isAuthorized custom middleware
app.use('/api/tasks', tasksRouter);
app.use('/api/customers', customersRouter);

app.listen(port, async () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});