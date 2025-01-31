export let myFlag = false;
export let disabledUiFields: any[] = []; // Global array to store disabled uiFields
export let Service: string = "";
export const setService = (value: string) => {
  Service = value;
};
export const setMyFlag = (value: boolean) => {
  myFlag = value;
};
export const addDisabledUiField = (uiField: any) => {
  disabledUiFields.push(uiField);
};