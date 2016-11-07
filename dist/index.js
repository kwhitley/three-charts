'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var express = _interopDefault(require('express'));
var morgan = _interopDefault(require('morgan'));
var path = _interopDefault(require('path'));
var session = _interopDefault(require('express-session'));
var bodyParser = _interopDefault(require('body-parser'));
var debug = _interopDefault(require('debug'));
var crypto = _interopDefault(require('crypto'));
var Blowfish = _interopDefault(require('xs-blowfish'));
var oktaNode = _interopDefault(require('okta-node'));
var request = _interopDefault(require('request'));
var apicache = _interopDefault(require('apicache'));

var config = {
	ports: {
		http: 3000,
		io: 8090
	}
};

var name = "spa-app";
var version = "0.0.4";
var description = "QRI Speedwise Portfolio Analysis";
var main = "dist/index.js";
var scripts = { "clean": "rimraf dist", "std": "standard --verbose | snazzy", "start": "nodemon dist/index.js", "prestart:dev": "npm run prebuild", "start:dev": "nodemon --watch server ./server/index.js --exec babel-node & npm run watch:client", "prestart:windows": "npm run prebuild", "start:windows": "start nodemon --watch server ./server/index.js --exec babel-node & npm run watch:client", "start:prod": "nodemon --watch server ./dist/index.js & npm run watch:client & npm run watch:server", "start:server": "nodemon ./server/index.js --exec babel-node", "start:all": "npm run start:server & npm run start:client", "prebuild": "npm run clean", "build": "npm run build:server & npm run build:client", "build:client": "webpack -p --progress", "build:server": "rollup -c rollup.server.js", "watch:client": "webpack --progress --watch", "pretest": "npm run build", "test": "mocha", "test:config": "eslint rollup.config.js" };
var repository = { "type": "git", "url": "git+https://github.com/kwhitley/qri-node-spa-api.git" };
var keywords = [];
var author = "Kevin R. Whitley <kevin.whitley@qrigroup.com>";
var contributors = ["Kevin R. Whitley <kevin.whitley@qrigroup.com>", "Ruth Black <ruth.black@qrigroup.com>"];
var license = "NONE";
var bugs = { "url": "https://github.com/kwhitley/qri-node-spa-api/issues" };
var homepage = "https://github.com/kwhitley/qri-node-spa-api#readme";
var dependencies = { "apicache": "^0.3.4", "async": "^2.0.1", "body-parser": "^1.15.2", "classnames": "^2.2.5", "debug": "^2.2.0", "envs": "^0.1.6", "express": "^4.14.0", "express-session": "^1.14.1", "highcharts": "^5.0.0", "immutable": "^3.8.1", "leaflet": "^1.0.0", "leaflet-bing-layer": "^3.1.0", "lodash": "^4.15.0", "morgan": "^1.7.0", "mysql": "^2.11.1", "okta-node": "^2.0.1", "path": "^0.12.7", "react": "^15.3.2", "react-dom": "^15.3.2", "react-highcharts": "^10.0.0", "react-leaflet": "^0.12.3", "react-leaflet-cluster-layer": "0.0.3", "react-leaflet-geojson-cluster": "^0.1.8", "react-redux": "^4.4.5", "react-router": "^2.0.0", "react-router-redux": "^4.0.6", "react-select": "^1.0.0-rc.2", "redux": "^3.5.2", "redux-immutable": "^3.0.7", "redux-registry": "^0.0.9", "redux-thunk": "^2.1.0", "request": "^2.74.0", "url-loader": "^0.5.7", "whatwg-fetch": "^1.0.0", "xs-blowfish": "^2.0.0" };
var devDependencies = { "autobind-decorator": "^1.3.4", "autoprefixer-loader": "^3.2.0", "babel-cli": "^6.11.4", "babel-core": "^6.11.4", "babel-eslint": "^6.1.2", "babel-loader": "^6.2.5", "babel-plugin-external-helpers": "^6.18.0", "babel-plugin-transform-decorators-legacy": "^1.3.4", "babel-polyfill": "^6.16.0", "babel-preset-es2015": "^6.9.0", "babel-preset-es2015-native-modules": "^6.9.4", "babel-preset-es2015-rollup": "^1.2.0", "babel-preset-react": "^6.11.1", "babel-preset-stage-0": "^6.16.0", "babelrc-rollup": "^3.0.0", "browser-sync": "^2.17.5", "chai": "^3.5.0", "chai-immutable": "^1.6.0", "copy-webpack-plugin": "^4.0.0", "css-loader": "^0.23.1", "eslint": "^3.3.1", "exports-loader": "^0.6.3", "file-loader": "^0.9.0", "imports-loader": "^0.6.5", "mocha": "^3.0.2", "node-sass": "^3.10.1", "nodemon": "^1.10.2", "npm-run-all": "^3.1.1", "onchange": "^3.0.2", "postcss-loader": "^0.13.0", "react-addons-pure-render-mixin": "^15.3.0", "react-addons-test-utils": "^15.3.0", "react-hot-loader": "^3.0.0-beta.5", "redux-devtools": "^3.3.1", "rimraf": "^2.5.4", "rollup": "^0.36.3", "rollup-plugin-babel": "^2.6.1", "rollup-plugin-commonjs": "^5.0.5", "rollup-plugin-eslint": "^3.0.0", "rollup-plugin-json": "^2.0.2", "rollup-plugin-node-globals": "^1.0.9", "rollup-plugin-node-resolve": "^2.0.0", "rollup-plugin-replace": "^1.1.1", "rollup-plugin-uglify": "^1.0.1", "sass-loader": "^4.0.1", "snazzy": "^5.0.0", "standard": "^8.5.0", "style-loader": "^0.13.1", "webpack": "^2.1.0-beta.25", "webpack-dev-middleware": "^1.8.4", "webpack-dev-server": "^2.1.0-beta.8", "webpack-hot-middleware": "^2.13.0", "whatwg-fetch": "^1.0.0" };
var pkg = {
	name: name,
	version: version,
	description: description,
	main: main,
	scripts: scripts,
	repository: repository,
	keywords: keywords,
	author: author,
	contributors: contributors,
	license: license,
	bugs: bugs,
	homepage: homepage,
	dependencies: dependencies,
	devDependencies: devDependencies,
	"jsnext:main": "dist/index.es6.js"
};

