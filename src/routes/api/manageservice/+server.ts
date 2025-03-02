import type { RequestHandler } from '@sveltejs/kit';
import type { Endpoint } from '../../../types';
import express from 'express';

const app = express();
let server: any = null;

function addEndpoint(endpoint: Endpoint) {
  switch (endpoint.method.toLowerCase()) {
    case 'get':
      app.get(endpoint.path, (req: express.Request, res: express.Response) => {
        res.json(JSON.parse(endpoint.response));
      });
      break;
    case 'post':
      app.post(endpoint.path, (req: express.Request, res: express.Response) => {
        res.json(JSON.parse(endpoint.response));
      });
      break;
    case 'put':
      app.put(endpoint.path, (req: express.Request, res: express.Response) => {
        res.json(JSON.parse(endpoint.response));
      });
      break;
    case 'delete':
      app.delete(endpoint.path, (req: express.Request, res: express.Response) => {
        res.json(JSON.parse(endpoint.response));
      });
      break;
    default:
      console.error(`Unsupported method: ${endpoint.method}`);
  }
}

export const GET: RequestHandler = async () => {
  if (server) {
    return new Response(JSON.stringify({ message: 'Service already running' }), {
      status: 409,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const response = await fetch('http://localhost:5173/api/endpoints');
  const endpoints: Endpoint[] = await response.json();

  // Simulate adding all endpoints to the service
  endpoints.forEach((endpoint: Endpoint) => {
    console.log(`Starting service for endpoint: ${endpoint.method} ${endpoint.path}`);
    // Dynamically create endpoints
    addEndpoint(endpoint);
  });

  server = app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });

  return new Response(JSON.stringify({ message: 'Service started with endpoints', endpoints }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const POST: RequestHandler = async () => {
  if (server) {
    server.close(() => {
      console.log('Server stopped');
    });
    server = null;
  }

  return new Response(JSON.stringify({ message: 'Service stopped' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
