import { test, vi, expect, beforeEach } from 'vitest';

import { errorResponseFor, FALLBACK_ERROR_RESPONSE, NO_INTERNET_ACCESS_ERROR_RESPONSE } from './helper.ts';
import { scanTicket } from './scan-ticket.ts';
import { scanCredentialsTestData } from '../../test-data/scan-credentials.ts';

function setNavigatorOnline(value: boolean): void {
  Object.defineProperty(navigator, 'onLine', {
    value,
    writable: true,
  });
}

function makeFetchReturn(toReturn: { data: any; error: any }, ok: boolean = true): void {
  const mockFetch = vi.fn().mockResolvedValue({
    ok,
    json: () => Promise.resolve(toReturn),
  });
  vi.stubGlobal('fetch', mockFetch);
}

beforeEach(() => setNavigatorOnline(true));

test('should return data response when server responds correctly', async () => {
  const mockFetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () =>
      Promise.resolve({
        data: {
          result: 'SUCCESS',
          ownerName: 'ownerName',
          ownerEmail: 'ownerEmailAddress',
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
      ownerEmailAddress: 'ownerEmailAddress',
      ticketTypeName: 'ticketTypeName',
    }),
  );

  expect(result.data!.timestamp.getTime() - Date.now()).toBeLessThan(100);
  expect(result.error).toEqual(null);
});

test('should return error response when server returns error', async () => {
  makeFetchReturn({ data: 'abc', error: 'some random error' });

  const result = await scanTicket('someSecretCode', scanCredentialsTestData());
  expect(result).toEqual(errorResponseFor('some random error'));
});

test('should return error response when server response invalid', async () => {
  makeFetchReturn({ data: null, error: null });

  const result = await scanTicket('someSecretCode', scanCredentialsTestData());
  expect(result).toEqual(FALLBACK_ERROR_RESPONSE);
});

test('should return error response when fetch errors', async () => {
  const mockFetch = vi.fn().mockRejectedValue(new Error('some random failure'));
  vi.stubGlobal('fetch', mockFetch);

  const result = await scanTicket('someSecretCode', scanCredentialsTestData());
  expect(result).toEqual(FALLBACK_ERROR_RESPONSE);
});

test('should return error response when no internet access', async () => {
  setNavigatorOnline(false);
  makeFetchReturn({ data: 'abc', error: null });

  const result = await scanTicket('someSecretCode', scanCredentialsTestData());
  expect(result).toEqual(NO_INTERNET_ACCESS_ERROR_RESPONSE);
});

test('should return error response when http status not ok but json indicates success', async () => {
  makeFetchReturn({ data: 'abc', error: null }, false);

  const result = await scanTicket('someSecretCode', scanCredentialsTestData());
  expect(result).toEqual(FALLBACK_ERROR_RESPONSE);
});

test('should return error response when response not JSON', async () => {
  const mockFetch = vi.fn().mockResolvedValue('Not JSON');
  vi.stubGlobal('fetch', mockFetch);

  const result = await scanTicket('someSecretCode', scanCredentialsTestData());
  expect(result).toEqual(FALLBACK_ERROR_RESPONSE);
});
