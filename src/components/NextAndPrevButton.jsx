function NextAndPrevButton({ onNextClick, onPrevClick, className = '' }) {
  const getClasses = () => {
    return 'flex justify-end items-center space-x-3 ';
  };
  return (
    <div className={getClasses() + className}>
      <Button onClick={onPrevClick} title='Prev' />
      <Button onClick={onNextClick} title='Next' />
    </div>
  );
}

const Button = ({ title, onClick }) => {
  return (
    <button
      type='button'
      className='text-primary dark:text-white hover:underline'
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default NextAndPrevButton;
