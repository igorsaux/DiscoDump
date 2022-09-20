<script setup lang="ts">
import type { Channel } from 'src/discord';
import DropdownButton from './DropdownButton.vue';

const props = defineProps<{
	channel: Channel
}>()

function print() {
	console.log(props.channel)
}
</script>
	
<template>
	<DropdownButton @click="print">
		<fa-icon icon="fa-solid fa-bug" /> Print
	</DropdownButton>
</template>
	