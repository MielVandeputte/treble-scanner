import { faker } from '@faker-js/faker';

import { ScanCredentials } from '../src/types/scan-credentials.type.ts';

export function scanCredentialsTestData(scanCredentialsCustomizations?: Partial<ScanCredentials>): ScanCredentials {
  return {
    eventId: faker.lorem.word(),
    scanAuthorizationCode: faker.lorem.word(),

    ...scanCredentialsCustomizations,
  };
}
