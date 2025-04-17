import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
	
	tagTypes: ['Book', 'User', 'Review', 'Group', 'Cart', 'MLM', 'Post', 'Notification'],
	endpoints: (builder) => ({
		// ...endpoints
	}),
});
