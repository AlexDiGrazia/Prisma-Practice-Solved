import { maxBy, minBy } from "remeda";
import { prisma } from "./prisma";

// Always tell truths, don't you ever lie, to solve this problem, just try a `groupBy`

// find the critic with the lowest average score
export const findTheGrumpiestCriticId = async () => {
  const starRatings = await prisma.starRating.groupBy({
    by: ["score", "userId"],
  });

  const hashMap = new Map();
  for (const rating of starRatings) {
    const user = rating.userId;
    const score = rating.score;
    const accumulatedScore = hashMap.get(user)?.accumulatedScore;
    const numberOfScores = hashMap.get(user)?.numberOfScores;

    hashMap.set(user, {
      accumulatedScore: (accumulatedScore ?? 0) + score,
      numberOfScores: (numberOfScores ?? 0) + 1,
      avgScore: ((accumulatedScore ?? 0) + score) / ((numberOfScores ?? 0) + 1),
    });
  }

  return minBy(Array.from(hashMap.entries()), (x) => x[1].avgScore)?.[0];
};

// find the critic with the highest average score
export const findTheNicestCriticId = async () => {
  const starRatings = await prisma.starRating.groupBy({
    by: ["score", "userId"],
  });

  const hashMap = new Map();
  for (const rating of starRatings) {
    const user = rating.userId;
    const score = rating.score;
    const accumulatedScore = hashMap.get(user)?.accumulatedScore;
    const numberOfScores = hashMap.get(user)?.numberOfScores;

    hashMap.set(user, {
      accumulatedScore: (accumulatedScore ?? 0) + score,
      numberOfScores: (numberOfScores ?? 0) + 1,
      avgScore: ((accumulatedScore ?? 0) + score) / ((numberOfScores ?? 0) + 1),
    });
  }

  return maxBy(Array.from(hashMap.entries()), (x) => x[1].avgScore)?.[0];
};
