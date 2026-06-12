// Post-Event Review - Learning Assessment

function renderPostEventReview() {
  const app = byId('app');
  const iloResults = calculateILOScores();
  const feedback = generateFeedback();
  const budgetUtilization = calculateBudgetUtilization();
  const taskCompletion = calculateTaskCompletion();

  app.innerHTML = `
    <div class="post-event-review-container">
      <div class="review-header">
        <div>
          <h1>📊 Post-Event Review</h1>
          <p>Fase Closing: Analisis Performa & Pencapaian Learning Outcomes</p>
        </div>
        <button class="btn-primary" id="btn-new-game">🎮 Main Lagi</button>
      </div>

      <div class="event-summary" id="event-summary"></div>
      <div class="ilo-assessment" id="ilo-assessment"></div>
      <div class="performance-insights" id="performance-insights"></div>
      <div class="expert-feedback" id="expert-feedback"></div>
      <div class="key-achievements" id="key-achievements"></div>
      <div class="review-actions" id="review-actions"></div>
    </div>
  `;

  renderEventSummary();
  renderILOAssessment(iloResults);
  renderPerformanceInsights(budgetUtilization, taskCompletion);
  renderExpertFeedback(feedback);
  renderKeyAchievements();
  renderReviewActions();

  byId('btn-new-game').addEventListener('click', () => {
    resetGameState();
    renderSidebar();
    window.location.hash = '#/';
    renderDashboard();
  });
}

function renderEventSummary() {
  const container = byId('event-summary');
  const brief = gameState.eventBrief;
  container.innerHTML = `
    <div class="summary-card">
      <h3>Event yang Diselesaikan</h3>
      <p class="summary-client">${brief?.clientName}</p>
      <p class="summary-type">${brief?.eventType}</p>
      <p class="summary-details">👥 ${brief?.expectedGuests} peserta | 📍 ${brief?.location}</p>
    </div>
  `;
}

function renderILOAssessment(iloResults) {
  const container = byId('ilo-assessment');
  const ilos = [
    {
      title: 'ILO 1: Execution Skills',
      subtitle: 'Kemampuan mengeksekusi ide menjadi proyek terstruktur',
      score: iloResults.ilo1_execution,
    },
    {
      title: 'ILO 2: Budget Management',
      subtitle: 'Kemampuan mengelola anggaran secara efektif',
      score: iloResults.ilo2_budgetManagement,
    },
    {
      title: 'ILO 3: Venue & Layout Design',
      subtitle: 'Kemampuan merancang tata letak dan alur acara',
      score: iloResults.ilo3_venueDesign,
    },
    {
      title: 'ILO 4: Pitching & Negotiation',
      subtitle: 'Kemampuan pitching & negosiasi dengan stakeholder',
      score: iloResults.ilo4_pitching,
    },
  ];

  const iloCardsHTML = ilos
    .map((ilo) => {
      const grade = getGrade(ilo.score);
      return `
    <div class="ilo-card">
      <div class="ilo-header">
        <h3>${ilo.title}</h3>
        <p class="ilo-subtitle">${ilo.subtitle}</p>
      </div>
      <div class="ilo-score">
        <div class="score-circle" style="background-color: ${grade.color}">
          <span class="score-number">${ilo.score}</span>
          <span class="score-max">/ 100</span>
        </div>
        <div class="score-grade">${grade.grade}</div>
      </div>
      <p class="ilo-description">Score: ${ilo.score}/100</p>
    </div>
  `;
    })
    .join('');

  const overallGrade = getGrade(iloResults.overallScore);
  container.innerHTML = `
    <h2>🎯 Intended Learning Outcomes Assessment</h2>
    <div class="ilo-cards">${iloCardsHTML}</div>
    <div class="overall-score">
      <h2>Overall Score</h2>
      <div class="overall-circle" style="background-color: ${overallGrade.color}">
        <span class="overall-number">${iloResults.overallScore}</span>
        <span class="overall-grade">${overallGrade.label}</span>
      </div>
      <p class="overall-description">
        Congratulations! Anda telah menyelesaikan simulasi event management dengan hasil <strong>${overallGrade.label}</strong>.
      </p>
    </div>
  `;
}

