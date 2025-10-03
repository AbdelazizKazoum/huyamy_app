# Cache Tags System Documentation

This document describes the centralized cache tags system for manual revalidation of the landing page.

## 📁 File Structure

```
src/lib/cache/
├── tags.ts                    # Centralized cache tags configuration
```

## 🏷️ Available Cache Tags

### Individual Tags
- `products` - Product data cache
- `categories` - Category data cache  
- `sections` - Section data cache

### Master Tags
- `landing-page` - Invalidates ALL landing page data at once
- `all-content` - Reserved for future site-wide invalidation

## 🔧 Configuration

All cache configurations are centralized in `src/lib/cache/tags.ts`:

```typescript
export const CACHE_CONFIG = {
  PRODUCTS: {
    tags: ['products', 'landing-page', 'all-content'],
    revalidate: 604800, // 7 days
    key: ['products'],
  },
  // ... other configs
}
```

## 🚀 API Endpoints

### 1. Quick Revalidation (Recommended)
**Endpoint**: `POST /api/revalidate/now`
**Purpose**: One-click invalidation of ALL landing page data

```bash
curl -X POST http://localhost:3000/api/revalidate/now \
  -H "Content-Type: application/json" \
  -d '{"secret": "your-secret"}'
```

### 2. Individual Tag Revalidation
**Endpoint**: `POST /api/revalidate/tag`
**Purpose**: Invalidate specific data types

```bash
# Invalidate only products
curl -X POST http://localhost:3000/api/revalidate/tag \
  -H "Content-Type: application/json" \
  -d '{"tag": "products", "secret": "your-secret"}'
```

### 3. Landing Page Revalidation
**Endpoint**: `POST /api/revalidate/landing-page`
**Purpose**: Invalidate all landing page tags individually

```bash
curl -X POST http://localhost:3000/api/revalidate/landing-page \
  -H "Content-Type: application/json" \
  -d '{"secret": "your-secret"}'
```

### 4. Advanced Revalidation
**Endpoint**: `POST /api/revalidate/advanced`
**Purpose**: Choose between tag-based or path-based revalidation

```bash
# Revalidate by tags
curl -X POST http://localhost:3000/api/revalidate/advanced \
  -H "Content-Type: application/json" \
  -d '{"secret": "your-secret", "method": "tags"}'

# Revalidate by path (entire page)
curl -X POST http://localhost:3000/api/revalidate/advanced \
  -H "Content-Type: application/json" \
  -d '{"secret": "your-secret", "method": "path"}'
```

## 🔒 Security

All endpoints require a secret token set in environment variables:

```bash
# .env.local
REVALIDATION_SECRET=your-super-secret-revalidation-key-change-this
```

## 🎯 Usage Examples

### Frontend Integration
You can create admin buttons that call these endpoints:

```typescript
const revalidateLandingPage = async () => {
  const response = await fetch('/api/revalidate/now', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret: process.env.REVALIDATION_SECRET })
  });
  
  if (response.ok) {
    alert('Landing page cache cleared!');
  }
};
```

### Webhook Integration
Connect to your CMS or admin panel:

```typescript
// When a product is updated in your CMS
await fetch('https://your-site.com/api/revalidate/tag', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    tag: 'products', 
    secret: process.env.REVALIDATION_SECRET 
  })
});
```

## 🔍 Monitoring

After revalidation, check server logs for cache regeneration:

```
[REVALIDATION] Invalidated cache for tag: products
[CACHE] Fetching products at 2025-10-03T10:44:07.454Z
```

## 📈 Benefits

1. **Separation of Concerns**: All cache logic centralized
2. **Type Safety**: TypeScript types for all tags
3. **Maintainable**: Easy to add new tags or modify existing ones
4. **Flexible**: Multiple revalidation strategies
5. **Secure**: Secret-based authentication
6. **Scalable**: Easy to extend for other pages/sections

## 🚧 Future Enhancements

- Add cache analytics
- Implement cache warming strategies
- Add batch revalidation for multiple tags
- Create admin UI for cache management
