// src/app/cart/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CartItem from '../components/CartItem';
import { books } from '../data/books';
import { Book, CartItem as CartItemType } from '../types';
import { ShoppingCart } from 'lucide-react';

export const TrashIcon = ({
  className = 'size-5',
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className={className}
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
    />
  </svg>
);

export default function CartPage() {
  const [cartItems, setCartItems] = useState<
    { book: Book; quantity: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load cart from localStorage
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const cart: CartItemType[] = JSON.parse(storedCart);
        const itemsWithBooks = cart
          .map((item) => {
            const book = books.find((b) => b.id === item.bookId);
            return book ? { book, quantity: item.quantity } : null;
          })
          .filter(
            (item): item is { book: Book; quantity: number } => item !== null,
          );

        setCartItems(itemsWithBooks);
      } catch (error) {
        console.error('Failed to parse cart from localStorage', error);
        setCartItems([]);
      }
    }
    setIsLoading(false);
  }, []);

  const updateQuantity = (bookId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    // Update local state
    const updatedItems = cartItems.map((item) =>
      item.book.id === bookId ? { ...item, quantity: newQuantity } : item,
    );
    setCartItems(updatedItems);

    // Update localStorage
    const cartForStorage = updatedItems.map((item) => ({
      id: `${item.book.id}-${Date.now()}`,
      bookId: item.book.id,
      quantity: item.quantity,
      addedAt: new Date().toISOString(),
    }));
    localStorage.setItem('cart', JSON.stringify(cartForStorage));

    // Notify navbar
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const removeItem = (bookId: string) => {
    // Update local state
    const updatedItems = cartItems.filter((item) => item.book.id !== bookId);
    setCartItems(updatedItems);

    // Update localStorage
    const cartForStorage = updatedItems.map((item) => ({
      id: `${item.book.id}-${Date.now()}`,
      bookId: item.book.id,
      quantity: item.quantity,
      addedAt: new Date().toISOString(),
    }));
    localStorage.setItem('cart', JSON.stringify(cartForStorage));

    // Notify navbar
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.book.price * item.quantity,
    0,
  );

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
          <span>{cartItems.length > 0 && `(${cartItems.length} items)`}</span>
        </div>
        {cartItems.length > 0 && (
          <button
            onClick={clearCart}
            className="flex items-center gap-1 bg-gray-100 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
            aria-label="Clear cart"
          >
            <TrashIcon className="size-5" />
            <span>Clear Cart</span>
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <h2 className="text-xl text-gray-600 mb-4">Your cart is empty</h2>
          <Link
            href="/"
            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md">
            {cartItems.map((item) => (
              <CartItem
                key={item.book.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
              />
            ))}
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center text-xl font-bold mb-4 text-gray-800">
              <span>Total: ${totalPrice.toFixed(2)}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/" className="flex items-center justify-center gap-1 flex-1 bg-blue-800 text-white text-center py-3 rounded-md hover:bg-blue-600 transition-colors cursor-pointer">
                Continue Shopping
                <ShoppingCart size={16} />
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
