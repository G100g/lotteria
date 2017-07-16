import React from "react";
import "./Number.css";

export default function Number({ pos, wheelNumbers, offset, className }) {
  let cn = `Number ${className || ""}`;

  let currentPosition = pos + offset;
  const number = wheelNumbers[currentPosition];

  return (
    <div className={cn}>
      {number}
    </div>
  );
}
