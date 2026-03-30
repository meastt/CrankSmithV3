import { jest } from '@jest/globals';

const mockPrisma = {
  user: {
    upsert: jest.fn(),
  },
  savedBuild: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrisma),
}));

jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(async () => ({ userId: 'user_123' })),
  currentUser: jest.fn(async () => ({ emailAddresses: [{ emailAddress: 'test@example.com' }] })),
}));

describe('POST /api/builds', () => {
  const originalFlag = process.env.CRANKSMITH_GRAVEL_BUILDER_ENABLED;

  beforeEach(() => {
    jest.clearAllMocks();
    (mockPrisma.user.upsert as any).mockResolvedValue(undefined);
    (mockPrisma.savedBuild.create as any).mockResolvedValue({ id: 'build_1', name: 'My Build' });
    (mockPrisma.savedBuild.findMany as any).mockResolvedValue([]);
  });

  afterEach(() => {
    if (originalFlag === undefined) delete process.env.CRANKSMITH_GRAVEL_BUILDER_ENABLED;
    else process.env.CRANKSMITH_GRAVEL_BUILDER_ENABLED = originalFlag;
  });

  test('rejects non-gravel/non-eligible parts payloads', async () => {
    const { POST } = await import('./route');

    const request = new Request('http://localhost/api/builds', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Bad Build',
        parts: {
          Frame: { id: 'road-1', name: 'Road Frame', discipline: 'road', builderEligible: true },
        },
      }),
      headers: { 'content-type': 'application/json' },
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error).toContain('non-gravel');
    expect(json.violations).toEqual(['Frame: Road Frame']);
    expect(mockPrisma.savedBuild.create).not.toHaveBeenCalled();
  });

  test('saves valid gravel payloads', async () => {
    const { POST } = await import('./route');

    const request = new Request('http://localhost/api/builds', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Good Build',
        parts: {
          Frame: { id: 'gravel-1', name: 'Gravel Frame', discipline: 'gravel', builderEligible: true },
        },
      }),
      headers: { 'content-type': 'application/json' },
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(mockPrisma.user.upsert).toHaveBeenCalledTimes(1);
    expect(mockPrisma.savedBuild.create).toHaveBeenCalledTimes(1);
  });

  test('allows legacy/non-gravel saves when rollout flag is disabled', async () => {
    process.env.CRANKSMITH_GRAVEL_BUILDER_ENABLED = 'false';
    const { POST } = await import('./route');

    const request = new Request('http://localhost/api/builds', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Legacy Allowed',
        parts: {
          Frame: { id: 'road-1', name: 'Road Frame', discipline: 'road', builderEligible: true },
        },
      }),
      headers: { 'content-type': 'application/json' },
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    expect(mockPrisma.savedBuild.create).toHaveBeenCalledTimes(1);
  });
});

describe('GET /api/builds', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (mockPrisma.savedBuild.findMany as any).mockResolvedValue([
      {
        id: 'good',
        name: 'Good Build',
        parts: JSON.stringify({
          Frame: { id: 'g1', name: 'Gravel Frame', discipline: 'gravel', builderEligible: true },
        }),
        createdAt: '2026-03-30T00:00:00.000Z',
      },
      {
        id: 'legacy',
        name: 'Legacy Build',
        parts: JSON.stringify({
          Frame: { id: 'r1', name: 'Road Frame', discipline: 'road', builderEligible: true },
        }),
        createdAt: '2026-03-29T00:00:00.000Z',
      },
      {
        id: 'broken',
        name: 'Broken Build',
        parts: '{not-json',
        createdAt: '2026-03-28T00:00:00.000Z',
      },
    ]);
  });

  test('returns migration assessment metadata for each build', async () => {
    const { GET } = await import('./route');

    const response = await GET(new Request('http://localhost/api/builds'));
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(mockPrisma.savedBuild.findMany).toHaveBeenCalledTimes(1);
    expect(json).toEqual([
      expect.objectContaining({
        id: 'good',
        builderStatus: 'gravel_compatible',
        builderViolations: [],
      }),
      expect.objectContaining({
        id: 'legacy',
        builderStatus: 'legacy_non_gravel',
        builderViolations: ['Frame: Road Frame'],
      }),
      expect.objectContaining({
        id: 'broken',
        builderStatus: 'invalid_payload',
        builderViolations: ['Invalid build payload'],
      }),
    ]);
  });
});
