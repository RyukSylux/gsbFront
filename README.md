# 📱 Gestion des Frais GSB - Interface React

## 📝 Présentation du Projet
L'interface frontend de GSB est une application **Single Page Application (SPA)** moderne développée en React. Elle permet aux collaborateurs de soumettre leurs notes de frais avec une extraction automatisée des données via OCR.

🔗 **Dépôt Backend (API)** : Cette interface nécessite l'API backend pour la gestion des données, l'authentification sécurisée et le stockage des justificatifs sur AWS S3. Le code source est disponible ici : [https://github.com/RyukSylux/gsbBackend](https://github.com/RyukSylux/gsbBackend)

---

## 📋 Table des Matières
- [Processus OCR](#processus-ocr)
- [Authentification Hybride](#authentification-hybride)
- [Fonctionnalités Principales](#fonctionnalités-principales)
- [Comptes de Test](#comptes-de-test)
- [Stack Technique](#stack-technique)
- [Structure du Projet](#structure-du-projet)
- [Installation & Lancement](#installation--lancement)
- [Objectifs de l'Épreuve (E6 - SLAM)](#objectifs-de-lépreuve-e6---slam)
- [Auteur](#auteur)

---

## ✨ Fonctionnalités Principales
- **Authentification Sécurisée** : Connexion via JWT avec stratégie hybride (Cookies httpOnly + LocalStorage) pour une compatibilité Mac/Safari.
- **Soumission avec OCR** : Extraction automatique des données (description, montant, date) à partir des justificatifs.
- **Tableau de Bord Dynamique** : Liste des frais avec filtrage multi-critères (date, statut, montant, nom, catégorie).
- **Espace Admin** : 
  - Gestion des utilisateurs (CRUD).
  - Statistiques graphiques des dépenses par catégorie.
  - Actions groupées (suppression multiple).
- **Responsive Design** : Interface optimisée pour mobile et desktop via Tailwind CSS.

---

## 👁️ Processus OCR (Automatisation)
L'une des fonctionnalités phares est l'extraction automatique de données via IA locale :

```text
[ Fichier Image ] --> [ Service OCR (Tesseract.js) ]
                             |
                             v
               +-------------+-------------+
               |   Moteur de reconnaissance  |
               |      (Analyse locale)       |
               +-------------+-------------+
                             |
         +-------------------+-------------------+
         |                   |                   |
    [ Description ]      [ Montant ]          [ Date ]
         |                   |                   |
         v                   v                   v
    +---------------------------------------------+
    |         Pré-remplissage du Formulaire       |
    |         (Vérification par l'utilisateur)    |
    +---------------------------------------------+
```

---

## 🔒 Authentification Hybride
Pour garantir une compatibilité universelle (notamment pour les utilisateurs **macOS/Safari**), nous utilisons une stratégie de session double :

```text
1. Login --> Le serveur renvoie un Cookie httpOnly + un Token JSON.
2. Front --> Stocke le Token dans LocalStorage (Fallback).
3. Request --> Axios injecte automatiquement :
   - Le Cookie (natif navigateur)
   - Le Header "Authorization: Bearer <token>" (intercepteur Axios)
```

---

## 👥 Comptes de Test

### Administrateur
- **Email** : `test@gmail.com`
- **Mot de passe** : `test`

### Utilisateur Standard
- **Email** : `hugo@gmail.com`
- **Mot de passe** : `hugo`

### Commercial
- **Email** : `pablito@gmail.com`
- **Mot de passe** : `pablito1`

---

## 🛠️ Stack Technique
- **React 19 & Vite** : Bibliothèque UI et outil de build.
- **Tailwind CSS** : Framework CSS utilitaire.
- **Tesseract.js** : OCR (Reconnaissance de caractères) côté client.
- **React Router 7** : Gestion de la navigation et des routes privées.
- **Axios** : Client HTTP avec intercepteurs.
- **Recharts** : Bibliothèque de graphiques (Statistiques).
- **Headless UI & Heroicons** : Composants et icônes.
- **Date-fns** : Manipulation des dates.
- **Context API** : Gestion de l'état global.

---

## 📂 Structure du Projet
- `src/components/` : Composants UI (Modales, Tableaux, Layout).
- `src/services/` : Client API et logique OCR.
- `src/contexts/` : Fournisseurs d'état (Auth, Notifications).
- `src/pages/` : Vues principales (Dashboard, Stats, Login).
- `src/hooks/` : Hooks personnalisés réutilisables.

---

## 🚀 Installation & Lancement
1. **Installation** : `npm install`
2. **Configuration** : Créer un fichier `.env` :
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```
3. **Lancement** : `npm run dev`

---

## 🎓 Objectifs de l'Épreuve (E6 - SLAM)
Ce projet valide les compétences métier suivantes :
- **Développement** : Architecture d'une application complexe.
- **Automatisation** : Intégration de services tiers et d'IA.
- **Sécurité** : Protection des échanges et gestion des sessions.
- **Ergonomie** : UX/UI moderne et responsive.

---

## 👨‍💻 Auteur
- **Auteur** : Morgan Bourré
- **Contexte** : BTS SIO SLAM - Projet E6 (2025)
- **Entreprise** : Galaxy Swiss Bourdin (GSB)
