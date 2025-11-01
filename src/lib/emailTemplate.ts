export function buildEmailHTML(submission: {
  name: string;
  email: string;
  phone?: string | null;
  service?: string | null;
  message: string;
  createdAt: string;
}) {
  const { name, email, phone, service, message, createdAt } = submission;
  return `
  <html>
    <body style="font-family: Arial, sans-serif; color: #0A2342;">
      <h2>New contact submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ''}
      ${service ? `<p><strong>Service:</strong> ${escapeHtml(service)}</p>` : ''}
      <p><strong>Message:</strong></p>
      <div style="border-left:4px solid #DDD; padding-left:12px;">${escapeHtml(message).replace(/\n/g, '<br/>')}</div>
      <hr/>
      <small>Received: ${escapeHtml(createdAt)}</small>
    </body>
  </html>
  `;
}

function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
