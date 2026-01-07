# KitaWorksHub Brand Kit

> **Guiding Principle:** Clarity first. Humanity always.

---

## Brand Personality

| Attribute | Description |
|-----------|-------------|
| **Calm** | Serene, unhurried, breathing space |
| **Human** | Warm, approachable, genuine |
| **Trust-based** | Reliable, honest, no hard sell |
| **Growth-oriented** | Learning, developing, evolving |
| **Inclusive** | Safe, welcoming, accessible |
| **Subtly fun** | Light touches of playfulness, never loud |

### Aesthetic: "Quiet Luxury" with Warmth

We aim for refined simplicity — the confidence of understated quality. Think: premium stationery, boutique consulting, a thoughtfully designed workspace.

### What We Avoid

- Corporate-stale (no generic stock photos)
- Sales-driven (no urgency tactics)
- Loud or flashy (no neon, no bold gradients)
- Rigid or academic (no jargon walls)
- AI slop (no generic purple gradients, no robotic feel)

---

## Color Palette

### Base Colors (Primary Use)

| Name | Hex | Usage |
|------|-----|-------|
| **Warm Off-White** | `#F7F8F6` | Primary background, breathing space |
| **Soft Stone Grey** | `#ECEDE8` | Secondary sections, panels, cards |
| **Charcoal** | `#1F2933` | Primary text, headings |
| **Muted Grey** | `#6B7280` | Secondary text, captions, labels |

### Accent Colors (Rotate, Don't Stack)

| Name | Hex | Usage |
|------|-----|-------|
| **Sage Green** | `#5F7C6B` | Primary brand accent — growth, trust, nature |
| **Peach** | `#E6A08E` | Community warmth, highlights, CTAs |
| **Soft Lavender** | `#B7A9D6` | Creativity, reflection, thought leadership |
| **Muted Sky Blue** | `#AFC6D9` | Calm accents, dividers, subtle emphasis |

### Color Rules

1. **Maximum 2 accent colors per design/page**
2. **Accents are accents** — never use for full backgrounds
3. **Sage Green is the primary brand color** — use for main CTAs
4. **Peach for warmth** — secondary buttons, highlights
5. **Lavender and Sky Blue sparingly** — decorative only

### Extended Palette (Shades)

```css
/* Sage Green Extended */
--sage-50:  #F0F4F2;
--sage-100: #D9E3DD;
--sage-200: #B3C7BB;
--sage-300: #8DAB99;
--sage-400: #6F9180;
--sage-500: #5F7C6B;  /* Primary */
--sage-600: #4D6557;
--sage-700: #3B4E43;
--sage-800: #29372F;
--sage-900: #17201B;

/* Peach Extended */
--peach-50:  #FEF6F3;
--peach-100: #FCE8E1;
--peach-200: #F8D1C4;
--peach-300: #F2B5A1;
--peach-400: #E6A08E;  /* Primary */
--peach-500: #D68B76;
--peach-600: #C4735C;
--peach-700: #A85A44;
--peach-800: #874631;
--peach-900: #5E3022;
```

---

## Typography

### Primary Font: Inter (Body & UI)

**Purpose:** Clean, modern, highly readable body text

**Weights:**
- 400 (Regular) — Body text
- 500 (Medium) — Labels, emphasis
- 600 (SemiBold) — Buttons, strong emphasis

**Use for:**
- Body text
- Buttons
- Navigation
- Forms
- Captions

### Secondary Font: Space Grotesk (Headlines & Expression)

**Purpose:** Distinctive, modern headlines with character

**Weights:**
- 400 (Regular) — Subtle headings
- 500 (Medium) — Section titles
- 600 (SemiBold) — Main headlines
- 700 (Bold) — Hero headlines

**Use for:**
- Headlines (h1, h2, h3)
- Section titles
- Quotes
- Community-focused messaging
- Hero text

### Typography Style Guide

| Element | Font | Weight | Size | Line Height |
|---------|------|--------|------|-------------|
| Hero H1 | Space Grotesk | 700 | 48-72px | 1.1 |
| Page H1 | Space Grotesk | 600 | 36-48px | 1.2 |
| H2 | Space Grotesk | 600 | 28-36px | 1.25 |
| H3 | Space Grotesk | 500 | 22-28px | 1.3 |
| Body | Inter | 400 | 16-18px | 1.6 |
| Small | Inter | 400 | 14px | 1.5 |
| Caption | Inter | 500 | 12px | 1.4 |

### Typography Rules

