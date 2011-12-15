// Copyright Chris Anderson 2011
// Apache 2.0 License
// jquery.couchLogin.js
// 
// Example Usage (loggedIn and loggedOut callbacks are optional): 
//    $("#mylogindiv").couchLogin({
//        loggedIn : function(userCtx) {
//            alert("hello "+userCtx.name);
//        }, 
//        loggedOut : function() {
//            alert("bye bye");
//        }
//    });

(function($) {
    $.fn.couchLogin = function(opts) {
        var elem = $(this);
        opts = opts || {};
        function initWidget() {
            $.couch.session({
                success : function(r) {
                    var userCtx = r.userCtx;
                    if (userCtx.name) {
                        elem.empty();
                        elem.append(loggedIn(r));
                        if (opts.loggedIn) {opts.loggedIn(userCtx)}
                    } else if (!$.isEmptyObject(userCtx.roles) && userCtx.roles.indexOf("_admin") != -1) {
                        elem.html(templates.adminParty);
                    } else {
                        elem.html(templates.loggedOut);
                        if (opts.loggedOut) {opts.loggedOut()}
                    };
                }
            });
        };
        initWidget();
        function doLogin(name, pass) {
            $.couch.login({name:name, password:pass, success:initWidget});
        };
        elem.delegate("a[href=#signup]", "click", function() {
            elem.html(templates.signupForm);
            elem.find('input[name="name"]').focus();
        });
        elem.delegate("a[href=#login]", "click", function() {
            elem.html(templates.loginForm);
            elem.find('input[name="name"]').focus();
        });
        elem.delegate("a[href=#logout]", "click", function() {
            $.couch.logout({success : initWidget});
        });
        elem.delegate("form.login", "submit", function() {
            doLogin($('input[name=name]', this).val(),  
                $('input[name=password]', this).val());
            return false;
        });
        elem.delegate("form.signup", "submit", function() {
            var name = $('input[name=name]', this).val(),  
                pass = $('input[name=password]', this).val();
            $.couch.signup({name : name}, pass, {
                success : function() {doLogin(name, pass)}
            });
            return false;      
        });
    }
    var templates = {
        adminParty : '<p><strong>Admin party, everyone is admin!</strong> Fix this in <a href="/_utils/index.html">Futon</a> before proceeding.</p>',
        loggedOut : '<ul class="nav"><li><a href="#signup">Signup</a></li><li><a href="#login">Login</a></li></ul>',
        loginForm : '<form class="login">\n<input type="text" name="name" placeholder="Username" class="input-small">\n<input type="password" name="password" placeholder="Password" class="input-small">\n<button type="submit" class="btn">Login</button>\n<a href="#signup">or Signup</a>\n</form>',
        signupForm : '<form class="signup">\n<input type="text" name="name" placeholder="Username" class="input-small">\n<input type="password" name="password" placeholder="Password" class="input-small">\n<button type="submit" class="btn">Sign Up</button>\n<a href="#login">or Login</a>\n</form>'
    };
    function loggedIn(r) {
        var auth_db = encodeURIComponent(r.info.authentication_db)
        , uri_name = encodeURIComponent(r.userCtx.name)
        , span = $('<ul class="nav"><li><a target="_new" href="/_utils/document.html?' 
            + auth_db +'/org.couchdb.user%3A' + uri_name 
            + '" class="name"></a></li><li><a href="#logout">Logout?</a></li></ul>');
        $('a.name', span).text("Welcome "+r.userCtx.name); // you can get the user name here
        return span;
    }
})(jQuery);
