# SuluIconPickerBundle

![tests](https://github.com/manuxi/SuluIconPickerBundle/actions/workflows/tests.yml/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/manuxi/SuluIconPickerBundle/blob/main/LICENSE)
![Supports Sulu 3.0 or later](https://img.shields.io/badge/%20Sulu->=3.0-0088cc?color=00b2df)

Ein **Icon-Picker** für **Sulu CMS**: Redakteure wählen im Admin ein Icon aus einem durchsuchbaren Raster, das
Frontend gibt es per Twig als Inline-SVG aus. Die Icons stammen aus SVG-Sprites — kein Icon-Font, keine tausenden
Einzeldateien.

[🇬🇧 Read English](README.md) | **Deutsch**

---

## Funktionen & Dokumentation

*   **[Icon Picker](docs/icon_picker.de.md)** - Feldtyp `icon_picker` mit großer Vorschau und Auswahl-Overlay,
    Twig-Funktion `sulu_icon()`, erweiterbare Icon-Pools (enthalten: Bootstrap Icons)

---

## Installation

**Voraussetzung:** Sulu CMS 3.0+

### 1. Per Composer installieren
```bash
composer require manuxi/sulu-icon-picker-bundle
```

### 2. Bundle registrieren
In `config/bundles.php`:
```php
return [
    Manuxi\SuluIconPickerBundle\SuluIconPickerBundle::class => ['all' => true],
];
```

### 3. Icon-Sprites veröffentlichen
```bash
bin/console assets:install
```
Läuft meist bereits über die `auto-scripts` von Composer. Ohne diesen Schritt liefern die Sprites unter
`/bundles/suluiconpicker/` 404 und das Feld zeigt keine Icons.

### 4. Admin-Assets einrichten

**A) `assets/admin/package.json`**
```json
{
  "dependencies": {
    "sulu-icon-picker-bundle": "file:../../vendor/manuxi/sulu-icon-picker-bundle/src/Resources"
  }
}
```

**B) `assets/admin/app.js`**
```javascript
import 'sulu-icon-picker-bundle';
```

**C) Installieren & bauen**
```bash
cd assets/admin
npm install
npm run build
```

---

## Entwicklung

```bash
composer install
npm install
composer test        # PHPUnit
npm test             # Jest
npm run build-icons  # Sprites + names.json neu erzeugen
```

Bootstrap Icons © The Bootstrap Authors, MIT-Lizenz (`src/Resources/public/icon-picker/bootstrap-icons/LICENSE`).
