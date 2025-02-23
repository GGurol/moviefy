import { Link } from "react-router-dom";

function CustomLink({ to, children }) {
  return (
    <Link
      className="transition text-blue-500 hover:text-primary underline underline-offset-4"
      to={to}
    >
      {children}
    </Link>
  );
}

export default CustomLink;
