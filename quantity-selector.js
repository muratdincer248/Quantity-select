/**
 * Quantity Selector Web Component
 * Built from Figma design specification with exact design tokens
 * 
 * Features:
 * - Three sizes: small, medium, large
 * - States: enabled (collapsed), range, minimum (with trash icon), maximum (plus disabled)
 * - Fully accessible with ARIA attributes
 * - Keyboard navigation support
 * - Custom events: change, remove
 * - Hover and press feedback
 */

class QuantitySelectorElement extends HTMLElement {
  static get observedAttributes() {
    return ["value", "min", "max", "step", "size", "disabled", "show-remove-at-min"];
  }

  constructor() {
    super();
    this._value = 0;
    this._min = 1;
    this._max = 99;
    this._step = 1;
    this._size = "medium";
    this._disabled = false;
    this._showRemoveAtMin = true;

    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <style>
        :host {
          /* Figma Design Tokens */
          --font-family-figtree: 'Figtree', system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
          --font-weight-semibold: 600;
          
          /* Colors */
          --text-color-primary: #141415;
          --qs-color-primary: #93949d;
          --qs-color-secondary: rgba(255, 255, 255, 0.01);
          --qs-color-tertiary: #141415;
          --action-color-tertiary-enabled: rgba(255, 255, 255, 0.01);
          --action-color-tertiary-hover: rgba(0, 0, 0, 0.04);
          --action-color-tertiary-pressed: rgba(0, 0, 0, 0.08);
          --action-color-tertiary-disabled: rgba(255, 255, 255, 0.01);
          --icon-color-disabled: rgba(20, 20, 21, 0.4);
          
          /* Spacing */
          --spacing-none: 0px;
          --spacing-tiny: 2px;
          --spacing-xsmall: 4px;
          --spacing-small: 8px;
          --spacing-medium: 12px;
          
          /* Sizing */
          --sizing-mini: 16px;
          --sizing-tiny: 24px;
          --sizing-xsmall: 32px;
          --sizing-small: 40px;
          --sizing-medium: 48px;
          
          /* Border */
          --border-width-small: 1px;
          --border-radius-pill: 200px;
          
          /* Typography */
          --font-size-small: 14px;
          --font-size-medium: 16px;
          --line-height: 1.5;
          
          display: inline-block;
          font-family: var(--font-family-figtree);
          color: var(--text-color-primary);
        }

        * {
          box-sizing: border-box;
        }

        .root {
          display: inline-flex;
          align-items: center;
          gap: 0;
          user-select: none;
          -webkit-user-select: none;
        }

        /* Container wraps all elements with border */
        .container {
          display: inline-flex;
          align-items: center;
          border: var(--border-width-small) solid var(--qs-color-primary);
          border-radius: var(--border-radius-pill);
          background: white;
          transition: all 0.2s ease;
          gap: 0;
        }

        /* Collapsed state - circular button with border */
        .container.collapsed {
          border: var(--border-width-small) solid var(--qs-color-primary);
          background: white;
          border-radius: 50%;
          padding: 0;
        }

        .container.collapsed .btn-dec,
        .container.collapsed .value {
          display: none;
        }

        .container.collapsed .btn-inc {
          background: transparent;
        }

        /* Button styles */
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: var(--action-color-tertiary-enabled);
          border: none;
          border-radius: var(--border-radius-pill);
          cursor: pointer;
          padding: 0;
          transition: background-color 0.15s ease;
          flex-shrink: 0;
          color: var(--text-color-primary);
          position: relative;
        }

        .btn:hover:not([disabled]) {
          background: var(--action-color-tertiary-hover);
        }

        .btn:active:not([disabled]) {
          background: var(--action-color-tertiary-pressed);
        }

        .btn:focus-visible {
          outline: 2px solid #6b6cf6;
          outline-offset: 2px;
        }

        .btn[disabled] {
          cursor: not-allowed;
          opacity: 1;
          background: var(--action-color-tertiary-disabled);
        }

        .btn[disabled] .icon {
          color: var(--icon-color-disabled);
        }

        .btn svg {
          display: block;
        }

        /* Value display */
        .value {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: var(--font-weight-semibold);
          white-space: nowrap;
          flex-shrink: 0;
        }

        /* Size variants - Small (24px buttons, 16px icons) */
        :host([size="small"]) .container {
          height: var(--sizing-xsmall);
          padding: var(--spacing-xsmall);
        }

        :host([size="small"]) .container.collapsed {
          width: var(--sizing-xsmall);
          height: var(--sizing-xsmall);
          padding: var(--spacing-xsmall);
        }

        :host([size="small"]) .btn {
          width: var(--sizing-tiny);
          height: var(--sizing-tiny);
          padding: var(--spacing-xsmall);
        }

        :host([size="small"]) .value {
          height: var(--sizing-xsmall);
          font-size: var(--font-size-small);
          line-height: var(--line-height);
          min-width: var(--sizing-tiny);
          padding: 0 var(--spacing-tiny);
        }

