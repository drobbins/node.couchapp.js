(function(){
  'use strict';

  require.config({
   paths : {
    'jquery' : 'libs/jquery/1.7.1/jquery',
    //'jquery.couch' : '/../../_utils/scripts/jquery.couch',
    'underscore': 'libs/underscore/1.2.3/underscore',
    'backbone': 'libs/backbone/0.5.3-optamd3/backbone' // AMD support
   }
  });

  //Wrappers for a few modules
  //define('jquery.couch', ['jquery', '/../../_utils/script/jquery.couch.js'], function(){
  //  return $;
  //});
  //define('jquery.couchLogin', ['jquery', 'jquery.couch', 'lib/underscore.js'], function(){
  //  return $;
  //});

  //main.js
  require(
    [
      'jquery',
      'backbone'
    ],
    function($){
      $(document).ready(function($,Backbone\\\\){
        console.log('Read, set, go!');
        debugger;
      });
  });
}());
