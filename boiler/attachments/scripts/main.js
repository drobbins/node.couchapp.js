(function(){
  'use strict';

  require.config({
   paths : {
    'jquery' : 'libs/jquery/1.7.1/jquery',
    'underscore': 'libs/underscore/1.2.3/underscore',
    'sha1' : '/../../_utils/script/sha1',
    'backbone': 'libs/backbone/0.5.3-optamd3/backbone' // AMD support
   }
  });

  //Wrappers for a few jQuery plugins
  define('jquery.couch', ['jquery', 'order!/../../_utils/script/jquery.couch.js'], function(){
  });
  define('jquery.couchLogin', ['jquery', 'jquery.couch', 'order!libs/jquery.couchLogin'], function(){
  });

  //main.js
  require(
    [
      'jquery',
      'jquery.couch',
      'jquery.couchLogin',
      'underscore',
      'backbone',
      'sha1',
    ],
    function($,_,Backbone,App){
      $(document).ready(function(){
        console.log('Read, set, go!');
        $("#auth").couchLogin();
        var a=_,b=Backbone,c=$;
      });
  });
}());