        :host([size="small"]) .icon {
          width: var(--sizing-mini);
          height: var(--sizing-mini);
        }

        /* Size variants - Medium (32px buttons, 24px icons) */
        :host([size="medium"]) .container {
          height: var(--sizing-small);
          padding: var(--spacing-xsmall);
        }

        :host([size="medium"]) .container.collapsed {
          width: var(--sizing-xsmall);
          height: var(--sizing-xsmall);
          padding: 0;
        }

        :host([size="medium"]) .btn {
          width: var(--sizing-xsmall);
          height: var(--sizing-xsmall);
          padding: var(--spacing-xsmall);
        }

        :host([size="medium"]) .value {
          height: var(--sizing-small);
          font-size: var(--font-size-medium);
          line-height: var(--line-height);
          min-width: var(--sizing-xsmall);
          padding: var(--spacing-small) var(--spacing-xsmall);
        }

        :host([size="medium"]) .icon {
          width: var(--sizing-tiny);
          height: var(--sizing-tiny);
        }

        /* Size variants - Large (40px buttons, 24px icons) */
        :host([size="large"]) .container {
          height: var(--sizing-medium);
          padding: var(--spacing-xsmall);
        }

        :host([size="large"]) .container.collapsed {
          width: var(--sizing-small);
          height: var(--sizing-small);
          padding: 0;
        }

        :host([size="large"]) .btn {
          width: var(--sizing-small);
          height: var(--sizing-small);
          padding: var(--spacing-small);
        }

        :host([size="large"]) .value {
          height: var(--sizing-medium);
          font-size: var(--font-size-medium);
          line-height: var(--line-height);
          min-width: var(--sizing-xsmall);
          padding: var(--spacing-medium) var(--spacing-xsmall);
        }

        :host([size="large"]) .icon {
          width: var(--sizing-tiny);
          height: var(--sizing-tiny);
        }

        /* Icon styles */
        .icon {
          display: block;
        }

        .icon path {
          stroke: currentColor;
          stroke-width: 1.5;
          stroke-linecap: round;
          fill: none;
        }

