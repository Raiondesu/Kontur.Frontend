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
	 * @param {Array} array - an original array to filter
	 */
	props: ['class', 'name', 'url', 'array'],
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
			this.query = this.options[this.selectedIndex].City;
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
			if (this.options.length == 1)
				this.selectOption();
			else if (!this.isSelected && (this.options.length != 1 || this.isLoading)) {
				this.hasInputError = true;
			}
			this.isSelected = false;
		},
		inputFocus: function(e) {
			if (!this.query || this.query.length == 0)
				Vue.set(this, 'options', []);
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
			else if (e.keyCode == 27) {
				this.isHidden = true;
			}
			else {
				this.isSelected = false;
				this.isHidden = false;
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
		 * It calls a filter on cities
		 * and assigns setOptions and removeOptions to callbacks (for success and error).
		 * @param {string} query - a new value of a just modified query.
		 * @param {string} oldQuery - a value of a query before modification.
		 */
		updateOptions: function(query, oldQuery) {
			this.isLoading = true;
			this.hasInputError = false;
			if (query) { // Check if there is a query
				if (query.length > 0)
					this.filter(query);
				else if (query.length == 0) //if there is no query - get rid of list.
					this.isHidden = true;
			} else this.isHidden = true;
		},

		filter: function(query) {
			var result = this.array.filter(function(element, index, array) {
				return element.City.toLowerCase().indexOf(query.toLowerCase()) > -1;
			});
			
			if (result.length == 0)
				Vue.set(this, 'options', []);
			else {
				this.isLoading = false;
				Vue.set(this, 'options', result);
			}
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
