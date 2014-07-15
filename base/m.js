require.config({
	baseUrl: 'http://fe.qyer.com/m',
	paths:{
		zepto:"base/js/zepto",
		zepto_touch:"base/js/zepto-touch",
		zepto_fx:"base/js/zepto-fx",
		popup_base:"common/ui/popup_base/src/popup_base"
	},
	map: {
		'*': {
			'css': '../lib/require-css'
		}
	}
})
