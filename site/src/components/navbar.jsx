import * as React from 'react';
import { NavLink } from 'react-router-dom';

export default class NavBar extends React.Component {
	render() {
		return (
			<nav className={`navbar navbar-dark bg-dark navbar-expand-md ${this.props.className || ''}`}>
				<a className="navbar-brand" href="/">
					{this.props.logo
						? <img src={this.props.logo} alt={this.props.brand} title={this.props.brand} className={this.props.logoClass} />
						: this.props.brand}
				</a>
				<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapseContent">
					<span className="navbar-toggler-icon"></span>
				</button>

				<div className="collapse navbar-collapse" id="navbarCollapseContent">
					<ul className="navbar-nav mr-auto">
						<li>
							<NavLink to="/game" activeClassName="active" className="nav-link">
								<span className="glyphicon glyphicon-game"></span> New Game
							</NavLink>
						</li>
						<li>
							<NavLink to="/data" activeClassName="active" className="nav-link">
								<span className="glyphicon glyphicon-game"></span> Data
							</NavLink>
						</li>
					</ul>
				</div>
			</nav>
		)
	}
}