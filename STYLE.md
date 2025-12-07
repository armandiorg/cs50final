# Harvard Poops - Refined Premium Design System

**Last Updated:** December 6, 2025

---

## Overview

The **Refined Premium** design system combines Harvard's storied crimson tradition with contemporary editorial elegance. Built for mobile-first experiences with exceptional attention to typography, spacing, and subtle animations.

### Design Philosophy

**"Dark Mode Luxury"** - Evoking the exclusive, storied tradition of Harvard secret societies with contemporary refinement. Every interaction is intentional, every detail considered.

### Core Principles

1. **Editorial Elegance** - Magazine-quality typography with Playfair Display serifs
2. **Mysterious Depth** - Deep blacks with subtle crimson glows create atmosphere
3. **Refined Interactions** - Smooth, understated animations that enhance without distracting
4. **Mobile-First** - Optimized for touch interfaces with generous spacing
5. **Accessible Luxury** - WCAG AAA contrast ratios, premium but inclusive

---

## Quick Start

### Installation

```bash
# All styles are in src/styles/
# Import the main stylesheet in your entry point:
```

**React/JSX:**
```jsx
import './styles/index.css';
```

**HTML:**
```html
<link rel="stylesheet" href="src/styles/index.css">
```

### View the Live Demo

Open `styleguide-demo.html` in your browser to see all components in action.

---

## Color Palette

### Primary Colors (Deep Blacks)

```css
--color-black-true: #000000;      /* Pure black backgrounds */
--color-black-rich: #0A0A0A;      /* Slightly lifted black */
--color-black-soft: #141414;      /* Card backgrounds */
--color-black-elevated: #1A1A1A;  /* Hover states, elevated surfaces */
```

### Harvard Crimson

```css
--color-crimson-deep: #8B0A1F;    /* Deep crimson (darkest) */
--color-crimson-primary: #A41034; /* Harvard official crimson */
--color-crimson-bright: #C41E3A;  /* Bright crimson (accents, hover) */
--color-crimson-glow: rgba(164, 16, 52, 0.4); /* Glow effects */
```

### Metallic Accents

```css
--color-gold-champagne: #D4AF37;  /* Premium badges, VIP features */
--color-silver-light: #C0C0C0;    /* Silver dividers */
--color-bronze: #8C7853;          /* Tertiary accents */
```

### Neutral Grays

```css
--color-gray-100: #F5F5F5;  /* Rare use - white text */
--color-gray-200: #E8E8E8;  /* Primary text */
--color-gray-300: #CCCCCC;  /* Secondary text */
--color-gray-400: #999999;  /* Tertiary text */
--color-gray-500: #666666;  /* Muted text */
--color-gray-600: #4A4A4A;  /* Borders */
--color-gray-700: #2E2E2E;  /* Subtle dividers */
```

---

## Typography

### Font Families

**Playfair Display** - Display & Headings
- Google Fonts: `Playfair Display`
- Weights: 400, 500, 600, 700, 800, 900
- Use: Page titles, event names, hero sections

**Inter** - Body Text & UI
- Google Fonts: `Inter`
- Weights: 300, 400, 500, 600, 700
- Use: Body text, buttons, labels, descriptions

**Cormorant Garamond** - Accent (Optional)
- Google Fonts: `Cormorant Garamond`
- Weights: 400, 500, 600, 700
- Use: Pull quotes, special callouts

### Type Scale (Perfect Fourth - 1.333 ratio)

```css
--text-xs: 0.75rem;     /* 12px - labels, timestamps */
--text-sm: 0.875rem;    /* 14px - secondary text */
--text-base: 1rem;      /* 16px - body text */
--text-lg: 1.125rem;    /* 18px - emphasis */
--text-xl: 1.333rem;    /* 21px - subheadings */
--text-2xl: 1.777rem;   /* 28px - section headings */
--text-3xl: 2.369rem;   /* 38px - page headings */
--text-4xl: 3.157rem;   /* 51px - hero headings */
--text-5xl: 4.209rem;   /* 67px - display headings */
```

### Usage Examples

```html
<h1 class="h1">Display Large Heading</h1>
<h2 class="h2">Page Title</h2>
<h3 class="h3">Section Heading</h3>
<p class="text-base">Body text with comfortable readability</p>
<p class="text-sm text-secondary">Secondary information</p>
```

---

## Components

### Buttons

#### Variants

**Primary (Crimson Gradient)**
```html
<button class="btn btn-primary">Primary Action</button>
```

**Secondary (Outlined)**
```html
<button class="btn btn-secondary">Secondary Action</button>
```

**Tertiary (Ghost)**
```html
<button class="btn btn-tertiary">Tertiary Action</button>
```

#### Sizes

```html
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary">Regular</button>
<button class="btn btn-primary btn-lg">Large</button>
```

#### Icon Buttons

```html
<button class="btn btn-primary btn-icon" aria-label="Like">❤️</button>
```

### Cards

#### Standard Card

