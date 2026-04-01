import { jest } from '@jest/globals';

const findManyMock = jest.fn();

jest.mock('@/lib/prisma', () => ({
  prisma: {
    component: {
      findMany: findManyMock,
    },
  },
}));

jest.mock('@/lib/normalization', () => ({
  normalizeComponent: (c: any) => c,
}));

jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(async () => ({ userId: 'admin' })),
}));

describe('GET /api/components', () => {
  const originalFlag = process.env.CRANKSMITH_GRAVEL_BUILDER_ENABLED;

  beforeEach(() => {
    jest.clearAllMocks();
    (findManyMock as any).mockResolvedValue([]);
  });

  afterEach(() => {
    if (originalFlag === undefined) delete process.env.CRANKSMITH_GRAVEL_BUILDER_ENABLED;
    else process.env.CRANKSMITH_GRAVEL_BUILDER_ENABLED = originalFlag;
  });

  test('applies builder context gravel-only filter', async () => {
    const { GET } = await import('./route');

    const request = new Request('http://localhost/api/components?type=Frame&context=builder');
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(findManyMock).toHaveBeenCalledWith({
      where: {
        type: 'Frame',
        builderEligible: true,
        discipline: { in: ['gravel', 'multi'] },
      },
    });
  });

  test('default context does not leak builder-only filters', async () => {
    const { GET } = await import('./route');

    const request = new Request('http://localhost/api/components?type=Wheel');
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(findManyMock).toHaveBeenCalledWith({
      where: {
        type: 'Wheel',
      },
    });
  });

  test('supports explicit non-builder filtering controls', async () => {
    const { GET } = await import('./route');

    const request = new Request('http://localhost/api/components?type=Cassette&discipline=road&builderEligible=false');
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(findManyMock).toHaveBeenCalledWith({
      where: {
        type: 'Cassette',
        discipline: 'road',
        builderEligible: false,
      },
    });
  });

  test('builder context does not accept road/false overrides from query params', async () => {
    const { GET } = await import('./route');

    const request = new Request('http://localhost/api/components?type=Frame&context=builder&discipline=road&builderEligible=false');
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(findManyMock).toHaveBeenCalledWith({
      where: {
        type: 'Frame',
        builderEligible: true,
        discipline: { in: ['gravel', 'multi'] },
      },
    });
  });

  test('builder context parsing is case-insensitive', async () => {
    const { GET } = await import('./route');

    const request = new Request('http://localhost/api/components?type=Frame&context=BuIlDeR&discipline=road');
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(findManyMock).toHaveBeenCalledWith({
      where: {
        type: 'Frame',
        builderEligible: true,
        discipline: { in: ['gravel', 'multi'] },
      },
    });
  });

  test('builder context behaves as non-builder when rollout flag is disabled', async () => {
    process.env.CRANKSMITH_GRAVEL_BUILDER_ENABLED = 'false';
    const { GET } = await import('./route');

    const request = new Request('http://localhost/api/components?type=Frame&context=builder&discipline=road&builderEligible=false');
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(findManyMock).toHaveBeenCalledWith({
      where: {
        type: 'Frame',
        discipline: 'road',
        builderEligible: false,
      },
    });
  });
});
