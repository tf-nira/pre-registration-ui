import { Component, OnInit, OnDestroy } from "@angular/core";
import * as html2pdf from "html2pdf.js";
import { MatDialog } from "@angular/material";
import { BookingService } from "../../booking/booking.service";
import { DialougComponent } from "src/app/shared/dialoug/dialoug.component";
import { TranslateService } from "@ngx-translate/core";
import { DataStorageService } from "src/app/core/services/data-storage.service";
import { NotificationDtoModel } from "src/app/shared/models/notification-model/notification-dto.model";
import { NotificationDtoModelv2 } from "src/app/shared/models/notification-model/notificationv2-dto.model";
import Utils from "src/app/app.util";
import * as appConstants from "../../../app.constants";
import { RequestModel } from "src/app/shared/models/request-model/RequestModel";
import { Subscription } from "rxjs";
import { ConfigService } from "src/app/core/services/config.service";
import { ActivatedRoute, Router } from "@angular/router";
import { NameList } from "src/app/shared/models/demographic-model/name-list.modal";
import { UserModel } from "src/app/shared/models/demographic-model/user.modal";
import { PRNRequestModel } from "src/app/shared/models/request-model/prnrequestModel";
import { PRNResponseModel } from "src/app/shared/models/request-model/prnresponseModel";
import { log } from "util";



@Component({
  selector: "app-acknowledgement",
  templateUrl: "./acknowledgement.component.html",
  styleUrls: ["./acknowledgement.component.css"],
})
export class AcknowledgementComponent implements OnInit, OnDestroy {
  usersInfoArr = [];
  ackDataArr = [];
  ackDataItem = {};
  guidelines = [];
  guidelinesDetails = [];
  pdfOptions = {};
  fileBlob: Blob;
  errorlabels: any;
  apiErrorCodes: any;
  showSpinner: boolean = true;
  PRN:string="";
  PRNerrorMessage="";
  amount:string="";
  bookingDataPrimary = "";
  bookingDataSecondary = "";
  subscriptions: Subscription[] = [];
  notificationTypes: string[];
  preRegIds: any;
  userService: any;
  isNavigateToDemographic = false;
  minLanguage: Number;
  maxLanguage: Number;
  dataCaptureLabels;
  mandatoryLanguages: string[];
  optionalLanguages: string[];
  loginId = "";
  isNewApplication = false;
  dataCaptureLangsDir = [];
  userPrefLanguage = localStorage.getItem("userPrefLanguage");
  userPreferredLangCode = localStorage.getItem("userPrefLanguage");
  ltrLangs = this.configService
    .getConfigByKey(appConstants.CONFIG_KEYS.mosip_left_to_right_orientation)
    .split(",");
  regCenterId = "10045";
  langCode;
  textDir = localStorage.getItem("dir");
  name = "";
  createdTime;
  requestBody: PRNRequestModel;
  applicantContactDetails = [];
  constructor(
    private bookingService: BookingService,
    private dialog: MatDialog,
    private translate: TranslateService,
    private dataStorageService: DataStorageService,
    private configService: ConfigService,
    private activatedRoute: ActivatedRoute,
     private router: Router
  ) {
    this.translate.use(localStorage.getItem("langCode"));
    this.langCode = localStorage.getItem("langCode");
  }

