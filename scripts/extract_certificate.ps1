# ====================================================================
# Script d'Extraction de Certificat depuis un Exe Signé
# Extrait le certificat d'un exe et le sauvegarde en .cer
# ====================================================================

param(
    [Parameter(Mandatory=$true, HelpMessage="Chemin vers l'exe signé")]
    [string]$ExePath,

    [Parameter(Mandatory=$false, HelpMessage="Chemin de sortie du certificat")]
    [string]$OutputPath = "$PSScriptRoot\certificates\BSCO_CodeSigning_SelfSigned.cer"
)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Extraction de Certificat" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier que l'exe existe
if (-not (Test-Path $ExePath)) {
    Write-Host "❌ Erreur : Le fichier n'existe pas : $ExePath" -ForegroundColor Red
    Write-Host ""
    exit 1
}

Write-Host "📋 Configuration :" -ForegroundColor Cyan
Write-Host "   Fichier source : $ExePath"
Write-Host "   Sortie         : $OutputPath"
Write-Host ""

# Vérifier si l'exe est signé
Write-Host "⏳ Vérification de la signature..." -ForegroundColor Yellow
$signature = Get-AuthenticodeSignature -FilePath $ExePath

if ($signature.Status -ne "Valid") {
    Write-Host ""
    Write-Host "❌ Erreur : Le fichier n'est pas signé ou la signature est invalide" -ForegroundColor Red
    Write-Host ""
    Write-Host "Status : $($signature.Status)" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Signez d'abord le fichier avec :" -ForegroundColor Yellow
    Write-Host "   .\sign_executable.ps1 -ExePath `"$ExePath`"" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

Write-Host "✅ Fichier signé correctement" -ForegroundColor Green
Write-Host ""

# Afficher les détails du certificat
Write-Host "📋 Informations du certificat :" -ForegroundColor Cyan
Write-Host "   Signataire    : $($signature.SignerCertificate.Subject)"
Write-Host "   Émetteur      : $($signature.SignerCertificate.Issuer)"
Write-Host "   Valide du     : $($signature.SignerCertificate.NotBefore)"
Write-Host "   Valide jusqu'à: $($signature.SignerCertificate.NotAfter)"
Write-Host "   Thumbprint    : $($signature.SignerCertificate.Thumbprint)"
Write-Host ""

# Créer le dossier de sortie si nécessaire
$outputDir = Split-Path -Parent $OutputPath
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
    Write-Host "✅ Dossier créé : $outputDir" -ForegroundColor Green
}

# Exporter le certificat
Write-Host "⏳ Extraction du certificat..." -ForegroundColor Yellow

try {
    # Exporter en format .cer (DER encoded)
    $certBytes = $signature.SignerCertificate.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Cert)
    [System.IO.File]::WriteAllBytes($OutputPath, $certBytes)

    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✅ EXTRACTION RÉUSSIE !" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "📁 Certificat exporté : $OutputPath" -ForegroundColor Green

    # Vérifier la taille du fichier
    $fileSize = (Get-Item $OutputPath).Length
    Write-Host "📊 Taille : $fileSize octets" -ForegroundColor Cyan
    Write-Host ""

    Write-Host "📖 Prochaines étapes :" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1️⃣  Le certificat a été extrait et sauvegardé" -ForegroundColor White
    Write-Host "   → $OutputPath" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2️⃣  L'installeur Inno Setup installera automatiquement ce certificat" -ForegroundColor White
    Write-Host "   → Lorsque vous compilerez l'installeur, il inclura ce .cer" -ForegroundColor Gray
    Write-Host "   → À l'installation, le certificat sera ajouté au Windows Store" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3️⃣  Les utilisateurs n'auront RIEN à faire manuellement !" -ForegroundColor White
    Write-Host "   → Double-clic sur BexioDashboard_Setup.exe" -ForegroundColor Gray
    Write-Host "   → Installation automatique du certificat" -ForegroundColor Gray
    Write-Host "   → Application installée et fonctionnelle" -ForegroundColor Gray
    Write-Host ""
    Write-Host "⚠️  IMPORTANT :" -ForegroundColor Yellow
    Write-Host "   - Ce certificat sera inclus AUTOMATIQUEMENT dans l'installeur" -ForegroundColor Yellow
    Write-Host "   - Aucune distribution manuelle du .cer nécessaire" -ForegroundColor Yellow
    Write-Host "   - L'installation du certificat se fait en arrière-plan" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🏗️  Compiler l'installeur :" -ForegroundColor Cyan
    Write-Host "   & `"C:\Program Files (x86)\Inno Setup 6\ISCC.exe`" installer\BexioDashboard_Setup.iss" -ForegroundColor Gray
    Write-Host ""
    Write-Host "💡 Pour distribution professionnelle sans faux positifs :" -ForegroundColor Yellow
    Write-Host "   → Certificat EV (~500 EUR/an)" -ForegroundColor Yellow
    Write-Host "   → Voir : docs/CODE_SIGNING_GUIDE.md" -ForegroundColor Yellow
    Write-Host ""

    # Créer un fichier d'information
    $infoPath = "$outputDir\CERTIFICATE_EXTRACTED.txt"
    @"
====================================================================
Certificat Extrait depuis Exe Signé
====================================================================

Extrait le     : $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
Depuis         : $ExePath
Vers           : $OutputPath

====================================================================
Informations du Certificat
====================================================================

Signataire     : $($signature.SignerCertificate.Subject)
Émetteur       : $($signature.SignerCertificate.Issuer)
Valide du      : $($signature.SignerCertificate.NotBefore)
Valide jusqu'à : $($signature.SignerCertificate.NotAfter)
Thumbprint     : $($signature.SignerCertificate.Thumbprint)

====================================================================
Installation Automatique
====================================================================

Ce certificat sera AUTOMATIQUEMENT inclus dans l'installeur Inno Setup
et installé dans le Windows Store lors de l'installation.

Les utilisateurs n'ont RIEN à faire manuellement !

Processus :
1. L'installeur détecte le .cer dans scripts/certificates/
2. Le copie dans {tmp} pendant l'installation
3. Exécute : certutil -addstore -user Root certificat.cer
4. Le certificat est installé silencieusement
5. L'application signée est reconnue comme valide

====================================================================
Workflow Complet
====================================================================

1. Générer certificat auto-signé :
   .\scripts\generate_selfsigned_certificate.ps1

2. Signer l'exe :
   .\scripts\sign_executable.ps1 -ExePath "dist\BexioDashboard.exe"

3. Extraire le certificat (ce script) :
   .\scripts\extract_certificate.ps1 -ExePath "dist\BexioDashboard.exe"

4. Compiler l'installeur :
   & "C:\Program Files (x86)\Inno Setup 6\ISCC.exe" installer\BexioDashboard_Setup.iss

5. Distribuer :
   → BexioDashboard_Setup.exe (contient tout !)

6. Installation utilisateur :
   → Double-clic
   → Certificat installé automatiquement
   → Application installée
   → C'est fini !

====================================================================
"@ | Out-File -FilePath $infoPath -Encoding UTF8

    Write-Host "💾 Informations sauvegardées : $infoPath" -ForegroundColor Green
    Write-Host ""

} catch {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  ❌ ERREUR" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Message : $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    exit 1
}

Write-Host "Appuyez sur une touche pour quitter..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
