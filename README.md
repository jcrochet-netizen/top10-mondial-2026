# Top 10 interactif — Mondial 2026

Outil interactif **drag & drop** pour composer son Top 10 des meilleurs joueurs de la
Coupe du Monde 2026 (données figées **après les 2 premières journées** de la phase de groupes).

À gauche : les 10 candidats. À droite : le classement de 1 à 10. On glisse les joueurs
(souris **et** tactile) vers les emplacements ; on peut échanger, retirer, réinitialiser.

## Variantes linguistiques

| Langue | Fichier |
|--------|---------|
| 🇫🇷 Français (défaut) | [`index.html`](index.html) |
| 🇬🇧 Anglais | [`en.html`](en.html) |
| 🇧🇷 Portugais (Brésil) | [`pt.html`](pt.html) |

Un sélecteur de langue (FR · EN · PT-BR) est intégré en haut de chaque page.
Le code est **identique** entre les trois fichiers : seule la ligne `const LANG = '…';`
change. Les libellés, les noms de pays et la pluralisation sont gérés dans l'objet `I18N`.

## Fonctionnalités

- Drag & drop unifié souris / tactile (pas de dépendance externe)
- Photos et statistiques officielles via **Sportmonks** (matchs, buts si > 0, passes décisives si > 0)
- Partage **X / Facebook / WhatsApp**, copie du texte
- **Téléchargement d'une image PNG** haute résolution du classement (canvas)
- Bouton **Partager natif** (Web Share API) sur mobile : joint directement l'image générée
- Largeur maximale 620 px, thème clair, accent rouge

## Données

Joueurs et stats figés dans chaque fichier HTML (saison Coupe du Monde 2026, Sportmonks).
La clé API n'est pas exposée : seules les URLs publiques du CDN images sont utilisées.

## Intégration

Page autonome, sans build. À héberger tel quel ou à intégrer en `<iframe>`.
En iframe, l'URL de partage est détectée automatiquement via le `referrer`
(sinon renseigner `CONFIG.shareUrl`).
