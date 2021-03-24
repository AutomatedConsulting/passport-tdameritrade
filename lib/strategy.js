/**
 * Dependencies
 */
var OAuth2Strategy      = require('passport-oauth2')
  , InternalOAuthError  = require('passport-oauth2').InternalOAuthError
  , util                = require('util');

  
/**
 * Options for the Strategy.
 * @typedef {Object} StrategyOptions
 * @property {string} clientID
 * @property {string} clientSecret
 * @property {string} callbackURL
 * @property {Array} scope
 * @property {string} [authorizationURL="https://auth.tdameritrade.com/auth"]
 * @property {string} [tokenURL="https://api.tdameritrade.com/v1/oauth2/token"]
 * @property {string} [scopeSeparator=" "]
 */
/**
 * `Strategy` constructor.
 *
 * The TD Ameritrade authentication strategy authenticates requests by delegating to
 * TD Ameritrade via the OAuth2.0 protocol
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `cb`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid. If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`       OAuth ID to TD Ameritrade
 *   - `clientSecret`   OAuth Secret to verify client to TD Ameritrade
 *   - `callbackURL`    URL that TD Ameritrade will redirect to after auth
 *   - `scope`          Array of permission scopes to request. This doesn't seem to be working anymore.
 *                      The possible scopes were PlaceTrades, AccountAccess, MoveMoney
 *                      Only one used to work at a time.
 * 
 * @constructor
 * @param {StrategyOptions} options
 * @param {function} verify
 * @access public
 */
function Strategy(options, verify) {
    options = options || {};
    options.authorizationURL = options.authorizationURL || 'https://auth.tdameritrade.com/auth';
    options.tokenURL = options.tokenURL || 'https://api.tdameritrade.com/v1/oauth2/token';
    options.scopeSeparator = options.scopeSeparator || ' ';
    options.clientID = options.clientID.endsWith('@AMER.OAUTHAP') ? options.clientID : `${options.clientID}@AMER.OAUTHAP`
    OAuth2Strategy.call(this, options, verify);
    this.name = 'tdameritrade';
    this._oauth2.useAuthorizationHeaderforGET(true);
}

/**
 * Inherits from `OAuth2Strategy`
 */
util.inherits(Strategy, OAuth2Strategy);

/**
 * Retrieve user profile from TD Ameritrade.
 *
 * This function constructs a normalized profile.
 *
 * @param {string} accessToken
 * @param {function} done
 * @access protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
    var self = this;
    this._oauth2.get('https://api.tdameritrade.com/v1/userprincipals', accessToken, function(err, body, res) {
        if (err) {
            return done(new InternalOAuthError('Failed to fetch the user profile.', err))
        }

        try {
            var parsedData = JSON.parse(body);
        }
        catch (e) {
            return done(new Error('Failed to parse the user profile.'));
        }

        var profile = parsedData; // has the basic user stuff
        profile.provider = 'tdameritrade';
        profile.accessToken = accessToken;
        return done(null, profile)
    });
};

/**
 * Options for the authorization.
 * @typedef {Object} authorizationParams
 * @property {any} permissions
 * @property {any} prompt
 */
/**
 * Return extra parameters to be included in the authorization request.
 *
 * @param {authorizationParams} options
 * @return {Object}
 * @api protected
 */
Strategy.prototype.authorizationParams = function(options) {
    var params = {};
    return params;
};

/**
 * Options for the token request.
 * @typedef {Object} tokenParams
 * @property {string} accessType
 * /
/**
 * Return extra parameters to be included in the token request
 * 
 * @param {Object} options 
 * @returns {Object}
 * @api protected 
 */
Strategy.prototype.tokenParams = function(options) {
  var params = {}
  if (options.accessType) {
    params['access_type'] = options.accessType
  }
  return params
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
