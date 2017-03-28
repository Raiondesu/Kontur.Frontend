Vue.component('autocomplete', {
	/**
	 * Template element of the component, can be written in plain html
	 */
	template: '#autocomplete',

	/**
	 * Component's "constructor" attributes.
	 * @param {string} class - classes to apply to the root element
	 * @param {string} name - a name for autocomplete's input
	 * @param {string} url - a url to send requests to
	 * @param {string} debounce - a timeout in ms to wait for an ajax request to be issued
	 */
	props: ['class', 'name', 'url', 'debounce'],
	data: function() {
		return {
			// A reactive string query that is binded to autocomplete's input:
			query: '',
			// A reactive array of options that stores the autocomplete data fetched from the server:
			options: [],
			// The index of a currently selected element in options array:
			selectedIndex: 0,

			isLoading: false,
			isSelected: false,
			isHidden: false,
			hasServerError: false,
			hasInputError: false
		};
	},

	/**
	 * Computed properties go here (getters, basically).
	 */
	computed: {
		listLimit: function() {
			return this.options.length > 5 ? 5 : this.options.length;
		}
	},

	/**
	 * Main methods of the component.
	 */
	methods: {
		selectOption: function() {
			this.isSelected = true;
			this.query = this.options[this.selectedIndex].city;
			this.selectedIndex = 0;
		},
		upOption: function() {
			if (this.selectedIndex > 0)
				this.selectedIndex--;
		},
		downOption: function() {
			if (this.selectedIndex < this.listLimit - 1)
				this.selectedIndex++;
		},
		optionHover: function(e) {
			this.selectedIndex = e.target.dataset.index;
		},

		/**
		 * Input events, basically.
		 */
		inputBlur: function(e) {
			if (this.options) {
				if (this.options.length == 1)
					this.selectOption();
				else if (!this.isSelected && (this.options.length != 1 || this.isLoading)) {
					this.hasInputError = true;
				}
			}
			this.isSelected = false;
		},
		inputFocus: function(e) {
			this.hasInputError = false;
			e.target.setSelectionRange(0, e.target.value.length);
		},
		inputKeydown: function (e) {
			if (e.keyCode == 13) {
				e.preventDefault();
				this.selectOption();
				this.nextTabindex(this.$refs.input);
			}
			else if (e.keyCode == 38) this.upOption();
			else if (e.keyCode == 40) this.downOption();
			else if (e.keyCode == 27) this.isHidden = true;
			else {
				this.isHidden = false;
				this.isSelected = false;
			}
		},
		/****/

		nextTabindex: function (el) {
			var frm = el.form;

			for (var i = 0; i < frm.elements.length; i++) {
				if (frm.elements[i].tabIndex = el.tabIndex + 1) {
					frm.elements[i].focus();
					break;
				}
			}
		},
		
		/**
		 * updateOptions is called every time the query in input is changed.
		 * It sends an ajax-GET request after a certain debounce time interval
		 * and assigns setOptions and removeOptions to callbacks (for success and error).
		 * @param {string} query - a new value of a just modified query.
		 * @param {string} oldQuery - a value of a query before modification.
		 */
		updateOptions: function(query, oldQuery) {
			this.isLoading = true;
			this.hasInputError = false;
			this.hasServerError = false;
			setTimeout(function(self) {
				// Check if there is a query and that this query was not changed during the debounce timeout:
				if (self.query && self.query.length > 0 && self.query == query)
					get(self.url + self.query, function(result) {
						self.hasServerError = false;
						self.setOptions(result);
					}, self.removeOptions);
				else if (!self.query || self.query.length == 0) //if there is no query - get rid of list.
					self.isHidden = true;
			}, this.debounce, this);
		},

		/**
		 * A proper setter for this.options in order for this field to stay reactive.
		 * @param {Array} newOptions - an array to be made the new this.options.
		 */
		setOptions: function(newOptions) {
			this.isLoading = false;
			Vue.set(this, 'options', newOptions);			
		},

		/**
		 * An error callback, basically.
		 * @param {number} status - request's status code.
		 */
		removeOptions: function(status) {
			if (!status || status >= 500) this.hasServerError = true;
			else this.hasServerError = false;
			this.setOptions([]);
		}
	},

	/**
	 * Called upon full component initialization.
	 * Sets a reactive watcher on this.query that calls updateOptions on each query change.
	 */
	mounted: function() {
		if (!this.debounce) this.debounce = 0;
		this.$watch('query', this.updateOptions);
	}
})
