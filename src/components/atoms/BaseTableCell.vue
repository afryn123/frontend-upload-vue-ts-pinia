<template>
  <td :class="className"><slot /></td>
</template>

<script setup lang="ts">
interface Props {
  className: string
}

defineProps<Props>()
</script>
