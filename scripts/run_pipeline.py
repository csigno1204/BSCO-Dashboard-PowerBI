"""
Script principal pour exécuter le pipeline complet:
1. Extraction des données depuis Bexio
2. Transformation des données pour Power BI
3. Génération du fichier Excel final
"""
import os
import sys
from dotenv import load_dotenv
from bexio_extractor import BexioExtractor
from data_transformer import BexioTransformer


def main():
    """Exécute le pipeline complet"""
    print("=" * 60)
    print("  PIPELINE BEXIO → POWER BI")
    print("=" * 60)
    print()

    # Charger la configuration
    load_dotenv()

    # Vérifier la configuration
    if not os.getenv('BEXIO_API_TOKEN'):
        print("❌ Erreur: BEXIO_API_TOKEN non configuré")
        print("   Créez un fichier .env basé sur .env.example")
        sys.exit(1)

    # Configuration
    endpoints_str = os.getenv('BEXIO_ENDPOINTS', 'contacts,invoices,quotes,projects')
    endpoints = [e.strip() for e in endpoints_str.split(',')]
    days = int(os.getenv('EXTRACTION_DAYS', '365'))

    print(f"📋 Configuration:")
    print(f"   - Endpoints: {', '.join(endpoints)}")
    print(f"   - Période: {days} jours")
    print()

    # ÉTAPE 1: Extraction
    print("📥 ÉTAPE 1/3: Extraction des données Bexio")
    print("-" * 60)
    try:
        extractor = BexioExtractor()
        data = extractor.extract_all(endpoints, days)
        extractor.save_to_json(data)
        print()
    except Exception as e:
        print(f"❌ Erreur lors de l'extraction: {e}")
        sys.exit(1)

    # ÉTAPE 2: Transformation
    print("🔄 ÉTAPE 2/3: Transformation des données")
    print("-" * 60)
    try:
        transformer = BexioTransformer()
        dataframes = transformer.transform_all()
        print()
    except Exception as e:
        print(f"❌ Erreur lors de la transformation: {e}")
        sys.exit(1)

    # ÉTAPE 3: Génération du fichier Excel
    print("💾 ÉTAPE 3/3: Génération du fichier Excel")
    print("-" * 60)
    try:
        excel_file = transformer.save_to_excel(dataframes)
        print()
    except Exception as e:
        print(f"❌ Erreur lors de la génération Excel: {e}")
        sys.exit(1)

    # Résumé
    print("=" * 60)
    print("✅ PIPELINE TERMINÉ AVEC SUCCÈS!")
    print("=" * 60)
    print()
    print(f"📊 Fichier généré: {excel_file}")
    print()
    print("📝 Prochaines étapes:")
    print("   1. Ouvrez Power BI Desktop")
    print("   2. Cliquez sur 'Obtenir des données' → 'Excel'")
    print(f"   3. Sélectionnez le fichier: {excel_file}")
    print("   4. Importez les onglets nécessaires")
    print("   5. Créez vos visualisations!")
    print()


if __name__ == '__main__':
    main()
