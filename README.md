# SuluIconPickerBundle

![tests](https://github.com/manuxi/SuluIconPickerBundle/actions/workflows/tests.yml/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/manuxi/SuluIconPickerBundle/blob/main/LICENSE)
![Supports Sulu 3.0 or later](https://img.shields.io/badge/%20Sulu->=3.0-0088cc?color=00b2df)

An **icon picker** for **Sulu CMS**: editors pick an icon in the admin from a searchable grid, the frontend renders
it as inline SVG via Twig. Icons come from SVG sprites — no icon font, no thousands of single files.

**English** | [🇩🇪 Deutsch](README.de.md)

---

## Features & Documentation

*   **[Single Icon Selection](docs/single_icon_selection.en.md)** - Field type `single_icon_selection`, styled
    like `single_media_selection`, with a picker overlay, Twig function `sulu_icon()`, extensible icon pools
    (shipped: Bootstrap Icons)

---

## Installation

**Requirement:** Sulu CMS 3.0+

### 1. Install via Composer
```bash
composer require manuxi/sulu-icon-picker-bundle
```

### 2. Register Bundle
Add to `config/bundles.php`:
```php
return [
    Manuxi\SuluIconPickerBundle\SuluIconPickerBundle::class => ['all' => true],
];
```

### 3. Publish the icon sprites
```bash
bin/console assets:install
```
Usually already run by Composer's `auto-scripts`. Without it the sprites under `/bundles/suluiconpicker/` return 404
and the field shows no icons.

### 4. Admin Assets Setup

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

**C) Install & Build**
```bash
cd assets/admin
npm install
npm run build
```

---

## Development

```bash
composer install
npm install
composer test        # PHPUnit
npm test             # Jest
npm run build-icons  # regenerate sprites + names.json
```

Bootstrap Icons are © The Bootstrap Authors, MIT licensed (`src/Resources/public/icon-picker/bootstrap-icons/LICENSE`).
