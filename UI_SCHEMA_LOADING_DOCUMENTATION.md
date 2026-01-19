# UI Schema Loading Documentation

## Overview
This document explains how the UI Schema is loaded in the Pre-Registration UI application. The UI Schema defines the structure, validation rules, and rendering configuration for all form fields in the demographic data capture process.

## Loading Flow

### 1. Application Initialization
When the Angular application starts, the configuration is loaded before any components are initialized:

**File**: `src/app/app.module.ts`
```typescript
const appInitialization = (appConfig: AppConfigService) => {
  return () => {
    return appConfig.loadAppConfig();
  };
};

providers: [
  {
    provide: APP_INITIALIZER,
    useFactory: appInitialization,
    multi: true,
    deps: [AppConfigService]
  }
]
```

### 2. Configuration Service
**File**: `src/app/app-config.service.ts`

The `AppConfigService` loads the base configuration from a local JSON file:

```typescript
async loadAppConfig() {
  const data = await this.http.get('./assets/config.json').toPromise();
  this.appConfig = data;
}
```

**Configuration File**: `src/assets/config.json`
```json
{
  "BASE_URL": "https://api-internal.niradev.idencode.link/",
  "PRE_REG_URL": "preregistration/v1/"
}
```

### 3. Data Storage Service
**File**: `src/app/core/services/data-storage.service.ts`

The `DataStorageService` provides a method to fetch the UI Schema from the backend:

```typescript
getIdentityJson() {
  let url = this.BASE_URL + this.PRE_REG_URL + `uispec/latest`;
  return this.httpClient.get(url);
}
```

**Full URL**: `https://api-internal.niradev.idencode.link/preregistration/v1/uispec/latest`

### 4. Component Loading
**File**: `src/app/feature/demographic/demographic/demographic.component.ts`

The Demographic component loads the UI Schema during initialization:

```typescript
async getIdentityJsonFormat() {
  return new Promise((resolve, reject) => {
    this.dataStorageService.getIdentityJson().subscribe(
      async (response) => {
        let identityJsonSpec = response[appConstants.RESPONSE]["jsonSpec"]["identity"];
        this.identityData = identityJsonSpec["identity"];
        
        // Extract location hierarchies
        let locationHeirarchiesFromJson = [
          ...identityJsonSpec["locationHierarchy"], 
          ...identityJsonSpec["locationHierarchy"], 
        ];
        
        this.identitySchemaVersion = response[appConstants.RESPONSE]["idSchemaVersion"];
        
        // Process UI fields
        this.identityData.forEach((obj) => {
          if (obj.inputRequired === true && 
              obj.controlType !== null && 
              !(obj.controlType === "fileupload")) {
            if (obj.transliteration && obj.transliteration === true) {
              this.uiFieldsWithTransliteration.push(obj);
            }
            this.uiFields.push(obj);
          }
        });
        
        // Set alignment groups and dynamic fields
        this.setAlignmentGroups();
        this.setCopAlignmentGroups();
        
        this.dynamicFields = this.uiFields.filter(
          (fields) => (fields.controlType === "dropdown" || 
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
```

## UI Schema Structure

The UI Schema response follows this structure:

```json
{
  "response": {
    "id": "ea99be7d-7d45-4a07-8a45-45ec2f73ab6a",
    "version": 0.6,
    "title": "UI Specification for Pre-Registration",
    "description": "Pre-registration UI Specification for Demographic Data capture",
    "identitySchemaId": "18ad2b1d-d09e-4ef2-8c8f-623107933dd9",
    "idSchemaVersion": 0.6,
    "jsonSpec": {
      "identity": {
        "identity": [
          {
            "id": "fullName",
            "description": "Enter Full Name",
            "labelName": {
              "eng": "Full Name",
              "ara": "الاسم الكامل",
              "fra": "Nom complet"
            },
            "controlType": "textbox",
            "inputRequired": true,
            "fieldType": "default",
            "type": "simpleType",
            "validators": [
              {
                "langCode": "eng",
                "type": "regex",
                "validator": "[a-zA-Z ]+$",
                "arguments": [],
                "errorMessageCode": "UI_1000"
              }
            ],
            "required": true,
            "transliteration": true
          }
        ],
        "locationHierarchy": [
          "region",
          "province",
          "city",
          "zone",
          "postalCode"
        ]
      }
    },
    "status": "PUBLISHED",
    "effectiveFrom": "2021-05-03T05:48:02.015",
    "createdOn": "2021-05-03T05:48:02.015",
    "updatedOn": "2021-05-03T05:49:12.802"
  }
}
```

