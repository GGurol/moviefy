import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { X } from "lucide-react";

// const defaultInputStyle =
//   "dark:border-dark-subtle border-light-subtle dark:focus:border-white focus:border-primary dark:text-white text-lg";

export default function AppSearchForm({
  showResetIcon,
  placeholder,
  onSubmit,
  // onReset,
  // inputClassName = defaultInputStyle,
  // inputClassName = "",
}) {
  const [value, setValue] = useState("");

  const handleOnSubmit = (e) => {
    e.preventDefault();
    onSubmit(value);
  };

  const handleReset = () => {
    setValue("");
    // onReset();
  };

  return (
    <form className="relative" onSubmit={handleOnSubmit}>
      <Input
        type="text"
        className="pr-9"
        placeholder={placeholder}
        value={value}
        onChange={({ target }) => setValue(target.value)}
      />

      {showResetIcon || value ? (
        <Button
          onClick={handleReset}
          type="button"
          className="absolute top-1/2 -translate-y-1/2 right-0  px-2"
          variant="ghost"
        >
          <X />
        </Button>
      ) : null}
    </form>
  );
}
