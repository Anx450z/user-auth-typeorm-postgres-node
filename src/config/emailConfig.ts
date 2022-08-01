import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

dotenv.config()

export let transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT!) as number,
  secure: true, // true for port 465, false for others
  // service: process.env.SERVICE,
  auth: {
    user: process.env.EMAIL_USER, // Admin email id
    pass: process.env.EMAIL_PASS, // Admin email password
  },
})
