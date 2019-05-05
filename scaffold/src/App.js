import React, { useState, useEffect } from 'react';

import CallMeNode from './components/CallMeNode'
import CallMePhp from './components/CallMePhp'

import coordinator from "./coordinator";

export default props => {

    const [routes, setRoutes] = useState({});

    useEffect( () => {
        async function fetchData() {
            console.log("QQQ" + process.env.REACT_APP_COORDINATOR + "Q")
            const routes = await coordinator
            setRoutes(routes.data);
        }
        fetchData()
    }, []);


  return (
    <div className="App">
        <div>Known routes</div>
        <ul>
            {Object.keys(routes).map(k => <li key={k}>{k}</li>)}
        </ul>
      <h2> putting it all together</h2>
      <div className="col-6">
          {<CallMeNode/>}
      </div>

      <div className="col-6">
          {<CallMePhp/>}

      </div>
    </div>
  );
}


