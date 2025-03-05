import { Button } from "./ui/button";

function NextAndPrevButton({ onNextClick, onPrevClick, className = "" }) {
  const getClasses = () => {
    return "flex justify-end items-center space-x-3 ";
  };
  return (
    <div className={getClasses() + className}>
      <Btn onClick={onPrevClick} title="Prev" />
      <Btn onClick={onNextClick} title="Next" />
    </div>
  );
}

const Btn = ({ title, onClick }) => {
  return (
    <Button
      type="button"
      className="hover:underline"
      variant="secondary"
      onClick={onClick}
    >
      {title}
    </Button>
  );
};

export default NextAndPrevButton;
