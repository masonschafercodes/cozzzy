import { PERMISSION, TEAM_SUBSCRIPTION } from '@prisma/client';
import { prisma } from '~/utils/prisma';
import { TeamInviteNotFound } from '../CozzyErrors/TeamInviteNotFound';
import { TeamNotFound } from '../CozzyErrors/TeamNotFound';
import { UserAlreadyInTeamError } from '../CozzyErrors/UserAlreadyInATeamError';
import { UserNotFoundError } from '../CozzyErrors/UserNotFoundError';
import initStripe from 'stripe';
const stripe = new initStripe(process.env.STRIPE_SECRET_KEY as string, {
	apiVersion: '2022-08-01',
});

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

type ProjectRequestType = {
	name: string;
	teamId: string;
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

	async createTeamSubscription(teamId: string) {
		const team = await this.getTeamById(teamId);

		if (!team) {
			throw new TeamNotFound(`Team with id '${teamId}' not found`);
		} else if (!team.stripeId) {
			throw new Error(`Team with id '${teamId}' has no stripe id`);
		}

		const lineItems = [
			{
				price: 'price_1KUMsGBfW0YHBLNxupwvXQLy',
				quantity: 1,
			},
		];

		const session = await stripe.checkout.sessions.create({
			customer: team.stripeId,
			mode: 'subscription',
			payment_method_types: ['card'],
			line_items: lineItems,
			success_url: `http://localhost:3000/?payment=success`,
			cancel_url: `http://localhost:3000/?payment=cancelled`,
			metadata: {
				teamId: team.id,
			},
		});

		return session;
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
				include: {
					projects: true,
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

	async appendStripedId(teamId: string) {
		const team = await this.getTeamById(teamId);

		if (!team) {
			throw new TeamNotFound(`Team with id '${teamId}' not found`);
		} else if (team.stripeId) {
			return null;
		}

		const customer = await stripe.customers.create({ name: team.name });

		return await prisma.team.update({
			where: { id: teamId },
			data: {
				stripeId: customer.id,
			},
		});
	}

	async updateTeamSubscription(
		stripeId: string,
		subscriptionType: TEAM_SUBSCRIPTION,
	) {
		const team = await prisma.team.findUnique({
			where: { stripeId: stripeId },
		});

		if (!team) {
			throw new TeamNotFound(`Team with stripeId '${stripeId}' not found`);
		}

		return await prisma.team.update({
			where: { id: team.id },
			data: {
				subscriptionType: subscriptionType,
			},
		});
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

	/**
	 * **********************************************************************
	 * PROJECTS METHODS
	 * **********************************************************************
	 */

	/**
	 * ***********************************
	 * Create Methods
	 * ***********************************
	 */

	/**
	 *
	 * @param projectData The data to create the project with
	 * @example
	 * const project: Project = await createProject({
	 * 	name: 'Test Project',
	 * 	teamId: '1',
	 * });
	 */
	async createProject(projectData: ProjectRequestType) {
		return await prisma.project.create({
			data: {
				...projectData,
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
	 * @param id The id of the project to get
	 * @example
	 * const project: Project | null = await getProjectById('1')
	 */
	async getProjectById(id: string) {
		return await prisma.project.findUnique({ where: { id } });
	}

	/**
	 *
	 * @param teamId The id of the team to get projects for
	 * @example
	 * const projects: Project[] = await getProjectsByTeamId('1')
	 */
	async getProjectsByTeamId(teamId: string) {
		return await prisma.project.findMany({ where: { teamId } });
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
}
