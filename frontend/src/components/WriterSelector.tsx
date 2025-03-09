import { useState } from "react";
import { renderItem } from "../utils/helper";
import LiveSearch from "./LiveSearch";
import { useSearch } from "../hooks";
import { searchActor } from "../api/actor";
import { useTranslation } from "react-i18next";

function WriterSelector({
  updateWriter,
  value,
  setValue,
  onSelect,
  selectRes,
  setSelectRes,
  ...props
}) {
  // const [value, setValue] = useState("");
  const [profiles, setProfiles] = useState([]);

  const { handleSearch, resetSearch } = useSearch();
  const { t } = useTranslation();

  const handleOnChange = ({ target }) => {
    const { value } = target;
    setValue(value);
    handleSearch(searchActor, value, [], setProfiles);
  };

  const handleOnSelect = (profile) => {
    setValue("");
    updateWriter(profile);
    onSelect(profile?.id);
    setProfiles([]);
    resetSearch();
  };

  return (
    <LiveSearch
      name="writer"
      placeholder={t("Search writer...")}
      results={profiles}
      renderItem={renderItem}
      onSelect={handleOnSelect}
      onChange={handleOnChange}
      value={value}
      onUpdate={updateWriter}
      setValue={setValue}
      selectRes={selectRes}
      setSelectRes={setSelectRes}
      {...props}
    />
  );
}

export default WriterSelector;
