import React, { useEffect, useState } from 'react';
import './App.css';
import Discovery, { Section } from './components/Discovery';
import { realDiscoveryData, testDiscoveryData } from './testData';

type DiscoveryData = {
  sections: Section[];
};

function App() {

  // const [discoveryData, setDiscoveryData] = useState<DiscoveryData>({
  //   sections: [],
  // });
  const [discoveryData, setDiscoveryData] = useState<DiscoveryData>(realDiscoveryData);

  useEffect(() => {
    // fetch("./discovery_page.json")
    //   .then(response => response.json())
    //   .then(data => {
    //     console.log("[App.componentDidMount] data:", data);
    //     setDiscoveryData(data);
    //   })
    //   .catch(err => {
    //     console.log("[App.componentDidMount] Error:", err);
    //   });

  }, []);

  return (
    <Discovery sections={discoveryData.sections} />
  );
}

export default App;
