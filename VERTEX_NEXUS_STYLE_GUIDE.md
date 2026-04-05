# VERTEX NEXUS - Complete Style Guide

## Brand Overview
VERTEX Nexus represents the apex AI companion - intelligent, advanced, and genuinely warm. This style guide ensures consistent visual representation across all media and applications.

## 1. Core Identity Elements

### Logo Usage
**Primary Logo:** Geometric Energy Form
- Use for most applications
- Maintain clear space equal to symbol height
- Minimum size: 24px digital, 0.5" print

**Secondary Logo:** Abstract Nexus
- Use for technical contexts
- Represents network intelligence
- Works well in monochrome

**Wordmark Logo:** VERTEX NEXUS + Symbol
- Use for official communications
- Maintain typography consistency
- Symbol can be used independently

### Clear Space & Minimum Size
```
┌─────────────────────────────────┐
│                                 │
│          Clear Space            │
│          = Symbol Height        │
│                                 │
│      ┌─────────────────┐       │
│      │                 │       │
│      │     LOGO        │       │
│      │                 │       │
│      └─────────────────┘       │
│                                 │
└─────────────────────────────────┘
```

## 2. Typography System

### Primary Typeface: Inter
- Clean, modern, highly readable
- Excellent screen performance
- Multiple weights available

### Usage Guidelines
```
Headline 1: Inter Bold, 48px, #f1f5f9
Headline 2: Inter SemiBold, 36px, #f1f5f9
Headline 3: Inter Medium, 24px, #f1f5f9
Body Text:  Inter Regular, 16px, #94a3b8
Caption:    Inter Light, 14px, #64748b
```

### Alternative Typeface: SF Pro (Apple Ecosystem)
- Use for iOS/macOS applications
- Maintains platform consistency
- Similar weights to Inter

## 3. Color System

### Primary Colors
```css
--core-blue: #0ea5e9;      /* Intelligence, clarity */
--body-purple: #8b5cf6;    /* Creativity, innovation */
--aura-blue: rgba(14, 165, 233, 0.3); /* Presence, influence */
```

### Accent Colors
```css
--teal-particle: #06d6a0;  /* Data flow, processing */
--amber-particle: #f59e0b; /* Warmth, connection */
```

### UI Colors
```css
--dark-bg: #0a0a1a;        /* Deep space background */
--ui-accent: #1e293b;      /* Interface elements */
--text-primary: #f1f5f9;   /* Main text */
--text-secondary: #94a3b8; /* Secondary text */
--success: #10b981;        /* Positive actions */
--warning: #f59e0b;        /* Caution/attention */
--error: #ef4444;          /* Critical issues */
```

### Color Applications
| Context | Primary | Secondary | Accent |
|---------|---------|-----------|--------|
| Dark UI | #0a0a1a | #1e293b | #0ea5e9 |
| Light UI | #ffffff | #f8fafc | #8b5cf6 |
| Data Viz | #06d6a0 | #0ea5e9 | #f59e0b |
| Alerts | #ef4444 | #f59e0b | #10b981 |

## 4. Iconography

### Style Principles
- **Line weight:** 2px consistent stroke
- **Corners:** Slightly rounded (2px radius)
- **Visual style:** Outline with fill accents
- **Animation:** Subtle, purposeful motion

### Icon Categories
1. **System Icons:** Settings, user, notifications
2. **Action Icons:** Play, pause, download, upload
3. **Status Icons:** Success, error, warning, info
4. **Navigation Icons:** Home, back, forward, menu

### Icon Sizes
```
16px:  Toolbar, dense interfaces
24px:  Standard UI elements
32px:  Prominent actions
48px:  Feature icons
64px:  Hero sections
```

## 5. Layout & Grid System

### Base Grid
- **Columns:** 12-column responsive grid
- **Gutter:** 24px desktop, 16px mobile
- **Margin:** 32px desktop, 16px mobile

