# Visual Architecture

## Before Refactoring

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                  ProductFormModal.tsx                       │
│                     (1,869 lines)                           │
│                                                             │
│  • State (all mixed together)                               │
│  • UI Components (all inline)                               │
│  • Business Logic (scattered)                               │
│  • Validation (embedded)                                    │
│  • Utilities (inline functions)                             │
│  • Event Handlers (hundreds of them)                        │
│  • Constants (hardcoded)                                    │
│                                                             │
│  ⚠️ Hard to maintain                                        │
│  ⚠️ Hard to test                                            │
│  ⚠️ Hard to debug                                           │
│  ⚠️ High complexity                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## After Refactoring

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ProductFormModal.tsx                                 │
│                          (367 lines)                                        │
│                    ✨ Clean Orchestrator ✨                                │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
            ┌───────▼──────┐ ┌─────▼──────┐ ┌─────▼──────┐
            │   Components  │ │   Hooks    │ │   Utils    │
            └───────┬──────┘ └─────┬──────┘ └─────┬──────┘
                    │               │               │
    ┌───────────────┼───────────────┤               │
    │               │               │               │
┌───▼───┐   ┌──────▼──────┐  ┌────▼────┐    ┌─────▼──────┐
│ Basic │   │  Variant    │  │  Form   │    │ Validation │
│ Info  │   │ Management  │  │  State  │    │            │
│ 275   │   │    362      │  │   96    │    │    157     │
└───────┘   └─────────────┘  └─────────┘    └────────────┘
                │                   │
    ┌───────────┼───────┐           ├──────────┬──────────┐
    │           │       │           │          │          │
┌───▼───┐   ┌──▼───┐ ┌─▼─────┐ ┌───▼───┐ ┌───▼────┐ ┌──▼──────┐
│Product│   │Image │ │Sections│ │ Images│ │Variants│ │Sections │
│ 242   │   │Upload│ │        │ │  96   │ │  222   │ │  131    │
└───────┘   │ 202  │ └────────┘ └───────┘ └────────┘ └─────────┘
            └──────┘
```

## Data Flow

```
┌─────────────┐
│   Parent    │
│  Component  │
└──────┬──────┘
       │ props
       ▼
┌─────────────────────────────────────┐
│      ProductFormModal (Main)        │
│  • Orchestrates sub-components      │
│  • Manages form submission          │
│  • Handles validation errors        │
└──────┬───────────┬──────────┬───────┘
       │           │          │
       │ props     │ props    │ props
       ▼           ▼          ▼
  ┌─────────┐ ┌────────┐ ┌─────────┐
  │ Basic   │ │Variant │ │Sections │
  │  Info   │ │ Mgmt   │ │         │
  └────┬────┘ └───┬────┘ └────┬────┘
       │          │           │
       │ callbacks│callbacks  │ callbacks
       │          │           │
       └──────────┴───────────┘
                  │
                  ▼
          ┌──────────────┐
          │   Hooks      │
          │ • FormState  │
          │ • Images     │
          │ • Variants   │
          │ • Sections   │
          └──────────────┘
                  │
                  ▼
          ┌──────────────┐
          │   Utils      │
          │ • Validation │
          │ • Helpers    │
          └──────────────┘
```

## Hook Dependencies

```
┌─────────────────────────────────────┐
│      ProductFormModal               │
└──────────┬──────────────────────────┘
           │
           ├──► useProductFormState(product, isOpen)
           │    • Basic fields (name, description, price)
           │    • Keywords
           │    • Purchase options
           │
           ├──► useProductImages(product, isOpen)
           │    • Main image
           │    • Sub images
           │    • Certification images
           │    • Deleted image tracking
           │
           ├──► useProductVariants(product, isOpen, hasVariants)
           │    • Variant options
           │    • Generated variants
           │    • Variant-specific data
           │    • Custom flags
           │
           └──► useProductSections(product, isOpen)
                • Related products
                • Custom sections
                • Section CRUD operations
```

## Component Communication

```
       ┌─────────────────────────────────┐
       │     ProductFormModal            │
       │  (State Container & Orchestrator)│
       └───┬─────────┬─────────┬─────────┘
           │         │         │
      Props│    Props│    Props│
           │         │         │
     ┌─────▼───┐ ┌──▼────┐ ┌──▼──────┐
     │ Basic   │ │Variant│ │Sections │
     │  Info   │ │ Mgmt  │ │         │
     └─────┬───┘ └──┬────┘ └──┬──────┘
           │        │         │
    Callback│ Callback│  Callback│
           │        │         │
       ┌───▼────────▼─────────▼───┐
       │   Parent State Updates   │
       │  (via custom hooks)      │
       └──────────────────────────┘
```

## File Size Comparison

```
Before:
█████████████████████████████████████████████████ 1,869 lines

