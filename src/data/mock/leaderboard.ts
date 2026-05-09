import { DEMO_USER_ID } from './demoCredentials'

export type MockLeaderRow = {
  id: string
  name: string
  classLabel: string
  batch: string
  easy: number
  medium: number
  hard: number
}

export function weightedScore(row: Pick<MockLeaderRow, 'easy' | 'medium' | 'hard'>) {
  return row.easy * 1 + row.medium * 3 + row.hard * 6
}

/** Static campus leaderboard entries; logged-in demo user id matches DEMO_USER_ID. */
export const mockLeaderboardEntries: MockLeaderRow[] = [
  {
    id: 'cp-stu-priya-verma',
    name: 'Prithvi Raj Singh',
    classLabel: 'Mca',
    batch: '2027',
    easy: 84,
    medium: 5,
    hard: 0,
  },
  {
    id: 'cp-stu-amit-patel',
    name: 'Amit',
    classLabel: 'Mca',
    batch: '2027',
    easy: 39,
    medium: 5,
    hard: 0,
  },
  {
    id: DEMO_USER_ID,
    name: 'Pranjal Kumar',
    classLabel: 'Mca',
    batch: '2027',
    easy: 83,
    medium: 5,
    hard: 0,
  },
  {
    id: 'cp-stu-sneha-reddy',
    name: 'Adarsh Singh',
    classLabel: 'Mca',
    batch: '2027',
    easy: 90,
    medium: 5,
    hard: 0,
  },
  {
    id: 'cp-stu-arjun-singh',
    name: 'Khushi',
    classLabel: 'Mca',
    batch: '2027',
    easy: 85,
    medium: 5,
    hard: 0,
  },
  {
    id: 'cp-stu-kavya-iyer',
    name: 'Alpha',
    classLabel: 'Btech',
    batch: '2028',
    easy: 20,
    medium: 0,
    hard: 0,
  },
  {
    id: 'cp-stu-rohan-malhotra',
    name: 'Ishaan',
    classLabel: 'CSE-A',
    batch: '2028',
    easy: 60,
    medium: 4,
    hard: 0,
  },
]
