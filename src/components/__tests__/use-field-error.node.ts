import { renderHook } from '@testing-library/react';
import { useFieldError } from '../use-field-error';
import { createFormHookContexts } from '@tanstack/react-form';

// Create a type for test field errors that can handle all our test cases
interface TestField {
  name: string;
  getMeta: () => { errors?: string[] };
  form: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getAllErrors: () => any
  };
}

describe('useFieldError', () => {
  // Parameterized test for field errors
  describe('Error detection and reporting', () => {
    // Test cases for different error scenarios
    const testCases = [
      {
        name: 'no errors',
        field: {
          name: 'firstName',
          fieldErrors: [],
          formErrors: []
        },
        expected: { hasError: false, errorMessage: null }
      },
      {
        name: 'field-level errors',
        field: {
          name: 'firstName',
          fieldErrors: ['Field is required'],
          formErrors: []
        },
        expected: { hasError: true, errorMessage: 'Field is required' }
      },
      {
        name: 'form-level errors for simple fields',
        field: {
          name: 'firstName',
          fieldErrors: [],
          formErrors: [{ firstName: { _errors: ['First name is required'] } }]
        },
        expected: { hasError: true, errorMessage: 'First name is required' }
      },
      {
        name: 'array fields with direct path notation',
        field: {
          name: 'people[0].firstName',
          fieldErrors: [],
          formErrors: [{ 'people[0].firstName': { _errors: ['First name is required'] } }]
        },
        expected: { hasError: true, errorMessage: 'First name is required' }
      },
      {
        name: 'array fields with dot notation',
        field: {
          name: 'people[0].firstName',
          fieldErrors: [],
          formErrors: [{ 'people.0.firstName': { _errors: ['First name is required'] } }]
        },
        expected: { hasError: true, errorMessage: 'First name is required' }
      },
      {
        name: 'array fields with nested structure',
        field: {
          name: 'people[0].firstName',
          fieldErrors: [],
          formErrors: [{
            people: {
              '0': {
                firstName: { _errors: ['First name is required'] }
              }
            }
          }]
        },
        expected: { hasError: true, errorMessage: 'First name is required' }
      },
      {
        name: 'priority of field-level over form-level errors',
        field: {
          name: 'firstName',
          fieldErrors: ['Field-level error'],
          formErrors: [{ firstName: { _errors: ['Form-level error'] } }]
        },
        expected: { hasError: true, errorMessage: 'Field-level error' }
      }
    ];

    // Run all the test cases
    test.each(testCases)('should handle $name correctly', ({ field, expected }) => {
      const testField: TestField = {
        name: field.name,
        getMeta: () => ({ errors: field.fieldErrors }),
        form: {
          getAllErrors: () => ({
            form: {
              errors: field.formErrors
            }
          })
        }
      };

      const { result } = renderHook(() => useFieldError(testField));

      expect(result.current.hasError).toBe(expected.hasError);
      expect(result.current.errorMessage).toBe(expected.errorMessage);
    });
  });

  // Test a complex deeply nested structure separately
  it('should handle complex deeply nested structures', () => {
    const field: TestField = {
      name: 'org.departments[0].teams[1].members[2].profile.contact',
      getMeta: () => ({ errors: [] }),
      form: {
        getAllErrors: () => ({
          form: {
            errors: [{
              org: {
                departments: {
                  '0': {
                    teams: {
                      '1': {
                        members: {
                          '2': {
                            profile: {
                              contact: { _errors: ['Contact information is incomplete'] }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }]
          }
        })
      }
    };

    const { result } = renderHook(() => useFieldError(field));
    
    expect(result.current.hasError).toBe(true);
    expect(result.current.errorMessage).toBe('Contact information is incomplete');
  });

  // Group edge cases together with parameterized tests
  describe('Edge cases', () => {
    const edgeCases = [
      {
        name: 'undefined form errors',
        field: {
          name: 'firstName',
          getMeta: () => ({ errors: [] }),
          form: {
            getAllErrors: () => ({})
          }
        }
      },
      {
        name: 'empty errors array',
        field: {
          name: 'firstName',
          getMeta: () => ({ errors: [] }),
          form: {
            getAllErrors: () => ({
              form: { errors: [] }
            })
          }
        }
      },
      {
        name: 'null values in nested structures',
        field: {
          name: 'people[0].firstName',
          getMeta: () => ({ errors: [] }),
          form: {
            getAllErrors: () => ({
              form: {
                errors: [{
                  people: {
                    '0': null
                  }
                }]
              }
            })
          }
        }
      },
      {
        name: 'errors without _errors property',
        field: {
          name: 'firstName',
          getMeta: () => ({ errors: [] }),
          form: {
            getAllErrors: () => ({
              form: {
                errors: [{
                  firstName: { message: 'Invalid name' } // Not using _errors property
                }]
              }
            })
          }
        }
      },
      {
        name: 'path traversal edge cases',
        field: {
          name: 'data[0].items[1].values',
          getMeta: () => ({ errors: [] }),
          form: {
            getAllErrors: () => ({
              form: {
                errors: [{
                  data: {
                    '0': {
                      items: {
                        '1': 'string value instead of object'
                      }
                    }
                  }
                }]
              }
            })
          }
        }
      }
    ];

    // Run all edge cases, they should all return no error
    test.each(edgeCases)('should handle $name', ({ field }) => {
      const { result } = renderHook(() => useFieldError(field));
      
      expect(result.current.hasError).toBe(false);
      expect(result.current.errorMessage).toBeNull();
    });
  });

  // Testing with TanStack Form
  it('should work with TanStack form contexts', () => {
    // Create TanStack Form contexts for the test
    createFormHookContexts();
    
    const field: TestField = {
      name: 'people[0].firstName',
      getMeta: () => ({ errors: [] }),
      form: {
        getAllErrors: () => ({
          form: { 
            errors: [{
              'people[0].firstName': { _errors: ['First name is required'] }
            }]
          }
        })
      }
    };

    const { result } = renderHook(() => useFieldError(field));
    
    expect(result.current.hasError).toBe(true);
    expect(result.current.errorMessage).toBe('First name is required');
  });
});