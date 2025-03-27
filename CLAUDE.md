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
- `Input` - BaseUI input field with form integration
- `Textarea` - BaseUI textarea with form integration
- `RadioGroup` - BaseUI radio group with form integration
- `Select` - BaseUI select (dropdown) with single and multi-select support
- `Checkbox` - BaseUI checkbox for boolean values
- `SubscribeButton` - Submit button with loading state
- Field access with `form.AppField` pattern and `field.ComponentName` usage
- Form submission with `form.handleSubmit()`

### Example
```tsx
// Import the pre-configured form hook
import { useAppForm, withForm } from './hooks/form';

// Form section with withForm HOC
const GroupForm = withForm({
  defaultValues: { firstName: 'John', lastName: 'Doe' },
  props: { title: 'Child Form' },
  render: function({ form, title }) {
    return (
      <Card>
        <StyledBody>
          <HeadingSmall>{title}</HeadingSmall>
          <form.AppField
            name="firstName"
            children={(field) => <field.Input label="First Name" />}
          />
          <form.AppField
            name="comments"
            children={(field) => <field.Textarea label="Comments" />}
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
    defaultValues: { 
      firstName: 'John', 
      lastName: 'Doe',
      comments: '',
      preference: '',
      category: '',
      tags: [],
      agreeToTerms: false
    },
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
      <GroupForm form={form} title="Person Information" />
      
      <form.AppField name="preference">
        {(field) => (
          <field.RadioGroup
            label="Preference"
            options={[
              { value: 'option1', label: 'Option 1' },
              { value: 'option2', label: 'Option 2' },
              { value: 'option3', label: 'Option 3' }
            ]}
          />
        )}
      </form.AppField>
      
      <form.AppField name="category">
        {(field) => (
          <field.Select
            label="Category"
            options={[
              { id: 'electronics', label: 'Electronics' },
              { id: 'books', label: 'Books' },
              { id: 'clothing', label: 'Clothing' }
            ]}
            placeholder="Select a category"
          />
        )}
      </form.AppField>
      
      <form.AppField name="tags">
        {(field) => (
          <field.Select
            label="Tags"
            multi={true}
            options={[
              { id: 'new', label: 'New' },
              { id: 'sale', label: 'Sale' },
              { id: 'featured', label: 'Featured' },
              { id: 'limited', label: 'Limited Edition' }
            ]}
            placeholder="Select tags"
          />
        )}
      </form.AppField>
      
      <form.AppField name="agreeToTerms">
        {(field) => (
          <field.Checkbox
            label="I agree to the terms and conditions"
          />
        )}
      </form.AppField>
    </form>
  );
}
```

## Validation
```tsx
// Field validation
<form.AppField
  name="username"
>
  {(field) => {
    // Manual validation logic
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

// Schema validation with Zod
import { z } from 'zod';

const schema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  comments: z.string().optional(),
  preference: z.enum(['option1', 'option2', 'option3']),
  category: z.string().min(1, 'Please select a category'),
  tags: z.array(z.string()).min(1, 'Select at least one tag'),
  agreeToTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the terms and conditions' })
  })
});

const form = useAppForm({
  defaultValues: { 
    username: '', 
    email: '',
    comments: '',
    preference: 'option1',
    category: '',
    tags: [],
    agreeToTerms: false
  },
  onSubmit: async (values) => {
    // Validate with Zod
    const result = schema.safeParse(values);
    if (!result.success) {
      // Return validation errors
      return { error: result.error };
    }
    // Process valid form data
    console.log('Form submitted with valid data:', values);
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