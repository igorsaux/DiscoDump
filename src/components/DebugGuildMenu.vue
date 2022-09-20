<script setup lang="ts">
import type { Guild } from 'src/discord';
import DropdownButton from './DropdownButton.vue';

const props = defineProps<{
	guild: Guild
}>()

function print() {
	console.log(props.guild)
}
</script>

<template>
	<DropdownButton @click="print">
		<fa-icon icon="fa-solid fa-bug" /> Print
	</DropdownButton>
</template>
