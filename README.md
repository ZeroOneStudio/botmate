# Botmate

[![Code Climate](https://codeclimate.com/github/ZeroOneStudio/botmate.png)](https://codeclimate.com/github/ZeroOneStudio/botmate)
[![Dependency Status](https://gemnasium.com/ZeroOneStudio/botmate.png)](https://gemnasium.com/ZeroOneStudio/botmate)

Simple nodejs server to serve static snapshots of single-page apps to crawlers.

#### Requirements

This guys are required to be present in your `PATH`:

  - [Node.js](http://nodejs.org) 0.10.18
  - [Phantomjs](http://phantomjs.org) 1.9.1
  - [Forever](https://npmjs.org/package/forever) npm module

## Usage

First, you need to run botmate server as a daemon. It starts on `http://127.0.0.1:3001` by default:

    $ git clone https://github.com/ZeroOneStudio/botmate && cd botmate
    $ npm install
    $ forever start botmate.js
    
Arter you need to configure your web server to catch requests with `_escaped_fragment_` and proxy them to botmate.


### Nginx configuration example

    location / {
      ...

      if ( $arg__escaped_fragment_ ) {
        proxy_pass http://127.0.0.1:3001/?host=$host$uri&fragment=$arg__escaped_fragment_;
        break;
      }

      ...
    }
    
Restart nginx and you are ready to serve static snapshots to crawlers. Yay!

## TODO

  - Cache snapshots
  - Get rid of callback hell, DRY
  - Tests

## LICENSE - "MIT License"

Copyright (c) 2010 Zero.One, http://www.zeroone.st

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
