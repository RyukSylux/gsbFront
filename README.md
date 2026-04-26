# Gestion des Frais GSB - Frontend React

## Présentation du Projet
Ce projet est une application web développée dans le cadre de l'épreuve E6 du BTS SIO (Services Informatiques aux Organisations), option SLAM (Solutions Logicielles et Applications Métiers). L'application est conçue pour la gestion et la dématérialisation des notes de frais pour l'entreprise GSB (Galaxy Swiss Bourdin).

## Dépôt Backend
Le code source de l'API backend de ce projet est disponible ici : [RyukSylux/gsbBackend](https://github.com/RyukSylux/gsbBackend).

## Fonctionnalités Principales
- **Authentification Utilisateur** : Connexion sécurisée et gestion des sessions.
- **Soumission de Notes de Frais** : Les utilisateurs peuvent créer de nouvelles notes de frais (factures) avec les fonctionnalités suivantes :
  - Téléchargement d'un justificatif (image ou PDF)
  - Extraction automatique de la description, du montant total et de la date via OCR (Tesseract.js)
  - Saisie manuelle en cas d'échec de l'OCR
  - Sélecteur de date pour la date de la dépense
- **Liste des Notes de Frais & Filtrage** :
  - Affichage de toutes les notes de frais soumises dans un tableau
  - Filtrage par description, date, date de création, statut et montant (min/max)
  - Fonctionnalités de tri et de recherche
- **Fonctionnalités Administrateur** :
  - Consulter tous les utilisateurs et leurs notes de frais
  - Modifier ou supprimer des utilisateurs et des notes de frais
  - Actions en masse (sélectionner et supprimer plusieurs factures)
- **Notifications** : Retours visuels pour les actions de l'utilisateur et les erreurs
- **Design Responsive** : Utilisable sur ordinateur et mobile

## Comptes de Test

> **⚠️ AVERTISSEMENT DE SÉCURITÉ** : Les mots de passe ci-dessous sont volontairement triviaux car ils sont exclusivement réservés à un **environnement de démonstration** (comme notre déploiement Vercel). Ils ne doivent en aucun cas être utilisés sur un environnement de production réel.

Les comptes suivants peuvent être utilisés pour tester l'application :

### Administrateur
- **Email** : test@gmail.com
- **Mot de passe** : test

### Utilisateur Standard
- **Email** : hugo@gmail.com
- **Mot de passe** : hugo

### Commercial
- **Email** : pablito@gmail.com
- **Mot de passe** : pablito1

---

## Stack Technique
- **Frontend** : React 19, Vite, Tailwind CSS
- **OCR** : Tesseract.js (v4.1.1)
- **Composants UI** : Headless UI, Heroicons
- **Bibliothèque** : Date-fns pour la manipulation des dates
- **Gestion d'État** : API React Context
- **Communication API** : Axios
- **Authentification** : JWT (géré par le backend)

## Structure du Projet
- `src/components/` : Composants UI (tableaux, modales, mise en page, etc.)
- `src/services/` : Logique de l'API et du service OCR
- `src/contexts/` : Fournisseurs de contexte (authentification, notifications)
- `src/pages/` : Pages principales de l'application
- `src/hooks/` : Hooks React personnalisés

## Installation et Lancement
1. Cloner le dépôt
2. Installer les dépendances : `npm install`
3. Configurer l'environnement : 
   - Copier le fichier `.env.example` et le renommer en `.env`
   - S'assurer que la variable `VITE_API_URL` est bien définie (par défaut : `http://localhost:3000` pointant vers le backend local)
4. Démarrer le serveur de développement : `npm run dev`
5. Construire pour la production : `npm run build`
6. Prévisualiser la version de production : `npm run preview`

## Auteur & Contexte
- **Auteur** : Morgan Bourré
- **Contexte** : BTS SIO SLAM - Épreuve E6 (Projet Professionnel)
- **Entreprise** : Galaxy Swiss Bourdin (GSB)
- **Année** : 2025

## Objectifs de l'Épreuve (E6 - SLAM)
- Concevoir et développer une application métier
- Implémenter le traitement des données et l'automatisation (OCR)
- Assurer la sécurité et l'intégrité des données
- Fournir une interface ergonomique et professionnelle
