# Changelog

## [Unreleased]

### Added
- Overrides Sulu core's own `single_icon_selection` field component with one that shows a real icon preview
  (core only shows the stored name as plain text) in a compact row matching `single_media_selection`'s look -
  button on the left opens the picker, trash icon on the right clears the selection. Same field-type key, same
  `{icon_set}` param, same plain-string storage format as core - a drop-in enhancement, not a new field type.
- Overrides Sulu core's own `icon` list adapter used by the picker overlay with a fixed-size tile grid instead
  of core's flex-wrap cards, which look ragged with a few thousand icons. Same REST loading, search and
  pagination as core.
- `IconSetResolver`: resolves an icon set + name to its raw SVG content, reusing Sulu core's own
  `sulu_admin.icon_sets` config and `IconProviderInterface` services (`svg://`, `icomoon://`) - no separate
  icon storage or build step.
- Property resolver for `single_icon_selection`: returns `{name, icon_set}` (from the property's `icon_set`
  param) or `null` for an empty value or an icon that no longer exists in its set.
- Twig function `sulu_icon(value, {class, size, title, icon_set})`: renders the icon's own SVG markup with
  `width`/`height`/`fill`/`class` overridden and its `viewBox` kept; accepts the resolved `{name, icon_set}`
  value, a plain name with an explicit `icon_set` option, or `"icon_set:name"`; throws for an unknown icon in
  debug mode.

### Removed (pre-release, no prior tag)
- The bundle's own sprite-pool architecture (`IconPoolInterface`/`IconPoolRegistry`/`BootstrapIconsPool`, the
  `npm run build-icons` sprite build, the shipped Bootstrap Icons sprite) and the `icon_selection`/`icon_picker`
  field-type names it introduced - superseded by overriding Sulu core's own `single_icon_selection` in place.
