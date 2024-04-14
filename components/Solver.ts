// components/Solver.ts
const wordList: string[] = require('../words.json');

interface TrieNode {
  children: { [key: string]: TrieNode };
  isEndOfWord: boolean;
}

class Trie {
  root: TrieNode;

  constructor() {
    this.root = this.getNode();
  }

  private getNode(): TrieNode {
    return {
      children: {},
      isEndOfWord: false,
    };
  }

  insert(word: string) {
    let current = this.root;
    for (let i = 0; i < word.length; i++) {
      const ch = word[i];
      if (!current.children[ch]) {
        current.children[ch] = this.getNode();
      }
      current = current.children[ch];
    }
    current.isEndOfWord = true;
  }

  search(word: string): boolean {
    let current = this.root;
    for (let i = 0; i < word.length; i++) {
      const ch = word[i];
      if (!current.children[ch]) {
        return false;
      }
      current = current.children[ch];
    }
    return current !== null && current.isEndOfWord;
  }
}

const solver = (board: string[][]): string[] => {
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];

  const validWordSet = new Set<string>();
  const trie = new Trie();
  const visited: boolean[][] = Array.from({ length: board.length }, () => Array(board[0].length).fill(false));

  // Construct trie from word list
  for (const word of wordList) {
    trie.insert(word.toUpperCase());
  }

  const dfs = (row: number, col: number, word: string, node: TrieNode) => {
    if (node.isEndOfWord) {
      validWordSet.add(word);
    }

    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;

      if (newRow >= 0 && newRow < board.length && newCol >= 0 && newCol < board[0].length && !visited[newRow][newCol]) {
        const ch = board[newRow][newCol];
        if (node.children[ch]) {
          visited[newRow][newCol] = true;
          dfs(newRow, newCol, word + ch, node.children[ch]);
          visited[newRow][newCol] = false;
        }
      }
    }
  };

  // Traverse the board
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      const ch = board[i][j];
      if (trie.root.children[ch]) {
        visited[i][j] = true;
        dfs(i, j, ch, trie.root.children[ch]);
        visited[i][j] = false;
      }
    }
  }

  return Array.from(validWordSet);
};

export default solver;
