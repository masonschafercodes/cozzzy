import { PERMISSION } from '@prisma/client';
import { prisma } from '~/utils/prisma';
import { TeamInviteNotFound } from '../CozzyErrors/TeamInviteNotFound';
import { TeamNotFound } from '../CozzyErrors/TeamNotFound';
import { UserAlreadyInTeamError } from '../CozzyErrors/UserAlreadyInATeamError';
import { UserNotFoundError } from '../CozzyErrors/UserNotFoundError';

type TeamInviteRequestType = {
	teamId: string;
	userId: string;
};

type TeamInviteRequestByEmailType = {
	teamId: string;
	email: string;
};

type createTeamType = {
	name: string;
};

export default class CozzyPrismaProvider {
	/**
	 * **********************************************************************
	 * USER METHODS
	 * **********************************************************************
	 */

	/**
	 * ***********************************
	 * Create Methods
	 * ***********************************
	 */

	/**
	 * ***********************************
	 * Read Methods
	 * ***********************************
	 */

	/**
	 *
	 * @param id The id of the user to get
	 *
	 * @example
	 * const user: User | null = await getUserById('123')
	 */
	async getUserById(id: string) {
		return await prisma.user.findUnique({ where: { id } });
	}

	/**
	 *
	 * @param email The email of the user to get
	 *
	 * @example
	 * const user: User | null = await getUserByEmail('test@test.com')
	 */
	async getUserByEmail(email: string) {
		return await prisma.user.findUnique({ where: { email } });
	}

	/**
	 * ***********************************
	 * Update Methods
	 * ***********************************
	 */

	/**
	 *
	 * @param userId The id of the user to get
	 * @param permRole The permission role to set
	 *
	 * @example
	 * const user: User = await changeUserPermissions('1', 'ADMIN')
	 */
	async changeUserPermissions(userId: string, permRole: PERMISSION) {
		return await prisma.user.update({
			where: { id: userId },
			data: {
				permission: permRole,
			},
		});
	}

	/**
	 * ***********************************
	 * Delete Methods
	 * ***********************************
	 */

	/**
	 *
	 * @param userId The id of the user to get
	 * @param teamId The id of the team to get
	 *
	 * @example
	 * const team: Team = await removeUserFromTeam('1', '2')
	 */
	async removeUserFromTeam(userId: string, teamId: string) {
		return await prisma.team.update({
			where: { id: teamId },
			data: {
				users: {
					disconnect: {
						id: userId,
					},
				},
			},
		});
	}

	/**
	 * **********************************************************************
	 * **********************************************************************
	 */

	/**
	 * **********************************************************************
	 * TEAM METHODS
	 * **********************************************************************
	 */

	/**
	 * ***********************************
	 * Create Methods
	 * ***********************************
	 */

	async createTeam(teamName: createTeamType) {
		return await prisma.team.create({
			data: {
				name: teamName.name,
			},
		});
	}

	/**
	 * ***********************************
	 * Read Methods
	 * ***********************************
	 */

	/**
	 *
	 * @param id The id of the team to get
	 *
	 * @example
	 * const team: Team | null = await getTeamById('1')
	 */
	async getTeamById(id: string) {
		return await prisma.team.findUnique({ where: { id } });
	}

	/**
	 *
	 * @param email The email of the user to get
	 *
	 * @example
	 * const team: Team | null = await getTeamByUserEmail('test@test.com')
	 */
	async getTeamByUserEmail(email: string) {
		const user = await this.getUserByEmail(email);

		if (!user || !user.teamId) {
			return null;
		} else {
			return await prisma.team.findUnique({
				where: {
					id: user.teamId,
				},
			});
		}
	}

	/**
	 *
	 * @param teamId The id of the team to get
	 *
	 * @example
	 * const teamMembers: User[] = await getTeamMembers('1')
	 */
	async getTeamMembers(teamId: string) {
		const teamWithUsers = await prisma.team.findUnique({
			where: { id: teamId },
			include: { users: true },
		});

		if (!teamWithUsers?.users) return { users: [] };

		return {
			users: teamWithUsers.users,
		};
	}

	/**
	 * ***********************************
	 * Update Methods
	 * ***********************************
	 */

	/**
	 * ***********************************
	 * Delete Methods
	 * ***********************************
	 */

	/**
	 * **********************************************************************
	 * **********************************************************************
	 */

	/**
	 * **********************************************************************
	 * TEAM INVITE METHODS
	 * **********************************************************************
	 */

	/**
	 * ***********************************
	 * Create Methods
	 * ***********************************
	 */

	/**
	 *
	 * @param teamInviteData The data to create the team invite with
	 * @example
	 * const teamInvite: TeamInvite = await createTeamInvite({
	 * 	teamId: '1',
	 * 	userId: '2',
	 * });
	 */
	async createTeamInvite(teamInviteData: TeamInviteRequestType) {
		return await prisma.teamInvite.create({
			data: {
				...teamInviteData,
			},
		});
	}

	/**
	 *
	 * @param teamInviteData The data to create the team invite with
	 * @example
	 * const teamInvite: TeamInvite = await createTeamInvite({
	 * 	teamId: '1',
	 * 	email: 'test@test.com',
	 * });
	 */
	async createTeamInviteByEmail(teamInviteData: TeamInviteRequestByEmailType) {
		const user = await this.getUserByEmail(teamInviteData.email);

		if (!user) {
			throw new UserNotFoundError('User was not found.');
		}
		if (user.teamId) {
			throw new UserAlreadyInTeamError('User is already in a team.');
		}

		const team = await this.getTeamById(teamInviteData.teamId);

		if (!team) {
			throw new TeamNotFound('Team was not found.');
		}

		return await prisma.teamInvite.create({
			data: {
				teamId: teamInviteData.teamId,
				userId: user.id,
			},
		});
	}

	/**
	 * ***********************************
	 * Read Methods
	 * ***********************************
	 */

	/**
	 *
	 * @param id The id of the team invite to get
	 * @example
	 * const teamInvite: TeamInvite | null = await getTeamInviteById('1')
	 */
	async getTeamInviteById(id: string) {
		return await prisma.teamInvite.findUnique({ where: { id } });
	}

	/**
	 * ***********************************
	 * Update Methods
	 * ***********************************
	 */

	/**
	 *
	 * @param teamInviteId The id of the team invite to update
	 * @example
	 * const teamInvite: TeamInvite = await acceptTeamInvite('1')
	 */
	async handleTeamInvite(teamInviteId: string, action: string) {
		const teamInvite = await this.getTeamInviteById(teamInviteId);

		if (!teamInvite) {
			throw new TeamInviteNotFound('Team invite not found');
		}

		if (action === 'accept') {
			const user = await this.getUserById(teamInvite.userId);

			if (!user) {
				throw new UserNotFoundError('User not found.');
			}

			const team = await prisma.team.update({
				where: { id: teamInvite.teamId },
				data: {
					users: {
						connect: {
							id: user.id,
						},
					},
				},
			});

			await prisma.teamInvite.delete({ where: { id: teamInviteId } });

			return team;
		} else if (action === 'reject') {
			await prisma.teamInvite.delete({ where: { id: teamInviteId } });

			return teamInvite;
		}
	}

	/**
	 * ***********************************
	 * Delete Methods
	 * ***********************************
	 */

	/**
	 * **********************************************************************
	 * **********************************************************************
	 */
}
