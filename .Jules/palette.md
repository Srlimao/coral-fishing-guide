## 2025-05-20 - Keyboard Accessibility & Dialog ARIA Attributes in Modals
**Learning:** Custom overlay modals without `role="dialog"`, `aria-modal="true"`, or Escape key listeners trap keyboard users and fail basic accessibility standards.
**Action:** Always attach Escape key listeners to modal popups and ensure proper ARIA dialog roles and visible focus indicators (`focus-visible:ring-2`) on close and action buttons.

## 2025-05-21 - Accessible Custom File Upload Buttons
**Learning:** Using `display: none` (`className="hidden"`) on `<input type="file">` removes the element from tab navigation, preventing keyboard users from focusing or triggering file uploads.
**Action:** Use `sr-only` on the `<input type="file">` and `focus-within:ring-2` on the wrapping `<label>` button to preserve keyboard focusability and visual focus states.