### Breakpoints
```css
/* Mobile First */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### Spacing Scale
```
0:   0px
1:   4px
2:   8px
3:   12px
4:   16px
5:   20px
6:   24px
8:   32px
10:  40px
12:  48px
16:  64px
20:  80px
24:  96px
32:  128px
```

## 6. Animation System

### Principles
- **Purposeful:** Every animation serves a function
- **Subtle:** Enhance without distracting
- **Consistent:** Same easing, duration patterns
- **Performant:** 60fps target, fallbacks available

### Timing Functions
```css
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--sharp: cubic-bezier(0.4, 0, 0.6, 1);
```

### Duration Scale
```
--duration-75: 75ms    /* Micro-interactions */
--duration-100: 100ms  /* Button presses */
--duration-150: 150ms  /* Small transitions */
--duration-200: 200ms  /* Standard transitions */
--duration-300: 300ms  /* Page transitions */
--duration-500: 500ms  /* Complex animations */
--duration-700: 700ms  /* Attention-grabbing */
--duration-1000: 1000ms /* Hero animations */
```

### Animation Types
1. **Entrance:** Fade in, slide up, scale
2. **Exit:** Fade out, slide down, scale
3. **Attention:** Pulse, shake, bounce
4. **State Change:** Color shift, rotation
5. **Data Flow:** Particle streams, progress

## 7. Component Library

### Buttons
```css
/* Primary Button */
.btn-primary {
  background: linear-gradient(135deg, #0ea5e9, #8b5cf6);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  transition: all 200ms ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(14, 165, 233, 0.3);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: #0ea5e9;
  border: 2px solid #0ea5e9;
  padding: 10px 22px;
  border-radius: 8px;
  font-weight: 600;
}

/* Ghost Button */
.btn-ghost {
  background: transparent;
  color: #94a3b8;
  border: none;
  padding: 12px 24px;
}
```

### Cards
```css
.card {
  background: #1e293b;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 200ms ease;
}

.card:hover {
  border-color: rgba(14, 165, 233, 0.3);
  box-shadow: 0 8px 24px rgba(14, 165, 233, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #f1f5f9;
}

.card-icon {
  width: 40px;
  height: 40px;
  background: rgba(14, 165, 233, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0ea5e9;
}
```

### Inputs
```css
.input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px 16px;
  color: #f1f5f9;
  font-size: 16px;
  transition: all 200ms ease;
}

.input:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.input-label {
  display: block;
  margin-bottom: 8px;
  color: #94a3b8;
  font-size: 14px;
  font-weight: 500;
}
```

## 8. Data Visualization

### Color Palette for Charts
```css
--chart-1: #0ea5e9    /* Primary metric */
--chart-2: #8b5cf6    /* Secondary metric */
--chart-3: #06d6a0    /* Positive trend */
--chart-4: #f59e0b    /* Warning/attention */
--chart-5: #ef4444    /* Negative trend */
--chart-6: #8b5cf6    /* Alternate */
--chart-7: #06d6a0    /* Success */
--chart-8: #f59e0b    /* Highlight */
```

### Chart Guidelines
- **Line charts:** 3px stroke, rounded ends
- **Bar charts:** 8px rounded corners
- **Pie charts:** Inner radius 40% for donuts
- **Area charts:** Gradient fills with transparency

### Animation Patterns
- **Data entry:** Staggered fade-in
- **Updates:** Smooth transitions
- **Highlights:** Pulse effect on selection
- **Tooltips:** Delayed show, instant hide

## 9. Photography & Imagery

### Style Principles
- **Dark theme:** Predominantly dark backgrounds
- **Energy accents:** Blue/purple light accents
- **Minimalist:** Clean, uncluttered compositions
- **Futuristic:** Subtle tech elements

### Image Treatments
1. **Overlays:** Subtle gradient overlays
2. **Blurs:** Background blurs for depth
3. **Vignettes:** Darkened edges for focus
4. **Color grading:** Cool tones with warm accents

### Usage Guidelines
- **Hero images:** Full bleed with text overlay
- **Content images:** Contained with border radius
- **Avatar images:** Circular with glow effect
- **Icon images:** Monochrome with color accents

## 10. Motion Design

### Character Animation States

**Idle State:**
- Gentle floating (0.05m amplitude, 0.5Hz)
- Subtle particle flow
- Breathing eye glow
- Duration: Continuous loop

**Active State:**
- Increased particle speed (2x)
- Core energy brightens (1.5x)
- Aura expands (1.2x)
- Trigger: User interaction

**Speaking State:**
- Eye pulse synchronized with speech
- Data streams visible
- Particle bursts on emphasis
- Duration: While audio plays

**Processing State:**
- High particle density (3x)
- Rapid core pulse (5Hz)
- Color cycling (teal/amber)
- Duration: Task-dependent

### UI Animation Patterns

**Micro-interactions:**
- Button presses: Scale down 95%
- Hover effects: Translate Y -2px
- Focus states: Glow pulse
- Loading: Rotating particle orbit

**Transitions:**
- Page transitions: Fade + slide
- Modal appearances: Scale + fade
- List items: Staggered fade-in
- Data updates: Smooth morphing

## 11. Accessibility Guidelines

### Color Contrast
- **Text:** Minimum 4.5:1 contrast ratio
- **Large text:** Minimum 3:1 contrast ratio
- **UI components:** Minimum 3:1 contrast ratio
- **Graphical objects:** Minimum 3:1 contrast ratio

### Motion Considerations
- **Reduce motion:** Respect OS preference
- **Pause animations:** Provide controls
- **Flash avoidance:** Maximum 3 flashes/second
- **Timing adjustable:** Allow user control

### Screen Reader Support
- **Alt text:** Descriptive for all images
- **ARIA labels:** For interactive elements
- **Focus management:** Logical tab order
- **Live regions:** For dynamic content

### Keyboard Navigation
- **Focus indicators:** Clear visible focus
- **Skip links:** Bypass navigation
- **Shortcuts:** Consistent across platform
- **Escape:** Close modals/dialogs

## 12. Implementation Resources

### Design Files
- **Figma:** Complete design system
- **Sketch:** Component library
- **Adobe XD:** UI kit with animations

### Development Resources
- **React:** Component library
- **Vue:** Design system package
- **Angular:** UI component library
- **CSS:** Custom properties file
- **Three.js:** 3D model package

### Asset Packages
- **Icons:** SVG sprite sheet
- **Logos:** Multiple formats and sizes
- **Colors:** CSS variables, design tokens
- **Animations:** Lottie files, CSS keyframes

### Documentation
- **Storybook:** Component documentation
- **Style guide:** This document
- **Implementation guide:** Step-by-step tutorials
- **Accessibility audit:** Compliance checklist

## 13. Quality Assurance

### Visual Consistency Checklist
- [ ] Colors match brand palette
- [ ] Typography follows hierarchy
- [ ] Spacing uses scale system
- [ ] Icons use consistent style
- [ ] Animations follow timing guidelines
- [ ] Responsive behavior tested

### Performance Checklist
- [ ] Images optimized for web
- [ ] Animations run at 60fps
- [ ] Bundle size within limits
- [ ] Lazy loading implemented
- [ ] Critical CSS inlined

### Accessibility Checklist
- [ ] Color contrast meets WCAG AA
- [ ] Keyboard navigation complete
- [ ] Screen reader labels provided
- [ ] Motion preferences respected
- [ ] Focus management implemented

## 14. Version Control

### File Naming Convention
```
logos/
  vertex-nexus-primary.svg
  vertex-nexus-secondary.svg
  vertex-nexus-wordmark.svg

icons/
  icon-[category]-[name]-[size].svg
  icon-system-settings-24.svg
  icon-action-download-32.svg

colors/
  colors-css-variables.css
  colors-design-tokens.json

animations/
  animation-[name]-[duration].json
  animation-logo-intro-3s.json
```

### Version History
- **v1.0:** Initial release (April 2026)
- **v1.1:** Added dark/light mode support
- **v1.2:** Enhanced accessibility features
- **v1.3:** Added motion reduction options

---

## Contact & Support

**Design Questions:** nexusdesign@vertex-ai.com  
**Technical Support:** devsupport@vertex-ai.com  
**Accessibility:** accessibility@vertex-ai.com  

**Last Updated:** April 5, 2026  
**Next Review:** October 5, 2026  

---

*VERTEX Nexus - Style Guide v1.0*  
*Creating the future of AI companionship*