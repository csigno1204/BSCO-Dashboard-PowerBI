#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de Vérification des Dépendances
Dashboard Bexio → Power BI

Vérifie que TOUTES les dépendances nécessaires sont présentes et fonctionnelles.
Utilisé pour tester que l'exe compilé contient bien tout.
"""

import sys
from datetime import datetime


def print_header(text):
    """Affiche un en-tête"""
    print(f"\n{'='*70}")
    print(f"  {text}")
    print(f"{'='*70}\n")


def print_success(text):
    """Affiche un succès"""
    print(f"✅ {text}")


def print_error(text):
    """Affiche une erreur"""
    print(f"❌ {text}")


def print_info(text):
    """Affiche une info"""
    print(f"ℹ️  {text}")


def test_import(module_name, friendly_name=None):
    """Teste l'import d'un module"""
    friendly = friendly_name or module_name
    try:
        __import__(module_name)
        print_success(f"{friendly} - Disponible")
        return True
    except ImportError as e:
        print_error(f"{friendly} - MANQUANT ({e})")
        return False


def main():
    """Fonction principale de vérification"""

    print_header("🔍 Vérification des Dépendances - Dashboard Bexio")
    print(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Python: {sys.version}")
    print(f"Exécutable: {sys.executable}")

    total_modules = 0
    success_modules = 0

    # ========================================================================
    # 1. Modules Standard Library
    # ========================================================================
    print_header("1️⃣  Modules Standard Library Python")

    stdlib_modules = [
        ('tkinter', 'Tkinter (GUI)'),
        ('json', 'JSON'),
        ('datetime', 'DateTime'),
        ('threading', 'Threading'),
        ('os', 'OS'),
        ('sys', 'Sys'),
        ('pathlib', 'Pathlib'),
        ('subprocess', 'Subprocess'),
        ('webbrowser', 'Webbrowser'),
        ('shutil', 'Shutil'),
        ('glob', 'Glob'),
        ('logging', 'Logging'),
        ('sqlite3', 'SQLite3'),
        ('smtplib', 'SMTP'),
        ('email', 'Email'),
    ]

    for module, name in stdlib_modules:
        total_modules += 1
        if test_import(module, name):
            success_modules += 1

    # ========================================================================
    # 2. Dépendances Principales
    # ========================================================================
    print_header("2️⃣  Dépendances Principales")

    main_deps = [
        ('requests', 'Requests (HTTP)'),
        ('pandas', 'Pandas (Data)'),
        ('numpy', 'NumPy'),
        ('openpyxl', 'OpenPyXL (Excel)'),
        ('xlsxwriter', 'XlsxWriter (Excel)'),
        ('dotenv', 'Python-dotenv (Config)'),
        ('yaml', 'PyYAML'),
    ]

    for module, name in main_deps:
        total_modules += 1
        if test_import(module, name):
            success_modules += 1

    # ========================================================================
    # 3. Sous-modules Critiques
    # ========================================================================
    print_header("3️⃣  Sous-modules Critiques")

    sub_modules = [
        ('tkinter.ttk', 'Tkinter TTK'),
        ('tkinter.filedialog', 'Tkinter FileDialog'),
        ('tkinter.messagebox', 'Tkinter MessageBox'),
        ('pandas.io.excel', 'Pandas Excel I/O'),
        ('requests.adapters', 'Requests Adapters'),
        ('openpyxl.styles', 'OpenPyXL Styles'),
        ('email.mime.text', 'Email MIME'),
    ]

    for module, name in sub_modules:
        total_modules += 1
        if test_import(module, name):
            success_modules += 1

    # ========================================================================
    # 4. Dépendances Transitives
    # ========================================================================
    print_header("4️⃣  Dépendances Transitives")

    transitive_deps = [
        ('urllib3', 'urllib3 (Requests)'),
        ('certifi', 'Certifi (SSL)'),
        ('charset_normalizer', 'Charset Normalizer'),
        ('idna', 'IDNA'),
        ('pytz', 'PyTZ (Timezones)'),
        ('dateutil', 'Python-dateutil'),
        ('six', 'Six (Python 2/3)'),
        ('et_xmlfile', 'et_xmlfile (OpenPyXL)'),
    ]

    for module, name in transitive_deps:
        total_modules += 1
        if test_import(module, name):
            success_modules += 1

    # ========================================================================
    # 5. Test Fonctionnel
    # ========================================================================
    print_header("5️⃣  Tests Fonctionnels")

    functional_tests = []

    # Test Pandas
    try:
        import pandas as pd
        df = pd.DataFrame({'A': [1, 2, 3]})
        print_success("Pandas - Création DataFrame OK")
        functional_tests.append(True)
    except Exception as e:
        print_error(f"Pandas - Échec ({e})")
        functional_tests.append(False)

    # Test Requests
    try:
        import requests
        # Pas de requête réelle, juste vérifier l'import
        print_success("Requests - Import OK")
        functional_tests.append(True)
    except Exception as e:
        print_error(f"Requests - Échec ({e})")
        functional_tests.append(False)

    # Test Excel (openpyxl)
    try:
        from openpyxl import Workbook
        wb = Workbook()
        ws = wb.active
        ws['A1'] = 'Test'
        print_success("OpenPyXL - Création Workbook OK")
        functional_tests.append(True)
    except Exception as e:
        print_error(f"OpenPyXL - Échec ({e})")
        functional_tests.append(False)

    # Test YAML
    try:
        import yaml
        data = yaml.safe_load("test: value")
        print_success("PyYAML - Parse OK")
        functional_tests.append(True)
    except Exception as e:
        print_error(f"PyYAML - Échec ({e})")
        functional_tests.append(False)

    # Test Tkinter
    try:
        import tkinter as tk
        root = tk.Tk()
        root.withdraw()  # Ne pas afficher
        root.destroy()
        print_success("Tkinter - Création fenêtre OK")
        functional_tests.append(True)
    except Exception as e:
        print_error(f"Tkinter - Échec ({e})")
        functional_tests.append(False)

    # ========================================================================
    # 6. Résumé Final
    # ========================================================================
    print_header("📊 Résumé de la Vérification")

    success_rate = (success_modules / total_modules * 100) if total_modules > 0 else 0
    functional_rate = (sum(functional_tests) / len(functional_tests) * 100) if functional_tests else 0

    print(f"Modules testés: {success_modules}/{total_modules} ({success_rate:.1f}%)")
    print(f"Tests fonctionnels: {sum(functional_tests)}/{len(functional_tests)} ({functional_rate:.1f}%)")

    print()

    if success_modules == total_modules and all(functional_tests):
        print_success("✅✅✅ TOUTES LES DÉPENDANCES SONT PRÉSENTES ET FONCTIONNELLES!")
        print()
        print_info("L'exécutable est prêt à être distribué.")
        print_info("Les utilisateurs n'auront PAS besoin d'installer Python ou pip.")
        print_info("Tout est embarqué dans le .exe !")
        print()
        return 0
    else:
        print_error("⚠️ ⚠️ ⚠️  CERTAINES DÉPENDANCES SONT MANQUANTES!")
        print()
        print_info("Modules manquants: " + str(total_modules - success_modules))
        print_info("Tests échoués: " + str(len(functional_tests) - sum(functional_tests)))
        print()
        print_info("Actions recommandées:")
        print_info("1. Vérifiez installer/BexioDashboard.spec")
        print_info("2. Ajoutez les modules manquants dans hiddenimports")
        print_info("3. Recompilez avec PyInstaller")
        print()
        return 1


if __name__ == "__main__":
    exit_code = main()

    print()
    print(f"{'='*70}")
    print(f"  Vérification terminée - Code de sortie: {exit_code}")
    print(f"{'='*70}")
    print()

    sys.exit(exit_code)
