document.addEventListener("DOMContentLoaded", () => app.start());
window.addEventListener('hashchange', () => app.onHashChange(), false);

class Project {
	id = ""
	category = ""
	colophone = ""
	date = "2000-01-01"
	description = ""
	display = false
	media = []
	links = []
	responsibilities = ""
	tags = []
	title = "test"
	color = "#ff00ff"
	imageUrl = "https://source.unsplash.com/random"
	client = "marcelray"

	static getFromJson(json) {
		let project = new Project();
		for (let prop in json) {
			project[prop] = json[prop];
		}
		return project;
	}
}

const app = new Vue({
	el: '#mr--app',
	data: {
		projects: [],
		projectGroups: [],
		currentProject: null,
	},
	methods: {
		start: function() {
			fetch('assets/data/projects.json').then(response => response.json()).then((json) => this.onProjectDataLoaded(json));
		},
		showProjectDetails: function(project) {
			this.currentProject = project;
			$('body,html').addClass('mr--no-scroll');
			// Re-show horizontal scroll indicator
			$(document).find('.mr--scroll-arrow-right').show();
		},
		hideProjectDetails: function() {
			location.hash = 'home';
			this.currentProject = null;
			$('body,html').removeClass('mr--no-scroll');
		},
		getGroupProjects: function(group) {
			return this.projects.filter(item=>{
				return group.categories.indexOf( item.category ) >= 0;
			});
		},
		onProjectDataLoaded: function(json) {
			// console.log(json);
			json.projects.forEach((item, index) => {
				this.projects.push(Project.getFromJson(item));
			})
			json.groupings.forEach((item, index) => {
				this.projectGroups.push(item);
			})
		
			if ( location.hash.length > 0 ) {
				this.onHashChange();
			}
		},
		// Handle hash changes (browser back, deep link, etc.)
		onHashChange: function() {
			const projectId = location.hash.substr(1);
			// TODO: Optimize this
			const matchingProjects = this.projects.filter( item => {
				return item.id === projectId;
			});
			if ( matchingProjects.length === 1 ) {
				this.showProjectDetails( matchingProjects[0] );
			} else {
				this.hideProjectDetails();
			}
		},
		onMediaScroll: function(event) {
			// Hide horizontal scroll arrow
			// TODO: use a more specific selector
			$(document).find('.mr--scroll-arrow-right').hide();
		}
	},
	computed: {
		currentProjectVideos: function() {
			return this.currentProject.media.filter(item => {
				return item.type === "video";
			});
		},
		currentProjectImages: function() {
			return this.currentProject.media.filter(item => {
				return item.type === "image";
			});
		}
	}
})

