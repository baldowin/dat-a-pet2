import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import 'materialize-css/dist/css/materialize.min.css'
import M from 'materialize-css/dist/js/materialize.min.js'
import logo from './logo.svg';
import Home from './pages/homepage'
import Dash from './pages/dashboard'
import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route exact path="/dashboard" component={Dash} />
            <Route path="/*" component={Home} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
