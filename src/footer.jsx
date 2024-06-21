import React from "react";

export default function FooterFunction() {
  return (
    <footer className="bg-gray-800 text-white p-6">
      <div className="container mx-auto text-center">
        <h2 className="text-2xl font-bold mb-2">Company Name: XYZ</h2>
        <p className="mb-2">Address: XYZ</p>
        <p className="mb-2">Contact: 8401113378</p>
        <p>
          Email:{" "}
          <a href="mailto:xyz@gmail.com" className="underline text-blue-300">
            xyz@gmail.com
          </a>
        </p>
        <br />
        <hr />
        <h5>CopyRight@2024-Make Harsh Chavada</h5>
      </div>
    </footer>
  );
}
