# ====================================================================
# Build et Signature Automatique Complète
# Dashboard Bexio → Power BI
# ====================================================================

param(
    [switch]$SkipBuild,
    [switch]$SkipCertGeneration,
    [switch]$SkipInstaller
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  🚀 BUILD ET SIGNATURE AUTOMATIQUE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$startTime = Get-Date

# ====================================================================
# 1. GÉNÉRATION DU CERTIFICAT
# ====================================================================

if (-not $SkipCertGeneration) {
    if (-not (Test-Path "scripts\certificates\BSCO_CodeSigning_SelfSigned.pfx")) {
        Write-Host "1️⃣  Génération du certificat auto-signé..." -ForegroundColor Yellow
        Write-Host ""
        & .\scripts\generate_selfsigned_certificate.ps1
        Write-Host ""
    } else {
        Write-Host "1️⃣  Certificat déjà existant ✅" -ForegroundColor Green
        $cert = Get-PfxCertificate -FilePath "scripts\certificates\BSCO_CodeSigning_SelfSigned.pfx"
        Write-Host "   Valide jusqu'au : $($cert.NotAfter)" -ForegroundColor Gray
        Write-Host ""
    }
} else {
    Write-Host "1️⃣  Génération certificat ignorée (--SkipCertGeneration)" -ForegroundColor Gray
    Write-Host ""
}

# ====================================================================
# 2. COMPILATION DE L'APPLICATION
# ====================================================================

if (-not $SkipBuild) {
    Write-Host "2️⃣  Compilation de l'application avec PyInstaller..." -ForegroundColor Yellow
    Write-Host ""

    # Vérifier que pyinstaller est installé
    $pyinstaller = Get-Command pyinstaller -ErrorAction SilentlyContinue
    if (-not $pyinstaller) {
        Write-Host "   ⚠️  PyInstaller non trouvé, installation..." -ForegroundColor Yellow
        pip install pyinstaller
    }

    # Compiler
    pyinstaller --clean installer\BexioDashboard.spec

    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "❌ Erreur lors de la compilation PyInstaller" -ForegroundColor Red
        exit 1
    }

    Write-Host ""
    Write-Host "   ✅ Compilation réussie" -ForegroundColor Green
    $exeSize = (Get-Item "dist\BexioDashboard\BexioDashboard.exe").Length / 1MB
    Write-Host "   📊 Taille exe : $([math]::Round($exeSize, 2)) MB" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "2️⃣  Compilation ignorée (--SkipBuild)" -ForegroundColor Gray
    Write-Host ""
}

# ====================================================================
# 3. SIGNATURE DE L'APPLICATION
# ====================================================================

Write-Host "3️⃣  Signature de l'application..." -ForegroundColor Yellow
Write-Host ""

if (Test-Path "dist\BexioDashboard\BexioDashboard.exe") {
    & .\scripts\sign_executable.ps1 -ExePath "dist\BexioDashboard\BexioDashboard.exe"

    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "❌ Erreur lors de la signature de l'application" -ForegroundColor Red
        exit 1
    }
    Write-Host ""
} else {
    Write-Host "   ❌ Application non trouvée : dist\BexioDashboard\BexioDashboard.exe" -ForegroundColor Red
    Write-Host "   💡 Exécutez sans --SkipBuild pour compiler d'abord" -ForegroundColor Yellow
    exit 1
}

# ====================================================================
# 4. EXTRACTION DU CERTIFICAT
# ====================================================================

Write-Host "4️⃣  Extraction du certificat depuis l'exe signé..." -ForegroundColor Yellow
Write-Host ""

& .\scripts\extract_certificate.ps1 -ExePath "dist\BexioDashboard\BexioDashboard.exe"

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Erreur lors de l'extraction du certificat" -ForegroundColor Red
    exit 1
}
Write-Host ""

# ====================================================================
# 5. COMPILATION DE L'INSTALLEUR INNO SETUP
# ====================================================================

if (-not $SkipInstaller) {
    Write-Host "5️⃣  Compilation de l'installeur Inno Setup..." -ForegroundColor Yellow
    Write-Host ""

    # Chercher Inno Setup
    $iscc = "C:\Program Files (x86)\Inno Setup 6\ISCC.exe"
    if (-not (Test-Path $iscc)) {
        Write-Host "   ❌ Inno Setup non trouvé : $iscc" -ForegroundColor Red
        Write-Host ""
        Write-Host "   📥 Téléchargez Inno Setup depuis :" -ForegroundColor Yellow
        Write-Host "      https://jrsoftware.org/isdl.php" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "   Ou installez via Chocolatey :" -ForegroundColor Yellow
        Write-Host "      choco install innosetup" -ForegroundColor Cyan
        Write-Host ""
        exit 1
    }

    # Compiler l'installeur
    & $iscc "installer\BexioDashboard_Setup.iss"

    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "❌ Erreur lors de la compilation de l'installeur" -ForegroundColor Red
        exit 1
    }

    Write-Host ""
    Write-Host "   ✅ Installeur créé avec succès" -ForegroundColor Green

    $installer = Get-Item "dist\installer\BexioDashboard_Setup_*.exe"
    $installerSize = $installer.Length / 1MB
    Write-Host "   📊 Taille : $([math]::Round($installerSize, 2)) MB" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "5️⃣  Compilation installeur ignorée (--SkipInstaller)" -ForegroundColor Gray
    Write-Host ""
}

