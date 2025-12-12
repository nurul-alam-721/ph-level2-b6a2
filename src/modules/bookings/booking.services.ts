import { pool } from "../../config/db";

const isVehicleAvailable = async (
  vehicle_id: number,
  start_date: string,
  end_date: string
) => {
  const result = await pool.query(
    `SELECT * FROM bookings 
     WHERE vehicle_id = $1 
       AND status = 'active' 
       AND NOT (rent_end_date <= $2 OR rent_start_date >= $3)`,
    [vehicle_id, start_date, end_date]
  );
  return result.rowCount === 0;
};

const calculateTotalPrice = async (
  vehicle_id: number,
  start_date: string,
  end_date: string
) => {
  const vehicle = await pool.query(
    `SELECT daily_rent_price FROM vehicles WHERE id = $1`,
    [vehicle_id]
  );
  const rate = vehicle.rows[0].daily_rent_price;

  const start = new Date(start_date);
  const end = new Date(end_date);
  const days = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  const totalPrice = rate * days;

  return totalPrice;
};
const updateVehicleStatus = async (vehicle_id: number, availability_status: string) => {
  await pool.query(`UPDATE vehicles SET availability_status = $1 WHERE id = $2`, [
    availability_status,
    vehicle_id,
  ]);
};

const createBooking = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } =
    payload as {
      customer_id: number;
      vehicle_id: number;
      rent_start_date: string;
      rent_end_date: string;
    };

  const available = await isVehicleAvailable(
    vehicle_id,
    rent_start_date,
    rent_end_date
  );
  if (!available) {
    throw new Error("Vehicle is not available for the selected dates.");
  }

  const total_price = await calculateTotalPrice(
    vehicle_id,
    rent_start_date,
    rent_end_date
  );

  const result = await pool.query(
    `INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
     VALUES($1, $2, $3, $4, $5, 'active') RETURNING *`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
  );

  await updateVehicleStatus(vehicle_id, "booked");

  return result;
};

const getAllBookings = async () => {
  return await pool.query(`
    SELECT * FROM bookings
  `);
};

const getBookingsByCustomer = async (customerId: number) => {
  return await pool.query(`SELECT * FROM bookings WHERE customer_id = $1`, [
    customerId,
  ]);
};

const getSingleBooking = async (id: string) => {
  return await pool.query(`SELECT * FROM bookings WHERE id = $1`, [id]);
};

const cancelBooking = async (id: string) => {
  return await pool.query(`
    UPDATE bookings
    SET status = 'cancelled'
    WHERE id = $1
      AND status = 'active'
      AND rent_start_date > NOW()
    RETURNING *
  `, [id]);
};


const makeVehicleAvailable = async (vehicleId: number) => {
  return await pool.query(
    `UPDATE vehicles 
     SET availability_status = 'available' 
     WHERE id = $1`,
    [vehicleId]
  );
};

const markReturned = async (bookingId: string, vehicleId: number) => {
  const bookingUpdate = await pool.query(
    `UPDATE bookings
     SET status='returned'
     WHERE id=$1 RETURNING *`,
    [bookingId]
  );

  await pool.query(
    `UPDATE vehicles
     SET availability_status='available'
     WHERE id=$1`,
    [vehicleId]
  );

  return bookingUpdate;
};



const autoReturnFinishedBookings = async () => {
  const { rows } = await pool.query(`
    SELECT id, vehicle_id 
    FROM bookings
    WHERE status = 'active'
      AND rent_end_date < NOW()
  `);

  for (const booking of rows) {
    await markReturned(booking.id, booking.vehicle_id);
  }
};



export const bookingServices = {
  createBooking,
  getAllBookings,
  getBookingsByCustomer,
  getSingleBooking,
  cancelBooking,
  markReturned,
  makeVehicleAvailable,
  autoReturnFinishedBookings,
};
