export const isValidEmail = (email) => {
  const isValid = /[^\s@]+@[^\s@]+\.[^\s@]+/gi;
  return isValid.test(email);
};

export const getToken = () => localStorage.getItem("auth-token");

// Handling Errors
// https://axios-http.com/docs/handling_errors
export const catchError = (error) => {
  console.log(error.response?.data);

  const { response } = error;
  if (response?.data) return response.data;

  return { error: error.message || error };
};

export const renderItem = (result) => {
  return (
    <div key={result.id} className="flex space-x-2 rounded overflow-hidden">
      <img
        src={result.avatar}
        alt={result.name}
        className="w-16 h-16 object-cover"
      />
      <p className="dark:text-white font-semibold">{result.name}</p>
    </div>
  );
};

export const getPoster = (posters = []) => {
  const { length } = posters;

  if (!length) return null;
  // if poster has more than 2 items then selecting second poster,
  if (length > 2) return posters[1];

  // otherwise selecting first poster
  return posters[0];
};

export const convertReviewCount = (count = 0) => {
  if (count <= 999) return count;

  return parseFloat(count / 1000).toFixed(2) + "k";
};

export const OTP_LENGTH = 6;
