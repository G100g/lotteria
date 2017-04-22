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

    this.state = {
      numbers,
      turnNumbers: shuffle(numbers),
      issuedNumber:[],
      animating: false
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

    const extractionDuration = 7000;

    if (this.state.animating) return;

    let remainingNumbers = this.state.turnNumbers.slice();
    const remainingNumbersLenght = remainingNumbers.length;

    remainingNumbers = remainingNumbers.concat(remainingNumbers, remainingNumbers, remainingNumbers);

    const shuoldIssue = remainingNumbers[remainingNumbers.length - 1];

    const totalAnimationNumbers = remainingNumbers.length;

    if (this.t) {
      this.t.stop();
    }

    this.t = new TWEEN.Tween({ pos: 0 })
                  .to({ pos: totalAnimationNumbers - 1 }, extractionDuration)
                  
    // this.t.interpolation( TWEEN.Interpolation.Linear );
    this.t.easing(TWEEN.Easing.Circular.Out);

    let _self = this;

    this.t.onUpdate(function (ttt) {
      
      let currentPos = Math.floor(this.pos) % remainingNumbersLenght;

      // console.log(currentPos);

      _self.setState({
        currentPos: _self.state.turnNumbers[currentPos]
      });
    });

    this.t.onComplete(() => {

      

      this.stop()
        .then(() => {
          console.log( shuoldIssue , this.state.currentPos )
          if( (shuoldIssue !== this.state.currentPos)) {
            console.error(shuoldIssue , this.state.currentPos);
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

    const number = this.state.turnNumbers.pop();
    this.state.issuedNumber.push(number);

    return new Promise(resolve => {
      this.setState({
        turnNumbers: shuffle(this.state.turnNumbers),
        issuedNumber: this.state.issuedNumber
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

    return (
      <div className="App">
        
        { this.state.numbers.map(n => <Number key={n} number={n} current={(this.state.currentPos === n) } issued={this.state.issuedNumber.indexOf(n) !== -1} />)}

      </div>
    );
  }
}

export default App;
