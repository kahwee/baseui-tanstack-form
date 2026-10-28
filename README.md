# BaseUI TanStack Form

React form fields connecting TanStack Form to Base Web, with optional Zod helpers.
This checkout supports **React 18.2–18.x**, not React 19.

[Storybook](https://kahwee.github.io/baseui-tanstack-form/) ·
[Providers and usage](USAGE.md) · [Changelog](CHANGELOG.md)

## Install locally

`baseui-tanstack-form@1.0.6` is an **unpublished candidate**. The npm package endpoint
returned 404 on October 28, 2026; the name is not confirmed as reserved.
From this checkout, use Bun 1.4.4:

```sh
bun ci
bun run check
bun pm pack
# In your React 18 app:
npm install /path/to/baseui-tanstack-form-1.0.6.tgz @tanstack/react-form baseui react@18 react-dom@18 zod@4 styletron-engine-atomic styletron-react
```

Render inside [Base Web and Styletron providers](USAGE.md):

```tsx
import { useAppForm } from 'baseui-tanstack-form';

export function ContactForm() {
  const form = useAppForm({
    defaultValues: { name: '' },
    onSubmit: ({ value }) => { console.log(value); },
  });
  return (
    <form onSubmit={(event) => { event.preventDefault(); void form.handleSubmit(); }}>
      <form.AppField name="name">
        {(field) => <field.Input label="Name" />}
      </form.AppField>
      <form.AppForm><form.SubscribeButton label="Send" /></form.AppForm>
    </form>
  );
}
```

[Usage](USAGE.md) covers the controls and `/zod` exports;
[form composition](FORM_COMPOSITION.md) covers reusable sections and arrays.

## Develop

`bun run check` runs source checks, builds, and ESM/CommonJS package loading.
Use `bun run storybook` to explore fields and `bun run build:storybook` after
Storybook changes. Unit tests use jsdom; a Storybook build is not a browser test.

[Testing](TESTING.md) · [CI maintenance](.github/ACTIONS.md) ·
[Build details and measurements](docs/build-performance.md)

MIT © KahWee Teng.
