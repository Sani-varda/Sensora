import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from jinja2 import Template

import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import configuration from api.contact
from api.contact import SENDER_EMAIL, APP_PASSWORD, DISPLAY_NAME, EMAIL_TEMPLATE, CALENDLY_LINK

def send_test_email():
    to_email = "sanivarada@gmail.com"
    subject = "Welcome to Sensora - Health Marketing & Business Growth - Test Email (Comprehensive)"
    
    print(f"Sending email to {to_email}...")
    
    # Render template with dummy data
    body_html = Template(EMAIL_TEMPLATE).render(
        name="Sani",
        industry="AI Automation",
        calendly_link=CALENDLY_LINK
    )
    
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"{DISPLAY_NAME} <{SENDER_EMAIL}>"
    msg["To"] = to_email
    
    msg.attach(MIMEText(body_html, "html"))

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(SENDER_EMAIL, APP_PASSWORD)
            server.send_message(msg)
        print("✅ Email sent successfully!")
    except Exception as e:
        print(f"❌ Error sending email: {e}")

if __name__ == "__main__":
    send_test_email()