var message = debug('sessions');
var DEFAULT_EXPIRATION = 86400000;
var HASH_SECRET = 'spa-app v' + pkg.version;
var hmac = crypto.createHmac('sha256', HASH_SECRET);
var bf = new Blowfish(HASH_SECRET);

// extend Date with .add(ms) functionality
Date.prototype.add = function (ms) {
  this.setTime(this.getTime() + ms);
  return this;
};

Date.prototype.toUTC = function () {
  return Date.UTC(this.getUTCFullYear(), this.getUTCMonth(), this.getUTCDate(), this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds(), this.getUTCMilliseconds());
};

// global sessions object
var sessions = {};

function timeoutSession(sessionid, duration) {
  return setTimeout(function () {
    var session$$1 = sessions[sessionid];

    if (session$$1) {
      message('user session for ' + session$$1.user.name + ' expired');
      delete sessions[sessionid];
    }
  }, duration);
}

function clearSessions(user) {
  Object.keys(sessions).forEach(function (sessionid) {
    var session$$1 = sessions[sessionid];
    if (session$$1.user.id === user.id) {
      clearTimeout(session$$1.timeout);
      delete sessions[sessionid];
    }
  });
}

function createSession(user, token) {
  var session$$1 = {
    user: user,
    expires: new Date().add(DEFAULT_EXPIRATION)
  };

  token.expires = new Date().add(DEFAULT_EXPIRATION);
  user.token = bf.encrypt(JSON.stringify(token));

  var sessionid = user.sessionid = crypto.createHmac('sha256', HASH_SECRET).update(JSON.stringify(user)).digest('hex');

  session$$1.timeout = timeoutSession(sessionid, DEFAULT_EXPIRATION);

  // clear existing sessions for user
  clearSessions(user);

  // store new session
  sessions[sessionid] = session$$1;

  message('creating user session for ' + user.name + ' with sessionid ' + sessionid);

  return user;
}

function listSessions() {
  return Object.keys(sessions).map(function (sessionid) {
    return sessions[sessionid].user;
  });
}

function autoRefreshSession(req, res, next) {
  var user = req.session && req.session.user;

  user && refreshSession(user.sessionid);

  next();
}

function refreshSession(sessionid) {
  var storedSession = sessions[sessionid];

  if (storedSession) {
    message('refreshing user session for ' + storedSession.user.name + '...');
    clearTimeout(storedSession.timeout);
    Object.assign(storedSession, {
      expires: new Date().add(DEFAULT_EXPIRATION),
      timeout: timeoutSession(sessionid, DEFAULT_EXPIRATION)
    });
  }
}

function resumeSession(sessionid) {
  var storedSession = sessions[sessionid];

  if (storedSession) {
    var user = storedSession.user;

    message('resuming user session for ' + user.name);
    refreshSession(sessionid);

    return user;
  }

  return false;
}

