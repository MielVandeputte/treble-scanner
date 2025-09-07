import { test, describe, vi, expect, beforeEach } from 'vitest';

import { checkScanAuthorizationCode } from './check-scan-authorization-code.ts';
import { dataResponseFor, errorResponseFor, fallbackErrorResponse, noInternetAccessErrorResponse } from './helper.ts';
import { ScanCredentials } from '../types/scan-credentials.ts';

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

describe('checkScanAuthorizationCode', () => {
  beforeEach(() => setNavigatorOnline(true));

  test('should return data response when authorization code valid', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ data: true, error: null }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const scanCredentials = {
      eventId: 'eventId',
      scanAuthorizationCode: 'scanAuthorizationCode',
    };
    const result = await checkScanAuthorizationCode(scanCredentials);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringMatching(
        '^https://www.staging.treble-events.be/api/events/eventId/modules/basic-ticket-store/check-scan-authorization-code$',
      ),
      {
        method: 'POST',
        body: JSON.stringify({ scanAuthorizationCode: 'scanAuthorizationCode' }),
      },
    );

    expect(result).toEqual(dataResponseFor(scanCredentials));
  });

  test('should return error response when authorization code invalid', async () => {
    makeFetchReturn({ data: false, error: null });

    const result = await checkScanAuthorizationCode(scanCredentialsTestData);
    expect(result).toEqual(errorResponseFor('Event ID of code verkeerd'));
  });

  test('should return error response when server returns error', async () => {
    makeFetchReturn({ data: 'abc', error: 'Some random error' });

    const result = await checkScanAuthorizationCode(scanCredentialsTestData);
    expect(result).toEqual(errorResponseFor('Some random error'));
  });

  test('should return error response when server response invalid', async () => {
    makeFetchReturn({ data: null, error: null });

    const result = await checkScanAuthorizationCode(scanCredentialsTestData);
    expect(result).toEqual(fallbackErrorResponse());
  });

  test('should return error response when fetch errors', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Some random failure'));
    vi.stubGlobal('fetch', mockFetch);

    const result = await checkScanAuthorizationCode(scanCredentialsTestData);
    expect(result).toEqual(fallbackErrorResponse());
  });

  test('should return error response when no internet access', async () => {
    setNavigatorOnline(false);
    makeFetchReturn({ data: true, error: null });

    const result = await checkScanAuthorizationCode(scanCredentialsTestData);
    expect(result).toEqual(noInternetAccessErrorResponse());
  });
});
