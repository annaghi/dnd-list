class ElmCodeElement extends HTMLElement {
  constructor() {
    super();
    this._elm = { href: "" };
  }

  get href() {
    return this._elm.href;
  }

  set href(value) {
    if (value === this._elm.href) {
      return;
    }
    this._elm.href = value;
    this._highlight();
  }

  _highlight() {
    fetch(this._elm.href)
      .then(response => {
        return response.text();
      })
      .then(source => {
        if (this._pre) {
          this._pre.parentNode.removeChild(this._pre);
        }
        if (this._code) {
          this._code.parentNode.removeChild(this._code);
        }

        this._pre = document.createElement("pre");
        this._code = document.createElement("code");
        this._code.innerHTML = source;
        this._pre.appendChild(this._code);
        this.appendChild(this._pre);

        hljs.highlightBlock(this._code);
      });
  }

  connectedCallback() {
    setTimeout(() => {
      if (this._elm.href !== "") {
        this._highlight();
      }
    });
  }
}

window.customElements.define("elm-code", ElmCodeElement);