var app$1 = express();

// OKTA & BLOWFISH TOKEN ENCRYPTION
var HASH_SECRET$1 = 'spa-app v' + pkg.version;
var okta = new oktaNode('006L8Mwg_HYBzbzzktxD_68y8mC7zn3j_Fy35oxiYX', 'dev-301374', true);
var bf$1 = new Blowfish(HASH_SECRET$1);

// API CALLS WILL BE ROUTED THROUGH THIS HOST DOMAIN
var API_HOST = 'http://spa-api-demo.us-west-1.qri.local';
var API_PATH = '/api/v2/';

// MESSAGING CONSTANTS
var messages = {
  AUTH_FAILURE: 'Authentication failure.',
  NOT_LOGGED_IN: 'User not logged in.',
  LOGOUT_SUCCESS: 'User logged out successfully.',
  REQUIRES_LOGIN: 'This route requires user login.'
};

app$1.isEnabled = true;

// EXPOSED MIDDLEWARE: API calls should require authentication
app$1.isAuthenticated = function (req, res, next) {
  if (!app$1.isEnabled) return next(); // REMOVE*** authentication bypass
  var session$$1 = req.session;

  var _ref = session$$1 || {},
      user = _ref.user;

  if (!user || !user.id) {
    return res.status(403).json({ success: false, error: messages.REQUIRES_LOGIN });
  }
  next();
};

// REUSABLE AUTHENTICATION RESPONSE
function authenticationFailure(res) {
  return res.status(401).json({ status: 401, success: false, message: messages.AUTH_FAILURE });
}

app$1.get('/auth/sessions', function (req, res) {
  res.json(listSessions());
});

// RETURN LOGGED IN USER
app$1.get('/auth/user', function (req, res) {
  var user = req.session.user;

  if (!user) {
    return res.status(404).json({ success: false, status: 404, message: messages.NOT_LOGGED_IN });
  }
  return res.json(user);
});

// LOGS OUT CURRENT USER
app$1.get('/auth/logout', function (req, res) {
  var session$$1 = req.session;
  var user = session$$1.user;

  if (!user) {
    return res.status(500).json({ message: messages.NOT_LOGGED_IN });
  }
  delete session$$1.user;
  res.json({ message: messages.LOGOUT_SUCCESS });
});

// AUTHENTICATE USER
app$1.use('/auth', function (req, res) {
  var _req$body = req.body,
      userid = _req$body.userid,
      userpwd = _req$body.userpwd,
      sessionid = _req$body.sessionid,
      token = _req$body.token;

  // REMOVE THIS BLOCK IN PRODUCTION

  if (!userid && !sessionid) {
    userid = req.query.userid;
    userpwd = req.query.userpwd;
    sessionid = req.query.sessionid;
    token = req.query.token;
  }

  var resumedSession = resumeSession(sessionid);

  if (resumedSession) {
    return res.json(resumedSession);
  }

  if (!userid || !userpwd) {

    if (token) {
      try {
        token = bf$1.decrypt(token);
        token = JSON.parse(token);
        userid = token.userid;
        userpwd = token.userpwd;
        if (new Date(token.expires) < new Date()) {
          return res.status(401).json({ status: 401, success: false, error: 'Attempted relogin using expired token' });
        }
      } catch (err) {
        console.log(err.message);
        return res.status(401).json({ status: 401, success: false, error: 'Attempted relogin using invalid token' });
      }
    }
  }

  if (!userid || !userpwd) {
    return authenticationFailure(res);
  }

  try {
    okta.sessions.create(userid, userpwd, null, function (session$$1) {
      var resp = session$$1.resp;

      if (!session$$1.success || resp.status !== 'ACTIVE') {
        return authenticationFailure(res);
      }

      okta.users.get(resp.userId, function (userData) {

        var user = {
          id: resp.login,
          name: resp._links.user.name,
          profile: userData.resp.rofile
        };

        request(API_HOST + API_PATH + 'access/' + (userData.resp.profile.ACL || 'none'), function (err, response, body) {
          if (err) {
            user.portfolios = [];
          } else {
            try {
              user.portfolios = JSON.parse(body).portfolios;
            } catch (err) {
              return res.status(500).json({ success: false, error: err.message, body: body });
            }
          }

          req.session.user = createSession(user, { userid: userid, userpwd: userpwd });
          req.session.save();

          res.json(user);
        });
      });
    });
  } catch (err) {
    return authenticationFailure(res);
  }
});

var app$2 = express();