  async ngOnInit() {
    if (this.router.url.includes("multiappointment")) {
      this.preRegIds = [...JSON.parse(localStorage.getItem("multiappointment"))];
    } else {
      this.activatedRoute.params.subscribe((param) => {
        this.preRegIds = [param["appId"]];
      });
    }
    this.dataStorageService
      .getI18NLanguageFiles(this.langCode)
      .subscribe((response) => {
        this.errorlabels = response[appConstants.ERROR];
        this.apiErrorCodes = response[appConstants.API_ERROR_CODES];
      });
        this.name = this.configService.getConfigByKey(
          appConstants.CONFIG_KEYS.preregistration_identity_name
        );
    await this.updateApplicationStatus();
    await this.getUserInfo(this.preRegIds);
    for (let i = 0; i < this.usersInfoArr.length; i++) {
      await this.getRegCenterDetails(this.usersInfoArr[i].langCode, i);
      console.log("after get reg centre details")
      await this.getLabelDetails(this.usersInfoArr[i].langCode, i);
      console.log("after get reg centre details2")
      await this.getUserLangLabelDetails(this.langCode, i);
      console.log("after get reg centre details3")
    }

    let notificationTypes = this.configService
      .getConfigByKey(appConstants.CONFIG_KEYS.mosip_notification_type)
      .split("|");
    this.notificationTypes = notificationTypes.map((item) =>
      item.toUpperCase()
    );


    await this.apiCalls();
    console.log("in ackw.component.ts in ngOnInit()")
    if (this.bookingService.getSendNotification()) {
      this.bookingService.resetSendNotification();
      await this.automaticNotification();
    }
    this.prepareAckDataForUI();
    this.showSpinner = false;
  }
  updateApplicationStatus = async () => {
    return new Promise((resolve) => {
      this.preRegIds.forEach(async (prid: any, index) => {
        this.dataStorageService.updateApplicationStatus(
          prid, appConstants.APPLICATION_STATUS_CODES.booked)
          .subscribe(
            (response) => {
              resolve(true);
            },
            (error) => {
              resolve(true);
            }
          );
      });
    });
  }
  async getUserInfo(preRegIds: string[]) {
  

    return new Promise((resolve) => {
      preRegIds.forEach(async (prid: any, index) => {
        await this.getUserDetails(prid).then(async (user) => {
          let regDto;
          console.log(user);
          await this.getAppointmentDetails(prid).then((appointmentDetails) => {
            regDto = appointmentDetails;
          });
          console.log("after appointment deatils")
          const demographicData = user["request"].demographicDetails.identity;
          let applicationLanguages = Utils.getApplicationLangs(user["request"]);
          applicationLanguages = Utils.reorderLangsForUserPreferredLang(applicationLanguages, this.langCode);
          applicationLanguages.forEach(applicationLang => {
            const nameListObj: NameList = {
              preRegId: "",
              fullName: "",
              regDto: "",
              status: "",
              registrationCenter: "",
              bookingData: "",
              postalCode: "",
              langCode: "",
              labelDetails: [],
              userLangLabelDetails: []
            };
            nameListObj.preRegId = user["request"].preRegistrationId;
            nameListObj.status = user["request"].statusCode;

            if (!this.userService) {
              this.userService = demographicData["userService"];
            }
            if(this.userService==appConstants.USER_SERVICE.UPDATE || this.userService==appConstants.USER_SERVICE.FIRSTID|| this.userService==appConstants.USER_SERVICE.REPLACEMENT){
              this.name = appConstants.PRE_REGISTRATION_IDENTITY_NAME_COP;
            }

            if (demographicData[this.name]) {
              let nameValues = demographicData[this.name];
              nameValues.forEach(nameVal => {
                if (nameVal["language"] == applicationLang) {
                  nameListObj.fullName = nameVal["value"];
                }
              });
            }
            if (demographicData["postalCode"]) {
              nameListObj.postalCode = demographicData["postalCode"];
            }
            nameListObj.registrationCenter = "";
            nameListObj.langCode = applicationLang;
            nameListObj.regDto = regDto;
            this.usersInfoArr.push(nameListObj);
            this.applicantContactDetails.push({
              "preRegId": user["request"].preRegistrationId,
              "phone": demographicData["phone"],
              "email": demographicData["email"]
            });
            
          });
          this.generatePaymentRefNum(demographicData)
        });
        if (index === preRegIds.length - 1) {
          resolve(true);
        }
      });
    });
  }

