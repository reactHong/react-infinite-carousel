import React, { useEffect, useState } from 'react';
import './App.css';
import Discovery, { Section } from './components/Discovery';

type DiscoveryData = {
  sections: Section[];
};

function App() {

  const [discoveryData, setDiscoveryData] = useState<DiscoveryData>({
    sections: [],
  });

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

  return (
    <Discovery sections={discoveryData.sections} />
  );
}

export default App;
