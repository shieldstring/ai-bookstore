import React from 'react';
import { Helmet } from 'react-helmet-async';
export default function SEO({ title, description, name, image, type,  url = window.location.href,  }) {
	return (
		<Helmet>
			{/* Standard metadata tags */}
			<title>{title}</title>
			<meta name="description" content={description || "Discover transformational books, interactive courses, and community insights curated by Wisdom Peters to elevate your faith, mindset, purpose, and business."} />
			<meta name="keywords" content="Wisdom Peters, books, e-commerce, social network, reading, MLM, rewards, courses, mindset, theology" />
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
