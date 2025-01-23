import React, { useState } from 'react'
import { createRoot } from 'react-dom/client';

const reactBlocks = document.querySelectorAll('.react-block');
if (reactBlocks) {
  reactBlocks.forEach((block) =>{
    const root = createRoot(block);
    root.render(<ReactBlock />);
  })
}

export function ReactBlock() {
  const [step, setStep] = useState(0);

  const handleClick = () => {
    setStep((prev) => prev + 1); // Correct the increment logic
  };

  return (
    <div className="asd">
      <button onClick={handleClick}>
        Click
      </button>
      <p>Clicked: {step}</p>
    </div>
  );
}