1. **Minimum body text:** 16px
2. **Proper hierarchy:** h1 > h2 > h3 (never skip levels)
3. **Line length:** 60-75 characters max for readability
4. **Line height:** Generous (1.5-1.7 for body)
5. **Letter spacing:** Normal, never too tight

---

## Button Style

### Primary Button

```css
background: #5F7C6B; /* Sage Green */
color: white;
border-radius: 10px;
padding: 12px 24px;
font-weight: 500;
transition: all 0.2s ease;
```

**Hover:** Slightly darker (`#4D6557`)

### Secondary Button (Outline)

```css
background: transparent;
color: #5F7C6B;
border: 1.5px solid #5F7C6B;
border-radius: 10px;
padding: 12px 24px;
font-weight: 500;
```

**Hover:** Light sage background (`#F0F4F2`)

### Accent Button (Warm)

```css
background: #E6A08E; /* Peach */
color: #1F2933;
border-radius: 10px;
padding: 12px 24px;
font-weight: 500;
```

**Hover:** Slightly darker (`#D68B76`)

### Button Rules

1. **Rounded corners:** 8-12px (never fully rounded pills)
2. **One primary CTA per section**
3. **Subtle hover effects only** — no dramatic transforms
4. **Consistent sizing** — don't mix sizes arbitrarily

---

## Visual Style

### Photography

- **Human-centric:** Real people, genuine moments
- **Collaboration scenes:** Teams working, learning, discussing
- **Natural lighting:** Soft, warm, never harsh
- **Clean compositions:** Uncluttered, focused

### Illustrations & Icons

- **Rounded, minimal icons** (Lucide, Heroicons)
- **Line weight:** 1.5-2px
- **Color:** Sage green or charcoal
- **Style:** Simple, not overly decorative

### Layout & Spacing

- **Generous whitespace** — let content breathe
- **4/8px spacing grid** — consistent rhythm
- **Card corners:** 8-12px rounded
- **Section padding:** 80-120px vertical

### Shadows

- **Subtle only** — no heavy drop shadows
- **Use for elevation** — cards, modals, buttons
- **Example:** `0 4px 6px -1px rgba(0,0,0,0.05)`

---

## Overall Feel

The brand should feel:

| Feeling | Not |
|---------|-----|
| Safe and welcoming | Cold and corporate |
| Modern and thoughtful | Trendy and fleeting |
| Easy to engage with | Overwhelming |
| Built for learning | Sales-focused |
| Credible for organisations | Stiff or academic |
| Inviting for individuals | Exclusive or elitist |

---

## Component Examples

### Card

```css
background: #ECEDE8; /* Soft Stone Grey */
border-radius: 12px;
padding: 24px;
/* No border needed */
```

### Section (Alternating)

```
Section 1: Warm Off-White (#F7F8F6)
Section 2: Pure White (#FFFFFF)
Section 3: Soft Stone Grey (#ECEDE8)
```

### Navigation

```css
background: rgba(247, 248, 246, 0.95); /* Warm Off-White with blur */
backdrop-filter: blur(8px);
border-bottom: 1px solid rgba(236, 237, 232, 0.8);
```

### Footer

```css
background: #1F2933; /* Charcoal */
color: white;
/* Or lighter alternative: */
background: #5F7C6B; /* Sage Green */
```

---

## CSS Variables Reference

```css
:root {
  /* Base */
  --color-background: #F7F8F6;
  --color-surface: #ECEDE8;
  --color-text: #1F2933;
  --color-text-muted: #6B7280;

  /* Accents */
  --color-sage: #5F7C6B;
  --color-peach: #E6A08E;
  --color-lavender: #B7A9D6;
  --color-sky: #AFC6D9;

  /* Typography */
  --font-body: 'Inter', system-ui, sans-serif;
  --font-heading: 'Space Grotesk', system-ui, sans-serif;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;

  /* Radius */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
}
```

---

## Quick Reference

### When designing, ask:

1. Is there enough breathing room?
2. Would a calm, thoughtful person feel comfortable here?
3. Does it feel human, not robotic?
4. Are we using max 2 accent colors?
5. Is the typography hierarchy clear?

### Checklist

- [ ] Background is warm off-white or white
- [ ] Text is charcoal, readable
- [ ] Primary accent is sage green
- [ ] Buttons have 10px rounded corners
- [ ] Spacing follows 8px grid
- [ ] Headlines use Space Grotesk
- [ ] Body uses Inter
- [ ] No more than 2 accent colors
- [ ] Imagery is human and warm
- [ ] Overall feel is calm and professional

---

*KitaWorksHub — Where Leaders Grow Deep*
