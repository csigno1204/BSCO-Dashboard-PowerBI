# ====================================================================
# Script de Génération de Certificat Auto-signé
# Pour tests et distribution interne uniquement
# ====================================================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Génération Certificat Auto-signé" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configuration du certificat
$certSubject = "CN=BSCO Solutions,O=BSCO Solutions,L=Geneva,S=Geneva,C=CH"
$certFriendlyName = "BSCO Solutions Code Signing Certificate (Self-Signed)"
$certExportPassword = "MotDePasseSecurise123!" # Changez ce mot de passe !
$certValidityYears = 3

# Chemins de sortie
$certOutputDir = "$PSScriptRoot\certificates"
$pfxPath = "$certOutputDir\BSCO_CodeSigning_SelfSigned.pfx"
$cerPath = "$certOutputDir\BSCO_CodeSigning_SelfSigned.cer"

# Créer le dossier de sortie
if (-not (Test-Path $certOutputDir)) {
    New-Item -ItemType Directory -Path $certOutputDir -Force | Out-Null
    Write-Host "✅ Dossier créé : $certOutputDir" -ForegroundColor Green
}

Write-Host "⏳ Génération du certificat auto-signé..." -ForegroundColor Yellow
Write-Host ""

try {
    # Générer le certificat auto-signé
    $cert = New-SelfSignedCertificate `
        -Type CodeSigningCert `
        -Subject $certSubject `
        -FriendlyName $certFriendlyName `
        -KeyAlgorithm RSA `
        -KeyLength 2048 `
        -HashAlgorithm SHA256 `
        -NotAfter (Get-Date).AddYears($certValidityYears) `
        -CertStoreLocation "Cert:\CurrentUser\My" `
        -KeyExportPolicy Exportable

    Write-Host "✅ Certificat généré avec succès !" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Informations du certificat :" -ForegroundColor Cyan
    Write-Host "   Subject       : $($cert.Subject)"
    Write-Host "   Thumbprint    : $($cert.Thumbprint)"
    Write-Host "   Valid From    : $($cert.NotBefore)"
    Write-Host "   Valid Until   : $($cert.NotAfter)"
    Write-Host "   Store Location: Cert:\CurrentUser\My\$($cert.Thumbprint)"
    Write-Host ""

    # Exporter le certificat en .pfx (avec clé privée)
    Write-Host "⏳ Export du certificat en .pfx..." -ForegroundColor Yellow
    $securePwd = ConvertTo-SecureString -String $certExportPassword -Force -AsPlainText
    Export-PfxCertificate -Cert $cert -FilePath $pfxPath -Password $securePwd | Out-Null
    Write-Host "✅ Certificat exporté : $pfxPath" -ForegroundColor Green
    Write-Host "   Mot de passe : $certExportPassword" -ForegroundColor Yellow
    Write-Host ""

    # Exporter le certificat en .cer (clé publique uniquement)
    Write-Host "⏳ Export du certificat en .cer..." -ForegroundColor Yellow
    Export-Certificate -Cert $cert -FilePath $cerPath | Out-Null
    Write-Host "✅ Certificat public exporté : $cerPath" -ForegroundColor Green
    Write-Host ""

    # Ajouter le certificat au store Trusted Root (pour ce PC uniquement)
    Write-Host "⏳ Ajout du certificat au store 'Trusted Root'..." -ForegroundColor Yellow
    $store = New-Object System.Security.Cryptography.X509Certificates.X509Store("Root", "CurrentUser")
    $store.Open("ReadWrite")
    $store.Add($cert)
    $store.Close()
    Write-Host "✅ Certificat ajouté au store 'Trusted Root' de l'utilisateur actuel" -ForegroundColor Green
    Write-Host ""

    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✅ SUCCÈS !" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "📁 Fichiers créés :" -ForegroundColor Cyan
    Write-Host "   $pfxPath"
    Write-Host "   $cerPath"
    Write-Host ""
    Write-Host "🔒 Mot de passe .pfx :" -ForegroundColor Yellow
    Write-Host "   $certExportPassword"
    Write-Host ""
    Write-Host "⚠️  IMPORTANT :" -ForegroundColor Yellow
    Write-Host "   - Ce certificat est AUTO-SIGNÉ (pour tests uniquement)"
    Write-Host "   - N'élimine PAS les faux positifs antivirus"
    Write-Host "   - Les utilisateurs devront installer le certificat .cer manuellement"
    Write-Host "   - Windows affichera toujours 'Éditeur inconnu' pour les autres utilisateurs"
    Write-Host ""
    Write-Host "📖 Prochaines étapes :" -ForegroundColor Cyan
    Write-Host "   1. Utilisez sign_executable.ps1 pour signer vos exe"
    Write-Host "   2. Distribuez le fichier .cer aux utilisateurs"
    Write-Host "   3. Les utilisateurs doivent installer le .cer (voir docs/CERTIFICAT_AUTOSIGNE.md)"
    Write-Host ""
    Write-Host "💡 Pour une solution professionnelle sans faux positifs :" -ForegroundColor Yellow
    Write-Host "   Consultez docs/CODE_SIGNING_GUIDE.md pour obtenir un certificat EV"
    Write-Host ""

    # Sauvegarder les informations dans un fichier
    $infoPath = "$certOutputDir\CERTIFICATE_INFO.txt"
    @"
====================================================================
Certificat Auto-signé BSCO Solutions
====================================================================

Généré le     : $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
Subject       : $($cert.Subject)
Thumbprint    : $($cert.Thumbprint)
Valide du     : $($cert.NotBefore)
Valide jusqu'à: $($cert.NotAfter)

====================================================================
Fichiers
====================================================================

Certificat .pfx (avec clé privée) :
  Chemin      : $pfxPath
  Mot de passe: $certExportPassword
  Usage       : Pour VOUS (signature des exe)

Certificat .cer (clé publique uniquement) :
  Chemin      : $cerPath
  Usage       : Pour VOS UTILISATEURS (installation du certificat)

====================================================================
Installation pour les Utilisateurs
====================================================================

Les utilisateurs doivent installer le certificat .cer :

1. Double-cliquez sur BSCO_CodeSigning_SelfSigned.cer
2. Cliquez sur "Installer le certificat"
3. Sélectionnez "Utilisateur actuel"
4. Choisissez "Placer tous les certificats dans le magasin suivant"
5. Cliquez sur "Parcourir" → "Autorités de certification racines de confiance"
6. Cliquez sur "OK" → "Suivant" → "Terminer"
7. Acceptez l'avertissement de sécurité

⚠️ ATTENTION : Certificat auto-signé = pour tests uniquement !

====================================================================
Signature d'un Exécutable
====================================================================

Utilisez le script sign_executable.ps1 :

  .\sign_executable.ps1 -ExePath "C:\chemin\vers\fichier.exe"

Ou utilisez SignTool directement :

  signtool sign /f "$pfxPath" /p "$certExportPassword" /fd SHA256 /tr http://timestamp.digicert.com /td SHA256 "fichier.exe"

====================================================================
Limitations
====================================================================

❌ N'élimine PAS les faux positifs antivirus
❌ Nécessite installation manuelle du .cer par chaque utilisateur
❌ Windows affiche "Éditeur inconnu" sans installation du .cer
❌ Aucune réputation SmartScreen

✅ Bon pour tests internes et distribution limitée

====================================================================
Solution Professionnelle
====================================================================

Pour éliminer les faux positifs et avoir une vraie réputation :
→ Certificat EV (~500 EUR/an)
→ Voir : docs/CODE_SIGNING_GUIDE.md

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
    Write-Host "⚠️  Vérifiez que :" -ForegroundColor Yellow
    Write-Host "   - Vous exécutez PowerShell en tant qu'administrateur"
    Write-Host "   - Votre politique d'exécution permet les scripts : Set-ExecutionPolicy RemoteSigned"
    Write-Host ""
    exit 1
}

Write-Host "Appuyez sur une touche pour quitter..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
