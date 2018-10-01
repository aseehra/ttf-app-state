'use strict';

// State modification functions
const store = {
  Item: {
    nextID: (function() {
      let id = 0;
      return () => id++;
    })(),

    init() {
      this.id = this.nextID();
      return this;
    }
  },

  length: 3,
  symbols: ['X', 'O'],

  init() {
    this.data = Array.from({ length: this.length * this.length }, () =>
      Object.create(this.Item).init()
    );

    this.locked = false;
    this.symbolIndex = 0;
    this.rows = this.getRows();
    this.columns = this.getColumns();
    this.diagonals = this.getDiagonals();

    return this;
  },

  flipSymbol() {
    this.symbolIndex = ~this.symbolIndex & 0x1;
  },

  nextSymbol() {
    const symbol = this.symbols[this.symbolIndex];
    this.flipSymbol();
    return symbol;
  },

  addSymbolToID(id) {
    const cell = this.cellFromID(id);
    if (cell && !cell.value) {
      cell.value = this.nextSymbol();
    }
  },

  getRows() {
    return Array.from({ length: this.length }, (undef, index) => {
      const start = index * this.length;
      return this.data.slice(start, start + this.length);
    });
  },

  getColumns() {
    return Array.from({ length: this.length }, (undef, index) => {
      const column = [];
      for (let i = index; i < this.data.length; i += this.length) {
        column.push(this.data[i]);
      }
      return column;
    });
  },

  getDiagonals() {
    const diagonals = [[], []];
    for (let i = 0; i < this.data.length; i += this.length + 1) {
      diagonals[0].push(this.data[i]);
    }
    for (let i = this.length - 1; i < this.data.length - 1; i += this.length - 1) {
      diagonals[1].push(this.data[i]);
    }

    return diagonals;
  },

  cellFromID(id) {
    return this.data.find(cell => cell.id === id);
  },

  lock() {
    this.locked = true;
  }
};

const game = {
  getGameWinner() {
    const lines = [...store.rows, ...store.columns, ...store.diagonals];
    return this.getWinner(lines);
  },

  getWinner(lines) {
    return lines
      .map(line => line.reduce(this.getWinningSymbol, line[0].value))
      .find(v => v);
  },

  getWinningSymbol(firstSymbol, cell) {
    return firstSymbol === cell.value && firstSymbol;
  }
};

// Render functions
const render = (function() {
  function render() {
    $('.board').html(
      store.rows
        .map(renderRow)
        .join('')
    );
  }

  function renderRow(row) {
    const cells = row.map(renderCell).join('');
    return `
      <div class="row">
        ${cells}
      </div>
    `;
  }

  function renderCell(cell) {
    return `
      <div class="cell" id=${cell.id}>
        <p>${cell.value || '&nbsp;'}</p>
      </div>
     `;
  }

  return render;
})();

// Event Listeners
const controller = (function() {
  function bindEventListeners() {
    $('.board').on('click', '.cell', onCellClick);

    $('#new-game').click(onResetClick);
  }

  function onCellClick(event) {
    const id = idFromElement(event.currentTarget);
    if (!store.locked) {
      store.addSymbolToID(id);
      render();
    }

    const winner = game.getGameWinner();
    if (winner) {
      store.lock();
      setTimeout(() => {
        alert(`"${winner}" won!`);
      });
    }
  }

  function onResetClick() {
    store.init();
    render();
  }

  function idFromElement(element) {
    return parseInt($(element).attr('id'));
  }

  return { bindEventListeners };
})();

$(() => {
  store.init();
  render();
  controller.bindEventListeners();
});
