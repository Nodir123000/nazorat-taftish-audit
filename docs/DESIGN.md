# Legendary UI — Design System & Guidelines

This document defines the "Legendary" aesthetic standard for the **Nazorat-Taftish (AIS KRR)** project, inspired by the `frontend-design` official plugin.

## 🏛 Core Aesthetic: "Refined Military Precision"
The interface should feel authoritative, high-precision, and premium. It is not just a tool; it is a specialized instrument for state financial oversight.

### 1. Typography
- **Display Font**: Use distinctive, high-impact fonts for headings (e.g., 'Outfit', 'Montserrat', or 'Oswald').
- **Body Font**: Clean, highly readable sans-serif (e.g., 'Roboto', 'Inter' — but used with precise spacing and weight).
- **Rule**: Pair a characterful display font with a refined body font. Avoid standard system fonts where possible.

### 2. Color Palette (High Contrast & Intentionality)
- **Deep Slate & Charcoal**: Base colors for dark mode and structural elements.
- **Accents**: 
  - **Military Gold/Amber**: For primary actions and "Legendary" status.
  - **Emerald Green**: For growth, approvals, and success.
  - **Crimson Red**: For violations, critical alerts, and high-risk items.
- **Rule**: Commit to dominant colors with sharp accents. Avoid timid, evenly-distributed palettes.

### 3. Motion & Interaction
- **Staggered Page Load**: Components should reveal themselves with a subtle `fade-in-up` animation using `stagger` delays.
- **Glassmorphism**: Use subtle backdrop blurs for overlays and floating cards to create depth.
- **Micro-interactions**: Hover states should feel reactive — slight scaling (`scale-102`), border-glows, or color shifts.
- **Rule**: Use motion to create delight and focus. One well-orchestrated reveal is better than constant chaotic movement.

### 4. Layout & Spacing
- **Grids**: Use specialized layouts that break the standard "box-within-box" feel.
- **Asymmetry**: Use subtle asymmetry or overlapping elements to create a bespoke, custom-designed look.
- **Density**: Balance high data density (necessary for audits) with generous whitespace in headers and navigation.

### 5. Visual "Wow" Details
- **Noise & Grain**: Use subtle grain overlays for a textured, physical feel in background gradients.
- **Gradient Meshes**: Use complex, multi-stop gradients instead of simple two-color fades.
- **Custom Borders**: Double borders, dashed accents, or tapered separators for that "Military Blueprint" look.

---

## 🚫 What to Avoid (Anti-patterns)
- **Generic AI Slop**: Predictable purple-to-blue gradients on plain white backgrounds.
- **System Defaults**: Using unstyled standard HTML/Base-UI components.
- **Low Contrast**: Interfaces that feel "muddy" or lack clear hierarchy.
- **Staticity**: Pages that feel "dead" and unresponsive to human interaction.
