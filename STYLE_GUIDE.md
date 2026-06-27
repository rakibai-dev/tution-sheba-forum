# Styling Reference

This project uses Tailwind CSS utilities directly in JSX. There is no custom theme file or separate component stylesheet.

## Styling Stack

- Tailwind CSS v4 via `@tailwindcss/vite`
- Global CSS entry: `src/index.css`
- Component styling mostly lives in `src/App.jsx` and `src/components/TuitionCard.jsx`
- `src/App.css` is empty

## Core Visual Direction

- Background: light blue to indigo gradient
- Surfaces: white cards with rounded corners, soft shadows, and light gray borders
- Tone: clean, informational, data-dashboard style
- Primary accent: blue
- Secondary accents: green, red, purple, indigo, pink, yellow, orange

## Layout Patterns

- App shell: `min-h-screen`, `py-8`, `px-4`
- Main container: `max-w-7xl mx-auto`
- Standard cards: `bg-white rounded-lg shadow-md border border-gray-200 p-5`
- Section spacing: `mb-8`, `mb-4`
- Responsive grids:
  - Filters: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`
  - Card lists: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
  - Two-column info blocks: `grid grid-cols-2 gap-3`

## Typography

- Page title: `text-4xl font-bold text-gray-800`
- Section title: `text-xl font-bold text-gray-800`
- Card title: `text-xl font-bold text-blue-700`
- Labels and metadata: `text-sm text-gray-600` or `text-xs text-gray-500`
- Strong values: `font-semibold text-gray-800`

## Forms

- Inputs and selects:
  - `w-full px-4 py-2 border border-gray-300 rounded-lg`
  - `focus:outline-none focus:ring-2 focus:ring-blue-500`
  - disabled state: `disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-100`
- Primary buttons:
  - `px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition`
- Secondary buttons:
  - `px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition`

## Card Styling

### Main tuition card

- Container: `bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 p-5`
- Header divider: `pb-3 border-b`
- Status badges:
  - Published: `bg-green-100 text-green-800`
  - Draft: `bg-gray-100 text-gray-800`
  - Urgent: `bg-red-100 text-red-800`

### Info blocks inside cards

- Class: `bg-blue-50 p-2 rounded`
- Student: `bg-purple-50 p-2 rounded`
- Medium: `bg-indigo-50 p-2 rounded`
- Institute: `bg-pink-50 p-2 rounded`
- Subject: `bg-yellow-50 rounded p-3`
- Teacher requirements: plain section with spaced rows
- Time and days: `bg-green-50 p-3 rounded`
- Salary highlight: `bg-orange-100 p-3 rounded border-2 border-orange-300`
- Location: `bg-gray-50 p-3 rounded`
- Notes/comments: `bg-blue-50 rounded border-l-4 border-blue-400`
- Status/updates: `bg-purple-50 rounded`

## State Styling

- Error screen:
  - Full-screen gradient background
  - Centered white panel with red-accent heading
  - Retry button in blue
- Loading skeletons:
  - White card shells with `animate-pulse`
  - Gray placeholder bars and blocks
- Empty state:
  - Centered white panel
  - Clear message and blue reset button

## Reusable Color Usage

- Gray: borders, labels, metadata, neutral text
- Blue: primary action, title accent, info panels, links
- Green: success/published states, WhatsApp status, time/day panels
- Red: error state, urgent badge
- Purple: student/updates/status panels
- Indigo: medium block
- Pink: institute block
- Yellow: subject block
- Orange: salary emphasis

## Copyable Summary

Use a light blue-to-indigo gradient page background, white rounded cards with soft shadows, and Tailwind utility classes for all spacing and colors. Keep the layout dashboard-like, with responsive grids, bold section titles, muted labels, and strong blue primary actions. Use colored semantic panels for different tuition fields and clear status badges for publish/urgent states.
