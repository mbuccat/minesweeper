import React from "react";
import { Modal } from "./Modal";
import "./normalize.css";
import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <Board />
    </div>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      difficulty: "Easy",
      rows: 9,
      columns: 9,
      numUnopened: 9 * 9,
      numMines: 10,
      flagsLeft: 10,
      hasLost: false,
      hasWon: false,
      mines: Array(9)
        .fill()
        .map(() => Array(9).fill(false)),
      cleared: Array(9)
        .fill()
        .map(() => Array(9).fill(false)),
      flagged: Array(9)
        .fill()
        .map(() => Array(9).fill(false)),
      surrounding: Array(9)
        .fill()
        .map(() => Array(9).fill(0))
    };
    this.changeDifficulty = this.changeDifficulty.bind(this);
    this.changeCleared = this.changeCleared.bind(this);
    this.changeFlagged = this.changeFlagged.bind(this);

    // place mines randomly on the board
    let minesToPlace = this.state.numMines;
    while (minesToPlace > 0) {
      let row = Math.floor(Math.random() * this.state.rows);
      let col = Math.floor(Math.random() * this.state.columns);

      if (!this.state.mines[row][col]) {
        this.state.mines[row][col] = true;
        minesToPlace--;
      }
    }

    // calculate number of surrounding mines
    for (let i = 0; i < this.state.rows; i++) {
      for (let j = 0; j < this.state.columns; j++) {
        // if the square is a mine, add one to its neighbors' counts
        if (this.state.mines[i][j]) {
          // squares at the corners
          if (i === 0 && j === 0) {
            this.state.surrounding[i][j + 1] += 1;
            this.state.surrounding[i + 1][j] += 1;
            this.state.surrounding[i + 1][j + 1] += 1;
          } else if (i === 0 && j === this.state.columns - 1) {
            this.state.surrounding[i][j - 1] += 1;
            this.state.surrounding[i + 1][j] += 1;
            this.state.surrounding[i + 1][j - 1] += 1;
          } else if (i === this.state.rows - 1 && j === 0) {
            this.state.surrounding[i][j + 1] += 1;
            this.state.surrounding[i - 1][j] += 1;
            this.state.surrounding[i - 1][j + 1] += 1;
          } else if (
            i === this.state.rows - 1 &&
            j === this.state.columns - 1
          ) {
            this.state.surrounding[i][j - 1] += 1;
            this.state.surrounding[i - 1][j] += 1;
            this.state.surrounding[i - 1][j - 1] += 1;
          }
          // squares on an edge row or column
          else if (i === 0) {
            this.state.surrounding[i][j - 1] += 1;
            this.state.surrounding[i][j + 1] += 1;
            this.state.surrounding[i + 1][j - 1] += 1;
            this.state.surrounding[i + 1][j] += 1;
            this.state.surrounding[i + 1][j + 1] += 1;
          } else if (i === this.state.rows - 1) {
            this.state.surrounding[i][j - 1] += 1;
            this.state.surrounding[i][j + 1] += 1;
            this.state.surrounding[i - 1][j - 1] += 1;
            this.state.surrounding[i - 1][j] += 1;
            this.state.surrounding[i - 1][j + 1] += 1;
          } else if (j === 0) {
            this.state.surrounding[i][j + 1] += 1;
            this.state.surrounding[i + 1][j] += 1;
            this.state.surrounding[i + 1][j + 1] += 1;
            this.state.surrounding[i - 1][j] += 1;
            this.state.surrounding[i - 1][j + 1] += 1;
          } else if (j === this.state.columns - 1) {
            this.state.surrounding[i][j - 1] += 1;
            this.state.surrounding[i + 1][j] += 1;
            this.state.surrounding[i + 1][j - 1] += 1;
            this.state.surrounding[i - 1][j] += 1;
            this.state.surrounding[i - 1][j - 1] += 1;
          } else {
            this.state.surrounding[i][j - 1] += 1;
            this.state.surrounding[i][j + 1] += 1;
            this.state.surrounding[i + 1][j] += 1;
            this.state.surrounding[i + 1][j + 1] += 1;
            this.state.surrounding[i + 1][j - 1] += 1;
            this.state.surrounding[i - 1][j] += 1;
            this.state.surrounding[i - 1][j + 1] += 1;
            this.state.surrounding[i - 1][j - 1] += 1;
          }
        }
      }
    }
  }

  // event handler, will be passed to Selector component
  changeDifficulty(newDifficulty) {
    let newRows;
    let newColumns;
    let newFlagsLeft;
    let newNumUnopened;
    let newNumMines;

    switch (newDifficulty) {
      case "Easy":
        newRows = 9;
        newColumns = 9;
        newNumUnopened = 9 * 9;
        newNumMines = 10;
        newFlagsLeft = 10;
        break;
      case "Medium":
        newRows = 16;
        newColumns = 16;
        newNumUnopened = 16 * 16;
        newNumMines = 40;
        newFlagsLeft = 40;
        break;
      case "Hard":
        newRows = 16;
        newColumns = 30;
        newNumUnopened = 16 * 30;
        newNumMines = 99;
        newFlagsLeft = 99;
        break;
      default:
        newRows = 9;
        newColumns = 9;
        newNumUnopened = 9 * 9;
        newNumMines = 10;
        newFlagsLeft = 10;
        break;
    }

    // new array for randomly placed mines
    let newMines = Array(newRows)
      .fill()
      .map(() => Array(newColumns).fill(false));
    let minesToPlace = newNumMines;
    while (minesToPlace > 0) {
      let row = Math.floor(Math.random() * newRows);
      let col = Math.floor(Math.random() * newColumns);

      if (!newMines[row][col]) {
        newMines[row][col] = true;
        minesToPlace--;
      }
    }

    // new array for count of surrounding mines
    let newSurrounding = Array(newRows)
      .fill()
      .map(() => Array(newColumns).fill(0));
    for (let i = 0; i < newRows; i++) {
      for (let j = 0; j < newColumns; j++) {
        // if the square is a mine, add one to its neighbors' counts
        if (newMines[i][j]) {
          // squares at the corners
          if (i === 0 && j === 0) {
            newSurrounding[i][j + 1] += 1;
            newSurrounding[i + 1][j] += 1;
            newSurrounding[i + 1][j + 1] += 1;
          } else if (i === 0 && j === newColumns - 1) {
            newSurrounding[i][j - 1] += 1;
            newSurrounding[i + 1][j] += 1;
            newSurrounding[i + 1][j - 1] += 1;
          } else if (i === newRows - 1 && j === 0) {
            newSurrounding[i][j + 1] += 1;
            newSurrounding[i - 1][j] += 1;
            newSurrounding[i - 1][j + 1] += 1;
          } else if (i === newRows - 1 && j === newColumns - 1) {
            newSurrounding[i][j - 1] += 1;
            newSurrounding[i - 1][j] += 1;
            newSurrounding[i - 1][j - 1] += 1;
          }
          // squares at edge rows or columns
          else if (i === 0) {
            newSurrounding[i][j - 1] += 1;
            newSurrounding[i][j + 1] += 1;
            newSurrounding[i + 1][j - 1] += 1;
            newSurrounding[i + 1][j] += 1;
            newSurrounding[i + 1][j + 1] += 1;
          } else if (i === newRows - 1) {
            newSurrounding[i][j - 1] += 1;
            newSurrounding[i][j + 1] += 1;
            newSurrounding[i - 1][j - 1] += 1;
            newSurrounding[i - 1][j] += 1;
            newSurrounding[i - 1][j + 1] += 1;
          } else if (j === 0) {
            newSurrounding[i][j + 1] += 1;
            newSurrounding[i + 1][j] += 1;
            newSurrounding[i + 1][j + 1] += 1;
            newSurrounding[i - 1][j] += 1;
            newSurrounding[i - 1][j + 1] += 1;
          } else if (j === newColumns - 1) {
            newSurrounding[i][j - 1] += 1;
            newSurrounding[i + 1][j] += 1;
            newSurrounding[i + 1][j - 1] += 1;
            newSurrounding[i - 1][j] += 1;
            newSurrounding[i - 1][j - 1] += 1;
          } else {
            newSurrounding[i][j - 1] += 1;
            newSurrounding[i][j + 1] += 1;
            newSurrounding[i + 1][j] += 1;
            newSurrounding[i + 1][j + 1] += 1;
            newSurrounding[i + 1][j - 1] += 1;
            newSurrounding[i - 1][j] += 1;
            newSurrounding[i - 1][j + 1] += 1;
            newSurrounding[i - 1][j - 1] += 1;
          }
        }
      }
    }

    this.setState({
      difficulty: newDifficulty,
      rows: newRows,
      columns: newColumns,
      numUnopened: newNumUnopened,
      numMines: newNumMines,
      flagsLeft: newFlagsLeft,
      mines: newMines,
      cleared: Array(newRows)
        .fill()
        .map(() => Array(newColumns).fill(false)),
      flagged: Array(newRows)
        .fill()
        .map(() => Array(newColumns).fill(false)),
      surrounding: newSurrounding
    });
  }

  // event handler for left clicks on Square components
  changeCleared(i, j) {
    let squareFlagged = this.state.flagged[i][j];
    let squareCleared = this.state.cleared[i][j];
    let squareMine = this.state.mines[i][j];

    // only allow unflagged squares to be cleared
    if (!squareFlagged) {
      // if the square is a mine, end the game
      if (squareMine) {
        // clear and unflag all squares so their state is displayed
        let newCleared = Array(this.state.rows)
          .fill()
          .map(() => Array(this.state.columns).fill(true));
        let newFlagged = Array(this.state.rows)
          .fill()
          .map(() => Array(this.state.columns).fill(false));

        this.setState({
          hasLost: true, // will result in modal being displayed
          cleared: newCleared,
          flagged: newFlagged
        });
      }

      // if the square is not cleared already, clear it
      else if (!squareCleared) {
        let newCleared = this.state.cleared.slice();
        this.clearSquares(i, j, newCleared);

        // count how many squares are cleared
        let newNumUnopened;
        newNumUnopened = newCleared
          .flat()
          .reduce((acc, cur) => (cur === false ? (acc += 1) : acc), 0);

        // check if the user has won
        let winStatus = false;
        if (newNumUnopened === this.state.numMines) {
          winStatus = true;
        }

        this.setState({
          cleared: newCleared,
          numUnopened: newNumUnopened,
          hasWon: winStatus
        });
      }
    }
  }

  // helper function for changeCleared event handler
  clearSquares(i, j, newCleared) {
    // only clear uncleared and unflagged squares
    if (!this.state.cleared[i][j] && !this.state.flagged[i][j]) {
      newCleared[i][j] = true;

      // recursively clears squares that have 0 surrounding mines
      if (this.state.surrounding[i][j] === 0) {
        // squares at corners
        if (i === 0 && j === 0) {
          this.clearSquares(i, j + 1, newCleared);
          this.clearSquares(i + 1, j, newCleared);
          this.clearSquares(i + 1, j + 1, newCleared);
        } else if (i === 0 && j === this.state.columns - 1) {
          this.clearSquares(i, j - 1, newCleared);
          this.clearSquares(i + 1, j, newCleared);
          this.clearSquares(i + 1, j - 1, newCleared);
        } else if (i === this.state.rows - 1 && j === 0) {
          this.clearSquares(i, j + 1, newCleared);
          this.clearSquares(i - 1, j, newCleared);
          this.clearSquares(i - 1, j + 1, newCleared);
        } else if (i === this.state.rows - 1 && j === this.state.columns - 1) {
          this.clearSquares(i, j - 1, newCleared);
          this.clearSquares(i - 1, j, newCleared);
          this.clearSquares(i - 1, j - 1, newCleared);
        }
        // squares at edge rows or columns
        else if (i === 0) {
          this.clearSquares(i, j + 1, newCleared);
          this.clearSquares(i + 1, j, newCleared);
          this.clearSquares(i, j - 1, newCleared);
          this.clearSquares(i + 1, j - 1, newCleared);
          this.clearSquares(i + 1, j + 1, newCleared);
        } else if (i === this.state.rows - 1) {
          this.clearSquares(i, j + 1, newCleared);
          this.clearSquares(i - 1, j, newCleared);
          this.clearSquares(i, j - 1, newCleared);
          this.clearSquares(i - 1, j - 1, newCleared);
          this.clearSquares(i - 1, j + 1, newCleared);
        } else if (j === 0) {
          this.clearSquares(i, j + 1, newCleared);
          this.clearSquares(i + 1, j, newCleared);
          this.clearSquares(i - 1, j, newCleared);
          this.clearSquares(i - 1, j + 1, newCleared);
          this.clearSquares(i + 1, j + 1, newCleared);
        } else if (j === this.state.columns - 1) {
          this.clearSquares(i, j - 1, newCleared);
          this.clearSquares(i + 1, j, newCleared);
          this.clearSquares(i - 1, j, newCleared);
          this.clearSquares(i - 1, j - 1, newCleared);
          this.clearSquares(i + 1, j - 1, newCleared);
        } else {
          this.clearSquares(i, j + 1, newCleared);
          this.clearSquares(i, j - 1, newCleared);
          this.clearSquares(i + 1, j, newCleared);
          this.clearSquares(i - 1, j, newCleared);
          this.clearSquares(i - 1, j - 1, newCleared);
          this.clearSquares(i - 1, j + 1, newCleared);
          this.clearSquares(i + 1, j - 1, newCleared);
          this.clearSquares(i + 1, j + 1, newCleared);
        }
      }
    }

    return newCleared;
  }

  // event handler for right clicks on Square components
  changeFlagged(i, j) {
    let squareFlagged = this.state.flagged[i][j];
    let squareCleared = this.state.cleared[i][j];

    // only allow uncleared squares to be flagged and unflagged
    if (!squareCleared) {
      let newFlagged = this.state.flagged.slice();
      let newFlagsLeft;

      if (this.state.flagsLeft > 0 && !squareFlagged) {
        newFlagged[i][j] = true;
        newFlagsLeft = this.state.flagsLeft - 1;
      } else if (squareFlagged) {
        newFlagged[i][j] = false;
        newFlagsLeft = this.state.flagsLeft + 1;
      }

      this.setState({ flagged: newFlagged, flagsLeft: newFlagsLeft });
    }
  }

  render() {
    // win or loss message
    let message;
    if (this.state.hasLost) {
      message = (
        <div>
          <Modal>
            You've lost, start a <NewGame />
            &nbsp; ?
          </Modal>
        </div>
      );
    } else if (this.state.hasWon) {
      message = (
        <div>
          <Modal>
            You've won! Start a <NewGame />
            &nbsp; ?
          </Modal>
        </div>
      );
    }

    return (
      <div className="Board">
        <div className="SelectorBox">
          <Selector onChange={this.changeDifficulty} />
          <span>Flags left: {this.state.flagsLeft}</span>
        </div>
        <div className="Squares">
          {" "}
          {Array(this.state.rows)
            .fill()
            .map((row, rowindex) => (
              <div className="Row">
                {" "}
                {Array(this.state.columns)
                  .fill()
                  .map((col, colindex) => (
                    <Square
                      row={rowindex}
                      col={colindex}
                      onClick={this.changeCleared}
                      onContextMenu={this.changeFlagged}
                      isMine={this.state.mines[rowindex][colindex]}
                      isFlagged={this.state.flagged[rowindex][colindex]}
                      isCleared={this.state.cleared[rowindex][colindex]}
                      surrounding={this.state.surrounding[rowindex][colindex]}
                    />
                  ))}{" "}
              </div>
            ))}
        </div>
        {message}
      </div>
    );
  }
}



