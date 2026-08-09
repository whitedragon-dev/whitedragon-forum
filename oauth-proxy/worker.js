/**
 * GitHub OAuth token-exchange proxy for Discussion Kit.
 *
 * REQUIRED configuration:
 *   ALLOWED_ORIGINS                  comma-separated list of allowed origins
 *   GITHUB_CLIENT_ID                 OAuth app client id
 *   GITHUB_CLIENT_SECRET             OAuth app client secret (secret!)
 *
 * OPTIONAL configuration (adds organization membership restriction):
 *   GITHUB_ALLOWED_ORGANIZATIONS     comma-separated list of GitHub organizations
 */

/**
 * @typedef {{ 
 *   ALLOWED_ORIGINS?: string, 
 *   GITHUB_CLIENT_ID: string, 
 *   GITHUB_CLIENT_SECRET: string,
 *   GITHUB_ALLOWED_ORGANIZATIONS?: string
 * }} Env
 */

/**
 * Parse the ALLOWED_ORIGINS CSV into a clean list.
 * @param {string | undefined} csv
 * @returns {string[]}
 */
export function parseAllowedOrigins(csv) {
	return (csv ?? '')
		.split(',')
		.map((origin) => origin.trim().replace(/\/+$/, ''))
		.filter(Boolean);
}

/**
 * Parse the GITHUB_ALLOWED_ORGANIZATIONS CSV into a clean list.
 * @param {string | undefined} csv
 * @returns {string[]}
 */
export function parseAllowedOrganizations(csv) {
	return (csv ?? '')
		.split(',')
		.map((org) => org.trim())
		.filter(Boolean);
}

export default {
	/**
	 * @param {Request} request
	 * @param {Env} env
	 * @returns {Promise<Response>}
	 */
	async fetch(request, env) {
		const url = new URL(request.url);
		const origin = request.headers.get('Origin');
		
		const cors = {
			'Access-Control-Allow-Origin': origin || '*',
			'Access-Control-Allow-Methods': 'POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
		};

		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: cors });
		}

		if (request.method !== 'POST') {
			return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
				status: 405, 
				headers: { 'Content-Type': 'application/json', ...cors } 
			});
		}

		/** @type {{ code?: string }} */
		let body;
		try {
			body = await request.json();
		} catch {
			return new Response(JSON.stringify({ error: 'Invalid JSON' }), { 
				status: 400, 
				headers: { 'Content-Type': 'application/json', ...cors } 
			});
		}

		const code = body.code;

		if (!code) {
			return new Response(JSON.stringify({ error: 'Missing code' }), { 
				status: 400, 
				headers: { 'Content-Type': 'application/json', ...cors } 
			});
		}

		// Exchange code for token
		const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
			body: JSON.stringify({
				client_id: env.GITHUB_CLIENT_ID,
				client_secret: env.GITHUB_CLIENT_SECRET,
				code: code,
				scope: 'read:org'
			})
		});

		const tokenData = await tokenRes.json();

		if (!tokenData.access_token) {
			return new Response(JSON.stringify({ 
				error: 'Token exchange failed',
				details: tokenData.error || 'Unknown error' 
			}), { 
				status: 400, 
				headers: { 'Content-Type': 'application/json', ...cors } 
			});
		}

		// Check organization membership
		const allowedOrgs = parseAllowedOrganizations(env.GITHUB_ALLOWED_ORGANIZATIONS);
		
		if (allowedOrgs.length > 0) {
			try {
				const orgRes = await fetch('https://api.github.com/user/orgs', {
					headers: {
						'Authorization': `Bearer ${tokenData.access_token}`,
						'User-Agent': 'Discussion-Kit',
						'Accept': 'application/json'
					}
				});

				if (orgRes.ok) {
					/** @type {Array<{ login: string }>} */
					const orgs = await orgRes.json();
					const userOrgs = orgs.map((org) => org.login);
					
					const isMember = allowedOrgs.some((allowed) => 
						userOrgs.some((userOrg) => userOrg.toLowerCase() === allowed.toLowerCase())
					);

					if (!isMember) {
						return new Response(JSON.stringify({
							error: 'Access denied',
							message: `You must be a member of ${allowedOrgs.join(', ')} to access this forum.`
						}), { 
							status: 403, 
							headers: { 'Content-Type': 'application/json', ...cors } 
						});
					}
				}
			} catch (/** @type {any} */ error) {
				console.error('Org check failed:', error);
				// If org check fails, allow access (fail open)
			}
		}

		return new Response(JSON.stringify({ 
			access_token: tokenData.access_token 
		}), { 
			status: 200, 
			headers: { 'Content-Type': 'application/json', ...cors } 
		});
	}
};
