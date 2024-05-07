import pg from "pg";
const { Pool } = pg;

let poolInstance: pg.Pool | null = null;
let connectedDatabase: string | null = null;

export const getPool = (databaseName: string): pg.Pool => {
    if (!poolInstance || connectedDatabase !== databaseName) {
        const host = process.env.PG_HOST as string;
        const user = process.env.PG_USER as string;
        const password = process.env.PG_PASSWORD as string;
        const database = databaseName;

        poolInstance = new Pool({
            host,
            port: 5432,
            user,
            password,
            database
        });
    }

    return poolInstance;
}

let connected = false

const pgConn = async (databaseName: string) => {
    if (connected && connectedDatabase === databaseName) {
        console.log('PostgreSQL is already connected.');
        return connected
    }

    try {
        const pool = getPool(databaseName);
        const client = await pool.connect();
        connected = true;
        client.release();
        console.log('PostgreSQL connected...');
    } catch (error) {
        console.log('error while connecting to the PostgreSQL', error);
    }
    return connected;
}

export default pgConn;