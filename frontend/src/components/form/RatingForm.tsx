import { Loader, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { DialogContent } from "../ui/dialog";
import { useTranslation } from "react-i18next";

const createArray = (count) => {
  return new Array(count).fill("");
};

const ratings = createArray(10);

function RatingForm({ onSubmit, initialState, busy }) {
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [content, setContent] = useState("");
  const { t } = useTranslation();
  const handleMouseEnter = (index) => {
    const ratings = createArray(index + 1);
    // console.log(ratings);
    setSelectedRatings([...ratings]);
  };

  const handleOnChange = ({ target }) => {
    setContent(target.value);
  };

  const handleSubmit = () => {
    if (!selectedRatings.length) return;
    const data = {
      rating: selectedRatings.length,
      content,
    };

    onSubmit(data);
  };

  useEffect(() => {
    if (initialState) {
      setContent(initialState.content);
      setSelectedRatings(createArray(initialState.rating));
    }
  }, [initialState]);

  return (
    <DialogContent className="max-w-xs [&>button]:hidden">
      <div className="">
        <div className=" flex items-center relative pl-3 ">
          <StarsOutlined ratings={ratings} onMouseEnter={handleMouseEnter} />
          <div className="flex items-center  absolute top-1/2 -translate-y-1/2  ">
            <StarsFill
              ratings={selectedRatings}
              onMouseEnter={handleMouseEnter}
            />
          </div>
        </div>

        <textarea
          value={content}
          onChange={handleOnChange}
          className="w-full h-36 mt-4 mb-4 border-2 p-2 text-primary rounded outline-none bg-transparent "
        />

        <Button onClick={handleSubmit} className="w-full">
          <span className="w-10 flex items-center justify-center">
            {busy ? <Loader className="animate-spin" /> : t("Submit")}
          </span>
        </Button>
      </div>
    </DialogContent>
  );
}

const StarsOutlined = ({ ratings, onMouseEnter }) => {
  return ratings.map((_, index) => {
    return (
      <Star
        stroke="var(--rating-color)"
        strokeWidth={0.5}
        onMouseEnter={() => onMouseEnter(index)}
        className="cursor-pointer"
        key={index}
        size={24}
      />
    );
  });
};

const StarsFill = ({ ratings, onMouseEnter }) => {
  return ratings.map((_, index) => {
    return (
      <Star
        fill="var(--rating-color)"
        strokeWidth={0}
        onMouseEnter={() => onMouseEnter(index)}
        className="cursor-pointer"
        key={index}
        size={24}
      />
    );
  });
};

export default RatingForm;
