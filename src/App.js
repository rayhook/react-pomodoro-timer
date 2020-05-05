import React, { Component } from 'react';
// eslint-disable-next-line
import { Provider, connect } from 'react-redux';
// eslint-disable-next-line
import { store } from 'redux';
import "./App.css";
import notifysound from "./inflicted.mp3";

class Pomodoro extends Component {
  constructor(props) {
    super(props)
      this.sessionID = null;
      this.breakID = null;
      this.state = {
      session: 25,
      break: 5,
      sessionSec: null,
      breakSec: null,
      sessionRecord: null,
      BreakRecord: null,
      sessionActive: true,
      breakActive: false,
      activityType: "Session"
    };
  
  this.startTimer = this.startTimer.bind(this);
  this.intervalSess = this.intervalSess.bind(this);
  this.intervalBreak = this.intervalBreak.bind(this);
  this.sessInc = this.sessInc.bind(this);
  this.sessDec = this.sessDec.bind(this);
  this.breaInc = this.breaInc.bind(this);
  this.breaDec = this.breaDec.bind(this);
  this.reset = this.reset.bind(this);
  this.playAlert = this.playAlert.bind(this);
  this.pauseAlert = this.pauseAlert.bind(this);
  };

 componentDidMount(){
    this.setState({
      sessionSec: this.state.session * 60,
      breakSec: this.state.break * 60,
      sessionRecord: this.state.session * 60,
      BreakRecord: this.state.break * 60,
    })
  };

  playAlert(){
    document.getElementById("beep").play();
    
  };

  pauseAlert() {
    document.getElementById("beep").pause();
    
  };

  sessInc(){
    if(this.state.session < 60 ){
      this.setState ({
        session: this.state.session + 1,
        sessionSec: this.state.sessionSec + 60,
        sessionRecord: this.state.sessionRecord + 60,
      });

    };
  };

  sessDec(){
    if(this.state.session > 1) {
      this.setState({
        session: this.state.session - 1,
        sessionSec: this.state.sessionSec - 60,
        sessionRecord: this.state.sessionRecord - 60, 
      });
    };
  };
  
  breaInc(){
    if(this.state.break < 60 ){
      this.setState ({
        break: this.state.break + 1,
        breakSec: this.state.breakSec + 60,
        BreakRecord: this.state.BreakRecord + 60, 
      });
    };
  };

  breaDec(){
    if(this.state.break > 1) {
      this.setState({
        break: this.state.break - 1,
        breakSec: this.state.breakSec - 60,
        BreakRecord: this.state.BreakRecord - 60, 
      });
    };
  };

  intervalSess() {
      if(this.state.sessionSec > 0){
        this.setState({
          sessionSec: this.state.sessionSec - 1
      });
      }else if(this.state.sessionSec === 0) {
        this.setState({
          sessionActive: false,
          breakActive: true,
          activityType: "Break",
          breakSec: this.state.BreakRecord,
        });
        clearInterval(this.sessionID); // stops interval
        this.breakID = null;
        this.playAlert();
        this.startTimer (); 
      }
  };

  intervalBreak () {
    if(this.state.breakSec > 0){
      this.setState({
        breakSec: this.state.breakSec - 1
      });
      }else if(this.state.sessionSec === 0){
        this.setState({
          breakActive: false,
          sessionActive: true,
          activityType: "Session",
          sessionSec: this.state.sessionRecord,
        });
        clearInterval(this.breakID);
        this.sessionID = null;
        this.playAlert();
        this.startTimer ();
      }
  };


  startTimer() {
    if(this.sessionID === null && this.state.sessionActive === true) { // # 1 Sess starting - first time
      this.setState({
        sessionRecord: this.state.sessionSec
      });
      this.sessionID = setInterval(this.intervalSess,1000);
      console.log("sessionID === null",this.sessionID === null,"Sess Started");

    }else if(this.sessionID !== null && this.state.sessionActive === true) { // # 2 Sess is paused
      console.log("sessionID === null ",this.sessionID === null,"Sess paused");
      clearInterval(this.sessionID);
      this.sessionID = null;
    }else if(this.breakID === null && this.state.breakActive === true) { //  # 3 Break starting for first time
      this.breakID = setInterval(this.intervalBreak,1000);
      
      console.log("BreakID === null",this.breakID === null,"Break started");
    }else if(this.breakID !== null && this.state.breakActive === true){ // #4 Break pased
      clearInterval(this.breakID);
      this.breakID = null;
      console.log("BreakID === null",this.breakID ===null,"Break Paused");
    }

  };

  reset(){
    clearInterval(this.sessionID);
    clearInterval(this.breakID);
    this.sessionID = null;
    this.breakID = null;
    this.pauseAlert();
    document.getElementById("beep").currentTime = 0;
    this.setState({
      session: 25,
      break: 5,
      sessionSec: 1500,
      breakSec: 300,
      sessionRecord: 1500,
      BreakRecord: 300,
      sessionActive: true,
      breakActive: false,
      activityType: "Session",
    });
  };
  
  render(){
    let formatMinS = Math.floor(this.state.sessionSec /60);
    let formatSecS = this.state.sessionSec - (formatMinS * 60);
    let formatMinSM;
    let formatSecSM;
    (formatMinS >= 10) ? formatMinSM = formatMinS : formatMinSM = "0" + formatMinS;
    (formatSecS >= 10) ? formatSecSM = formatSecS : formatSecSM = "0" + formatSecS;
    
  
    let formatMinB = Math.floor(this.state.breakSec / 60);
    let formatSecB = this.state.breakSec - (formatMinB * 60);
    let formatMinBM;
    let formatSecBM;
    (formatMinB >= 10) ? formatMinBM = formatMinB: formatMinBM = "0" + formatMinB;
    (formatSecB >= 10) ? formatSecBM = formatSecB : formatSecBM = "0" + formatSecB;
    
    let displaySOrB = (this.state.sessionActive === true) ? formatMinSM + ":" + formatSecSM : formatMinBM + ":" + formatSecBM;

    return(
      <div id="main">
        <div id="left">
          <button className="buttons left-buttons" id="start_stop" onClick={this.startTimer}>Start/Stop</button>
          <div id="timer-label">{this.state.activityType}</div>
          <button className="buttons left-buttons" id="reset" onClick={this.reset}>Reset</button>
        </div>
        <div id="right">
          <div id="time-left">{displaySOrB}</div>
          <div className="right-bottom">
            <div id="session_adjust">
            <div id="session-label">Session Length</div>
              <button className="buttons right-buttons" id="session-decrement" onClick={this.sessDec}>-</button>
              <button className="buttons right-buttons" id="session-increment" onClick={this.sessInc}>+</button>
              <div id="session-length">{this.state.session}</div>
            </div>
            <div id="break_adjust">
              <div id="break-label">Break Length</div>
              
              <button className="buttons right-buttons" id="break-decrement" onClick={this.breaDec}>-</button>
              <button className="buttons right-buttons" id="break-increment" onClick={this.breaInc}>+</button>
              <div id="break-length">{this.state.break}</div>
            </div>
          </div>
          </div>
        <audio id="beep" src={notifysound}></audio>
      </div>
    )
  }
};

export default Pomodoro;