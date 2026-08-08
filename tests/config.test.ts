import { describe, expect, it } from 'vitest';
import { configIncomplete, forumConfig, themeCss } from '$lib/config';

// Exercises the real resolution pipeline: root forum.config.ts merged over
// defaults, repo fallback applied, theme compiled.
describe('resolved config', () => {
	it('merges the root forum.config.ts over defaults', () => {
		// CHANGED: Updated to match your custom values
		expect(forumConfig.repo.owner).toBe('whitedragon-dev');
		expect(forumConfig.repo.name).toBe('whitedragon-forum');
		expect(forumConfig.site.name).toBe('Whitedragon Dev Hub');
		// default that forum.config.ts does not override
		expect(forumConfig.content.articles.marker).toBe('<!-- dk:article -->');
	});

	it('is not incomplete when a repo is configured', () => {
		expect(configIncomplete).toBe(false);
	});

	it('compiles theme overrides (none in the shipped config)', () => {
		// CHANGED: Your theme is now customized with DEV.to purple colors
		expect(themeCss).toContain('--fd-primary:hsl(260 100% 40%)');
		expect(themeCss).toContain('.dark{--fd-primary:hsl(260 100% 55%)}');
	});
});
