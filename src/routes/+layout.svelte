<script lang="ts">
import '../app.css';
let { children } = $props();
</script>

<nav>
  <a href="/">Home</a>
  <a href="/data-schema">Data Schema</a>
  <a href="/endpoint">Endpoint</a>
</nav>

{@render children()}
