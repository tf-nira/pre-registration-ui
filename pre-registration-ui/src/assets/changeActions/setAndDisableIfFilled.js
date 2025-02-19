const setAndDisableIfFilled = async (context, args, uiField) => {
  console.log("setAndDisable called");
  if (args.length > 0) {
    let checkboxVal = context.userForm.controls[`${uiField.id}`].value;
    for (const arg of args) {
      let controlsArr = arg.split("=");
      if (controlsArr.length > 1) {
        let control = controlsArr[0]; // The field to set and disable
        let valueToSet = controlsArr[1]; // The value to set

        let filteredList = context.uiFields.filter(
          (field) => field.id == control
        );

        if (filteredList.length > 0) {
          let targetField = filteredList[0];

          // Check if the target field is multilingual
          if (context.isControlInMultiLang(targetField)) {
            context.dataCaptureLanguages.forEach((language) => {
              const fieldId = targetField.id + "_" + language;
              if (context.userForm.controls[fieldId]) {
                if (checkboxVal === true){
                  context.userForm.controls[fieldId].setValue(valueToSet);
                  context.userForm.controls[fieldId].disable();
                }
                else{
                  context.userForm.controls[fieldId].reset();
                  context.userForm.controls[fieldId].enable();
                }
              }
            });
          } else {
            // If the target field is not multilingual
            if (context.userForm.controls[targetField.id]) {
              if (checkboxVal === true){
              let controlTypeField = String(targetField.controlType);
               if (controlTypeField === "button") {
                   console.log("hiyes");
                   const control = context.userForm.get(targetField.id);
                   let valueToSetin = Boolean(!valueToSet);
                   control.setValue(valueToSetin);
                  // if (window.onChangeHandler) {
                  //   window.onChangeHandler(targetField.id);
                  // } else {
                  //   console.error("onChangeHandler not found on window!");
                  // }
                  control.disable();
                  control.reset();
               }
               else{
                context.userForm.controls[targetField.id].setValue(valueToSet);
                context.userForm.controls[targetField.id].disable();
               }          
              }
              else{
                context.userForm.controls[targetField.id].reset();
                context.userForm.controls[targetField.id].enable();
              }
            }
          }
        }
      } else {
        console.log("Invalid argument format in 'setAndDisable' changeAction.");
      }
    }
  } else {
    console.log("Invalid number of arguments sent to 'setAndDisable'.");
  }
};

export default setAndDisableIfFilled;
