import { error } from 'itty-router';
import { OpenAPIRouter, OpenAPIRoute } from '@cloudflare/itty-router-openapi';

export interface Env {
	MY_QUEUE: Queue;
}

export class QueuePublish extends OpenAPIRoute {
	static schema = {
		tags: ['Queues'],
		summary: 'Publish to queue which is monitored by sse-proto',
		parameters: {},
		responses: {
			'200': {
				description: 'Success',
				schema: {
					description: String,
				},
			},
		},
	};

	async handle(request: Request, env: Env, context: any) {
		await env.MY_QUEUE.send({ filler: 'filler' });
		return {}
	}
}

const router = OpenAPIRouter();

router
	.get('/publish', QueuePublish)
	.all('*', () => error(404, 'Are you sure about that?'));

export default {
	fetch: async (request: Request, env: any, ctx: any) => {
		return router.handle(request, env, ctx);
	}
};
