# Form Composition with BaseUI TanStack Form

This guide explains how to use form composition patterns with BaseUI TanStack Form. Form composition allows you to break down complex forms into reusable, manageable pieces that can be combined together.

## Table of Contents

- [Core Concepts](#core-concepts)
- [Basic Form Usage](#basic-form-usage)
- [Form Composition Patterns](#form-composition-patterns)
  - [Using the `withForm` HOC](#using-the-withform-hoc)
  - [Nested Form Components](#nested-form-components)
  - [Sharing Form Context](#sharing-form-context)
- [Advanced Patterns](#advanced-patterns)
  - [Field Arrays](#field-arrays)
  - [Conditional Fields](#conditional-fields)
  - [Dynamic Forms](#dynamic-forms)
- [Validation Strategies](#validation-strategies)
- [Best Practices](#best-practices)

## Core Concepts

BaseUI TanStack Form uses several core abstractions:

1. **Form Hook Creation**: Using `createFormHook` to create application-specific form hooks
2. **Form Instances**: Created with `useAppForm` to manage form state
3. **Field Components**: Used within forms to capture user input
4. **Form Composition**: Using `withForm` to create reusable form sections

## Basic Form Usage

Before diving into composition, here's a simple form setup:

```tsx
import { useAppForm } from '../hooks/form';

function SimpleForm() {
  const form = useAppForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: ''
    }
  });

  const handleSubmit = form.handleSubmit(() => {
    console.log('Form values:', form.getValues());
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit();
    }}>
      <form.AppField name="firstName">
        {(field) => <field.Input label="First Name" />}
      </form.AppField>
      <form.AppField name="lastName">
        {(field) => <field.Input label="Last Name" />}
      </form.AppField>
      <form.AppField name="email">
        {(field) => <field.Input label="Email" />}
      </form.AppField>
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Form Composition Patterns

### Using the `withForm` HOC

The `withForm` Higher Order Component (HOC) is the main tool for composition. It creates a reusable form section:

```tsx
import { withForm } from '../hooks/form';
import { Card, StyledBody, StyledAction } from 'baseui/card';
import { HeadingSmall } from 'baseui/typography';
import { Button } from 'baseui/button';

const PersonalInfoForm = withForm({
  // Default values for this section (optional)
  defaultValues: {
    firstName: '',
    lastName: '',
    email: ''
  },
  // Additional props the component will receive
  props: {
    title: 'Personal Information'
  },
  // The render function receives both form and props
  render: ({ form, title }) => {
    return (
      <Card>
        <StyledBody>
          <HeadingSmall>{title}</HeadingSmall>
          <form.AppField name="firstName">
            {(field) => <field.Input label="First Name" />}
          </form.AppField>
          <form.AppField name="lastName">
            {(field) => <field.Input label="Last Name" />}
          </form.AppField>
          <form.AppField name="email">
            {(field) => <field.Input label="Email" />}
          </form.AppField>
        </StyledBody>
        <StyledAction>
          <Button type="submit">Save</Button>
        </StyledAction>
      </Card>
    );
  }
});

// Using the component
function ProfileForm() {
  const form = useAppForm({
    defaultValues: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com'
    },
    onSubmit: (values) => {
      console.log('Submitted values:', values);
    }
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    }}>
      <PersonalInfoForm 
        form={form} 
        title="User Information" 
      />
    </form>
  );
}
```

### Nested Form Components

You can nest form sections for more complex forms:

```tsx
import { withForm } from '../hooks/form';

// Address form section
const AddressForm = withForm({
  props: { title: 'Address' },
  render: ({ form, title }) => (
    <div>
      <h3>{title}</h3>
      <form.AppField name="street">
        {(field) => <field.Input label="Street" />}
      </form.AppField>
      <form.AppField name="city">
        {(field) => <field.Input label="City" />}
      </form.AppField>
      <form.AppField name="state">
        {(field) => <field.Input label="State" />}
      </form.AppField>
      <form.AppField name="zip">
        {(field) => <field.Input label="Zip Code" />}
      </form.AppField>
    </div>
  )
});

// User profile form that includes address
const UserProfileForm = withForm({
  props: { title: 'User Profile' },
  render: ({ form, title }) => (
    <div>
      <h2>{title}</h2>
      <form.AppField name="fullName">
        {(field) => <field.Input label="Full Name" />}
      </form.AppField>
      <form.AppField name="email">
        {(field) => <field.Input label="Email" />}
      </form.AppField>
      
      {/* Nested address form */}
      <form.AppField name="address">
        {(addressField) => (
          <AddressForm
            form={addressField.form}
            title="Primary Address"
          />
        )}
      </form.AppField>
    </div>
  )
});
```

### Sharing Form Context

Multiple form components can share the same form context:

```tsx
function MultiSectionForm() {
  const form = useAppForm({
    defaultValues: {
      personalInfo: {
        firstName: '',
        lastName: '',
        email: ''
      },
      address: {
        street: '',
        city: '',
        state: '',
        zip: ''
      },
      preferences: {
        notifications: false,
        newsletter: false
      }
    }
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      form.handleSubmit();
    }}>
      <form.AppField name="personalInfo">
        {(personalField) => (
          <PersonalInfoForm form={personalField.form} title="Personal Information" />
        )}
      </form.AppField>
      
      <form.AppField name="address">
        {(addressField) => (
          <AddressForm form={addressField.form} title="Address Information" />
        )}
      </form.AppField>
      
      <form.AppField name="preferences">
        {(preferencesField) => (
          <PreferencesForm form={preferencesField.form} title="User Preferences" />
        )}
      </form.AppField>
      
      <Button type="submit">Submit All Sections</Button>
    </form>
  );
}
```

## Advanced Patterns

### Field Arrays

Working with arrays of fields:

```tsx
const ContactsForm = withForm({
  props: { title: 'Contact List' },
  render: ({ form, title }) => {
    return (
      <div>
        <h3>{title}</h3>
        <form.FieldArray name="contacts">
          {({ fields }) => (
            <div>
              {fields.map((field, index) => (
                <div key={field.key}>
                  <form.AppField name={`contacts[${index}].name`}>
                    {(nameField) => <nameField.Input label="Name" />}
                  </form.AppField>
                  <form.AppField name={`contacts[${index}].email`}>
                    {(emailField) => <emailField.Input label="Email" />}
                  </form.AppField>
                  <Button onClick={() => fields.remove(index)}>Remove</Button>
                </div>
              ))}
              <Button onClick={() => fields.push({ name: '', email: '' })}>
                Add Contact
              </Button>
            </div>
          )}
        </form.FieldArray>
      </div>
    );
  }
});
```

### Conditional Fields

Showing fields conditionally based on values:

```tsx
const ShippingForm = withForm({
  props: {},
  render: ({ form }) => {
    const shippingMethod = form.watch('shippingMethod');
    
    return (
      <div>
        <form.AppField name="shippingMethod">
          {(field) => (
            <field.RadioGroup
              label="Shipping Method"
              options={[
                { label: 'Standard', value: 'standard' },
                { label: 'Express', value: 'express' },
                { label: 'International', value: 'international' }
              ]}
            />
          )}
        </form.AppField>
        
        {shippingMethod === 'international' && (
          <>
            <form.AppField name="customsInfo">
              {(field) => <field.Input label="Customs Information" />}
            </form.AppField>
            <form.AppField name="countryCode">
              {(field) => <field.Input label="Country Code" />}
            </form.AppField>
          </>
        )}
        
        {shippingMethod === 'express' && (
          <form.AppField name="phoneNumber">
            {(field) => <field.Input label="Contact Phone Number" />}
          </form.AppField>
        )}
      </div>
    );
  }
});
```

### Dynamic Forms

Creating forms with dynamic fields:

```tsx
const DynamicQuestionnaireForm = withForm({
  props: { 
    questions: [
      { id: 'q1', text: 'What is your age?', type: 'number' },
      { id: 'q2', text: 'Where do you live?', type: 'text' },
      { id: 'q3', text: 'Notes:', type: 'textarea' }
    ]
  },
  render: ({ form, questions }) => {
    return (
      <div>
        <h3>Questionnaire</h3>
        {questions.map(question => (
          <div key={question.id}>
            <form.AppField name={question.id}>
              {(field) => {
                if (question.type === 'textarea') {
                  return <field.Textarea label={question.text} />;
                } else if (question.type === 'number') {
                  return <field.Input label={question.text} type="number" />;
                } else {
                  return <field.Input label={question.text} />;
                }
              }}
            </form.AppField>
          </div>
        ))}
      </div>
    );
  }
});
```

## Validation Strategies

Form composition works well with various validation approaches:

### Field-Level Validation

```tsx
<form.AppField
  name="email"
  validators={{
    onChange: ({ value }) => 
      !value ? 'Email is required' : 
      !value.includes('@') ? 'Invalid email address' : 
      undefined
  }}
>
  {(field) => <field.Input label="Email" />}
</form.AppField>
```

### Form Section Validation

```tsx
const AddressForm = withForm({
  props: { title: 'Address' },
  validators: {
    onChange: (values) => {
      const errors = {};
      if (!values.street) errors.street = 'Street is required';
      if (!values.city) errors.city = 'City is required';
      // More validations...
      return Object.keys(errors).length ? errors : {};
    }
  },
  render: ({ form, title }) => (
    // Form fields...
  )
});
```

### Schema Validation with Zod

```tsx
import { z } from 'zod';
import { zodValidator } from '@tanstack/zod-form-adapter';

const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code')
});

const userSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  address: addressSchema
});

const form = useAppForm({
  defaultValues: {...},
  validatorAdapter: zodValidator,
  validator: userSchema
});
```

## Best Practices

1. **Break down by logical sections**: Divide complex forms into logical sections that can be managed independently.

2. **Reuse form sections**: Create reusable form sections for common patterns like address input, personal information, etc.

3. **Clear naming conventions**: Use consistent naming for form fields to make validation and error handling easier.

4. **Default values**: Always provide default values for all fields, even if just empty strings, to ensure controlled components.

5. **Schema validation**: Use Zod for complex forms to ensure type safety and consistent validation.

6. **Error handling**: Implement consistent error display across all form sections.

7. **Performance optimization**: Use form.watch() sparingly, prefer subscriptions for better performance.

8. **Testing**: Test individual form sections and their integration.

9. **Accessibility**: Ensure all form components maintain proper accessibility, including error states.

10. **Documentation**: Document the intended structure and validation requirements of complex forms.

## Example: Complete Multi-Section Form

Here's a complete example that combines all the patterns:

```tsx
import React from 'react';
import { useAppForm, withForm } from '../hooks/form';
import { Button } from 'baseui/button';
import { Card, StyledBody, StyledAction } from 'baseui/card';
import { HeadingSmall } from 'baseui/typography';
import { Notification } from 'baseui/notification';
import { z } from 'zod';
import { zodValidator } from '@tanstack/zod-form-adapter';

// Schemas
const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address')
});

const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'Valid state is required'),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code')
});

