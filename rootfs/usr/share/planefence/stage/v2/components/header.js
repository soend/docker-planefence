export class Header extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
        <nav id="header" class="navbar" role="navigation" aria-label="main navigation">
          <div class="navbar-brand">
            <span class="navbar-item has-text-weight-medium is-size-3-desktop is-size-4-touch">PlaneFence - <data id="station-name"></data></span>

            <a class="navbar-item is-white is-hidden-desktop" target="_blank" href="https://github.com/kx1t/docker-planefence">
                <span class="icon is-size-3-desktop is-size-4-touch">
                  <i class="fa-brands fa-github"></i>
                </span>
            </a>

            <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false">
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>

          <div class="navbar-menu">
            <div class="navbar-start is-hidden-desktop">
                <a class="navbar-item" href="index.html">
                    <span class="icon-text">
                        <span class="icon">
                            <i class="fas fa-home"></i>
                        </span>
                        <span>Dashboard</span>
                    </span>
                </a>
                <a class="navbar-item" href="./plane-log/">
                  <span class="icon-text">
                      <span class="icon">
                          <i class="fa-solid fa-list"></i>
                      </span>
                      <span>24hr Plane log</span>
                  </span>
                </a>
                <a class="navbar-item">
                  <span class="icon-text">
                      <span class="icon">
                          <i class="fa-solid fa-bell"></i>
                      </span>
                      <span>Plane alerts</span>
                  </span>
                </a>
                <a class="navbar-item">
                  <span class="icon-text">
                      <span class="icon">
                          <i class="fa-solid fa-clock-rotate-left"></i>
                      </span>
                      <span>History</span>
                  </span>
                </a>
                <a class="navbar-item" href="./about/">
                  <span class="icon-text">
                      <span class="icon">
                          <i class="fa-solid fa-circle-info"></i>
                      </span>
                      <span>About</span>
                  </span>
                </a>
            </div>

            <div class="navbar-end is-hidden-touch">
              <a class="navbar-item is-white" target="_blank" href="https://github.com/kx1t/docker-planefence">
                  <span class="icon is-size-3-desktop is-size-4-touch">
                    <i class="fa-brands fa-github"></i>
                  </span>
              </a>
            </div>
          </div>
        </nav>
      `;
  }
}

customElements.define("header-component", Header);

$(document).ready(function() {
  // Check for click events on the navbar burger icon
  $(".navbar-burger").click(function() {

      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

  });
});