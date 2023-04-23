'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')
function resolve(dir) {
	return path.join(__dirname, dir)
}
const name = defaultSettings.title || 'sparrow js' // page title
const port = process.env.port || process.env.npm_config_port || 9095

console.log('process.env.CONSUMER_BASE_URL', process.env.CONSUMER_BASE_URL)
console.log('process.env.SPARROW_BASE_URL', process.env.SPARROW_BASE_URL)

const {defineConfig} = require('@vue/cli-service')

module.exports = defineConfig({
	// dev 必须是/ 生产环境才允许配置
	//publicPath: process.env.NODE_ENV === 'prod' ? '/my-project/' : '/',
	publicPath: process.env.publicPath,  //npm run serve 启动后对应的项目子目录
	outputDir: 'build-dist2', //打包编译后生成的路径 npm run build
	assetsDir: 'static2', //静态资源生成的路径
	indexPath: 'home.html', //编译后的首页
	transpileDependencies: true,
	configureWebpack: {
		// provide the app's title in webpack's name field, so that
		// it can be accessed in index.html to inject the correct title.
		name: name,
		output: {
			publicPath: process.env.publicPath
		},
		resolve: {
			alias: {
				'@': resolve('src'),
				'$': resolve('../../source/scripts'),
			}
		},
		experiments: {
			topLevelAwait: true, // 此处为新增配置
		}
	},

	devServer: {
		port: port, //端口
		open: true, //是否自动启用浏览器
		//overlay: { //vue3
		/**
		 * INFO  Starting development server...
		 ERROR  ValidationError: Invalid options object. Dev Server has been initialized using an options object that does not match the API schema.
		 - options has an unknown property 'overlay'. These properties are valid:
		 object { allowedHosts?, bonjour?, client?, compress?, devMiddleware?, headers?, historyApiFallback?, host?, hot?, http2?, https?, ipc?, liveReload?, magicHtml?, onAfterSetupMiddleware?, onBeforeSetupMiddleware?, onListening?, open?, port?, proxy?, server?, setupExitSignals?, setupMiddlewares?, static?, watchFiles?, webSocketServer? }
		 */
		//warnings: false,
		//errors: true
		//},
		proxy: {
		  '/api/': {
		    target: 'http://127.0.0.1:7777',
		    changeOrigin: true,
		    logLevel: 'debug',
		    pathRewrite: {
		      '^/api/': ''
		    }
		  }
		}
	},
})
//?输出configureWebpack
console.log(module.exports.configureWebpack.resolve.alias);
console.log("publicPath:" + process.env.publicPath)

