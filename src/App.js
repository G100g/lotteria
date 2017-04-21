import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Number from './Number';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      numbers: Array.apply(null, Array(100)).map( (e, i) => i+1),
      animating: false
    };

    this.animate = this.animate.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown.bind(this));
    this.animate();
  }

  onKeyDown(evt){
    // evt.preventDefault();
    // start|stop on [space]
    evt.keyCode === 32 && this[!this.state.animating ? 'start' : 'stop']();
    // reset on [escape]
    //evt.keyCode === 27 && this.reset();
  }

  start() {

    this.setState({
      animating: true
    });
    console.log("Start")

  }

  stop() {

    console.log("stop")

    this.setState({
      animating: false
    });

  }

  animate() {

    if (this.state.animating) {
      console.log("Rumble");      
    } 

    requestAnimationFrame(this.animate)

  }

  render() {

    

    return (
      <div className="App">
        
        { this.state.numbers.map(n => <Number key={n} number={n} />)}

      </div>
    );
  }
}

export default App;
