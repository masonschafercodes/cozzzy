import { prisma } from '~/utils/prisma';
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
	async getUserById(id: string) {
		return await prisma.user.findUnique({ where: { id } });
	}

	async getUserByEmail(email: string) {
		return await prisma.user.findUnique({ where: { email } });
	}

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

	async getTeamById(id: string) {
		return await prisma.team.findUnique({ where: { id } });
	}

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

	async getTeamMembers(teamId: string) {
		const teamWithUsers = await prisma.team.findUnique({
			where: { id: teamId },
			include: { users: true },
		});

		if (!teamWithUsers) return [];

		return teamWithUsers.users;
	}

	async getTeamByName(name: string) {
		return await prisma.team.findMany({
			where: {
				name: {
					contains: name,
				},
			},
		});
	}

	async createTeam(teamName: createTeamType) {
		return await prisma.team.create({
			data: {
				name: teamName.name,
			},
		});
	}

	async getTeamInviteById(id: string) {
		return await prisma.teamInvite.findUnique({ where: { id } });
	}

	async createTeamInvite(teamInviteData: TeamInviteRequestType) {
		return await prisma.teamInvite.create({
			data: {
				...teamInviteData,
			},
		});
	}

	async createTeamInviteByEmail(teamInviteData: TeamInviteRequestByEmailType) {
		const user = await this.getUserByEmail(teamInviteData.email);

		if (!user) {
			throw new UserNotFoundError('User was not found!');
		}
		if (user.teamId) {
			throw new UserAlreadyInTeamError('User is already in a team!');
		}

		return await prisma.teamInvite.create({
			data: {
				teamId: teamInviteData.teamId,
				userId: user.id,
			},
		});
	}

	// Accept a team invite
	async acceptTeamInvite(teamInviteId: string) {
		const teamInvite = await this.getTeamInviteById(teamInviteId);

		if (!teamInvite) {
			throw new Error('Team invite not found');
		}

		const user = await this.getUserById(teamInvite.userId);

		if (!user) {
			throw new UserNotFoundError('User not found!');
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
	}
}
