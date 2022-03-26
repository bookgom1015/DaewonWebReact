import React, { Component } from 'react';
import { Routes, Route } from 'react-router';
import { Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { ShowChart } from './components/ShowChart';
import { Login } from './components/Login';
import { Admin } from './components/Admin';
import { Logout } from './components/Logout';

function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};

export default class App extends Component {
  constructor(props) {
    super(props);

    Date.prototype.yyyymmdd = function() {
      var mm = this.getMonth() + 1; // getMonth() is zero-based
      var dd = this.getDate();
    
      return [this.getFullYear() + '-' + 
          (mm > 9 ? '' : '0') + mm + '-' +
          (dd > 9 ? '' : '0') + dd];
    };

    let token = localStorage.getItem('token');
    let isAdmin = false;
    let lifeTime = 0;

    const parsed = token != null ? parseJwt(token) : null;
    if (parsed != null) {
      isAdmin = parsed['isAdmin'];

      const expTime = parsed['exp'];
      const expDate = new Date(expTime * 1000);
      lifeTime = expDate - Date.now();

      if (lifeTime <= 0) {
        token = null;
        isAdmin = false;
      }
    }

    this.state = {
      token: token,
      isAdmin: isAdmin,
      expired: false,
      lifeTime: lifeTime > 3600000 ? lifeTime - 3600000 : lifeTime,
    };

    this.onTokenChanged = this.onTokenChanged.bind(this);
  }

  componentDidMount() {
    if (this.state.token != null) {
      setTimeout(() => this.setState({
        expired: true
      }), this.state.lifeTime);
    }
  }

  onTokenChanged(token) {
    if (token != null) {
      const parsed = parseJwt(token);
      this.setState({
        token: token,
        isAdmin: parsed['isAdmin'],
      });

      const expTime = parsed['exp'];
      const expDate = new Date(expTime * 1000);
      const lifeTime = expDate - Date.now() - 3600000;      
      setTimeout(() => this.setState({
        expired: true
      }), lifeTime);
    }
    else {
      this.setState({
        token: null,
        isAdmin: false,
      });
    }
  }
  
  render() {
    if (this.state.expired) {
      this.setState({
        expired: false
      });
      return (<Navigate replace to='logout' />);
    }

    const token = this.state.token;
    const home = token != null ? <Home token={token} /> : <Navigate replace to='/login' />;
    const login = token == null ? <Login onTokenChanged={this.onTokenChanged} /> : <Navigate replace to='/' />;
    const logout = token != null ? <Logout onTokenChanged={this.onTokenChanged} /> : <Navigate replace to='/login' />;
    const admin = token != null ? <Admin token={token} /> : <Navigate replace to='/login' />;
    const chart = token != null ? <ShowChart token={token} /> : <Navigate replace to='/login' />;
    
    return (
      <Layout isAdmin={this.state.isAdmin}>
        <Routes> 
          <Route exact path='/' element={home} />
          <Route path='/login' element={login} />
          <Route path='/logout' element={logout} />
          <Route path='/admin' element={admin} />
          <Route path='/chart' element={chart} />
        </Routes>
      </Layout>
    );
  }
}
