# -*- mode: python ; coding: utf-8 -*-
"""
PyInstaller spec pour Web Launcher - Dashboard Bexio → Power BI

Crée un exe MINIMALISTE qui lance simplement l'application web.
Taille attendue : ~15-20 MB au lieu de 100 MB
"""

from PyInstaller.utils.hooks import collect_all
from pathlib import Path

# Chemins de base
block_cipher = None
project_root = Path(SPECPATH).parent
scripts_dir = project_root / 'scripts'
webapp_dir = project_root / 'webapp'

# Collecter tous les fichiers webapp
webapp_datas = []
webapp_datas.append((str(webapp_dir / 'templates'), 'webapp/templates'))
webapp_datas.append((str(webapp_dir / 'static'), 'webapp/static'))

# Collecter les scripts Python nécessaires
scripts_files = [
    'bexio_api.py',
    'data_extraction.py',
    'data_transformer.py',
    'power_bi_exporter.py',
    'validation.py'
]

for script_file in scripts_files:
    script_path = scripts_dir / script_file
    if script_path.exists():
        webapp_datas.append((str(script_path), 'scripts'))

# Collecter les dépendances Flask
flask_datas, flask_binaries, flask_hiddenimports = collect_all('flask')

# Analyse
a = Analysis(
    ['web_launcher.py'],
    pathex=[str(project_root)],
    binaries=flask_binaries,
    datas=webapp_datas + flask_datas,
    hiddenimports=[
        # Flask et dépendances
        'flask',
        'jinja2',
        'werkzeug',
        'click',
        'itsdangerous',
        'markupsafe',

        # Modules de l'application
        'webapp.app',
        'scripts.bexio_api',
        'scripts.data_extraction',
        'scripts.data_transformer',
        'scripts.power_bi_exporter',
        'scripts.validation',

        # Dépendances standards
        'requests',
        'pandas',
        'numpy',
        'openpyxl',
        'json',
        'datetime',
        'pathlib',
        'threading',
        'webbrowser',
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[
        # Exclure les modules GUI lourds (on n'en a pas besoin pour le web)
        'tkinter',
        'PyQt5',
        'PyQt6',
        'PySide2',
        'PySide6',
        'matplotlib',
        'PIL',
        'PIL.Image',

        # Exclure les modules de test
        'pytest',
        'unittest',
        'test',

        # Exclure les modules non nécessaires
        'IPython',
        'notebook',
        'jupyter',
    ],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

# Filtre pour ne garder que les fichiers nécessaires
# (exclure les fichiers temporaires, cache, etc.)
def filter_binaries(binaries):
    """Filtrer les binaires pour réduire la taille"""
    excluded_patterns = [
        'qt',
        'Qt',
        'PyQt',
        'tk',
        'tcl',
        '_tkinter',
    ]

    filtered = []
    for binary in binaries:
        name, path, type_ = binary
        # Exclure si le nom contient un pattern à exclure
        if not any(pattern in name.lower() for pattern in excluded_patterns):
            filtered.append(binary)

    return filtered

a.binaries = filter_binaries(a.binaries)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='BexioDashboard_WebLauncher',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,  # Compression UPX activée
    console=True,  # Console pour voir les logs
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon=None,  # Ajoutez un .ico ici si vous en avez un
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='BexioDashboard_WebLauncher',
)

print("=" * 70)
print("✅ Spec compilé pour Web Launcher")
print()
print("Caractéristiques :")
print("  - Exe minimaliste : ~15-20 MB (au lieu de 100 MB)")
print("  - Lance serveur Flask sur localhost:8000")
print("  - Ouvre automatiquement le navigateur")
print("  - Pas de GUI Tkinter = Moins de faux positifs antivirus")
print()
print("Pour compiler :")
print("  pyinstaller --clean installer/BexioDashboard_WebLauncher.spec")
print("=" * 70)
