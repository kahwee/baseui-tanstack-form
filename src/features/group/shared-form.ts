import { formOptions } from '@tanstack/react-form'
import type { Group } from './group-schema'

export const formOpts = formOptions({
  defaultValues: {
    name: 'John Group',
    people: [],
    isActive: true,
    albums: [],
    awards: [],
  } as Group,
})
