import { groupBy, map, reduce, sumBy } from "remeda";
import { prisma } from "./prisma";
import { StarRating } from "@prisma/client";

// hint:find all stars with the movies "included" on, then good ol' javascript should finish the job
// This one should require more javascript work than the previous ones

export const getAllMoviesWithAverageScoreOverN = async (n: number) => {
  const starRatings = await prisma.starRating.findMany({
    include: {
      movie: true,
    },
  });

  const hashMap = new Map();
  for (const rating of starRatings) {
    const movie = rating.movieId;
    const score = rating.score;
    const accumulatedScore = hashMap.get(movie)?.accumulatedScore;
    const numberOfScores = hashMap.get(movie)?.numberOfScores;

    hashMap.set(movie, {
      accumulatedScore: (accumulatedScore ?? 0) + score,
      numberOfScores: (numberOfScores ?? 0) + 1,
      avgScore: ((accumulatedScore ?? 0) + score) / ((numberOfScores ?? 0) + 1),
    });
  }

  const moviesWithAvgScoreGreaterThanN = Array.from(hashMap.entries())
    .filter((obj) => obj[1].avgScore > n)
    .map((obj) => obj[0]);

  return await prisma.movie.findMany({
    where: {
      id: {
        in: moviesWithAvgScoreGreaterThanN,
      },
    },
  });
};
