// Destructure VanJS tags
const { 
  a, button, div, h1, h2, h3, header, 
  li, main, nav, p, span, ul 
} = van.tags;

// UI Components
const Indicator = (viewId) => 
  div({ 
    class: () => "indicator " + (state.activeView.val === viewId ? "active" : ""), 
    onclick: () => goToView(viewId) 
  });

const ViewIndicators = () => 
  div({ class: "view-indicators" }, 
    ...Array.from({ length: state.views.val }, (_, i) => Indicator(i + 1))
  );

const ViewControls = () =>
  div({ class: "view-controls" },
    button({ 
      class: "nav-arrow prev-view", 
      onclick: () => goToView(state.activeView.val - 1) 
    }, "<"),
    ViewIndicators(),
    button({ 
      class: "nav-arrow next-view", 
      onclick: () => goToView(state.activeView.val + 1) 
    }, ">")
  );

const MenuItem = (viewId, title) =>
  li({},
    a({
      href: "#",
      class: () => "menu-item " + (state.activeView.val === viewId ? "active" : ""),
      onclick: (e) => {
        e.preventDefault();
        goToView(viewId);
      },
    }, title)
  );

const SideMenu = () =>
  nav({ class: () => "side-menu " + (state.isMenuOpen.val ? "open" : "") },
    div({ class: "menu-header" }, 
      div({ class: "user-profile" }, 
        div({ class: "avatar" }),
        div({ class: "user-info" }, 
          h3({}, "User Name"),
          p({}, "user@example.com")
        )
      )
    ),
    ul({ class: "menu-items" }, 
      MenuItem(1, "Home"),
      MenuItem(2, "Explore"),
      MenuItem(3, "Profile"),
      MenuItem(4, "Settings"),
      MenuItem(5, "Notifications")
    )
  );

const DropdownMenu = () =>
  div({ class: () => "dropdown-menu " + (state.isDropdownOpen.val ? "open" : "") },
    a({
      href: "#",
      class: "dropdown-item",
      onclick: (e) => {
        e.preventDefault();
        goToView(1);
        state.isDropdownOpen.val = false;
      },
    }, "Home"),
    a({
      href: "#",
      class: "dropdown-item",
      onclick: (e) => {
        e.preventDefault();
        goToView(3);
        state.isDropdownOpen.val = false;
      },
    }, "Profile"),
    a({
      href: "#",
      class: "dropdown-item",
      onclick: (e) => {
        e.preventDefault();
        goToView(4);
        state.isDropdownOpen.val = false;
      },
    }, "Settings")
  );

const AppBar = (viewId) =>
  header({ class: "app-bar" },
    button({ 
      class: "app-bar-button menu-toggle", 
      onclick: () => (state.isMenuOpen.val = true) 
    }, "☰"),
    h2({ class: "view-title" }, 
      state.titles[viewId - 1] || `View ${viewId}`
    ),
    div({ class: "dropdown" }, 
      button({ 
        class: "app-bar-button options-toggle", 
        onclick: () => (state.isDropdownOpen.val = !state.isDropdownOpen.val) 
      }, "⋮"),
      DropdownMenu()
    )
  );

const NavItem = (viewId, icon, label) =>
  a({
    href: "#",
    class: () => "nav-item " + (state.activeView.val === viewId ? "active" : ""),
    onclick: (e) => {
      e.preventDefault();
      goToView(viewId);
    },
  },
    span({ class: "icon" }, icon),
    span({}, label)
  );

const BottomNav = () => 
  nav({ class: "bottom-nav" },
    NavItem(1, "●", "Home"),
    NavItem(2, "◆", "Explore"),
    NavItem(3, "■", "Profile"),
    NavItem(5, "▲", "Alerts")
  );

const Overlay = () =>
  div({
    class: () => "overlay " + (state.isMenuOpen.val || state.isDropdownOpen.val ? "active" : ""),
    onclick: () => {
      state.isMenuOpen.val = false;
      state.isDropdownOpen.val = false;
    },
  });

const DeviceView = (viewId) => 
  div({ 
    class: () => "device-view " + (state.activeView.val === viewId ? "active" : ""), 
    "data-view-id": viewId 
  },
    AppBar(viewId),
    SideMenu(),
    main({ class: "content-area" }, ...generateContent(viewId)),
    BottomNav(),
    Overlay()
  );

const DeviceWrapper = () => 
  div({ class: "device-wrapper", id: "deviceWrapper" },
    ...Array.from({ length: state.views.val }, (_, i) => DeviceView(i + 1))
  );

const App = () => 
  div({ class: "app-container" },
    h1({ class: "app-title" }, "Mobile App View Emulator"),
    ViewControls(),
    DeviceWrapper()
  );

// Render the app
van.add(document.body, App());
// Initialize app functionality
initApp();
