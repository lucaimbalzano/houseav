import React, { useState, useEffect } from "react";

export default function Toggle() {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    // Effect to update the state of isChecked when the component mounts
    const checkbox = document.getElementById("toggle");
    setIsChecked(checkbox.checked);

    // Cleanup function to remove event listener
    return () => {
      checkbox.removeEventListener("change", handleChange);
    };
  }, []);

  const handleChange = (e) => {
    // Handle checkbox change event
    setIsChecked(e.target.checked);
  };

  return (
    <div>
      <div className="flex items-center justify-center">
        <input
          type="checkbox"
          id="toggle"
          className="sr-only"
          checked={isChecked}
          onChange={handleChange}
        />
        <label
          htmlFor="toggle"
          className="relative block w-10 h-6 rounded-full bg-gray-300 cursor-pointer"
        >
          <span
            className={
              "block shadow-md rounded-full w-5 h-5 bg-white absolute top-0 left-0 mt-0.5 ml-0.5 transition-transform duration-300 ease-in-out" +
              (isChecked ? " transform translate-x-full" : "")
            }
          ></span>
        </label>
      </div>
    </div>
  );
}
