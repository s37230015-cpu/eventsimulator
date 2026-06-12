// Main App Router

// Initialize app on page load
document.addEventListener('DOMContentLoaded', () => {
  loadGameState();
  renderSidebar();
  routePage();
  window.addEventListener('hashchange', routePage);
});

// Router
function routePage() {
  const hash = window.location.hash.slice(1) || '/';
  const [path] = hash.split('?');

  switch (path) {
    case '/':
      renderDashboard();
      break;
    case '/planning':
      if (!gameState.eventBrief) window.location.hash = '#/';
      else renderPlanningBoard();
      break;
    case '/resources':
      if (!gameState.eventBrief) window.location.hash = '#/';
      else renderResourceManagement();
      break;
    case '/venue':
      if (!gameState.eventBrief) window.location.hash = '#/';
      else renderVenueLayout();
      break;
    case '/pitch':
      if (!gameState.eventBrief) window.location.hash = '#/';
      else renderPitchNegotiation();
      break;
    case '/execution':
      if (!gameState.eventBrief) window.location.hash = '#/';
      else renderEventExecution();
      break;
    case '/review':
      if (!gameState.eventBrief) window.location.hash = '#/';
      else renderPostEventReview();
      break;
    default:
      window.location.hash = '#/';
  }
}
