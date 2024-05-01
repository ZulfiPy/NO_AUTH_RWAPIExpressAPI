import { allowedOrigins } from "./allowedOrigins";

const corsOptions = {
    origin: (origin: string | undefined, callback: (arg0: Error | null, arg1: boolean | undefined) => void) => {
        if (allowedOrigins.indexOf(origin as string) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'), false);
        }
    },
    optionsSuccessStatus: 200
}

export { corsOptions };