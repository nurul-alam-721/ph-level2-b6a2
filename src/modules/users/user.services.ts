import { pool } from "../../config/db";

const getUsers = async () => {
  const result = await pool.query(`
    SELECT * FROM users
    `);
  return result;
};


const updateUser = async (
  name: string,
  email: string,
  phone: string,
  role: string | undefined,
  id: string
) => {
  const result = await pool.query(
    `UPDATE users
     SET name = $1,
         email = $2,
         phone = $3,
         role = COALESCE($4, role) 
     WHERE id = $5
     RETURNING *`,
    [name, email, phone, role, id]
  );

  return result;
};





const deleteUser = async (id: string) => {
  const activeBookings = await pool.query(
    `SELECT id FROM bookings WHERE customer_id=$1 AND status='active'`,
    [id]
  );

  if (activeBookings.rows.length > 0) {
    return { deletable: false, result: null };
  }

  const result = await pool.query(
    `DELETE FROM users WHERE id=$1 RETURNING *`,
    [id]
  );

  return { deletable: true, result };
};


export const userServices = {
  getUsers,
  deleteUser,
  updateUser
};
