# Utpimeer™
A small uptime backend server, that tracks and stores up and downtimes of your server(s).

## Config:

```js

{
    "port": "3000",
    "indexroute": "/uptime",
    "mode": "light",
    "interval": "30", 
    "logging": false,
    "servers": {
        "exampleserver": {
            "displayname": "Foo",
            "desc": "This is an example server.",
            "IP": "127.0.0.1"
        },
        "anotherserver": {
            "displayname": "Bar",
            "desc": "This is another example server.",
            "IP": "127.0.0.1:4000"
        }
    },
    "redisconfig": {
        "PORT": "3367",
        "PASSWORD": "something"
    }
}

```

## Discord Module:

Uptimeer™ features a discordmodule, which allows you to have a dynamic statusmessage that will update dynamically everytime the Uptimeer™ polls your servers. That way you can display up and downtimes directly inside your discord server.

### Config:

```js

{
    "TOKEN": "TOKEN_GOES_HERE",
    "PREFIX": "SET_YOUR_PREFIX_HERE",
    "GUILDID": "PLACE_THE_SERVER_ID_WHERE_YOUR_BOT_WILL_LIVE_IN_HERE"
}

```