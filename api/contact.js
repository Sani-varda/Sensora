const nodemailer = require('nodemailer');

const SENDER_EMAIL = 'hello@sensora.co.in';
const APP_PASSWORD = 'uoxd hdix lwqf ttfg';
const CALENDLY_LINK = 'https://calendly.com/imsunnystark/30min';
const DISPLAY_NAME = 'Sani | Sensora - Health Marketing & Business Growth';

const getEmailTemplate = (name, industry, calendlyLink) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Sensora - Health Marketing & Business Growth</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f0f2f5; }
        .container { max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); border: 1px solid #e1e4e8; }
        .header { background: linear-gradient(135deg, #E06196 0%, #8B0029 100%); color: #ffffff; padding: 50px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 32px; letter-spacing: 1px; font-weight: 700; margin-bottom: 10px; }
        .header p { margin: 0; font-size: 16px; opacity: 0.9; font-weight: 300; }
        .content { padding: 40px 30px; }
        .section { margin-bottom: 35px; }
        .h-accent { color: #E06196; font-size: 22px; font-weight: 600; margin-bottom: 15px; border-bottom: 2px solid #f0f2f5; padding-bottom: 10px; }
        .highlight-box { background-color: #f8fbfd; border-radius: 8px; padding: 25px; border-left: 5px solid #E06196; margin-bottom: 30px; }
        .service-list { list-style: none; padding: 0; margin: 0; }
        .service-item { display: flex; margin-bottom: 15px; align-items: flex-start; }
        .check-icon { color: #E06196; margin-right: 12px; font-weight: bold; font-size: 18px; }
        .button-container { text-align: center; margin-top: 40px; margin-bottom: 20px; }
        .button { display: inline-block; padding: 18px 36px; background-color: #E06196; color: #ffffff !important; text-decoration: none; border-radius: 50px; font-weight: bold; text-align: center; font-size: 16px; transition: all 0.3s; box-shadow: 0 4px 15px rgba(224, 97, 150, 0.3); }
        .button:hover { background-color: #0d2b8a; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(224, 97, 150, 0.4); }
        .footer { background-color: #f9f9f9; padding: 30px; text-align: center; font-size: 13px; color: #666; border-top: 1px solid #eee; }
        .footer a { color: #E06196; text-decoration: none; font-weight: 500; }
        strong { color: #E06196; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Sensora - Health Marketing & Business Growth</h1>
            <p>Illuminating Your Path to Automation</p>
        </div>
        <div class="content">
            <div class="section">
                <h2>Hello ${name},</h2>
                <p>Thank you for choosing Sensora - Health Marketing & Business Growth. We have successfully received your inquiry regarding <strong>${industry}</strong> solutions.</p>
                <p>You’ve taken the first step towards transforming your business operations. Our team is currently reviewing your details to tailor a strategy that aligns with your goals.</p>
            </div>
            
            <div class="highlight-box">
                <h3 style="margin-top: 0; color: #E06196;">What Happens Next?</h3>
                <p style="margin-bottom: 0;">1. <strong>Analysis:</strong> We analyze your requirements against our AI frameworks.<br>
                2. <strong>Strategy:</strong> We identify the highest-ROI automation opportunities for you.<br>
                3. <strong>Connect:</strong> A specialist will reach out within 24 hours to schedule a deep-dive.</p>
            </div>

            <div class="section">
                <h3 class="h-accent">Our Comprehensive Solutions</h3>
                <p>We don't just build software; we build autonomous systems that drive revenue.</p>
                <ul class="service-list">
                    <li class="service-item"><span class="check-icon">✓</span><div><strong>AI Voice & Chat Agents:</strong> Automate customer support and sales availability 24/7.</div></li>
                    <li class="service-item"><span class="check-icon">✓</span><div><strong>Intelligent Workflows:</strong> Streamline operations and remove manual bottlenecks.</div></li>
                    <li class="service-item"><span class="check-icon">✓</span><div><strong>High-Performance Web:</strong> SEO-optimized, blazing fast web applications.</div></li>
                    <li class="service-item"><span class="check-icon">✓</span><div><strong>Data-Driven Ads:</strong> Precision targeting on Google & Meta platforms.</div></li>
                </ul>
            </div>

            <div class="button-container">
                <p style="margin-bottom: 25px;">Don't want to wait? Fast-track your process now.</p>
                <a href="${calendlyLink}" class="button">Schedule Priority Consultation</a>
            </div>
        </div>
        <div class="footer">
            <p>&copy; 2026 Sensora - Health Marketing & Business Growth. All rights reserved.</p>
            <p>Hyderabad, India | +91 8356918580</p>
            <p style="margin-top: 10px;"><a href="https://sensora.co.in">Visit Our Website</a> | <a href="mailto:hello@sensora.co.in">Email Support</a></p>
        </div>
    </div>
</body>
</html>
`;

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'healthy',
      service: 'Sensora Contact API',
      message: 'Endpoint is active. Submit POST requests to send inquiries.'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    let data = req.body;
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) {
        const querystring = require('querystring');
        data = querystring.parse(data);
      }
    }

    const name = data['full-name'] || data.name || 'there';
    const email = data.email;
    const phone = data.number || data.phone || 'N/A';
    const industry = data.project || data.industry || 'Automation';
    const message = data.message || '';

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: SENDER_EMAIL,
        pass: APP_PASSWORD
      }
    });

    // 1. Send Welcome Email to Lead
    await transporter.sendMail({
      from: `"${DISPLAY_NAME}" <${SENDER_EMAIL}>`,
      to: email,
      subject: 'Welcome to Sensora - Health Marketing & Business Growth - Your AI Transformation Starts Here',
      html: getEmailTemplate(name, industry, CALENDLY_LINK)
    });

    // 2. Send Notification to Admin
    const adminBody = `New Lead: ${name}\nEmail: ${email}\nPhone: ${phone}\nIndustry: ${industry}\nMessage: ${message}`;
    await transporter.sendMail({
      from: `"${DISPLAY_NAME}" <${SENDER_EMAIL}>`,
      to: SENDER_EMAIL,
      subject: `New Lead Alert: ${name}`,
      text: adminBody
    });

    return res.status(200).json({
      status: 'success',
      message: 'Emails sent successfully'
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({
      error: `Error sending email: ${error.message || error}`
    });
  }
};
