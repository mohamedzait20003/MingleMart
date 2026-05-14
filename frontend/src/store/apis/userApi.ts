import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { RootState } from '../index';
import type { UpdatePictureRequest, UpdatePictureResponse } from '../types/userTypes';

const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/user`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
  }),
  endpoints: (builder) => ({
    updatePicture: builder.mutation<UpdatePictureResponse, UpdatePictureRequest>({
      query: ({ picture }) => {
        const formData = new FormData();
        formData.append('ImageFile', picture);
        
        return {
          url: 'update-picture',
          method: 'PUT',
          body: formData,
        };
      },
    }),
  }),
});

export default userApi;
export const { useUpdatePictureMutation } = userApi;