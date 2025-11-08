"""
Export des données vers différents formats
"""
import os
import sys
import json
import argparse
from data_transformer import BexioTransformer

class DataExporter:
    """Exporteur de données multi-formats"""

    def __init__(self, input_dir='data', output_dir='data/exports'):
        self.transformer = BexioTransformer(input_dir, input_dir)
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)

    def export_to_csv(self, separate_files=True):
        """Exporte en CSV (un fichier par table ou tout en un)"""
        print("Export vers CSV...")
        dataframes = self.transformer.transform_all()

        if not dataframes:
            print("✗ Aucune donnée à exporter")
            return

        from datetime import datetime
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')

        if separate_files:
            # Un fichier CSV par table
            for name, df in dataframes.items():
                filename = f"{self.output_dir}/{name}_{timestamp}.csv"
                df.to_csv(filename, index=False, encoding='utf-8-sig')
                print(f"✓ {filename} ({len(df)} lignes)")
        else:
            # Tout dans un seul fichier (pas pratique mais possible)
            filename = f"{self.output_dir}/all_data_{timestamp}.csv"
            # Concaténer avec un marqueur de table
            with open(filename, 'w', encoding='utf-8-sig') as f:
                for name, df in dataframes.items():
                    f.write(f"\n### TABLE: {name} ###\n")
                    df.to_csv(f, index=False)
            print(f"✓ {filename}")

        print(f"\n✓ Export CSV terminé: {self.output_dir}/")

    def export_to_json(self):
        """Exporte en JSON"""
        print("Export vers JSON...")
        dataframes = self.transformer.transform_all()

        if not dataframes:
            print("✗ Aucune donnée à exporter")
            return

        from datetime import datetime
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{self.output_dir}/bexio_data_{timestamp}.json"

        # Convertir tous les DataFrames en dict
        data = {}
        for name, df in dataframes.items():
            data[name] = df.to_dict(orient='records')

        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False, default=str)

        print(f"✓ {filename}")
        print(f"\n✓ Export JSON terminé")

    def export_to_sql(self, database_url=None):
        """Exporte vers une base de données SQL"""
        print("Export vers SQL...")

        try:
            from sqlalchemy import create_engine
        except ImportError:
            print("✗ SQLAlchemy non installé")
            print("  Installez avec: pip install sqlalchemy")
            return

        if not database_url:
            # Base SQLite par défaut
            from datetime import datetime
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            database_url = f"sqlite:///{self.output_dir}/bexio_{timestamp}.db"

        print(f"Connexion à: {database_url}")

        try:
            engine = create_engine(database_url)
            dataframes = self.transformer.transform_all()

            if not dataframes:
                print("✗ Aucune donnée à exporter")
                return

            for name, df in dataframes.items():
                df.to_sql(name, engine, if_exists='replace', index=False)
                print(f"✓ Table '{name}' créée ({len(df)} lignes)")

            print(f"\n✓ Export SQL terminé: {database_url}")

        except Exception as e:
            print(f"✗ Erreur SQL: {str(e)}")

    def export_to_parquet(self):
        """Exporte en format Parquet (optimisé pour le Big Data)"""
        print("Export vers Parquet...")

        try:
            import pyarrow
        except ImportError:
            print("✗ PyArrow non installé")
            print("  Installez avec: pip install pyarrow")
            return

        dataframes = self.transformer.transform_all()

        if not dataframes:
            print("✗ Aucune donnée à exporter")
            return

        from datetime import datetime
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')

        for name, df in dataframes.items():
            filename = f"{self.output_dir}/{name}_{timestamp}.parquet"
            df.to_parquet(filename, index=False)
            print(f"✓ {filename} ({len(df)} lignes)")

        print(f"\n✓ Export Parquet terminé")

def main():
    """Fonction principale avec arguments en ligne de commande"""
    parser = argparse.ArgumentParser(description='Export des données Bexio vers différents formats')
    parser.add_argument('--format', '-f', choices=['csv', 'json', 'sql', 'parquet', 'all'],
                        default='csv', help='Format d\'export')
    parser.add_argument('--output', '-o', default='data/exports',
                        help='Répertoire de sortie')
    parser.add_argument('--database', '-d', help='URL de base de données pour export SQL')

    args = parser.parse_args()

    exporter = DataExporter(output_dir=args.output)

    print("\n" + "="*70)
    print("  EXPORT DES DONNÉES BEXIO")
    print("="*70 + "\n")

    if args.format == 'csv' or args.format == 'all':
        exporter.export_to_csv()
        print()

    if args.format == 'json' or args.format == 'all':
        exporter.export_to_json()
        print()

    if args.format == 'sql' or args.format == 'all':
        exporter.export_to_sql(args.database)
        print()

    if args.format == 'parquet' or args.format == 'all':
        exporter.export_to_parquet()
        print()

    print("="*70)
    print("✓ EXPORT TERMINÉ")
    print("="*70 + "\n")

if __name__ == '__main__':
    main()
