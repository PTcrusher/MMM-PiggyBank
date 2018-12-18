# MMM-PiggyBank

This module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/) is aimed to give you the extra push to save money, presenting your savings in a progress bar within MM.

![In a single picture](https://github.com/PTcrusher/MMM-PiggyBank/blob/screenshots/MMM-PiggyBank.png)

## Installation

1. Navigate to the ```MagicMirror/modules``` directory.
2. Execute ```git clone https://github.com/PTcrusher/MMM-PiggyBank```
3. Configure the module according to the information bellow
4. Restart MagicMirror

## Using the module

To use this module, add the following configuration block to the modules array in the `config/config.js` file:
```js
var config = {
    modules: [
        {
            module: 'MMM-PiggyBank',
            position: 'top_center', //Any region, check https://forum.magicmirror.builders/topic/286/regions
            config: {
                //The config is optional
            }
        }
    ]
}
```

## Configuration options

| Option           | Description
|----------------- |-----------
| `updateInterval` | Time between each update in ms<br>**Default value:** `60000`
| `symbol`         | Symbol to put on the left of the progress bar <br><br>**Type:** `string`<br>**Default value:** `home`<br>**Possible Values:** See [Font Awesome](http://fontawesome.io/cheatsheet/) cheatsheet for a list of possible values

## Extra routes

To allow the REST calls to reach the Magic Mirror we have to add the source of these requests to the whitelist.
In the following example we have added the 192.168.17.1 ip to the whitelist ```MagicMirror/config/config.js```:

```js
var config = {
        address: "0.0.0.0",   // Address to listen on, can be:
                              // - "localhost", "127.0.0.1", "::1" to listen on loopback interface
                              // - another specific IPv4/6 to listen on a specific interface
                              // - "", "0.0.0.0", "::" to listen on any interface
                              // Default, when address config is left out, is "localhost"
        port: 8080,
        ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1", "192.168.17.1", "::ffff:192.168.17.1"]
}
```

**Allowed methods**

| HTTP Request Method | Route            | Params           | Description      | 
|-------------------- |----------------- |----------------- |----------------- |
| POST                | CASH_IN          | **current** <br>amount of money we were able to save<br>**target** <br>amount that we're willing to save | Function used to update the amount of money saved |
| GET                 | WITHDRAW         | N/A | Function used to check how much money the PiggyBank has |

The file `MMM-PiggyBank.postman_collection.json` has the calls configured for POSTMAN