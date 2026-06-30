const normalizeProduct = (data, format = "Book") => ({
  title: data.title,
  name: data.title,
  image: data.image || "/default-book-cover.jpg",
  price: data.price || 0,
  author: data.author || "Unknown",
  format: data.format || format,
});

export async function fetchProductDetails(baseUrl, productId, currency = "GBP") {
  const currencyParam = `?currency=${currency}`;
  const bookResponse = await fetch(`${baseUrl}books/${productId}${currencyParam}`);
  if (bookResponse.ok) {
    const bookDetails = await bookResponse.json();
    return normalizeProduct(bookDetails.data);
  }

  const courseResponse = await fetch(`${baseUrl}courses/${productId}${currencyParam}`);
  if (courseResponse.ok) {
    const courseDetails = await courseResponse.json();
    return normalizeProduct(courseDetails.data, "Course");
  }

  throw new Error("Failed to fetch product details");
}

export async function enrichCartItems(baseUrl, cartItems, currency = "GBP") {
  return Promise.all(
    cartItems.map(async (item) => {
      if (item.price && item.name && item.currency === currency) {
        return {
          ...item,
          name: item.name || item.title,
        };
      }

      const details = await fetchProductDetails(
        baseUrl,
        item.bookId || item.id,
        currency
      );
      return {
        ...item,
        ...details,
        currency,
      };
    })
  );
}
