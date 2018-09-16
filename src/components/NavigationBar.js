import React, { Component } from 'react';
import './NavigationBar.css';

export default class NavigationBar extends Component {
  render() {
    let username = this.props.username;
    if (username == null) {
      // No user logged in
      return (
        <nav className="navigation-bar">
          <button onClick={this.props.homeClicked}>Home</button>
          <button onClick={this.props.loginClicked}>Login</button>
          <button onClick={this.props.registerClicked}>Register</button>
        </nav>
      );
    } else {
      // User logged in
      return (
        <nav className="navigation-bar">
          <button onClick={this.props.homeClicked}>Home</button>
          <button onClick={this.props.booksClicked}>List Books</button>
          <button onClick={this.props.createBookClicked}>Create Book</button>
          <button onClick={this.props.logoutClicked}>Logout</button>
          <span id="loggedUser">
            Welcome, {username}!
          </span>
        </nav>
      );
    }
  }
}