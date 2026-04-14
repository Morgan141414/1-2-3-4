import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function nonEmptyObjectValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value == null || typeof value !== 'object') {
      return { nonEmptyObject: true };
    }

    return Object.keys(value).length > 0
      ? null
      : { nonEmptyObject: true };
  };
}
