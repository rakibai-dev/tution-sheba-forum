# Styling Reference

This project uses Tailwind CSS utilities directly in JSX. There is no custom theme file or separate component stylesheet.

## Styling Stack

- Tailwind CSS v4 via `@tailwindcss/vite`
- Global CSS entry: `src/index.css`
- Component styling lives across:
  - `src/components/Navbar.jsx`
  - `src/components/TuitionCard.jsx`
  - `src/components/TeacherCard.jsx`
  - `src/components/TeacherModal.jsx`
  - `src/pages/TuitionsPage.jsx`
  - `src/pages/TeachersPage.jsx`

## Core Visual Direction

- **Background**: Light blue to indigo gradient (`min-h-screen bg-linear-to-br from-blue-50 to-indigo-100/60`)
- **Surfaces**: White cards with rounded corners, soft shadows, and light gray borders (`bg-white rounded-lg shadow-md border border-gray-200`)
- **Tone**: Clean, informational, data-dashboard style
- **Primary accent**: Blue (`blue-600`, `blue-700`)
- **Semantic accents**: Green, red, purple, indigo, pink, yellow, orange

---

## Layout Patterns

- **App shell**: `min-h-screen flex flex-col`
- **Main page container**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8`
- **Standard cards**: `bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 p-5`
- **Section spacing**: `mb-8`, `mb-4`
- **Responsive grids**:
  - Filter bars: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`
  - Card grids: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
  - Two-column semantic info blocks: `grid grid-cols-2 gap-3`

---

## Typography

- **Page title**: `text-4xl font-bold text-gray-800 mb-2`
- **Section title**: `text-xl font-bold text-gray-800 mb-4`
- **Card title**: `text-xl font-bold text-blue-700`
- **Labels & metadata**: `text-sm text-gray-600` or `text-xs text-gray-500`
- **Values / Strong text**: `font-semibold text-gray-800`

---

## Forms & Controls

- **Inputs and selects**:
  - Base: `w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`
  - Disabled state: `disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-100`
- **Primary buttons**:
  - `px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition text-sm cursor-pointer shadow-xs`
- **Secondary / Reset buttons**:
  - `px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition text-sm cursor-pointer`
- **Action / Outline buttons**:
  - `px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg border border-gray-300 shadow-sm transition text-sm cursor-pointer`

---

## Navigation Header (`Navbar.jsx`)

- **Sticky bar**: `bg-white border-b border-gray-200 sticky top-0 z-40 shadow-xs h-16`
- **Brand logo**: `w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20`
- **Brand text**: `text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent`
- **Active route tab**: `bg-blue-600 text-white shadow-sm shadow-blue-500/30 px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold`
- **Inactive route tab**: `text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all`

---

## Card Styling (`TuitionCard.jsx` & `TeacherCard.jsx`)

### Container & Header
- **Container**: `bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 p-5 flex flex-col justify-between`
- **Header layout**: `flex justify-between items-start mb-4 pb-3 border-b`
- **Status badges**:
  - Published / Premium: `bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold`
  - Female Teacher: `bg-pink-100 text-pink-800 px-2 py-1 rounded text-xs font-semibold`
  - Male Teacher: `bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold`
  - Experience / Updates: `bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-semibold`
  - Urgent / Cancelled: `bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold`
  - Draft / Standard: `bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-semibold`

### Info Blocks inside Cards
- **Area / Class block**: `bg-blue-50 p-2 rounded`
- **Academic Year / Student block**: `bg-purple-50 p-2 rounded`
- **Honors Dept / Medium block**: `bg-indigo-50 p-2 rounded`
- **Institute / College block**: `bg-pink-50 p-2 rounded`
- **Subject highlight**: `mb-4 p-3 bg-yellow-50 rounded`
- **Time & Days / Schedule**: `bg-green-50 p-3 rounded`
- **Salary / Code highlight**: `col-span-2 bg-orange-100 p-3 rounded border-2 border-orange-300` with `font-bold text-orange-700 text-lg`
- **Location panel**: `mb-4 p-3 bg-gray-50 rounded`
- **Notes / Masters callout**: `mb-4 p-3 bg-blue-50 rounded border-l-4 border-blue-400`
- **Status & Updates panel**: `mb-4 p-3 bg-purple-50 rounded` with `border-t border-purple-200`
- **Admin / Footer info**: `pt-3 border-t text-xs text-gray-500 space-y-1`
- **Full card action button**: `w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition text-sm cursor-pointer shadow-xs`

