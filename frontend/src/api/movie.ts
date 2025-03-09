import { AxiosResponse, CancelToken, CancelTokenSource } from "axios";
import { catchError, getToken } from "../utils/helper";
import client from "./client";

// export const uploadTrailer = async (formData, onUploadProgress) => {
//   const token = getToken();
//   try {
//     const { data } = await client.post("/movie/upload-trailer", formData, {
//       headers: {
//         authorization: `Bearer ${token}`,
//         "content-type": "multipart/form-data",
//       },
//       onUploadProgress: ({ loaded, total }) => {
//         if (onUploadProgress)
//           onUploadProgress(Math.floor((loaded / total) * 100));
//       },
//     });
//     return data;
//   } catch (error) {
//     return catchError(error);
//   }
// };

export const createMovie = async (formData, onUploadProgress) => {
  const token = getToken();
  try {
    const { data } = await client.post("/movie/create", formData, {
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "multipart/form-data",
      },
      onUploadProgress: ({ loaded, total }) => {
        if (onUploadProgress)
          onUploadProgress(Math.floor((loaded / total) * 100));
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

// export const uploadMovie = async (formData) => {
//   const token = getToken();
//   try {
//     const { data } = await client.post("/movie/create", formData, {
//       headers: {
//         authorization: `Bearer ${token}`,
//         "content-type": "multipart/form-data",
//       },
//     });
//     return data;
//   } catch (error) {
//     return catchError(error);
//   }
// };

export const getMovieForUpdate = async (id) => {
  const token = getToken();
  try {
    const { data } = await client.get("/movie/for-update/" + id, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const updateMovie = async (id, formData) => {
  const token = getToken();
  try {
    const { data } = await client.patch("/movie/update/" + id, formData, {
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const getMovies = async (pageNo, limit) => {
  const token = getToken();
  try {
    const { data } = await client.get(
      `/movie/movies?pageNo=${pageNo}&limit=${limit}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
          "content-type": "multipart/form-data",
        },
      }
    );
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const deleteMovie = async (id) => {
  const token = getToken();
  try {
    const { data } = await client.delete(`/movie/${id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const searchMovieForAdmin = async (title) => {
  const token = getToken();
  try {
    const { data } = await client.get(`/movie/search?title=${title}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const getTopRatedMovies = async (genre = "") => {
  try {
    let endpoint = "/movie/top-rated";
    if (genre) {
      endpoint = endpoint + `?genre=${genre}`;
    }

    const { data } = await client.get(endpoint);
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const getLatestUploads = async () => {
  try {
    const response = await client.get("/movie/latest-uploads");
    return response.data;
  } catch (error) {
    return catchError(error);
  }
};

export const getMoviesByTag = async (tag, limit = 5) => {
  try {
    const response = await client.get(
      `/movie/by-tag?tag=${tag}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    return catchError(error);
  }
};

export const getSingleMovie = async (id) => {
  try {
    const { data } = await client.get("/movie/single/" + id);
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const getRelatedMovies = async (id) => {
  try {
    const { data } = await client.get("/movie/related/" + id);
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const searchPublicMovies = async (title) => {
  try {
    const { data } = await client.get("/movie/search-public?title=" + title);
    return data;
  } catch (error) {
    return catchError(error);
  }
};
