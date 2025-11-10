"""
Auto-installation du certificat au premier lancement
Module qui vérifie et installe automatiquement le certificat BSCO Solutions
"""

import os
import sys
import subprocess
import logging
from pathlib import Path
from typing import Optional

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def get_certificate_path() -> Optional[Path]:
    """
    Récupère le chemin du certificat inclus dans l'exe

    Gère 3 cas :
    1. Développement : scripts/certificates/BSCO_CodeSigning_SelfSigned.cer
    2. PyInstaller (_MEIPASS) : _internal/certificates/BSCO_CodeSigning_SelfSigned.cer
    3. Installation Inno Setup : Program Files/.../certificates/BSCO_CodeSigning_SelfSigned.cer
    """
    cert_filename = "BSCO_CodeSigning_SelfSigned.cer"

    # Cas 1 : Développement
    if not getattr(sys, 'frozen', False):
        # Mode développement (Python direct)
        dev_cert = Path(__file__).parent.parent / "scripts" / "certificates" / cert_filename
        if dev_cert.exists():
            logger.info(f"Certificat trouvé (mode développement) : {dev_cert}")
            return dev_cert

    # Cas 2 : PyInstaller (exe compilé)
    if getattr(sys, 'frozen', False):
        # Dans un exe PyInstaller
        if hasattr(sys, '_MEIPASS'):
            # _MEIPASS = dossier temporaire où PyInstaller extrait les fichiers
            meipass_cert = Path(sys._MEIPASS) / "certificates" / cert_filename
            if meipass_cert.exists():
                logger.info(f"Certificat trouvé (PyInstaller _MEIPASS) : {meipass_cert}")
                return meipass_cert

        # Essayer à côté de l'exe
        exe_dir = Path(sys.executable).parent
        exe_cert = exe_dir / "certificates" / cert_filename
        if exe_cert.exists():
            logger.info(f"Certificat trouvé (à côté de l'exe) : {exe_cert}")
            return exe_cert

        # Essayer dans _internal (nouveau format PyInstaller)
        internal_cert = exe_dir / "_internal" / "certificates" / cert_filename
        if internal_cert.exists():
            logger.info(f"Certificat trouvé (_internal) : {internal_cert}")
            return internal_cert

    logger.warning("Certificat non trouvé dans aucun emplacement")
    return None


def is_certificate_installed() -> bool:
    """
    Vérifie si le certificat BSCO Solutions est déjà installé dans le Windows Store

    Returns:
        True si le certificat est installé, False sinon
    """
    try:
        # Utiliser PowerShell pour vérifier
        ps_command = """
        $cert = Get-ChildItem -Path Cert:\\CurrentUser\\Root | Where-Object { $_.Subject -like "*BSCO Solutions*" }
        if ($cert) { Write-Output "INSTALLED" } else { Write-Output "NOT_INSTALLED" }
        """

        result = subprocess.run(
            ["powershell", "-Command", ps_command],
            capture_output=True,
            text=True,
            timeout=10
        )

        is_installed = "INSTALLED" in result.stdout
        logger.info(f"Certificat installé : {is_installed}")
        return is_installed

    except Exception as e:
        logger.error(f"Erreur lors de la vérification du certificat : {e}")
        return False


def install_certificate(cert_path: Path) -> bool:
    """
    Installe le certificat dans le Windows Store (Autorités racines de confiance)

    Args:
        cert_path: Chemin vers le fichier .cer

    Returns:
        True si installation réussie, False sinon
    """
    try:
        logger.info(f"Installation du certificat : {cert_path}")

        # Utiliser certutil.exe (inclus dans Windows)
        # -addstore Root = Ajouter au magasin "Autorités de certification racines de confiance"
        # -user = Pour l'utilisateur actuel (pas besoin d'admin)
        result = subprocess.run(
            ["certutil.exe", "-addstore", "-user", "Root", str(cert_path)],
            capture_output=True,
            text=True,
            timeout=30
        )

        # Codes de retour :
        # 0 = Succès
        # 183 (0xB7) = Le certificat est déjà dans le magasin (OK aussi)
        if result.returncode == 0 or result.returncode == 183:
            logger.info(f"Certificat installé avec succès (code: {result.returncode})")
            return True
        else:
            logger.error(f"Échec installation certificat (code: {result.returncode})")
            logger.error(f"Stdout: {result.stdout}")
            logger.error(f"Stderr: {result.stderr}")
            return False

    except subprocess.TimeoutExpired:
        logger.error("Timeout lors de l'installation du certificat")
        return False
    except Exception as e:
        logger.error(f"Erreur lors de l'installation du certificat : {e}")
        return False


