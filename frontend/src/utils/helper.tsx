const BACKEND_URL = "http://localhost:8000";

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

export const renderItem = (result: { id: string; avatar: string; name: string }) => {
  return (
    <div key={result.id} className="flex space-x-2 rounded overflow-hidden">
      <img
        src={`${BACKEND_URL}${result.avatar}xxx`}
        alt={result.name}
        className="w-16 h-16 object-cover"
      />
      <p className="dark:text-white font-semibold">{result.name}</p>
    </div>
  );
};

export const getPoster = (posters: string[] = []) => {
  const { length } = posters;
  if (!length) return ""; 

  let posterPath = posters[0];
  if (length > 2) {
    posterPath = posters[1];
  }

  if (!posterPath) return "";
  return `${BACKEND_URL}${posterPath}`;
};

export const convertReviewCount = (count = 0) => {
  if (count <= 999) return count;

  return parseFloat(count / 1000).toFixed(2) + "k";
};

export const OTP_LENGTH = 4;

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};
