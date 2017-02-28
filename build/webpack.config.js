const webpack = require( 'webpack' )
const path = require('path')
const projectRoot = path.resolve(__dirname+"/../")

module.exports = {
  entry: projectRoot+'/src/BookKeeper.js',
  output: {
    path: projectRoot,
    filename: 'BookKeeper.js',
    library: 'BookKeeper',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  resolve: {
    extensions: [ '', '.js']
  },
  module: {
		preLoaders: [
			{
				test: /.js$/,
				loader: 'eslint',
				include: projectRoot,
				exclude: /node_modules/
			}
		],
		loaders: [
			{
				test: /.js$/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015'],
					plugins: ['transform-runtime']
				},
				include: projectRoot,
				exclude: /node_modules/
			}
		]
  },
/*
	plugins: [
		new BabiliPlugin(, overrides)
	]
*/
}
