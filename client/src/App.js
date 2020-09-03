import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';
import "./App.css";
import { Provider } from 'react-redux';
import store from './store';

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";
import { clearCurrentProfile } from "./actions/profileActions";

import PrivateRoute from './components/common/PrivateRoute';

// Check for token
if(localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken)
  // Decode token and get user info and expiration
  const decoded = jwt_decode(localStorage.jwtToken)
  // Set user in isAuthenticated
  store.dispatch(setCurrentUser(decoded))
  // Check for expired token
  const currentTime = Date.now() / 1000
  if(decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser())
    // Clear current Profile
    store.dispatch(clearCurrentProfile())
    // Redirect to login
    window.location.href = '/login'
  }
}

function App() {
  return (
    <Provider store={ store }>
      <Router>
        <div>
          <Navbar />
          <Route exact path="/" component={Landing} />
          <div className="container">
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Switch> // Private routes should be rounded with Switch to prevent issues with redirection
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
            </Switch>
          </div>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