### Field Properties

Each field in the UI Schema can have the following properties:

- **id**: Unique identifier for the field
- **description**: Field description
- **labelName**: Localized labels (multi-language support)
- **controlType**: Type of UI control (textbox, dropdown, fileupload, ageDate, button)
- **inputRequired**: Whether the field should be rendered in the UI
- **fieldType**: "default" or "dynamic" (dynamic fields fetch values from API)
- **type**: Data type (simpleType, string, number)
- **validators**: Array of validation rules with regex patterns and error codes
- **required**: Whether the field is mandatory
- **transliteration**: Whether transliteration is enabled for the field
- **locationHierarchyLevel**: For location-based dropdowns
- **parentLocCode**: Parent location code for hierarchical locations
- **subType**: Document category type (POA, POI, POR, POB, POE)
- **visibleCondition**: Conditional visibility rules using json-rules-engine
- **requiredCondition**: Conditional required rules using json-rules-engine
- **alignmentGroup**: For grouping fields in the UI layout
- **containerStyle**: CSS styling for field container
- **headerStyle**: CSS styling for field header

## Components Using UI Schema

Multiple components throughout the application consume the UI Schema:

1. **DemographicComponent** (`src/app/feature/demographic/demographic/demographic.component.ts`)
   - Primary consumer of UI Schema
   - Renders dynamic forms based on schema definition
   - Handles validation and transliteration

2. **FileUploadComponent** (`src/app/feature/file-upload/file-upload/file-upload.component.ts`)
   - Loads schema to determine file upload fields
   - Filters fields with `controlType: "fileupload"`

3. **PreviewComponent** (`src/app/feature/summary/preview/preview.component.ts`)
   - Uses schema for displaying entered data
   - Shows field labels in appropriate languages

4. **DashboardComponent** (`src/app/feature/dashboard/dashboard/dashboard.component.ts`)
   - May use schema for data display purposes

5. **CenterSelectionComponent** (`src/app/feature/booking/center-selection/center-selection.component.ts`)
   - References schema for location hierarchy

## Fallback Mechanism

The application includes a fallback mechanism for local development:

**File**: `src/assets/identity-spec.json`, `src/assets/identity-spec1.json`, `src/assets/identity-spec2.json`

These files contain static UI Schema definitions that can be used when the API is unavailable. The code includes commented-out lines that can be uncommented for local development:

```typescript
// Commented in production:
// return this.httpClient.get("../../../assets/identity-spec.json");

// Uncommented for local development:
import identityStubJson from "../../../../assets/identity-spec1.json";
```

## Dynamic Field Values

For fields marked as `fieldType: "dynamic"`, the component fetches possible values from another API endpoint:

```typescript
async getDynamicFieldValues(langCode) {
  // Fetches gender, residence status, and other dynamic dropdown values
  // from masterdata APIs
}
```

## Validation

Validators in the UI Schema are processed and applied to Angular form controls:

```typescript
validators: [
  {
    "langCode": "eng",
    "type": "regex",
    "validator": "[a-zA-Z ]+$",
    "arguments": [],
    "errorMessageCode": "UI_1000"
  }
]
```

Error messages are retrieved from localization files (`src/assets/i18n/*.json`) using the `errorMessageCode`.

## Conditional Logic

The UI Schema supports conditional visibility and requirements using json-rules-engine:

```json
{
  "visibleCondition": {
    "all": [
      {
        "fact": "identity",
        "operator": "equal",
        "value": "MLE",
        "path": "$.gender.0.value"
      }
    ]
  }
}
```

The component evaluates these conditions dynamically to show/hide fields and change their required status.

## Summary

The UI Schema loading process follows this sequence:

1. **App Start** → Load `config.json` (BASE_URL, PRE_REG_URL)
2. **Component Init** → Call `DataStorageService.getIdentityJson()`
3. **HTTP Request** → GET `{BASE_URL}{PRE_REG_URL}uispec/latest`
4. **Response Processing** → Extract identity fields and location hierarchy
5. **Field Filtering** → Filter input-required fields by control type
6. **Alignment & Grouping** → Set UI layout groups
7. **Dynamic Values** → Fetch dropdown values for dynamic fields
8. **Form Rendering** → Generate Angular forms based on schema

This design allows for flexible form configuration without code changes, supporting multi-language, dynamic validation, and conditional logic through a centralized schema definition.
