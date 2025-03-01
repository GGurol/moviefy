// const cast = [{ actor: id, roleAs: '', leadActor: true }];

import { useEffect, useState } from "react";
import LiveSearch from "../LiveSearch";
import { commonInputClasses } from "../../utils/theme";
import { useNotification, useSearch } from "../../hooks";
import { renderItem } from "../../utils/helper";
import { searchActor } from "../../api/actor";
import LiveSearchCast from "../LiveSearchCast";
import { toast } from "sonner";

const defaultCastInfo = {
  profile: {},
  roleAs: "",
  leadActor: false,
};

function CastForm({
  onSubmit,
  updateCast,
  onUniqValuesChange,
  uniqValues,
  setUniqValues,
  values,
  setValues,
  onSelect,
  ...props
}) {
  const [castInfo, setCastInfo] = useState({ ...defaultCastInfo });
  const [profiles, setProfiles] = useState([]);
  const [value, setValue] = useState("");
  // const [values, setValues] = useState([]);
  const [dupValues, setDupValues] = useState([]);

  const { handleSearch, resetSearch } = useSearch();

  const handleOnChange = ({ target }) => {
    const { checked, name, value } = target;

    if (name === "leadActor")
      return setCastInfo({ ...castInfo, leadActor: checked });

    setCastInfo({ ...castInfo, [name]: value });
  };

  const handleProfileSelect = (profile) => {
    setCastInfo({ ...castInfo, profile });
  };

  const handleOnSelect = (profile) => {
    // setValue(profile?.name);
    // setValues([...values, profile]);
    // const newValue = new Set([...values, profile.id]);
    // setValues(Array.from(newValue));
    // setDupValues([...dupValues, profile]);
    updateCast(profile);
    // onSelect(uniqValues.map((e) => e.id));
    setProfiles([]);
    resetSearch();
  };

  useEffect(() => {
    const uniq = dupValues.filter(
      (obj1, i, arr) => arr.findIndex((obj2) => obj2.id === obj1.id) === i
    );
    onUniqValuesChange(uniq);
  }, [JSON.stringify(dupValues)]);

  useEffect(() => {
    onSelect(uniqValues.map((e) => e.id));
  }, [JSON.stringify(uniqValues)]);

  const handleSubmit = () => {
    const { profile, roleAs } = castInfo;
    if (!profile.name) return toast.error("Cast profile is missing!");
    if (!roleAs.trim()) return toast.error("Cast role is missing!");

    onSubmit(castInfo);
    setCastInfo({ ...defaultCastInfo, profile: { name: "" } });
    resetSearch();
    setProfiles([]);
  };

  const handleProfileChange = ({ target }) => {
    const { value } = target;
    setValue(value);
    const { profile } = castInfo;
    profile.name = value;
    setCastInfo({ ...castInfo, ...profile });
    handleSearch(searchActor, value, setProfiles);
    console.log("handleProfileChange", value);
  };

  const { leadActor, profile, roleAs } = castInfo;

  return (
    <>
      {/* <input
        type="checkbox"
        name="leadActor"
        className="w-4 h-4"
        checked={leadActor}
        onChange={handleOnChange}
        title="Set as lead actor"
      /> */}
      <LiveSearchCast
        placeholder="Search profile..."
        value={value}
        values={values}
        dupValues={dupValues}
        setValue={setValue}
        setValues={setValues}
        setDupValues={setDupValues}
        results={profiles}
        // onSelect={handleProfileSelect}
        renderItem={renderItem}
        onChange={handleProfileChange}
        onSelect={handleOnSelect}
        uniqValues={uniqValues}
        setUniqValues={setUniqValues}
        {...props}
      />
      {/* <span className="dark:text-dark-subtle text-light-subtle font-semibold">
        as
      </span>

      <div className="flex-grow">
        <input
          type="text"
          className={commonInputClasses + " rounded p-1 text-lg border-2"}
          placeholder="Role as..."
          name="roleAs"
          value={roleAs}
          onChange={handleOnChange}
        />
      </div>
      <button
        onClick={handleSubmit}
        type="button"
        className="bg-secondary   text-white px-1 rounded"
      >
        Add
      </button> */}
    </>
  );
}

export default CastForm;
