import { AttributeModel } from './attribute.modal';

/**
 * @description This is the data object for the request object for adding the user.
 * @author Shashank Agrawal
 *
 * @export
 * @class IdentityModel
 */
export class IdentityModel {
  constructor(
    public IDSchemaVersion: number,
    public fullName: AttributeModel[],
    public dateOfBirth: string,
    public gender: AttributeModel[],
    public addressLine1: AttributeModel[],
    public residenceStatus: AttributeModel[],
    public addressLine2: AttributeModel[],
    public addressLine3: AttributeModel[],
    public region: AttributeModel[],
    public province: AttributeModel[],
    public city: AttributeModel[],
    public zone: AttributeModel[],
    public postalCode: string,
    public phone: string,
    public email: string,
    public referenceIdentityNumber: string
  ) {} 

  /*
    Must change this interface to match that of NIRA's Identity schema
    ex. Uganda doesn't have regions, provinces etc
  */

  /*constructor(
    public IDSchemaVersion: number,
    public gender: AttributeModel[],
    public surname: AttributeModel[],
    public givenName: AttributeModel[],
    public otherNames: AttributeModel[],
    public maidenName: AttributeModel[],
    public previousName: AttributeModel[],
    public dateOfBirth: string,
    public mobileNumber: string,
    public homePhoneNumber: string,
    public email: string,
    public highestLevelOfEducation: AttributeModel[],
    public profession: AttributeModel[],
    public occupation: AttributeModel[],
    public religion: AttributeModel[],
    public disabilities: AttributeModel[],
    public residenceStatus: AttributeModel[],
    public applicantForiegnResidenceCountry: AttributeModel[],
    public applicantForiegnResidenceState: AttributeModel[],
    public applicantForiegnResidenceCity: AttributeModel[],
    public applicantPlaceOfResidenceDistrict: AttributeModel[],
    public applicantPlaceOfResidenceCounty: AttributeModel[],
    public applicantPlaceOfResidenceSubcounty: AttributeModel[],
    public applicantPlaceOfResidenceParish: AttributeModel[],
    public applicantPlaceOfResidenceVillage: AttributeModel[],
    public applicantPlaceOfResidenceYearsLived: string,
    public applicantPlaceOfResidenceDistrictOfPrevRes: AttributeModel[],
    public applicantPlaceOfResidencePostalAddress: string,
    public applicantPlaceOfBirth: AttributeModel[],
    public applicantForiegnBirthCountry: AttributeModel[],
    public applicantForiegnBirthState: AttributeModel[],
    public applicantForiegnBirthCity: AttributeModel[],
    public applicantPlaceOfBirthDistrict: AttributeModel[],
    public applicantPlaceOfBirthCounty: AttributeModel[],
    public applicantPlaceOfBirthSubcounty: AttributeModel[],
    public applicantPlaceOfBirthParish: AttributeModel[],
    public applicantPlaceOfBirthVillage: AttributeModel[],
    public applicantPlaceOfBirthCity: AttributeModel[],
    public applicantPlaceOfBirthHealthFacility: AttributeModel[],
    public applicantPlaceOfBirthWeightAtBirth: string,
    public applicantPlaceOfBirthTimeOfBirth: string,
    public applicantPlaceOfBirthParityOfChild: string,
    public applicantCitizenshipType: AttributeModel[],
    public applicantOtherNationality: AttributeModel[], 
    public applicantCitizenshipCertificate: AttributeModel[],
    public applicantCitizenshipByRegistration: AttributeModel[],
    public applicantPassportNumber: string,
    public applicantPassportFileNumber: string,
    public applicantPlaceOfOriginDistrict: AttributeModel[],
    public applicantPlaceOfOriginCounty: AttributeModel[],
    public applicantPlaceOfOriginSubcounty: AttributeModel[],
    public applicantPlaceOfOriginParish: AttributeModel[],
    public applicantPlaceOfOriginVillage: AttributeModel[],
    public applicantPlaceOfOriginIndigenousCommunityTribe: AttributeModel[],
    public applicantPlaceOfOriginClan: AttributeModel[],
    public preferredPollingStation: AttributeModel[],
    public pollingStationName: AttributeModel[],
    public maritalStatus: AttributeModel[],
   
  ){}*/
}


