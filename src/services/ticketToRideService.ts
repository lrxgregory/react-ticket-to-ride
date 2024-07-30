import { DestinationData } from "../models/destination"; // Assure-toi que le chemin est correct
import { RoadData } from "../models/roads";

const API_URL = 'https://ticket-to-ride-api-rest-node-js.onrender.com/api';

// Interface pour les données de la réponse
interface ApiResponse<T> {
    message: string;
    data: T;
}

export default class TicketToRideService {

    // Fonction pour récupérer les destinations
    static async getDestinations(): Promise<DestinationData[]> {
        try {
            const response = await fetch(`${API_URL}/destinations`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const result: ApiResponse<DestinationData[]> = await response.json();
            return result.data;
        } catch (error) {
            if (error instanceof Error) {
                this.handleError(error);
            } else {
                this.handleError(new Error('An unknown error occurred'));
            }
            // Retourner un tableau vide en cas d'erreur
            return [];
        }
    }

    // Fonction pour récupérer les routes
    static async getRoads(): Promise<any[]> {
        try {
            const response = await fetch(`${API_URL}/roads`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const result: ApiResponse<RoadData[]> = await response.json();
            return result.data;
        } catch (error) {
            if (error instanceof Error) {
                this.handleError(error);
            } else {
                this.handleError(new Error('An unknown error occurred'));
            }
            // Retourner un tableau vide en cas d'erreur
            return [];
        }
    }

    // Fonction de gestion des erreurs
    static handleError(error: Error): void {
        console.error('An error occurred:', error.message);
    }
}
