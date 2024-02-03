import { prisma } from "./prisma";

// find all movies that a user has watched
export const findAllMoviesThatAUserWatched = async (userId: number) => {
  const starRatings = await prisma.starRating.findMany({
    where: {
      userId: {
        equals: userId,
      },
    },
  });

  return await prisma.movie.findMany({
    where: {
      id: {
        in: starRatings.map((rating) => rating.movieId),
      },
    },
  });
};
