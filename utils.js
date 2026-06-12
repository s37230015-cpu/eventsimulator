// Utility Functions

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

// Format percentage
function formatPercentage(value) {
  return `${Math.round(value)}%`;
}

// Generate UUID
function generateId() {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Get element by ID
function byId(id) {
  return document.getElementById(id);
}

// Create element
function createElement(tag, className = '', innerHTML = '') {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (innerHTML) el.innerHTML = innerHTML;
  return el;
}

// Show toast notification
function showToast(message, type = 'info') {
  const toast = createElement('div', `toast toast-${type}`, message);
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'});
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Render sidebar
function renderSidebar() {
  const sidebar = byId('sidebar');
  const phases = [
    { id: 'initiation', label: 'Initiation', icon: '📋', path: '#/' },
    { id: 'planning', label: 'Planning', icon: '📊', path: '#/planning' },
    { id: 'execution', label: 'Execution', icon: '🚀', path: '#/execution' },
    { id: 'monitoring', label: 'Monitoring', icon: '📈', path: '#/resources' },
    { id: 'closing', label: 'Closing', icon: '✅', path: '#/review' },
  ];

  const currentPhaseIndex = phases.findIndex((p) => p.id === gameState.currentPhase);

  sidebar.innerHTML = `
    <div class="sidebar-header">
      <h2 class="sidebar-title">🎮 PlanIt</h2>
      <p class="sidebar-subtitle">Event Simulator</p>
    </div>

    <nav class="sidebar-nav">
      <h3 class="nav-section-title">Fase Proyek</h3>
      <ul class="nav-phases">
        ${phases
          .map(
            (phase, index) => `
          <li>
            <a href="${phase.path}" class="phase-link ${index <= currentPhaseIndex ? 'active' : 'disabled'}">
              <span class="phase-icon">${phase.icon}</span>
              <span class="phase-label">${phase.label}</span>
              <span class="phase-status ${index === currentPhaseIndex ? 'current' : ''}">
                ${index < currentPhaseIndex ? '✓' : index === currentPhaseIndex ? '→' : '○'}
              </span>
            </a>
          </li>
        `
          )
          .join('')}
      </ul>
    </nav>

    <div class="sidebar-footer">
      <div class="learning-tips">
        <h3>💡 Tips</h3>
        <ul>
          <li>Pahami brief klien</li>
          <li>Alokasikan budget efektif</li>
          <li>Kelola timeline</li>
          <li>Strategi negosiasi</li>
          <li>Evaluasi hasil</li>
        </ul>
      </div>
    </div>
  `;
}

// Add stylesheet animation
const style = document.createElement('style');
style.innerHTML = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);
