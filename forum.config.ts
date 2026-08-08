import { defineForumConfig } from './src/lib/config/schema';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  Whitedragon Dev Hub - Forum Configuration
 * ─────────────────────────────────────────────────────────────────────────────
 *  A DEV.to-style community forum powered by GitHub Discussions
 *  Deployed on GitHub Pages with full authentication and reputation system
 * 
 *  ⚠️ EDIT THIS ONE PLACEHOLDER:
 *     - Ov23ctmoDN6GtAyNvRcE  → Your actual Client ID from GitHub OAuth App
 */
export default defineForumConfig({
	// ─── Site Branding ──────────────────────────────────────────────────────
	site: {
		name: 'Whitedragon Dev Hub',
		description: 'A place for the members of whitedragon-dev to share knowledge',
		logo: '❖',                        // Unique emoji logo
		footer: 'Built with ❤️ and GitHub Discussions'
	},

	// ─── Repository ──────────────────────────────────────────────────────────
	repo: {
		owner: 'whitedragon-dev',
		name: 'whitedragon-forum'
	},

	// ─── Navigation ──────────────────────────────────────────────────────────
	nav: [
		{ 
			label: 'GitHub', 
			href: 'https://github.com/whitedragon-dev/whitedragon-forum', 
			external: true 
		},
		{ 
			label: 'Discussions', 
			href: 'https://github.com/whitedragon-dev/whitedragon-forum/discussions', 
			external: true 
		}
	],

	// ─── Authentication ──────────────────────────────────────────────────────
	auth: {
		allowToken: true,  // Allows PAT sign-in as fallback
		oauth: {
			// 🔑 EDIT THIS: Replace with your GitHub OAuth App Client ID
			clientId: 'Ov23ctmoDN6GtAyNvRcE',
			
			// 🌐 Your Cloudflare Worker URL (already correct)
			proxyUrl: 'https://whitedragon-forum-oauth.whitedragon-dev.workers.dev/'
		}
	},

	// ─── Admins & Moderators ─────────────────────────────────────────────────
	admins: {
		logins: ['whitedragon-one', 'whitedragon-dev'],
		badgeLabel: 'Admin'
	},

	// ─── Custom Badges ──────────────────────────────────────────────────────
	badges: {
		'Moderator': ['whitedragon-zero'],
		// Add more badges as needed:
		// 'Contributor': ['username1', 'username2'],
	},

	// ─── Content Settings ──────────────────────────────────────────────────
	content: {
		pageSize: 25,
		sort: 'CREATED_AT',
		articles: { enabled: true },
		topics: {
			include: ['general', 'showcase', 'ideas', 'qna', 'announcements'],
			exclude: [],
			restricted: ['announcements']  // Only admins can post here
		}
	},

	// ─── Features ──────────────────────────────────────────────────────────
	features: {
		search: true,
		reactions: true,
		upvotes: true
	},

	// ─── Reputation System (Like DEV.to) ──────────────────────────────────
	rep: {
		enabled: true,
		gains: { 
			post: 5,
			comment: 2,
			answerAccepted: 15
		},
		dailyCaps: { 
			post: 25,
			comment: 10
		},
		topics: { 
			showcase: 50,  // Need 50 rep to post in showcase
		},
		onViolation: 'move',
		fallbackTopic: 'general',
		exemptMaintainers: true
	},

	// ─── Read-Only Archive (For Signed-Out Visitors) ──────────────────────
	archive: {
		enabled: true
	},

	// ─── Theme (DEV.to Purple Style) ──────────────────────────────────────
	theme: {
		light: {
			primary: 'hsl(260 100% 40%)',        // DEV.to purple #5800d0
			primaryForeground: 'hsl(0 0% 100%)',
			background: 'hsl(0 0% 98%)',
			card: 'hsl(0 0% 100%)',
			cardForeground: 'hsl(0 0% 10%)',
			border: 'hsl(0 0% 90%)',
			muted: 'hsl(0 0% 96%)',
			mutedForeground: 'hsl(0 0% 45%)',
			accent: 'hsl(260 100% 40%)',
			accentForeground: 'hsl(0 0% 100%)',
			ring: 'hsl(260 100% 40%)',
			link: 'hsl(260 100% 40%)'
		},
		dark: {
			primary: 'hsl(260 100% 55%)',        // Brighter purple for dark mode
			primaryForeground: 'hsl(0 0% 100%)',
			background: 'hsl(0 0% 8%)',
			card: 'hsl(0 0% 13%)',
			cardForeground: 'hsl(0 0% 95%)',
			border: 'hsl(0 0% 20%)',
			muted: 'hsl(0 0% 15%)',
			mutedForeground: 'hsl(0 0% 60%)',
			accent: 'hsl(260 100% 55%)',
			accentForeground: 'hsl(0 0% 100%)',
			ring: 'hsl(260 100% 55%)',
			link: 'hsl(260 100% 60%)'
		}
	}
});
