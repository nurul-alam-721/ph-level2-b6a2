import { pool } from "../../config/db";


const getUsers = async () => {
  const result = await pool.query(`
    SELECT * FROM users
    `);
  return result;
};

export const userServices = {
  getUsers
};
