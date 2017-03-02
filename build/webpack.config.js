const webpack = require( 'webpack' )
const path = require('path')
const projectRoot = path.resolve(__dirname+"/../")

// This is horribly broken
//const DtsBundlerPlugin = require('dtsbundler-webpack-plugin')

module.exports = {
  entry: projectRoot+'/src/BookKeeper.ts',
	devtool: 'source-map',
  output: {
    path: projectRoot,
    filename: 'BookKeeper.js',
    library: 'BookKeeper',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  resolve: {
    extensions: [ '', '.js', '.ts','.tsx']
  },
  module: {
		preLoaders: [
			{
				test: /.tsx?$/,
				loader: 'tslint',
				include: projectRoot,
				exclude: /node_modules/
			},
			{
				test: /.js$/,
				loader: 'eslint',
				include: projectRoot,
				exclude: /node_modules/
			}
		],
		loaders: [
			{
				test: /\.tsx?$/, 
				loader: 'ts-loader',
				include: projectRoot,
				exclude: /node_modules/
			},
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
	tslint: {
		emitErrors: true,
		failOnHint: true,
	},
	plugins: [
/*
		new DtsBundlerPlugin({
			out:'./BookKeeper.d.ts',
		})
*/
		//new BabiliPlugin(, overrides)
	]
}
