# Repository guidance

This package connects TanStack Form to Base Web. Use the README for the public API,
`TESTING.md` for test patterns, and `FORM_COMPOSITION.md` for reusable form sections.
Read those guides when the task touches their subject; they are not prerequisites
for every edit.

## Compatibility

- Keep React and React DOM on 18 until Base Web's default-prop compatibility is
  verified on 19. The peer range is `>=18.2.0 <19`.
- Keep `baseui/checkbox-v2` and `baseui/radio-v2`; do not reintroduce legacy input
  entry points. Their values come from native change events.
- Preserve root and `/zod` exports, including ESM and CommonJS entry points.
  Public additions belong in `src/index.tsx` or the relevant subpath entry.
- Keep `bun.lock` with dependency changes and the Bun version aligned with CI.

## Verification

- Use `bun run check` for code and dependency changes. It covers format, lint,
  types, tests, build, and package loading.
- Build Storybook with `bun run build:storybook` when changing stories or their
  dependencies. Documentation-only changes need a diff and link check.
- Add behavior tests for changes to form controls or Zod helpers. Keep test
  providers in `src/test-utils/rtl.tsx`.
