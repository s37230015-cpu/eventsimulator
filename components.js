// Reusable Components

function createButton(text, onClick, className = 'btn-primary', disabled = false) {
  const btn = createElement('button', className, text);
  if (onClick) btn.addEventListener('click', onClick);
  if (disabled) btn.disabled = true;
  return btn;
}

function createFormGroup(label, type = 'text', name = '', placeholder = '') {
  const group = createElement('div', 'form-group');
  const labelEl = createElement('label', '', label);
  let input;

  if (type === 'select') {
    input = createElement('select');
  } else if (type === 'textarea') {
    input = createElement('textarea');
    input.rows = 3;
  } else {
    input = createElement('input');
    input.type = type;
  }

  input.name = name;
  input.placeholder = placeholder;

  group.appendChild(labelEl);
  group.appendChild(input);
  return { group, input };
}

function createCard(title, content, className = '') {
  const card = createElement('div', `card ${className}`);
  if (title) {
    const titleEl = createElement('h3', '', title);
    card.appendChild(titleEl);
  }
  if (typeof content === 'string') {
    card.innerHTML += content;
  } else if (content instanceof HTMLElement) {
    card.appendChild(content);
  }
  return card;
}

function createGrid(items, columns = 3) {
  const grid = createElement('div', `grid grid-${columns}`);
  items.forEach((item) => {
    if (typeof item === 'string') {
      const el = createElement('div');
      el.innerHTML = item;
      grid.appendChild(el);
    } else {
      grid.appendChild(item);
    }
  });
  return grid;
}

function createTable(headers, rows) {
  const table = createElement('table');
  const thead = createElement('thead');
  const headerRow = createElement('tr');

  headers.forEach((header) => {
    const th = createElement('th', '', header);
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = createElement('tbody');
  rows.forEach((row) => {
    const tr = createElement('tr');
    row.forEach((cell) => {
      const td = createElement('td');
      if (typeof cell === 'string') {
        td.innerHTML = cell;
      } else {
        td.appendChild(cell);
      }
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  return table;
}
