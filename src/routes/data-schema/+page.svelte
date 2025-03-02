<script lang="ts">
import { onMount } from 'svelte';
import type { Field, Schema } from '../../types';

let schemas: Schema[] = [];
let newSchema: Schema = { name: '', fields: [] };

async function fetchSchemas() {
  const response = await fetch('/api/schemas');
  schemas = await response.json();
}

onMount(fetchSchemas);

function addField() {
  newSchema.fields = [...newSchema.fields, { name: '', type: '' }];
}

function deleteField(index: number) {
  newSchema.fields = newSchema.fields.filter((_, i) => i !== index);
}

async function saveSchema() {
  if (newSchema.name.trim() === '') return;
  const existingSchemaIndex = schemas.findIndex(schema => schema.name === newSchema.name);
  if (existingSchemaIndex !== -1) {
    const response = await fetch('/api/schemas', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSchema)
    });
    const updatedSchema = await response.json();
    schemas[existingSchemaIndex] = updatedSchema;
  } else {
    const response = await fetch('/api/schemas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSchema)
    });
    const savedSchema = await response.json();
    schemas.push(savedSchema);
  }
  newSchema = { name: '', fields: [] };
  fetchSchemas();
}

async function editSchema(index: number) {
  newSchema = { ...schemas[index] };
  schemas.splice(index, 1);
}

async function deleteSchema(index: number) {
  const response = await fetch('/api/schemas', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: schemas[index].name })
  });
  if (response.ok) {
    schemas.splice(index, 1);
    fetchSchemas();
  }
}
</script>

<style>
  /* Add your styles here */
</style>

<h1 class="text-3xl font-bold mb-4">Data Schema</h1>
<div class="space-y-4">
  <input class="border p-2 w-full" bind:value={newSchema.name} placeholder="Schema Name" />
  <button class="bg-blue-500 text-white px-4 py-2" on:click={addField}>Add Field</button>
  {#each newSchema.fields as field, index}
    <div class="flex space-x-2">
      <input class="border p-2 flex-1" bind:value={field.name} placeholder="Field Name" />
      <select class="border p-2 flex-1" bind:value={field.type}>
        <option value="string">String</option>
        <option value="number">Number</option>
        <option value="boolean">Boolean</option>
        <option value="array">Array</option>
        <option value="object">Object</option>
      </select>
      <button class="bg-red-500 text-white px-2 py-1" on:click={() => deleteField(index)}>Delete</button>
    </div>
  {/each}
  <button class="bg-green-500 text-white px-4 py-2" on:click={saveSchema}>Save Schema</button>
</div>

<h2 class="text-2xl font-bold mt-8">Saved Schemas</h2>
<ul class="space-y-2">
  {#each schemas as schema, index}
    <li class="flex justify-between items-center border p-2">
      <span>{schema.name}</span>
      <div class="space-x-2">
        <button class="bg-yellow-500 text-white px-4 py-2" on:click={() => editSchema(index)}>Edit</button>
        <button class="bg-red-500 text-white px-4 py-2" on:click={() => deleteSchema(index)}>Delete</button>
      </div>
    </li>
  {/each}
</ul>
