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

Chaque page est autonome dans sa langue. Le code est **identique** entre les trois
fichiers : seule la ligne `const LANG = '…';` change. Les libellés, les noms de pays
et la pluralisation sont gérés dans l'objet `I18N`.

## Fonctionnalités

- Drag & drop unifié souris / tactile (pas de dépendance externe)
- Photos et statistiques officielles via **Sportmonks** (matchs, buts si > 0, passes décisives si > 0)
- Bouton **Valider** → second écran **récap** avec le **Top 10 de la communauté**
- Partage **X / Facebook / WhatsApp**, copie du texte
- **Téléchargement d'une image PNG** haute résolution du classement (canvas)
- Bouton **Partager natif** (Web Share API) sur mobile : joint directement l'image générée
- Largeur maximale 620 px, thème clair, accent rouge

## Écran récap & vote communautaire (Google Sheet)

À la validation (10 joueurs classés), le vote est envoyé à un **Google Apps Script**
relié à un **Google Sheet**, puis l'écran récap affiche le **classement consensus** de
la communauté.

**Méthode de consensus (rang par rang, gloutonne) :**
pour le rang 1 on prend le joueur le plus voté en n°1 ; pour le rang 2 le plus voté en
n°2 *parmi les joueurs restants* ; etc. **Un joueur ne garde que sa meilleure place** :
s'il est le plus voté en n°1 **et** en n°4, il est placé en n°1, et le n°4 revient au
joueur suivant le plus voté à ce rang.

### Connexion (script fourni : [`apps-script/Code.gs`](apps-script/Code.gs))

1. Crée un Google Sheet vierge.
2. **Extensions ▸ Apps Script**, colle le contenu de [`apps-script/Code.gs`](apps-script/Code.gs), enregistre.
3. **Déployer ▸ Nouveau déploiement ▸ Application Web** — *Exécuter en tant que : Moi* · *Qui a accès : Tout le monde*.
4. Copie l'URL `…/exec` et renseigne-la dans **chaque** fichier HTML :
   ```js
   const CONFIG = { …, votesUrl:"https://script.google.com/macros/s/XXXX/exec" };
   ```

Tant que `votesUrl` est vide, l'écran récap fonctionne en mode local (seul le vote du
visiteur est affiché). Anti-spam : 1 vote par navigateur (`localStorage`).

## Données

Joueurs et stats figés dans chaque fichier HTML (saison Coupe du Monde 2026, Sportmonks).
La clé API n'est pas exposée : seules les URLs publiques du CDN images sont utilisées.

## Intégration

Page autonome, sans build. À héberger tel quel ou à intégrer en `<iframe>`.
En iframe, l'URL de partage est détectée automatiquement via le `referrer`
(sinon renseigner `CONFIG.shareUrl`).
