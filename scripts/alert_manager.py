"""
Gestionnaire d'alertes intelligentes configurables
Vérifie les règles et envoie des notifications
"""
import os
import yaml
import json
from datetime import datetime, timedelta
from email_notifier import EmailNotifier

class AlertManager:
    """Gestionnaire d'alertes"""

    def __init__(self, config_file='alerts.yaml'):
        self.config_file = config_file
        self.config = self.load_config()
        self.alert_history_file = 'logs/alert_history.json'
        os.makedirs('logs', exist_ok=True)

    def load_config(self):
        """Charge la configuration des alertes"""
        if not os.path.exists(self.config_file):
            print(f"⚠ Fichier {self.config_file} introuvable")
            return {'alerts': [], 'notification_channels': {}, 'settings': {}}

        with open(self.config_file, 'r', encoding='utf-8') as f:
            config = yaml.safe_load(f)

        # Remplacer les variables d'environnement
        config_str = yaml.dump(config)
        for key, value in os.environ.items():
            config_str = config_str.replace(f'${{{key}}}', value)

        return yaml.safe_load(config_str)

    def calculate_metrics(self, data):
        """Calcule les métriques depuis les données"""
        metrics = {}

        # Exemple de métriques (à adapter selon vos données réelles)
        if 'invoices' in data:
            invoices = data['invoices']
            metrics['monthly_invoice_count'] = len(invoices)
            metrics['monthly_revenue'] = sum(inv.get('total', 0) for inv in invoices)

            # Factures en retard
            overdue = [inv for inv in invoices if inv.get('days_overdue', 0) > 0]
            metrics['overdue_invoices_total'] = len(overdue)
            metrics['overdue_invoices_30d'] = len([inv for inv in overdue if inv.get('days_overdue', 0) > 30])

            if metrics['monthly_invoice_count'] > 0:
                metrics['overdue_rate_pct'] = (metrics['overdue_invoices_total'] / metrics['monthly_invoice_count']) * 100
            else:
                metrics['overdue_rate_pct'] = 0

        if 'contacts' in data:
            metrics['new_customers'] = len([c for c in data['contacts'] if self.is_new_customer(c)])
            metrics['inactive_customers_90d'] = len([c for c in data['contacts'] if self.is_inactive(c, 90)])

        # Croissance (exemple simplifié)
        metrics['revenue_growth_pct'] = 12  # À calculer réellement

        # Objectif (exemple)
        metrics['quarterly_target_pct'] = 95  # À calculer réellement

        return metrics

    def is_new_customer(self, contact):
        """Vérifie si c'est un nouveau client (exemple)"""
        # À implémenter selon votre logique
        return False

    def is_inactive(self, contact, days):
        """Vérifie si le client est inactif (exemple)"""
        # À implémenter selon votre logique
        return False

    def evaluate_condition(self, condition, metrics):
        """Évalue une condition d'alerte"""
        metric = condition.get('metric')
        operator = condition.get('operator')
        threshold = condition.get('threshold')

        if metric not in metrics:
            return False

        value = metrics[metric]

        if operator == '>':
            return value > threshold
        elif operator == '<':
            return value < threshold
        elif operator == '>=':
            return value >= threshold
        elif operator == '<=':
            return value <= threshold
        elif operator == '==':
            return value == threshold
        elif operator == '!=':
            return value != threshold

        return False

    def should_send_alert(self, alert_name):
        """Vérifie si l'alerte peut être envoyée (cooldown)"""
        if not os.path.exists(self.alert_history_file):
            return True

        with open(self.alert_history_file, 'r') as f:
            history = json.load(f)

        cooldown_hours = self.config.get('settings', {}).get('cooldown_hours', 24)

        for entry in history:
            if entry['alert_name'] == alert_name:
                sent_at = datetime.fromisoformat(entry['timestamp'])
                if datetime.now() - sent_at < timedelta(hours=cooldown_hours):
                    return False

        return True

    def record_alert(self, alert_name):
        """Enregistre l'envoi d'une alerte"""
        history = []
        if os.path.exists(self.alert_history_file):
            with open(self.alert_history_file, 'r') as f:
                history = json.load(f)

        history.append({
            'alert_name': alert_name,
            'timestamp': datetime.now().isoformat()
        })

        # Garder seulement les 100 dernières
        history = history[-100:]

        with open(self.alert_history_file, 'w') as f:
            json.dump(history, f, indent=2)

    def send_alert(self, alert, metrics):
        """Envoie une alerte via les canaux configurés"""
        print(f"\n🔔 ALERTE: {alert['name']}")
        print(f"   {alert['description']}")

        for action in alert.get('action', []):
            action_type = action.get('type')

            if action_type == 'email':
                self.send_email_alert(alert, action, metrics)
            elif action_type == 'slack':
                self.send_slack_alert(alert, action, metrics)
            elif action_type == 'teams':
                self.send_teams_alert(alert, action, metrics)
            elif action_type == 'log':
                self.log_alert(alert, action)

        self.record_alert(alert['name'])

    def send_email_alert(self, alert, action, metrics):
        """Envoie l'alerte par email"""
        notifier = EmailNotifier()
        subject = f"⚠ Alerte: {alert['name']}"

        body = f"""
Alerte Bexio

Nom: {alert['name']}
Description: {alert['description']}
Priorité: {alert.get('priority', 'medium')}

Date/Heure: {datetime.now().strftime('%d/%m/%Y %H:%M')}

Métriques concernées:
{json.dumps(metrics, indent=2, ensure_ascii=False)}

---
Cette alerte a été générée automatiquement par le système Dashboard Bexio → Power BI
"""

        to_emails = action.get('to', '').split(',')
        for email in to_emails:
            notifier.send_email(subject, body)

        print(f"   ✓ Email envoyé à {action.get('to')}")

    def send_slack_alert(self, alert, action, metrics):
        """Envoie l'alerte sur Slack"""
        webhook_url = self.config.get('notification_channels', {}).get('slack', {}).get('webhook_url')

        if not webhook_url:
            print(f"   ⚠ Slack webhook non configuré")
            return

        import requests

        message = {
            "text": f"⚠ *{alert['name']}*",
            "attachments": [{
                "color": "warning" if alert.get('priority') == 'high' else "good",
                "fields": [
                    {"title": "Description", "value": alert['description'], "short": False},
                    {"title": "Priorité", "value": alert.get('priority', 'medium'), "short": True},
                ]
            }]
        }

        try:
            response = requests.post(webhook_url, json=message)
            if response.status_code == 200:
                print(f"   ✓ Message envoyé sur Slack")
            else:
                print(f"   ✗ Erreur Slack: {response.status_code}")
        except Exception as e:
            print(f"   ✗ Erreur Slack: {str(e)}")

    def send_teams_alert(self, alert, action, metrics):
        """Envoie l'alerte sur Microsoft Teams"""
        webhook_url = self.config.get('notification_channels', {}).get('teams', {}).get('webhook_url')

        if not webhook_url:
            print(f"   ⚠ Teams webhook non configuré")
            return

        import requests

        message = {
            "@type": "MessageCard",
            "@context": "http://schema.org/extensions",
            "summary": alert['name'],
            "themeColor": "FFB900" if alert.get('priority') == 'high' else "107C10",
            "title": f"⚠ {alert['name']}",
            "sections": [{
                "facts": [
                    {"name": "Description", "value": alert['description']},
                    {"name": "Priorité", "value": alert.get('priority', 'medium')},
                    {"name": "Date/Heure", "value": datetime.now().strftime('%d/%m/%Y %H:%M')}
                ]
            }]
        }

        try:
            response = requests.post(webhook_url, json=message)
            if response.status_code == 200:
                print(f"   ✓ Message envoyé sur Teams")
            else:
                print(f"   ✗ Erreur Teams: {response.status_code}")
        except Exception as e:
            print(f"   ✗ Erreur Teams: {str(e)}")

    def log_alert(self, alert, action):
        """Log l'alerte dans les fichiers"""
        print(f"   ℹ Alerte enregistrée dans les logs")

    def check_alerts(self, data):
        """Vérifie toutes les alertes configurées"""
        print("\n🔍 Vérification des alertes...")

        # Calculer les métriques
        metrics = self.calculate_metrics(data)

        triggered_count = 0

        for alert in self.config.get('alerts', []):
            if not alert.get('enabled', True):
                continue

            # Évaluer la condition
            if self.evaluate_condition(alert['condition'], metrics):
                # Vérifier le cooldown
                if self.should_send_alert(alert['name']):
                    self.send_alert(alert, metrics)
                    triggered_count += 1
                else:
                    print(f"   ⏸ Alerte '{alert['name']}' en cooldown")

        if triggered_count == 0:
            print("✓ Aucune alerte déclenchée")
        else:
            print(f"\n✓ {triggered_count} alerte(s) déclenchée(s)")

def main():
    """Test du gestionnaire d'alertes"""
    manager = AlertManager()

    # Données d'exemple
    test_data = {
        'invoices': [
            {'total': 1000, 'days_overdue': 0},
            {'total': 2000, 'days_overdue': 35},
            {'total': 1500, 'days_overdue': 40},
        ],
        'contacts': []
    }

    manager.check_alerts(test_data)

if __name__ == '__main__':
    main()