class Selector extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      value: "Easy"
    };
  }

  handleChange(e) {
    // extract the new difficulty and
    // call the parent class's event-handler
    const difficulty = e.target.value;
    this.setState({ value: difficulty });
    this.props.onChange(difficulty);
  }

  render() {
    return (
      <div>
        <select
          className="Selector"
          onChange={this.handleChange}
          style={{ width: `${10 * this.state.value.length + 14}px` }}
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>
    );
  }
}

class Square extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleContextMenu = this.handleContextMenu.bind(this);
  }

  handleClick(e) {
    this.props.onClick(this.props.row, this.props.col);
  }

  handleContextMenu(e) {
    e.preventDefault();
    this.props.onContextMenu(this.props.row, this.props.col);
  }

  render() {
    let info;
    let squarecolor = this.props.isCleared ? "lightgray" : "lightslategray";

    if (this.props.isFlagged) {
      squarecolor = "red";
      info = <p style={{ color: "white" }}>F</p>;
    } else if (this.props.isCleared) {
      if (this.props.isMine) {
        squarecolor = "gray";
        info = <p style={{ color: "white" }}>M</p>;
      } else {
        if (this.props.surrounding === 0) {
          info = <p />;
        } else {
          if (this.props.surrounding === 1) {
            info = <p style={{ color: "blue" }}>{this.props.surrounding}</p>;
          } else if (this.props.surrounding === 2) {
            info = <p style={{ color: "green" }}>{this.props.surrounding}</p>;
          } else if (this.props.surrounding === 3) {
            info = <p style={{ color: "red" }}>{this.props.surrounding}</p>;
          } else if (this.props.surrounding === 4) {
            info = <p style={{ color: "purple" }}>{this.props.surrounding}</p>;
          } else if (this.props.surrounding === 5) {
            info = <p style={{ color: "maroon" }}>{this.props.surrounding}</p>;
          } else if (this.props.surrounding === 6) {
            info = <p style={{ color: "azure" }}>{this.props.surrounding}</p>;
          } else if (this.props.surrounding === 7) {
            info = <p style={{ color: "black" }}>{this.props.surrounding}</p>;
          } else if (this.props.surrounding === 8) {
            info = <p style={{ color: "gray" }}>{this.props.surrounding}</p>;
          }
        }
      }
    }

    return (
      <button
        className="Square"
        onClick={this.handleClick}
        onContextMenu={this.handleContextMenu}
        style={{ background: squarecolor }}
      >
        {info}
      </button>
    );
  }
}

const NewGame = () => {
  return (
    <button className="NewGame" onClick={() => window.location.reload()}>
      New game
    </button>
  );
}