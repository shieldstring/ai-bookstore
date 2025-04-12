import React from 'react';
import { Helmet } from 'react-helmet-async';
export default function SEO({ title, description, name, image, type,  url = window.location.href,  }) {
	return (
		<Helmet>
			{/* Standard metadata tags */}
			<title>{title}</title>
			<meta name="description" content={"Join our community of book lovers, discover new books, join reading groups, and earn rewards through our MLM program."} />
			<meta name="keywords" content={"books, e-commerce, social network, reading, MLM, rewards"} />
			<meta name="robots" content="index, follow" />
			{/* End standard metadata tags */}
			{/* Facebook tags */}
			<meta property="og:type" content={"website"} />
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta property="og:image" content={image} />
			{/* End Facebook tags */}
			{/* Twitter tags */}
			<meta name="twitter:creator" content={name} />
			<meta name="twitter:card" content={"website"} />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={description} />
			<meta property="twitter:image" content={image} />
			{/* End Twitter tags */}
			{/* Canonical URL */}
			<link rel="canonical" href={url} />
		</Helmet>
	);
}
