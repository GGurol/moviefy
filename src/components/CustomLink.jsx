import { Link } from 'react-router-dom';

function CustomLink({ to, children }) {
  return (
    <Link
      className='dark:text-dark-subtle text-light-subtle dark:hover:text-white transition hover:text-primary'
      to={to}
    >
      {children}
    </Link>
  );
}

export default CustomLink;
