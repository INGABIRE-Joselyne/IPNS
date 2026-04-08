# Frontend Quick Start Guide

Get the IPNS frontend running in 5 minutes!

## 🚀 Quick Start (5 minutes)

### Prerequisites
- Node.js 18+ installed
- Backend running on `http://localhost:8000`

### Steps

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# http://localhost:5173
```

That's it! 🎉

## 📚 Project Structure Quick Guide

```
src/
├── components/         # Reusable UI components
│   ├── Header.jsx     # Navigation & logo
│   ├── Footer.jsx     # Footer
│   └── Layout.jsx     # Page wrapper
├── pages/             # Full page components
│   ├── Home.jsx       # Home page
│   ├── PharmacyFinder.jsx
│   ├── MedicineSearch.jsx
│   └── About.jsx
├── hooks/             # React hooks
│   └── useRouter.js   # Navigation
├── utils/             # Utilities
│   └── api.js         # API calls
├── assets/            # Images & static files
├── App.jsx            # Main app (routing)
├── main.jsx           # Entry point
└── index.css          # Styles
```

## 🎨 Design System

### Colors
```javascript
// Primary (Emerald)
bg-emerald-500       // Actions & highlights
border-emerald-500   // Accents
text-emerald-400     // Text highlights

// Background
bg-slate-900         // Dark bg
bg-slate-800         // Cards
text-gray-300        // Body text
text-gray-400        // Secondary text
```

### Components
```jsx
// Button
<button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors">

// Card
<div className="bg-slate-800 border border-emerald-500/20 rounded-xl p-6">

// Badge
<span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
```

## 🔧 Common Tasks

### Add a New Page

1. Create page file in `src/pages/PageName.jsx`
2. Add route in `App.jsx`
3. Add link in `Header.jsx`

```javascript
// App.jsx
case '/new-page':
  return <NewPage />

// Header.jsx
{ label: 'New Page', href: '#/new-page' }
```

### Make an API Call

```javascript
import { apiGet, endpoints } from '../utils/api'

const data = await apiGet(endpoints.medicines, { search: 'paracetamol' })
```

### Use an Icon

```javascript
import { IconName } from 'lucide-react'

<IconName size={24} className="text-emerald-400" />
```

### Add Tailwind Classes

```jsx
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Gradient text
<h1 className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">

// Hover effects
className="hover:border-emerald-500 transition-colors duration-200"
```

## 🐛 Debugging

### Check Console
Open browser DevTools (F12) → Console tab

### Test API Calls
```javascript
// In browser console
import('http://localhost:5173/src/utils/api.js').then(m => 
  m.apiGet('/medicines/')
)
```

### Check Backend Connection
```bash
# In backend folder
python manage.py runserver

# Should output:
# Starting development server at http://127.0.0.1:8000/
```

## 📱 Testing on Mobile

### Mobile Testing
```bash
# Get your computer IP
ipconfig getifaddr en0  # Mac
ipconfig               # Windows

# Access from phone on same network
http://<YOUR-IP>:5173
```

### Responsive Design
- Test with DevTools device emulation (F12)
- Check breakpoints: xs (mobile) → sm → md → lg → xl

## 🚀 Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Output is in dist/ folder
```

## 📝 File Naming

- **Components**: PascalCase (`Header.jsx`)
- **Pages**: PascalCase (`Home.jsx`)
- **Utilities**: camelCase (`api.js`)
- **CSS Classes**: Use Tailwind (no separate CSS files)

## 🎯 Page Routes

| Page | Route | File |
|------|-------|------|
| Home | `#/` | `Home.jsx` |
| Pharmacies | `#/pharmacies` | `PharmacyFinder.jsx` |
| Medicines | `#/medicines` | `MedicineSearch.jsx` |
| About | `#/about` | `About.jsx` |

## 💡 Tips

1. **Components are reusable** - Use Layout for all pages
2. **API centralized** - All API calls go through `api.js`
3. **Styling is Tailwind** - No CSS files needed
4. **Routing is hash-based** - Uses URL hash (#/)
5. **Icons are Lucide** - Check [lucide.dev](https://lucide.dev)

## 🔗 Useful URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api/v1/
- **Admin**: http://localhost:8000/admin/
- **API Docs**: `/api/v1/medicines/` (browsable)

## ✅ Checklist

Before pushing changes:
- [ ] No console errors
- [ ] Responsive (test on mobile)
- [ ] All links working
- [ ] API calls working
- [ ] Colors match theme
- [ ] No broken images

## 🆘 Need Help?

| Issue | Solution |
|-------|----------|
| "Cannot find module" | Run `npm install` |
| API errors (CORS) | Check backend is running |
| Styles not applying | Check Tailwind import in `index.css` |
| Routes not working | Remember the hash: `#/route` |
| Images not showing | Check path in `src/assets/` |

## 📖 Resources

- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)
- [Vite Guide](https://vitejs.dev)

---

**Happy Coding! 🎉**

For more details, see `README.md` and `FRONTEND_API_REFERENCE.md`
