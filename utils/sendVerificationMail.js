const { createMailTransporter } = require('./createMailTransporter');
const crypto = require('crypto');




const sendValidationEmail = async (user, req, res) => {

    const transporter = createMailTransporter();

    const token = crypto.randomBytes(16).toString('hex');

    user.emailToken = token;
    user.emailTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // Token expires in 24 hours

    try {
        // Sauvegarder les modifications dans la base de données
        await user.save();

        // Construire l'URL de vérification
        const url = `${process.env.REACT_APP_API_URL}api/verify-email?token=${token}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Email Verification',
            text: `Please click the following link to verify your email: ${url}`,
            //text: 'Please click the following link to verify your email',
        };

        // Envoyer l'e-mail
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error('Error sending email:', err);
                return res.status(500).send({ message: 'Technical Issue! Please click on resend for verify your Email.' });
            }
            res.status(200).send(`A verification email has been sent to ${user.email}. It will expire after one day. If you do not receive the verification email, click on resend token.`);
        });

    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).send({ message: 'Failed to send verification email' });
    }
};

module.exports = { sendValidationEmail };
