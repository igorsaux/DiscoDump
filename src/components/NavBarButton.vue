<script setup lang="ts">
defineProps<{
	disabled?: boolean,
}>()
</script>

<template>
	<button :disabled="disabled" class="NavBarButton">
		<slot></slot>
	</button>
</template>

<style scoped>
.NavBarButton {
	transition: all 250ms;
	appearance: none;
	border: none;
	border-radius: 4px;

	padding: 0.4rem;

	background-color: hsl(49, 100%, 50%);
	font-weight: bold;
}

.NavBarButton:hover {
	cursor: pointer;

	background-color: hsl(55, 100%, 60%);
}

.NavBarButton[disabled] {
	cursor: not-allowed;

	color: hsla(0, 0%, 0%, 0.4);
	background-color: hsl(49, 100%, 20%);
}
</style>
