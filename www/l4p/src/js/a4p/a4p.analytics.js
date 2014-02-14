

/**
* @fileOverview Analytics functions
*
**/



'use strict';

//Namespace a4p
var a4p;
if (!a4p) a4p = {};


a4p.Analytics = (function() {

    var mAnalyticsLS = 'a4p.Analytics';

	function Analytics(localStorage, googleAnalyticsQueue) {

        this.googleAnalyticsQueue = googleAnalyticsQueue;
        this.localStorage = null;
		if (a4p.isDefined(localStorage) && localStorage)
			this.localStorage = localStorage;

        this.mAnalyticsArray = [];
        if (this.localStorage) {
    		this.mAnalyticsArray = this.localStorage.get(mAnalyticsLS, this.mAnalyticsArray);
        }
        this.uuid = '';
        this.isDemo = false;
        this.env = 'P';
        this.analytics = null;
        this.initDone = false;
	}

    Analytics.prototype.init = function() {
        if (this.initDone) return;

        if(a4p.isDefined(analytics)) {
            this.analytics = analytics;
            analytics.startTrackerWithId('UA-33541085-3'); // apps4pro
        }

        this.initDone = true;
        a4p.InternalLog.log('srvAnalytics', "initialized");
    };

    Analytics.prototype.setDemo = function(isDemo) {
        this.isDemo = isDemo;
    };

    Analytics.prototype.setEnv = function(env) {
        this.env = env;
    };

    Analytics.prototype.add = function(category, action, lbl, functionality, type) {
		// Add element to push only in PROD env
		if (this.env == 'P') {
    		var mode = this.isDemo ? 'Demo' : 'Free';

			//Store action and label into arr
			var params = {
                mode: mode,
                category: category,
				action : action,
				label : lbl,
                type : type
			};

			// Push arr into message queue to be stored in local storage
			this.mAnalyticsArray.push(params);
	        a4p.InternalLog.log('Analytics', 'add ' + params.category + ', ' + params.action + ', ' + params.label);

	        // If functionality is not null, check in local storage that it has not already been pushed to GA
	        // If not pushed, then add it to message queue and store event in local storage
	        if (functionality) {
	        	if (this.localStorage) {

		        	if (this.localStorage.get(mAnalyticsLS + functionality + 'Funtionality', false) == false) {
	    	        	// Store variable to not send push multiple times
		        		this.localStorage.set(mAnalyticsLS + functionality + 'Funtionality', true);

	    	        	// Send push
		        		this.add('uses ' + functionality + ' funtionality', action, lbl, null);
	    	        }
	        	}
	        }

			if (this.localStorage) {
	            this.localStorage.set(mAnalyticsLS, this.mAnalyticsArray);
	        }
		}
	};

	Analytics.prototype.run = function() {
		// Add element to push only in PROD env
		if (this.env == 'P') {
	        a4p.InternalLog.log('Analytics', 'run - pushing ' + this.mAnalyticsArray.length + ' elements');
	        if (this.uuid == '') {
	            this.uuid = (window.device) ? window.device.uuid : window.location.hostname;
	        }
			var bOK = true;

			try {
				for(var i=0; i<this.mAnalyticsArray.length; i++) {
					var param = this.mAnalyticsArray[i];
                    if(this.analytics) {
                        if(param.type == 'event') {
                            this.analytics.trackEvent(param.category, param.action, param.mode);
                        }
                        else if(param.type == 'view') {
                            this.analytics.trackView(param.category);
                        }
                    }
                    else {
                        this.googleAnalyticsQueue.push(['_trackEvent', this.uuid, param.category + ' ' + param.action, param.label]);
                    }
				}
			}
			catch(e) {
	            a4p.Error.log('Analytics', ' run pb : ' + a4p.formatError(e));
				bOK = false;
			}

			if (bOK) {
				this.mAnalyticsArray = [];
				if (this.localStorage) {
	                this.localStorage.set(mAnalyticsLS, this.mAnalyticsArray);
	            }
			}
		}

	};

    return Analytics;
})();
