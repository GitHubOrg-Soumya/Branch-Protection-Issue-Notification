const express = require("express");
const app = express();
const API_SECRET = 'tdy@FqUdMhy9LMn';

//app.get("/", (req, res) => res.send("Hello World!"));

app.use( express.json( { verify: ( req, res, buffer ) => { req.rawBody = buffer; } } ) );

app.post( '/', ( req, res ) => {
    const signature = _generateSignature( req.method, req.url, req.headers[ 'x-cs-timestamp' ], req.rawBody );

    if ( signature !== req.headers[ 'x-cs-signature' ] ) {
        return res.sendStatus( 401 );
    }

    console.log( 'received webhook', req.body );
    res.sendStatus( 200 );
} );


app.listen(3000, () => console.log("Server listening on port 3000!"));

function _generateSignature( method, url, timestamp, body ) {
    const hmac = crypto.createHmac( 'SHA256', API_SECRET );

    hmac.update( `${ method.toUpperCase() }${ url }${ timestamp }` );

    if ( body ) {
        hmac.update( body );
    }

    return hmac.digest( 'hex' );
}