const userProfileSchema = z.object({
  personalInfo: personalInfoSchema,
  shippingAddress: addressSchema,
  billingAddress: addressSchema,
  useSameAddress: z.boolean()
});

// Personal Info Form
const PersonalInfoForm = withForm({
  props: { title: 'Personal Information' },
  render: ({ form, title }) => (
    <Card>
      <StyledBody>
        <HeadingSmall>{title}</HeadingSmall>
        <form.AppField name="firstName">
          {(field) => <field.Input label="First Name" />}
        </form.AppField>
        <form.AppField name="lastName">
          {(field) => <field.Input label="Last Name" />}
        </form.AppField>
        <form.AppField name="email">
          {(field) => <field.Input label="Email" />}
        </form.AppField>
      </StyledBody>
    </Card>
  )
});

// Address Form
const AddressForm = withForm({
  props: { title: 'Address' },
  render: ({ form, title }) => (
    <Card>
      <StyledBody>
        <HeadingSmall>{title}</HeadingSmall>
        <form.AppField name="street">
          {(field) => <field.Input label="Street Address" />}
        </form.AppField>
        <form.AppField name="city">
          {(field) => <field.Input label="City" />}
        </form.AppField>
        <form.AppField name="state">
          {(field) => <field.Input label="State" />}
        </form.AppField>
        <form.AppField name="zip">
          {(field) => <field.Input label="ZIP Code" />}
        </form.AppField>
      </StyledBody>
    </Card>
  )
});

