import { test, describe, vi, expect, beforeEach } from 'vitest';

import { errorResponseFor, fallbackErrorResponse, noInternetAccessErrorResponse } from './helper.ts';
import { scanTicket } from './scan-ticket.ts';
import { ScanCredentials } from '../types/scan-credentials.type.ts';

const scanCredentialsTestData: ScanCredentials = {
  eventId: 'eventId',
  scanAuthorizationCode: 'scanAuthorizationCode',
};

function setNavigatorOnline(value: boolean): void {
  Object.defineProperty(navigator, 'onLine', {
    value,
    writable: true,
  });
}

function makeFetchReturn(toReturn: { data: any; error: any }): void {
  const mockFetch = vi.fn().mockResolvedValue({
    json: () => Promise.resolve(toReturn),
  });
  vi.stubGlobal('fetch', mockFetch);
}

describe('scanTicket', () => {
  beforeEach(() => setNavigatorOnline(true));

  test('should return data response when server responds correctly', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({
          data: {
            result: 'SUCCESS',
            ownerName: 'ownerName',
            ownerEmail: 'ownerEmail',
            ticketTypeName: 'ticketTypeName',
          },
          error: null,
        }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const scanCredentials = {
      eventId: 'eventId',
      scanAuthorizationCode: 'scanAuthorizationCode',
    };
    const result = await scanTicket('secretCode', scanCredentials);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringMatching(
        '^https://www.staging.treble-events.be/api/events/eventId/modules/basic-ticket-store/scan-ticket$',
      ),
      {
        method: 'POST',
        body: JSON.stringify({ secretCode: 'secretCode', scanAuthorizationCode: 'scanAuthorizationCode' }),
      },
    );

    expect(result.data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        secretCode: 'secretCode',
        result: 'SUCCESS',
        ownerName: 'ownerName',
        ownerEmail: 'ownerEmail',
        ticketTypeName: 'ticketTypeName',
      }),
    );

    expect(result.data!.timestamp.getTime() - Date.now()).toBeLessThan(100);
    expect(result.error).toEqual(null);
  });

  test('should return error response when server returns error', async () => {
    makeFetchReturn({ data: 'abc', error: 'Some random error' });

    const result = await scanTicket('someSecretCode', scanCredentialsTestData);
    expect(result).toEqual(errorResponseFor('Some random error'));
  });

  test('should return error response when server response invalid', async () => {
    makeFetchReturn({ data: null, error: null });

    const result = await scanTicket('someSecretCode', scanCredentialsTestData);
    expect(result).toEqual(fallbackErrorResponse());
  });

  test('should return error response when fetch errors', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Some random failure'));
    vi.stubGlobal('fetch', mockFetch);

    const result = await scanTicket('someSecretCode', scanCredentialsTestData);
    expect(result).toEqual(fallbackErrorResponse());
  });

  test('should return error response when no internet access', async () => {
    setNavigatorOnline(false);
    makeFetchReturn({ data: true, error: null });

    const result = await scanTicket('someSecretCode', scanCredentialsTestData);
    expect(result).toEqual(noInternetAccessErrorResponse());
  });
});
