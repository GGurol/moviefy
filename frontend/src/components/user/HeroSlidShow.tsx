import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLatestUploads } from "../../api/movie";
import { useNotification } from "../../hooks";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { toast } from "sonner";

export default function HeroSlidShow() {
  const [slides, setSlides] = useState<LatestMovie[]>([]);

  interface LatestMovie {
    id: string;
    title: string;
    storyLine: string;
    poster: string;
    responsivePosters: string;
    trailer: string;
  }
  const fetchLatestUploads = async () => {
    const { error, movies }: { error: string; movies: LatestMovie[] } =
      await getLatestUploads();
    if (error) {
      return toast.error(error);
    }
    setSlides([...movies]);
  };

  useEffect(() => {
    fetchLatestUploads();
  }, []);

  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 5000,
        }),
      ]}
      className="w-full max-w-6xl mx-auto"
    >
      <CarouselContent>
        {slides.map((s, i) => (
          <CarouselItem key={i}>
            <Card>
              <CardHeader>
                <p>{s.title}</p>
              </CardHeader>
              <CardContent>
                <Link to={"/movie/" + s.id}>
                  <img src={s.poster} alt="poster" />
                </Link>
              </CardContent>
              <CardFooter>
                <p>{s.storyLine}</p>
              </CardFooter>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
