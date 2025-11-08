"""
Système de notifications par email
"""
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

class EmailNotifier:
    """Gestionnaire de notifications par email"""

    def __init__(self):
        self.enabled = os.getenv('EMAIL_NOTIFICATIONS', 'false').lower() == 'true'
        self.smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        self.smtp_port = int(os.getenv('SMTP_PORT', '587'))
        self.smtp_user = os.getenv('SMTP_USER', '')
        self.smtp_password = os.getenv('SMTP_PASSWORD', '')
        self.email_from = os.getenv('EMAIL_FROM', self.smtp_user)
        self.email_to = os.getenv('EMAIL_TO', '').split(',')

    def send_email(self, subject, body, html=False):
        """Envoie un email"""
        if not self.enabled:
            return False

        if not self.smtp_user or not self.smtp_password or not self.email_to:
            print("⚠ Notifications email non configurées")
            return False

        try:
            # Créer le message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = self.email_from
            msg['To'] = ', '.join(self.email_to)

            # Corps du message
            if html:
                msg.attach(MIMEText(body, 'html'))
            else:
                msg.attach(MIMEText(body, 'plain'))

            # Connexion SMTP
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_password)
                server.send_message(msg)

            print(f"✓ Email envoyé: {subject}")
            return True

        except Exception as e:
            print(f"✗ Erreur lors de l'envoi de l'email: {str(e)}")
            return False

    def send_success_notification(self, records, duration, filename):
        """Notifie le succès d'une extraction"""
        subject = f"✓ Extraction Bexio réussie - {records} enregistrements"

        body = f"""Extraction Bexio terminée avec succès

Date/Heure: {datetime.now().strftime('%d/%m/%Y %H:%M')}
Enregistrements extraits: {records}
Durée: {duration:.1f} secondes
Fichier généré: {filename}

Le fichier Excel est prêt à être importé dans Power BI.
"""

        html_body = f"""
<html>
<body style="font-family: Arial, sans-serif;">
    <h2 style="color: #107C10;">✓ Extraction Bexio réussie</h2>

    <p><strong>Date/Heure:</strong> {datetime.now().strftime('%d/%m/%Y %H:%M')}</p>
    <p><strong>Enregistrements extraits:</strong> <span style="color: #0078D4; font-size: 18px;">{records}</span></p>
    <p><strong>Durée:</strong> {duration:.1f} secondes</p>
    <p><strong>Fichier généré:</strong> <code>{filename}</code></p>

    <hr style="border: 1px solid #ddd; margin: 20px 0;">

    <p>Le fichier Excel est prêt à être importé dans Power BI.</p>
</body>
</html>
"""

        return self.send_email(subject, html_body, html=True)

    def send_failure_notification(self, error):
        """Notifie l'échec d'une extraction"""
        subject = "✗ Échec extraction Bexio"

        body = f"""Échec de l'extraction Bexio

Date/Heure: {datetime.now().strftime('%d/%m/%Y %H:%M')}
Erreur: {error}

Veuillez vérifier les logs pour plus de détails.
"""

        html_body = f"""
<html>
<body style="font-family: Arial, sans-serif;">
    <h2 style="color: #D13438;">✗ Échec extraction Bexio</h2>

    <p><strong>Date/Heure:</strong> {datetime.now().strftime('%d/%m/%Y %H:%M')}</p>
    <p><strong>Erreur:</strong> <span style="color: #D13438;">{error}</span></p>

    <hr style="border: 1px solid #ddd; margin: 20px 0;">

    <p>Veuillez vérifier les logs et la configuration pour résoudre le problème.</p>
</body>
</html>
"""

        return self.send_email(subject, html_body, html=True)

    def send_alert(self, alert_type, message, details=None):
        """Envoie une alerte personnalisée"""
        subject = f"⚠ Alerte Bexio - {alert_type}"

        body = f"""Alerte: {alert_type}

{message}
"""

        if details:
            body += f"\nDétails:\n{details}"

        return self.send_email(subject, body)
