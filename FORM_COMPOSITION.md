# Compose forms with shared values

Use `withForm` to move a section into its own component while keeping one form
instance, validation state, and submit handler. These examples use the public
package exports and assume the Base Web providers shown in the [README](README.md).

## Reusable sections

Define the value shape once and pass the parent form to each section. Field names
are relative to the whole form; passing a field's `form` does not rebase its names.

```tsx
import { useAppForm, withForm } from 'baseui-tanstack-form';

const defaultValues = {
  name: '',
  address: { city: '', postalCode: '' },
};

const AddressSection = withForm({
  defaultValues,
  props: { title: 'Address' },
  render: ({ form, title }) => (
    <fieldset>
      <legend>{title}</legend>
      <form.AppField name="address.city">
        {(field) => <field.Input label="City" />}
      </form.AppField>
      <form.AppField name="address.postalCode">
        {(field) => <field.Input label="Postal code" />}
      </form.AppField>
    </fieldset>
  ),
});

export function ProfileForm() {
  const form = useAppForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      console.log(value.name, value.address.city);
    },
  });

  return (
    <form onSubmit={(event) => {
      event.preventDefault();
      void form.handleSubmit();
    }}>
      <form.AppField name="name">
        {(field) => <field.Input label="Name" />}
      </form.AppField>
      <AddressSection form={form} title="Delivery address" />
      <form.AppForm>
        <form.SubscribeButton label="Save profile" />
      </form.AppForm>
    </form>
  );
}
```

Set `onSubmit` in `useAppForm` and read its `{ value }` argument. Call
`form.handleSubmit()` from the native submit event. `withForm` supplies typed
props to a section; it does not create another form or a nested HTML `<form>`.

## Conditional fields

Use `form.Subscribe` to rerender a region when a selected value changes. Reading
`form.state.values` alone does not subscribe a component to updates.

```tsx
import { useAppForm } from 'baseui-tanstack-form';

export function DeliveryOptions() {
  const form = useAppForm({
    defaultValues: { needsDelivery: false, instructions: '' },
    onSubmit: async ({ value }) => { console.log(value); },
  });

  return (
    <form onSubmit={(event) => {
      event.preventDefault();
      void form.handleSubmit();
    }}>
      <form.AppField name="needsDelivery">
        {(field) => <field.Checkbox label="Deliver to my address" />}
      </form.AppField>
      <form.Subscribe selector={(state) => state.values.needsDelivery}>
        {(needsDelivery) => needsDelivery ? (
          <form.AppField name="instructions">
            {(field) => <field.Textarea label="Delivery instructions" />}
          </form.AppField>
        ) : null}
      </form.Subscribe>
      <form.AppForm>
        <form.SubscribeButton label="Save options" />
      </form.AppForm>
    </form>
  );
}
```

Hiding a field does not by itself clear its saved value. Decide whether to retain
it or explicitly reset it when the controlling option changes.

## Repeated fields

Use `mode="array"` and the field's array helpers. Give each row a stable key, use
its current index in the field path, and make add/remove buttons `type="button"`.

```tsx
import { useAppForm } from 'baseui-tanstack-form';

type Contact = { id: string; email: string };

export function ContactsForm() {
  const form = useAppForm({
    defaultValues: { contacts: [] as Contact[] },
    onSubmit: async ({ value }) => { console.log(value.contacts); },
  });

  return (
    <form onSubmit={(event) => {
      event.preventDefault();
      void form.handleSubmit();
    }}>
      <form.AppField name="contacts" mode="array">
        {(contacts) => (
          <div>
            {contacts.state.value.map((contact, index) => (
              <div key={contact.id}>
                <form.AppField name={`contacts[${index}].email`}>
                  {(field) => <field.Input label={`Email ${index + 1}`} type="email" />}
                </form.AppField>
                <button type="button" onClick={() => contacts.removeValue(index)}>
                  Remove contact {index + 1}
                </button>
              </div>
            ))}
            <button type="button" onClick={() => contacts.pushValue({
              id: crypto.randomUUID(), email: '',
            })}>
              Add contact
            </button>
          </div>
        )}
      </form.AppField>
      <form.AppForm>
        <form.SubscribeButton label="Save contacts" />
      </form.AppForm>
    </form>
  );
}
```

For validation, attach field validators to `form.AppField`, or form validators to
`useAppForm`. See the [Zod validation stories](src/stories/zod-v4-validation.stories.tsx)
for schema examples and [TESTING.md](TESTING.md) for submission and error checks.
