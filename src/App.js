import React, { Component } from 'react';
import signature from './Signature.png';
import './App.css';
import Toggle from './toggle';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameStarted: false,
      strictMode: false,
      patternLength: 20,
      gamePattern: [],
      patternDisplay: true,
      patternPlace: null,
      turnNum: null,
      lightsOnArray: [false, false, false, false],
      soundOn: true,
      showSettings: false
    };
  }

  componentDidMount = () => {
    this.buttonSounds = [
      new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
      new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
      new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
      new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')
    ]
  }

  startGame = () => {
    const newGamePattern = Array.from({length: this.state.patternLength}, () => Math.floor(Math.random() * 4));
    this.setState({
      gameStarted: true,
      gamePattern: newGamePattern,
      patternPlace: 0,
      turnNum: 1,
      patternDisplay: true
    }, () => {
      setTimeout(() => {
        this.showPattern();
      }, 1000)
    });
    console.log(newGamePattern);
  }

  winGame = () => {
    console.log('winner!');
    this.setState({
      gameStarted: false,
      gamePattern: [],
      patternPlace: null,
      turnNum: null,
      lightsOnArray: [false, false, false, false]
    }, () => {
      this.setWinner();
      this.flashLights();
    })
  }

  endGame = () => {
    console.log('winner!');
    this.setState({
      gameStarted: false,
      gamePattern: [],
      patternPlace: null,
      turnNum: null,
      lightsOnArray: [false, false, false, false]
    })
  }

  toggleSettings = () => {
    this.setState({ showSettings: !this.state.showSettings });
  }

  showPattern = () => {
    if (this.state.patternDisplay) {
      if (this.state.patternPlace < this.state.turnNum) {
        this.turnOnLight(this.state.gamePattern[this.state.patternPlace], () => {
          console.log(this.state.gamePattern[this.state.patternPlace]);
          setTimeout(() => {
            this.setState({ patternPlace: this.state.patternPlace + 1 }, () => {
              this.showPattern();
            })
          }, 100)
        })
      } else {
        console.log('pattern done');
        this.setState({ 
          patternDisplay: false,
          patternPlace: 0
        });
      }
    }
  }

  strictMode = (value) => {
    this.setState({ strictMode: value });
  }

  soundMode = (value) => {
    this.setState({ soundOn: value });
  }

  turnOnLight = (light, callback) => {
    let newLightsArray = Array.from({length: 4}, () => {return false});
    newLightsArray[light] = true;
    
    // Turn the light on and then off again
    if (this.state.soundOn) {
      this.buttonSounds[light].play();
    }
    this.setState({ lightsOnArray: newLightsArray },
      () => {
        setTimeout(() => {
          this.setState({ lightsOnArray: Array.from({length: 4}, () => {return false}) }, () => {
            callback();
          });
        }, 500)
      }
    );

    if (!this.state.patternDisplay) {
      if (this.state.gamePattern[this.state.patternPlace] === light) {
        console.log('good job');
        if (this.state.patternPlace + 1 === this.state.turnNum) {
          if (this.state.turnNum === this.state.patternLength) {
            this.winGame();
          } else {
            this.setState({
              patternDisplay: true,
              patternPlace: 0,
              turnNum: this.state.turnNum + 1
            }, () => {
              console.log('next turn')
              setTimeout(() => {
                this.showPattern();
              }, 1000)
            })
          }
        } else {
          this.setState({
            patternPlace: this.state.patternPlace + 1
          })
        }
      } else {
        this.flashLights();
        if (this.state.strictMode) {
          this.startGame();
        } else {
          this.setState({
            patternDisplay: true,
            patternPlace: 0
          }, () => {
            this.showPattern();
          })
        }
      }
    }
  }

  flashLights = () => {
    const allLightsOnArray = Array.from({length: 4}, () => {return true});
    const allLightsOffArray = Array.from({length: 4}, () => {return false});
    console.log('flast the lights!');

    clearTimeout(this.lightsOn);

    for (let i = 1; i < 4; i++) {
      setTimeout(() => {
        this.setState({ lightsOnArray: allLightsOnArray })
      }, i * 250);
      setTimeout(() => {
        this.setState({ lightsOnArray: allLightsOffArray })
      }, (i * 250) + 100)
    }
  }

  setWinner = () => {
    this.setState({ winner: true }, () => {
      setTimeout(() => {
        this.setState({ winner: false });
      }, 3000);
    })
  }
  

  adjustPatternLength = (direction) => {
    if (direction === '+') {
      this.setState({
        patternLength: this.state.patternLength + 1
      });
    }
    if (direction === '-') {
      this.setState({
        patternLength: this.state.patternLength - 1
      });
    }
  }
  

  render() {
    let winner = (this.state.winner) ? (
      <div id="winner">
        <h1>WINNER!</h1>
      </div>
    ) : (
      null
    )

    let patternView = (this.state.gameStarted) ? (
      <div id="pattern-view-container">
        {
          this.state.gamePattern.map((object, i) => {
            let classes = ['pattern-spot'];

            if (this.state.patternDisplay) {
              classes.push('computer');
            }
            if (this.state.turnNum > i) {
              classes.push('current-turn');
            } 
            if (this.state.patternPlace === i) {
              classes.push('current-place');
            } 
            return <div key={'pattern-' + i} className={classes.join(' ')}>{i + 1}</div>
          })
        }
      </div>
    ) : (
      null
    )

    let buttons = (this.state.gameStarted) ? (
      <div id="button-container">
        <div id="button-0" className="button" on={this.state.lightsOnArray[0].toString()} onClick={() => this.turnOnLight(0, () => {})}></div>
        <div id="button-1" className="button" on={this.state.lightsOnArray[1].toString()} onClick={() => this.turnOnLight(1, () => {})}></div>
        <div id="button-2" className="button" on={this.state.lightsOnArray[2].toString()} onClick={() => this.turnOnLight(2, () => {})}></div>
        <div id="button-3" className="button" on={this.state.lightsOnArray[3].toString()} onClick={() => this.turnOnLight(3, () => {})}></div>
      </div>
    ) : (
      (this.state.winner) ? (
        null
      ) : (
        <div id="button-container">
          <div id="start-button" className="button"  onClick={() => this.startGame()}>
            <span>Start</span>
          </div>
        </div>
      )
    )

    let settings = (this.state.showSettings) ? (
      <div id="settings-container">
        <div id="settings-header">
          <h2 id="settings-title">Settings</h2>
          <h2 id="settings-close" onClick={() => this.toggleSettings()}>X</h2>
        </div>
        <Toggle inputId="strict-mode-toggle" value={this.state.strictMode} onChange={this.strictMode}>Strict Mode</Toggle>
        <Toggle inputId="sound-mode-toggle" value={this.state.soundOn} onChange={this.soundMode}>Sound</Toggle>
        <div id="adjust-pattern-size-container">
          <span id="adjust-pattern-label">Pattern Length</span>
          <div id="adjust-pattern-down" onClick={() => this.adjustPatternLength('-')}><h1>-</h1></div>
          <h1 id="pattern-length">{this.state.patternLength}</h1>
          <div id="adjust-pattern-up" onClick={() => this.adjustPatternLength('+')}><h1>+</h1></div>
        </div>
      </div>
    ) : (
      null
    )
  
    return (
      <div className="App">
        <a href="https://www.mreisz.com/" target="_blank" rel="noopener noreferrer">
          <svg id="header-logo">
            <use xlinkHref="#MRLogo" />
          </svg>
        </a>

        <div id="buttons-container">
          <svg id="settings-icon" onClick={() => this.toggleSettings()}>
            <use xlinkHref="#cog" />
          </svg>
          {this.state.gameStarted ? (
            <svg id="end-game-icon" onClick={() => this.endGame()}>
              <use xlinkHref="#close" />
            </svg> 
          ) : (
            null
          )}
        </div>
        
        {settings}
        {patternView}

        {winner}
        {buttons}

        <span id="footer-copyright">&copy; 2018 Michael Reisz</span>
        <a href="https://www.mreisz.com" target="_blank" rel="noopener noreferrer">
          <img id="footer-logo" src={signature} alt="MReisz.com" />
        </a>
      </div>
    );
  }
}

export default App;
