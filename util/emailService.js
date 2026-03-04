const { text } = require("body-parser");
const nodemailer = require("nodemailer");

const createTransporter = () => {
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASSWORD
        }
    });
}

const emailLayout = (otp) => {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>Hello,</h1>
    <P>Welcome to my home listing app</P>
    <P>Use this verification code to complete your signUp </P>
    <p>Your verification code is: ${otp}</p>
</body>
</html>`;
}


const sendEmail = async (email, otp) => {
    const transporter = createTransporter()
    const mailOptions = {
        from: {
            name: "Home Listing App",
            address: ""
        },
        to: email,
        subject: "Verification Code",
        text: "verify your account",
        html: emailLayout(otp)
    }
    try {
        const emailSend = await transporter.sendMail(mailOptions)
        console.log("email sent successfully");
        return {success: true, messageId: emailSend.messageId}
        
    } catch (e) {
        console.log("error sending email",e);
    }
}

module.exports = {sendEmail}