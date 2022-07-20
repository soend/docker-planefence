class Menu extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
      this.innerHTML = `
        <aside class="menu">
            <ul class="menu-list">
            <li>
                <a href="../">
                    <span class="icon-text">
                        <span class="icon">
                            <i class="fas fa-home"></i>
                        </span>
                        <span>Dashboard</span>
                    </span>
                </a>
            </li>
            <li>
                <a href="./plane-log/">
                    <span class="icon-text">
                        <span class="icon">
                            <i class="fa-solid fa-list"></i>
                        </span>
                        <span>24hr Plane log</span>
                    </span>
                </a>
            </li>
            <li>
                <a>
                    <span class="icon-text">
                        <span class="icon">
                            <i class="fa-solid fa-bell"></i>
                        </span>
                        <span>Plane alerts</span>
                    </span>
                </a>
            </li>
            <li>
                <a>
                    <span class="icon-text">
                        <span class="icon">
                            <i class="fa-solid fa-clock-rotate-left"></i>
                        </span>
                        <span>History</span>
                    </span>
                </a>
            </li>
            <li>
                <a href="./about/">
                    <span class="icon-text">
                        <span class="icon">
                            <i class="fa-solid fa-circle-info"></i>
                        </span>
                        <span>About</span>
                    </span>
                </a>
            </li>
            </ul>
        </aside>
        `;
    }
  }
  
  customElements.define("menu-component", Menu);
  