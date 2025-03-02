<script lang="ts">
import { onMount } from 'svelte';

interface Endpoint {
  path: string;
  method: string;
  response: string;
  type: string;
}

let endpoints: Endpoint[] = [];
let newEndpoint: Endpoint = { path: '', method: 'GET', response: '', type: 'string' };

async function fetchEndpoints() {
  const response = await fetch('/api/endpoints');
  endpoints = await response.json();
}

onMount(fetchEndpoints);

async function saveEndpoint() {
  if (newEndpoint.path.trim() === '') return;
  const existingEndpointIndex = endpoints.findIndex(endpoint => endpoint.path === newEndpoint.path);
  if (existingEndpointIndex !== -1) {
    const response = await fetch('/api/endpoints', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEndpoint)
    });
    const updatedEndpoint = await response.json();
    endpoints[existingEndpointIndex] = updatedEndpoint;
  } else {
    const response = await fetch('/api/endpoints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEndpoint)
    });
    const savedEndpoint = await response.json();
    endpoints.push(savedEndpoint);
  }
  newEndpoint = { path: '', method: 'GET', response: '', type: 'string' };
  fetchEndpoints();
}

async function editEndpoint(index: number) {
  newEndpoint = { ...endpoints[index] };
  endpoints.splice(index, 1);
}

async function runService() {
  const response = await fetch('/api/manageservice');
  const result = await response.json();
  console.log(result);
}

async function stopService() {
  const response = await fetch('/api/manageservice', {
    method: 'POST'
  });
  const result = await response.json();
  console.log(result);
}

async function deleteEndpoint(index: number) {
  const response = await fetch('/api/endpoints', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: endpoints[index].path })
  });
  if (response.ok) {
    endpoints.splice(index, 1);
    fetchEndpoints();
  }
}
</script>

<style>
  /* Add your styles here */
</style>

<h1 class="text-3xl font-bold mb-4">Endpoint</h1>
<div class="space-y-4">
  <input class="border p-2 w-full" bind:value={newEndpoint.path} placeholder="Endpoint Path" />
  <select class="border p-2 w-full" bind:value={newEndpoint.method}>
    <option value="GET">GET</option>
    <option value="POST">POST</option>
    <option value="PUT">PUT</option>
    <option value="DELETE">DELETE</option>
  </select>
  <div class="flex space-x-2">
    <textarea class="border p-2 flex-1" bind:value={newEndpoint.response} placeholder="Response"></textarea>
    <select class="border p-2 flex-1" bind:value={newEndpoint.type}>
      <option value="string">String</option>
      <option value="number">Number</option>
      <option value="boolean">Boolean</option>
      <option value="array">Array</option>
      <option value="object">Object</option>
    </select>
  </div>
  <button class="bg-green-500 text-white px-4 py-2" on:click={saveEndpoint}>Save Endpoint</button>
</div>

<button class="bg-blue-500 text-white px-4 py-2" on:click={runService}>Run Service</button>

<h2 class="text-2xl font-bold mt-8">Saved Endpoints</h2>
<ul class="space-y-2">
  {#each endpoints as endpoint, index}
    <li class="flex justify-between items-center border p-2">
      <span>{endpoint.method} {endpoint.path}</span>
      <div class="space-x-2">
        <button class="bg-yellow-500 text-white px-4 py-2" on:click={() => editEndpoint(index)}>Edit</button>
        <button class="bg-red-500 text-white px-4 py-2" on:click={() => deleteEndpoint(index)}>Delete</button>
      </div>
    </li>
  {/each}
</ul>
