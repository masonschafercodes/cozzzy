import { NextApiRequest, NextApiResponse } from 'next';
import CozzyPrismaProvider from '~/CozzyProviders/CozzyPrismaProvider';
import { buffer } from 'micro';
import initStripe from 'stripe';
import { TEAM_SUBSCRIPTION } from '@prisma/client';
const stripe = new initStripe(process.env.STRIPE_SECRET_KEY as string, {
	apiVersion: '2022-08-01',
});

export const config = { api: { bodyParser: false } };

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const signature = req.headers['stripe-signature'];
	const signingSecret = process.env.STRIPE_SIGNING_KEY as string;
	const reqBuffer = await buffer(req);

	let event: any;

	try {
		if (signature) {
			event = stripe.webhooks.constructEvent(
				reqBuffer,
				signature,
				signingSecret,
			);
		}
	} catch (err: any) {
		console.log(err);
		return res.status(400).send(`Webhook Error: ${err.message}`);
	}

	const cp = new CozzyPrismaProvider();

	const stripeId: string = event.data.object.customer;

	switch (event.type) {
		case 'customer.subscription.created':
			if (stripeId) {
				try {
					await cp.updateTeamSubscription(stripeId, TEAM_SUBSCRIPTION.PAID);
				} catch (e: any) {
					console.log(e);
				}
			}
			break;
		case 'customer.subscription.updated':
			if (stripeId) {
				try {
					await cp.updateTeamSubscription(stripeId, TEAM_SUBSCRIPTION.PAID);
				} catch (e: any) {
					console.log(e);
				}
			}
			break;
		case 'customer.subscription.deleted':
			if (stripeId) {
				try {
					await cp.updateTeamSubscription(stripeId, TEAM_SUBSCRIPTION.FREE);
				} catch (e: any) {
					console.log(e);
				}
			}
			break;
		default:
			console.log(`Unhandled event type ${event.type}`);
	}

	res.send({ recieved: true });
}
