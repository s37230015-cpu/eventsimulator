// Event Execution - Dynamic Events & Risk Management

function renderEventExecution() {
  const app = byId('app');

  const risks = [
    {
      id: '1',
      title: 'Weather Issue',
      description: 'Cuaca buruk menyebabkan outdoor activities harus di-move indoor',
      probability: 'high',
      impact: 'medium',
      mitigation: 'Siapkan backup indoor venue atau tent besar',
      status: 'identified',
    },
    {
      id: '2',
      title: 'Speaker No Show',
      description: 'Pembicara utama tidak bisa hadir di hari H',
      probability: 'medium',
      impact: 'high',
      mitigation: 'Siapkan pembicara pengganti atau record video',
      status: 'identified',
    },
    {
      id: '3',
      title: 'Catering Delay',
      description: 'Makanan tiba terlambat dari yang dijadwalkan',
      probability: 'medium',
      impact: 'medium',
      mitigation: 'Koordinasi ulang dengan catering, siapkan snacks',
      status: 'identified',
    },
    {
      id: '4',
      title: 'Technical Breakdown',
      description: 'Microphone atau projection system rusak',
      probability: 'low',
      impact: 'high',
      mitigation: 'Siapkan backup equipment, test semua sebelum event',
      status: 'identified',
    },
    {
      id: '5',
      title: 'Overcrowding',
      description: 'Peserta lebih banyak dari kapasitas yang direncanakan',
      probability: 'low',
      impact: 'medium',
      mitigation: 'Enforce strict ticket limit, siapkan overflow area',
      status: 'identified',
    },
  ];

  app.innerHTML = `
    <div class="event-execution-container">
      <div class="execution-header">
        <div>
          <h1>🚀 Event Execution</h1>
          <p>Fase Execution & Monitoring: Jalankan Event & Handle Risiko</p>
        </div>
        <button class="btn-primary" onclick="window.location.hash = '#/review'">Lanjut ke Review →</button>
      </div>

      <div class="execution-phases" id="execution-phases"></div>
      <div class="execution-step" id="execution-step"></div>
      <div class="risk-management" id="risk-management"></div>
      <div class="execution-log" id="execution-log"></div>
      <div class="monitoring-stats" id="monitoring-stats"></div>
    </div>
  `;

  renderExecutionPhases();
  renderRiskManagement(risks);
  renderExecutionLog();
  renderMonitoringStats();
}

function renderExecutionPhases() {
  const phases = [
    {
      phase: 'pre-event',
      title: '📋 Pre-Event Checklist',
      tasks: [
        'Confirm semua vendor (venue, catering, AV)',
        'Brief team tentang timeline & contingency plan',
        'Test semua technical equipment',
        'Confirm speaker dan participant attendance',
        'Final walkthrough venue layout',
      ],
    },
    {
      phase: 'during-event',
      title: '🎉 During Event Execution',
      tasks: [
        'Greeting peserta di entrance',
        'Manage session scheduling',
        'Monitor catering & beverage supply',
        'Handle real-time issues',
        'Coordinate dengan team & vendors',
      ],
    },
    {
      phase: 'post-event',
      title: '✅ Post-Event Activities',
      tasks: [
        'Thank you remarks untuk peserta',
        'Collect feedback via survey/QR code',
        'Settlement dengan all vendors',
        'Debriefing dengan team',
        'Archive documentation & photos',
      ],
    },
  ];

  const phasesDiv = byId('execution-phases');
  phasesDiv.innerHTML = phases
    .map(
      (p) => `
    <button class="phase-btn ${gameState.currentPhase === 'execution' ? 'active' : ''}" data-phase="${p.phase}">
      ${p.title.split(' ')[0]} ${p.title.split(' ')[1]}
    </button>
  `
    )
    .join('');

  phasesDiv.querySelectorAll('.phase-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const phaseIndex = phases.findIndex((p) => p.phase === btn.dataset.phase);
      renderExecutionStep(phases[phaseIndex]);
    });
  });

  renderExecutionStep(phases[0]);
}

