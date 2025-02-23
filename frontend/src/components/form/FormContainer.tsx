function FormContainer({ children }) {
  return (
    <div
      className={`fixed inset-0 dark:bg-primary -z-10 flex justify-center items-center`}
    >
      {children}
    </div>
  );
}

export default FormContainer;
