import { sql, type SQLWrapper } from "drizzle-orm";

export function containsInsensitive(column: SQLWrapper, value: string) {
  return sql`lower(${column}) like ${`%${value.toLowerCase()}%`}`;
}

export function isUniqueConstraintError(message: string) {
  return (
    message.includes("UNIQUE constraint failed") ||
    message.includes("duplicate key value violates unique constraint")
  );
}

export function isForeignKeyConstraintError(message: string) {
  return (
    message.includes("FOREIGN KEY constraint failed") ||
    message.includes("violates foreign key constraint")
  );
}
