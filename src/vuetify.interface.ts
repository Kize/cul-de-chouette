export interface VForm extends HTMLFormElement {
  validate(): boolean;

  reset(): void;

  resetValidation(): void;
}
