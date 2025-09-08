import type { Metadata } from "next";
import Navbar from './components/Navbar';
import "./globals.css";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});



export const metadata: Metadata = {
  title: 'Amana Bookstore',
  description: 'A modern online bookstore built with Next.js and Tailwind CSS.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // NOTE: In a real-world application, cart state would be managed globally using
  // Context API or a state management library like Zustand or Redux.
  // The cart item count for the Navbar is managed on the client-side within the component itself
  // to adhere to the project's constraint of not using Context API.
  // Each page interacting with the cart will manage its state via localStorage.

  return (
    <html lang="en" className={playfair.variable} >
      <body className={` antialiased bg-gray-50 pt-16`}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
