require([ 'gitbook' ], function (gitbook) {
	handleEditButton = function (e, config) {
		/**
		 * [defaultOption: default option]
		 * @type {Object}
		 */
		const defaultOption = {
			'url': 'https://github.com',
			'repo': 'aleen42/PersonalWiki',
			'branch': 'master'
		};

		/** if users have its option, and then combine it with default options */
		if (config['github-edit']) {
		// @deprecated
		// if (this.options.pluginsConfig['page-treeview']) {
			for (var item in defaultOption) {
				/** special for copyright */
				// @deprecated
				const configOption = config['github-edit'];
				
				// defaultOption[item] = this.options.pluginsConfig['page-treeview'][item] || defaultOption[item];
				if (item in configOption) {
					defaultOption[item] = configOption[item];
				}
			}
		}

		const configRoot = config['root'];

		gitbook.toolbar.createButton({
			icon: 'fa fa-pencil-square-o ',
			label: 'Edit on GitHub',
			position: 'right',
			onClick: function () {
				window.open(defaultOption.url
					+ '/'
					+ defaultOption.repo
					+ '/edit/'
					+ defaultOption.branch
					+ (configRoot ? '/' + configRoot : '')
					+ '/'
					+ gitbook.state.filepath
				);
			}
		});
	};

	gitbook.events.bind('start', handleEditButton);
});
