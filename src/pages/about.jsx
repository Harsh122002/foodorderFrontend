import React from "react";

export default function About() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-600 mt-32">
        About Us
      </h1>
      <div className="bg-white shadow-lg rounded-lg p-6 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Our Mission
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Our mission is to deliver high-quality products that bring joy and
              convenience to our customers. We are committed to continuous
              improvement and customer satisfaction.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Our Vision
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Our vision is to be the leading provider of innovative solutions
              in the industry, fostering a culture of excellence and integrity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
