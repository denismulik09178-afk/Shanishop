import { createContext, useContext, useEffect, useState } from "react";
import { Perfume } from "@workspace/api-client-react";

export interface CartItem {
  perfume: Perfume;
  ml: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (perfume: Perfume, ml: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("maison_noir_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("maison_noir_cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (perfume: Perfume, ml: number) => {
    setItems(prev => [...prev, { perfume, ml }]);
  };

  const removeFromCart = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + (item.perfume.price_per_ml * item.ml), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
