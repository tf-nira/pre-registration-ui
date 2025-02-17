import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  HostListener,
  ViewChildren,
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import { MatDialog } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";

import { DataStorageService } from "src/app/core/services/data-storage.service";
import { RegistrationService } from "src/app/core/services/registration.service";

import { UserModel } from "src/app/shared/models/demographic-model/user.modal";
import { CodeValueModal } from "src/app/shared/models/demographic-model/code.value.modal";
import * as appConstants from "../../../app.constants";
import Utils from "src/app/app.util";
import { DialougComponent } from "src/app/shared/dialoug/dialoug.component";
import { ConfigService } from "src/app/core/services/config.service";
import { AttributeModel } from "src/app/shared/models/demographic-model/attribute.modal";
import {
  MatKeyboardService,
  MatKeyboardRef,
  MatKeyboardComponent,
} from "ngx7-material-keyboard-ios";
import { LogService } from "src/app/shared/logger/log.service";
import { FormDeactivateGuardService } from "src/app/shared/can-deactivate-guard/form-guard/form-deactivate-guard.service";
import { Subscription } from "rxjs";
import { Engine, Rule } from "json-rules-engine";
import moment from "moment";
import { AuditModel } from "src/app/shared/models/demographic-model/audit.model";
import { MatSelect } from "@angular/material/select";
import { ReplaySubject, Subject } from "rxjs";
import { take, takeUntil } from "rxjs/operators";
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
} from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import identityStubJson from "../../../../assets/identity-spec1.json";
import { RouterExtService } from "src/app/shared/router/router-ext.service";

import { myFlag, setMyFlag, disabledUiFields, Service, setService} from "src/app/shared/global-vars";
import { and } from "@angular/router/src/utils/collection";

//malay
interface DependentField {
  fieldId: string;
}

