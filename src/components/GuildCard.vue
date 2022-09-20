<script setup lang="ts">
import type { Guild } from '../discord';
import GuildIcon from './GuildIcon.vue';
import { useTippy } from 'vue-tippy'
import { h, ref } from 'vue';
import DebugGuildMenu from './DebugGuildMenu.vue';

const props = defineProps<{
	guild: Guild,
	selected?: boolean
}>()

const target = ref()

const { show } = useTippy(target, {
	content: h(DebugGuildMenu, {
		guild: props.guild
	}),
	interactive: true,
	trigger: 'manual',
	followCursor: "initial"
})
</script>

<template>
	<div @contextmenu.prevent="show" ref="target" :selected="selected" class="GuildCard">
		<GuildIcon :guild="guild" />
		<span class="GuildName">{{ guild.name }}</span>
	</div>
</template>

<style>
.GuildCard {
	transition: all 250ms;

	display: flex;
	align-items: center;
	flex-grow: 1;

	width: 20ch;

	gap: 0.5rem;
	padding: 0.5rem;

	border-radius: 4px;
	border: 3px solid transparent;
	background-color: hsl(120, 2%, 16%);
}

.GuildCard:hover {
	cursor: pointer;
	background-color: hsl(120, 2%, 20%);
	box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.2);
}

.GuildCard[selected=true] {
	border: 3px solid hsl(49, 100%, 50%);
	box-shadow: 0px 0px 8px 0px hsla(49, 100%, 50%, 0.3);
}

.GuildName {
	margin: auto;
	font-size: 1.1em;
	font-weight: bold;
}
</style>
