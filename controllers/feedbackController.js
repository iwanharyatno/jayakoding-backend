const nodemailer = require('nodemailer');

exports.sendFeedback = async (req, res) => {
    const { name, email, message } = req.body || {};

    if (!name || !email || !message) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Create a transporter object using SMTP transport
    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Email content
    const mailOptions = {
        from: `"${name}" <${process.env.EMAIL_FROM}>`, // sender address
        to: process.env.EMAIL_TO, // list of receivers
        subject: 'New Feedback from Website', // Subject line
        text: `You have received a new feedback from:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`, // plain text body
        html: `<p>You have received a new feedback from:</p>
               <ul>
                 <li><strong>Name:</strong> ${name}</li>
                 <li><strong>Email:</strong> ${email}</li>
               </ul>
               <p><strong>Message:</strong></p>
               <p>${message}</p>`, // html body
    };

    try {
        // Send mail
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Feedback sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send feedback' });
    }
};
