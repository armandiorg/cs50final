# Signup UI Bug - Dropdown Component Investigation

**Date Started:** 2025-12-07
**Status:** UNRESOLVED
**Priority:** HIGH - Mobile UX is broken

---

## Problem Statement

The custom dropdown component on the Signup page is **massively oversized** on mobile devices. The dropdown buttons are taking up excessive vertical space, making the form unusable on mobile screens.

### User Feedback
> "the dropdown is still HUGE, its wayyyyyy too big, it should not take up the entirety of my screen. this is suboptimal. There is a clear issue. You need to make the buttons much smaller to match the size of the height of the other features and buttons here"

### Visual Evidence
User provided screenshots showing dropdown buttons consuming the entire mobile viewport.

---

## Technical Context

### Files Involved
1. `/src/components/Dropdown.jsx` - Custom dropdown React component
2. `/src/pages/Signup.jsx` - Signup form using the dropdowns
3. `/src/styles/components.css` - CSS for `.input` class
4. `/src/styles/global.css` - Global button reset styles

### Design System Constraint
The project uses a "Refined Premium" design system (see `STYLE.md`) with specific requirements:
- Mobile-first optimization
- 44px minimum tap targets (iOS Human Interface Guidelines)
- Compact visual design despite touch-friendly targets
- Dark theme with crimson accents

---

## Root Cause Hypothesis

The dropdown uses a `<button>` element with the `.input` class to match text input styling. However, there appears to be a **CSS cascade conflict** between:

1. **Global button reset** (`global.css:53-60`):
   ```css
   button {
     font-family: inherit;
     font-size: inherit;
     line-height: inherit;
     cursor: pointer;
     border: none;           /* ← Removes border */
     background: none;       /* ← Removes background */
   }
   ```

2. **Input class** (`components.css:194-205`):
   ```css
   .input {
     width: 100%;
     font-family: var(--font-body);
     font-size: var(--text-base);
     color: var(--color-gray-200);
     background: var(--color-black-elevated);  /* ← Should show background */
     border: 2px solid var(--color-gray-600);  /* ← Should show border */
     border-radius: var(--radius-lg);
     padding: 10px 16px;
     transition: all var(--duration-base) var(--ease-standard);
     min-height: 44px;
   }
   ```

The global `button` reset appears to override the `.input` class background and border, causing transparency issues.

---

## Attempted Solutions (All Failed)

### Attempt 1: Remove Tailwind h-auto Override
**Hypothesis:** Tailwind's `h-auto` was overriding `min-height: 44px`

**Changes Made:**
- Removed `h-auto` from dropdown button className
- Removed `transition-all duration-200` (redundant with `.input` class)
- Added `gap-2` for icon spacing

**File:** `Dropdown.jsx:52-57`

**Result:** ❌ FAILED - Button still oversized

---

### Attempt 2: Reduce Dropdown Menu Option Padding
**Hypothesis:** Menu options using `py-3` were too tall

**Changes Made:**
- Changed padding from `px-4 py-3` to `px-3 py-2`
- Added `min-h-[44px]` to ensure tap targets
- Changed text size from `text-base` to `text-sm`

**File:** `Dropdown.jsx:103-105`

**Result:** ❌ FAILED - Options more compact but button itself still oversized

---

### Attempt 3: Reduce Global Input Padding
**Hypothesis:** The `.input` class padding of `16px 20px` was too large

**Changes Made:**
- Reduced padding from `16px 20px` to `10px 16px`

**File:** `components.css:202`

**Result:** ❌ FAILED - All inputs more compact but dropdown button still disproportionately large

---

### Attempt 4: Add Specific button.input Rule
**Hypothesis:** Global button reset was overriding `.input` background/border

**Changes Made:**
- Added specific CSS rule:
  ```css
  button.input {
    background: var(--color-black-elevated);
    border: 2px solid var(--color-gray-600);
  }
  ```

**File:** `components.css:224-227`

**Result:** ❌ UNKNOWN - Likely fixed transparency but not the sizing issue

---

## Current Code State

### Dropdown Button (Dropdown.jsx:48-73)
```jsx
<button
  type="button"
  onClick={() => !disabled && setIsOpen(!isOpen)}
  disabled={disabled}
  className={`
    input w-full text-left flex items-center justify-between gap-2
    ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:border-[var(--color-crimson-primary)]'}
    ${!value ? 'text-[var(--color-gray-400)]' : ''}
    ${isOpen ? 'border-[var(--color-crimson-primary)] shadow-[0_0_0_1px_var(--color-crimson-primary)]' : ''}
  `}
>
  <span className="text-base">{selectedLabel}</span>
  <svg className="w-4 h-4 transition-transform duration-200 flex-shrink-0 ml-2" ...>
</button>
```

### Actual HTML Output (from user)
```html
<button type="button" class="
  input w-full text-left flex items-center justify-between gap-2
  cursor-pointer hover:border-[var(--color-crimson-primary)]
  text-[var(--color-gray-400)]
">
  <span class="text-base">Select year</span>
  <svg class="w-4 h-4 transition-transform duration-200 flex-shrink-0 ml-2" ...></svg>
</button>
```

### CSS Being Applied
```css
/* From components.css */
.input {
  padding: 10px 16px;        /* Top/bottom: 10px, Left/right: 16px */
  min-height: 44px;          /* Minimum tappable height */
  font-size: var(--text-base); /* 16px */
}

/* From global.css */
button {
  background: none;  /* ← OVERRIDES .input background */
  border: none;      /* ← OVERRIDES .input border */
}

/* From components.css (added in Attempt 4) */
button.input {
  background: var(--color-black-elevated);  /* Re-establishes background */
  border: 2px solid var(--color-gray-600);  /* Re-establishes border */
}
```

