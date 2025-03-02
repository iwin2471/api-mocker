import type { RequestHandler } from '@sveltejs/kit';

let schemas: any[] = [];

export const GET: RequestHandler = async () => {
  return new Response(JSON.stringify(schemas), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const POST: RequestHandler = async ({ request }) => {
  const newSchema = await request.json();
  schemas.push(newSchema);
  return new Response(JSON.stringify(newSchema), {
    status: 201,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const PUT: RequestHandler = async ({ request }) => {
  const updatedSchema = await request.json();
  const index = schemas.findIndex(schema => schema.name === updatedSchema.name);
  if (index !== -1) {
    schemas[index] = updatedSchema;
    return new Response(JSON.stringify(updatedSchema), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  return new Response(JSON.stringify({ error: 'Schema not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const DELETE: RequestHandler = async ({ request }) => {
  const { name } = await request.json();
  const index = schemas.findIndex(schema => schema.name === name);
  if (index !== -1) {
    schemas.splice(index, 1);
    return new Response(JSON.stringify({ message: 'Schema deleted' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  return new Response(JSON.stringify({ error: 'Schema not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' }
  });
};
