import { createContext, useContext, useReducer, useEffect, useCallback } from "react";

const CartContext = createContext();

const CART_STORAGE_KEY = "game-controller-shop-cart";

const cartReducer = (state, action) => {
  switch (action.type) {
    case "LOAD_CART": {
      return { ...state, items: action.payload };
    }
    case "ADD_ITEM": {
      const existingItem = state.items.find((item) => item._id === action.payload._id);
      if (existingItem) {
        // Check stock when incrementing quantity
        const newQuantity = existingItem.quantity + 1;
        if (action.payload.stock !== undefined && newQuantity > action.payload.stock) {
          return state; // Don't add if exceeds stock
        }
        return {
          ...state,
          items: state.items.map((item) =>
            item._id === action.payload._id
              ? { ...item, quantity: newQuantity }
              : item
          ),
        };
      }
      // Check stock for new item
      if (action.payload.stock !== undefined && action.payload.stock < 1) {
        return state; // Don't add if out of stock
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
    }
    case "REMOVE_ITEM": {
      return {
        ...state,
        items: state.items.filter((item) => item._id !== action.payload),
      };
    }
    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item._id !== id),
        };
      }
      // Check stock when updating quantity
      const item = state.items.find((i) => i._id === id);
      if (item && item.stock !== undefined && quantity > item.stock) {
        return state; // Don't update if exceeds stock
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item._id === id ? { ...item, quantity } : item
        ),
      };
    }
    case "CLEAR_CART": {
      return { ...state, items: [] };
    }
    default:
      return state;
  }
};

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        dispatch({ type: "LOAD_CART", payload: JSON.parse(savedCart) });
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [state.items]);

  const addToCart = useCallback((product) => {
    // product should include stock info
    dispatch({ type: "ADD_ITEM", payload: product });
  }, []);

  const removeFromCart = useCallback((productId) => {
    dispatch({ type: "REMOVE_ITEM", payload: productId });
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id: productId, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const getTotalItems = useCallback(() => {
    return state.items.reduce((sum, item) => sum + item.quantity, 0);
  }, [state.items]);

  const getTotalPrice = useCallback(() => {
    return state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [state.items]);

  const isInCart = useCallback((productId) => {
    return state.items.some((item) => item._id === productId);
  }, [state.items]);

  const getCartItemQuantity = useCallback((productId) => {
    const item = state.items.find((item) => item._id === productId);
    return item ? item.quantity : 0;
  }, [state.items]);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        isInCart,
        getCartItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}