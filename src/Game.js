import React from "react";
// eslint-disable-next-line no-unused-vars
import Board from "./Board";

const calculateWinner = squares => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i += 1) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        winnerRow: lines[i]
      };
    }
  }

  return {
    winner: null,
    winnerRow: null
  };
};

const getLocation = move => {
  const locationMap = {
    0: "row: 1, col: 1",
    1: "row: 1, col: 2",
    2: "row: 1, col: 3",
    3: "row: 2, col: 1",
    4: "row: 2, col: 2",
    5: "row: 2, col: 3",
    6: "row: 3, col: 1",
    7: "row: 3, col: 2",
    8: "row: 3, col: 3"
  };

  return locationMap[move];
};

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      currentStepNumber: 0,
      xIsNext: true
    };
  }
  loadPossibilities(squares, xIsNext) {
    var livres = this.getFree(squares);
    var possibilities = [];
    var Xwin = 0;
    var Owin = 0;
    var fake = squares.slice();
    var tmp = [];
    for (let i = 0; i < livres.length; i++) {
      fake = squares.slice();
      fake[livres[i]] = xIsNext ? "O" : "X";
      possibilities.push({
        squares: fake,
        possibilities: [],
        Xwin: 0,
        Owin: 0,
        ganhador: calculateWinner(fake).winner
      });
      if (possibilities[i].ganhador === "X") {
        Xwin++;
      } else if (possibilities[i].ganhador === "O") {
        Owin++;
      }
    }
    if (possibilities.length > 1) {
      for (let i = 0; i < possibilities.length; i++) {
        if (possibilities[i].ganhador == null) {
          tmp = this.loadPossibilities(possibilities[i].squares, !xIsNext);
          possibilities[i].possibilities = tmp;
          Xwin = Xwin + tmp.Xwin;
          Owin = Owin + tmp.Owin;
        }
      }
    }
    return { possibilities: possibilities, Xwin: Xwin, Owin: Owin };
  }

  getFree(squares) {
    var free = [];
    for (var i = 0; i < squares.length; i++) {
      if (squares[i] == null) {
        free.push(i);
      }
    }
    // console.log(free);
    return free;
  }
  contFree(squares) {
    var cont = 0;
    for (var i = 0; i < squares.length; i++) {
      if (squares[i] == null) {
        cont = cont + 1;
      }
    }
    // console.log("teste");
    // console.log(cont);
    return cont;
  }
  handleClick(i) {
    const history = this.state.history.slice(
      0,
      this.state.currentStepNumber + 1
    );
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    // let squares2 = [];
    this.setState({
      history: history.concat([
        {
          squares,
          currentLocation: getLocation(i),
          stepNumber: history.length
        }
      ]),
      xIsNext: !this.state.xIsNext,
      currentStepNumber: history.length
    });
    // console.log(squares);
    this.possibilities = this.loadPossibilities(squares, this.state.xIsNext);
    this.findPlay(squares);
  }
  findPlay(squares) {
    // console.log(squares);
    // console.log(this.possibilities);

    let bestHeuristic = 0;
    let selected = 0;
    let limit = this.possibilities.possibilities.length;
    let i = 0;
    let heuristic;
    for (i = 0; i < limit; i++) {
      heuristic =
        this.possibilities.possibilities[i].possibilities.Owin -
        this.possibilities.possibilities[i].possibilities.Xwin;
      // console.log(heuristic);
      if (heuristic > bestHeuristic) {
        bestHeuristic = heuristic;
        selected = i;
      }
    }
    console.log("percorre", this.possibilities);
    for (i = 0; i < limit; i++) {
      if (this.possibilities.possibilities[i].ganhador == "O") {
        console.log("achou");
        selected = i;
      }
    }
    console.log({ heuristica: bestHeuristic, selected: selected });
    console.log(
      "selecionado",
      this.possibilities.possibilities[selected].squares
    );
    // return;

    // this.state.history = this.possibilities.possibilities[selected].squares;

    const history = this.state.history.slice(
      0,
      this.state.currentStepNumber + 1
    );
    // console.log("history");
    squares = this.possibilities.possibilities[selected].squares;
    // console.log("squares");

    // if (calculateWinner(squares).winner || squares[i]) {
    //   return;
    // }
    // console.log("calculate");

    // let squares2 = [];
    this.setState({
      history: history.concat([
        {
          squares,
          currentLocation: getLocation(0),
          stepNumber: history.length
        }
      ]),
      xIsNext: this.state.xIsNext,
      currentStepNumber: history.length
    });
    // console.log("historia", this.state.history);
  }

  jumpTo(step) {
    this.setState({
      currentStepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  render() {
    const { history } = this.state;
    const current = history[this.state.currentStepNumber];
    console.log("current", current);
    const { winner, winnerRow } = calculateWinner(current.squares);

    // const moves = history.map((step, move) => {
    //   const currentLocation = step.currentLocation
    //     ? `(${step.currentLocation})`
    //     : "";
    //   const desc = step.stepNumber
    //     ? `Go to move #${step.stepNumber}`
    //     : "Go to game start";
    //   const classButton =
    //     move === this.state.currentStepNumber ? "button--green" : "";

    //   return (
    //     <li key={step.stepNumber}>
    //       <button
    //         className={`${classButton} button`}
    //         onClick={() => this.jumpTo(move)}
    //       >
    //         {" "}
    //         {`${desc} ${currentLocation}`}{" "}
    //       </button>{" "}
    //     </li>
    //   );
    // });

    let status;
    if (winner) {
      status = `Winner ${winner}`;
    } else if (history.length === 10) {
      status = "Draw. No one won.";
    } else {
      status = `Next player: ${this.state.xIsNext ? "X" : "O"}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winnerSquares={winnerRow}
            onClick={i => this.handleClick(i)}
          />{" "}
        </div>{" "}
        <div className="game-info">
          {/* <div> {status} </div> <ol> {moves} </ol>{" "} */}
        </div>{" "}
      </div>
    );
  }
}

export default Game;
