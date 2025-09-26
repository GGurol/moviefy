const commonPosterStyle =
  "flex justify-center items-center border rounded cursor-pointer"; // Removed 'aspect-video'

export default function PosterSelector({
  name,
  accept,
  selectedPoster,
  onChange,
  className,
  label,
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
      />
      <label htmlFor={name} tabIndex={0}>
        {selectedPoster ? (
          <img
            // The final className will now correctly use the aspect ratio from the parent
            className={commonPosterStyle + " object-cover " + className}
            src={selectedPoster}
            alt="poster"
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