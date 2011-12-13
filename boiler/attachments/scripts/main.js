//set paths
require.config({
 paths : {
   'jquery' : 'jquery-1.7.1.min'
 }
});

//main.js
require(['jquery'], function($){
 $(document).ready(function(){


   console.log('Read, set, go!');
  });
});
