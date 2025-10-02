/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

(globalThis as any).global = globalThis;


import { withAccelerate } from '@prisma/extension-accelerate';
import { EmailStatus, EdgeClient as PrismaClient } from '@repo/db';

import * as PostalMime from 'postal-mime';

export const getPrisma = (database_url: string) => {
	const prisma = new PrismaClient({
		datasourceUrl: database_url,
	}).$extends(withAccelerate())
	return prisma
}

export default {
	async email(message: ForwardableEmailMessage, env: Env, ctx: ExecutionContext) {
		const parser = new PostalMime.default();
		const rawEmail = new Response(message.raw);
		const email = await parser.parse(await rawEmail.arrayBuffer());
		const prisma = getPrisma(env.DATABASE_URL);

		const savedEmail = await prisma.email.create({
			data: {
				id: email.messageId ?? crypto.randomUUID(),
				from: {
					connectOrCreate: {
						where: { email: email.from!.address },
						create: {
							email: email.from!.address!,
							name: email.from!.name || '',
						},
					}
				},
				to: {
					connect: await Promise.all(
						(email.to || []).map(
							async (to) => (
								await prisma.emailedAddress.upsert({
									where: { email: to.address! },
									create: {
										email: to.address!,
										name: to.name || '',
									},
									update: {},
								})
							))),
				},
				subject: email.subject!,
				body: email.html ?? '',
				status: EmailStatus.RECEIVED,
				receivedAt: new Date(email.date || Date.now()),
				type: 'INBOX',
			},
		});

		console.log("Received Email:", savedEmail)

	},
};