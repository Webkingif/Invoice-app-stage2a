# Invoice Management Application

A functional and polished invoice management dashboard built with React, TypeScript, and Tailwind CSS. This application allows users to create, view, edit, and filter invoices with a seamless light/dark theme experience.

## 🚀 Setup Instructions

Follow these steps to get the project running locally:

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd invoice-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

4. **Build for production**:
   ```bash
   npm run build
   ```

## 🏗️ Architecture Explanation

The application is built with a focus on modularity, performance, and type safety.

- **Frontend Framework**: **React 19** with **Vite** as the build tool.
- **State Management**: 
  - **Context API**: Used for global states. 
    - `InvoiceContext`: Manages the CRUD logic for invoices, filtering, and the state of the creation/editing form.
    - `ThemeContext`: Handles the application's theme switching logic.
- **Styling**: **Tailwind CSS 4**. Theme switching is handled via custom CSS variables defined in `src/index.css` that swap based on a `.dark` class applied to the root element.
- **Animations**: **Framer Motion** (`motion/react`) is used for the "spring" transitions on the side drawer, modal entries, and list entry animations.
- **Icons**: **Lucide React** for a consistent and accessible icon set.

## ⚖️ Trade-offs

During development, several decisions were made to balance speed and scalability:

- **Persistence**: Data is currently persisted via `localStorage`. 
  - *Trade-off*: This allows for a fast, backend-less demo, but does not support multi-device synchronization.
- **Client-Side Filtering**: All filtering logic (draft/pending/paid) happens in the browser. 
  - *Trade-off*: This is extremely fast for standard usage but would require server-side pagination if the application handled thousands of records.
- **Context vs. State Libraries**: Standard React Context was chosen over Redux or Zustand.
  - *Trade-off*: While Context can lead to unnecessary re-renders in massive apps, it was the perfect "no-boilerplate" solution for the medium complexity of this invoice dashboard.

## ♿ Accessibility Notes

Accessibility was integrated into the design and component architecture:

- **Semantic HTML**: Using HTML5 landmarks like `<main>`, `<header>`, and `<section>` to help screen readers understand the structure.
- **Focus Management**: The `InvoiceForm` drawer includes focus-trapping logic to ensure keyboard users don't "leak" focus back to the background dashboard while the form is open.
- **ARIA Attributes**: Buttons and interactive elements include descriptive labels where icons alone might be ambiguous.
- **Contrast**: The application follows the "League Spartan" design specifications, ensuring high contrast and readability in both light and dark modes.
- **Touch Targets**: All mobile buttons and inputs are sized to at least 44px to ensure ease of use on touch screens.
