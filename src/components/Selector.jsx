function Selector({ name, value, onChange, label, options }) {
  return (
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className='border-2 bg-white dark:bg-primary dark:border-dark-subtle border-light-subtle dark:focus:border-white focus:border-primary p-1 pr-10 outline-none transition rounded bg-transparent text-light-subtle dark:text-dark-subtle dark:focus:text-white focus:text-primary'
    >
      <option value=''>{label}</option>
      {options.map(({ title, value }) => {
        return (
          <option key={title} value={value}>
            {title}
          </option>
        );
      })}
    </select>
  );
}

export default Selector;
