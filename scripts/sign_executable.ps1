# ====================================================================
# Script de Signature d'Exécutables
# Utilise le certificat auto-signé ou un certificat officiel
# ====================================================================

param(
    [Parameter(Mandatory=$true, HelpMessage="Chemin vers l'exe à signer")]
    [string]$ExePath,

    [Parameter(Mandatory=$false, HelpMessage="Chemin vers le certificat .pfx")]
    [string]$CertPath = "$PSScriptRoot\certificates\BSCO_CodeSigning_SelfSigned.pfx",

    [Parameter(Mandatory=$false, HelpMessage="Mot de passe du certificat")]
    [string]$CertPassword = "MotDePasseSecurise123!",

    [Parameter(Mandatory=$false, HelpMessage="URL du serveur de timestamp")]
    [string]$TimestampServer = "http://timestamp.digicert.com"
)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Signature d'Exécutable" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier que l'exe existe
if (-not (Test-Path $ExePath)) {
    Write-Host "❌ Erreur : Le fichier n'existe pas : $ExePath" -ForegroundColor Red
    Write-Host ""
    exit 1
}

# Vérifier que le certificat existe
if (-not (Test-Path $CertPath)) {
    Write-Host "❌ Erreur : Le certificat n'existe pas : $CertPath" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Générez d'abord un certificat avec :" -ForegroundColor Yellow
    Write-Host "   .\generate_selfsigned_certificate.ps1" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

Write-Host "📋 Configuration :" -ForegroundColor Cyan
Write-Host "   Exécutable    : $ExePath"
Write-Host "   Certificat    : $CertPath"
Write-Host "   Timestamp     : $TimestampServer"
Write-Host ""

# Chercher SignTool (fourni avec Windows SDK)
$possiblePaths = @(
    "C:\Program Files (x86)\Windows Kits\10\bin\10.0.22621.0\x64\signtool.exe",
    "C:\Program Files (x86)\Windows Kits\10\bin\10.0.22000.0\x64\signtool.exe",
    "C:\Program Files (x86)\Windows Kits\10\bin\10.0.19041.0\x64\signtool.exe",
    "C:\Program Files (x86)\Windows Kits\10\bin\10.0.18362.0\x64\signtool.exe",
    "C:\Program Files (x86)\Windows Kits\10\bin\x64\signtool.exe"
)

$signtool = $null
foreach ($path in $possiblePaths) {
    if (Test-Path $path) {
        $signtool = $path
        break
    }
}

if (-not $signtool) {
    Write-Host "❌ Erreur : SignTool.exe non trouvé" -ForegroundColor Red
    Write-Host ""
    Write-Host "⚠️  SignTool fait partie du Windows SDK" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📥 Téléchargez et installez Windows SDK :" -ForegroundColor Cyan
    Write-Host "   https://developer.microsoft.com/en-us/windows/downloads/windows-sdk/" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Ou installez uniquement SignTool via Chocolatey :" -ForegroundColor Cyan
    Write-Host "   choco install windows-sdk-10.0" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

Write-Host "✅ SignTool trouvé : $signtool" -ForegroundColor Green
Write-Host ""

# Vérifier si l'exe est déjà signé
Write-Host "⏳ Vérification signature existante..." -ForegroundColor Yellow
$verifyResult = & $signtool verify /pa "$ExePath" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "⚠️  Le fichier est déjà signé !" -ForegroundColor Yellow
    Write-Host ""

    # Afficher les détails de la signature existante
    Write-Host "📋 Signature existante :" -ForegroundColor Cyan
    & $signtool verify /pa /v "$ExePath" 2>&1 | Select-String "Signing Certificate Chain|Issued to|Issued by|Expires" | ForEach-Object {
        Write-Host "   $_"
    }
    Write-Host ""

    $response = Read-Host "Voulez-vous re-signer le fichier ? (O/N)"
    if ($response -ne "O" -and $response -ne "o" -and $response -ne "Y" -and $response -ne "y") {
        Write-Host ""
        Write-Host "✅ Opération annulée" -ForegroundColor Yellow
        Write-Host ""
        exit 0
    }
} else {
    Write-Host "✅ Le fichier n'est pas signé" -ForegroundColor Green
    Write-Host ""
}

# Signer l'exécutable
Write-Host "⏳ Signature de l'exécutable en cours..." -ForegroundColor Yellow
Write-Host ""

$signArgs = @(
    "sign",
    "/f", "`"$CertPath`"",
    "/p", "`"$CertPassword`"",
    "/fd", "SHA256",
    "/tr", $TimestampServer,
    "/td", "SHA256",
    "`"$ExePath`""
)

Write-Host "🔧 Commande exécutée :" -ForegroundColor Cyan
Write-Host "   $signtool $($signArgs -join ' ')" -ForegroundColor Gray
Write-Host ""

$process = Start-Process -FilePath $signtool -ArgumentList $signArgs -Wait -NoNewWindow -PassThru

if ($process.ExitCode -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✅ SIGNATURE RÉUSSIE !" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""

    # Vérifier la signature
    Write-Host "⏳ Vérification de la signature..." -ForegroundColor Yellow
    Write-Host ""

    & $signtool verify /pa /v "$ExePath"

    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Signature valide !" -ForegroundColor Green
        Write-Host ""

        # Afficher les détails avec PowerShell
        $signature = Get-AuthenticodeSignature -FilePath $ExePath
        Write-Host "📋 Détails de la signature :" -ForegroundColor Cyan
        Write-Host "   Signataire    : $($signature.SignerCertificate.Subject)"
        Write-Host "   Émetteur      : $($signature.SignerCertificate.Issuer)"
        Write-Host "   Status        : $($signature.Status)"
        Write-Host "   Algorithme    : $($signature.HashAlgorithm)"
        Write-Host "   Timestamp     : $($signature.TimeStamperCertificate.NotAfter)"
        Write-Host ""

        if ($signature.SignerCertificate.Subject -like "*BSCO Solutions*") {
            Write-Host "⚠️  RAPPEL : Certificat AUTO-SIGNÉ" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "   - Pour VOUS : La signature est valide" -ForegroundColor Yellow
            Write-Host "   - Pour VOS UTILISATEURS : Ils doivent installer le .cer" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "📖 Guide d'installation pour utilisateurs :" -ForegroundColor Cyan
            Write-Host "   docs/CERTIFICAT_AUTOSIGNE.md" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "💡 Pour éliminer les faux positifs antivirus :" -ForegroundColor Yellow
            Write-Host "   → Certificat EV professionnel (~500 EUR/an)" -ForegroundColor Yellow
            Write-Host "   → Voir : docs/CODE_SIGNING_GUIDE.md" -ForegroundColor Yellow
            Write-Host ""
        }

    } else {
        Write-Host ""
        Write-Host "⚠️  La signature a été appliquée mais la vérification a échoué" -ForegroundColor Yellow
        Write-Host ""
    }

} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  ❌ ÉCHEC DE LA SIGNATURE" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Code d'erreur : $($process.ExitCode)" -ForegroundColor Red
    Write-Host ""
    Write-Host "⚠️  Causes possibles :" -ForegroundColor Yellow
    Write-Host "   - Mot de passe du certificat incorrect"
    Write-Host "   - Certificat expiré"
    Write-Host "   - Fichier exe verrouillé (fermez l'application)"
    Write-Host "   - Permissions insuffisantes"
    Write-Host ""
    exit 1
}

Write-Host "Appuyez sur une touche pour quitter..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
