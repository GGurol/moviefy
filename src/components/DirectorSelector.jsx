import { useState } from 'react';
import LiveSearch from './LiveSearch';
import { renderItem } from '../utils/helper';
import { useSearch } from '../hooks';
import { searchActor } from '../api/actor';
import Label from './Label';

function DirectorSelector({ onSelect }) {
  const [value, setValue] = useState('');
  const [profiles, setProfiles] = useState([]);

  const { handleSearch, resetSearch } = useSearch();

  const handleOnChange = ({ target }) => {
    const { value } = target;
    setValue(value);
    handleSearch(searchActor, value, setProfiles);
  };

  const handleOnSelect = (profile) => {
    setValue(profile.name);
    onSelect(profile);
    setProfiles([]);
    resetSearch();
  };

  return (
    <div>
      <Label htmlFor='director'>Director</Label>
      <LiveSearch
        name='director'
        value={value}
        placeholder='Search profile...'
        results={profiles}
        renderItem={renderItem}
        onSelect={handleOnSelect}
        onChange={handleOnChange}
      />
    </div>
  );
}

export default DirectorSelector;
