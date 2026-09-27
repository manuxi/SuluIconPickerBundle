# Icon Selection

Ein Formularfeld, mit dem Redakteure ein Icon aus einem SVG-Icon-Set auswählen. Es sieht aus und verhält sich wie
Sulus eigenes `single_media_selection`: eine kompakte Zeile mit Icon und Namen, links ein Button zum Öffnen der
Auswahl, rechts ein Papierkorb zum Entfernen. Die Auswahl selbst läuft über ein Overlay mit Suchfeld und einem
Raster aller Icons des Sets. Im Frontend gibt die Twig-Funktion `sulu_icon()` das gespeicherte Icon aus — ganz
ohne Icon-Font.

> Nicht zu verwechseln mit Sulus eigenem Feldtyp `single_icon_selection` (ein Icon-Font-Picker, der ein
> konfiguriertes `icon_set` braucht). Dieses Feld ist ein eigener Typ, `icon_selection`, für die SVG-Sprite-Pools
> unten.

Aktuell enthaltenes Icon-Set (Pool): **Bootstrap Icons** (`bootstrap-icons`, MIT).

---

## Verwendung im Formular-XML

```xml
<property name="icon" type="icon_selection">
    <meta>
        <title lang="de">Icon</title>
        <title lang="en">Icon</title>
    </meta>
    <params>
        <!-- optional: Icon-Set für neue Auswahl, Standard: erster registrierter Pool ("bootstrap-icons") -->
        <param name="pool" value="bootstrap-icons"/>
    </params>
</property>
```

## Gespeicherter Wert

`{"pool": "bootstrap-icons", "name": "calendar-heart"}` — Pool und Icon-Name als Strings. Da der Pool im Wert
steht, können mehrere Icon-Sets nebeneinander bestehen; ein späterer Wechsel des `pool`-Params am Feld macht
vorhandene Inhalte nicht kaputt.

## Verhalten

- Die Zeile zeigt das gewählte Icon selbst (aus dem Sprite gerendert) neben seinem Namen, wie bei einer
  Medienauswahl.
- Der Button links öffnet das Overlay. Die Suche filtert beim Tippen nach Namen; mehrere Wörter müssen alle
  vorkommen (`house door` → `house-door`, `house-door-fill`).
- Klick markiert eine Kachel, **Bestätigen** übernimmt sie. Doppelklick übernimmt direkt.
- Das Papierkorb-Symbol rechts entfernt die Auswahl.
- Sichtbare Fehlermeldung statt einer stillschweigend leeren Zeile, wenn
  - das Icon im Set nicht mehr existiert (z. B. bei einem Bootstrap-Icons-Update umbenannt),
  - das gespeicherte oder konfigurierte Set nicht registriert ist.

## Twig

Der Property-Resolver liefert `{pool, name}` — oder `null`, wenn nichts gesetzt ist oder das Icon nicht mehr
existiert.

```twig
{{ sulu_icon(content.icon) }}
{{ sulu_icon(content.icon, {class: 'text-primary', size: 32, title: 'Termine'}) }}

{# fest im Template, z. B. als Ersatz für alte <i class="bi bi-calendar"></i> #}
{{ sulu_icon('calendar') }}                        {# Standard-Pool #}
{{ sulu_icon('bootstrap-icons:calendar-heart') }}  {# Pool explizit #}

{% if content.icon %}…{% endif %}                  {# Fallback, wenn nichts gesetzt ist #}
```

Ausgabe:

```html
<svg class="sulu-icon sulu-icon--bootstrap-icons text-primary" width="1em" height="1em" fill="currentColor"
     aria-hidden="true" focusable="false">
    <use href="/bundles/suluiconpicker/icon-picker/bootstrap-icons/sprite.svg#bootstrap-icons-calendar-heart"></use>
</svg>
```

| Option  | Standard | Bedeutung                                                                  |
|---------|----------|----------------------------------------------------------------------------|
| `class` | –        | Zusätzliche CSS-Klassen                                                    |
| `size`  | `1em`    | `width`/`height`-Attribute; CSS-`width`/`height` überschreiben sie         |
| `title` | –        | Barrierefreie Beschriftung (`role="img"`); ohne ist das Icon `aria-hidden` |

Die Farbe folgt `currentColor`. Für Icons im Textfluss wie beim Bootstrap-Icons-Font:

```css
.sulu-icon { vertical-align: -0.125em; }
```

Ein unbekanntes Icon gibt nichts aus; mit `kernel.debug` wirft es stattdessen einen Fehler, damit Tippfehler in
Templates auffallen.

## Auslieferung der Icons

Pro Pool liegen ein SVG-Sprite (`<symbol id="<pool>-<name>">`) und eine `names.json` unter
`src/Resources/public/icon-picker/<pool>/` und werden per `assets:install` nach `public/bundles/suluiconpicker/`
veröffentlicht. Das Sprite von Bootstrap Icons ist ca. 1,1 MB groß (≈ 220 KB gzip) und wird einmal geladen und
vom Browser gecacht.

Der Admin bekommt die Pool-Liste (Key, Sprite-URL, Namen-URL) über die normale Sulu-Admin-Config
(`sulu_icon_picker`); die Namen werden bei Bedarf nachgeladen. Eigene Routen sind nicht nötig.

## Sprite neu bauen

Die generierten Dateien sind eingecheckt. Für ein Bootstrap-Icons-Update die Version in `package.json` anheben,
dann im Bundle:

```bash
npm install
npm run build-icons
```

## Weiteren Pool ergänzen

1. `Manuxi\SuluIconPickerBundle\Pool\IconPoolInterface` implementieren (oder von `AbstractSpriteIconPool` erben)
   und die Klasse als Service registrieren. Mit Autoconfiguration erhält sie das Tag `sulu_icon_picker.pool`
   automatisch.
2. Ein Sprite mit Symbol-IDs `<pool>-<name>` und eine `names.json` (Array der Namen) bereitstellen. Innerhalb
   dieses Bundles den Pool in `POOLS` in `scripts/build-icon-sprite.js` eintragen.

## Installation

Siehe [README](../README.de.md#installation).
