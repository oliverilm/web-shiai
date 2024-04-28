/* eslint-disable no-use-before-define */
import type { SetStateAction } from 'react';

export type FormInputAllowedValueType = string | number | boolean;

export type FormInputValidatorResult = string | undefined;
export type FormMiddlewareInputType = React.ChangeEvent<HTMLInputElement>;

export type FormInputMiddleware<
  T extends FormMiddlewareInputType,
  F extends FormInputValues<F>,
  X extends React.Dispatch<SetStateAction<F>>,
> = (formInputValue: T, formValues: F, setState: X) => FormInputValidatorResult;

export type FormInputValidator<
  T extends FormInputAllowedValueType,
  F extends FormInputValues<F>,
> = (formInputValue: T, formValues: F) => FormInputValidatorResult;

export type FormInputMiddlewares<T extends FormInputValues<T>> = {
  [K in keyof Partial<T>]: FormInputMiddleware<
    React.ChangeEvent<HTMLInputElement>,
    FormInputValues<T>,
    React.Dispatch<SetStateAction<T>>
  >;
};
export type FormInputValidators<T extends FormInputValues<T>> = {
  [K in keyof T]: FormInputValidator<T[K], FormInputValues<T>>;
};

export type FormInputsRecord = Record<string, FormInputAllowedValueType>;

export type FormInputValues<T extends FormInputsRecord> = {
  [K in keyof T]: T[K];
};
export type FormInputErrors<T extends FormInputsRecord> = {
  [K in keyof T]: string | undefined;
};
export type UseForm<T extends FormInputsRecord> = {
  values: FormInputValues<T>;
  submissionErrors: string[];
  reset: () => void;
  onSubmit: (
    formSubmitHandler: (formInputValues: FormInputValues<T>) => void,
  ) => (event: React.FormEvent<HTMLFormElement>) => void;
  submit: (
    formSubmitHandler: (formInputValues: FormInputValues<T>) => void,
  ) => void;
  getInputProps: <K extends keyof T>(
    formInputName: K,
  ) => {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    error: FormInputErrors<T>[K];
  };
  getCheckboxProps: <K extends keyof T>(
    formInputName: K,
  ) => {
    value: boolean;
    onChange: (e: React.ChangeEvent<unknown>, value: boolean) => void;
    error: FormInputErrors<T>[K];
  };
  getNumberInputProps: <K extends keyof T>(
    formInputName: K,
  ) => {
    value: number;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    error: FormInputErrors<T>[K];
  };
  getInputErrors: (formInputName: keyof T) => string | undefined;
  getAllInputErrors: () => FormInputErrors<T>;
  setFormInputErrors: <X extends FormInputsRecord>(formInputErrors: {
    [K in keyof X]: FormInputValidatorResult;
  }) => void;
  setFormSubmissionError: (errorMessage: string) => void;
  setFormSubmissionErrors: (errorMessages: string[]) => void;
  setFormData: (formData: Partial<FormInputValues<T>>) => void;
  validate: () => boolean;
};
