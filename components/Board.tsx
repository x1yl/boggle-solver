// components/Board.tsx
import React, { useState, useEffect, useRef } from 'react';

interface Props {
  board: string[][];
  setBoard: React.Dispatch<React.SetStateAction<string[][]>>;
}

const Board: React.FC<Props> = ({ board, setBoard }) => {
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[][]>([]);

  useEffect(() => {
    const inputRef = inputRefs.current[currentRow]?.[currentCol];
    if (inputRef) {
      inputRef.focus();
    }
  }, [currentRow, currentCol]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, row: number, col: number) => {
    const newBoard = [...board];
    newBoard[row][col] = e.target.value.toUpperCase();
    setBoard(newBoard);

    if (col < board[row].length - 1) {
      setCurrentCol(col + 1);
    } else if (row < board.length - 1) {
      setCurrentRow(row + 1);
      setCurrentCol(0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, row: number, col: number) => {
    if (e.key === 'Backspace') {
        e.preventDefault();
        handleInputChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>, row, col);
      }
    if (e.key === 'ArrowRight' || (e.key === 'Enter' && col < board[row].length - 1)) {
      e.preventDefault();
      setCurrentRow(row);
      setCurrentCol(col + 1);
    } else if ((e.key === 'ArrowLeft' || e.key === 'Backspace') && col > 0) {
      e.preventDefault();
      setCurrentRow(row);
      setCurrentCol(col - 1);
    } else if ((e.key === 'ArrowLeft' || e.key === 'Backspace') && col === 0 && row > 0) {
      e.preventDefault();
      setCurrentRow(row - 1);
      setCurrentCol(board[row - 1].length - 1);
    } else if (e.key === 'ArrowDown' || (e.key === 'Enter' && row < board.length - 1)) {
      e.preventDefault();
      setCurrentRow(row + 1);
      setCurrentCol(col);
    } else if (e.key === 'ArrowUp' && row > 0) {
      e.preventDefault();
      setCurrentRow(row - 1);
      setCurrentCol(col);
    }
  };

  return (
    <div className="grid grid-cols-4 gap-1" style={{ width: 'fit-content' }}>
      {board.map((row, rowIndex) => (
        row.map((cell, colIndex) => (
          <input
            key={`${rowIndex}-${colIndex}`}
            ref={el => {
              if (!inputRefs.current[rowIndex]) {
                inputRefs.current[rowIndex] = [];
              }
              inputRefs.current[rowIndex][colIndex] = el;
            }}
            type="text"
            maxLength={1}
            value={cell}
            onChange={(e) => handleInputChange(e, rowIndex, colIndex)}
            onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
            className="w-8 h-8 text-center text-lg border border-gray-300 rounded-md text-black"
            style={{ letterSpacing: '-0.5px' }}
          />
        ))
      ))}
    </div>
  );
};

export default Board;
