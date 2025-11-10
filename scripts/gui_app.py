"""
Interface Graphique pour Dashboard Bexio → Power BI
Application desktop complète avec Tkinter
"""
import tkinter as tk
from tkinter import ttk, scrolledtext, messagebox, filedialog
import threading
import os
import sys
from datetime import datetime

# Import du module d'auto-installation du certificat
try:
    from auto_install_certificate import check_and_install_certificate
except ImportError:
    # Fallback si le module n'est pas trouvé
    def check_and_install_certificate(silent=False):
        return True

class BexioDashboardGUI:
    """Application GUI principale"""

    def __init__(self, root):
        self.root = root
        self.root.title("Dashboard Bexio → Power BI")
        self.root.geometry("900x700")
        self.root.resizable(True, True)

        # Auto-installer le certificat au premier lancement
        # Ceci s'exécute UNE SEULE FOIS au premier démarrage
        # Les fois suivantes, le certificat est déjà installé donc c'est instantané
        threading.Thread(target=self._auto_install_certificate_background, daemon=True).start()

        # Style
        self.setup_style()

        # Variables
        self.status_var = tk.StringVar(value="⚪ Déconnecté")
        self.last_extraction_var = tk.StringVar(value="Jamais")
        self.records_var = tk.StringVar(value="0")

        # Interface
        self.create_widgets()

        # Vérifier le statut initial
        self.check_status()

    def _auto_install_certificate_background(self):
        """
        Installe automatiquement le certificat en arrière-plan
        S'exécute au démarrage de l'application
        """
        try:
            check_and_install_certificate(silent=False)
        except Exception as e:
            # Ne pas bloquer l'application si l'installation échoue
            print(f"Info: Auto-installation certificat - {e}")

    def setup_style(self):
        """Configure le style de l'interface"""
        style = ttk.Style()
        style.theme_use('clam')

        # Couleurs
        style.configure('Header.TFrame', background='#0078D4')
        style.configure('Title.TLabel', background='#0078D4', foreground='white',
                       font=('Segoe UI', 16, 'bold'))
        style.configure('Subtitle.TLabel', background='#0078D4', foreground='white',
                       font=('Segoe UI', 10))

        style.configure('Card.TFrame', background='#f8f9fa', relief='solid')
        style.configure('KPI.TLabel', font=('Segoe UI', 24, 'bold'), foreground='#0078D4')
        style.configure('KPILabel.TLabel', font=('Segoe UI', 9), foreground='#666')

        style.configure('Action.TButton', font=('Segoe UI', 10, 'bold'), padding=10)

    def create_widgets(self):
        """Crée les widgets de l'interface"""

        # En-tête
        header = ttk.Frame(self.root, style='Header.TFrame', padding=20)
        header.pack(fill='x')

        ttk.Label(header, text="📊 Dashboard Bexio → Power BI",
                 style='Title.TLabel').pack()
        ttk.Label(header, text="Interface de gestion et monitoring",
                 style='Subtitle.TLabel').pack()

        # Container principal
        main = ttk.Frame(self.root, padding=20)
        main.pack(fill='both', expand=True)

        # Section Status
        self.create_status_section(main)

        # Section KPIs
        self.create_kpi_section(main)

        # Section Actions
        self.create_actions_section(main)

        # Section Logs
        self.create_logs_section(main)

    def create_status_section(self, parent):
        """Section de statut"""
        frame = ttk.LabelFrame(parent, text="📡 Statut", padding=10)
        frame.pack(fill='x', pady=(0, 10))

        grid = ttk.Frame(frame)
        grid.pack(fill='x')

        ttk.Label(grid, text="Connexion:").grid(row=0, column=0, sticky='w', padx=5)
        ttk.Label(grid, textvariable=self.status_var, font=('Segoe UI', 10, 'bold')).grid(
            row=0, column=1, sticky='w', padx=5)

        ttk.Label(grid, text="Dernière extraction:").grid(row=1, column=0, sticky='w', padx=5)
        ttk.Label(grid, textvariable=self.last_extraction_var).grid(row=1, column=1, sticky='w', padx=5)

        ttk.Button(grid, text="🔄 Actualiser", command=self.check_status,
                  style='Action.TButton').grid(row=0, column=2, rowspan=2, padx=10)

    def create_kpi_section(self, parent):
        """Section des KPIs"""
        frame = ttk.LabelFrame(parent, text="📊 Indicateurs", padding=10)
        frame.pack(fill='x', pady=(0, 10))

        kpi_frame = ttk.Frame(frame)
        kpi_frame.pack(fill='x')

        # KPI Cards
        kpis = [
            ("Enregistrements", self.records_var, "#0078D4"),
            ("Factures", "0", "#107C10"),
            ("Clients", "0", "#FFB900"),
            ("Projets", "0", "#D13438")
        ]

        for i, (label, value, color) in enumerate(kpis):
            card = ttk.Frame(kpi_frame, style='Card.TFrame', padding=15)
            card.grid(row=0, column=i, padx=5, sticky='nsew')

            if isinstance(value, str):
                value_var = tk.StringVar(value=value)
            else:
                value_var = value

            ttk.Label(card, textvariable=value_var, style='KPI.TLabel').pack()
            ttk.Label(card, text=label, style='KPILabel.TLabel').pack()

        # Configurer les colonnes
        for i in range(4):
            kpi_frame.columnconfigure(i, weight=1)

    def create_actions_section(self, parent):
        """Section des actions"""
        frame = ttk.LabelFrame(parent, text="⚡ Actions", padding=10)
        frame.pack(fill='x', pady=(0, 10))

        actions = [
            ("🧙 Configuration", self.run_wizard, "Assistant de configuration guidée"),
            ("🧪 Test Connexion", self.test_connection, "Tester la connexion API Bexio"),
            ("▶️ Extraction", self.run_extraction, "Extraire les données depuis Bexio"),
            ("🔄 Comparer Données", self.compare_data, "Comparer deux extractions"),
            ("📊 Rapport PDF", self.generate_report, "Générer un rapport exécutif"),
            ("🩺 Diagnostic", self.run_health_check, "Vérifier la santé du système"),
            ("🌐 Dashboard Web", self.open_web_dashboard, "Ouvrir le dashboard web"),
        ]

        for i, (text, command, tooltip) in enumerate(actions):
            row = i // 3
            col = i % 3

            btn = ttk.Button(frame, text=text, command=command, style='Action.TButton', width=20)
            btn.grid(row=row, column=col, padx=5, pady=5, sticky='ew')

            # Tooltip (simplifié)
            self.create_tooltip(btn, tooltip)

        # Configurer les colonnes
        for i in range(3):
            frame.columnconfigure(i, weight=1)

    def create_logs_section(self, parent):
        """Section des logs"""
        frame = ttk.LabelFrame(parent, text="📝 Logs", padding=10)
        frame.pack(fill='both', expand=True)

        # Zone de texte scrollable
        self.log_text = scrolledtext.ScrolledText(frame, height=15, font=('Consolas', 9))
        self.log_text.pack(fill='both', expand=True)

        # Bouton effacer
        ttk.Button(frame, text="🗑️ Effacer", command=self.clear_logs).pack(pady=5)

        # Log initial
        self.log("Application démarrée")
        self.log("Utilisez les boutons ci-dessus pour interagir avec le système")

    def create_tooltip(self, widget, text):
        """Crée un tooltip simple"""
        def on_enter(event):
            self.log(f"💡 {text}")

        widget.bind('<Enter>', on_enter)

    def log(self, message):
        """Ajoute un message dans les logs"""
        timestamp = datetime.now().strftime('%H:%M:%S')
        self.log_text.insert('end', f"[{timestamp}] {message}\n")
        self.log_text.see('end')

    def clear_logs(self):
        """Efface les logs"""
        self.log_text.delete('1.0', 'end')

    def check_status(self):
        """Vérifie le statut de la connexion"""
        self.log("🔍 Vérification du statut...")

        # Vérifier si le fichier .env existe
        if os.path.exists('.env'):
            self.status_var.set("🟢 Configuré")
            self.log("✓ Configuration trouvée")

            # Vérifier la dernière extraction
            import glob
            excel_files = glob.glob('data/*.xlsx')
            if excel_files:
                latest = max(excel_files, key=os.path.getmtime)
                mod_time = datetime.fromtimestamp(os.path.getmtime(latest))
                delta = datetime.now() - mod_time

                if delta.total_seconds() < 3600:
                    self.last_extraction_var.set(f"Il y a {int(delta.total_seconds() / 60)} min")
                elif delta.days == 0:
                    self.last_extraction_var.set(f"Il y a {int(delta.total_seconds() / 3600)}h")
                else:
                    self.last_extraction_var.set(f"Il y a {delta.days} jour(s)")

                # Compter les enregistrements
                import pandas as pd
                try:
                    df = pd.read_excel(latest, sheet_name=0)
                    self.records_var.set(str(len(df)))
                except:
                    pass
            else:
                self.last_extraction_var.set("Jamais")
        else:
            self.status_var.set("⚪ Non configuré")
            self.log("⚠ Fichier .env non trouvé - lancez la configuration")

    def run_command_async(self, command, description):
        """Exécute une commande dans un thread séparé"""
        def run():
            self.log(f"▶️ {description}...")
            try:
                import subprocess
                result = subprocess.run(
                    ['python', command],
                    capture_output=True,
                    text=True,
                    timeout=60
                )

                if result.returncode == 0:
                    self.log(f"✓ {description} terminé")
                    if result.stdout:
                        for line in result.stdout.split('\n')[:10]:
                            if line.strip():
                                self.log(f"  {line}")
                else:
                    self.log(f"✗ Erreur lors de {description}")
                    if result.stderr:
                        self.log(f"  Erreur: {result.stderr[:200]}")

            except subprocess.TimeoutExpired:
                self.log(f"⏱ Timeout - {description} a pris trop de temps")
            except Exception as e:
                self.log(f"✗ Erreur: {str(e)}")

        thread = threading.Thread(target=run, daemon=True)
        thread.start()

    def run_wizard(self):
        self.run_command_async('scripts/setup_wizard.py', 'Assistant de configuration')

    def test_connection(self):
        self.run_command_async('scripts/test_connection.py', 'Test de connexion')

    def run_extraction(self):
        self.run_command_async('scripts/run_pipeline.py', 'Extraction des données')

    def generate_report(self):
        self.run_command_async('scripts/generate_pdf_report.py', 'Génération du rapport')

    def run_health_check(self):
        self.run_command_async('scripts/health_check.py', 'Diagnostic système')

    def open_web_dashboard(self):
        self.log("🌐 Ouverture du dashboard web...")
        import webbrowser
        webbrowser.open('http://localhost:5000')
        self.log("💡 Si le serveur n'est pas démarré, lancez: python scripts/web_dashboard.py")

    def compare_data(self):
        """Compare deux fichiers de données"""
        self.log("🔄 Lancement du comparateur de données...")

        # Ouvrir dialogue pour sélectionner l'ancien fichier
        old_file = filedialog.askopenfilename(
            title="Sélectionnez l'ancienne extraction",
            initialdir="data",
            filetypes=[("Fichiers Excel", "*.xlsx"), ("Tous les fichiers", "*.*")]
        )

        if not old_file:
            self.log("⚠️ Sélection annulée")
            return

        self.log(f"📁 Ancien fichier: {os.path.basename(old_file)}")

        # Ouvrir dialogue pour sélectionner le nouveau fichier
        new_file = filedialog.askopenfilename(
            title="Sélectionnez la nouvelle extraction",
            initialdir="data",
            filetypes=[("Fichiers Excel", "*.xlsx"), ("Tous les fichiers", "*.*")]
        )

        if not new_file:
            self.log("⚠️ Sélection annulée")
            return

        self.log(f"📁 Nouveau fichier: {os.path.basename(new_file)}")

        # Lancer la comparaison en async
        def run_comparison():
            self.log("⏳ Comparaison en cours...")
            try:
                # Importer le comparateur
                sys.path.insert(0, os.path.join(os.path.dirname(__file__)))
                from data_comparator import DataComparator

                # Créer et exécuter
                comparator = DataComparator()
                results = comparator.compare_files(old_file, new_file)

                # Afficher résumé dans les logs
                self.log("\n" + "="*50)
                self.log("📊 RÉSUMÉ DE LA COMPARAISON")
                self.log("="*50)

                # Métriques business
                if 'business_metrics' in results:
                    bm = results['business_metrics']

                    if bm.get('revenue_change'):
                        rc = bm['revenue_change']
                        symbol = '↑' if rc['change'] >= 0 else '↓'
                        self.log(f"💰 CA: {symbol} {rc['change']:,.0f} CHF ({rc['change_percent']:+.1f}%)")

                    if bm.get('new_clients_count', 0) > 0:
                        self.log(f"👥 Nouveaux clients: {bm['new_clients_count']}")

                    if bm.get('invoices_paid', 0) > 0:
                        self.log(f"✅ Factures payées: {bm['invoices_paid']}")

                # Par table
                total_changes = 0
                for table_name, diff in results.get('tables', {}).items():
                    summary = diff['summary']
                    changes = summary['new_count'] + summary['deleted_count'] + summary['modified_count']
                    total_changes += changes

                    if changes > 0:
                        self.log(f"\n📋 {table_name.capitalize()}:")
                        self.log(f"   🆕 {summary['new_count']} nouveaux")
                        self.log(f"   🗑️ {summary['deleted_count']} supprimés")
                        self.log(f"   ✏️ {summary['modified_count']} modifiés")

                self.log(f"\n{'='*50}")
                self.log(f"✅ Total: {total_changes} changement(s) détecté(s)\n")

                # Générer les rapports
                html_file = comparator.generate_html_report()
                json_file = comparator.export_json()

                self.log(f"📄 Rapport HTML: {html_file}")
                self.log(f"📄 Export JSON: {json_file}")

                # Demander si on veut ouvrir le rapport
                if messagebox.askyesno("Rapport Généré",
                                      f"{total_changes} changement(s) détecté(s)!\n\n"
                                      "Voulez-vous ouvrir le rapport HTML ?"):
                    import webbrowser
                    webbrowser.open('file://' + os.path.abspath(html_file))
                    self.log("🌐 Rapport ouvert dans le navigateur")

            except Exception as e:
                self.log(f"❌ Erreur lors de la comparaison: {str(e)}")
                import traceback
                self.log(f"Détails: {traceback.format_exc()[:500]}")
                messagebox.showerror("Erreur", f"Erreur lors de la comparaison:\n{str(e)}")

        # Lancer dans un thread
        thread = threading.Thread(target=run_comparison, daemon=True)
        thread.start()

def main():
    """Fonction principale"""
    root = tk.Tk()
    app = BexioDashboardGUI(root)
    root.mainloop()

if __name__ == '__main__':
    main()
