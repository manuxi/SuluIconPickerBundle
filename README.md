# SuluIconPickerBundle

![tests](https://github.com/manuxi/SuluIconPickerBundle/actions/workflows/tests.yml/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/manuxi/SuluIconPickerBundle/blob/main/LICENSE)
![Supports Sulu 3.0 or later](https://img.shields.io/badge/%20Sulu->=3.0-0088cc?color=00b2df)

Enhances Sulu CMS's own **`single_icon_selection`** field: a real icon preview in the form (core only shows the
stored name as text) and a Twig function to render the stored icon on the frontend (core has none). Built on top
of Sulu's own `icon_sets` config and icon providers - no sprite build, no new field-type name, no separate
storage format.

**English** | [🇩🇪 Deutsch](README.de.md)

---

## Features & Documentation

*   **[Icon Selection](docs/icon_selection.en.md)** - real preview + picker overlay for the existing
    `single_icon_selection` field, Twig function `sulu_icon()`, property resolver

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

### 3. Configure at least one icon set (Sulu core, not this bundle)
```yaml
# config/packages/sulu_admin.yaml
sulu_admin:
    icon_sets:
        bootstrap-icons: 'svg://%kernel.project_dir%/var/icon-sets/bootstrap-icons'
```
See [docs/icon_selection.en.md](docs/icon_selection.en.md) for the folder format and the `<param name="icon_set">`
required on every `single_icon_selection` property.

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

> **Updating this bundle:** a plain `npm install` does not always refresh a `file:` dependency after a
> `composer update`. If your changes do not show up after a rebuild, delete the copy first:
> `rm -rf assets/admin/node_modules/sulu-icon-picker-bundle && npm install`.

---

## Development

```bash
composer install
npm install
composer test   # PHPUnit
npm test        # Jest
```
