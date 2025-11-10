"""
Application Web Locale - Dashboard Bexio → Power BI

Backend Flask pour interface web moderne.
Lance sur localhost:8000 par défaut.
"""

import sys
import os
from pathlib import Path

# Ajouter le répertoire parent au path pour imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from flask import Flask, render_template, jsonify, request, send_file
from datetime import datetime
import threading
import webbrowser
import time

# Imports des scripts existants
from scripts.bexio_extractor import BexioExtractor
import pandas as pd

app = Flask(__name__)
app.config['SECRET_KEY'] = 'bexio-dashboard-secret-key-2024'

# État global de l'application
app_state = {
    'api_key': None,
    'last_sync': None,
    'status': 'idle',
    'progress': 0,
    'message': '',
    'stats': {
        'contacts': 0,
        'invoices': 0,
        'projects': 0,
        'total_revenue': 0
    }
}


@app.route('/')
def index():
    """Page principale de l'application"""
    return render_template('index.html')


@app.route('/api/status')
def get_status():
    """Obtenir le statut actuel de l'application"""
    return jsonify(app_state)


@app.route('/api/config', methods=['GET', 'POST'])
def config():
    """Configuration de l'API Bexio"""
    if request.method == 'POST':
        data = request.json
        api_key = data.get('api_key')

        if not api_key:
            return jsonify({'error': 'API key is required'}), 400

        # Sauvegarder la clé API dans les variables d'environnement pour BexioExtractor
        os.environ['BEXIO_API_TOKEN'] = api_key
        app_state['api_key'] = api_key

        # Tester la connexion
        try:
            extractor = BexioExtractor()
            # Test simple - essayer d'extraire les contacts (vide c'est ok)
            extractor.extract_contacts()

            app_state['status'] = 'configured'
            app_state['message'] = 'Configuration réussie !'

            return jsonify({
                'success': True,
                'message': 'API key configured successfully'
            })
        except Exception as e:
            app_state['status'] = 'error'
            app_state['message'] = f'Erreur de connexion : {str(e)}'
            return jsonify({
                'error': f'Invalid API key: {str(e)}'
            }), 400

    # GET - Retourner la config actuelle (sans la clé complète)
    return jsonify({
        'configured': app_state['api_key'] is not None,
        'api_key_preview': app_state['api_key'][:10] + '...' if app_state['api_key'] else None
    })


@app.route('/api/sync', methods=['POST'])
def sync_data():
    """Synchroniser les données de Bexio"""
    if not app_state['api_key']:
        return jsonify({'error': 'API key not configured'}), 400

    # Lancer la synchronisation dans un thread séparé
    thread = threading.Thread(target=run_sync)
    thread.daemon = True
    thread.start()

    return jsonify({
        'success': True,
        'message': 'Synchronization started'
    })


def run_sync():
    """Exécuter la synchronisation (dans un thread)"""
    try:
        app_state['status'] = 'syncing'
        app_state['progress'] = 0
        app_state['message'] = 'Initialisation...'

        # S'assurer que l'API key est dans l'environnement
        os.environ['BEXIO_API_TOKEN'] = app_state['api_key']

        # Initialiser l'extracteur
        extractor = BexioExtractor()

        # Étape 1 : Extraction des données
        app_state['progress'] = 20
        app_state['message'] = 'Extraction des contacts...'
        contacts = extractor.extract_contacts()
        app_state['stats']['contacts'] = len(contacts) if contacts else 0

        app_state['progress'] = 40
        app_state['message'] = 'Extraction des factures...'
        invoices = extractor.extract_invoices()
        app_state['stats']['invoices'] = len(invoices) if invoices else 0

        app_state['progress'] = 60
        app_state['message'] = 'Extraction des projets...'
        projects = extractor.extract_projects()
        app_state['stats']['projects'] = len(projects) if projects else 0

        # Étape 2 : Conversion en DataFrames
        app_state['progress'] = 75
        app_state['message'] = 'Préparation des données...'

        df_contacts = pd.DataFrame(contacts) if contacts else pd.DataFrame()
        df_invoices = pd.DataFrame(invoices) if invoices else pd.DataFrame()
        df_projects = pd.DataFrame(projects) if projects else pd.DataFrame()

        # Calculer le CA total
        if not df_invoices.empty:
            if 'total' in df_invoices.columns:
                app_state['stats']['total_revenue'] = float(df_invoices['total'].sum())
            elif 'total_gross' in df_invoices.columns:
                app_state['stats']['total_revenue'] = float(df_invoices['total_gross'].sum())

        # Étape 3 : Export vers Excel
        app_state['progress'] = 90
        app_state['message'] = 'Export vers Excel...'

        # Créer le fichier Excel
        output_dir = Path(__file__).parent.parent / 'output'
        output_dir.mkdir(exist_ok=True)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        output_path = output_dir / f'bexio_data_{timestamp}.xlsx'

        # Exporter chaque DataFrame dans une feuille différente
        with pd.ExcelWriter(output_path, engine='openpyxl') as writer:
            if not df_contacts.empty:
                df_contacts.to_excel(writer, sheet_name='Contacts', index=False)
            if not df_invoices.empty:
                df_invoices.to_excel(writer, sheet_name='Factures', index=False)
            if not df_projects.empty:
                df_projects.to_excel(writer, sheet_name='Projets', index=False)

        # Terminé
        app_state['progress'] = 100
        app_state['status'] = 'success'
        app_state['message'] = f'Synchronisation terminée ! Fichier : {output_path.name}'
        app_state['last_sync'] = datetime.now().isoformat()

    except Exception as e:
        app_state['status'] = 'error'
        app_state['message'] = f'Erreur : {str(e)}'
        app_state['progress'] = 0
        import traceback
        traceback.print_exc()


@app.route('/api/download')
def download_file():
    """Télécharger le dernier fichier Excel généré"""
    # Trouver le fichier le plus récent dans output/
    output_dir = Path(__file__).parent.parent / 'output'

    if not output_dir.exists():
        return jsonify({'error': 'No output directory found'}), 404

    # Chercher les fichiers Excel
    excel_files = list(output_dir.glob('*.xlsx'))

    if not excel_files:
        return jsonify({'error': 'No Excel file found'}), 404

    # Prendre le plus récent
    latest_file = max(excel_files, key=lambda f: f.stat().st_mtime)

    return send_file(
        latest_file,
        as_attachment=True,
        download_name=latest_file.name
    )


@app.route('/api/stats')
def get_stats():
    """Obtenir les statistiques"""
    return jsonify(app_state['stats'])


def open_browser(port=8000):
    """Ouvrir le navigateur après un court délai"""
    time.sleep(1.5)  # Attendre que le serveur démarre
    webbrowser.open(f'http://localhost:{port}')


def run_webapp(port=8000, open_browser_on_start=True):
    """Lancer l'application web"""
    print(f"""
    ╔══════════════════════════════════════════════════════════════╗
    ║                                                              ║
    ║        Dashboard Bexio → Power BI - Web Application         ║
    ║                                                              ║
    ╚══════════════════════════════════════════════════════════════╝

    🌐 Application web lancée sur : http://localhost:{port}

    ⚙️  Pour arrêter : Ctrl+C

    """)

    if open_browser_on_start:
        # Ouvrir le navigateur dans un thread séparé
        browser_thread = threading.Thread(target=open_browser, args=(port,))
        browser_thread.daemon = True
        browser_thread.start()

    # Lancer Flask
    app.run(
        host='127.0.0.1',
        port=port,
        debug=False,
        use_reloader=False
    )


if __name__ == '__main__':
    run_webapp()
