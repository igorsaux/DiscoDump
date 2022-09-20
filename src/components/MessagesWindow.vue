<script setup lang="ts">
import { save } from '@tauri-apps/api/dialog';
import { computed, onUnmounted, ref, watchEffect } from "vue";
import { useAppStore } from "../stores/app";
import NavBar from "./NavBar.vue";
import NavBarButton from "./NavBarButton.vue";

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import type { Message } from 'src/discord';

const store = useAppStore()
const editorRef = ref()
const wasError = ref(false)
const isLoading = computed(() => store.loader.state === 'Loading')
let messages: Message[] = []
let editor: monaco.editor.IStandaloneCodeEditor | undefined

watchEffect(async () => {
	if (!editorRef.value) {
		return
	}

	monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
		...monaco.languages.typescript.javascriptDefaults.getDiagnosticsOptions(),
		diagnosticCodesToIgnore: [1108]
	})
	editor = monaco.editor.create(editorRef.value, {
		value: `return {
	// Все поля не являются обязятельными.
	settings: {
		/// Время между запросами в миллисекундах.
		interval: 250
	},
	/// Выполняется один раз при старте загрузки.
	onBegin: () => {},
	/// Выполняется при получении пачки сообщении.
	/// Будут сохранены только те сообщения -
	/// которые будет возвращены из этой функции.
	/// https://discord.com/developers/docs/resources/channel#message-object
	onMessages: (messages) => {
		console.debug('onMessages')

		return messages
	},
	/// Вызывается один раз при окончании загрузки.
	onEnd: () => {}
}`,
		language: 'javascript',
		minimap: {
			enabled: false
		},
		smoothScrolling: true,
		scrollBeyondLastLine: false,
		theme: 'vs-dark'
	});
})

onUnmounted(() => {
	editor?.dispose()
})

async function startLoading() {
	wasError.value = false
	store.loader.clean();
	const code = editor?.getValue();

	if (!code) {
		return
	}

	try {
		const result = new Function(code)()
		store.loader.setConfiguration(result)
	} catch (e) {
		wasError.value = true
		return
	}

	wasError.value = false
	messages = await store.client?.getMessages(store.selectedChannel!, store.loader) || []
}

async function saveContent() {
	const filePath = await save({
		defaultPath: `${store.selectedChannel!.id}-messages`,
		filters: [{
			extensions: ['json'],
			name: 'JSON'
		}]
	})

	store.saveContent(filePath, JSON.stringify(messages))
	store.loader.clean()
}
</script>

<template>
	<div v-motion-slide-left class="MessagesWindow">
		<NavBar>
			<template v-slot:left>
				<NavBarButton @click="store.openChannelsWindow()" :disabled="isLoading">
					<fa-icon icon="fa-solid fa-arrow-left" /> Выбор канала
				</NavBarButton>
			</template>
			<template v-slot:title>Загрузка сообщений</template>
			<template v-slot:right>
				<NavBarButton @click="startLoading" :disabled="isLoading">
					Выполнить
					<fa-icon icon="fa-solid fa-play" />
				</NavBarButton>
			</template>
		</NavBar>

		<div ref="editorRef" class="Editor"></div>
		<div class="TextBanner Error" v-if="wasError">Во время выполнения скрипта
			произошла ошибка</div>
		<div class="TextBanner Progress" v-if="store.loader.state === 'Loading'">Идёт загрузка. Собрано: {{
		store.loader.messages.length }}.</div>
		<div @click="saveContent" class="TextBanner Good" v-if="store.loader.state === 'Finished'">Загрузка закончена!
			Загружено: {{
			store.loader.messages.length }}. Нажмите для сохранения...</div>
	</div>
</template>

<style scoped>
.MessagesWindow {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-content: flex-start;

	padding: 1rem;
	gap: 1rem;

	width: 100%;
}

.Editor {
	height: calc(100% - 100px);
	width: 100%;
}

.TextBanner {
	transition: all 250ms;
	display: flex;
	align-items: center;
	justify-content: center;

	width: 100%;
	height: 45px;
	border-radius: 4px;

	font-weight: bold;
}

.TextBanner.Error {
	background-color: hsl(351, 96%, 44%);
}

.TextBanner.Good {
	background-color: hsl(147, 100%, 31%);
}

.TextBanner.Good:hover {
	cursor: pointer;
	background-color: hsl(147, 100%, 36%);
	box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.2);
}

.TextBanner.Progress {
	background-color: hsl(120, 2%, 16%);
}
</style>