```html
<div class="card">
  <h3 class="h3">Card Title</h3>
  <p class="description">Card content with description text.</p>
  <button class="btn btn-primary">Action</button>
</div>
```

#### Event Card

```html
<div class="event-card">
  <div class="event-card-image">
    <img src="event-cover.jpg" alt="Event cover">
  </div>
  <div class="event-card-content">
    <div class="flex gap-2 mb-3">
      <span class="badge badge-live">LIVE</span>
      <span class="badge badge-crimson">PARTY</span>
    </div>
    <h3 class="event-title">Event Name</h3>
    <div class="metadata">
      Date • Time • Location
    </div>
    <p class="description">Event description...</p>
    <button class="btn btn-primary">RSVP Now</button>
  </div>
</div>
```

#### Premium Card

```html
<div class="card card-premium">
  <h3 class="h3">Premium Content</h3>
  <p class="description">Exclusive features...</p>
  <!-- Automatic PREMIUM badge appears -->
</div>
```

### Form Inputs

#### Text Input

```html
<div class="form-group">
  <label class="label label-required">Name</label>
  <input type="text" class="input" placeholder="Enter your name">
</div>
```

#### Textarea

```html
<div class="form-group">
  <label class="label">Comments</label>
  <textarea class="input textarea" placeholder="Your message..."></textarea>
</div>
```

#### Checkbox

```html
<label class="flex items-center gap-3 cursor-pointer">
  <input type="checkbox" class="checkbox">
  <span class="text-base">I agree to the terms</span>
</label>
```

#### Radio

```html
<label class="flex items-center gap-2 cursor-pointer">
  <input type="radio" name="option" class="radio">
  <span class="text-base">Option 1</span>
</label>
```

### Badges & Tags

```html
<span class="badge badge-crimson">FEATURED</span>
<span class="badge badge-gold">PREMIUM</span>
<span class="badge badge-gray">DRAFT</span>
<span class="badge badge-success">CONFIRMED</span>
<span class="badge badge-live">LIVE NOW</span>
```

### Progress Bar

```html
<div class="progress-bar">
  <div class="progress-bar-fill" style="width: 65%;"></div>
</div>
```

### Avatars

```html
<div class="avatar avatar-sm">AB</div>
<div class="avatar">JD</div>
<div class="avatar avatar-lg">MK</div>
```

### Loading States

**Spinner**
```html
<div class="spinner"></div>
<div class="spinner spinner-sm"></div>
<div class="spinner spinner-lg"></div>
```

**Dots Loader**
```html
<div class="dots-loader">
  <span></span>
  <span></span>
  <span></span>
</div>
```

**Skeleton**
```html
<div class="skeleton" style="width: 100%; height: 20px;"></div>
```

### Navigation

#### Top Navigation

```html
<nav class="nav">
  <a href="/" class="nav-logo">Harvard Poops</a>
  <div class="nav-links">
    <a href="/events" class="nav-link active">Events</a>
    <a href="/about" class="nav-link">About</a>
  </div>
</nav>
```

#### Bottom Navigation (Mobile)

```html
<nav class="bottom-nav">
  <a href="/" class="bottom-nav-item active">
    <div class="bottom-nav-icon">🏠</div>
    <span>Home</span>
  </a>
  <a href="/explore" class="bottom-nav-item">
    <div class="bottom-nav-icon">🔍</div>
    <span>Explore</span>
  </a>
</nav>
```

### Modals

```html
<div class="modal-backdrop">
  <div class="modal">
    <div class="modal-header">
      <h2 class="modal-title">Modal Title</h2>
      <button class="modal-close" aria-label="Close">✕</button>
    </div>
    <div class="modal-body">
      <p>Modal content...</p>
    </div>
    <div class="flex gap-3">
      <button class="btn btn-primary">Confirm</button>
      <button class="btn btn-tertiary">Cancel</button>
    </div>
  </div>
</div>
```

---

## Spacing System

Based on **8px increments** for consistent rhythm:

```css
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-6: 24px
--space-8: 32px
--space-12: 48px
--space-16: 64px
--space-20: 80px
```

### Utility Classes

```html
<div class="p-6">Padding 24px all sides</div>
<div class="px-4 py-8">Horizontal 16px, Vertical 32px</div>
<div class="mt-12">Margin-top 48px</div>
<div class="gap-4">Gap 16px (flex/grid)</div>
```

---

## Layout

### Container

```html
<div class="container">
  <!-- Content automatically responsive with max-widths -->
</div>
```

### Grid System

```html
<div class="grid grid-cols-2 gap-6">
  <div>Column 1</div>
  <div>Column 2</div>
</div>

<!-- Responsive grid -->
<div class="grid md:grid-cols-3 gap-6">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### Flexbox Utilities

```html
<div class="flex items-center justify-between gap-4">
  <div>Left</div>
  <div>Right</div>
