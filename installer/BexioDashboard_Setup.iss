; ============================================================================
; Script Inno Setup - Installeur Windows Professionnel
; Dashboard Bexio → Power BI
; ============================================================================

#define MyAppName "Dashboard Bexio Power BI"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "BSCO Solutions"
#define MyAppURL "https://github.com/csigno1204/BSCO-Dashboard-PowerBI"
#define MyAppExeName "BexioDashboard.exe"
#define MyAppDescription "Solution complète d'extraction Bexio vers Power BI"

[Setup]
; Informations de base
AppId={{B3E4D2C1-8F5A-4B9C-A2D7-1E6F8C9D4A5B}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppVerName={#MyAppName} {#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={autopf}\{#MyAppName}
DefaultGroupName={#MyAppName}
DisableProgramGroupPage=yes
LicenseFile=..\LICENSE
InfoBeforeFile=..\README.md
OutputDir=..\dist\installer
OutputBaseFilename=BexioDashboard_Setup_v{#MyAppVersion}
SetupIconFile=..\assets\icon.ico
Compression=lzma2/ultra64
SolidCompression=yes
WizardStyle=modern
ArchitecturesAllowed=x64
ArchitecturesInstallIn64BitMode=x64

; Privilèges
PrivilegesRequired=admin
PrivilegesRequiredOverridesAllowed=dialog

; Interface
WizardImageFile=..\assets\installer_banner.bmp
WizardSmallImageFile=..\assets\installer_icon.bmp
DisableWelcomePage=no
ShowLanguageDialog=yes

; Désinstallation
UninstallDisplayIcon={app}\{#MyAppExeName}
UninstallDisplayName={#MyAppName}
CreateUninstallRegKey=yes

[Languages]
Name: "french"; MessagesFile: "compiler:Languages\French.isl"
Name: "english"; MessagesFile: "compiler:Default.isl"
Name: "german"; MessagesFile: "compiler:Languages\German.isl"
Name: "italian"; MessagesFile: "compiler:Languages\Italian.isl"

[CustomMessages]
french.LaunchProgram=Lancer %1 après l'installation
english.LaunchProgram=Launch %1 after installation
german.LaunchProgram=%1 nach der Installation starten
italian.LaunchProgram=Avvia %1 dopo l'installazione

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked
Name: "quicklaunchicon"; Description: "{cm:CreateQuickLaunchIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked; OnlyBelowVersion: 6.1; Check: not IsAdminInstallMode
Name: "autostart"; Description: "Lancer au démarrage de Windows"; GroupDescription: "Options supplémentaires:"; Flags: unchecked

[Files]
; Exécutable principal (généré par PyInstaller)
Source: "..\dist\BexioDashboard\{#MyAppExeName}"; DestDir: "{app}"; Flags: ignoreversion

; Tous les fichiers de l'application empaquetée
Source: "..\dist\BexioDashboard\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

; Scripts Python (pour utilisateurs avancés)
Source: "..\scripts\*"; DestDir: "{app}\scripts"; Flags: ignoreversion recursesubdirs createallsubdirs

; Documentation
Source: "..\docs\*"; DestDir: "{app}\docs"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "..\README.md"; DestDir: "{app}"; Flags: ignoreversion
Source: "..\LICENSE"; DestDir: "{app}"; Flags: ignoreversion
Source: "..\CHANGELOG.md"; DestDir: "{app}"; Flags: ignoreversion isreadme

; Configuration
Source: "..\*.yaml"; DestDir: "{app}"; Flags: ignoreversion
Source: "..\.env.example"; DestDir: "{app}"; Flags: ignoreversion
Source: "..\requirements.txt"; DestDir: "{app}"; Flags: ignoreversion

; Power BI
Source: "..\powerbi\*"; DestDir: "{app}\powerbi"; Flags: ignoreversion recursesubdirs createallsubdirs

; Assets
Source: "..\assets\*"; DestDir: "{app}\assets"; Flags: ignoreversion recursesubdirs createallsubdirs

; NOTE: Don't use "Flags: ignoreversion" on any shared system files

[Dirs]
Name: "{app}\data"; Permissions: users-full
Name: "{app}\logs"; Permissions: users-full
Name: "{app}\backups"; Permissions: users-full
Name: "{app}\configs"; Permissions: users-full
Name: "{app}\temp"; Permissions: users-full

[Icons]
; Menu Démarrer
Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"
Name: "{group}\Configuration"; Filename: "{app}\{#MyAppExeName}"; Parameters: "--setup"
Name: "{group}\Documentation"; Filename: "{app}\docs\README.md"
Name: "{group}\Guide d'Installation"; Filename: "{app}\docs\INSTALLATION.md"
Name: "{group}\Guide d'Utilisation"; Filename: "{app}\docs\USAGE.md"
Name: "{group}\Validation des Données"; Filename: "{app}\docs\VALIDATION_DONNEES.md"
Name: "{group}\{cm:UninstallProgram,{#MyAppName}}"; Filename: "{uninstallexe}"

; Bureau
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon

; Barre de lancement rapide
Name: "{userappdata}\Microsoft\Internet Explorer\Quick Launch\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: quicklaunchicon

; Démarrage automatique
Name: "{userstartup}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Parameters: "--minimized"; Tasks: autostart

[Run]
; Lancer l'assistant de configuration après installation
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent

; Ouvrir le guide de démarrage
Filename: "{app}\docs\INSTALLATION.md"; Description: "Lire le guide d'installation"; Flags: postinstall shellexec skipifsilent unchecked

[UninstallRun]
; Nettoyer les fichiers temporaires lors de la désinstallation
Filename: "{app}\cleanup.bat"; Flags: runhidden; RunOnceId: "CleanupFiles"

[Code]
var
  PythonInstalledPage: TOutputMsgWizardPage;
  PythonInstalled: Boolean;

// Vérifie si Python est installé (optionnel, car on utilise PyInstaller)
function IsPythonInstalled: Boolean;
var
  ResultCode: Integer;
begin
  Result := Exec('python', '--version', '', SW_HIDE, ewWaitUntilTerminated, ResultCode) and (ResultCode = 0);
end;

procedure InitializeWizard;
begin
  PythonInstalledPage := CreateOutputMsgPage(wpWelcome,
    'Vérification des prérequis',
    'Détection de Python',
    'L''installeur va maintenant vérifier si Python est installé sur votre système.' + #13#10 + #13#10 +
    'Note: Python n''est PAS nécessaire pour utiliser l''application, ' +
    'mais peut être utile pour les utilisateurs avancés qui souhaitent modifier les scripts.' + #13#10 + #13#10 +
    'Cliquez sur Suivant pour continuer.');
end;

procedure CurStepChanged(CurStep: TSetupStep);
var
  EnvExample, EnvFile: String;
begin
  if CurStep = ssPostInstall then
  begin
    // Créer .env depuis .env.example si n'existe pas
    EnvExample := ExpandConstant('{app}\.env.example');
    EnvFile := ExpandConstant('{app}\.env');

    if not FileExists(EnvFile) then
    begin
      FileCopy(EnvExample, EnvFile, False);
    end;

    // Vérifier Python
    PythonInstalled := IsPythonInstalled;
    if PythonInstalled then
    begin
      MsgBox('Python détecté sur votre système.' + #13#10 +
             'Vous pourrez modifier les scripts si nécessaire.',
             mbInformation, MB_OK);
    end;
  end;
end;

function InitializeSetup(): Boolean;
begin
  Result := True;

  // Vérifier si une version est déjà installée
  if RegKeyExists(HKEY_LOCAL_MACHINE, 'SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\{{B3E4D2C1-8F5A-4B9C-A2D7-1E6F8C9D4A5B}_is1') then
  begin
    if MsgBox('Une version de {#MyAppName} est déjà installée.' + #13#10 + #13#10 +
              'Voulez-vous la désinstaller avant de continuer ?',
              mbConfirmation, MB_YESNO) = IDYES then
    begin
      // Lancer la désinstallation
      // Note: l'utilisateur devra relancer l'installeur après
      MsgBox('Veuillez désinstaller la version existante puis relancer cet installeur.',
             mbInformation, MB_OK);
      Result := False;
    end;
  end;
end;

procedure CurUninstallStepChanged(CurUninstallStep: TUninstallStep);
var
  DataDir, LogsDir, BackupsDir: String;
begin
  if CurUninstallStep = usPostUninstall then
  begin
    // Demander si on doit supprimer les données
    if MsgBox('Voulez-vous supprimer vos données (extractions, logs, backups) ?' + #13#10 + #13#10 +
              'Si vous prévoyez de réinstaller, choisissez Non pour conserver vos données.',
              mbConfirmation, MB_YESNO) = IDYES then
    begin
      DataDir := ExpandConstant('{app}\data');
      LogsDir := ExpandConstant('{app}\logs');
      BackupsDir := ExpandConstant('{app}\backups');

      DelTree(DataDir, True, True, True);
      DelTree(LogsDir, True, True, True);
      DelTree(BackupsDir, True, True, True);

      MsgBox('Données supprimées avec succès.', mbInformation, MB_OK);
    end;
  end;
end;

[Registry]
; Ajouter au PATH (optionnel)
Root: HKLM; Subkey: "SYSTEM\CurrentControlSet\Control\Session Manager\Environment"; \
    ValueType: expandsz; ValueName: "Path"; ValueData: "{olddata};{app}"; \
    Check: NeedsAddPath('{app}')

; Enregistrer l'application
Root: HKLM; Subkey: "SOFTWARE\{#MyAppPublisher}\{#MyAppName}"; \
    ValueType: string; ValueName: "InstallPath"; ValueData: "{app}"; \
    Flags: uninsdeletekey
Root: HKLM; Subkey: "SOFTWARE\{#MyAppPublisher}\{#MyAppName}"; \
    ValueType: string; ValueName: "Version"; ValueData: "{#MyAppVersion}"

[Code]
function NeedsAddPath(Param: string): Boolean;
var
  OrigPath: string;
begin
  if not RegQueryStringValue(HKEY_LOCAL_MACHINE,
    'SYSTEM\CurrentControlSet\Control\Session Manager\Environment',
    'Path', OrigPath)
  then begin
    Result := True;
    exit;
  end;
  // Look for the path with leading and trailing semicolon
  Result := Pos(';' + Param + ';', ';' + OrigPath + ';') = 0;
end;

// ============================================================================
// Messages personnalisés
// ============================================================================

[Messages]
WelcomeLabel1=Bienvenue dans l'assistant d'installation de [name]
WelcomeLabel2=Cet assistant va installer [name/ver] sur votre ordinateur.%n%nCette solution vous permet d'extraire vos données Bexio et de les transformer automatiquement pour Power BI.%n%nIl est recommandé de fermer toutes les autres applications avant de continuer.
FinishedHeadingLabel=Installation terminée !
FinishedLabelNoIcons=L'installation de [name] est terminée.%n%nLancez l'application depuis le menu Démarrer ou l'icône sur le bureau.
FinishedLabel=L'installation de [name] est terminée.%n%n⚙️  Prochaines étapes:%n%n1. Configurez votre token API Bexio dans le fichier .env%n2. Lancez l'application et testez la connexion%n3. Effectuez votre première extraction%n4. Importez les données dans Power BI%n%nConsultez la documentation complète dans le dossier 'docs'.
