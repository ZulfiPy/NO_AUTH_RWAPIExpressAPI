import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config()

export const usersTable = pgTable('users', {
    id: text("id").primaryKey(),
    username: text("username").notNull().unique(),
    password: text("password").notNull(),
    firstname: text("firstname").notNull(),
    lastname: text("lastname").notNull(),
    birth_date: timestamp("birth_date").notNull(),
    personal_id_code: text("personal_id_code").notNull().unique(),
    email: text("email").notNull().unique(),
});

export const sessionsTable = pgTable('sessions', {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
    userId: text("user_id").references(() => usersTable.id).notNull()
});

const client = postgres(process.env.AUTH_DATABASE_URL as string);
export const db = drizzle(client);