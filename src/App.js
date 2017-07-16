import React, { Component } from 'react';
import TWEEN from 'tween.js';

import Number from './Number';

import './App.css';

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

    const numbers = Array.apply(null, Array(100)).map( (e, i) => i+1);
    const turnNumbers = numbers.concat(numbers, numbers, numbers, numbers, numbers);

    this.state = {
      numbers,
      turnNumbers,
      issuedNumber: shuffle(numbers),
      animating: false,
      animationPos: 0,
      currentPos: 0
    };

    console.log(this.state)

    this.animate = this.animate.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown.bind(this));
    this.animate();
  }

  onKeyDown(e){
    // e.preventDefault();
    // start|stop on [space]

    switch(e.keyCode) {
      case 32:
        e.preventDefault();
        this[!this.state.animating ? 'start' : 'stop']();
      break;
    }

    // reset on [escape]
    //evt.keyCode === 27 && this.reset();
  }

  start() {

    const extractionDuration = 10000;

    if (this.state.animating) return;

    const randomNumber = this.state.issuedNumber.pop() - 1;
    const totalnumberLenght = this.state.turnNumbers.length - this.state.numbers.length; 

    const shuoldIssue = this.state.numbers[randomNumber];

    console.log("Will issued " + shuoldIssue, randomNumber);

    if (this.t) {
      this.t.stop();
    }

    this.t = new TWEEN.Tween({ pos: 0 })
                  .to({ pos: totalnumberLenght + randomNumber }, extractionDuration)
                  
    // // this.t.interpolation( TWEEN.Interpolation.Linear );
    // this.t.easing(TWEEN.Easing.Quadratic.InOut);
    this.t.easing(TWEEN.Easing.Exponential.InOut);
    // this.t.easing(TWEEN.Easing.Cubic.Out);

    let _self = this;

    this.t.onUpdate(function (delta) {
      
      let currentPos = Math.floor(this.pos);

      // console.log(currentPos);

      _self.setState({
        currentPos,
        animationPos: delta
      });
    });

    this.t.onComplete(() => {
      this.stop()
        .then(() => {
          console.log( shuoldIssue , this.state.currentPos )
          if( (shuoldIssue !== this.state.turnNumbers[this.state.currentPos])) {
            console.error(shuoldIssue , this.state.turnNumbers[this.state.currentPos]);
          }
          this.exctractNumber();
        })
        // .then(() => {
        //   if (this.state.issuedNumber.length < 100) {
        //     this.start();
        //   } else {
        //     console.log(this.state.issuedNumber.sort( (a, b) => a - b));
        //   }
        // })
    });

    this.setState({
      animating: true
    }, () => {
      this.t.start();
    });

  }

  stop() {

    console.log("stop")
    return new Promise(resolve => {
      this.setState({
        animating: false
      },resolve);
    });

  }

  exctractNumber() {

   // turnNumbers: shuffle(numbers),

    // const number = this.state.turnNumbers.pop();
    const number = this.state.turnNumbers[this.state.turnNumbers.currentPos];
    // this.state.issuedNumber.push(number);

    return new Promise(resolve => {
      this.setState({
        // turnNumbers: shuffle(this.state.turnNumbers),
        // issuedNumber: this.state.issuedNumber
      }, resolve);
    })
  }

  animate() {
    requestAnimationFrame(this.animate)
    
    if (this.state.animating) {
      TWEEN.update();      
    } 

  }

  render() {

    const timerAnimation = {
      // width: (this.state.animationPos * 100) + "%"
      transform: `scaleX(${this.state.animationPos})`
    };

    return (
      <div className="App">
        
        
        <div className="numbers">

          {/*{ this.state.currentPos }*/}

            {/*{ this.state.wheelNumbers.map(n => <Number key={n} number={n} />)}*/}
            <Number pos={this.state.currentPos} wheelNumbers={this.state.turnNumbers} offset={-4} />
            <Number pos={this.state.currentPos} wheelNumbers={this.state.turnNumbers} offset={-3} />
            <Number pos={this.state.currentPos} wheelNumbers={this.state.turnNumbers} offset={-2} />
            <Number pos={this.state.currentPos} wheelNumbers={this.state.turnNumbers} offset={-1} />
            <Number className="marker" pos={this.state.currentPos} wheelNumbers={this.state.turnNumbers} offset={0} />
            <Number pos={this.state.currentPos} wheelNumbers={this.state.turnNumbers} offset={1} />
            <Number pos={this.state.currentPos} wheelNumbers={this.state.turnNumbers} offset={2} />
            <Number pos={this.state.currentPos} wheelNumbers={this.state.turnNumbers} offset={3} />
            <Number pos={this.state.currentPos} wheelNumbers={this.state.turnNumbers} offset={4} />

            <div className="timer" style={timerAnimation}></div>


        </div>


      </div>
    );
  }
}

export default App;
