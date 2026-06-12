// Venue Layout Planner

function renderVenueLayout() {
  const app = byId('app');

  app.innerHTML = `
    <div class="venue-layout-container">
      <div class="layout-header">
        <div>
          <h1>🎨 Venue Layout Planner</h1>
          <p>Fase Planning: Rancang Tata Letak & Alur Event</p>
        </div>
        <button class="btn-primary" onclick="window.location.hash = '#/pitch'">Simpan & Lanjut →</button>
      </div>

      <div class="layout-content">
        <div class="layout-tools" id="layout-tools"></div>
        <div class="layout-canvas" id="layout-canvas"></div>
        <div class="layout-properties" id="layout-properties"></div>
      </div>

      <div class="layout-legend" id="layout-legend"></div>
    </div>
  `;

  const elementTypes = ['stage', 'seating', 'catering', 'booth', 'entrance', 'exit'];
  const elementColors = {
    stage: '#2c5aa0',
    seating: '#5b8fde',
    catering: '#ff9800',
    booth: '#4caf50',
    entrance: '#f44336',
    exit: '#f44336',
  };

  const toolsDiv = byId('layout-tools');
  toolsDiv.innerHTML = '<h3>🔧 Elements</h3>';
  elementTypes.forEach((type) => {
    const btn = createElement('button', 'btn-element', `+ ${type.charAt(0).toUpperCase() + type.slice(1)}`);
    btn.addEventListener('click', () => addVenueElement(type, elementColors));
    toolsDiv.appendChild(btn);
  });

  renderVenueCanvas(elementColors);

  const legend = byId('layout-legend');
  legend.innerHTML = '<h3>📖 Legend</h3><div class="legend-items">' + elementTypes.map((type) => `
    <div class="legend-item">
      <div class="legend-color" style="background-color: ${elementColors[type]}"></div>
      <span>${type.charAt(0).toUpperCase() + type.slice(1)}</span>
    </div>
  `).join('') + '</div>';
}

function addVenueElement(type, colors) {
  if (!gameState.venueLayout) {
    gameState.venueLayout = {
      venueName: 'Convention Hall A',
      capacity: 500,
      layout: [],
    };
  }

  const newElement = {
    id: `${type}-${Date.now()}`,
    type,
    x: Math.random() * 300 + 50,
    y: Math.random() * 200 + 50,
    width: type === 'stage' ? 100 : 80,
    height: type === 'stage' ? 60 : 60,
    label: `${type} ${gameState.venueLayout.layout.length + 1}`,
  };

  gameState.venueLayout.layout.push(newElement);
  saveGameState();
  renderVenueCanvas(colors);
  showToast(`✓ ${type} ditambahkan`, 'success');
}

function renderVenueCanvas(colors) {
  const canvas = byId('layout-canvas');
  const layout = gameState.venueLayout;

  if (!layout) {
    canvas.innerHTML = '<p style="text-align:center;color:#999">Belum ada elemen venue. Tambahkan dari tools di sebelah kiri.</p>';
    byId('layout-properties').innerHTML = '';
    return;
  }

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '600');
  svg.setAttribute('height', '400');
  svg.setAttribute('class', 'canvas-svg');

  const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bg.setAttribute('width', '600');
  bg.setAttribute('height', '400');
  bg.setAttribute('fill', '#f5f5f5');
  bg.setAttribute('stroke', '#ccc');
  bg.setAttribute('stroke-width', '2');
  svg.appendChild(bg);

  layout.layout.forEach((element) => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'element');
    g.style.cursor = 'grab';

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', element.x);
    rect.setAttribute('y', element.y);
    rect.setAttribute('width', element.width);
    rect.setAttribute('height', element.height);
    rect.setAttribute('fill', colors[element.type]);
    rect.setAttribute('stroke', '#333');
    rect.setAttribute('stroke-width', '1');
    rect.setAttribute('opacity', '0.7');
    g.appendChild(rect);

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', element.x + element.width / 2);
    text.setAttribute('y', element.y + element.height / 2 + 5);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '10');
    text.setAttribute('fill', '#fff');
    text.setAttribute('pointer-events', 'none');
    text.textContent = element.label;
    g.appendChild(text);

    g.addEventListener('click', () => renderVenueProperties(element, colors));
    svg.appendChild(g);
  });

  canvas.innerHTML = '';
  canvas.appendChild(svg);
}

function renderVenueProperties(element, colors) {
  const propsDiv = byId('layout-properties');
  propsDiv.innerHTML = `
    <h3>⚙️ Properties</h3>
    <div class="properties-form">
      <div class="form-group">
        <label>Label</label>
        <input type="text" id="prop-label" value="${element.label}">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>X: ${Math.round(element.x)}</label>
          <input type="range" id="prop-x" min="0" max="500" value="${element.x}">
        </div>
        <div class="form-group">
          <label>Y: ${Math.round(element.y)}</label>
          <input type="range" id="prop-y" min="0" max="300" value="${element.y}">
        </div>
      </div>
      <button class="btn-danger" id="delete-element">🗑️ Delete</button>
    </div>
  `;

  byId('prop-label').addEventListener('change', (e) => {
    element.label = e.target.value;
    saveGameState();
    renderVenueCanvas(colors);
  });

  byId('prop-x').addEventListener('input', (e) => {
    element.x = parseInt(e.target.value);
    renderVenueCanvas(colors);
  });

  byId('prop-y').addEventListener('input', (e) => {
    element.y = parseInt(e.target.value);
    renderVenueCanvas(colors);
  });

  byId('delete-element').addEventListener('click', () => {
    gameState.venueLayout.layout = gameState.venueLayout.layout.filter((e) => e.id !== element.id);
    saveGameState();
    renderVenueCanvas(colors);
    propsDiv.innerHTML = '';
    showToast('✓ Element dihapus', 'success');
  });
}
