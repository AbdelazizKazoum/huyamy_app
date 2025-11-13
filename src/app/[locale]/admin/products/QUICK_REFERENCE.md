# Quick Reference Guide

## Component Hierarchy

```
ProductFormModal (Main Orchestrator)
├── BasicProductInfo
│   ├── FormInput (Name AR/FR)
│   ├── FormTextarea (Description AR/FR)
│   ├── CustomSelect (Category)
│   ├── Keywords Input
│   └── FormToggle (Purchase Options)
│
├── VariantManagement
│   ├── FormToggle (Has Variants)
│   ├── Variant Options Section
│   │   ├── CustomSelect (Option Name)
│   │   ├── FormInput (Custom Names)
│   │   ├── Color Picker
│   │   └── Value Tags
│   └── Generated Variants List
│       ├── Price Inputs
│       └── Variant Images
│
├── ProductSections
│   ├── Related Products Section
│   │   ├── FormToggle
│   │   ├── ProductSelector
│   │   └── Product Grid
│   └── Custom Sections
│       ├── FormToggle
│       ├── Section Name Inputs
│       ├── CustomSelect (Type)
│       └── Content (Products or Description)
│
└── Image Uploads
    ├── MainImageUpload
    ├── SubImagesUpload
    └── CertificationImagesUpload
```

## State Management

### useProductFormState

```typescript
const {
  nameAr,
  setNameAr,
  nameFr,
  setNameFr,
  descriptionAr,
  setDescriptionAr,
  descriptionFr,
  setDescriptionFr,
  price,
  setPrice,
  originalPrice,
  setOriginalPrice,
  selectedCategoryJSON,
  setSelectedCategoryJSON,
  isNew,
  setIsNew,
  keywords,
  setKeywords,
  keywordsInput,
  setKeywordsInput,
  allowDirectPurchase,
  setAllowDirectPurchase,
  allowAddToCart,
  setAllowAddToCart,
  handleKeywordKeyDown,
  removeKeyword,
} = useProductFormState(product, isOpen);
```

### useProductImages

```typescript
const {
  mainImage,
  mainImagePreview,
  subImages,
  subImagePreviews,
  deletedSubImageUrls,
  certificationImages,
  certificationImagePreviews,
  deletedCertificationImageUrls,
  handleMainImageChange,
  handleSubImagesChange,
  handleCertificationImagesChange,
  removeSubImage,
  removeCertificationImage,
} = useProductImages(product, isOpen);
```

### useProductVariants

```typescript
const {
  variantOptions,
  variants,
  optionValueInputs,
  customOptionFlags,
  newVariantImages,
  deletedVariantImageUrls,
  setOptionValueInputs,
  addVariantOption,
  removeVariantOption,
  handleOptionNameChange,
  updateCustomOptionName,
  addOptionValue,
  removeOptionValue,
  updateVariantPrice,
  handleVariantImagesChange,
  removeVariantImage,
} = useProductVariants(product, isOpen, hasVariants);
```

### useProductSections

```typescript
const {
  hasRelatedProducts,
  setHasRelatedProducts,
  selectedRelatedProducts,
  hasCustomSections,
  setHasCustomSections,
  customSections,
  addRelatedProduct,
  removeRelatedProduct,
  addCustomSection,
  removeCustomSection,
  updateCustomSection,
  addProductToSection,
  removeProductFromSection,
} = useProductSections(product, isOpen);
```

## Utilities

### Validation

```typescript
import { validateProductForm, scrollToFirstError } from "../utils/validation";

const errors = validateProductForm({
  nameAr,
  nameFr,
  descriptionAr,
  descriptionFr,
  price,
  selectedCategoryJSON,
  hasVariants,
  variantOptions,
  variants,
  allowDirectPurchase,
  allowAddToCart,
  hasCustomSections,
  customSections,
  product,
  mainImage,
  t,
});

if (Object.keys(errors).length > 0) {
  scrollToFirstError(errors);
}
```

### Product Form Utils

```typescript
import {
  generateCombinations,
  handleImageArrayChange,
  removeImageFromArray,
} from "../utils/productFormUtils";

// Generate variant combinations
const combinations = generateCombinations(variantOptions);

// Handle image uploads
handleImageArrayChange(event, setImages, setImagePreviews);

// Remove images
removeImageFromArray(
  index,
  url,
  previews,
  images,
  setImages,
  setPreviews,
  setDeleted
);
```

## Constants

```typescript
import { PREDEFINED_OPTIONS } from "../constants/variantOptions";

// Available options:
// - Size (الحجم / Taille)
// - Color (اللون / Couleur)
// - Weight (الوزن / Poids)
// - Material (المادة / Matériau)
// - Capacity (السعة / Capacité)
```

## Common Tasks

### Adding a New Field

1. Add state in `useProductFormState` hook
2. Add field in `BasicProductInfo` component
3. Update validation in `utils/validation.ts`
4. Include in form submission in `ProductFormModal`

### Adding a New Section Type

1. Update type in `useProductSections` hook
2. Add UI in `ProductSections` component
3. Update validation if needed
4. Handle in form submission

### Modifying Variant Logic

1. Update state in `useProductVariants` hook
2. Modify UI in `VariantManagement` component
3. Update `generateCombinations` if needed

### Adding Image Type

1. Create new component in `ImageUpload/`
2. Add state in `useProductImages` hook
3. Include in `ProductFormModal` rendering
4. Handle in form submission

## Error Handling

All validation errors are shown inline and auto-scroll to first error:

```typescript
{
  errors.fieldName && (
    <p className="text-red-500 text-xs mt-1">{errors.fieldName}</p>
  );
}
```

## Submission Flow

1. **Validation** → `validateProductForm()`
2. **Data Preparation** → Transform state to API format
3. **FormData Creation** → Append all fields and files
4. **Cleanup** → Remove blob URLs from variants
5. **Submit** → Call `onSubmit(formData)`

## File Locations

- **Components**: `src/app/[locale]/admin/products/components/`
- **Hooks**: `src/app/[locale]/admin/products/hooks/`
- **Utils**: `src/app/[locale]/admin/products/utils/`
- **Constants**: `src/app/[locale]/admin/products/constants/`
- **Docs**:
  - `REFACTORING.md` - Detailed refactoring docs
  - `REFACTORING_SUMMARY.md` - Metrics and overview
  - `QUICK_REFERENCE.md` - This file

## TypeScript Types

All types imported from `@/types`:

- `Product`
- `Category`
- `ProductVariant`
- `VariantOption`
- `Locale` (from `@/i18n/config`)

Custom types:

- `ValidationErrors` (in `utils/validation.ts`)
- `CustomSection` (in `utils/validation.ts`)

## Best Practices

1. **State Updates**: Use provided setters from hooks
2. **Validation**: Run before submission, show errors inline
3. **Error Handling**: Auto-scroll to first error
4. **Images**: Handle both new (blob:) and existing (URL) correctly
5. **Cleanup**: Remove blob URLs before submission
6. **Testing**: Test each component in isolation

## Debugging Tips

1. **State Issues**: Check specific hook (form/images/variants/sections)
2. **Validation**: Look in `utils/validation.ts`
3. **Combinations**: Debug `generateCombinations` in utils
4. **Images**: Check `useProductImages` hook
5. **Props Flow**: Trace from `ProductFormModal` down to specific component

## Performance Notes

- Hooks initialize only on `isOpen` change
- Variant combinations re-generate only when options change
- Image previews use blob URLs for efficiency
- Validation runs only on submit (not real-time)

---

**Last Updated**: November 13, 2025  
**Version**: 2.0 (Refactored)
