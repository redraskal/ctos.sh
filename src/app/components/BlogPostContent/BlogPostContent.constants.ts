export const FOCUS_STYLE: string = `
  .keyboard-focus-element {
    position: relative;
  }
  
  .keyboard-focus-element::after {
    content: '';
    position: absolute;
    inset: -4px;
    outline: 2px solid #3b82f6;
    outline-offset: 4px;
    border-radius: 2px;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);
    pointer-events: none;
    z-index: 10;
    opacity: var(--focus-opacity, 1);
    transition: opacity 0.2s ease;
  }
  
  /* Hide default focus outline */
  .keyboard-focus-element:focus {
    outline: none;
  }
`;

export const INACTIVITY_TIMEOUT: number = 3000;
