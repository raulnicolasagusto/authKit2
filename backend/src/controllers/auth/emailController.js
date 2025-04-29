import  sendEmail  from "../../helpers/sendEmail.js"; // ← CORRECTO


export const testEmail = async (req, res) => {
  try {
    await sendEmail(
      "ruloagusto@gmail.com", // reemplazalo por tu correo real
      "Correo de prueba desde /api/test-email",
      "<h2>¡Hola!</h2><p>Este es un correo de prueba desde el endpoint /api/test-email.</p>"
    );

    res.status(200).json({ message: "Correo enviado correctamente" });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res.status(500).json({ message: "Error al enviar el correo" });
  }
};
