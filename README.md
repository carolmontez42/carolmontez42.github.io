Playdead printer/receiver.
**Original code subject to [playdead.com](https://playdead.com)**

## Request

```javascript
{
	"in": "NEWPLANETDISCOVERED", // input
	"id": "ae37511d-df26-920d-5856-aa883b704c5f", // GUID(Session)
	"check": "true",
	"url": "/"
}
```

## Use

**Making Request**

Enter your message and click `Send` to request data

**GUID**

Click `GUID` to reset id, or you can enter your own / set one

It will reset on reload, and if you do not set one before sending a request it will also generate a new ID

## [CORS Anywhere](https://github.com/Rob--W/cors-anywhere)

print.js utilizes a proxy server to validate the CORS headers.

Since the number of requests per period is limited (https://github.com/Rob--W/cors-anywhere/blob/master/README.md#demo-server) it may fail to return data.

##

**Do not abuse the code in any way.**