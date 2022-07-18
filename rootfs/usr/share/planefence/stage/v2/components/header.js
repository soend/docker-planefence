class Header extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
        <nav id="header" class="navbar px-3" role="navigation" aria-label="main navigation">
            <div class="navbar-brand">
            <span class="has-text-weight-medium is-size-3">PlaneFence - <data id="station-name"></data></span>
            </div>

            <div class="navbar-end">
            <button class="button is-white navbar-item" href="https://github.com/kx1t/docker-planefence">
                <span class="icon is-size-3">
                <i class="fa-brands fa-github"></i>
                </span>
            </button>
            </div>
        </nav>
      `;
  }
}

customElements.define("header-component", Header);
