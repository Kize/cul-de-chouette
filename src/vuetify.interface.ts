export interface VForm extends HTMLFormElement {
  validate(): boolean;

  reset(): void;

  resetValidation(): void;
}

export type SelectItemsType = SelectItemValue | SelectItemHeader;

interface SelectItemValue {
  text: string;
  value: string | number;
  disabled: boolean;
}

interface SelectItemHeader {
  header?: string;
  divider?: boolean;
}
