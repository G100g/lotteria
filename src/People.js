import React from "react";
import "./People.css";

export default function People({
    pos,
    wheelNumbers,
    person: { name = "" } = {},
    offset,
    className
}) {
    let cn = `People ${className || ""}`;

    let currentPosition = pos + offset;
    const number = wheelNumbers[currentPosition];

    return (
        <div className={cn} title={{ number }}>
            {`${name}`}
        </div>
    );
}
