import nodemailer from 'nodemailer'
 
// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "devesh262004@gmail.com",
    pass: 'albv ucrb inip uoxw',
  },
});


export default transporter