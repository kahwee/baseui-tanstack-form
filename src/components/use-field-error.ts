export type FieldError = {
  hasError: boolean;
  errorMessage: string | null;
};

export interface FormErrors {
  form?: {
    errors?: Array<Record<string, { _errors?: string[] }>>;
    errorMap?: Record<string, Record<string, { _errors?: string[] }>>;
  };
  fields?: Record<string, unknown>;
}

// Define an interface for error objects
interface ErrorObject {
  _errors?: string[];
  [key: string]: unknown;
}

/**
 * Parses a nested field path like "people[0].firstName" into segments
 * Returns an object with segments and array matches
 */
function parseFieldPath(path: string): { segments: string[]; arrayMatches: Array<{key: string; index: number}> } {
  const segments = [];
  const arrayMatches = [];
  
  // Match patterns like 'people[0]' or just 'name'
  const regex = /([^[\].]+)(?:\[(\d+)\])?\.?/g;
  let match;
  
  while ((match = regex.exec(path)) !== null) {
    const [, key, indexStr] = match;
    segments.push(key);
    
    if (indexStr !== undefined) {
      arrayMatches.push({
        key,
        index: parseInt(indexStr, 10)
      });
      
      // Also add the index as a segment
      segments.push(indexStr);
    }
  }
  
  return { segments, arrayMatches };
}

/**
 * Utility function to get the first error for a field, checking both field and form-level errors
 * Now supports nested fields like "people[0].firstName"
 */
export function useFieldError(field: {
  getMeta: () => { errors?: string[] };
  form: { getAllErrors: () => FormErrors };
  name: string;
}): FieldError {
  const meta = field.getMeta();
  const formErrors = field.form.getAllErrors();
  
  // Check for field-level errors first
  let hasError = Boolean(meta?.errors?.length);
  let errorMessage = hasError && meta?.errors?.[0] ? meta.errors[0] : null;
  
  // If no field-level errors, check form-level errors for this field name
  if (!errorMessage && formErrors?.form?.errors && formErrors.form.errors.length > 0) {
    // First try direct match with the full field name
    for (const errorGroup of formErrors.form.errors) {
      if (errorGroup && field.name in errorGroup) {
        const fieldErrors = errorGroup[field.name]?._errors;
        if (fieldErrors && fieldErrors.length > 0) {
          hasError = true;
          errorMessage = fieldErrors[0];
          break;
        }
      }
    }
    
    // If still no error found, try parsing the field path for nested fields
    if (!errorMessage) {
      const { segments, arrayMatches } = parseFieldPath(field.name);
      
      // If we have array matches, try to find errors in the nested structure
      if (arrayMatches.length > 0) {
        // Convert array notation to dot notation (people[0].firstName -> people.0.firstName)
        const dotNotation = field.name.replace(/\[(\d+)\]/g, '.$1');
        
        for (const errorGroup of formErrors.form.errors) {
          if (!errorGroup) continue;
          
          // 1. Check for direct match with dot notation
          if (dotNotation in errorGroup) {
            const errorObj = errorGroup[dotNotation];
            if (errorObj && 
                typeof errorObj === 'object' && 
                errorObj !== null && 
                '_errors' in errorObj && 
                Array.isArray((errorObj as ErrorObject)._errors) && 
                (errorObj as ErrorObject)._errors!.length > 0) {
              hasError = true;
              errorMessage = (errorObj as ErrorObject)._errors![0];
              break;
            }
          }
          
          // 2. Recursively check through the nested structure
          const checkNestedErrors = (obj: Record<string, unknown>, path: string[]): string | null => {
            if (!obj || path.length === 0) return null;
            
            const key = path[0];
            const remaining = path.slice(1);
            const currentValue = obj[key];
            
            // Check if we're at leaf node with errors
            if (path.length === 1 && 
                currentValue && 
                typeof currentValue === 'object' && 
                currentValue !== null) {
              const errorObj = currentValue as ErrorObject;
              if (errorObj._errors && errorObj._errors.length > 0) {
                return errorObj._errors[0];
              }
            }
            
            // Navigate deeper if possible
            if (currentValue && 
                typeof currentValue === 'object' && 
                currentValue !== null && 
                remaining.length > 0) {
              return checkNestedErrors(currentValue as Record<string, unknown>, remaining);
            }
            
            return null;
          };
          
          // Try different possible path formats
          const pathsToTry = [
            // Format like "people.0.firstName" as an array of segments
            dotNotation.split('.'),
            // The original path segments
            segments
          ];
          
          // For each possible path format
          for (const path of pathsToTry) {
            const error = checkNestedErrors(errorGroup, path);
            
            if (error) {
              hasError = true;
              errorMessage = error;
              break;
            }
          }
          
          if (errorMessage) break;
          
          // 3. Also check for fully nested structure: { people: { '0': { firstName: { _errors: [...] } } } }
          const traverseNestedFields = (obj: Record<string, unknown>, pathParts: string[], index: number): string | null => {
            if (index >= pathParts.length) return null;
            
            const part = pathParts[index];
            
            if (!(part in obj)) return null;
            
            const value = obj[part] as Record<string, unknown>;
            
            // If this is the last part, check for _errors
            if (index === pathParts.length - 1) {
              if (value._errors && Array.isArray(value._errors) && value._errors.length > 0) {
                return value._errors[0] as string;
              }
              return null;
            }
            
            // Otherwise, continue traversing
            if (value && typeof value === 'object' && value !== null) {
              return traverseNestedFields(value as Record<string, unknown>, pathParts, index + 1);
            }
            
            return null;
          };
          
          // Try fully nested path format
          if (arrayMatches.length > 0) {
            let currentPath: string[] = [];
            let lastWasArrayElement = false;
            
            // Build a path for the fully nested structure
            segments.forEach(segment => {
              if (lastWasArrayElement) {
                // After an array index, we need to check if next segment is a property
                currentPath.push(segment);
                lastWasArrayElement = false;
              } else if (/^\d+$/.test(segment)) {
                // This is an array index
                lastWasArrayElement = true;
                currentPath.push(segment);
              } else {
                // This is a regular property
                currentPath.push(segment);
              }
            });
            
            const error = traverseNestedFields(errorGroup, currentPath, 0);
            if (error) {
              hasError = true;
              errorMessage = error;
              break;
            }
          }
        }
      }
    }
  }
  
  return { hasError, errorMessage };
}