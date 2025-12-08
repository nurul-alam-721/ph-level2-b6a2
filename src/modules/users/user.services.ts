
import bcrypt from 'bcrypt';
import { pool } from '../../config/db';

const createUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, role, phone} = payload;

  const hashedPassword = await bcrypt.hash(password as string, 10);

  const result = await pool.query(
    `INSERT INTO users(name, email, password, role, phone) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [name, email, hashedPassword, role, phone]
  );
  return result;
};

export const userSevices = {
  createUser
}
