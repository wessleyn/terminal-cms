import { createExecutionContext, env, waitOnExecutionContext } from 'cloudflare:test';
import { describe, expect, it, vi } from 'vitest';
import worker from '../src/index';

describe('Email Worker', () => {
	it('processes email messages correctly', async () => {
		const mockEmailMessage: ForwardableEmailMessage = {
			from: 'sender@example.com',
			to: 'recipient@example.com',
			raw: new ReadableStream({
				start(controller) {
					controller.enqueue(
						new TextEncoder().encode(`
							From: sender@example.com\nTo: recipient@example.com\nSubject: Test Email\n\nThis is a test email.`
						));
					controller.close();
				}
			}),
			headers: new Headers({
				'From': 'sender@example.com',
				'To': 'recipient@example.com',
				'Subject': 'Test Email'
			}),
			rawSize: 100,
			setReject: vi.fn(),
			forward: vi.fn().mockResolvedValue(undefined),
			reply: vi.fn().mockResolvedValue(undefined)
		};

		const ctx = createExecutionContext();

		const consoleSpy = vi.spyOn(console, 'log');

		await worker.email(mockEmailMessage, env, ctx);

		await waitOnExecutionContext(ctx);

		expect(consoleSpy).toHaveBeenCalled();
	});
});