        /* Bounce animation */
        @keyframes bounce {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.12);
          }
          100% {
            transform: scale(1);
          }
        }

        .value.bounce {
          animation: bounce 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      </style>
      <div class="root" part="root" role="group">
        <div class="container" part="container">
          <button class="btn btn-dec" part="decrement-button" aria-label="Decrease" data-btn="dec"></button>
          <div class="value" part="value" role="spinbutton" tabindex="0" aria-live="polite"></div>
          <button class="btn btn-inc" part="increment-button" aria-label="Increase" data-btn="inc"></button>
        </div>
      </div>
    `;

    this._els = {
      root: shadow.querySelector(".root"),
      container: shadow.querySelector(".container"),
      dec: shadow.querySelector(".btn-dec"),
      value: shadow.querySelector(".value"),
      inc: shadow.querySelector(".btn-inc")
    };

    this._onClick = this._onClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
  }

  connectedCallback() {
    this._upgradeProperty("value");
    this._upgradeProperty("min");
    this._upgradeProperty("max");
    this._upgradeProperty("step");
    this._upgradeProperty("size");
    this._upgradeProperty("disabled");
    this._upgradeProperty("showRemoveAtMin");

    if (!this.hasAttribute("size")) this.setAttribute("size", this._size);
    
    this._els.root.addEventListener("click", this._onClick);
    this._els.value.addEventListener("keydown", this._onKeyDown);
    this._render(false);
  }

  disconnectedCallback() {
    this._els.root.removeEventListener("click", this._onClick);
    this._els.value.removeEventListener("keydown", this._onKeyDown);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    switch (name) {
      case "value":
        this._value = this._coerceNumber(newValue, this._value);
        break;
      case "min":
        this._min = this._coerceNumber(newValue, this._min);
        break;
      case "max":
        this._max = this._coerceNumber(newValue, this._max);
        break;
      case "step":
        this._step = this._coerceNumber(newValue, this._step);
        break;
      case "size":
        this._size = (newValue || "medium").toLowerCase();
        break;
      case "disabled":
        this._disabled = newValue !== null;
        break;
      case "show-remove-at-min":
        this._showRemoveAtMin = newValue !== null;
        break;
    }
    this._render(false);
  }

  // Public API
  get value() {
    return this._value;
  }
  set value(v) {
    this.setAttribute("value", String(v));
  }

  get min() {
    return this._min;
  }
  set min(v) {
    this.setAttribute("min", String(v));
  }

  get max() {
    return this._max;
  }
  set max(v) {
    this.setAttribute("max", String(v));
  }

  get step() {
    return this._step;
  }
  set step(v) {
    this.setAttribute("step", String(v));
  }

  get size() {
    return this._size;
  }
  set size(v) {
    this.setAttribute("size", v);
  }

  get disabled() {
    return this._disabled;
  }
  set disabled(v) {
    if (v) this.setAttribute("disabled", "");
    else this.removeAttribute("disabled");
  }

  get showRemoveAtMin() {
    return this._showRemoveAtMin;
  }
  set showRemoveAtMin(v) {
    if (v) this.setAttribute("show-remove-at-min", "");
    else this.removeAttribute("show-remove-at-min");
  }

  // Private helpers
  _coerceNumber(v, fallback) {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }

  _upgradeProperty(prop) {
    if (Object.prototype.hasOwnProperty.call(this, prop)) {
      const value = this[prop];
      delete this[prop];
      this[prop] = value;
    }
  }

  _onClick(e) {
    if (this._disabled) return;
    const target = e.target.closest("button");
    if (!target) return;
    
    if (target.dataset.btn === "inc") {
      this.increment();
    } else if (target.dataset.btn === "dec") {
      this.decrement();
    }
  }

  _onKeyDown(e) {
    if (this._disabled) return;
    
    switch (e.key) {
      case "ArrowUp":
      case "ArrowRight":
        e.preventDefault();
        this.increment();
        break;
      case "ArrowDown":
      case "ArrowLeft":
        e.preventDefault();
        this.decrement();
        break;
      case "Home":
        e.preventDefault();
        this._setValue(this._min, "keyboard");
        break;
      case "End":
        e.preventDefault();
        this._setValue(this._max, "keyboard");
        break;
      case "Delete":
      case "Backspace":
        if (this._showRemoveAtMin && this._value === this._min) {
          e.preventDefault();
          this._dispatchRemoveEvent();
        }
        break;
    }
  }

  increment() {
    if (this._value === 0) {
      // First click when collapsed
      this._setValue(this._min, "increment");
    } else {
      this._setValue(this._value + this._step, "increment");
    }
  }

  decrement() {
    if (this._showRemoveAtMin && this._value === this._min) {
      this._dispatchRemoveEvent();
      return;
    }
    this._setValue(this._value - this._step, "decrement");
  }

  _setValue(next, source) {
    const clamped = Math.max(this._min, Math.min(this._max, next));
    if (clamped === this._value) {
      this._render(false);
      return;
    }
    
    const previousValue = this._value;
    this._value = clamped;
    this.setAttribute("value", String(this._value));
    this._render(true); // Trigger bounce animation
    
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: this._value, previousValue, source },
        bubbles: true
      })
    );
  }

  _dispatchRemoveEvent() {
    this._value = 0;
    this.setAttribute("value", "0");
    this._render(false);
    this.dispatchEvent(new CustomEvent("remove", { bubbles: true }));
  }

  _render(animate = false) {
    const { container, dec, value, inc } = this._els;
    
    // Determine state
    const isCollapsed = this._value === 0;
    const atMin = this._value === this._min;
    const atMax = this._value >= this._max;

    // Update container class
    container.classList.toggle("collapsed", isCollapsed);

    // Update ARIA attributes
    if (!isCollapsed) {
      value.setAttribute("tabindex", this._disabled ? "-1" : "0");
      value.setAttribute("aria-valuemin", String(this._min));
      value.setAttribute("aria-valuemax", String(this._max));
      value.setAttribute("aria-valuenow", String(this._value));
      value.setAttribute("aria-valuetext", String(this._value));
    } else {
      value.removeAttribute("tabindex");
    }

    // Update button states
    dec.disabled = this._disabled || isCollapsed;
    inc.disabled = this._disabled || atMax;

    // Update button content
    dec.innerHTML = "";
    inc.innerHTML = "";

    if (!isCollapsed) {
      if (this._showRemoveAtMin && atMin) {
        dec.appendChild(this._createTrashIcon());
        dec.setAttribute("aria-label", "Remove");
      } else {
        dec.appendChild(this._createMinusIcon());
        dec.setAttribute("aria-label", "Decrease");
      }
    }

    inc.appendChild(this._createPlusIcon(atMax));
    inc.setAttribute("aria-label", atMax ? "Maximum reached" : "Increase");

    // Update value display
    value.textContent = isCollapsed ? "" : String(this._value);

    // Trigger bounce animation when value changes
    if (animate && !isCollapsed) {
      value.classList.remove("bounce");
      // Force reflow to restart animation
      void value.offsetWidth;
      value.classList.add("bounce");
    }
  }

  _createPlusIcon(disabled) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("class", "icon");
    svg.setAttribute("aria-hidden", "true");
    
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M12 5v14M5 12h14");
    
    svg.appendChild(path);
    return svg;
  }

  _createMinusIcon() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("class", "icon");
    svg.setAttribute("aria-hidden", "true");
    
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M5 12h14");
    
    svg.appendChild(path);
    return svg;
  }

  _createTrashIcon() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("class", "icon");
    svg.setAttribute("aria-hidden", "true");
    
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("stroke-linejoin", "round");
    path.setAttribute("d", "M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3");
    
    svg.appendChild(path);
    return svg;
  }
}

customElements.define("quantity-selector", QuantitySelectorElement);

export { QuantitySelectorElement };
