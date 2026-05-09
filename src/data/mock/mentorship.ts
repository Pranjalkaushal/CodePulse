import type { TopicExpert } from '../../features/mentorship/services/mentorshipApi'
import { DEMO_USER_ID } from './demoCredentials'

export const mockTopicExperts: TopicExpert[] = [
  {
    topic: 'Trees',
    solvedCount: 91,
    topStudents: [{ userId: 'cp-stu-priya-verma', fullName: 'Priya Verma', solvedCount: 91, rank: 1 }],
  },
  {
    topic: 'Graphs',
    solvedCount: 86,
    topStudents: [{ userId: 'cp-stu-amit-patel', fullName: 'Amit Patel', solvedCount: 86, rank: 1 }],
  },
  {
    topic: 'Greedy',
    solvedCount: 84,
    topStudents: [{ userId: DEMO_USER_ID, fullName: 'Pranjal Kumar', solvedCount: 84, rank: 1 }],
  },
  {
    topic: 'DP',
    solvedCount: 79,
    topStudents: [{ userId: 'cp-stu-sneha-reddy', fullName: 'Sneha Reddy', solvedCount: 79, rank: 1 }],
  },
  {
    topic: 'Two Pointers',
    solvedCount: 76,
    topStudents: [{ userId: 'cp-stu-arjun-singh', fullName: 'Arjun Singh', solvedCount: 76, rank: 1 }],
  },
]
