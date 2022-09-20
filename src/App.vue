<script setup lang="ts">
import { useAppStore } from './stores/app';
import LoginWindow from './components/LoginWindow.vue';
import GuildsWindow from './components/GuildsWindow.vue';
import ChannelsWindow from './components/ChannelsWindow.vue';
import MessagesWindow from './components/MessagesWindow.vue';

const store = useAppStore();
</script>

<template>
	<div class="App">
		<template v-if="store.window === 'login'">
			<LoginWindow />
		</template>
		<template v-if="store.window === 'guilds'">
			<GuildsWindow />
		</template>
		<template v-if="store.window === 'channels'">
			<ChannelsWindow />
		</template>
		<template v-if="store.window === 'loading'">
			<MessagesWindow />
		</template>
	</div>
</template>

<style scoped>
.App {
	overflow-y: auto;
	overflow-x: hidden;
	display: flex;
	width: 100%;
	height: 100%;
}
</style>
