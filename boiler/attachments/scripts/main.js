//set paths
require.config({
 paths : {
   'jquery' : 'jquery-1.7.1',
 }
});

//main.js
require(
  [
    'jquery',
    'underscore',
    'backbone',
    'jquery.couch',
    'jquery.couchLogin'
  ],
  function($){
    $(document).ready(function(){
      console.log('Read, set, go!');
    });
});
