# Modernization notes

This repository intentionally targets React 18. The modernization work focuses on
library correctness and current tooling without requiring React 19.

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

## Recommended next steps

1. Add package-contract checks such as `publint` and `@arethetypeswrong/cli`.
2. Consider sharing provider setup between Storybook and Vitest.

Root and `/zod` ESM/CommonJS import checks already run as part of `bun run check`.
The `/zod` entry point exists; Zod remains a required peer for compatibility.
