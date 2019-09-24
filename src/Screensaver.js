import React, { useState, useEffect } from "react";
import { shuffle } from "./libs/array";

let SI;
const SLIDE_INTERVAL = 10000;

const Screensaver = () => {
    const [slideIndex, setSlideIndex] = useState(0);
    const [slides, setSlides] = useState([]);
    useEffect(() => {
        console.log("Loading slides...");
        fetch("/screensaver/slides.json")
            .then(res => res.json())
            .then(({ slides }) => {
                setSlides(shuffle(slides));
            })
            .catch(e => {
                console.log(e);
            });
    }, []);
    useEffect(() => {
        SI = setTimeout(() => {
            let nextIndex =
                slideIndex === slides.length - 1 ? 0 : slideIndex + 1;
            setSlideIndex(nextIndex);
        }, SLIDE_INTERVAL);

        return () => {
            clearTimeout(SI);
        };
    });

    return (
        slides &&
        slides.length && (
            <div className="screen-saver">
                <img src={slides[slideIndex]} />
            </div>
        )
    );
};

export default Screensaver;
