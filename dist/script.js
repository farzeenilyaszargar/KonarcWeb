const menu = document.querySelector('.menu-button');
const navigation = document.querySelector('#navigation');
function closeMenu() { menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open navigation'); navigation.classList.remove('open'); }
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); navigation.classList.toggle('open', open); });
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });
window.matchMedia('(min-width: 701px)').addEventListener('change', closeMenu);

const products = {
  brace: '<div><span class="roadmap-label">THE FOUNDATION</span><h3>Better support starts<br>with thoughtful mechanics.</h3></div><div><p>Our first knee sleeve focuses on mechanical support, with adjustable screws and a wearable design. It’s the starting point for the Konarc product journey.</p><ul><li>Adjustable mechanical support</li><li>A sleeve designed for everyday wear</li><li>A foundation for connected technology</li></ul></div>',
  tens: '<div><span class="roadmap-label">THE NEXT CHAPTER · PLANNED</span><h3>Physical support.<br>A new layer of technology.</h3></div><div><p>Our future product aims to integrate TENS — transcutaneous electrical nerve stimulation — into the knee sleeve. This is a development direction focused on exploring pain management alongside mechanical support.</p><ul><li>TENS integration planned for a future product</li><li>Mechanical support and connected sensors</li><li>Clinical validation and final features to be established</li></ul></div>'
};
const appViews = {
  movement: '<div class="chart-label"><span>Movement overview</span><small>Illustration</small></div><div class="bar-chart" aria-hidden="true"><i style="--bar:35%"></i><i style="--bar:55%"></i><i style="--bar:43%"></i><i style="--bar:72%"></i><i style="--bar:61%"></i><i style="--bar:86%"></i><i style="--bar:70%"></i></div><div class="chart-days" aria-hidden="true"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div><p class="app-panel-note">See patterns in your movement.</p>',
  sensors: '<div class="chart-label"><span>Your sensor overview</span><small>Concept</small></div><div class="sensor-rows"><div class="sensor-row"><span>Sensor 01</span><span>Preview</span></div><div class="sensor-row"><span>Sensor 02</span><span>Preview</span></div><div class="sensor-row"><span>Sensor 03</span><span>Preview</span></div></div><p class="app-panel-note">Multiple sensors. One connected view.</p>'
};
function setupTabs(selector, panelId, attribute, content) {
  const tabs = [...document.querySelectorAll(selector)];
  const panel = document.getElementById(panelId);
  function activate(tab) { tabs.forEach(item => { const selected = item === tab; item.setAttribute('aria-selected', String(selected)); item.tabIndex = selected ? 0 : -1; }); panel.setAttribute('aria-labelledby', tab.id); panel.innerHTML = content[tab.dataset[attribute]]; }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); activate(tabs[next]); tabs[next].focus(); }
    });
  });
}
setupTabs('[data-product]', 'roadmap-panel', 'product', products);
setupTabs('[data-app-view]', 'app-panel', 'appView', appViews);
document.getElementById('year').textContent = new Date().getFullYear();
