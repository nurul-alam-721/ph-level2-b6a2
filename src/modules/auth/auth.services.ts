import { pool } from "../../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../config";

const signUpUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, role, phone } = payload;

  const hashedPassword = await bcrypt.hash(password as string, 10);

  const result = await pool.query(
    `INSERT INTO users(name, email, password, role, phone) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [name, email, hashedPassword, role, phone]
  );
  return result;
};

const loginUser = async (email: string, password: string) => {
  const result = await pool.query(
    `
  SELECT * FROM users WHERE email = $1
  `,
    [email]
  );
  if (result.rows.length === 0) {
    return null;
  }

  const user = result.rows[0];
  const isPassMatched = await bcrypt.compare(password, user.password);
  if (!isPassMatched) {
    return null;
  }
 const token = jwt.sign(
  { id: user.id, name: user.name, email: user.email, role: user.role },
  config.jwt_secret as string,
  { expiresIn: "7d" }
);
  return { user, token };
};




export const authServices = {
  loginUser,
  signUpUser
};