---

## Assumptions That May Be Wrong

### ❓ Assumption 1: Flexbox is NOT causing height inflation
**Reality Check Needed:**
- The button uses `flex items-center justify-between`
- Does flexbox's `items-center` + `gap-2` + SVG icon inflate the height beyond the padding?
- Could the SVG (`w-4 h-4`) be forcing extra height?

### ❓ Assumption 2: 44px min-height is appropriate
**Reality Check Needed:**
- We set `min-height: 44px` for iOS tap targets
- But padding is now `10px 16px` (20px total vertical)
- Text is `16px` (text-base)
- Line height might add extra space
- Total actual height: 44px min + padding inflation?

### ❓ Assumption 3: The problem is CSS, not React rendering
**Reality Check Needed:**
- Is React adding inline styles we can't see?
- Are Tailwind utilities being purged/applied incorrectly?
- Could there be CSS-in-JS overrides we're missing?

### ❓ Assumption 4: "Text-base" and "ml-2" aren't contributors
**Reality Check Needed:**
- `text-base` = 16px font size
- Does the line-height calculation inflate beyond expected?
- `ml-2` on SVG might create unexpected spacing
- Could `gap-2` + `ml-2` be doubling spacing?

### ❓ Assumption 5: Grid layout isn't affecting sizing
**Reality Check Needed:**
- Parent uses `grid-cols-2` class
- Could grid be forcing items to fill available space vertically?
- Check if `.grid-cols-2` has unexpected styles

---

## What We Know For Sure

✅ **Confirmed Facts:**
1. Regular text inputs (email, password, phone) use `className="input"` and appear correctly sized
2. Dropdown button uses `className="input ..."` with additional Tailwind classes
3. Both should inherit the same `.input` base styles
4. The dropdown button is visually larger than text inputs despite same base class
5. User is viewing on mobile device (exact dimensions unknown)
6. The issue persists across multiple fix attempts

---

## Next Steps for Investigation

### 1. Compare Computed Styles
Use browser DevTools to inspect **actual computed CSS** on:
- A working text input (`<input className="input">`)
- The broken dropdown button (`<button className="input ...">`)

Compare:
- `height` (computed, not just min-height)
- `padding` (top, bottom specifically)
- `line-height`
- `font-size`
- `display` type
- Any unexpected inherited styles

### 2. Test Minimal Reproduction
Create a test button alongside a text input with IDENTICAL classes:
```jsx
<input type="text" className="input" placeholder="Test input" />
<button className="input w-full text-left">Test button</button>
```

If they differ in height, the issue is button-specific CSS.

### 3. Check for Hidden Inline Styles
- Inspect the actual rendered HTML in DevTools
- Look for `style="..."` attributes added by React
- Check if any CSS custom properties are resolving incorrectly

### 4. Verify Tailwind Compilation
- Check if Tailwind utilities are being applied correctly
- Verify `flex items-center justify-between gap-2` isn't adding unexpected height
- Test removing flexbox classes entirely

### 5. Test Without SVG Icon
Temporarily remove the SVG icon to see if it's contributing to height:
```jsx
<button className="input w-full text-left">
  <span className="text-base">{selectedLabel}</span>
</button>
```

### 6. Inspect Parent Container
Check if `.grid-cols-2` or `.form-group` are constraining/expanding the button:
```css
/* Look for unexpected styles on: */
.grid-cols-2 { /* ... */ }
.form-group { /* ... */ }
```

---

## Questions for Next Engineer

1. **What is the actual computed height of the dropdown button in DevTools?**
2. **Does removing flexbox (`flex items-center justify-between`) fix the sizing?**
3. **Is there a difference between `<input className="input">` and `<button className="input">` computed styles?**
4. **Could the `line-height` property be inflating the button beyond expectations?**
5. **Is the `.grid-cols-2` parent forcing the button to fill vertical space?**
6. **What does the button look like with ONLY `className="input"` (no other classes)?**

---

## Relevant Code Snippets

### Working Text Input (Signup.jsx:246-262)
```jsx
<input
  id="email"
  name="email"
  type="email"
  autoComplete="email"
  required
  value={formData.email}
  onChange={handleInputChange}
  className="input"  // ← Just "input", nothing else
  placeholder="you@harvard.edu"
/>
```

### Broken Dropdown Usage (Signup.jsx:217-227)
```jsx
<div className="grid-cols-2">
  <div className="form-group">
    <Dropdown
      label="Year"
      options={YEARS}
      value={formData.year}
      onChange={handleYearChange}
      placeholder="Select year"
      required
    />
  </div>
  {/* ... */}
</div>
```

### CSS Variables (from tokens.css)
```css
--text-base: 1rem;           /* 16px */
--space-2: 0.5rem;           /* 8px - used in gap-2 */
--radius-lg: 20px;           /* border radius */
--color-black-elevated: #1A1A1A;
--color-gray-600: #5A5A5A;
```

---

## Mobile Context

- **Target Device:** iPhone (exact model unknown)
- **Viewport Size:** Likely 375px - 428px width
- **Design Requirement:** Must look good on smallest iPhone SE (375px)
- **User Experience:** Currently "impossible to use" per user feedback

---

## Critical Path Forward

The issue is **blocking mobile signup flow** - this is a critical UX bug that needs resolution before deployment.

**Recommended Approach:**
1. Start fresh with DevTools inspection of actual computed styles
2. Compare working input vs broken button side-by-side
3. Remove complexity iteratively (remove flexbox, remove SVG, remove Tailwind utilities)
4. Find the minimal breaking change
5. Fix at the root cause, not with more overrides

---

**Last Updated:** 2025-12-07
**Next Engineer:** Please add findings and attempts below this line
