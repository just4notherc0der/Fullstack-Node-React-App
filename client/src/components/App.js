import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <div>
            <Route path='/' component={Landing} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
