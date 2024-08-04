import React, { useState, useEffect } from 'react';
import SelectList from './selectList';
import useDestinationsRoads from '../hooks/useDestinationsRoads';
import trainStations from '../models/trainstation';
import useScoreManager from '../hooks/useScoreManager';

interface ScoreCardProps {
    selectedMap: string;
    playerNumber: number;
}

interface OptionType {
    value: number;
    label: string;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ selectedMap, playerNumber }) => {
    const [cards, setCards] = useState<string[]>(Array(playerNumber).fill(''));
    const { destinations, longDestinations, roads } = useDestinationsRoads(selectedMap);
    const { scores, handleSelectChange, previousSelections, handleCheckboxChange, resetSelections } = useScoreManager(playerNumber);

    useEffect(() => {
        setCards(prevCards => (
            playerNumber > prevCards.length
                ? [...prevCards, ...Array(playerNumber - prevCards.length).fill('')]
                : prevCards.slice(0, playerNumber)
        ));
    }, [playerNumber]);

    // Collect all selected values from all players
    const getAllSelectedValues = () => {
        return Object.values(previousSelections).flatMap(selection =>
            Object.values(selection).flatMap(item => {
                if (Array.isArray(item.selected)) {
                    return item.selected.map(opt => opt.label);
                } else if (item.selected && 'label' in item.selected) {
                    return [item.selected.label];
                }
                return [];
            })
        );
    };

    useEffect(() => {
        resetSelections();
    }, [selectedMap, resetSelections]);

    // Get the filtered options based on global selections
    const getFilteredOptions = (options: OptionType[]) => {
        const allSelectedValues = getAllSelectedValues();
        return options.filter(option => !allSelectedValues.includes(option.label));
    };

    return (
        <div className="w-full mx-auto p-4">
            <h1 className="text-center text-2xl font-bold mb-4">Score Cards for {selectedMap}</h1>
            <div className="flex flex-wrap justify-between gap-4">
                {cards.map((content, index) => (
                    <div key={index} className="flex-1 min-w-[150px] border p-4 bg-white rounded-md shadow-sm">
                        <h2 className="text-lg font-semibold mb-2">Player {index + 1}</h2>
                        <SelectList
                            defaultOption={'a long destination'}
                            options={getFilteredOptions(longDestinations)}
                            name={'longDestination'}
                            onChange={handleSelectChange(index)}
                            value={previousSelections[index]?.longDestination?.selected || null}
                            onChecked={handleCheckboxChange(index)}
                        />
                        <SelectList
                            defaultOption={'destinations completed'}
                            selectMultiple={true}
                            options={getFilteredOptions(destinations)}
                            name={'destinationCompleted'}
                            onChange={handleSelectChange(index)}
                            value={previousSelections[index]?.destinationCompleted?.selected || []}
                        />
                        <SelectList
                            defaultOption={'destinations failed'}
                            selectMultiple={true}
                            options={getFilteredOptions(destinations)}
                            name={'destinationFailed'}
                            onChange={handleSelectChange(index)}
                            value={previousSelections[index]?.destinationFailed?.selected || []}
                        />
                        <SelectList
                            defaultOption={'roads taken'}
                            selectMultiple={true}
                            options={getFilteredOptions(roads)}
                            name={'roads'}
                            onChange={handleSelectChange(index)}
                            value={previousSelections[index]?.roads?.selected || []}
                        />
                        {selectedMap === 'Europe' && (
                            <SelectList
                                defaultOption={'the number of train stations used'}
                                options={trainStations}
                                name={'trainStations'}
                                onChange={handleSelectChange(index)}
                                value={previousSelections[index]?.trainStations?.selected || null}
                            />
                        )}
                        <p className="p-4">Score: {scores[index]}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ScoreCard;
