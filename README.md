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

`bun run check` runs formatting, lint, types, tests, the library build, and a
package export check. Use `bun run build:storybook` after changing stories,
Storybook configuration, or their dependencies. The unit suite uses jsdom;
building Storybook does not run browser interaction tests.

More detail: [form composition](FORM_COMPOSITION.md), [testing](TESTING.md),
and [source code](https://github.com/kahwee/baseui-tanstack-form).

MIT © KahWee Teng.
