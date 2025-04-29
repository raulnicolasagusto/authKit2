import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT), // 587
      secure: false, // true para 465, false para 587
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"AuthKit" <${process.env.USER_EMAIL}>`,
      to, // destino
      subject,
      html, // cuerpo en HTML
    });

    console.log("Correo enviado:", info.messageId);
  } catch (error) {
    console.error("Error al enviar el email:", error);
    throw new Error("No se pudo enviar el email");
  }
};

export default sendEmail;


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