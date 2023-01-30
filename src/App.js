import logo from './logo.svg';
import React, {Component} from 'react';
import Ball from './components/Ball.js';

import './App.css';


class App extends Component {
  constructor(props){
    super(props)

    this.radius = 1.5;
    this.movementSpeed = 4;

    this.state = {
      ballPosition : {
        x: 100,
        y: 80,
      },
      directionDeg: 20,
    }
  }

  tick() {
    const directionRad = this.state.directionDeg / 180 * Math.PI;

    let newPosition = {
      x: this.state.ballPosition.x + this.movementSpeed * Math.cos(directionRad),
      y: this.state.ballPosition.y + this.movementSpeed * Math.sin(directionRad)
    };

    if (newPosition.x - this.radius <= 0) {
      this.setState((state) => ({
        directionDeg: 180 - state.directionDeg,
      }));
    }
    if (newPosition.x + this.radius >= 200) {
      this.setState((state) => ({
        directionDeg: 180 - state.directionDeg,
      }));
    }
    if (newPosition.y - this.radius <= 0) {
      this.setState((state) => ({
        directionDeg: 360 - state.directionDeg,
      }));
    }
    if (newPosition.y + this.radius >= 200) {
      this.setState((state) => ({
        directionDeg: 360 - state.directionDeg,
      }));
    }

    this.setState((state) => ({
      ballPosition: newPosition
    }));
    //console.log('tick', this.state.ballPosition.x, this.state.ballPosition.y, this.state.ballPosition.x + this.movementSpeed * Math.cos(this.state.direction));
  }    

  moveMouse(e) {
    console.log(e.screenX, e.screenY);      
  }


  componentDidMount() {
    this.mouseEventListener = window.addEventListener('mousemove', this.moveMouse);
    this.updateTimer = setInterval(() => { this.tick() }, 1000 / 60);
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.mouseEventListener);
    this.mouseEventListener = null;
    clearInterval(this.updateTimer);
    this.updateTimer = null;

  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className='svg-scaling-container'>
            <svg viewBox='0 0 200 200'>
              <Ball x={this.state.ballPosition.x} y={this.state.ballPosition.y} size={2*this.radius}/>
            </svg>
          </div>

          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
