// Calculation Functions

function calculateBudgetUtilization() {
  if (!gameState.eventBrief) return 0;
  const totalSpent = gameState.budgetItems.reduce((sum, item) => sum + (item.actualAmount || 0), 0);
  return (totalSpent / gameState.eventBrief.budget) * 100;
}

function calculateTaskCompletion() {
  if (gameState.tasks.length === 0) return 0;
  const completedTasks = gameState.tasks.filter((t) => t.status === 'done').length;
  return (completedTasks / gameState.tasks.length) * 100;
}

function calculateQualityScore() {
  let score = 100;

  const budgetUtilization = calculateBudgetUtilization();
  if (budgetUtilization > 100) {
    score -= (budgetUtilization - 100) * 0.5;
  }

  const taskCompletion = calculateTaskCompletion();
  if (taskCompletion < 100) {
    score -= (100 - taskCompletion) * 0.3;
  }

  const triggeredRisks = gameState.risks.filter((r) => r.status === 'triggered').length;
  score -= triggeredRisks * 10;

  return Math.max(0, Math.min(100, score));
}

function calculateILOScores() {
  const taskCompletion = calculateTaskCompletion();
  const budgetUtilization = calculateBudgetUtilization();
  const qualityScore = calculateQualityScore();

  const ilo1 = (taskCompletion * 0.7 + (gameState.currentPhase === 'closing' ? 100 : 0) * 0.3) / 100;

  const budgetEfficiency = budgetUtilization > 100 ? 0 : 100 - budgetUtilization * 0.5;
  const ilo2 = budgetEfficiency / 100;

  const venueDesignScore = gameState.venueLayout ? 80 : 0;
  const riskMitigation = gameState.risks.filter((r) => r.status === 'resolved').length * 10;
  const ilo3 = Math.min(100, venueDesignScore + riskMitigation) / 100;

  const winWinNegotiations = gameState.negotiations.filter((n) => n.outcome === 'win-win').length;
  const totalNegotiations = gameState.negotiations.length || 1;
  const ilo4 = (winWinNegotiations / totalNegotiations + gameState.monitoring.clientSatisfaction / 100) / 2;

  const overallScore = (ilo1 + ilo2 + ilo3 + ilo4) / 4;

  return {
    ilo1_execution: Math.round(ilo1 * 100),
    ilo2_budgetManagement: Math.round(ilo2 * 100),
    ilo3_venueDesign: Math.round(ilo3 * 100),
    ilo4_pitching: Math.round(ilo4 * 100),
    overallScore: Math.round(overallScore * 100),
  };
}

function generateFeedback() {
  const feedback = [];
  const budgetUtilization = calculateBudgetUtilization();
  const taskCompletion = calculateTaskCompletion();

  if (budgetUtilization > 100) {
    feedback.push('⚠️ Budget melebihi rencana. Perlu strategi cost-saving lebih baik.');
  } else if (budgetUtilization < 50) {
    feedback.push('✓ Budget sangat efisien. Pertahankan kontrol biaya ini!');
  }

  if (taskCompletion < 70) {
    feedback.push('⚠️ Masih banyak task yang belum selesai. Tingkatkan produktivitas tim.');
  } else if (taskCompletion === 100) {
    feedback.push('✓ Semua task selesai! Manajemen proyek sangat baik.');
  }

  if (gameState.monitoring.clientSatisfaction < 70) {
    feedback.push('⚠️ Kepuasan klien rendah. Tingkatkan komunikasi dan delivery.');
  }

  if (gameState.risks.filter((r) => r.status === 'triggered').length > 2) {
    feedback.push('⚠️ Terlalu banyak risiko yang terjadi. Perbaiki strategi mitigasi risiko.');
  }

  if (gameState.negotiations.length === 0 && gameState.budgetItems.length > 0) {
    feedback.push('💡 Coba negosiasi dengan vendor untuk mendapatkan harga terbaik.');
  }

  return feedback;
}

function getGrade(score) {
  if (score >= 85) return { grade: 'A', label: 'Excellent', color: '#4caf50' };
  if (score >= 70) return { grade: 'B', label: 'Good', color: '#2196f3' };
  if (score >= 60) return { grade: 'C', label: 'Satisfactory', color: '#ff9800' };
  return { grade: 'D', label: 'Needs Improvement', color: '#f44336' };
}
