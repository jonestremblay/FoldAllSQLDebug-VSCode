# FoldAllDebug

## Description

**FoldAllDebug** est une extension Visual Studio Code qui permet de plier automatiquement les blocs de code de debug identifiés par des marqueurs spécifiques dans les fichiers SQL. Cette extension simplifie la lecture des fichiers SQL complexes en masquant les sections de debug, tout en laissant visibles les parties logiques principales.

## Fonctionnalités

- Plie les blocs de debug entourés par les marqueurs :

  - `/* region DEBUG_START */`

  - `/* region DEBUG_END */`

- Ajoute une commande **Fold All Debug** accessible via le menu contextuel (clic droit) dans les fichiers SQL.

- Compatible avec les fichiers SQL uniquement.

## Dépendances

Cette extension dépend de l'extension **Explicit Folding**. Vous devez installer et configurer **Explicit Folding** pour que les blocs de debug soient correctement détectés et pliés.

### Configuration requise pour Explicit Folding

Ajoutez la configuration suivante dans votre fichier `settings.json` de Visual Studio Code :

```json
"explicitFolding.rules": {
    "sql": [
      {
        "foldStartRegex": "^(.*)\\/\\* region DEBUG_START \\*\\/$",
        "foldEndRegex": "^(.*)\\/\\* region DEBUG_END \\*\\/$"
      }
    ]
  }
```