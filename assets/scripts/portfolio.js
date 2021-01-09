const app = new Vue({
	el: '#mr--app',
	data: {
		show: true,
		projects: [],
		projectGroups: [],
		currentProject: null,
		_scrollPosition: 0
	},
	mounted: function () {
		this.getProjectData();
		this.initView();
	},
	directives: {
	},
	methods: {
		getProjectData: function () {
			fetch('assets/data/projects.json')
				.then(response => response.json())
				.then((json) => this.onProjectDataLoaded(json));
		},
		initView: function () {
			// Listen for hash changes
			window.addEventListener('hashchange', () => this.onHashChange(), false);
		},
		showProjectDetails: function (project) {
			this.currentProject = project;

			// Re-show horizontal scroll indicator
			mrlib.show('.mr--scroll-arrow-right');
			// Google Analytics
			this.gaPageView(project.name, 'index.html#' + project.id);

			// HACK : Prevent scrolling on body while modal is open
			this._scrollPosition = window.scrollY;
			mrlib.addClass('body', 'mr--no-scroll');
			mrlib.css('body', 'top', -this._scrollPosition + 'px');
		},
		hideProjectDetails: function () {
			location.hash = 'home';
			this.currentProject = null;
			// Google Analytics
			this.gaPageView('Home', 'index.html');

			// HACK : Return page to scroll position
			mrlib.removeClass('body', 'mr--no-scroll');
			window.scrollTo(0, this._scrollPosition);
		},
		getProjectById: function (id) {
			// TODO: Optimize this
			const matches = this.projects.filter(item => {
				return item.id === id;
			});
			if (matches.length > 0) {
				return matches[0];
			} else {
				return null;
			}
		},
		getGroupProjects: function (group) {
			return this.projects.filter(item => {
				return group.categories.indexOf(item.category) >= 0;
			});
		},
		gaPageView(title, location) {
			try {
				gtag('event', 'page_view', {
					page_title: title,
					page_location: location
				});
			} catch {
			}
		},
		onProjectDataLoaded: function (json) {
			this.projects = json.projects;
			this.projectGroups = json.groupings;

			// Navigate to project if hash is present
			if (location.hash.length > 0) {
				this.onHashChange();
			}
		},
		// Handle hash changes (browser back, deep link, etc.)
		onHashChange: function () {
			const id = location.hash.substr(1);
			const project = this.getProjectById(id);
			if (project) {
				this.showProjectDetails(project);
			} else {
				this.hideProjectDetails();
			}
		},
		onImageLoad: function (image) {
			image.loaded = true;
		}
	},
	computed: {
	}
});

Vue.component('loader-image', {
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
						<loader-image
							:src="'http://marcelray.com/utils/slir/?h=400&c=16x9&q=90&i=/assets/projects/'+project.id+'/'+media.url+'&random='+Math.random()"
							:alt="project.title"
							></loader-image>
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