"use client";

import { useState, useCallback, useEffect } from "react";
import { X } from "lucide-react";

export default function Connect4Game() {
  const [board, setBoard] = useState<(null | "APPWRITE" | "SUPABASE")[][]>(
    Array(6)
      .fill(null)
      .map(() => Array(7).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState<"APPWRITE" | "SUPABASE">(
    "APPWRITE"
  );
  const [winner, setWinner] = useState<
    "APPWRITE" | "SUPABASE" | "draw" | "timeout" | null
  >(null);
  const [redTime, setRedTime] = useState(120); // 2 minutes in seconds
  const [blueTime, setBlueTime] = useState(120);

  const checkWinner = useCallback(
    (row: number, col: number, player: "APPWRITE" | "SUPABASE") => {
      const directions = [
        [1, 0],
        [0, 1],
        [1, 1],
        [1, -1],
      ];

      for (const [dx, dy] of directions) {
        let count = 1;
        for (let i = 1; i < 4; i++) {
          const newRow = row + i * dx;
          const newCol = col + i * dy;
          if (
            newRow < 0 ||
            newRow >= 6 ||
            newCol < 0 ||
            newCol >= 7 ||
            board[newRow][newCol] !== player
          )
            break;
          count++;
        }
        for (let i = 1; i < 4; i++) {
          const newRow = row - i * dx;
          const newCol = col - i * dy;
          if (
            newRow < 0 ||
            newRow >= 6 ||
            newCol < 0 ||
            newCol >= 7 ||
            board[newRow][newCol] !== player
          )
            break;
          count++;
        }
        if (count >= 4) return true;
      }
      return false;
    },
    [board]
  );

  const handleClick = (col: number) => {
    if (winner) return;

    let row = -1;
    for (let i = 5; i >= 0; i--) {
      if (board[i][col] === null) {
        row = i;
        break;
      }
    }

    if (row === -1) return; // Column is full

    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);

    if (checkWinner(row, col, currentPlayer)) {
      setWinner(currentPlayer);
    } else if (newBoard.every((row) => row.every((cell) => cell !== null))) {
      setWinner("draw");
    } else {
      setCurrentPlayer(currentPlayer === "APPWRITE" ? "SUPABASE" : "APPWRITE");
    }
  };

  const resetGame = () => {
    setBoard(
      Array(6)
        .fill(null)
        .map(() => Array(7).fill(null))
    );
    setCurrentPlayer("APPWRITE");
    setWinner(null);
    setRedTime(120);
    setBlueTime(120);
  };

  useEffect(() => {
    if (winner) return;

    const timer = setInterval(() => {
      if (currentPlayer === "APPWRITE") {
        setRedTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setWinner("timeout");
            return 0;
          }
          return prevTime - 1;
        });
      } else {
        setBlueTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setWinner("timeout");
            return 0;
          }
          return prevTime - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentPlayer, winner]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#19191D] text-[#EDEDF0] font-mono">
      <nav className="flex justify-between items-center p-4 bg-[#19191D]">
        <h1 className="text-2xl font-bold tracking-wide">CONNECT 4</h1>
        <button
          onClick={resetGame}
          className={`${
            winner ? "bg-green-600" : "bg-red-600"
          } text-white px-4 py-2 rounded flex items-center text-sm sm:text-base`}
        >
          {winner ? "RESTART GAME" : "ABORT GAME"}
          <X className="ml-2" size={20} />
        </button>
      </nav>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-[80vh] aspect-square bg-[#FD366E] p-2 sm:p-4 rounded-lg shadow-lg">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="flex h-1/6">
              {row.map((cell, colIndex) => (
                <button
                  key={colIndex}
                  className="lg:mt-5 lg:ml-5 w-16 h-10 mt-3 lg:w-16 lg:h-16 bg-[#19191D] rounded-full m-[2%] focus:outline-none"
                  onClick={() => handleClick(colIndex)}
                  disabled={!!winner}
                >
                  {cell && (
                    <div
                      className={`w-[80%] h-[80%] rounded-full m-auto ${
                        cell === "APPWRITE" ? "bg-[#FD366E]" : "bg-[#3ECF8E]"
                      }`}
                    />
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      </main>

      <footer className="p-4 flex justify-between items-center bg-[#19191D]">
        <div className="text-xl">
          {winner
            ? winner === "draw"
              ? "IT'S A DRAW!"
              : winner === "timeout"
              ? `PLAYER ${
                  currentPlayer === "APPWRITE" ? "SUPABASE" : "APPWRITE"
                } WINS BY TIMEOUT!`
              : `PLAYER ${winner.toUpperCase()} WINS!`
            : "YOUR TURN"}
        </div>
        {!winner && (
          <div className="flex items-center">
            <div
              className={`w-4 h-4 rounded-full ${
                currentPlayer === "APPWRITE" ? "bg-[#FD366E]" : "bg-[#3ECF8E]"
              }`}
            />
            <span className="ml-2">
              {currentPlayer === "APPWRITE"
                ? formatTime(redTime)
                : formatTime(blueTime)}
            </span>
          </div>
        )}
      </footer>
    </div>
  );
}
