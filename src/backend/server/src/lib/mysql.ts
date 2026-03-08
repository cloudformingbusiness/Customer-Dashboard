/**
 * MySQL Client – FlowTecsMedia
 * Alternative zu Supabase für selbst-gehostete MySQL Datenbank
 *
 * Verwendung: DB_TYPE=mysql in .env setzen
 */

import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host:     process.env.MYSQL_HOST     || 'localhost',
  port:     Number(process.env.MYSQL_PORT) || 3306,
  database: process.env.MYSQL_DATABASE || 'flowtecsm',
  user:     process.env.MYSQL_USER     || 'flowtecsm',
  password: process.env.MYSQL_PASSWORD || 'secret',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00',
})

/** Verbindung testen */
export async function testConnection(): Promise<void> {
  const conn = await pool.getConnection()
  await conn.ping()
  conn.release()
  console.log('✓ MySQL Verbindung erfolgreich')
}

/** Query ausführen */
export async function query<T = unknown>(
  sql: string,
  params?: unknown[]
): Promise<T[]> {
  const [rows] = await pool.execute(sql, params)
  return rows as T[]
}

/** Einzelne Zeile abrufen */
export async function queryOne<T = unknown>(
  sql: string,
  params?: unknown[]
): Promise<T | null> {
  const rows = await query<T>(sql, params)
  return rows[0] ?? null
}

/** Insert und ID zurückgeben */
export async function insert(
  sql: string,
  params?: unknown[]
): Promise<number> {
  const [result] = await pool.execute(sql, params) as any
  return result.insertId
}

export default pool
