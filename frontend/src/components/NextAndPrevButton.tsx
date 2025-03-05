import { Button } from "./ui/button";

function NextAndPrevButton({
  onNextClick,
  onPrevClick,
  noNext,
  noPrev,
  className = "",
}) {
  const getClasses = () => {
    return "flex justify-end items-center space-x-3 ";
  };
  return (
    <div className={getClasses() + className}>
      <Btn onClick={onPrevClick} title="Prev" disabled={noPrev} />
      <Btn onClick={onNextClick} title="Next" disabled={noNext} />
    </div>
  );
}

const Btn = ({ title, onClick, disabled }) => {
  return (
    <Button
      type="button"
      className="hover:underline"
      variant="secondary"
      onClick={onClick}
      disabled={disabled}
    >
      {title}
    </Button>
  );
};

export default NextAndPrevButton;
