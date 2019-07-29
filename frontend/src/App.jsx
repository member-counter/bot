import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';

import API from './api';
import ApiContext from './apiContext';

import Home from './pages/home';
import Dashboard from './pages/dashboard';
import Login from './pages/login';

const discordOauth2 = 'https://discordapp.com/api/oauth2/authorize?client_id=478567255198662656&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin&response_type=code&scope=guilds%20identify'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { client: new API()}
  }

  render() {
    return (
      <ApiContext.Provider value={this.state.client}>
        <Router>
          <div className="app">
            <div className="nav-bar">
              <div className="title-wrapper">
                <Link className="title" to="/">Member Counter</Link>
              </div>
              <Link className="item" to="/dashboard">Dashboard</Link>
              <Link className="item" to="/donate">Donate</Link>
              <a className="item" href={discordOauth2}>
                <div className="lwd-wrapper">
                  <div className="lwd-text">Login with</div><div className="lwd-ico"></div>
                </div>
              </a>
            </div>
            <div className="content">
              <Route path="/" exact component={Home}/>
              <Route path="/dashboard" component={Dashboard}/>
              <Route path="/donate"/>
              <Route path="/login" component={Login}/>
            </div>
          </div>
        </Router>
      </ApiContext.Provider>
    )
  }
}

export default App;
