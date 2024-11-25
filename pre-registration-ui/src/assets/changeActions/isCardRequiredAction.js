const isCardRequiredAction = async (context, args, uiField) => {
  console.log("isCardRequired called");
  const userServiceTypeCopvalue=context.userServiceTypeCop;
  const userServiceTypeCopArrvalue = context.cardRequiredCopServiceType;
  const cardOptionalCopServiceType = context.cardOptionalCopServiceType;
  let isOptional = false; 
    for (let i = 0; i < cardOptionalCopServiceType.length; i++) {
      if (userServiceTypeCopvalue === cardOptionalCopServiceType[i]) {
        isOptional = true;
        break;
      }
    }
    if(!isOptional){
    if (args.length > 0) {
      for (const arg of args) {
        let controlsArr = arg.split("=");
        if (controlsArr.length > 1) {
          let control = controlsArr[0];
          //let valueToSet = controlsArr[1];
          let valueToSet;
          let userServiceTypeCopArr= userServiceTypeCopArrvalue;
          for (let i = 0; i < userServiceTypeCopArr.length; i++) {
            if (userServiceTypeCopvalue === userServiceTypeCopArr[i]) {
              valueToSet = "Y";
              break; 
            }
            else{
              valueToSet = "N";
            }
          }
        
          let filteredList = context.uiFields.filter(
            (field) => field.id == control
          );

          if (filteredList.length > 0) {
            let targetField = filteredList[0];
            if (context.isControlInMultiLang(targetField)) {
              context.dataCaptureLanguages.forEach((language) => {
                const fieldId = targetField.id + "_" + language;
                if (context.userForm.controls[fieldId]) {
                  context.userForm.controls[fieldId].setValue(valueToSet);
                  context.userForm.controls[fieldId].disable();
                }
              });
            } else {
              if (context.userForm.controls[targetField.id]) {
                context.userForm.controls[targetField.id].setValue(valueToSet);
                context.userForm.controls[targetField.id].disable();
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
  }
  else{
    if (args.length > 0) {
      for (const arg of args) {
        let controlsArr = arg.split("=");
        if (controlsArr.length > 0) {
          let control = controlsArr[0]; 

          let filteredList = context.uiFields.filter(
            (field) => field.id == control
          );

          if (filteredList.length > 0) {
            let targetField = filteredList[0];
            if (context.isControlInMultiLang(targetField)) {
              context.dataCaptureLanguages.forEach((language) => {
                const fieldId = targetField.id + "_" + language;
                if (context.userForm.controls[fieldId]) {
                  context.userForm.controls[fieldId].enable();
                }
              });
            } else {
              if (context.userForm.controls[targetField.id]) {
                context.userForm.controls[targetField.id].reset();
                context.userForm.controls[targetField.id].enable();
              }
            }
          }
        }
      }
    }
  }
};

export default isCardRequiredAction;
