import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../utils';

export const apiOne = createApi({
	reducerPath: 'apiOne',
	baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
	endpoints: (builder) => ({
		// ...endpoints
	}),
});

export const apiTwo = createApi({
	reducerPath: 'apiTwo',
	baseQuery: fetchBaseQuery({
		baseUrl: BASE_URL,
		prepareHeaders: (headers, { getState }) => {
			const token = getState().auth.userInfo.token;
			if (token) {
				headers.set('authorization', `Bearer ${token}`);
			}

			return headers;
		},
	}),
	endpoints: (builder) => ({
		// ...endpoints
	}),
});