---

## Modal Dialog Styling (`TeacherModal.jsx`)

- **Backdrop overlay**: `fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto`
- **Modal window**: `bg-white rounded-lg shadow-lg border border-gray-200 p-5 max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto text-left`
- **Close button**: `text-gray-400 hover:text-gray-700 font-bold px-2 py-0.5 rounded hover:bg-gray-100 text-lg leading-none cursor-pointer`
- **Header**: `flex justify-between items-start mb-4 pb-3 border-b`
  - Code & Name: `text-xl font-bold text-blue-700`
  - Subtitle: `text-sm text-gray-500`
- **Section structure**: Mirrors `TuitionCard` using identical color palettes (`bg-blue-50`, `bg-purple-50`, `bg-indigo-50`, `bg-pink-50`, `bg-yellow-50`, `bg-orange-100`, `bg-green-50`, `bg-gray-50`)
- **Qualification badge**: `text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 text-xs sm:text-sm`
- **Modal footer actions**: `pt-3 border-t flex justify-end gap-3`
  - Close button: `px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition text-sm cursor-pointer`
  - Copy button: `px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition text-sm cursor-pointer`

---

## State & Feedback Screens

- **Lock Screen (`LockScreen.jsx`)**:
  - Background: Fullscreen gradient (`min-h-screen bg-linear-to-br from-blue-50 to-indigo-100/60 flex items-center justify-center p-4`)
  - Card: Centered white container (`bg-white rounded-2xl shadow-xl border border-gray-200 p-8 max-w-md w-full text-center`)
  - Icon: Centered circle (`w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shadow-inner`)
  - Inputs: Floating icon input (`pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500`)
  - Primary button: Full width unlock button (`w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md`)
  - Lockout alert: Orange alert banner (`mb-5 p-4 rounded-lg bg-orange-50 border border-orange-200 text-orange-800 text-sm font-semibold`)
- **Sync Progress Banner**:
  - Container: `mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200`
  - Text & percentage: `text-sm text-blue-900 font-semibold`
  - Progress bar track: `w-full bg-blue-200 rounded-full h-2.5 overflow-hidden`
  - Progress bar fill: `bg-blue-600 h-2.5 rounded-full transition-all duration-300`
- **Error state**:
  - Banner: `mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3`
  - Fullscreen: Centered white panel on gradient background with red heading and blue retry button
- **Loading skeletons**:
  - White card shells with `bg-white rounded-lg shadow-md border border-gray-200 p-5 animate-pulse min-h-130 flex flex-col`
  - Placeholders: `h-5 w-28 bg-gray-200 rounded`, `h-12 bg-gray-100 rounded`
- **Empty state**:
  - Centered white panel: `bg-white rounded-lg shadow-md p-12 text-center border border-gray-200`
  - Title: `text-2xl font-bold text-gray-700 mb-2`
  - Subtitle: `text-gray-600 mb-4`
  - Reset button: `px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition`

---

## Semantic Color Palette

| Color | Utility Classes | Usage in App |
| :--- | :--- | :--- |
| **Blue** | `bg-blue-50`, `text-blue-700`, `bg-blue-600`, `border-blue-400` | Primary buttons, headers, links, area/class block, notes callout |
| **Purple** | `bg-purple-50`, `text-purple-800`, `border-purple-200` | Academic year, student info, status and verification updates |
| **Indigo** | `bg-indigo-50`, `text-indigo-700`, `border-indigo-200` | Honors department, medium block, guardian demand & GPA badges |
| **Pink** | `bg-pink-50`, `text-pink-800`, `bg-pink-100` | Honors institute, college, female teacher status badges |
| **Yellow** | `bg-yellow-50`, `text-gray-800` | Favorite subject panel, tuition subject highlight |
| **Green** | `bg-green-50`, `text-green-800`, `bg-green-100` | Published badge, experience schedule, WhatsApp available |
| **Orange** | `bg-orange-100`, `text-orange-700`, `border-orange-300` | Salary highlight, verified tutor code emphasis |
| **Red** | `bg-red-50`, `text-red-800`, `bg-red-100`, `border-red-500` | Cancelled banner, urgent badge, sync error alerts |
| **Gray** | `bg-gray-50`, `border-gray-200`, `text-gray-500`, `text-gray-600` | Location blocks, card borders, metadata, draft badges |
