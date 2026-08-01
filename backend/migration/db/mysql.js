import mysql from "mysql2/promise";

// Read-only connection to the Magento source DB. Credentials come purely
// from environment variables — nothing is hardcoded.
export async function createMysqlPool() {
  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 5,
    charset: "utf8mb4",
  });

  // Fail fast with a clear message if the DB is unreachable.
  const conn = await pool.getConnection();
  await conn.ping();
  conn.release();

  return pool;
}
