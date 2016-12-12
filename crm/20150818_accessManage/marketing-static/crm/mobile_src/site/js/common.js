require.config({
 	baseUrl:'js/lib',
  paths: {
    zepto:'zepto/zepto',
    touch:'zeptotouch/zepto-touch',
    backbone:'backbone/backbone',
    underscore:'underscore/underscore',
    app: '../app'
  },
  map: {
    '*': {
      'css': 'require-css/css', // or whatever the path to require-css is
      'text': 'requirejs-text/text'
    }
  },
  shim: {
    'underscore': {
      exports: '_'
    },
    'zepto':{
      exports: '$'
    },
    'touch':{
      exports:'touch'
    }
  }
});