const commonPosterStyle =
  "flex justify-center items-center border rounded aspect-video cursor-pointer";

export default function PosterSelector({
  name,
  accept,
  selectedPoster,
  onChange,
  className,
  label,
  // ref,
}) {
  return (
    <div>
      <input
        accept={accept}
        onChange={onChange}
        name={name}
        id={name}
        type="file"
        hidden
        // ref={ref}
      />
      <label htmlFor={name} tabIndex={0}>
        {selectedPoster ? (
          <img
            className={commonPosterStyle + " object-cover " + className}
            src={selectedPoster}
            alt=""
          />
        ) : (
          <PosterUI label={label} className={className} />
        )}
      </label>
    </div>
  );
}

const PosterUI = ({ label, className }) => {
  return (
    <div className={commonPosterStyle + " " + className}>
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
};
