const { a: a, button: button, div: div, h1: h1, h2: h2, h3: h3, header: header, li: li, main: main, nav: nav, p: p, span: span, ul: ul } = van.tags,
  state = { views: van.state(5), activeView: van.state(1), titles: ["Home View", "Explore View", "Profile View", "Settings View", "Notifications View"], isMenuOpen: van.state(!1), isDropdownOpen: van.state(!1) },
  generateContent = (e) =>
    e % 2 == 1
      ? Array.from({ length: 3 }, (e, t) => div({ class: "card" }, div({ class: "card-img" }), h3({ class: "card-title" }, `Card Title ${t + 1}`), p({ class: "card-subtitle" }, "List item description text goes here")))
      : Array.from({ length: 5 }, (e, t) => div({ class: "list-item" }, div({ class: "list-icon" }), div({ class: "list-content" }, h3({}, `List Item ${t + 1}`), p({}, "List item description text goes here")))),
  goToView = (e) => {
    const t = Math.max(1, Math.min(state.views.val, e));
    if (t === state.activeView.val) return;
    (state.activeView.val = t), (state.isMenuOpen.val = !1), (state.isDropdownOpen.val = !1);
    const a = new CustomEvent("viewchange", { detail: { previousView: state.activeView.val, currentView: t } });
    document.dispatchEvent(a);
  },
  Indicator = (e) => div({ class: () => "indicator " + (state.activeView.val === e ? "active" : ""), onclick: () => goToView(e) }),
  ViewIndicators = () => div({ class: "view-indicators" }, ...Array.from({ length: state.views.val }, (e, t) => Indicator(t + 1))),
  ViewControls = () =>
    div(
      { class: "view-controls" },
      button({ class: "nav-arrow prev-view", onclick: () => goToView(state.activeView.val - 1) }, "<"),
      ViewIndicators(),
      button({ class: "nav-arrow next-view", onclick: () => goToView(state.activeView.val + 1) }, ">")
    ),
  MenuItem = (e, t) =>
    li(
      {},
      a(
        {
          href: "#",
          class: () => "menu-item " + (state.activeView.val === e ? "active" : ""),
          onclick: (t) => {
            t.preventDefault(), goToView(e);
          },
        },
        t
      )
    ),
  SideMenu = () =>
    nav(
      { class: () => "side-menu " + (state.isMenuOpen.val ? "open" : "") },
      div({ class: "menu-header" }, div({ class: "user-profile" }, div({ class: "avatar" }), div({ class: "user-info" }, h3({}, "User Name"), p({}, "user@example.com")))),
      ul({ class: "menu-items" }, MenuItem(1, "Home"), MenuItem(2, "Explore"), MenuItem(3, "Profile"), MenuItem(4, "Settings"), MenuItem(5, "Notifications"))
    ),
  DropdownMenu = () =>
    div(
      { class: () => "dropdown-menu " + (state.isDropdownOpen.val ? "open" : "") },
      a(
        {
          href: "#",
          class: "dropdown-item",
          onclick: (e) => {
            e.preventDefault(), goToView(1), (state.isDropdownOpen.val = !1);
          },
        },
        "Home"
      ),
      a(
        {
          href: "#",
          class: "dropdown-item",
          onclick: (e) => {
            e.preventDefault(), goToView(3), (state.isDropdownOpen.val = !1);
          },
        },
        "Profile"
      ),
      a(
        {
          href: "#",
          class: "dropdown-item",
          onclick: (e) => {
            e.preventDefault(), goToView(4), (state.isDropdownOpen.val = !1);
          },
        },
        "Settings"
      )
    ),
  AppBar = (e) =>
    header(
      { class: "app-bar" },
      button({ class: "app-bar-button menu-toggle", onclick: () => (state.isMenuOpen.val = !0) }, "☰"),
      h2({ class: "view-title" }, state.titles[e - 1] || `View ${e}`),
      div({ class: "dropdown" }, button({ class: "app-bar-button options-toggle", onclick: () => (state.isDropdownOpen.val = !state.isDropdownOpen.val) }, "⋮"), DropdownMenu())
    ),
  NavItem = (e, t, i) =>
    a(
      {
        href: "#",
        class: () => "nav-item " + (state.activeView.val === e ? "active" : ""),
        onclick: (t) => {
          t.preventDefault(), goToView(e);
        },
      },
      span({ class: "icon" }, t),
      span({}, i)
    ),
  BottomNav = () => nav({ class: "bottom-nav" }, NavItem(1, "●", "Home"), NavItem(2, "◆", "Explore"), NavItem(3, "■", "Profile"), NavItem(5, "▲", "Alerts")),
  Overlay = () =>
    div({
      class: () => "overlay " + (state.isMenuOpen.val || state.isDropdownOpen.val ? "active" : ""),
      onclick: () => {
        (state.isMenuOpen.val = !1), (state.isDropdownOpen.val = !1);
      },
    }),
  DeviceView = (e) => div({ class: () => "device-view " + (state.activeView.val === e ? "active" : ""), "data-view-id": e }, AppBar(e), SideMenu(), main({ class: "content-area" }, ...generateContent(e)), BottomNav(), Overlay()),
  DeviceWrapper = () => div({ class: "device-wrapper", id: "deviceWrapper" }, ...Array.from({ length: state.views.val }, (e, t) => DeviceView(t + 1))),
  setupTouchGestures = () => {
    const e = document.getElementById("deviceWrapper");
    let t = 0;
    e.addEventListener("touchstart", (e) => {
      t = e.touches[0].clientX;
    }),
      e.addEventListener("touchend", (e) => {
        const a = t - e.changedTouches[0].clientX;
        Math.abs(a) > 50 && goToView(state.activeView.val + (a > 0 ? 1 : -1));
      });
  },
  App = () => div({ class: "app-container" }, h1({ class: "app-title" }, "Mobile App View Emulator"), ViewControls(), DeviceWrapper());
van.add(document.body, App()), setTimeout(setupTouchGestures, 0), (window.MAE = { goToView: goToView, getCurrentView: () => state.activeView.val });