// API CALLS WILL BE ROUTED THROUGH THIS HOST DOMAIN
var API_HOST$1 = 'http://spa-api-demo.us-west-1.qri.local';
var API_PATH$1 = '/geoserver';

// ENABLE CACHING
var cache = apicache.options({ statusCodes: { include: [200] } }).middleware;

// GENERIC EXTERNAL API REQUEST+RESPONSE
function getFromAPI(path$$1, res) {
  request(path$$1, function (err, response, body) {
    if (err) {
      return res.status(500).json({ status: 500, message: err });
    }

    try {
      body = JSON.parse(body);
      return res.json(body);
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });
}

// NEW shorthand ... syntax
app$2.get('*', app$1.isAuthenticated, cache('1 day'), function (req, res) {
  var url = API_HOST$1 + API_PATH$1 + req.url.replace(/^\//, '');
  getFromAPI(url, res);
});

var app$3 = express();

// API CALLS WILL BE ROUTED THROUGH THIS HOST DOMAIN
var API_HOST$2 = 'http://spa-api-demo.us-west-1.qri.local';
var API_PATH$2 = '/api/v2/';

// ENABLE CACHING
var cache$1 = apicache.options({ statusCodes: { include: [200] } }).middleware;

// GENERIC EXTERNAL API REQUEST+RESPONSE
function getFromAPI$1(path$$1, callback) {
  request(path$$1, function (err, response, body) {
    if (err) {
      return callback(err);
    }

    try {
      body = JSON.parse(body);
    } catch (err) {
      return callback({ error: err.message, body: body });
    }

    return callback(err, body);
  });
}

function isNotPortfoliosRequest(req) {
  return req.path.replace(/\/$/, '') !== '/portfolios';
}

// ENABLE CACHE INDEX
app$3.get('cache/index', app$1.isAuthenticated, function (req, res) {
  return res.send(apicache.getIndex());
});

// NEW shorthand ... syntax
app$3.get('*', app$1.isAuthenticated, cache$1('1 day', isNotPortfoliosRequest), function (req, res) {
  var url = API_HOST$2 + API_PATH$2 + req.url.replace(/^\//, '');
  getFromAPI$1(url, function (err, data) {
    if (err) {
      return res.status(500).json({ success: false, err: err });
    }

    // if IS /portfolios request
    if (!isNotPortfoliosRequest(req) && app$1.isEnabled) {
      (function () {
        var authorizedPortfolios = req.session.user.portfolios.map(function (p) {
          return p.pUID;
        });

        data = data.filter(function (p) {
          return authorizedPortfolios.indexOf(p.id) !== -1;
        });
      })();
    }

    res.json(data);
  });
});

// CONFIG & ENVIRONMENT
var env = "production" || 'dev';
var isProduction = env === 'production';

// INITIALIZE APP SERVER
console.log('initializing SPA server in ' + env + ' mode...');
var app = express();

// HOT RELOADING - UNSTABLE
// import webpack from 'webpack'
// import webpackConfig from '../webpack.config'
// var compiler = webpack(webpackConfig)

// if (!isProduction) {
//   app.use(require("webpack-dev-middleware")(compiler, {
//     noInfo: true, publicPath: webpackConfig.output.publicPath
//   }));

//   app.use(require("webpack-hot-middleware")(compiler));
// }


// ENABLE USER SESSIONS
app.use(session({
  name: 'server-session-cookie-id',
  secret: 'kitty cat of kittens',
  saveUninitialized: true,
  resave: true
}));

// ENABLED FORM BODY PARSING
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));

// ENABLE OUTPUT LOGGING
app.use(morgan('dev'));

// ENABLE SESSION REFRESHING ON REQUEST
app.use(autoRefreshSession);

// ENABLE STATIC CONTENT DELIVERY
app.use(express.static(path.join(__dirname, !isProduction ? '../dist/client' : '/client')));

// ENABLE AUTHENTICATION
app.use(app$1);

// ENABLE GEOSERVER GATEWAY
app.use('/api/geoserver', app$2);

// ENABLE GENERIC API GATEWAY
app.use('/api', app$3);

// VERSION & PACKAGE CHECKING
app.get('/version', function (req, res) {
  var name$$1 = pkg.name,
      version$$1 = pkg.version,
      description$$1 = pkg.description;

  res.json({ name: name$$1, description: description$$1, version: version$$1, deployed: new Date() });
});

// CREATE HTTP SERVER
var httpServer = app.listen(config.ports.http, function () {
  console.log('HTTP server listening on port ' + httpServer.address().port);
});
//# sourceMappingURL=index.js.map
