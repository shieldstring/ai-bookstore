export const calculateCartTotals = (cartState) => {
    cartState.subtotal = cartState.items.reduce(
      (sum, item) => sum + (item.price * item.quantity), 0
    );
    cartState.tax = cartState.subtotal * 0.08; // 8% tax
    cartState.shipping = cartState.subtotal > 50 ? 0 : 4.99;
    cartState.total = cartState.subtotal + cartState.tax + cartState.shipping;
  };
  
  export const prepareCartForServer = (cartItems) => {
    return cartItems.map(item => ({
      productId: item.id,
      quantity: item.quantity,
      // Include any other necessary fields
    }));
  };