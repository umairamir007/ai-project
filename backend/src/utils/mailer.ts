import nodemailer from "nodemailer";

// HARD-CODED FOR TESTING ONLY
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "eb20103087.minhajwahid@gmail.com",
    pass: "ietw vjjc yicc gxjs", // Gmail App Password
  },
});

export const sendMail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  try {
    await transporter.sendMail({
      from: `Isai <eb20103087.minhajwahid@gmail.com>`, // FROM is also hard-coded
      to,
      subject,
      html,
    });

    console.log("Email sent successfully!");
  } catch (err) {
    console.error("Email error:", err);
    throw new Error("Failed to send email");
  }
};
