# Customizable-Dash (React)

A browser-based, client-side dashboard framework rebuilt with React, TypeScript, and Recharts.

Upload your data as **JSON** or **CSV** and create interactive, customizable dashboards with drag-and-drop widgets.

## Features

### Data Upload
- JSON and CSV file support
- Zero-dependency CSV parser with quoted fields, escaped quotes, numeric auto-detection, and BOM stripping

### 10 Chart Types
- **Line Chart** — multi-series line chart with filters and range control
- **Area Chart** — stacked area chart (same configuration as line)
- **Pie Chart** — auto-created for columns with 4 or fewer unique values
- **Bar Chart** — vertical bar chart for frequency data
- **Horizontal Bar Chart** — horizontal layout bar chart
- **Multi Bar Chart** — grouped bars comparing two dimensions
- **Stacked Bar Chart** — stacked bars comparing two dimensions
- **Scatter Plot** — X/Y scatter for two numeric columns
- **Radar Chart** — compare 3+ numeric columns with optional grouping
- **Box Plot** — quartile visualization with outlier detection

### Data Table
- Full dataset view with column search/filter
- Click-to-sort column headers (ascending, descending, none)
- Numeric-aware and string-aware sorting
- Pagination with configurable page size (10, 25, 50, 100)

### Dashboard
- Drag-and-drop widget grid (react-grid-layout)
- Resizable chart widgets
- Session persistence via sessionStorage
- Responsive layout

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** — dev server and build
- **Recharts** — charting library
- **Tailwind CSS 4** — styling
- **react-grid-layout** — drag/resize grid
- **Vitest** + **Testing Library** — tests

## Getting Started

```bash
cd eeze-dash-react
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | TypeScript check + production build |
| `npm run test` | Run tests with Vitest |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

## License

MIT License - Copyright (c) 2017 Eyob Woldegiorgis
