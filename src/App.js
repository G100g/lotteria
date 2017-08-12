import React, { Component } from "react";

import io from 'socket.io-client';

import TWEEN from "tween.js";
import beepAudio from '../assets/beep.mp4';



import Number from "./Number";

import "./App.css";

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

class App extends Component {
  constructor(props) {
    super(props);

    const numbers = shuffle(Array.apply(null, Array(100)).map((e, i) => i + 1));
    const turnNumbers = numbers.concat(
      numbers,
      numbers,
      numbers,
      numbers,
      numbers
    );

    this.state = {
      numbers,
      turnNumbers,
      issuedNumber: shuffle(numbers),
      animating: false,
      animationPos: 0,
      currentPos: 0,
      lastIssuedNumber: 0
    };

    this.animate = this.animate.bind(this);

    this.audio = new Audio(beepAudio);

    this.io = io('http://raspberrypi.local:8080');
    this.io.on('button', (buttons) => {
      console.log(buttons)

      if (buttons.button1 && buttons.button1 === 1) {
        // this.start();
        this[!this.state.animating ? "start" : "stop"]();
        
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
        default:
    }

    // reset on [escape]
    //evt.keyCode === 27 && this.reset();
  }

  onDblClick() {
    this[!this.state.animating ? "start" : "stop"]();
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

      if ((lastPos === null || lastPos !== currentPos) && delta - lastDelta >= minPlayDistance) {
        lastPos = currentPos
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
        if (shuoldIssue !== this.state.turnNumbers[this.state.currentPos]) {
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
        lastIssuedNumber: randomNumber
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
      <div className="App">
        <div className="numbers">
          {/*{ this.state.currentPos }*/}

          {/*{ this.state.wheelNumbers.map(n => <Number key={n} number={n} />)}*/}
          <Number
            pos={this.state.currentPos}
            wheelNumbers={this.state.turnNumbers}
            offset={-4}
          />
          <Number
            pos={this.state.currentPos}
            wheelNumbers={this.state.turnNumbers}
            offset={-3}
          />
          <Number
            pos={this.state.currentPos}
            wheelNumbers={this.state.turnNumbers}
            offset={-2}
          />
          <Number
            pos={this.state.currentPos}
            wheelNumbers={this.state.turnNumbers}
            offset={-1}
          />
          <Number
            className="marker"
            pos={this.state.currentPos}
            wheelNumbers={this.state.turnNumbers}
            offset={0}
          />
          <Number
            pos={this.state.currentPos}
            wheelNumbers={this.state.turnNumbers}
            offset={1}
          />
          <Number
            pos={this.state.currentPos}
            wheelNumbers={this.state.turnNumbers}
            offset={2}
          />
          <Number
            pos={this.state.currentPos}
            wheelNumbers={this.state.turnNumbers}
            offset={3}
          />
          <Number
            pos={this.state.currentPos}
            wheelNumbers={this.state.turnNumbers}
            offset={4}
          />

          <div className="timer" style={timerAnimation} />
        </div>

        <div className="wheel__container">
          <div className={`wheel__figure ${wheelFigureClass}`} />
        </div>
      </div>
    );
  }
}

export default App;
