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
package export check. Use `bun run build:storybook` for documentation changes.

More detail: [form composition](FORM_COMPOSITION.md), [testing](TESTING.md),
and [source code](https://github.com/kahwee/baseui-tanstack-form).

MIT © KahWee Teng.
