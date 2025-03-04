import { Star } from "lucide-react";

export default function RatingStar({ rating, className = "" }) {
  if (!rating)
    return (
      <p
        className={
          "text-rating-color  flex items-center justify-center gap-1 " +
          className
        }
      >
        No rating
      </p>
    );

  return (
    <p
      className={
        "text-rating-color font-semibold flex items-center justify-center gap-1 " +
        className
      }
    >
      <span>{rating}</span>
      <Star fill="var(--rating-color)" strokeWidth={0} size={20} />
    </p>
  );
}
