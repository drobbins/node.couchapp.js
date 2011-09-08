# Installation

Install node.

Install npm.

<pre>
$ git clone repo
$ cd node.couchapp.js
$ npm link .
</pre>

<pre>
$ couchapp help
couchapp -- utility for creating couchapps

Usage:
  couchapp &lt;command> app.js http://localhost:5984/dbname

Commands:
  push : Push app once to server.
  sync : Push app then watch local files for changes.
</pre>

app.js example:

<pre>
  var couchapp = require('couchapp')
    , path = require('path');

  ddoc = {
      _id: '_design/app'
    , views: {}
    , lists: {}
    , shows: {} 
  }

  module.exports = ddoc;

  ddoc.views.byType = {
    map: function(doc) {
      emit(doc.type, null);
    },
    reduce: '_count'
  }

  ddoc.views.peopleByName = {
    map: function(doc) {
      if(doc.type == 'person') {
        emit(doc.name, null);
      }
    }
  }

  ddoc.lists.people = function(head, req) {
    start({
      headers: {"Content-type": "text/html"}
    });
    send("&lt;ul id='people'>\n");
    while(row = getRow()) {
      doc = row.doc;
      send("\t&lt;li class='person name'>" + doc.name + "&lt;/li>\n");
    }
    send("&lt;/ul>\n")
  }

  ddoc.shows.person = function(doc, req) {
    return {
      headers: {"Content-type": "text/html"},
      body: "&lt;h1 id='person' class='name'>" + doc.name + "&lt;/h1>\n"
    }
  }

  couchapp.loadAttachments(ddoc, path.join(__dirname, '_attachments'));
</pre>


## added features in fork (hacky)

added raw support for `.couchapprc` file

before `couchapp push` hooks

* on the fly compilation of CoffeeScript to JavaScript
* optional concatination of JavScripts & Stylesheets
* optional compression of JavaScript

I know the code is bad, I needed a quick solution. But I'm open too feedback and if
people like it, I'll make it more robust and send a pull request to mikael.

## HowTo

* CoffeeScript to JavaScript Compilation works out of the box. `_attachements/javascript/test.coffee`   
  on your machine becomes `javascript/test.js` on your couch
* run couchapp with the --concatinate parameter  
  `couchapp push app.js http://localhost:5984/mydb --concatinate`  
  concatination rules live in app.doc.config. I read it from a JSON file using my new `couchapp.loadJSON`, it looks like this:
  <pre>
    {
      "stylesheets": {
        "app.css": [
          "stylesheets/application",
          "embed/vendor/jquery_ui/css/smoothness/jquery-ui-1.8.12.custom"
        ]
      }, 
      "javascripts": {
        "app.js": [
          "javascripts/application",
          "javascripts/controllers/application",
          "javascripts/models/base",
          "javascripts/collections/base",
          "javascripts/views/application",
          "javascripts/views/partial"
        ], 
        "vendor.js": [
          "vendor/json2",
          "vendor/jquery-1.6.1",
          "vendor/underscore",
          "vendor/backbone"
        ]
      }
    }
    
  </pre>
* compression works like concatination and may be also combined  
  `couchapp push app.js http://localhost:5984/mydb --compress`
  
Besides the command line parameters, you can also use a .couchapprc as known from the python version.
Mine looks like this:

<pre>
{
  "env" : {
    "default" : {
      "db" : "http://admin:password@localhost:5984/mydb"
    },
    "preview" : {
      "db" : "http://admin:password@localhost:5984/mydb_preview",
      "concatinate" : "true",
      "compress" : "true"
    },
    "staging" : {
      "db" : "http://admin:password@mydbserver.com:5984/mydb_staging",
      "concatinate" : "true",
      "compress" : "true"
    },
    "production" : {
      "db" : "http://admin:password@mydbserver.com:5984/mydb",
      "concatinate" : "true",
      "compress" : "true"
    }
  }
}
</pre>

## TODO's

* gzip-compression of text assets
* better code ... promise