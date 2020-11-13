export interface VForm extends HTMLFormElement {
  validate(): boolean;

  reset(): void;

  resetValidation(): void;
}

export type SelectItemsType<T> = SelectItemValue<T> | SelectItemHeader;

export interface SelectItemValue<T> {
  text: string;
  value: T;
  disabled: boolean;
}

interface SelectItemHeader {
  header?: string;
  divider?: boolean;
}
