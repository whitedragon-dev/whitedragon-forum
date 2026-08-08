import { describe, expect, it } from 'vitest';
import { configIncomplete, forumConfig, themeCss } from '$lib/config';

// Exercises the real resolution pipeline: root forum.config.ts merged over
// defaults, repo fallback applied, theme compiled.
describe('resolved config', () => {
	it('merges the root forum.config.ts over defaults', () => {
		expect(forumConfig.repo.owner).toBe('whitedragon-dev');
		expect(forumConfig.repo.name).toBe('whitedragon-forum');
		expect(forumConfig.site.name).toBe('Whitedragon Dev Hub');
		expect(forumConfig.content.articles.marker).toBe('<!-- dk:article -->');
	});

	it('is not incomplete when a repo is configured', () => {
		expect(configIncomplete).toBe(false);
	});

	it('compiles theme overrides (none in the shipped config)', () => {
		// CHANGED: Check that BOTH light and dark theme values exist
		expect(themeCss).toContain('--fd-primary:hsl(260 100% 40%)');  // Light theme
		expect(themeCss).toContain('--fd-primary:hsl(260 100% 55%)');  // Dark theme
	});
});
