import { useState } from 'react';

import { validators as validatorFunction } from './validators';
import type {
  FormInputErrors,
  FormInputMiddlewares,
  FormInputsRecord,
  FormInputValidatorResult,
  FormInputValidators,
  FormInputValues,
  UseForm,
} from './types';

function useForm<
  T extends FormInputsRecord,
  U extends FormInputValidators<T>,
  D extends FormInputMiddlewares<T>,
>({
  initialValues,
  validate,
  middleware,
  allowValueTransform = true,
}: {
  initialValues: T;
  validate: U;
  middleware?: D;
  allowValueTransform?: boolean;
}): UseForm<T> {
  const [formInputValues, setFormInputValues] = useState<FormInputValues<T>>(initialValues);
  const [formInputErrors, setFormInputErrors] = useState<
    Partial<FormInputErrors<T>>
  >({});
  const [formSubmissionErrors, setFormSubmissionErrors] = useState<string[]>(
    [],
  );

  function reset() {
    setFormInputValues(initialValues);
    setFormInputErrors({});
    setFormSubmissionErrors([]);
  }

  function getNormalizedValidationResult(
    inputName: string,
    validationResult: FormInputValidatorResult,
  ) {
    if (typeof validationResult === 'string') {
      return validationResult;
    }

    return `Invalid ${inputName}`;
  }

  function getAllInputErrors() {
    const newFormInputErrors: Partial<FormInputErrors<T>> = {};

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < Object.entries(formInputValues).length; i++) {
      const [inputName, inputValue] = Object.entries(formInputValues)[i];
      const validationResult = validate[inputName](inputValue, formInputValues);

      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- test
      if (validationResult) {
        newFormInputErrors[inputName as keyof T] = getNormalizedValidationResult(
          inputName,
          validationResult,
        );
      }
    }

    return newFormInputErrors as FormInputErrors<T>;
  }
  function validateForm() {
    setFormInputErrors({});
    setFormSubmissionErrors([]);
    const newFormInputErrors: Partial<FormInputErrors<T>> = getAllInputErrors();

    if (Object.keys(newFormInputErrors).length > 0) {
      setFormInputErrors(newFormInputErrors);
      return false;
    }

    return true;
  }

  const onChange = (formInputName: keyof T) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormInputValues((prev) => ({
      ...prev,
      [formInputName]:
          middleware?.[formInputName] !== undefined
            ? middleware?.[formInputName]?.(event, prev, setFormInputValues)
            : event.target.value,
    }));
    setFormInputErrors((prev) => ({
      ...prev,
      [formInputName]: undefined,
    }));
    setFormSubmissionErrors([]);
  };

  return {
    values: formInputValues,
    submissionErrors: formSubmissionErrors,
    reset,
    onSubmit: (formSubmitHandler) => (event) => {
      event.preventDefault();
      const isValid = validateForm();
      if (isValid) {
        formSubmitHandler(formInputValues);
      }
    },
    submit: (formSubmitHandler) => {
      const isValid = validateForm();
      if (isValid) {
        formSubmitHandler(formInputValues);
      }
    },
    getInputProps: (formInputName) => ({
      value: (allowValueTransform
        ? String(formInputValues[formInputName])
        : formInputValues[formInputName]) as string,
      onChange: onChange(formInputName),
      error: formInputErrors[formInputName],
    }),
    getCheckboxProps: (formInputName) => ({
      value: (allowValueTransform
        ? Boolean(formInputValues[formInputName])
        : formInputValues[formInputName]) as boolean,
      onChange: (_e, value) => {
        setFormInputValues((prev) => ({
          ...prev,
          [formInputName]: value,
        }));
        setFormInputErrors((prev) => ({
          ...prev,
          [formInputName]: undefined,
        }));
        setFormSubmissionErrors([]);
      },
      error: formInputErrors[formInputName],
    }),
    getNumberInputProps: (formInputName) => ({
      value: (allowValueTransform
        ? Number(formInputValues[formInputName])
        : formInputValues[formInputName]) as number,
      onChange: onChange(formInputName),
      error: formInputErrors[formInputName],
    }),
    getInputErrors: (formInputName) => formInputErrors[formInputName],
    getAllInputErrors,
    setFormInputErrors: (prev) => {
      const normalizedFormInputErrors: Partial<FormInputErrors<T>> = {};

      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < Object.entries(prev).length; i++) {
        const [inputName, validationResult] = Object.entries(prev)[i];
        normalizedFormInputErrors[inputName as keyof T] = getNormalizedValidationResult(
          inputName,
          validationResult,
        );
      }

      setFormInputErrors(normalizedFormInputErrors);
    },
    setFormSubmissionError: (e: string) => setFormSubmissionErrors((prev) => [...prev, e]),
    setFormSubmissionErrors: (e: string[]) => setFormSubmissionErrors((prev) => [...prev, ...e]),
    setFormData: (formData: Partial<FormInputValues<T>>) => {
      setFormInputValues((prev) => ({
        ...prev,
        ...formData,
      }));
    },
    validate: validateForm,
  };
}
useForm.validators = validatorFunction;
export default useForm;
