import { sendEmail } from "./src/helpers/sendEmail.js";

sendEmail(
  "ruloagusto@gmail.com.com", // reemplazalo con tu correo real
  "Correo de prueba desde Brevo",
  "<h1>¡Funciona Brevo!</h1><p>Este es un correo de prueba usando Nodemailer con Brevo SMTP.</p>"
);
