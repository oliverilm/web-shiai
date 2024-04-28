/* eslint-disable consistent-return */
import type {
  FormInputAllowedValueType,
  FormInputValidatorResult,
} from './types';

const REQUIRED = 'Value is required';
export const validators = {
  skip: (): FormInputValidatorResult => undefined,
  required: (value: FormInputAllowedValueType): FormInputValidatorResult => {
    if (value === undefined || value === null) {
      return REQUIRED;
    }
    return undefined;
  },

  validYear: (value: FormInputAllowedValueType): FormInputValidatorResult => {
    if (value === undefined || value === null) {
      return REQUIRED;
    }

    const year = Number(value);
    const currentYear = new Date().getFullYear();
    if (currentYear - 100 < year && year < currentYear) return undefined;

    return 'Invalid year';
  },

  greater:
      (than: number, customError?: string) => (value: FormInputAllowedValueType) => {
        if (typeof value !== 'number') return 'Please provide a number';
        if (than >= value) return customError ?? `Value must be greater than ${than}`;
      },
  password: (value: FormInputAllowedValueType): FormInputValidatorResult => {
    const MIN = 6;
    if (String(value).length < MIN) {
      return 'Password must be at least 6 characters long.';
    }
  },
  email: (value: FormInputAllowedValueType): FormInputValidatorResult => {
    const emailPattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    if (!String(value).match(emailPattern)) {
      return 'Not a valid email address.';
    }
  },
};
