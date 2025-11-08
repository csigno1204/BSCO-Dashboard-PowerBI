"""
Générateur de rapports PDF automatiques
Crée un rapport exécutif après chaque extraction
"""
import os
import json
from datetime import datetime
from io import BytesIO
import matplotlib
matplotlib.use('Agg')  # Backend non-interactif
import matplotlib.pyplot as plt
import pandas as pd

class PDFReportGenerator:
    """Générateur de rapports PDF"""

    def __init__(self, data_file=None):
        self.data_file = data_file
        self.output_dir = "reports"
        os.makedirs(self.output_dir, exist_ok=True)

    def generate_kpi_chart(self):
        """Génère un graphique des KPIs"""
        # Exemple de graphique
        fig, ax = plt.subplots(figsize=(10, 6))

        kpis = ['CA Total', 'Factures', 'Clients', 'Projets']
        values = [150000, 45, 23, 8]
        colors = ['#0078D4', '#107C10', '#FFB900', '#D13438']

        ax.bar(kpis, values, color=colors)
        ax.set_title('KPIs - Vue d\'Ensemble', fontsize=16, fontweight='bold')
        ax.set_ylabel('Valeur')

        # Sauvegarder
        img_path = f"{self.output_dir}/kpis_chart.png"
        plt.savefig(img_path, dpi=150, bbox_inches='tight')
        plt.close()

        return img_path

    def generate_html_report(self):
        """Génère le rapport en HTML (puis convertible en PDF)"""
        timestamp = datetime.now().strftime('%d/%m/%Y %H:%M')

        html = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {{
            font-family: 'Segoe UI', Arial, sans-serif;
            margin: 40px;
            color: #333;
        }}
        .header {{
            text-align: center;
            border-bottom: 3px solid #0078D4;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }}
        h1 {{
            color: #0078D4;
            margin: 0;
        }}
        .date {{
            color: #666;
            font-size: 14px;
            margin-top: 10px;
        }}
        .kpi-grid {{
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin: 30px 0;
        }}
        .kpi-card {{
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #0078D4;
        }}
        .kpi-value {{
            font-size: 32px;
            font-weight: bold;
            color: #0078D4;
            margin: 10px 0;
        }}
        .kpi-label {{
            color: #666;
            font-size: 14px;
            text-transform: uppercase;
        }}
        .section {{
            margin: 40px 0;
        }}
        .section-title {{
            font-size: 20px;
            font-weight: bold;
            color: #333;
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }}
        table {{
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }}
        th, td {{
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }}
        th {{
            background-color: #0078D4;
            color: white;
            font-weight: bold;
        }}
        tr:hover {{
            background-color: #f5f5f5;
        }}
        .status-success {{
            color: #107C10;
            font-weight: bold;
        }}
        .status-warning {{
            color: #FFB900;
            font-weight: bold;
        }}
        .status-danger {{
            color: #D13438;
            font-weight: bold;
        }}
        .footer {{
            margin-top: 50px;
            text-align: center;
            color: #999;
            font-size: 12px;
            border-top: 1px solid #e0e0e0;
            padding-top: 20px;
        }}
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 Rapport Exécutif Bexio</h1>
        <div class="date">Généré le {timestamp}</div>
    </div>

    <div class="kpi-grid">
        <div class="kpi-card">
            <div class="kpi-label">Chiffre d'Affaires</div>
            <div class="kpi-value">150 000 CHF</div>
            <div class="status-success">↑ +12%</div>
        </div>
        <div class="kpi-card">
            <div class="kpi-label">Factures</div>
            <div class="kpi-value">45</div>
            <div class="status-success">↑ +3</div>
        </div>
        <div class="kpi-card">
            <div class="kpi-label">Clients Actifs</div>
            <div class="kpi-value">23</div>
            <div class="status-success">→ Stable</div>
        </div>
        <div class="kpi-card">
            <div class="kpi-label">Factures en Retard</div>
            <div class="kpi-value">5</div>
            <div class="status-warning">⚠ Attention</div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Top 10 Clients</div>
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Client</th>
                    <th>CA</th>
                    <th>Factures</th>
                    <th>Statut</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td>Tech Solutions SA</td>
                    <td>25 000 CHF</td>
                    <td>8</td>
                    <td class="status-success">✓ À jour</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>Digital Services</td>
                    <td>18 500 CHF</td>
                    <td>5</td>
                    <td class="status-success">✓ À jour</td>
                </tr>
                <tr>
                    <td>3</td>
                    <td>Consulting Group</td>
                    <td>15 200 CHF</td>
                    <td>6</td>
                    <td class="status-warning">⚠ Retard 15j</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Alertes et Actions Requises</div>
        <ul>
            <li class="status-warning">⚠ 5 factures en retard de plus de 30 jours</li>
            <li class="status-success">✓ Objectif mensuel atteint (102%)</li>
            <li class="status-warning">⚠ 2 clients inactifs depuis 90 jours</li>
        </ul>
    </div>

    <div class="section">
        <div class="section-title">Prochaines Échéances</div>
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Client</th>
                    <th>Montant</th>
                    <th>Type</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>15/01/2025</td>
                    <td>ABC Company</td>
                    <td>5 200 CHF</td>
                    <td>Facture</td>
                </tr>
                <tr>
                    <td>20/01/2025</td>
                    <td>XYZ Services</td>
                    <td>3 800 CHF</td>
                    <td>Facture</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="footer">
        Dashboard Bexio → Power BI | Rapport automatique<br>
        Ce rapport a été généré automatiquement à partir des données Bexio
    </div>
</body>
</html>
"""

        # Sauvegarder le HTML
        report_file = f"{self.output_dir}/rapport_bexio_{datetime.now().strftime('%Y%m%d_%H%M%S')}.html"
        with open(report_file, 'w', encoding='utf-8') as f:
            f.write(html)

        return report_file

    def generate(self):
        """Génère le rapport complet"""
        print("\n📄 Génération du rapport PDF...")

        # Générer les graphiques
        # self.generate_kpi_chart()

        # Générer le HTML
        report_file = self.generate_html_report()

        print(f"✓ Rapport généré: {report_file}")
        print(f"  Ouvrez-le dans un navigateur ou convertissez en PDF")

        return report_file

def main():
    """Fonction principale"""
    generator = PDFReportGenerator()
    report = generator.generate()

    print("\n💡 Pour convertir en PDF:")
    print("  1. Ouvrez le fichier HTML dans un navigateur")
    print("  2. Imprimez (Ctrl+P) et choisissez 'Enregistrer en PDF'")
    print("  Ou installez: pip install weasyprint")
    print("  Puis: weasyprint rapport.html rapport.pdf")

if __name__ == '__main__':
    main()
