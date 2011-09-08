#!/usr/bin/env node

var couchapp = require('./main.js')
  , watch = require('watch')
  , path = require('path')
  , fs = require('fs')
  ;

function abspath (pathname) {
  if (pathname[0] === '/') return pathname
  return path.join(process.env.PWD, path.normalize(pathname));
}

function copytree (source, dest) {
  watch.walk(source, function (err, files) {
    for (i in files) {
      (function (i) {
        if (files[i].isDirectory()) {
          try {
            fs.mkdirSync(i.replace(source, dest), 0755)
          } catch(e) {
            console.log('Could not create '+dest)
          }
        } else {
          fs.readFile(i, function (err, data) {
            if (err) throw err;
            fs.writeFile(i.replace(source, dest), data, function (err) {
              if (err) throw err;
            });
          })
        } 
      })(i); 
    }
  })
}

function boiler (app) {
  if (app) {
    try { fs.mkdirSync(path.join(process.env.PWD, app)) }
    catch(e) {};
  }
  app = app || '.'

  copytree(path.join(__dirname, 'boiler'), path.join(process.env.PWD, app));
}


if (process.mainModule && process.mainModule.filename === __filename) {
  args = []
  options = {}
  var couchapprc = JSON.parse( fs.readFileSync('.couchapprc').toString() );
  
  process.argv.forEach(function(arg) {
    if (/^--/.test(arg)) {
      options[arg.substr(2)] = 1
    } else {
      args.push(arg)
    }
  });
    
  var node = args.shift()
    , bin = args.shift()
    , command = args.shift()
    , app = args.shift()
    , couch = args.shift()
    , ENV = 'default'
    ;


  // default `app` parameter to »app.js«
  app || (app = 'app.js')
  
  // allow to provide `couch` w/o `app` parameter
  
  if (!app || !/\.js$/.test(app)) {
    couch = app
    app = 'app.js'
  }
  
  // try to find couch in .couchapprc
  // allow to provide ENV var as `couch` parameter
  if (!/^http/.test(couch)) {
    couch && (ENV = couch);
    couch = couchapprc.env[ ENV ].db;
  }

  if (command == 'help' || command == undefined) {
    console.log(
      [ "couchapp -- utility for creating couchapps" 
      , ""
      , "Usage:"
      , "  couchapp <command> app.js http://localhost:5984/dbname"
      , ""
      , "Commands:"
      , "  push   : Push app once to server."
      , "  sync   : Push app then watch local files for changes."
      , "  boiler : Create a boiler project."
      ]
      .join('\n')
    )
    process.exit();
  }
  
  for(var key in couchapprc.env[ ENV ]) {
    if (key == 'db') continue;
    options[key] || (options[key] = couchapprc.env[ ENV ][key])
  }
  
  console.log('options', options)
  
  
  if (command == 'boiler') {
    boiler(app);
  } else {
    couchapp.createApp(require(abspath(app)), couch, options, function (app) {
      if (command == 'push') app.push()
      else if (command == 'sync') app.sync()

    })
  } 
}


exports.boilerDirectory = path.join(__dirname, 'boiler')

