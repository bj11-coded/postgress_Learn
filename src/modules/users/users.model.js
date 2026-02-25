import { pool } from "../../../config/db.js";

const createTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(225) NOT NULL,
      email VARCHAR(225) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) NOT NULL DEFAULT 'employee' CHECK (role IN ('admin', 'employee', 'intern')),
      gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female', 'other')),
      status BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) 
  `;

  await pool
    .query(query)
    .then(() => console.log("Table created successfully"))
    .catch((err) => console.log(err));
};

createTable();

const create = async (name, email, password, role, gender, status) => {
  const result = await pool.query(
    `
    INSERT INTO users (name, email, password, role, gender, status)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `,
    [name, email, password, role, gender, status],
  );
  return result.rows[0];
};

const getUserById = async (id) => {
  const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
  return result.rows[0];
};

const updateUser = async (id, name, email, gender) => {
  const result = await pool.query(
    `
    UPDATE users
    SET name = $2,email = $3,gender = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $1
    RETURNING *
    `,
    [id, name, email, gender],
  );
  return result.rows[0];
};

const deleteUser = async (id) => {
  const result = await pool.query(
    `
    DELETE FROM users
    WHERE id = $1
    RETURNING *
    `,
    [id],
  );
  return result.rows[0];
};

const getAll = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result.rows;
};

const getEmail = async (email) => {
  const result = await pool.query(
    `
        SELECT * FROM users WHERE email = $1`,
    [email],
  );
  return result.rows[0];
};

export default {
  create,
  getUserById,
  updateUser,
  deleteUser,
  getAll,
  getEmail,
};
