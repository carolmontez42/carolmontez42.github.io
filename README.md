| [Printer](#printer) | [Color-coder](#color-coder) | [Hex / Binary Converter](#hex--binary-converter) |
| ------------------- | --------------------------- | ------------------------------------------------ |

<br>

------

<br>

# Printer

Playdead printer/receiver. Visit [here](https://carolmontez42.github.io/print/print.html)

**Original code is subject to** ***[playdead.com](https://www.playdead.com)***

<br>

## Usage

Enter your message and click `Send` to make request

Click `GUID` to reset ID, or enter your own

<br>

## Request

When the user makes a request, the following form is submitted to playdead.com:

```javascript
{
	"in": "NEWPLANETDISCOVERED",  // User input
	"id": "ae37511d-df26-920d-5856-aa883b704c5f",  // GUID (identifies a unique session)
	"check": "true",
	"url": "/"
}
```

and correct inputs trigger an update in the server.

<br>

## [CORS Anywhere](https://github.com/Rob--W/cors-anywhere)

In order to make an `XMLHttpRequest` by default, it must be ensured that the server making a request as one loading its resources from shares the same origin(domain/scheme). ([Same-Origin Policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy))

Otherwise, the client cannot load the resources from, so to speak, *playdead.com* to *carolmontez42.github.io*;

To circumvent this, print.js utilizes [a proxy server](https://acorn42.herokuapp.com) to validate requests from different origins to *playdead.com*,<br>based on **CORS Anywhere**: <https://github.com/Rob--W/cors-anywhere/#documentation>

To share resources across domains, a host can enable [Cross-origin resource sharing](https://fetch.spec.whatwg.org/#http-cors-protocol)(CORS) by specifying the response headers to accept valid requests from others:

```
Access-Control-Allow-Origin: https://github.com   //Accept requests from the origin https://github.com
Access-Control-Allow-Methods: POST                //and only allow POST request method
```

**CORS Anywhere** enables this by proxy capturing the client's request and modifying the response headers of the host, which is then returned to the user.

##

Since all requests are handled from the proxy, the destination server should only accept [this domain](https://acorn42.herokuapp.com) as the source IP; so when multiple users are making requests simultaneously, it could easily overload the server.

When the hosting server(*playdead.com*) is rate-limited, it will respond to all requests with the following status code:

```
429 - Too Many Requests (generally with the response 'Comms overload - timed security cooldown initiated...')
```

As a measure to prevent downtime as much as I can, this domain is rate-limited to **10 requests per minute per user**.

<br>

##

***Do not abuse the code in any way.***

<br>

------

<br>

# Color-coder

Converts morse code/string to & from color-coded images. Visit [here](https://carolmontez42.github.io/ccode/code.html)

<br>

## Usage

Load / Save image or text

`Crop to Fit` [trims the surrounding transparent pixels from image](https://gist.github.com/remy/784508); 

`Set Color Codes` to set character-color pair

`Set Viewport Size` to set viewport-image ratio

`Break Line At` wrap text at the given number of characters

##

When selecting character-color pairs, the input must be in the following format or will be ignored:

```javascript
{
	/:    //The color-coded character (length 1)
	
	255,  //RGB components (integer between 0 - 255)
	0,
	0
}

//ex) {#:0,0,255} = "#" is indicated blue
```

Whitespaces are omitted.

<br>

------

<br>

# Hex / Binary Converter

Converts text into hexadecimal / binary stream. Visit [here](https://carolmontez42.github.io/hex/hex.html)

<br>

## Usage

`Convert` - Select an option from the list and convert

`Save File` or `Load File` from & to stream
