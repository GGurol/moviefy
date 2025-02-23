import { useEffect, useState } from "react";
import { getMostRatedMovies } from "../api/admin";
import { useNotification } from "../hooks";
import RatingStar from "./RatingStar";
import { convertReviewCount } from "../utils/helper";
import { Card, CardContent, CardHeader } from "./ui/card";

function MostRatedMovies() {
  const [movies, setMovies] = useState([]);
  const { updateNotification } = useNotification();

  const fetchMostRatedMovies = async () => {
    const { error, movies } = await getMostRatedMovies();
    if (error) return updateNotification("error", error);

    setMovies([...movies]);
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

    // <div className=" shadow dark:bg-secondary p-5 rounded ">
    //   <h1 className="font-semibold text-2xl mb-2 text-primary dark:text-white ">
    //     Most Rated Movies
    //   </h1>
    // <ul className="space-y-3">
    //   {movies.map((movie) => {
    //     return (
    //       <li key={movie.id}>
    //         <h1 className="dark:text-white text-secondary font-semibold">
    //           {movie.title}
    //         </h1>
    //         <div className="flex space-x-2">
    //           <RatingStar rating={movie.reviews?.ratingAvg} />
    //           <p className="text-light-subtle dark:text-dark-subtle">
    //             {convertReviewCount(movie.reviews?.reviewCount)} Reviews
    //           </p>
    //         </div>
    //       </li>
    //     );
    //   })}
    // </ul>
    // </div>
  );
}

export default MostRatedMovies;
