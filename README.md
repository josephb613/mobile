# Application de Rappels avec Alarme

Une application Android native développée avec React Native et Expo pour gérer vos rappels avec alarmes sonores et notifications.

## 🎯 Fonctionnalités

- ✅ Créer, modifier et supprimer des rappels
- ⏰ Alarmes avec notifications locales
- 🔔 Son d'alarme même écran verrouillé
- 📳 Vibration configurable
- 🔄 Répétition (unique, quotidienne, hebdomadaire)
- 🎨 Niveaux de priorité avec code couleur
- 🌓 Mode clair/sombre automatique
- 💾 Stockage local avec SQLite
- 📱 Fonctionne 100% hors ligne
- 🔋 Optimisé pour la batterie

## 📋 Prérequis

- Node.js 18+ ou 20+
- npm ou yarn
- Android Studio (pour le build APK)
- Un appareil Android 8.0+ ou émulateur

## 🚀 Installation et Développement

### 1. Installer les dépendances

```bash
npm install
```

### 2. Lancer en mode développement

```bash
# Android
npm run android

# iOS (Mac uniquement)
npm run ios

# Web
npm run web
```

## 📦 Build APK pour Android

### Option 1: Build de développement (Debug APK)

```bash
# Générer le build de développement
npx expo run:android --variant debug

# L'APK sera disponible dans:
# android/app/build/outputs/apk/debug/app-debug.apk
```

### Option 2: Build de production (Release APK)

1. **Configurer le keystore** (première fois uniquement):

```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore alarme-app.keystore -alias alarme-app -keyalg RSA -keysize 2048 -validity 10000
```

2. **Créer le fichier `android/gradle.properties`**:

```properties
MYAPP_UPLOAD_STORE_FILE=alarme-app.keystore
MYAPP_UPLOAD_KEY_ALIAS=alarme-app
MYAPP_UPLOAD_STORE_PASSWORD=votre_mot_de_passe
MYAPP_UPLOAD_KEY_PASSWORD=votre_mot_de_passe
```

3. **Modifier `android/app/build.gradle`** pour ajouter la configuration de signature:

```gradle
android {
    ...
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
                storeFile file(MYAPP_UPLOAD_STORE_FILE)
                storePassword MYAPP_UPLOAD_STORE_PASSWORD
                keyAlias MYAPP_UPLOAD_KEY_ALIAS
                keyPassword MYAPP_UPLOAD_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            ...
        }
    }
}
```

4. **Générer l'APK de production**:

```bash
cd android
./gradlew assembleRelease

# L'APK sera disponible dans:
# android/app/build/outputs/apk/release/app-release.apk
```

### Option 3: Build avec EAS (Expo Application Services)

```bash
# Installer EAS CLI
npm install -g eas-cli

# Se connecter à Expo
eas login

# Configurer le projet
eas build:configure

# Générer l'APK
eas build --platform android --profile preview
```

## 📲 Installation de l'APK

### Méthode 1: Installation directe

1. Activer "Sources inconnues" dans les paramètres Android
2. Transférer l'APK sur votre appareil
3. Ouvrir le fichier APK et installer

### Méthode 2: Via ADB

```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

### Méthode 3: Partage

- Via USB
- WhatsApp
- Google Drive
- Bluetooth
- Email

## 🔐 Permissions Android

L'application demande les permissions suivantes:

- `RECEIVE_BOOT_COMPLETED` - Démarrer au boot du téléphone
- `VIBRATE` - Vibration pour les alarmes
- `USE_EXACT_ALARM` - Alarmes exactes (Android 12+)
- `SCHEDULE_EXACT_ALARM` - Planifier des alarmes exactes
- `POST_NOTIFICATIONS` - Afficher les notifications

## 🏗️ Structure du Projet

```
alarme-app/
├── app/                      # Écrans de l'application
│   ├── (tabs)/              # Navigation par onglets
│   │   ├── index.tsx        # Écran d'accueil (liste des rappels)
│   │   └── settings.tsx     # Écran des paramètres
│   ├── add-edit-reminder.tsx # Écran ajout/modification
│   └── _layout.tsx          # Layout racine
├── components/              # Composants réutilisables
│   └── ReminderCard.tsx     # Carte de rappel
├── services/                # Services métier
│   ├── storageService.ts    # Gestion SQLite
│   └── notificationService.ts # Gestion des notifications
├── types/                   # Types TypeScript
│   └── reminder.ts          # Types de rappels
├── utils/                   # Utilitaires
│   └── dateUtils.ts         # Formatage des dates
└── constants/               # Constantes
    ├── theme.ts             # Thème par défaut
    └── appTheme.ts          # Thème React Native Paper
```

## 🎨 Technologies Utilisées

- **React Native** - Framework mobile
- **Expo** - Outils de développement
- **React Native Paper** - Composants Material Design
- **Expo SQLite** - Base de données locale
- **Expo Notifications** - Gestion des notifications
- **TypeScript** - Typage statique
- **Expo Router** - Navigation

## 📝 Guide d'Utilisation

### Créer un rappel

1. Appuyez sur le bouton "+" flottant
2. Remplissez le titre (obligatoire)
3. Ajoutez une description (optionnel)
4. Sélectionnez la date et l'heure
5. Choisissez la répétition (unique, quotidienne, hebdomadaire)
6. Définissez la priorité (faible, moyenne, élevée)
7. Appuyez sur "Enregistrer"

### Modifier un rappel

1. Appuyez sur une carte de rappel
2. Modifiez les informations
3. Appuyez sur "Enregistrer"

### Activer/Désactiver un rappel

- Utilisez le switch sur la carte du rappel

### Supprimer un rappel

- Appuyez sur l'icône de suppression sur la carte

## 🔧 Dépannage

### L'alarme ne sonne pas

- Vérifiez que les notifications sont activées
- Vérifiez que l'application n'est pas en mode économie de batterie
- Sur Android 12+, assurez-vous que les alarmes exactes sont autorisées

### L'application ne démarre pas

```bash
# Nettoyer le cache
npm start -- --clear

# Réinstaller les dépendances
rm -rf node_modules
npm install
```

### Problèmes de build

```bash
# Nettoyer le build Android
cd android
./gradlew clean

# Rebuild
cd ..
npx expo run:android
```

## 📄 Licence

Ce projet est développé pour un usage personnel et éducatif.

## 👨‍💻 Développement

Pour contribuer ou modifier l'application:

1. Cloner le repository
2. Installer les dépendances: `npm install`
3. Lancer en mode dev: `npm run android`
4. Faire vos modifications
5. Tester sur un appareil réel ou émulateur

## 📞 Support

Pour toute question ou problème, consultez la documentation Expo:
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)