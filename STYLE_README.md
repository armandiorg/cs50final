# 🎨 Harvard Poops - Refined Premium Style System

> A dark, mysterious design system combining Harvard's crimson tradition with contemporary editorial elegance

---

## 🚀 Quick Start

### View the Live Demo

**Option 1: HTML Demo (Fastest)**
```bash
# Open in your browser:
open styleguide-demo.html
```

**Option 2: React Component**
```bash
# Import the StyleGuide component in your React app:
import StyleGuide from './pages/StyleGuide/StyleGuide'
```

### Use in Your Project

**In React/JSX:**
```jsx
import './styles/index.css';

function App() {
  return <div className="container">
    <h1 className="h1 text-gradient-crimson">Harvard Poops</h1>
    <button className="btn btn-primary">Explore Events</button>
  </div>
}
```

**In HTML:**
```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="src/styles/index.css">
</head>
<body>
  <div class="container">
    <h1 class="h1 text-gradient-crimson">Harvard Poops</h1>
    <button class="btn btn-primary">Explore Events</button>
  </div>
</body>
</html>
```

---

## 📂 What's Included

### Core Style Files

```
src/styles/
├── tokens.css       ⭐ Design variables (colors, spacing, typography)
├── typography.css   ⭐ Font imports & type styles
├── global.css       ⭐ Base styles, resets, utilities
├── components.css   ⭐ All UI components
├── animations.css   ⭐ Keyframes & transitions
└── index.css        📦 Main entry point
```

### Demo Pages

- `styleguide-demo.html` - **Standalone HTML showcase** (open in browser)
- `src/pages/StyleGuide/StyleGuide.jsx` - **React component showcase**
- `STYLE.md` - **Complete documentation** (colors, components, usage)

---

## 🎯 Design System Highlights

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| **Black True** | `#000000` | Main background |
| **Crimson Primary** | `#A41034` | Harvard official, primary actions |
| **Crimson Bright** | `#C41E3A` | Accents, hover states |
| **Gold Champagne** | `#D4AF37` | Premium badges, VIP features |

### Typography

- **Display:** Playfair Display (serif, elegant)
- **Body:** Inter (sans-serif, modern)
- **Accent:** Cormorant Garamond (italic serif)

### Components Library

✅ Buttons (Primary, Secondary, Tertiary)
✅ Cards (Standard, Event, Premium)
✅ Forms (Inputs, Textareas, Checkboxes, Radios)
✅ Badges & Tags
✅ Navigation (Top Nav, Bottom Nav)
✅ Modals
✅ Progress Bars
✅ Avatars
✅ Loading States

---

## 🖼️ Visual Preview

### Hero Section
Large Playfair Display headings with crimson gradient, dark mysterious background with subtle mesh gradients.

### Event Cards
Elevated cards with 16:9 cover images, crimson glow on hover, premium badges, and smooth animations.

### Forms
Refined inputs with elegant focus states (crimson outline + subtle glow), custom checkboxes/radios.

### Mobile Navigation
Bottom tab bar with backdrop blur, active state indicators, optimized for thumb reach.

---

## 💡 Key Features

### 1. Mobile-First Design
- Optimized for touch interfaces
- Minimum 44px touch targets
- Responsive typography scaling
- Bottom navigation for easy reach

### 2. Premium Interactions
- Smooth hover lifts on cards
- Staggered animations (50ms delays)
- Crimson glow effects on elevation
- Backdrop blur on navigation

### 3. Accessibility
- **WCAG AAA** contrast ratios (14.8:1 for primary text)
- Visible focus indicators (2px crimson outline)
- Respects `prefers-reduced-motion`
- Semantic HTML structure

### 4. Performance
- CSS-only animations (hardware accelerated)
- Minimal JavaScript required
- Optimized for 60fps interactions
- Lazy load compatible

---

## 📖 Quick Reference

### Common Patterns

**Button Hierarchy:**
```html
<button class="btn btn-primary">Primary CTA</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-tertiary">Tertiary</button>
```

**Card with Hover Effect:**
```html
<div class="card hover-lift">
  <h3 class="h3">Card Title</h3>
  <p class="description">Card content...</p>
</div>
```

**Event Card:**
```html
<div class="event-card">
  <div class="event-card-image">
    <img src="cover.jpg" alt="Event">
  </div>
  <div class="event-card-content">
    <span class="badge badge-live">LIVE</span>
    <h3 class="event-title">Event Name</h3>
    <div class="metadata">Date • Time • Location</div>
    <button class="btn btn-primary">RSVP</button>
  </div>
</div>
```

