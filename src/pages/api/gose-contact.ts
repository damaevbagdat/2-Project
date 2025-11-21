import type { APIRoute } from 'astro';

// Bot token and chat ID - moved to server-side for security
const TELEGRAM_BOT_TOKEN = '8595746534:AAHsGgCTkU0eGYZApC4RGxQknzd3xd3NVO8';
const TELEGRAM_CHAT_ID = '8102988635';

// Cloudflare Turnstile secret key - REPLACE WITH YOUR SECRET KEY
const TURNSTILE_SECRET_KEY = 'YOUR_SECRET_KEY_HERE';

// Rate limiting store (in-memory, resets on server restart)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3; // Max 3 requests per minute per IP

function getClientIP(request: Request): string {
  // Try to get real IP from various headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');

  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(',')[0].trim();

  return 'unknown';
}

function checkRateLimit(ip: string): { allowed: boolean; remainingTime?: number } {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];

  // Clean up old timestamps
  const recentTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);

  if (recentTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldestTimestamp = recentTimestamps[0];
    const remainingTime = RATE_LIMIT_WINDOW - (now - oldestTimestamp);
    return { allowed: false, remainingTime: Math.ceil(remainingTime / 1000) };
  }

  recentTimestamps.push(now);
  rateLimitMap.set(ip, recentTimestamps);

  return { allowed: true };
}

function validatePhone(phone: string): boolean {
  // Kazakhstan phone format: +7XXXXXXXXXX or 8XXXXXXXXXX
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  return /^(\+7|8|7)\d{10}$/.test(cleanPhone);
}

async function verifyTurnstileToken(token: string, clientIP: string): Promise<{ success: boolean; error?: string }> {
  if (TURNSTILE_SECRET_KEY === 'YOUR_SECRET_KEY_HERE') {
    // Turnstile not configured yet - skip verification
    return { success: true };
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: clientIP
      })
    });

    const data = await response.json();
    return {
      success: data.success === true,
      error: data['error-codes']?.join(', ')
    };
  } catch (error) {
    console.error('[TURNSTILE ERROR]', error);
    return { success: false, error: 'verification_failed' };
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const clientIP = getClientIP(request);

    // Rate limiting check
    const rateCheck = checkRateLimit(clientIP);
    if (!rateCheck.allowed) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'rate_limit',
          message: `Слишком много запросов. Подождите ${rateCheck.remainingTime} секунд.`
        }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();
    const { name, phone, message, honeypot, turnstileToken } = body;

    // Honeypot check - if filled, it's a bot
    if (honeypot) {
      console.log(`[SECURITY] Bot detected from IP ${clientIP} - honeypot field filled`);
      // Return success to not alert the bot
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Basic validation
    const errors: string[] = [];
    if (!name || String(name).trim().length < 2) errors.push('name');
    if (!phone || !validatePhone(String(phone))) errors.push('phone');
    if (!message || String(message).trim().length < 5) errors.push('message');

    if (errors.length > 0) {
      return new Response(
        JSON.stringify({ success: false, errors }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify Turnstile token (if configured)
    if (turnstileToken) {
      const verification = await verifyTurnstileToken(turnstileToken, clientIP);
      if (!verification.success) {
        console.log(`[SECURITY] Turnstile verification failed for IP ${clientIP}: ${verification.error}`);
        return new Response(
          JSON.stringify({
            success: false,
            error: 'captcha_failed',
            message: 'Проверка CAPTCHA не пройдена. Попробуйте еще раз.'
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Prepare Telegram message
    const telegramMessage = `🔔 <b>Новая заявка с сайта</b>

👤 <b>Имя:</b> ${String(name).trim()}
📱 <b>Телефон:</b> ${String(phone).trim()}
💬 <b>Сообщение:</b>
${String(message).trim()}

🌐 <b>Источник:</b> gose.kz
🔍 <b>IP:</b> ${clientIP}
⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Almaty' })}`;

    // Send to Telegram
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: telegramMessage,
          parse_mode: 'HTML'
        })
      }
    );

    if (!telegramResponse.ok) {
      const errorText = await telegramResponse.text();
      console.error('[TELEGRAM ERROR]', errorText);
      throw new Error('Telegram API failed');
    }

    console.log(`[SUCCESS] Message sent to Telegram from ${clientIP}`);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[API ERROR]', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'server_error',
        message: 'Ошибка сервера. Попробуйте позже.'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
