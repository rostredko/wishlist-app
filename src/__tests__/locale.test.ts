import { describe, expect, it, vi } from 'vitest';
import { isProbablyBot } from '@utils/locale';

describe('isProbablyBot', () => {
  it('detects modern AI crawler user agents', () => {
    vi.stubGlobal('navigator', { webdriver: false });

    expect(isProbablyBot('Mozilla/5.0 (compatible; GPTBot/1.0; +https://openai.com/gptbot)')).toBe(true);
    expect(isProbablyBot('Mozilla/5.0 (compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot)')).toBe(true);
    expect(isProbablyBot('Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://www.perplexity.ai/bot)')).toBe(true);
    expect(isProbablyBot('Mozilla/5.0 (compatible; ClaudeBot/1.0; +https://www.anthropic.com)')).toBe(true);
    expect(isProbablyBot('Mozilla/5.0 (compatible; Google-Extended/1.0; +https://developers.google.com/search)')).toBe(true);
  });
});