**Form Group:**
```html
<div class="form-group">
  <label class="label label-required">Name</label>
  <input type="text" class="input" placeholder="Enter name">
</div>
```

---

## 🎨 Customization

### Changing Colors

Edit `src/styles/tokens.css`:

```css
:root {
  --color-crimson-primary: #YOUR_COLOR; /* Change primary crimson */
  --color-gold-champagne: #YOUR_GOLD;   /* Change premium gold */
}
```

### Adjusting Spacing

```css
:root {
  --space-base: 8px; /* Base unit (all spacing multiples of this) */
}
```

### Typography Scale

```css
:root {
  --text-base: 1rem; /* Base font size (16px) */
  /* Scale automatically adjusts based on Perfect Fourth ratio */
}
```

---

## 🛠️ Development Workflow

### 1. Explore the Demo
```bash
open styleguide-demo.html
```

### 2. Copy Components
Browse the demo, find components you need, copy HTML structure from STYLE.md

### 3. Customize
Modify colors/spacing in `tokens.css`, see changes reflected across all components

### 4. Build Your Pages
Use the components to build event pages, dashboards, forms, etc.

---

## 📱 Mobile Optimization

### Touch Targets
- All interactive elements: **minimum 44x44px**
- Generous spacing between tappable elements: **12px+**

### Responsive Breakpoints
```css
--breakpoint-sm: 640px;   /* Large phones */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Laptops */
--breakpoint-xl: 1280px;  /* Desktops */
```

### Mobile-Specific Features
- Bottom navigation (easier thumb reach)
- Increased line-height (1.7) for readability
- Scaled-down headings (-20-30%)
- Safe area insets for notches

---

## 🐛 Troubleshooting

### Fonts Not Loading?

**Issue:** Playfair Display or Inter not displaying
**Fix:** Check internet connection (fonts load from Google Fonts)

```css
/* In typography.css, ensure this line exists: */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap');
```

### Styles Not Applying?

**Issue:** Components look unstyled
**Fix:** Ensure you imported `index.css` in your entry point

```jsx
// In main.jsx or App.jsx:
import './styles/index.css';
```

### Hover Effects Not Working?

**Issue:** Cards don't lift on hover
**Fix:** Check if you have the correct class:

```html
<div class="card hover-lift">...</div>
<!-- NOT just "card" -->
```

---

## 🚧 Next Steps

### Recommended Implementation Order

1. ✅ **Review the demo** - Open `styleguide-demo.html`
2. ✅ **Read STYLE.md** - Understand all components
3. ✅ **Build a test page** - Create one event detail page
4. ✅ **Iterate** - Adjust colors/spacing to your taste
5. ✅ **Scale** - Build out full application

### Integration with Existing Project

```bash
# 1. Copy style files to your project
cp -r src/styles /your-project/src/

# 2. Import in your main entry point
# In main.jsx or App.jsx:
import './styles/index.css';

# 3. Start using components
# Just add class names from STYLE.md
```

---

## 🎓 Learning Resources

- **Full Documentation:** Read `STYLE.md`
- **Live Examples:** Open `styleguide-demo.html`
- **React Example:** See `src/pages/StyleGuide/StyleGuide.jsx`
- **Google Fonts:** [Playfair Display](https://fonts.google.com/specimen/Playfair+Display), [Inter](https://fonts.google.com/specimen/Inter)

---

## 📝 File Reference

| File | Purpose | Edit Frequency |
|------|---------|----------------|
| `tokens.css` | Design variables | Often (colors, spacing) |
| `typography.css` | Font styles | Rarely (font families) |
| `global.css` | Base styles | Rarely (resets, utilities) |
| `components.css` | UI components | Sometimes (new components) |
| `animations.css` | Motion | Rarely (timing, keyframes) |
| `index.css` | Entry point | Never (just imports) |

---

## 🙌 Credits

**Design System:** Refined Premium
**Typography:** Playfair Display, Inter, Cormorant Garamond
**Color Palette:** Harvard Crimson (#A41034) + Deep Blacks
**Inspiration:** Editorial luxury, secret societies, dark mode elegance

---

**Ready to build something beautiful?** 🚀

Open `styleguide-demo.html` to see all components in action, then dive into `STYLE.md` for complete documentation.

Built with ❤️ for Harvard students.
