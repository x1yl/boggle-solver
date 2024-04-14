// pages/api/solve.ts
import { NextApiRequest, NextApiResponse } from 'next';
import solver from '../../components/Solver';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const board: string[][] = req.body.board;
    const words = solver(board);
    res.status(200).json({ words });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
