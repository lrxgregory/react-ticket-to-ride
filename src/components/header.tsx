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
        <div className="w-full bg-slate-600	p-6">
            <h1 className="text-white text-center text-3xl font-extrabold mb-6">Ticket To Ride Score</h1>
            <div className="max-w-4xl mx-auto px-4">
                <div className="flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-6">
                    {/* Sélecteur de carte */}
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                            <label htmlFor="map" className="text-sm font-medium text-gray-100 w-full sm:w-auto">
                                Maps:
                            </label>
                            <select
                                id="map"
                                value={selectedMap}
                                onChange={handleMapChange}
                                className="block w-full sm:w-64 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg shadow-md focus:ring-brown-500 focus:border-brown-500 sm:text-md transition-all duration-300 ease-in-out hover:border-brown-400 text-center"
                                style={{ textAlignLast: 'center' }} // Centrer le texte du select
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
                        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                            <label htmlFor="playersNumber" className="text-sm font-medium text-gray-100 w-full sm:w-auto">
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
                                className="block w-full sm:w-64 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg shadow-md focus:ring-brown-500 focus:border-brown-500 sm:text-md transition-all duration-300 ease-in-out hover:border-brown-400 text-center"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
