// Planning Board - Kanban

function renderPlanningBoard() {
  const app = byId('app');

  const suggestedTasks = [
    {
      title: 'Pilih & Booking Venue',
      description: 'Cek availability dan harga venue',
      category: 'venue',
      priority: 'high',
      estimatedHours: 12,
    },
    {
      title: 'Hubungi Vendor Catering',
      description: 'Negosiasi menu dan harga',
      category: 'catering',
      priority: 'high',
      estimatedHours: 8,
    },
    {
      title: 'Rencana Marketing Campaign',
      description: 'Strategi promosi event',
      category: 'marketing',
      priority: 'medium',
      estimatedHours: 16,
    },
    {
      title: 'Setup AV & Sound System',
      description: 'Tentukan kebutuhan teknis',
      category: 'av',
      priority: 'high',
      estimatedHours: 10,
    },
    {
      title: 'Atur Logistik Transportasi',
      description: 'Transport peserta & barang',
      category: 'logistics',
      priority: 'medium',
      estimatedHours: 12,
    },
  ];

  app.innerHTML = `
    <div class="planning-board-container">
      <div class="planning-header">
        <div>
          <h1>📊 Planning Board</h1>
          <p>Fase Planning: Strategi & Timeline Pekerjaan</p>
        </div>
        <button class="btn-primary" onclick="window.location.hash = '#/resources'">Lanjut ke Resource Management →</button>
      </div>

      <div class="suggested-tasks">
        <h3>💡 Recommended Tasks</h3>
        <div class="suggested-grid" id="suggested-grid"></div>
      </div>

      <div class="custom-task-section">
        <button class="btn-secondary" id="toggle-form">➕ Tambah Custom Task</button>
        <form id="task-form" class="task-form hidden"></form>
      </div>

      <div class="kanban-board" id="kanban-board"></div>

      <div class="board-stats" id="board-stats"></div>
    </div>
  `;

  const suggestedGrid = byId('suggested-grid');
  suggestedTasks.forEach((task) => {
    const card = createElement('div', 'suggested-card');
    card.innerHTML = `
      <p class="suggested-title">${task.title}</p>
      <p class="suggested-desc">${task.description}</p>
      <button class="btn-small">+ Tambah</button>
    `;
    card.querySelector('.btn-small').addEventListener('click', () => addTaskToBoard(task));
    suggestedGrid.appendChild(card);
  });

  byId('toggle-form').addEventListener('click', () => {
    const form = byId('task-form');
    form.classList.toggle('hidden');
    if (!form.classList.contains('hidden')) {
      renderTaskForm(form);
    }
  });

  renderKanbanBoard();
  updateBoardStats();
}

function renderTaskForm(container) {
  container.innerHTML = `
    <div class="form-row">
      <div class="form-group">
        <label>Judul Task *</label>
        <input type="text" id="task-title" required>
      </div>
      <div class="form-group">
        <label>Category</label>
        <select id="task-category">
          <option value="venue">Venue</option>
          <option value="catering">Catering</option>
          <option value="marketing">Marketing</option>
          <option value="av">AV & Equipment</option>
          <option value="logistics">Logistics</option>
          <option value="other">Other</option>
        </select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group full-width">
        <label>Deskripsi</label>
        <textarea id="task-desc"></textarea>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Due Date</label>
        <input type="date" id="task-due-date">
      </div>
      <div class="form-group">
        <label>Priority</label>
        <select id="task-priority">
          <option value="low">Low</option>
          <option value="medium" selected>Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div class="form-group">
        <label>Estimated Hours</label>
        <input type="number" id="task-hours" value="8">
      </div>
    </div>
    <button type="button" class="btn-primary" id="submit-task">Tambah Task</button>
  `;

  byId('submit-task').addEventListener('click', () => {
    const task = {
      title: byId('task-title').value,
      description: byId('task-desc').value,
      status: 'todo',
      dueDate: byId('task-due-date').value,
      assignee: 'Unassigned',
      priority: byId('task-priority').value,
      category: byId('task-category').value,
      estimatedHours: parseInt(byId('task-hours').value),
      completionPercentage: 0,
    };
    addTaskToBoard(task);
    byId('task-form').classList.add('hidden');
  });
}

