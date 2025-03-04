import { useEffect, useState } from "react";
import { getMostRatedMovies } from "../api/admin";
import RatingStar from "./RatingStar";
import { convertReviewCount } from "../utils/helper";
import { Card, CardContent, CardHeader } from "./ui/card";
import { toast } from "sonner";

function MostRatedMovies() {
  const [movies, setMovies] = useState([]);

  const fetchMostRatedMovies = async () => {
    const { error, movies } = await getMostRatedMovies();
    if (error) toast.error(error);

    const sorted = movies.sort(
      (a, b) => Number(b.reviews.ratingAvg) - Number(a.reviews.ratingAvg)
    );

    setMovies([...sorted]);
  };

  useEffect(() => {
    fetchMostRatedMovies();
  }, []);

  return (
    <Card>
      <CardHeader className="text-lg font-semibold">
        Most Rated Movies
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {movies.map((movie) => {
            return (
              <li key={movie.id}>
                <h1 className="font-semibold">{movie.title}</h1>
                <div className="flex gap-6 text-sm items-center">
                  <RatingStar rating={movie.reviews?.ratingAvg} />
                  <p className="">
                    {convertReviewCount(movie.reviews?.reviewCount)} reviews
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

export default MostRatedMovies;
