import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

export const pool = new Pool({
   host: process.env.DB_HOSTNAME,
   port: process.env.DB_PORT,
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_DATABASE_NAME
})

export const connectDB = async() =>{
    try {
        await pool.connect()
        console.log("Database connected successfully")
    } catch (error) {
        console.log("Database connection failed", error)
    }
}


