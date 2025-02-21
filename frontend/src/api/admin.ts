import { catchError, getToken } from '../utils/helper';
import client from './client';

export const getAppInfo = async () => {
  try {
    const token = getToken();
    const { data } = await client.get('/admin/app-info', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const getMostRatedMovies = async () => {
  try {
    const token = getToken();
    const { data } = await client.get('/admin/most-rated', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};
