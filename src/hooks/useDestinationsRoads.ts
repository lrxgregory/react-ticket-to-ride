import { useState, useEffect } from 'react';
import TicketToRideService from '../services/ticketToRideService';
import { DestinationData } from '../models/destination';

interface OptionType {
    value: number;
    label: string;
}

const setOptions = (data: DestinationData[]): OptionType[] => {
    return data.map(item => ({
        value: item.score,
        label: `${item.start} ⇔ ${item.end} (score ${item.score})`
    }));
};

const useDestinationsRoads = (selectedMap: string) => {
    const [destinations, setDestinations] = useState<OptionType[]>([]);
    const [longDestinations, setLongDestinations] = useState<OptionType[]>([]);
    const [roads, setRoads] = useState<OptionType[]>([]);

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const data = await TicketToRideService.getDestinations();
                const longDestinationsData = data.filter((destination) => destination.isLongDestination && destination.map === selectedMap);
                const destinationsData = data.filter((destination) => !destination.isLongDestination && destination.map === selectedMap);

                setLongDestinations(setOptions(longDestinationsData));
                setDestinations(setOptions(destinationsData));
            } catch (error) {
                console.error('Erreur lors de la récupération des destinations:', error);
            }
        };

        const fetchRoads = async () => {
            try {
                const data = await TicketToRideService.getRoads();
                const roadsData = data.filter((road) => road.map === selectedMap);
                setRoads(setOptions(roadsData));
            } catch (error) {
                console.error('Erreur lors de la récupération des routes:', error);
            }
        };

        fetchDestinations();
        fetchRoads();
    }, [selectedMap]);

    return { destinations, longDestinations, roads };
};

export default useDestinationsRoads;