// Main Form
function UserProfileForm() {
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [formData, setFormData] = React.useState(null);
  
  const form = useAppForm({
    defaultValues: {
      personalInfo: {
        firstName: '',
        lastName: '',
        email: ''
      },
      shippingAddress: {
        street: '',
        city: '',
        state: '',
        zip: ''
      },
      billingAddress: {
        street: '',
        city: '',
        state: '',
        zip: ''
      },
      useSameAddress: false
    },
    validatorAdapter: zodValidator,
    validator: userProfileSchema,
    onSubmit: (values) => {
      setFormData(values);
      setIsSubmitted(true);
    }
  });
  
  // Watch the useSameAddress value to update billing address
  const useSameAddress = form.watch('useSameAddress');
  
  React.useEffect(() => {
    if (useSameAddress) {
      const shippingAddress = form.getValues('shippingAddress');
      form.setValue('billingAddress', shippingAddress);
    }
  }, [useSameAddress, form]);
  
  return (
    <div>
      <form onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}>
        <form.AppField name="personalInfo">
          {(field) => (
            <PersonalInfoForm
              form={field.form}
              title="User Information"
            />
          )}
        </form.AppField>
        
        <form.AppField name="shippingAddress">
          {(field) => (
            <AddressForm
              form={field.form}
              title="Shipping Address"
            />
          )}
        </form.AppField>
        
        <form.AppField name="useSameAddress">
          {(field) => (
            <field.Checkbox
              label="Use same address for billing"
            />
          )}
        </form.AppField>
        
        {!useSameAddress && (
          <form.AppField name="billingAddress">
            {(field) => (
              <AddressForm
                form={field.form}
                title="Billing Address"
              />
            )}
          </form.AppField>
        )}
        
        <div style={{ marginTop: '20px' }}>
          <Button type="submit">Submit Profile</Button>
        </div>
      </form>
      
      {isSubmitted && formData && (
        <Notification kind="positive">
          Form submitted successfully! 
        </Notification>
      )}
      
      {isSubmitted && formData && (
        <div style={{ marginTop: '20px' }}>
          <h3>Submitted Data:</h3>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default UserProfileForm;
```

This guide covers the fundamental patterns for form composition with BaseUI TanStack Form. By leveraging these patterns, you can build complex forms that are modular, reusable, and maintainable.