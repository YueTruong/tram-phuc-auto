import './App.css';
import React, {Component} from 'react';
import MyProvider from './contexts/MyProvider';
import Login from './components/LoginComponent';
import Main from './components/MainComponent';
import {BrowserRouter} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

class App extends Component {
  render() {
    return (
      <MyProvider>
        <Login />
        <BrowserRouter>
          <Main />
        </BrowserRouter>
      </MyProvider>
    );
  }
}

export default App;