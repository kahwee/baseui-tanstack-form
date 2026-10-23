# BaseUI TanStack Form

React form fields that connect [TanStack Form](https://tanstack.com/form) to
[Base Web](https://baseweb.design/). Includes text, choice, date, and submit
controls, plus optional [Zod](https://zod.dev/) helpers.

The current release supports React 18.2–18.x. See the
[Storybook examples](https://kahwee.github.io/baseui-tanstack-form/) for each
field and its states.

## Install

```bash
npm install baseui-tanstack-form @tanstack/react-form baseui react@18 react-dom@18 zod@4 styletron-engine-atomic styletron-react
```

Provide Base Web's `StyletronProvider` and `BaseProvider` at your app root. Your
app's existing providers can be reused.

```tsx
import type { ReactNode } from 'react';
import { BaseProvider, LightTheme } from 'baseui';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';

const engine = new Styletron();

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme}>{children}</BaseProvider>
    </StyletronProvider>
  );
}
```

Render the form below inside `AppProviders`. Create the Styletron client once for
a browser app; server-rendered apps should use their framework's Styletron SSR setup.

## First form

```tsx
import { useAppForm } from 'baseui-tanstack-form';

export function ContactForm() {
  const form = useAppForm({
    defaultValues: { name: '', email: '' },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <form.AppField name="name">
        {(field) => <field.Input label="Name" placeholder="Your name" />}
      </form.AppField>
      <form.AppField name="email">
        {(field) => <field.Input label="Email" type="email" />}
      </form.AppField>
      <form.AppForm>
        <form.SubscribeButton label="Send" />
      </form.AppForm>
    </form>
  );
}
```

Available field controls: `Input`, `Textarea`, `SelectSingle`, `SelectMulti`,
`Checkbox`, `CheckboxGroup`, `RadioGroup`, and `DatePicker`. Use `withForm` to
compose reusable sections. Zod helpers are available from
`baseui-tanstack-form/zod`.

## Develop

```bash
bun install --frozen-lockfile
bun run check
bun run storybook
```

`bun run check` runs formatting, types, tests, the library build, and a
package export check. Use `bun run build:storybook` after changing stories,
Storybook configuration, or their dependencies. The unit suite uses jsdom;
building Storybook does not run browser interaction tests.

More detail: [form composition](FORM_COMPOSITION.md), [testing](TESTING.md),
and [source code](https://github.com/kahwee/baseui-tanstack-form).

MIT © KahWee Teng.

## CI maintenance

[GitHub Actions maintenance](.github/ACTIONS.md) covers workflows, parallel checks, action versions, and weekly updates.

Bun 1.4.4 owns formatting (`bun run format`, `bun run format:check`) and type checking
(`bun run typecheck`). Biome has been removed. Bun formatting is not a replacement
for Biome’s semantic lint rules; tests, strict type checks, and package builds remain
the verification gates. TypeScript remains installed for declaration generation.

`bun run check:source` runs formatting, Bun type checking, and tests in parallel.
`bun run check` waits for those checks before building package artifacts.
`bun run build` checks types before building. CI calls `build:artifacts` only after
a successful Bun check; TypeScript emits declarations with `--noCheck` to avoid
checking the same source again. Do not use `build:artifacts` as a validation command.

On the session’s Linux executor, the median of three project-check runs was
0.262s with Bun versus 2.631s with `bun x --no-install tsc --noEmit`.
These include command startup and describe this checkout, not a CI speed guarantee.
Declaration emission measured 0.886s with `--noCheck` versus
1.256s with checking; generated `.d.ts` contents matched.

See [build performance](docs/build-performance.md) for the Bun-hosted build,
measured artifact timings, output verification, and benchmark scope.
