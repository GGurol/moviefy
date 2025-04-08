import { forwardRef, useEffect, useRef, useState } from "react";
import { commonInputClasses } from "../utils/theme";
import { Badge } from "./ui/badge";
import { XIcon } from "lucide-react";
import { Button } from "./ui/button";

export default function LiveSearchCast({
  value = "",
  values = [],
  dupValues = [],
  placeholder = "",
  results = [],
  name,
  selectedResultStyle,
  resultContainerStyle,
  inputStyle,
  renderItem = null,
  onSelect = null,
  onChange = null,
  onUpdate,
  setValue,
  setValues,
  setDupValues,
  sendDataToParent,
  uniqValues,
  setUniqValues,
  selectedActors,
  setSelectedActors,
  ...props
}) {
  const [displaySearch, setDisplaySearch] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  // const [selectRes, setSelectRes] = useState([]);
  const [actors, setActors] = useState([]);

  const handleOnFocus = () => {
    if (results.length) setDisplaySearch(true);
  };

  const closeSearch = () => {
    setDisplaySearch(false);
    setFocusedIndex(-1);
  };

  const handleOnBlur = () => {
    setTimeout(() => {
      closeSearch();
    }, 1000);
  };

  const handleSelection = (selectedItem) => {
    if (selectedItem) {
      // setSelectRes([...selectRes, selectedItem]);
      setSelectedActors([...selectedActors, selectedItem]);
      inputRef.current.value = "";
      // setDupValues([...dupValues, selectedItem]);
      onSelect(selectedItem);
      closeSearch();
    }
  };

  const inputRef = useRef(null);

  const handleKeyDown = ({ key }) => {
    // console.log(key);
    let nextCount;
    const keys = ["ArrowDown", "ArrowUp", "Enter", "Escape", "Backspace"];
    if (!keys.includes(key)) return;

    // move selection up and down
    if (key === "ArrowDown") {
      nextCount = (focusedIndex + 1) % results.length;
    }
    if (key === "ArrowUp") {
      nextCount = (focusedIndex + results.length - 1) % results.length;
    }
    if (key === "Backspace") return closeSearch();

    if (key === "Enter") return handleSelection(results[focusedIndex]);

    setFocusedIndex(nextCount);
  };

  const getInputStyle = () => {
    return inputStyle
      ? inputStyle
      : commonInputClasses + " border-2 rounded p-1 text-lg";
  };

  useEffect(() => {
    if (results.length) return setDisplaySearch(true);
    setDisplaySearch(false);
  }, [results.length]);

  // const [pendingDataPoint, setPendingDataPoint] = useState("");

  // useEffect(() => {
  //   const newValue = new Set([...value]);
  //   setValues(Array.from(newValue));
  // }, []);

  // const addPendingDataPoint = () => {
  //   const newDataPoints = new Set([...value]);
  //   setValues(Array.from(newDataPoints));
  // };

  // https://stackoverflow.com/questions/2218999/how-to-remove-all-duplicates-from-an-array-of-objects
  // const uniqValues = dupValues.filter(
  //   (obj1, i, arr) => arr.findIndex((obj2) => obj2.id === obj1.id) === i
  // );

  // const setLeaderActors = useActorStore((state) => state.setLeaderActors);
  // setLeaderActors(uniqValues);

  // const setArray = useArray((state) => state.setArray);
  // setArray(uniqValues);
  // console.log(uniqValues);

  // useEffect(() => {
  //   setLeaderActors(uniqValues);
  // }, []);

  return (
    <div className="relative">
      <div className="has-[:focus-visible]:outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-neutral-950 has-[:focus-visible]:ring-offset-2 dark:has-[:focus-visible]:ring-neutral-300 min-h-10 flex w-full flex-wrap gap-2 rounded-md border px-3 py-2 text-sm ring-offset-white  disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 ">
        {/* {values.map((id) => {
          const items = dupValues.filter((e) => e.id === id);
          console.log(items);
          return items.map((item) => (
            <Badge key={item.id} variant="secondary">
              {item.name}
              <Button
                variant="ghost"
                size="icon"
                className="ml-2 h-3 w-3"
                onClick={() => {
                  setValues(values.filter((i) => i !== item));
                  onUpdate("");
                  setValue("");
                  setSelectRes("");
                }}
              >
                <XIcon className="w-3" />
              </Button>
            </Badge>
          ));
        })} */}
        {selectedActors &&
          selectedActors.map((item) => (
            <Badge key={item.id} variant="secondary">
              {item.name}
              <Button
                variant="ghost"
                size="icon"
                type="button"
                className="ml-2 h-3 w-3"
                onClick={() => {
                  // setUniqValues(uniqValues.filter((i) => i !== item));
                  // setDupValues(dupValues.filter((i) => i !== item));
                  // onUpdate("");
                  setValue("");
                  // setSelectRes("");
                  setSelectedActors(selectedActors.filter((i) => i !== item));
                }}
              >
                <XIcon className="w-3" />
              </Button>
            </Badge>
          ))}
        <input
          type="text"
          id={name}
          name={name}
          // className={getInputStyle()}
          // className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          className="flex-1 outline-none bg-transparent placeholder:text-muted-foreground md:text-sm"
          placeholder={placeholder}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
          onKeyDown={handleKeyDown}
          // value={!!selectRes ? "" : value}
          onChange={onChange}
          ref={inputRef}
          {...props}
        />
      </div>

      <SearchResults
        focusedIndex={focusedIndex}
        visible={displaySearch}
        results={results}
        onSelect={handleSelection}
        renderItem={renderItem}
        // resultContainerStyle={resultContainerStyle}
        selectedResultStyle={selectedResultStyle}
      />
    </div>
  );
}

const SearchResults = ({
  visible,
  results = [],
  focusedIndex,
  onSelect,
  renderItem,
  resultContainerStyle,
  selectedResultStyle,
}) => {
  const resultContainer = useRef();

  useEffect(() => {
    resultContainer.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [focusedIndex]);

  if (!visible) return null;
  return (
    <div className="absolute z-50 right-0 left-0 top-10 shadow-md p-2 max-h-64 space-y-2 mt-1 overflow-auto border bg-popover">
      {results.map((result, index) => {
        const getSelectedClass = () => {
          return selectedResultStyle
            ? selectedResultStyle
            : // : "dark:bg-dark-subtle bg-light-subtle";
              "bg-muted";
        };
        return (
          <ResultCard
            ref={index === focusedIndex ? resultContainer : null}
            key={index.toString()}
            item={result}
            renderItem={renderItem}
            resultContainerStyle={resultContainerStyle}
            selectedResultStyle={
              index === focusedIndex ? getSelectedClass() : ""
            }
            onClick={() => {
              onSelect(result);
            }}
          />
        );
      })}
    </div>
  );
};

// eslint-disable-next-line react/display-name
const ResultCard = forwardRef((props, ref) => {
  const {
    item,
    renderItem,
    resultContainerStyle,
    selectedResultStyle,
    onClick,
  } = props;

  const getClasses = () => {
    if (resultContainerStyle)
      return resultContainerStyle + " " + selectedResultStyle;

    const newStyle =
      " cursor-pointer rounded overflow-hidden hover:bg-muted transition ";

    return (
      selectedResultStyle + newStyle
      // " cursor-pointer rounded overflow-hidden dark:hover:bg-dark-subtle hover:bg-light-subtle transition "
    );
  };

  return (
    <div
      onClick={onClick}
      ref={ref}
      // className="cursor-pointer hover:bg-muted transition rounded"
      className={getClasses()}
    >
      {renderItem(item)}
    </div>
  );
});
