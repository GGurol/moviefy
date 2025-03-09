function GridContainer({ children, className }) {
  return (
    <div
      className={
        "grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2  gap-3 " + className
      }
    >
      {children}
    </div>
  );
}

export default GridContainer;
