// pages/index.tsx
import React, { useState, useEffect } from 'react';
import Board from '../components/Board';

const IndexPage: React.FC = () => {
  const [words, setWords] = useState<string[]>([]);
  const [board, setBoard] = useState<string[][]>([['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', '']]);
  const [darkMode, setDarkMode] = useState(false); // State for dark mode toggle

  useEffect(() => {
    // Check if the user prefers dark mode
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDarkMode);
  }, []);

  const solveBoggle = async () => {
    try {
      const response = await fetch('/api/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ board }),
      });
      const data: { words: string[] } = await response.json();
      const filteredWords: string[] = data.words.filter((word: string) => word.length > 2); // Exclude two-letter words
      const sortedWords: string[] = filteredWords.sort((a: string, b: string) => b.length - a.length); // Sort from longest to shortest
      setWords(sortedWords);
    } catch (error) {
      console.error('Error solving Boggle:', error);
    }
  };

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${darkMode ? 'dark' : ''}`}>
      <h1 className="text-3xl font-bold mb-4">Wordhunt Solver</h1>
      <Board board={board} setBoard={setBoard} />
      <button
        onClick={solveBoggle}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Solve
      </button>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Found Words:</h2>
        <ul>
          {words.map((word: string, index: number) => (
            <li key={index}>{word}</li>
          ))}
        </ul>
      </div>
      <div className="fixed bottom-4 right-4">
        <label className="switch">
          <input
            type="checkbox"
            className="mr-2"
            checked={darkMode}
            onChange={toggleDarkMode}
          />
          <span className="slider round"></span>
        </label>
      </div>
    </div>
  );
};

export default IndexPage;
