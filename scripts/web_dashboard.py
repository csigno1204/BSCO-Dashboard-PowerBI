"""
Dashboard web simple pour monitoring
Interface web légère pour visualiser l'état des extractions
"""
import os
import json
import glob
from datetime import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler
from logger import ExtractionLogger

HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Bexio - Monitoring</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        h1 {
            color: white;
            text-align: center;
            margin-bottom: 30px;
            font-size: 2.5em;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: white;
            border-radius: 10px;
            padding: 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .stat-value {
            font-size: 2.5em;
            font-weight: bold;
            color: #667eea;
            margin: 10px 0;
        }
        .stat-label {
            color: #666;
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .status-indicator {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 8px;
        }
        .status-success { background-color: #10b981; }
        .status-error { background-color: #ef4444; }
        .status-warning { background-color: #f59e0b; }
        .history-section {
            background: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .history-title {
            font-size: 1.5em;
            margin-bottom: 20px;
            color: #333;
        }
        .history-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            border-bottom: 1px solid #eee;
        }
        .history-item:last-child {
            border-bottom: none;
        }
        .history-time {
            color: #666;
            font-size: 0.9em;
        }
        .history-info {
            color: #333;
        }
        .btn-refresh {
            background: #667eea;
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1em;
            margin: 20px auto;
            display: block;
        }
        .btn-refresh:hover {
            background: #5568d3;
        }
        .footer {
            text-align: center;
            color: white;
            margin-top: 30px;
            opacity: 0.8;
        }
    </style>
    <script>
        function refreshPage() {
            location.reload();
        }
        setTimeout(refreshPage, 60000); // Auto-refresh chaque minute
    </script>
</head>
<body>
    <div class="container">
        <h1>📊 Dashboard Bexio - Monitoring</h1>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-label">Dernière Extraction</div>
                <div class="stat-value">{last_extraction_time}</div>
                <div class="stat-info">
                    <span class="status-indicator {last_status_class}"></span>
                    {last_status_text}
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-label">Enregistrements</div>
                <div class="stat-value">{total_records}</div>
                <div class="stat-info">Dernière extraction</div>
            </div>

            <div class="stat-card">
                <div class="stat-label">Taux de Succès</div>
                <div class="stat-value">{success_rate}%</div>
                <div class="stat-info">7 derniers jours</div>
            </div>

            <div class="stat-card">
                <div class="stat-label">Fichiers Générés</div>
                <div class="stat-value">{file_count}</div>
                <div class="stat-info">Dans data/</div>
            </div>
        </div>

        <div class="history-section">
            <div class="history-title">📜 Historique Récent</div>
            {history_html}
        </div>

        <button class="btn-refresh" onclick="refreshPage()">🔄 Actualiser</button>

        <div class="footer">
            Dashboard Bexio → Power BI | Actualisé: {current_time}
        </div>
    </div>
</body>
</html>
"""

class DashboardHandler(BaseHTTPRequestHandler):
    """Gestionnaire de requêtes HTTP"""

    def do_GET(self):
        """Gère les requêtes GET"""
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'text/html; charset=utf-8')
            self.end_headers()

            html = self.generate_dashboard()
            self.wfile.write(html.encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def generate_dashboard(self):
        """Génère le HTML du dashboard"""
        logger = ExtractionLogger()
        history = logger.get_history(10)

        # Statistiques
        if history:
            last = history[0]
            last_time = datetime.fromisoformat(last['timestamp'])
            now = datetime.now()
            delta = now - last_time

            if delta.total_seconds() < 3600:
                last_extraction_time = f"{int(delta.total_seconds() / 60)} min"
            elif delta.total_seconds() < 86400:
                last_extraction_time = f"{int(delta.total_seconds() / 3600)}h"
            else:
                last_extraction_time = f"{delta.days}j"

            last_status_class = "status-success" if last['success'] else "status-error"
            last_status_text = "Succès" if last['success'] else "Échec"
            total_records = last.get('records', 0)

            # Taux de succès
            success_count = sum(1 for h in history if h['success'])
            success_rate = int((success_count / len(history)) * 100)
        else:
            last_extraction_time = "N/A"
            last_status_class = "status-warning"
            last_status_text = "Aucune extraction"
            total_records = 0
            success_rate = 0

        # Nombre de fichiers
        file_count = len(glob.glob('data/*.xlsx'))

        # Historique HTML
        history_html = ""
        for entry in history[:5]:
            time = datetime.fromisoformat(entry['timestamp']).strftime('%d/%m %H:%M')
            status_class = "status-success" if entry['success'] else "status-error"
            info = f"{entry.get('records', 0)} enregistrements" if entry['success'] else "Échec"

            history_html += f"""
            <div class="history-item">
                <div class="history-time">{time}</div>
                <div class="history-info">
                    <span class="status-indicator {status_class}"></span>
                    {info}
                </div>
            </div>
            """

        if not history_html:
            history_html = '<div class="history-item">Aucun historique disponible</div>'

        # Remplir le template
        html = HTML_TEMPLATE.format(
            last_extraction_time=last_extraction_time,
            last_status_class=last_status_class,
            last_status_text=last_status_text,
            total_records=total_records,
            success_rate=success_rate,
            file_count=file_count,
            history_html=history_html,
            current_time=datetime.now().strftime('%d/%m/%Y %H:%M:%S')
        )

        return html

    def log_message(self, format, *args):
        """Désactive les logs de requêtes HTTP"""
        pass

def start_server(port=5000):
    """Démarre le serveur web"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, DashboardHandler)

    print("\n" + "="*70)
    print("  🌐 DASHBOARD WEB DÉMARRÉ")
    print("="*70 + "\n")
    print(f"Ouvrez votre navigateur sur: http://localhost:{port}")
    print("Appuyez sur Ctrl+C pour arrêter\n")

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\nServeur arrêté")
        httpd.shutdown()

if __name__ == '__main__':
    import sys
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5000
    start_server(port)
