import { NextApiRequest, NextApiResponse } from 'next';
import { CozzyError } from '~/CozzyProviders/CozzyErrors';
import CozzyPrismaProvider from '~/CozzyProviders/CozzyPrismaProvider';
import { prisma } from '~/utils/prisma';

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
		if (action === 'get-team') {
			const { teamId }: { teamId: string | null } = req.body;

			if (!teamId) return res.status(400).json({ error: 'Missing teamId' });

			const team = await cp.getTeamById(teamId);
			return res.status(200).json(team);
		} else if (action === 'get-team-invite') {
			const { teamInviteId }: { teamInviteId: string | null } = req.body;

			if (!teamInviteId)
				return res.status(400).json({ error: 'Missing teamInviteId' });

			const teamInvite = await cp.getTeamInviteById(teamInviteId);
			return res.status(200).json(teamInvite);
		} else if (action === 'create-team') {
			const { teamName }: { teamName: string | null } = req.body;

			if (!teamName) return res.status(400).json({ error: 'Missing teamName' });

			const team = await cp.createTeam({ name: teamName });
			return res.status(200).json(team);
		} else if (action === 'get-team-members') {
			const { teamId }: { teamId: string | null } = req.body;

			if (!teamId) return res.status(400).json({ error: 'Missing teamId' });

			const team = await cp.getTeamMembers(teamId);
			return res.status(200).json(team);
		} else if (action === 'remove-team-member') {
			const {
				teamId,
				userId,
			}: { teamId: string | null; userId: string | null } = req.body;

			if (!teamId) return res.status(400).json({ error: 'Missing teamId' });
			if (!userId) return res.status(400).json({ error: 'Missing userId' });

			const team = await cp.removeUserFromTeam(userId, teamId);

			res.status(200).json(team);
		} else {
			return res.status(400).json({ error: 'Invalid action' });
		}
	} else if (method === 'PATCH') {
		if (action === 'create-team-invite') {
			const { teamId, email }: { teamId: string | null; email: string | null } =
				req.body;

			if (!teamId) return res.status(400).json({ error: 'Missing teamId' });
			if (!email) return res.status(400).json({ error: 'Missing email' });

			try {
				const teamInvite = await cp.createTeamInviteByEmail({ teamId, email });
				return res.status(200).json(teamInvite);
			} catch (e: any) {
				return res.status(400).json({ error: e.message });
			}
		} else if (action === 'accept-team-invite') {
			const { teamInviteId }: { teamInviteId: string | null } = req.body;

			if (!teamInviteId)
				return res.status(400).json({ error: 'Missing teamInviteId' });

			try {
				const acceptedTeamInvite = await cp.acceptTeamInvite(teamInviteId);
				return res.status(200).json(acceptedTeamInvite);
			} catch (e: any) {
				return res.status(400).json({ error: e.message });
			}
		} else {
			return res.status(400).json({ error: 'Invalid action' });
		}
	} else {
		return res.status(405).json({ error: 'Invalid method' });
	}
}
