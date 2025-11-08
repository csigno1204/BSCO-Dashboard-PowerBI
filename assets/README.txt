===============================================================================
Dossier Assets - Dashboard Bexio Power BI
===============================================================================

Ce dossier contient les ressources graphiques pour l'application et l'installeur.

-------------------------------------------------------------------------------
Fichiers Attendus
-------------------------------------------------------------------------------

icon.ico
--------
Icône principale de l'application
- Taille: 256x256 pixels (multi-résolution recommandé: 16, 32, 48, 256)
- Format: ICO (Windows Icon)
- Utilisé pour:
  - Exécutable BexioDashboard.exe
  - Raccourcis (Bureau, Menu Démarrer)
  - Barre des tâches

Comment créer:
1. Créez une image 256x256 (PNG)
2. Convertissez en ICO:
   - En ligne: https://convertico.com/
   - Logiciel: IcoFX (https://icofx.ro/)
   - GIMP: File → Export As → .ico

installer_banner.bmp
--------------------
Image de fond de l'installeur (côté gauche)
- Taille: 164 x 314 pixels
- Format: BMP 24-bit
- Utilisé pour: Écrans de l'assistant d'installation Inno Setup

Conseils design:
- Couleurs professionnelles (bleu, gris)
- Logo en haut
- Gradient ou fond uni
- Texte minimal ou logo uniquement

installer_icon.bmp
------------------
Petite icône dans le coin supérieur gauche de l'installeur
- Taille: 55 x 58 pixels
- Format: BMP 24-bit
- Utilisé pour: En-tête de l'installeur Inno Setup

Conseils design:
- Même logo que icon.ico
- Simplifié pour la petite taille
- Contraste élevé

-------------------------------------------------------------------------------
Si les Fichiers Sont Manquants
-------------------------------------------------------------------------------

L'application et l'installeur fonctionneront quand même, mais:
- icon.ico manquant → Icône Windows par défaut
- installer_banner.bmp manquant → Bannière Inno Setup par défaut
- installer_icon.bmp manquant → Icône Inno Setup par défaut

Pour un résultat professionnel, il est FORTEMENT RECOMMANDÉ de créer ces assets.

-------------------------------------------------------------------------------
Outils Gratuits Recommandés
-------------------------------------------------------------------------------

Création d'icônes:
- IcoFX: https://icofx.ro/ (gratuit)
- GIMP: https://www.gimp.org/ (open-source)
- Inkscape: https://inkscape.org/ (open-source, vectoriel)

Conversion d'images:
- ConvertICO: https://convertico.com/ (en ligne)
- RealWorld Paint: http://www.rw-designer.com/image-editor (gratuit)

Graphisme:
- Canva: https://www.canva.com/ (gratuit)
- Figma: https://www.figma.com/ (gratuit)
- Paint.NET: https://www.getpaint.net/ (gratuit)

Icônes gratuites:
- Flaticon: https://www.flaticon.com/
- Icons8: https://icons8.com/
- Font Awesome: https://fontawesome.com/

-------------------------------------------------------------------------------
Exemple de Workflow
-------------------------------------------------------------------------------

1. Créer le logo principal (SVG ou PNG haute résolution)
2. Exporter en 256x256 PNG
3. Convertir en ICO avec IcoFX ou convertico.com
4. Placer icon.ico dans ce dossier
5. Créer installer_banner.bmp (164x314) avec Canva/Photoshop
6. Créer installer_icon.bmp (55x58) - redimensionner le logo
7. Recompiler: build_installer.bat

-------------------------------------------------------------------------------
Structure Attendue
-------------------------------------------------------------------------------

assets/
├── icon.ico                    ← Icône application (256x256)
├── installer_banner.bmp        ← Bannière installeur (164x314)
├── installer_icon.bmp          ← Icône installeur (55x58)
└── README.txt                  ← Ce fichier

-------------------------------------------------------------------------------
Licence
-------------------------------------------------------------------------------

Les assets créés pour ce projet doivent respecter les droits d'auteur.
N'utilisez que des images:
- Créées par vous
- Libre de droits
- Avec licence appropriée (CC0, CC-BY, etc.)

Sources recommandées (libres de droits):
- Unsplash: https://unsplash.com/
- Pexels: https://www.pexels.com/
- Pixabay: https://pixabay.com/

-------------------------------------------------------------------------------
Support
-------------------------------------------------------------------------------

Pour des questions sur les assets:
- Consultez docs/BUILD_INSTALLER.md
- Ouvrez une issue sur GitHub
- Contactez le support BSCO Solutions

===============================================================================
Mis à jour: Janvier 2025
===============================================================================
