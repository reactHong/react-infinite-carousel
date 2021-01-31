import React, { useEffect, useState } from 'react';
import './App.css';
import Discovery from './components/Discovery';
import { testDiscoveryData } from './unittest/testData';

// type DiscoveryData = {
//   sections: Section[];
// };

function App() {
  const [discoveryData, setDiscoveryData] = useState<object | null>(null);

  useEffect(() => {
    fetch("./discovery_page.json")
      .then(response => response.json())
      .then(data => {
        setDiscoveryData(data);
      })
      .catch(err => {
        //TODO: Direct to the error page
        alert(err);
      });
  }, []);

  console.log("-- [App.render]");
  return (
    <Discovery data={discoveryData} />
  );
}

export default App;
