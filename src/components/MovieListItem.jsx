import { BsBoxArrowUpRight, BsPencilSquare, BsTrash } from 'react-icons/bs';

export const MovieListItem = ({
  movie,
  onDeleteClick,
  onOpenClick,
  onEditClick,
}) => {
  const { poster, title, genres = [], status } = movie;
  return (
    <table className='w-full border-b'>
      <tbody>
        <tr>
          <td>
            <div className='w-24'>
              <img className='w-full aspect-video' src={poster} alt={title} />
            </div>
          </td>

          <td className='w-full pl-5'>
            <div>
              <h1 className='text-lg font-semibold text-primary dark:text-white'>
                {title}
              </h1>
              <div className='space-x-1'>
                {genres.map((g, index) => {
                  return (
                    <span
                      key={g + index}
                      className='text-primary dark:text-white text-xs'
                    >
                      {g}
                    </span>
                  );
                })}
              </div>
            </div>
          </td>

          <td className='px-5'>
            <p className='text-primary dark:text-white'>{status}</p>
          </td>

          <td>
            <div className='flex items-center space-x-3 text-primary dark:text-white text-lg'>
              <button onClick={onDeleteClick}>
                <BsTrash />
              </button>
              <button onClick={onEditClick}>
                <BsPencilSquare />
              </button>
              <button onClick={onOpenClick}>
                <BsBoxArrowUpRight />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
