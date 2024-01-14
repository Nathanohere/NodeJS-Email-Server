const express = require('express');
const dotenv = require('dotenv');
const Mailgen = require('mailgen');
const nodemailer = require('nodemailer');

const morgan = require('morgan');

// const sendEmail = require('./mail');

dotenv.config({ path: './config.env' });

const app = express();

app.use(express.json());

app.use(morgan('dev'));

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const mailGenerator = new Mailgen({
  theme: 'default',
  product: {
    name: 'Mailgen',
    link: 'https://mailgen.js/',
  },
});

app.post('/send-email', (req, res) => {
  try {
    const { to, name, message } = req.body;

    const email = {
      body: {
        name: name,
        intro: message || "Welcome! We're very excited to have you on board.",
        action: {
          button: {
            color: '#22BC66', // Optional action button color
            text: 'Confirm your account',
            link: 'https://mailgen.js/confirm?s=d9729feb74992cc3482b350163a1a010',
          },
        },
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };

    const emailbody = mailGenerator.generate(email);

    // require('fs').writeFileSync('preview.html', emailbody, 'utf8');
    const mailOptions = {
      from: 'Nathan Ohere <nathanohere@gmail.com>',
      to: to,
      subject: 'This is a test email',
      html: emailbody,
    };

    transporter.sendMail(mailOptions);

    res.status(200).json({
      status: 'success',
      message: 'Token sent successfully',
    });
  } catch (error) {
    console.log(error);
  }
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
