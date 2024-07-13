import { allowedOrigins } from "./allowedOrigins";

const corsOptions = {
    origin: (origin: string | undefined, callback: (arg0: Error | null, arg1: boolean | undefined) => void) => {
        if (allowedOrigins.indexOf(origin as string) !== -1 || !origin) {
            callback(null, true);
            console.log('cors allowed');
        } else {
            callback(new Error('Not allowed by CORS'), false);
            console.log('cors not allowed');
        }
    },
    optionsSuccessStatus: 200
}

export { corsOptions };