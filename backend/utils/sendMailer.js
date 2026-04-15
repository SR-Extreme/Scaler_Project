import emailjs from "@emailjs/nodejs";
import { emailJsConfig } from "../config/mailer.js";

const buildTemplateParams = (name, email, date, start_time, end_time) => ({
  name,
  email,
  date,
  start_time,
  end_time,
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