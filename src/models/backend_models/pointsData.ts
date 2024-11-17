export interface PointOffer {
    id: number;
    points: number;
    price: number;
}

export interface PointsApiResponse {
    timestamp: string;
    statusCode: number;
    status: string;
    message: string;
    data: {
        offers: PointOffer[];
    };
}