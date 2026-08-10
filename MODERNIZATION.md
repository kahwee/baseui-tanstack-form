# Modernization notes

This repository intentionally targets React 18. The modernization work focuses on
library correctness and current tooling without requiring React 19.

## Changed

- Fixed CommonJS packaging under `type: module` by emitting `dist/index.cjs`.
- Simplified the library build to ESM + CJS; removed the unused UMD build.
- Let `vite-plugin-dts` own declaration generation instead of running a second
  TypeScript declaration build.
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
2. Add focused tests for root package imports from both ESM and CJS consumers.
3. Consider separate entry points for the Zod helpers if you want Zod to become
   an optional peer dependency.
4. Consider a Base Web provider test harness shared by Storybook and Vitest to
   eliminate duplicate setup code.
