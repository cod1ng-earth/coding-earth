import React from 'react';

import CallMeNode from './components/CallMeNode'
import CallMePhp from './components/CallMePhp'

function App() {
  return (
    <div className="App">
      <h2> putting it all together</h2>
      <div className="col-6">
        <CallMeNode/>
      </div>

      <div className="col-6">
        <CallMePhp/>
      </div>
    </div>
  );
}

export default App;
