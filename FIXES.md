# Codebase improvement pass

This pass fixes the issues found during the package audit while preserving existing public APIs where practical.

## Fixed

- Corrected README imports to use the actual package root export.
- Removed the undocumented/non-existent `Toggle` component from the README.
- Fixed `createZodFieldValidator`; it now supports direct field schemas and the legacy object-schema + field-name API.
- Added tests for both Zod field-validator call styles.
- Simplified and generalized field-error normalization, including nested paths, structured errors, and `errorMap`.
- Broadened error typings so schema-validator errors are not incorrectly typed as strings only.
- Improved `SubscribeButton` to respect both `canSubmit` and `isSubmitting`, including BaseUI loading state.
- Removed dangling `aria-describedby` references that pointed at IDs the package did not render. BaseUI `FormControl` remains responsible for error markup.
- Prevented shared `CheckboxGroup` props from overriding option-level `disabled`, `overrides`, and error semantics.
- Re-enabled the React 18 DatePicker unit suite and removed the stale React 19 explanation.
- Removed React type-path workarounds from `tsconfig.json`; the current build generates declarations with `tsc -p tsconfig.build.json`.
- Added a focused `baseui-tanstack-form/zod` export while retaining root Zod exports for compatibility.
- Added a post-build package contract smoke test for root/Zod ESM and CommonJS outputs.

## Original verification limits

TypeScript/TSX syntax transpilation and JSON parsing were run successfully in the provided sandbox. A full install/lint/typecheck/test/build could not be executed because Bun is unavailable and the sandbox has no cached npm packages or registry network access. Those limits describe the original audit environment, not the current repository.

For current verification commands and what they cover, see [TESTING.md](TESTING.md).
