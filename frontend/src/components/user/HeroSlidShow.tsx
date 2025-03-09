import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLatestUploads, getMoviesByTag } from "../../api/movie";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export default function HeroSlidShow() {
  const [slides, setSlides] = useState<LatestMovie[]>([]);
  const { t, i18n } = useTranslation();

  interface LatestMovie {
    id: string;
    title: string;
    storyLine: string;
    poster: string;
    responsivePosters: string;
    trailer: string;
  }
  const fetchMoviesByTag = async () => {
    const { error, movies }: { error: string; movies: LatestMovie[] } =
      // await getLatestUploads();
      await getMoviesByTag("Slide");
    if (error) {
      return toast.error(t(error));
    }
    setSlides([...movies]);
  };

  const getTitle = (movie) => {
    const title = `movies.${movie.id}.title`;
    if (i18n.exists(title)) {
      return t(title);
    }
    return movie.title;
  };

  useEffect(() => {
    fetchMoviesByTag();
  }, []);

  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 5000,
        }),
      ]}
      className="w-full max-w-7xl mx-auto"
    >
      <CarouselContent>
        {slides.map((s, i) => (
          <CarouselItem key={i} className="relative md:basis-1/2 lg:basis-1/3">
            <Link to={"/movie/" + s.id}>
              <img src={s.poster} alt="poster" className="rounded-sm" />
            </Link>
            <p className="absolute left-5 bottom-0 text-white text-lg font-semibold">
              {getTitle(s)}
            </p>
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* <CarouselPrevious className="max-xl:hidden" />
      <CarouselNext className="max-xl:hidden" /> */}
    </Carousel>
  );
}
