import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';
import { logger } from '../../lib/logger';
import fetch from 'node-fetch';
import { buildEmailHTML } from '../../lib/emailTemplate';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const FILE_PATH = path.join(DATA_DIR, 'submissions.json');

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retrySend<T>(fn: () => Promise<T>, attempts = 3, backoff = 300) {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      const wait = backoff * Math.pow(2, i);
      await delay(wait);
    }
  }
  throw lastErr;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, email, phone, service, message, consent } = body;

    const errors: string[] = [];
    if (!name || String(name).trim().length < 2) errors.push('name');
    if (!email || !validateEmail(String(email))) errors.push('email');
    if (!message || String(message).trim().length < 5) errors.push('message');
    if (consent !== true && consent !== 'true') errors.push('consent');

    if (errors.length) {
      return new Response(JSON.stringify({ success: false, errors }), {
        status: 400,
      });
    }

    const submission = {
      id: Date.now(),
      name: String(name).trim(),
      email: String(email).trim(),
      phone: phone ? String(phone).trim() : null,
      service: service ? String(service).trim() : null,
      message: String(message).trim(),
      consent: true,
      createdAt: new Date().toISOString(),
    };

    // Ensure data directory exists — best-effort persistence to local file for demo
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      const exists = await fs
        .stat(FILE_PATH)
        .then(() => true)
        .catch(() => false);
      if (!exists) {
        await fs.writeFile(
          FILE_PATH,
          JSON.stringify([submission], null, 2),
          'utf-8'
        );
      } else {
        const raw = await fs.readFile(FILE_PATH, 'utf-8');
        const arr = JSON.parse(raw || '[]');
        arr.push(submission);
        await fs.writeFile(FILE_PATH, JSON.stringify(arr, null, 2), 'utf-8');
      }
    } catch (e) {
      // If file system is not writable (e.g., some serverless providers), log the issue
      logger.warn({ msg: 'Failed to persist contact submission to local file', error: String(e) });
    }

    // Optionally notify via SMTP or Telegram if environment variables are present
    (async () => {
      try {
        // SMTP
        if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
          try {
            const nodemailer = await import('nodemailer');
            const transporter = nodemailer.createTransport({
              host: process.env.SMTP_HOST,
              port: Number(process.env.SMTP_PORT) || 587,
              secure: (process.env.SMTP_SECURE || 'false') === 'true',
              auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
              },
            });

            const send = async () =>
              transporter.sendMail({
                from: process.env.SMTP_FROM || process.env.SMTP_USER,
                to: process.env.CONTACT_TO || process.env.SMTP_USER,
                subject: `New contact from ${submission.name}`,
                text: `${submission.name} <${submission.email}>\n\n${submission.message}`,
                html: buildEmailHTML(submission),
              });

            await retrySend(send, 3);
            logger.info({ msg: 'Sent contact via SMTP', to: process.env.CONTACT_TO || process.env.SMTP_USER });
          } catch (e) {
            logger.warn({ msg: 'SMTP send failed', error: String(e) });
          }
        }

        // Telegram
        if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
          try {
            const token = process.env.TELEGRAM_BOT_TOKEN;
            const chatId = process.env.TELEGRAM_CHAT_ID;
            const text = `New contact from ${submission.name}\n${submission.email}\n\n${submission.message}`;
            const url = `https://api.telegram.org/bot${token}/sendMessage`;
            await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ chat_id: chatId, text }),
            });
            logger.info({ msg: 'Sent contact via Telegram', chatId });
          } catch (e) {
            logger.warn({ msg: 'Telegram send failed', error: String(e) });
          }
        }
      } catch (e) {
        logger.warn({ msg: 'Notification send task failed', error: String(e) });
      }
    })();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    logger.error({ msg: 'Contact API unexpected error', error: String(err) });
    return new Response(JSON.stringify({ success: false }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
