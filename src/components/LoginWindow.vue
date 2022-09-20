<script setup lang="ts">
import { useAppStore } from '../stores/app';
import { ref } from 'vue';

const store = useAppStore()
const token = ref('')

async function login() {
	await store.initClient(token.value);
	token.value = '';
	store.openGuildsWindow();
}
</script>

<template>
	<div v-motion-slide-left class="LoginWindow">
		<h2>Вход</h2>
		<div class="Controlls">
			<input v-model="token" class="TokenInput" type="text" placeholder="Токен" />
			<button @click="login" class="LoginButton">Войти</button>
		</div>
	</div>
</template>

<style scoped>
.LoginWindow {
	margin: auto;

	display: flex;
	flex-direction: column;
	justify-items: center;
	align-items: center;

	gap: 1rem;
}

h2 {
	margin: 0;
	padding: 0;
	text-align: center;
}

.Controlls {
	display: flex;
}

.Controlls * {
	padding: 0.4rem;
}

.TokenInput {
	transition: all 250ms;
	font-family: 'Consolas', monospace;

	appearance: none;
	border: none;

	width: 72ch;

	color: white;
	background-color: hsl(120, 2%, 16%);
	border-radius: 4px 0 0 4px;
	outline: none;
}

.TokenInput:focus {
	background-color: hsl(120, 2%, 20%);
	box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.2);
}

.LoginButton {
	transition: all 250ms;
	appearance: none;
	border: none;

	font-weight: bold;
	color: black;
	background-color: hsl(49, 100%, 50%);
	border-radius: 0 4px 4px 0;
}

.LoginButton:hover {
	cursor: pointer;

	background-color: hsl(55, 100%, 60%);
}
</style>
