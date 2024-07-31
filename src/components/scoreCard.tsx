import React, { useState, useEffect } from 'react';
import SelectList from './selectList';
import useDestinationsRoads from '../hooks/useDestinationsRoads';
import trainStations from '../models/trainstation';
import { MultiValue, SingleValue } from 'react-select';

interface ScoreCardProps {
    selectedMap: string;
    playerNumber: number;
}

interface OptionType {
    value: number;
    label: string;
}

interface PreviousSelection {
    selected: SingleValue<OptionType> | MultiValue<OptionType>;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ selectedMap, playerNumber }) => {
    const [cards, setCards] = useState<string[]>(Array(playerNumber).fill(''));
    const [scores, setScores] = useState<number[]>(Array(playerNumber).fill(0));
    const [previousSelections, setPreviousSelections] = useState<{ [key: string]: PreviousSelection }[]>(Array(playerNumber).fill({}));
    const { destinations, longDestinations, roads } = useDestinationsRoads(selectedMap);

    useEffect(() => {
        setCards(prevCards => (
            playerNumber > prevCards.length
                ? [...prevCards, ...Array(playerNumber - prevCards.length).fill('')]
                : prevCards.slice(0, playerNumber)
        ));

        setScores(Array(playerNumber).fill(0));
        setPreviousSelections(Array(playerNumber).fill({}));
    }, [playerNumber]);

    const extractSelectedValues = (selected: SingleValue<OptionType> | MultiValue<OptionType>): number[] => (
        Array.isArray(selected)
            ? selected.map(option => option.value)
            : selected ? [(selected as OptionType).value] : []
    );

    const handleSelectChange = (index: number) => (
        selected: SingleValue<OptionType> | MultiValue<OptionType>,
        name?: string,
        checked?: boolean
    ) => {

        if (typeof name !== 'string') return;

        const selectedValues = extractSelectedValues(selected);

        if (name === 'longDestination') {
            // Calculer le score pour longDestination en fonction de `checked`
            const scoreLongDestination = selectedValues.reduce((sum, value) => sum + value, 0);

            setScores(prevScores => {
                const updatedScores = [...prevScores];
                updatedScores[index] += checked ? -scoreLongDestination : scoreLongDestination;
                return updatedScores;
            });
        } else {
            // Mettre à jour les scores pour d'autres types
            setScores(prevScores => {
                const updatedScores = [...prevScores];
                const previousSelection = previousSelections[index][name] as PreviousSelection;

                if (previousSelection) {
                    const oldValues = extractSelectedValues(previousSelection.selected);
                    const newValues = selectedValues;
                    const addedValues = newValues.filter(value => !oldValues.includes(value));
                    const removedValues = oldValues.filter(value => !newValues.includes(value));

                    const previousScoreRemoved = calculateScore(removedValues, name);
                    const previousScoreAdded = calculateScore(addedValues, name);

                    updatedScores[index] -= previousScoreRemoved;
                    updatedScores[index] += previousScoreAdded;
                } else {
                    const newScore = calculateScore(selectedValues, name);
                    updatedScores[index] += newScore;
                }

                return updatedScores;
            });
        }

        setPreviousSelections(prevSelections => {
            const updatedSelections = [...prevSelections];
            updatedSelections[index] = {
                ...updatedSelections[index],
                [name]: { selected }
            };
            return updatedSelections;
        });
    };

    const calculateScore = (values: number[], name?: string): number => {
        let score = 0;
        switch (name) {
            case 'longDestination':
                score = values.reduce((sum, value) => sum + value, 0);
                break;
            case 'destinationCompleted':
                score = values.reduce((sum, value) => sum + value, 0);
                break;
            case 'destinationFailed':
                score = values.reduce((sum, value) => sum - value, 0);
                break;
            case 'trainStations':
                score = values.reduce((sum, value) => sum - (value * 4), 0);
                break;
            case 'roads':
                score = values.reduce((sum, value) => sum + value, 0);
                break;
            default:
                score = 0;
                break;
        }
        return score;
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
                            options={longDestinations}
                            name={'longDestination'}
                            onChange={handleSelectChange(index)}
                        />
                        <SelectList
                            defaultOption={'destinations completed'}
                            selectMultiple={true}
                            options={destinations}
                            name={'destinationCompleted'}
                            onChange={handleSelectChange(index)}
                        />
                        <SelectList
                            defaultOption={'destinations failed'}
                            selectMultiple={true}
                            options={destinations}
                            name={'destinationFailed'}
                            onChange={handleSelectChange(index)}
                        />
                        <SelectList
                            defaultOption={'roads taken'}
                            selectMultiple={true}
                            options={roads}
                            name={'roads'}
                            onChange={handleSelectChange(index)}
                        />
                        {selectedMap === 'Europe' && (
                            <SelectList
                                defaultOption={'the number of train stations used'}
                                options={trainStations}
                                name={'trainStations'}
                                onChange={handleSelectChange(index)}
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
