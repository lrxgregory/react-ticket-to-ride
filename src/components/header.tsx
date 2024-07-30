import React from 'react';

interface HeaderProps {
    selectedMap: string;
    onMapChange: (map: string) => void;
    playerNumber: number;
    onPlayerNumberChange: (playerNumber: number) => void;
}

const Header: React.FC<HeaderProps> = ({ selectedMap, onMapChange, playerNumber, onPlayerNumberChange }) => {
    const maps = ['USA', 'Europe'];


    const handleMapChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedMap = event.target.value;
        onMapChange(selectedMap);
    };

    const handlePlayerNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const playerNumber = parseInt(event.target.value, 10);
        if (playerNumber >= 2 && playerNumber <= 5) {
            onPlayerNumberChange(playerNumber);
        }
    };

    return (
        <div className="w-full bg-blue-500 p-4">
            <h1 className="text-white text-center text-2xl font-bold mb-4">Ticket To Ride Score</h1>
            <div className="max-w-4xl mx-auto p-4">
                <div className="flex space-x-4">
                    {/* Sélecteur de carte */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                            <label htmlFor="map" className="text-sm font-medium text-gray-700 w-36">
                                Maps:
                            </label>
                            <select
                                id="map"
                                value={selectedMap}
                                onChange={handleMapChange}
                                className="block flex-1 border border-gray-300 bg-white text-gray-900 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                {maps.map((mapOption) => (
                                    <option key={mapOption} value={mapOption}>
                                        {mapOption}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                            <label htmlFor="playersNumber" className="text-sm font-medium text-gray-700 w-52">
                                Number of players (2-5):
                            </label>
                            <input
                                type="number"
                                id="playersNumber"
                                name="playersNumber"
                                min="2"
                                max="5"
                                value={playerNumber}
                                onChange={handlePlayerNumberChange}
                                className="block flex-1 border border-gray-300 bg-white text-gray-900 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
