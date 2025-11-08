"""
Script d'extraction des données depuis l'API Bexio
"""
import os
import requests
import json
from datetime import datetime, timedelta
from dotenv import load_dotenv
from typing import Dict, List, Any

# Charger les variables d'environnement
load_dotenv()

class BexioExtractor:
    """Classe pour extraire les données depuis l'API Bexio"""

    def __init__(self):
        self.api_token = os.getenv('BEXIO_API_TOKEN')
        self.base_url = 'https://api.bexio.com/2.0'
        self.headers = {
            'Accept': 'application/json',
            'Authorization': f'Bearer {self.api_token}'
        }

        if not self.api_token:
            raise ValueError("BEXIO_API_TOKEN non défini dans .env")

    def _make_request(self, endpoint: str, params: Dict = None) -> List[Dict]:
        """
        Effectue une requête à l'API Bexio

        Args:
            endpoint: L'endpoint de l'API (ex: 'contact')
            params: Paramètres optionnels de la requête

        Returns:
            Liste de dictionnaires contenant les données
        """
        url = f"{self.base_url}/{endpoint}"

        try:
            response = requests.get(url, headers=self.headers, params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Erreur lors de la requête {endpoint}: {e}")
            return []

    def extract_contacts(self) -> List[Dict]:
        """Extrait tous les contacts"""
        print("Extraction des contacts...")
        return self._make_request('contact')

    def extract_invoices(self, days: int = 365) -> List[Dict]:
        """
        Extrait les factures

        Args:
            days: Nombre de jours dans le passé à extraire
        """
        print(f"Extraction des factures (derniers {days} jours)...")
        return self._make_request('kb_invoice')

    def extract_quotes(self, days: int = 365) -> List[Dict]:
        """
        Extrait les devis

        Args:
            days: Nombre de jours dans le passé à extraire
        """
        print(f"Extraction des devis (derniers {days} jours)...")
        return self._make_request('kb_offer')

    def extract_orders(self, days: int = 365) -> List[Dict]:
        """
        Extrait les commandes

        Args:
            days: Nombre de jours dans le passé à extraire
        """
        print(f"Extraction des commandes (derniers {days} jours)...")
        return self._make_request('kb_order')

    def extract_projects(self) -> List[Dict]:
        """Extrait les projets"""
        print("Extraction des projets...")
        return self._make_request('pr_project')

    def extract_timesheets(self, days: int = 365) -> List[Dict]:
        """
        Extrait les feuilles de temps

        Args:
            days: Nombre de jours dans le passé à extraire
        """
        print(f"Extraction des feuilles de temps (derniers {days} jours)...")
        return self._make_request('timesheet')

    def extract_articles(self) -> List[Dict]:
        """Extrait les articles/produits"""
        print("Extraction des articles...")
        return self._make_request('article')

    def extract_all(self, endpoints: List[str] = None, days: int = 365) -> Dict[str, List[Dict]]:
        """
        Extrait toutes les données spécifiées

        Args:
            endpoints: Liste des endpoints à extraire
            days: Nombre de jours pour les données temporelles

        Returns:
            Dictionnaire avec les données extraites
        """
        if endpoints is None:
            endpoints = ['contacts', 'invoices', 'quotes', 'projects']

        data = {}

        endpoint_methods = {
            'contacts': self.extract_contacts,
            'invoices': lambda: self.extract_invoices(days),
            'quotes': lambda: self.extract_quotes(days),
            'orders': lambda: self.extract_orders(days),
            'projects': self.extract_projects,
            'timesheets': lambda: self.extract_timesheets(days),
            'articles': self.extract_articles
        }

        for endpoint in endpoints:
            if endpoint in endpoint_methods:
                data[endpoint] = endpoint_methods[endpoint]()
            else:
                print(f"Avertissement: endpoint '{endpoint}' non reconnu")

        return data

    def save_to_json(self, data: Dict[str, List[Dict]], output_dir: str = 'data'):
        """
        Sauvegarde les données en JSON

        Args:
            data: Dictionnaire contenant les données
            output_dir: Répertoire de sortie
        """
        os.makedirs(output_dir, exist_ok=True)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')

        for endpoint, records in data.items():
            filename = f"{output_dir}/{endpoint}_{timestamp}.json"
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(records, f, ensure_ascii=False, indent=2)
            print(f"✓ {len(records)} enregistrement(s) sauvegardé(s) dans {filename}")


def main():
    """Fonction principale"""
    print("=== Extracteur de données Bexio ===\n")

    # Configuration
    endpoints_str = os.getenv('BEXIO_ENDPOINTS', 'contacts,invoices,quotes,projects')
    endpoints = [e.strip() for e in endpoints_str.split(',')]
    days = int(os.getenv('EXTRACTION_DAYS', '365'))

    print(f"Endpoints à extraire: {', '.join(endpoints)}")
    print(f"Période d'extraction: {days} jours\n")

    # Extraction
    extractor = BexioExtractor()
    data = extractor.extract_all(endpoints, days)

    # Sauvegarde
    extractor.save_to_json(data)

    print("\n✓ Extraction terminée avec succès!")


if __name__ == '__main__':
    main()
