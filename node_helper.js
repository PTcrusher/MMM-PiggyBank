/*
 * Magic Mirror
 *
 * MIT Licensed.
 *
 */

var NodeHelper = require("node_helper");
const fs = require('fs');
const {promisify} = require('util');
readFile = promisify(fs.readFile);
writeFile = promisify(fs.writeFile);
var cur={};

module.exports = NodeHelper.create({
        /* socketNotificationReceived(notification, payload)
         * This method is called when a socket notification arrives.
         *
         * argument notification string - The identifier of the noitication.
         * argument payload mixed - The payload of the notification.
         */
        socketNotificationReceived: function(notification, payload) {
                if (notification === "MAIN_TO_HELPER") {
                        this.sendNotificationTest(this.simpleRetrieve());
                }
        },

        // Example function send notification test
        sendNotificationTest: function(payload) {
                this.sendSocketNotification("HELPER_TO_MAIN", payload);
        },

        // Extra routes for the module
        extraRoutes: function() {
                var self = this;
                this.expressApp.get("/MMM-PiggyBank/WITHDRAW", function(req, res) {
                        self.withdrawCash().then((rsp) => res.status(rsp.status).send(rsp.response));
                });
                this.expressApp.post("/MMM-PiggyBank/CASH_IN", function(req, res) {
                        self.updateCash(req.query.target,req.query.current).then((rsp) => res.status(rsp.status).send(rsp.response));
                });
        },

        simpleRetrieve: function() {
                return cur;
        },

        //add money to the piggy bank
        updateCash: async function(target,current) {
                var self = this;
                try {
                        await self.checkExistance(self.fullyQualFileName());
                        var oldcontent = await readFile(self.fullyQualFileName());
                        var contentcandidate = await self.valChanges(target, current, JSON.parse(oldcontent));
                        var newcontent = await writeFile(self.fullyQualFileName(), JSON.stringify(contentcandidate));
                        cur = contentcandidate;
                        return self.buildSuccessRsp("Successfully saved!");
                }
                catch(err) {
                        return self.buildErrRsp(err);
                }
        },

        //check how much money the piggy bank has stored
        withdrawCash: async function() {
                var self = this;
                try {
                        await self.checkExistance(self.fullyQualFileName());
                        var oldcontent = await readFile(self.fullyQualFileName());
                        return self.buildSuccessRsp(JSON.parse(oldcontent));
                }
                catch(err) {
                        return self.buildErrRsp(err);
                }
        },

        onLoadHelper: async function() {
                var self = this;
                try {
                        await self.checkExistance(self.fullyQualFileName());
                        var oldcontent = await readFile(self.fullyQualFileName());
                        return JSON.parse(oldcontent);
                }
                catch(err) {
                        thrown(err);
                }
        },

        buildSuccessRsp : function(message) {
                var rsp =  {};
                rsp.success = true;
                rsp.response = message;
                console.log(rsp);
                return { "status" : "200", "response" : rsp };
        },

        buildErrRsp : function(err) {
                var rsp = {};
                rsp.success = false;
                rsp.response = err.message;
                rsp.stack = [];

                if(err.stack)
                        err.stack.replace(err.message,'').split("\n").forEach(line => {
                                rsp.stack.push(line);
                        });

                console.log(rsp);
                return { "status": "500", "response" : rsp };
        },

        /* Functions for the call chain */
        valChanges : function(target,current,oldata) {
            return new Promise((resolve,reject) => {
                var self = this;
                var data = {"target": target, "current": current};
                if(self.isValidFloat(target) && self.isValidFloat(current) && !self.jsonEqual(data,oldata))
                {
                    resolve(data);
                }
                else
                {
                    reject(new Error("Data was not changed. Nothing to do!"));
                }
            });
        },

        checkExistance : function(fqfile) {
            return new Promise((resolve,reject) => {
                    fs.exists(fqfile, (exists) => {
                        if(exists)
                        {
                            resolve(fqfile);
                        }
                        else
                        {
                            fs.writeFile(fqfile, "{ \"target\": 0.00, \"current\": 0.00 }", 'utf8', (err) => {
                                if(!err)
                                {
                                    resolve(fqfile);
                                }
                                else
                                {
                                    reject("unable to write file");
                                }
                            });
                        }
                    });
                });
        },
        /* End of Functions for the call chain */

        /*Auxiliar functions*/
        fullyQualFileName : function()
        {
                var self = this;
                return self.path+"\/data\/"+self.fileName;
        },

        jsonEqual : function(a,b) {
                return JSON.stringify(a) === JSON.stringify(b);
        },

        isValidFloat : function(number)
        {
                return (typeof number !== "undefined" && !isNaN(number) && number.toString().indexOf('.') != -1);
        },
        /*End of Auxiliar functions*/

        start: function()
        {
                var self = this;
                self.fileName = "data.json";
                //register extra routes
                self.extraRoutes();
                self.onLoadHelper().then((oldcontent) => { cur=oldcontent; console.log("target: "+cur.target+" current: "+cur.current)});
        }
});
