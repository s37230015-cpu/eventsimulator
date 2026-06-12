// Pitch & Negotiation Module

function renderPitchNegotiation() {
  const app = byId('app');

  app.innerHTML = `
    <div class="pitch-negotiation-container">
      <div class="pn-header">
        <div>
          <h1>💬 Pitch & Negotiation Module</h1>
          <p>Fase Execution: Latih Kemampuan Komunikasi & Pengambilan Keputusan Bisnis</p>
        </div>
        <button class="btn-primary" onclick="window.location.hash = '#/execution'">Lanjut ke Event Execution →</button>
      </div>

      <div class="pn-tabs">
        <button class="tab active" id="tab-pitch">🎤 Pitch Skills</button>
        <button class="tab" id="tab-negotiation">💼 Negotiation Skills</button>
      </div>

      <div id="pitch-section" class="pitch-section"></div>
      <div id="negotiation-section" class="negotiation-section hidden"></div>
    </div>
  `;

  renderPitchScenarios();

  byId('tab-pitch').addEventListener('click', () => {
    byId('pitch-section').classList.remove('hidden');
    byId('negotiation-section').classList.add('hidden');
    byId('tab-pitch').classList.add('active');
    byId('tab-negotiation').classList.remove('active');
  });

  byId('tab-negotiation').addEventListener('click', () => {
    byId('pitch-section').classList.add('hidden');
    byId('negotiation-section').classList.remove('hidden');
    byId('tab-pitch').classList.remove('active');
    byId('tab-negotiation').classList.add('active');
    renderNegotiationScenarios();
  });
}

function renderPitchScenarios() {
  const scenarios = [
    {
      id: 1,
      stakeholder: gameState.eventBrief?.clientName || 'Client',
      role: 'Client',
      scenario: `Anda harus mempresentasikan konsep event kepada klien. Jelaskan bagaimana Anda akan mencapai objectives: ${gameState.eventBrief?.objectives[0] || 'Event berhasil'}`,
      questions: [
        'Jelaskan strategi marketing Anda untuk event ini?',
        'Bagaimana Anda memastikan kepuasan peserta?',
        'Apa value proposition yang akan Anda tawarkan?',
      ],
      tips: [
        'Mulai dengan hook yang menarik (1 menit)',
        'Jelaskan problem & solution dengan jelas',
        'Highlight unique value & differentiation',
        'Gunakan data & metrics konkret',
        'Closing dengan call-to-action yang kuat',
      ],
    },
    {
      id: 2,
      stakeholder: 'Event Sponsor',
      role: 'Sponsor',
      scenario: 'Sponsor tertarik untuk bermitra dengan event Anda. Jelaskan benefit sponsorship dan ROI yang akan mereka dapatkan.',
      questions: [
        'Berapa banyak exposure yang akan didapat sponsor?',
        'Apa aktivasi brand yang bisa kami lakukan?',
        'Bagaimana target audience event ini?',
      ],
      tips: [
        'Highlight target audience demographics',
        'Show ROI calculations',
        'Offer multiple sponsorship tiers',
        'Share previous event success stories',
        'Be flexible with customization',
      ],
    },
  ];

  const container = byId('pitch-section');
  container.innerHTML = '';

  scenarios.forEach((scenario) => {
    const card = createElement('div', 'scenario-card');
    card.innerHTML = `
      <div class="scenario-header">
        <h3>${scenario.id === 1 ? '👥' : '🤝'} ${scenario.stakeholder} - ${scenario.role}</h3>
      </div>
      <div class="scenario-content">
        <p class="scenario-text">${scenario.scenario}</p>
        <div class="questions-section">
          <h4>Pertanyaan yang mungkin diajukan:</h4>
          <ul>
            ${scenario.questions.map((q) => `<li>• ${q}</li>`).join('')}
          </ul>
        </div>
        <div class="pitch-tips">
          <h4>💡 Tips Pitch yang Efektif:</h4>
          <ul>
            ${scenario.tips.map((tip) => `<li>✓ ${tip}</li>`).join('')}
          </ul>
        </div>
        <div class="pitch-actions">
          <button class="btn-poor" data-scenario="${scenario.id}" data-quality="poor">❌ Poor Pitch (20 pts)</button>
          <button class="btn-good" data-scenario="${scenario.id}" data-quality="good">👍 Good Pitch (60 pts)</button>
          <button class="btn-excellent" data-scenario="${scenario.id}" data-quality="excellent">⭐ Excellent Pitch (100 pts)</button>
        </div>
        <div class="pitch-result hidden" id="pitch-result-${scenario.id}"></div>
      </div>
    `;
    container.appendChild(card);

    card.querySelectorAll('.pitch-actions button').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const quality = e.target.dataset.quality;
        const scenarioId = parseInt(e.target.dataset.scenario);
        handlePitch(scenarioId, quality);
      });
    });
  });
}