function renderExecutionStep(step) {
  const container = byId('execution-step');
  container.innerHTML = `
    <h2>${step.title}</h2>
    <div class="checklist">
      ${step.tasks.map((task, idx) => `
        <div class="checklist-item">
          <input type="checkbox" id="checklist-${idx}">
          <label for="checklist-${idx}">${task}</label>
        </div>
      `).join('')}
    </div>
    <button class="btn-primary" onclick="gameState.currentPhase = 'closing'; saveGameState(); window.location.hash = '#/review';">✓ Fase Selesai</button>
  `;
}

function renderRiskManagement(risks) {
  const container = byId('risk-management');
  container.innerHTML = '<h2>⚠️ Risk Management</h2><div class="risks-grid" id="risks-grid"></div>';

  const risksGrid = byId('risks-grid');
  risks.forEach((risk) => {
    const card = createElement('div', 'risk-card');
    card.innerHTML = `
      <div class="risk-header">
        <h4>${risk.title}</h4>
        <span class="risk-probability probability-${risk.probability}">${risk.probability}</span>
      </div>
      <p class="risk-desc">${risk.description}</p>
      <div class="risk-meta">
        <span class="impact impact-${risk.impact}">Impact: ${risk.impact}</span>
      </div>
      <div class="risk-mitigation">
        <strong>Mitigation:</strong>
        <p>${risk.mitigation}</p>
      </div>
      <div class="risk-actions">
        <button class="btn-trigger" data-risk-id="${risk.id}">Trigger Risk</button>
        <button class="btn-mitigate hidden" data-risk-id="${risk.id}">✓ Mitigate</button>
      </div>
    `;
    risksGrid.appendChild(card);

    const triggerBtn = card.querySelector('.btn-trigger');
    const mitigateBtn = card.querySelector('.btn-mitigate');

    triggerBtn.addEventListener('click', () => {
      triggerBtn.classList.add('hidden');
      mitigateBtn.classList.remove('hidden');
      gameState.monitoring.qualityScore -= 10;
      addExecutionLog(`Risk triggered: ${risk.title}`, 'warning');
      saveGameState();
      renderMonitoringStats();
      renderExecutionLog();
    });

    mitigateBtn.addEventListener('click', () => {
      triggerBtn.classList.remove('hidden');
      mitigateBtn.classList.add('hidden');
      gameState.monitoring.qualityScore += 5;
      addExecutionLog(`Risk mitigated: ${risk.title}`, 'success');
      saveGameState();
      renderMonitoringStats();
      renderExecutionLog();
    });
  });
}

function renderExecutionLog() {
  const container = byId('execution-log');
  container.innerHTML = `
    <h2>📝 Execution Log</h2>
    <div class="log-entries" id="log-entries"></div>
  `;

  const entries = byId('log-entries');
  gameState.executionLog.forEach((entry) => {
    const entryDiv = createElement('div', `log-entry severity-${entry.severity}`);
    entryDiv.innerHTML = `
      <span class="log-time">${entry.timestamp}</span>
      <span class="log-event">${entry.event}</span>
    `;
    entries.appendChild(entryDiv);
  });
}

function renderMonitoringStats() {
  const container = byId('monitoring-stats');
  container.innerHTML = `
    <h2>📊 Current Monitoring Status</h2>
    <div class="stat-cards">
      <div class="stat-card">
        <p class="stat-label">Quality Score</p>
        <p class="stat-value">${Math.max(0, gameState.monitoring.qualityScore)}/100</p>
      </div>
      <div class="stat-card">
        <p class="stat-label">Client Satisfaction</p>
        <p class="stat-value">${gameState.monitoring.clientSatisfaction}/100</p>
      </div>
      <div class="stat-card">
        <p class="stat-label">Timeline Adherence</p>
        <p class="stat-value">${gameState.monitoring.timelineAdherence}%</p>
      </div>
    </div>
  `;
}
