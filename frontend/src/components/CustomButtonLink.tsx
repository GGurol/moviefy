import { Button } from "./ui/button";

type Props = {
  label: string;
  clickable: boolean;
  onClick?: () => void;
};

function CustomButtonLink({ label, clickable = true, onClick }: Props) {
  // const className = clickable
  //   ? "text-highlight dark:text-highlight-dark hover:underline"
  //   : "text-highlight dark:text-highlight-dark cursor-default";

  if (clickable) {
    return (
      <button onClick={onClick} className="text-blue-500 hover:underline block">
        {label}
      </button>
    );
  }

  return <p className="">{label}</p>;
}

export default CustomButtonLink;
