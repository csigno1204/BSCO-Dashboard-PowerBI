"""
Script de transformation des données Bexio vers format Power BI
Convertit les fichiers JSON en fichiers Excel optimisés pour Power BI
"""
import os
import json
import pandas as pd
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any
import glob


class BexioTransformer:
    """Transforme les données Bexio en format Power BI"""

    def __init__(self, input_dir: str = 'data', output_dir: str = 'data'):
        self.input_dir = input_dir
        self.output_dir = output_dir

    def get_latest_json_files(self) -> Dict[str, str]:
        """
        Récupère les fichiers JSON les plus récents pour chaque endpoint

        Returns:
            Dictionnaire {endpoint: chemin_fichier}
        """
        json_files = glob.glob(f"{self.input_dir}/*.json")
        latest_files = {}

        for file_path in json_files:
            filename = os.path.basename(file_path)
            # Format: endpoint_timestamp.json
            endpoint = '_'.join(filename.split('_')[:-2]) if '_' in filename else filename.replace('.json', '')

            if endpoint not in latest_files or file_path > latest_files[endpoint]:
                latest_files[endpoint] = file_path

        return latest_files

    def transform_contacts(self, data: List[Dict]) -> pd.DataFrame:
        """Transforme les contacts pour Power BI"""
        if not data:
            return pd.DataFrame()

        df = pd.DataFrame(data)

        # Colonnes importantes pour les contacts
        columns_mapping = {
            'id': 'ContactID',
            'nr': 'ContactNumber',
            'name_1': 'CompanyName',
            'name_2': 'ContactName',
            'email': 'Email',
            'phone_fixed': 'PhoneFixed',
            'phone_mobile': 'PhoneMobile',
            'address': 'Address',
            'postcode': 'PostalCode',
            'city': 'City',
            'country_id': 'CountryID',
            'owner_id': 'OwnerID',
            'user_id': 'UserID'
        }

        # Sélectionner et renommer les colonnes disponibles
        available_cols = {k: v for k, v in columns_mapping.items() if k in df.columns}
        df = df[list(available_cols.keys())].rename(columns=available_cols)

        return df

    def transform_invoices(self, data: List[Dict]) -> pd.DataFrame:
        """Transforme les factures pour Power BI"""
        if not data:
            return pd.DataFrame()

        df = pd.DataFrame(data)

        # Colonnes importantes pour les factures
        columns_mapping = {
            'id': 'InvoiceID',
            'document_nr': 'InvoiceNumber',
            'title': 'Title',
            'contact_id': 'ContactID',
            'user_id': 'UserID',
            'project_id': 'ProjectID',
            'is_valid_from': 'InvoiceDate',
            'is_valid_to': 'DueDate',
            'total_gross': 'TotalGross',
            'total_net': 'TotalNet',
            'total': 'Total',
            'kb_item_status_id': 'StatusID',
            'currency_id': 'CurrencyID',
            'mwst_type': 'VATType',
            'mwst_is_net': 'VATIsNet',
            'show_position_taxes': 'ShowPositionTaxes'
        }

        available_cols = {k: v for k, v in columns_mapping.items() if k in df.columns}
        df = df[list(available_cols.keys())].rename(columns=available_cols)

        # Convertir les dates
        date_columns = ['InvoiceDate', 'DueDate']
        for col in date_columns:
            if col in df.columns:
                df[col] = pd.to_datetime(df[col], errors='coerce')

        # Convertir les montants en numérique
        amount_columns = ['TotalGross', 'TotalNet', 'Total']
        for col in amount_columns:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors='coerce')

        return df

    def transform_quotes(self, data: List[Dict]) -> pd.DataFrame:
        """Transforme les devis pour Power BI"""
        if not data:
            return pd.DataFrame()

        df = pd.DataFrame(data)

        columns_mapping = {
            'id': 'QuoteID',
            'document_nr': 'QuoteNumber',
            'title': 'Title',
            'contact_id': 'ContactID',
            'user_id': 'UserID',
            'project_id': 'ProjectID',
            'is_valid_from': 'QuoteDate',
            'is_valid_until': 'ValidUntil',
            'total_gross': 'TotalGross',
            'total_net': 'TotalNet',
            'total': 'Total',
            'kb_item_status_id': 'StatusID',
            'currency_id': 'CurrencyID'
        }

        available_cols = {k: v for k, v in columns_mapping.items() if k in df.columns}
        df = df[list(available_cols.keys())].rename(columns=available_cols)

        # Convertir les dates
        date_columns = ['QuoteDate', 'ValidUntil']
        for col in date_columns:
            if col in df.columns:
                df[col] = pd.to_datetime(df[col], errors='coerce')

        # Convertir les montants
        amount_columns = ['TotalGross', 'TotalNet', 'Total']
        for col in amount_columns:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors='coerce')

        return df

    def transform_projects(self, data: List[Dict]) -> pd.DataFrame:
        """Transforme les projets pour Power BI"""
        if not data:
            return pd.DataFrame()

        df = pd.DataFrame(data)

        columns_mapping = {
            'id': 'ProjectID',
            'nr': 'ProjectNumber',
            'name': 'ProjectName',
            'start_date': 'StartDate',
            'end_date': 'EndDate',
            'contact_id': 'ContactID',
            'pr_state_id': 'StateID',
            'pr_project_type_id': 'ProjectTypeID',
            'user_id': 'UserID'
        }

        available_cols = {k: v for k, v in columns_mapping.items() if k in df.columns}
        df = df[list(available_cols.keys())].rename(columns=available_cols)

        # Convertir les dates
        date_columns = ['StartDate', 'EndDate']
        for col in date_columns:
            if col in df.columns:
                df[col] = pd.to_datetime(df[col], errors='coerce')

        return df

    def transform_timesheets(self, data: List[Dict]) -> pd.DataFrame:
        """Transforme les feuilles de temps pour Power BI"""
        if not data:
            return pd.DataFrame()

        df = pd.DataFrame(data)

        columns_mapping = {
            'id': 'TimesheetID',
            'user_id': 'UserID',
            'client_service_id': 'ServiceID',
            'contact_id': 'ContactID',
            'pr_project_id': 'ProjectID',
            'date': 'Date',
            'duration': 'Duration',
            'text': 'Description',
            'status_id': 'StatusID',
            'allowable_bill': 'AllowableBill'
        }

        available_cols = {k: v for k, v in columns_mapping.items() if k in df.columns}
        df = df[list(available_cols.keys())].rename(columns=available_cols)

        # Convertir la date
        if 'Date' in df.columns:
            df['Date'] = pd.to_datetime(df['Date'], errors='coerce')

        # Convertir la durée en heures (si en secondes)
        if 'Duration' in df.columns:
            df['DurationHours'] = pd.to_numeric(df['Duration'], errors='coerce') / 3600

        return df

    def transform_articles(self, data: List[Dict]) -> pd.DataFrame:
        """Transforme les articles pour Power BI"""
        if not data:
            return pd.DataFrame()

        df = pd.DataFrame(data)

        columns_mapping = {
            'id': 'ArticleID',
            'user_id': 'UserID',
            'article_type_id': 'ArticleTypeID',
            'intern_code': 'InternalCode',
            'intern_name': 'InternalName',
            'intern_description': 'Description',
            'purchase_price': 'PurchasePrice',
            'sale_price': 'SalePrice',
            'purchase_total': 'PurchaseTotal',
            'sale_total': 'SaleTotal',
            'currency_id': 'CurrencyID',
            'tax_id': 'TaxID',
            'unit_id': 'UnitID'
        }

        available_cols = {k: v for k, v in columns_mapping.items() if k in df.columns}
        df = df[list(available_cols.keys())].rename(columns=available_cols)

        # Convertir les prix
        price_columns = ['PurchasePrice', 'SalePrice', 'PurchaseTotal', 'SaleTotal']
        for col in price_columns:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors='coerce')

        return df

    def transform_all(self) -> Dict[str, pd.DataFrame]:
        """
        Transforme tous les fichiers JSON disponibles

        Returns:
            Dictionnaire {endpoint: DataFrame}
        """
        json_files = self.get_latest_json_files()
        dataframes = {}

        transformers = {
            'contacts': self.transform_contacts,
            'invoices': self.transform_invoices,
            'quotes': self.transform_quotes,
            'orders': self.transform_quotes,  # Même structure que quotes
            'projects': self.transform_projects,
            'timesheets': self.transform_timesheets,
            'articles': self.transform_articles
        }

        for endpoint, file_path in json_files.items():
            print(f"Transformation de {endpoint}...")

            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)

            # Trouver le bon transformateur
            transformer = None
            for key, func in transformers.items():
                if key in endpoint:
                    transformer = func
                    break

            if transformer:
                df = transformer(data)
                if not df.empty:
                    dataframes[endpoint] = df
                    print(f"✓ {len(df)} lignes transformées pour {endpoint}")
            else:
                print(f"⚠ Pas de transformateur pour {endpoint}")

        return dataframes

    def save_to_excel(self, dataframes: Dict[str, pd.DataFrame], output_file: str = None):
        """
        Sauvegarde tous les DataFrames dans un fichier Excel multi-onglets

        Args:
            dataframes: Dictionnaire de DataFrames
            output_file: Nom du fichier de sortie
        """
        if not dataframes:
            print("Aucune donnée à sauvegarder")
            return

        if output_file is None:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            output_file = f"{self.output_dir}/bexio_data_{timestamp}.xlsx"

        os.makedirs(self.output_dir, exist_ok=True)

        with pd.ExcelWriter(output_file, engine='xlsxwriter') as writer:
            for sheet_name, df in dataframes.items():
                # Limiter le nom de l'onglet à 31 caractères (limite Excel)
                safe_sheet_name = sheet_name[:31]
                df.to_excel(writer, sheet_name=safe_sheet_name, index=False)

        print(f"\n✓ Fichier Excel créé: {output_file}")
        print(f"  Onglets: {', '.join(dataframes.keys())}")

        return output_file

    def save_to_csv(self, dataframes: Dict[str, pd.DataFrame]):
        """
        Sauvegarde chaque DataFrame dans un fichier CSV séparé

        Args:
            dataframes: Dictionnaire de DataFrames
        """
        if not dataframes:
            print("Aucune donnée à sauvegarder")
            return

        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        os.makedirs(self.output_dir, exist_ok=True)

        for endpoint, df in dataframes.items():
            output_file = f"{self.output_dir}/{endpoint}_{timestamp}.csv"
            df.to_csv(output_file, index=False, encoding='utf-8-sig')
            print(f"✓ Fichier CSV créé: {output_file}")


def main():
    """Fonction principale"""
    print("=== Transformation des données Bexio pour Power BI ===\n")

    transformer = BexioTransformer()

    # Transformer les données
    dataframes = transformer.transform_all()

    if not dataframes:
        print("\n⚠ Aucune donnée à transformer. Exécutez d'abord bexio_extractor.py")
        return

    # Sauvegarder en Excel (recommandé pour Power BI)
    excel_file = transformer.save_to_excel(dataframes)

    # Optionnel: sauvegarder aussi en CSV
    # transformer.save_to_csv(dataframes)

    print("\n✓ Transformation terminée avec succès!")
    print(f"\nVous pouvez maintenant importer {excel_file} dans Power BI")


if __name__ == '__main__':
    main()
