# Inventory Manager (React + TypeScript + Ant Design)

## Run in VS Code
1. Install Node.js 18+
2. Open this folder in VS Code
3. In the terminal: `npm install` then `npm run dev`
4. Open http://localhost:5173

## Structure
- `src/App.tsx` – app state and screen routing
- `src/types.ts` – shared types
- `src/data/products.ts` – starting data
- `src/utils.ts` – peso format and stock status helpers
- `src/components/` – reusable pieces (PhoneFrame, ScreenHeader, BottomNav, ProductRow, ...)
- `src/screens/` – one file per screen
