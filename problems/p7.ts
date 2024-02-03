import { prisma } from "./prisma";

// get average score for a user
export const getAverageScoreForUser = async (userId: number) => {
  const userScores = await prisma.starRating.findMany({
    where: {
      userId,
    },
  });

  return userScores.reduce((a, b) => a + b.score, 0) / userScores.length;
};
