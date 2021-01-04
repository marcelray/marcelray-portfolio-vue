Vue.component('mr-image', {
	props: [ 'src', 'alt' ],
	data: function () {
		return {
			loaded: false,
			ratio:'70%'
		}
	},
	methods: {
		onLoaded() {
			this.loaded = true;
		}
	},
	template: `
	  <div class="mr--image" >
		<div class="mr--loader" v-if="!loaded">
		  <img class="spinner" src="/assets/images/spinner.svg">
		</div>
		<transition name="media">
		  <img 
			  :src="src" 
			  :alt="alt"
			  draggable="false"
			  @load="onLoaded"
			  v-show="loaded"
			  >
		</transition>
	 </div>
	`
});