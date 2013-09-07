Botmate
=======

Simple nodejs server to serve static snapshots of single-page apps to crawlers.

Usage:

    $ git clone https://github.com/ZeroOneStudio/botmate && cd botmate
    $ npm install -g forever
    $ forever start bot-mate.js
    
Arter that, you need to configure your web server to catch requests with `_escaped_fragment_` and proxy them to botmate.


Nginx configuration example
=======

    location / {
      ...

      if ( $arg__escaped_fragment_ ) {
        proxy_pass http://0.0.0.0:1337/?host=$host&fragment=$arg__escaped_fragment_;
        break;
      }

      ...
    }