After:
Main:     ████████ 367 lines
BasicInfo: ██████ 275 lines
Variants:  ████████ 362 lines
Sections:  █████ 242 lines
Images:    ████ 202 lines
Hooks:     ████████████ 549 lines
Utils:     █████ 245 lines
Constants: █ 11 lines
          ─────────────────────────
Total:    ████████████████████████████████████████████████ 2,253 lines
(Distributed & Maintainable)
```

## Complexity Reduction

```
Before:                    After:

Complexity: ████████████   Complexity: ██ (per component)
Test: ██                   Test: ██████████
Maintain: ██               Maintain: ██████████
Reuse: █                   Reuse: ████████
Debug: ██                  Debug: █████████
Scale: ██                  Scale: ██████████
```

## Responsibility Distribution

```
┌─────────────────────────────────────────────────────────────┐
│                Before: Single Component                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ All Responsibilities Mixed Together                  │   │
│  │ • UI • State • Logic • Validation • Handlers         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                After: Separated Concerns                     │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │    UI    │  │  State   │  │  Logic   │  │Validation│   │
│  │Components│  │  Hooks   │  │  Utils   │  │  Utils   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│       ▲             ▲             ▲             ▲           │
│       └─────────────┴─────────────┴─────────────┘           │
│                 Clear Boundaries                            │
└─────────────────────────────────────────────────────────────┘
```

## Testing Pyramid

```
Before:                          After:

    Integration                     E2E
         ▲                           ▲
         │                           │
      Unit                      Integration
                                     ▲
                                     │
                                   Unit
                                     ▲
                                     │
                                 Components
                                     ▲
                                     │
                                   Hooks
                                     ▲
                                     │
                                   Utils

❌ Hard to test               ✅ Easy test pyramid
❌ Few unit tests             ✅ Many unit tests
❌ Mostly integration         ✅ Proper isolation
```

## Development Workflow

```
Before:
Developer 1 ────► │                   │ ◄──── Developer 2
                  │  ProductFormModal │
                  │   (merge hell)    │
                  └───────────────────┘

After:
Developer 1 ────► BasicProductInfo
Developer 2 ────► VariantManagement
Developer 3 ────► ProductSections
Developer 4 ────► Hooks (State)
                           ↓
                  Parallel Development
                     (No conflicts)
```

## Code Navigation

```
Before:                        After:

Where's the price logic?       Where's the price logic?
├─ Search entire file          ├─ BasicProductInfo.tsx ✓
└─ 1,869 lines to scan         └─ 275 lines to scan

Where's variant logic?         Where's variant logic?
├─ Search entire file          ├─ VariantManagement.tsx ✓
└─ Mixed with everything       ├─ useProductVariants.ts ✓
                               └─ Clear separation

How to add validation?         How to add validation?
├─ Find validation code        ├─ utils/validation.ts ✓
└─ Scattered everywhere        └─ Centralized location
```

## Maintenance Scenarios

### Scenario 1: Fix Price Bug

```
Before:                    After:
1. Open 1,869 line file   1. Open BasicProductInfo.tsx (275 lines)
2. Search for price       2. Price logic is obvious
3. Find scattered refs    3. Fix in one place
4. Risk breaking other    4. Isolated change
5. Hard to test           5. Easy to test
```

### Scenario 2: Add New Variant Type

```
Before:                    After:
1. Navigate huge file     1. Open constants/variantOptions.ts
2. Find constant          2. Add to PREDEFINED_OPTIONS
3. Find option UI         3. Done! UI auto-updates
4. Find value UI          4. Type-safe everywhere
5. Update validation      5. Validation auto-includes
6. Many places to touch   6. One change propagates
```

### Scenario 3: Modify Image Upload

```
Before:                    After:
1. Find upload code       1. Open ImageUpload/MainImageUpload.tsx
2. Scattered logic        2. All logic in one place
3. Hard to reuse          3. Reusable component
4. Duplicate code         4. DRY principle
```

## Performance Optimization Opportunities

```
Before:
┌────────────────────────────────┐
│  One Giant Component           │
│  • Re-renders everything       │
│  • Can't optimize parts        │
│  • All or nothing              │
└────────────────────────────────┘

After:
┌────────┐ ┌────────┐ ┌────────┐
│ Basic  │ │Variant │ │Sections│
│ Info   │ │  Mgmt  │ │        │
│        │ │        │ │        │
│ memo   │ │ memo   │ │ memo   │
└────────┘ └────────┘ └────────┘
  ↓ Only re-render when props change
  ↓ Independent optimization
  ↓ Better performance
```

---

**Architecture Type**: Modular Component-Based  
**Pattern**: Container/Presentational with Custom Hooks  
**Complexity**: Low (per component)  
**Maintainability**: High  
**Scalability**: Excellent
