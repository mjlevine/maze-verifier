class maze {
  constructor() {
    this.cells = new Map();
    this.rows = 0;
    this.cols = 0;
  }

  _addCell(name, row, col) {
    this.cells.set(name, { connectedCells: [], row, col })
  }

  _addCellsToLastRow(cells) {
    let col = 0;
    
    for (const cell of cells) {
      this._addCell(cell, this.rows, ++col);
    }
    
    this.cols = col++;
  }
  
  _addConnections(connections) {
    for (let connection of connections) {
      this.cells.get(connection[0]).connectedCells.push(connection[1]);
      this.cells.get(connection[1]).connectedCells.push(connection[0]);      
    }
  }
  
  addRow(cells, connectedCells) {
    this.rows++;
    this._addCellsToLastRow(cells);
    this._addConnections(connectedCells);
  }
  
  print() {    
    for (let i of this.cells.keys()) {
      const cellInfo = this.cells.get(i);
      
      let conc = `row ${cellInfo.row}, col ${cellInfo.col}, `;
      for (let j of cellInfo.connectedCells) {
        conc += j + " ";
      }
      
      console.log(i + " -> " + conc);
    }
  }
  
  generateWellFormed() {
    // row 1
    this.addRow(
      [ 'a', 'b', 'c', 'd' ],
      [ ['a', 'b'], ['b', 'c'], ['c', 'd'] ]
    );
    this.addRow(
      [ 'e', 'f', 'g', 'h' ],
      [ ['e', 'f'], ['f', 'g'], ['g', 'h'], ['h', 'd'] ]
    );
    this.addRow(
      [ 'i', 'j', 'k', 'l' ],
      [ ['i', 'e'], ['j', 'k'], ['k', 'l'], ['l', 'h'] ]
    );
    
    this._addCell('entrance', 0, 2);
    this._addCell('exit', 4, 1);
    this._addConnections([ ['entrance', 'b'] ]);
    this._addConnections([ ['exit', 'i'] ]);
  }   

  generateNotWellFormed() {
    this.generateWellFormed();
    this._addConnections([ ['j', 'i'] ]);
  }

  _isExteriorColumn(column) {
    console.log(`${column} + ${this.cols}`);
    return column === 0 || column === this.cols + 1;
  }

  _isExteriorRow(row) {
    return row === 0 || row === this.rows + 1;
  }
  
  _openingIsOnExterior(opening) {
    return (this._isExteriorRow(opening.row) || this._isExteriorColumn(opening.col));
  }

  _openingsAreValid(openings) {
    for (let opening of openings) {
      if (!opening) {
        return false;  // entrance or exit missing
      }

      return this._openingIsOnExterior(opening);
    }
  }

  _pathsFromEntranceToExit() {
    let paths = 0;
    const exit = 'exit';

    const traverseToExit = (cell, visited) => {
      visited[cell] = true;

      let adjacentCells = this.cells.get(cell)
        .connectedCells
        .filter(c => !(visited[c]));

      if (adjacentCells.length === 0) {
        return;
      }

      if (adjacentCells.length === 1 && adjacentCells[0] === exit) {
        paths++;
      }

      for (let childCell of adjacentCells) {
        console.log(childCell);
        traverseToExit(childCell, visited);
      }
    }

    traverseToExit('entrance', {}, exit);

    return paths;
  }

  isWellFormed() {
    // establish valid entrance and exit
    let entrance, exit;
    this.cells.forEach((cellInfo, cell) => {
      if (cell === 'entrance') {
        if (entrance) { 
          return false;   // > 1 entrances
        }

        entrance = cellInfo;
      }

      if (cell === 'exit') {
        if (exit) {
          return false; // > 1 exit
        }

        exit = cellInfo;
      }
    });

    if (!this._openingsAreValid([entrance, exit])) {
      return false;
    }

    // paths from entrance to exit
    const paths = this._pathsFromEntranceToExit();
    console.log(`paths = ${paths}`);
    return paths === 1;
  }
}

console.log('\n----- The Good Maze ------ ');
let goodMaze = new maze();
goodMaze.generateWellFormed();
goodMaze.print();
console.log(`Maze is well formed?  ${goodMaze.isWellFormed()}`);

console.log('\n----- The Bad Maze ------ ');
let badMaze = new maze();
badMaze.generateNotWellFormed();
badMaze.print();
console.log(`Maze is well formed?  ${badMaze.isWellFormed()}`);
