// Dashboard - Initiation Phase

function renderDashboard() {
  const app = byId('app');
  
  if (!gameState.eventBrief) {
    renderBriefSelection(app);
  } else {
    renderEventOverview(app);
  }
}

function renderBriefSelection(container) {
  const briefTemplates = [
    {
      clientName: 'PT Tech Innovation',
      eventType: 'conference',
      targetAudience: 'Profesional IT & Entrepreneur',
      expectedGuests: 500,
      date: '2024-12-15',
      location: 'Jakarta Convention Center',
      budget: 750000000,
      objectives: ['Membangun networking ecosystem', 'Sharing knowledge industri terkini', 'Mencari investor untuk startup peserta'],
      deadline: 60,
    },
    {
      clientName: 'Universitas Maju',
      eventType: 'workshop',
      targetAudience: 'Mahasiswa & Fresh Graduate',
      expectedGuests: 200,
      date: '2024-11-20',
      location: 'Kampus Universitas Maju',
      budget: 300000000,
      objectives: ['Meningkatkan skill praktis mahasiswa', 'Koneksi dengan industri', 'Portfolio building'],
      deadline: 45,
    },
    {
      clientName: 'Perusahaan ABC',
      eventType: 'corporate',
      targetAudience: 'Karyawan & Mitra Bisnis',
      expectedGuests: 1000,
      date: '2024-11-10',
      location: 'Hotel Grand Indonesia',
      budget: 2000000000,
      objectives: ['Team building', 'Apresiasi karyawan', 'Peluncuran produk baru'],
      deadline: 30,
    },
  ];

  container.innerHTML = `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>📋 Terima Brief Klien</h1>
        <p>Fase Initiation: Pahami kebutuhan proyek dan tujuan event</p>
      </div>

      <div class="brief-selection">
        <div class="templates-section">
          <h2>📦 Pilih Template Event</h2>
          <div class="templates-grid" id="templates-grid"></div>
        </div>

        <div class="divider">ATAU</div>

        <div class="custom-brief-section">
          <h2>✍️ Buat Event Custom</h2>
          <form id="custom-brief-form" class="brief-form"></form>
        </div>
      </div>
    </div>
  `;

  const templatesGrid = byId('templates-grid');
  briefTemplates.forEach((template) => {
    const card = createElement('div', 'template-card');
    card.innerHTML = `
      <h3>${template.clientName}</h3>
      <p class="template-type">🎯 ${template.eventType.toUpperCase()}</p>
      <p><strong>Peserta:</strong> ${template.expectedGuests} orang</p>
      <p><strong>Tanggal:</strong> ${template.date}</p>
      <p><strong>Budget:</strong> ${formatCurrency(template.budget)}</p>
      <p class="template-deadline">⏰ ${template.deadline} hari</p>
      <button class="btn-primary">Pilih Template Ini</button>
    `;
    card.querySelector('.btn-primary').addEventListener('click', () => selectBrief(template));
    templatesGrid.appendChild(card);
  });

  const customForm = byId('custom-brief-form');
  customForm.innerHTML = `
    <div class="form-row">
      <div class="form-group">
        <label>Nama Klien *</label>
        <input type="text" name="clientName" required>
      </div>
      <div class="form-group">
        <label>Jenis Event *</label>
        <select name="eventType" required>
          <option value="conference">Konferensi</option>
          <option value="workshop">Workshop</option>
          <option value="seminar">Seminar</option>
          <option value="corporate">Corporate Event</option>
          <option value="exhibition">Pameran</option>
        </select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Target Audience *</label>
        <input type="text" name="targetAudience" placeholder="Contoh: Mahasiswa, Profesional" required>
      </div>
      <div class="form-group">
        <label>Jumlah Peserta *</label>
        <input type="number" name="expectedGuests" required>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Tanggal Event *</label>
        <input type="date" name="date" required>
      </div>
      <div class="form-group">
        <label>Lokasi *</label>
        <input type="text" name="location" required>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Total Budget (Rp) *</label>
        <input type="number" name="budget" required>
      </div>
      <div class="form-group">
        <label>Deadline Persiapan (hari)</label>
        <input type="number" name="deadline" value="30">
      </div>
    </div>
    <div class="form-group full-width">
      <label>Objektif Event (pisahkan dengan koma)</label>
      <textarea name="objectives" placeholder="Contoh: Networking, Sharing knowledge, Team building"></textarea>
    </div>
    <button type="submit" class="btn-primary full-width">✓ Mulai Proyek</button>
  `;

  customForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(customForm);
    const brief = {
      clientName: formData.get('clientName'),
      eventType: formData.get('eventType'),
      targetAudience: formData.get('targetAudience'),
      expectedGuests: parseInt(formData.get('expectedGuests')),
      date: formData.get('date'),
      location: formData.get('location'),
      budget: parseInt(formData.get('budget')),
      objectives: formData.get('objectives').split(',').map((s) => s.trim()),
      deadline: parseInt(formData.get('deadline')),
    };
    selectBrief(brief);
  });
}

