'use strict';

// State modification functions
const Store = {
  Item: {
    nextID: (function () {
      let id = 0;
      return () => id++;
    })(),

    init() {
      this.id = this.nextID();
      return this;
    }
  },

  init(numRows, numCols) {
    this.table = Array.from({length: numRows}, () => {
      return Array.from({length: numCols}, () => {
        return Object.create(this.Item).init();
      });
    });

    return this;
  }
};

// Render functions
const render = (function () {
}());

// Event Listeners
$(() => {
  const store = Object.create(Store).init(3, 3);
});
