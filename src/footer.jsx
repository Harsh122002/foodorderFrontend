import React from "react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { CiTwitter } from "react-icons/ci";
import { Link } from "react-router-dom";

export default function FooterFunction() {
  return (
<footer className="bg-[#343a40] text-white p-6 lg:py-20 lg:px-20 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
{/* Logo Section */}
      <article className="flex flex-row items-center gap-4">
        <img
          src="/logo.png"
          alt="Company Logo"
          className="lg:h-12 lg:w-12 lg:rounded-2xl rounded-md h-8 w-8"
        />
        <h2 className="text-lg w-36 lg:w-56 lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-violet-500">
          HR FOOD
        </h2>
      </article>

      {/* Address Section */}
      <article>
        <h2 className="text-xl font-semibold mb-1">Address</h2>
        <p>Shanteshwer Road, Joshipara, Junagadh</p>
      </article>

      {/* Contact Section */}
      <article>
        <h2 className="text-xl font-semibold mb-1">Contact</h2>
        <p>Email: chavada@gmail.com</p>
        <p>Phone: 8401247733</p>
      </article>

      {/* Social Media Section */}
      <article>
        <h2 className="text-xl font-semibold mb-2">Social Media</h2>
        <div className="flex gap-4">
          <Link
            to="https://www.facebook.com/"
            className="p-2 bg-white rounded-full text-[#3b5998] border border-[#3b5998] hover:bg-[#3b5998] hover:text-white transition-colors"
          >
            <FaFacebookF />
          </Link>
          <Link
            to="https://www.instagram.com/"
            className="p-2 bg-white rounded-full text-[#E1306C] border border-[#E1306C] hover:bg-[#E1306C] hover:text-white transition-colors"
          >
            <FaInstagram />
          </Link>
          <Link
            to="https://www.twitter.com/"
            className="p-2 bg-white rounded-full text-[#1DA1F2] border border-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white transition-colors"
          >
            <CiTwitter />
          </Link>
        </div>
      </article>
    </footer>
  );
}
