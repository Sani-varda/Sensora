import os
import smtplib
import json
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs
from jinja2 import Template

# --- CONFIGURATION ---
SENDER_EMAIL = "imsunnystark@gmail.com"
APP_PASSWORD = "uoxd hdix lwqf ttfg"
CALENDLY_LINK = "https://calendly.com/imsunnystark/30min"
DISPLAY_NAME = "Sani | MoonLIT Arc"

EMAIL_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to MoonLIT Arc</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background-color: #000000; color: #ffffff; padding: 40px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; letter-spacing: 1px; text-transform: uppercase; }
        .header p { margin: 10px 0 0 0; font-size: 14px; opacity: 0.9; font-style: italic; }
        .content { padding: 40px 30px; }
        .section { margin-bottom: 30px; }
        .h-accent { color: #1034A6; font-size: 20px; margin-bottom: 15px; border-bottom: 2px solid #eee; padding-bottom: 8px; }
        .service-item { margin-bottom: 15px; padding-left: 15px; border-left: 3px solid #1034A6; }
        .service-title { font-weight: bold; display: block; margin-bottom: 4px; }
        .button { display: inline_block; padding: 16px 32px; background-color: #1034A6; color: white !important; text-decoration: none; border-radius: 6px; font-weight: bold; text-align: center; font-size: 16px; transition: background-color 0.3s; }
        .footer { background-color: #f9f9f9; padding: 25px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #eee; }
        .footer a { color: #1034A6; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>MoonLIT Arc</h1>
            <p>Illuminating Your Path to AI-Powered Growth</p>
        </div>
        <div class="content">
            <div class="section">
                <h2>Hello {{ name }},</h2>
                <p>Thank you for reaching out to us. We are thrilled to welcome you to the future of business automation.</p>
                <p>We have received your inquiry regarding <strong>{{ industry }}</strong> solutions, and our team is already reviewing your requirements.</p>
            </div>
            <div class="section">
                <h3 class="h-accent">Who We Are</h3>
                <p>MoonLIT Arc is a cutting-edge AI Automation Agency dedicated to bridging the gap between emerging AI technology and real-world business applications. We help companies eliminate inefficiencies, scale operations, and unlock unprecedented growth potential.</p>
            </div>
            <div class="section">
                <h3 class="h-accent">How We Can Help</h3>
                <div class="service-item"><span class="service-title">AI Automation Solutions</span>Chat Agents, Voice Agents, Email Automation, and Custom Workflow Automation.</div>
                <div class="service-item"><span class="service-title">Web Development</span>High-converting landing pages and fully functional, SEO-optimized websites.</div>
                <div class="service-item"><span class="service-title">Digital Advertising</span>Data-driven Google & Meta advertising campaigns.</div>
            </div>
            <div class="section" style="text-align: center; margin-top: 40px; background-color: #f8f9fa; padding: 30px; border-radius: 8px;">
                <h3 style="margin-top: 0;">Ready to Transform Your Business?</h3>
                <p style="margin-bottom: 25px;">Let's discuss your specific challenges in a no-pressure strategy call.</p>
                <a href="{{ calendly_link }}" class="button">Schedule Free Consultation</a>
            </div>
        </div>
        <div class="footer">
            <p>&copy; 2026 MoonLIT Arc. All rights reserved.</p>
            <p><a href="https://moon-lit-arc.vercel.app">Website</a></p>
        </div>
    </div>
</body>
</html>
"""

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length).decode('utf_8')
        
        # Parse data (handling both JSON and Form Encoded)
        try:
            content_type = self.headers.get('Content-Type', '')
            if 'application/json' in content_type:
                data = json.loads(post_data)
            else:
                data = {k: v[0] for k, v in parse_qs(post_data).items()}
        except Exception as e:
            self.send_response(400)
            self.end_headers()
            self.wfile.write(f"Error parsing data: {str(e)}".encode())
            return

        name = data.get('full-name') or data.get('name', 'there')
        email = data.get('email')
        phone = data.get('number') or data.get('phone', 'N/A')
        industry = data.get('project') or data.get('industry', 'Automation')
        message = data.get('message', '')

        if not email:
            self.send_response(400)
            self.end_headers()
            self.wfile.write(b"Email is required")
            return

        try:
            # 1. Send Welcome Email to Lead
            self.send_email_smtp(
                to_email=email,
                subject="Welcome to MoonLIT Arc - Your AI Transformation Starts Here",
                body_html=Template(EMAIL_TEMPLATE).render(name=name, industry=industry, calendly_link=CALENDLY_LINK)
            )

            # 2. Send Notification to Admin (You)
            admin_body = f"New Lead: {name}\nEmail: {email}\nPhone: {phone}\nIndustry: {industry}\nMessage: {message}"
            self.send_email_smtp(
                to_email=SENDER_EMAIL,
                subject=f"New Lead Alert: {name}",
                body_text=admin_body
            )

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "success", "message": "Emails sent successfully"}).encode())

        except Exception as e:
            self.send_response(500)
            self.end_headers()
            self.wfile.write(f"Error sending email: {str(e)}".encode())

    def send_email_smtp(self, to_email, subject, body_html=None, body_text=None):
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"{DISPLAY_NAME} <{SENDER_EMAIL}>"
        msg["To"] = to_email

        if body_text:
            msg.attach(MIMEText(body_text, "plain"))
        if body_html:
            msg.attach(MIMEText(body_html, "html"))

        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(SENDER_EMAIL, APP_PASSWORD)
            server.send_message(msg)
