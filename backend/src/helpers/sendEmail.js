import SibApiV3Sdk from 'sib-api-v3-sdk';
import dotenv from 'dotenv';
dotenv.config();

const sendEmail = async (to, subject, html) => {
  try {
    const client = SibApiV3Sdk.ApiClient.instance;
    const apiKey = client.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY; // Usa variable de entorno

    const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();
    
    const response = await tranEmailApi.sendTransacEmail({
      sender: {
        email: 'no-reply@authkit.com', // Puedes usar cualquier correo
        name: 'AuthKit Team'
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    });

    console.log('Email ID:', response.messageId);
    return true;
  } catch (error) {
    console.error('Error completo:', {
      status: error.status,
      message: error.message,
      response: error.response?.text,
    });
    throw new Error('Failed to send email');
  }
};

export default sendEmail;
// nueva api key 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
// import nodeMailer from "nodemailer";
// import path from "path";
// import dotenv from "dotenv";
// import hbs from "nodemailer-express-handlebars";
// import { fileURLToPath } from "node:url";

// dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const sendEmail = async (subject, send_to, send_from, reply_to, template, name, url) => {
//     const transporter = nodeMailer.createTransport({
//         host: process.env.EMAIL_HOST,
//         port: parseInt(process.env.EMAIL_PORT) || 587,
//         secure: false,
//         auth: {
//             user: process.env.USER_EMAIL,
//             pass: process.env.EMAIL_PASS,
//         },
//     });

//     const handlebatsOptions = {
//         viewEngine: {
//             extName: ".hbs",
//             partialsDir: path.resolve(__dirname, "../views"),
//             defaultLayout: false,
//         },
//         viewPath: path.resolve(__dirname, "../views"),
//         extName: ".hbs",
//     };

//     transporter.use("compile", hbs(handlebatsOptions));

//     const mailOptions = {
//         from: send_from,
//         to: send_to,
//         subject: subject,
//         template: template,
//         context: {
//             name: name,
//             url: url,
//         },
//     };

//     try {
//         const info = await transporter.sendMail(mailOptions);
//         console.log("Email enviado: " + info.response);
//         return info;
//     } catch (error) {
//         console.log("Error al enviar el email: " + error.message);
//         throw new Error("Error al enviar el email");
//     }
// };

// export default sendEmail;


//PRIMER INTENTO CON OUTLOOK NO FUNCIONO
// import nodeMailer from "nodemailer";
// import path from "path";
// import dotenv from "dotenv";
// import hbs from "nodemailer-express-handlebars";
// import { fileURLToPath } from "node:url";

// dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const sendEmail = async (
//     subjetc,
//     send_to,
//     send_from,
//     reply_to,
//     template,
//     name,
//     url
// ) => {
//     const transporter = nodeMailer.createTransport({
//        service: "Outlook365",
//        host: "smtp.office365.com",
//        port: 587,
//        secure: false,
//        auth: {
//            user: process.env.USER_EMAIL,
//            pass: process.env.EMAIL_PASS,
//        },
//        tls:{
//         ciphers: "SSLv3",
//        }
//     });

//     const handlebatsOptions = {
//         viewEngine: {
//             extName: ".hbs",
//             partialsDir: path.resolve(__dirname, "../views"),
//             defaultLayout: false,
//         },
//         viewPath: path.resolve(__dirname, "../views"),
//         extName: ".hbs",
//     };
//     transporter.use("compile", hbs(handlebatsOptions));
//     const mailOptions = {
//         from: send_from,
//         to: send_to,
//         subject: subjetc,
//         template: template,
//         context: {
//             name: name,
//             url: url,
//         },
//     };

//     try {
//         const info = await transporter.sendMail(mailOptions);
//         console.log("Email enviado: " + info.response);
//         return info;
//     } catch (error) {
//         console.log("Error al enviar el email: " + error.message);
//         throw new Error("Error al enviar el email");
//     }
// };

// export default sendEmail;

//min 2:15:00

//email verification code: TDWZN-EXT9L-7TX95-HWVSM-R5H9D
//contraseña de aplicacion: oejtdpmvwiecysjp