# UI Schema Loading Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                      APPLICATION STARTUP                             │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│  APP_INITIALIZER (app.module.ts)                                    │
│  ┌───────────────────────────────────────────────────────────┐     │
│  │  const appInitialization = (appConfig: AppConfigService)  │     │
│  │    return () => appConfig.loadAppConfig();                │     │
│  └───────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│  AppConfigService.loadAppConfig()                                   │
│  ┌───────────────────────────────────────────────────────────┐     │
│  │  Load: ./assets/config.json                               │     │
│  │  {                                                         │     │
│  │    "BASE_URL": "https://api-internal.niradev...",         │     │
│  │    "PRE_REG_URL": "preregistration/v1/"                   │     │
│  │  }                                                         │     │
│  └───────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│              CONFIGURATION LOADED AND AVAILABLE                      │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│  DemographicComponent.ngOnInit()                                    │
│  ┌───────────────────────────────────────────────────────────┐     │
│  │  await this.getIdentityJsonFormat();                      │     │
│  └───────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│  DataStorageService.getIdentityJson()                               │
│  ┌───────────────────────────────────────────────────────────┐     │
│  │  URL = BASE_URL + PRE_REG_URL + "uispec/latest"           │     │
│  │  URL = "https://api-internal.niradev.idencode.link/       │     │
│  │         preregistration/v1/uispec/latest"                 │     │
│  │                                                            │     │
│  │  return this.httpClient.get(url)                          │     │
│  └───────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       HTTP GET REQUEST                               │
│  GET https://api-internal.niradev.idencode.link/                    │
│      preregistration/v1/uispec/latest                                │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      BACKEND API SERVER                              │
│  Returns UI Schema JSON with:                                       │
│  - Identity field definitions                                       │
│  - Validation rules                                                 │
│  - Control types                                                    │
│  - Multi-language labels                                            │
│  - Location hierarchy                                               │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│              UI SCHEMA RESPONSE RECEIVED                             │
│  {                                                                   │
│    "response": {                                                     │
│      "jsonSpec": {                                                   │
│        "identity": {                                                 │
│          "identity": [ /* field definitions */ ],                    │
│          "locationHierarchy": [ /* hierarchy */ ]                    │
│        }                                                             │
│      },                                                              │
│      "idSchemaVersion": 0.6                                          │
│    }                                                                 │
│  }                                                                   │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│  DemographicComponent.getIdentityJsonFormat()                       │
│  PROCESS UI SCHEMA:                                                 │
│                                                                      │
│  1. Extract identity fields                                         │
│     ├─► identityData = response["jsonSpec"]["identity"]["identity"] │
│     └─► identitySchemaVersion = response["idSchemaVersion"]         │
│                                                                      │
│  2. Extract location hierarchy                                      │
│     └─► locationHierarchy = response["jsonSpec"]["locationHierarchy"]│
│                                                                      │
│  3. Filter and categorize fields                                    │
│     ├─► uiFields: Fields with inputRequired=true                    │
│     ├─► uiFieldsWithTransliteration: Fields with transliteration    │
│     └─► dynamicFields: Dropdowns needing API data                   │
│                                                                      │
│  4. Set UI layout                                                   │
│     ├─► setAlignmentGroups()                                        │
│     └─► setCopAlignmentGroups()                                     │
│                                                                      │
│  5. Initialize dropdowns and locations                              │
│     ├─► setDropDownArrays()                                         │
│     └─► setLocations()                                              │
│                                                                      │
│  6. Fetch dynamic field values                                      │
│     └─► getDynamicFieldValues()                                     │
│         ├─► Get gender values                                       │
│         ├─► Get residence status values                             │
│         └─► Get other dynamic dropdown values                       │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  UI SCHEMA READY FOR USE                             │
│                                                                      │
│  Component now has:                                                 │
│  ✓ Field definitions with validation rules                         │
│  ✓ Multi-language labels                                            │
│  ✓ Control types for rendering                                      │
│  ✓ Location hierarchy configuration                                 │
│  ✓ Dynamic dropdown values                                          │
│  ✓ Conditional visibility rules                                     │
│  ✓ Layout and alignment groups                                      │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   RENDER DYNAMIC FORM                                │
│  - Generate Angular form controls                                   │
│  - Apply validators from schema                                     │
│  - Render fields based on controlType                               │
│  - Display labels in selected language                              │
│  - Handle conditional show/hide logic                               │
└─────────────────────────────────────────────────────────────────────┘
```

## Components Using UI Schema

```
UI Schema (loaded once)
    │
    ├─► DemographicComponent (primary)
    │   └─► Renders all demographic form fields
    │
    ├─► FileUploadComponent
    │   └─► Filters fileupload control types
    │
    ├─► PreviewComponent
    │   └─► Displays entered data with labels
    │
    ├─► DashboardComponent
    │   └─► May display schema-based data
    │
    └─► CenterSelectionComponent
        └─► References location hierarchy
```

## Fallback Mechanism

```
┌─────────────────────────────────────────────────────────────────────┐
│  If API is unavailable (local development):                         │
│                                                                      │
│  Option 1: Use local JSON file                                      │
│  └─► return this.httpClient.get("./assets/identity-spec.json")      │
│                                                                      │
│  Option 2: Import static JSON                                       │
│  └─► import identityStubJson from "assets/identity-spec1.json"      │
│                                                                      │
│  Available files:                                                   │
│  - src/assets/identity-spec.json                                    │
│  - src/assets/identity-spec1.json                                   │
│  - src/assets/identity-spec2.json                                   │
└─────────────────────────────────────────────────────────────────────┘
```

## Key Data Structures

### Field Object Structure
```typescript
{
  id: string,                    // Unique field identifier
  description: string,           // Field description
  labelName: {                   // Multi-language labels
    eng: string,
    ara: string,
    fra: string
  },
  controlType: string,           // "textbox" | "dropdown" | "fileupload" | "ageDate" | "button"
  inputRequired: boolean,        // Should render in UI
  fieldType: string,             // "default" | "dynamic"
  type: string,                  // "simpleType" | "string" | "number"
  validators: [                  // Validation rules
    {
      langCode: string,
      type: string,
      validator: string,         // Regex pattern
      errorMessageCode: string
    }
  ],
  required: boolean,             // Is field mandatory
  transliteration?: boolean,     // Enable transliteration
  locationHierarchyLevel?: number,
  subType?: string,              // For file uploads
  visibleCondition?: object,     // Conditional visibility
  requiredCondition?: object,    // Conditional required
  alignmentGroup?: string,       // UI layout grouping
  containerStyle?: string,       // CSS styling
  headerStyle?: string          // CSS styling
}
```

## Error Handling

```
API Request Failed
    │
    ├─► showErrorMessage(error)
    │   └─► Display user-friendly error
    │
    └─► Fallback options:
        ├─► Use cached schema (if available)
        ├─► Use local JSON file
        └─► Show error and prevent form loading
```
