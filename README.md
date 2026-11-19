# Suivi

Application mobile de suivi personnel : planifier ses tâches du jour, de la semaine et du mois.

## Fonctionnalités

- Tâches à trois échelles : jour, semaine, mois
- Moment facultatif : heure (jour), jour de la semaine (semaine), numéro de semaine (mois)
- Cocher, supprimer, progression de l'échelle affichée
- Données enregistrées dans le téléphone, fonctionne sans internet
- Mode clair et mode sombre automatiques

## Technologies

React Native, Expo, TypeScript, AsyncStorage, Jest.

## Lancer le projet

Node.js 22.13 ou plus récent est nécessaire.

    npm install
    npx expo start

Scanne le QR code avec l'application Expo Go.

## Tests

    npm test

## Structure

- `App.tsx` : assemble l'écran
- `src/types.ts` : types des tâches
- `src/logique.ts` : règles de gestion des tâches (testées)
- `src/stockage.ts` : lecture et écriture dans le téléphone
- `src/theme.ts` : couleurs et thème
- `src/composants/` : éléments d'interface

## Feuille de route

1. Tâches (terminé)
2. Rappels
3. Objectifs découpés en tâches
4. Envies et idées
5. Épargne