## 2025-05-20 - Keyboard Accessibility & Dialog ARIA Attributes in Modals
**Learning:** Custom overlay modals without `role="dialog"`, `aria-modal="true"`, or Escape key listeners trap keyboard users and fail basic accessibility standards.
**Action:** Always attach Escape key listeners to modal popups and ensure proper ARIA dialog roles and visible focus indicators (`focus-visible:ring-2`) on close and action buttons.
