import React, { Component } from 'react';
import { Routes, Route } from 'react-router';
import { Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { ShowChart } from './components/ShowChart';
import { Login } from './components/Login';
import { Admin } from './components/Admin';
import { Logout } from './components/Logout';
import { tokenName, role, adminRole, userRole, exp, expDiff } from './components/config';

function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};

let tokenTimer = null;
let msgTimer = null;

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

    let token = localStorage.getItem(tokenName);
    let isAdmin = userRole;
    let lifeTime = 0;

    const parsed = token != null ? parseJwt(token) : null;
    if (parsed != null) {
      isAdmin = parsed[role];

      const expTime = parsed[exp];
      const expDate = new Date(expTime * 1000);
      lifeTime = expDate - Date.now();

      if (lifeTime <= 0) {
        token = null;
        isAdmin = userRole;
        localStorage.removeItem(tokenName);
      }
    }

    this.state = {
      token: token,
      isAdmin: isAdmin,
      status: 'failed',
      message: '',
      lifeTime: lifeTime > expDiff ? lifeTime - expDiff : lifeTime,
    };

    this.onTokenChanged = this.onTokenChanged.bind(this);
    this.onStatusChanged = this.onStatusChanged.bind(this);
    this.setTokenTimer = this.setTokenTimer.bind(this);
  }

  componentDidMount() {
    if (this.state.token != null) {
      this.setTokenTimer(this.state.lifeTime);
    }
  }

  onTokenChanged(token) {
    if (token != null) {
      localStorage.setItem(tokenName, token); 

      const parsed = parseJwt(token);
      this.setState({
        token: token,
        isAdmin: parsed[role],
      });

      const expTime = parsed[exp];
      const expDate = new Date(expTime * 1000);
      const lifeTime = expDate - Date.now() - expDiff;   
      
      this.setTokenTimer(lifeTime);
    }
    else {
      if (tokenTimer != null) clearTimeout(tokenTimer);
      tokenTimer = null;
      localStorage.removeItem(tokenName);

      this.setState({
        token: null,
        isAdmin: false,
      });      
    }
  }

  onStatusChanged(status, message) {
    if (message != '') {
      if (msgTimer != null) clearTimeout(msgTimer);

      msgTimer = setTimeout(() => {
        msgTimer = null;
        this.setState({
          message: ''
        });
      }, 3000);
    }

    this.setState({
        status: status,
        message: message
    });
  }

  setTokenTimer(lifeTime) {
    tokenTimer = setTimeout(() => {
      tokenTimer = null;
      localStorage.removeItem(tokenName);
      this.onStatusChanged('succeeded', '자동으로 로그아웃되었습니다');
      this.setState({
        token: null,
        isAdmin: false
      });
    }, lifeTime);
  }
  
  render() {
    const token = this.state.token;
    const home = token != null ? <Home token={token} onStatusChanged={this.onStatusChanged} /> : <Navigate replace to='/login' />;
    const login = token == null ? <Login onTokenChanged={this.onTokenChanged} onStatusChanged={this.onStatusChanged} /> : <Navigate replace to='/' />;
    const logout = token != null ? <Logout token={token} onTokenChanged={this.onTokenChanged} onStatusChanged={this.onStatusChanged} /> : <Navigate replace to='/login' />;
    const admin = this.state.isAdmin == adminRole ? <Admin token={token} onStatusChanged={this.onStatusChanged} /> : token != null ? <Navigate replace to='/' /> : <Navigate replace to='/login' />;
    const chart = token != null ? <ShowChart token={token} onStatusChanged={this.onStatusChanged} /> : <Navigate replace to='/login' />;
    
    return (
      <Layout token={this.state.token} isAdmin={this.state.isAdmin} status={this.state.status} message={this.state.message}>
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
