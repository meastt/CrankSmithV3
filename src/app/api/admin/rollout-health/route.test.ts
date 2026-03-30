import { jest } from '@jest/globals';

const findManyMock = jest.fn();

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({
    savedBuild: {
      findMany: findManyMock,
    },
  })),
}));

const authMock = jest.fn();
jest.mock('@clerk/nextjs/server', () => ({
  auth: () => authMock(),
}));

describe('GET /api/admin/rollout-health', () => {
  const originalAdmins = process.env.ADMIN_USER_IDS;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.ADMIN_USER_IDS = 'admin_1';
    delete process.env.CRANKSMITH_GRAVEL_BUILDER_ENABLED;
  });

  afterAll(() => {
    if (originalAdmins === undefined) delete process.env.ADMIN_USER_IDS;
    else process.env.ADMIN_USER_IDS = originalAdmins;
  });

  test('rejects non-admin requests', async () => {
    (authMock as any).mockResolvedValue({ userId: 'user_2' });
    const { GET } = await import('./route');

    const response = await GET();
    expect(response.status).toBe(401);
  });

  test('returns rollout health summary for admin', async () => {
    (authMock as any).mockResolvedValue({ userId: 'admin_1' });
    (findManyMock as any).mockResolvedValue([
      {
        parts: JSON.stringify({
          Frame: { id: 'g1', name: 'Gravel Frame', discipline: 'gravel', builderEligible: true },
        }),
      },
      {
        parts: JSON.stringify({
          Frame: { id: 'r1', name: 'Road Frame', discipline: 'road', builderEligible: true },
        }),
      },
      {
        parts: '{bad-json',
      },
    ]);

    const { GET } = await import('./route');
    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.builderFeatureEnabled).toBe(true);
    expect(json.totals).toEqual({
      totalBuilds: 3,
      gravelCompatible: 1,
      legacyNonGravel: 1,
      invalidPayload: 1,
    });
  });
});
