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
