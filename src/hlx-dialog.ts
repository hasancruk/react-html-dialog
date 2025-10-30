export class Dialog extends HTMLElement {
  static tagName = "hlx-dialog";

  static register() {
    console.log(`${this.tagName} has been registered.`);
    customElements.define(Dialog.tagName, Dialog);
  }

  #controller;
  #dialog: HTMLDialogElement | undefined;

  static css = `
    ::slotted(dialog) {
      background-color: rebeccapurple;
    }
  `;

  constructor() {
    super();
    this.#controller = new AbortController();
  }

  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: "open" });
    const template = document.createElement("template");

    const sheet = new CSSStyleSheet();
    sheet.replaceSync(Dialog.css);
    shadowRoot.adoptedStyleSheets = [sheet];
    template.innerHTML = `
      <slot></slot> 
    `;
    shadowRoot.appendChild(template.content.cloneNode(true));

    const slot = shadowRoot.querySelector("slot");
    const slottedDialog = slot?.assignedElements()[0];

    if (!(slottedDialog instanceof HTMLDialogElement)) {
      console.warn(`${Dialog.tagName} does not contain dialog element`);
      return;
    }

    this.#dialog = slottedDialog;
    
    window.addEventListener("hlx-dialog-requested", () => {
      console.log("DEBUG dialog handler...");
      this.#dialog?.showModal();
    }, { signal: this.#controller.signal });
    
    this.#dialog.addEventListener("close", () => {
      this.dispatchEvent(new Event("hlx-dialog-closed", { bubbles: true }));
    }, {
      signal: this.#controller.signal,
    });
  }

  disconnectedCallback() {
    this.#controller.abort();
  }
}
