import React from "react";

export default function About() {
  return (
    <div className="container flex flex-col bg-[#c4b4a5] items-center justify-center h-[100vh] mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-[#343a40] ">
        About Us
      </h1>
      <div className="bg-[#a19182] text-white  w-[80%]  shadow-lg rounded-lg p-6 lg:p-12">
        <div className="grid  grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4 ">
              Our Mission
            </h2>
            <p className="leading-relaxed">
              Our mission is to deliver high-quality products that bring joy and convenience to our customers. We are committed to continuous improvement and customer satisfaction. With a passion for excellence and a customer-first mindset, we strive to exceed expectations in everything we do. From sourcing the finest ingredients to ensuring timely delivery, every step of our process is driven by care, integrity, and innovation. We believe in building lasting relationships with our customers by consistently offering value, quality, and trust.
            </p>

          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4 ">
              Our Vision
            </h2>
            <p className="leading-relaxed">
              Our vision is to be the leading provider of innovative solutions in the industry, fostering a culture of excellence and integrity. We aim to revolutionize the way people experience our services by embracing cutting-edge technology, sustainable practices, and a deep understanding of our customers' needs. Through collaboration, creativity, and an unwavering commitment to quality, we envision a future where our brand sets the standard for reliability, innovation, and positive impact on both society and the environment.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}


