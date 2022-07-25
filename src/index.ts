/**
 * #### The entry point
 * - exports the typedoc-plugin loader
 * - exports the Hot entry class
 * 
 * @module INDEX
 */

import { ParameterType, Application } from 'typedoc';
import { Hot } from './lib/Hot';
import TypeDoc = require('typedoc');
import { hotOptions } from './types';

/**
 * Hooks into typedoc as a module and declares the "hot-dev" options set.
 * 
 * @param app The typedoc application
 */
export function load(app: Application) {
	!app.options['_values']['hot-dev'] &&
		app.options.addDeclaration({
			help: '[hot-dev] Options for typedoc-plugin-hot-dev',
			name: 'hot-dev',
			type: ParameterType.Mixed,
			defaultValue: {
				targetCwd: './',
				sourceDist: './dist'
			},
		});
}

export function init(overOpts: hotOptions = {}) {

	const hotOptions = getHotOptions();
	Object.keys(overOpts).forEach(key => {
		hotOptions[key] && (hotOptions[key]= overOpts[key]);
	});
	return new Hot(hotOptions).init();
}

export function getHotOptions(): hotOptions {
	const app = new TypeDoc.Application();
	load(app);
	const defaultOpts = app.options.getValue('hot-dev');
	app.options.addReader(new TypeDoc.TypeDocReader());
	app.bootstrap();
	const options = app.options.getValue('hot-dev');
	Object.keys(options).forEach(key => {
		defaultOpts[key] && (defaultOpts[key] = options[key]);
	});
	return defaultOpts;
}
