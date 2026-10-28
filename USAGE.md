# Providers and first form

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

See [form composition](FORM_COMPOSITION.md) for reusable sections and nested fields.

## Package loading

The root ESM entry works with Bun and browser bundlers. Direct Node.js ESM loading
currently fails on Base Web’s directory imports (for example, `baseui/checkbox-v2`).
The CommonJS root and ESM/CommonJS `/zod` subpath load under Node.js. The package
smoke command runs under Bun; it does not establish raw Node ESM compatibility.
