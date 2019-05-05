import React from 'react';

import CallMeNode from './components/CallMeNode'
import CallMePhp from './components/CallMePhp'

import routes from './routes';

function App() {

  return (
    <div className="App">
        <div>known routes</div>
        <ul>
            {Object.keys(routes).map(k => <li key={k}>{k}</li>)}
        </ul>
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
