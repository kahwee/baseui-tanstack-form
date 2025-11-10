# BaseUI TanStack Form

<div align="center">

[![npm version](https://img.shields.io/npm/v/baseui-tanstack-form.svg)](https://www.npmjs.com/package/baseui-tanstack-form)
[![Build and Deploy Storybook](https://github.com/kahwee/baseui-tanstack-form/actions/workflows/static.yml/badge.svg)](https://github.com/kahwee/baseui-tanstack-form/actions/workflows/static.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**A powerful React form library bridging TanStack Form with BaseUI components**

[📚 View Storybook](https://kahwee.github.io/baseui-tanstack-form/) | [📖 Documentation](#documentation) | [🚀 Getting Started](#installation)

</div>

---

## ✨ Features

- 🎨 **Beautiful UI** - Pre-built form components using BaseUI design system
- 🔒 **Type-Safe** - Full TypeScript support with comprehensive type inference
- ✅ **Zod Integration** - Built-in validation with Zod v4 schemas
- 🧩 **Composable** - Modular form sections with HOC pattern
- 📦 **Modern Tooling** - Built with Vite, tested with Vitest, documented with Storybook v10
- ♿ **Accessible** - WCAG compliant BaseUI components
- 🎯 **Framework Agnostic** - Works with any TanStack Form setup
- 🪝 **Flexible Hooks** - Easy integration with custom form logic

## 📋 Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Components](#components)
- [Validation](#validation)
- [Form Composition](#form-composition)
- [API Reference](#api-reference)
- [Documentation](#documentation)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Installation

### Prerequisites

```json
{
  "react": ">=18.0.0",
  "react-dom": ">=18.0.0",
  "baseui": ">=15.0.0",
  "@tanstack/react-form": ">=1.1.0",
  "zod": ">=4.0.0"
}
```

### Install

Using npm:
```bash
npm install baseui-tanstack-form
```

Using yarn:
```bash
yarn add baseui-tanstack-form
```

Using pnpm:
```bash
pnpm add baseui-tanstack-form
```

### Full Setup

If you don't have the peer dependencies installed:

```bash
npm install react react-dom baseui styletron-engine-atomic styletron-react
npm install @tanstack/react-form zod
npm install baseui-tanstack-form
```

## 🎯 Quick Start

```tsx
import React from 'react';
import { useAppForm } from 'baseui-tanstack-form/form';
import { z } from 'zod';

// Define your validation schema
const schema = z.object({
  name: z.string().min(2, 'Name must have at least 2 characters'),
  email: z.string().email('Invalid email address'),
  favoriteColor: z.string()
});

type FormValues = z.infer<typeof schema>;

function MyForm() {
  const form = useAppForm<FormValues>({
    defaultValues: {
      name: '',
      email: '',
      favoriteColor: 'blue'
    },
    validators: {
      onChange: ({ value }) => {
        const result = schema.safeParse(value);
        return result.success ? undefined : result.error.format();
      }
    },
    onSubmit: async (values) => {
      console.log('Form submitted:', values);
    }
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      form.handleSubmit();
    }}>
      {/* Text Input */}
      <form.AppField name="name">
        {(field) => (
          <field.Input
            label="Name"
            placeholder="John Doe"
          />
        )}
      </form.AppField>

      {/* Email Input */}
      <form.AppField name="email">
        {(field) => (
          <field.Input
            label="Email"
            type="email"
            placeholder="john@example.com"
          />
        )}
      </form.AppField>

      {/* Radio Group */}
      <form.AppField name="favoriteColor">
        {(field) => (
          <field.RadioGroup
            label="Favorite Color"
            options={[
              { value: 'blue', label: 'Blue' },
              { value: 'red', label: 'Red' },
              { value: 'green', label: 'Green' }
            ]}
          />
        )}
      </form.AppField>

      {/* Submit Button */}
      <form.AppForm>
        <form.SubscribeButton label="Submit" />
      </form.AppForm>
    </form>
  );
}

export default MyForm;
```

## 🧩 Components

All components are fully integrated with TanStack Form and accessed through the field context:

| Component | Description | Value Type | Example Usage |
|-----------|-------------|------------|---------------|
| **Input** | Text input field with validation | `string` | `<field.Input label="Name" placeholder="Enter name" />` |
| **Textarea** | Multi-line text input | `string` | `<field.Textarea label="Bio" placeholder="Tell us about yourself" />` |
| **RadioGroup** | Radio button selection | `string` | `<field.RadioGroup label="Gender" options={[...]} />` |
| **SelectSingle** | Dropdown select (single) | `string` | `<field.SelectSingle label="Country" options={[...]} placeholder="Select country" />` |
| **SelectMulti** | Dropdown select (multiple) | `string[]` | `<field.SelectMulti label="Skills" options={[...]} placeholder="Select skills" />` |
| **Checkbox** | Single boolean checkbox | `boolean` | `<field.Checkbox label="I agree to terms" />` |
| **CheckboxGroup** | Multiple checkboxes | `string[]` | `<field.CheckboxGroup label="Interests" options={[...]} />` |
| **DatePicker** | Date selection | `Date \| string` | `<field.DatePicker label="Birth Date" />` |
| **Toggle** | Toggle switch | `boolean` | `<field.Toggle>Enable notifications</field.Toggle>` |
| **SubscribeButton** | Submit button with loading state | N/A | `<form.SubscribeButton label="Submit" />` |

### Component Examples

#### Select (Single & Multi)

```tsx
// Single Select
<form.AppField name="category">
  {(field) => (
    <field.SelectSingle
      label="Category"
      placeholder="Select a category"
      options={[
        { id: 'tech', label: 'Technology' },
        { id: 'design', label: 'Design' },
        { id: 'business', label: 'Business' }
      ]}
    />
  )}
</form.AppField>

// Multi Select
<form.AppField name="tags">
  {(field) => (
    <field.SelectMulti
      label="Tags"
      placeholder="Select tags"
      options={[
        { id: 'react', label: 'React' },
        { id: 'typescript', label: 'TypeScript' },
        { id: 'nodejs', label: 'Node.js' }
      ]}
    />
  )}
</form.AppField>
```

#### Checkbox & CheckboxGroup

```tsx
// Single Checkbox
<form.AppField name="agreeToTerms">
  {(field) => (
    <field.Checkbox
      label="I agree to the terms and conditions"
    />
  )}
</form.AppField>

// Checkbox Group
<form.AppField name="interests">
  {(field) => (
    <field.CheckboxGroup
      label="Select your interests"
      inline={true}
      options={[
        { value: 'technology', label: 'Technology' },
        { value: 'science', label: 'Science' },
        { value: 'art', label: 'Art' },
        { value: 'music', label: 'Music' }
      ]}
    />
  )}
</form.AppField>
```

## ✅ Validation

### Zod Schema Validation

This library provides seamless integration with Zod v4 for powerful, type-safe validation:

```tsx
import { z } from 'zod';
import { useAppForm } from 'baseui-tanstack-form/form';

const registrationSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username cannot exceed 20 characters'),

  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase(),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),

  age: z
    .number()
    .int('Age must be a whole number')
    .min(18, 'Must be at least 18 years old'),

  role: z.enum(['user', 'moderator', 'admin'], {
    message: 'Please select a valid role'
  }),

  tags: z
    .array(z.string())
    .min(1, 'Select at least one tag')
    .max(10, 'Maximum 10 tags allowed'),

  agreeToTerms: z.literal(true, {
    message: 'You must agree to the terms and conditions'
  })
});

type RegistrationForm = z.infer<typeof registrationSchema>;

function RegistrationForm() {
  const form = useAppForm<RegistrationForm>({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      age: 18,
      role: 'user',
      tags: [],
      agreeToTerms: false
    },
    validators: {
      // Validate on change
      onChange: ({ value }) => {
        const result = registrationSchema.safeParse(value);
        return result.success ? undefined : result.error.format();
      },
      // Validate on blur
      onBlur: ({ value }) => {
        const result = registrationSchema.safeParse(value);
        return result.success ? undefined : result.error.format();
      }
    },
    onSubmit: async (values) => {
      const result = registrationSchema.safeParse(values);
      if (result.success) {
        console.log('Valid data:', result.data);
        // Submit to API
      }
    }
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      form.handleSubmit();
    }}>
      {/* Form fields */}
    </form>
  );
}
```

### Manual Field Validation

For simple validation logic, you can validate fields manually:

```tsx
<form.AppField name="username">
  {(field) => {
    const error = field.state.value.length < 3
      ? 'Username must be at least 3 characters'
      : undefined;

    return (
      <field.Input
        label="Username"
        placeholder="Enter username"
        error={!!error}
        caption={error}
      />
    );
  }}
</form.AppField>
```

### Advanced Zod Features

#### Cross-Field Validation

```tsx
const passwordSchema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string()
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  }
);
```

#### Nested Object Validation

```tsx
const userSchema = z.object({
  name: z.string(),
  contact: z.object({
    email: z.string().email(),
    phone: z.string().optional()
  }),
  address: z.object({
    street: z.string(),
    city: z.string(),
    zipCode: z.string().regex(/^\d{5}$/, 'Invalid ZIP code')
  }).optional()
});
```

## 🎨 Form Composition

Create reusable form sections using the `withForm` HOC:

```tsx
import { useAppForm, withForm } from 'baseui-tanstack-form/form';

// Reusable address form section
const AddressForm = withForm({
  defaultValues: {
    street: '',
    city: '',
    zipCode: ''
  },
  props: { title: 'Address' },
  render: function({ form, title }) {
    return (
      <Card>
        <HeadingSmall>{title}</HeadingSmall>

        <form.AppField name="street">
          {(field) => <field.Input label="Street" />}
        </form.AppField>

        <form.AppField name="city">
          {(field) => <field.Input label="City" />}
        </form.AppField>

        <form.AppField name="zipCode">
          {(field) => <field.Input label="ZIP Code" />}
        </form.AppField>
      </Card>
    );
  }
});

// Main form
function UserForm() {
  const form = useAppForm({
    defaultValues: {
      name: '',
      email: '',
      street: '',
      city: '',
      zipCode: ''
    },
    onSubmit: (values) => console.log(values)
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      form.handleSubmit();
    }}>
      <form.AppField name="name">
        {(field) => <field.Input label="Name" />}
      </form.AppField>

      <form.AppField name="email">
        {(field) => <field.Input label="Email" type="email" />}
      </form.AppField>

      {/* Reusable address section */}
      <AddressForm form={form} title="Shipping Address" />

      <form.AppForm>
        <form.SubscribeButton label="Submit" />
      </form.AppForm>
    </form>
  );
}
```

For more details, see [FORM_COMPOSITION.md](./FORM_COMPOSITION.md).

## 📖 API Reference

### `useAppForm<TFormData>(options)`

Creates a form instance with integrated BaseUI components.

**Parameters:**
- `defaultValues` - Initial form values
- `validators` - Validation configuration
  - `onChange` - Validate on field change
  - `onBlur` - Validate on field blur
  - `onSubmit` - Validate on form submit
- `onSubmit` - Form submission handler

**Returns:**
Form instance with:
- `AppField` - Component for creating form fields
- `AppForm` - Component wrapper for form submission
- `handleSubmit` - Function to handle form submission
- `SubscribeButton` - Submit button component

### `withForm(config)`

Higher-order component for creating reusable form sections.

**Parameters:**
- `defaultValues` - Default values for the form section
- `props` - Additional props for the render function
- `render` - Render function receiving `{ form, ...props }`

**Returns:**
Reusable form component

## 📚 Documentation

- **[CLAUDE.md](./CLAUDE.md)** - Comprehensive development guide
- **[TESTING.md](./TESTING.md)** - Testing patterns and best practices
- **[FORM_COMPOSITION.md](./FORM_COMPOSITION.md)** - Advanced form composition patterns
- **[Storybook](https://kahwee.github.io/baseui-tanstack-form/)** - Interactive component examples

## 🛠️ Development

### Prerequisites

- Node.js 18+ or Bun 1.0+
- npm, yarn, or pnpm

### Setup

Clone the repository:

```bash
git clone https://github.com/kahwee/baseui-tanstack-form.git
cd baseui-tanstack-form
```

Install dependencies:

```bash
npm install
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server |
| `npm run build` | Build library for production |
| `npm run clean` | Remove build artifacts |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run typecheck` | Run TypeScript type checking |
| `npm test` | Run tests with Vitest |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:ui` | Open Vitest UI |
| `npm run test:coverage` | Generate coverage report |
| `npm run storybook` | Start Storybook dev server |
| `npm run build:storybook` | Build Storybook for production |

### Tech Stack

- **Build Tool**: Vite v6.4+
- **Testing**: Vitest v4.0+ with React Testing Library
- **Documentation**: Storybook v10.0+
- **Linting**: ESLint v9+ with TypeScript support
- **Formatting**: Prettier v3.6+
- **Type Checking**: TypeScript v5.9+

### Project Structure

```
baseui-tanstack-form/
├── src/
│   ├── components/      # Shared components
│   ├── features/        # Feature-specific components
│   ├── hooks/           # Custom hooks (useAppForm, etc.)
│   ├── stories/         # Storybook stories
│   ├── test-utils/      # Testing utilities
│   └── index.tsx        # Main export file
├── .storybook/          # Storybook configuration
├── dist/                # Build output
└── coverage/            # Test coverage reports
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Run linting: `npm run lint`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Development Guidelines

- Write tests for new features
- Follow the existing code style
- Update documentation as needed
- Ensure all tests pass before submitting PR
- Use conventional commit messages

## 📄 License

MIT © [KahWee Teng](https://github.com/kahwee)

## 🙏 Acknowledgments

- [TanStack Form](https://tanstack.com/form) - Headless form state management
- [BaseUI](https://baseweb.design/) - Uber's design system
- [Zod](https://zod.dev/) - TypeScript-first schema validation

## 🔗 Links

- [npm Package](https://www.npmjs.com/package/baseui-tanstack-form)
- [GitHub Repository](https://github.com/kahwee/baseui-tanstack-form)
- [Issue Tracker](https://github.com/kahwee/baseui-tanstack-form/issues)
- [Storybook Demo](https://kahwee.github.io/baseui-tanstack-form/)

---

<div align="center">
  <sub>Built with ❤️ using modern web technologies</sub>
</div>
