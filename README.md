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
- `node` >= 18.0.0 (for development)

## Usage

Assuming you already have [react](https://reactjs.org/), [baseui](https://github.com/uber-web/baseui) and [@tanstack/react-form](https://tanstack.com/form/latest):

```sh
npm install baseui-tanstack-form
```

If you don't:

```sh
npm install react react-dom baseui
npm install @tanstack/react-form zod
```

Sample component:

```tsx
import React from 'react';
import { Button } from 'baseui/button';
import { InputField } from 'baseui-tanstack-form/input';
import { Select } from 'baseui-tanstack-form/select';
import { Form, useAppForm } from 'baseui-tanstack-form/form';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, 'Name must have at least 2 characters'),
  email: z.string().email('Invalid email address'),
  favoriteColor: z.object({
    id: z.string(),
    label: z.string()
  })
});

type FormValues = z.infer<typeof schema>;

const MyComponent = () => {
  const form = useAppForm<FormValues>({
    defaultValues: {
      name: '',
      email: '',
      favoriteColor: { id: 'blue', label: 'Blue' }
    },
    validatorAdapter: 'zod',
    validator: schema
  });

  return (
    <Form form={form} onSubmit={(values) => console.log(values)}>
      <InputField
        name="name"
        label="Name"
        caption="Enter your full name"
        placeholder="John Doe"
      />
      
      <InputField
        name="email"
        label="Email"
        caption="Enter your email address"
        placeholder="john@example.com"
      />
      
      <Select
        name="favoriteColor"
        label="Favorite Color"
        options={[
          { id: 'blue', label: 'Blue' },
          { id: 'red', label: 'Red' },
          { id: 'green', label: 'Green' },
          { id: 'yellow', label: 'Yellow' }
        ]}
      />
      
      <Button type="submit">Submit</Button>
    </Form>
  );
};

export default MyComponent;
```

## How this works?

This library wraps corresponding `baseui` components and integrates them with TanStack Form:

| Component | Description |
|-----------|-------------|
| `InputField` | Integrates BaseUI Input with TanStack Form |
| `Checkbox` | Integrates BaseUI Checkbox with TanStack Form |
| `CheckboxGroup` | Multiple checkboxes as a group |
| `RadioGroup` | Radio button group integration |
| `Select` | Integrates BaseUI Select with TanStack Form |
| `DatePicker` | Date selection component |
| `Textarea` | Multi-line text input integration |
| `Toggle` | Toggle switch component |

## Form Validation with Zod

This library uses Zod for schema validation with full TypeScript integration:

```tsx
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
  validatorAdapter: 'zod',
  validator: schema
});
```

## Development

Clone from git

```sh
git clone https://github.com/kahwee/baseui-tanstack-form.git
cd baseui-tanstack-form
```

Setup dev packages with `npm`.

```sh
npm install
npm run storybook
```

Go to [http://localhost:6006](http://localhost:6006) to view storybook.

### Common Commands

- `npm run dev` - Start development server
- `npm run build` - Build the library
- `npm run test` - Run tests
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run linter
- `npm run typecheck` - Run TypeScript type checking

For more information about the modernization changes, see [MIGRATION.md](./MIGRATION.md).

## License

MIT