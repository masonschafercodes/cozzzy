import { PERMISSION } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import CozzyPrismaProvider from '~/CozzyProviders/CozzyPrismaProvider';

/**
 * You need to provide an action for every thing you want to do with the API.
 * Current Actions Available:
 * - GET: None
 * - POST: get-team, get-team-invite, create-team
 * - PUT: None
 * - DELETE: None
 * - PATCH: create-team-invite, accept-team-invite
 *
 * All actions have a set of body parameters that you can use to pass data to the action.
 */

export default async function teamsAPIHandler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const { method } = req;
	const { action } = req.body;
	const cp = new CozzyPrismaProvider();

	if (method === 'POST') {
		const { teamName }: { teamName: string | null } = req.body;

		if (!teamName) return res.status(400).json({ error: 'Missing teamName' });

		const team = await cp.createTeam({ name: teamName });
		return res.status(200).json(team);
	} else {
		return res.status(405).json({ error: 'Invalid method' });
	}
}
