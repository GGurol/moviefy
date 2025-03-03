import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLatestUploads } from "../../api/movie";
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
            <Card className="border-0">
              <CardContent>
                <Link to={"/movie/" + s.id}>
                  <img src={s.poster} alt="poster" className="rounded-sm" />
                </Link>
                <CardDescription className="text-3xl">
                  {s.title}
                </CardDescription>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
