# BaseUI TanStack Form

## Tech Stack
- **React**: v18.2+
- **TypeScript**: v5.3+ (strict mode)
- **ESLint**: v9.22+
- **Prettier**: v3.2+
- **Vite**: v5.1+
- **Testing**: Vitest v3.0+ with React Testing Library v14.2+
- **Storybook**: v8.6+
- **Forms**: TanStack Form v1.1.0+
- **Validation**: Zod v3.22+
- **UI Components**: BaseUI v15+
- **Styling**: Styletron

## Commands
- Development: `npm run dev` (Vite)
- Build: `npm run build` (Vite + TypeScript)
- Clean: `npm run clean` (removes dist and coverage directories)
- Lint: `npm run lint` (ESLint v9)
- Type check: `npm run typecheck` (TypeScript)
- Test: `npm run test` (Vitest)
- Test watch mode: `npm run test:watch`
- Test coverage: `npm run test:coverage`
- Storybook: `npm run storybook`
- Build Storybook: `npm run build:storybook`

## Naming Conventions
- Files: `lowercase-with-dashes.tsx` for components, `.ts` for utilities
- Components: PascalCase (e.g., `InputField`)
- Interfaces: PascalCase (e.g., `InputFieldProps`)
- Hooks: camelCase with "use" prefix (e.g., `useAppForm`) 
- Event handlers: camelCase with "handle" prefix (e.g., `handleChange`)

## Form Patterns
- Use `useAppForm` hook to create form instances
- Use `withForm` HOC for composable form sections
- Use `formOptions` for shared form configuration
- Field values are accessed via field context

### Components
- `InputField` - BaseUI input field with form integration
- `SubscribeButton` - Submit button with loading state
- Field access with `form.AppField` pattern
- Form submission with `form.handleSubmit()`

### Example
```tsx
// Create a form hook
const { useAppForm, withForm } = createFormHook({
  fieldComponents: { InputField },
  formComponents: { SubscribeButton },
  fieldContext,
  formContext,
});

// Form section with withForm HOC
const ChildForm = withForm({
  defaultValues: { firstName: 'John', lastName: 'Doe' },
  props: { title: 'Child Form' },
  render: function({ form, title }) {
    return (
      <Card>
        <StyledBody>
          <HeadingSmall>{title}</HeadingSmall>
          <form.AppField
            name="firstName"
            children={(field) => <field.InputField label="First Name" />}
          />
        </StyledBody>
        <StyledAction>
          <form.AppForm>
            <form.SubscribeButton label="Submit" />
          </form.AppForm>
        </StyledAction>
      </Card>
    );
  },
});

// Main form
function ParentForm() {
  const form = useAppForm({
    defaultValues: { firstName: 'John', lastName: 'Doe' },
    onSubmit: (values) => {
      console.log('Form submitted with values:', values);
    }
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    }}>
      <ChildForm form={form} title="Person Information" />
    </form>
  );
}
```

## Validation
```tsx
// Field validation (can be added to InputField)
<form.AppField
  name="username"
  validators={{
    onChange: ({ value }) => 
      value.length < 3 ? 'Username must be at least 3 characters' : undefined
  }}
>
  {(field) => <field.InputField label="Username" />}
</form.AppField>

// Schema validation with Zod
import { z } from 'zod';
import { zodValidator } from '@tanstack/zod-form-adapter';

const schema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address')
});

const form = useAppForm({
  defaultValues: { username: '', email: '' },
  validatorAdapter: zodValidator,
  validators: {
    onSubmit: schema,
  }
});
```

## Development
- Stories in `src/stories/*.stories.tsx`
- Components organized by feature in `src/features/*`
- Shared hooks in `src/hooks/*`
- Shared components in `src/components/*`
- Run lint and typecheck before commit (Husky pre-commit hook)
- Export components through the main `index.tsx` file