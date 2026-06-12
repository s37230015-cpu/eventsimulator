// Resource Management - Budget & Vendor

function renderResourceManagement() {
  const app = byId('app');

  app.innerHTML = `
    <div class="resource-management-container">
      <div class="resource-header">
        <div>
          <h1>💰 Resource Management</h1>
          <p>Fase Planning: Alokasi Budget & Pemilihan Vendor</p>
        </div>
        <button class="btn-primary" onclick="window.location.hash = '#/venue'">Lanjut ke Venue Layout →</button>
      </div>

      <div class="budget-overview" id="budget-overview"></div>
      <div class="budget-bar" id="budget-bar"></div>

      <div class="vendor-selection" id="vendor-selection"></div>

      <div class="budget-items-section">
        <div class="section-header">
          <h2>📋 Budget Items</h2>
          <button class="btn-secondary" id="toggle-budget-form">➕ Custom Item</button>
        </div>
        <form id="budget-form" class="budget-form hidden"></form>
        <table id="budget-table"></table>
      </div>
    </div>
  `;

  updateBudgetOverview();
  renderVendorSelection();
  renderBudgetTable();

  byId('toggle-budget-form').addEventListener('click', () => {
    const form = byId('budget-form');
    form.classList.toggle('hidden');
    if (!form.classList.contains('hidden')) {
      renderBudgetForm();
    }
  });
}

function updateBudgetOverview() {
  const totalBudget = gameState.eventBrief?.budget || 0;
  const totalSpent = gameState.budgetItems.reduce((sum, item) => sum + (item.actualAmount || 0), 0);
  const remaining = totalBudget - totalSpent;
  const budgetUtilization = Math.round((totalSpent / totalBudget) * 100);

  const overview = byId('budget-overview');
  overview.innerHTML = `
    <div class="budget-card total">
      <h3>Total Budget</h3>
      <p class="amount">${formatCurrency(totalBudget)}</p>
    </div>
    <div class="budget-card spent">
      <h3>Sudah Digunakan</h3>
      <p class="amount">${formatCurrency(totalSpent)}</p>
      <p class="percentage">${budgetUtilization}%</p>
    </div>
    <div class="budget-card remaining ${remaining < 0 ? 'warning' : ''}">
      <h3>Sisa Budget</h3>
      <p class="amount">${formatCurrency(Math.max(0, remaining))}</p>
      <p class="status">${remaining >= 0 ? 'Aman' : 'OVERBUDGET'}</p>
    </div>
  `;

  const bar = byId('budget-bar');
  bar.innerHTML = `
    <div class="bar-fill" style="width: ${Math.min(100, budgetUtilization)}%">
      ${budgetUtilization > 0 ? `${budgetUtilization}%` : ''}
    </div>
  `;
}

function renderVendorSelection() {
  const vendorSuggestions = {
    venue: [
      { name: 'Jakarta Convention Center', price: 150000000 },
      { name: 'Hotel Grand Indonesia', price: 120000000 },
      { name: 'Istora Senayan', price: 100000000 },
    ],
    catering: [
      { name: 'Catering Mewah', price: 250000 },
      { name: 'PT Boga Husada', price: 200000 },
      { name: 'Catering Standar', price: 150000 },
    ],
    marketing: [
      { name: 'Digital Marketing Agency', price: 50000000 },
      { name: 'PR Consultant', price: 30000000 },
      { name: 'Social Media Expert', price: 20000000 },
    ],
    av: [
      { name: 'PT Sound & Vision', price: 60000000 },
      { name: 'AV Rental Pro', price: 45000000 },
      { name: 'Tech Equipment Services', price: 30000000 },
    ],
    logistics: [
      { name: 'Cargo Express', price: 25000000 },
      { name: 'Transportation Services', price: 35000000 },
      { name: 'Logistics Partner', price: 20000000 },
    ],
  };

  const icons = {
    venue: '📍',
    catering: '🍽️',
    marketing: '📢',
    av: '🎤',
    logistics: '🚚',
  };

  const container = byId('vendor-selection');
  container.innerHTML = '<h2>🏢 Pilih Vendor</h2><div class="vendor-categories" id="vendor-categories"></div>';

  const categoriesDiv = byId('vendor-categories');
  Object.keys(vendorSuggestions).forEach((category) => {
    const categoryDiv = createElement('div', 'vendor-category');
    categoryDiv.innerHTML = `
      <h3>${icons[category]} ${category.charAt(0).toUpperCase() + category.slice(1)}</h3>
      <div class="vendor-list" id="vendor-list-${category}"></div>
    `;
    categoriesDiv.appendChild(categoryDiv);

    const vendorList = byId(`vendor-list-${category}`);
    vendorSuggestions[category].forEach((vendor) => {
      const card = createElement('div', 'vendor-card');
      card.innerHTML = `
        <p class="vendor-name">${vendor.name}</p>
        <p class="vendor-price">${formatCurrency(vendor.price)}</p>
        <button class="btn-small">Pilih</button>
      `;
      card.querySelector('.btn-small').addEventListener('click', () => {
        addBudgetItem({
          category,
          description: vendor.name,
          plannedAmount: vendor.price,
          actualAmount: vendor.price,
          vendor: vendor.name,
          status: 'pending',
        });
        updateBudgetOverview();
        renderBudgetTable();
        showToast(`✓ ${vendor.name} ditambahkan`, 'success');
      });
      vendorList.appendChild(card);
    });
  });
}

