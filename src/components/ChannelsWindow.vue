<script setup lang="ts">
import type { Channel } from '../discord';
import { ref, watchEffect } from 'vue';
import { useAppStore } from '../stores/app';
import ChannelCard from './ChannelCard.vue';
import NavBar from './NavBar.vue';
import NavBarButton from './NavBarButton.vue';

const store = useAppStore()
const loading = ref(false);
let channels = ref<Channel[]>([])

watchEffect(async () => {
	if (!store.client) {
		store.openLoginWindow();
		return;
	}

	if (!store.selectedGuild) {
		channels.value = [];
		return
	}

	channels.value = await store.client.getChannels(store.selectedGuild)
})
</script>

<template>
	<div v-motion-slide-left class="ChannelsWindow">
		<NavBar>
			<template v-slot:left>
				<NavBarButton @click="store.openGuildsWindow()">
					<fa-icon icon="fa-solid fa-arrow-left" /> Выбор сервера
				</NavBarButton>
			</template>
			<template v-slot:title>Выберите канал</template>
			<template v-slot:right>
				<NavBarButton @click="store.openLoadingWindow()" :disabled="!store.selectedChannel || loading">Загрузка
					<fa-icon icon="fa-solid fa-arrow-right" />
				</NavBarButton>
			</template>
		</NavBar>

		<div class="Channels">
			<template v-for="channel in channels" :key="channel.id">
				<ChannelCard @click="store.selectChannel(channel)" v-if="channel.type !== 4"
					:selected="store.selectedChannel?.id === channel.id" :channel="channel" />
			</template>
		</div>
	</div>
</template>

<style scoped>
.ChannelsWindow {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-content: flex-start;

	padding: 1rem;
	gap: 1rem;

	width: 100%;
}

.Channels {
	display: flex;
	flex-wrap: wrap;

	gap: 0.5rem;

	width: 100%;
	padding-bottom: 1rem;
}
</style>
