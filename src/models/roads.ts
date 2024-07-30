// Définir l'interface pour les données de destination
export interface RoadData {
    start: string,
    end: string,
    score: number,
    wagonNumber: number,
    locomotive: number,
    map: string
}

// Définir l'interface pour la réponse globale de l'API
export interface DestinationResponse {
    message: string;
    data: RoadData;
}