/**
 * @description This component takes care of the demographic page.
 * @author Shashank Agrawal
 *
 * @export
 * @class DemographicComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
export const DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};
@Component({
  selector: "app-demographic",
  templateUrl: "./demographic.component.html",
  styleUrls: ["./demographic.component.css"],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
    },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS},
  ],
})
export class DemographicComponent extends FormDeactivateGuardService
  implements OnInit, OnDestroy {
  userPrefLanguage = localStorage.getItem("userPrefLanguage");
  userPrefLanguageDir = "";
  dataCaptureLanguages = [];
  dataCaptureLanguagesLabels = [];
  dataCaptureLangsDir = [];
  ltrLangs = this.configService
    .getConfigByKey(appConstants.CONFIG_KEYS.mosip_left_to_right_orientation)
    .split(",");

  expStep = 0;
  filledFieldCount: number;
  filledFields: Number;


  setStep(index: number) {
    this.expStep = index;
  }
///

  // nextStep() {
  //   this.expStep++;
  // }

  // prevStep() {
  //   this.expStep--;
  // }
////
nextStep() {
  let maxSteps = 23; // Set the total number of steps
  do {
    this.expStep++;
  } while (
    this.expStep <= maxSteps && 
    !this.isStepVisible(this.expStep) // Skip hidden steps
  );
}

prevStep() {
  do {
    this.expStep--;
  } while (
    this.expStep >= 0 && 
    !this.isStepVisible(this.expStep) // Skip hidden steps
  );
}

isStepVisible(step: number): boolean {
  switch (step) {
    case 0:
      return true; // Always visible
    case 1:
      return this.isCopService();
    case 2:
      return this.isCopService();
    case 3:
      return !this.isCopService() && !this.isGetFirstId() && !this.isReplacement();
    case 4:
      return this.isCopService() || this.isGetFirstId() || this.isReplacement();
    case 5:
      return !this.isCopService() && !this.isGetFirstId() && !this.isReplacement(); // Replace with actual condition
    case 6:
      return !this.isRenewalService() && !this.isCopService() && !this.isGetFirstId() && !this.isReplacement();
    case 7:
      return !this.isRenewalService() && !this.isCopService() && !this.isGetFirstId() && !this.isReplacement();
    case 8:
      return !this.isRenewalService() && !this.isCopService() && !this.isGetFirstId() && !this.isReplacement();
    case 9:
      return !this.isRenewalService() && !this.isCopService() && !this.isGetFirstId() && !this.isReplacement();
    case 10:
      return !this.isRenewalService() && !this.isCopService() && !this.isGetFirstId() && !this.isReplacement();
    case 11:
      return !this.isRenewalService() && !this.isCopService() && !this.isGetFirstId() && !this.isReplacement();
    case 12:
      return !this.isRenewalService()  && !this.isCopService() && !this.isGetFirstId() && !this.isReplacement();
    case 13:
      return !this.isRenewalService() && !this.isCopService() && !this.isGetFirstId() && !this.isReplacement();
    case 14:
      return !this.isRenewalService() && !this.isCopService() && !this.isGetFirstId() && !this.isReplacement();
    case 15:
      return !this.isRenewalService() && !this.isCopService() && !this.isGetFirstId() && !this.isReplacement();
    case 16:
      return this.isCopService();
    case 17:
      return this.isReplacement();
    case 18:
      return !this.isRenewalService() && !this.isGetFirstId() && !this.isReplacement();
    case 19:
      return this.isCopService();
    case 20:
      return this.isCopService() && this.isRenewalService();
    case 21:
      return this.isGetFirstId();
    case 22:
      return true;
    default:
      return false;
  }
}


//////
  userService: string = "";
  userServiceType: string = "";
  //userServiceTypeCop: string = "";
  copAddName: boolean;
  copChangeNameOrder: boolean;
  copCompleChange: boolean;
  removingName: boolean;
  notificationOfChangeServiceType = [];
  notificationOfChangeNameFields = [];
  notificationOfChangeRemoveFields = [];
  // ageCop: string;
  agePattern: string;
  defaultDay: string;
  defaultMonth: string;
  defaultLocation: string;
  currentAge: string = "";
  currentAgeCop: string = "";
  isNewApplicant = false;
  checked = true;
  dataUploadComplete = true;
  hasError = false;
  dataModification: boolean;
  showPreviewButton = false;
  dataIncomingSuccessful = false;
  canDeactivateFlag = true;
  hierarchyAvailable = true;
  isConsentMessage = false;
  isReadOnly = false;
  step: number = 0;
  id: number;
  oldKeyBoardIndex: number;
  numberOfApplicants: number;
  userForm = new FormGroup({});
  maxDate = new Date(Date.now());
  preRegId = "";
  loginId = "";
  user: UserModel = new UserModel();
  demographiclabels: any;
  apiErrorCodes: any;
  errorlabels: any;
  validationErrorCodes: any;
  dialoglabels: any;
  dataCaptureLabels: any;
  uppermostLocationHierarchy: any;
  genders: any;
  residenceStatus: any;
  message = {};
  config = {};
  consentMessage = [];
  titleOnError = "";
  dateOfBirthFieldId = "";
  dateOfBirthFieldIdCop = "";
  isNavigateToDemographic = false;
  isSubmitted = false;
  _moment = moment;
  @ViewChild("age") age: ElementRef;
  @ViewChild("ageCop") ageCop: ElementRef;
  private _keyboardRef: MatKeyboardRef<MatKeyboardComponent>;
  @ViewChildren("keyboardRef", { read: ElementRef })
  private _attachToElementMesOne: any;
  subscriptions: Subscription[] = [];
  identityData = [];
  uiFields = [];
  alignmentGroups = [];
  copAlignmentGroups = [];
  uiFieldsForAlignmentGroups = [];
  uiFieldsForAlignmentGroupsCop=[];
  uiFieldsWithTransliteration = [];
  jsonRulesEngine = new Engine();
  primaryuserForm = false;
  selectOptionsDataArray = new Map();
  filteredSelectOptions = new Map<string, ReplaySubject<CodeValueModal[]>>();
  locationHeirarchies = [];
  validationMessage: any;
  dynamicFields = [];
  changeActions = [];
  changeActionsNamesArr = [];
  identitySchemaVersion = "";
  initializationFlag: boolean; //malay
  identityObj: any = {};    //malay
  newIdentityObj: any = {}; //malay
  showPRNField = false; //malay
  generatedPRN = '';    //malay
  readOnlyMode = false;
  showChangeDataCaptureLangBtn = false;
  localeDtFormat = "";
  serverDtFormat = "YYYY/MM/DD";
  userAge
  @ViewChild("singleSelect") singleSelect: MatSelect;
  /* Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();
  /**lines 177 to 284 malay*/
  /* Overloaded the  createIdentityJSONDynamic one 
  during normal onChangeHandler calls and other for onSubmit*/
  private createIdentityJSONDynamic(includingBlankFields: boolean): any;
  private createIdentityJSONDynamic(includingBlankFields: boolean, selectedFieldId: string): any;

  /**
  * @description This is to create the identity modal
  *
  * @private
  * @returns
  * @memberof DemographicComponent
  */
  private createIdentityJSONDynamic(includingBlankFields: boolean, selectedFieldId?: string): any {
    /** Checking if createIdentityJSONDynamic is called for the first time.
     *  It should create identityObj form identity data during initial ui screen load.
    */
    if (this.initializationFlag === true) {
      this.identityData.forEach((field) => {
        if (
          field.inputRequired === true &&
          !(field.controlType === "fileupload")
        ) {
          if (!field.inputRequired) {
            this.identityObj[field.id] = "";
            this.newIdentityObj[field.id] = "";
          } else {
            if (field.type === "simpleType") {
              this.identityObj[field.id] = [];
            } else if (field.type === "string") {
              this.identityObj[field.id] = "";
            }
          }
        } else {
          if (field.id == appConstants.IDSchemaVersionLabel) {
            if (field.type === "string") {
              this.identityObj[field.id] = String(this.identitySchemaVersion);
            } else if (field.type === "number") {
              this.identityObj[field.id] = Number(this.identitySchemaVersion);
            }
          }
        }
      });
    }

    let keyArr: any[] = Object.keys(this.identityObj);
    /** check if first load. Then no data entered by user. Hence, no data to upload in the field value.
     *  Filter the createAttributeArray method call.
     */
    if (this.initializationFlag === false || this.dataModification) {
      //Populate the data ONLY for the selected field.
      if (selectedFieldId && selectedFieldId!="") {
        if (selectedFieldId != appConstants.IDSchemaVersionLabel) {
          this.createAttributeArray(selectedFieldId, this.identityObj);
        }
      }
      else {
        //onSubmit is called. Populate the data in all fields.
        for (let index = 0; index < keyArr.length; index++) {
          const element = keyArr[index];
          if (element != appConstants.IDSchemaVersionLabel) {
            this.createAttributeArray(element, this.identityObj);
          }
        }
      }
    }
    let identityRequest = { identity: this.identityObj };
    if (!includingBlankFields) {
      //now remove the blank fields from the identityObj
      for (let index = 0; index < keyArr.length; index++) {
        const element = keyArr[index];
        if (element == appConstants.IDSchemaVersionLabel) {
          this.newIdentityObj[element] = this.identityObj[element];
        } else if (typeof this.identityObj[element] === "object") {
          let elementValue = this.identityObj[element];
          if (elementValue && elementValue.length > 0) {
            if (
              elementValue[0].value !== "" &&
              elementValue[0].value !== null &&
              elementValue[0].value !== undefined
            ) {
              this.newIdentityObj[element] = elementValue;
            }
          }
        } else if (typeof this.identityObj[element] === "string") {
          let elementValue = this.identityObj[element];
          if (
            elementValue !== "" &&
            elementValue !== null &&
            elementValue !== undefined
          ) {
            this.newIdentityObj[element] = elementValue;
          }
        } else if (typeof this.identityObj[element] === "boolean") {
          let elementValue = this.identityObj[element];
          if (elementValue == true) {
            this.newIdentityObj[element] = "Y";
          }
          if (elementValue == false) {
            this.newIdentityObj[element] = "N";
          }
        }
      }
      identityRequest = { identity: this.newIdentityObj };
    }
    return identityRequest;
  }

  /**
   * @description Creates an instance of DemographicComponent.
   * @param {Router} router
   * @param {RegistrationService} regService
   * @param {DataStorageService} dataStorageService
   * @param {BookingService} bookingService
   * @param {ConfigService} configService
   * @param {TranslateService} translate
   * @param {MatDialog} dialog
   * @memberof DemographicComponent
   */
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private regService: RegistrationService,
    private dataStorageService: DataStorageService,
    private configService: ConfigService,
    private translate: TranslateService,
    public dialog: MatDialog,
    private routerService: RouterExtService,
    private matKeyboardService: MatKeyboardService,
    private dateAdapter: DateAdapter<Date>,
    private loggerService: LogService // private errorService: ErrorService
  ) {
    super(dialog);
    this.translate.use(this.userPrefLanguage);
    this.subscriptions.push(
      this.regService
        .getMessage()
        .subscribe((message) => (this.message = message))
    );
  }
  /**
   * @description This is the angular life cycle hook called upon loading the component.
   *
   * @memberof DemographicComponent
   */
  async ngOnInit() {
    // Attach onChangeHandler to window so JS can call it
    (window as any).onChangeHandler = this.onChangeHandler.bind(this);
    console.log("1");
    await this.initialization();
    await this.initializeDataCaptureLanguages();
    //set translation service
    this.translate.use(this.dataCaptureLanguages[0]);
    //set the locale for date picker and moment
    this.setLocaleForDatePicker();
    //load all labels in the userPrefLanguage or loginLang
    this.getPrimaryLabels();
    await this.getIdentityJsonFormat();
    this.config = this.configService.getConfig();
    await this.getConsentMessage();
    this.initForm();
    await this.setFormControlValues();
    /*setting the initialization flag. To control method calls that are required only for the first time 
    when screen is loading*/
    this.initializationFlag = true;//malay

    console.log("log1 :: before await this.onChangeHandler ")
    const ongetFieldAndDataPromise = () => new Promise<void>(async (resolve) => {
      await this.onChangeHandler("");
        resolve(); // Resolve the promise once resetHiddenField is done
      });
      await ongetFieldAndDataPromise();
      console.log("log2 :: after await this.onChangeHandler ")

    if (this.readOnlyMode) {
      this.userForm.disable();
    }
    this.uiFields.forEach((control, index) => {
      if (control.controlType === "dropdown") {
        const controlId = control.id;
        const searchCtrlId = controlId + "_search";
        // load the initial list
        this.filteredSelectOptions[controlId].next(
          this.selectOptionsDataArray[`${controlId}`]
        );
        // listen for search field value changes
        this.userForm.controls[`${searchCtrlId}`].valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(async () => {
            this.searchInDropdown(controlId);
          });
      }
    });
    this.checkToShowLangChangeBtn();
    this.primaryuserForm = true;

    /** After the initialization reset the flag to false.
     * Otherwise processShowHideFields will be called even if the respective field does not 
     * have dependent attribute.
     */
    this.initializationFlag = false; //malay

    if (this.dataModification) {
      await this.getFieldAndData();
    }
  }

  async getFieldAndData() {
    for (const control of this.uiFields) {
      await this.onChangeHandler(control.id).then(async () => {
      });
    }
  }
  ngAfterViewInit() {
    this.setInitialValue();
  }
  /**
   * Sets the initial value after the filteredBanks are loaded initially
   */
  protected setInitialValue() {
    this.uiFields.forEach((control, index) => {
      if (control.controlType === "dropdown") {
        this.filteredSelectOptions[`${control.id}`]
          .pipe(take(1), takeUntil(this._onDestroy))
          .subscribe(() => {
            this.singleSelect.compareWith = (
              a: CodeValueModal,
              b: CodeValueModal
            ) => a && b && a.valueCode === b.valueCode;
          });
      }
    });
  }

  protected searchInDropdown(controlId: string) {
    if (this.selectOptionsDataArray[`${controlId}`].length > 0) {
      // get the search keywords
      const searchCtrlId = controlId + "_search";
      let search = this.userForm.controls[`${searchCtrlId}`].value;
      const selectData = this.selectOptionsDataArray[`${controlId}`];
      if (!search) {
        this.filteredSelectOptions[controlId].next(selectData.slice());
        return;
      } else if (search.trim() == "") {
        this.filteredSelectOptions[controlId].next(selectData.slice());
        return;
      } else {
        search = search.toLowerCase();
        const filtered = selectData.filter(
          (option) => option.valueName.toLowerCase().indexOf(search) === 0
        );
        this.filteredSelectOptions[controlId].next(filtered.slice());
        return;
      }
    } else {
      this.filteredSelectOptions[controlId].next(
        this.selectOptionsDataArray[`${controlId}`].slice()
      );
      return;
    }
  }
  setLocaleForDatePicker = () => {
    let localeId = this.dataCaptureLanguages[0].substring(0, 2);
    JSON.parse(localStorage.getItem(appConstants.LANGUAGE_CODE_VALUES)).forEach(
      (element) => {
        if (this.dataCaptureLanguages[0] === element.code && element.locale) {
          localeId = element.locale;
        }
      }
    );
    this.dateAdapter.setLocale(localeId);
    let localeDtFormat = moment.localeData(localeId).longDateFormat("L");
    this.translate.get("demographic.date_yyyy").subscribe((year: string) => {
      const yearLabel = year;
      this.translate.get("demographic.date_mm").subscribe((month: string) => {
        const monthLabel = month;
        this.translate.get("demographic.date_dd").subscribe((day: string) => {
          const dayLabel = day;
          if (localeDtFormat.indexOf("YYYY") != -1) {
            localeDtFormat = localeDtFormat.replace(/YYYY/g, yearLabel);
          } else if (localeDtFormat.indexOf("YY") != -1) {
            localeDtFormat = localeDtFormat.replace(/YY/g, yearLabel);
          }
          if (localeDtFormat.indexOf("MM") != -1) {
            localeDtFormat = localeDtFormat.replace(/MM/g, monthLabel);
          } else if (localeDtFormat.indexOf("M") != -1) {
            localeDtFormat = localeDtFormat.replace(/M/g, monthLabel);
          }
          if (localeDtFormat.indexOf("DD") != -1) {
            localeDtFormat = localeDtFormat.replace(/DD/g, dayLabel);
          } else if (localeDtFormat.indexOf("D") != -1) {
            localeDtFormat = localeDtFormat.replace(/D/g, dayLabel);
          }
          this.localeDtFormat = localeDtFormat;
        });
      });
    });
  };

  initializeDataCaptureLanguages = async () => {
    if (!this.dataModification) {
      this.dataCaptureLanguages = JSON.parse(
        localStorage.getItem(appConstants.DATA_CAPTURE_LANGUAGES)
      );
      this.dataCaptureLanguagesLabels = JSON.parse(
        localStorage.getItem(appConstants.DATA_CAPTURE_LANGUAGE_LABELS)
      );
      this.dataCaptureLanguages.forEach((langCode) => {
        //set the language direction as well
        if (this.ltrLangs.includes(langCode)) {
          this.dataCaptureLangsDir.push("ltr");
        } else {
          this.dataCaptureLangsDir.push("rtl");
        }
      });
    } else {
      if (this.user.request === undefined) {
        await this.getUserInfo(this.preRegId);
      }
      this.dataCaptureLanguages = Utils.getApplicationLangs(this.user.request);
      //reorder the languages, by making user login lang as first one in the array
      this.dataCaptureLanguages = Utils.reorderLangsForUserPreferredLang(
        this.dataCaptureLanguages,
        this.userPrefLanguage
      );
      //populate the lang labels
      this.dataCaptureLanguages.forEach((langCode) => {
        JSON.parse(
          localStorage.getItem(appConstants.LANGUAGE_CODE_VALUES)
        ).forEach((element) => {
          if (langCode === element.code) {
            this.dataCaptureLanguagesLabels.push(element.value);
          }
        });
        if (this.ltrLangs.includes(langCode)) {
          this.dataCaptureLangsDir.push("ltr");
        } else {
          this.dataCaptureLangsDir.push("rtl");
        }
      });
    }
  };

  private getPrimaryLabels() {
    this.dataStorageService
      .getI18NLanguageFiles(this.userPrefLanguage)
      .subscribe((response) => {
        this.demographiclabels = response["demographic"];
        this.errorlabels = response["error"];
        this.validationErrorCodes = response["UI_VALIDATION_ERROR_CODES"];
        this.apiErrorCodes = response[appConstants.API_ERROR_CODES];
        this.dialoglabels = response["dialog"];
        this.dataCaptureLabels = response["dashboard"]["dataCaptureLanguage"];
      });
  }

  private getConsentMessage() {
    return new Promise((resolve, reject) => {
      this.subscriptions.push(
        this.dataStorageService.getGuidelineTemplate("consent").subscribe(
          (response) => {
            this.isConsentMessage = true;
            this.consentMessage = response[appConstants.RESPONSE]["templates"];
            resolve(true);
          },
          (error) => {
            this.isConsentMessage = false;
            this.showErrorMessage(error);
          }
        )
      );
    });
  }

  /**
   * @description This method do the basic initialization,
   * if user is opt for updation or creating the new applicaton
   *
   * @private
   * @memberof DemographicComponent
   */
  private async initialization() {
    //load error related labels in user's login lang,
    //this is required to show errors from services
    this.dataStorageService
      .getI18NLanguageFiles(this.userPrefLanguage)
      .subscribe((response) => {
        this.errorlabels = response[appConstants.ERROR];
        this.apiErrorCodes = response[appConstants.API_ERROR_CODES];
      });
    if (this.ltrLangs.includes(this.userPrefLanguage)) {
      this.userPrefLanguageDir = "ltr";
    } else {
      this.userPrefLanguageDir = "rtl";
    }
    if (localStorage.getItem(appConstants.NEW_APPLICANT) === "true") {
      this.isNewApplicant = true;
    }
    if (localStorage.getItem(appConstants.MODIFY_USER) === "true") {
      this.dataModification = true;
      await this.getPreRegId();
      await this.getUserInfo(this.preRegId);
      if (
        localStorage.getItem(appConstants.MODIFY_USER_FROM_PREVIEW) === "true"
      ) {
        this.showPreviewButton = true;
      }

      this.loginId = localStorage.getItem("loginId");
    }
  }

  getPreRegId() {
    return new Promise((resolve) => {
      this.activatedRoute.params.subscribe((param) => {
        this.preRegId = param["appId"];
        resolve(true);
      });
    });
  }

  getUserInfo(preRegId) {
    return new Promise((resolve) => {
      this.dataStorageService.getUser(preRegId).subscribe(
        (response) => {
          this.user.request = response[appConstants.RESPONSE];
          console.log("demographic page status code::  " + this.user.request["statusCode"]);
          if (
            this.user.request["statusCode"] !==
            appConstants.APPLICATION_STATUS_CODES.incomplete &&
            this.user.request["statusCode"] !==
            appConstants.APPLICATION_STATUS_CODES.pending
          ) {
            this.readOnlyMode = true;
          } else {
            this.readOnlyMode = false;
          }
          resolve(true);
        },
        (error) => {
          this.showErrorMessage(error);
        }
      );
    });
  }

  getAllLangs = () => {
    let allLangs = [];
    let userLangAvailable = false;
    this.dataCaptureLanguages.forEach((lang) => {
      if (lang == this.userPrefLanguage) {
        userLangAvailable = true;
      }
    });
    if (!userLangAvailable) {
      allLangs = [this.userPrefLanguage, ...this.dataCaptureLanguages];
    } else {
      allLangs = [...this.dataCaptureLanguages];
    }
    return allLangs;
  };

  getAllLangsDir = (allLangs) => {
    let allLangsDir = [];
    allLangs.forEach((lang) => {
      if (this.ltrLangs.includes(lang)) {
        allLangsDir.push("ltr");
      } else {
        allLangsDir.push("rtl");
      }
    });
    return allLangsDir;
  };

  private consentDeclaration() {
    if (this.demographiclabels) {
      let newDataStructure = [];
      let consentText = [];
      const allLangs = this.getAllLangs();
      const allLangsDir = this.getAllLangsDir(allLangs);
      allLangs.forEach((lang) => {
        this.consentMessage.forEach((obj) => {
          if (lang === obj.langCode) {
            consentText.push(obj.fileText.split("\n"));
            this.dataStorageService
              .getI18NLanguageFiles(obj.langCode)
              .subscribe((response) => {
                let labels = response["demographic"];
                let structure = {};
                structure["fileText"] = obj.fileText.split("\n");
                structure["labels"] = labels;
                structure["langCode"] = obj.langCode;
                newDataStructure.push(structure);
              });
          }
        });
      });
      const data = {
        case: "CONSENTPOPUP",
        data: newDataStructure,
        textDirectionArr: allLangsDir,
        title: this.demographiclabels.consent.title,
        cancelBtn: this.demographiclabels.consent.cancelButton,
        alertMessageFirst: this.demographiclabels.consent.alertMessageFirst,
        alertMessageSecond: this.demographiclabels.consent.alertMessageSecond,
        alertMessageThird: this.demographiclabels.consent.alertMessageThird,
        userPrefferedlangCode: this.userPrefLanguage,
      };
      this.dialog
        .open(DialougComponent, {
          width: "900px",
          data: data,
          disableClose: true,
        })
        .afterClosed()
        .subscribe((res) => {
          let description = {
            url: localStorage.getItem("consentUrl"),
            template: consentText,
            description: "Consent Accepted",
          };
          if (res !== undefined) {
            let auditObj = new AuditModel();
            auditObj.actionUserId = localStorage.getItem("loginId");
            auditObj.eventName = "CONSENT";
            auditObj.description = JSON.stringify(description);
            this.dataStorageService.logAudit(auditObj).subscribe((res) => { });
          }
        });
    }
  }


  /**
   * @description This method will get the Identity Schema Json
   */
  async getIdentityJsonFormat() {
    return new Promise((resolve, reject) => {
      this.dataStorageService.getIdentityJson().subscribe(
        async (response) => {
          let identityJsonSpec =
            response[appConstants.RESPONSE]["jsonSpec"]["identity"];
          this.identityData = identityJsonSpec["identity"];

          //LOCAL
          //this.identityData = [];    

          let locationHeirarchiesFromJson = [
            ...identityJsonSpec["locationHierarchy"], 
            ...identityJsonSpec["locationHierarchy"], 
          ];
          this.identitySchemaVersion =
            response[appConstants.RESPONSE]["idSchemaVersion"];

            //LOCAL
            //const fieldDefinitions = await this.loadFieldDefinitions();
            //this.identityData.push(...fieldDefinitions);

          if (Array.isArray(locationHeirarchiesFromJson[0])) {
            this.locationHeirarchies = locationHeirarchiesFromJson;
          } else {
            let hierarchiesArray = [];
            hierarchiesArray.push(locationHeirarchiesFromJson);
            this.locationHeirarchies = hierarchiesArray;
          }
          localStorage.setItem(
            "locationHierarchy",
            JSON.stringify(this.locationHeirarchies[0])
          );

          this.identityData.forEach((obj) => {
            if (
              obj.inputRequired === true &&
              obj.controlType !== null &&
              !(obj.controlType === "fileupload")
            ) {
              if (obj.transliteration && obj.transliteration === true) {
                this.uiFieldsWithTransliteration.push(obj);
              }
              this.uiFields.push(obj);
            }
          });
          //set the alignmentGroups for UI rendering, by default, 3 containers with multilang controls will appear in a row
          //you can update this by combining controls using "alignmentGroup", "containerStyle" and "headerStyle" in UI specs.
          this.setAlignmentGroups();
          this.setCopAlignmentGroups();
          this.dynamicFields = this.uiFields.filter(
            (fields) =>
              (fields.controlType === "dropdown" ||
                fields.controlType === "button") &&
              fields.fieldType === "dynamic"
          );
          this.setDropDownArrays();
          this.setLocations();
          await this.getDynamicFieldValues(null);
          resolve(true);
        },
        (error) => {
          this.showErrorMessage(error);
        }
      );
    });
  }

  //malay
  async loadFieldDefinitions() {
    const response = await fetch('assets/data/niraUiSpec.json');
    return response.json();
  }

  setAlignmentGroups() {
    let rowIndex = 0;
    this.uiFields.forEach((obj, index) => {
      if (obj.alignmentGroup && obj.alignmentGroup != null) {
        if (!this.alignmentGroups.includes(obj.alignmentGroup)) {
          this.uiFieldsForAlignmentGroups[obj.alignmentGroup] = [];
          this.alignmentGroups.push(obj.alignmentGroup);
          rowIndex = rowIndex + 1;
        }
        this.uiFieldsForAlignmentGroups[obj.alignmentGroup].push(obj);
      } else {
        let alignmentGroup = "defaultrow" + rowIndex;
        obj["alignmentGroup"] = alignmentGroup;
        if (!this.alignmentGroups.includes(obj.alignmentGroup)) {
          this.uiFieldsForAlignmentGroups[obj.alignmentGroup] = [];
          this.alignmentGroups.push(obj.alignmentGroup);
        }
        this.uiFieldsForAlignmentGroups[obj.alignmentGroup].push(obj);
      }
    });
  }

  setCopAlignmentGroups() {
    let rowIndex = 0;
    this.uiFields.forEach((obj, index) => {
      if (obj.copAlignmentGroup && obj.copAlignmentGroup != null) {
        if (!this.copAlignmentGroups.includes(obj.copAlignmentGroup)) {
          this.uiFieldsForAlignmentGroupsCop[obj.copAlignmentGroup] = [];
          this.copAlignmentGroups.push(obj.copAlignmentGroup);
          rowIndex = rowIndex + 1;
        }
        this.uiFieldsForAlignmentGroupsCop[obj.copAlignmentGroup].push(obj);
      }
    });
  }

  /**
   * @description This will initialize the demographic form and
   * if update set the inital values of the attributes.
   *
   *
   * @memberof DemographicComponent
   */
  async initForm() {
    this.uiFields.forEach((uiField, index) => {
      this.dataCaptureLanguages.forEach((language, i) => {
        if (this.isControlInMultiLang(uiField)) {
          const controlId = uiField.id + "_" + language;
          this.userForm.addControl(controlId, new FormControl(""));
          this.addValidators(uiField, controlId, language);
        } else if (i == 0) {
          const controlId = uiField.id;
          this.userForm.addControl(controlId, new FormControl(""));
          this.addValidators(uiField, controlId, language);
          if (uiField.controlType === "dropdown") {
            const searchCtrlId = controlId + "_search";
            this.userForm.addControl(searchCtrlId, new FormControl(""));
          }
          if (uiField.controlType === "ageDate") {
            this.dateOfBirthFieldId = controlId;
            const dtCtrlId = controlId + "_dateCtrl";
            this.userForm.addControl(dtCtrlId, new FormControl(""));
          }
          if (uiField.controlType === "ageDateCop") {
            this.dateOfBirthFieldIdCop = controlId;
            const dtCtrlId = controlId + "_dateCtrl";
            this.userForm.addControl(dtCtrlId, new FormControl(""));
          }
        }
      });
    });
  }

  isControlInMultiLang(uiField: any) {
    if (
      uiField.controlType !== "ageDate" &&
      uiField.controlType !== "ageDateCop" &&
      uiField.controlType !== "date" &&
      uiField.controlType !== "dropdown" &&
      uiField.controlType !== "button" &&
      uiField.controlType !== "checkbox" &&
      uiField.controlType === "textbox" &&
      uiField.type !== "string"
    ) {
      return true;
    }
    return false;
  }

  addValidators = (uiField: any, controlId: string, languageCode: string) => {
    if (uiField.required) {
      this.userForm.controls[`${controlId}`].setValidators(Validators.required);
    }
    if (uiField.validators !== null && uiField.validators.length > 0) {
      if (uiField.required) {
        this.userForm.controls[`${controlId}`].setValidators([
          Validators.required,
          (c: FormControl) => this.customValidator(c, uiField.id, languageCode),
        ]);
      } else {
        this.userForm.controls[`${controlId}`].setValidators([
          (c: FormControl) => this.customValidator(c, uiField.id, languageCode),
        ]);
      }
    }
  };

  customValidator(
    control: FormControl,
    uiFieldId: string,
    controlLangCode: string
  ) {
    let val = control.value;
    let filtered = this.uiFields.filter((uiField) => uiField.id == uiFieldId);
    if (val && filtered.length > 0) {
      let uiField = filtered[0];
      let msg = "";
      let isInvalid = false;
      if (uiField.validators !== null && uiField.validators.length > 0) {
        uiField.validators.forEach((validatorItem) => {
          if (!isInvalid) {
            let validatorLang = validatorItem.langCode;
            if (
              (validatorLang && validatorLang == controlLangCode) ||
              !validatorLang ||
              validatorLang == ""
            ) {
              if (validatorItem.type === "nonFutureDate") {
                let inputDate = new Date(val);
                let currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0); // Clear time for accurate comparison
                if (inputDate > currentDate) {
                  isInvalid = true;
                  msg = "The date must not be in the future.";
                }
              }
              else if (validatorItem.type === "beforeApplicantDOB") {
                let inputDate = new Date(val);
                let currentDate = new Date();
                const dateOfBirthValue = this.userForm.controls[this.dateOfBirthFieldId].value;
                const applicantDOB = new Date(dateOfBirthValue);
                currentDate.setHours(0, 0, 0, 0); // Clear time for accurate comparison
                if (inputDate > currentDate || applicantDOB <= inputDate) {
                  isInvalid = true;
                  msg = "The date must not be later than the Applicant's Date of Birth or a future date.";
                }
              }
              else if (validatorItem.type === "regex") {
                let regex = new RegExp(validatorItem.validator);
                if (regex.test(val) == false) {
                  isInvalid = true;
                  if (this.validationErrorCodes[validatorItem.errorMessageCode]) {
                    msg = this.validationErrorCodes[
                      validatorItem.errorMessageCode
                    ];
                  }
                }
              }
            }
          }
        });
        if (isInvalid) {
          return {
            customPattern: {
              value: val,
              msg: msg,
            },
          };
        }
      }
    }
    return null;
  }

  setDropDownArrays() {
    this.getIntialDropDownArrays();
  }

  getIntialDropDownArrays() {
    this.uiFields.forEach((control) => {
      if (control.controlType === "button") {
        this.selectOptionsDataArray[control.id] = [];
      }
      if (control.controlType === "dropdown") {
        this.selectOptionsDataArray[control.id] = [];
        this.filteredSelectOptions[control.id] = new ReplaySubject<
          CodeValueModal[]
        >(1);
      }
    });
  }

  isThisFieldInLocationHeirarchies = (fieldId) => {
    let items = this.getLocationHierarchy(fieldId);
    return items.length > 0 ? true : false;
  };

  getIndexInLocationHeirarchy = (fieldId) => {
    let items = this.getLocationHierarchy(fieldId);
    return items.indexOf(fieldId);
  };

  getLocationNameFromIndex = (fieldId, fieldIndex) => {
    let items = this.getLocationHierarchy(fieldId);
    if (fieldId.toLowerCase().includes("pollingstation")){
      fieldIndex=fieldIndex-1;
    }
    return items[fieldIndex];
  };

  getLocationHierarchy = (fieldId) => {
    let items = [];
    this.locationHeirarchies.forEach((locationHeirarchy) => {
      let filteredItems = locationHeirarchy.filter((item) => item == fieldId);
      if (filteredItems.length > 0) {
        items = locationHeirarchy;
      }
    });
    return items;
  };

  /**
   *
   * @description this method is to make dropdown api calls
   *
   * @param controlObject is Identity Type Object
   *  ex: { id : 'region',controlType: 'dropdown' ...}
   */
  /**
 *
 * @description this method is to make dropdown api calls
 *
 * @param controlObject is Identity Type Object
 * ex: { id : 'region',controlType: 'dropdown' ...}
 */
  async dropdownApiCall(controlId: string) {
    let _this = this;
    if (this.isThisFieldInLocationHeirarchies(controlId)) {
      if (this.getIndexInLocationHeirarchy(controlId) !== 0) {
        this.selectOptionsDataArray[controlId] = [];
        this.filteredSelectOptions[controlId] = new ReplaySubject<CodeValueModal[]>(1);
        let filtered = this.uiFields.find(uiField => uiField.id == controlId);
        const possibleParentLocations = this.getLocationNameFromFieldId(
          controlId
        );
        for (let parentLocation of possibleParentLocations) {
          let locationCode = this.userForm.controls[`${parentLocation.id}`].value;
          if (!locationCode) {
            _this.identityData.forEach((obj) => {
              if (obj.id == controlId) {
                locationCode = obj.parentLocCode;
              }
            });
          }
          let promisesArr = await this.loadLocationData(locationCode, controlId,
            filtered.locationHierarchyName);
          Promise.all(promisesArr).then((values) => {
            const newDataArr = _this.selectOptionsDataArray[controlId];
            if (newDataArr && (newDataArr.length / _this.dataCaptureLanguages.length) == 1) {
              const firstValue = newDataArr[0].valueCode;
              if (firstValue) {
                _this.userForm.controls[`${controlId}`].setValue(firstValue);
              }
              _this.searchInDropdown(controlId);
              _this.resetLocationFields(controlId);
              return;
            }
            this.searchInDropdown(controlId);
            this.resetLocationFields(controlId);
            return;
          });
        }
      }
    }
  }

  toFormControl(point: AbstractControl): FormControl {
    return point as FormControl;
  }

  transliterateFieldValue(uiFieldId: string, fromLang: string, event: Event) {
    let filteredList = this.uiFieldsWithTransliteration.filter(
      (field) => field.id == uiFieldId
    );
    if (filteredList.length > 0) {
      if (event.type === "focusout") {
        let fromFieldName = uiFieldId + "_" + fromLang;
        let validationErr = this.customValidator(
          this.toFormControl(this.userForm.controls[fromFieldName]),
          uiFieldId,
          fromLang
        );
        if (validationErr == null) {
          this.dataCaptureLanguages.forEach((dataCaptureLanguage) => {
            if (dataCaptureLanguage !== fromLang) {
              const toLang = dataCaptureLanguage;
              const toFieldName = uiFieldId + "_" + toLang;
              const toFieldValue = this.userForm.controls[toFieldName].value;
              if (toFieldValue === "") {
                this.onTransliteration(
                  fromLang,
                  toLang,
                  fromFieldName,
                  toFieldName
                );
              }
            }
          });
        }
      }
    }
  }

  /**
   * This function will reset the value of the hidden field in the form.
   * @param uiField
   */
  resetHiddenField = (uiField) => {
    this.dataCaptureLanguages.forEach((language, i) => {
      let controlId = "";
      if (this.isControlInMultiLang(uiField) && myFlag == false) {
        controlId = uiField.id + "_" + language;
        this.userForm.controls[controlId].reset();
        this.userForm.controls[controlId].setValue("");
      } else if (i == 0 && myFlag == false) {
        controlId = uiField.id;

        if (controlId == this.dateOfBirthFieldId) {
          controlId = controlId + "_dateCtrl"
          this.currentAge = null;
        } else if (controlId == this.dateOfBirthFieldIdCop) {
          controlId = controlId + "_dateCtrl"
          this.currentAgeCop = null;
        }
        this.userForm.controls[controlId].reset();


        this.userForm.controls[controlId].setValue("");   

      }
    });
  };

  /**
   * This function looks for "visibleCondition" attribute for each field in UI Specs.
   * Using "json-rules-engine", these conditions are evaluated
   * and fields are shown/hidden in the UI form.
   */
  async onChangeHandler(selectedFieldId: string) {
    debugger
    if (this.initializationFlag == false && selectedFieldId == appConstants.userServiceType && this.dataModification != true) {
      for (const control of this.uiFields) {
        if (!(control.id == appConstants.userService || control.id == appConstants.userServiceType)) {
          const resetHiddenFieldPromise = () => new Promise<void>((resolve) => {
            this.resetHiddenField(control);
            resolve();
          });
          await resetHiddenFieldPromise();
          await this.onChangeHandler(control.id);
        }
      }
    }
    if (this.initializationFlag == false && selectedFieldId == appConstants.userService && this.dataModification != true) {
      for (const control of this.uiFields) {
        if (!(control.id == appConstants.userService)) {
          const resetHiddenFieldPromise = () => new Promise<void>((resolve) => {
            this.resetHiddenField(control);
            resolve();
          });
          await resetHiddenFieldPromise();
          await this.onChangeHandler(control.id);
        }
      }
    }
 
    const identityFormData = this.createIdentityJSONDynamic(true, selectedFieldId);
    //if(selectedFieldId==appConstants.userServiceTypeCop){
      //this.userServiceTypeCop=this.userForm.controls[selectedFieldId].value;
    //}
    if(selectedFieldId==appConstants.copAddName){
      this.copAddName=this.userForm.controls[selectedFieldId].value;
    }
    if(selectedFieldId==appConstants.copChangeNameOrder){
      this.copChangeNameOrder=this.userForm.controls[selectedFieldId].value;
    }
    if(selectedFieldId==appConstants.copCompleChange){
      this.copCompleChange=this.userForm.controls[selectedFieldId].value;
    }
    if(selectedFieldId==appConstants.removingName){
      this.removingName=this.userForm.controls[selectedFieldId].value;
    }
    if(selectedFieldId==appConstants.userServiceType){
      this.userServiceType=this.userForm.controls[selectedFieldId].value;
    }
    // Consent Declaration
    if (selectedFieldId && selectedFieldId.trim() !== "") {
      if (selectedFieldId == appConstants.userService && this.userForm.controls[selectedFieldId].value !== this.userService) {
        console.log(`Prev : ${this.userService}, New: ${this.userForm.controls[selectedFieldId].value}`);
        if (!this.dataModification) {
          if (this.isConsentMessage) this.consentDeclaration();
        }
        this.userService = this.userForm.controls[selectedFieldId].value;
        setService(this.userService);
      }
    }

    let isChild = false;
    let currentAge = null;
    let currentAgeCop = null;
    if (
      this.dateOfBirthFieldId != "" &&
      identityFormData.identity[this.dateOfBirthFieldId]
    ) {
      const dateOfBirthDt = identityFormData.identity[this.dateOfBirthFieldId];
      let birth = identityFormData.identity[this.dateOfBirthFieldId];
        let formattedBirth = birth.split('/').reverse().join('/');
        this.userForm.controls[this.dateOfBirthFieldId].setValue(formattedBirth);
      let calcAge = this.calculateAge(dateOfBirthDt);
      if (calcAge !== "" && Number(calcAge) > -1) {
        currentAge = Number(calcAge);
        this.userAge = currentAge;
      }
      const ageToBeAdult = this.config[
        appConstants.CONFIG_KEYS.mosip_adult_age
      ];
      if (
        Number(this.currentAge) > -1 &&
        Number(this.currentAge) <= Number(ageToBeAdult)
      ) {
        isChild = true;
      }
    }
    else if(
      this.dateOfBirthFieldIdCop != "" &&
      identityFormData.identity[this.dateOfBirthFieldIdCop]
    ){
      const dateOfBirthDt = identityFormData.identity[this.dateOfBirthFieldIdCop];
        let birthCop = identityFormData.identity[this.dateOfBirthFieldIdCop];
        let formattedBirthCop = birthCop.split('/').reverse().join('/');
        this.userForm.controls[this.dateOfBirthFieldIdCop].setValue(formattedBirthCop);

      let calcAgeCop = this.calculateAge(dateOfBirthDt);
      if (calcAgeCop !== "" && Number(calcAgeCop) > -1) {
        currentAgeCop = Number(calcAgeCop);
        this.userAge=currentAgeCop
      }
      const ageToBeAdult = this.config[
        appConstants.CONFIG_KEYS.mosip_adult_age
      ];
      if (
        Number(this.currentAgeCop) > -1 &&
        Number(this.currentAgeCop) <= Number(ageToBeAdult)
      ) {
        isChild = true;
      }
  
    }
    let formIdentityData = {
      identity: {
        ...identityFormData.identity,
        isChild: isChild,
        age: currentAge,
        ageCop: currentAgeCop,
      },
    };
    
    
    //minor restriction for byreg and bynat
    let applicantAge = null;
    let applicantAgeCop = null;
    if(selectedFieldId == this.dateOfBirthFieldId){
      applicantAge = Number(this.currentAge);
    } else if(selectedFieldId == this.dateOfBirthFieldIdCop){
      applicantAgeCop = Number(this.currentAgeCop);
    }

    if(selectedFieldId !="" && selectedFieldId==this.dateOfBirthFieldId){
      if(this.userServiceType==appConstants.USER_SERVICETYPE.BYNATURALISATION || this.userServiceType==appConstants.USER_SERVICETYPE.BYREGISTRATION){
        if(applicantAge<18 && applicantAge!=null){
          this.userForm.controls[selectedFieldId].setValue("");
          this.userForm.controls[selectedFieldId].markAsTouched();
          this.userForm.controls[selectedFieldId].setErrors({
            incorrect: true,
          });
        }
      } 
    }if(selectedFieldId !="" && selectedFieldId==this.dateOfBirthFieldIdCop){
      if(this.userService==appConstants.USER_SERVICE.FIRSTID){
        if(applicantAgeCop<16 && applicantAgeCop!=null){
          this.userForm.controls[selectedFieldId].setValue("");
          this.userForm.controls[selectedFieldId].markAsTouched();
          this.userForm.controls[selectedFieldId].setErrors({
            incorrect: true,
          });
        }
      } 
    }
    if(selectedFieldId !="" && selectedFieldId==appConstants.declaration){
      if(this.userForm.controls[selectedFieldId].value === false){
        this.userForm.controls[selectedFieldId].reset();
      }
    }
    //following code added malay

    /** Execute processShowHideFields on first run to make all fields visible. */
    if (this.initializationFlag === true) {
      await this.processShowHideFields(formIdentityData);
      
    }
    let field;
    let subField;
    /**Following methods (processConditionalRequiredValidations && processChangeActions)
     * to be called only when some data entered by user.
     * Thus not to execute on first run.
     * using initializationFlag did not solved the purpose bcz async call, even before 
     * completing the processShowHideFields it returned to ngoninit and set flag to false.
     */
    /**Execute processShowHideFields processConditionalRequiredValidations 
     * only if any field has dependentFields.
     */
    //Fetching the field using the value of selectedFieldId(string)
    if (selectedFieldId && selectedFieldId.trim() !== "") {
      field = this.identityData.find(
        (field) => field.id === selectedFieldId);
    }


    //Checking if the field has any "dependentFields".
    if (field && field.hasOwnProperty("dependentFields")) {
      const dependentFields: DependentField[] = field.dependentFields;
      /** Access the dependent fields from the dependentFields array:-
       * 1.getting the fieldId (just the fieldId)
       * 2.getting the subfield using the fieldId (entire field)
       */
      for (const dependentField of dependentFields) {
        const fieldId = dependentField.fieldId;
        subField = this.identityData.find(
          (subfield) => subfield.id === fieldId);
        //check if the subfield has "visibleCondition" or "requiredCondition"
        if (subField) {
          if (subField.hasOwnProperty("visibleCondition")) {
            await this.processShowHideFields(formIdentityData, subField);
          }
          if (subField.hasOwnProperty("requiredCondition")) {
            await this.processConditionalRequiredValidations(formIdentityData, subField);
          }
          //default value decision
          if(subField.isVisible==true){
            let valueToSet;
            let result;
            if (subField.hasOwnProperty("setDefaultValueCondition")) {
              result = await this.processConditionalDefaultValue(formIdentityData, subField);
            }
            if (subField.hasOwnProperty("setDefaultValue")) {
              let value = subField.setDefaultValue;
              if(result === "true"){
                valueToSet = value;
                this.userForm.controls[fieldId].setValue(valueToSet);
                this.userForm.controls[fieldId].disable();
              }
              else{
                this.userForm.controls[fieldId].enable();
              }
            }
          }
        } else {
          // Optional: Handle the case where the subField isn't found
          console.warn(`Dependent field with ID '${fieldId}' not found.`);
        }
      }
    }
    
    if (selectedFieldId && selectedFieldId.trim() !== "" && myFlag == false) {
      await this.processChangeActions(selectedFieldId).then(async () => {
      });
    }
    if (selectedFieldId === appConstants.APPLICANT_PLACE_OF_RESIDENCE_YEARS_LIVED_FIELD) {
      this.validateYearsLived(selectedFieldId);
  }

    if (selectedFieldId === appConstants.DATE_OF_BIRTH_FIELD) {
      this.validateYearsLived(appConstants.APPLICANT_PLACE_OF_RESIDENCE_YEARS_LIVED_FIELD);
    }
  }


  
  processShowHideFields = async (formIdentityData: any, subField?: any) => {
    return new Promise<void>((resolve, reject) => {
      if (subField) {
        /** Construct a fact to be consumed by the json-rule-engine based on 
         * parent field value.
         */
        const resetHiddenFieldFunc = this.resetHiddenField;
        let visibilityRule = new Rule({
          conditions: subField.visibleCondition,
          onSuccess() {
            //in "visibleCondition" is statisfied then show the field
            subField.isVisible = true;
          },
          async onFailure() {
            //in "visibleCondition" is not statisfied then hide the field
            subField.isVisible = false;
            if(!myFlag){
              
            resetHiddenFieldFunc(subField);
            }
          },
          event: {
            type: "message",
            params: {
              data: "",
            },
          },
        });
        this.jsonRulesEngine.addRule(visibilityRule);
        //evaluate the visibleCondition
        this.jsonRulesEngine
          .run(formIdentityData)
          .then((results) => {
            results.events.map((event) =>
              console.log(
                "jsonRulesEngine for visibleConditions run successfully",
                event.params.data
              )
            );
            this.jsonRulesEngine.removeRule(visibilityRule);
            resolve(); // Resolve the promise on success
          })
          .catch((error) => {
            this.jsonRulesEngine.removeRule(visibilityRule);
            reject(error);
          });

      }
      else {
        this.uiFields.forEach((uiField) => {
          let facts = {};
          /** If no "visibleCondition" is given, then show the field.
           *  First run make all fields visible except with visibleCondition
          */
          if (!uiField.visibleCondition || uiField.visibleCondition == "") {
            uiField.isVisible = true;
          }
        }, this.resetHiddenField);
        resolve();
      }
    });
  };

  processChangeActions = async (selectedFieldId) => {
    this.uiFields.forEach(async (uiField) => {
      if (
        selectedFieldId == uiField.id &&
        uiField.changeAction &&
        uiField.changeAction != "" &&
        uiField.changeAction != null
      ) {
        console.log(selectedFieldId)
        let changeAction = uiField.changeAction;
        let funcName = null;
        let funcArgs = null;
        if (changeAction.indexOf(":") != -1) {
          const changeActionArr = changeAction.split(":");
          if (changeActionArr.length > 1) {
            funcName = changeAction.split(":")[0];
            const argumentsStr = changeAction.split(":")[1];
            if (argumentsStr.indexOf(",") != -1) {
              funcArgs = argumentsStr.split(",");
            } else {
              funcArgs = [argumentsStr];
            }
          }
        } else {
          funcName = changeAction;
          funcArgs = null;
        }
        if (funcName !== null) {
          try {
            let changeActfunction = null;
            if (!this.changeActionsNamesArr.includes(funcName)) {
              const module = await import(
                `../../../../assets/changeActions/${funcName}.js`
              );
              changeActfunction = module.default;
              this.changeActions.push({
                name: funcName,
                functionDetails: module.default,
              });
              this.changeActionsNamesArr.push(funcName);
            } else {
              let filtered = this.changeActions.filter(
                (item) => item.name == funcName
              );
              if (filtered.length > 0) {
                changeActfunction = filtered[0].functionDetails;
              }
            }
            if (changeActfunction != null) {
              if (funcArgs != null) {
                await changeActfunction.call(this, this, funcArgs, uiField);
              } else {
                await changeActfunction.call(this, this, uiField);
              }
            }
          } catch (ex) {
            console.log(ex);
            console.log(
              `invalid change action defined in UI specs: ${changeAction} for field ${uiField.id}`
            );
          }
        }
      }
    });
  };
  addRequiredValidator = (uiField, controlId, language) => {
    this.addValidators(uiField, controlId, language);
    //This required to force validations to apply
    this.userForm.controls[controlId].setValue(
      this.userForm.controls[controlId].value
    );
  };

  /**
   * This function will reset the value of the hidden field in the form.
   * @param uiField
   */
  removeValidators = (uiField) => {
    this.dataCaptureLanguages.forEach((language, i) => {
      let controlId = "";
      if (this.isControlInMultiLang(uiField) && myFlag === false) {
        controlId = uiField.id + "_" + language;
        this.userForm.controls[controlId].clearValidators();
        this.userForm.controls[controlId].updateValueAndValidity();
      } else if (i == 0 && myFlag === false) {
        controlId = uiField.id;
        this.userForm.controls[controlId].clearValidators();
        this.userForm.controls[controlId].updateValueAndValidity();
      }
    });
  };

  //malay
  processConditionalRequiredValidations(identityFormData, uiField) {
    return new Promise<void>((resolve, reject) => {
      let facts = {};
      if (uiField && uiField.requiredCondition && uiField.requiredCondition != "") {
        /** Construct a fact to be consumed by the json-rule-engine based on 
         * parent field value.
         */
        if (uiField.parentField) {
          for (const field of uiField.parentField) {
            const parentFieldValue = identityFormData.identity[field.fieldId];
          }
        }
        const addValidatorsFunc = this.addRequiredValidator;
        const removeValidatorFunc = this.removeValidators;
        const isControlInMultiLangFunc = this.isControlInMultiLang;
        const dataCaptureLanguages = this.dataCaptureLanguages;
        let requiredRule = new Rule({
          conditions: uiField.requiredCondition,
          onSuccess() {
            //in "requiredCondition" is statisfied then validate the field as required
            uiField.required = true;
            dataCaptureLanguages.forEach((language, i) => {
              let controlId = "";
              if (isControlInMultiLangFunc(uiField)) {
                controlId = uiField.id + "_" + language;
                addValidatorsFunc(uiField, controlId, language);
              } else if (i == 0) {
                controlId = uiField.id;
                addValidatorsFunc(uiField, controlId, language);
              }
            });
          },
          onFailure() {
            //in "requiredCondition" is not statisfied then validate the field as not required
            uiField.required = false;
            if(!myFlag){
              
            removeValidatorFunc(uiField);
            }

            dataCaptureLanguages.forEach((language, i) => {
              let controlId = "";
              if (isControlInMultiLangFunc(uiField)) {
                controlId = uiField.id + "_" + language;
                addValidatorsFunc(uiField, controlId, language);
              } else if (i == 0) {
                controlId = uiField.id;
                addValidatorsFunc(uiField, controlId, language);
              }
            });

          },
          event: {
            type: "message",
            params: {
              data: "",
            },
          },
        });
        this.jsonRulesEngine.addRule(requiredRule);
        this.jsonRulesEngine
          .run(identityFormData)
          .then((results) => {
            results.events.map((event) =>
              console.log(
                "jsonRulesEngine for requiredConditions run successfully",
                event.params.data
              )
            );
            this.jsonRulesEngine.removeRule(requiredRule);
            resolve(); // Resolve the promise on success
          })
          .catch((error) => {
            console.log("err is", error);
            this.jsonRulesEngine.removeRule(requiredRule);
            reject(error);
          });
      }
    });
  }

  /**
   * @description This sets the default value,
   * imp for decision.
   *
   * @private
   * @memberof DemographicComponent
   */
  async processConditionalDefaultValue(identityFormData, uiField) {
    console.log("set default called");
    if (uiField && uiField.setDefaultValueCondition && uiField.setDefaultValueCondition !== "") {
      const defaultValueRule = new Rule({
        conditions: uiField.setDefaultValueCondition,
        event: {
          type: "defaultValueCheck",
          params: {
            message: "Default value condition validated",
          },
        },
      });
  
      this.jsonRulesEngine.addRule(defaultValueRule);
  
      try {
        const results = await this.jsonRulesEngine.run(identityFormData); // Await the result of the engine
        const isConditionSatisfied = results.events.some(
          (event) => event.type === "defaultValueCheck"
        );
        this.jsonRulesEngine.removeRule(defaultValueRule); // Cleanup rule
        return isConditionSatisfied ? "true" : "false";
      } catch (error) {
        console.error("Error in setDefaultValueCondition:", error);
        this.jsonRulesEngine.removeRule(defaultValueRule); // Cleanup rule
        return "false";
      }
    } else {
      return "false"; // Default to false if condition is missing
    }
  }
  
  /**
   * @description This sets the top location hierachy,
   * if update set the regions also.
   *
   * @private
   * @memberof DemographicComponent
   */
  private async setLocations() {
    this.locationHeirarchies.forEach(async (locationHeirarchyArr) => {
      locationHeirarchyArr.forEach(async (locationHeirarchy, index) => {
        let parentLocCode = null;
        let locationHierarchyName = null;
        this.identityData.forEach((obj) => {
          if (
            obj.inputRequired === true &&
            obj.controlType !== null &&
            !(obj.controlType === "fileupload")
          ) {
            if (obj.id == locationHeirarchy) {
              parentLocCode = obj.parentLocCode;
              locationHierarchyName = obj.locationHierarchyName;
            }
          }
        });
        if (!parentLocCode && index == 0) {
          parentLocCode = this.dataStorageService.getLocationMetadataHirearchy();
        }
        if (parentLocCode) 
        await this.loadLocationData(
          parentLocCode,
          locationHeirarchy,
          locationHierarchyName
        );
      }, this);
    }, this);
  }

  /**
 * @description This is to reset the input values
 * when the parent input value is changed
 *
 * @param fieldName location dropdown control Name
 */
  resetLocationFields(fieldName: string) {
    // Check if the fieldName is present in the disabledUiFields array
    const isFieldDisabled = disabledUiFields.some(uiField => uiField.id === fieldName);
    // Proceed only if the field is not present in the disabled fields array
    if (!isFieldDisabled) {
      if (this.isThisFieldInLocationHeirarchies(fieldName)) {
        const locationFields = this.getLocationHierarchy(fieldName);
        const index = locationFields.indexOf(fieldName);
        for (let i = index + 1; i < locationFields.length; i++) {
          let currentSelection = this.uiFields.find(uiField => uiField.id == fieldName);
          let childSelection = this.uiFields.find(uiField => uiField.id == locationFields[i]);
          if (childSelection.locationHierarchyLevel > currentSelection.locationHierarchyLevel) {
            this.userForm.controls[locationFields[i]].setValue("");
            this.userForm.controls[locationFields[i]].markAsUntouched();
          }
        }
      }
    }
  }

  /**
 * @description This is get the location the input values
 *
 * @param fieldName location dropdown control Name
 * @param locationCode location code of parent location
 */
  async loadLocationData(locationCode: string, fieldName: string, locationHierarchyName: string) {
    let promisesArr = [];
    if (fieldName && fieldName.length > 0) {
      this.dataCaptureLanguages.forEach(async (dataCaptureLanguage) => {
        promisesArr.push(new Promise((resolve) => {
          this.subscriptions.push(
            this.dataStorageService
              .getLocationImmediateHierearchy(dataCaptureLanguage, locationCode, locationHierarchyName)
              .subscribe(
                (response) => {
                  console.log("fetched locations for: " + fieldName + ": " + dataCaptureLanguage);
                  if (response[appConstants.RESPONSE]) {
                    response[appConstants.RESPONSE][
                      appConstants.DEMOGRAPHIC_RESPONSE_KEYS.locations
                    ].forEach((element) => {
                      let codeValueModal: CodeValueModal = {
                        valueCode: element.code,
                        valueName: element.name,
                        languageCode: element.langCode,
                      };
                      this.selectOptionsDataArray[`${fieldName}`].push(codeValueModal);
                    });
                  }
                  resolve(true);
                },
                (error) => {
                  //loading locations can be fail proof, no need to display err promt to user
                  //this.showErrorMessage(error);
                }
              )
          );
        }));
      });
    }
    return promisesArr;
  }

  /**
   * @description This is to get the list of gender available in the master data.
   *
   * @private
   * @memberof DemographicComponent
   */
  private async setGender() {
    await this.getGenderDetails();
    await this.populateSelectOptsDataArr(
      appConstants.controlTypeGender,
      this.genders,
      null
    );
  }

  async getDynamicFieldValues(pageNo) {
    let pageNumber;
    if (pageNo == null) {
      pageNumber = 0;
    } else {
      pageNumber = pageNo;
    }
    return new Promise((resolve) => {
      this.subscriptions.push(
        this.dataStorageService
          .getDynamicFieldsandValuesForAllLang(pageNumber)
          .subscribe(
            async (response) => {
              let dynamicField = response[appConstants.RESPONSE]["data"];
              this.dynamicFields.forEach((field) => {
                dynamicField.forEach((res) => {
                  if (field.subType === res.name || field.id === res.name) {
                    this.populateSelectOptsDataArr(
                      field.id,
                      res["fieldVal"],
                      res["langCode"]
                    );
                  }
                  // else if(res.name==appConstants.NOTIFICATION_OF_CHANGE.userServiceTypeCop){
                  //   const fieldValArray1 = res["fieldVal"];
                  //   const notificationOfChangeServiceType = fieldValArray1.map(item => item.code);
                  //   this.notificationOfChangeServiceType = notificationOfChangeServiceType;
                  // }
                  else if(res.name==appConstants.NOTIFICATION_OF_CHANGE.nameFields){
                    const fieldValArray = res["fieldVal"];
                    const notificationOfChangeNameFields = fieldValArray.map(item => item.value);
                    this.notificationOfChangeNameFields = notificationOfChangeNameFields;
                  }
                  else if(res.name==appConstants.NOTIFICATION_OF_CHANGE.removeFields){
                    const fieldValArray = res["fieldVal"];
                    const notificationOfChangeRemoveFields = fieldValArray.map(item => item.value);
                    this.notificationOfChangeRemoveFields = notificationOfChangeRemoveFields;
                  }
                });
              });
              let totalPages = response[appConstants.RESPONSE]["totalPages"];
              if (totalPages) {
                totalPages = Number(totalPages);
              }
              pageNumber = pageNumber + 1;
              if (totalPages > pageNumber) {
                await this.getDynamicFieldValues(pageNumber);
                resolve(true);
              } else {
                resolve(true);
              }
            },
            (error) => {
              this.showErrorMessage(error);
            }
          )
      );
    });
  }

  /**
   * @description This is to get the list of gender available in the master data.
   *
   * @private
   * @memberof DemographicComponent
   */
  private async setResident() {
    await this.getResidentDetails();
    await this.populateSelectOptsDataArr(
      appConstants.controlTypeResidenceStatus,
      this.residenceStatus,
      null
    );
  }

  /**
   * @description This set the initial values for the form attributes.
   *
   * @memberof DemographicComponent
   */
  async setFormControlValues() {
    return new Promise(async (resolve) => {
      if (!this.dataModification) {
        this.uiFields.forEach((control, index) => {
          this.dataCaptureLanguages.forEach((language, i) => {
            if (this.isControlInMultiLang(control)) {
              const controlId = control.id + "_" + language;
              this.userForm.controls[`${controlId}`].setValue("");
            } else if (i == 0) {
              const controlId = control.id;
              this.userForm.controls[`${controlId}`].setValue("");
            }
          });
        });
        resolve(true);
      } else {
        this.loggerService.info("user", this.user);
        if (this.user.request === undefined) {
          await this.getUserInfo(this.preRegId);
        }
        let promisesResolved = [];
        this.uiFields.forEach(async (control, index) => {
          if (this.user.request.demographicDetails.identity[control.id]) {
            if (this.isControlInMultiLang(control)) {
              this.dataCaptureLanguages.forEach((language, i) => {
                const controlId = control.id + "_" + language;
                let dataArr = this.user.request.demographicDetails.identity[
                  control.id
                ];
                if (Array.isArray(dataArr)) {
                  dataArr.forEach((dataArrElement) => {
                    if (dataArrElement.language == language) {
                      this.userForm.controls[`${controlId}`].setValue(
                        dataArrElement.value
                      );
                    }
                  });
                }
              });
            } else {
              if (control.controlType === "ageDate") {
                this.setDateOfBirth(control.id);
              }
              if (control.controlType === "ageDateCop") {
                this.setDateOfBirthCop(control.id);
              }
              if (control.controlType === "date") {
                this.setDate(control.id);
              }
              else if (control.type === "string") {
                this.userForm.controls[`${control.id}`].setValue(
                  this.user.request.demographicDetails.identity[`${control.id}`]
                );
              }
              else if (control.type === "simpleType") {
                this.userForm.controls[`${control.id}`].setValue(
                  this.user.request.demographicDetails.identity[control.id][0]
                    .value
                );
              }
              if (
                control.controlType === "dropdown" ||
                control.controlType === "button"
              ) {
                if (this.isThisFieldInLocationHeirarchies(control.id)) {
                  const locationIndex = this.getIndexInLocationHeirarchy(
                    control.id
                  );
                  const parentLocationName = this.getLocationNameFromIndex(
                    control.id,
                    locationIndex - 1
                  );
                  if (parentLocationName) {
                    let locationCode = this.userForm.controls[parentLocationName].value;
                    if (locationCode) {
                      console.log("hi")
                      console.log(`fetching locations for: ${control.id}`);
                      console.log(`with parent: ${parentLocationName} having value: ${locationCode}`);
                      promisesResolved.push(await this.loadLocationData(locationCode, control.id, control.locationHierarchyName));
                      console.log(this.selectOptionsDataArray[control.id]);
                    }
                  }
                }
              }
            }
          }
        });
        Promise.all(promisesResolved).then((values) => {
          resolve(true);
        });
      }
    });
  }


  /**
   * @description This will get the gender details from the master data.
   *
   * @private
   * @returns
   * @memberof DemographicComponent
   */
  private getGenderDetails() {
    return new Promise((resolve) => {
      this.subscriptions.push(
        this.dataStorageService.getGenderDetails().subscribe(
          (response) => {
            if (response[appConstants.RESPONSE]) {
              this.genders =
                response[appConstants.RESPONSE][
                appConstants.DEMOGRAPHIC_RESPONSE_KEYS.genderTypes
                ];
              resolve(true);
            } else {
              //this.onError(this.errorlabels.error, "");
            }
          },
          (error) => {
            this.loggerService.error("Unable to fetch gender");
          }
        )
      );
    });
  }

  /**
   * @description This will get the residenceStatus
   * details from the master data.
   *
   * @private
   * @returns
   * @memberof DemographicComponent
   */
  private getResidentDetails() {
    return new Promise((resolve) => {
      this.subscriptions.push(
        this.dataStorageService.getResidentDetails().subscribe(
          (response) => {
            if (response[appConstants.RESPONSE]) {
              this.residenceStatus =
                response[appConstants.RESPONSE][
                appConstants.DEMOGRAPHIC_RESPONSE_KEYS.residentTypes
                ];
              resolve(true);
            } else {
              //this.onError(this.errorlabels.error, "");
            }
          },
          (error) => {
            this.loggerService.error("Unable to fetch Resident types");
          }
        )
      );
    });
  }

  setDateOfBirth(controlId: string) {
    let formattedBirth = this.user.request.demographicDetails.identity[controlId];
    formattedBirth = formattedBirth.split('/').reverse().join('/');
    const dateValStr = formattedBirth;
    const dateMomentObj = moment(dateValStr, this.serverDtFormat, true);
    if (dateMomentObj.isValid()) {
      let calcAge = this.calculateAge(dateValStr).toString();
      if (calcAge !== "" && Number(calcAge) > -1) {
        this.currentAge = calcAge;
      }
      this.userForm.controls[controlId].setValue(dateValStr);
      this.userForm.controls[`${controlId}_dateCtrl`].setValue(dateMomentObj);
    }
  }
  
  setDateOfBirthCop(controlId: string) {
    let formattedBirth = this.user.request.demographicDetails.identity[controlId];
    formattedBirth = formattedBirth.split('/').reverse().join('/');
    const dateValStr = formattedBirth;
    const dateMomentObj = moment(dateValStr, this.serverDtFormat, true);
    if (dateMomentObj.isValid()) {
      let calcAgeCop = this.calculateAge(dateValStr).toString();
      if (calcAgeCop !== "" && Number(calcAgeCop) > -1) {
        this.currentAgeCop = calcAgeCop;
      }
      this.userForm.controls[controlId].setValue(dateValStr);
      this.userForm.controls[`${controlId}_dateCtrl`].setValue(dateMomentObj);
    }
  }

  setDate(controlId: string) {
    const dateValStr = this.user.request.demographicDetails.identity[controlId];
    const dateMomentObj = moment(dateValStr, this.serverDtFormat, true);
    if (dateMomentObj.isValid()) {
      this.userForm.controls[controlId].setValue(dateMomentObj);
    }
  }

  /**
   * @description This is called when age is changed and the date of birth will get calculated.
   *
   * @memberof DemographicComponent
   */
  onAgeChange(dateFieldId: string) {
    this.defaultDay = this.config[
      appConstants.CONFIG_KEYS.mosip_default_dob_day
    ];
    this.defaultMonth = this.config[
      appConstants.CONFIG_KEYS.mosip_default_dob_month
    ];
    this.agePattern = this.config[
      appConstants.CONFIG_KEYS.mosip_id_validation_identity_age
    ];
    const ageRegex = new RegExp(this.agePattern);

    if (dateFieldId === this.dateOfBirthFieldId) {
      const ageVal = this.age.nativeElement.value;
      if (ageVal) {
        if (
          ageRegex.test(ageVal) &&
           Number(ageVal) > -1 &&
            Number(ageVal) < 150
          ) {
          this.currentAge = ageVal;
        }
  
        const now = new Date();
        const calculatedYear = now.getFullYear() - Number(ageVal);
        const newDate = `${calculatedYear}/${this.defaultMonth}/${this.defaultDay}`;
        const newMomentObj = moment(newDate, this.serverDtFormat);
        this.userForm.controls[dateFieldId].setValue(newDate);
        this.userForm.controls[`${dateFieldId}_dateCtrl`].setValue(
          newMomentObj
        );
        this.userForm.controls[dateFieldId].setErrors(null);
        if (this.dataModification) {
          this.hasDobChangedFromChildToAdult(dateFieldId);
        }
      } else {
        this.resetAgeFields(dateFieldId);
      }
    }else if (dateFieldId === this.dateOfBirthFieldIdCop) {
      const ageValCop = this.ageCop.nativeElement.value;
      if (ageValCop) {
        if (ageRegex.test(ageValCop) && Number(ageValCop) > -1 && Number(ageValCop) < 150) {
          this.currentAgeCop = ageValCop;
        }
  
        const now = new Date();
        const calculatedYear = now.getFullYear() - Number(ageValCop);
        const newDate = `${calculatedYear}/${this.defaultMonth}/${this.defaultDay}`;
        const newMomentObj = moment(newDate, this.serverDtFormat);
  
        this.userForm.controls[dateFieldId].setValue(newDate);
        this.userForm.controls[`${dateFieldId}_dateCtrl`].setValue(newMomentObj);
        this.userForm.controls[dateFieldId].setErrors(null);
  
        if (this.dataModification) {
          this.hasDobChangedFromChildToAdult(dateFieldId);
        }
      } else {
        this.resetAgeFields(dateFieldId);
      }
    } 
  }
  
  resetAgeFields(dateFieldId: string) {
    this.userForm.controls[dateFieldId].setValue("");
    this.userForm.controls[dateFieldId].markAsTouched();
    this.userForm.controls[dateFieldId].setErrors({ incorrect: true });
  
    if (dateFieldId === this.dateOfBirthFieldId) {
      this.currentAge = "";
      this.age.nativeElement.value = "";
    } else if (dateFieldId === this.dateOfBirthFieldIdCop) {
      this.currentAgeCop = "";
      this.ageCop.nativeElement.value = "";
    }
  }

  /**
   * @description This is called whenever there is a change in Date of birth field and accordingly age
   * will get calculate.
   *
   * @memberof DemographicComponent
   */
  onDOBChange(controlId: string) {
    const dtCtrlId = controlId + "_dateCtrl";
    const newDtMomentObj = this.userForm.controls[`${dtCtrlId}`].value;
    if (newDtMomentObj && newDtMomentObj.isValid()) {
      newDtMomentObj.locale("en-GB");
      let formattedDt = newDtMomentObj.format(this.serverDtFormat);
  
      if (controlId === this.dateOfBirthFieldId) {
        let calcAge = this.calculateAge(formattedDt).toString();
        if (calcAge !== "" && Number(calcAge) > -1) {
          this.currentAge = calcAge;
          this.age.nativeElement.value = this.currentAge;
        }

        this.userForm.controls[controlId].setValue(formattedDt);
        if (this.dataModification) {
          this.hasDobChangedFromChildToAdult(controlId);
        }
      } else if(controlId === this.dateOfBirthFieldIdCop) {
        let calcAgeCop = this.calculateAge(formattedDt).toString();
        if (calcAgeCop !== "" && Number(calcAgeCop) > -1) {
          this.currentAgeCop = calcAgeCop;
          this.ageCop.nativeElement.value = this.currentAgeCop;
        }

        this.userForm.controls[controlId].setValue(formattedDt);
  
        if (this.dataModification) {
          this.hasDobChangedFromChildToAdult(controlId);
        }
      }else {
        this.resetDOBFields(controlId);
      }
    } else {
      this.resetDOBFields(controlId);
    }
  }
  
  resetDOBFields(controlId: string) {
    this.userForm.controls[controlId].setValue("");
    this.userForm.controls[controlId].markAsTouched();
    this.userForm.controls[controlId].setErrors({ incorrect: true });
  
    if (controlId === this.dateOfBirthFieldId) {
      this.currentAge = "";
      this.age.nativeElement.value = "";
    } else if (controlId === this.dateOfBirthFieldIdCop) {
      this.currentAgeCop = "";
      this.ageCop.nativeElement.value = "";
    }
  }

  /**
   * @description This method calculates the age for the given date.
   *
   * @param {Date} bDay
   * @returns
   * @memberof DemographicComponent
   */
  calculateAge(dateStr: string) {
    if (moment(dateStr, this.serverDtFormat, true).isValid()) {
      const now = new Date();
      const born = new Date(dateStr);
      const years = Math.floor(
        (now.getTime() - born.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
      );
      if (years > 150 || years < 0) {
        return "";
      } else {
        return years;
      }
    }
    return "";
  }

  /**
   * @description This will filter the gender on the basis of langugae code.
   *
   * @private
   * @param {string} langCode
   * @param {*} [genderEntity=[]]
   * @param {*} entityArray
   * @memberof DemographicComponent
   */
  private populateSelectOptsDataArr(
    field: string,
    entityArray: any,
    langCode: string
  ) {
    return new Promise((resolve, reject) => {
      if (entityArray) {
        entityArray.map((element: any) => {
          let codeValue: CodeValueModal;
          if (element.genderName) {
            codeValue = {
              valueCode: element.code,
              valueName: element.genderName,
              languageCode: element.langCode,
            };
          } else if (element.name) {
            codeValue = {
              valueCode: element.code,
              valueName: element.name,
              languageCode: element.langCode,
            };
          } else {
            codeValue = {
              valueCode: element.code,
              valueName: element.value,
              languageCode: langCode,
            };
          }
          this.selectOptionsDataArray[field].push(codeValue);
          resolve(true);
        });
      }
    });
  }

  filterOptionsOnLang(field: string, langCode: string) {
    if (this.selectOptionsDataArray[field]) {
      return this.selectOptionsDataArray[field].filter(
        (item) => item.languageCode === langCode
      );
    } else {
      return [];
    }
  }

  getTitleForOptionInOtherLangs(
    field: string,
    optionValueCode: string,
    langCode: string
  ) {
    let title = "";
    if (this.selectOptionsDataArray[field]) {
      let otherLangOptionsArr = this.selectOptionsDataArray[field].filter(
        (item) =>
          item.languageCode !== langCode &&
          this.dataCaptureLanguages.includes(item.languageCode)
      );
      if (otherLangOptionsArr) {
        otherLangOptionsArr.forEach((element, i) => {
          if (element.valueCode === optionValueCode) {
            if (i !== 0) {
              title += " ";
            }
            title += element.valueName;
          }
        });
      }
    }
    return title;
  }

  getLabelsInAllLangsForSelectedOpt(field: string, optionValueCode: string) {
    let labels = [];
    if (this.selectOptionsDataArray[field]) {
      let allLangOptionsArr = this.selectOptionsDataArray[field];
      if (allLangOptionsArr) {
        allLangOptionsArr.forEach((element: any, i: number) => {
          if (
            element.valueCode === optionValueCode &&
            this.dataCaptureLanguages.includes(element.languageCode)
          ) {
            labels.push({
              langCode: element.languageCode,
              label: element.valueName,
            });
          }
        });
      }
    }
    return labels;
  }

  /**
   * @description This is to get the top most location Hierarchy, i.e. `Country Code`
   *
   * @returns
   * @memberof DemographicComponent
   */
  getLocationMetadataHirearchy() {
    return new Promise((resolve) => {
      const uppermostLocationHierarchy = this.dataStorageService.getLocationMetadataHirearchy();
      this.uppermostLocationHierarchy = uppermostLocationHierarchy;
      resolve(this.uppermostLocationHierarchy);
    });
  }

  /**
   * @description On click of back button the user will be navigate to dashboard.
   *
   * @memberof DemographicComponent
   */
  onBack() {
    let url = "";
    url = Utils.getURL(this.router.url, "dashboard", 2);
    this.router.navigate([url]);
  }

  /**
   * @description This is used for the tranliteration.
   *
   * @param {FormControl} fromControl
   * @param {*} toControl
   * @memberof DemographicComponent
   */
  onTransliteration(
    fromLang: string,
    toLang: string,
    fromFieldName: string,
    toFieldName: string
  ) {
    if (this.userForm.controls[fromFieldName].value !== "") {
      let fromVal = this.userForm.controls[fromFieldName].value;

      const request: any = {
        from_field_lang: fromLang,
        from_field_value: fromVal,
        to_field_lang: toLang,
      };
      this.subscriptions.push(
        this.dataStorageService.getTransliteration(request).subscribe(
          (response) => {
            if (response[appConstants.RESPONSE]) {
              this.userForm.controls[toFieldName].patchValue(
                response[appConstants.RESPONSE].to_field_value
              );
            }
          },
          (error) => {
          }
        )
      );
    }
  }

  /**
   * @description This is a custom validator, which check for the white spaces.
   *
   * @private
   * @param {FormControl} control
   * @returns
   * @memberof DemographicComponent
   */
  private noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || "").trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  /**
   * @description This is called to submit the user form in case od modify or create.
   *
   * @memberof DemographicComponent
   */
  onSubmit() {
    console.log("this.stateCtrl.value");
    if (this.readOnlyMode) {
      this.redirectUser();
    } else {
      this.isSubmitted = true;
      this.uiFields.forEach((control) => {
        this.dataCaptureLanguages.forEach((language, i) => {
          if (this.isControlInMultiLang(control)) {
            const controlId = control.id + "_" + language;
            this.userForm.controls[`${controlId}`].markAsTouched();
          } else if (i == 0) {
            const controlId = control.id;
            this.userForm.controls[`${controlId}`].markAsTouched();
          }
        });
      });
      if(this.userService==appConstants.USER_SERVICE.UPDATE){
        this.nameFieldsCopValidation();
      }
      console.log(this.userForm.valid)

      console.log(this.filledFields);
      const filledFields = Object.keys(this.userForm.controls).filter(key => {
        return this.userForm.controls[key].value !== null && this.userForm.controls[key].value !== '';
      }).length;

      console.log(`Number of filled fields: ${filledFields}`);
      this.filledFieldCount = filledFields;
      
      // Log the filled count separately
      console.log('Number of filled fields:', this.filledFieldCount);

      if (this.userForm.valid) {
        //malay-popup
        // open dialog for confirming 
        const message = "Please review your details before proceeding to the next section.";
        const ok_text = "Proceed";
        const cancel_text = "Review Details";
        const body = {
          case: "CONFIRMATION",
          textDir: this.userPrefLanguageDir,
          message: message,
          yesButtonText: ok_text,
          noButtonText: cancel_text,
        };
        this.dialog
          .open(DialougComponent, { width: "400px", data: body })
          .beforeClosed()
          .subscribe((res) => {
            if (res === true) {
              const identity = this.createIdentityJSONDynamic(false);
              const request = this.createRequestJSON(identity);
              console.log(request);
              const responseJSON = this.createResponseJSON(identity);
              console.log("this.dataModification:: " + this.dataModification);
              this.dataUploadComplete = false;
              if (this.dataModification) {
                this.subscriptions.push(
                  this.dataStorageService
                    .updateUser(request, this.preRegId)
                    .subscribe(
                      (response) => {
                        this.redirectUser();
                      },
                      (error) => {
                        this.loggerService.error(JSON.stringify(error));
                        const errCode = Utils.getErrorCode(error);
                        if (errCode === appConstants.ERROR_CODES.invalidPin) {
                          this.formValidation(error);
                        }
                        this.showErrorMessage(error);
                      }
                    )
                );
              } else {
                this.subscriptions.push(
                  this.dataStorageService.addUser(request).subscribe(
                    (response) => {
                      this.preRegId =
                        response[appConstants.RESPONSE].preRegistrationId;
                      this.redirectUser();
                    },
                    (error) => {
                      this.loggerService.error(JSON.stringify(error));
                      const errCode = Utils.getErrorCode(error);
                      if (errCode === appConstants.ERROR_CODES.invalidPin) {
                        this.formValidation(error);
                      }
                      this.showErrorMessage(error);
                    }
                  )
                );
              }

            }
            else {
              //else cancel is clicked can explicitly re-route to the same page or leave 
              //as it is. it will show the same page.
            }
          });
      }
    }
  }

  formValidation(response: any) {
    const str =
      response[appConstants.ERROR][appConstants.NESTED_ERROR][0]["message"];
    const attr = str.substring(str.lastIndexOf("/") + 1);
    this.userForm.controls[attr].setErrors({
      incorrect: true,
    });
  }

  /**
   * @description After sumission of the form, the user is route to file-upload or preview page.
   *
   * @memberof DemographicComponent
   */
  redirectUser() {
    this.canDeactivateFlag = false;
    this.checked = true;
    this.dataUploadComplete = true;
    let url = "";
    if (
      localStorage.getItem(appConstants.MODIFY_USER_FROM_PREVIEW) === "true" &&
      this.preRegId
    ) {
      // modify open dialog
      const message = "You have successfuly modified registration details";
      const body = {
        case: "MESSAGE",
        textDir: this.userPrefLanguageDir,
        message: message,
      };

      this.dialog
        .open(DialougComponent, {
          width: "400px",
          data: body,
          disableClose: true,
        })
        .beforeClosed()
        .subscribe((res) => {
          if (res === true) {
            url = Utils.getURL(this.router.url, "summary");
            localStorage.setItem(
              appConstants.MODIFY_USER_FROM_PREVIEW,
              "false"
            );
            this.router.navigateByUrl(url + `/${this.preRegId}/preview`);
          }
        });
    } else {
      url = Utils.getURL(this.router.url, "file-upload");
      localStorage.removeItem(appConstants.NEW_APPLICANT_FROM_PREVIEW);
      this.router.navigate([url, this.preRegId]);
    }
  }

  /**
   * @description THis is to create the attribute array for the Identity modal.
   *
   * @private
   * @param {string} element
   * @param {IdentityModel} identity
   * @memberof DemographicComponent
   */
  private createAttributeArray(element: string, identity) {
    let attr: any;
    if (typeof identity[element] === "object") {
      attr = [];
      for (let index = 0; index < this.dataCaptureLanguages.length; index++) {
        const languageCode = this.dataCaptureLanguages[index];
        let controlId = element + "_" + languageCode;
        if (this["userForm"].controls[`${controlId}`]) {
          attr.push(
            new AttributeModel(
              languageCode,
              this["userForm"].controls[`${controlId}`].value
            )
          );
        } else {
          controlId = element;
          if (this["userForm"].controls[`${controlId}`]) {
            const elementVal = this["userForm"].controls[`${controlId}`].value;
            attr.push(new AttributeModel(languageCode, elementVal));
          }
        }
      }
    } else if (
      typeof identity[element] === "string" &&
      this.userForm.controls[`${element}`]
    ) {
      const momentObj = moment(
        this.userForm.controls[`${element}`].value,
        this.serverDtFormat,
        true
      );
      if (momentObj.isValid()) {
        momentObj.locale("en-GB");
        attr = momentObj.format(this.serverDtFormat);
      } else {
        attr = this.userForm.controls[`${element}`].value;
      }
    } else if (
      typeof identity[element] === "boolean" &&
      this.userForm.controls[`${element}`]
    ) {
      attr = this.userForm.controls[`${element}`].value;
    }
    identity[element] = attr;
    
  }

  /**
   * @description This method mark all the form control as touched
   *
   * @private
   * @param {FormGroup} formGroup
   * @memberof DemographicComponent
   */
  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }


  /**
   * @description This is to create the request modal.
   *
   * @private
   * @param {IdentityModel} identity
   * @returns
   * @memberof DemographicComponent
   */
  private createRequestJSON(identity) {
    let langCode = this.dataCaptureLanguages[0];
    if (this.user.request) {
      langCode = this.user.request.langCode;
    }
    let requiredFields = [];
    this.identityData.forEach((field) => {
      if (field.required === true && !(field.controlType === "fileupload")) {
        requiredFields.push(field.id);
      }
    });
    const request = {
      langCode: langCode,
      requiredFields: requiredFields,
      demographicDetails: identity,
    };
    return request;
  }

  /**
   * @description This is the response modal.
   *
   * @private
   * @param {IdentityModel} identity
   * @returns
   * @memberof DemographicComponent
   */
  private createResponseJSON(identity) {
    let preRegistrationId = "";
    let createdBy = this.loginId;
    let createdDateTime = Utils.getCurrentDate();
    let updatedDateTime = "";
    let langCode = this.dataCaptureLanguages[0];
    if (this.user.request) {
      preRegistrationId = this.preRegId;
      createdBy = this.user.request.createdBy;
      createdDateTime = this.user.request.createdDateTime;
      updatedDateTime = Utils.getCurrentDate();
      langCode = this.user.request.langCode;
    }
    const req = {
      preRegistrationId: this.preRegId,
      createdBy: createdBy,
      createdDateTime: createdDateTime,
      updatedDateTime: updatedDateTime,
      langCode: langCode,
      demographicDetails: identity,
    };
    return req;
  }

  hasDobChangedFromChildToAdult(controlId: string) {
    const currentDob = this.user.request.demographicDetails.identity[controlId];
    const changedDob = this.userForm.controls[controlId].value;
    if (
      moment(currentDob, this.serverDtFormat, true).isValid() &&
      moment(changedDob, this.serverDtFormat, true).isValid()
    ) {
      const currentDobYears = this.calculateAge(currentDob);
      const changedDobYears = this.calculateAge(changedDob);
      const ageToBeAdult = this.config[
        appConstants.CONFIG_KEYS.mosip_adult_age
      ];
      if (this.showPreviewButton) {
        if (
          (currentDobYears < ageToBeAdult && changedDobYears < ageToBeAdult) ||
          (currentDobYears > ageToBeAdult && changedDobYears > ageToBeAdult)
        ) {
          this.showPreviewButton = true;
        } else {
          this.showPreviewButton = false;
          localStorage.setItem(appConstants.MODIFY_USER_FROM_PREVIEW, "false");
        }
      }
    }
  }

  checkToShowLangChangeBtn = () => {
    const mandatoryLanguages = Utils.getMandatoryLangs(this.configService);
    const optionalLanguages = Utils.getOptionalLangs(this.configService);
    const maxLanguage = Utils.getMaxLangs(this.configService);
    if (
      maxLanguage > 1 &&
      optionalLanguages.length > 0 &&
      maxLanguage !== mandatoryLanguages.length
    ) {
      this.showChangeDataCaptureLangBtn = true;
    }
  };

  changeDataCaptureLanguages = () => {
    if (this.userForm.dirty) {
      const message = this.demographiclabels["change_data_capture_langs_msg"];
      const ok_text = this.dialoglabels["action_ok"];
      const no_text = this.dialoglabels["title_discard"];
      const body = {
        case: "CONFIRMATION",
        textDir: this.userPrefLanguageDir,
        message: message,
        yesButtonText: ok_text,
        noButtonText: no_text,
      };
      this.dialog
        .open(DialougComponent, { width: "400px", data: body })
        .beforeClosed()
        .subscribe((res) => {
          if (res === true) {
            this.canDeactivateFlag = false;
            this.showLangSelectionPopup();
          }
        });
    } else {
      this.canDeactivateFlag = false;
      this.showLangSelectionPopup();
    }
  };

  /**
   * This method navigate the user to demographic page if user clicks on Change Data Capture Languages
   */
  async showLangSelectionPopup() {
    const mandatoryLanguages = Utils.getMandatoryLangs(this.configService);
    const maxLanguage = Utils.getMaxLangs(this.configService);
    const minLanguage = Utils.getMinLangs(this.configService);
    await this.openLangSelectionPopup(
      mandatoryLanguages,
      minLanguage,
      maxLanguage
    );
    if (this.isNavigateToDemographic) {
      let dataCaptureLanguagesLabels = Utils.getLanguageLabels(
        localStorage.getItem(appConstants.DATA_CAPTURE_LANGUAGES),
        localStorage.getItem(appConstants.LANGUAGE_CODE_VALUES)
      );
      localStorage.setItem(
        appConstants.DATA_CAPTURE_LANGUAGE_LABELS,
        JSON.stringify(dataCaptureLanguagesLabels)
      );
      localStorage.setItem(appConstants.MODIFY_USER, "false");
      localStorage.setItem(appConstants.NEW_APPLICANT, "true");
      let previousUrl = this.routerService.getPreviousUrl();
      const newUrl = `/${this.userPrefLanguage}/pre-registration/demographic/new`;
      if (previousUrl === newUrl) {
        previousUrl = `${this.userPrefLanguage}/dashboard`;
      }
      this.router
        .navigateByUrl(previousUrl, { skipLocationChange: true })
        .then(() => {
          this.router.navigate([newUrl]);
        });
    }
  }

  openLangSelectionPopup(
    mandatoryLanguages: string[],
    minLanguage: Number,
    maxLanguage: Number
  ) {
    return new Promise((resolve) => {
      const popupAttributes = Utils.getLangSelectionPopupAttributes(
        this.userPrefLanguageDir,
        this.dataCaptureLabels,
        mandatoryLanguages,
        minLanguage,
        maxLanguage,
        this.userPrefLanguage
      );
      const dialogRef = this.openDialog(popupAttributes, "550px", "350px");
      dialogRef.afterClosed().subscribe((res) => {
        if (res == undefined) {
          this.isNavigateToDemographic = false;
        } else {
          let reorderedArr = Utils.reorderLangsForUserPreferredLang(
            res,
            this.userPrefLanguage
          );
          localStorage.setItem(
            appConstants.DATA_CAPTURE_LANGUAGES,
            JSON.stringify(reorderedArr)
          );
          this.isNavigateToDemographic = true;
        }
        resolve(true);
      });
    });
  }
  modifyopenDialog() { }
  openDialog(data, width, height?, panelClass?) {
    const dialogRef = this.dialog.open(DialougComponent, {
      width: width,
      height: height,
      data: data,
      restoreFocus: false,
    });
    return dialogRef;
  }

  /**
   * @description This is a dialoug box whenever an error comes from the server, it will appear.
   *
   * @private
   * @memberof DemographicComponent
   */
  private showErrorMessage(error: any) {
    this.dataUploadComplete = true;
    this.hasError = true;
    const titleOnError = this.errorlabels.errorLabel;
    const message = Utils.createErrorMessage(
      error,
      this.errorlabels,
      this.apiErrorCodes,
      this.config
    );
    const body = {
      case: "ERROR",
      title: titleOnError,
      message: message,
      yesButtonText: this.errorlabels.button_ok,
    };
    this.dialog.open(DialougComponent, {
      width: "400px",
      data: body,
    });
  }

  /**
   * @description This method is called to open a virtual keyvboard in the specified languaged.
   *
   * @param {string} formControlName
   * @param {number} index
   * @memberof DemographicComponent
   */
  openKeyboard(controlName: string, langCode: string) {
    let control: AbstractControl;
    let formControlName = controlName + "_" + langCode;
    let multiLangControls = [];
    let keyArr: any[] = Object.keys(this.userForm.controls);
    keyArr.forEach((key) => {
      this.uiFields.forEach((control) => {
        this.dataCaptureLanguages.forEach((language, i) => {
          if (
            this.isControlInMultiLang(control) &&
            !multiLangControls.includes(key)
          ) {
            const controlId = control.id + "_" + language;
            if (controlId == key) {
              multiLangControls.push(key);
            }
          }
        });
      });
    });
    let index = multiLangControls.indexOf(formControlName);
    if (index > -1) {
      let localeId = langCode.substring(0, 2);
      JSON.parse(
        localStorage.getItem(appConstants.LANGUAGE_CODE_VALUES)
      ).forEach((element) => {
        if (langCode === element.code && element.locale) {
          localeId = element.locale;
        }
      });
      if (localeId.indexOf("_") > -1) {
        localeId = localeId.substring(0, localeId.indexOf("_"));
      }
      if (this.userForm.controls[formControlName]) {
        control = this.userForm.controls[formControlName];
      }
      if (this.oldKeyBoardIndex == index && this.matKeyboardService.isOpened) {
        this.matKeyboardService.dismiss();
      } else {
        let el: ElementRef;
        this.oldKeyBoardIndex = index;
        el = this._attachToElementMesOne._results[index];
        el.nativeElement.focus();
        this._keyboardRef = this.matKeyboardService.open(localeId);
        this._keyboardRef.instance.setInputInstance(el);
        this._keyboardRef.instance.attachControl(control);
      }
    }
  }

  scrollUp(ele: HTMLElement) {
    ele.scrollIntoView({ behavior: "smooth" });
  }

  @HostListener("blur", ["$event"])
  @HostListener("focusout", ["$event"])
  private _hideKeyboard() {
    if (this.matKeyboardService.isOpened) {
      this.matKeyboardService.dismiss();
    }
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  getValidationErrorMessages() {
    debugger
    let error: any = this.getFormValidationErrors(this.userForm.controls).shift();
    if(error==null && this.userService==appConstants.USER_SERVICE.UPDATE){
      error=this.nameFieldsCopValidationError();
    }
    if (error) {
      let text;
      switch (error.error_name) {
        case 'nameCopRequired': text = `Any one of the field in Adding/removing of Name is required!`; break;
        case 'required': text = `${error.control_name}(${error.section_name}) is required!`; break;
        case 'pattern': text = `${error.control_name} has wrong pattern!`; break;
        case 'email': text = `${error.control_name} has wrong email format!`; break;
        case 'minlength': text = `${error.control_name} has wrong length! Required length: ${error.error_value.requiredLength}`; break;
        case 'areEqual': text = `${error.control_name} must be equal!`; break;
        default: text = `${error.control_name}(${error.section_name}) is invalid`;
      }
      return text;
    }
    return "";
  }

  getFormValidationErrors(controls: any): [] {
    let _this = this;
    let errors: any = [];
    Object.keys(controls).forEach(key => {
      const control = controls[key];
      if (control instanceof FormGroup) {
        errors = errors.concat(this.getFormValidationErrors(control.controls));
      }
      const controlErrors: any = controls[key].errors;
      if (controlErrors !== null) {
        Object.keys(controlErrors).forEach(keyError => {
          let label = _this.uiFields.find(f => f.id == key);
          if (!label) label = _this.uiFields.find(f => f.id == key.replace(/_[a-zA-Z]+$/, ''));
          let sectionName;
          if(this.userService==appConstants.USER_SERVICE.UPDATE && label.copAlignmentGroup)
            sectionName = label ? label.copAlignmentGroup : 'Unknown Section';
          else if(this.userService==appConstants.USER_SERVICE.FIRSTID && label.gfAlignmentGroup)
            sectionName = label ? label.gfAlignmentGroup : 'Unknown Section';
          else
            sectionName = label ? label.alignmentGroup : 'Unknown Section';

          if (label != null) {
            errors.push({
              section_name: sectionName,
              control_name: label.labelName instanceof String ? label.labelName : label.labelName[_this.userPrefLanguage],
              error_name: keyError,
              error_value: controlErrors[keyError]
            });
          }
        });
      }
    });
    return errors;
  }

  getLocationNameFromFieldId = (fieldId) => {
    let filtered = this.uiFields.find(uiField => uiField.id == fieldId);
    let parentField = this.uiFields.filter(uiField => uiField.locationHierarchyLevel ==
      filtered.locationHierarchyLevel - 1 && this.getLocationHierarchy(fieldId).indexOf(uiField.id) > -1);
    return (!Array.isArray(parentField) || !parentField.length) ? null : parentField;
  };

  isRenewalService(): boolean {
    if (this.userService === appConstants.USER_SERVICE.RENEWAL) {
      return true;
    }
    return false;
  }

  isCopService(): boolean {
    if (this.userService === appConstants.USER_SERVICE.UPDATE) {
      return true;
    }
    return false;
  }

  isGetFirstId(): boolean {
    if (this.userService === appConstants.USER_SERVICE.FIRSTID) {
      return true;
    }
    return false;
  }

  isReplacement(): boolean {
    if (this.userService === appConstants.USER_SERVICE.REPLACEMENT) {
      return true;
    }
    return false;
  }

  isByBirth(): boolean {
    if (this.userServiceType === appConstants.USER_SERVICETYPE.BYBIRTH) {
      return true;
    }
    return false;
  }

  nameFieldsCopValidation() {
    debugger
   // const nameFieldsUserServiceCopArr = this.notificationOfChangeServiceType;
    const nameFields = this.notificationOfChangeNameFields;
    const nameFieldsRemove = this.notificationOfChangeRemoveFields;
    //if (nameFieldsUserServiceCopArr.includes(this.userServiceTypeCop)) {
    if (this.copAddName && this.userForm.valid) {
      const hasValue = nameFields.some((field) => {
        const namefieldCop = this.userForm.controls[field];
        return namefieldCop && namefieldCop.value && namefieldCop.value.trim() !== "";
      });

      if (!hasValue) {
        this.userForm.setErrors({ invalidForm: true });
      }
    }
    if (this.removingName && this.userForm.valid) {
      const hasValidValue = nameFieldsRemove.some((field) => {
        const removeFieldCop = this.userForm.controls[field];
        return removeFieldCop && (removeFieldCop.value === true || removeFieldCop.value === "Y");
      });
    
      if (!hasValidValue) {
        this.userForm.setErrors({ invalidForm: true });
      }
    }
    
    
  }

  nameFieldsCopValidationError(): { control_name: string; error_name: string; error_value: boolean } | null {
        return {
          control_name: "nameFields",
          error_name: "nameCopRequired",
          error_value: true
        };
  }

  toggleUserButton(fieldId: string): void {
    const control = this.userForm.get(fieldId);
    if (control) {
      control.setValue(!control.value); // Toggle between true and false
    }
  }
  validateYearsLived(fieldId: string) {
    const control = this.userForm.get(fieldId);
    const yearsLived = this.userForm.controls[appConstants.APPLICANT_PLACE_OF_RESIDENCE_YEARS_LIVED_FIELD].value;
    if (this.userAge !== undefined && this.userAge !== null && yearsLived !== undefined && yearsLived !== null) {
      if (yearsLived >= this.userAge) {
        this.userForm.controls[appConstants.APPLICANT_PLACE_OF_RESIDENCE_YEARS_LIVED_FIELD].setErrors({
          yearsLivedInvalid: { message: "Years Lived should be less than the Age." }
        });
      } else {
        this.userForm.controls[appConstants.APPLICANT_PLACE_OF_RESIDENCE_YEARS_LIVED_FIELD].setErrors(null);
      }
    }
  }

  
  
}
