# Testing

The suite uses Vitest, React Testing Library, and **jsdom**. The configuration is
in [vitest.config.ts](vitest.config.ts); it does not enable a real browser runner.
Files ending in `.browser.tsx` are excluded from this suite.

## Commands

Use the Bun version pinned in `package.json` and CI:

```sh
bun install --frozen-lockfile
bun run check
bun run test:watch
bun run test:coverage
bun run build:storybook
```

`check` runs formatting, lint, typechecking, unit tests, the library build, and
ESM/CommonJS package import checks. `test:coverage` separately enforces 70% for
statements, branches, functions, and lines, with HTML output in `coverage/`.
`build:storybook` verifies that the stories compile; it does not exercise browser
interactions or prove visual accessibility.

For one test file:

```sh
bun run test -- src/components/__tests__/input.test.tsx
```

## Test a form through its public behavior

Put component tests in `src/components/__tests__/`. Import `render` from the
shared [test harness](src/test-utils/rtl.tsx), which supplies Base Web and Styletron
providers. Use `userEvent.setup()` to exercise user interactions; import helpers
from the declared `@testing-library/user-event` development dependency.

```tsx
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { useAppForm } from '../../hooks/form';
import { render, screen, waitFor } from '../../test-utils/rtl';

describe('contact form', () => {
  it('submits the entered email', async () => {
    const user = userEvent.setup();
    const submit = vi.fn();

    function ContactForm() {
      const form = useAppForm({
        defaultValues: { email: '' },
        onSubmit: ({ value }) => { submit(value); },
      });

      return (
        <form onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}>
          <form.AppField name="email">
            {(field) => <field.Input label="Email" type="email" />}
          </form.AppField>
          <form.AppForm>
            <form.SubscribeButton label="Send" />
          </form.AppForm>
        </form>
      );
    }

    render(<ContactForm />);
    await user.type(screen.getByRole('textbox', { name: 'Email' }), 'reader@example.com');
    await user.click(screen.getByRole('button', { name: 'Send' }));
    await waitFor(() => expect(submit).toHaveBeenCalledWith({
      email: 'reader@example.com',
    }));
  });
});
```

For validation, trigger the event the validator uses: change for `onChange`, blur
for `onBlur`, or submit for `onSubmit`. Await the visible error or submitted value
instead of checking private form state. Cover disabled/loading controls, invalid
input, selection changes, and recovery from an error where relevant.

Use role and label queries so missing accessible names become visible in tests.
jsdom cannot verify layout, focus appearance, or native browser behavior; inspect
those states in Storybook when the affected behavior requires it.

## Package and Storybook contracts

The [package smoke check](scripts/test-package.mjs) loads the root and `/zod`
exports from both ESM and CommonJS. Run it through `bun run check` so it uses fresh
build outputs. Preserve these exports when changing the build or dependencies.

Stories live in `src/stories/` and `src/features/`. Keep Storybook and its official
addons on the same stable release. After an upgrade, build Storybook and open
representative input, selection, date, and validation stories to inspect changed
UI behavior. Use `fn()` from `storybook/test` for story callbacks.