function renderPerformanceInsights(budgetUtilization, taskCompletion) {
  const container = byId('performance-insights');
  const insights = [
    {
      category: 'Budget Management',
      metric: `${budgetUtilization.toFixed(1)}%`,
      status: budgetUtilization <= 100 ? 'optimal' : 'warning',
      advice: budgetUtilization <= 100 ? 'Manajemen budget sangat baik. Pertahankan efisiensi ini!' : 'Budget melebihi rencana. Perlunya cost control lebih ketat.',
    },
    {
      category: 'Task Completion',
      metric: `${taskCompletion.toFixed(0)}%`,
      status: taskCompletion >= 80 ? 'good' : 'warning',
      advice: taskCompletion >= 80 ? 'Task completion rate tinggi. Manajemen proyek baik!' : 'Masih ada task yang belum selesai. Prioritas pengerjaan perlu diperbaiki.',
    },
    {
      category: 'Risk Management',
      metric: `${gameState.risks.filter((r) => r.status === 'resolved').length}/${gameState.risks.length} Resolved`,
      status: 'info',
      advice: 'Identifikasi risiko di awal dan strategi mitigasi sangat penting untuk kesuksesan proyek.',
    },
    {
      category: 'Negotiations',
      metric: `${gameState.negotiations.length} Deal`,
      status: 'info',
      advice: `${gameState.negotiations.filter((n) => n.outcome === 'win-win').length > 0 ? 'Anda mencapai beberapa win-win negotiations - excellent!' : 'Tingkatkan skills negosiasi untuk hasil yang lebih optimal.'}`,
    },
  ];

  const insightsHTML = insights
    .map(
      (insight) => `
    <div class="insight-card insight-${insight.status}">
      <div class="insight-header">
        <h4>${insight.category}</h4>
        <span class="metric">${insight.metric}</span>
      </div>
      <p class="insight-text">${insight.advice}</p>
    </div>
  `
    )
    .join('');

  container.innerHTML = `
    <h2>💡 Performance Insights & Recommendations</h2>
    <div class="insights-grid">${insightsHTML}</div>
  `;
}

function renderExpertFeedback(feedback) {
  const container = byId('expert-feedback');
  if (feedback.length === 0) return;

  const feedbackHTML = feedback.map((item) => `<div class="feedback-item">${item}</div>`).join('');
  container.innerHTML = `
    <h2>👨‍🏫 Expert Feedback</h2>
    <div class="feedback-list">${feedbackHTML}</div>
  `;
}

function renderKeyAchievements() {
  const container = byId('key-achievements');
  const achievements = [];

  if (gameState.eventBrief) achievements.push('✓ Accepted client brief & understood project scope');
  if (gameState.tasks.length > 0) achievements.push(`✓ Created detailed project planning with ${gameState.tasks.length} tasks`);
  if (gameState.budgetItems.length > 0) achievements.push(`✓ Managed budget across ${gameState.budgetItems.length} items`);
  if (gameState.venueLayout) achievements.push(`✓ Designed venue layout with ${gameState.venueLayout.layout.length} elements`);
  if (gameState.negotiations.length > 0) achievements.push(`✓ Conducted ${gameState.negotiations.length} negotiations`);
  if (gameState.risks.length > 0) achievements.push(`✓ Identified & managed ${gameState.risks.length} risk factors`);
  if (calculateILOScores().overallScore >= 70) achievements.push('✓ Achieved overall learning outcomes mastery');

  const achievementsHTML = achievements.map((item) => `<li>${item}</li>`).join('');
  container.innerHTML = `
    <h2>🏆 Key Achievements</h2>
    <ul class="achievements-list">${achievementsHTML}</ul>
  `;
}

function renderReviewActions() {
  const container = byId('review-actions');
  container.innerHTML = `
    <button class="btn-primary" id="btn-new-game-2">🎮 Main Game Baru</button>
    <button class="btn-secondary" onclick="window.print()">📄 Print Report</button>
  `;

  byId('btn-new-game-2').addEventListener('click', () => {
    resetGameState();
    renderSidebar();
    window.location.hash = '#/';
    renderDashboard();
  });
}