function handlePitch(scenarioId, quality) {
  const scores = { poor: 20, good: 60, excellent: 100 };
  const score = scores[quality];
  const resultDiv = byId(`pitch-result-${scenarioId}`);
  resultDiv.classList.remove('hidden');
  resultDiv.classList.add(`score-${score}`);
  resultDiv.innerHTML = `
    <p>Pitch Score: <strong>${score}</strong> / 100</p>
    ${score >= 80 ? '<p>✓ Klien sangat tertarik dengan proposal Anda!</p>' : ''}
    ${score >= 60 && score < 80 ? '<p>⚠️ Klien tertarik namun ada yang perlu diperbaiki</p>' : ''}
    ${score < 60 ? '<p>❌ Klien kurang puas, perlu revisi proposal</p>' : ''}
  `;

  addNegotiation({
    stakeholder: gameState.eventBrief?.clientName || 'Stakeholder',
    type: 'client',
    initialDemand: 0,
    finalAgreement: 0,
    negotiationPoints: [`Pitch Quality: ${quality}`],
    outcome: quality === 'excellent' ? 'win-win' : 'compromise',
  });

  showToast(`✓ Pitch selesai! Score: ${score}/100`, 'success');
}

function renderNegotiationScenarios() {
  const scenarios = [
    {
      id: 1,
      stakeholder: 'Venue Manager',
      initialOffer: 150000000,
      minTarget: 120000000,
      scenario: 'Negosiasikan harga venue dengan manager. Coba dapatkan diskon terbaik!',
      tips: [
        'Tawarkan paket bundling dengan services lain',
        'Highlight volume peserta yang besar',
        'Tawarkan pembayaran advance',
        'Cari alternatif venues sebagai bargaining power',
      ],
    },
    {
      id: 2,
      stakeholder: 'Catering Provider',
      initialOffer: 50000000,
      minTarget: 40000000,
      scenario: 'Negosiasikan harga catering. Catering ini akan serve untuk semua peserta.',
      tips: [
        'Tanyakan menu customization',
        'Negotiate per-person cost',
        'Discuss payment terms',
        'Ask for sample tasting',
      ],
    },
  ];

  const container = byId('negotiation-section');
  container.innerHTML = '';

  scenarios.forEach((scenario) => {
    const card = createElement('div', 'scenario-card');
    card.innerHTML = `
      <div class="scenario-header">
        <h3>🏢 ${scenario.stakeholder}</h3>
        <p class="offer-text">
          Initial Offer: ${formatCurrency(scenario.initialOffer)} | Target: ${formatCurrency(scenario.minTarget)}
        </p>
      </div>
      <div class="scenario-content">
        <p class="scenario-text">${scenario.scenario}</p>
        <div class="negotiation-tips">
          <h4>💡 Tips Negosiasi:</h4>
          <ul>
            ${scenario.tips.map((tip) => `<li>• ${tip}</li>`).join('')}
          </ul>
        </div>
        <div class="negotiation-strategies">
          <h4>Pilih Strategi Negosiasi:</h4>
          <div class="strategies">
            <div class="strategy-option">
              <h5>🔥 Aggressive</h5>
              <p>Target diskon besar, tapi risiko deal batal</p>
              <button class="btn-strategy" data-scenario="${scenario.id}" data-strategy="aggressive">Coba Aggressive</button>
            </div>
            <div class="strategy-option">
              <h5>⚖️ Balanced</h5>
              <p>Negosiasi adil, mutually beneficial</p>
              <button class="btn-strategy" data-scenario="${scenario.id}" data-strategy="balanced">Coba Balanced</button>
            </div>
            <div class="strategy-option">
              <h5>🤝 Cooperative</h5>
              <p>Partnership jangka panjang, tapi diskon minimal</p>
              <button class="btn-strategy" data-scenario="${scenario.id}" data-strategy="cooperative">Coba Cooperative</button>
            </div>
          </div>
        </div>
        <div class="negotiation-result hidden" id="negotiation-result-${scenario.id}"></div>
      </div>
    `;
    container.appendChild(card);

    card.querySelectorAll('.btn-strategy').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const strategy = e.target.dataset.strategy;
        const scenarioId = parseInt(e.target.dataset.scenario);
        handleNegotiation(scenarioId, strategy, scenario);
      });
    });
  });
}

function handleNegotiation(scenarioId, strategy, scenario) {
  const discounts = { aggressive: 0.25, balanced: 0.15, cooperative: 0.08 };
  const discount = discounts[strategy];
  const finalPrice = Math.round(scenario.initialOffer * (1 - discount));
  const score = strategy === 'balanced' ? 80 : strategy === 'cooperative' ? 60 : finalPrice < scenario.minTarget ? 90 : 70;

  const resultDiv = byId(`negotiation-result-${scenarioId}`);
  resultDiv.classList.remove('hidden');
  resultDiv.classList.add(`score-${score}`);
  resultDiv.innerHTML = `
    <p>Negotiation Score: <strong>${score}</strong> / 100</p>
    ${score >= 80 ? '<p>✓ Excellent! Anda berhasil win-win negotiation!</p>' : ''}
    ${score >= 60 && score < 80 ? '<p>👍 Good! Deal tercapai dengan hasil yang baik</p>' : ''}
    ${score < 60 ? '<p>⚠️ Deal tercapai tapi bisa lebih baik</p>' : ''}
    <p style="margin-top: 1rem; font-weight: 600;">Final Price: ${formatCurrency(finalPrice)} (Diskon: ${Math.round(discount * 100)}%)</p>
  `;

  addNegotiation({
    stakeholder: scenario.stakeholder,
    type: 'vendor',
    initialDemand: scenario.initialOffer,
    finalAgreement: finalPrice,
    negotiationPoints: [`Strategy: ${strategy}`, `Discount: ${Math.round(discount * 100)}%`, `Final: ${formatCurrency(finalPrice)}`],
    outcome: 'win-win',
  });

  showToast(`✓ Negosiasi selesai! Score: ${score}/100`, 'success');
}
