import dotenv from "dotenv";
dotenv.config();

const emailJsConfig = {
    serviceId: process.env.EMAILJS_SERVICE_ID?.trim() || "service_5ebkser",
    publicKey: process.env.EMAILJS_PUBLIC_KEY?.trim() || "Ycvmhl1Cy2EvkoZoA",
    privateKey:
        process.env.EMAILJS_PRIVATE_KEY?.trim() || "GF5StrWefzSnFvvrcnnYG",
    confirmTemplateId: process.env.EMAILJS_CONFIRM_TEMPLATE_ID?.trim() || "",
    cancelTemplateId: process.env.EMAILJS_CANCEL_TEMPLATE_ID?.trim() || "",
};

const verifyMailerConnection = async () => {
    const missingKeys = [];
    if (!emailJsConfig.serviceId) missingKeys.push("EMAILJS_SERVICE_ID");
    if (!emailJsConfig.publicKey) missingKeys.push("EMAILJS_PUBLIC_KEY");
    if (!emailJsConfig.privateKey) missingKeys.push("EMAILJS_PRIVATE_KEY");

    if (missingKeys.length > 0) {
        console.error(
            `EmailJS config missing required keys: ${missingKeys.join(", ")}`
        );
        return;
    }

    console.log(`EmailJS ready for service ${emailJsConfig.serviceId}`);
    if (!emailJsConfig.confirmTemplateId || !emailJsConfig.cancelTemplateId) {
        console.warn(
            "EmailJS template ids are missing. Set EMAILJS_CONFIRM_TEMPLATE_ID and EMAILJS_CANCEL_TEMPLATE_ID to send emails."
        );
    }
};

export { verifyMailerConnection, emailJsConfig };