function renderBudgetForm() {
  const form = byId('budget-form');
  const categories = ['venue', 'catering', 'marketing', 'av', 'logistics'];
  form.innerHTML = `
    <div class="form-row">
      <div class="form-group">
        <label>Kategori</label>
        <select id="budget-category" required>
          ${categories.map((cat) => `<option value="${cat}">${cat.charAt(0).toUpperCase() + cat.slice(1)}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label>Deskripsi</label>
        <input type="text" id="budget-description" required>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Jumlah Rencana (Rp)</label>
        <input type="number" id="budget-planned" required>
      </div>
      <div class="form-group">
        <label>Vendor (Opsional)</label>
        <input type="text" id="budget-vendor">
      </div>
    </div>
    <button type="button" class="btn-primary" id="submit-budget">Tambah Item</button>
  `;

  byId('submit-budget').addEventListener('click', () => {
    addBudgetItem({
      category: byId('budget-category').value,
      description: byId('budget-description').value,
      plannedAmount: parseInt(byId('budget-planned').value),
      actualAmount: parseInt(byId('budget-planned').value),
      vendor: byId('budget-vendor').value,
      status: 'pending',
    });
    byId('budget-form').classList.add('hidden');
    updateBudgetOverview();
    renderBudgetTable();
    showToast('✓ Budget item ditambahkan', 'success');
  });
}

function renderBudgetTable() {
  const table = byId('budget-table');
  const headers = ['Kategori', 'Deskripsi', 'Rencana', 'Aktual', 'Vendor', 'Status', 'Aksi'];
  const rows = gameState.budgetItems.map((item) => [
    item.category,
    item.description,
    formatCurrency(item.plannedAmount),
    item.status === 'pending' ? `<input type="number" value="${item.actualAmount}" data-id="${item.id}" class="budget-actual">` : formatCurrency(item.actualAmount),
    item.vendor || '-',
    `<select class="budget-status" data-id="${item.id}">
      <option value="pending" ${item.status === 'pending' ? 'selected' : ''}>Pending</option>
      <option value="approved" ${item.status === 'approved' ? 'selected' : ''}>Approved</option>
      <option value="paid" ${item.status === 'paid' ? 'selected' : ''}>Paid</option>
    </select>`,
    item.status === 'pending' ? `<button class="btn-negotiate" data-id="${item.id}">Negosiasi</button>` : '-',
  ]);

  const tableEl = createTable(headers, rows);
  table.innerHTML = '';
  table.appendChild(tableEl);

  document.querySelectorAll('.budget-status').forEach((select) => {
    select.addEventListener('change', (e) => {
      updateBudgetItem(e.target.dataset.id, { status: e.target.value });
      renderBudgetTable();
    });
  });

  document.querySelectorAll('.budget-actual').forEach((input) => {
    input.addEventListener('change', (e) => {
      updateBudgetItem(e.target.dataset.id, { actualAmount: parseInt(e.target.value) });
      updateBudgetOverview();
    });
  });

  document.querySelectorAll('.btn-negotiate').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const item = gameState.budgetItems.find((b) => b.id === e.target.dataset.id);
      const discount = Math.random() * 0.2 + 0.05;
      const newAmount = Math.round(item.plannedAmount * (1 - discount));
      updateBudgetItem(item.id, { actualAmount: newAmount, status: 'approved' });
      addNegotiation({
        stakeholder: item.vendor || item.description,
        type: 'vendor',
        initialDemand: item.plannedAmount,
        finalAgreement: newAmount,
        negotiationPoints: [`Diskon ${Math.round(discount * 100)}%`],
        outcome: 'win-win',
      });
      updateBudgetOverview();
      renderBudgetTable();
      showToast(`✓ Negosiasi sukses! Diskon ${Math.round(discount * 100)}%`, 'success');
    });
  });
}