def auto_install_certificate(silent: bool = False) -> bool:
    """
    Fonction principale : Vérifie et installe automatiquement le certificat si nécessaire

    Args:
        silent: Si True, n'affiche pas de messages à l'utilisateur

    Returns:
        True si le certificat est installé (déjà ou nouvellement), False sinon
    """
    try:
        logger.info("=== Auto-installation du certificat ===")

        # 1. Vérifier si déjà installé
        if is_certificate_installed():
            logger.info("Certificat déjà installé, aucune action nécessaire")
            return True

        logger.info("Certificat non installé, tentative d'installation...")

        # 2. Trouver le certificat
        cert_path = get_certificate_path()
        if cert_path is None:
            logger.warning("Certificat .cer non trouvé dans les ressources de l'application")
            if not silent:
                try:
                    import tkinter.messagebox as messagebox
                    messagebox.showwarning(
                        "Certificat non trouvé",
                        "Le certificat de sécurité n'a pas été trouvé.\n\n"
                        "L'application fonctionnera mais vous pourriez voir des avertissements de sécurité.\n\n"
                        "Pour une installation complète, utilisez l'installeur officiel."
                    )
                except:
                    pass
            return False

        # 3. Installer le certificat
        success = install_certificate(cert_path)

        if success:
            logger.info("✅ Certificat installé avec succès !")
            if not silent:
                try:
                    import tkinter.messagebox as messagebox
                    messagebox.showinfo(
                        "Certificat installé",
                        "✅ Certificat de sécurité BSCO Solutions installé avec succès !\n\n"
                        "L'application est maintenant reconnue comme sûre par Windows.\n\n"
                        "Cette opération n'est effectuée qu'une seule fois."
                    )
                except:
                    pass
            return True
        else:
            logger.error("❌ Échec de l'installation du certificat")
            if not silent:
                try:
                    import tkinter.messagebox as messagebox
                    messagebox.showwarning(
                        "Installation certificat échouée",
                        "⚠️ L'installation du certificat a échoué.\n\n"
                        "L'application fonctionnera mais vous pourriez voir des avertissements.\n\n"
                        "Vous pouvez installer le certificat manuellement en exécutant "
                        "l'application en tant qu'administrateur."
                    )
                except:
                    pass
            return False

    except Exception as e:
        logger.error(f"Erreur inattendue dans auto_install_certificate : {e}")
        return False


def check_and_install_certificate(silent: bool = False) -> bool:
    """
    Point d'entrée principal - À appeler au démarrage de l'application

    Args:
        silent: Si True, installation silencieuse sans messages

    Returns:
        True si certificat installé, False sinon
    """
    return auto_install_certificate(silent=silent)


if __name__ == "__main__":
    # Test du module
    print("🔍 Test du module d'auto-installation du certificat")
    print("=" * 60)

    # Vérifier état actuel
    print("\n1. Vérification si certificat déjà installé...")
    installed = is_certificate_installed()
    print(f"   → {'✅ OUI' if installed else '❌ NON'}")

    # Trouver le certificat
    print("\n2. Recherche du certificat dans les ressources...")
    cert_path = get_certificate_path()
    if cert_path:
        print(f"   → ✅ Trouvé : {cert_path}")
    else:
        print("   → ❌ Non trouvé")

    # Installer si nécessaire
    if not installed and cert_path:
        print("\n3. Installation du certificat...")
        success = install_certificate(cert_path)
        print(f"   → {'✅ Succès' if success else '❌ Échec'}")

    print("\n" + "=" * 60)
    print("Test terminé")
