# Uluru 

![Uluru / Ayers Rock: a large sandstone rock formation in the southern part of the Northern Territory, in central Australia] (https://upload.wikimedia.org/wikipedia/commons/3/3e/Uluru_Panorama.jpg)

A server for recieving web page timing information

## Motivation

Projects like [New Relic Browser](http://newrelic.com/browser-monitoring) and [Yahoo Boomerang](http://yahoo.github.io/boomerang/doc/) ship a lot of javascript, which we discovered can interact poorly with extant javascript. Uluru intends to provide a minimalist yet extensible tool for collecting web page timing information and shipping that information to Graphite or Splunk.

Uluru is named after a rock formation in Northern Territory, Australia. It is so-named because I originally started writing it as an endpoint for Yahoo Boomerang. What's a place to throw boomerangs? Uluru!

N.B. Uluru is sacred to the Anangu people; they probably would not appreciate you throwing boomerangs at the actual rock formation.

## Structure

As with many things, there's an Uluru client and an Uluru server. The client is a few dozen lines of javascript that run on the client's browser, and they POST data back to the server. The server recieves data from the client and logs it for aggregation. You are free to replace either client or server (or both, if you really want) with code of your own implementation.

## Design Goals

There exist other solutions, commercial and open source, for recording and reporting on browser telemetry. It was found, however, that these solutions were significantly complex, and in many cases interfered with JavaScript we were already using, causing JavaScript errors and preventing the browser from rendering UI elements. Therefore, the design goals of Uluru became:

- Minimalism: Uluru.js is 38 lines of whitespace-heavy JavaScript. It should be extremely readable.
- Light weight: When minified, Uluru.js squishes down under 400 bytes.
- Speed: Uluru.js has no dependencies on other JS libraries. 
- No hacks: Uluru.js makes a single POST request to a remote server. It does not e.g. cram metrics into query parameters and make a series of requests GETting hidden images or iframes.

## Usage

### Server

Stand up a machine to run the Uluru server somewhere. Build `server/uluru.go` and deploy the binary to that server. Start it up. Right now, the server defaults to listening on port 9000 to `/uluru/`.

### Client

Copy `client/uluru.js` somewhere on the Internet that makes sense to you. Plop the following lines into the web page for which you want metrics:

        <script type="text/javascript" src="/path/to/uluru.js" ></script>
        <script type="text/javascript">
            window.onload = function(){ uluru("http://some.server/uluru/");};
        </script>

When a browser sees the above, it will report its telemetry to the Uluru server you stood up earlier. Except...

### HTTP Access Control

... probably not. Modern browsers really don't like it when you make them execute random code from all over the damn place. You may have to set the `Access-Control-Allow-Origin:` header in your web server to that browsers will POST to your uluru server. Try it out and check your preferred browser's developer tools. 

## Implementation notes

Uluru is a function that, when called, gets the time since navigation started and some other metrics, and sends those to an endpoint. We've set it up such that `uluru(endpoint)` is called when `window.onload` fires, under the assumption that most web pages are useful at that point.

Uluru collects the following data:

- url: the `window.location.href`
- connectionTime: the time (ms since UNIX epoch) the connection was initiated.
- connectionDelta: the time spent establishing a connection to the server
- firstByte: the time spent waiting for the server to respond with the first byte of data
- responseDelta: the time the server spent sending a response to the client
- loadTime: time between the `navigationStart` and `window.onload` events.
