declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}

interface VForm extends HTMLFormElement {
  validate(): boolean;
  reset(): void;
  resetValidation(): void;
}
