import emailjs from "@emailjs/nodejs";
import { emailJsConfig } from "../config/mailer.js";

const buildTemplateParams = (name, email, date, start_time, end_time) => ({
  // Primary keys
  name: String(name ?? ""),
  email: String(email ?? ""),
  date: String(date ?? ""),
  start_time: String(start_time ?? ""),
  end_time: String(end_time ?? ""),

  // Common aliases used in EmailJS templates
  user_name: String(name ?? ""),
  user_email: String(email ?? ""),
  booking_date: String(date ?? ""),
  startTime: String(start_time ?? ""),
  endTime: String(end_time ?? ""),
});

const sendEmailJsTemplate = async (templateId, templateParams) => {
  if (!templateId) {
    throw new Error(
      "EmailJS template id is not configured. Please set EMAILJS template ids in backend .env."
    );
  }

  await emailjs.send(
    emailJsConfig.serviceId,
    templateId,
    templateParams,
    {
      publicKey: emailJsConfig.publicKey,
      privateKey: emailJsConfig.privateKey,
    }
  );
};

const sendMailerConfirm = async (name, email, date, start_time, end_time) => {
  const templateParams = buildTemplateParams(
    name,
    email,
    date,
    start_time,
    end_time
  );
  await sendEmailJsTemplate(emailJsConfig.confirmTemplateId, templateParams);
};

const sendMailerCancel = async (name, email, date, start_time, end_time) => {
  const templateParams = buildTemplateParams(
    name,
    email,
    date,
    start_time,
    end_time
  );
  await sendEmailJsTemplate(emailJsConfig.cancelTemplateId, templateParams);
};

export { sendMailerConfirm, sendMailerCancel };