  getUserDetails(prid) {
    return new Promise((resolve) => {
      this.dataStorageService.getUser(prid.toString()).subscribe((response) => {
        if (response[appConstants.RESPONSE] !== null) {
          resolve(
            new UserModel(
              prid.toString(),
              response[appConstants.RESPONSE],
              undefined,
              []
            )
          );
        }
      },
        (error) => {
          this.showErrorMessage(error);
        });
    });
  }

  getAppointmentDetails(preRegId) {
    return new Promise((resolve) => {
      this.dataStorageService
        .getAppointmentDetails(preRegId)
        .subscribe((response) => {
          console.log(response);
          if (response[appConstants.RESPONSE]) {
            this.regCenterId =
              response[appConstants.RESPONSE].registration_center_id;
            console.log("regCentreId" + this.regCenterId)
          }
          resolve(response[appConstants.RESPONSE]);
        },
          (error) => {
            this.showErrorMessage(error);
          });
    });
  }

  getRegCenterDetails(langCode, index) {
    console.log("in getRegCenterDetails")
    console.log(this.regCenterId)
    return new Promise((resolve) => {
      this.dataStorageService
        .getRegistrationCentersById(this.regCenterId, langCode)
        .subscribe((response) => {
          console.log("after fetching registration centre:: " + response)
          if (response[appConstants.RESPONSE]) {
            this.usersInfoArr[index].registrationCenter =
              response[appConstants.RESPONSE].registrationCenters[0];
            resolve(true);
          }
        },
          (error) => {
            this.usersInfoArr[index].registrationCenter = "";
            resolve(true);
          });
    });
  }

  async getLabelDetails(langCode, index) {
    return new Promise((resolve) => {
      this.dataStorageService
        .getI18NLanguageFiles(langCode)
        .subscribe((response) => {
          this.usersInfoArr[index].labelDetails.push(response["acknowledgement"]);
          resolve(true);
        });
    });
  }

  async getUserLangLabelDetails(langCode, index) {
    return new Promise((resolve) => {
      this.dataStorageService
        .getI18NLanguageFiles(langCode)
        .subscribe((response) => {
          this.usersInfoArr[index].userLangLabelDetails.push(response["acknowledgement"]);
          resolve(true);
        });
    });
  }

