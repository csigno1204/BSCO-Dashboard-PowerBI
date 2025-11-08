"""
Système de logging centralisé pour toutes les opérations
"""
import os
import json
import logging
from datetime import datetime
from pathlib import Path

class ExtractionLogger:
    """Gestionnaire de logs pour les extractions"""

    def __init__(self, logs_dir="logs"):
        self.logs_dir = logs_dir
        os.makedirs(logs_dir, exist_ok=True)

        # Configuration du logger Python standard
        self.logger = logging.getLogger("BexioDashboard")
        self.logger.setLevel(logging.INFO)

        # Handler pour fichier
        log_file = os.path.join(logs_dir, f"extraction_{datetime.now().strftime('%Y%m%d')}.log")
        file_handler = logging.FileHandler(log_file, encoding='utf-8')
        file_handler.setLevel(logging.INFO)

        # Format
        formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
        file_handler.setFormatter(formatter)

        # Éviter les doublons
        if not self.logger.handlers:
            self.logger.addHandler(file_handler)

        # Fichier d'historique JSON
        self.history_file = os.path.join(logs_dir, "extraction_history.json")

    def log_extraction_start(self, endpoints):
        """Log le démarrage d'une extraction"""
        self.logger.info(f"Démarrage extraction - Endpoints: {', '.join(endpoints)}")

    def log_extraction_success(self, endpoint, count, duration):
        """Log le succès d'une extraction"""
        self.logger.info(f"✓ {endpoint}: {count} enregistrements extraits en {duration:.2f}s")

    def log_extraction_error(self, endpoint, error):
        """Log une erreur d'extraction"""
        self.logger.error(f"✗ {endpoint}: Erreur - {str(error)}")

    def log_extraction_complete(self, total_records, total_duration, output_file):
        """Log la fin complète de l'extraction"""
        self.logger.info(f"Extraction terminée: {total_records} enregistrements en {total_duration:.2f}s")
        self.logger.info(f"Fichier généré: {output_file}")

        # Sauvegarder dans l'historique JSON
        self._save_to_history(total_records, total_duration, output_file, success=True)

    def log_extraction_failed(self, error):
        """Log un échec complet"""
        self.logger.error(f"Extraction échouée: {str(error)}")
        self._save_to_history(0, 0, None, success=False, error=str(error))

    def _save_to_history(self, records, duration, output_file, success=True, error=None):
        """Sauvegarde l'entrée dans l'historique JSON"""
        history = []

        # Charger l'historique existant
        if os.path.exists(self.history_file):
            try:
                with open(self.history_file, 'r', encoding='utf-8') as f:
                    history = json.load(f)
            except:
                history = []

        # Ajouter la nouvelle entrée
        entry = {
            "timestamp": datetime.now().isoformat(),
            "success": success,
            "records": records,
            "duration": duration,
            "output_file": output_file,
            "error": error
        }

        history.append(entry)

        # Garder seulement les 100 dernières entrées
        history = history[-100:]

        # Sauvegarder
        with open(self.history_file, 'w', encoding='utf-8') as f:
            json.dump(history, f, indent=2, ensure_ascii=False)

    def get_history(self, limit=10):
        """Récupère l'historique des extractions"""
        if not os.path.exists(self.history_file):
            return []

        with open(self.history_file, 'r', encoding='utf-8') as f:
            history = json.load(f)

        return history[-limit:][::-1]  # Les plus récentes en premier
