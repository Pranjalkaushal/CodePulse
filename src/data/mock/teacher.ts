/** Mock shapes match what TeacherDashboard consumes (classes / atRiskStudents arrays). */

export const mockTeacherClassSummary = {
  classes: [
    {
      id: 'c1',
      class: 'CSE-A',
      batch: '2026',
      avgScore: 128.5,
      activeStudents: 42,
      health: 'great',
    },
    {
      id: 'c2',
      class: 'CSE-B',
      batch: '2026',
      avgScore: 96.4,
      activeStudents: 38,
      health: 'ok',
    },
    {
      id: 'c3',
      class: 'IT-A',
      batch: '2025',
      avgScore: 72.2,
      activeStudents: 35,
      health: 'needs-attention',
    },
  ],
  atRiskStudents: [
    {
      id: 'r1',
      name: 'Sneha Reddy',
      class: 'CSE-A',
      batch: '2026',
      risk: 'low-score',
      reason: 'Weighted score below cohort median for 2 consecutive weeks.',
    },
    {
      id: 'r2',
      name: 'Arjun Singh',
      class: 'ECE-A',
      batch: '2026',
      risk: 'inactivity',
      reason: 'No submissions in last 14 days.',
    },
  ],
}
