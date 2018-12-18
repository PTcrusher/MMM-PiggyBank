/* 
 *
 * MMM-PiggyBank
 *
 * MIT Licensed.
 * 
 */

Module.register("MMM-PiggyBank", {
    defaults: {
            updateInterval: 60000,
            symbol: "home", // Fontawesome Symbol see http://fontawesome.io/cheatsheet/
    },

    requiresVersion: "2.1.0", // Required version of MagicMirror

    start: function() {
            var self = this;
            var dataNotification = null;

            //Flag for check if module is loaded
            this.loaded = false;

            // Schedule update timer.
            this.getData();
            setInterval(function() {
                    self.getData();
            }, this.config.updateInterval);
    },

    getData: function() {
            var self = this;
            this.sendSocketNotification("MAIN_TO_HELPER");
    },

    percentage: function(partialValue, totalValue) {
            return Math.round((100 * partialValue) / totalValue)+"%";
    },

    getDom: function() {
            var self = this;

            // create element wrapper for show into the module
            var wrapper = document.createElement("div");

            // Data from helper
            if (this.dataNotification) {
                    var wrapperDataNotification = document.createElement("div");
                    var labelDataNotification = document.createElement("label");
                    labelDataNotification.innerHTML = this.translate("SAVINGS");
                    labelDataNotification.id="title";

                    wrapperDataNotification.appendChild(labelDataNotification);

                    var flexDataNotification = document.createElement("div");
                    flexDataNotification.id="flexcontainer";
                    var spanDataNotification = document.createElement("span");
                    spanDataNotification.id="symbol";
                    spanDataNotification.classList.add("fa");
                    spanDataNotification.classList.add("fa-fw");
                    spanDataNotification.classList.add("fa-"+this.config.symbol);

                    flexDataNotification.appendChild(spanDataNotification);

                    var divProgressBarNegativeSpace = document.createElement("div");
                    divProgressBarNegativeSpace.classList.add("w3-light-grey");
                    var divProgressBarPositiveSpace = document.createElement("div");
                    divProgressBarPositiveSpace.id = "bar";
                    divProgressBarPositiveSpace.classList.add("w3-container");
                    divProgressBarPositiveSpace.classList.add("w3-green");
                    divProgressBarPositiveSpace.classList.add("w3-center");
                    divProgressBarPositiveSpace.style.width = self.percentage(this.dataNotification.current, this.dataNotification.target);
                    divProgressBarPositiveSpace.innerHTML = self.percentage(this.dataNotification.current, this.dataNotification.target);

                    divProgressBarNegativeSpace.appendChild(divProgressBarPositiveSpace);
                    flexDataNotification.appendChild(divProgressBarNegativeSpace);
                    wrapperDataNotification.appendChild(flexDataNotification);

                    wrapper.appendChild(wrapperDataNotification);
            }
            return wrapper;
    },

    getScripts: function() {
            return [];
    },

    getStyles: function () {
            return [
                    "MMM-PiggyBank.css",
                    "font-awesome.css",
            ];
    },

    // Load translations files
    getTranslations: function() {
            //FIXME: This can be load a one file javascript definition
            return {
                    en: "translations/en.json",
                    es: "translations/es.json"
            };
    },

    processData: function(data) {
            var self = this;
            if (this.loaded === false) { self.updateDom(self.config.animationSpeed) ; }
            this.loaded = true;

            // send notification to helper
            this.sendSocketNotification("MAIN_TO_HELPER");
    },

    // socketNotificationReceived from helper
    socketNotificationReceived: function (notification, payload) {
            if(notification === "HELPER_TO_MAIN") {
                    // set dataNotification
                    this.dataNotification = payload;
                    this.updateDom();
            }
    },
});
