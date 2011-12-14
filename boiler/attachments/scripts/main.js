//set paths
require.config({
 paths : {
   'jquery' : 'jquery-1.7.1.min'
 }
});

//main.js
require(['jquery','underscore-min', 'backbone'], function($){
 $(document).ready(function(){


   console.log('Read, set, go!');
  });
});
