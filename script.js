// State management
const state = {
  views: van.state(5),
  activeView: van.state(1),
  titles: ["Home View", "Explore View", "Profile View", "Settings View", "Notifications View"],
  isMenuOpen: van.state(false),
  isDropdownOpen: van.state(false)
};

// Content generation logic
const generateContent = (viewId) =>
  viewId % 2 == 1
    ? Array.from({ length: 3 }, (_, i) => 
        div({ class: "card" }, 
          div({ class: "card-img" }),
          h3({ class: "card-title" }, `Card Title $
{i + 1}`),
          p({ class: "card-subtitle" }, "List item description text goes here")
        ))
    : Array.from({ length: 5 }, (_, i) => 
        div({ class: "list-item" }, 
          div({ class: "list-icon" }),
          div({ class: "list-content" }, 
            h3({}, `List Item
${i + 1}`),
            p({}, "List item description text goes here")
          )
        ));

// Navigation functionality
const goToView = (viewId) => {
  const targetView = Math.max(1, Math.min(state.views.val, viewId));
  
  if (targetView === state.activeView.val) return;
  
  state.activeView.val = targetView;
  state.isMenuOpen.val = false;
  state.isDropdownOpen.val = false;
  
  const event = new CustomEvent("viewchange", { 
    detail: { 
      previousView: state.activeView.val, 
      currentView: targetView 
    } 
  });
  document.dispatchEvent(event);
};

// Touch gesture handling
const setupTouchGestures = () => {
  const deviceWrapper = document.getElementById("deviceWrapper");
  let startX = 0;
  
  deviceWrapper.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });
  
  deviceWrapper.addEventListener("touchend", (e) => {
    const diffX = startX - e.changedTouches[0].clientX;
    if (Math.abs(diffX) > 50) {
      goToView(state.activeView.val + (diffX > 0 ? 1 : -1));
    }
  });
};

// Initialize gestures and expose public API
const initApp = () => {
  setTimeout(setupTouchGestures, 0);
  
  // Public API
  window.MAVE = {
    goToView: goToView,
    getCurrentView: () => state.activeView.val
  };
};
