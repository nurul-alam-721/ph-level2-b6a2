import config from ".";
import {Pool} from 'pg';

export const pool = new Pool({
  connectionString: `${config.connection_str}`
})

const initDB = async()=>{
  try{
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE CHECK (email = lower(email)) NOT NULL,
      password TEXT NOT NULL,
      phone VARCHAR(15) NOT NULL,
      role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'customer'))
      )
      `)

      await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles(
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(150) NOT NULL,
        type VARCHAR(50) CHECK (type IN ('car', 'bike', 'van', 'SUV')),
        registration_number VARCHAR(100) UNIQUE NOT NULL,
        daily_rent_price NUMERIC CHECK (daily_rent_price > 0),
        availability_status VARCHAR(50) CHECK (availability_status IN ('available', 'booked'))
        )
      `)

  }
  catch(err:any){
    return err.message;
  }
}

export default initDB;