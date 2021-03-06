import React, { Component } from 'react';
import '../styles/header.css'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import StripeWrapper from './StripeWrapper';

class Header extends Component {
  renderContent() {
    switch(this.props.auth) {
      case null:
        //return 'Still deciding';
        return;
      case false:
        //return 'Logged out';
        return (
          <li><a href='/auth/google'>Login with Google</a></li>
        );
      default:
        //return 'Logged in';
        return [
          <li key="1"><StripeWrapper /></li>,
          <li key="2">Credits: { this.props.auth.credits }</li>,
          <li key="3"><a href='/api/logout'>Logout</a></li>
        ];
    }
  }

  render() {
    return (
      <div className='navbar'>
        <Link to={this.props.auth ? '/surveys' : '/' } className='brand'>Emaily</Link>
        <ul className='links'>
          {this.renderContent()}
        </ul>
        <div className='clearfix'></div>
      </div>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(Header);