function selectBrief(brief) {
  gameState.eventBrief = brief;
  gameState.currentPhase = 'planning';
  saveGameState();
  renderSidebar();
  renderDashboard();
  showToast('✓ Brief diterima! Lanjut ke fase Planning', 'success');
}

function renderEventOverview(container) {
  const brief = gameState.eventBrief;

  container.innerHTML = `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>📋 Event Brief</h1>
        <p>Fase Planning: Mulai merancang strategi event</p>
      </div>

      <div class="event-overview">
        <div class="overview-header">
          <h2>📌 Ringkasan Event yang Aktif</h2>
          <button class="btn-secondary" id="btn-change-event">Ganti Event</button>
        </div>

        <div class="overview-grid">
          <div class="overview-card">
            <h3>👤 Klien</h3>
            <p class="overview-value">${brief.clientName}</p>
          </div>
          <div class="overview-card">
            <h3>🎯 Jenis Event</h3>
            <p class="overview-value">${brief.eventType}</p>
          </div>
          <div class="overview-card">
            <h3>👥 Target Audience</h3>
            <p class="overview-value">${brief.targetAudience}</p>
          </div>
          <div class="overview-card">
            <h3>📅 Tanggal</h3>
            <p class="overview-value">${brief.date}</p>
          </div>
          <div class="overview-card">
            <h3>📍 Lokasi</h3>
            <p class="overview-value">${brief.location}</p>
          </div>
          <div class="overview-card">
            <h3>👨‍👩‍👧‍👦 Peserta</h3>
            <p class="overview-value">${brief.expectedGuests} orang</p>
          </div>
          <div class="overview-card highlight">
            <h3>💰 Budget</h3>
            <p class="overview-value">${formatCurrency(brief.budget)}</p>
          </div>
          <div class="overview-card highlight">
            <h3>⏰ Deadline</h3>
            <p class="overview-value">${brief.deadline} hari</p>
          </div>
        </div>

        <div class="objectives-section">
          <h3>🎯 Objektif Event</h3>
          <ul class="objectives-list">
            ${brief.objectives.map((obj) => `<li>✓ ${obj}</li>`).join('')}
          </ul>
        </div>

        <div class="action-buttons">
          <button class="btn-primary" onclick="window.location.hash = '#/planning'">Lanjut ke Planning →</button>
        </div>
      </div>
    </div>
  `;

  byId('btn-change-event').addEventListener('click', () => {
    gameState.eventBrief = null;
    gameState.tasks = [];
    gameState.budgetItems = [];
    gameState.venueLayout = null;
    gameState.negotiations = [];
    gameState.currentPhase = 'initiation';
    saveGameState();
    renderSidebar();
    renderDashboard();
  });
}
