export const calculateScores = (data) => {
  const easy = data?.easySolved || 0
  const medium = data?.mediumSolved || 0
  const hard = data?.hardSolved || 0

  const weightedScore = easy * 1 + medium * 3 + hard * 6

  const placementScore = 0.4 * weightedScore + 0.2 * hard * 6 + 0.15 * (data?.contestRating || 0)

  return { weightedScore, placementScore }
}

