<script setup lang="ts">
</script>

<template>
	<div class="NavBar">
		<slot name="left" />
		<span class="Title">
			<slot name="title" />
		</span>
		<slot name="right" />
	</div>
</template>

<style scoped>
.NavBar {
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	width: 100%;
}

.Title {
	font-size: 1.4em;
	font-weight: bold;
}
</style>
