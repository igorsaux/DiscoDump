<script setup lang="ts">
import { h, ref } from 'vue';
import { useTippy } from 'vue-tippy';
import type { Channel } from '../discord';
import DebugChannelMenu from './DebugChannelMenu.vue';

const props = defineProps<{
	selected?: boolean,
	channel: Channel
}>()
const target = ref()

const { show } = useTippy(target, {
	content: h(DebugChannelMenu, {
		channel: props.channel
	}),
	interactive: true,
	trigger: 'manual',
	followCursor: "initial"
})
</script>

<template>
	<div @contextmenu.prevent="show" ref="target" class="ChannelCard" :selected="selected">
		<span class="Icon">
			<template v-if="channel.type === 2">
				<fa-icon icon="fa-solid fa-volume-high" />
			</template>
			<template v-else>
				<fa-icon icon="fa-solid fa-hashtag" />
			</template>
		</span>
		<span>{{ channel.name }}</span>
	</div>
</template>

<style scoped>
.Icon {
	color: hsl(0, 0%, 40%);
}

.ChannelCard {
	transition: all 250ms;

	display: flex;
	align-items: center;
	flex-grow: 1;

	padding: 0.5rem;
	gap: 0.5rem;

	font-weight: bold;
	border: 3px solid transparent;
	border-radius: 4px;
	background-color: hsl(120, 2%, 16%);
}

.ChannelCard:hover {
	cursor: pointer;
	background-color: hsl(120, 2%, 20%);
	box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.2);
}

.ChannelCard[selected=true] {
	border: 3px solid hsl(49, 100%, 50%);
	box-shadow: 0px 0px 8px 0px hsla(49, 100%, 50%, 0.3);
}

.ChannelCard:hover {
	cursor: pointer;
	background-color: hsl(120, 2%, 20%);
	box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.2);
}
</style>
