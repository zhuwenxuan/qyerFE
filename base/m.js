require.config({
	baseUrl: 'http://fe.qyer.com/m',
	paths:{
		zepto:"base/js/zepto",
		zepto-touch:"base/js/zepto-touch",
		zepto-fx:"base/js/zepto-fx"
	},
	map: {
		'*': {
			'css': 'basic/js/require-css'
		}
	}
})