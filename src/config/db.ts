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

  }
  catch(err:any){
    return err.message;
  }
}

export default initDB;