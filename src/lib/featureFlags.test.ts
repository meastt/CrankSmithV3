import { isGravelBuilderEnabled } from './featureFlags';

describe('isGravelBuilderEnabled', () => {
  const original = process.env.CRANKSMITH_GRAVEL_BUILDER_ENABLED;

  afterEach(() => {
    if (original === undefined) delete process.env.CRANKSMITH_GRAVEL_BUILDER_ENABLED;
    else process.env.CRANKSMITH_GRAVEL_BUILDER_ENABLED = original;
  });

  test('defaults to enabled when env is unset', () => {
    delete process.env.CRANKSMITH_GRAVEL_BUILDER_ENABLED;
    expect(isGravelBuilderEnabled()).toBe(true);
  });

  test('returns false for explicit off values', () => {
    process.env.CRANKSMITH_GRAVEL_BUILDER_ENABLED = 'off';
    expect(isGravelBuilderEnabled()).toBe(false);
  });
});
