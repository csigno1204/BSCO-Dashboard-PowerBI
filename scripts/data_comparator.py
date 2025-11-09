#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Comparateur de Données - Dashboard Bexio Power BI
Compare deux extractions pour détecter les changements
"""

import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple, Any
import pandas as pd
import json


class DataComparator:
    """Compare deux extractions de données Bexio pour détecter les changements"""

    def __init__(self):
        self.diff_results = {}
        self.metrics = {}
        self.timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')

    def load_excel_file(self, file_path: str) -> Dict[str, pd.DataFrame]:
        """Charge un fichier Excel avec toutes ses feuilles"""
        try:
            if not os.path.exists(file_path):
                raise FileNotFoundError(f"Fichier non trouvé: {file_path}")

            # Charger toutes les feuilles
            excel_file = pd.ExcelFile(file_path)
            dataframes = {}

            for sheet_name in excel_file.sheet_names:
                df = pd.read_excel(file_path, sheet_name=sheet_name)
                dataframes[sheet_name] = df

            return dataframes

        except Exception as e:
            print(f"❌ Erreur chargement fichier {file_path}: {e}")
            raise

    def compare_dataframes(self, df_old: pd.DataFrame, df_new: pd.DataFrame,
                          id_column: str, table_name: str) -> Dict[str, Any]:
        """Compare deux DataFrames et retourne les différences"""

        diff = {
            'table': table_name,
            'new_records': [],
            'deleted_records': [],
            'modified_records': [],
            'unchanged_count': 0,
            'summary': {}
        }

        # Vérifier que la colonne ID existe
        if id_column not in df_old.columns or id_column not in df_new.columns:
            print(f"⚠️  Colonne ID '{id_column}' non trouvée dans {table_name}")
            return diff

        # Convertir les ID en set pour comparaison
        old_ids = set(df_old[id_column].dropna())
        new_ids = set(df_new[id_column].dropna())

        # Nouveaux enregistrements
        new_record_ids = new_ids - old_ids
        if len(new_record_ids) > 0:
            new_records = df_new[df_new[id_column].isin(new_record_ids)]
            diff['new_records'] = new_records.to_dict('records')

        # Enregistrements supprimés
        deleted_record_ids = old_ids - new_ids
        if len(deleted_record_ids) > 0:
            deleted_records = df_old[df_old[id_column].isin(deleted_record_ids)]
            diff['deleted_records'] = deleted_records.to_dict('records')

        # Enregistrements potentiellement modifiés (présents dans les deux)
        common_ids = old_ids & new_ids

        modified_count = 0
        unchanged_count = 0

        for record_id in common_ids:
            old_record = df_old[df_old[id_column] == record_id].iloc[0]
            new_record = df_new[df_new[id_column] == record_id].iloc[0]

            # Comparer les valeurs
            changes = {}
            for column in df_old.columns:
                if column in df_new.columns:
                    old_val = old_record[column]
                    new_val = new_record[column]

                    # Gérer les NaN
                    if pd.isna(old_val) and pd.isna(new_val):
                        continue

                    if old_val != new_val:
                        changes[column] = {
                            'old': str(old_val) if not pd.isna(old_val) else None,
                            'new': str(new_val) if not pd.isna(new_val) else None
                        }

            if changes:
                diff['modified_records'].append({
                    id_column: record_id,
                    'changes': changes
                })
                modified_count += 1
            else:
                unchanged_count += 1

        diff['unchanged_count'] = unchanged_count

        # Résumé
        diff['summary'] = {
            'total_old': len(df_old),
            'total_new': len(df_new),
            'new_count': len(new_record_ids),
            'deleted_count': len(deleted_record_ids),
            'modified_count': modified_count,
            'unchanged_count': unchanged_count
        }

        return diff

    def compare_files(self, old_file: str, new_file: str) -> Dict[str, Any]:
        """Compare deux fichiers Excel complets"""

        print(f"\n🔍 Comparaison de données")
        print(f"{'='*60}")
        print(f"📁 Ancien: {os.path.basename(old_file)}")
        print(f"📁 Nouveau: {os.path.basename(new_file)}")
        print(f"{'='*60}\n")

        # Charger les fichiers
        old_data = self.load_excel_file(old_file)
        new_data = self.load_excel_file(new_file)

        # Configuration des colonnes ID par table
        id_columns = {
            'contacts': 'ContactID',
            'invoices': 'InvoiceID',
            'quotes': 'QuoteID',
            'projects': 'ProjectID',
            'timesheets': 'TimesheetID'
        }

        results = {
            'comparison_date': datetime.now().isoformat(),
            'old_file': os.path.basename(old_file),
            'new_file': os.path.basename(new_file),
            'tables': {}
        }

        # Comparer chaque table
        for table_name in old_data.keys():
            if table_name in new_data:
                id_col = id_columns.get(table_name, 'id')

                print(f"📊 Comparaison table: {table_name}")

                diff = self.compare_dataframes(
                    old_data[table_name],
                    new_data[table_name],
                    id_col,
                    table_name
                )

                results['tables'][table_name] = diff

                # Afficher résumé
                summary = diff['summary']
                print(f"   • {summary['total_old']} → {summary['total_new']} enregistrements")
                print(f"   • 🆕 {summary['new_count']} nouveaux")
                print(f"   • 🗑️  {summary['deleted_count']} supprimés")
                print(f"   • ✏️  {summary['modified_count']} modifiés")
                print(f"   • ✓ {summary['unchanged_count']} inchangés\n")

        # Calculer métriques business
        self._calculate_business_metrics(results, old_data, new_data)

        self.diff_results = results
        return results

    def _calculate_business_metrics(self, results: Dict, old_data: Dict, new_data: Dict):
        """Calcule des métriques métier importantes"""

        metrics = {
            'revenue_change': None,
            'new_clients_count': 0,
            'invoices_paid': 0,
            'overdue_change': 0
        }

        # Évolution du CA (factures)
        if 'invoices' in old_data and 'invoices' in new_data:
            old_invoices = old_data['invoices']
            new_invoices = new_data['invoices']

            if 'Total' in old_invoices.columns and 'Total' in new_invoices.columns:
                old_revenue = old_invoices['Total'].sum()
                new_revenue = new_invoices['Total'].sum()
                revenue_change = new_revenue - old_revenue

                metrics['revenue_change'] = {
                    'old': float(old_revenue),
                    'new': float(new_revenue),
                    'change': float(revenue_change),
                    'change_percent': float((revenue_change / old_revenue * 100) if old_revenue > 0 else 0)
                }

        # Nouveaux clients
        if 'contacts' in results['tables']:
            metrics['new_clients_count'] = results['tables']['contacts']['summary']['new_count']

        # Factures payées (si statut change)
        if 'invoices' in results['tables']:
            invoices_diff = results['tables']['invoices']
            paid_count = 0

            for modified in invoices_diff['modified_records']:
                if 'changes' in modified and 'Status' in modified['changes']:
                    old_status = modified['changes']['Status']['old']
                    new_status = modified['changes']['Status']['new']
                    if new_status in ['Paid', 'Payé', 'paid']:
                        paid_count += 1

            metrics['invoices_paid'] = paid_count

        results['business_metrics'] = metrics

    def generate_html_report(self, output_dir: str = "reports") -> str:
        """Génère un rapport HTML des différences"""

        if not self.diff_results:
            print("⚠️  Aucune comparaison effectuée")
            return None

        os.makedirs(output_dir, exist_ok=True)

        html_file = os.path.join(output_dir, f"comparison_report_{self.timestamp}.html")

        html_content = """
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rapport de Comparaison - Dashboard Bexio</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            color: #333;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 { font-size: 2.5em; margin-bottom: 10px; }
        .header p { font-size: 1.1em; opacity: 0.9; }
        .content { padding: 30px; }
        .summary-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .card {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .card h3 { font-size: 0.9em; color: #666; margin-bottom: 10px; text-transform: uppercase; }
        .card .value { font-size: 2em; font-weight: bold; color: #667eea; }
        .card .change { font-size: 0.9em; margin-top: 5px; }
        .card.positive .change { color: #10b981; }
        .card.negative .change { color: #ef4444; }
        .table-section { margin-bottom: 30px; }
        .table-section h2 {
            font-size: 1.5em;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #667eea;
            color: #667eea;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            background: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        th {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
        }
        td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
        tr:hover { background: #f9fafb; }
        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: 600;
        }
        .badge-new { background: #d1fae5; color: #065f46; }
        .badge-deleted { background: #fee2e2; color: #991b1b; }
        .badge-modified { background: #fef3c7; color: #92400e; }
        .badge-unchanged { background: #e0e7ff; color: #3730a3; }
        .details { font-size: 0.9em; color: #666; }
        .footer {
            background: #f9fafb;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Rapport de Comparaison</h1>
            <p>Dashboard Bexio → Power BI</p>
            <p style="font-size: 0.9em; margin-top: 10px;">
                {old_file} ➔ {new_file}
            </p>
        </div>

        <div class="content">
            <div class="summary-cards">
                {business_metrics}
            </div>

            {tables_html}
        </div>

        <div class="footer">
            <p>Généré le {date} par Dashboard Bexio Power BI</p>
            <p>© 2025 BSCO Solutions</p>
        </div>
    </div>
</body>
</html>
"""

        # Générer cartes métriques business
        metrics_html = ""
        if 'business_metrics' in self.diff_results:
            bm = self.diff_results['business_metrics']

            # CA
            if bm.get('revenue_change'):
                rc = bm['revenue_change']
                change_class = 'positive' if rc['change'] >= 0 else 'negative'
                change_symbol = '↑' if rc['change'] >= 0 else '↓'
                metrics_html += f"""
                <div class="card {change_class}">
                    <h3>Évolution CA</h3>
                    <div class="value">{rc['change']:,.0f} CHF</div>
                    <div class="change">{change_symbol} {abs(rc['change_percent']):.1f}%</div>
                </div>
                """

            # Nouveaux clients
            if bm.get('new_clients_count', 0) > 0:
                metrics_html += f"""
                <div class="card positive">
                    <h3>Nouveaux Clients</h3>
                    <div class="value">{bm['new_clients_count']}</div>
                    <div class="change">🆕 Ajoutés</div>
                </div>
                """

            # Factures payées
            if bm.get('invoices_paid', 0) > 0:
                metrics_html += f"""
                <div class="card positive">
                    <h3>Factures Payées</h3>
                    <div class="value">{bm['invoices_paid']}</div>
                    <div class="change">✓ Encaissées</div>
                </div>
                """

        # Générer sections pour chaque table
        tables_html = ""
        for table_name, diff in self.diff_results.get('tables', {}).items():
            summary = diff['summary']

            if summary['new_count'] + summary['deleted_count'] + summary['modified_count'] == 0:
                continue  # Pas de changements, on saute

            tables_html += f"""
            <div class="table-section">
                <h2>{table_name.capitalize()}</h2>
                <table>
                    <tr>
                        <th>Type de Changement</th>
                        <th>Nombre</th>
                        <th>Détails</th>
                    </tr>
            """

            if summary['new_count'] > 0:
                tables_html += f"""
                    <tr>
                        <td><span class="badge badge-new">🆕 Nouveaux</span></td>
                        <td><strong>{summary['new_count']}</strong></td>
                        <td class="details">Enregistrements ajoutés</td>
                    </tr>
                """

            if summary['deleted_count'] > 0:
                tables_html += f"""
                    <tr>
                        <td><span class="badge badge-deleted">🗑️ Supprimés</span></td>
                        <td><strong>{summary['deleted_count']}</strong></td>
                        <td class="details">Enregistrements supprimés</td>
                    </tr>
                """

            if summary['modified_count'] > 0:
                tables_html += f"""
                    <tr>
                        <td><span class="badge badge-modified">✏️ Modifiés</span></td>
                        <td><strong>{summary['modified_count']}</strong></td>
                        <td class="details">Enregistrements modifiés</td>
                    </tr>
                """

            if summary['unchanged_count'] > 0:
                tables_html += f"""
                    <tr>
                        <td><span class="badge badge-unchanged">✓ Inchangés</span></td>
                        <td><strong>{summary['unchanged_count']}</strong></td>
                        <td class="details">Aucune modification</td>
                    </tr>
                """

            tables_html += """
                </table>
            </div>
            """

        # Remplir le template
        html_content = html_content.format(
            old_file=self.diff_results['old_file'],
            new_file=self.diff_results['new_file'],
            business_metrics=metrics_html,
            tables_html=tables_html,
            date=datetime.now().strftime('%d/%m/%Y %H:%M')
        )

        # Écrire le fichier
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(html_content)

        print(f"✅ Rapport HTML généré: {html_file}")
        return html_file

    def export_json(self, output_dir: str = "reports") -> str:
        """Exporte les résultats en JSON"""

        if not self.diff_results:
            print("⚠️  Aucune comparaison effectuée")
            return None

        os.makedirs(output_dir, exist_ok=True)

        json_file = os.path.join(output_dir, f"comparison_{self.timestamp}.json")

        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(self.diff_results, f, indent=2, ensure_ascii=False, default=str)

        print(f"✅ Résultats JSON exportés: {json_file}")
        return json_file

    def print_summary(self):
        """Affiche un résumé dans la console"""

        if not self.diff_results:
            print("⚠️  Aucune comparaison effectuée")
            return

        print(f"\n{'='*60}")
        print("📊 RÉSUMÉ DE LA COMPARAISON")
        print(f"{'='*60}\n")

        # Métriques business
        if 'business_metrics' in self.diff_results:
            bm = self.diff_results['business_metrics']

            print("💰 Métriques Business:")

            if bm.get('revenue_change'):
                rc = bm['revenue_change']
                symbol = '↑' if rc['change'] >= 0 else '↓'
                print(f"   • CA: {rc['old']:,.0f} CHF → {rc['new']:,.0f} CHF")
                print(f"   • Évolution: {symbol} {rc['change']:,.0f} CHF ({rc['change_percent']:+.1f}%)")

            if bm.get('new_clients_count', 0) > 0:
                print(f"   • Nouveaux clients: {bm['new_clients_count']}")

            if bm.get('invoices_paid', 0) > 0:
                print(f"   • Factures payées: {bm['invoices_paid']}")

            print()

        # Par table
        print("📋 Changements par Table:")
        for table_name, diff in self.diff_results.get('tables', {}).items():
            summary = diff['summary']
            total_changes = summary['new_count'] + summary['deleted_count'] + summary['modified_count']

            if total_changes > 0:
                print(f"\n   {table_name.capitalize()}:")
                print(f"      🆕 {summary['new_count']} nouveaux")
                print(f"      🗑️  {summary['deleted_count']} supprimés")
                print(f"      ✏️  {summary['modified_count']} modifiés")
                print(f"      ✓ {summary['unchanged_count']} inchangés")

        print(f"\n{'='*60}\n")


def main():
    """Fonction principale pour utilisation CLI"""

    if len(sys.argv) < 3:
        print("\n📊 Comparateur de Données - Dashboard Bexio")
        print("=" * 60)
        print("\nUsage:")
        print("  python data_comparator.py <ancien_fichier.xlsx> <nouveau_fichier.xlsx>")
        print("\nExemple:")
        print("  python data_comparator.py data/bexio_20250101.xlsx data/bexio_20250115.xlsx")
        print()
        sys.exit(1)

    old_file = sys.argv[1]
    new_file = sys.argv[2]

    # Créer le comparateur
    comparator = DataComparator()

    try:
        # Comparer
        results = comparator.compare_files(old_file, new_file)

        # Afficher résumé
        comparator.print_summary()

        # Générer rapports
        comparator.generate_html_report()
        comparator.export_json()

        print("✅ Comparaison terminée avec succès!")

    except Exception as e:
        print(f"❌ Erreur lors de la comparaison: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
