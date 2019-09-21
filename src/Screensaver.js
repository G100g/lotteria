import React, { useState, useEffect } from "react";

let SI;

const Screensaver = ({ slides }) => {
    const [slideIndex, setSlideIndex] = useState(0);
    useEffect(() => {
        SI = setTimeout(() => {
            let nextIndex =
                slideIndex === slides.length - 1 ? 0 : slideIndex + 1;
            setSlideIndex(nextIndex);
        }, 10000);

        return () => {
            clearTimeout(SI);
        };
    });

    return (
        <div className="screen-saver">
            <img src={slides[slideIndex]} />
        </div>
    );
};

export default Screensaver;
