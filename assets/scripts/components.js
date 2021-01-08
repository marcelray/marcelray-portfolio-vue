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

Vue.component('project-detail', {
	props: [ 'project' ],
	data: function () {
		return {
		}
	},
	methods: {
		getProjectMedia: function (project, type) {
			if (!type) {
				return project.media;
			} else {
				return project.media.filter(item => {
					return item.type === type;
				});
			}
		},
		onMediaScroll: function (event) {
			// Hide horizontal scroll arrow
			// TODO: use a more specific selector
			mrlib.hide('.mr--scroll-arrow-right');
		}
	},
	template: `
	<div class="mr--project-detail">

		<button class="mr--close-button" @click="$emit('close')">&times;</button>
		<div class="mr--project-loadIndicator" class="loadIndicator" style="display: none;"></div>

		<div class="mr--content">

			<div class="mr--project-media">
				<div class="mr--loader">
					<div class="double-bounce1"></div>
					<div class="double-bounce2"></div>
				</div>
				<div class="mr--scroll-arrow-right" v-if="project.media.length > 1"></div>
				<ul class="mr--project-media-items" @scroll="onMediaScroll()" :class="{ 'mr--media-single': project.media.length === 1 }">
					<li class="mr--media-container" v-for="media in getProjectMedia(project,'video')">
						<video 
							height="100%" 
							controlsList="nodownload" 
							controls autostart playsinline autoplay 
							>
							<!-- :poster="'/assets/projects/'+project.id+'/'+media.poster" -->
							<source :src="'http://marcelray.com/assets/projects/'+project.id+'/'+media.url" type="video/mp4" />
						</video></li>
					<li class="mr--media-container" v-for="media in getProjectMedia(project,'image')">
						<mr-image
							:src="'http://marcelray.com/utils/slir/?h=400&c=16x9&q=90&i=/assets/projects/'+project.id+'/'+media.url+'&random='+Math.random()"
							:alt="project.title"
							></mr-image>
						</li>
				</ul>
			</div>

			<div class="mr--header">
				<h1 class="mr--project-title" v-html="project.title"></h1>
				<div class="mr--project-intro" v-html="project.intro"></div>
			</div>

			<div class="mr--project-details">

				<div class="mr--project-detail-category">
					<h2 class="mr--title">Company/Client</h2>
					<div class="mr--content" v-html="project.client"></div>
				</div>

				<div class="mr--project-detail-category">
					<h2 class="mr--title">Roles</h2>
					<div class="mr--content" v-html="project.roles"></div>
				</div>

				<div class="mr--project-detail-category">
					<h2 class="mr--title">Project Brief</h2>
					<div class="mr--content" v-html="project.description"></div>
				</div>

				<div class="mr--project-detail-category" v-if="project.colophon">
					<h2 class="mr--title">Colophon</h2>
					<div class="mr--content" v-html="project.colophon"></div>
				</div>

				<div class="mr--project-detail-category" v-if="project.links.length > 0">
					<h2 class="mr--title">More Info</h2>
					<ul>
						<li v-for="link in project.links">
							<a :href="link.url" target="_blank" v-html="link.title"></a>
						</li>
						<li></li>
					</ul>
				</div>
			</div>
		</div>
	</div>
	`
});