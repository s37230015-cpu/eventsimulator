// Global Game State
const gameState = {
  currentPhase: 'initiation', // initiation, planning, execution, monitoring, closing
  eventBrief: null,
  tasks: [],
  budgetItems: [],
  venueLayout: null,
  negotiations: [],
  risks: [],
  executionLog: [],
  monitoring: {
    budgetUsed: 0,
    qualityScore: 100,
    timelineAdherence: 100,
    clientSatisfaction: 100,
  },
};

// Save state to localStorage
function saveGameState() {
  localStorage.setItem('planit_game_state', JSON.stringify(gameState));
}

// Load state from localStorage
function loadGameState() {
  const saved = localStorage.getItem('planit_game_state');
  if (saved) {
    Object.assign(gameState, JSON.parse(saved));
  }
}

// Reset game state
function resetGameState() {
  gameState.currentPhase = 'initiation';
  gameState.eventBrief = null;
  gameState.tasks = [];
  gameState.budgetItems = [];
  gameState.venueLayout = null;
  gameState.negotiations = [];
  gameState.risks = [];
  gameState.executionLog = [];
  gameState.monitoring = {
    budgetUsed: 0,
    qualityScore: 100,
    timelineAdherence: 100,
    clientSatisfaction: 100,
  };
  saveGameState();
}

// Update phase
function updatePhase(phase) {
  gameState.currentPhase = phase;
  saveGameState();
}

// Add task
function addTask(task) {
  task.id = Date.now().toString();
  gameState.tasks.push(task);
  saveGameState();
}

// Update task
function updateTask(taskId, updates) {
  const task = gameState.tasks.find((t) => t.id === taskId);
  if (task) {
    Object.assign(task, updates);
    saveGameState();
  }
}

// Add budget item
function addBudgetItem(item) {
  item.id = Date.now().toString();
  gameState.budgetItems.push(item);
  saveGameState();
}

// Update budget item
function updateBudgetItem(itemId, updates) {
  const item = gameState.budgetItems.find((b) => b.id === itemId);
  if (item) {
    Object.assign(item, updates);
    saveGameState();
  }
}

// Add negotiation
function addNegotiation(negotiation) {
  negotiation.id = Date.now().toString();
  gameState.negotiations.push(negotiation);
  saveGameState();
}

// Add execution log
function addExecutionLog(event, severity = 'info') {
  gameState.executionLog.push({
    timestamp: new Date().toLocaleTimeString('id-ID'),
    event,
    severity,
  });
  saveGameState();
}

// Update monitoring
function updateMonitoring(updates) {
  Object.assign(gameState.monitoring, updates);
  saveGameState();
}
