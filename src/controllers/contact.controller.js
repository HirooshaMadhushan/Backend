import { prisma } from "../config/db.js";
import { sendEmail } from "../email/email.service.js";

export const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const contactMessage = await prisma.contactMessage.create({
      data: { name, email, subject, message },
    });

    const html = `
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

    await sendEmail(process.env.EMAIL_USER, `New Contact Message: ${subject}`, html);

    res.status(201).json({ message: "Your message has been sent successfully!", contactMessage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to submit message." });
  }
};
