import { NextRequest, NextResponse } from "next/server";
import redis from "@/lib/userstore";
import { getLoggedInUser } from "@/lib/appwrite";

// Type definitions
type Cell = {
  isMine: boolean;
  isRevealed: boolean;
};

type GameState = {
  grid: Cell[][];
  score: number;
  gameOver: boolean;
  win: boolean;
  winAmount: number;
  cashedOut: boolean;
};

type GameResponse = {
  error?: string;
  grid?: Cell[][];
  winMultiplier?: number;
  balance: number;
  gameState?: GameState;
  winAmount?: number;
};

type StartGameData = {
  gridSize: number;
  numberOfMines: number;
  betAmount: number;
};

type ClickCellData = {
  gameState: GameState;
  row: number;
  col: number;
  currentBet: number;
  mineCount: number;
};

type CashOutData = {
  currentGameState: GameState;
  currentBetAmount: number;
  numberOfMines: number;
};

// Balance handling utility
class BalanceManager {
  private static readonly POINTS_PER_CURRENCY = 100;

  static async getBalance(userId: string): Promise<number> {
    const balance = await redis.hget(userId, "wallet");
    return balance ? parseInt(balance, 10) : 0;
  }

  static async updateBalance(
    userId: string,
    amountInCurrency: number
  ): Promise<number> {
    const amountInPoints = this.currencyToPoints(amountInCurrency);
    const currentBalance = await this.getBalance(userId);
    const newBalance = currentBalance + amountInPoints;

    // if (newBalance < 0) {
    //   throw new Error("Insufficient balance");
    // }

    await redis.hset(userId, "wallet", newBalance.toString());
    return newBalance;
  }

  static currencyToPoints(amount: number): number {
    return Math.floor(amount * this.POINTS_PER_CURRENCY);
  }

  static pointsToCurrency(points: number): number {
    return points / this.POINTS_PER_CURRENCY;
  }
}

// Game logic functions
const initializeGrid = (gridSize: number, numberOfMines: number): Cell[][] => {
  // Create empty grid
  const grid: Cell[][] = Array(gridSize)
    .fill(null)
    .map(() =>
      Array(gridSize)
        .fill(null)
        .map(() => ({ isMine: false, isRevealed: false }))
    );

  // Place mines randomly
  let minesPlaced = 0;
  while (minesPlaced < numberOfMines) {
    const randomRow = Math.floor(Math.random() * gridSize);
    const randomCol = Math.floor(Math.random() * gridSize);
    if (!grid[randomRow][randomCol].isMine) {
      grid[randomRow][randomCol].isMine = true;
      minesPlaced++;
    }
  }

  return grid;
};

const handleCellClick = (
  gameState: GameState,
  row: number,
  col: number
): GameState => {
  if (gameState.gameOver || gameState.win || gameState.cashedOut) {
    return gameState;
  }

  const newGrid = JSON.parse(JSON.stringify(gameState.grid)); // Deep clone

  if (newGrid[row][col].isMine) {
    revealAllMines(newGrid);
    return {
      ...gameState,
      grid: newGrid,
      gameOver: true,
      winAmount: 0,
    };
  } else {
    newGrid[row][col].isRevealed = true;
    const newScore = gameState.score + 1;
    const win = checkWinCondition(newGrid, gameState.grid.length);
    return {
      ...gameState,
      grid: newGrid,
      score: newScore,
      win,
    };
  }
};

const revealAllMines = (grid: Cell[][]): void => {
  grid.forEach((row) =>
    row.forEach((cell) => {
      if (cell.isMine) cell.isRevealed = true;
    })
  );
};

const checkWinCondition = (grid: Cell[][], gridSize: number): boolean => {
  const totalCells = gridSize * gridSize;
  const revealedCells = grid.flat().filter((cell) => cell.isRevealed).length;
  const minesCount = grid.flat().filter((cell) => cell.isMine).length;
  return revealedCells + minesCount === totalCells;
};

const calculateWinMultiplier = (
  gridSize: number,
  numberOfMines: number
): number => {
  const totalCells = gridSize * gridSize;
  const safeFields = totalCells - numberOfMines;
  return parseFloat((totalCells / safeFields).toFixed(2));
};

// Main API handler
export async function POST(req: NextRequest) {
  try {
    const user = await getLoggedInUser();

    const userId = user?.$id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, data } = await req.json();
    const currentBalance = await BalanceManager.getBalance(userId);

    switch (action) {
      case "START_GAME": {
        const { gridSize, numberOfMines, betAmount }: StartGameData = data;

        // Validate bet amount
        // if (BalanceManager.currencyToPoints(betAmount) > currentBalance) {
        //   return NextResponse.json(
        //     { error: "Insufficient balance" },
        //     { status: 400 }
        //   );
        // }

        // Deduct bet amount and initialize game
        const newBalance = await BalanceManager.updateBalance(
          userId,
          -betAmount
        );
        const grid = initializeGrid(gridSize, numberOfMines);
        const winMultiplier = calculateWinMultiplier(gridSize, numberOfMines);

        return NextResponse.json({
          grid,
          winMultiplier,
          balance: BalanceManager.pointsToCurrency(newBalance),
        });
      }

      case "CLICK_CELL": {
        const { gameState, row, col, currentBet, mineCount }: ClickCellData =
          data;
        const newGameState = handleCellClick(gameState, row, col);

        if (newGameState.gameOver) {
          return NextResponse.json({
            ...newGameState,
            balance: BalanceManager.pointsToCurrency(currentBalance),
          });
        }

        if (newGameState.win) {
          const multiplier = calculateWinMultiplier(
            gameState.grid.length,
            mineCount
          );
          const winAmount = currentBet * multiplier;
          const newBalance = await BalanceManager.updateBalance(
            userId,
            winAmount
          );

          return NextResponse.json({
            ...newGameState,
            winAmount,
            balance: BalanceManager.pointsToCurrency(newBalance),
          });
        }

        return NextResponse.json({
          ...newGameState,
          balance: BalanceManager.pointsToCurrency(currentBalance),
        });
      }

      case "CASH_OUT": {
        const {
          currentGameState,
          currentBetAmount,
          numberOfMines,
        }: CashOutData = data;

        if (currentGameState.cashedOut || currentGameState.gameOver) {
          return NextResponse.json(
            { error: "Invalid game state for cash out" },
            { status: 400 }
          );
        }

        const multiplier = calculateWinMultiplier(
          currentGameState.grid.length,
          numberOfMines
        );
        const cashOutAmount = currentBetAmount * multiplier;
        const newBalance = await BalanceManager.updateBalance(
          userId,
          cashOutAmount
        );

        const betData = {
          userId,
          gameId: "mines",
          amount: data.amount,
          Result: data.amount * multiplier - data.amount,
          currency: "INR",
          multiplier,
        };

        await redis.rpush("bets_queue", JSON.stringify(betData));

        return NextResponse.json({
          ...currentGameState,
          cashedOut: true,
          winAmount: cashOutAmount,
          balance: BalanceManager.pointsToCurrency(newBalance),
        });
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Game error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
