// src/components/ScoreCard.tsx
import React, { useState, useEffect } from 'react';
import SelectList from './selectList';
import TicketToRideService from '../services/ticketToRideService';
import { DestinationData } from '../models/destination';


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

    useEffect(() => {
        // prevCards = cards => array('', '')
        setCards((prevCards) => {
            if (playerNumber > prevCards.length) {
                return [...prevCards, ...Array(playerNumber - prevCards.length).fill('')];
            } else {
                return prevCards.slice(0, playerNumber);
            }
        });
    }, [playerNumber]);

    const handleCardChange = (index: number, newValue: string) => {
        setCards((prevCards) => {
            const updatedCards = [...prevCards];
            updatedCards[index] = newValue;
            return updatedCards;
        });
    };

    const convertToOptions = (data: DestinationData[]): OptionType[] => {
        return data.map(d => ({
            value: d.score,
            label: `${d.start} to ${d.end}`
        }));
    };


    useEffect(() => {
        TicketToRideService.getDestinations().then(data => {
            const options: OptionType[] = data.map(item => ({
                value: item.score,
                label: `${item.start} to ${item.end} (score ${item.score})`
            }));
            setDestinations(options);
        }).catch(error => {
            console.error('Erreur lors de la récupération des destinations:', error);
        });
    }, []);

    return (
        <div className="w-full mx-auto p-4">
            <h1 className="text-center text-2xl font-bold mb-4">Score Cards for {selectedMap}</h1>
            <div className="flex flex-wrap justify-between gap-4">
                {cards.map((content, index) => (
                    <div key={index} className="flex-1 min-w-[150px] border p-4 bg-white rounded-md shadow-sm">
                        <h2 className="text-lg font-semibold mb-2">Player {index + 1}</h2>
                        <SelectList defaultOption={'a long destination'} options={destinations} />
                        <SelectList defaultOption={'destinations'} selectMultiple={true} options={destinations} />
                        <SelectList defaultOption={'roads taken'} selectMultiple={true} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ScoreCard;
