# Changelog

## [Unreleased]

### Added
- Field type `icon_picker`: 100×100px icon preview, overlay with live search and icon grid, stores
  `{"pool": "...", "name": "..."}`.
- Visible field errors for icons that no longer exist in their set and for unregistered sets.
- Property resolver `icon_picker`: returns `{pool, name}` or `null` for empty/unknown icons.
- Twig function `sulu_icon(value, {class, size, title})`: renders `<svg><use href="sprite.svg#pool-name">`;
  accepts the stored value, `"name"` (default pool) or `"pool:name"`; throws for unknown icons in debug mode.
- Icon pool registry (`IconPoolInterface`, tag `sulu_icon_picker.pool`, autoconfigured) with the pool
  `bootstrap-icons` (Bootstrap Icons 1.13.1, 2078 icons).
- Build script `npm run build-icons`: generates `sprite.svg` and `names.json` per pool from the npm package.
- Admin config key `sulu_icon_picker` with pool key, sprite URL and names URL.
