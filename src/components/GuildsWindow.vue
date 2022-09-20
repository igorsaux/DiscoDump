<script setup lang="ts">
import type { Guild } from 'src/discord';
import { ref, watchEffect } from 'vue';
import { useAppStore } from '../stores/app';
import GuildCard from './GuildCard.vue';
import NavBar from './NavBar.vue';
import NavBarButton from './NavBarButton.vue';

const store = useAppStore();
let guilds = ref<Guild[]>([])

watchEffect(async () => {
	if (!store.client) {
		store.openLoginWindow()
		return
	}

	guilds.value = await store.client.getGuilds()
})

function selectGuild(guild: Guild) {
	store.selectGuild(guild)
}
</script>

<template>
	<div v-motion-slide-left class="GuildsWindow">
		<NavBar>
			<template v-slot:left>
				<NavBarButton @click="store.logout()">
					<fa-icon icon="fa-solid fa-arrow-left" /> Выход
				</NavBarButton>
			</template>
			<template v-slot:title>Выберите сервер</template>
			<template v-slot:right>
				<NavBarButton @click="store.openChannelsWindow()" :disabled="!store.selectedGuild">Выбор канала
					<fa-icon icon="fa-solid fa-arrow-right" />
				</NavBarButton>
			</template>
		</NavBar>

		<div class="Guilds">
			<GuildCard :selected="store.selectedGuild?.id === guild.id" @click="selectGuild(guild)"
				v-for="guild in guilds" :key="guild.id" :guild="guild" />
		</div>
	</div>
</template>

<style scoped>
.GuildsWindow {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-content: flex-start;

	padding: 1rem;
	gap: 1rem;

	width: 100%;
}

.Guilds {
	display: flex;
	flex-wrap: wrap;

	gap: 0.5rem;

	width: 100%;
	padding-bottom: 1rem;
}
</style>
