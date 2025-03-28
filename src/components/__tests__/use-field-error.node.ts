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

// For intentionally invalid fields in tests
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyObject = Record<string, any>;

// Use any type for test injections with intentional bad inputs
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TestFieldInput = any;

describe('useFieldError', () => {
  // Test for invalid field inputs
  describe('Input validation and error handling', () => {
    it('should safely handle undefined field', () => {
      const { result } = renderHook(() => {
        return useFieldError(undefined as TestFieldInput);
      });
      expect(result.current.hasError).toBe(false);
      expect(result.current.errorMessage).toBeNull();
    });

    it('should safely handle null field', () => {
      const { result } = renderHook(() => {
        return useFieldError(null as TestFieldInput);
      });
      expect(result.current.hasError).toBe(false);
      expect(result.current.errorMessage).toBeNull();
    });

    it('should handle field with missing getMeta function', () => {
      const invalidField: AnyObject = {
        name: 'test',
        getMeta: undefined,
        form: {
          getAllErrors: () => ({})
        }
      };
      const { result } = renderHook(() => {
        return useFieldError(invalidField as TestFieldInput);
      });
      expect(result.current.hasError).toBe(false);
      expect(result.current.errorMessage).toBeNull();
    });

    it('should handle field with missing form.getAllErrors function', () => {
      const invalidField: AnyObject = {
        name: 'test',
        getMeta: () => ({}),
        form: {
          getAllErrors: undefined
        }
      };
      const { result } = renderHook(() => {
        return useFieldError(invalidField as TestFieldInput);
      });
      expect(result.current.hasError).toBe(false);
      expect(result.current.errorMessage).toBeNull();
    });

    it('should handle error thrown in getAllErrors', () => {
      const errorField: AnyObject = {
        name: 'test',
        getMeta: () => ({}),
        form: {
          getAllErrors: () => {
            throw new Error('Test error');
          }
        }
      };
      const { result } = renderHook(() => useFieldError(errorField as TestField));
      expect(result.current.hasError).toBe(false);
      expect(result.current.errorMessage).toBeNull();
    });

    it('should handle field with non-string name', () => {
      const invalidField: AnyObject = {
        name: 123,
        getMeta: () => ({}),
        form: {
          getAllErrors: () => ({
            form: { errors: [{ '123': { _errors: ['This should not be found'] } }] }
          })
        }
      };
      const { result } = renderHook(() => {
        return useFieldError(invalidField as TestFieldInput);
      });
      expect(result.current.hasError).toBe(false);
      expect(result.current.errorMessage).toBeNull();
    });
  });

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
        name: 'array fields with numeric strings in path',
        field: {
          name: 'users[2].profile.addresses[0].street',
          fieldErrors: [],
          formErrors: [{
            users: {
              '2': {
                profile: {
                  addresses: {
                    '0': {
                      street: { _errors: ['Street is required'] }
                    }
                  }
                }
              }
            }
          }]
        },
        expected: { hasError: true, errorMessage: 'Street is required' }
      },
      {
        name: 'priority of field-level over form-level errors',
        field: {
          name: 'firstName',
          fieldErrors: ['Field-level error'],
          formErrors: [{ firstName: { _errors: ['Form-level error'] } }]
        },
        expected: { hasError: true, errorMessage: 'Field-level error' }
      },
      {
        name: 'multiple errors in _errors array (first should be used)',
        field: {
          name: 'username',
          fieldErrors: [],
          formErrors: [{ username: { _errors: ['Username is required', 'Username must be unique'] } }]
        },
        expected: { hasError: true, errorMessage: 'Username is required' }
      }
    ];

    // Run all the test cases using forEach instead of test.each
    testCases.forEach(({ name, field, expected }) => {
      it(`should handle ${name} correctly`, () => {
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
  });

  // Test complex nested structures
  describe('Complex nested error structures', () => {
    it('should handle deeply nested structures', () => {
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

    it('should handle deep dot notation paths', () => {
      const field: TestField = {
        name: 'org.departments[0].teams[1].members[2].profile.contact',
        getMeta: () => ({ errors: [] }),
        form: {
          getAllErrors: () => ({
            form: {
              errors: [{
                'org.departments.0.teams.1.members.2.profile.contact': { 
                  _errors: ['Contact information is incomplete'] 
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

    it('should handle mixed notation in nested paths', () => {
      const field: TestField = {
        name: 'users[0].addresses[1].city',
        getMeta: () => ({ errors: [] }),
        form: {
          getAllErrors: () => ({
            form: {
              errors: [{
                users: {
                  '0': {
                    'addresses.1.city': { _errors: ['City is required'] }
                  }
                }
              }]
            }
          })
        }
      };

      const { result } = renderHook(() => useFieldError(field));
      
      // This mixed notation is challenging and might not be found
      // Testing the robustness of the algorithm
      expect(result.current.hasError).toBe(false);
      expect(result.current.errorMessage).toBeNull();
    });
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
      },
      {
        name: 'non-array _errors property',
        field: {
          name: 'username',
          getMeta: () => ({ errors: [] }),
          form: {
            getAllErrors: () => ({
              form: {
                errors: [{
                  username: { 
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    _errors: 'Not an array' as any // intentionally using string instead of array
                  }
                }]
              }
            })
          }
        }
      },
      {
        name: 'empty _errors array',
        field: {
          name: 'username',
          getMeta: () => ({ errors: [] }),
          form: {
            getAllErrors: () => ({
              form: {
                errors: [{
                  username: { _errors: [] }
                }]
              }
            })
          }
        }
      },
      {
        name: 'non-form errors structure',
        field: {
          name: 'firstName',
          getMeta: () => ({ errors: [] }),
          form: {
            getAllErrors: () => ({
              // Missing 'form' property
              someOtherProperty: { errors: [] }
            })
          }
        }
      },
      {
        name: 'null errorGroup in errors array',
        field: {
          name: 'firstName',
          getMeta: () => ({ errors: [] }),
          form: {
            getAllErrors: () => ({
              form: {
                errors: [null]
              }
            })
          }
        }
      }
    ];

    // Run all edge cases with forEach, they should all return no error
    edgeCases.forEach(({ name, field }) => {
      it(`should handle ${name}`, () => {
        const { result } = renderHook(() => useFieldError(field));
        
        expect(result.current.hasError).toBe(false);
        expect(result.current.errorMessage).toBeNull();
      });
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

  describe('Error mapping traversal', () => {
    it('should handle errorMap format', () => {
      const field: TestField = {
        name: 'username',
        getMeta: () => ({ errors: [] }),
        form: {
          getAllErrors: () => ({
            form: { 
              errorMap: {
                username: {
                  required: { _errors: ['Username is required'] }
                }
              }
            }
          })
        }
      };

      const { result } = renderHook(() => useFieldError(field));
      
      // The current implementation doesn't check errorMap, but would
      // be a good extension to support this format from Zod
      expect(result.current.hasError).toBe(false);
      expect(result.current.errorMessage).toBeNull();
    });
  });
  
  // Additional tests to improve coverage
  describe('Additional edge cases for improved coverage', () => {
    it('should handle array fields with non-numeric index', () => {
      // This tests lines in parseFieldPath where the index is non-numeric
      const field: TestField = {
        name: 'people[abc].firstName', // intentionally invalid array index
        getMeta: () => ({ errors: [] }),
        form: {
          getAllErrors: () => ({
            form: { errors: [] }
          })
        }
      };

      const { result } = renderHook(() => useFieldError(field));
      expect(result.current.hasError).toBe(false);
      expect(result.current.errorMessage).toBeNull();
    });
    
    it('should handle partial errors in nested structures', () => {
      // This covers the case where errors are found in the deep nested structure
      const field: TestField = {
        name: 'users[0].profile.address.street',
        getMeta: () => ({ errors: [] }),
        form: {
          getAllErrors: () => ({
            form: {
              errors: [{
                users: {
                  '0': {
                    profile: {
                      address: { // There's no street property, but the parent exists
                        // Intentionally missing street
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
      expect(result.current.hasError).toBe(false);
      expect(result.current.errorMessage).toBeNull();
    });
    
    it('should handle various object types in traversal', () => {
      // This addresses lines 188-196 where object traversal happens
      const field: TestField = {
        name: 'data.items[0].value',
        getMeta: () => ({ errors: [] }),
        form: {
          getAllErrors: () => ({
            form: {
              errors: [{
                data: {
                  items: {
                    '0': {
                      value: true // Not an object with _errors, but a different type
                    }
                  }
                }
              }]
            }
          })
        }
      };

      const { result } = renderHook(() => useFieldError(field));
      expect(result.current.hasError).toBe(false);
      expect(result.current.errorMessage).toBeNull();
    });
    
    it('should handle non-object values during traversal', () => {
      // This covers lines 230-232 where a value is not an object
      const field: TestField = {
        name: 'some.deep.field',
        getMeta: () => ({ errors: [] }),
        form: {
          getAllErrors: () => ({
            form: {
              errors: [{
                some: 'string value' // Not an object for traversal
              }]
            }
          })
        }
      };

      const { result } = renderHook(() => useFieldError(field));
      expect(result.current.hasError).toBe(false);
      expect(result.current.errorMessage).toBeNull();
    });
    
    it('should handle nested errors with complex path structure', () => {
      // This specifically targets the branch conditions in traverseNestedFields
      const field: TestField = {
        name: 'data[0].items[2].values[3].text',
        getMeta: () => ({ errors: [] }),
        form: {
          getAllErrors: () => ({
            form: {
              errors: [{
                data: {
                  '0': {
                    items: {
                      '2': {
                        values: {
                          '3': {
                            text: 'Not an object with _errors' // String instead of object with _errors
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
      expect(result.current.hasError).toBe(false);
      expect(result.current.errorMessage).toBeNull();
    });
    
    it('should handle traverseNestedFields with valid path but no _errors', () => {
      // This specifically targets line 194 where _errors is checked
      const field: TestField = {
        name: 'data.inner.value',
        getMeta: () => ({ errors: [] }),
        form: {
          getAllErrors: () => ({
            form: {
              errors: [{
                data: {
                  inner: {
                    value: {} // Object but no _errors property
                  }
                }
              }]
            }
          })
        }
      };

      const { result } = renderHook(() => useFieldError(field));
      expect(result.current.hasError).toBe(false);
      expect(result.current.errorMessage).toBeNull();
    });
    
    it('should find errors using traverseNestedFields', () => {
      // This specifically targets line 194 return and lines 230-232 error setting
      const field: TestField = {
        name: 'invoices[2].items[3].total',
        getMeta: () => ({ errors: [] }),
        form: {
          getAllErrors: () => ({
            form: {
              errors: [{
                // Using array notation pattern with nested fields that should trigger the path
                // traversal and match "invoices.2.items.3.total"
                invoices: {
                  '2': {
                    items: {
                      '3': {
                        total: { _errors: ['Total must be positive'] }
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
      
      // This should match using the traverseNestedFields function
      expect(result.current.hasError).toBe(true);
      expect(result.current.errorMessage).toBe('Total must be positive');
    });
  });
});