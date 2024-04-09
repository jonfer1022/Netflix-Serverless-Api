import { handlerPath } from "../../src/libs/handler-resolver";
import { Gender, PrismaClient, movies } from "../../src/generated/client";
const prisma = new PrismaClient();

const insertMovies = async () => {
  const movies: Array<Partial<movies>> = [];
  const genders = Object.keys(Gender);
  for (let i = 0; i < 200; i++) {
    const randomNumber = Math.floor(Math.random() * (12));
    movies.push({
      name: `Movie-${i}`,
      productionCompany: 'Netflix',
      classification: 'PG',
      gender: [genders[randomNumber] as Gender],
      linkTrailer: `movies/movie-1/video.mp4`,
      linkCover: `movie-1/cover.jpeg`,
      linkMovie: `movies/movie-1/video.mp4`,
    })
  }

  return Promise.all(
    movies.map(
      async (movie) =>
        await prisma.movies.create({
          data: {
            name: movie.name || '',
            classification: movie.classification || 'M',
            productionCompany: movie.productionCompany || '',
            gender: movie.gender,
            linkTrailer: movie.linkTrailer,
            linkCover: movie.linkCover,
            linkMovie: movie.linkMovie,
          },
        })
    )
  );
};

async function execute() {
  try {
    return await insertMovies();
  } catch (error) {
    console.log(`${handlerPath(__filename)}  ~ error: `, error);
    await prisma.$disconnect();
  }
}

export const main = {
  path: () => handlerPath(__filename),
  function: () => execute(),
};