</div>
```

---

## Animations

### Utility Classes

```html
<div class="animate-slide-up">Slides up on load</div>
<div class="animate-fade-in">Fades in</div>
<div class="animate-scale-in">Scales in (modals)</div>
```

### Hover Effects

```html
<div class="card hover-lift">Lifts on hover</div>
<div class="hover-scale">Scales on hover</div>
<div class="hover-glow">Glows on hover</div>
```

### Staggered Animations

```html
<div class="stagger-children">
  <div>Item 1</div> <!-- Delay: 0ms -->
  <div>Item 2</div> <!-- Delay: 50ms -->
  <div>Item 3</div> <!-- Delay: 100ms -->
</div>
```

---

## Accessibility

### Focus States

All interactive elements have visible focus indicators:
- 2px solid crimson outline
- 2px offset for breathing room
- Never remove focus states

### Color Contrast

- Primary text (#E8E8E8) on black: **14.8:1** (WCAG AAA)
- Crimson elements meet **AA standards**
- All text meets minimum contrast requirements

### Reduced Motion

Automatically respects `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  /* All animations disabled */
}
```

### Screen Readers

- Semantic HTML (`nav`, `main`, `article`, `section`)
- ARIA labels on icon-only buttons
- `.sr-only` utility class for screen reader text

---

## Best Practices

### Typography

✅ **DO:**
- Use Playfair Display for large headings (h1, h2)
- Use Inter for body text and UI elements
- Maintain type scale for consistency
- Use `--leading-relaxed` for long-form content

❌ **DON'T:**
- Mix too many font families
- Use font sizes outside the type scale
- Set line-height below 1.5 for body text

### Colors

✅ **DO:**
- Use crimson for primary actions and accents
- Use metallic colors (gold, silver) for premium features
- Maintain dark background for brand consistency

❌ **DON'T:**
- Use pure white text (use --color-gray-100 instead)
- Over-use crimson (it loses impact)
- Mix conflicting accent colors

### Spacing

✅ **DO:**
- Use spacing utilities (p-6, mt-8, gap-4)
- Maintain generous whitespace for luxury feel
- Use consistent gaps in grids (--gap-base, --gap-lg)

❌ **DON'T:**
- Use arbitrary pixel values
- Cram content together (reduces premium feel)
- Mix spacing scales

### Animations

✅ **DO:**
- Use subtle, purposeful animations
- Apply `hover-lift` to cards for depth
- Use `stagger-children` for lists

❌ **DON'T:**
- Overuse animations (distracting)
- Animate without purpose
- Ignore `prefers-reduced-motion`

---

## File Structure

```
src/styles/
├── tokens.css          # Design variables (colors, spacing, typography)
├── typography.css      # Font imports, type styles
├── global.css          # Base styles, resets, utilities
├── components.css      # All component styles
├── animations.css      # Keyframes, transitions
└── index.css           # Main entry point (imports all above)
```

---

## Browser Support

- **Modern browsers** (Chrome, Firefox, Safari, Edge - last 2 versions)
- **Mobile browsers** (iOS Safari 14+, Chrome Android)
- **CSS Features Used:**
  - CSS Custom Properties (variables)
  - CSS Grid & Flexbox
  - Backdrop Filter (for glassmorphism)
  - CSS Animations

---

## Examples

### Event Detail Page

```html
<div class="container py-12">
  <!-- Hero Section -->
  <div class="mb-8">
    <h1 class="h1 text-gradient-crimson mb-4">Final Club Mixer</h1>
    <div class="metadata mb-6">
      Tonight • 9:00 PM • The Fly Club
    </div>
    <div class="flex gap-3 mb-8">
      <span class="badge badge-live">LIVE</span>
      <span class="badge badge-gold">PREMIUM</span>
    </div>
  </div>

  <!-- Event Image -->
  <img src="event.jpg" class="rounded-xl mb-8" alt="Event cover">

  <!-- Description -->
  <div class="card p-8 mb-8">
    <h2 class="h2 mb-4">About This Event</h2>
    <p class="description">
      An exclusive evening with Harvard's finest...
    </p>
  </div>

  <!-- RSVP Button -->
  <button class="btn btn-primary btn-lg" style="width: 100%;">
    RSVP Now
  </button>
</div>
```

### Event Feed

```html
<div class="container py-12">
  <h1 class="h1 mb-8">Upcoming Events</h1>

  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
    <div class="event-card">
      <!-- Event card content -->
    </div>
    <div class="event-card">
      <!-- Event card content -->
    </div>
    <div class="event-card">
      <!-- Event card content -->
    </div>
  </div>
</div>
```

---

## Support & Resources

- **Live Demo:** Open `styleguide-demo.html`
- **React Component:** See `src/pages/StyleGuide/StyleGuide.jsx`
- **Google Fonts:** [Playfair Display](https://fonts.google.com/specimen/Playfair+Display), [Inter](https://fonts.google.com/specimen/Inter)

---

## Changelog

### v1.0.0 - December 6, 2025
- Initial release
- Complete design system with tokens, typography, components
- Mobile-first responsive design
- Accessibility features (WCAG AAA contrast, reduced motion)
- Comprehensive component library
- Live HTML demo and React showcase page

---

**Built with love for Harvard students** ❤️
