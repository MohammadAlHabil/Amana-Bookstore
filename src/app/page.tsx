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
      <section
        className="relative flex items-center justify-center text-center 
             bg-cover bg-center bg-no-repeat h-[85vh] 
             rounded-3xl mb-16 shadow-2xl overflow-hidden border-2 border-white/20"
        style={{ backgroundImage: "url('/images/book-bg.jpg')" }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-blue-950/70 to-black/90" />

        {/* Background Shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-16 w-16 h-16 bg-yellow-400/20 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-blue-400/20 rounded-full animate-pulse"></div>
        </div>

        {/* Content */}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-white">
          <div className="mb-6">
            <div className="inline-block w-16 h-1 bg-gradient-to-r from-yellow-400 to-blue-800 rounded-full mb-4" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 sm:mb-8 leading-tight drop-shadow-2xl bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent">
            Welcome to the Amana Bookstore
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light leading-relaxed mb-8 sm:mb-10 drop-shadow-lg max-w-3xl mx-auto">
            Your one-stop shop for the best books. Discover new worlds and
            adventures waiting for you inside every page.
          </p>

          <div className="flex justify-center">
            <a
              href="#books"
              className="inline-flex items-center bg-blue-800 hover:bg-blue-700 
                   text-white font-semibold text-base px-8 py-4 
                   rounded-md transition-colors duration-200"
            >
              Browse Books
            </a>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
      </section>

      {/* Book Grid */}
      <section id="books">
        <BookGrid books={books} onAddToCart={handleAddToCart} />
      </section>
    </div>
  );
}
