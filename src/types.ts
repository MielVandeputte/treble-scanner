export type TicketScanAttempt = {
    result: string;
    timestamp: Date;

    secretCode: string;

    ownerName: string;
    ownerEmail: string;

    ticketTypeId: number;
    ticketTypeName: string;
};

export type ScannerCredentials = {
    eventId: string;
    scanAuthorizationCode: string;
};