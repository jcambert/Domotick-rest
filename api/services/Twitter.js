var OAuth2 = require('OAuth').OAuth2;
module.exports = {
    authenticate: function(keys,callback){
         var oauth2 = new OAuth2(
            keys.consumer_key,
            keys.consumer_secret, 
            'https://api.twitter.com/', 
            null,
            'oauth2/token', 
            null);
        oauth2.getOAuthAccessToken(
            '',
            {'grant_type':'client_credentials'},
            function (e, access_token, refresh_token, results){
                console.log('bearer: ',access_token);
                oauth2.get('protected url', 
                    access_token, function(e,data,res) {
                        if (e) return callback(e, null);
                        if (res.statusCode!=200) 
                        return callback(new Error(
                            'OAuth2 request failed: '+
                            res.statusCode),null);
                        try {
                        data = JSON.parse(data);        
                        }
                        catch (e){
                            return callback(e, null);
                        }
                        return callback(e, data);
                    });
            });
    }
}