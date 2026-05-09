export type TopicExpert = {
  topic: string
  topStudents: Array<{
    userId: string
    fullName: string
    solvedCount: number
    rank: number
  }>
  solvedCount: number
}

import { http } from '../../../services/http'

export async function getTopicExperts() {
  const res = await http.get<TopicExpert[]>('/api/users/topic-experts')
  return res.data
}

