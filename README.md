# baseui-tanstack-form

Adapter between `@tanstack/react-form` and `baseui`.

[![npm](https://img.shields.io/npm/v/baseui-tanstack-form.svg)](https://www.npmjs.com/package/baseui-tanstack-form)
[![Build and Deploy Storybook](https://github.com/kahwee/baseui-tanstack-form/actions/workflows/static.yml/badge.svg)](https://github.com/kahwee/baseui-tanstack-form/actions/workflows/static.yml)

📚 **View our component library**: [Storybook](https://kahwee.github.io/baseui-tanstack-form/)

## Prerequisites

- `baseui` >= 15.0.0 (peer dependency)
- `react` and `react-dom` >= 18.0.0 (peer dependency)
- `@tanstack/react-form` >= 1.1.0 (peer dependency)
- `zod` >= 3.22.4 (peer dependency)
- `bun` >= 1.0.0 (for development)

## Usage

Assuming you already have [react](https://reactjs.org/), [baseui](https://github.com/uber-web/baseui) and [@tanstack/react-form](https://tanstack.com/form/latest):

```sh
bun add baseui-tanstack-form
```

If you don't:

```sh
bun add react react-dom baseui
bun add @tanstack/react-form zod
```

Sample component:

```tsx
import React from 'react';
import { Button } from 'baseui/button';
import { useAppForm } from 'baseui-tanstack-form/form';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, 'Name must have at least 2 characters'),
  email: z.string().email('Invalid email address'),
  favoriteColor: z.string()
});

type FormValues = z.infer<typeof schema>;

const MyComponent = () => {
  const form = useAppForm<FormValues>({
    defaultValues: {
      name: '',
      email: '',
      favoriteColor: 'blue'
    },
    onSubmit: async (values) => {
      const result = schema.safeParse(values);
      if (!result.success) {
        // Handle validation errors
        return { error: result.error };
      }
      console.log('Form submitted with:', values);
    }
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    }}>
      <form.AppField name="name">
        {(field) => (
          <field.Input 
            label="Name"
            caption="Enter your full name"
            placeholder="John Doe"
          />
        )}
      </form.AppField>
      
      <form.AppField name="email">
        {(field) => (
          <field.Input 
            label="Email"
            caption="Enter your email address"
            placeholder="john@example.com"
          />
        )}
      </form.AppField>
      
      <form.AppField name="favoriteColor">
        {(field) => (
          <field.RadioGroup
            label="Favorite Color"
            options={[
              { value: 'blue', label: 'Blue' },
              { value: 'red', label: 'Red' },
              { value: 'green', label: 'Green' },
              { value: 'yellow', label: 'Yellow' }
            ]}
          />
        )}
      </form.AppField>
      
      <form.AppForm>
        <form.SubscribeButton label="Submit" />
      </form.AppForm>
    </form>
  );
};

export default MyComponent;
```

## How this works?

This library wraps corresponding `baseui` components and integrates them with TanStack Form. The components are registered in the form hook and accessed through the field context:

| Component | Description | Usage | Value Type |
|-----------|-------------|-------|-----------|
| `Input` | Integrates BaseUI Input with TanStack Form | `<field.Input label="Name" />` | `string` |
| `Textarea` | Multi-line text input integration | `<field.Textarea label="Comments" />` | `string` |
| `RadioGroup` | Radio button group integration | `<field.RadioGroup label="Options" options={[...]} />` | `string` |
| `SelectSingle` | Single-item dropdown selection component | `<field.SelectSingle label="Color" options={[...]} />` | `string` |
| `SelectMulti` | Multi-item dropdown selection component | `<field.SelectMulti label="Colors" options={[...]} />` | `string[]` |
| `Checkbox` | Single checkbox for boolean values | `<field.Checkbox label="I agree to terms" />` | `boolean` |
| `CheckboxGroup` | Multiple checkboxes returning selected values | `<field.CheckboxGroup label="Interests" options={[...]} />` | `string[]` |
| `DatePicker` | Date selection component | `<field.DatePicker label="Date" />` | `Date` or `string` |
| `Toggle` | Toggle switch component | `<field.Toggle>Label</field.Toggle>` | `boolean` |

## Form Composition

For complex forms, this library provides powerful form composition patterns that allow you to create modular, reusable form sections. 

See the [Form Composition Guide](./FORM_COMPOSITION.md) for detailed examples and patterns.

## Form Validation with Zod

This library uses Zod for schema validation with full TypeScript integration:

```tsx
import { z } from 'zod';
// Define your schema
const schema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  age: z.number().min(18, 'Must be at least 18 years old'),
  email: z.string().email('Invalid email address')
});

// Infer the type from the schema
type UserForm = z.infer<typeof schema>;

// Use in your form
const form = useAppForm<UserForm>({
  defaultValues: {
    username: '',
    age: 0,
    email: ''
  },
  onSubmit: async (values) => {
    // Validate values against schema
    const result = schema.safeParse(values);
    if (!result.success) {
      // Handle validation errors
      return { error: result.error };
    }
    // Continue with submission
    console.log('Valid form data:', values);
  }
});

// Field-level validation can also be applied
<form.AppField name="username">
  {(field) => {
    // Validate on change
    const error = field.state.value.length < 3 
      ? 'Username must be at least 3 characters' 
      : undefined;
    
    return <field.Input 
      label="Username" 
      error={!!error}
      caption={error}
    />;
  }}
</form.AppField>

// Single select component
<form.AppField name="favoriteColor">
  {(field) => (
    <field.SelectSingle
      label="Favorite Color"
      options={[
        { id: 'blue', label: 'Blue' },
        { id: 'red', label: 'Red' },
        { id: 'green', label: 'Green' }
      ]}
      placeholder="Choose a color"
    />
  )}
</form.AppField>

// Multi-select component
<form.AppField name="skills">
  {(field) => (
    <field.SelectMulti
      label="Skills"
      options={[
        { id: 'javascript', label: 'JavaScript' },
        { id: 'typescript', label: 'TypeScript' },
        { id: 'react', label: 'React' },
        { id: 'node', label: 'Node.js' }
      ]}
      placeholder="Select skills"
    />
  )}
</form.AppField>

// Checkbox component
<form.AppField name="agreeToTerms">
  {(field) => (
    <field.Checkbox
      label="I agree to the terms and conditions"
    />
  )}
</form.AppField>

// CheckboxGroup component
<form.AppField name="interests">
  {(field) => (
    <field.CheckboxGroup
      label="Select your interests"
      inline={true}
      options={[
        { value: 'tech', label: 'Technology' },
        { value: 'science', label: 'Science' },
        { value: 'art', label: 'Art' },
        { value: 'music', label: 'Music' }
      ]}
    />
  )}
</form.AppField>

// DatePicker component
<form.AppField name="eventDate">
  {(field) => (
    <field.DatePicker
      label="Event Date"
      // Optional: range selection
      // range
      // Optional: specific min/max dates
      // minDate={new Date(2023, 0, 1)}
      // maxDate={new Date(2023, 11, 31)}
    />
  )}
</form.AppField>
```

## Development

Clone from git

```sh
git clone https://github.com/kahwee/baseui-tanstack-form.git
cd baseui-tanstack-form
```

Setup dev packages with `bun`.

```sh
bun install
bun run storybook
```

Go to [http://localhost:6006](http://localhost:6006) to view storybook.

### Common Commands

- `bun run dev` - Start development server
- `bun run build` - Build the library
- `bun run test` - Run tests
- `bun run test:coverage` - Run tests with coverage report
- `bun run lint` - Run linter
- `bun run typecheck` - Run TypeScript type checking

For more information about the modernization changes, see [MIGRATION.md](./MIGRATION.md).

## License

MIT