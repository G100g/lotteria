import React, { Component } from "react";

import io from "socket.io-client";

import TWEEN from "tween.js";
import beepAudio from "../assets/beep.mp4";
import beepAudioWav from "../assets/beep.wav";

import People from "./People";

import "./WheelEngine.css";

function shuffle(originalArray) {
    let array = originalArray.slice();
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

const Winner = ({ person, resultNumber }) => {
    return (
        <span>
            {person &&
                person.name.split(" ").map(str => (
                    <span>
                        {str}
                        <br />
                    </span>
                ))}
        </span>
    );
};

class WheelEngine extends Component {
    constructor(props) {
        super(props);

        const numbers = this.generateNumbers(props.people.length);
        const turnNumbers = this.generateTurnsNumbers(numbers);

        this.state = {
            numbers,
            turnNumbers,
            issuedNumber: shuffle(numbers),
            animating: false,
            animationPos: 0,
            currentPos: 0,
            lastIssuedNumber: 0,
            showResult: false,
            serie: 0
        };

        this.animate = this.animate.bind(this);

        const a = document.createElement("audio");
        if (
            !!(a.canPlayType && a.canPlayType("audio/mpeg;").replace(/no/, ""))
        ) {
            this.audio = new Audio(beepAudioWav);
        } else {
            this.audio = new Audio(beepAudio);
        }

        this.io = io({
            path: "/interface"
        });
        this.io.on("button", buttons => {
            console.log(buttons);

            if (buttons.button1 && buttons.button1 === 1) {
                // this.start();
                this[!this.state.animating ? "start" : "stop"]();
            }

            if (buttons.button2 && buttons.button2 === 1) {
                // this.start();
                this.changeSerie();
            }
        });
    }

    componentDidMount() {
        window.addEventListener("keydown", this.onKeyDown.bind(this));
        window.addEventListener("dblclick", this.onDblClick.bind(this));
        this.animate();
    }

    onKeyDown(e) {
        // e.preventDefault();
        // start|stop on [space]

        switch (e.keyCode) {
            case 32:
                e.preventDefault();
                this[!this.state.animating ? "start" : "stop"]();
                break;
            case 83:
                this.changeSerie();
                break;
            default:
        }

        // reset on [escape]
        //evt.keyCode === 27 && this.reset();
    }

    onDblClick() {
        this[!this.state.animating ? "start" : "stop"]();
    }

    generateNumbers(total) {
        return shuffle(Array.apply(null, Array(total)).map((e, i) => i));
    }

    generateTurnsNumbers(numbers) {
        let moreNumbers = [];
        for (let i = 0; i < 500 / numbers.length; i++) {
            moreNumbers = moreNumbers.concat(numbers);
        }

        return moreNumbers;
    }

    reset() {
        return new Promise((resolve, reject) => {
            const numbers = this.generateNumbers(this.props.people.length);
            const turnNumbers = this.generateTurnsNumbers(numbers);

            this.setState(
                {
                    numbers,
                    turnNumbers,
                    issuedNumber: shuffle(numbers),
                    animating: false,
                    animationPos: 0,
                    currentPos: 0,
                    lastIssuedNumber: 0,
                    showResult: false
                },
                resolve
            );
        });
    }

    /**
     *
     * This function update the color series changing the background color, and resetting the numbers
     *
     * @memberof App
     */
    changeSerie() {
        this.reset().then(() => {
            // UPdatedig brackgorunf color by array definition

            let next = this.state.serie + 1;

            if (next > 7) {
                next = 0;
            }

            this.setState({
                serie: next
            });
        });
    }

    start() {
        const extractionDuration = 18100;

        if (this.state.animating) return;

        const randomNumber = this.state.issuedNumber.pop() - 1;
        const totalnumberLenght =
            this.state.turnNumbers.length - this.state.numbers.length;

        const shuoldIssue = this.state.numbers[randomNumber];

        console.log("Will issued " + shuoldIssue, randomNumber);

        if (this.t) {
            this.t.stop();
        }

        this.t = new TWEEN.Tween({ pos: this.state.lastIssuedNumber }).to(
            { pos: totalnumberLenght + randomNumber },
            extractionDuration
        );

        // // this.t.interpolation( TWEEN.Interpolation.Linear );
        // this.t.easing(TWEEN.Easing.Quadratic.InOut);
        this.t.easing(TWEEN.Easing.Exponential.InOut);
        // this.t.easing(TWEEN.Easing.Cubic. Out);

        let _self = this;
        let lastPos = null;
        let minPlayDistance = 0.001;
        let lastDelta = 0;

        this.t.onUpdate(function(delta) {
            let currentPos = Math.floor(this.pos);

            if (
                (lastPos === null || lastPos !== currentPos) &&
                delta - lastDelta >= minPlayDistance
            ) {
                lastPos = currentPos;
                _self.audio.play();
                // console.log(delta - lastDelta, minPlayDistance, (delta - lastDelta >= minPlayDistance))

                lastDelta = delta;
            }

            _self.setState({
                currentPos,
                animationPos: delta
            });
        });

        this.t.onComplete(() => {
            this.stop().then(() => {
                // console.log(shuoldIssue, this.state.currentPos);
                this.setState({
                    lastIssuedNumber: randomNumber,
                    resultNumber: this.state.turnNumbers[this.state.currentPos],
                    showResult: true
                });

                if (
                    shuoldIssue !==
                    this.state.turnNumbers[this.state.currentPos]
                ) {
                    console.error(
                        shuoldIssue,
                        this.state.turnNumbers[this.state.currentPos]
                    );
                }
                // this.exctractNumber();
            });
            // .then(() => {
            //   if (this.state.issuedNumber.length < 100) {
            //     this.start();
            //   } else {
            //     console.log(this.state.issuedNumber.sort( (a, b) => a - b));
            //   }
            // })
        });

        this.setState(
            {
                animating: true,
                // lastIssuedNumber: randomNumber,
                showResult: false
            },
            () => {
                this.t.start();
            }
        );
    }

    stop() {
        console.log("stop");
        return new Promise(resolve => {
            this.setState(
                {
                    animating: false
                },
                resolve
            );
        });
    }

    // exctractNumber() {
    //   // turnNumbers: shuffle(numbers),

    //   // const number = this.state.turnNumbers.pop();
    //   // const number = this.state.turnNumbers[this.state.turnNumbers.currentPos];
    //   // this.state.issuedNumber.push(number);

    //   return new Promise(resolve => {
    //     this.setState(
    //       {
    //         // turnNumbers: shuffle(this.state.turnNumbers),
    //         // issuedNumber: this.state.issuedNumber
    //       },
    //       resolve
    //     );
    //   });
    // }

    animate() {
        requestAnimationFrame(this.animate);

        if (this.state.animating) {
            TWEEN.update();
        }
    }

    render() {
        const timerAnimation = {
            // width: (this.state.animationPos * 100) + "%"
            transform: `scaleX(${this.state.animationPos})`
        };

        const wheelFigureClass = this.state.animating
            ? "wheel__figure wheel__figure--start-rotation"
            : "";

        return (
            <div className="App" data-serie={this.state.serie}>
                <div className="numbers">
                    {/*{ this.state.currentPos }*/}

                    {[-3, -2, -1, 0, 1, 2, 3].map(n => (
                        <People
                            key={n}
                            className={n === 0 ? "marker" : ""}
                            pos={this.state.currentPos}
                            person={
                                this.props.people[
                                    this.state.turnNumbers[
                                        this.state.currentPos + n
                                    ]
                                ]
                            }
                            wheelNumbers={this.state.turnNumbers}
                            offset={n}
                        />
                    ))}

                    {/* <div className="timer" style={timerAnimation} /> */}
                </div>

                <div className="wheel__container">
                    <div className={`wheel__figure ${wheelFigureClass}`} />
                </div>

                <div
                    className={`issuedNumber ${
                        this.state.showResult ? "issuedNumber--visible" : ""
                    }`}
                >
                    <Winner
                        resultNumber={this.state.resultNumber}
                        person={this.props.people[this.state.resultNumber]}
                    />
                </div>
            </div>
        );
    }
}

export default WheelEngine;
