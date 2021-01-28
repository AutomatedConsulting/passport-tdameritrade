# passport-tdameritrade

Passport strategy for authentication with [TD Ameritrade](https://developer.tdameritrade.com/apis) through the OAuth 2.0 API.

Before using this strategy, it is strongly recommended that you read through the official docs page [here](https://developer.tdameritrade.com/authentication/apis).

## Usage
`npm install passport-tdameritrade --save`

#### Configure Strategy

```javascript
var TDAmeritradeStrategy = require('passport-tdameritrade').Strategy;

passport.use(new TDAmeritradeStrategy({
    clientID: 'id',
    callbackURL: 'callbackURL'
},
function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ tdameritradeId: profile.id }, function(err, user) {
        return cb(err, user);
    });
}));
```

#### Authentication Requests
Use `passport.authenticate()`, and specify the `'tdameritrade'` strategy to authenticate requests.

For example, as a route middleware in an Express app:

```javascript
app.get('/auth/tdameritrade', passport.authenticate('tdameritrade'));
app.get('/auth/tdameritrade/callback', passport.authenticate('tdameritrade', {
    failureRedirect: '/'
}), function(req, res) {
    res.redirect('/secretstuff') // Successful auth
});
```
#### Refresh Token Usage
In some use cases where the profile may be fetched more than once or you want to keep the user authenticated, refresh tokens may wish to be used. A package such as `passport-oauth2-refresh` can assist in doing this.

Example:

`npm install passport-oauth2-refresh --save`

```javascript
var TDAmeritradeStrategy = require('passport-tdameritrade').Strategy
  , refresh = require('passport-oauth2-refresh');

var tdameritradeStrat = new TDAmeritradeStrategy({
    clientID: 'id',
    callbackURL: 'callbackURL'
},
function(accessToken, refreshToken, profile, cb) {
    profile.refreshToken = refreshToken; // store this for later refreshes
    User.findOrCreate({ tdameritradeId: profile.id }, function(err, user) {
        if (err)
            return done(err);

        return cb(err, user);
    });
});

passport.use(tdameritradeStrat);
refresh.use(tdameritradeStrat);
```

... then if we require refreshing when fetching an update or something ...

```javascript
refresh.requestNewAccessToken('tdameritrade', profile.refreshToken, function(err, accessToken, refreshToken) {
    if (err)
        throw; // boys, we have an error here.
    
    profile.accessToken = accessToken; // store this new one for our new requests!
});
```


## Examples
An Express server example can be found in the `/example` directory. Be sure to `npm install` in that directory to get the dependencies.

## Credits
* [Jared Hanson](https://github.com/jaredhanson) - used passport-github to understand passport more and kind of as a base.
* [Nicolas Tay](https://github.com/nicholastay) - used passport-discord to understand passport more and kind of as a base.

## License
Licensed under the ISC license. The full license text can be found in the root of the project repository.
