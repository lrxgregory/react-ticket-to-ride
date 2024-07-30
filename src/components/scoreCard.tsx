import React, { useState, useEffect } from 'react';
import SelectList from './selectList';
import TicketToRideService from '../services/ticketToRideService';
import { DestinationData } from '../models/destination';
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

const ScoreCard: React.FC<ScoreCardProps> = ({ selectedMap, playerNumber }) => {
    const [cards, setCards] = useState<string[]>(Array(playerNumber).fill(''));
    const [destinations, setDestinations] = useState<OptionType[]>();
    const [longDestinations, setLongDestinations] = useState<OptionType[]>();
    const [roads, setRoads] = useState<OptionType[]>();
    const [scores, setScores] = useState<number[]>(Array(playerNumber).fill(0));

    useEffect(() => {
        setCards((prevCards) => {
            if (playerNumber > prevCards.length) {
                return [...prevCards, ...Array(playerNumber - prevCards.length).fill('')];
            } else {
                return prevCards.slice(0, playerNumber);
            }
        });

        setScores(Array(playerNumber).fill(0));
    }, [playerNumber]);

    // const handleCardChange = (index: number, newValue: string) => {
    //     setCards((prevCards) => {
    //         const updatedCards = [...prevCards];
    //         updatedCards[index] = newValue;
    //         return updatedCards;
    //     });
    // };

    const setOptions = (data: DestinationData[]): OptionType[] => {
        return data.map(item => ({
            value: item.score,
            label: `${item.start} ⇔ ${item.end} (score ${item.score})`
        }));
    };

    useEffect(() => {
        TicketToRideService.getDestinations().then(data => {
            const longDestinationsData = data.filter((destination) => destination.isLongDestination && destination.map === selectedMap);
            const destinationsData = data.filter((destination) => !destination.isLongDestination && destination.map === selectedMap);

            const longDestinations = setOptions(longDestinationsData);
            const destinations = setOptions(destinationsData);

            setDestinations(destinations);
            setLongDestinations(longDestinations);
        }).catch(error => {
            console.error('Erreur lors de la récupération des destinations:', error);
        });

        TicketToRideService.getRoads().then(data => {
            const roadsData = data.filter((road) => road.map === selectedMap);

            const roads = setOptions(roadsData);

            setRoads(roads);
        }).catch(error => {
            console.error('Erreur lors de la récupération des destinations:', error);
        });
    }, [selectedMap]);

    // Fonction pour extraire les valeurs sélectionnées
    const extractSelectedValues = (selected: SingleValue<OptionType> | MultiValue<OptionType>): number[] => {
        return Array.isArray(selected)
            ? selected.map(option => option.value)
            : selected ? [(selected as OptionType).value] : [];
    };

    // Fonction pour calculer le score en fonction des sélections
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
                score = values.reduce((sum, value) => sum - (value * 4), 0); // Chaque station coûtant 4 points
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

    // Fonction principale pour gérer les changements de sélection
    const handleSelectChange = (index: number) => (
        selected: SingleValue<OptionType> | MultiValue<OptionType>,
        name?: string
    ) => {
        const selectedValues = extractSelectedValues(selected);
        const newScore = calculateScore(selectedValues, name);

        setScores((prevScores) => {
            const updatedScores = Array.isArray(prevScores) ? [...prevScores] : Array(playerNumber).fill(0);
            updatedScores[index] = updatedScores[index] + newScore;
            return updatedScores;
        });
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
