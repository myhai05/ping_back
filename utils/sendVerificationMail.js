const { createMailTransporter } = require('./createMailTransporter');

const sendValidationEmail = async (user,token) => {

    const transporter = createMailTransporter();

    try {
        const url = `${process.env.REACT_APP_API_URL}api/verify-email?token=${token}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Email Verification',
            text: `Please click the following link to verify your email: ${url}`,
        };

        // Envoyer l'e-mail
        transporter.sendMail(mailOptions, () => { 
            res.status(200).send(`A verification email has been sent to ${user.email}`);
        });

    } catch (error) {
        res.status(500).send({ message: 'Failed to send verification email' });
    }
};

module.exports = { sendValidationEmail };
