import type { RequestHandler } from '@sveltejs/kit';

let endpoints: any[] = [];

export const GET: RequestHandler = async () => {
  return new Response(JSON.stringify(endpoints), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const POST: RequestHandler = async ({ request }) => {
  const newEndpoint = await request.json();
  endpoints.push(newEndpoint);
  return new Response(JSON.stringify(newEndpoint), {
    status: 201,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const PUT: RequestHandler = async ({ request }) => {
  const updatedEndpoint = await request.json();
  const index = endpoints.findIndex(endpoint => endpoint.path === updatedEndpoint.path);
  if (index !== -1) {
    endpoints[index] = updatedEndpoint;
    return new Response(JSON.stringify(updatedEndpoint), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const DELETE: RequestHandler = async ({ request }) => {
  const { path } = await request.json();
  const index = endpoints.findIndex(endpoint => endpoint.path === path);
  if (index !== -1) {
    endpoints.splice(index, 1);
    return new Response(JSON.stringify({ message: 'Endpoint deleted' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' }
  });
};
