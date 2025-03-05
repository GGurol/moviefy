import { ReactNode } from "react";
import { Button } from "./ui/button";

type Props = {
  label: string | ReactNode;
  clickable: boolean;
  onClick?: () => void;
};

function CustomButtonLink({ label, clickable = true, onClick }: Props) {
  // const className = clickable
  //   ? "text-highlight dark:text-highlight-dark hover:underline"
  //   : "text-highlight dark:text-highlight-dark cursor-default";

  if (clickable) {
    return (
      <Button
        onClick={onClick}
        variant="link"
        className={`underline hover:no-underline text-sm p-0 capitalize`}
      >
        {label}
      </Button>
    );
  }

  return (
    <p className={`h-9 flex items-center text-sm font-medium text-primary`}>
      {label}
    </p>
  );
}

export default CustomButtonLink;
