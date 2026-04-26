# IPNS Frontend - React + Tailwind CSS

Modern, responsive frontend for the Inter-Pharmacy Network System built with React 19, Vite, and Tailwind CSS 4.

## 🎨 Design Theme

- **Color Scheme**: Dark theme with emerald/teal accents
- **Background**: Slate-900 (#0f172a) and slate-800 (#1e293b)
- **Primary Accent**: Emerald-500 (#10b981)
- **Secondary Accent**: Teal-400 (#2dd4bf)

## 🚀 Features

- **Real-time Medicine Search** - Search medicines across all pharmacies
- **Pharmacy Finder** - Filter pharmacies by location and insurance
- **Availability Checker** - See which pharmacies have specific medicines in stock
- **Responsive Design** - Works seamlessly on mobile, tablet, and desktop
- **Dark Mode UI** - Eye-friendly dark interface with green accents
- **Real-time Status** - Check pharmacy open/closed status
- **Favorites** - Save favorite pharmacies for quick access

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.jsx          # Navigation header with logo
│   ├── Footer.jsx          # Footer with links and info
│   └── Layout.jsx          # Main layout wrapper
├── pages/
│   ├── Home.jsx            # Home page with hero and search
│   ├── PharmacyFinder.jsx  # Pharmacy search and filtering
│   ├── MedicineSearch.jsx  # Medicine availability search
│   └── About.jsx           # About IPNS page
├── hooks/
│   └── useRouter.js        # Simple hash-based router
├── utils/
│   └── api.js              # API calls and endpoints
├── assets/
│   ├── default.png         # IPNS logo
│   └── images/             # Other images
├── App.jsx                 # Main app component with routing
├── main.jsx                # Entry point
└── index.css               # Tailwind CSS imports
```

## 🔧 Setup & Installation

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Server will run at: `http://localhost:5173`

### 3. Build for Production
```bash
npm run build
```

## 📡 API Configuration

The frontend communicates with the Django backend at:
```
http://localhost:8000/api/v1/
```

**API Calls** are managed in `src/utils/api.js`

### Available Endpoints Used

- **Medicines**: Search medicines, get availability
- **Pharmacies**: Get pharmacy info, filter by location/insurance
- **Locations**: Get Province/District/Sector hierarchy
- **Stock**: Check medicine availability in specific pharmacy

## 🎯 Pages & Routes

| Route | Page | Purpose |
|-------|------|---------|
| `#/` | Home | Hero section with search functionality |
| `#/pharmacies` | Pharmacy Finder | Search and filter pharmacies by location |
| `#/medicines` | Medicine Search | Find where specific medicines are available |
| `#/about` | About | About IPNS and our mission |

## 🎨 Component Overview

### Header
- Navigation menu with responsive mobile menu
- IPNS logo with gradient text
- Navigation links to all pages
- "Get Started" CTA button

### Footer
- Quick links
- Contact information
- Social media links
- Copyright information

### Home Page
- Hero section with gradient text
- Medicine search bar
- Pharmacy filter option (tab-based)
- Search results display
- Features section
- Call-to-action

### Pharmacy Finder
- Filter by Province, District, Status
- Real-time pharmacy listings
- Pharmacy cards with:
  - Name and location
  - Current status (Open/Closing Soon/Closed)
  - Operating hours
  - Insurance partnerships
  - Action buttons
- Favorites management
- Favorites section

### Medicine Search
- Medicine search input
- District filtering
- Two-column layout:
  - Left: Medicine results
  - Right: Availability results
- Stock information display
- Price and quantity details
- Expiry status

### About Page
- Mission statement
- Core values
- Problem we solve
- Our solution
- Vision for the future
- Call-to-action

## 🧩 Key Components & Hooks

### useRouter Hook
Simple hash-based router for client-side navigation
```javascript
const currentPage = useRouter()
// Returns current page: '/', '/pharmacies', '/medicines', '/about'
```

### API Utilities
```javascript
import { apiGet, apiPost, endpoints } from './utils/api'

// Examples:
const medicines = await apiGet(endpoints.medicines)
const pharmacies = await apiGet(endpoints.pharmacies, { district_id: 1 })
```

## 🎨 Tailwind CSS Utilities

### Color Classes
- `text-emerald-400` - Primary text color
- `bg-emerald-500` - Primary button color
- `border-emerald-500` - Primary border color
- `bg-slate-900` - Dark background
- `text-gray-400` - Secondary text

### Common Patterns
```jsx
// Button styling
<button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors duration-200">
  Button
</button>

// Card styling
<div className="bg-slate-800 border border-emerald-500/20 rounded-xl p-6 hover:border-emerald-500/50 transition-all">
  Content
</div>

// Text gradient
<h1 className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
  Gradient Text
</h1>
```

## 📦 Dependencies

- **React 19.2.4** - UI framework
- **Tailwind CSS 4.2.2** - Utility-first CSS
- **Lucide React** - Icon library
- **Vite 8.0.4** - Build tool

## 🚀 Development Tips

### Adding a New Page
1. Create page file in `src/pages/PageName.jsx`
2. Add route in `App.jsx` switch statement
3. Add navigation link in `Header.jsx`

### Using Icons
```javascript
import { IconName } from 'lucide-react'

<IconName size={24} className="text-emerald-400" />
```

Available icons: `Search`, `MapPin`, `Clock`, `Heart`, `Building2`, `Filter`, `Menu`, `X`, `Pill`, etc.

### Making API Calls
```javascript
import { apiGet, endpoints } from '../utils/api'

const data = await apiGet(endpoints.medicines, { 
  search: 'paracetamol' 
})
```

## 🔒 Environment Variables

Create a `.env` file in the frontend folder:
```
VITE_API_URL=http://localhost:8000/api/v1
```

Then use in code:
```javascript
const API_URL = import.meta.env.VITE_API_URL
```

## 📱 Responsive Design

Breakpoints used:
- `sm` - 640px
- `md` - 768px
- `lg` - 1024px
- `xl` - 1280px

Grid examples:
```jsx
// 1 col on mobile, 2 on tablet, 3 on desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

## 🧪 Testing

Run linter:
```bash
npm run lint
```

## 📝 Code Style

- **Functional Components** - All components are functional with hooks
- **JSX** - Use JSX syntax for templates
- **Tailwind** - Use Tailwind classes instead of CSS files
- **Comments** - Add JSDoc comments for components

## 🐛 Common Issues

**Issue**: API calls return CORS errors
- **Solution**: Make sure backend is running on `http://localhost:8000`
- Check CORS settings in backend `settings.py`

**Issue**: Styles not updating
- **Solution**: Check that Tailwind is properly imported in `index.css`
- Clear browser cache with Ctrl+Shift+Delete

**Issue**: Routes not working
- **Solution**: Make sure hash is included: `#/route-name`
- Check that route is defined in `App.jsx`

## 🔗 Backend Integration

Frontend expects these API responses:

### Medicines List
```json
[
  {
    "id": 1,
    "name": "Paracetamol",
    "generic_name": "Acetaminophen",
    "strength": "500mg",
    "manufacturer": "Generic Pharma"
  }
]
```

### Pharmacies List
```json
[
  {
    "id": 1,
    "name": "Health Center",
    "phone_number": "+250788123456",
    "current_status": "open",
    "opening_time": "08:00:00",
    "closing_time": "20:00:00"
  }
]
```

See `API_RESPONSE_SCHEMAS.md` in backend for full schema details.

## 📚 Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Guide](https://vitejs.dev)
- [Lucide Icons](https://lucide.dev)

## 🎓 Learning Path

1. Start with `Home.jsx` to understand basic structure
2. Look at `PharmacyFinder.jsx` to see filtering logic
3. Check `api.js` for API call patterns
4. Review `useRouter.js` for routing implementation

## 🤝 Contributing

When adding features:
1. Follow the existing file structure
2. Use Tailwind classes for styling
3. Keep components focused and reusable
4. Add comments for complex logic
5. Test on mobile before committing

## 📄 License

Part of the IPNS project - Created for healthcare accessibility in Rwanda

---

**Status**: ✅ Frontend fully initialized with all main pages
**Last Updated**: 2024-04-08
