// src/app/page.tsx
'use client';

import BookGrid from './components/BookGrid';
import { books } from './data/books';
import { CartItem } from './types';

export default function HomePage() {
  // Simple cart handler for demo purposes
  // const handleAddToCart = (bookId: string) => {
  //   console.log(`Added book ${bookId} to cart`);
  //   // Here you would typically dispatch to a cart state or call an API

  // };
  const handleAddToCart = (bookId: string) => {
    const book = books.find((b) => b.id === bookId);
    if (!book) return;

    const cartItem: CartItem = {
      id: `${book.id}-${Date.now()}`,
      bookId: book.id,
      quantity: 1,
      addedAt: new Date().toISOString(),
    };

    // Retrieve existing cart from localStorage
    const storedCart = localStorage.getItem('cart');
    const cart: CartItem[] = storedCart ? JSON.parse(storedCart) : [];

    // Check if the book is already in the cart
    const existingItemIndex = cart.findIndex((item) => item.bookId === book.id);

    if (existingItemIndex > -1) {
      // Update quantity if item already exists
      cart[existingItemIndex].quantity += 1;
    } else {
      // Add new item to cart
      cart.push(cartItem);
    }

    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Dispatch a custom event to notify the Navbar
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <section className="text-center bg-blue-100 p-8 rounded-lg mb-12 shadow-md">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
          Welcome to the Amana Bookstore!
        </h1>
        <p className="text-lg text-gray-600">
          Your one-stop shop for the best books. Discover new worlds and
          adventures.
        </p>
      </section>

      {/* Book Grid */}
      <BookGrid books={books} onAddToCart={handleAddToCart} />
    </div>
  );
}
