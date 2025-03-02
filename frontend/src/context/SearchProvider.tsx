import { createContext, useState } from "react";
import { useNotification } from "../hooks";
import { toast } from "sonner";

export const SearchContext = createContext();

let timeoutId;
const debounce = (func, delay) => {
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

function SearchProvider({ children }) {
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [resultNotFound, setResultNotFound] = useState(false);

  const search = async (method, query, body, updaterFun) => {
    const { error, results } = await method(query, body);
    if (error) return toast.error(error);

    if (!results.length) {
      setResults([]);
      updaterFun && updaterFun([]);
      return setResultNotFound(true);
    }

    setResultNotFound(false);
    setResults(results);
    updaterFun && updaterFun([...results]);
  };

  const debounceFunc = debounce(search, 300);

  const handleSearch = (method, query, body, updaterFun) => {
    setSearching(true);
    if (!query.trim()) {
      updaterFun && updaterFun([]);
      return resetSearch();
    }
    debounceFunc(method, query, body, updaterFun);
  };

  const resetSearch = () => {
    setSearching(false);
    setResults([]);
    setResultNotFound(false);
  };

  return (
    <SearchContext.Provider
      value={{ handleSearch, resetSearch, searching, resultNotFound, results }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export default SearchProvider;
