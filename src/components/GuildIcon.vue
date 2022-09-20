<script setup lang="ts">
import type { Guild } from 'src/discord';
import { computed } from 'vue';

const props = defineProps<{
	guild: Guild
}>();

const guildAvatarUrl = computed(() => `https://cdn.discordapp.com/icons/${props.guild.id}/${props.guild.icon}.png`)
</script>

<template>
	<img class="GuildIcon" :src="guildAvatarUrl" />
</template>

<style>
.GuildIcon {
	transition: all 250ms;
	appearance: none;

	width: 3em;
	height: 3em;
	border: none;
	border-radius: 3em;

	font-weight: bold;
	text-align: left;
}

.GuildIcon:hover {
	border-radius: 0.8em;
}
</style>
