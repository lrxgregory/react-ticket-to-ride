import { useState } from 'react';
import './App.css';
import Header from './components/header';
import ScoreCard from './components/scoreCard';

function App() {
  const [selectedMap, setSelectedMap] = useState('USA');
  const [playerNumber, setPlayerNumber] = useState(2);

  // Fonction pour mettre à jour selectedMap
  const handleMapChange = (selectedMap: string) => {
    setSelectedMap(selectedMap);
  };

  // Fonction pour mettre à jour playerNumber
  const handlePlayerNumberChange = (playerNumber: number) => {
    setPlayerNumber(playerNumber);
  };

  return (
    <div className="App">
      <Header
        selectedMap={selectedMap}
        onMapChange={handleMapChange}
        playerNumber={playerNumber}
        onPlayerNumberChange={handlePlayerNumberChange}
      />
      <ScoreCard playerNumber={playerNumber} selectedMap={selectedMap} />
    </div>
  );
}

export default App;
