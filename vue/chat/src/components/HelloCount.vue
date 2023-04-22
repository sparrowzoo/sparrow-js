<template>
    <div>
        <h1>{{ message }}</h1>
        <button @click="increment">Count: {{ count }}</button>
    </div>
</template>

<script>
export default {
	data() {
		return {
			message: 'Hello, Vue 2!',
			count: 0
		};
	},
	methods: {
		increment() {
			this.count++;
		}
	}
};
</script>
