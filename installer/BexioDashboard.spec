# -*- mode: python ; coding: utf-8 -*-
# ============================================================================
# PyInstaller Spec File
# Dashboard Bexio → Power BI
# ============================================================================
# Usage: pyinstaller installer/BexioDashboard.spec

import sys
from pathlib import Path

block_cipher = None

# Chemins
project_root = Path('.').resolve()
scripts_dir = project_root / 'scripts'
docs_dir = project_root / 'docs'
powerbi_dir = project_root / 'powerbi'

# ============================================================================
# Analyse de l'application principale
# ============================================================================

a = Analysis(
    # Script principal
    [str(scripts_dir / 'gui_app.py')],

    # Chemins de recherche Python
    pathex=[str(project_root), str(scripts_dir)],

    # Modules Python cachés nécessaires
    hiddenimports=[
        'tkinter',
        'tkinter.ttk',
        'tkinter.scrolledtext',
        'requests',
        'pandas',
        'openpyxl',
        'xlsxwriter',
        'dotenv',
        'yaml',
        'json',
        'datetime',
        'threading',
        'webbrowser',
        'subprocess',
        'smtplib',
        'email',
        'logging',
        'sqlite3',
        # Dépendances pour futures extensions
        'sqlalchemy',
        'pyarrow',
        'matplotlib',
        'reportlab',
    ],

    # Hooks
    hookspath=[],
    hooksconfig={},

    # Options de runtime
    runtime_hooks=[],
    excludes=[
        # Exclure modules lourds non utilisés
        'IPython',
        'notebook',
        'jupyter',
        'sphinx',
        'pytest',
        'setuptools',
    ],

    # Packages Win32
    win_no_prefer_redirects=False,
    win_private_assemblies=False,

    # Chiffrement
    cipher=block_cipher,

    # Ne pas suivre imports
    noarchive=False,
)

# ============================================================================
# Fichiers de données à inclure
# ============================================================================

# Scripts Python (pour utilisateurs avancés)
scripts_to_include = [
    'bexio_extractor.py',
    'data_transformer.py',
    'run_pipeline.py',
    'setup_wizard.py',
    'test_connection.py',
    'generate_demo_data.py',
    'validate_data_structure.py',
    'alert_manager.py',
    'email_notifier.py',
    'logger.py',
    'export_data.py',
    'health_check.py',
    'web_dashboard.py',
    'view_history.py',
    'setup_scheduler.py',
    'generate_pdf_report.py',
]

for script in scripts_to_include:
    script_path = scripts_dir / script
    if script_path.exists():
        a.datas += [(f'scripts/{script}', str(script_path), 'DATA')]

# Documentation
docs_to_include = [
    'README.md',
    'INSTALLATION.md',
    'USAGE.md',
    'FEATURES.md',
    'VALIDATION_DONNEES.md',
    'FAQ.md',
    'ARCHITECTURE.md',
    'SCHEDULER.md',
    'EXPORT.md',
    'MONITORING.md',
    'TROUBLESHOOTING.md',
    'ALERTS.md',
    'ROADMAP.md',
]

for doc in docs_to_include:
    doc_path = docs_dir / doc
    if doc_path.exists():
        a.datas += [(f'docs/{doc}', str(doc_path), 'DATA')]

# README principal
readme_path = project_root / 'README.md'
if readme_path.exists():
    a.datas += [('README.md', str(readme_path), 'DATA')]

# Fichiers Power BI
powerbi_files = ['DAX_Measures.dax', 'PowerQuery_Examples.m', 'Relations.txt']
for pbi_file in powerbi_files:
    pbi_path = powerbi_dir / pbi_file
    if pbi_path.exists():
        a.datas += [(f'powerbi/{pbi_file}', str(pbi_path), 'DATA')]

# Configuration
config_files = ['.env.example', 'alerts.yaml', 'requirements.txt']
for config_file in config_files:
    config_path = project_root / config_file
    if config_path.exists():
        a.datas += [(config_file, str(config_path), 'DATA')]

# Licence et changelog
for extra_file in ['LICENSE', 'CHANGELOG.md']:
    extra_path = project_root / extra_file
    if extra_path.exists():
        a.datas += [(extra_file, str(extra_path), 'DATA')]

# ============================================================================
# Compilation
# ============================================================================

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

# ============================================================================
# Exécutable
# ============================================================================

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,

    # Nom de l'exécutable
    name='BexioDashboard',

    # Debug
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,

    # Console
    console=False,  # False = fenêtre GUI uniquement, pas de console
    # Note: mettre True pour debug

    # Icône (si disponible)
    icon='assets/icon.ico' if Path('assets/icon.ico').exists() else None,

    # Disable traceback
    disable_windowed_traceback=False,

    # Target architecture
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,

    # Version info (Windows)
    version='version_info.txt' if Path('version_info.txt').exists() else None,
)

# ============================================================================
# Collection de tous les fichiers
# ============================================================================

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,

    strip=False,
    upx=True,
    upx_exclude=[],

    name='BexioDashboard'
)
