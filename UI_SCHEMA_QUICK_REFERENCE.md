# UI Schema Quick Reference Guide

## Quick Links
- [Full Documentation](UI_SCHEMA_LOADING_DOCUMENTATION.md)
- [Flow Diagram](UI_SCHEMA_FLOW_DIAGRAM.md)

## TL;DR - How UI Schema Loads

### 1. Configuration (App Startup)
```typescript
// File: src/assets/config.json
{
  "BASE_URL": "https://api-internal.niradev.idencode.link/",
  "PRE_REG_URL": "preregistration/v1/"
}
```

### 2. API Call
```typescript
// File: src/app/core/services/data-storage.service.ts
getIdentityJson() {
  let url = this.BASE_URL + this.PRE_REG_URL + `uispec/latest`;
  return this.httpClient.get(url);
}
```

**Full URL:** `https://api-internal.niradev.idencode.link/preregistration/v1/uispec/latest`

### 3. Schema Processing
```typescript
// File: src/app/feature/demographic/demographic/demographic.component.ts
async getIdentityJsonFormat() {
  // Fetches schema from API
  // Extracts identity fields
  // Filters by inputRequired
  // Sets up UI layout
  // Loads dynamic field values
}
```

## Schema Structure

```json
{
  "response": {
    "jsonSpec": {
      "identity": {
        "identity": [
          {
            "id": "fieldId",
            "labelName": { "eng": "Label", "ara": "...", "fra": "..." },
            "controlType": "textbox|dropdown|fileupload|ageDate|button",
            "inputRequired": true,
            "fieldType": "default|dynamic",
            "validators": [ /* regex patterns */ ],
            "required": true
          }
        ],
        "locationHierarchy": ["region", "province", "city", "zone", "postalCode"]
      }
    }
  }
}
```

## Common Tasks

### How to Add a New Field
1. Update UI Schema in backend API
2. Field will automatically appear if `inputRequired: true`
3. No frontend code changes needed!

### How to Change Validation
1. Update `validators` array in UI Schema
2. Add/modify regex patterns
3. Update error message codes

### How to Make a Field Conditional
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

### How to Add Multi-Language Support
```json
{
  "labelName": {
    "eng": "English Label",
    "ara": "Arabic Label",
    "fra": "French Label"
  }
}
```

### Local Development (No API)
```typescript
// Option 1: Use local file in getIdentityJson()
return this.httpClient.get("./assets/identity-spec.json");

// Option 2: Import static JSON
import identityStubJson from "../../../../assets/identity-spec1.json";
```

## Control Types

| Control Type | Usage | Example |
|-------------|-------|---------|
| `textbox` | Text input | Name, Address |
| `dropdown` | Select from options | Gender, Status |
| `fileupload` | Document upload | POA, POI |
| `ageDate` | Date picker with age | Date of Birth |
| `button` | Action button | Submit, Clear |

## Field Types

| Field Type | Description |
|-----------|-------------|
| `default` | Static field, no API data needed |
| `dynamic` | Values fetched from API (e.g., gender list) |

## Validation

```json
{
  "validators": [
    {
      "langCode": "eng",
      "type": "regex",
      "validator": "[a-zA-Z ]+$",
      "errorMessageCode": "UI_1000"
    }
  ]
}
```

Error messages come from: `src/assets/i18n/{langCode}.json`

## Components That Use Schema

| Component | Purpose |
|-----------|---------|
| DemographicComponent | Renders all form fields |
| FileUploadComponent | Handles file uploads |
| PreviewComponent | Shows entered data |
| DashboardComponent | Displays data |
| CenterSelectionComponent | Uses location hierarchy |

## Troubleshooting

### Schema Not Loading
1. Check config.json has correct BASE_URL
2. Verify API endpoint is accessible
3. Check browser console for errors
4. Use fallback local JSON for testing

### Field Not Showing
- Verify `inputRequired: true`
- Check `visibleCondition` if field is conditional
- Ensure `controlType` is not null

### Validation Not Working
- Check regex pattern in validators
- Verify errorMessageCode exists in i18n files
- Ensure validator langCode matches current language

### Dynamic Dropdown Empty
- Check `fieldType: "dynamic"`
- Verify `getDynamicFieldValues()` is called
- Check masterdata API is returning values

## Files to Know

| File | Purpose |
|------|---------|
| `src/assets/config.json` | API configuration |
| `src/app/app-config.service.ts` | Loads config at startup |
| `src/app/core/services/data-storage.service.ts` | Fetches UI Schema |
| `src/app/feature/demographic/demographic/demographic.component.ts` | Processes and uses schema |
| `src/assets/identity-spec.json` | Fallback schema for local dev |
| `src/assets/i18n/*.json` | Localized labels and error messages |

## API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `{BASE_URL}{PRE_REG_URL}uispec/latest` | Get UI Schema |
| `{BASE_URL}{PRE_REG_URL}proxy/masterdata/gendertypes` | Get gender options |
| `{BASE_URL}{PRE_REG_URL}proxy/masterdata/individualtypes` | Get residence status |
| `{BASE_URL}{PRE_REG_URL}proxy/masterdata/dynamicfields` | Get dynamic field values |

## Key Concepts

- **UI Schema**: JSON definition of all form fields
- **Identity Fields**: Array of field objects with properties
- **Location Hierarchy**: Hierarchical address structure
- **Transliteration**: Convert text between scripts
- **Dynamic Fields**: Fields with values from API
- **Conditional Visibility**: Show/hide based on rules
- **Alignment Groups**: Field layout grouping

## Need More Details?

See the [Full Documentation](UI_SCHEMA_LOADING_DOCUMENTATION.md) for:
- Complete loading flow
- Detailed field properties
- Advanced examples
- Error handling
- Testing strategies
