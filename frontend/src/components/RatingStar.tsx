import { AiFillStar } from "react-icons/ai";

function RatingStar({ rating }) {
  if (!rating) return <p className="">No rating</p>;

  return (
    <p className="text-primary  font-semibold flex items-center justify-center gap-1">
      <span>{rating}</span>
      <AiFillStar />
    </p>
  );
}

export default RatingStar;
