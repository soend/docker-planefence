export class Footer extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <footer id="footer" class="footer">
          <div class="content has-text-centered">
              <p>
              PlaneFence <data id="planefence-version"></data> is part of <a href="https://github.com/kx1t/docker-planefence">KX1T's PlaneFence Open Source Project</a>,
              available on GitHub. Support is available on the #Planefence channel
              of the SDR Enthusiasts Discord Server. Click the Chat icon below to
              join. Build: <data id="build"></data>
              <br/>© Copyright 2020 - 2022 by Ramón F. Kolb, kx1t. 
              Please see <a href="about">About</a> for attributions to our
              contributors and open source packages used.
              </p>
              <a href="https://github.com/kx1t/docker-planefence" target="_blank"><img src="https://img.shields.io/github/workflow/status/kx1t/docker-planefence/Deploy%20to%20Docker%20Hub"></a>
              <a href="https://github.com/kx1t/docker-planefence" target="_blank"><img src="https://img.shields.io/docker/pulls/kx1t/planefence.svg"></a>
              <a href="https://github.com/kx1t/docker-planefence" target="_blank"><img src="https://img.shields.io/docker/image-size/kx1t/planefence/latest"></a>
              <a href="https://discord.gg/VDT25xNZzV"><img src="https://img.shields.io/discord/734090820684349521" alt="discord"></a>
          </div>
      </footer>
      `;
  }
}

customElements.define("footer-component", Footer);
