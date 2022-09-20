<template>
	<button class="DropdownButton">
		<slot />
	</button>
</template>

<style scoped>
.DropdownButton {
	transition: all 250ms;

	appearance: none;
	border: none;
	border-radius: 4px;
	background-color: transparent;
	padding: 0.2rem;
	padding-left: 0.4rem;
	padding-right: 0.4rem;
	color: hsl(0, 0%, 70%);
	background-color: hsla(0, 0%, 0%, 0.1);

	font-size: 0.8em;
	font-weight: bold;
}

.DropdownButton:hover {
	cursor: pointer;
	color: hsl(0, 0%, 90%);
	background-color: hsla(0, 0%, 0%, 0.2);
}
</style>
