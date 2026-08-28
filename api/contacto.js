const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://www.disenartemx.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method_not_allowed' });

  const body = req.body || {};
  const nombre = (body.nombre || '').toString().trim();
  const apellidos = (body.apellidos || '').toString().trim();
  const empresa = (body.empresa || '').toString().trim();
  const telefono = (body.telefono || '').toString().trim();
  const correo = (body.correo || '').toString().trim();
  const servicio = (body.servicio || '').toString().trim();
  const mensaje = (body.mensaje || '').toString().trim();
  const honeypot = (body.website || '').toString().trim();
  const privacidad = body.privacidad === true;
  const recaptchaToken = (body.recaptchaToken || '').toString().trim();
  const origen = (body.origen && typeof body.origen === 'object') ? body.origen : {};
  const lim = (v) => (v == null ? '' : String(v).slice(0, 200));

  if (honeypot) return res.status(200).json({ ok: true });
  if (!nombre || !apellidos || !empresa || !mensaje) {
    return res.status(400).json({ ok: false, error: 'campos_faltantes' });
  }
  if (!privacidad) {
    return res.status(400).json({ ok: false, error: 'privacidad_no_aceptada' });
  }
  if (correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    return res.status(400).json({ ok: false, error: 'correo_invalido' });
  }
  if (!recaptchaToken) {
    return res.status(400).json({ ok: false, error: 'recaptcha_faltante' });
  }

  if (!process.env.ZOHO_USER || !process.env.ZOHO_APP_PASSWORD) {
    console.error('Faltan variables de entorno ZOHO_USER / ZOHO_APP_PASSWORD');
    return res.status(500).json({ ok: false, error: 'config' });
  }
  if (!process.env.RECAPTCHA_SECRET_KEY) {
    console.error('Falta variable de entorno RECAPTCHA_SECRET_KEY');
    return res.status(500).json({ ok: false, error: 'config' });
  }

  try {
    const verifyResp = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${encodeURIComponent(process.env.RECAPTCHA_SECRET_KEY)}&response=${encodeURIComponent(recaptchaToken)}`,
    });
    const verifyJson = await verifyResp.json();
    if (!verifyJson.success) {
      return res.status(400).json({ ok: false, error: 'recaptcha_invalido' });
    }
  } catch (err) {
    console.error('Error verificando reCAPTCHA:', err);
    return res.status(500).json({ ok: false, error: 'recaptcha_error' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.ZOHO_USER,
        pass: process.env.ZOHO_APP_PASSWORD,
      },
    });

    const lineas = [
      `Nombre: ${nombre} ${apellidos}`,
      `Empresa: ${empresa}`,
      telefono ? `Teléfono: ${telefono}` : null,
      correo ? `Correo: ${correo}` : null,
      servicio ? `Servicio de interés: ${servicio}` : null,
      '',
      'Mensaje:',
      mensaje,
      '',
      '--- Origen del lead ---',
      `Campaña: ${lim(origen.utm_campaign) || '(directo)'}`,
      `Fuente: ${lim(origen.utm_source) || '(directo)'}`,
      `Medio: ${lim(origen.utm_medium) || '(directo)'}`,
      origen.gclid ? `Google Ads (gclid): ${lim(origen.gclid)}` : null,
      `Página de entrada: ${lim(origen.landing) || '/'}`,
      '',
      '---',
      'El usuario aceptó el aviso de privacidad al enviar este formulario.',
    ].filter(Boolean).join('\n');

    await transporter.sendMail({
      from: 'Diseñarte México <administracion@disenartemx.com>',
      to: ['ventas@disenartemx.com', 'direccion@disenartemx.com'],
      replyTo: correo || undefined,
      subject: `🟣 Nuevo contacto web: ${nombre} ${apellidos}`,
      text: lineas,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Error enviando correo:', err);
    return res.status(500).json({ ok: false, error: 'envio_fallido' });
  }
};
