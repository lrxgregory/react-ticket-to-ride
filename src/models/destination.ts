// Définir l'interface pour les données de destination
export interface DestinationData {
    start: string;
    end: string;
    score: number;
    isLongDestination: boolean;
    map: string;
}

// Définir l'interface pour la réponse globale de l'API
export interface DestinationResponse {
    message: string;
    data: DestinationData;
}
