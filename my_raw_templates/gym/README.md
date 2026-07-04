# 🏋️‍♂️ IRONPEAK Gym - Elevate Your Performance

Welcome to the official repository/source folder for the **IRONPEAK Gym** landing page. This is a premium, high-performance, and visually stunning web interface designed to capture the raw energy and elite standards of a state-of-the-art training facility. 

The website uses a modern dark-theme design aesthetic combined with custom-engineered glassmorphism elements, fluid animations, and highly interactive components.

---

## ✨ Core Features

1. **Interactive Custom Cursor**
   - Features a smooth-lagging dual cursor system (an inner dot and an outer tracking ring).
   - Utilizes Linear Interpolation (`lerp`) to create a floating, high-end hover feel.
   - Adapts dynamic colors, background states, and sizing when hovering over interactive elements like links, buttons, cards, and toggles.

2. **Smooth Sticky Navigation**
   - Responsive navbar that transitions from completely transparent to a high-blur glassmorphic background upon scrolling past `50px`.
   - Built-in dynamic section highlighting that automatically marks navigation links as `.active` when the corresponding section is scrolled into view.

3. **High-Impact Hero Section**
   - Fully animated tagline cycler showcasing key marketing messages in a smooth sliding sequence.
   - Sleek call-to-action buttons designed with interactive hover transitions and custom neon glow shadows.

4. **Dynamic Stats Overlay**
   - Overlay grid detailing key gym metrics (Coaches, Members, Programs, Success Rate).
   - Designed with subtle gradient headers and dividers to cleanly partition content.

5. **Scroll Reveal Animation**
   - Utilizes the browser's native **Intersection Observer API** for scroll-driven animations.
   - Smoothly transitions elements using multiple slide-up, slide-left, and scale-in reveal behaviors for an optimized performance profile.

6. **Interactive Pricing Toggle with Count Animation**
   - Custom-engineered slider toggle allowing users to switch between monthly and annual plans.
   - Animates numerical rate differences smoothly using a frame-rate-independent integer transition counter.

7. **Custom Touch/Drag Testimonial Carousel**
   - Built from scratch without heavy external libraries.
   - Supports touch swipe on mobile/tablet devices and mouse drag on desktop.
   - Automatically adapts slides-per-view based on the browser's viewport.
   - Includes dynamic navigation dots and controls.

---

## 🎨 Design System & Aesthetics

The design uses a dark theme curated specifically to reflect athletic intensity and elite gym environments:

- **Primary Background**: `#08090C` (Deep space grey/black)
- **Secondary Background**: `#101217` (Dark anthracite)
- **Accent Orange**: `#FF4D24` (High-octane neon orange for primary actions and highlights)
- **Accent Teal**: `#00F2FE` (Electric cyan for secondary interactive hover states)
- **Typography**: 
  - Headings & Buttons: `Outfit` (Bold, heavy, athletic, and modern)
  - Body Text: `Inter` (Extremely clean, legible, and modern geometric sans-serif)
- **Effects**: Rich CSS variables for glassmorphism panels (`backdrop-filter: blur(15px)`), customized neon scrollbars, and dynamic glowing spotlights.

---

## 📂 Project Structure

```bash
IRONPEAK Gym _ Elevate Your Performance_files/
├── style.css       # Core stylesheets, typography, layouts, utility classes, & animations
├── script.js      # Custom interactions, custom cursor tracking, pricing calculations, & carousel slider
└── about.png       # Key graphic showcasing training facilities
```

---

## 🛠️ Customizing the Theme

You can easily adapt the styling rules or colors of the project by editing the CSS custom variables defined in the `:root` pseudo-class in `style.css`:

```css
:root {
  /* Colors */
  --bg-primary: #08090C;
  --bg-secondary: #101217;
  --bg-tertiary: #161A22;
  --accent-orange: #FF4D24;
  --accent-orange-glow: rgba(255, 77, 36, 0.45);
  --accent-teal: #00F2FE;
  
  /* Glassmorphism & Borders */
  --glass-bg: rgba(16, 18, 23, 0.75);
  --glass-border: rgba(255, 255, 255, 0.05);
  
  /* Borders */
  --border-radius-sm: 8px;
  --border-radius-md: 16px;
  --border-radius-lg: 24px;
}
```

---

## 🚀 Getting Started

To view and run the project locally:
1. Ensure your index file (typically `IRONPEAK Gym _ Elevate Your Performance.html` located in the parent directory) points to the respective paths of `style.css` and `script.js`.
2. Open the index HTML file in any modern web browser.
3. For a production-ready environment, it is recommended to host the page behind a basic static server (like Nginx, Netlify, or Vercel) to ensure optimal asset loading.

---
*Created with passion for performance and elite web aesthetics.*
