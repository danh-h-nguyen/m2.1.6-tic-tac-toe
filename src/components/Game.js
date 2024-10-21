import React, { useState, useEffect } from "react";
import Board from "./Board";

function Game() {
  const initial = [
    {
      step: 0,
      historicalSquares: Array(9).fill(null),
      historicalXIsNext: true,
      historicalWinner: null,
    },
  ];

  const [moving, setMoving] = useState(initial);
  const [test, setTest] = useState(0);

  const [count, setCount] = useState(0);
  const [squares, setSquares] = useState(moving[0].historicalSquares);
  const [xIsNext, setXIsNext] = useState(moving[0].historicalXIsNext);
  const [winner, setWinner] = useState(moving[0].historicalWinner);

  console.log(moving);

  //Declaring a Winner
  useEffect(() => {
    const newWinner = calculateWinner(squares);
    setWinner(newWinner);
  }, [squares]);

  //Determine winner
  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  };

  //Handle player
  const handleClick = (i) => {
    if (squares[i] || winner) return; // Prevent overwriting if square is already clicked or the winner is determined

    // function để remove các step
    if (test === 0) {
      setMoving((prevMoving) =>
        prevMoving.filter((item) => item.step <= count)
      );
    } else {
      setMoving((prevMoving) => prevMoving.filter((item) => item.step <= test));
      setTest(0);
      setCount(test);
    }

    const newSquares = [...squares]; // Create a new copy of the squares array
    newSquares[i] = xIsNext ? "X" : "O"; // Update the clicked square

    setSquares(newSquares); // Update the state with the new array
    setXIsNext(!xIsNext); // Toggle the player

    setCount((prevCount) => prevCount + 1);

    setMoving((prevMoving) => [
      ...prevMoving,
      {
        step: (test === 0 ? count : test) + 1, // Save the new step count
        historicalSquares: newSquares, // Save the board state at this step
        historicalXIsNext: !xIsNext, // Save whose turn it was for this step
        historicalWinner: winner, // Save winner status at this step
      },
    ]);
  };

  //Restart game
  const handleRestart = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    setCount(0);
    setMoving(initial);
  };

  //Handle moving
  const handleMoving = (i) => {
    setSquares(moving[i].historicalSquares);
    setXIsNext(moving[i].historicalXIsNext);
    setWinner(moving[i].historicalWinner);
    setTest(i);
  };

  return (
    <div className="main">
      <button className="restart-btn" onClick={() => handleRestart()}>
        Restart
      </button>

      <h2 className="result">Winner is: {winner ? winner : "N/N"}</h2>

      <div className="game">
        <span className="player">Next player is: {xIsNext ? "X" : "O"}</span>
        <Board squares={squares} handleClick={handleClick} />
      </div>

      <div className="historical">
        <span className="historical-moving">Historical moving</span>
        <div className="restart-btn">
          {moving.map((move, index) => (
            <div key={index} className="move">
              <button onClick={() => handleMoving(index)}>
                Step: {move.step}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Game;
