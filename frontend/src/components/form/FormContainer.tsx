function FormContainer({ children, className }) {
  return (
    <div
      className={
        `fixed inset-0 -z-10 flex justify-center items-center ` + className
      }
    >
      {children}
    </div>
  );
}

export default FormContainer;
