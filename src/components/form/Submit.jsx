import { FaSpinner } from 'react-icons/fa';

function Submit({ value, busy }) {
  return (
    <button
      type='submit'
      className='w-full rounded dark:bg-white bg-secondary hover:bg-opacity-90 transition dark:text-secondary text-white font-semibold text-lg h-10 flex items-center justify-center cursor-pointer'
    >
      {busy ? <FaSpinner className='animate-spin' /> : value}
    </button>
  );
}

export default Submit;
