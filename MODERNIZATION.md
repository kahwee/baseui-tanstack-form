# Modernization notes

This repository intentionally targets React 18. These notes record the earlier
packaging and API modernization; current commands are in [TESTING.md](TESTING.md).

## Changed

- Fixed CommonJS packaging under `type: module` by emitting `dist/index.cjs`.
- Simplified the library build to ESM + CJS; removed the unused UMD build.
- Generate declarations with `tsc -p tsconfig.build.json` after Vite builds
  the JavaScript entry points.
- Externalized package subpaths (`baseui/*`, `react/*`, etc.) so they cannot be
  accidentally bundled into the library.
- Added `sideEffects: false` for better consumer tree-shaking.
- Tightened peer dependency ranges to the actual React 18 / Base Web / TanStack
  Form compatibility contract.
- Removed stale Jest setup and the redundant direct Rollup dependency/override.
- Updated Husky's `prepare` script to the current command.
- Exported component prop/option types from the public API.
- Converted shared public TypeScript interfaces to `type` aliases.
- Removed unnecessary React value imports under the automatic JSX transform.
- Restricted `DatePickerField` to single-date mode because its value contract is
  `Date | string | null`, not a date range.
- Prevented duplicate values in checkbox groups and made multi-select IDs
  consistent with other fields.

## Current verification

Root and `/zod` ESM/CommonJS import checks run as part of `bun run check`.
Shared unit-test providers live in `src/test-utils/rtl.tsx`. The `/zod` entry
exists; Zod remains a required peer for compatibility. Additional package
metadata checks such as `publint` and `@arethetypeswrong/cli` are not part of
this repository's current gate.