# ====================================================================
# 6. SIGNATURE DE L'INSTALLEUR
# ====================================================================

if (-not $SkipInstaller) {
    Write-Host "6️⃣  Signature de l'installeur..." -ForegroundColor Yellow
    Write-Host ""

    $installer = Get-Item "dist\installer\BexioDashboard_Setup_*.exe"
    & .\scripts\sign_executable.ps1 -ExePath $installer.FullName

    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "❌ Erreur lors de la signature de l'installeur" -ForegroundColor Red
        exit 1
    }
    Write-Host ""
}

# ====================================================================
# RÉSUMÉ FINAL
# ====================================================================

$endTime = Get-Date
$duration = $endTime - $startTime

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✅ BUILD COMPLET TERMINÉ !" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

if (-not $SkipInstaller) {
    $installer = Get-Item "dist\installer\BexioDashboard_Setup_*.exe"

    Write-Host "📦 FICHIER À DISTRIBUER :" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   $($installer.Name)" -ForegroundColor White
    Write-Host "   Chemin : $($installer.FullName)" -ForegroundColor Gray
    Write-Host "   Taille : $([math]::Round($installer.Length / 1MB, 2)) MB" -ForegroundColor Gray
    Write-Host ""

    Write-Host "🎉 CET INSTALLEUR CONTIENT :" -ForegroundColor Yellow
    Write-Host "   ✅ Application complète (Python + toutes dépendances)" -ForegroundColor White
    Write-Host "   ✅ Certificat auto-signé BSCO Solutions" -ForegroundColor White
    Write-Host "   ✅ Installation AUTOMATIQUE du certificat" -ForegroundColor White
    Write-Host "   ✅ Signature numérique valide" -ForegroundColor White
    Write-Host "   ✅ (Optionnel) Installation Power BI Desktop" -ForegroundColor White
    Write-Host ""

    Write-Host "🚀 INSTALLATION UTILISATEUR :" -ForegroundColor Green
    Write-Host "   1. Double-clic sur $($installer.Name)" -ForegroundColor White
    Write-Host "   2. Suit l'assistant d'installation" -ForegroundColor White
    Write-Host "   3. Certificat installé automatiquement" -ForegroundColor White
    Write-Host "   4. Application prête à utiliser !" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "📦 APPLICATION SIGNÉE :" -ForegroundColor Cyan
    Write-Host "   dist\BexioDashboard\BexioDashboard.exe" -ForegroundColor White
    Write-Host ""
}

Write-Host "⏱️  Durée totale : $([math]::Round($duration.TotalMinutes, 2)) minutes" -ForegroundColor Cyan
Write-Host ""

Write-Host "⚠️  RAPPEL : Certificat auto-signé" -ForegroundColor Yellow
Write-Host "   - N'élimine PAS les faux positifs antivirus" -ForegroundColor Yellow
Write-Host "   - Pour distribution professionnelle : Certificat EV (~500 EUR/an)" -ForegroundColor Yellow
Write-Host "   - Voir : docs/CODE_SIGNING_GUIDE.md" -ForegroundColor Yellow
Write-Host ""

Write-Host "📚 Documentation :" -ForegroundColor Cyan
Write-Host "   docs/WORKFLOW_SIGNATURE_AUTOMATIQUE.md - Workflow complet" -ForegroundColor Gray
Write-Host "   docs/CERTIFICAT_AUTOSIGNE.md           - Guide auto-signé" -ForegroundColor Gray
Write-Host "   docs/CODE_SIGNING_GUIDE.md             - Certificat professionnel" -ForegroundColor Gray
Write-Host ""

# Ouvrir le dossier contenant l'installeur
if (-not $SkipInstaller) {
    $openFolder = Read-Host "Ouvrir le dossier de l'installeur ? (O/N)"
    if ($openFolder -eq "O" -or $openFolder -eq "o" -or $openFolder -eq "Y" -or $openFolder -eq "y") {
        explorer "dist\installer"
    }
}

Write-Host "✅ Terminé !" -ForegroundColor Green
Write-Host ""
