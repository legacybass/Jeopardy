import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import NavBar from './components/navbar';
import logo from './logo.svg';
import './App.css';
import Game from './components/game';
import Data from './components/data';
import Home from './components/home';

class App extends Component {
  render() {
	return (
	  <div className="container">
	  	<header>
	  		<NavBar logo={logo} brand="Jeopardy" logoClass="App-logo" className="mb-5" />
		</header>
		<main>
			<Switch>
				<Route path="/" exact component={Home} />
				<Route path="/game" component={Game} />
				<Route path="/data" component={Data} />
				<Redirect to="/" />
			</Switch>
		</main>
	  </div>
	);
  }
}

export default App;
