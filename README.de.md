# SuluIconPickerBundle

![tests](https://github.com/manuxi/SuluIconPickerBundle/actions/workflows/tests.yml/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/manuxi/SuluIconPickerBundle/blob/main/LICENSE)
![Supports Sulu 3.0 or later](https://img.shields.io/badge/%20Sulu->=3.0-0088cc?color=00b2df)

Verbessert Sulu CMS' eigenen Feldtyp **`single_icon_selection`**: eine echte Icon-Vorschau im Formular (Core
zeigt nur den gespeicherten Namen als Text) und eine Twig-Funktion, um das gespeicherte Icon im Frontend
auszugeben (die es in Core nicht gibt). Baut auf Sulus eigener `icon_sets`-Konfiguration und den Icon-Providern
auf – kein Sprite-Bau, kein neuer Feldtyp-Name, kein eigenes Speicherformat.

[🇬🇧 Read English](README.md) | **Deutsch**

---

## Funktionen & Dokumentation

*   **[Icon Selection](docs/icon_selection.de.md)** - echte Vorschau + Auswahl-Overlay für das bestehende
    `single_icon_selection`-Feld, Twig-Funktion `sulu_icon()`, Property-Resolver

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

### 3. Mindestens ein Icon-Set konfigurieren (Sulu-Core, nicht dieses Bundle)
```yaml
# config/packages/sulu_admin.yaml
sulu_admin:
    icon_sets:
        bootstrap-icons: 'svg://%kernel.project_dir%/var/icon-sets/bootstrap-icons'
```
Siehe [docs/icon_selection.de.md](docs/icon_selection.de.md) für das Ordnerformat und den nötigen
`<param name="icon_set">` an jeder `single_icon_selection`-Property.

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

> **Bundle-Update:** Ein einfaches `npm install` aktualisiert eine `file:`-Abhängigkeit nach einem
> `composer update` nicht immer. Wenn Änderungen nach einem Rebuild nicht ankommen, erst die Kopie löschen:
> `rm -rf assets/admin/node_modules/sulu-icon-picker-bundle && npm install`.

---

## Entwicklung

```bash
composer install
npm install
composer test   # PHPUnit
npm test        # Jest
```
