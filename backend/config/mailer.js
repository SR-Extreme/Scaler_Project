import dotenv from "dotenv";
dotenv.config(); //loads .env variables into process.env

import nodemailer from "nodemailer";
import dns from "node:dns";

dns.setDefaultResultOrder("ipv4first");

const mailHost = process.env.EMAIL_HOST?.trim() || "smtp.gmail.com";
const mailPort = Number(process.env.EMAIL_PORT) || 465;
const mailSecure =
    process.env.EMAIL_SECURE?.trim() === "true" || mailPort === 465;

const transporter = nodemailer.createTransport({
    host: mailHost,
    port: mailPort,
    secure: mailSecure,
    // Render instances often don't have working IPv6 egress for SMTP.
    lookup: (hostname, options, callback) => {
        dns.lookup(hostname, { ...options, family: 4, all: false }, callback);
    },
    auth: {
        user: process.env.EMAIL_USER?.trim(),
        pass: process.env.EMAIL_PASSWORD?.trim(),
    },
    tls: {
        // Explicit servername helps some cloud providers during TLS handshake.
        servername: mailHost,
    },
    connectionTimeout: Number(process.env.EMAIL_CONNECTION_TIMEOUT_MS) || 15000,
    greetingTimeout: Number(process.env.EMAIL_GREETING_TIMEOUT_MS) || 10000,
    socketTimeout: Number(process.env.EMAIL_SOCKET_TIMEOUT_MS) || 20000,
});

const verifyMailerConnection = async () => {
    try {
        await transporter.verify();
        console.log(`SMTP ready on ${mailHost}:${mailPort} (secure=${mailSecure})`);
    } catch (error) {
        console.error(
            `SMTP verify failed on ${mailHost}:${mailPort} (secure=${mailSecure})`,
            error.message
        );
    }
};

export { verifyMailerConnection };
export default transporter;