  prepareAckDataForUI() {
    this.preRegIds.forEach(prid => {
      let ackDataItem = {
        "qrCodeBlob": null,
      };
      let preRegIdLabels = [],
        appDateLabels = [],
        messages = [],
        labelNames = [],
        nameValues = [],
        givenNames = [],
        createdDate = [],
        createdTime = [],
        appLangCode = [];

      this.ackDataItem["preRegId"] = prid;
      this.ackDataItem["Suname"] =
        this.usersInfoArr[0].fullName;

      this.usersInfoArr.forEach(userInfo => {
        if (userInfo.preRegId == prid) {
          this.ackDataItem["qrCodeBlob"] = userInfo.qrCodeBlob;
          const labels = userInfo.labelDetails[0];
          preRegIdLabels.push(labels.label_pre_id);
          appDateLabels.push(labels.label_appointment_date_time);
          labelNames.push(labels.label_name);
          nameValues.push(userInfo.fullName);
          let name = userInfo.fullName
          console.log(name);
          appLangCode.push(userInfo.langCode);
          //set the message in user login lang if available
          let fltrLangs = this.usersInfoArr.filter(userInfoItm => userInfoItm.preRegId == userInfo.preRegId && userInfoItm.langCode == this.langCode);
          if (fltrLangs.length == 1) {
            let fltr = messages.filter(msg => msg.preRegId == fltrLangs[0].preRegId);
            if (fltr.length == 0) {
              messages.push({
                "preRegId": fltrLangs[0].preRegId,
                //"message": "The Application ID has been sent to the registered email id and phone number"
                "message": fltrLangs[0].labelDetails[0].message
              });
            }
          } else {
            let fltr = messages.filter(msg => msg.preRegId == userInfo.preRegId);
            if (fltr.length == 0) {
              messages.push({
                "preRegId": userInfo.preRegId,
                "message": userInfo.userLangLabelDetails[0].message
              });
            }
          }
        }
      });
      if (this.ltrLangs.includes(appLangCode[0])) {
        this.ackDataItem["appLangCodeDir"] = "ltr";
      } else {
        this.ackDataItem["appLangCodeDir"] = "rtl";
      }
      this.ackDataItem["appLangCode"] = appLangCode;
      this.ackDataItem["preRegIdLabels"] = JSON.stringify(
        preRegIdLabels
      )
        .replace(/\[/g, "")
        .replace(/,/g, " / ")
        .replace(/"/g, " ")
        .replace(/]/g, "");
      this.ackDataItem["appDateLabels"] = JSON.stringify(appDateLabels)
        .replace(/\[/g, "")
        .replace(/,/g, " / ")
        .replace(/"/g, " ")
        .replace(/]/g, "");
      this.ackDataItem["messages"] = messages;
      this.ackDataItem["labelNames"] = JSON.stringify(labelNames)
        .replace(/\[/g, "")
        .replace(/,/g, " / ")
        .replace(/"/g, " ")
        .replace(/]/g, "");
      this.ackDataItem["nameValues"] = JSON.stringify(nameValues)
        .replace(/\[/g, "")
        .replace(/,/g, " / ")
        .replace(/"/g, " ")
        .replace(/]/g, "");
      for (let j = 0; j < this.guidelines.length; j++) {
        if (appLangCode.includes(this.guidelines[j].langCode)) {
          this.ackDataItem[
            this.guidelines[j].langCode
          ] = this.guidelines[j].fileText.split("\n");
        }
      }
      this.ackDataArr.push(this.ackDataItem);
      this.ackDataItem = {};
    });

  }

  async apiCalls() {
    return new Promise(async (resolve) => {
      this.formatDateTime();
      await this.qrCodeForUser();
      await this.getTemplate();

      resolve(true);
    });
  }

  async qrCodeForUser() {
    return new Promise((resolve) => {
      this.usersInfoArr.forEach(async (user) => {
        await this.generateQRCode(user);
        if (this.usersInfoArr.indexOf(user) === this.usersInfoArr.length - 1) {
          resolve(true);
        }
      });
    });
  }

  formatDateTime() {
    const ltrLangs = this.configService
      .getConfigByKey(appConstants.CONFIG_KEYS.mosip_left_to_right_orientation)
      .split(",");
    this.usersInfoArr.forEach(userInfo => {
      if (!userInfo.bookingData) {
        userInfo.bookingDataPrimary = Utils.getBookingDateTime(
          userInfo.regDto.appointment_date,
          userInfo.regDto.time_slot_from,
          userInfo.langCode,
          ltrLangs
        );
        userInfo.bookingTimePrimary = Utils.formatTime(
          userInfo.regDto.time_slot_from
        );
      } else {
        const date = userInfo.bookingData.split(",");
        userInfo.bookingDataPrimary = Utils.getBookingDateTime(
          date[0],
          date[1],
          userInfo.langCode,
          ltrLangs
        );
        userInfo.bookingTimePrimary = Utils.formatTime(date[1]);
      }
    });
  }

  automaticNotification() {
    console.log("inside automaticNotification")
    setTimeout(() => {
      this.sendNotification(this.applicantContactDetails, false);
    }, 500);
  }

  getTemplate() {
    return new Promise((resolve) => {
      const subs = this.dataStorageService
        .getGuidelineTemplate("Onscreen-Acknowledgement")
        .subscribe((response) => {
          this.guidelines = response["response"]["templates"];
          resolve(true);
        });
      this.subscriptions.push(subs);
    });
  }

  download() {
    this.ackDataArr.forEach(ackDataItem => {
      const preRegId = ackDataItem["preRegId"];
      this.pdfOptions = {
        margin: [15, 15],
        filename: preRegId + ".pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 1, letterRendering: true },
        jsPDF: { unit: 'pt', format: 'letter', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      const element = document.getElementById("pdf-section" + "-" + preRegId);
      window.scroll(0, 0);
      html2pdf(element, this.pdfOptions);
    });
  }

  sendAcknowledgement() {
    console.log("in sendAcknowledgement")
    const data = {
      case: "SEND_ACKNOWLEDGEMENT",
      notificationTypes: this.notificationTypes,
    };
    const subs = this.dialog
      .open(DialougComponent, {
        width: "350px",
        data: data
      })
      .afterClosed()
      .subscribe((applicantNumber) => {
        if (applicantNumber !== undefined) {
          this.preRegIds.forEach(preRegId => {
            this.applicantContactDetails.push({
              "preRegId": preRegId,
              "phone": applicantNumber[1],
              "email": applicantNumber[0]
            });
          });
          this.sendNotification(this.applicantContactDetails, true);
        }
      });
    this.subscriptions.push(subs);
  }

  async generateQRCode(name) {
    try {
      const index = this.usersInfoArr.indexOf(name);
      if (!this.usersInfoArr[index].qrCodeBlob) {
        return new Promise((resolve, reject) => {
          const subs = this.dataStorageService
            .generateQRCode(name.preRegId)
            .subscribe((response) => {
              console.log(response["response"]);
              this.usersInfoArr[index].qrCodeBlob = response["response"].qrcode;
              resolve(true);
            });
        });
      }
    } catch (ex) {
      console.log("this.usersInfo[index].qrCodeBlob >>> " + ex.messages);
    }
  }

  async sendNotification(contactInfoArr, additionalRecipient: boolean) {
  
    this.preRegIds.forEach(async preRegId => {
      let notificationObject = {};
      console.log("contactInfoArr" + contactInfoArr)
      console.log("usersInfoArr" + this.usersInfoArr)
      this.usersInfoArr.forEach(async (user) => {
        if (preRegId == user.preRegId) {
          let contactInfo = {};
          contactInfoArr.forEach(item => {
            if (item["preRegId"] == preRegId) {
              contactInfo = item;
            }
          });
          notificationObject[user.langCode] = new NotificationDtoModelv2(
            user.fullName,
            user.preRegId,
            user.bookingData
              ? user.bookingData.split(",")[0]
              : user.regDto.appointment_date,
            Number(user.bookingTimePrimary.split(":")[0]) < 10
              ? "0" + user.bookingTimePrimary
              : user.bookingTimePrimary,
            contactInfo["phone"] === undefined ? null : contactInfo["phone"],
            contactInfo["email"] === undefined ? null : contactInfo["email"],
            additionalRecipient,
            false,
            contactInfo["userService"] = this.userService
          );
        }
      });
      const model = new RequestModel(
        appConstants.IDS.notification,
        notificationObject
      );
      let notificationRequest = new FormData();
      notificationRequest.append(
        appConstants.notificationDtoKeys.notificationDto,
        JSON.stringify(model).trim()
      );
      notificationRequest.append(
        appConstants.notificationDtoKeys.langCode,
        Object.keys(notificationObject).join(",")
      );
      console.log("in sendNotification")
      await this.sendNotificationForPreRegId(notificationRequest);
    });
  }

  private sendNotificationForPreRegId(notificationRequest) {
    console.log("in sendNotificationForPreRegId" + JSON.stringify(notificationRequest))
    return new Promise((resolve, reject) => {
      this.subscriptions.push(
        this.dataStorageService
          .sendNotification(notificationRequest)
          .subscribe((response) => {
            resolve(true);
          },
            (error) => {
              resolve(true);
              this.showErrorMessage(error);
            })
      );
    });
  }

  /**
   * @description This is a dialoug box whenever an error comes from the server, it will appear.
   *
   * @private
   * @memberof AcknowledgementComponent
   */
  private showErrorMessage(error: any) {
    const titleOnError = this.errorlabels.errorLabel;
    const message = Utils.createErrorMessage(error, this.errorlabels, this.apiErrorCodes, this.configService);
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

  getPRNResponse(){
    this.dataStorageService.generatePRN(this.requestBody).subscribe((response: PRNResponseModel) => {
      if (response.response != null) {
          this.PRN = response.response.data.prn;
          this.amount = response.response.data.amount;
          
              } 
           
      else if (response.errors && Array.isArray(response.errors)) {
              const body = {
              case: "PRN-ERRORS",
              title: "PRN Error",
              message: response.errors[0].message,
              };
              this.dialog.open(DialougComponent, {
              width: "500px",
              data: body
            });
            //console.error('Error:', response.errors[0].message);
          }
      },
      (error) => {
      
                    this.PRNerrorMessage = error.error.errors[0].message
                    const body = {
                    case: "PRN-CONNECT-ERRORS",
                    title: "PRN Generation Error",
                    message: this.PRNerrorMessage + "\n\nMake sure to pay from any Bank before proceeding to NIRA office"
                    };
                    this.dialog.open(DialougComponent, {
                    width: "500px",
                        data: body
                      });
                  });
  
  }
  
  generatePaymentRefNum(demographicData: any) {
    debugger
    const desiredService = demographicData.userService; 
    let surname;
    if(desiredService===appConstants.USER_SERVICE.UPDATE || desiredService===appConstants.USER_SERVICE.REPLACEMENT){

      surname = demographicData.surnameCop[0].value;
    }
    else{
      surname = demographicData.surname;
    }
    const nin = demographicData.NIN;

    const age:number = this.dataStorageService.calculateAge(demographicData.dateOfBirthCop);
    //console.log(age);

    
  
      if (desiredService ===appConstants.USER_SERVICE.UPDATE){
        if (demographicData.isErrorNameChange==="N"  || !("isErrorNameChange" in demographicData)){
          
          if ( age > 16) { 
            // demographicData.changeReasonNameChange[0].value != "SPLC" &&  removed cause of bocker -> Karthik
            if ((demographicData.removingName==="Y"|| demographicData.addingName==="Y"||demographicData.completeChangeofName==="Y" ||demographicData.changeOfDateOfBirth==="Y" ||demographicData.changeInPlaceOfResidence==="Y") )
               {
                   this.requestBody = {
                   service: appConstants.TAX_HEADS.COP_NORMAL,
                   NIN: nin,

                   fullName: surname+ " " +demographicData.givenNameCop[0].value
                   };
                  console.log("consoled from generatePaymentRefNum",this.requestBody);

                    this.getPRNResponse();
                    // console.log("this is from the general update");
               }
           else if((demographicData.removingName==="Y"|| demographicData.addingName==="Y"||demographicData.completeChangeofName==="Y" ||demographicData.changeOfDateOfBirth==="Y" ||demographicData.changeInPlaceOfResidence==="Y") && demographicData.changeReasonNameChange[0].value === "SPLC" )
                {
               this.requestBody = {
               service: appConstants.TAX_HEADS.COP_SPELLING_CORRECTION,
               NIN: nin,

               fullName: surname+ " " +demographicData.givenNameCop[0].value

               };
               console.log("consoled from generatePaymentRefNum",this.requestBody);
               if (this.requestBody.fullName &&  this.requestBody.NIN &&  this.requestBody.service) {
                    console.log(this.requestBody);
                   this.getPRNResponse();
                  //  console.log("this is from spelling error");
                 
                 } 
               }
  
         }
         }
   }
  else if(desiredService ===appConstants.USER_SERVICE.REPLACEMENT){
          if(demographicData.userServiceTypeReplacement[0].value==="LOST"){
  
            this.requestBody = {
              service: appConstants.TAX_HEADS.REPLACEMENT,
              NIN: nin !== undefined ? nin : null,
              fullName: surname+ " " +demographicData.givenNameCop[0].value
            };
            console.log("this is the request",this.requestBody);
            
              this.getPRNResponse();
               }
          else if (demographicData.userServiceTypeReplacement[0].value==="DMG"){
            this.requestBody = {
              service: appConstants.TAX_HEADS.DAMAGED_CARD ,
              NIN: nin !== undefined ? nin : null,

              fullName: surname+ " " +demographicData.givenNameCop[0].value

            };
             this.getPRNResponse();
          }
  } 
  }




  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  /**
   * This method navigate the user to demographic page if user clicks on Add New applicant.
   */
  async onNewApplication() {
    //first check if data capture languages are in session or not
    const dataCaptureLangsFromSession = localStorage.getItem(appConstants.DATA_CAPTURE_LANGUAGES);
    console.log(`dataCaptureLangsFromSession: ${dataCaptureLangsFromSession}`);
    if (dataCaptureLangsFromSession) {
      this.navigateToDemographic();
    } else {
      //no data capture langs stored in session, hence prompt the user 
      const mandatoryLanguages = Utils.getMandatoryLangs(this.configService);
      const optionalLanguages = Utils.getOptionalLangs(this.configService);
      const maxLanguage = Utils.getMaxLangs(this.configService);
      const minLanguage = Utils.getMinLangs(this.configService);
      if (
        maxLanguage > 1 &&
        optionalLanguages.length > 0 &&
        maxLanguage !== mandatoryLanguages.length
      ) {
        await this.openLangSelectionPopup(mandatoryLanguages, minLanguage, maxLanguage);
      } else if (mandatoryLanguages.length > 0) {
        if (maxLanguage == 1) {
          localStorage.setItem(appConstants.DATA_CAPTURE_LANGUAGES, JSON.stringify([mandatoryLanguages[0]]));
        } else {
          let reorderedArr = Utils.reorderLangsForUserPreferredLang(mandatoryLanguages, this.userPrefLanguage);
          localStorage.setItem(appConstants.DATA_CAPTURE_LANGUAGES, JSON.stringify(reorderedArr));
        }
        this.isNavigateToDemographic = true;
      }
      if (this.isNavigateToDemographic) {
        let dataCaptureLanguagesLabels = Utils.getLanguageLabels(localStorage.getItem(appConstants.DATA_CAPTURE_LANGUAGES),
          localStorage.getItem(appConstants.LANGUAGE_CODE_VALUES));
        localStorage.setItem(appConstants.DATA_CAPTURE_LANGUAGE_LABELS, JSON.stringify(dataCaptureLanguagesLabels));
        this.navigateToDemographic();
      }
    }
  }

  openLangSelectionPopup(mandatoryLanguages: string[], minLanguage: Number, maxLanguage: Number) {
    return new Promise((resolve) => {
      const popupAttributes = Utils.getLangSelectionPopupAttributes(this.dataCaptureLangsDir[0], this.dataCaptureLabels,
        mandatoryLanguages, minLanguage, maxLanguage, this.userPrefLanguage);
      const dialogRef = this.openDialog(popupAttributes, "550px", "350px");
      dialogRef.afterClosed().subscribe((res) => {
        if (res == undefined) {
          this.isNavigateToDemographic = false;
        } else {
          let reorderedArr = Utils.reorderLangsForUserPreferredLang(res, this.userPrefLanguage);
          localStorage.setItem(appConstants.DATA_CAPTURE_LANGUAGES, JSON.stringify(reorderedArr));
          this.isNavigateToDemographic = true;
        }
        resolve(true);
      });
    });
  }

  openDialog(data, width, height?) {
      const dialogRef = this.dialog.open(DialougComponent, {
        width: width,
        height: height,
        data: data,
        restoreFocus: false
      });
      return dialogRef;
    }
  
    navigateToDemographic() {
      localStorage.setItem(appConstants.NEW_APPLICANT, "true");
      localStorage.setItem(appConstants.MODIFY_USER_FROM_PREVIEW, "false");
      localStorage.setItem(appConstants.MODIFY_USER, "false");
      localStorage.setItem(appConstants.NEW_APPLICANT_FROM_PREVIEW, "true");
      this.router.navigate([`${this.userPrefLanguage}/pre-registration/demographic/new`]);
    }
}
