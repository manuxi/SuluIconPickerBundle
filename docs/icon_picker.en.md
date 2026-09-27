# Icon Picker

A form field type that lets editors pick an icon from an SVG icon set. The field shows the selected icon as a
large 100×100px preview; clicking it opens an overlay with a search field and a grid of all icons of the set.
The frontend renders the stored icon with the Twig function `sulu_icon()` — no icon font needed.

Currently shipped icon set (pool): **Bootstrap Icons** (`bootstrap-icons`, MIT).

---

## Usage in Form XML

```xml
<property name="icon" type="icon_picker">
    <meta>
        <title lang="en">Icon</title>
        <title lang="de">Icon</title>
    </meta>
    <params>
        <!-- optional: icon set used for new selections, default: first registered pool ("bootstrap-icons") -->
        <param name="pool" value="bootstrap-icons"/>
    </params>
</property>
```

## Storage format

`{"pool": "bootstrap-icons", "name": "calendar-heart"}` — pool and icon name as strings. Keeping the pool in the
value lets several icon sets coexist; switching the field's `pool` param later does not break existing content.

## Behaviour

- Preview shows the selected icon itself (rendered from the sprite), plus its name below.
- Click or <kbd>Enter</kbd> on the preview opens the overlay. The search filters by name while typing; several
  words must all match (`house door` → `house-door`, `house-door-fill`).
- Click selects a tile, **Confirm** takes it over. Double-click takes it over directly.
- The trash icon in the corner clears the selection.
- Visible errors instead of an empty preview:
  - the icon no longer exists in its set (e.g. renamed in a Bootstrap Icons update),
  - the stored or configured set is not registered.

## Twig

The property resolver returns `{pool, name}` — or `null` if the value is empty or the icon no longer exists.

```twig
{{ sulu_icon(content.icon) }}
{{ sulu_icon(content.icon, {class: 'text-primary', size: 32, title: 'Events'}) }}

{# hard-coded icons, e.g. replacing old <i class="bi bi-calendar"></i> #}
{{ sulu_icon('calendar') }}                        {# default pool #}
{{ sulu_icon('bootstrap-icons:calendar-heart') }}  {# explicit pool #}

{% if content.icon %}…{% endif %}                  {# fallback when nothing is set #}
```

Output:

```html
<svg class="sulu-icon sulu-icon--bootstrap-icons text-primary" width="1em" height="1em" fill="currentColor"
     aria-hidden="true" focusable="false">
    <use href="/bundles/suluiconpicker/icon-picker/bootstrap-icons/sprite.svg#bootstrap-icons-calendar-heart"></use>
</svg>
```

| Option  | Default | Meaning                                                                   |
|---------|---------|---------------------------------------------------------------------------|
| `class` | –       | Additional CSS classes                                                    |
| `size`  | `1em`   | `width`/`height` attributes; CSS `width`/`height` override them           |
| `title` | –       | Accessible label (`role="img"`); without it the icon is `aria-hidden`    |

Color follows `currentColor`. For icons aligned with text like the Bootstrap Icons font:

```css
.sulu-icon { vertical-align: -0.125em; }
```

An unknown icon renders nothing; with `kernel.debug` enabled it throws instead, so typos in templates show up.

## How the icons are delivered

Per pool, one SVG sprite (`<symbol id="<pool>-<name>">`) and one `names.json` live under
`src/Resources/public/icon-picker/<pool>/` and are published by `assets:install` to
`public/bundles/suluiconpicker/`. The sprite of Bootstrap Icons is about 1.1 MB (≈ 220 KB gzip) and is loaded
once and cached by the browser.

The admin gets the pool list (key, sprite URL, names URL) through the regular Sulu admin config
(`sulu_icon_picker`); the names are fetched on demand. No extra routes are needed.

## Rebuilding the sprite

The generated files are committed. To update Bootstrap Icons, raise the version in `package.json`, then in the
bundle:

```bash
npm install
npm run build-icons
```

## Adding another pool

1. Implement `Manuxi\SuluIconPickerBundle\Pool\IconPoolInterface` (or extend `AbstractSpriteIconPool`) and register
   the class as a service. With autoconfiguration it is tagged `sulu_icon_picker.pool` automatically.
2. Provide a sprite with symbol ids `<pool>-<name>` and a `names.json` (array of names). Inside this bundle, add
   the pool to `POOLS` in `scripts/build-icon-sprite.js`.

## Installation

See [README](../README.md#installation).