function addTaskToBoard(task) {
  addTask(task);
  renderKanbanBoard();
  updateBoardStats();
  showToast('✓ Task ditambahkan', 'success');
}

function renderKanbanBoard() {
  const board = byId('kanban-board');
  const todoTasks = gameState.tasks.filter((t) => t.status === 'todo');
  const inProgressTasks = gameState.tasks.filter((t) => t.status === 'in-progress');
  const doneTasks = gameState.tasks.filter((t) => t.status === 'done');

  board.innerHTML = `
    <div class="kanban-column" id="todo-column">
      <h3>📝 To Do (${todoTasks.length})</h3>
      <div class="tasks-container"></div>
    </div>
    <div class="kanban-column" id="progress-column">
      <h3>🔄 In Progress (${inProgressTasks.length})</h3>
      <div class="tasks-container"></div>
    </div>
    <div class="kanban-column" id="done-column">
      <h3>✅ Done (${doneTasks.length})</h3>
      <div class="tasks-container"></div>
    </div>
  `;

  const renderTaskCard = (task, status) => {
    const card = createElement('div', `task-card priority-${task.priority}`);
    card.innerHTML = `
      <div class="task-header">
        <h4>${task.title}</h4>
        <span class="priority-badge priority-${task.priority}">${task.priority}</span>
      </div>
      <p class="task-desc">${task.description}</p>
      <div class="task-meta">
        <span class="meta-item">📂 ${task.category}</span>
        <span class="meta-item">⏱️ ${task.estimatedHours}h</span>
      </div>
    `;

    if (status !== 'done') {
      const completionBar = createElement('div', 'completion-bar');
      completionBar.innerHTML = `
        <input type="range" class="completion-slider" min="0" max="100" value="${task.completionPercentage}">
        <span class="completion-percent">${task.completionPercentage}%</span>
      `;
      card.appendChild(completionBar);

      completionBar.querySelector('.completion-slider').addEventListener('input', (e) => {
        updateTask(task.id, { completionPercentage: parseInt(e.target.value) });
        renderKanbanBoard();
      });
    }

    const actionsDiv = createElement('div', 'task-actions');
    if (status === 'todo') {
      const startBtn = createButton('Start', () => {
        updateTask(task.id, { status: 'in-progress' });
        renderKanbanBoard();
      }, 'btn-action');
      actionsDiv.appendChild(startBtn);
    } else if (status === 'in-progress') {
      const completeBtn = createButton('Complete', () => {
        updateTask(task.id, { status: 'done', completionPercentage: 100 });
        renderKanbanBoard();
      }, 'btn-action');
      actionsDiv.appendChild(completeBtn);
    }
    card.appendChild(actionsDiv);

    return card;
  };

  byId('todo-column').querySelector('.tasks-container').append(...todoTasks.map((t) => renderTaskCard(t, 'todo')));
  byId('progress-column').querySelector('.tasks-container').append(...inProgressTasks.map((t) => renderTaskCard(t, 'in-progress')));
  byId('done-column').querySelector('.tasks-container').append(...doneTasks.map((t) => renderTaskCard(t, 'done')));
}

function updateBoardStats() {
  const stats = byId('board-stats');
  const taskCompletion = calculateTaskCompletion();
  const totalHours = gameState.tasks.reduce((sum, t) => sum + t.estimatedHours, 0);

  stats.innerHTML = `
    <div class="stat">
      <span class="stat-label">Total Tasks:</span>
      <span class="stat-value">${gameState.tasks.length}</span>
    </div>
    <div class="stat">
      <span class="stat-label">Completion:</span>
      <span class="stat-value">${formatPercentage(taskCompletion)}</span>
    </div>
    <div class="stat">
      <span class="stat-label">Estimated Hours:</span>
      <span class="stat-value">${totalHours}h</span>
    </div>
  `;
}
