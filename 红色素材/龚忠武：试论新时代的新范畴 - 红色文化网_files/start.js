(function() {
    
    var modules = {};
    function isFunction(obj) {
        return Object.prototype.toString.call(obj) === "[object Function]";
    }
    function define(name, deps, factory) {
        if (modules[name]) {
            throw new Error("Module " + name + " has been defined already.");
        }
        if (isFunction(deps)) {
            factory = deps;
        }
        modules[name] = {
            factory: factory,
            inited: false,
            exports: null
        };
    }
    function run(name) {
        var module, exports, mod, ret;
        module = modules[name];
        exports = {};
        mod = {
            exports: {}
        };
        if (isFunction(module.factory)) {
            ret = module.factory.call(undefined, require, exports, mod);
            if (ret !== undefined) {
                module.exports = ret;
            } else {
                if (mod.hasOwnProperty("exports") && typeof mod.exports === "object" && mod.exports instanceof Object === true) {
                    var tag = false;
                    var k, v;
                    for (k in mod.exports) {
                        if (mod.exports.hasOwnProperty(k)) {
                            tag = true;
                        }
                    }
                    if (tag === false) {
                        module.exports = exports;
                    } else {
                        module.exports = mod.exports;
                    }
                } else {
                    module.exports = mod.exports;
                }
            }
        } else {
            throw new Error("Module " + name + " has no factory.");
        }
        module.inited = true;
    }
    function require(name) {
        var module;
        module = modules[name];
        if (!module) {
            throw new Error("Module " + name + " is not defined.");
        }
        if (module.inited === false) {
            run(name);
        }
        return module.exports;
    }
    define("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/start.js", function(require, exports, module) {
        var $ = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/jquery-1.7.0.js"), _ = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/underscore-1.8.2.js"), $$util = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/util/util.js"), $$data = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/util/data-center.js");
        require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/jquery-transit.js");
        var fnInitDom = function(feConfig, config) {
            var $SOHUCS = $("#SOHUCS");
            if (!$SOHUCS.length) {
                throw "No SOHUCS div!";
                return;
            }
            if (feConfig.ismobile !== true) {
                $SOHUCS.html('<div id="SOHU_MAIN"></div>');
                require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/changyan-reset-v3.css");
                require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/changyan-reset-v3-upage.css");
            }
        };
        var timerCount = 0;
        (function() {
            var timer = window.setInterval(function() {
                if (window.evtDispatcher && window.evtDispatcher.fireEvent) {
                    evtDispatcher.fireEvent({
                        type: "public.jsonData",
                        json: {
                            topicCount: $$data.get("topic:cmt_sum"),
                            partiCount: $$data.get("topic:participation_sum")
                        }
                    });
                    window.clearInterval(timer);
                }
                timerCount++;
                if (timerCount > 10) window.clearInterval(timer);
            }, 1e3);
        })();
        var fnStart = function(config, feConfig, beConfig, cookie) {
            fnInitDom(feConfig);
            var $$confWhiteList;
            if (feConfig.ismobile) {
                $$confWhiteList = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/config-white-list-wap.js");
            } else {
                $$confWhiteList = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/config-white-list.js");
            }
            var fnInitDataCenter = function() {
                $$data.set("config", config);
                feConfig = _.pick(feConfig, $$confWhiteList.feWhiteList);
                $$data.set("feConfig", feConfig);
                beConfig = _.pick(beConfig, $$confWhiteList.beWhiteList);
                $$data.set("beConfig", beConfig);
                $$data.set("cookie", cookie);
                if (cookie.debug_v3 === "true" && window.console && window.console.log) {
                    console.log($$data.get("/"));
                }
            };
            var fnLoad = function(fn) {
                var page_size = $$data.get("feConfig:latest_page_num") || $$data.get("beConfig:latest_page_num");
                var hot_size = $$data.get("feConfig:hot_page_num") || $$data.get("beConfig:hot_page_num");
                if (feConfig.ismobile) {
                    hot_size = $$data.get("feConfig:mobile_hot_page_num") || $$data.get("beConfig:mobile_hot_page_num");
                }
                var data = {
                    client_id: $$data.get("feConfig:appid"),
                    topic_url: $$data.get("feConfig:url"),
                    topic_title: $$data.get("feConfig:title"),
                    topic_category_id: $$data.get("feConfig:category_id"),
                    page_size: page_size,
                    hot_size: hot_size
                };
                if ($$data.get("feConfig:sid")) {
                    data.topic_source_id = $$data.get("feConfig:sid");
                }
                $.ajax({
                    url: $$data.get("config:api") + "api/3/topic/liteload",
                    dataType: "jsonp",
                    scriptCharset: "utf-8",
                    cache: false,
                    timeout: 3e4,
                    data: data,
                    success: function(data) {
                        data = $$util.UrlSwitchHttps(data);
                        $$data.set("topic", data);
                        fn && fn();
                    }
                });
            };
            fnInitDataCenter();
            require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/api.js");
            if (feConfig.ismobile) {
                require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/hack-wap.js");
            } else {
                require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/hack.js");
            }
            fnLoad(function() {
                if (feConfig.ismobile) {
                    $$util.loadJs($$data.get("config:base") + "mdevp/extensions/mobile-icp-tips/018/mobile-icp-tips.js", function() {
                        if (window.changyan.icp !== "break") {
                            require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/extensions.js");
                        }
                        var $$log = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/log.js");
                        $$log.log("access");
                    });
                } else {
                    $$util.loadJs($$data.get("config:base") + "mdevp/extensions/icp-tips/017/icp-tips.js", function() {
                        if (window.changyan.icp !== "break") {
                            require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/extensions.js");
                        }
                        var $$log = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/log.js");
                        $$log.log("access");
                    });
                }
            });
        };
        module.exports = fnStart;
    });
    define("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/jquery-1.7.0.js", function(require, exports, module) {
        (function(window, undefined) {
            var document = window.document, navigator = window.navigator, location = window.location;
            var jQuery = function() {
                var jQuery = function(selector, context) {
                    return new jQuery.fn.init(selector, context, rootjQuery);
                }, _jQuery = window.jQuery, _$ = window.$, rootjQuery, quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/, rnotwhite = /\S/, trimLeft = /^\s+/, trimRight = /\s+$/, rdigit = /\d/, rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/, rvalidchars = /^[\],:{}\s]*$/, rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g, rwebkit = /(webkit)[ \/]([\w.]+)/, ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/, rmsie = /(msie) ([\w.]+)/, rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/, rdashAlpha = /-([a-z]|[0-9])/ig, rmsPrefix = /^-ms-/, fcamelCase = function(all, letter) {
                    return (letter + "").toUpperCase();
                }, userAgent = navigator.userAgent, browserMatch, readyList, DOMContentLoaded, toString = Object.prototype.toString, hasOwn = Object.prototype.hasOwnProperty, push = Array.prototype.push, slice = Array.prototype.slice, trim = String.prototype.trim, indexOf = Array.prototype.indexOf, class2type = {};
                jQuery.fn = jQuery.prototype = {
                    constructor: jQuery,
                    init: function(selector, context, rootjQuery) {
                        var match, elem, ret, doc;
                        if (!selector) {
                            return this;
                        }
                        if (selector.nodeType) {
                            this.context = this[0] = selector;
                            this.length = 1;
                            return this;
                        }
                        if (selector === "body" && !context && document.body) {
                            this.context = document;
                            this[0] = document.body;
                            this.selector = selector;
                            this.length = 1;
                            return this;
                        }
                        if (typeof selector === "string") {
                            if (selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3) {
                                match = [ null, selector, null ];
                            } else {
                                match = quickExpr.exec(selector);
                            }
                            if (match && (match[1] || !context)) {
                                if (match[1]) {
                                    context = context instanceof jQuery ? context[0] : context;
                                    doc = context ? context.ownerDocument || context : document;
                                    ret = rsingleTag.exec(selector);
                                    if (ret) {
                                        if (jQuery.isPlainObject(context)) {
                                            selector = [ document.createElement(ret[1]) ];
                                            jQuery.fn.attr.call(selector, context, true);
                                        } else {
                                            selector = [ doc.createElement(ret[1]) ];
                                        }
                                    } else {
                                        ret = jQuery.buildFragment([ match[1] ], [ doc ]);
                                        selector = (ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment).childNodes;
                                    }
                                    return jQuery.merge(this, selector);
                                } else {
                                    elem = document.getElementById(match[2]);
                                    if (elem && elem.parentNode) {
                                        if (elem.id !== match[2]) {
                                            return rootjQuery.find(selector);
                                        }
                                        this.length = 1;
                                        this[0] = elem;
                                    }
                                    this.context = document;
                                    this.selector = selector;
                                    return this;
                                }
                            } else if (!context || context.jquery) {
                                return (context || rootjQuery).find(selector);
                            } else {
                                return this.constructor(context).find(selector);
                            }
                        } else if (jQuery.isFunction(selector)) {
                            return rootjQuery.ready(selector);
                        }
                        if (selector.selector !== undefined) {
                            this.selector = selector.selector;
                            this.context = selector.context;
                        }
                        return jQuery.makeArray(selector, this);
                    },
                    selector: "",
                    jquery: "1.7",
                    length: 0,
                    size: function() {
                        return this.length;
                    },
                    toArray: function() {
                        return slice.call(this, 0);
                    },
                    get: function(num) {
                        return num == null ? this.toArray() : num < 0 ? this[this.length + num] : this[num];
                    },
                    pushStack: function(elems, name, selector) {
                        var ret = this.constructor();
                        if (jQuery.isArray(elems)) {
                            push.apply(ret, elems);
                        } else {
                            jQuery.merge(ret, elems);
                        }
                        ret.prevObject = this;
                        ret.context = this.context;
                        if (name === "find") {
                            ret.selector = this.selector + (this.selector ? " " : "") + selector;
                        } else if (name) {
                            ret.selector = this.selector + "." + name + "(" + selector + ")";
                        }
                        return ret;
                    },
                    each: function(callback, args) {
                        return jQuery.each(this, callback, args);
                    },
                    ready: function(fn) {
                        jQuery.bindReady();
                        readyList.add(fn);
                        return this;
                    },
                    eq: function(i) {
                        return i === -1 ? this.slice(i) : this.slice(i, +i + 1);
                    },
                    first: function() {
                        return this.eq(0);
                    },
                    last: function() {
                        return this.eq(-1);
                    },
                    slice: function() {
                        return this.pushStack(slice.apply(this, arguments), "slice", slice.call(arguments).join(","));
                    },
                    map: function(callback) {
                        return this.pushStack(jQuery.map(this, function(elem, i) {
                            return callback.call(elem, i, elem);
                        }));
                    },
                    end: function() {
                        return this.prevObject || this.constructor(null);
                    },
                    push: push,
                    sort: [].sort,
                    splice: [].splice
                };
                jQuery.fn.init.prototype = jQuery.fn;
                jQuery.extend = jQuery.fn.extend = function() {
                    var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;
                    if (typeof target === "boolean") {
                        deep = target;
                        target = arguments[1] || {};
                        i = 2;
                    }
                    if (typeof target !== "object" && !jQuery.isFunction(target)) {
                        target = {};
                    }
                    if (length === i) {
                        target = this;
                        --i;
                    }
                    for (; i < length; i++) {
                        if ((options = arguments[i]) != null) {
                            for (name in options) {
                                src = target[name];
                                copy = options[name];
                                if (target === copy) {
                                    continue;
                                }
                                if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
                                    if (copyIsArray) {
                                        copyIsArray = false;
                                        clone = src && jQuery.isArray(src) ? src : [];
                                    } else {
                                        clone = src && jQuery.isPlainObject(src) ? src : {};
                                    }
                                    target[name] = jQuery.extend(deep, clone, copy);
                                } else if (copy !== undefined) {
                                    target[name] = copy;
                                }
                            }
                        }
                    }
                    return target;
                };
                jQuery.extend({
                    noConflict: function(deep) {
                        if (window.$ === jQuery) {
                            window.$ = _$;
                        }
                        if (deep && window.jQuery === jQuery) {
                            window.jQuery = _jQuery;
                        }
                        return jQuery;
                    },
                    isReady: false,
                    readyWait: 1,
                    holdReady: function(hold) {
                        if (hold) {
                            jQuery.readyWait++;
                        } else {
                            jQuery.ready(true);
                        }
                    },
                    ready: function(wait) {
                        if (wait === true && !--jQuery.readyWait || wait !== true && !jQuery.isReady) {
                            if (!document.body) {
                                return setTimeout(jQuery.ready, 1);
                            }
                            jQuery.isReady = true;
                            if (wait !== true && --jQuery.readyWait > 0) {
                                return;
                            }
                            readyList.fireWith(document, [ jQuery ]);
                            if (jQuery.fn.trigger) {
                                jQuery(document).trigger("ready").unbind("ready");
                            }
                        }
                    },
                    bindReady: function() {
                        if (readyList) {
                            return;
                        }
                        readyList = jQuery.Callbacks("once memory");
                        if (document.readyState === "complete") {
                            return setTimeout(jQuery.ready, 1);
                        }
                        if (document.addEventListener) {
                            document.addEventListener("DOMContentLoaded", DOMContentLoaded, false);
                            window.addEventListener("load", jQuery.ready, false);
                        } else if (document.attachEvent) {
                            document.attachEvent("onreadystatechange", DOMContentLoaded);
                            window.attachEvent("onload", jQuery.ready);
                            var toplevel = false;
                            try {
                                toplevel = window.frameElement == null;
                            } catch (e) {}
                            if (document.documentElement.doScroll && toplevel) {
                                doScrollCheck();
                            }
                        }
                    },
                    isFunction: function(obj) {
                        return jQuery.type(obj) === "function";
                    },
                    isArray: Array.isArray || function(obj) {
                        return jQuery.type(obj) === "array";
                    },
                    isWindow: function(obj) {
                        return obj && typeof obj === "object" && "setInterval" in obj;
                    },
                    isNumeric: function(obj) {
                        return obj != null && rdigit.test(obj) && !isNaN(obj);
                    },
                    type: function(obj) {
                        return obj == null ? String(obj) : class2type[toString.call(obj)] || "object";
                    },
                    isPlainObject: function(obj) {
                        if (!obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow(obj)) {
                            return false;
                        }
                        try {
                            if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                                return false;
                            }
                        } catch (e) {
                            return false;
                        }
                        var key;
                        for (key in obj) {}
                        return key === undefined || hasOwn.call(obj, key);
                    },
                    isEmptyObject: function(obj) {
                        for (var name in obj) {
                            return false;
                        }
                        return true;
                    },
                    error: function(msg) {
                        throw msg;
                    },
                    parseJSON: function(data) {
                        if (typeof data !== "string" || !data) {
                            return null;
                        }
                        data = jQuery.trim(data);
                        if (window.JSON && window.JSON.parse) {
                            return window.JSON.parse(data);
                        }
                        if (rvalidchars.test(data.replace(rvalidescape, "@").replace(rvalidtokens, "]").replace(rvalidbraces, ""))) {
                            return (new Function("return " + data))();
                        }
                        jQuery.error("Invalid JSON: " + data);
                    },
                    parseXML: function(data) {
                        var xml, tmp;
                        try {
                            if (window.DOMParser) {
                                tmp = new DOMParser;
                                xml = tmp.parseFromString(data, "text/xml");
                            } else {
                                xml = new ActiveXObject("Microsoft.XMLDOM");
                                xml.async = "false";
                                xml.loadXML(data);
                            }
                        } catch (e) {
                            xml = undefined;
                        }
                        if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
                            jQuery.error("Invalid XML: " + data);
                        }
                        return xml;
                    },
                    noop: function() {},
                    globalEval: function(data) {
                        if (data && rnotwhite.test(data)) {
                            (window.execScript || function(data) {
                                window["eval"].call(window, data);
                            })(data);
                        }
                    },
                    camelCase: function(string) {
                        return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
                    },
                    nodeName: function(elem, name) {
                        return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
                    },
                    each: function(object, callback, args) {
                        var name, i = 0, length = object.length, isObj = length === undefined || jQuery.isFunction(object);
                        if (args) {
                            if (isObj) {
                                for (name in object) {
                                    if (callback.apply(object[name], args) === false) {
                                        break;
                                    }
                                }
                            } else {
                                for (; i < length; ) {
                                    if (callback.apply(object[i++], args) === false) {
                                        break;
                                    }
                                }
                            }
                        } else {
                            if (isObj) {
                                for (name in object) {
                                    if (callback.call(object[name], name, object[name]) === false) {
                                        break;
                                    }
                                }
                            } else {
                                for (; i < length; ) {
                                    if (callback.call(object[i], i, object[i++]) === false) {
                                        break;
                                    }
                                }
                            }
                        }
                        return object;
                    },
                    trim: trim ? function(text) {
                        return text == null ? "" : trim.call(text);
                    } : function(text) {
                        return text == null ? "" : text.toString().replace(trimLeft, "").replace(trimRight, "");
                    },
                    makeArray: function(array, results) {
                        var ret = results || [];
                        if (array != null) {
                            var type = jQuery.type(array);
                            if (array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow(array)) {
                                push.call(ret, array);
                            } else {
                                jQuery.merge(ret, array);
                            }
                        }
                        return ret;
                    },
                    inArray: function(elem, array, i) {
                        var len;
                        if (array) {
                            if (indexOf) {
                                return indexOf.call(array, elem, i);
                            }
                            len = array.length;
                            i = i ? i < 0 ? Math.max(0, len + i) : i : 0;
                            for (; i < len; i++) {
                                if (i in array && array[i] === elem) {
                                    return i;
                                }
                            }
                        }
                        return -1;
                    },
                    merge: function(first, second) {
                        var i = first.length, j = 0;
                        if (typeof second.length === "number") {
                            for (var l = second.length; j < l; j++) {
                                first[i++] = second[j];
                            }
                        } else {
                            while (second[j] !== undefined) {
                                first[i++] = second[j++];
                            }
                        }
                        first.length = i;
                        return first;
                    },
                    grep: function(elems, callback, inv) {
                        var ret = [], retVal;
                        inv = !!inv;
                        for (var i = 0, length = elems.length; i < length; i++) {
                            retVal = !!callback(elems[i], i);
                            if (inv !== retVal) {
                                ret.push(elems[i]);
                            }
                        }
                        return ret;
                    },
                    map: function(elems, callback, arg) {
                        var value, key, ret = [], i = 0, length = elems.length, isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && (length > 0 && elems[0] && elems[length - 1] || length === 0 || jQuery.isArray(elems));
                        if (isArray) {
                            for (; i < length; i++) {
                                value = callback(elems[i], i, arg);
                                if (value != null) {
                                    ret[ret.length] = value;
                                }
                            }
                        } else {
                            for (key in elems) {
                                value = callback(elems[key], key, arg);
                                if (value != null) {
                                    ret[ret.length] = value;
                                }
                            }
                        }
                        return ret.concat.apply([], ret);
                    },
                    guid: 1,
                    proxy: function(fn, context) {
                        if (typeof context === "string") {
                            var tmp = fn[context];
                            context = fn;
                            fn = tmp;
                        }
                        if (!jQuery.isFunction(fn)) {
                            return undefined;
                        }
                        var args = slice.call(arguments, 2), proxy = function() {
                            return fn.apply(context, args.concat(slice.call(arguments)));
                        };
                        proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;
                        return proxy;
                    },
                    access: function(elems, key, value, exec, fn, pass) {
                        var length = elems.length;
                        if (typeof key === "object") {
                            for (var k in key) {
                                jQuery.access(elems, k, key[k], exec, fn, value);
                            }
                            return elems;
                        }
                        if (value !== undefined) {
                            exec = !pass && exec && jQuery.isFunction(value);
                            for (var i = 0; i < length; i++) {
                                fn(elems[i], key, exec ? value.call(elems[i], i, fn(elems[i], key)) : value, pass);
                            }
                            return elems;
                        }
                        return length ? fn(elems[0], key) : undefined;
                    },
                    now: function() {
                        return (new Date).getTime();
                    },
                    uaMatch: function(ua) {
                        ua = ua.toLowerCase();
                        var match = rwebkit.exec(ua) || ropera.exec(ua) || rmsie.exec(ua) || ua.indexOf("compatible") < 0 && rmozilla.exec(ua) || [];
                        return {
                            browser: match[1] || "",
                            version: match[2] || "0"
                        };
                    },
                    sub: function() {
                        function jQuerySub(selector, context) {
                            return new jQuerySub.fn.init(selector, context);
                        }
                        jQuery.extend(true, jQuerySub, this);
                        jQuerySub.superclass = this;
                        jQuerySub.fn = jQuerySub.prototype = this();
                        jQuerySub.fn.constructor = jQuerySub;
                        jQuerySub.sub = this.sub;
                        jQuerySub.fn.init = function init(selector, context) {
                            if (context && context instanceof jQuery && !(context instanceof jQuerySub)) {
                                context = jQuerySub(context);
                            }
                            return jQuery.fn.init.call(this, selector, context, rootjQuerySub);
                        };
                        jQuerySub.fn.init.prototype = jQuerySub.fn;
                        var rootjQuerySub = jQuerySub(document);
                        return jQuerySub;
                    },
                    browser: {}
                });
                jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
                    class2type["[object " + name + "]"] = name.toLowerCase();
                });
                browserMatch = jQuery.uaMatch(userAgent);
                if (browserMatch.browser) {
                    jQuery.browser[browserMatch.browser] = true;
                    jQuery.browser.version = browserMatch.version;
                }
                if (jQuery.browser.webkit) {
                    jQuery.browser.safari = true;
                }
                if (rnotwhite.test(" ")) {
                    trimLeft = /^[\s\xA0]+/;
                    trimRight = /[\s\xA0]+$/;
                }
                rootjQuery = jQuery(document);
                if (document.addEventListener) {
                    DOMContentLoaded = function() {
                        document.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);
                        jQuery.ready();
                    };
                } else if (document.attachEvent) {
                    DOMContentLoaded = function() {
                        if (document.readyState === "complete") {
                            document.detachEvent("onreadystatechange", DOMContentLoaded);
                            jQuery.ready();
                        }
                    };
                }
                function doScrollCheck() {
                    if (jQuery.isReady) {
                        return;
                    }
                    try {
                        document.documentElement.doScroll("left");
                    } catch (e) {
                        setTimeout(doScrollCheck, 1);
                        return;
                    }
                    jQuery.ready();
                }
                if (typeof define === "function" && define.amd && define.amd.jQuery) {
                    define("jquery", [], function() {
                        return jQuery;
                    });
                }
                return jQuery;
            }();
            var flagsCache = {};
            function createFlags(flags) {
                var object = flagsCache[flags] = {}, i, length;
                flags = flags.split(/\s+/);
                for (i = 0, length = flags.length; i < length; i++) {
                    object[flags[i]] = true;
                }
                return object;
            }
            jQuery.Callbacks = function(flags) {
                flags = flags ? flagsCache[flags] || createFlags(flags) : {};
                var list = [], stack = [], memory, firing, firingStart, firingLength, firingIndex, add = function(args) {
                    var i, length, elem, type, actual;
                    for (i = 0, length = args.length; i < length; i++) {
                        elem = args[i];
                        type = jQuery.type(elem);
                        if (type === "array") {
                            add(elem);
                        } else if (type === "function") {
                            if (!flags.unique || !self.has(elem)) {
                                list.push(elem);
                            }
                        }
                    }
                }, fire = function(context, args) {
                    args = args || [];
                    memory = !flags.memory || [ context, args ];
                    firing = true;
                    firingIndex = firingStart || 0;
                    firingStart = 0;
                    firingLength = list.length;
                    for (; list && firingIndex < firingLength; firingIndex++) {
                        if (list[firingIndex].apply(context, args) === false && flags.stopOnFalse) {
                            memory = true;
                            break;
                        }
                    }
                    firing = false;
                    if (list) {
                        if (!flags.once) {
                            if (stack && stack.length) {
                                memory = stack.shift();
                                self.fireWith(memory[0], memory[1]);
                            }
                        } else if (memory === true) {
                            self.disable();
                        } else {
                            list = [];
                        }
                    }
                }, self = {
                    add: function() {
                        if (list) {
                            var length = list.length;
                            add(arguments);
                            if (firing) {
                                firingLength = list.length;
                            } else if (memory && memory !== true) {
                                firingStart = length;
                                fire(memory[0], memory[1]);
                            }
                        }
                        return this;
                    },
                    remove: function() {
                        if (list) {
                            var args = arguments, argIndex = 0, argLength = args.length;
                            for (; argIndex < argLength; argIndex++) {
                                for (var i = 0; i < list.length; i++) {
                                    if (args[argIndex] === list[i]) {
                                        if (firing) {
                                            if (i <= firingLength) {
                                                firingLength--;
                                                if (i <= firingIndex) {
                                                    firingIndex--;
                                                }
                                            }
                                        }
                                        list.splice(i--, 1);
                                        if (flags.unique) {
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        return this;
                    },
                    has: function(fn) {
                        if (list) {
                            var i = 0, length = list.length;
                            for (; i < length; i++) {
                                if (fn === list[i]) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    },
                    empty: function() {
                        list = [];
                        return this;
                    },
                    disable: function() {
                        list = stack = memory = undefined;
                        return this;
                    },
                    disabled: function() {
                        return !list;
                    },
                    lock: function() {
                        stack = undefined;
                        if (!memory || memory === true) {
                            self.disable();
                        }
                        return this;
                    },
                    locked: function() {
                        return !stack;
                    },
                    fireWith: function(context, args) {
                        if (stack) {
                            if (firing) {
                                if (!flags.once) {
                                    stack.push([ context, args ]);
                                }
                            } else if (!(flags.once && memory)) {
                                fire(context, args);
                            }
                        }
                        return this;
                    },
                    fire: function() {
                        self.fireWith(this, arguments);
                        return this;
                    },
                    fired: function() {
                        return !!memory;
                    }
                };
                return self;
            };
            var sliceDeferred = [].slice;
            jQuery.extend({
                Deferred: function(func) {
                    var doneList = jQuery.Callbacks("once memory"), failList = jQuery.Callbacks("once memory"), progressList = jQuery.Callbacks("memory"), state = "pending", lists = {
                        resolve: doneList,
                        reject: failList,
                        notify: progressList
                    }, promise = {
                        done: doneList.add,
                        fail: failList.add,
                        progress: progressList.add,
                        state: function() {
                            return state;
                        },
                        isResolved: doneList.fired,
                        isRejected: failList.fired,
                        then: function(doneCallbacks, failCallbacks, progressCallbacks) {
                            deferred.done(doneCallbacks).fail(failCallbacks).progress(progressCallbacks);
                            return this;
                        },
                        always: function() {
                            return deferred.done.apply(deferred, arguments).fail.apply(deferred, arguments);
                        },
                        pipe: function(fnDone, fnFail, fnProgress) {
                            return jQuery.Deferred(function(newDefer) {
                                jQuery.each({
                                    done: [ fnDone, "resolve" ],
                                    fail: [ fnFail, "reject" ],
                                    progress: [ fnProgress, "notify" ]
                                }, function(handler, data) {
                                    var fn = data[0], action = data[1], returned;
                                    if (jQuery.isFunction(fn)) {
                                        deferred[handler](function() {
                                            returned = fn.apply(this, arguments);
                                            if (returned && jQuery.isFunction(returned.promise)) {
                                                returned.promise().then(newDefer.resolve, newDefer.reject, newDefer.notify);
                                            } else {
                                                newDefer[action + "With"](this === deferred ? newDefer : this, [ returned ]);
                                            }
                                        });
                                    } else {
                                        deferred[handler](newDefer[action]);
                                    }
                                });
                            }).promise();
                        },
                        promise: function(obj) {
                            if (obj == null) {
                                obj = promise;
                            } else {
                                for (var key in promise) {
                                    obj[key] = promise[key];
                                }
                            }
                            return obj;
                        }
                    }, deferred = promise.promise({}), key;
                    for (key in lists) {
                        deferred[key] = lists[key].fire;
                        deferred[key + "With"] = lists[key].fireWith;
                    }
                    deferred.done(function() {
                        state = "resolved";
                    }, failList.disable, progressList.lock).fail(function() {
                        state = "rejected";
                    }, doneList.disable, progressList.lock);
                    if (func) {
                        func.call(deferred, deferred);
                    }
                    return deferred;
                },
                when: function(firstParam) {
                    var args = sliceDeferred.call(arguments, 0), i = 0, length = args.length, pValues = new Array(length), count = length, pCount = length, deferred = length <= 1 && firstParam && jQuery.isFunction(firstParam.promise) ? firstParam : jQuery.Deferred(), promise = deferred.promise();
                    function resolveFunc(i) {
                        return function(value) {
                            args[i] = arguments.length > 1 ? sliceDeferred.call(arguments, 0) : value;
                            if (!--count) {
                                deferred.resolveWith(deferred, args);
                            }
                        };
                    }
                    function progressFunc(i) {
                        return function(value) {
                            pValues[i] = arguments.length > 1 ? sliceDeferred.call(arguments, 0) : value;
                            deferred.notifyWith(promise, pValues);
                        };
                    }
                    if (length > 1) {
                        for (; i < length; i++) {
                            if (args[i] && args[i].promise && jQuery.isFunction(args[i].promise)) {
                                args[i].promise().then(resolveFunc(i), deferred.reject, progressFunc(i));
                            } else {
                                --count;
                            }
                        }
                        if (!count) {
                            deferred.resolveWith(deferred, args);
                        }
                    } else if (deferred !== firstParam) {
                        deferred.resolveWith(deferred, length ? [ firstParam ] : []);
                    }
                    return promise;
                }
            });
            jQuery.support = function() {
                var div = document.createElement("div"), documentElement = document.documentElement, all, a, select, opt, input, marginDiv, support, fragment, body, testElementParent, testElement, testElementStyle, tds, events, eventName, i, isSupported;
                div.setAttribute("className", "t");
                div.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/><nav></nav>";
                all = div.getElementsByTagName("*");
                a = div.getElementsByTagName("a")[0];
                if (!all || !all.length || !a) {
                    return {};
                }
                select = document.createElement("select");
                opt = select.appendChild(document.createElement("option"));
                input = div.getElementsByTagName("input")[0];
                support = {
                    leadingWhitespace: div.firstChild.nodeType === 3,
                    tbody: !div.getElementsByTagName("tbody").length,
                    htmlSerialize: !!div.getElementsByTagName("link").length,
                    style: /top/.test(a.getAttribute("style")),
                    hrefNormalized: a.getAttribute("href") === "/a",
                    opacity: /^0.55/.test(a.style.opacity),
                    cssFloat: !!a.style.cssFloat,
                    unknownElems: !!div.getElementsByTagName("nav").length,
                    checkOn: input.value === "on",
                    optSelected: opt.selected,
                    getSetAttribute: div.className !== "t",
                    enctype: !!document.createElement("form").enctype,
                    submitBubbles: true,
                    changeBubbles: true,
                    focusinBubbles: false,
                    deleteExpando: true,
                    noCloneEvent: true,
                    inlineBlockNeedsLayout: false,
                    shrinkWrapBlocks: false,
                    reliableMarginRight: true
                };
                input.checked = true;
                support.noCloneChecked = input.cloneNode(true).checked;
                select.disabled = true;
                support.optDisabled = !opt.disabled;
                try {
                    delete div.test;
                } catch (e) {
                    support.deleteExpando = false;
                }
                if (!div.addEventListener && div.attachEvent && div.fireEvent) {
                    div.attachEvent("onclick", function() {
                        support.noCloneEvent = false;
                    });
                    div.cloneNode(true).fireEvent("onclick");
                }
                input = document.createElement("input");
                input.value = "t";
                input.setAttribute("type", "radio");
                support.radioValue = input.value === "t";
                input.setAttribute("checked", "checked");
                div.appendChild(input);
                fragment = document.createDocumentFragment();
                fragment.appendChild(div.lastChild);
                support.checkClone = fragment.cloneNode(true).cloneNode(true).lastChild.checked;
                div.innerHTML = "";
                div.style.width = div.style.paddingLeft = "1px";
                body = document.getElementsByTagName("body")[0];
                testElement = document.createElement(body ? "div" : "body");
                testElementStyle = {
                    visibility: "hidden",
                    width: 0,
                    height: 0,
                    border: 0,
                    margin: 0,
                    background: "none"
                };
                if (body) {
                    jQuery.extend(testElementStyle, {
                        position: "absolute",
                        left: "-999px",
                        top: "-999px"
                    });
                }
                for (i in testElementStyle) {
                    testElement.style[i] = testElementStyle[i];
                }
                testElement.appendChild(div);
                testElementParent = body || documentElement;
                testElementParent.insertBefore(testElement, testElementParent.firstChild);
                support.appendChecked = input.checked;
                support.boxModel = div.offsetWidth === 2;
                if ("zoom" in div.style) {
                    div.style.display = "inline";
                    div.style.zoom = 1;
                    support.inlineBlockNeedsLayout = div.offsetWidth === 2;
                    div.style.display = "";
                    div.innerHTML = "<div style='width:4px;'></div>";
                    support.shrinkWrapBlocks = div.offsetWidth !== 2;
                }
                div.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
                tds = div.getElementsByTagName("td");
                isSupported = tds[0].offsetHeight === 0;
                tds[0].style.display = "";
                tds[1].style.display = "none";
                support.reliableHiddenOffsets = isSupported && tds[0].offsetHeight === 0;
                div.innerHTML = "";
                if (document.defaultView && document.defaultView.getComputedStyle) {
                    marginDiv = document.createElement("div");
                    marginDiv.style.width = "0";
                    marginDiv.style.marginRight = "0";
                    div.appendChild(marginDiv);
                    support.reliableMarginRight = (parseInt((document.defaultView.getComputedStyle(marginDiv, null) || {
                        marginRight: 0
                    }).marginRight, 10) || 0) === 0;
                }
                if (div.attachEvent) {
                    for (i in {
                        submit: 1,
                        change: 1,
                        focusin: 1
                    }) {
                        eventName = "on" + i;
                        isSupported = eventName in div;
                        if (!isSupported) {
                            div.setAttribute(eventName, "return;");
                            isSupported = typeof div[eventName] === "function";
                        }
                        support[i + "Bubbles"] = isSupported;
                    }
                }
                jQuery(function() {
                    var container, outer, inner, table, td, offsetSupport, conMarginTop = 1, ptlm = "position:absolute;top:0;left:0;width:1px;height:1px;margin:0;", vb = "visibility:hidden;border:0;", style = "style='" + ptlm + "border:5px solid #000;padding:0;'", html = "<div " + style + "><div></div></div>" + "<table " + style + " cellpadding='0' cellspacing='0'>" + "<tr><td></td></tr></table>";
                    body = document.getElementsByTagName("body")[0];
                    if (!body) {
                        return;
                    }
                    container = document.createElement("div");
                    container.style.cssText = vb + "width:0;height:0;position:static;top:0;margin-top:" + conMarginTop + "px";
                    body.insertBefore(container, body.firstChild);
                    testElement = document.createElement("div");
                    testElement.style.cssText = ptlm + vb;
                    testElement.innerHTML = html;
                    container.appendChild(testElement);
                    outer = testElement.firstChild;
                    inner = outer.firstChild;
                    td = outer.nextSibling.firstChild.firstChild;
                    offsetSupport = {
                        doesNotAddBorder: inner.offsetTop !== 5,
                        doesAddBorderForTableAndCells: td.offsetTop === 5
                    };
                    inner.style.position = "fixed";
                    inner.style.top = "20px";
                    offsetSupport.fixedPosition = inner.offsetTop === 20 || inner.offsetTop === 15;
                    inner.style.position = inner.style.top = "";
                    outer.style.overflow = "hidden";
                    outer.style.position = "relative";
                    offsetSupport.subtractsBorderForOverflowNotVisible = inner.offsetTop === -5;
                    offsetSupport.doesNotIncludeMarginInBodyOffset = body.offsetTop !== conMarginTop;
                    body.removeChild(container);
                    testElement = container = null;
                    jQuery.extend(support, offsetSupport);
                });
                if (testElement) {
                    testElement.innerHTML = "";
                    testElementParent.removeChild(testElement);
                }
                testElement = fragment = select = opt = body = marginDiv = div = input = null;
                return support;
            }();
            jQuery.boxModel = jQuery.support.boxModel;
            var rbrace = /^(?:\{.*\}|\[.*\])$/, rmultiDash = /([A-Z])/g;
            jQuery.extend({
                cache: {},
                uuid: 0,
                expando: "jQuery" + (jQuery.fn.jquery + Math.random()).replace(/\D/g, ""),
                noData: {
                    embed: true,
                    object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
                    applet: true
                },
                hasData: function(elem) {
                    elem = elem.nodeType ? jQuery.cache[elem[jQuery.expando]] : elem[jQuery.expando];
                    return !!elem && !isEmptyDataObject(elem);
                },
                data: function(elem, name, data, pvt) {
                    if (!jQuery.acceptData(elem)) {
                        return;
                    }
                    var privateCache, thisCache, ret, internalKey = jQuery.expando, getByName = typeof name === "string", isNode = elem.nodeType, cache = isNode ? jQuery.cache : elem, id = isNode ? elem[jQuery.expando] : elem[jQuery.expando] && jQuery.expando, isEvents = name === "events";
                    if ((!id || !cache[id] || !isEvents && !pvt && !cache[id].data) && getByName && data === undefined) {
                        return;
                    }
                    if (!id) {
                        if (isNode) {
                            elem[jQuery.expando] = id = ++jQuery.uuid;
                        } else {
                            id = jQuery.expando;
                        }
                    }
                    if (!cache[id]) {
                        cache[id] = {};
                        if (!isNode) {
                            cache[id].toJSON = jQuery.noop;
                        }
                    }
                    if (typeof name === "object" || typeof name === "function") {
                        if (pvt) {
                            cache[id] = jQuery.extend(cache[id], name);
                        } else {
                            cache[id].data = jQuery.extend(cache[id].data, name);
                        }
                    }
                    privateCache = thisCache = cache[id];
                    if (!pvt) {
                        if (!thisCache.data) {
                            thisCache.data = {};
                        }
                        thisCache = thisCache.data;
                    }
                    if (data !== undefined) {
                        thisCache[jQuery.camelCase(name)] = data;
                    }
                    if (isEvents && !thisCache[name]) {
                        return privateCache.events;
                    }
                    if (getByName) {
                        ret = thisCache[name];
                        if (ret == null) {
                            ret = thisCache[jQuery.camelCase(name)];
                        }
                    } else {
                        ret = thisCache;
                    }
                    return ret;
                },
                removeData: function(elem, name, pvt) {
                    if (!jQuery.acceptData(elem)) {
                        return;
                    }
                    var thisCache, i, l, internalKey = jQuery.expando, isNode = elem.nodeType, cache = isNode ? jQuery.cache : elem, id = isNode ? elem[jQuery.expando] : jQuery.expando;
                    if (!cache[id]) {
                        return;
                    }
                    if (name) {
                        thisCache = pvt ? cache[id] : cache[id].data;
                        if (thisCache) {
                            if (jQuery.isArray(name)) {
                                name = name;
                            } else if (name in thisCache) {
                                name = [ name ];
                            } else {
                                name = jQuery.camelCase(name);
                                if (name in thisCache) {
                                    name = [ name ];
                                } else {
                                    name = name.split(" ");
                                }
                            }
                            for (i = 0, l = name.length; i < l; i++) {
                                delete thisCache[name[i]];
                            }
                            if (!(pvt ? isEmptyDataObject : jQuery.isEmptyObject)(thisCache)) {
                                return;
                            }
                        }
                    }
                    if (!pvt) {
                        delete cache[id].data;
                        if (!isEmptyDataObject(cache[id])) {
                            return;
                        }
                    }
                    if (jQuery.support.deleteExpando || !cache.setInterval) {
                        delete cache[id];
                    } else {
                        cache[id] = null;
                    }
                    if (isNode) {
                        if (jQuery.support.deleteExpando) {
                            delete elem[jQuery.expando];
                        } else if (elem.removeAttribute) {
                            elem.removeAttribute(jQuery.expando);
                        } else {
                            elem[jQuery.expando] = null;
                        }
                    }
                },
                _data: function(elem, name, data) {
                    return jQuery.data(elem, name, data, true);
                },
                acceptData: function(elem) {
                    if (elem.nodeName) {
                        var match = jQuery.noData[elem.nodeName.toLowerCase()];
                        if (match) {
                            return !(match === true || elem.getAttribute("classid") !== match);
                        }
                    }
                    return true;
                }
            });
            jQuery.fn.extend({
                data: function(key, value) {
                    var parts, attr, name, data = null;
                    if (typeof key === "undefined") {
                        if (this.length) {
                            data = jQuery.data(this[0]);
                            if (this[0].nodeType === 1 && !jQuery._data(this[0], "parsedAttrs")) {
                                attr = this[0].attributes;
                                for (var i = 0, l = attr.length; i < l; i++) {
                                    name = attr[i].name;
                                    if (name.indexOf("data-") === 0) {
                                        name = jQuery.camelCase(name.substring(5));
                                        dataAttr(this[0], name, data[name]);
                                    }
                                }
                                jQuery._data(this[0], "parsedAttrs", true);
                            }
                        }
                        return data;
                    } else if (typeof key === "object") {
                        return this.each(function() {
                            jQuery.data(this, key);
                        });
                    }
                    parts = key.split(".");
                    parts[1] = parts[1] ? "." + parts[1] : "";
                    if (value === undefined) {
                        data = this.triggerHandler("getData" + parts[1] + "!", [ parts[0] ]);
                        if (data === undefined && this.length) {
                            data = jQuery.data(this[0], key);
                            data = dataAttr(this[0], key, data);
                        }
                        return data === undefined && parts[1] ? this.data(parts[0]) : data;
                    } else {
                        return this.each(function() {
                            var $this = jQuery(this), args = [ parts[0], value ];
                            $this.triggerHandler("setData" + parts[1] + "!", args);
                            jQuery.data(this, key, value);
                            $this.triggerHandler("changeData" + parts[1] + "!", args);
                        });
                    }
                },
                removeData: function(key) {
                    return this.each(function() {
                        jQuery.removeData(this, key);
                    });
                }
            });
            function dataAttr(elem, key, data) {
                if (data === undefined && elem.nodeType === 1) {
                    var name = "data-" + key.replace(rmultiDash, "-$1").toLowerCase();
                    data = elem.getAttribute(name);
                    if (typeof data === "string") {
                        try {
                            data = data === "true" ? true : data === "false" ? false : data === "null" ? null : jQuery.isNumeric(data) ? parseFloat(data) : rbrace.test(data) ? jQuery.parseJSON(data) : data;
                        } catch (e) {}
                        jQuery.data(elem, key, data);
                    } else {
                        data = undefined;
                    }
                }
                return data;
            }
            function isEmptyDataObject(obj) {
                for (var name in obj) {
                    if (name === "data" && jQuery.isEmptyObject(obj[name])) {
                        continue;
                    }
                    if (name !== "toJSON") {
                        return false;
                    }
                }
                return true;
            }
            function handleQueueMarkDefer(elem, type, src) {
                var deferDataKey = type + "defer", queueDataKey = type + "queue", markDataKey = type + "mark", defer = jQuery._data(elem, deferDataKey);
                if (defer && (src === "queue" || !jQuery._data(elem, queueDataKey)) && (src === "mark" || !jQuery._data(elem, markDataKey))) {
                    setTimeout(function() {
                        if (!jQuery._data(elem, queueDataKey) && !jQuery._data(elem, markDataKey)) {
                            jQuery.removeData(elem, deferDataKey, true);
                            defer.fire();
                        }
                    }, 0);
                }
            }
            jQuery.extend({
                _mark: function(elem, type) {
                    if (elem) {
                        type = (type || "fx") + "mark";
                        jQuery._data(elem, type, (jQuery._data(elem, type) || 0) + 1);
                    }
                },
                _unmark: function(force, elem, type) {
                    if (force !== true) {
                        type = elem;
                        elem = force;
                        force = false;
                    }
                    if (elem) {
                        type = type || "fx";
                        var key = type + "mark", count = force ? 0 : (jQuery._data(elem, key) || 1) - 1;
                        if (count) {
                            jQuery._data(elem, key, count);
                        } else {
                            jQuery.removeData(elem, key, true);
                            handleQueueMarkDefer(elem, type, "mark");
                        }
                    }
                },
                queue: function(elem, type, data) {
                    var q;
                    if (elem) {
                        type = (type || "fx") + "queue";
                        q = jQuery._data(elem, type);
                        if (data) {
                            if (!q || jQuery.isArray(data)) {
                                q = jQuery._data(elem, type, jQuery.makeArray(data));
                            } else {
                                q.push(data);
                            }
                        }
                        return q || [];
                    }
                },
                dequeue: function(elem, type) {
                    type = type || "fx";
                    var queue = jQuery.queue(elem, type), fn = queue.shift(), hooks = {};
                    if (fn === "inprogress") {
                        fn = queue.shift();
                    }
                    if (fn) {
                        if (type === "fx") {
                            queue.unshift("inprogress");
                        }
                        jQuery._data(elem, type + ".run", hooks);
                        fn.call(elem, function() {
                            jQuery.dequeue(elem, type);
                        }, hooks);
                    }
                    if (!queue.length) {
                        jQuery.removeData(elem, type + "queue " + type + ".run", true);
                        handleQueueMarkDefer(elem, type, "queue");
                    }
                }
            });
            jQuery.fn.extend({
                queue: function(type, data) {
                    if (typeof type !== "string") {
                        data = type;
                        type = "fx";
                    }
                    if (data === undefined) {
                        return jQuery.queue(this[0], type);
                    }
                    return this.each(function() {
                        var queue = jQuery.queue(this, type, data);
                        if (type === "fx" && queue[0] !== "inprogress") {
                            jQuery.dequeue(this, type);
                        }
                    });
                },
                dequeue: function(type) {
                    return this.each(function() {
                        jQuery.dequeue(this, type);
                    });
                },
                delay: function(time, type) {
                    time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
                    type = type || "fx";
                    return this.queue(type, function(next, hooks) {
                        var timeout = setTimeout(next, time);
                        hooks.stop = function() {
                            clearTimeout(timeout);
                        };
                    });
                },
                clearQueue: function(type) {
                    return this.queue(type || "fx", []);
                },
                promise: function(type, object) {
                    if (typeof type !== "string") {
                        object = type;
                        type = undefined;
                    }
                    type = type || "fx";
                    var defer = jQuery.Deferred(), elements = this, i = elements.length, count = 1, deferDataKey = type + "defer", queueDataKey = type + "queue", markDataKey = type + "mark", tmp;
                    function resolve() {
                        if (!--count) {
                            defer.resolveWith(elements, [ elements ]);
                        }
                    }
                    while (i--) {
                        if (tmp = jQuery.data(elements[i], deferDataKey, undefined, true) || (jQuery.data(elements[i], queueDataKey, undefined, true) || jQuery.data(elements[i], markDataKey, undefined, true)) && jQuery.data(elements[i], deferDataKey, jQuery.Callbacks("once memory"), true)) {
                            count++;
                            tmp.add(resolve);
                        }
                    }
                    resolve();
                    return defer.promise();
                }
            });
            var rclass = /[\n\t\r]/g, rspace = /\s+/, rreturn = /\r/g, rtype = /^(?:button|input)$/i, rfocusable = /^(?:button|input|object|select|textarea)$/i, rclickable = /^a(?:rea)?$/i, rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i, getSetAttribute = jQuery.support.getSetAttribute, nodeHook, boolHook, fixSpecified;
            jQuery.fn.extend({
                attr: function(name, value) {
                    return jQuery.access(this, name, value, true, jQuery.attr);
                },
                removeAttr: function(name) {
                    return this.each(function() {
                        jQuery.removeAttr(this, name);
                    });
                },
                prop: function(name, value) {
                    return jQuery.access(this, name, value, true, jQuery.prop);
                },
                removeProp: function(name) {
                    name = jQuery.propFix[name] || name;
                    return this.each(function() {
                        try {
                            this[name] = undefined;
                            delete this[name];
                        } catch (e) {}
                    });
                },
                addClass: function(value) {
                    var classNames, i, l, elem, setClass, c, cl;
                    if (jQuery.isFunction(value)) {
                        return this.each(function(j) {
                            jQuery(this).addClass(value.call(this, j, this.className));
                        });
                    }
                    if (value && typeof value === "string") {
                        classNames = value.split(rspace);
                        for (i = 0, l = this.length; i < l; i++) {
                            elem = this[i];
                            if (elem.nodeType === 1) {
                                if (!elem.className && classNames.length === 1) {
                                    elem.className = value;
                                } else {
                                    setClass = " " + elem.className + " ";
                                    for (c = 0, cl = classNames.length; c < cl; c++) {
                                        if (!~setClass.indexOf(" " + classNames[c] + " ")) {
                                            setClass += classNames[c] + " ";
                                        }
                                    }
                                    elem.className = jQuery.trim(setClass);
                                }
                            }
                        }
                    }
                    return this;
                },
                removeClass: function(value) {
                    var classNames, i, l, elem, className, c, cl;
                    if (jQuery.isFunction(value)) {
                        return this.each(function(j) {
                            jQuery(this).removeClass(value.call(this, j, this.className));
                        });
                    }
                    if (value && typeof value === "string" || value === undefined) {
                        classNames = (value || "").split(rspace);
                        for (i = 0, l = this.length; i < l; i++) {
                            elem = this[i];
                            if (elem.nodeType === 1 && elem.className) {
                                if (value) {
                                    className = (" " + elem.className + " ").replace(rclass, " ");
                                    for (c = 0, cl = classNames.length; c < cl; c++) {
                                        className = className.replace(" " + classNames[c] + " ", " ");
                                    }
                                    elem.className = jQuery.trim(className);
                                } else {
                                    elem.className = "";
                                }
                            }
                        }
                    }
                    return this;
                },
                toggleClass: function(value, stateVal) {
                    var type = typeof value, isBool = typeof stateVal === "boolean";
                    if (jQuery.isFunction(value)) {
                        return this.each(function(i) {
                            jQuery(this).toggleClass(value.call(this, i, this.className, stateVal), stateVal);
                        });
                    }
                    return this.each(function() {
                        if (type === "string") {
                            var className, i = 0, self = jQuery(this), state = stateVal, classNames = value.split(rspace);
                            while (className = classNames[i++]) {
                                state = isBool ? state : !self.hasClass(className);
                                self[state ? "addClass" : "removeClass"](className);
                            }
                        } else if (type === "undefined" || type === "boolean") {
                            if (this.className) {
                                jQuery._data(this, "__className__", this.className);
                            }
                            this.className = this.className || value === false ? "" : jQuery._data(this, "__className__") || "";
                        }
                    });
                },
                hasClass: function(selector) {
                    var className = " " + selector + " ", i = 0, l = this.length;
                    for (; i < l; i++) {
                        if (this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf(className) > -1) {
                            return true;
                        }
                    }
                    return false;
                },
                val: function(value) {
                    var hooks, ret, isFunction, elem = this[0];
                    if (!arguments.length) {
                        if (elem) {
                            hooks = jQuery.valHooks[elem.nodeName.toLowerCase()] || jQuery.valHooks[elem.type];
                            if (hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== undefined) {
                                return ret;
                            }
                            ret = elem.value;
                            return typeof ret === "string" ? ret.replace(rreturn, "") : ret == null ? "" : ret;
                        }
                        return undefined;
                    }
                    isFunction = jQuery.isFunction(value);
                    return this.each(function(i) {
                        var self = jQuery(this), val;
                        if (this.nodeType !== 1) {
                            return;
                        }
                        if (isFunction) {
                            val = value.call(this, i, self.val());
                        } else {
                            val = value;
                        }
                        if (val == null) {
                            val = "";
                        } else if (typeof val === "number") {
                            val += "";
                        } else if (jQuery.isArray(val)) {
                            val = jQuery.map(val, function(value) {
                                return value == null ? "" : value + "";
                            });
                        }
                        hooks = jQuery.valHooks[this.nodeName.toLowerCase()] || jQuery.valHooks[this.type];
                        if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === undefined) {
                            this.value = val;
                        }
                    });
                }
            });
            jQuery.extend({
                valHooks: {
                    option: {
                        get: function(elem) {
                            var val = elem.attributes.value;
                            return !val || val.specified ? elem.value : elem.text;
                        }
                    },
                    select: {
                        get: function(elem) {
                            var value, i, max, option, index = elem.selectedIndex, values = [], options = elem.options, one = elem.type === "select-one";
                            if (index < 0) {
                                return null;
                            }
                            i = one ? index : 0;
                            max = one ? index + 1 : options.length;
                            for (; i < max; i++) {
                                option = options[i];
                                if (option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) && (!option.parentNode.disabled || !jQuery.nodeName(option.parentNode, "optgroup"))) {
                                    value = jQuery(option).val();
                                    if (one) {
                                        return value;
                                    }
                                    values.push(value);
                                }
                            }
                            if (one && !values.length && options.length) {
                                return jQuery(options[index]).val();
                            }
                            return values;
                        },
                        set: function(elem, value) {
                            var values = jQuery.makeArray(value);
                            jQuery(elem).find("option").each(function() {
                                this.selected = jQuery.inArray(jQuery(this).val(), values) >= 0;
                            });
                            if (!values.length) {
                                elem.selectedIndex = -1;
                            }
                            return values;
                        }
                    }
                },
                attrFn: {
                    val: true,
                    css: true,
                    html: true,
                    text: true,
                    data: true,
                    width: true,
                    height: true,
                    offset: true
                },
                attr: function(elem, name, value, pass) {
                    var ret, hooks, notxml, nType = elem.nodeType;
                    if (!elem || nType === 3 || nType === 8 || nType === 2) {
                        return undefined;
                    }
                    if (pass && name in jQuery.attrFn) {
                        return jQuery(elem)[name](value);
                    }
                    if (!("getAttribute" in elem)) {
                        return jQuery.prop(elem, name, value);
                    }
                    notxml = nType !== 1 || !jQuery.isXMLDoc(elem);
                    if (notxml) {
                        name = name.toLowerCase();
                        hooks = jQuery.attrHooks[name] || (rboolean.test(name) ? boolHook : nodeHook);
                    }
                    if (value !== undefined) {
                        if (value === null) {
                            jQuery.removeAttr(elem, name);
                            return undefined;
                        } else if (hooks && "set" in hooks && notxml && (ret = hooks.set(elem, value, name)) !== undefined) {
                            return ret;
                        } else {
                            elem.setAttribute(name, "" + value);
                            return value;
                        }
                    } else if (hooks && "get" in hooks && notxml && (ret = hooks.get(elem, name)) !== null) {
                        return ret;
                    } else {
                        ret = elem.getAttribute(name);
                        return ret === null ? undefined : ret;
                    }
                },
                removeAttr: function(elem, value) {
                    var propName, attrNames, name, l, i = 0;
                    if (elem.nodeType === 1) {
                        attrNames = (value || "").split(rspace);
                        l = attrNames.length;
                        for (; i < l; i++) {
                            name = attrNames[i].toLowerCase();
                            propName = jQuery.propFix[name] || name;
                            jQuery.attr(elem, name, "");
                            elem.removeAttribute(getSetAttribute ? name : propName);
                            if (rboolean.test(name) && propName in elem) {
                                elem[propName] = false;
                            }
                        }
                    }
                },
                attrHooks: {
                    type: {
                        set: function(elem, value) {
                            if (rtype.test(elem.nodeName) && elem.parentNode) {
                                jQuery.error("type property can't be changed");
                            } else if (!jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input")) {
                                var val = elem.value;
                                elem.setAttribute("type", value);
                                if (val) {
                                    elem.value = val;
                                }
                                return value;
                            }
                        }
                    },
                    value: {
                        get: function(elem, name) {
                            if (nodeHook && jQuery.nodeName(elem, "button")) {
                                return nodeHook.get(elem, name);
                            }
                            return name in elem ? elem.value : null;
                        },
                        set: function(elem, value, name) {
                            if (nodeHook && jQuery.nodeName(elem, "button")) {
                                return nodeHook.set(elem, value, name);
                            }
                            elem.value = value;
                        }
                    }
                },
                propFix: {
                    tabindex: "tabIndex",
                    readonly: "readOnly",
                    "for": "htmlFor",
                    "class": "className",
                    maxlength: "maxLength",
                    cellspacing: "cellSpacing",
                    cellpadding: "cellPadding",
                    rowspan: "rowSpan",
                    colspan: "colSpan",
                    usemap: "useMap",
                    frameborder: "frameBorder",
                    contenteditable: "contentEditable"
                },
                prop: function(elem, name, value) {
                    var ret, hooks, notxml, nType = elem.nodeType;
                    if (!elem || nType === 3 || nType === 8 || nType === 2) {
                        return undefined;
                    }
                    notxml = nType !== 1 || !jQuery.isXMLDoc(elem);
                    if (notxml) {
                        name = jQuery.propFix[name] || name;
                        hooks = jQuery.propHooks[name];
                    }
                    if (value !== undefined) {
                        if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined) {
                            return ret;
                        } else {
                            return elem[name] = value;
                        }
                    } else {
                        if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
                            return ret;
                        } else {
                            return elem[name];
                        }
                    }
                },
                propHooks: {
                    tabIndex: {
                        get: function(elem) {
                            var attributeNode = elem.getAttributeNode("tabindex");
                            return attributeNode && attributeNode.specified ? parseInt(attributeNode.value, 10) : rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href ? 0 : undefined;
                        }
                    }
                }
            });
            jQuery.attrHooks.tabindex = jQuery.propHooks.tabIndex;
            boolHook = {
                get: function(elem, name) {
                    var attrNode, property = jQuery.prop(elem, name);
                    return property === true || typeof property !== "boolean" && (attrNode = elem.getAttributeNode(name)) && attrNode.nodeValue !== false ? name.toLowerCase() : undefined;
                },
                set: function(elem, value, name) {
                    var propName;
                    if (value === false) {
                        jQuery.removeAttr(elem, name);
                    } else {
                        propName = jQuery.propFix[name] || name;
                        if (propName in elem) {
                            elem[propName] = true;
                        }
                        elem.setAttribute(name, name.toLowerCase());
                    }
                    return name;
                }
            };
            if (!getSetAttribute) {
                fixSpecified = {
                    name: true,
                    id: true
                };
                nodeHook = jQuery.valHooks.button = {
                    get: function(elem, name) {
                        var ret;
                        ret = elem.getAttributeNode(name);
                        return ret && (fixSpecified[name] ? ret.nodeValue !== "" : ret.specified) ? ret.nodeValue : undefined;
                    },
                    set: function(elem, value, name) {
                        var ret = elem.getAttributeNode(name);
                        if (!ret) {
                            ret = document.createAttribute(name);
                            elem.setAttributeNode(ret);
                        }
                        return ret.nodeValue = value + "";
                    }
                };
                jQuery.attrHooks.tabindex.set = nodeHook.set;
                jQuery.each([ "width", "height" ], function(i, name) {
                    jQuery.attrHooks[name] = jQuery.extend(jQuery.attrHooks[name], {
                        set: function(elem, value) {
                            if (value === "") {
                                elem.setAttribute(name, "auto");
                                return value;
                            }
                        }
                    });
                });
                jQuery.attrHooks.contenteditable = {
                    get: nodeHook.get,
                    set: function(elem, value, name) {
                        if (value === "") {
                            value = "false";
                        }
                        nodeHook.set(elem, value, name);
                    }
                };
            }
            if (!jQuery.support.hrefNormalized) {
                jQuery.each([ "href", "src", "width", "height" ], function(i, name) {
                    jQuery.attrHooks[name] = jQuery.extend(jQuery.attrHooks[name], {
                        get: function(elem) {
                            var ret = elem.getAttribute(name, 2);
                            return ret === null ? undefined : ret;
                        }
                    });
                });
            }
            if (!jQuery.support.style) {
                jQuery.attrHooks.style = {
                    get: function(elem) {
                        return elem.style.cssText.toLowerCase() || undefined;
                    },
                    set: function(elem, value) {
                        return elem.style.cssText = "" + value;
                    }
                };
            }
            if (!jQuery.support.optSelected) {
                jQuery.propHooks.selected = jQuery.extend(jQuery.propHooks.selected, {
                    get: function(elem) {
                        var parent = elem.parentNode;
                        if (parent) {
                            parent.selectedIndex;
                            if (parent.parentNode) {
                                parent.parentNode.selectedIndex;
                            }
                        }
                        return null;
                    }
                });
            }
            if (!jQuery.support.enctype) {
                jQuery.propFix.enctype = "encoding";
            }
            if (!jQuery.support.checkOn) {
                jQuery.each([ "radio", "checkbox" ], function() {
                    jQuery.valHooks[this] = {
                        get: function(elem) {
                            return elem.getAttribute("value") === null ? "on" : elem.value;
                        }
                    };
                });
            }
            jQuery.each([ "radio", "checkbox" ], function() {
                jQuery.valHooks[this] = jQuery.extend(jQuery.valHooks[this], {
                    set: function(elem, value) {
                        if (jQuery.isArray(value)) {
                            return elem.checked = jQuery.inArray(jQuery(elem).val(), value) >= 0;
                        }
                    }
                });
            });
            var rnamespaces = /\.(.*)$/, rformElems = /^(?:textarea|input|select)$/i, rperiod = /\./g, rspaces = / /g, rescape = /[^\w\s.|`]/g, rtypenamespace = /^([^\.]*)?(?:\.(.+))?$/, rhoverHack = /\bhover(\.\S+)?/, rkeyEvent = /^key/, rmouseEvent = /^(?:mouse|contextmenu)|click/, rquickIs = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/, quickParse = function(selector) {
                var quick = rquickIs.exec(selector);
                if (quick) {
                    quick[1] = (quick[1] || "").toLowerCase();
                    quick[3] = quick[3] && new RegExp("(?:^|\\s)" + quick[3] + "(?:\\s|$)");
                }
                return quick;
            }, quickIs = function(elem, m) {
                return (!m[1] || elem.nodeName.toLowerCase() === m[1]) && (!m[2] || elem.id === m[2]) && (!m[3] || m[3].test(elem.className));
            }, hoverHack = function(events) {
                return jQuery.event.special.hover ? events : events.replace(rhoverHack, "mouseenter$1 mouseleave$1");
            };
            jQuery.event = {
                add: function(elem, types, handler, data, selector) {
                    var elemData, eventHandle, events, t, tns, type, namespaces, handleObj, handleObjIn, quick, handlers, special;
                    if (elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data(elem))) {
                        return;
                    }
                    if (handler.handler) {
                        handleObjIn = handler;
                        handler = handleObjIn.handler;
                    }
                    if (!handler.guid) {
                        handler.guid = jQuery.guid++;
                    }
                    events = elemData.events;
                    if (!events) {
                        elemData.events = events = {};
                    }
                    eventHandle = elemData.handle;
                    if (!eventHandle) {
                        elemData.handle = eventHandle = function(e) {
                            return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ? jQuery.event.dispatch.apply(eventHandle.elem, arguments) : undefined;
                        };
                        eventHandle.elem = elem;
                    }
                    types = hoverHack(types).split(" ");
                    for (t = 0; t < types.length; t++) {
                        tns = rtypenamespace.exec(types[t]) || [];
                        type = tns[1];
                        namespaces = (tns[2] || "").split(".").sort();
                        special = jQuery.event.special[type] || {};
                        type = (selector ? special.delegateType : special.bindType) || type;
                        special = jQuery.event.special[type] || {};
                        handleObj = jQuery.extend({
                            type: type,
                            origType: tns[1],
                            data: data,
                            handler: handler,
                            guid: handler.guid,
                            selector: selector,
                            namespace: namespaces.join(".")
                        }, handleObjIn);
                        if (selector) {
                            handleObj.quick = quickParse(selector);
                            if (!handleObj.quick && jQuery.expr.match.POS.test(selector)) {
                                handleObj.isPositional = true;
                            }
                        }
                        handlers = events[type];
                        if (!handlers) {
                            handlers = events[type] = [];
                            handlers.delegateCount = 0;
                            if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false) {
                                if (elem.addEventListener) {
                                    elem.addEventListener(type, eventHandle, false);
                                } else if (elem.attachEvent) {
                                    elem.attachEvent("on" + type, eventHandle);
                                }
                            }
                        }
                        if (special.add) {
                            special.add.call(elem, handleObj);
                            if (!handleObj.handler.guid) {
                                handleObj.handler.guid = handler.guid;
                            }
                        }
                        if (selector) {
                            handlers.splice(handlers.delegateCount++, 0, handleObj);
                        } else {
                            handlers.push(handleObj);
                        }
                        jQuery.event.global[type] = true;
                    }
                    elem = null;
                },
                global: {},
                remove: function(elem, types, handler, selector) {
                    var elemData = jQuery.hasData(elem) && jQuery._data(elem), t, tns, type, namespaces, origCount, j, events, special, handle, eventType, handleObj;
                    if (!elemData || !(events = elemData.events)) {
                        return;
                    }
                    types = hoverHack(types || "").split(" ");
                    for (t = 0; t < types.length; t++) {
                        tns = rtypenamespace.exec(types[t]) || [];
                        type = tns[1];
                        namespaces = tns[2];
                        if (!type) {
                            namespaces = namespaces ? "." + namespaces : "";
                            for (j in events) {
                                jQuery.event.remove(elem, j + namespaces, handler, selector);
                            }
                            return;
                        }
                        special = jQuery.event.special[type] || {};
                        type = (selector ? special.delegateType : special.bindType) || type;
                        eventType = events[type] || [];
                        origCount = eventType.length;
                        namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
                        if (handler || namespaces || selector || special.remove) {
                            for (j = 0; j < eventType.length; j++) {
                                handleObj = eventType[j];
                                if (!handler || handler.guid === handleObj.guid) {
                                    if (!namespaces || namespaces.test(handleObj.namespace)) {
                                        if (!selector || selector === handleObj.selector || selector === "**" && handleObj.selector) {
                                            eventType.splice(j--, 1);
                                            if (handleObj.selector) {
                                                eventType.delegateCount--;
                                            }
                                            if (special.remove) {
                                                special.remove.call(elem, handleObj);
                                            }
                                        }
                                    }
                                }
                            }
                        } else {
                            eventType.length = 0;
                        }
                        if (eventType.length === 0 && origCount !== eventType.length) {
                            if (!special.teardown || special.teardown.call(elem, namespaces) === false) {
                                jQuery.removeEvent(elem, type, elemData.handle);
                            }
                            delete events[type];
                        }
                    }
                    if (jQuery.isEmptyObject(events)) {
                        handle = elemData.handle;
                        if (handle) {
                            handle.elem = null;
                        }
                        jQuery.removeData(elem, [ "events", "handle" ], true);
                    }
                },
                customEvent: {
                    getData: true,
                    setData: true,
                    changeData: true
                },
                trigger: function(event, data, elem, onlyHandlers) {
                    if (elem && (elem.nodeType === 3 || elem.nodeType === 8)) {
                        return;
                    }
                    var type = event.type || event, namespaces = [], cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType;
                    if (type.indexOf("!") >= 0) {
                        type = type.slice(0, -1);
                        exclusive = true;
                    }
                    if (type.indexOf(".") >= 0) {
                        namespaces = type.split(".");
                        type = namespaces.shift();
                        namespaces.sort();
                    }
                    if ((!elem || jQuery.event.customEvent[type]) && !jQuery.event.global[type]) {
                        return;
                    }
                    event = typeof event === "object" ? event[jQuery.expando] ? event : new jQuery.Event(type, event) : new jQuery.Event(type);
                    event.type = type;
                    event.isTrigger = true;
                    event.exclusive = exclusive;
                    event.namespace = namespaces.join(".");
                    event.namespace_re = event.namespace ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
                    ontype = type.indexOf(":") < 0 ? "on" + type : "";
                    if (onlyHandlers || !elem) {
                        event.preventDefault();
                    }
                    if (!elem) {
                        cache = jQuery.cache;
                        for (i in cache) {
                            if (cache[i].events && cache[i].events[type]) {
                                jQuery.event.trigger(event, data, cache[i].handle.elem, true);
                            }
                        }
                        return;
                    }
                    event.result = undefined;
                    if (!event.target) {
                        event.target = elem;
                    }
                    data = data != null ? jQuery.makeArray(data) : [];
                    data.unshift(event);
                    special = jQuery.event.special[type] || {};
                    if (special.trigger && special.trigger.apply(elem, data) === false) {
                        return;
                    }
                    eventPath = [ [ elem, special.bindType || type ] ];
                    if (!onlyHandlers && !special.noBubble && !jQuery.isWindow(elem)) {
                        bubbleType = special.delegateType || type;
                        old = null;
                        for (cur = elem.parentNode; cur; cur = cur.parentNode) {
                            eventPath.push([ cur, bubbleType ]);
                            old = cur;
                        }
                        if (old && old === elem.ownerDocument) {
                            eventPath.push([ old.defaultView || old.parentWindow || window, bubbleType ]);
                        }
                    }
                    for (i = 0; i < eventPath.length; i++) {
                        cur = eventPath[i][0];
                        event.type = eventPath[i][1];
                        handle = (jQuery._data(cur, "events") || {})[event.type] && jQuery._data(cur, "handle");
                        if (handle) {
                            handle.apply(cur, data);
                        }
                        handle = ontype && cur[ontype];
                        if (handle && jQuery.acceptData(cur)) {
                            handle.apply(cur, data);
                        }
                        if (event.isPropagationStopped()) {
                            break;
                        }
                    }
                    event.type = type;
                    if (!event.isDefaultPrevented()) {
                        if ((!special._default || special._default.apply(elem.ownerDocument, data) === false) && !(type === "click" && jQuery.nodeName(elem, "a")) && jQuery.acceptData(elem)) {
                            if (ontype && elem[type] && (type !== "focus" && type !== "blur" || event.target.offsetWidth !== 0) && !jQuery.isWindow(elem)) {
                                old = elem[ontype];
                                if (old) {
                                    elem[ontype] = null;
                                }
                                jQuery.event.triggered = type;
                                elem[type]();
                                jQuery.event.triggered = undefined;
                                if (old) {
                                    elem[ontype] = old;
                                }
                            }
                        }
                    }
                    return event.result;
                },
                dispatch: function(event) {
                    event = jQuery.event.fix(event || window.event);
                    var handlers = (jQuery._data(this, "events") || {})[event.type] || [], delegateCount = handlers.delegateCount, args = [].slice.call(arguments, 0), run_all = !event.exclusive && !event.namespace, specialHandle = (jQuery.event.special[event.type] || {}).handle, handlerQueue = [], i, j, cur, ret, selMatch, matched, matches, handleObj, sel, hit, related;
                    args[0] = event;
                    event.delegateTarget = this;
                    if (delegateCount && !event.target.disabled && !(event.button && event.type === "click")) {
                        for (cur = event.target; cur != this; cur = cur.parentNode || this) {
                            selMatch = {};
                            matches = [];
                            for (i = 0; i < delegateCount; i++) {
                                handleObj = handlers[i];
                                sel = handleObj.selector;
                                hit = selMatch[sel];
                                if (handleObj.isPositional) {
                                    hit = (hit || (selMatch[sel] = jQuery(sel))).index(cur) >= 0;
                                } else if (hit === undefined) {
                                    hit = selMatch[sel] = handleObj.quick ? quickIs(cur, handleObj.quick) : jQuery(cur).is(sel);
                                }
                                if (hit) {
                                    matches.push(handleObj);
                                }
                            }
                            if (matches.length) {
                                handlerQueue.push({
                                    elem: cur,
                                    matches: matches
                                });
                            }
                        }
                    }
                    if (handlers.length > delegateCount) {
                        handlerQueue.push({
                            elem: this,
                            matches: handlers.slice(delegateCount)
                        });
                    }
                    for (i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++) {
                        matched = handlerQueue[i];
                        event.currentTarget = matched.elem;
                        for (j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++) {
                            handleObj = matched.matches[j];
                            if (run_all || !event.namespace && !handleObj.namespace || event.namespace_re && event.namespace_re.test(handleObj.namespace)) {
                                event.data = handleObj.data;
                                event.handleObj = handleObj;
                                ret = (specialHandle || handleObj.handler).apply(matched.elem, args);
                                if (ret !== undefined) {
                                    event.result = ret;
                                    if (ret === false) {
                                        event.preventDefault();
                                        event.stopPropagation();
                                    }
                                }
                            }
                        }
                    }
                    return event.result;
                },
                props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
                fixHooks: {},
                keyHooks: {
                    props: "char charCode key keyCode".split(" "),
                    filter: function(event, original) {
                        if (event.which == null) {
                            event.which = original.charCode != null ? original.charCode : original.keyCode;
                        }
                        return event;
                    }
                },
                mouseHooks: {
                    props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement wheelDelta".split(" "),
                    filter: function(event, original) {
                        var eventDoc, doc, body, button = original.button, fromElement = original.fromElement;
                        if (event.pageX == null && original.clientX != null) {
                            eventDoc = event.target.ownerDocument || document;
                            doc = eventDoc.documentElement;
                            body = eventDoc.body;
                            event.pageX = original.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
                            event.pageY = original.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
                        }
                        if (!event.relatedTarget && fromElement) {
                            event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
                        }
                        if (!event.which && button !== undefined) {
                            event.which = button & 1 ? 1 : button & 2 ? 3 : button & 4 ? 2 : 0;
                        }
                        return event;
                    }
                },
                fix: function(event) {
                    if (event[jQuery.expando]) {
                        return event;
                    }
                    var i, prop, originalEvent = event, fixHook = jQuery.event.fixHooks[event.type] || {}, copy = fixHook.props ? this.props.concat(fixHook.props) : this.props;
                    event = jQuery.Event(originalEvent);
                    for (i = copy.length; i; ) {
                        prop = copy[--i];
                        event[prop] = originalEvent[prop];
                    }
                    if (!event.target) {
                        event.target = originalEvent.srcElement || document;
                    }
                    if (event.target.nodeType === 3) {
                        event.target = event.target.parentNode;
                    }
                    if (event.metaKey === undefined) {
                        event.metaKey = event.ctrlKey;
                    }
                    return fixHook.filter ? fixHook.filter(event, originalEvent) : event;
                },
                special: {
                    ready: {
                        setup: jQuery.bindReady
                    },
                    focus: {
                        delegateType: "focusin",
                        noBubble: true
                    },
                    blur: {
                        delegateType: "focusout",
                        noBubble: true
                    },
                    beforeunload: {
                        setup: function(data, namespaces, eventHandle) {
                            if (jQuery.isWindow(this)) {
                                this.onbeforeunload = eventHandle;
                            }
                        },
                        teardown: function(namespaces, eventHandle) {
                            if (this.onbeforeunload === eventHandle) {
                                this.onbeforeunload = null;
                            }
                        }
                    }
                },
                simulate: function(type, elem, event, bubble) {
                    var e = jQuery.extend(new jQuery.Event, event, {
                        type: type,
                        isSimulated: true,
                        originalEvent: {}
                    });
                    if (bubble) {
                        jQuery.event.trigger(e, null, elem);
                    } else {
                        jQuery.event.dispatch.call(elem, e);
                    }
                    if (e.isDefaultPrevented()) {
                        event.preventDefault();
                    }
                }
            };
            jQuery.event.handle = jQuery.event.dispatch;
            jQuery.removeEvent = document.removeEventListener ? function(elem, type, handle) {
                if (elem.removeEventListener) {
                    elem.removeEventListener(type, handle, false);
                }
            } : function(elem, type, handle) {
                if (elem.detachEvent) {
                    elem.detachEvent("on" + type, handle);
                }
            };
            jQuery.Event = function(src, props) {
                if (!(this instanceof jQuery.Event)) {
                    return new jQuery.Event(src, props);
                }
                if (src && src.type) {
                    this.originalEvent = src;
                    this.type = src.type;
                    this.isDefaultPrevented = src.defaultPrevented || src.returnValue === false || src.getPreventDefault && src.getPreventDefault() ? returnTrue : returnFalse;
                } else {
                    this.type = src;
                }
                if (props) {
                    jQuery.extend(this, props);
                }
                this.timeStamp = src && src.timeStamp || jQuery.now();
                this[jQuery.expando] = true;
            };
            function returnFalse() {
                return false;
            }
            function returnTrue() {
                return true;
            }
            jQuery.Event.prototype = {
                preventDefault: function() {
                    this.isDefaultPrevented = returnTrue;
                    var e = this.originalEvent;
                    if (!e) {
                        return;
                    }
                    if (e.preventDefault) {
                        e.preventDefault();
                    } else {
                        e.returnValue = false;
                    }
                },
                stopPropagation: function() {
                    this.isPropagationStopped = returnTrue;
                    var e = this.originalEvent;
                    if (!e) {
                        return;
                    }
                    if (e.stopPropagation) {
                        e.stopPropagation();
                    }
                    e.cancelBubble = true;
                },
                stopImmediatePropagation: function() {
                    this.isImmediatePropagationStopped = returnTrue;
                    this.stopPropagation();
                },
                isDefaultPrevented: returnFalse,
                isPropagationStopped: returnFalse,
                isImmediatePropagationStopped: returnFalse
            };
            jQuery.each({
                mouseenter: "mouseover",
                mouseleave: "mouseout"
            }, function(orig, fix) {
                jQuery.event.special[orig] = jQuery.event.special[fix] = {
                    delegateType: fix,
                    bindType: fix,
                    handle: function(event) {
                        var target = this, related = event.relatedTarget, handleObj = event.handleObj, selector = handleObj.selector, oldType, ret;
                        if (!related || handleObj.origType === event.type || related !== target && !jQuery.contains(target, related)) {
                            oldType = event.type;
                            event.type = handleObj.origType;
                            ret = handleObj.handler.apply(this, arguments);
                            event.type = oldType;
                        }
                        return ret;
                    }
                };
            });
            if (!jQuery.support.submitBubbles) {
                jQuery.event.special.submit = {
                    setup: function() {
                        if (jQuery.nodeName(this, "form")) {
                            return false;
                        }
                        jQuery.event.add(this, "click._submit keypress._submit", function(e) {
                            var elem = e.target, form = jQuery.nodeName(elem, "input") || jQuery.nodeName(elem, "button") ? elem.form : undefined;
                            if (form && !form._submit_attached) {
                                jQuery.event.add(form, "submit._submit", function(event) {
                                    if (this.parentNode) {
                                        jQuery.event.simulate("submit", this.parentNode, event, true);
                                    }
                                });
                                form._submit_attached = true;
                            }
                        });
                    },
                    teardown: function() {
                        if (jQuery.nodeName(this, "form")) {
                            return false;
                        }
                        jQuery.event.remove(this, "._submit");
                    }
                };
            }
            if (!jQuery.support.changeBubbles) {
                jQuery.event.special.change = {
                    setup: function() {
                        if (rformElems.test(this.nodeName)) {
                            if (this.type === "checkbox" || this.type === "radio") {
                                jQuery.event.add(this, "propertychange._change", function(event) {
                                    if (event.originalEvent.propertyName === "checked") {
                                        this._just_changed = true;
                                    }
                                });
                                jQuery.event.add(this, "click._change", function(event) {
                                    if (this._just_changed) {
                                        this._just_changed = false;
                                        jQuery.event.simulate("change", this, event, true);
                                    }
                                });
                            }
                            return false;
                        }
                        jQuery.event.add(this, "beforeactivate._change", function(e) {
                            var elem = e.target;
                            if (rformElems.test(elem.nodeName) && !elem._change_attached) {
                                jQuery.event.add(elem, "change._change", function(event) {
                                    if (this.parentNode && !event.isSimulated) {
                                        jQuery.event.simulate("change", this.parentNode, event, true);
                                    }
                                });
                                elem._change_attached = true;
                            }
                        });
                    },
                    handle: function(event) {
                        var elem = event.target;
                        if (this !== elem || event.isSimulated || event.isTrigger || elem.type !== "radio" && elem.type !== "checkbox") {
                            return event.handleObj.handler.apply(this, arguments);
                        }
                    },
                    teardown: function() {
                        jQuery.event.remove(this, "._change");
                        return rformElems.test(this.nodeName);
                    }
                };
            }
            if (!jQuery.support.focusinBubbles) {
                jQuery.each({
                    focus: "focusin",
                    blur: "focusout"
                }, function(orig, fix) {
                    var attaches = 0, handler = function(event) {
                        jQuery.event.simulate(fix, event.target, jQuery.event.fix(event), true);
                    };
                    jQuery.event.special[fix] = {
                        setup: function() {
                            if (attaches++ === 0) {
                                document.addEventListener(orig, handler, true);
                            }
                        },
                        teardown: function() {
                            if (--attaches === 0) {
                                document.removeEventListener(orig, handler, true);
                            }
                        }
                    };
                });
            }
            jQuery.fn.extend({
                on: function(types, selector, data, fn, one) {
                    var origFn, type;
                    if (typeof types === "object") {
                        if (typeof selector !== "string") {
                            data = selector;
                            selector = undefined;
                        }
                        for (type in types) {
                            this.on(type, selector, data, types[type], one);
                        }
                        return this;
                    }
                    if (data == null && fn == null) {
                        fn = selector;
                        data = selector = undefined;
                    } else if (fn == null) {
                        if (typeof selector === "string") {
                            fn = data;
                            data = undefined;
                        } else {
                            fn = data;
                            data = selector;
                            selector = undefined;
                        }
                    }
                    if (fn === false) {
                        fn = returnFalse;
                    } else if (!fn) {
                        return this;
                    }
                    if (one === 1) {
                        origFn = fn;
                        fn = function(event) {
                            jQuery().off(event);
                            return origFn.apply(this, arguments);
                        };
                        fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
                    }
                    return this.each(function() {
                        jQuery.event.add(this, types, fn, data, selector);
                    });
                },
                one: function(types, selector, data, fn) {
                    return this.on.call(this, types, selector, data, fn, 1);
                },
                off: function(types, selector, fn) {
                    if (types && types.preventDefault && types.handleObj) {
                        var handleObj = types.handleObj;
                        jQuery(types.delegateTarget).off(handleObj.namespace ? handleObj.type + "." + handleObj.namespace : handleObj.type, handleObj.selector, handleObj.handler);
                        return this;
                    }
                    if (typeof types === "object") {
                        for (var type in types) {
                            this.off(type, selector, types[type]);
                        }
                        return this;
                    }
                    if (selector === false || typeof selector === "function") {
                        fn = selector;
                        selector = undefined;
                    }
                    if (fn === false) {
                        fn = returnFalse;
                    }
                    return this.each(function() {
                        jQuery.event.remove(this, types, fn, selector);
                    });
                },
                bind: function(types, data, fn) {
                    return this.on(types, null, data, fn);
                },
                unbind: function(types, fn) {
                    return this.off(types, null, fn);
                },
                live: function(types, data, fn) {
                    jQuery(this.context).on(types, this.selector, data, fn);
                    return this;
                },
                die: function(types, fn) {
                    jQuery(this.context).off(types, this.selector || "**", fn);
                    return this;
                },
                delegate: function(selector, types, data, fn) {
                    return this.on(types, selector, data, fn);
                },
                undelegate: function(selector, types, fn) {
                    return arguments.length == 1 ? this.off(selector, "**") : this.off(types, selector, fn);
                },
                trigger: function(type, data) {
                    return this.each(function() {
                        jQuery.event.trigger(type, data, this);
                    });
                },
                triggerHandler: function(type, data) {
                    if (this[0]) {
                        return jQuery.event.trigger(type, data, this[0], true);
                    }
                },
                toggle: function(fn) {
                    var args = arguments, guid = fn.guid || jQuery.guid++, i = 0, toggler = function(event) {
                        var lastToggle = (jQuery._data(this, "lastToggle" + fn.guid) || 0) % i;
                        jQuery._data(this, "lastToggle" + fn.guid, lastToggle + 1);
                        event.preventDefault();
                        return args[lastToggle].apply(this, arguments) || false;
                    };
                    toggler.guid = guid;
                    while (i < args.length) {
                        args[i++].guid = guid;
                    }
                    return this.click(toggler);
                },
                hover: function(fnOver, fnOut) {
                    return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
                }
            });
            jQuery.each(("blur focus focusin focusout load resize scroll unload click dblclick " + "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " + "change select submit keydown keypress keyup error contextmenu").split(" "), function(i, name) {
                jQuery.fn[name] = function(data, fn) {
                    if (fn == null) {
                        fn = data;
                        data = null;
                    }
                    return arguments.length > 0 ? this.bind(name, data, fn) : this.trigger(name);
                };
                if (jQuery.attrFn) {
                    jQuery.attrFn[name] = true;
                }
                if (rkeyEvent.test(name)) {
                    jQuery.event.fixHooks[name] = jQuery.event.keyHooks;
                }
                if (rmouseEvent.test(name)) {
                    jQuery.event.fixHooks[name] = jQuery.event.mouseHooks;
                }
            });
            (function() {
                var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g, expando = "sizcache" + (Math.random() + "").replace(".", ""), done = 0, toString = Object.prototype.toString, hasDuplicate = false, baseHasDuplicate = true, rBackslash = /\\/g, rReturn = /\r\n/g, rNonWord = /\W/;
                [ 0, 0 ].sort(function() {
                    baseHasDuplicate = false;
                    return 0;
                });
                var Sizzle = function(selector, context, results, seed) {
                    results = results || [];
                    context = context || document;
                    var origContext = context;
                    if (context.nodeType !== 1 && context.nodeType !== 9) {
                        return [];
                    }
                    if (!selector || typeof selector !== "string") {
                        return results;
                    }
                    var m, set, checkSet, extra, ret, cur, pop, i, prune = true, contextXML = Sizzle.isXML(context), parts = [], soFar = selector;
                    do {
                        chunker.exec("");
                        m = chunker.exec(soFar);
                        if (m) {
                            soFar = m[3];
                            parts.push(m[1]);
                            if (m[2]) {
                                extra = m[3];
                                break;
                            }
                        }
                    } while (m);
                    if (parts.length > 1 && origPOS.exec(selector)) {
                        if (parts.length === 2 && Expr.relative[parts[0]]) {
                            set = posProcess(parts[0] + parts[1], context, seed);
                        } else {
                            set = Expr.relative[parts[0]] ? [ context ] : Sizzle(parts.shift(), context);
                            while (parts.length) {
                                selector = parts.shift();
                                if (Expr.relative[selector]) {
                                    selector += parts.shift();
                                }
                                set = posProcess(selector, set, seed);
                            }
                        }
                    } else {
                        if (!seed && parts.length > 1 && context.nodeType === 9 && !contextXML && Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1])) {
                            ret = Sizzle.find(parts.shift(), context, contextXML);
                            context = ret.expr ? Sizzle.filter(ret.expr, ret.set)[0] : ret.set[0];
                        }
                        if (context) {
                            ret = seed ? {
                                expr: parts.pop(),
                                set: makeArray(seed)
                            } : Sizzle.find(parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML);
                            set = ret.expr ? Sizzle.filter(ret.expr, ret.set) : ret.set;
                            if (parts.length > 0) {
                                checkSet = makeArray(set);
                            } else {
                                prune = false;
                            }
                            while (parts.length) {
                                cur = parts.pop();
                                pop = cur;
                                if (!Expr.relative[cur]) {
                                    cur = "";
                                } else {
                                    pop = parts.pop();
                                }
                                if (pop == null) {
                                    pop = context;
                                }
                                Expr.relative[cur](checkSet, pop, contextXML);
                            }
                        } else {
                            checkSet = parts = [];
                        }
                    }
                    if (!checkSet) {
                        checkSet = set;
                    }
                    if (!checkSet) {
                        Sizzle.error(cur || selector);
                    }
                    if (toString.call(checkSet) === "[object Array]") {
                        if (!prune) {
                            results.push.apply(results, checkSet);
                        } else if (context && context.nodeType === 1) {
                            for (i = 0; checkSet[i] != null; i++) {
                                if (checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i]))) {
                                    results.push(set[i]);
                                }
                            }
                        } else {
                            for (i = 0; checkSet[i] != null; i++) {
                                if (checkSet[i] && checkSet[i].nodeType === 1) {
                                    results.push(set[i]);
                                }
                            }
                        }
                    } else {
                        makeArray(checkSet, results);
                    }
                    if (extra) {
                        Sizzle(extra, origContext, results, seed);
                        Sizzle.uniqueSort(results);
                    }
                    return results;
                };
                Sizzle.uniqueSort = function(results) {
                    if (sortOrder) {
                        hasDuplicate = baseHasDuplicate;
                        results.sort(sortOrder);
                        if (hasDuplicate) {
                            for (var i = 1; i < results.length; i++) {
                                if (results[i] === results[i - 1]) {
                                    results.splice(i--, 1);
                                }
                            }
                        }
                    }
                    return results;
                };
                Sizzle.matches = function(expr, set) {
                    return Sizzle(expr, null, null, set);
                };
                Sizzle.matchesSelector = function(node, expr) {
                    return Sizzle(expr, null, null, [ node ]).length > 0;
                };
                Sizzle.find = function(expr, context, isXML) {
                    var set, i, len, match, type, left;
                    if (!expr) {
                        return [];
                    }
                    for (i = 0, len = Expr.order.length; i < len; i++) {
                        type = Expr.order[i];
                        if (match = Expr.leftMatch[type].exec(expr)) {
                            left = match[1];
                            match.splice(1, 1);
                            if (left.substr(left.length - 1) !== "\\") {
                                match[1] = (match[1] || "").replace(rBackslash, "");
                                set = Expr.find[type](match, context, isXML);
                                if (set != null) {
                                    expr = expr.replace(Expr.match[type], "");
                                    break;
                                }
                            }
                        }
                    }
                    if (!set) {
                        set = typeof context.getElementsByTagName !== "undefined" ? context.getElementsByTagName("*") : [];
                    }
                    return {
                        set: set,
                        expr: expr
                    };
                };
                Sizzle.filter = function(expr, set, inplace, not) {
                    var match, anyFound, type, found, item, filter, left, i, pass, old = expr, result = [], curLoop = set, isXMLFilter = set && set[0] && Sizzle.isXML(set[0]);
                    while (expr && set.length) {
                        for (type in Expr.filter) {
                            if ((match = Expr.leftMatch[type].exec(expr)) != null && match[2]) {
                                filter = Expr.filter[type];
                                left = match[1];
                                anyFound = false;
                                match.splice(1, 1);
                                if (left.substr(left.length - 1) === "\\") {
                                    continue;
                                }
                                if (curLoop === result) {
                                    result = [];
                                }
                                if (Expr.preFilter[type]) {
                                    match = Expr.preFilter[type](match, curLoop, inplace, result, not, isXMLFilter);
                                    if (!match) {
                                        anyFound = found = true;
                                    } else if (match === true) {
                                        continue;
                                    }
                                }
                                if (match) {
                                    for (i = 0; (item = curLoop[i]) != null; i++) {
                                        if (item) {
                                            found = filter(item, match, i, curLoop);
                                            pass = not ^ found;
                                            if (inplace && found != null) {
                                                if (pass) {
                                                    anyFound = true;
                                                } else {
                                                    curLoop[i] = false;
                                                }
                                            } else if (pass) {
                                                result.push(item);
                                                anyFound = true;
                                            }
                                        }
                                    }
                                }
                                if (found !== undefined) {
                                    if (!inplace) {
                                        curLoop = result;
                                    }
                                    expr = expr.replace(Expr.match[type], "");
                                    if (!anyFound) {
                                        return [];
                                    }
                                    break;
                                }
                            }
                        }
                        if (expr === old) {
                            if (anyFound == null) {
                                Sizzle.error(expr);
                            } else {
                                break;
                            }
                        }
                        old = expr;
                    }
                    return curLoop;
                };
                Sizzle.error = function(msg) {
                    throw "Syntax error, unrecognized expression: " + msg;
                };
                var getText = Sizzle.getText = function(elem) {
                    var i, node, nodeType = elem.nodeType, ret = "";
                    if (nodeType) {
                        if (nodeType === 1) {
                            if (typeof elem.textContent === "string") {
                                return elem.textContent;
                            } else if (typeof elem.innerText === "string") {
                                return elem.innerText.replace(rReturn, "");
                            } else {
                                for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                                    ret += getText(elem);
                                }
                            }
                        } else if (nodeType === 3 || nodeType === 4) {
                            return elem.nodeValue;
                        }
                    } else {
                        for (i = 0; node = elem[i]; i++) {
                            if (node.nodeType !== 8) {
                                ret += getText(node);
                            }
                        }
                    }
                    return ret;
                };
                var Expr = Sizzle.selectors = {
                    order: [ "ID", "NAME", "TAG" ],
                    match: {
                        ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                        CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                        NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
                        ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
                        TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
                        CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
                        POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
                        PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
                    },
                    leftMatch: {},
                    attrMap: {
                        "class": "className",
                        "for": "htmlFor"
                    },
                    attrHandle: {
                        href: function(elem) {
                            return elem.getAttribute("href");
                        },
                        type: function(elem) {
                            return elem.getAttribute("type");
                        }
                    },
                    relative: {
                        "+": function(checkSet, part) {
                            var isPartStr = typeof part === "string", isTag = isPartStr && !rNonWord.test(part), isPartStrNotTag = isPartStr && !isTag;
                            if (isTag) {
                                part = part.toLowerCase();
                            }
                            for (var i = 0, l = checkSet.length, elem; i < l; i++) {
                                if (elem = checkSet[i]) {
                                    while ((elem = elem.previousSibling) && elem.nodeType !== 1) {}
                                    checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ? elem || false : elem === part;
                                }
                            }
                            if (isPartStrNotTag) {
                                Sizzle.filter(part, checkSet, true);
                            }
                        },
                        ">": function(checkSet, part) {
                            var elem, isPartStr = typeof part === "string", i = 0, l = checkSet.length;
                            if (isPartStr && !rNonWord.test(part)) {
                                part = part.toLowerCase();
                                for (; i < l; i++) {
                                    elem = checkSet[i];
                                    if (elem) {
                                        var parent = elem.parentNode;
                                        checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
                                    }
                                }
                            } else {
                                for (; i < l; i++) {
                                    elem = checkSet[i];
                                    if (elem) {
                                        checkSet[i] = isPartStr ? elem.parentNode : elem.parentNode === part;
                                    }
                                }
                                if (isPartStr) {
                                    Sizzle.filter(part, checkSet, true);
                                }
                            }
                        },
                        "": function(checkSet, part, isXML) {
                            var nodeCheck, doneName = done++, checkFn = dirCheck;
                            if (typeof part === "string" && !rNonWord.test(part)) {
                                part = part.toLowerCase();
                                nodeCheck = part;
                                checkFn = dirNodeCheck;
                            }
                            checkFn("parentNode", part, doneName, checkSet, nodeCheck, isXML);
                        },
                        "~": function(checkSet, part, isXML) {
                            var nodeCheck, doneName = done++, checkFn = dirCheck;
                            if (typeof part === "string" && !rNonWord.test(part)) {
                                part = part.toLowerCase();
                                nodeCheck = part;
                                checkFn = dirNodeCheck;
                            }
                            checkFn("previousSibling", part, doneName, checkSet, nodeCheck, isXML);
                        }
                    },
                    find: {
                        ID: function(match, context, isXML) {
                            if (typeof context.getElementById !== "undefined" && !isXML) {
                                var m = context.getElementById(match[1]);
                                return m && m.parentNode ? [ m ] : [];
                            }
                        },
                        NAME: function(match, context) {
                            if (typeof context.getElementsByName !== "undefined") {
                                var ret = [], results = context.getElementsByName(match[1]);
                                for (var i = 0, l = results.length; i < l; i++) {
                                    if (results[i].getAttribute("name") === match[1]) {
                                        ret.push(results[i]);
                                    }
                                }
                                return ret.length === 0 ? null : ret;
                            }
                        },
                        TAG: function(match, context) {
                            if (typeof context.getElementsByTagName !== "undefined") {
                                return context.getElementsByTagName(match[1]);
                            }
                        }
                    },
                    preFilter: {
                        CLASS: function(match, curLoop, inplace, result, not, isXML) {
                            match = " " + match[1].replace(rBackslash, "") + " ";
                            if (isXML) {
                                return match;
                            }
                            for (var i = 0, elem; (elem = curLoop[i]) != null; i++) {
                                if (elem) {
                                    if (not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0)) {
                                        if (!inplace) {
                                            result.push(elem);
                                        }
                                    } else if (inplace) {
                                        curLoop[i] = false;
                                    }
                                }
                            }
                            return false;
                        },
                        ID: function(match) {
                            return match[1].replace(rBackslash, "");
                        },
                        TAG: function(match, curLoop) {
                            return match[1].replace(rBackslash, "").toLowerCase();
                        },
                        CHILD: function(match) {
                            if (match[1] === "nth") {
                                if (!match[2]) {
                                    Sizzle.error(match[0]);
                                }
                                match[2] = match[2].replace(/^\+|\s*/g, "");
                                var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" || !/\D/.test(match[2]) && "0n+" + match[2] || match[2]);
                                match[2] = test[1] + (test[2] || 1) - 0;
                                match[3] = test[3] - 0;
                            } else if (match[2]) {
                                Sizzle.error(match[0]);
                            }
                            match[0] = done++;
                            return match;
                        },
                        ATTR: function(match, curLoop, inplace, result, not, isXML) {
                            var name = match[1] = match[1].replace(rBackslash, "");
                            if (!isXML && Expr.attrMap[name]) {
                                match[1] = Expr.attrMap[name];
                            }
                            match[4] = (match[4] || match[5] || "").replace(rBackslash, "");
                            if (match[2] === "~=") {
                                match[4] = " " + match[4] + " ";
                            }
                            return match;
                        },
                        PSEUDO: function(match, curLoop, inplace, result, not) {
                            if (match[1] === "not") {
                                if ((chunker.exec(match[3]) || "").length > 1 || /^\w/.test(match[3])) {
                                    match[3] = Sizzle(match[3], null, null, curLoop);
                                } else {
                                    var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);
                                    if (!inplace) {
                                        result.push.apply(result, ret);
                                    }
                                    return false;
                                }
                            } else if (Expr.match.POS.test(match[0]) || Expr.match.CHILD.test(match[0])) {
                                return true;
                            }
                            return match;
                        },
                        POS: function(match) {
                            match.unshift(true);
                            return match;
                        }
                    },
                    filters: {
                        enabled: function(elem) {
                            return elem.disabled === false && elem.type !== "hidden";
                        },
                        disabled: function(elem) {
                            return elem.disabled === true;
                        },
                        checked: function(elem) {
                            return elem.checked === true;
                        },
                        selected: function(elem) {
                            if (elem.parentNode) {
                                elem.parentNode.selectedIndex;
                            }
                            return elem.selected === true;
                        },
                        parent: function(elem) {
                            return !!elem.firstChild;
                        },
                        empty: function(elem) {
                            return !elem.firstChild;
                        },
                        has: function(elem, i, match) {
                            return !!Sizzle(match[3], elem).length;
                        },
                        header: function(elem) {
                            return /h\d/i.test(elem.nodeName);
                        },
                        text: function(elem) {
                            var attr = elem.getAttribute("type"), type = elem.type;
                            return elem.nodeName.toLowerCase() === "input" && "text" === type && (attr === type || attr === null);
                        },
                        radio: function(elem) {
                            return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
                        },
                        checkbox: function(elem) {
                            return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
                        },
                        file: function(elem) {
                            return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
                        },
                        password: function(elem) {
                            return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
                        },
                        submit: function(elem) {
                            var name = elem.nodeName.toLowerCase();
                            return (name === "input" || name === "button") && "submit" === elem.type;
                        },
                        image: function(elem) {
                            return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
                        },
                        reset: function(elem) {
                            var name = elem.nodeName.toLowerCase();
                            return (name === "input" || name === "button") && "reset" === elem.type;
                        },
                        button: function(elem) {
                            var name = elem.nodeName.toLowerCase();
                            return name === "input" && "button" === elem.type || name === "button";
                        },
                        input: function(elem) {
                            return /input|select|textarea|button/i.test(elem.nodeName);
                        },
                        focus: function(elem) {
                            return elem === elem.ownerDocument.activeElement;
                        }
                    },
                    setFilters: {
                        first: function(elem, i) {
                            return i === 0;
                        },
                        last: function(elem, i, match, array) {
                            return i === array.length - 1;
                        },
                        even: function(elem, i) {
                            return i % 2 === 0;
                        },
                        odd: function(elem, i) {
                            return i % 2 === 1;
                        },
                        lt: function(elem, i, match) {
                            return i < match[3] - 0;
                        },
                        gt: function(elem, i, match) {
                            return i > match[3] - 0;
                        },
                        nth: function(elem, i, match) {
                            return match[3] - 0 === i;
                        },
                        eq: function(elem, i, match) {
                            return match[3] - 0 === i;
                        }
                    },
                    filter: {
                        PSEUDO: function(elem, match, i, array) {
                            var name = match[1], filter = Expr.filters[name];
                            if (filter) {
                                return filter(elem, i, match, array);
                            } else if (name === "contains") {
                                return (elem.textContent || elem.innerText || getText([ elem ]) || "").indexOf(match[3]) >= 0;
                            } else if (name === "not") {
                                var not = match[3];
                                for (var j = 0, l = not.length; j < l; j++) {
                                    if (not[j] === elem) {
                                        return false;
                                    }
                                }
                                return true;
                            } else {
                                Sizzle.error(name);
                            }
                        },
                        CHILD: function(elem, match) {
                            var first, last, doneName, parent, cache, count, diff, type = match[1], node = elem;
                            switch (type) {
                              case "only":
                              case "first":
                                while (node = node.previousSibling) {
                                    if (node.nodeType === 1) {
                                        return false;
                                    }
                                }
                                if (type === "first") {
                                    return true;
                                }
                                node = elem;
                              case "last":
                                while (node = node.nextSibling) {
                                    if (node.nodeType === 1) {
                                        return false;
                                    }
                                }
                                return true;
                              case "nth":
                                first = match[2];
                                last = match[3];
                                if (first === 1 && last === 0) {
                                    return true;
                                }
                                doneName = match[0];
                                parent = elem.parentNode;
                                if (parent && (parent[expando] !== doneName || !elem.nodeIndex)) {
                                    count = 0;
                                    for (node = parent.firstChild; node; node = node.nextSibling) {
                                        if (node.nodeType === 1) {
                                            node.nodeIndex = ++count;
                                        }
                                    }
                                    parent[expando] = doneName;
                                }
                                diff = elem.nodeIndex - last;
                                if (first === 0) {
                                    return diff === 0;
                                } else {
                                    return diff % first === 0 && diff / first >= 0;
                                }
                            }
                        },
                        ID: function(elem, match) {
                            return elem.nodeType === 1 && elem.getAttribute("id") === match;
                        },
                        TAG: function(elem, match) {
                            return match === "*" && elem.nodeType === 1 || !!elem.nodeName && elem.nodeName.toLowerCase() === match;
                        },
                        CLASS: function(elem, match) {
                            return (" " + (elem.className || elem.getAttribute("class")) + " ").indexOf(match) > -1;
                        },
                        ATTR: function(elem, match) {
                            var name = match[1], result = Sizzle.attr ? Sizzle.attr(elem, name) : Expr.attrHandle[name] ? Expr.attrHandle[name](elem) : elem[name] != null ? elem[name] : elem.getAttribute(name), value = result + "", type = match[2], check = match[4];
                            return result == null ? type === "!=" : !type && Sizzle.attr ? result != null : type === "=" ? value === check : type === "*=" ? value.indexOf(check) >= 0 : type === "~=" ? (" " + value + " ").indexOf(check) >= 0 : !check ? value && result !== false : type === "!=" ? value !== check : type === "^=" ? value.indexOf(check) === 0 : type === "$=" ? value.substr(value.length - check.length) === check : type === "|=" ? value === check || value.substr(0, check.length + 1) === check + "-" : false;
                        },
                        POS: function(elem, match, i, array) {
                            var name = match[2], filter = Expr.setFilters[name];
                            if (filter) {
                                return filter(elem, i, match, array);
                            }
                        }
                    }
                };
                var origPOS = Expr.match.POS, fescape = function(all, num) {
                    return "\\" + (num - 0 + 1);
                };
                for (var type in Expr.match) {
                    Expr.match[type] = new RegExp(Expr.match[type].source + /(?![^\[]*\])(?![^\(]*\))/.source);
                    Expr.leftMatch[type] = new RegExp(/(^(?:.|\r|\n)*?)/.source + Expr.match[type].source.replace(/\\(\d+)/g, fescape));
                }
                var makeArray = function(array, results) {
                    array = Array.prototype.slice.call(array, 0);
                    if (results) {
                        results.push.apply(results, array);
                        return results;
                    }
                    return array;
                };
                try {
                    Array.prototype.slice.call(document.documentElement.childNodes, 0)[0].nodeType;
                } catch (e) {
                    makeArray = function(array, results) {
                        var i = 0, ret = results || [];
                        if (toString.call(array) === "[object Array]") {
                            Array.prototype.push.apply(ret, array);
                        } else {
                            if (typeof array.length === "number") {
                                for (var l = array.length; i < l; i++) {
                                    ret.push(array[i]);
                                }
                            } else {
                                for (; array[i]; i++) {
                                    ret.push(array[i]);
                                }
                            }
                        }
                        return ret;
                    };
                }
                var sortOrder, siblingCheck;
                if (document.documentElement.compareDocumentPosition) {
                    sortOrder = function(a, b) {
                        if (a === b) {
                            hasDuplicate = true;
                            return 0;
                        }
                        if (!a.compareDocumentPosition || !b.compareDocumentPosition) {
                            return a.compareDocumentPosition ? -1 : 1;
                        }
                        return a.compareDocumentPosition(b) & 4 ? -1 : 1;
                    };
                } else {
                    sortOrder = function(a, b) {
                        if (a === b) {
                            hasDuplicate = true;
                            return 0;
                        } else if (a.sourceIndex && b.sourceIndex) {
                            return a.sourceIndex - b.sourceIndex;
                        }
                        var al, bl, ap = [], bp = [], aup = a.parentNode, bup = b.parentNode, cur = aup;
                        if (aup === bup) {
                            return siblingCheck(a, b);
                        } else if (!aup) {
                            return -1;
                        } else if (!bup) {
                            return 1;
                        }
                        while (cur) {
                            ap.unshift(cur);
                            cur = cur.parentNode;
                        }
                        cur = bup;
                        while (cur) {
                            bp.unshift(cur);
                            cur = cur.parentNode;
                        }
                        al = ap.length;
                        bl = bp.length;
                        for (var i = 0; i < al && i < bl; i++) {
                            if (ap[i] !== bp[i]) {
                                return siblingCheck(ap[i], bp[i]);
                            }
                        }
                        return i === al ? siblingCheck(a, bp[i], -1) : siblingCheck(ap[i], b, 1);
                    };
                    siblingCheck = function(a, b, ret) {
                        if (a === b) {
                            return ret;
                        }
                        var cur = a.nextSibling;
                        while (cur) {
                            if (cur === b) {
                                return -1;
                            }
                            cur = cur.nextSibling;
                        }
                        return 1;
                    };
                }
                (function() {
                    var form = document.createElement("div"), id = "script" + (new Date).getTime(), root = document.documentElement;
                    form.innerHTML = "<a name='" + id + "'/>";
                    root.insertBefore(form, root.firstChild);
                    if (document.getElementById(id)) {
                        Expr.find.ID = function(match, context, isXML) {
                            if (typeof context.getElementById !== "undefined" && !isXML) {
                                var m = context.getElementById(match[1]);
                                return m ? m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ? [ m ] : undefined : [];
                            }
                        };
                        Expr.filter.ID = function(elem, match) {
                            var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
                            return elem.nodeType === 1 && node && node.nodeValue === match;
                        };
                    }
                    root.removeChild(form);
                    root = form = null;
                })();
                (function() {
                    var div = document.createElement("div");
                    div.appendChild(document.createComment(""));
                    if (div.getElementsByTagName("*").length > 0) {
                        Expr.find.TAG = function(match, context) {
                            var results = context.getElementsByTagName(match[1]);
                            if (match[1] === "*") {
                                var tmp = [];
                                for (var i = 0; results[i]; i++) {
                                    if (results[i].nodeType === 1) {
                                        tmp.push(results[i]);
                                    }
                                }
                                results = tmp;
                            }
                            return results;
                        };
                    }
                    div.innerHTML = "<a href='#'></a>";
                    if (div.firstChild && typeof div.firstChild.getAttribute !== "undefined" && div.firstChild.getAttribute("href") !== "#") {
                        Expr.attrHandle.href = function(elem) {
                            return elem.getAttribute("href", 2);
                        };
                    }
                    div = null;
                })();
                if (document.querySelectorAll) {
                    (function() {
                        var oldSizzle = Sizzle, div = document.createElement("div"), id = "__sizzle__";
                        div.innerHTML = "<p class='TEST'></p>";
                        if (div.querySelectorAll && div.querySelectorAll(".TEST").length === 0) {
                            return;
                        }
                        Sizzle = function(query, context, extra, seed) {
                            context = context || document;
                            if (!seed && !Sizzle.isXML(context)) {
                                var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(query);
                                if (match && (context.nodeType === 1 || context.nodeType === 9)) {
                                    if (match[1]) {
                                        return makeArray(context.getElementsByTagName(query), extra);
                                    } else if (match[2] && Expr.find.CLASS && context.getElementsByClassName) {
                                        return makeArray(context.getElementsByClassName(match[2]), extra);
                                    }
                                }
                                if (context.nodeType === 9) {
                                    if (query === "body" && context.body) {
                                        return makeArray([ context.body ], extra);
                                    } else if (match && match[3]) {
                                        var elem = context.getElementById(match[3]);
                                        if (elem && elem.parentNode) {
                                            if (elem.id === match[3]) {
                                                return makeArray([ elem ], extra);
                                            }
                                        } else {
                                            return makeArray([], extra);
                                        }
                                    }
                                    try {
                                        return makeArray(context.querySelectorAll(query), extra);
                                    } catch (qsaError) {}
                                } else if (context.nodeType === 1 && context.nodeName.toLowerCase() !== "object") {
                                    var oldContext = context, old = context.getAttribute("id"), nid = old || id, hasParent = context.parentNode, relativeHierarchySelector = /^\s*[+~]/.test(query);
                                    if (!old) {
                                        context.setAttribute("id", nid);
                                    } else {
                                        nid = nid.replace(/'/g, "\\$&");
                                    }
                                    if (relativeHierarchySelector && hasParent) {
                                        context = context.parentNode;
                                    }
                                    try {
                                        if (!relativeHierarchySelector || hasParent) {
                                            return makeArray(context.querySelectorAll("[id='" + nid + "'] " + query), extra);
                                        }
                                    } catch (pseudoError) {} finally {
                                        if (!old) {
                                            oldContext.removeAttribute("id");
                                        }
                                    }
                                }
                            }
                            return oldSizzle(query, context, extra, seed);
                        };
                        for (var prop in oldSizzle) {
                            Sizzle[prop] = oldSizzle[prop];
                        }
                        div = null;
                    })();
                }
                (function() {
                    var html = document.documentElement, matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;
                    if (matches) {
                        var disconnectedMatch = !matches.call(document.createElement("div"), "div"), pseudoWorks = false;
                        try {
                            matches.call(document.documentElement, "[test!='']:sizzle");
                        } catch (pseudoError) {
                            pseudoWorks = true;
                        }
                        Sizzle.matchesSelector = function(node, expr) {
                            expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");
                            if (!Sizzle.isXML(node)) {
                                try {
                                    if (pseudoWorks || !Expr.match.PSEUDO.test(expr) && !/!=/.test(expr)) {
                                        var ret = matches.call(node, expr);
                                        if (ret || !disconnectedMatch || node.document && node.document.nodeType !== 11) {
                                            return ret;
                                        }
                                    }
                                } catch (e) {}
                            }
                            return Sizzle(expr, null, null, [ node ]).length > 0;
                        };
                    }
                })();
                (function() {
                    var div = document.createElement("div");
                    div.innerHTML = "<div class='test e'></div><div class='test'></div>";
                    if (!div.getElementsByClassName || div.getElementsByClassName("e").length === 0) {
                        return;
                    }
                    div.lastChild.className = "e";
                    if (div.getElementsByClassName("e").length === 1) {
                        return;
                    }
                    Expr.order.splice(1, 0, "CLASS");
                    Expr.find.CLASS = function(match, context, isXML) {
                        if (typeof context.getElementsByClassName !== "undefined" && !isXML) {
                            return context.getElementsByClassName(match[1]);
                        }
                    };
                    div = null;
                })();
                function dirNodeCheck(dir, cur, doneName, checkSet, nodeCheck, isXML) {
                    for (var i = 0, l = checkSet.length; i < l; i++) {
                        var elem = checkSet[i];
                        if (elem) {
                            var match = false;
                            elem = elem[dir];
                            while (elem) {
                                if (elem[expando] === doneName) {
                                    match = checkSet[elem.sizset];
                                    break;
                                }
                                if (elem.nodeType === 1 && !isXML) {
                                    elem[expando] = doneName;
                                    elem.sizset = i;
                                }
                                if (elem.nodeName.toLowerCase() === cur) {
                                    match = elem;
                                    break;
                                }
                                elem = elem[dir];
                            }
                            checkSet[i] = match;
                        }
                    }
                }
                function dirCheck(dir, cur, doneName, checkSet, nodeCheck, isXML) {
                    for (var i = 0, l = checkSet.length; i < l; i++) {
                        var elem = checkSet[i];
                        if (elem) {
                            var match = false;
                            elem = elem[dir];
                            while (elem) {
                                if (elem[expando] === doneName) {
                                    match = checkSet[elem.sizset];
                                    break;
                                }
                                if (elem.nodeType === 1) {
                                    if (!isXML) {
                                        elem[expando] = doneName;
                                        elem.sizset = i;
                                    }
                                    if (typeof cur !== "string") {
                                        if (elem === cur) {
                                            match = true;
                                            break;
                                        }
                                    } else if (Sizzle.filter(cur, [ elem ]).length > 0) {
                                        match = elem;
                                        break;
                                    }
                                }
                                elem = elem[dir];
                            }
                            checkSet[i] = match;
                        }
                    }
                }
                if (document.documentElement.contains) {
                    Sizzle.contains = function(a, b) {
                        return a !== b && (a.contains ? a.contains(b) : true);
                    };
                } else if (document.documentElement.compareDocumentPosition) {
                    Sizzle.contains = function(a, b) {
                        return !!(a.compareDocumentPosition(b) & 16);
                    };
                } else {
                    Sizzle.contains = function() {
                        return false;
                    };
                }
                Sizzle.isXML = function(elem) {
                    var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;
                    return documentElement ? documentElement.nodeName !== "HTML" : false;
                };
                var posProcess = function(selector, context, seed) {
                    var match, tmpSet = [], later = "", root = context.nodeType ? [ context ] : context;
                    while (match = Expr.match.PSEUDO.exec(selector)) {
                        later += match[0];
                        selector = selector.replace(Expr.match.PSEUDO, "");
                    }
                    selector = Expr.relative[selector] ? selector + "*" : selector;
                    for (var i = 0, l = root.length; i < l; i++) {
                        Sizzle(selector, root[i], tmpSet, seed);
                    }
                    return Sizzle.filter(later, tmpSet);
                };
                Sizzle.attr = jQuery.attr;
                Sizzle.selectors.attrMap = {};
                jQuery.find = Sizzle;
                jQuery.expr = Sizzle.selectors;
                jQuery.expr[":"] = jQuery.expr.filters;
                jQuery.unique = Sizzle.uniqueSort;
                jQuery.text = Sizzle.getText;
                jQuery.isXMLDoc = Sizzle.isXML;
                jQuery.contains = Sizzle.contains;
            })();
            var runtil = /Until$/, rparentsprev = /^(?:parents|prevUntil|prevAll)/, rmultiselector = /,/, isSimple = /^.[^:#\[\.,]*$/, slice = Array.prototype.slice, POS = jQuery.expr.match.POS, guaranteedUnique = {
                children: true,
                contents: true,
                next: true,
                prev: true
            };
            jQuery.fn.extend({
                find: function(selector) {
                    var self = this, i, l;
                    if (typeof selector !== "string") {
                        return jQuery(selector).filter(function() {
                            for (i = 0, l = self.length; i < l; i++) {
                                if (jQuery.contains(self[i], this)) {
                                    return true;
                                }
                            }
                        });
                    }
                    var ret = this.pushStack("", "find", selector), length, n, r;
                    for (i = 0, l = this.length; i < l; i++) {
                        length = ret.length;
                        jQuery.find(selector, this[i], ret);
                        if (i > 0) {
                            for (n = length; n < ret.length; n++) {
                                for (r = 0; r < length; r++) {
                                    if (ret[r] === ret[n]) {
                                        ret.splice(n--, 1);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    return ret;
                },
                has: function(target) {
                    var targets = jQuery(target);
                    return this.filter(function() {
                        for (var i = 0, l = targets.length; i < l; i++) {
                            if (jQuery.contains(this, targets[i])) {
                                return true;
                            }
                        }
                    });
                },
                not: function(selector) {
                    return this.pushStack(winnow(this, selector, false), "not", selector);
                },
                filter: function(selector) {
                    return this.pushStack(winnow(this, selector, true), "filter", selector);
                },
                is: function(selector) {
                    return !!selector && (typeof selector === "string" ? POS.test(selector) ? jQuery(selector, this.context).index(this[0]) >= 0 : jQuery.filter(selector, this).length > 0 : this.filter(selector).length > 0);
                },
                closest: function(selectors, context) {
                    var ret = [], i, l, cur = this[0];
                    if (jQuery.isArray(selectors)) {
                        var level = 1;
                        while (cur && cur.ownerDocument && cur !== context) {
                            for (i = 0; i < selectors.length; i++) {
                                if (jQuery(cur).is(selectors[i])) {
                                    ret.push({
                                        selector: selectors[i],
                                        elem: cur,
                                        level: level
                                    });
                                }
                            }
                            cur = cur.parentNode;
                            level++;
                        }
                        return ret;
                    }
                    var pos = POS.test(selectors) || typeof selectors !== "string" ? jQuery(selectors, context || this.context) : 0;
                    for (i = 0, l = this.length; i < l; i++) {
                        cur = this[i];
                        while (cur) {
                            if (pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors)) {
                                ret.push(cur);
                                break;
                            } else {
                                cur = cur.parentNode;
                                if (!cur || !cur.ownerDocument || cur === context || cur.nodeType === 11) {
                                    break;
                                }
                            }
                        }
                    }
                    ret = ret.length > 1 ? jQuery.unique(ret) : ret;
                    return this.pushStack(ret, "closest", selectors);
                },
                index: function(elem) {
                    if (!elem) {
                        return this[0] && this[0].parentNode ? this.prevAll().length : -1;
                    }
                    if (typeof elem === "string") {
                        return jQuery.inArray(this[0], jQuery(elem));
                    }
                    return jQuery.inArray(elem.jquery ? elem[0] : elem, this);
                },
                add: function(selector, context) {
                    var set = typeof selector === "string" ? jQuery(selector, context) : jQuery.makeArray(selector && selector.nodeType ? [ selector ] : selector), all = jQuery.merge(this.get(), set);
                    return this.pushStack(isDisconnected(set[0]) || isDisconnected(all[0]) ? all : jQuery.unique(all));
                },
                andSelf: function() {
                    return this.add(this.prevObject);
                }
            });
            function isDisconnected(node) {
                return !node || !node.parentNode || node.parentNode.nodeType === 11;
            }
            jQuery.each({
                parent: function(elem) {
                    var parent = elem.parentNode;
                    return parent && parent.nodeType !== 11 ? parent : null;
                },
                parents: function(elem) {
                    return jQuery.dir(elem, "parentNode");
                },
                parentsUntil: function(elem, i, until) {
                    return jQuery.dir(elem, "parentNode", until);
                },
                next: function(elem) {
                    return jQuery.nth(elem, 2, "nextSibling");
                },
                prev: function(elem) {
                    return jQuery.nth(elem, 2, "previousSibling");
                },
                nextAll: function(elem) {
                    return jQuery.dir(elem, "nextSibling");
                },
                prevAll: function(elem) {
                    return jQuery.dir(elem, "previousSibling");
                },
                nextUntil: function(elem, i, until) {
                    return jQuery.dir(elem, "nextSibling", until);
                },
                prevUntil: function(elem, i, until) {
                    return jQuery.dir(elem, "previousSibling", until);
                },
                siblings: function(elem) {
                    return jQuery.sibling(elem.parentNode.firstChild, elem);
                },
                children: function(elem) {
                    return jQuery.sibling(elem.firstChild);
                },
                contents: function(elem) {
                    return jQuery.nodeName(elem, "iframe") ? elem.contentDocument || elem.contentWindow.document : jQuery.makeArray(elem.childNodes);
                }
            }, function(name, fn) {
                jQuery.fn[name] = function(until, selector) {
                    var ret = jQuery.map(this, fn, until), args = slice.call(arguments);
                    if (!runtil.test(name)) {
                        selector = until;
                    }
                    if (selector && typeof selector === "string") {
                        ret = jQuery.filter(selector, ret);
                    }
                    ret = this.length > 1 && !guaranteedUnique[name] ? jQuery.unique(ret) : ret;
                    if ((this.length > 1 || rmultiselector.test(selector)) && rparentsprev.test(name)) {
                        ret = ret.reverse();
                    }
                    return this.pushStack(ret, name, args.join(","));
                };
            });
            jQuery.extend({
                filter: function(expr, elems, not) {
                    if (not) {
                        expr = ":not(" + expr + ")";
                    }
                    return elems.length === 1 ? jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] : jQuery.find.matches(expr, elems);
                },
                dir: function(elem, dir, until) {
                    var matched = [], cur = elem[dir];
                    while (cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery(cur).is(until))) {
                        if (cur.nodeType === 1) {
                            matched.push(cur);
                        }
                        cur = cur[dir];
                    }
                    return matched;
                },
                nth: function(cur, result, dir, elem) {
                    result = result || 1;
                    var num = 0;
                    for (; cur; cur = cur[dir]) {
                        if (cur.nodeType === 1 && ++num === result) {
                            break;
                        }
                    }
                    return cur;
                },
                sibling: function(n, elem) {
                    var r = [];
                    for (; n; n = n.nextSibling) {
                        if (n.nodeType === 1 && n !== elem) {
                            r.push(n);
                        }
                    }
                    return r;
                }
            });
            function winnow(elements, qualifier, keep) {
                qualifier = qualifier || 0;
                if (jQuery.isFunction(qualifier)) {
                    return jQuery.grep(elements, function(elem, i) {
                        var retVal = !!qualifier.call(elem, i, elem);
                        return retVal === keep;
                    });
                } else if (qualifier.nodeType) {
                    return jQuery.grep(elements, function(elem, i) {
                        return elem === qualifier === keep;
                    });
                } else if (typeof qualifier === "string") {
                    var filtered = jQuery.grep(elements, function(elem) {
                        return elem.nodeType === 1;
                    });
                    if (isSimple.test(qualifier)) {
                        return jQuery.filter(qualifier, filtered, !keep);
                    } else {
                        qualifier = jQuery.filter(qualifier, filtered);
                    }
                }
                return jQuery.grep(elements, function(elem, i) {
                    return jQuery.inArray(elem, qualifier) >= 0 === keep;
                });
            }
            function createSafeFragment(document) {
                var list = nodeNames.split(" "), safeFrag = document.createDocumentFragment();
                if (safeFrag.createElement) {
                    while (list.length) {
                        safeFrag.createElement(list.pop());
                    }
                }
                return safeFrag;
            }
            var nodeNames = "abbr article aside audio canvas datalist details figcaption figure footer " + "header hgroup mark meter nav output progress section summary time video", rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g, rleadingWhitespace = /^\s+/, rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig, rtagName = /<([\w:]+)/, rtbody = /<tbody/i, rhtml = /<|&#?\w+;/, rnoInnerhtml = /<(?:script|style)/i, rnocache = /<(?:script|object|embed|option|style)/i, rnoshimcache = new RegExp("<(?:" + nodeNames.replace(" ", "|") + ")", "i"), rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i, rscriptType = /\/(java|ecma)script/i, rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)/, wrapMap = {
                option: [ 1, "<select multiple='multiple'>", "</select>" ],
                legend: [ 1, "<fieldset>", "</fieldset>" ],
                thead: [ 1, "<table>", "</table>" ],
                tr: [ 2, "<table><tbody>", "</tbody></table>" ],
                td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
                col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
                area: [ 1, "<map>", "</map>" ],
                _default: [ 0, "", "" ]
            }, safeFragment = createSafeFragment(document);
            wrapMap.optgroup = wrapMap.option;
            wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
            wrapMap.th = wrapMap.td;
            if (!jQuery.support.htmlSerialize) {
                wrapMap._default = [ 1, "div<div>", "</div>" ];
            }
            jQuery.fn.extend({
                text: function(text) {
                    if (jQuery.isFunction(text)) {
                        return this.each(function(i) {
                            var self = jQuery(this);
                            self.text(text.call(this, i, self.text()));
                        });
                    }
                    if (typeof text !== "object" && text !== undefined) {
                        return this.empty().append((this[0] && this[0].ownerDocument || document).createTextNode(text));
                    }
                    return jQuery.text(this);
                },
                wrapAll: function(html) {
                    if (jQuery.isFunction(html)) {
                        return this.each(function(i) {
                            jQuery(this).wrapAll(html.call(this, i));
                        });
                    }
                    if (this[0]) {
                        var wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);
                        if (this[0].parentNode) {
                            wrap.insertBefore(this[0]);
                        }
                        wrap.map(function() {
                            var elem = this;
                            while (elem.firstChild && elem.firstChild.nodeType === 1) {
                                elem = elem.firstChild;
                            }
                            return elem;
                        }).append(this);
                    }
                    return this;
                },
                wrapInner: function(html) {
                    if (jQuery.isFunction(html)) {
                        return this.each(function(i) {
                            jQuery(this).wrapInner(html.call(this, i));
                        });
                    }
                    return this.each(function() {
                        var self = jQuery(this), contents = self.contents();
                        if (contents.length) {
                            contents.wrapAll(html);
                        } else {
                            self.append(html);
                        }
                    });
                },
                wrap: function(html) {
                    return this.each(function() {
                        jQuery(this).wrapAll(html);
                    });
                },
                unwrap: function() {
                    return this.parent().each(function() {
                        if (!jQuery.nodeName(this, "body")) {
                            jQuery(this).replaceWith(this.childNodes);
                        }
                    }).end();
                },
                append: function() {
                    return this.domManip(arguments, true, function(elem) {
                        if (this.nodeType === 1) {
                            this.appendChild(elem);
                        }
                    });
                },
                prepend: function() {
                    return this.domManip(arguments, true, function(elem) {
                        if (this.nodeType === 1) {
                            this.insertBefore(elem, this.firstChild);
                        }
                    });
                },
                before: function() {
                    if (this[0] && this[0].parentNode) {
                        return this.domManip(arguments, false, function(elem) {
                            this.parentNode.insertBefore(elem, this);
                        });
                    } else if (arguments.length) {
                        var set = jQuery(arguments[0]);
                        set.push.apply(set, this.toArray());
                        return this.pushStack(set, "before", arguments);
                    }
                },
                after: function() {
                    if (this[0] && this[0].parentNode) {
                        return this.domManip(arguments, false, function(elem) {
                            this.parentNode.insertBefore(elem, this.nextSibling);
                        });
                    } else if (arguments.length) {
                        var set = this.pushStack(this, "after", arguments);
                        set.push.apply(set, jQuery(arguments[0]).toArray());
                        return set;
                    }
                },
                remove: function(selector, keepData) {
                    for (var i = 0, elem; (elem = this[i]) != null; i++) {
                        if (!selector || jQuery.filter(selector, [ elem ]).length) {
                            if (!keepData && elem.nodeType === 1) {
                                jQuery.cleanData(elem.getElementsByTagName("*"));
                                jQuery.cleanData([ elem ]);
                            }
                            if (elem.parentNode) {
                                elem.parentNode.removeChild(elem);
                            }
                        }
                    }
                    return this;
                },
                empty: function() {
                    for (var i = 0, elem; (elem = this[i]) != null; i++) {
                        if (elem.nodeType === 1) {
                            jQuery.cleanData(elem.getElementsByTagName("*"));
                        }
                        while (elem.firstChild) {
                            elem.removeChild(elem.firstChild);
                        }
                    }
                    return this;
                },
                clone: function(dataAndEvents, deepDataAndEvents) {
                    dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
                    deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
                    return this.map(function() {
                        return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
                    });
                },
                html: function(value) {
                    if (value === undefined) {
                        return this[0] && this[0].nodeType === 1 ? this[0].innerHTML.replace(rinlinejQuery, "") : null;
                    } else if (typeof value === "string" && !rnoInnerhtml.test(value) && (jQuery.support.leadingWhitespace || !rleadingWhitespace.test(value)) && !wrapMap[(rtagName.exec(value) || [ "", "" ])[1].toLowerCase()]) {
                        value = value.replace(rxhtmlTag, "<$1></$2>");
                        try {
                            for (var i = 0, l = this.length; i < l; i++) {
                                if (this[i].nodeType === 1) {
                                    jQuery.cleanData(this[i].getElementsByTagName("*"));
                                    this[i].innerHTML = value;
                                }
                            }
                        } catch (e) {
                            this.empty().append(value);
                        }
                    } else if (jQuery.isFunction(value)) {
                        this.each(function(i) {
                            var self = jQuery(this);
                            self.html(value.call(this, i, self.html()));
                        });
                    } else {
                        this.empty().append(value);
                    }
                    return this;
                },
                replaceWith: function(value) {
                    if (this[0] && this[0].parentNode) {
                        if (jQuery.isFunction(value)) {
                            return this.each(function(i) {
                                var self = jQuery(this), old = self.html();
                                self.replaceWith(value.call(this, i, old));
                            });
                        }
                        if (typeof value !== "string") {
                            value = jQuery(value).detach();
                        }
                        return this.each(function() {
                            var next = this.nextSibling, parent = this.parentNode;
                            jQuery(this).remove();
                            if (next) {
                                jQuery(next).before(value);
                            } else {
                                jQuery(parent).append(value);
                            }
                        });
                    } else {
                        return this.length ? this.pushStack(jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value) : this;
                    }
                },
                detach: function(selector) {
                    return this.remove(selector, true);
                },
                domManip: function(args, table, callback) {
                    var results, first, fragment, parent, value = args[0], scripts = [];
                    if (!jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test(value)) {
                        return this.each(function() {
                            jQuery(this).domManip(args, table, callback, true);
                        });
                    }
                    if (jQuery.isFunction(value)) {
                        return this.each(function(i) {
                            var self = jQuery(this);
                            args[0] = value.call(this, i, table ? self.html() : undefined);
                            self.domManip(args, table, callback);
                        });
                    }
                    if (this[0]) {
                        parent = value && value.parentNode;
                        if (jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length) {
                            results = {
                                fragment: parent
                            };
                        } else {
                            results = jQuery.buildFragment(args, this, scripts);
                        }
                        fragment = results.fragment;
                        if (fragment.childNodes.length === 1) {
                            first = fragment = fragment.firstChild;
                        } else {
                            first = fragment.firstChild;
                        }
                        if (first) {
                            table = table && jQuery.nodeName(first, "tr");
                            for (var i = 0, l = this.length, lastIndex = l - 1; i < l; i++) {
                                callback.call(table ? root(this[i], first) : this[i], results.cacheable || l > 1 && i < lastIndex ? jQuery.clone(fragment, true, true) : fragment);
                            }
                        }
                        if (scripts.length) {
                            jQuery.each(scripts, evalScript);
                        }
                    }
                    return this;
                }
            });
            function root(elem, cur) {
                return jQuery.nodeName(elem, "table") ? elem.getElementsByTagName("tbody")[0] || elem.appendChild(elem.ownerDocument.createElement("tbody")) : elem;
            }
            function cloneCopyEvent(src, dest) {
                if (dest.nodeType !== 1 || !jQuery.hasData(src)) {
                    return;
                }
                var type, i, l, oldData = jQuery._data(src), curData = jQuery._data(dest, oldData), events = oldData.events;
                if (events) {
                    delete curData.handle;
                    curData.events = {};
                    for (type in events) {
                        for (i = 0, l = events[type].length; i < l; i++) {
                            jQuery.event.add(dest, type + (events[type][i].namespace ? "." : "") + events[type][i].namespace, events[type][i], events[type][i].data);
                        }
                    }
                }
                if (curData.data) {
                    curData.data = jQuery.extend({}, curData.data);
                }
            }
            function cloneFixAttributes(src, dest) {
                var nodeName;
                if (dest.nodeType !== 1) {
                    return;
                }
                if (dest.clearAttributes) {
                    dest.clearAttributes();
                }
                if (dest.mergeAttributes) {
                    dest.mergeAttributes(src);
                }
                nodeName = dest.nodeName.toLowerCase();
                if (nodeName === "object") {
                    dest.outerHTML = src.outerHTML;
                } else if (nodeName === "input" && (src.type === "checkbox" || src.type === "radio")) {
                    if (src.checked) {
                        dest.defaultChecked = dest.checked = src.checked;
                    }
                    if (dest.value !== src.value) {
                        dest.value = src.value;
                    }
                } else if (nodeName === "option") {
                    dest.selected = src.defaultSelected;
                } else if (nodeName === "input" || nodeName === "textarea") {
                    dest.defaultValue = src.defaultValue;
                }
                dest.removeAttribute(jQuery.expando);
            }
            jQuery.buildFragment = function(args, nodes, scripts) {
                var fragment, cacheable, cacheresults, doc, first = args[0];
                if (nodes && nodes[0]) {
                    doc = nodes[0].ownerDocument || nodes[0];
                }
                if (!doc.createDocumentFragment) {
                    doc = document;
                }
                if (args.length === 1 && typeof first === "string" && first.length < 512 && doc === document && first.charAt(0) === "<" && !rnocache.test(first) && (jQuery.support.checkClone || !rchecked.test(first)) && !jQuery.support.unknownElems && rnoshimcache.test(first)) {
                    cacheable = true;
                    cacheresults = jQuery.fragments[first];
                    if (cacheresults && cacheresults !== 1) {
                        fragment = cacheresults;
                    }
                }
                if (!fragment) {
                    fragment = doc.createDocumentFragment();
                    jQuery.clean(args, doc, fragment, scripts);
                }
                if (cacheable) {
                    jQuery.fragments[first] = cacheresults ? fragment : 1;
                }
                return {
                    fragment: fragment,
                    cacheable: cacheable
                };
            };
            jQuery.fragments = {};
            jQuery.each({
                appendTo: "append",
                prependTo: "prepend",
                insertBefore: "before",
                insertAfter: "after",
                replaceAll: "replaceWith"
            }, function(name, original) {
                jQuery.fn[name] = function(selector) {
                    var ret = [], insert = jQuery(selector), parent = this.length === 1 && this[0].parentNode;
                    if (parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1) {
                        insert[original](this[0]);
                        return this;
                    } else {
                        for (var i = 0, l = insert.length; i < l; i++) {
                            var elems = (i > 0 ? this.clone(true) : this).get();
                            jQuery(insert[i])[original](elems);
                            ret = ret.concat(elems);
                        }
                        return this.pushStack(ret, name, insert.selector);
                    }
                };
            });
            function getAll(elem) {
                if (typeof elem.getElementsByTagName !== "undefined") {
                    return elem.getElementsByTagName("*");
                } else if (typeof elem.querySelectorAll !== "undefined") {
                    return elem.querySelectorAll("*");
                } else {
                    return [];
                }
            }
            function fixDefaultChecked(elem) {
                if (elem.type === "checkbox" || elem.type === "radio") {
                    elem.defaultChecked = elem.checked;
                }
            }
            function findInputs(elem) {
                var nodeName = (elem.nodeName || "").toLowerCase();
                if (nodeName === "input") {
                    fixDefaultChecked(elem);
                } else if (nodeName !== "script" && typeof elem.getElementsByTagName !== "undefined") {
                    jQuery.grep(elem.getElementsByTagName("input"), fixDefaultChecked);
                }
            }
            jQuery.extend({
                clone: function(elem, dataAndEvents, deepDataAndEvents) {
                    var clone = elem.cloneNode(true), srcElements, destElements, i;
                    if ((!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) && (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem)) {
                        cloneFixAttributes(elem, clone);
                        srcElements = getAll(elem);
                        destElements = getAll(clone);
                        for (i = 0; srcElements[i]; ++i) {
                            if (destElements[i]) {
                                cloneFixAttributes(srcElements[i], destElements[i]);
                            }
                        }
                    }
                    if (dataAndEvents) {
                        cloneCopyEvent(elem, clone);
                        if (deepDataAndEvents) {
                            srcElements = getAll(elem);
                            destElements = getAll(clone);
                            for (i = 0; srcElements[i]; ++i) {
                                cloneCopyEvent(srcElements[i], destElements[i]);
                            }
                        }
                    }
                    srcElements = destElements = null;
                    return clone;
                },
                clean: function(elems, context, fragment, scripts) {
                    var checkScriptType;
                    context = context || document;
                    if (typeof context.createElement === "undefined") {
                        context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
                    }
                    var ret = [], j;
                    for (var i = 0, elem; (elem = elems[i]) != null; i++) {
                        if (typeof elem === "number") {
                            elem += "";
                        }
                        if (!elem) {
                            continue;
                        }
                        if (typeof elem === "string") {
                            if (!rhtml.test(elem)) {
                                elem = context.createTextNode(elem);
                            } else {
                                elem = elem.replace(rxhtmlTag, "<$1></$2>");
                                var tag = (rtagName.exec(elem) || [ "", "" ])[1].toLowerCase(), wrap = wrapMap[tag] || wrapMap._default, depth = wrap[0], div = context.createElement("div");
                                if (context === document) {
                                    safeFragment.appendChild(div);
                                } else {
                                    createSafeFragment(context).appendChild(div);
                                }
                                div.innerHTML = wrap[1] + elem + wrap[2];
                                while (depth--) {
                                    div = div.lastChild;
                                }
                                if (!jQuery.support.tbody) {
                                    var hasBody = rtbody.test(elem), tbody = tag === "table" && !hasBody ? div.firstChild && div.firstChild.childNodes : wrap[1] === "<table>" && !hasBody ? div.childNodes : [];
                                    for (j = tbody.length - 1; j >= 0; --j) {
                                        if (jQuery.nodeName(tbody[j], "tbody") && !tbody[j].childNodes.length) {
                                            tbody[j].parentNode.removeChild(tbody[j]);
                                        }
                                    }
                                }
                                if (!jQuery.support.leadingWhitespace && rleadingWhitespace.test(elem)) {
                                    div.insertBefore(context.createTextNode(rleadingWhitespace.exec(elem)[0]), div.firstChild);
                                }
                                elem = div.childNodes;
                            }
                        }
                        var len;
                        if (!jQuery.support.appendChecked) {
                            if (elem[0] && typeof (len = elem.length) === "number") {
                                for (j = 0; j < len; j++) {
                                    findInputs(elem[j]);
                                }
                            } else {
                                findInputs(elem);
                            }
                        }
                        if (elem.nodeType) {
                            ret.push(elem);
                        } else {
                            ret = jQuery.merge(ret, elem);
                        }
                    }
                    if (fragment) {
                        checkScriptType = function(elem) {
                            return !elem.type || rscriptType.test(elem.type);
                        };
                        for (i = 0; ret[i]; i++) {
                            if (scripts && jQuery.nodeName(ret[i], "script") && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript")) {
                                scripts.push(ret[i].parentNode ? ret[i].parentNode.removeChild(ret[i]) : ret[i]);
                            } else {
                                if (ret[i].nodeType === 1) {
                                    var jsTags = jQuery.grep(ret[i].getElementsByTagName("script"), checkScriptType);
                                    ret.splice.apply(ret, [ i + 1, 0 ].concat(jsTags));
                                }
                                fragment.appendChild(ret[i]);
                            }
                        }
                    }
                    return ret;
                },
                cleanData: function(elems) {
                    var data, id, cache = jQuery.cache, special = jQuery.event.special, deleteExpando = jQuery.support.deleteExpando;
                    for (var i = 0, elem; (elem = elems[i]) != null; i++) {
                        if (elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()]) {
                            continue;
                        }
                        id = elem[jQuery.expando];
                        if (id) {
                            data = cache[id];
                            if (data && data.events) {
                                for (var type in data.events) {
                                    if (special[type]) {
                                        jQuery.event.remove(elem, type);
                                    } else {
                                        jQuery.removeEvent(elem, type, data.handle);
                                    }
                                }
                                if (data.handle) {
                                    data.handle.elem = null;
                                }
                            }
                            if (deleteExpando) {
                                delete elem[jQuery.expando];
                            } else if (elem.removeAttribute) {
                                elem.removeAttribute(jQuery.expando);
                            }
                            delete cache[id];
                        }
                    }
                }
            });
            function evalScript(i, elem) {
                if (elem.src) {
                    jQuery.ajax({
                        url: elem.src,
                        async: false,
                        dataType: "script"
                    });
                } else {
                    jQuery.globalEval((elem.text || elem.textContent || elem.innerHTML || "").replace(rcleanScript, "/*$0*/"));
                }
                if (elem.parentNode) {
                    elem.parentNode.removeChild(elem);
                }
            }
            var ralpha = /alpha\([^)]*\)/i, ropacity = /opacity=([^)]*)/, rupper = /([A-Z]|^ms)/g, rnumpx = /^-?\d+(?:px)?$/i, rnum = /^-?\d/, rrelNum = /^([\-+])=([\-+.\de]+)/, cssShow = {
                position: "absolute",
                visibility: "hidden",
                display: "block"
            }, cssWidth = [ "Left", "Right" ], cssHeight = [ "Top", "Bottom" ], curCSS, getComputedStyle, currentStyle;
            jQuery.fn.css = function(name, value) {
                if (arguments.length === 2 && value === undefined) {
                    return this;
                }
                return jQuery.access(this, name, value, true, function(elem, name, value) {
                    return value !== undefined ? jQuery.style(elem, name, value) : jQuery.css(elem, name);
                });
            };
            jQuery.extend({
                cssHooks: {
                    opacity: {
                        get: function(elem, computed) {
                            if (computed) {
                                var ret = curCSS(elem, "opacity", "opacity");
                                return ret === "" ? "1" : ret;
                            } else {
                                return elem.style.opacity;
                            }
                        }
                    }
                },
                cssNumber: {
                    fillOpacity: true,
                    fontWeight: true,
                    lineHeight: true,
                    opacity: true,
                    orphans: true,
                    widows: true,
                    zIndex: true,
                    zoom: true
                },
                cssProps: {
                    "float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
                },
                style: function(elem, name, value, extra) {
                    if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
                        return;
                    }
                    var ret, type, origName = jQuery.camelCase(name), style = elem.style, hooks = jQuery.cssHooks[origName];
                    name = jQuery.cssProps[origName] || origName;
                    if (value !== undefined) {
                        type = typeof value;
                        if (type === "string" && (ret = rrelNum.exec(value))) {
                            value = +(ret[1] + 1) * +ret[2] + parseFloat(jQuery.css(elem, name));
                            type = "number";
                        }
                        if (value == null || type === "number" && isNaN(value)) {
                            return;
                        }
                        if (type === "number" && !jQuery.cssNumber[origName]) {
                            value += "px";
                        }
                        if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value)) !== undefined) {
                            try {
                                style[name] = value;
                            } catch (e) {}
                        }
                    } else {
                        if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== undefined) {
                            return ret;
                        }
                        return style[name];
                    }
                },
                css: function(elem, name, extra) {
                    var ret, hooks;
                    name = jQuery.camelCase(name);
                    hooks = jQuery.cssHooks[name];
                    name = jQuery.cssProps[name] || name;
                    if (name === "cssFloat") {
                        name = "float";
                    }
                    if (hooks && "get" in hooks && (ret = hooks.get(elem, true, extra)) !== undefined) {
                        return ret;
                    } else if (curCSS) {
                        return curCSS(elem, name);
                    }
                },
                swap: function(elem, options, callback) {
                    var old = {};
                    for (var name in options) {
                        old[name] = elem.style[name];
                        elem.style[name] = options[name];
                    }
                    callback.call(elem);
                    for (name in options) {
                        elem.style[name] = old[name];
                    }
                }
            });
            jQuery.curCSS = jQuery.css;
            jQuery.each([ "height", "width" ], function(i, name) {
                jQuery.cssHooks[name] = {
                    get: function(elem, computed, extra) {
                        var val;
                        if (computed) {
                            if (elem.offsetWidth !== 0) {
                                return getWH(elem, name, extra);
                            } else {
                                jQuery.swap(elem, cssShow, function() {
                                    val = getWH(elem, name, extra);
                                });
                            }
                            return val;
                        }
                    },
                    set: function(elem, value) {
                        if (rnumpx.test(value)) {
                            value = parseFloat(value);
                            if (value >= 0) {
                                return value + "px";
                            }
                        } else {
                            return value;
                        }
                    }
                };
            });
            if (!jQuery.support.opacity) {
                jQuery.cssHooks.opacity = {
                    get: function(elem, computed) {
                        return ropacity.test((computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "") ? parseFloat(RegExp.$1) / 100 + "" : computed ? "1" : "";
                    },
                    set: function(elem, value) {
                        var style = elem.style, currentStyle = elem.currentStyle, opacity = jQuery.isNumeric(value) ? "alpha(opacity=" + value * 100 + ")" : "", filter = currentStyle && currentStyle.filter || style.filter || "";
                        style.zoom = 1;
                        if (value >= 1 && jQuery.trim(filter.replace(ralpha, "")) === "") {
                            style.removeAttribute("filter");
                            if (currentStyle && !currentStyle.filter) {
                                return;
                            }
                        }
                        style.filter = ralpha.test(filter) ? filter.replace(ralpha, opacity) : filter + " " + opacity;
                    }
                };
            }
            jQuery(function() {
                if (!jQuery.support.reliableMarginRight) {
                    jQuery.cssHooks.marginRight = {
                        get: function(elem, computed) {
                            var ret;
                            jQuery.swap(elem, {
                                display: "inline-block"
                            }, function() {
                                if (computed) {
                                    ret = curCSS(elem, "margin-right", "marginRight");
                                } else {
                                    ret = elem.style.marginRight;
                                }
                            });
                            return ret;
                        }
                    };
                }
            });
            if (document.defaultView && document.defaultView.getComputedStyle) {
                getComputedStyle = function(elem, name) {
                    var ret, defaultView, computedStyle;
                    name = name.replace(rupper, "-$1").toLowerCase();
                    if (!(defaultView = elem.ownerDocument.defaultView)) {
                        return undefined;
                    }
                    if (computedStyle = defaultView.getComputedStyle(elem, null)) {
                        ret = computedStyle.getPropertyValue(name);
                        if (ret === "" && !jQuery.contains(elem.ownerDocument.documentElement, elem)) {
                            ret = jQuery.style(elem, name);
                        }
                    }
                    return ret;
                };
            }
            if (document.documentElement.currentStyle) {
                currentStyle = function(elem, name) {
                    var left, rsLeft, uncomputed, ret = elem.currentStyle && elem.currentStyle[name], style = elem.style;
                    if (ret === null && style && (uncomputed = style[name])) {
                        ret = uncomputed;
                    }
                    if (!rnumpx.test(ret) && rnum.test(ret)) {
                        left = style.left;
                        rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;
                        if (rsLeft) {
                            elem.runtimeStyle.left = elem.currentStyle.left;
                        }
                        style.left = name === "fontSize" ? "1em" : ret || 0;
                        ret = style.pixelLeft + "px";
                        style.left = left;
                        if (rsLeft) {
                            elem.runtimeStyle.left = rsLeft;
                        }
                    }
                    return ret === "" ? "auto" : ret;
                };
            }
            curCSS = getComputedStyle || currentStyle;
            function getWH(elem, name, extra) {
                var val = name === "width" ? elem.offsetWidth : elem.offsetHeight, which = name === "width" ? cssWidth : cssHeight;
                if (val > 0) {
                    if (extra !== "border") {
                        jQuery.each(which, function() {
                            if (!extra) {
                                val -= parseFloat(jQuery.css(elem, "padding" + this)) || 0;
                            }
                            if (extra === "margin") {
                                val += parseFloat(jQuery.css(elem, extra + this)) || 0;
                            } else {
                                val -= parseFloat(jQuery.css(elem, "border" + this + "Width")) || 0;
                            }
                        });
                    }
                    return val + "px";
                }
                val = curCSS(elem, name, name);
                if (val < 0 || val == null) {
                    val = elem.style[name] || 0;
                }
                val = parseFloat(val) || 0;
                if (extra) {
                    jQuery.each(which, function() {
                        val += parseFloat(jQuery.css(elem, "padding" + this)) || 0;
                        if (extra !== "padding") {
                            val += parseFloat(jQuery.css(elem, "border" + this + "Width")) || 0;
                        }
                        if (extra === "margin") {
                            val += parseFloat(jQuery.css(elem, extra + this)) || 0;
                        }
                    });
                }
                return val + "px";
            }
            if (jQuery.expr && jQuery.expr.filters) {
                jQuery.expr.filters.hidden = function(elem) {
                    var width = elem.offsetWidth, height = elem.offsetHeight;
                    return width === 0 && height === 0 || !jQuery.support.reliableHiddenOffsets && (elem.style && elem.style.display || jQuery.css(elem, "display")) === "none";
                };
                jQuery.expr.filters.visible = function(elem) {
                    return !jQuery.expr.filters.hidden(elem);
                };
            }
            var r20 = /%20/g, rbracket = /\[\]$/, rCRLF = /\r?\n/g, rhash = /#.*$/, rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i, rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/, rnoContent = /^(?:GET|HEAD)$/, rprotocol = /^\/\//, rquery = /\?/, rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, rselectTextarea = /^(?:select|textarea)/i, rspacesAjax = /\s+/, rts = /([?&])_=[^&]*/, rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/, _load = jQuery.fn.load, prefilters = {}, transports = {}, ajaxLocation, ajaxLocParts, allTypes = [ "*/" ] + [ "*" ];
            try {
                ajaxLocation = location.href;
            } catch (e) {
                ajaxLocation = document.createElement("a");
                ajaxLocation.href = "";
                ajaxLocation = ajaxLocation.href;
            }
            ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || [];
            function addToPrefiltersOrTransports(structure) {
                return function(dataTypeExpression, func) {
                    if (typeof dataTypeExpression !== "string") {
                        func = dataTypeExpression;
                        dataTypeExpression = "*";
                    }
                    if (jQuery.isFunction(func)) {
                        var dataTypes = dataTypeExpression.toLowerCase().split(rspacesAjax), i = 0, length = dataTypes.length, dataType, list, placeBefore;
                        for (; i < length; i++) {
                            dataType = dataTypes[i];
                            placeBefore = /^\+/.test(dataType);
                            if (placeBefore) {
                                dataType = dataType.substr(1) || "*";
                            }
                            list = structure[dataType] = structure[dataType] || [];
                            list[placeBefore ? "unshift" : "push"](func);
                        }
                    }
                };
            }
            function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR, dataType, inspected) {
                dataType = dataType || options.dataTypes[0];
                inspected = inspected || {};
                inspected[dataType] = true;
                var list = structure[dataType], i = 0, length = list ? list.length : 0, executeOnly = structure === prefilters, selection;
                for (; i < length && (executeOnly || !selection); i++) {
                    selection = list[i](options, originalOptions, jqXHR);
                    if (typeof selection === "string") {
                        if (!executeOnly || inspected[selection]) {
                            selection = undefined;
                        } else {
                            options.dataTypes.unshift(selection);
                            selection = inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR, selection, inspected);
                        }
                    }
                }
                if ((executeOnly || !selection) && !inspected["*"]) {
                    selection = inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR, "*", inspected);
                }
                return selection;
            }
            function ajaxExtend(target, src) {
                var key, deep, flatOptions = jQuery.ajaxSettings.flatOptions || {};
                for (key in src) {
                    if (src[key] !== undefined) {
                        (flatOptions[key] ? target : deep || (deep = {}))[key] = src[key];
                    }
                }
                if (deep) {
                    jQuery.extend(true, target, deep);
                }
            }
            jQuery.fn.extend({
                load: function(url, params, callback) {
                    if (typeof url !== "string" && _load) {
                        return _load.apply(this, arguments);
                    } else if (!this.length) {
                        return this;
                    }
                    var off = url.indexOf(" ");
                    if (off >= 0) {
                        var selector = url.slice(off, url.length);
                        url = url.slice(0, off);
                    }
                    var type = "GET";
                    if (params) {
                        if (jQuery.isFunction(params)) {
                            callback = params;
                            params = undefined;
                        } else if (typeof params === "object") {
                            params = jQuery.param(params, jQuery.ajaxSettings.traditional);
                            type = "POST";
                        }
                    }
                    var self = this;
                    jQuery.ajax({
                        url: url,
                        type: type,
                        dataType: "html",
                        data: params,
                        complete: function(jqXHR, status, responseText) {
                            responseText = jqXHR.responseText;
                            if (jqXHR.isResolved()) {
                                jqXHR.done(function(r) {
                                    responseText = r;
                                });
                                self.html(selector ? jQuery("<div>").append(responseText.replace(rscript, "")).find(selector) : responseText);
                            }
                            if (callback) {
                                self.each(callback, [ responseText, status, jqXHR ]);
                            }
                        }
                    });
                    return this;
                },
                serialize: function() {
                    return jQuery.param(this.serializeArray());
                },
                serializeArray: function() {
                    return this.map(function() {
                        return this.elements ? jQuery.makeArray(this.elements) : this;
                    }).filter(function() {
                        return this.name && !this.disabled && (this.checked || rselectTextarea.test(this.nodeName) || rinput.test(this.type));
                    }).map(function(i, elem) {
                        var val = jQuery(this).val();
                        return val == null ? null : jQuery.isArray(val) ? jQuery.map(val, function(val, i) {
                            return {
                                name: elem.name,
                                value: val.replace(rCRLF, "\r\n")
                            };
                        }) : {
                            name: elem.name,
                            value: val.replace(rCRLF, "\r\n")
                        };
                    }).get();
                }
            });
            jQuery.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function(i, o) {
                jQuery.fn[o] = function(f) {
                    return this.bind(o, f);
                };
            });
            jQuery.each([ "get", "post" ], function(i, method) {
                jQuery[method] = function(url, data, callback, type) {
                    if (jQuery.isFunction(data)) {
                        type = type || callback;
                        callback = data;
                        data = undefined;
                    }
                    return jQuery.ajax({
                        type: method,
                        url: url,
                        data: data,
                        success: callback,
                        dataType: type
                    });
                };
            });
            jQuery.extend({
                getScript: function(url, callback) {
                    return jQuery.get(url, undefined, callback, "script");
                },
                getJSON: function(url, data, callback) {
                    return jQuery.get(url, data, callback, "json");
                },
                ajaxSetup: function(target, settings) {
                    if (settings) {
                        ajaxExtend(target, jQuery.ajaxSettings);
                    } else {
                        settings = target;
                        target = jQuery.ajaxSettings;
                    }
                    ajaxExtend(target, settings);
                    return target;
                },
                ajaxSettings: {
                    url: ajaxLocation,
                    isLocal: rlocalProtocol.test(ajaxLocParts[1]),
                    global: true,
                    type: "GET",
                    contentType: "application/x-www-form-urlencoded",
                    processData: true,
                    async: true,
                    accepts: {
                        xml: "application/xml, text/xml",
                        html: "text/html",
                        text: "text/plain",
                        json: "application/json, text/javascript",
                        "*": allTypes
                    },
                    contents: {
                        xml: /xml/,
                        html: /html/,
                        json: /json/
                    },
                    responseFields: {
                        xml: "responseXML",
                        text: "responseText"
                    },
                    converters: {
                        "* text": window.String,
                        "text html": true,
                        "text json": jQuery.parseJSON,
                        "text xml": jQuery.parseXML
                    },
                    flatOptions: {
                        context: true,
                        url: true
                    }
                },
                ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
                ajaxTransport: addToPrefiltersOrTransports(transports),
                ajax: function(url, options) {
                    if (typeof url === "object") {
                        options = url;
                        url = undefined;
                    }
                    options = options || {};
                    var s = jQuery.ajaxSetup({}, options), callbackContext = s.context || s, globalEventContext = callbackContext !== s && (callbackContext.nodeType || callbackContext instanceof jQuery) ? jQuery(callbackContext) : jQuery.event, deferred = jQuery.Deferred(), completeDeferred = jQuery.Callbacks("once memory"), statusCode = s.statusCode || {}, ifModifiedKey, requestHeaders = {}, requestHeadersNames = {}, responseHeadersString, responseHeaders, transport, timeoutTimer, parts, state = 0, fireGlobals, i, jqXHR = {
                        readyState: 0,
                        setRequestHeader: function(name, value) {
                            if (!state) {
                                var lname = name.toLowerCase();
                                name = requestHeadersNames[lname] = requestHeadersNames[lname] || name;
                                requestHeaders[name] = value;
                            }
                            return this;
                        },
                        getAllResponseHeaders: function() {
                            return state === 2 ? responseHeadersString : null;
                        },
                        getResponseHeader: function(key) {
                            var match;
                            if (state === 2) {
                                if (!responseHeaders) {
                                    responseHeaders = {};
                                    while (match = rheaders.exec(responseHeadersString)) {
                                        responseHeaders[match[1].toLowerCase()] = match[2];
                                    }
                                }
                                match = responseHeaders[key.toLowerCase()];
                            }
                            return match === undefined ? null : match;
                        },
                        overrideMimeType: function(type) {
                            if (!state) {
                                s.mimeType = type;
                            }
                            return this;
                        },
                        abort: function(statusText) {
                            statusText = statusText || "abort";
                            if (transport) {
                                transport.abort(statusText);
                            }
                            done(0, statusText);
                            return this;
                        }
                    };
                    function done(status, nativeStatusText, responses, headers) {
                        if (state === 2) {
                            return;
                        }
                        state = 2;
                        if (timeoutTimer) {
                            clearTimeout(timeoutTimer);
                        }
                        transport = undefined;
                        responseHeadersString = headers || "";
                        jqXHR.readyState = status > 0 ? 4 : 0;
                        var isSuccess, success, error, statusText = nativeStatusText, response = responses ? ajaxHandleResponses(s, jqXHR, responses) : undefined, lastModified, etag;
                        if (status >= 200 && status < 300 || status === 304) {
                            if (s.ifModified) {
                                if (lastModified = jqXHR.getResponseHeader("Last-Modified")) {
                                    jQuery.lastModified[ifModifiedKey] = lastModified;
                                }
                                if (etag = jqXHR.getResponseHeader("Etag")) {
                                    jQuery.etag[ifModifiedKey] = etag;
                                }
                            }
                            if (status === 304) {
                                statusText = "notmodified";
                                isSuccess = true;
                            } else {
                                try {
                                    success = ajaxConvert(s, response);
                                    statusText = "success";
                                    isSuccess = true;
                                } catch (e) {
                                    statusText = "parsererror";
                                    error = e;
                                }
                            }
                        } else {
                            error = statusText;
                            if (!statusText || status) {
                                statusText = "error";
                                if (status < 0) {
                                    status = 0;
                                }
                            }
                        }
                        jqXHR.status = status;
                        jqXHR.statusText = "" + (nativeStatusText || statusText);
                        if (isSuccess) {
                            deferred.resolveWith(callbackContext, [ success, statusText, jqXHR ]);
                        } else {
                            deferred.rejectWith(callbackContext, [ jqXHR, statusText, error ]);
                        }
                        jqXHR.statusCode(statusCode);
                        statusCode = undefined;
                        if (fireGlobals) {
                            globalEventContext.trigger("ajax" + (isSuccess ? "Success" : "Error"), [ jqXHR, s, isSuccess ? success : error ]);
                        }
                        completeDeferred.fireWith(callbackContext, [ jqXHR, statusText ]);
                        if (fireGlobals) {
                            globalEventContext.trigger("ajaxComplete", [ jqXHR, s ]);
                            if (!--jQuery.active) {
                                jQuery.event.trigger("ajaxStop");
                            }
                        }
                    }
                    deferred.promise(jqXHR);
                    jqXHR.success = jqXHR.done;
                    jqXHR.error = jqXHR.fail;
                    jqXHR.complete = completeDeferred.add;
                    jqXHR.statusCode = function(map) {
                        if (map) {
                            var tmp;
                            if (state < 2) {
                                for (tmp in map) {
                                    statusCode[tmp] = [ statusCode[tmp], map[tmp] ];
                                }
                            } else {
                                tmp = map[jqXHR.status];
                                jqXHR.then(tmp, tmp);
                            }
                        }
                        return this;
                    };
                    s.url = ((url || s.url) + "").replace(rhash, "").replace(rprotocol, ajaxLocParts[1] + "//");
                    s.dataTypes = jQuery.trim(s.dataType || "*").toLowerCase().split(rspacesAjax);
                    if (s.crossDomain == null) {
                        parts = rurl.exec(s.url.toLowerCase());
                        s.crossDomain = !!(parts && (parts[1] != ajaxLocParts[1] || parts[2] != ajaxLocParts[2] || (parts[3] || (parts[1] === "http:" ? 80 : 443)) != (ajaxLocParts[3] || (ajaxLocParts[1] === "http:" ? 80 : 443))));
                    }
                    if (s.data && s.processData && typeof s.data !== "string") {
                        s.data = jQuery.param(s.data, s.traditional);
                    }
                    inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);
                    if (state === 2) {
                        return false;
                    }
                    fireGlobals = s.global;
                    s.type = s.type.toUpperCase();
                    s.hasContent = !rnoContent.test(s.type);
                    if (fireGlobals && jQuery.active++ === 0) {
                        jQuery.event.trigger("ajaxStart");
                    }
                    if (!s.hasContent) {
                        if (s.data) {
                            s.url += (rquery.test(s.url) ? "&" : "?") + s.data;
                            delete s.data;
                        }
                        ifModifiedKey = s.url;
                        if (s.cache === false) {
                            var ts = jQuery.now(), ret = s.url.replace(rts, "$1_=" + ts);
                            s.url = ret + (ret === s.url ? (rquery.test(s.url) ? "&" : "?") + "_=" + ts : "");
                        }
                    }
                    if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
                        jqXHR.setRequestHeader("Content-Type", s.contentType);
                    }
                    if (s.ifModified) {
                        ifModifiedKey = ifModifiedKey || s.url;
                        if (jQuery.lastModified[ifModifiedKey]) {
                            jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[ifModifiedKey]);
                        }
                        if (jQuery.etag[ifModifiedKey]) {
                            jqXHR.setRequestHeader("If-None-Match", jQuery.etag[ifModifiedKey]);
                        }
                    }
                    jqXHR.setRequestHeader("Accept", s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "") : s.accepts["*"]);
                    for (i in s.headers) {
                        jqXHR.setRequestHeader(i, s.headers[i]);
                    }
                    if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === false || state === 2)) {
                        jqXHR.abort();
                        return false;
                    }
                    for (i in {
                        success: 1,
                        error: 1,
                        complete: 1
                    }) {
                        jqXHR[i](s[i]);
                    }
                    transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);
                    if (!transport) {
                        done(-1, "No Transport");
                    } else {
                        jqXHR.readyState = 1;
                        if (fireGlobals) {
                            globalEventContext.trigger("ajaxSend", [ jqXHR, s ]);
                        }
                        if (s.async && s.timeout > 0) {
                            timeoutTimer = setTimeout(function() {
                                jqXHR.abort("timeout");
                            }, s.timeout);
                        }
                        try {
                            state = 1;
                            transport.send(requestHeaders, done);
                        } catch (e) {
                            if (state < 2) {
                                done(-1, e);
                            } else {
                                jQuery.error(e);
                            }
                        }
                    }
                    return jqXHR;
                },
                param: function(a, traditional) {
                    var s = [], add = function(key, value) {
                        value = jQuery.isFunction(value) ? value() : value;
                        s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
                    };
                    if (traditional === undefined) {
                        traditional = jQuery.ajaxSettings.traditional;
                    }
                    if (jQuery.isArray(a) || a.jquery && !jQuery.isPlainObject(a)) {
                        jQuery.each(a, function() {
                            add(this.name, this.value);
                        });
                    } else {
                        for (var prefix in a) {
                            buildParams(prefix, a[prefix], traditional, add);
                        }
                    }
                    return s.join("&").replace(r20, "+");
                }
            });
            function buildParams(prefix, obj, traditional, add) {
                if (jQuery.isArray(obj)) {
                    jQuery.each(obj, function(i, v) {
                        if (traditional || rbracket.test(prefix)) {
                            add(prefix, v);
                        } else {
                            buildParams(prefix + "[" + (typeof v === "object" || jQuery.isArray(v) ? i : "") + "]", v, traditional, add);
                        }
                    });
                } else if (!traditional && obj != null && typeof obj === "object") {
                    for (var name in obj) {
                        buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
                    }
                } else {
                    add(prefix, obj);
                }
            }
            jQuery.extend({
                active: 0,
                lastModified: {},
                etag: {}
            });
            function ajaxHandleResponses(s, jqXHR, responses) {
                var contents = s.contents, dataTypes = s.dataTypes, responseFields = s.responseFields, ct, type, finalDataType, firstDataType;
                for (type in responseFields) {
                    if (type in responses) {
                        jqXHR[responseFields[type]] = responses[type];
                    }
                }
                while (dataTypes[0] === "*") {
                    dataTypes.shift();
                    if (ct === undefined) {
                        ct = s.mimeType || jqXHR.getResponseHeader("content-type");
                    }
                }
                if (ct) {
                    for (type in contents) {
                        if (contents[type] && contents[type].test(ct)) {
                            dataTypes.unshift(type);
                            break;
                        }
                    }
                }
                if (dataTypes[0] in responses) {
                    finalDataType = dataTypes[0];
                } else {
                    for (type in responses) {
                        if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
                            finalDataType = type;
                            break;
                        }
                        if (!firstDataType) {
                            firstDataType = type;
                        }
                    }
                    finalDataType = finalDataType || firstDataType;
                }
                if (finalDataType) {
                    if (finalDataType !== dataTypes[0]) {
                        dataTypes.unshift(finalDataType);
                    }
                    return responses[finalDataType];
                }
            }
            function ajaxConvert(s, response) {
                if (s.dataFilter) {
                    response = s.dataFilter(response, s.dataType);
                }
                var dataTypes = s.dataTypes, converters = {}, i, key, length = dataTypes.length, tmp, current = dataTypes[0], prev, conversion, conv, conv1, conv2;
                for (i = 1; i < length; i++) {
                    if (i === 1) {
                        for (key in s.converters) {
                            if (typeof key === "string") {
                                converters[key.toLowerCase()] = s.converters[key];
                            }
                        }
                    }
                    prev = current;
                    current = dataTypes[i];
                    if (current === "*") {
                        current = prev;
                    } else if (prev !== "*" && prev !== current) {
                        conversion = prev + " " + current;
                        conv = converters[conversion] || converters["* " + current];
                        if (!conv) {
                            conv2 = undefined;
                            for (conv1 in converters) {
                                tmp = conv1.split(" ");
                                if (tmp[0] === prev || tmp[0] === "*") {
                                    conv2 = converters[tmp[1] + " " + current];
                                    if (conv2) {
                                        conv1 = converters[conv1];
                                        if (conv1 === true) {
                                            conv = conv2;
                                        } else if (conv2 === true) {
                                            conv = conv1;
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                        if (!(conv || conv2)) {
                            jQuery.error("No conversion from " + conversion.replace(" ", " to "));
                        }
                        if (conv !== true) {
                            response = conv ? conv(response) : conv2(conv1(response));
                        }
                    }
                }
                return response;
            }
            var jsc = jQuery.now(), jsre = /(\=)\?(&|$)|\?\?/i;
            jQuery.ajaxSetup({
                jsonp: "callback",
                jsonpCallback: function() {
                    return jQuery.expando + "_" + jsc++;
                }
            });
            jQuery.ajaxPrefilter("json jsonp", function(s, originalSettings, jqXHR) {
                var inspectData = s.contentType === "application/x-www-form-urlencoded" && typeof s.data === "string";
                if (s.dataTypes[0] === "jsonp" || s.jsonp !== false && (jsre.test(s.url) || inspectData && jsre.test(s.data))) {
                    var responseContainer, jsonpCallback = s.jsonpCallback = jQuery.isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback, previous = window[jsonpCallback], url = s.url, data = s.data, replace = "$1" + jsonpCallback + "$2";
                    if (s.jsonp !== false) {
                        url = url.replace(jsre, replace);
                        if (s.url === url) {
                            if (inspectData) {
                                data = data.replace(jsre, replace);
                            }
                            if (s.data === data) {
                                url += (/\?/.test(url) ? "&" : "?") + s.jsonp + "=" + jsonpCallback;
                            }
                        }
                    }
                    s.url = url;
                    s.data = data;
                    window[jsonpCallback] = function(response) {
                        responseContainer = [ response ];
                    };
                    jqXHR.always(function() {
                        window[jsonpCallback] = previous;
                        if (responseContainer && jQuery.isFunction(previous)) {
                            window[jsonpCallback](responseContainer[0]);
                        }
                    });
                    s.converters["script json"] = function() {
                        if (!responseContainer) {
                            jQuery.error(jsonpCallback + " was not called");
                        }
                        return responseContainer[0];
                    };
                    s.dataTypes[0] = "json";
                    return "script";
                }
            });
            jQuery.ajaxSetup({
                accepts: {
                    script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
                },
                contents: {
                    script: /javascript|ecmascript/
                },
                converters: {
                    "text script": function(text) {
                        jQuery.globalEval(text);
                        return text;
                    }
                }
            });
            jQuery.ajaxPrefilter("script", function(s) {
                if (s.cache === undefined) {
                    s.cache = false;
                }
                if (s.crossDomain) {
                    s.type = "GET";
                    s.global = false;
                }
            });
            jQuery.ajaxTransport("script", function(s) {
                if (s.crossDomain) {
                    var script, head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
                    return {
                        send: function(_, callback) {
                            script = document.createElement("script");
                            script.async = "async";
                            if (s.scriptCharset) {
                                script.charset = s.scriptCharset;
                            }
                            script.src = s.url;
                            script.onload = script.onreadystatechange = function(_, isAbort) {
                                if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
                                    script.onload = script.onreadystatechange = null;
                                    if (head && script.parentNode) {
                                        head.removeChild(script);
                                    }
                                    script = undefined;
                                    if (!isAbort) {
                                        callback(200, "success");
                                    }
                                }
                            };
                            head.insertBefore(script, head.firstChild);
                        },
                        abort: function() {
                            if (script) {
                                script.onload(0, 1);
                            }
                        }
                    };
                }
            });
            var xhrOnUnloadAbort = window.ActiveXObject ? function() {
                for (var key in xhrCallbacks) {
                    xhrCallbacks[key](0, 1);
                }
            } : false, xhrId = 0, xhrCallbacks;
            function createStandardXHR() {
                try {
                    return new window.XMLHttpRequest;
                } catch (e) {}
            }
            function createActiveXHR() {
                try {
                    return new window.ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {}
            }
            jQuery.ajaxSettings.xhr = window.ActiveXObject ? function() {
                return !this.isLocal && createStandardXHR() || createActiveXHR();
            } : createStandardXHR;
            (function(xhr) {
                jQuery.extend(jQuery.support, {
                    ajax: !!xhr,
                    cors: !!xhr && "withCredentials" in xhr
                });
            })(jQuery.ajaxSettings.xhr());
            if (jQuery.support.ajax) {
                jQuery.ajaxTransport(function(s) {
                    if (!s.crossDomain || jQuery.support.cors) {
                        var callback;
                        return {
                            send: function(headers, complete) {
                                var xhr = s.xhr(), handle, i;
                                if (s.username) {
                                    xhr.open(s.type, s.url, s.async, s.username, s.password);
                                } else {
                                    xhr.open(s.type, s.url, s.async);
                                }
                                if (s.xhrFields) {
                                    for (i in s.xhrFields) {
                                        xhr[i] = s.xhrFields[i];
                                    }
                                }
                                if (s.mimeType && xhr.overrideMimeType) {
                                    xhr.overrideMimeType(s.mimeType);
                                }
                                if (!s.crossDomain && !headers["X-Requested-With"]) {
                                    headers["X-Requested-With"] = "XMLHttpRequest";
                                }
                                try {
                                    for (i in headers) {
                                        xhr.setRequestHeader(i, headers[i]);
                                    }
                                } catch (_) {}
                                xhr.send(s.hasContent && s.data || null);
                                callback = function(_, isAbort) {
                                    var status, statusText, responseHeaders, responses, xml;
                                    try {
                                        if (callback && (isAbort || xhr.readyState === 4)) {
                                            callback = undefined;
                                            if (handle) {
                                                xhr.onreadystatechange = jQuery.noop;
                                                if (xhrOnUnloadAbort) {
                                                    delete xhrCallbacks[handle];
                                                }
                                            }
                                            if (isAbort) {
                                                if (xhr.readyState !== 4) {
                                                    xhr.abort();
                                                }
                                            } else {
                                                status = xhr.status;
                                                responseHeaders = xhr.getAllResponseHeaders();
                                                responses = {};
                                                xml = xhr.responseXML;
                                                if (xml && xml.documentElement) {
                                                    responses.xml = xml;
                                                }
                                                responses.text = xhr.responseText;
                                                try {
                                                    statusText = xhr.statusText;
                                                } catch (e) {
                                                    statusText = "";
                                                }
                                                if (!status && s.isLocal && !s.crossDomain) {
                                                    status = responses.text ? 200 : 404;
                                                } else if (status === 1223) {
                                                    status = 204;
                                                }
                                            }
                                        }
                                    } catch (firefoxAccessException) {
                                        if (!isAbort) {
                                            complete(-1, firefoxAccessException);
                                        }
                                    }
                                    if (responses) {
                                        complete(status, statusText, responses, responseHeaders);
                                    }
                                };
                                if (!s.async || xhr.readyState === 4) {
                                    callback();
                                } else {
                                    handle = ++xhrId;
                                    if (xhrOnUnloadAbort) {
                                        if (!xhrCallbacks) {
                                            xhrCallbacks = {};
                                            jQuery(window).unload(xhrOnUnloadAbort);
                                        }
                                        xhrCallbacks[handle] = callback;
                                    }
                                    xhr.onreadystatechange = callback;
                                }
                            },
                            abort: function() {
                                if (callback) {
                                    callback(0, 1);
                                }
                            }
                        };
                    }
                });
            }
            var elemdisplay = {}, iframe, iframeDoc, rfxtypes = /^(?:toggle|show|hide)$/, rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i, timerId, fxAttrs = [ [ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ], [ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ], [ "opacity" ] ], fxNow;
            jQuery.fn.extend({
                show: function(speed, easing, callback) {
                    var elem, display;
                    if (speed || speed === 0) {
                        return this.animate(genFx("show", 3), speed, easing, callback);
                    } else {
                        for (var i = 0, j = this.length; i < j; i++) {
                            elem = this[i];
                            if (elem.style) {
                                display = elem.style.display;
                                if (!jQuery._data(elem, "olddisplay") && display === "none") {
                                    display = elem.style.display = "";
                                }
                                if (display === "" && jQuery.css(elem, "display") === "none") {
                                    jQuery._data(elem, "olddisplay", defaultDisplay(elem.nodeName));
                                }
                            }
                        }
                        for (i = 0; i < j; i++) {
                            elem = this[i];
                            if (elem.style) {
                                display = elem.style.display;
                                if (display === "" || display === "none") {
                                    elem.style.display = jQuery._data(elem, "olddisplay") || "";
                                }
                            }
                        }
                        return this;
                    }
                },
                hide: function(speed, easing, callback) {
                    if (speed || speed === 0) {
                        return this.animate(genFx("hide", 3), speed, easing, callback);
                    } else {
                        var elem, display, i = 0, j = this.length;
                        for (; i < j; i++) {
                            elem = this[i];
                            if (elem.style) {
                                display = jQuery.css(elem, "display");
                                if (display !== "none" && !jQuery._data(elem, "olddisplay")) {
                                    jQuery._data(elem, "olddisplay", display);
                                }
                            }
                        }
                        for (i = 0; i < j; i++) {
                            if (this[i].style) {
                                this[i].style.display = "none";
                            }
                        }
                        return this;
                    }
                },
                _toggle: jQuery.fn.toggle,
                toggle: function(fn, fn2, callback) {
                    var bool = typeof fn === "boolean";
                    if (jQuery.isFunction(fn) && jQuery.isFunction(fn2)) {
                        this._toggle.apply(this, arguments);
                    } else if (fn == null || bool) {
                        this.each(function() {
                            var state = bool ? fn : jQuery(this).is(":hidden");
                            jQuery(this)[state ? "show" : "hide"]();
                        });
                    } else {
                        this.animate(genFx("toggle", 3), fn, fn2, callback);
                    }
                    return this;
                },
                fadeTo: function(speed, to, easing, callback) {
                    return this.filter(":hidden").css("opacity", 0).show().end().animate({
                        opacity: to
                    }, speed, easing, callback);
                },
                animate: function(prop, speed, easing, callback) {
                    var optall = jQuery.speed(speed, easing, callback);
                    if (jQuery.isEmptyObject(prop)) {
                        return this.each(optall.complete, [ false ]);
                    }
                    prop = jQuery.extend({}, prop);
                    function doAnimation() {
                        if (optall.queue === false) {
                            jQuery._mark(this);
                        }
                        var opt = jQuery.extend({}, optall), isElement = this.nodeType === 1, hidden = isElement && jQuery(this).is(":hidden"), name, val, p, e, parts, start, end, unit, method;
                        opt.animatedProperties = {};
                        for (p in prop) {
                            name = jQuery.camelCase(p);
                            if (p !== name) {
                                prop[name] = prop[p];
                                delete prop[p];
                            }
                            val = prop[name];
                            if (jQuery.isArray(val)) {
                                opt.animatedProperties[name] = val[1];
                                val = prop[name] = val[0];
                            } else {
                                opt.animatedProperties[name] = opt.specialEasing && opt.specialEasing[name] || opt.easing || "swing";
                            }
                            if (val === "hide" && hidden || val === "show" && !hidden) {
                                return opt.complete.call(this);
                            }
                            if (isElement && (name === "height" || name === "width")) {
                                opt.overflow = [ this.style.overflow, this.style.overflowX, this.style.overflowY ];
                                if (jQuery.css(this, "display") === "inline" && jQuery.css(this, "float") === "none") {
                                    if (!jQuery.support.inlineBlockNeedsLayout || defaultDisplay(this.nodeName) === "inline") {
                                        this.style.display = "inline-block";
                                    } else {
                                        this.style.zoom = 1;
                                    }
                                }
                            }
                        }
                        if (opt.overflow != null) {
                            this.style.overflow = "hidden";
                        }
                        for (p in prop) {
                            e = new jQuery.fx(this, opt, p);
                            val = prop[p];
                            if (rfxtypes.test(val)) {
                                method = jQuery._data(this, "toggle" + p) || (val === "toggle" ? hidden ? "show" : "hide" : 0);
                                if (method) {
                                    jQuery._data(this, "toggle" + p, method === "show" ? "hide" : "show");
                                    e[method]();
                                } else {
                                    e[val]();
                                }
                            } else {
                                parts = rfxnum.exec(val);
                                start = e.cur();
                                if (parts) {
                                    end = parseFloat(parts[2]);
                                    unit = parts[3] || (jQuery.cssNumber[p] ? "" : "px");
                                    if (unit !== "px") {
                                        jQuery.style(this, p, (end || 1) + unit);
                                        start = (end || 1) / e.cur() * start;
                                        jQuery.style(this, p, start + unit);
                                    }
                                    if (parts[1]) {
                                        end = (parts[1] === "-=" ? -1 : 1) * end + start;
                                    }
                                    e.custom(start, end, unit);
                                } else {
                                    e.custom(start, val, "");
                                }
                            }
                        }
                        return true;
                    }
                    return optall.queue === false ? this.each(doAnimation) : this.queue(optall.queue, doAnimation);
                },
                stop: function(type, clearQueue, gotoEnd) {
                    if (typeof type !== "string") {
                        gotoEnd = clearQueue;
                        clearQueue = type;
                        type = undefined;
                    }
                    if (clearQueue && type !== false) {
                        this.queue(type || "fx", []);
                    }
                    return this.each(function() {
                        var i, hadTimers = false, timers = jQuery.timers, data = jQuery._data(this);
                        if (!gotoEnd) {
                            jQuery._unmark(true, this);
                        }
                        function stopQueue(elem, data, i) {
                            var hooks = data[i];
                            jQuery.removeData(elem, i, true);
                            hooks.stop(gotoEnd);
                        }
                        if (type == null) {
                            for (i in data) {
                                if (data[i].stop && i.indexOf(".run") === i.length - 4) {
                                    stopQueue(this, data, i);
                                }
                            }
                        } else if (data[i = type + ".run"] && data[i].stop) {
                            stopQueue(this, data, i);
                        }
                        for (i = timers.length; i--; ) {
                            if (timers[i].elem === this && (type == null || timers[i].queue === type)) {
                                if (gotoEnd) {
                                    timers[i](true);
                                } else {
                                    timers[i].saveState();
                                }
                                hadTimers = true;
                                timers.splice(i, 1);
                            }
                        }
                        if (!(gotoEnd && hadTimers)) {
                            jQuery.dequeue(this, type);
                        }
                    });
                }
            });
            function createFxNow() {
                setTimeout(clearFxNow, 0);
                return fxNow = jQuery.now();
            }
            function clearFxNow() {
                fxNow = undefined;
            }
            function genFx(type, num) {
                var obj = {};
                jQuery.each(fxAttrs.concat.apply([], fxAttrs.slice(0, num)), function() {
                    obj[this] = type;
                });
                return obj;
            }
            jQuery.each({
                slideDown: genFx("show", 1),
                slideUp: genFx("hide", 1),
                slideToggle: genFx("toggle", 1),
                fadeIn: {
                    opacity: "show"
                },
                fadeOut: {
                    opacity: "hide"
                },
                fadeToggle: {
                    opacity: "toggle"
                }
            }, function(name, props) {
                jQuery.fn[name] = function(speed, easing, callback) {
                    return this.animate(props, speed, easing, callback);
                };
            });
            jQuery.extend({
                speed: function(speed, easing, fn) {
                    var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
                        complete: fn || !fn && easing || jQuery.isFunction(speed) && speed,
                        duration: speed,
                        easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
                    };
                    opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration : opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default;
                    if (opt.queue == null || opt.queue === true) {
                        opt.queue = "fx";
                    }
                    opt.old = opt.complete;
                    opt.complete = function(noUnmark) {
                        if (jQuery.isFunction(opt.old)) {
                            opt.old.call(this);
                        }
                        if (opt.queue) {
                            jQuery.dequeue(this, opt.queue);
                        } else if (noUnmark !== false) {
                            jQuery._unmark(this);
                        }
                    };
                    return opt;
                },
                easing: {
                    linear: function(p, n, firstNum, diff) {
                        return firstNum + diff * p;
                    },
                    swing: function(p, n, firstNum, diff) {
                        return (-Math.cos(p * Math.PI) / 2 + .5) * diff + firstNum;
                    }
                },
                timers: [],
                fx: function(elem, options, prop) {
                    this.options = options;
                    this.elem = elem;
                    this.prop = prop;
                    options.orig = options.orig || {};
                }
            });
            jQuery.fx.prototype = {
                update: function() {
                    if (this.options.step) {
                        this.options.step.call(this.elem, this.now, this);
                    }
                    (jQuery.fx.step[this.prop] || jQuery.fx.step._default)(this);
                },
                cur: function() {
                    if (this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null)) {
                        return this.elem[this.prop];
                    }
                    var parsed, r = jQuery.css(this.elem, this.prop);
                    return isNaN(parsed = parseFloat(r)) ? !r || r === "auto" ? 0 : r : parsed;
                },
                custom: function(from, to, unit) {
                    var self = this, fx = jQuery.fx;
                    this.startTime = fxNow || createFxNow();
                    this.end = to;
                    this.now = this.start = from;
                    this.pos = this.state = 0;
                    this.unit = unit || this.unit || (jQuery.cssNumber[this.prop] ? "" : "px");
                    function t(gotoEnd) {
                        return self.step(gotoEnd);
                    }
                    t.queue = this.options.queue;
                    t.elem = this.elem;
                    t.saveState = function() {
                        if (self.options.hide && jQuery._data(self.elem, "fxshow" + self.prop) === undefined) {
                            jQuery._data(self.elem, "fxshow" + self.prop, self.start);
                        }
                    };
                    if (t() && jQuery.timers.push(t) && !timerId) {
                        timerId = setInterval(fx.tick, fx.interval);
                    }
                },
                show: function() {
                    var dataShow = jQuery._data(this.elem, "fxshow" + this.prop);
                    this.options.orig[this.prop] = dataShow || jQuery.style(this.elem, this.prop);
                    this.options.show = true;
                    if (dataShow !== undefined) {
                        this.custom(this.cur(), dataShow);
                    } else {
                        this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur());
                    }
                    jQuery(this.elem).show();
                },
                hide: function() {
                    this.options.orig[this.prop] = jQuery._data(this.elem, "fxshow" + this.prop) || jQuery.style(this.elem, this.prop);
                    this.options.hide = true;
                    this.custom(this.cur(), 0);
                },
                step: function(gotoEnd) {
                    var p, n, complete, t = fxNow || createFxNow(), done = true, elem = this.elem, options = this.options;
                    if (gotoEnd || t >= options.duration + this.startTime) {
                        this.now = this.end;
                        this.pos = this.state = 1;
                        this.update();
                        options.animatedProperties[this.prop] = true;
                        for (p in options.animatedProperties) {
                            if (options.animatedProperties[p] !== true) {
                                done = false;
                            }
                        }
                        if (done) {
                            if (options.overflow != null && !jQuery.support.shrinkWrapBlocks) {
                                jQuery.each([ "", "X", "Y" ], function(index, value) {
                                    elem.style["overflow" + value] = options.overflow[index];
                                });
                            }
                            if (options.hide) {
                                jQuery(elem).hide();
                            }
                            if (options.hide || options.show) {
                                for (p in options.animatedProperties) {
                                    jQuery.style(elem, p, options.orig[p]);
                                    jQuery.removeData(elem, "fxshow" + p, true);
                                    jQuery.removeData(elem, "toggle" + p, true);
                                }
                            }
                            complete = options.complete;
                            if (complete) {
                                options.complete = false;
                                complete.call(elem);
                            }
                        }
                        return false;
                    } else {
                        if (options.duration == Infinity) {
                            this.now = t;
                        } else {
                            n = t - this.startTime;
                            this.state = n / options.duration;
                            this.pos = jQuery.easing[options.animatedProperties[this.prop]](this.state, n, 0, 1, options.duration);
                            this.now = this.start + (this.end - this.start) * this.pos;
                        }
                        this.update();
                    }
                    return true;
                }
            };
            jQuery.extend(jQuery.fx, {
                tick: function() {
                    var timer, timers = jQuery.timers, i = 0;
                    for (; i < timers.length; i++) {
                        timer = timers[i];
                        if (!timer() && timers[i] === timer) {
                            timers.splice(i--, 1);
                        }
                    }
                    if (!timers.length) {
                        jQuery.fx.stop();
                    }
                },
                interval: 13,
                stop: function() {
                    clearInterval(timerId);
                    timerId = null;
                },
                speeds: {
                    slow: 600,
                    fast: 200,
                    _default: 400
                },
                step: {
                    opacity: function(fx) {
                        jQuery.style(fx.elem, "opacity", fx.now);
                    },
                    _default: function(fx) {
                        if (fx.elem.style && fx.elem.style[fx.prop] != null) {
                            fx.elem.style[fx.prop] = fx.now + fx.unit;
                        } else {
                            fx.elem[fx.prop] = fx.now;
                        }
                    }
                }
            });
            jQuery.each([ "width", "height" ], function(i, prop) {
                jQuery.fx.step[prop] = function(fx) {
                    jQuery.style(fx.elem, prop, Math.max(0, fx.now));
                };
            });
            if (jQuery.expr && jQuery.expr.filters) {
                jQuery.expr.filters.animated = function(elem) {
                    return jQuery.grep(jQuery.timers, function(fn) {
                        return elem === fn.elem;
                    }).length;
                };
            }
            function defaultDisplay(nodeName) {
                if (!elemdisplay[nodeName]) {
                    var body = document.body, elem = jQuery("<" + nodeName + ">").appendTo(body), display = elem.css("display");
                    elem.remove();
                    if (display === "none" || display === "") {
                        if (!iframe) {
                            iframe = document.createElement("iframe");
                            iframe.frameBorder = iframe.width = iframe.height = 0;
                        }
                        body.appendChild(iframe);
                        if (!iframeDoc || !iframe.createElement) {
                            iframeDoc = (iframe.contentWindow || iframe.contentDocument).document;
                            iframeDoc.write((document.compatMode === "CSS1Compat" ? "<!doctype html>" : "") + "<html><body>");
                            iframeDoc.close();
                        }
                        elem = iframeDoc.createElement(nodeName);
                        iframeDoc.body.appendChild(elem);
                        display = jQuery.css(elem, "display");
                        body.removeChild(iframe);
                    }
                    elemdisplay[nodeName] = display;
                }
                return elemdisplay[nodeName];
            }
            var rtable = /^t(?:able|d|h)$/i, rroot = /^(?:body|html)$/i;
            if ("getBoundingClientRect" in document.documentElement) {
                jQuery.fn.offset = function(options) {
                    var elem = this[0], box;
                    if (options) {
                        return this.each(function(i) {
                            jQuery.offset.setOffset(this, options, i);
                        });
                    }
                    if (!elem || !elem.ownerDocument) {
                        return null;
                    }
                    if (elem === elem.ownerDocument.body) {
                        return jQuery.offset.bodyOffset(elem);
                    }
                    try {
                        box = elem.getBoundingClientRect();
                    } catch (e) {}
                    var doc = elem.ownerDocument, docElem = doc.documentElement;
                    if (!box || !jQuery.contains(docElem, elem)) {
                        return box ? {
                            top: box.top,
                            left: box.left
                        } : {
                            top: 0,
                            left: 0
                        };
                    }
                    var body = doc.body, win = getWindow(doc), clientTop = docElem.clientTop || body.clientTop || 0, clientLeft = docElem.clientLeft || body.clientLeft || 0, scrollTop = win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop || body.scrollTop, scrollLeft = win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft, top = box.top + scrollTop - clientTop, left = box.left + scrollLeft - clientLeft;
                    return {
                        top: top,
                        left: left
                    };
                };
            } else {
                jQuery.fn.offset = function(options) {
                    var elem = this[0];
                    if (options) {
                        return this.each(function(i) {
                            jQuery.offset.setOffset(this, options, i);
                        });
                    }
                    if (!elem || !elem.ownerDocument) {
                        return null;
                    }
                    if (elem === elem.ownerDocument.body) {
                        return jQuery.offset.bodyOffset(elem);
                    }
                    var computedStyle, offsetParent = elem.offsetParent, prevOffsetParent = elem, doc = elem.ownerDocument, docElem = doc.documentElement, body = doc.body, defaultView = doc.defaultView, prevComputedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle, top = elem.offsetTop, left = elem.offsetLeft;
                    while ((elem = elem.parentNode) && elem !== body && elem !== docElem) {
                        if (jQuery.support.fixedPosition && prevComputedStyle.position === "fixed") {
                            break;
                        }
                        computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
                        top -= elem.scrollTop;
                        left -= elem.scrollLeft;
                        if (elem === offsetParent) {
                            top += elem.offsetTop;
                            left += elem.offsetLeft;
                            if (jQuery.support.doesNotAddBorder && !(jQuery.support.doesAddBorderForTableAndCells && rtable.test(elem.nodeName))) {
                                top += parseFloat(computedStyle.borderTopWidth) || 0;
                                left += parseFloat(computedStyle.borderLeftWidth) || 0;
                            }
                            prevOffsetParent = offsetParent;
                            offsetParent = elem.offsetParent;
                        }
                        if (jQuery.support.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible") {
                            top += parseFloat(computedStyle.borderTopWidth) || 0;
                            left += parseFloat(computedStyle.borderLeftWidth) || 0;
                        }
                        prevComputedStyle = computedStyle;
                    }
                    if (prevComputedStyle.position === "relative" || prevComputedStyle.position === "static") {
                        top += body.offsetTop;
                        left += body.offsetLeft;
                    }
                    if (jQuery.support.fixedPosition && prevComputedStyle.position === "fixed") {
                        top += Math.max(docElem.scrollTop, body.scrollTop);
                        left += Math.max(docElem.scrollLeft, body.scrollLeft);
                    }
                    return {
                        top: top,
                        left: left
                    };
                };
            }
            jQuery.offset = {
                bodyOffset: function(body) {
                    var top = body.offsetTop, left = body.offsetLeft;
                    if (jQuery.support.doesNotIncludeMarginInBodyOffset) {
                        top += parseFloat(jQuery.css(body, "marginTop")) || 0;
                        left += parseFloat(jQuery.css(body, "marginLeft")) || 0;
                    }
                    return {
                        top: top,
                        left: left
                    };
                },
                setOffset: function(elem, options, i) {
                    var position = jQuery.css(elem, "position");
                    if (position === "static") {
                        elem.style.position = "relative";
                    }
                    var curElem = jQuery(elem), curOffset = curElem.offset(), curCSSTop = jQuery.css(elem, "top"), curCSSLeft = jQuery.css(elem, "left"), calculatePosition = (position === "absolute" || position === "fixed") && jQuery.inArray("auto", [ curCSSTop, curCSSLeft ]) > -1, props = {}, curPosition = {}, curTop, curLeft;
                    if (calculatePosition) {
                        curPosition = curElem.position();
                        curTop = curPosition.top;
                        curLeft = curPosition.left;
                    } else {
                        curTop = parseFloat(curCSSTop) || 0;
                        curLeft = parseFloat(curCSSLeft) || 0;
                    }
                    if (jQuery.isFunction(options)) {
                        options = options.call(elem, i, curOffset);
                    }
                    if (options.top != null) {
                        props.top = options.top - curOffset.top + curTop;
                    }
                    if (options.left != null) {
                        props.left = options.left - curOffset.left + curLeft;
                    }
                    if ("using" in options) {
                        options.using.call(elem, props);
                    } else {
                        curElem.css(props);
                    }
                }
            };
            jQuery.fn.extend({
                position: function() {
                    if (!this[0]) {
                        return null;
                    }
                    var elem = this[0], offsetParent = this.offsetParent(), offset = this.offset(), parentOffset = rroot.test(offsetParent[0].nodeName) ? {
                        top: 0,
                        left: 0
                    } : offsetParent.offset();
                    offset.top -= parseFloat(jQuery.css(elem, "marginTop")) || 0;
                    offset.left -= parseFloat(jQuery.css(elem, "marginLeft")) || 0;
                    parentOffset.top += parseFloat(jQuery.css(offsetParent[0], "borderTopWidth")) || 0;
                    parentOffset.left += parseFloat(jQuery.css(offsetParent[0], "borderLeftWidth")) || 0;
                    return {
                        top: offset.top - parentOffset.top,
                        left: offset.left - parentOffset.left
                    };
                },
                offsetParent: function() {
                    return this.map(function() {
                        var offsetParent = this.offsetParent || document.body;
                        while (offsetParent && !rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") {
                            offsetParent = offsetParent.offsetParent;
                        }
                        return offsetParent;
                    });
                }
            });
            jQuery.each([ "Left", "Top" ], function(i, name) {
                var method = "scroll" + name;
                jQuery.fn[method] = function(val) {
                    var elem, win;
                    if (val === undefined) {
                        elem = this[0];
                        if (!elem) {
                            return null;
                        }
                        win = getWindow(elem);
                        return win ? "pageXOffset" in win ? win[i ? "pageYOffset" : "pageXOffset"] : jQuery.support.boxModel && win.document.documentElement[method] || win.document.body[method] : elem[method];
                    }
                    return this.each(function() {
                        win = getWindow(this);
                        if (win) {
                            win.scrollTo(!i ? val : jQuery(win).scrollLeft(), i ? val : jQuery(win).scrollTop());
                        } else {
                            this[method] = val;
                        }
                    });
                };
            });
            function getWindow(elem) {
                return jQuery.isWindow(elem) ? elem : elem.nodeType === 9 ? elem.defaultView || elem.parentWindow : false;
            }
            jQuery.each([ "Height", "Width" ], function(i, name) {
                var type = name.toLowerCase();
                jQuery.fn["inner" + name] = function() {
                    var elem = this[0];
                    return elem ? elem.style ? parseFloat(jQuery.css(elem, type, "padding")) : this[type]() : null;
                };
                jQuery.fn["outer" + name] = function(margin) {
                    var elem = this[0];
                    return elem ? elem.style ? parseFloat(jQuery.css(elem, type, margin ? "margin" : "border")) : this[type]() : null;
                };
                jQuery.fn[type] = function(size) {
                    var elem = this[0];
                    if (!elem) {
                        return size == null ? null : this;
                    }
                    if (jQuery.isFunction(size)) {
                        return this.each(function(i) {
                            var self = jQuery(this);
                            self[type](size.call(this, i, self[type]()));
                        });
                    }
                    if (jQuery.isWindow(elem)) {
                        var docElemProp = elem.document.documentElement["client" + name], body = elem.document.body;
                        return elem.document.compatMode === "CSS1Compat" && docElemProp || body && body["client" + name] || docElemProp;
                    } else if (elem.nodeType === 9) {
                        return Math.max(elem.documentElement["client" + name], elem.body["scroll" + name], elem.documentElement["scroll" + name], elem.body["offset" + name], elem.documentElement["offset" + name]);
                    } else if (size === undefined) {
                        var orig = jQuery.css(elem, type), ret = parseFloat(orig);
                        return jQuery.isNumeric(ret) ? ret : orig;
                    } else {
                        return this.css(type, typeof size === "string" ? size : size + "px");
                    }
                };
            });
            module.exports = jQuery;
        })(window);
    });
    define("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/underscore-1.8.2.js", function(require, exports, module) {
        (function() {
            var root = this;
            var previousUnderscore = root._;
            var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;
            var push = ArrayProto.push, slice = ArrayProto.slice, toString = ObjProto.toString, hasOwnProperty = ObjProto.hasOwnProperty;
            var nativeIsArray = Array.isArray, nativeKeys = Object.keys, nativeBind = FuncProto.bind, nativeCreate = Object.create;
            var Ctor = function() {};
            var _ = function(obj) {
                if (obj instanceof _) return obj;
                if (!(this instanceof _)) return new _(obj);
                this._wrapped = obj;
            };
            if (typeof exports !== "undefined") {
                if (typeof module !== "undefined" && module.exports) {
                    exports = module.exports = _;
                }
                exports._ = _;
            } else {
                root._ = _;
            }
            _.VERSION = "1.8.2";
            var optimizeCb = function(func, context, argCount) {
                if (context === void 0) return func;
                switch (argCount == null ? 3 : argCount) {
                  case 1:
                    return function(value) {
                        return func.call(context, value);
                    };
                  case 2:
                    return function(value, other) {
                        return func.call(context, value, other);
                    };
                  case 3:
                    return function(value, index, collection) {
                        return func.call(context, value, index, collection);
                    };
                  case 4:
                    return function(accumulator, value, index, collection) {
                        return func.call(context, accumulator, value, index, collection);
                    };
                }
                return function() {
                    return func.apply(context, arguments);
                };
            };
            var cb = function(value, context, argCount) {
                if (value == null) return _.identity;
                if (_.isFunction(value)) return optimizeCb(value, context, argCount);
                if (_.isObject(value)) return _.matcher(value);
                return _.property(value);
            };
            _.iteratee = function(value, context) {
                return cb(value, context, Infinity);
            };
            var createAssigner = function(keysFunc, undefinedOnly) {
                return function(obj) {
                    var length = arguments.length;
                    if (length < 2 || obj == null) return obj;
                    for (var index = 1; index < length; index++) {
                        var source = arguments[index], keys = keysFunc(source), l = keys.length;
                        for (var i = 0; i < l; i++) {
                            var key = keys[i];
                            if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
                        }
                    }
                    return obj;
                };
            };
            var baseCreate = function(prototype) {
                if (!_.isObject(prototype)) return {};
                if (nativeCreate) return nativeCreate(prototype);
                Ctor.prototype = prototype;
                var result = new Ctor;
                Ctor.prototype = null;
                return result;
            };
            var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
            var isArrayLike = function(collection) {
                var length = collection != null && collection.length;
                return typeof length == "number" && length >= 0 && length <= MAX_ARRAY_INDEX;
            };
            _.each = _.forEach = function(obj, iteratee, context) {
                iteratee = optimizeCb(iteratee, context);
                var i, length;
                if (isArrayLike(obj)) {
                    for (i = 0, length = obj.length; i < length; i++) {
                        iteratee(obj[i], i, obj);
                    }
                } else {
                    var keys = _.keys(obj);
                    for (i = 0, length = keys.length; i < length; i++) {
                        iteratee(obj[keys[i]], keys[i], obj);
                    }
                }
                return obj;
            };
            _.map = _.collect = function(obj, iteratee, context) {
                iteratee = cb(iteratee, context);
                var keys = !isArrayLike(obj) && _.keys(obj), length = (keys || obj).length, results = Array(length);
                for (var index = 0; index < length; index++) {
                    var currentKey = keys ? keys[index] : index;
                    results[index] = iteratee(obj[currentKey], currentKey, obj);
                }
                return results;
            };
            function createReduce(dir) {
                function iterator(obj, iteratee, memo, keys, index, length) {
                    for (; index >= 0 && index < length; index += dir) {
                        var currentKey = keys ? keys[index] : index;
                        memo = iteratee(memo, obj[currentKey], currentKey, obj);
                    }
                    return memo;
                }
                return function(obj, iteratee, memo, context) {
                    iteratee = optimizeCb(iteratee, context, 4);
                    var keys = !isArrayLike(obj) && _.keys(obj), length = (keys || obj).length, index = dir > 0 ? 0 : length - 1;
                    if (arguments.length < 3) {
                        memo = obj[keys ? keys[index] : index];
                        index += dir;
                    }
                    return iterator(obj, iteratee, memo, keys, index, length);
                };
            }
            _.reduce = _.foldl = _.inject = createReduce(1);
            _.reduceRight = _.foldr = createReduce(-1);
            _.find = _.detect = function(obj, predicate, context) {
                var key;
                if (isArrayLike(obj)) {
                    key = _.findIndex(obj, predicate, context);
                } else {
                    key = _.findKey(obj, predicate, context);
                }
                if (key !== void 0 && key !== -1) return obj[key];
            };
            _.filter = _.select = function(obj, predicate, context) {
                var results = [];
                predicate = cb(predicate, context);
                _.each(obj, function(value, index, list) {
                    if (predicate(value, index, list)) results.push(value);
                });
                return results;
            };
            _.reject = function(obj, predicate, context) {
                return _.filter(obj, _.negate(cb(predicate)), context);
            };
            _.every = _.all = function(obj, predicate, context) {
                predicate = cb(predicate, context);
                var keys = !isArrayLike(obj) && _.keys(obj), length = (keys || obj).length;
                for (var index = 0; index < length; index++) {
                    var currentKey = keys ? keys[index] : index;
                    if (!predicate(obj[currentKey], currentKey, obj)) return false;
                }
                return true;
            };
            _.some = _.any = function(obj, predicate, context) {
                predicate = cb(predicate, context);
                var keys = !isArrayLike(obj) && _.keys(obj), length = (keys || obj).length;
                for (var index = 0; index < length; index++) {
                    var currentKey = keys ? keys[index] : index;
                    if (predicate(obj[currentKey], currentKey, obj)) return true;
                }
                return false;
            };
            _.contains = _.includes = _.include = function(obj, target, fromIndex) {
                if (!isArrayLike(obj)) obj = _.values(obj);
                return _.indexOf(obj, target, typeof fromIndex == "number" && fromIndex) >= 0;
            };
            _.invoke = function(obj, method) {
                var args = slice.call(arguments, 2);
                var isFunc = _.isFunction(method);
                return _.map(obj, function(value) {
                    var func = isFunc ? method : value[method];
                    return func == null ? func : func.apply(value, args);
                });
            };
            _.pluck = function(obj, key) {
                return _.map(obj, _.property(key));
            };
            _.where = function(obj, attrs) {
                return _.filter(obj, _.matcher(attrs));
            };
            _.findWhere = function(obj, attrs) {
                return _.find(obj, _.matcher(attrs));
            };
            _.max = function(obj, iteratee, context) {
                var result = -Infinity, lastComputed = -Infinity, value, computed;
                if (iteratee == null && obj != null) {
                    obj = isArrayLike(obj) ? obj : _.values(obj);
                    for (var i = 0, length = obj.length; i < length; i++) {
                        value = obj[i];
                        if (value > result) {
                            result = value;
                        }
                    }
                } else {
                    iteratee = cb(iteratee, context);
                    _.each(obj, function(value, index, list) {
                        computed = iteratee(value, index, list);
                        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
                            result = value;
                            lastComputed = computed;
                        }
                    });
                }
                return result;
            };
            _.min = function(obj, iteratee, context) {
                var result = Infinity, lastComputed = Infinity, value, computed;
                if (iteratee == null && obj != null) {
                    obj = isArrayLike(obj) ? obj : _.values(obj);
                    for (var i = 0, length = obj.length; i < length; i++) {
                        value = obj[i];
                        if (value < result) {
                            result = value;
                        }
                    }
                } else {
                    iteratee = cb(iteratee, context);
                    _.each(obj, function(value, index, list) {
                        computed = iteratee(value, index, list);
                        if (computed < lastComputed || computed === Infinity && result === Infinity) {
                            result = value;
                            lastComputed = computed;
                        }
                    });
                }
                return result;
            };
            _.shuffle = function(obj) {
                var set = isArrayLike(obj) ? obj : _.values(obj);
                var length = set.length;
                var shuffled = Array(length);
                for (var index = 0, rand; index < length; index++) {
                    rand = _.random(0, index);
                    if (rand !== index) shuffled[index] = shuffled[rand];
                    shuffled[rand] = set[index];
                }
                return shuffled;
            };
            _.sample = function(obj, n, guard) {
                if (n == null || guard) {
                    if (!isArrayLike(obj)) obj = _.values(obj);
                    return obj[_.random(obj.length - 1)];
                }
                return _.shuffle(obj).slice(0, Math.max(0, n));
            };
            _.sortBy = function(obj, iteratee, context) {
                iteratee = cb(iteratee, context);
                return _.pluck(_.map(obj, function(value, index, list) {
                    return {
                        value: value,
                        index: index,
                        criteria: iteratee(value, index, list)
                    };
                }).sort(function(left, right) {
                    var a = left.criteria;
                    var b = right.criteria;
                    if (a !== b) {
                        if (a > b || a === void 0) return 1;
                        if (a < b || b === void 0) return -1;
                    }
                    return left.index - right.index;
                }), "value");
            };
            var group = function(behavior) {
                return function(obj, iteratee, context) {
                    var result = {};
                    iteratee = cb(iteratee, context);
                    _.each(obj, function(value, index) {
                        var key = iteratee(value, index, obj);
                        behavior(result, value, key);
                    });
                    return result;
                };
            };
            _.groupBy = group(function(result, value, key) {
                if (_.has(result, key)) result[key].push(value); else result[key] = [ value ];
            });
            _.indexBy = group(function(result, value, key) {
                result[key] = value;
            });
            _.countBy = group(function(result, value, key) {
                if (_.has(result, key)) result[key]++; else result[key] = 1;
            });
            _.toArray = function(obj) {
                if (!obj) return [];
                if (_.isArray(obj)) return slice.call(obj);
                if (isArrayLike(obj)) return _.map(obj, _.identity);
                return _.values(obj);
            };
            _.size = function(obj) {
                if (obj == null) return 0;
                return isArrayLike(obj) ? obj.length : _.keys(obj).length;
            };
            _.partition = function(obj, predicate, context) {
                predicate = cb(predicate, context);
                var pass = [], fail = [];
                _.each(obj, function(value, key, obj) {
                    (predicate(value, key, obj) ? pass : fail).push(value);
                });
                return [ pass, fail ];
            };
            _.first = _.head = _.take = function(array, n, guard) {
                if (array == null) return void 0;
                if (n == null || guard) return array[0];
                return _.initial(array, array.length - n);
            };
            _.initial = function(array, n, guard) {
                return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
            };
            _.last = function(array, n, guard) {
                if (array == null) return void 0;
                if (n == null || guard) return array[array.length - 1];
                return _.rest(array, Math.max(0, array.length - n));
            };
            _.rest = _.tail = _.drop = function(array, n, guard) {
                return slice.call(array, n == null || guard ? 1 : n);
            };
            _.compact = function(array) {
                return _.filter(array, _.identity);
            };
            var flatten = function(input, shallow, strict, startIndex) {
                var output = [], idx = 0;
                for (var i = startIndex || 0, length = input && input.length; i < length; i++) {
                    var value = input[i];
                    if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
                        if (!shallow) value = flatten(value, shallow, strict);
                        var j = 0, len = value.length;
                        output.length += len;
                        while (j < len) {
                            output[idx++] = value[j++];
                        }
                    } else if (!strict) {
                        output[idx++] = value;
                    }
                }
                return output;
            };
            _.flatten = function(array, shallow) {
                return flatten(array, shallow, false);
            };
            _.without = function(array) {
                return _.difference(array, slice.call(arguments, 1));
            };
            _.uniq = _.unique = function(array, isSorted, iteratee, context) {
                if (array == null) return [];
                if (!_.isBoolean(isSorted)) {
                    context = iteratee;
                    iteratee = isSorted;
                    isSorted = false;
                }
                if (iteratee != null) iteratee = cb(iteratee, context);
                var result = [];
                var seen = [];
                for (var i = 0, length = array.length; i < length; i++) {
                    var value = array[i], computed = iteratee ? iteratee(value, i, array) : value;
                    if (isSorted) {
                        if (!i || seen !== computed) result.push(value);
                        seen = computed;
                    } else if (iteratee) {
                        if (!_.contains(seen, computed)) {
                            seen.push(computed);
                            result.push(value);
                        }
                    } else if (!_.contains(result, value)) {
                        result.push(value);
                    }
                }
                return result;
            };
            _.union = function() {
                return _.uniq(flatten(arguments, true, true));
            };
            _.intersection = function(array) {
                if (array == null) return [];
                var result = [];
                var argsLength = arguments.length;
                for (var i = 0, length = array.length; i < length; i++) {
                    var item = array[i];
                    if (_.contains(result, item)) continue;
                    for (var j = 1; j < argsLength; j++) {
                        if (!_.contains(arguments[j], item)) break;
                    }
                    if (j === argsLength) result.push(item);
                }
                return result;
            };
            _.difference = function(array) {
                var rest = flatten(arguments, true, true, 1);
                return _.filter(array, function(value) {
                    return !_.contains(rest, value);
                });
            };
            _.zip = function() {
                return _.unzip(arguments);
            };
            _.unzip = function(array) {
                var length = array && _.max(array, "length").length || 0;
                var result = Array(length);
                for (var index = 0; index < length; index++) {
                    result[index] = _.pluck(array, index);
                }
                return result;
            };
            _.object = function(list, values) {
                var result = {};
                for (var i = 0, length = list && list.length; i < length; i++) {
                    if (values) {
                        result[list[i]] = values[i];
                    } else {
                        result[list[i][0]] = list[i][1];
                    }
                }
                return result;
            };
            _.indexOf = function(array, item, isSorted) {
                var i = 0, length = array && array.length;
                if (typeof isSorted == "number") {
                    i = isSorted < 0 ? Math.max(0, length + isSorted) : isSorted;
                } else if (isSorted && length) {
                    i = _.sortedIndex(array, item);
                    return array[i] === item ? i : -1;
                }
                if (item !== item) {
                    return _.findIndex(slice.call(array, i), _.isNaN);
                }
                for (; i < length; i++) if (array[i] === item) return i;
                return -1;
            };
            _.lastIndexOf = function(array, item, from) {
                var idx = array ? array.length : 0;
                if (typeof from == "number") {
                    idx = from < 0 ? idx + from + 1 : Math.min(idx, from + 1);
                }
                if (item !== item) {
                    return _.findLastIndex(slice.call(array, 0, idx), _.isNaN);
                }
                while (--idx >= 0) if (array[idx] === item) return idx;
                return -1;
            };
            function createIndexFinder(dir) {
                return function(array, predicate, context) {
                    predicate = cb(predicate, context);
                    var length = array != null && array.length;
                    var index = dir > 0 ? 0 : length - 1;
                    for (; index >= 0 && index < length; index += dir) {
                        if (predicate(array[index], index, array)) return index;
                    }
                    return -1;
                };
            }
            _.findIndex = createIndexFinder(1);
            _.findLastIndex = createIndexFinder(-1);
            _.sortedIndex = function(array, obj, iteratee, context) {
                iteratee = cb(iteratee, context, 1);
                var value = iteratee(obj);
                var low = 0, high = array.length;
                while (low < high) {
                    var mid = Math.floor((low + high) / 2);
                    if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
                }
                return low;
            };
            _.range = function(start, stop, step) {
                if (arguments.length <= 1) {
                    stop = start || 0;
                    start = 0;
                }
                step = step || 1;
                var length = Math.max(Math.ceil((stop - start) / step), 0);
                var range = Array(length);
                for (var idx = 0; idx < length; idx++, start += step) {
                    range[idx] = start;
                }
                return range;
            };
            var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
                if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
                var self = baseCreate(sourceFunc.prototype);
                var result = sourceFunc.apply(self, args);
                if (_.isObject(result)) return result;
                return self;
            };
            _.bind = function(func, context) {
                if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
                if (!_.isFunction(func)) throw new TypeError("Bind must be called on a function");
                var args = slice.call(arguments, 2);
                var bound = function() {
                    return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
                };
                return bound;
            };
            _.partial = function(func) {
                var boundArgs = slice.call(arguments, 1);
                var bound = function() {
                    var position = 0, length = boundArgs.length;
                    var args = Array(length);
                    for (var i = 0; i < length; i++) {
                        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
                    }
                    while (position < arguments.length) args.push(arguments[position++]);
                    return executeBound(func, bound, this, this, args);
                };
                return bound;
            };
            _.bindAll = function(obj) {
                var i, length = arguments.length, key;
                if (length <= 1) throw new Error("bindAll must be passed function names");
                for (i = 1; i < length; i++) {
                    key = arguments[i];
                    obj[key] = _.bind(obj[key], obj);
                }
                return obj;
            };
            _.memoize = function(func, hasher) {
                var memoize = function(key) {
                    var cache = memoize.cache;
                    var address = "" + (hasher ? hasher.apply(this, arguments) : key);
                    if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
                    return cache[address];
                };
                memoize.cache = {};
                return memoize;
            };
            _.delay = function(func, wait) {
                var args = slice.call(arguments, 2);
                return setTimeout(function() {
                    return func.apply(null, args);
                }, wait);
            };
            _.defer = _.partial(_.delay, _, 1);
            _.throttle = function(func, wait, options) {
                var context, args, result;
                var timeout = null;
                var previous = 0;
                if (!options) options = {};
                var later = function() {
                    previous = options.leading === false ? 0 : _.now();
                    timeout = null;
                    result = func.apply(context, args);
                    if (!timeout) context = args = null;
                };
                return function() {
                    var now = _.now();
                    if (!previous && options.leading === false) previous = now;
                    var remaining = wait - (now - previous);
                    context = this;
                    args = arguments;
                    if (remaining <= 0 || remaining > wait) {
                        if (timeout) {
                            clearTimeout(timeout);
                            timeout = null;
                        }
                        previous = now;
                        result = func.apply(context, args);
                        if (!timeout) context = args = null;
                    } else if (!timeout && options.trailing !== false) {
                        timeout = setTimeout(later, remaining);
                    }
                    return result;
                };
            };
            _.debounce = function(func, wait, immediate) {
                var timeout, args, context, timestamp, result;
                var later = function() {
                    var last = _.now() - timestamp;
                    if (last < wait && last >= 0) {
                        timeout = setTimeout(later, wait - last);
                    } else {
                        timeout = null;
                        if (!immediate) {
                            result = func.apply(context, args);
                            if (!timeout) context = args = null;
                        }
                    }
                };
                return function() {
                    context = this;
                    args = arguments;
                    timestamp = _.now();
                    var callNow = immediate && !timeout;
                    if (!timeout) timeout = setTimeout(later, wait);
                    if (callNow) {
                        result = func.apply(context, args);
                        context = args = null;
                    }
                    return result;
                };
            };
            _.wrap = function(func, wrapper) {
                return _.partial(wrapper, func);
            };
            _.negate = function(predicate) {
                return function() {
                    return !predicate.apply(this, arguments);
                };
            };
            _.compose = function() {
                var args = arguments;
                var start = args.length - 1;
                return function() {
                    var i = start;
                    var result = args[start].apply(this, arguments);
                    while (i--) result = args[i].call(this, result);
                    return result;
                };
            };
            _.after = function(times, func) {
                return function() {
                    if (--times < 1) {
                        return func.apply(this, arguments);
                    }
                };
            };
            _.before = function(times, func) {
                var memo;
                return function() {
                    if (--times > 0) {
                        memo = func.apply(this, arguments);
                    }
                    if (times <= 1) func = null;
                    return memo;
                };
            };
            _.once = _.partial(_.before, 2);
            var hasEnumBug = !{
                toString: null
            }.propertyIsEnumerable("toString");
            var nonEnumerableProps = [ "valueOf", "isPrototypeOf", "toString", "propertyIsEnumerable", "hasOwnProperty", "toLocaleString" ];
            function collectNonEnumProps(obj, keys) {
                var nonEnumIdx = nonEnumerableProps.length;
                var constructor = obj.constructor;
                var proto = _.isFunction(constructor) && constructor.prototype || ObjProto;
                var prop = "constructor";
                if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);
                while (nonEnumIdx--) {
                    prop = nonEnumerableProps[nonEnumIdx];
                    if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
                        keys.push(prop);
                    }
                }
            }
            _.keys = function(obj) {
                if (!_.isObject(obj)) return [];
                if (nativeKeys) return nativeKeys(obj);
                var keys = [];
                for (var key in obj) if (_.has(obj, key)) keys.push(key);
                if (hasEnumBug) collectNonEnumProps(obj, keys);
                return keys;
            };
            _.allKeys = function(obj) {
                if (!_.isObject(obj)) return [];
                var keys = [];
                for (var key in obj) keys.push(key);
                if (hasEnumBug) collectNonEnumProps(obj, keys);
                return keys;
            };
            _.values = function(obj) {
                var keys = _.keys(obj);
                var length = keys.length;
                var values = Array(length);
                for (var i = 0; i < length; i++) {
                    values[i] = obj[keys[i]];
                }
                return values;
            };
            _.mapObject = function(obj, iteratee, context) {
                iteratee = cb(iteratee, context);
                var keys = _.keys(obj), length = keys.length, results = {}, currentKey;
                for (var index = 0; index < length; index++) {
                    currentKey = keys[index];
                    results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
                }
                return results;
            };
            _.pairs = function(obj) {
                var keys = _.keys(obj);
                var length = keys.length;
                var pairs = Array(length);
                for (var i = 0; i < length; i++) {
                    pairs[i] = [ keys[i], obj[keys[i]] ];
                }
                return pairs;
            };
            _.invert = function(obj) {
                var result = {};
                var keys = _.keys(obj);
                for (var i = 0, length = keys.length; i < length; i++) {
                    result[obj[keys[i]]] = keys[i];
                }
                return result;
            };
            _.functions = _.methods = function(obj) {
                var names = [];
                for (var key in obj) {
                    if (_.isFunction(obj[key])) names.push(key);
                }
                return names.sort();
            };
            _.extend = createAssigner(_.allKeys);
            _.extendOwn = _.assign = createAssigner(_.keys);
            _.findKey = function(obj, predicate, context) {
                predicate = cb(predicate, context);
                var keys = _.keys(obj), key;
                for (var i = 0, length = keys.length; i < length; i++) {
                    key = keys[i];
                    if (predicate(obj[key], key, obj)) return key;
                }
            };
            _.pick = function(object, oiteratee, context) {
                var result = {}, obj = object, iteratee, keys;
                if (obj == null) return result;
                if (_.isFunction(oiteratee)) {
                    keys = _.allKeys(obj);
                    iteratee = optimizeCb(oiteratee, context);
                } else {
                    keys = flatten(arguments, false, false, 1);
                    iteratee = function(value, key, obj) {
                        return key in obj;
                    };
                    obj = Object(obj);
                }
                for (var i = 0, length = keys.length; i < length; i++) {
                    var key = keys[i];
                    var value = obj[key];
                    if (iteratee(value, key, obj)) result[key] = value;
                }
                return result;
            };
            _.omit = function(obj, iteratee, context) {
                if (_.isFunction(iteratee)) {
                    iteratee = _.negate(iteratee);
                } else {
                    var keys = _.map(flatten(arguments, false, false, 1), String);
                    iteratee = function(value, key) {
                        return !_.contains(keys, key);
                    };
                }
                return _.pick(obj, iteratee, context);
            };
            _.defaults = createAssigner(_.allKeys, true);
            _.create = function(prototype, props) {
                var result = baseCreate(prototype);
                if (props) _.extendOwn(result, props);
                return result;
            };
            _.clone = function(obj) {
                if (!_.isObject(obj)) return obj;
                return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
            };
            _.tap = function(obj, interceptor) {
                interceptor(obj);
                return obj;
            };
            _.isMatch = function(object, attrs) {
                var keys = _.keys(attrs), length = keys.length;
                if (object == null) return !length;
                var obj = Object(object);
                for (var i = 0; i < length; i++) {
                    var key = keys[i];
                    if (attrs[key] !== obj[key] || !(key in obj)) return false;
                }
                return true;
            };
            var eq = function(a, b, aStack, bStack) {
                if (a === b) return a !== 0 || 1 / a === 1 / b;
                if (a == null || b == null) return a === b;
                if (a instanceof _) a = a._wrapped;
                if (b instanceof _) b = b._wrapped;
                var className = toString.call(a);
                if (className !== toString.call(b)) return false;
                switch (className) {
                  case "[object RegExp]":
                  case "[object String]":
                    return "" + a === "" + b;
                  case "[object Number]":
                    if (+a !== +a) return +b !== +b;
                    return +a === 0 ? 1 / +a === 1 / b : +a === +b;
                  case "[object Date]":
                  case "[object Boolean]":
                    return +a === +b;
                }
                var areArrays = className === "[object Array]";
                if (!areArrays) {
                    if (typeof a != "object" || typeof b != "object") return false;
                    var aCtor = a.constructor, bCtor = b.constructor;
                    if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor && _.isFunction(bCtor) && bCtor instanceof bCtor) && "constructor" in a && "constructor" in b) {
                        return false;
                    }
                }
                aStack = aStack || [];
                bStack = bStack || [];
                var length = aStack.length;
                while (length--) {
                    if (aStack[length] === a) return bStack[length] === b;
                }
                aStack.push(a);
                bStack.push(b);
                if (areArrays) {
                    length = a.length;
                    if (length !== b.length) return false;
                    while (length--) {
                        if (!eq(a[length], b[length], aStack, bStack)) return false;
                    }
                } else {
                    var keys = _.keys(a), key;
                    length = keys.length;
                    if (_.keys(b).length !== length) return false;
                    while (length--) {
                        key = keys[length];
                        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
                    }
                }
                aStack.pop();
                bStack.pop();
                return true;
            };
            _.isEqual = function(a, b) {
                return eq(a, b);
            };
            _.isEmpty = function(obj) {
                if (obj == null) return true;
                if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
                return _.keys(obj).length === 0;
            };
            _.isElement = function(obj) {
                return !!(obj && obj.nodeType === 1);
            };
            _.isArray = nativeIsArray || function(obj) {
                return toString.call(obj) === "[object Array]";
            };
            _.isObject = function(obj) {
                var type = typeof obj;
                return type === "function" || type === "object" && !!obj;
            };
            _.each([ "Arguments", "Function", "String", "Number", "Date", "RegExp", "Error" ], function(name) {
                _["is" + name] = function(obj) {
                    return toString.call(obj) === "[object " + name + "]";
                };
            });
            if (!_.isArguments(arguments)) {
                _.isArguments = function(obj) {
                    return _.has(obj, "callee");
                };
            }
            if (typeof /./ != "function" && typeof Int8Array != "object") {
                _.isFunction = function(obj) {
                    return typeof obj == "function" || false;
                };
            }
            _.isFinite = function(obj) {
                return isFinite(obj) && !isNaN(parseFloat(obj));
            };
            _.isNaN = function(obj) {
                return _.isNumber(obj) && obj !== +obj;
            };
            _.isBoolean = function(obj) {
                return obj === true || obj === false || toString.call(obj) === "[object Boolean]";
            };
            _.isNull = function(obj) {
                return obj === null;
            };
            _.isUndefined = function(obj) {
                return obj === void 0;
            };
            _.has = function(obj, key) {
                return obj != null && hasOwnProperty.call(obj, key);
            };
            _.noConflict = function() {
                root._ = previousUnderscore;
                return this;
            };
            _.identity = function(value) {
                return value;
            };
            _.constant = function(value) {
                return function() {
                    return value;
                };
            };
            _.noop = function() {};
            _.property = function(key) {
                return function(obj) {
                    return obj == null ? void 0 : obj[key];
                };
            };
            _.propertyOf = function(obj) {
                return obj == null ? function() {} : function(key) {
                    return obj[key];
                };
            };
            _.matcher = _.matches = function(attrs) {
                attrs = _.extendOwn({}, attrs);
                return function(obj) {
                    return _.isMatch(obj, attrs);
                };
            };
            _.times = function(n, iteratee, context) {
                var accum = Array(Math.max(0, n));
                iteratee = optimizeCb(iteratee, context, 1);
                for (var i = 0; i < n; i++) accum[i] = iteratee(i);
                return accum;
            };
            _.random = function(min, max) {
                if (max == null) {
                    max = min;
                    min = 0;
                }
                return min + Math.floor(Math.random() * (max - min + 1));
            };
            _.now = Date.now || function() {
                return (new Date).getTime();
            };
            var escapeMap = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#x27;",
                "`": "&#x60;"
            };
            var unescapeMap = _.invert(escapeMap);
            var createEscaper = function(map) {
                var escaper = function(match) {
                    return map[match];
                };
                var source = "(?:" + _.keys(map).join("|") + ")";
                var testRegexp = RegExp(source);
                var replaceRegexp = RegExp(source, "g");
                return function(string) {
                    string = string == null ? "" : "" + string;
                    return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
                };
            };
            _.escape = createEscaper(escapeMap);
            _.unescape = createEscaper(unescapeMap);
            _.result = function(object, property, fallback) {
                var value = object == null ? void 0 : object[property];
                if (value === void 0) {
                    value = fallback;
                }
                return _.isFunction(value) ? value.call(object) : value;
            };
            var idCounter = 0;
            _.uniqueId = function(prefix) {
                var id = ++idCounter + "";
                return prefix ? prefix + id : id;
            };
            _.templateSettings = {
                evaluate: /<%([\s\S]+?)%>/g,
                interpolate: /<%=([\s\S]+?)%>/g,
                escape: /<%-([\s\S]+?)%>/g
            };
            var noMatch = /(.)^/;
            var escapes = {
                "'": "'",
                "\\": "\\",
                "\r": "r",
                "\n": "n",
                "\u2028": "u2028",
                "\u2029": "u2029"
            };
            var escaper = /\\|'|\r|\n|\u2028|\u2029/g;
            var escapeChar = function(match) {
                return "\\" + escapes[match];
            };
            _.template = function(text, settings, oldSettings) {
                if (!settings && oldSettings) settings = oldSettings;
                settings = _.defaults({}, settings, _.templateSettings);
                var matcher = RegExp([ (settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source ].join("|") + "|$", "g");
                var index = 0;
                var source = "__p+='";
                text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
                    source += text.slice(index, offset).replace(escaper, escapeChar);
                    index = offset + match.length;
                    if (escape) {
                        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
                    } else if (interpolate) {
                        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
                    } else if (evaluate) {
                        source += "';\n" + evaluate + "\n__p+='";
                    }
                    return match;
                });
                source += "';\n";
                if (!settings.variable) source = "with(obj||{}){\n" + source + "}\n";
                source = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + source + "return __p;\n";
                try {
                    var render = new Function(settings.variable || "obj", "_", source);
                } catch (e) {
                    e.source = source;
                    throw e;
                }
                var template = function(data) {
                    return render.call(this, data, _);
                };
                var argument = settings.variable || "obj";
                template.source = "function(" + argument + "){\n" + source + "}";
                return template;
            };
            _.chain = function(obj) {
                var instance = _(obj);
                instance._chain = true;
                return instance;
            };
            var result = function(instance, obj) {
                return instance._chain ? _(obj).chain() : obj;
            };
            _.mixin = function(obj) {
                _.each(_.functions(obj), function(name) {
                    var func = _[name] = obj[name];
                    _.prototype[name] = function() {
                        var args = [ this._wrapped ];
                        push.apply(args, arguments);
                        return result(this, func.apply(_, args));
                    };
                });
            };
            _.mixin(_);
            _.each([ "pop", "push", "reverse", "shift", "sort", "splice", "unshift" ], function(name) {
                var method = ArrayProto[name];
                _.prototype[name] = function() {
                    var obj = this._wrapped;
                    method.apply(obj, arguments);
                    if ((name === "shift" || name === "splice") && obj.length === 0) delete obj[0];
                    return result(this, obj);
                };
            });
            _.each([ "concat", "join", "slice" ], function(name) {
                var method = ArrayProto[name];
                _.prototype[name] = function() {
                    return result(this, method.apply(this._wrapped, arguments));
                };
            });
            _.prototype.value = function() {
                return this._wrapped;
            };
            _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;
            _.prototype.toString = function() {
                return "" + this._wrapped;
            };
            if (typeof define === "function" && define.amd) {
                define("underscore", [], function() {
                    return _;
                });
            }
        }).call(window);
    });
    define("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/util/util.js", function(require, exports, module) {
        exports.loadJs = function(src, fun) {
            var head = document.getElementsByTagName("head")[0] || document.head || document.documentElement;
            var script = document.createElement("script");
            script.setAttribute("type", "text/javascript");
            script.setAttribute("charset", "UTF-8");
            script.setAttribute("src", src);
            if (typeof fun === "function") {
                if (window.attachEvent) {
                    script.onreadystatechange = function() {
                        var r = script.readyState;
                        if (r === "loaded" || r === "complete") {
                            script.onreadystatechange = null;
                            fun();
                        }
                    };
                } else {
                    script.onload = fun;
                    script.onerror = fun;
                }
            }
            head.appendChild(script);
        };
        exports.trim = function() {
            var trimLeft = /^\s+/;
            var trimRight = /\s+$/;
            var trim = String.prototype.trim;
            return trim ? function(text) {
                return text === null ? "" : trim.call(text);
            } : function(text) {
                return text === null ? "" : text.toString().replace(trimLeft, "").replace(trimRight, "");
            };
        }();
        exports.upper = function(txt) {
            if (typeof txt !== "string") {
                return "";
            }
            var reg = /^[a-z]$/;
            var upStr = "";
            for (var i = 0; i < txt.length; i++) {
                if (reg.test(txt.charAt(i))) {
                    upStr += String.fromCharCode(txt.charCodeAt(i) - 32);
                } else {
                    upStr += txt.charAt(i);
                }
            }
            return upStr;
        };
        exports.deleteProperty = function(obj, key) {
            if (typeof obj !== "object") {
                return;
            }
            try {
                delete obj[key];
            } catch (e) {
                obj[key] = undefined;
            }
        };
        exports.queryObject = function(obj) {
            if (typeof obj !== "object") {
                return;
            }
            var str = "", key;
            for (key in obj) {
                if (str === "") {
                    str += key + "=" + window.encodeURIComponent(obj[key]);
                } else {
                    str += "&" + key + "=" + window.encodeURIComponent(obj[key]);
                }
            }
            return str;
        };
        exports.msieVersion = function() {
            var ua = window.navigator.userAgent;
            var msie = ua.indexOf("MSIE ");
            if (msie > 0) {
                return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)));
            } else {
                return false;
            }
            return false;
        };
        exports.UrlSwitchHttps = function(data) {
            if (!window.location.href.match(/^https:\/\//)) {
                return data;
            }
            if (!data) return data;
            var str;
            var flag = false;
            if (typeof data === "object") {
                str = JSON.stringify(data);
                flag = true;
            } else if (typeof data === "string") {
                str = data;
            } else {
                return data;
            }
            str = str.replace(/=http:\/\//g, "[[[]]]");
            str = str.replace(/http:\/\//g, "//");
            str = str.replace(/\[\[\[\]\]\]/g, "=http://");
            if (flag) {
                return JSON.parse(str);
            }
            return str;
        };
    });
    define("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/util/data-center.js", function(require, exports, module) {
        var storage = {};
        module.exports = {
            set: function(ns, val) {
                var dep = ns.split(":");
                var obj = storage;
                var i;
                for (i = 0; i < dep.length; i++) {
                    if (obj[dep[i]] === undefined) {
                        obj[dep[i]] = {};
                    }
                    if (i === dep.length - 1) {
                        obj[dep[i]] = val;
                    } else {
                        obj = obj[dep[i]];
                    }
                }
                return val;
            },
            get: function(ns) {
                if (ns === "/") {
                    return storage;
                }
                var dep = ns.split(":");
                var obj = storage;
                var i;
                for (i = 0; i < dep.length; i++) {
                    obj = obj[dep[i]];
                    if (obj === undefined) {
                        break;
                    }
                }
                return obj;
            },
            del: function(ns) {
                if (ns === "/") {
                    stroge = {};
                }
                var dep = ns.split(":");
                var obj = storage;
                var i;
                for (i = 0; i < dep.length; i++) {
                    if (i == dep.length - 1) {
                        delete obj[dep[i]];
                    } else {
                        if (obj.hasOwnProperty(dep[i])) {
                            obj = obj[dep[i]];
                        } else {
                            return;
                        }
                    }
                }
            }
        };
    });
    define("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/jquery-transit.js", function(require, exports, module) {
        (function(root, factory) {
            if (typeof define === "function" && define.amd) {
                define([ "jquery" ], factory);
            } else if (typeof exports === "object") {
                module.exports = factory(require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/jquery-1.7.0.js"));
            } else {
                factory(root.jQuery);
            }
        })(this, function($) {
            $.transit = {
                version: "0.9.12",
                propertyMap: {
                    marginLeft: "margin",
                    marginRight: "margin",
                    marginBottom: "margin",
                    marginTop: "margin",
                    paddingLeft: "padding",
                    paddingRight: "padding",
                    paddingBottom: "padding",
                    paddingTop: "padding"
                },
                enabled: true,
                useTransitionEnd: false
            };
            var div = document.createElement("div");
            var support = {};
            function getVendorPropertyName(prop) {
                if (prop in div.style) return prop;
                var prefixes = [ "Moz", "Webkit", "O", "ms" ];
                var prop_ = prop.charAt(0).toUpperCase() + prop.substr(1);
                for (var i = 0; i < prefixes.length; ++i) {
                    var vendorProp = prefixes[i] + prop_;
                    if (vendorProp in div.style) {
                        return vendorProp;
                    }
                }
            }
            function checkTransform3dSupport() {
                div.style[support.transform] = "";
                div.style[support.transform] = "rotateY(90deg)";
                return div.style[support.transform] !== "";
            }
            var isChrome = navigator.userAgent.toLowerCase().indexOf("chrome") > -1;
            support.transition = getVendorPropertyName("transition");
            support.transitionDelay = getVendorPropertyName("transitionDelay");
            support.transform = getVendorPropertyName("transform");
            support.transformOrigin = getVendorPropertyName("transformOrigin");
            support.filter = getVendorPropertyName("Filter");
            support.transform3d = checkTransform3dSupport();
            var eventNames = {
                transition: "transitionend",
                MozTransition: "transitionend",
                OTransition: "oTransitionEnd",
                WebkitTransition: "webkitTransitionEnd",
                msTransition: "MSTransitionEnd"
            };
            var transitionEnd = support.transitionEnd = eventNames[support.transition] || null;
            for (var key in support) {
                if (support.hasOwnProperty(key) && typeof $.support[key] === "undefined") {
                    $.support[key] = support[key];
                }
            }
            div = null;
            $.cssEase = {
                _default: "ease",
                "in": "ease-in",
                out: "ease-out",
                "in-out": "ease-in-out",
                snap: "cubic-bezier(0,1,.5,1)",
                easeInCubic: "cubic-bezier(.550,.055,.675,.190)",
                easeOutCubic: "cubic-bezier(.215,.61,.355,1)",
                easeInOutCubic: "cubic-bezier(.645,.045,.355,1)",
                easeInCirc: "cubic-bezier(.6,.04,.98,.335)",
                easeOutCirc: "cubic-bezier(.075,.82,.165,1)",
                easeInOutCirc: "cubic-bezier(.785,.135,.15,.86)",
                easeInExpo: "cubic-bezier(.95,.05,.795,.035)",
                easeOutExpo: "cubic-bezier(.19,1,.22,1)",
                easeInOutExpo: "cubic-bezier(1,0,0,1)",
                easeInQuad: "cubic-bezier(.55,.085,.68,.53)",
                easeOutQuad: "cubic-bezier(.25,.46,.45,.94)",
                easeInOutQuad: "cubic-bezier(.455,.03,.515,.955)",
                easeInQuart: "cubic-bezier(.895,.03,.685,.22)",
                easeOutQuart: "cubic-bezier(.165,.84,.44,1)",
                easeInOutQuart: "cubic-bezier(.77,0,.175,1)",
                easeInQuint: "cubic-bezier(.755,.05,.855,.06)",
                easeOutQuint: "cubic-bezier(.23,1,.32,1)",
                easeInOutQuint: "cubic-bezier(.86,0,.07,1)",
                easeInSine: "cubic-bezier(.47,0,.745,.715)",
                easeOutSine: "cubic-bezier(.39,.575,.565,1)",
                easeInOutSine: "cubic-bezier(.445,.05,.55,.95)",
                easeInBack: "cubic-bezier(.6,-.28,.735,.045)",
                easeOutBack: "cubic-bezier(.175, .885,.32,1.275)",
                easeInOutBack: "cubic-bezier(.68,-.55,.265,1.55)"
            };
            $.cssHooks["transit:transform"] = {
                get: function(elem) {
                    return $(elem).data("transform") || new Transform;
                },
                set: function(elem, v) {
                    var value = v;
                    if (!(value instanceof Transform)) {
                        value = new Transform(value);
                    }
                    if (support.transform === "WebkitTransform" && !isChrome) {
                        elem.style[support.transform] = value.toString(true);
                    } else {
                        elem.style[support.transform] = value.toString();
                    }
                    $(elem).data("transform", value);
                }
            };
            $.cssHooks.transform = {
                set: $.cssHooks["transit:transform"].set
            };
            $.cssHooks.filter = {
                get: function(elem) {
                    return elem.style[support.filter];
                },
                set: function(elem, value) {
                    elem.style[support.filter] = value;
                }
            };
            if ($.fn.jquery < "1.8") {
                $.cssHooks.transformOrigin = {
                    get: function(elem) {
                        return elem.style[support.transformOrigin];
                    },
                    set: function(elem, value) {
                        elem.style[support.transformOrigin] = value;
                    }
                };
                $.cssHooks.transition = {
                    get: function(elem) {
                        return elem.style[support.transition];
                    },
                    set: function(elem, value) {
                        elem.style[support.transition] = value;
                    }
                };
            }
            registerCssHook("scale");
            registerCssHook("scaleX");
            registerCssHook("scaleY");
            registerCssHook("translate");
            registerCssHook("rotate");
            registerCssHook("rotateX");
            registerCssHook("rotateY");
            registerCssHook("rotate3d");
            registerCssHook("perspective");
            registerCssHook("skewX");
            registerCssHook("skewY");
            registerCssHook("x", true);
            registerCssHook("y", true);
            function Transform(str) {
                if (typeof str === "string") {
                    this.parse(str);
                }
                return this;
            }
            Transform.prototype = {
                setFromString: function(prop, val) {
                    var args = typeof val === "string" ? val.split(",") : val.constructor === Array ? val : [ val ];
                    args.unshift(prop);
                    Transform.prototype.set.apply(this, args);
                },
                set: function(prop) {
                    var args = Array.prototype.slice.apply(arguments, [ 1 ]);
                    if (this.setter[prop]) {
                        this.setter[prop].apply(this, args);
                    } else {
                        this[prop] = args.join(",");
                    }
                },
                get: function(prop) {
                    if (this.getter[prop]) {
                        return this.getter[prop].apply(this);
                    } else {
                        return this[prop] || 0;
                    }
                },
                setter: {
                    rotate: function(theta) {
                        this.rotate = unit(theta, "deg");
                    },
                    rotateX: function(theta) {
                        this.rotateX = unit(theta, "deg");
                    },
                    rotateY: function(theta) {
                        this.rotateY = unit(theta, "deg");
                    },
                    scale: function(x, y) {
                        if (y === undefined) {
                            y = x;
                        }
                        this.scale = x + "," + y;
                    },
                    skewX: function(x) {
                        this.skewX = unit(x, "deg");
                    },
                    skewY: function(y) {
                        this.skewY = unit(y, "deg");
                    },
                    perspective: function(dist) {
                        this.perspective = unit(dist, "px");
                    },
                    x: function(x) {
                        this.set("translate", x, null);
                    },
                    y: function(y) {
                        this.set("translate", null, y);
                    },
                    translate: function(x, y) {
                        if (this._translateX === undefined) {
                            this._translateX = 0;
                        }
                        if (this._translateY === undefined) {
                            this._translateY = 0;
                        }
                        if (x !== null && x !== undefined) {
                            this._translateX = unit(x, "px");
                        }
                        if (y !== null && y !== undefined) {
                            this._translateY = unit(y, "px");
                        }
                        this.translate = this._translateX + "," + this._translateY;
                    }
                },
                getter: {
                    x: function() {
                        return this._translateX || 0;
                    },
                    y: function() {
                        return this._translateY || 0;
                    },
                    scale: function() {
                        var s = (this.scale || "1,1").split(",");
                        if (s[0]) {
                            s[0] = parseFloat(s[0]);
                        }
                        if (s[1]) {
                            s[1] = parseFloat(s[1]);
                        }
                        return s[0] === s[1] ? s[0] : s;
                    },
                    rotate3d: function() {
                        var s = (this.rotate3d || "0,0,0,0deg").split(",");
                        for (var i = 0; i <= 3; ++i) {
                            if (s[i]) {
                                s[i] = parseFloat(s[i]);
                            }
                        }
                        if (s[3]) {
                            s[3] = unit(s[3], "deg");
                        }
                        return s;
                    }
                },
                parse: function(str) {
                    var self = this;
                    str.replace(/([a-zA-Z0-9]+)\((.*?)\)/g, function(x, prop, val) {
                        self.setFromString(prop, val);
                    });
                },
                toString: function(use3d) {
                    var re = [];
                    for (var i in this) {
                        if (this.hasOwnProperty(i)) {
                            if (!support.transform3d && (i === "rotateX" || i === "rotateY" || i === "perspective" || i === "transformOrigin")) {
                                continue;
                            }
                            if (i[0] !== "_") {
                                if (use3d && i === "scale") {
                                    re.push(i + "3d(" + this[i] + ",1)");
                                } else if (use3d && i === "translate") {
                                    re.push(i + "3d(" + this[i] + ",0)");
                                } else {
                                    re.push(i + "(" + this[i] + ")");
                                }
                            }
                        }
                    }
                    return re.join(" ");
                }
            };
            function callOrQueue(self, queue, fn) {
                if (queue === true) {
                    self.queue(fn);
                } else if (queue) {
                    self.queue(queue, fn);
                } else {
                    self.each(function() {
                        fn.call(this);
                    });
                }
            }
            function getProperties(props) {
                var re = [];
                $.each(props, function(key) {
                    key = $.camelCase(key);
                    key = $.transit.propertyMap[key] || $.cssProps[key] || key;
                    key = uncamel(key);
                    if (support[key]) key = uncamel(support[key]);
                    if ($.inArray(key, re) === -1) {
                        re.push(key);
                    }
                });
                return re;
            }
            function getTransition(properties, duration, easing, delay) {
                var props = getProperties(properties);
                if ($.cssEase[easing]) {
                    easing = $.cssEase[easing];
                }
                var attribs = "" + toMS(duration) + " " + easing;
                if (parseInt(delay, 10) > 0) {
                    attribs += " " + toMS(delay);
                }
                var transitions = [];
                $.each(props, function(i, name) {
                    transitions.push(name + " " + attribs);
                });
                return transitions.join(", ");
            }
            $.fn.transition = $.fn.transit = function(properties, duration, easing, callback) {
                var self = this;
                var delay = 0;
                var queue = true;
                var theseProperties = $.extend(true, {}, properties);
                if (typeof duration === "function") {
                    callback = duration;
                    duration = undefined;
                }
                if (typeof duration === "object") {
                    easing = duration.easing;
                    delay = duration.delay || 0;
                    queue = typeof duration.queue === "undefined" ? true : duration.queue;
                    callback = duration.complete;
                    duration = duration.duration;
                }
                if (typeof easing === "function") {
                    callback = easing;
                    easing = undefined;
                }
                if (typeof theseProperties.easing !== "undefined") {
                    easing = theseProperties.easing;
                    delete theseProperties.easing;
                }
                if (typeof theseProperties.duration !== "undefined") {
                    duration = theseProperties.duration;
                    delete theseProperties.duration;
                }
                if (typeof theseProperties.complete !== "undefined") {
                    callback = theseProperties.complete;
                    delete theseProperties.complete;
                }
                if (typeof theseProperties.queue !== "undefined") {
                    queue = theseProperties.queue;
                    delete theseProperties.queue;
                }
                if (typeof theseProperties.delay !== "undefined") {
                    delay = theseProperties.delay;
                    delete theseProperties.delay;
                }
                if (typeof duration === "undefined") {
                    duration = $.fx.speeds._default;
                }
                if (typeof easing === "undefined") {
                    easing = $.cssEase._default;
                }
                duration = toMS(duration);
                var transitionValue = getTransition(theseProperties, duration, easing, delay);
                var work = $.transit.enabled && support.transition;
                var i = work ? parseInt(duration, 10) + parseInt(delay, 10) : 0;
                if (i === 0) {
                    var fn = function(next) {
                        self.css(theseProperties);
                        if (callback) {
                            callback.apply(self);
                        }
                        if (next) {
                            next();
                        }
                    };
                    callOrQueue(self, queue, fn);
                    return self;
                }
                var oldTransitions = {};
                var run = function(nextCall) {
                    var bound = false;
                    var cb = function() {
                        if (bound) {
                            self.unbind(transitionEnd, cb);
                        }
                        if (i > 0) {
                            self.each(function() {
                                this.style[support.transition] = oldTransitions[this] || null;
                            });
                        }
                        if (typeof callback === "function") {
                            callback.apply(self);
                        }
                        if (typeof nextCall === "function") {
                            nextCall();
                        }
                    };
                    if (i > 0 && transitionEnd && $.transit.useTransitionEnd) {
                        bound = true;
                        self.bind(transitionEnd, cb);
                    } else {
                        window.setTimeout(cb, i);
                    }
                    self.each(function() {
                        if (i > 0) {
                            this.style[support.transition] = transitionValue;
                        }
                        $(this).css(theseProperties);
                    });
                };
                var deferredRun = function(next) {
                    this.offsetWidth;
                    run(next);
                };
                callOrQueue(self, queue, deferredRun);
                return this;
            };
            function registerCssHook(prop, isPixels) {
                if (!isPixels) {
                    $.cssNumber[prop] = true;
                }
                $.transit.propertyMap[prop] = support.transform;
                $.cssHooks[prop] = {
                    get: function(elem) {
                        var t = $(elem).css("transit:transform");
                        return t.get(prop);
                    },
                    set: function(elem, value) {
                        var t = $(elem).css("transit:transform");
                        t.setFromString(prop, value);
                        $(elem).css({
                            "transit:transform": t
                        });
                    }
                };
            }
            function uncamel(str) {
                return str.replace(/([A-Z])/g, function(letter) {
                    return "-" + letter.toLowerCase();
                });
            }
            function unit(i, units) {
                if (typeof i === "string" && !i.match(/^[\-0-9\.]+$/)) {
                    return i;
                } else {
                    return "" + i + units;
                }
            }
            function toMS(duration) {
                var i = duration;
                if (typeof i === "string" && !i.match(/^[\-0-9\.]+/)) {
                    i = $.fx.speeds[i] || $.fx.speeds._default;
                }
                return unit(i, "ms");
            }
            $.transit.getTransitionValue = getTransition;
            return $;
        });
    });
    define("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/changyan-reset-v3.css", function(require, exports, module) {
        var cssText = "#SOHUCS{clear:both}#SOHUCS #SOHU_MAIN *{box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box}#SOHUCS,#SOHUCS #SOHU_MAIN{margin:0;margin-left:auto;margin-right:auto;padding:0;border:0;font-weight:400;text-align:left;width:100%;height:auto;overflow:visible;font-size:12px;color:#333;background-color:transparent;line-height:1}#SOHUCS #SOHU_MAIN a,#SOHUCS #SOHU_MAIN abbr,#SOHUCS #SOHU_MAIN acronym,#SOHUCS #SOHU_MAIN address,#SOHUCS #SOHU_MAIN applet,#SOHUCS #SOHU_MAIN article,#SOHUCS #SOHU_MAIN aside,#SOHUCS #SOHU_MAIN audio,#SOHUCS #SOHU_MAIN b,#SOHUCS #SOHU_MAIN big,#SOHUCS #SOHU_MAIN blockquote,#SOHUCS #SOHU_MAIN canvas,#SOHUCS #SOHU_MAIN caption,#SOHUCS #SOHU_MAIN center,#SOHUCS #SOHU_MAIN cite,#SOHUCS #SOHU_MAIN code,#SOHUCS #SOHU_MAIN dd,#SOHUCS #SOHU_MAIN del,#SOHUCS #SOHU_MAIN details,#SOHUCS #SOHU_MAIN dfn,#SOHUCS #SOHU_MAIN dialog,#SOHUCS #SOHU_MAIN div,#SOHUCS #SOHU_MAIN dl,#SOHUCS #SOHU_MAIN dt,#SOHUCS #SOHU_MAIN em,#SOHUCS #SOHU_MAIN embed,#SOHUCS #SOHU_MAIN fieldset,#SOHUCS #SOHU_MAIN figcaption,#SOHUCS #SOHU_MAIN figure,#SOHUCS #SOHU_MAIN font,#SOHUCS #SOHU_MAIN footer,#SOHUCS #SOHU_MAIN form,#SOHUCS #SOHU_MAIN h1,#SOHUCS #SOHU_MAIN h2,#SOHUCS #SOHU_MAIN h3,#SOHUCS #SOHU_MAIN h4,#SOHUCS #SOHU_MAIN h5,#SOHUCS #SOHU_MAIN h6,#SOHUCS #SOHU_MAIN header,#SOHUCS #SOHU_MAIN hgroup,#SOHUCS #SOHU_MAIN hr,#SOHUCS #SOHU_MAIN i,#SOHUCS #SOHU_MAIN iframe,#SOHUCS #SOHU_MAIN img,#SOHUCS #SOHU_MAIN ins,#SOHUCS #SOHU_MAIN kbd,#SOHUCS #SOHU_MAIN label,#SOHUCS #SOHU_MAIN legend,#SOHUCS #SOHU_MAIN li,#SOHUCS #SOHU_MAIN mark,#SOHUCS #SOHU_MAIN menu,#SOHUCS #SOHU_MAIN meter,#SOHUCS #SOHU_MAIN nav,#SOHUCS #SOHU_MAIN object,#SOHUCS #SOHU_MAIN ol,#SOHUCS #SOHU_MAIN output,#SOHUCS #SOHU_MAIN p,#SOHUCS #SOHU_MAIN pre,#SOHUCS #SOHU_MAIN progress,#SOHUCS #SOHU_MAIN q,#SOHUCS #SOHU_MAIN rp,#SOHUCS #SOHU_MAIN rt,#SOHUCS #SOHU_MAIN ruby,#SOHUCS #SOHU_MAIN s,#SOHUCS #SOHU_MAIN samp,#SOHUCS #SOHU_MAIN section,#SOHUCS #SOHU_MAIN small,#SOHUCS #SOHU_MAIN span,#SOHUCS #SOHU_MAIN strike,#SOHUCS #SOHU_MAIN strong,#SOHUCS #SOHU_MAIN sub,#SOHUCS #SOHU_MAIN summary,#SOHUCS #SOHU_MAIN sup,#SOHUCS #SOHU_MAIN table,#SOHUCS #SOHU_MAIN tbody,#SOHUCS #SOHU_MAIN td,#SOHUCS #SOHU_MAIN tfoot,#SOHUCS #SOHU_MAIN th,#SOHUCS #SOHU_MAIN thead,#SOHUCS #SOHU_MAIN time,#SOHUCS #SOHU_MAIN tr,#SOHUCS #SOHU_MAIN tt,#SOHUCS #SOHU_MAIN u,#SOHUCS #SOHU_MAIN ul,#SOHUCS #SOHU_MAIN var,#SOHUCS #SOHU_MAIN video,#SOHUCS #SOHU_MAIN xmp{border:0;margin:0;padding:0;font-size:100%;text-align:left;vertical-align:baseline;background-image:none;background-position:0 0;float:none;overflow:visible;text-indent:0}#SOHUCS #SOHU_MAIN article,#SOHUCS #SOHU_MAIN aside,#SOHUCS #SOHU_MAIN details,#SOHUCS #SOHU_MAIN figcaption,#SOHUCS #SOHU_MAIN figure,#SOHUCS #SOHU_MAIN footer,#SOHUCS #SOHU_MAIN header,#SOHUCS #SOHU_MAIN hgroup,#SOHUCS #SOHU_MAIN menu,#SOHUCS #SOHU_MAIN nav,#SOHUCS #SOHU_MAIN section{display:block}#SOHUCS #SOHU_MAIN b,#SOHUCS #SOHU_MAIN h1,#SOHUCS #SOHU_MAIN h2,#SOHUCS #SOHU_MAIN h3,#SOHUCS #SOHU_MAIN h4,#SOHUCS #SOHU_MAIN h5,#SOHUCS #SOHU_MAIN h6,#SOHUCS #SOHU_MAIN strong{font-weight:400}#SOHUCS #SOHU_MAIN img{color:transparent;font-size:0;vertical-align:middle;-ms-interpolation-mode:bicubic}#SOHUCS #SOHU_MAIN li,#SOHUCS #SOHU_MAIN ol,#SOHUCS #SOHU_MAIN ul{list-style:none}#SOHUCS #SOHU_MAIN li{display:list-item}#SOHUCS #SOHU_MAIN table{border-collapse:collapse;border-spacing:0}#SOHUCS #SOHU_MAIN caption,#SOHUCS #SOHU_MAIN td,#SOHUCS #SOHU_MAIN th{font-weight:400;vertical-align:top;text-align:left}#SOHUCS #SOHU_MAIN q{quotes:none}#SOHUCS #SOHU_MAIN q:after,#SOHUCS #SOHU_MAIN q:before{content:'';content:none}#SOHUCS #SOHU_MAIN small,#SOHUCS #SOHU_MAIN sub,#SOHUCS #SOHU_MAIN sup{font-size:75%}#SOHUCS #SOHU_MAIN sub,#SOHUCS #SOHU_MAIN sup{line-height:0;position:relative;vertical-align:baseline}#SOHUCS #SOHU_MAIN sub{bottom:-.25em}#SOHUCS #SOHU_MAIN sup{top:-.5em}#SOHUCS #SOHU_MAIN svg{overflow:hidden}#SOHUCS #SOHU_MAIN del,#SOHUCS #SOHU_MAIN ins,#SOHUCS #SOHU_MAIN s,#SOHUCS #SOHU_MAIN u{text-decoration:none}#SOHUCS #SOHU_MAIN p{word-wrap:break-word;break-word:break-all}#SOHUCS #SOHU_MAIN em,#SOHUCS #SOHU_MAIN i{font-style:normal}#SOHUCS #SOHU_MAIN a,#SOHUCS #SOHU_MAIN b,#SOHUCS #SOHU_MAIN em,#SOHUCS #SOHU_MAIN i,#SOHUCS #SOHU_MAIN img,#SOHUCS #SOHU_MAIN input,#SOHUCS #SOHU_MAIN label,#SOHUCS #SOHU_MAIN s,#SOHUCS #SOHU_MAIN span,#SOHUCS #SOHU_MAIN strong,#SOHUCS #SOHU_MAIN sub,#SOHUCS #SOHU_MAIN sup,#SOHUCS #SOHU_MAIN textarea,#SOHUCS #SOHU_MAIN u{display:inline}#SOHUCS #SOHU_MAIN input,#SOHUCS #SOHU_MAIN select,#SOHUCS #SOHU_MAIN select option,#SOHUCS #SOHU_MAIN textarea{margin:0;padding:0;border:0;outline:0}#SOHUCS #SOHU_MAIN a:focus,#SOHUCS #SOHU_MAIN input:focus,#SOHUCS #SOHU_MAIN textarea:focus{outline:0}#SOHUCS #SOHU_MAIN button,#SOHUCS #SOHU_MAIN input,#SOHUCS #SOHU_MAIN select,#SOHUCS #SOHU_MAIN textarea{background-attachment:scroll}#SOHUCS #SOHU_MAIN li{clear:none}#SOHUCS #SOHU_MAIN a{color:#44708e;text-decoration:none}#SOHUCS #SOHU_MAIN a:hover{color:#ee542a;text-decoration:underline}#SOHUCS #SOHU_MAIN .clear-g{zoom:1}#SOHUCS #SOHU_MAIN .clear-g:after{content:\".\";display:block;visibility:hidden;height:0;clear:both}#SOHUCS #SOHU_MAIN .global-clear-spacing{letter-spacing:-6px}#SOHUCS #SOHU_MAIN .global-clear-spacing *{letter-spacing:normal}";
        var document = window.document;
        var styleTag = document.createElement("style");
        styleTag.setAttribute("type", "text/css");
        if (document.all) {
            styleTag.styleSheet.cssText = cssText;
        } else {
            styleTag.innerHTML = cssText;
        }
        document.getElementsByTagName("head").item(0).appendChild(styleTag);
    });
    define("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/changyan-reset-v3-upage.css", function(require, exports, module) {
        var cssText = ".module-cy-user-page *{box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box}.module-cy-user-page{margin:0;margin-left:auto;margin-right:auto;padding:0;border:0;font-weight:400;text-align:left;width:100%;height:auto;overflow:visible;font-size:12px;color:#333;background-color:transparent;line-height:1}.module-cy-user-page a,.module-cy-user-page abbr,.module-cy-user-page acronym,.module-cy-user-page address,.module-cy-user-page applet,.module-cy-user-page article,.module-cy-user-page aside,.module-cy-user-page audio,.module-cy-user-page b,.module-cy-user-page big,.module-cy-user-page blockquote,.module-cy-user-page canvas,.module-cy-user-page caption,.module-cy-user-page center,.module-cy-user-page cite,.module-cy-user-page code,.module-cy-user-page dd,.module-cy-user-page del,.module-cy-user-page details,.module-cy-user-page dfn,.module-cy-user-page dialog,.module-cy-user-page div,.module-cy-user-page dl,.module-cy-user-page dt,.module-cy-user-page em,.module-cy-user-page embed,.module-cy-user-page fieldset,.module-cy-user-page figcaption,.module-cy-user-page figure,.module-cy-user-page font,.module-cy-user-page footer,.module-cy-user-page form,.module-cy-user-page h1,.module-cy-user-page h2,.module-cy-user-page h3,.module-cy-user-page h4,.module-cy-user-page h5,.module-cy-user-page h6,.module-cy-user-page header,.module-cy-user-page hgroup,.module-cy-user-page hr,.module-cy-user-page i,.module-cy-user-page iframe,.module-cy-user-page img,.module-cy-user-page ins,.module-cy-user-page kbd,.module-cy-user-page label,.module-cy-user-page legend,.module-cy-user-page li,.module-cy-user-page mark,.module-cy-user-page menu,.module-cy-user-page meter,.module-cy-user-page nav,.module-cy-user-page object,.module-cy-user-page ol,.module-cy-user-page output,.module-cy-user-page p,.module-cy-user-page pre,.module-cy-user-page progress,.module-cy-user-page q,.module-cy-user-page rp,.module-cy-user-page rt,.module-cy-user-page ruby,.module-cy-user-page s,.module-cy-user-page samp,.module-cy-user-page section,.module-cy-user-page small,.module-cy-user-page span,.module-cy-user-page strike,.module-cy-user-page strong,.module-cy-user-page sub,.module-cy-user-page summary,.module-cy-user-page sup,.module-cy-user-page table,.module-cy-user-page tbody,.module-cy-user-page td,.module-cy-user-page tfoot,.module-cy-user-page th,.module-cy-user-page thead,.module-cy-user-page time,.module-cy-user-page tr,.module-cy-user-page tt,.module-cy-user-page u,.module-cy-user-page ul,.module-cy-user-page var,.module-cy-user-page video,.module-cy-user-page xmp{border:0;margin:0;padding:0;font-size:100%;text-align:left;vertical-align:baseline;background-image:none;background-position:0 0;width:auto;float:none;overflow:visible;text-indent:0}.module-cy-user-page article,.module-cy-user-page aside,.module-cy-user-page details,.module-cy-user-page figcaption,.module-cy-user-page figure,.module-cy-user-page footer,.module-cy-user-page header,.module-cy-user-page hgroup,.module-cy-user-page menu,.module-cy-user-page nav,.module-cy-user-page section{display:block}.module-cy-user-page b,.module-cy-user-page h1,.module-cy-user-page h2,.module-cy-user-page h3,.module-cy-user-page h4,.module-cy-user-page h5,.module-cy-user-page h6,.module-cy-user-page strong{font-weight:400}.module-cy-user-page img{color:transparent;font-size:0;vertical-align:middle;-ms-interpolation-mode:bicubic}.module-cy-user-page li,.module-cy-user-page ol,.module-cy-user-page ul{list-style:none}.module-cy-user-page li{display:list-item}.module-cy-user-page table{border-collapse:collapse;border-spacing:0}.module-cy-user-page caption,.module-cy-user-page td,.module-cy-user-page th{font-weight:400;vertical-align:top;text-align:left}.module-cy-user-page q{quotes:none}.module-cy-user-page q:after,.module-cy-user-page q:before{content:'';content:none}.module-cy-user-page small,.module-cy-user-page sub,.module-cy-user-page sup{font-size:75%}.module-cy-user-page sub,.module-cy-user-page sup{line-height:0;position:relative;vertical-align:baseline}.module-cy-user-page sub{bottom:-.25em}.module-cy-user-page sup{top:-.5em}.module-cy-user-page svg{overflow:hidden}.module-cy-user-page del,.module-cy-user-page ins,.module-cy-user-page s,.module-cy-user-page u{text-decoration:none}.module-cy-user-page p{word-wrap:break-word;word-break:break-all}.module-cy-user-page em,.module-cy-user-page i{font-style:normal}.module-cy-user-page a,.module-cy-user-page b,.module-cy-user-page em,.module-cy-user-page i,.module-cy-user-page img,.module-cy-user-page input,.module-cy-user-page label,.module-cy-user-page s,.module-cy-user-page span,.module-cy-user-page strong,.module-cy-user-page sub,.module-cy-user-page sup,.module-cy-user-page textarea,.module-cy-user-page u{display:inline}.module-cy-user-page input,.module-cy-user-page select,.module-cy-user-page select option,.module-cy-user-page textarea{margin:0;padding:0;border:0;outline:0}.module-cy-user-page a:focus,.module-cy-user-page input:focus,.module-cy-user-page textarea:focus{outline:0}.module-cy-user-page button,.module-cy-user-page input,.module-cy-user-page select,.module-cy-user-page textarea{background-attachment:scroll}.module-cy-user-page li{clear:none}.module-cy-user-page a{color:#44708e;text-decoration:none}.module-cy-user-page a:hover{color:#ee542a;text-decoration:underline}.module-cy-user-page .clear-g{zoom:1}.module-cy-user-page .clear-g:after{content:\".\";display:block;visibility:hidden;height:0;clear:both}.module-cy-user-page .global-clear-spacing{letter-spacing:-6px}.module-cy-user-page .global-clear-spacing *{letter-spacing:normal}";
        var document = window.document;
        var styleTag = document.createElement("style");
        styleTag.setAttribute("type", "text/css");
        if (document.all) {
            styleTag.styleSheet.cssText = cssText;
        } else {
            styleTag.innerHTML = cssText;
        }
        document.getElementsByTagName("head").item(0).appendChild(styleTag);
    });
    define("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/config-white-list-wap.js", function(require, exports, module) {
        var _ = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/underscore-1.8.2.js");
        var wlist = {
            fbeWhiteList: [ "extensions", "latest_page_num", "hot_page_num" ],
            feWhiteList: [ "appid", "sso", "mobile", "ismobile", "url", "title", "sid", "category_id", "readyHandles", "is_black", "login_callback", "logout_callback", "hide_face", "next_page", "show_focus_cbox", "show_floor_num", "auto_run", "hide_floatbar", "hide_comment", "unlisten_reply_button", "unlisten_support_button", "app_type", "barrage_switch", "barrage_commentarea_hide", "is_new_version", "sohu_wap" ],
            beWhiteList: [ "mobile_login_external_platform", "domain_whitelist", "extensions", "mobile_allow_upload_img", "user_portrait_url", "mobile_allow_barrage", "comment_recom_image", "mobile_latest_page_num", "disable_user_photo", "mobile_float_bar", "mobile_isv_type", "mobile_hot_page_num", "mobile_css_type", "mobile_new_advert", "hot_page_num", "v3_hack", "mobile_extensions_key", "wap_skin", "sso", "sso_isv_login", "sso_isv_logout", "sso_isv_userInfo", "sso_type", "only_sso", "mobile_isv_login_icon", "mobile_isv_login_url", "is_new_cdn", "forum_redirect_open", "forum_redirect_layer", "comment_user_emoji", "mobile_hot_news_topic", "wap_collection_open" ]
        };
        exports.feWhiteList = _.union(wlist.fbeWhiteList, wlist.feWhiteList);
        exports.beWhiteList = _.union(wlist.fbeWhiteList, wlist.beWhiteList);
    });
    define("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/config-white-list.js", function(require, exports, module) {
        var _ = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/underscore-1.8.2.js");
        var wlist = {
            fbeWhiteList: [ "extensions", "simple_cbox", "footer_fix_cbox", "latest_page_num", "hot_page_num", "custom_css_type", "sohu_ui_type" ],
            feWhiteList: [ "appid", "url", "title", "sid", "category_id", "show_score", "jump_url" ],
            beWhiteList: [ "comment_notice", "copyright", "cyan_title", "domain_whitelist", "hot_topic_list", "hot_topic_mode", "show_participation", "login_external_platform", "allow_upload_img", "comment_operation", "use_user_level", "v3_hack", "display_location", "disable_user_photo", "user_portrait_url", "extensions_key", "forum_redirect_open", "forum_redirect_layer", "comment_user_emoji", "pc_collection_open", "pc_skin", "pc_new_advert", "force_promotion", "sso", "sso_button_action", "sso_button_action_type", "sso_isv_login", "sso_isv_logout", "sso_isv_userInfo", "sso_login_logo", "sso_login_new_logo", "sso_type", "sso_loginstyle_open_only", "is_new_cdn", "isv_type" ]
        };
        exports.feWhiteList = _.union(wlist.fbeWhiteList, wlist.feWhiteList);
        exports.beWhiteList = _.union(wlist.fbeWhiteList, wlist.beWhiteList);
    });
    define("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/api.js", function(require, exports, module) {
        var $ = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/jquery-1.7.0.js"), _ = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/underscore-1.8.2.js"), velocity = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/velocity.fe.js"), cookiejs = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/cookie.js"), $$data = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/util/data-center.js");
        var fnInitApi = function() {
            var api = {};
            api = _.extend(api, {
                util: {
                    jquery: $,
                    _: _,
                    velocityjs: velocity,
                    cookiejs: cookiejs,
                    dialog: require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/changyan-overlay.js"),
                    UrlSwitchHttps: require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/util/util.js").UrlSwitchHttps,
                    WechatQrcode: require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/util/wechat-qrcode.js")
                }
            });
            api = _.extend(api, require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/data.js"));
            api = _.extend(api, require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/user.js"));
            api = _.extend(api, {
                event: require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/events.js").event
            });
            api = _.extend(api, require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/comment.js"));
            api = _.extend(api, require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/async-load-extension.js"));
            api = _.extend(api, require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/log.js"));
            if ($$data.get("feConfig:ismobile") === true) {
                api.events = {};
                api.events.onSupportClick = {};
                api.events.onReplyClick = {};
                api.events.onTopicLoad = {};
                api.events.shareClick = {};
                api.events.floatBarRender = {};
            }
            var readyHandles = $$data.get("feConfig:readyHandles");
            _.each(readyHandles, function(fn) {
                fn(api);
            });
            if ($$data.get("feConfig:ismobile") === true) {
                window.cyan.api.ready = window.changyan.api.ready = function(fn) {
                    if (_.isFunction(fn)) {
                        fn(api);
                    }
                };
                window.cyan.api.openCmtBox = window.changyan.api.openCmtBox = function() {
                    api.event.trigger("changyan:mobile-cmt-box:show", {
                        topic_id: api.getTopicId(),
                        reply_id: 0
                    });
                };
            } else {
                window.changyan.api.ready = function(fn) {
                    if (_.isFunction(fn)) {
                        fn(api);
                    }
                };
            }
            if ($$data.get("cookie:debug_v3") === "true") {
                window.api = api;
            }
        };
        fnInitApi();
    });
    define("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/velocity.fe.js", function(require, exports, module) {
        (function(KISSY) {
            
            var Velocity = function(S) {
                var Velocity = function(asts) {
                    this.asts = asts;
                    this.init();
                };
                Velocity.Helper = {};
                Velocity.prototype = {
                    constructor: Velocity
                };
                var hasEnumBug = !{
                    toString: 1
                }.propertyIsEnumerable("toString");
                var keys = Object.keys || function(o) {
                    var result = [], p, i;
                    for (p in o) {
                        result.push(p);
                    }
                    if (hasEnumBug) {
                        for (i = enumProperties.length - 1; i >= 0; i--) {
                            p = enumProperties[i];
                            if (o.hasOwnProperty(p)) {
                                result.push(p);
                            }
                        }
                    }
                    return result;
                };
                var utils = {
                    forEach: S.each,
                    some: S.some,
                    mixin: S.extend,
                    guid: S.uniqueId,
                    isArray: S.isArray,
                    indexOf: S.indexOf,
                    keys: keys,
                    isObject: S.isObject,
                    now: S.now
                };
                !function(Helper, utils) {
                    function getRefText(ast) {
                        var ret = ast.leader;
                        var isFn = ast.args !== undefined;
                        if (ast.isWraped) ret += "{";
                        if (isFn) {
                            ret += getMethodText(ast);
                        } else {
                            ret += ast.id;
                        }
                        utils.forEach(ast.path, function(ref) {
                            if (ref.type == "method") {
                                ret += "." + getMethodText(ref);
                            } else if (ref.type == "index") {
                                var text = "";
                                var id = ref.id;
                                if (id.type === "integer") {
                                    text = id.value;
                                } else if (id.type === "string") {
                                    var sign = id.isEval ? '"' : "'";
                                    text = sign + id.value + sign;
                                } else {
                                    text = getRefText(id);
                                }
                                ret += "[" + text + "]";
                            } else if (ref.type == "property") {
                                ret += "." + ref.id;
                            }
                        }, this);
                        if (ast.isWraped) ret += "}";
                        return ret;
                    }
                    function getMethodText(ref) {
                        var args = [];
                        var ret = "";
                        utils.forEach(ref.args, function(arg) {
                            args.push(getLiteral(arg));
                        });
                        ret += ref.id + "(" + args.join(",") + ")";
                        return ret;
                    }
                    function getLiteral(ast) {
                        var ret = "";
                        switch (ast.type) {
                          case "string":
                            {
                                var sign = ast.isEval ? '"' : "'";
                                ret = sign + ast.value + sign;
                                break;
                            }
                          case "integer":
                          case "bool":
                            {
                                ret = ast.value;
                                break;
                            }
                          case "array":
                            {
                                ret = "[";
                                var len = ast.value.length - 1;
                                utils.forEach(ast.value, function(arg, i) {
                                    ret += getLiteral(arg);
                                    if (i !== len) ret += ", ";
                                });
                                ret += "]";
                                break;
                            }
                          default:
                            ret = getRefText(ast);
                        }
                        return ret;
                    }
                    Helper.getRefText = getRefText;
                }(Velocity.Helper, utils);
                !function(Velocity, utils) {
                    utils.mixin(Velocity.prototype, {
                        getBlock: function(block) {
                            var ast = block[0];
                            var ret = "";
                            if (ast.type === "if") {
                                ret = this.getBlockIf(block);
                            } else if (ast.type === "foreach") {
                                ret = this.getBlockEach(block);
                            } else if (ast.type === "macro") {
                                this.setBlockMacro(block);
                            } else if (ast.type === "noescape") {
                                ret = this._render(block.slice(1));
                            } else {
                                ret = this._render(block);
                            }
                            return ret || "";
                        },
                        setBlockMacro: function(block) {
                            var ast = block[0];
                            var _block = block.slice(1);
                            var macros = this.macros;
                            macros[ast.id] = {
                                asts: _block,
                                args: ast.args
                            };
                        },
                        getMacro: function(ast) {
                            var macro = this.macros[ast.id];
                            var ret = "";
                            if (!macro) {
                                var jsmacros = this.jsmacros;
                                macro = jsmacros[ast.id];
                                var jsArgs = [];
                                if (macro && macro.apply) {
                                    utils.forEach(ast.args, function(a) {
                                        jsArgs.push(this.getLiteral(a));
                                    }, this);
                                    ret = macro.apply(this, jsArgs);
                                }
                            } else {
                                var asts = macro.asts;
                                var args = macro.args;
                                var _call_args = ast.args;
                                var local = {};
                                var localKey = [];
                                var guid = utils.guid();
                                var contextId = ast.id + ":" + guid;
                                utils.forEach(args, function(ref, i) {
                                    if (_call_args[i]) {
                                        local[ref.id] = this.getLiteral(_call_args[i]);
                                    } else {
                                        local[ref.id] = undefined;
                                    }
                                }, this);
                                ret = this.eval(asts, local, contextId);
                            }
                            return ret;
                        },
                        eval: function(str, local, contextId) {
                            if (!local) {
                                if (utils.isArray(str)) {
                                    return this._render(str);
                                } else {
                                    return this.evalStr(str);
                                }
                            } else {
                                var asts = [];
                                var Parser = Velocity.Parser;
                                contextId = contextId || "eval:" + utils.guid();
                                if (utils.isArray(str)) {
                                    asts = str;
                                } else if (Parser) {
                                    asts = Parser.parse(str);
                                }
                                if (asts.length) {
                                    this.local[contextId] = local;
                                    var ret = this._render(asts, contextId);
                                    this.local[contextId] = {};
                                    this.conditions.pop();
                                    this.condition = "";
                                    return ret;
                                }
                            }
                        },
                        getBlockEach: function(block) {
                            var ast = block[0];
                            var _from = this.getLiteral(ast.from);
                            var _block = block.slice(1);
                            var _to = ast.to;
                            var local = {
                                foreach: {
                                    count: 0
                                }
                            };
                            var ret = "";
                            var guid = utils.guid();
                            var contextId = "foreach:" + guid;
                            var type = {}.toString.call(_from);
                            if (!_from || type !== "[object Array]" && type !== "[object Object]") return;
                            var len = utils.isArray(_from) ? _from.length : utils.keys(_from).length;
                            utils.forEach(_from, function(val, i) {
                                if (this.setBreak) return;
                                local[_to] = val;
                                local["foreach"]["count"] = i + 1;
                                local["foreach"]["index"] = i;
                                local["foreach"]["hasNext"] = i + 1 < len;
                                local["velocityCount"] = parseInt(i, 10) + 1;
                                this.local[contextId] = local;
                                ret += this._render(_block, contextId);
                            }, this);
                            this.setBreak = false;
                            this.local[contextId] = {};
                            this.conditions.shift();
                            this.condition = this.conditions[0] || "";
                            return ret;
                        },
                        getBlockIf: function(block) {
                            var str = "";
                            var received = false;
                            var asts = [];
                            utils.some(block, function(ast) {
                                if (ast.condition) {
                                    if (received) return true;
                                    received = this.getExpression(ast.condition);
                                } else if (ast.type === "else") {
                                    if (received) return true;
                                    received = true;
                                } else if (received) {
                                    asts.push(ast);
                                }
                                return false;
                            }, this);
                            return this._render(asts);
                        }
                    });
                }(Velocity, utils);
                !function(Velocity, utils) {
                    utils.mixin(Velocity.prototype, {
                        init: function() {
                            this.context = {};
                            this.macros = {};
                            this.conditions = [];
                            this.local = {};
                            this.silence = false;
                            utils.forEach(this.asts, this._init, this);
                        },
                        _init: function(ast, i) {
                            if (!ast.type || ast.type !== "references") {
                                this._trim(i + 1);
                            }
                        },
                        _trim: function(i) {
                            var asts = this.asts;
                            var _ast = asts[i];
                            if (typeof _ast === "string" && _ast.slice(0, 1) === "\n") {
                                asts[i] = _ast.slice(1);
                            }
                        },
                        render: function(context, macros, silence) {
                            this.silence = !!silence;
                            this.context = context || {};
                            this.jsmacros = macros || {};
                            var t1 = utils.now();
                            var str = this._render();
                            var t2 = utils.now();
                            var cost = t2 - t1;
                            this.cost = cost;
                            return str;
                        },
                        _render: function(asts, contextId) {
                            var str = "";
                            asts = asts || this.asts;
                            if (contextId) {
                                if (contextId !== this.condition && utils.indexOf(contextId, this.conditions) === -1) {
                                    this.conditions.unshift(contextId);
                                }
                                this.condition = contextId;
                            } else {
                                this.condition = null;
                            }
                            utils.forEach(asts, function(ast) {
                                switch (ast.type) {
                                  case "references":
                                    str += this.getReferences(ast, true);
                                    break;
                                  case "set":
                                    this.setValue(ast);
                                    break;
                                  case "break":
                                    this.setBreak = true;
                                    break;
                                  case "macro_call":
                                    str += this.getMacro(ast);
                                    break;
                                  case "comment":
                                    break;
                                  default:
                                    str += typeof ast == "string" ? ast : this.getBlock(ast);
                                    break;
                                }
                            }, this);
                            return str;
                        }
                    });
                }(Velocity, utils);
                !function(Velocity, utils) {
                    utils.mixin(Velocity.prototype, {
                        getExpression: function(ast) {
                            var exp = ast.expression;
                            var ret;
                            if (ast.type === "math") {
                                switch (ast.operator) {
                                  case "+":
                                    ret = this.getExpression(exp[0]) + this.getExpression(exp[1]);
                                    break;
                                  case "-":
                                    ret = this.getExpression(exp[0]) - this.getExpression(exp[1]);
                                    break;
                                  case "/":
                                    ret = this.getExpression(exp[0]) / this.getExpression(exp[1]);
                                    break;
                                  case "%":
                                    ret = this.getExpression(exp[0]) % this.getExpression(exp[1]);
                                    break;
                                  case "*":
                                    ret = this.getExpression(exp[0]) * this.getExpression(exp[1]);
                                    break;
                                  case "||":
                                    ret = this.getExpression(exp[0]) || this.getExpression(exp[1]);
                                    break;
                                  case "&&":
                                    ret = this.getExpression(exp[0]) && this.getExpression(exp[1]);
                                    break;
                                  case ">":
                                    ret = this.getExpression(exp[0]) > this.getExpression(exp[1]);
                                    break;
                                  case "<":
                                    ret = this.getExpression(exp[0]) < this.getExpression(exp[1]);
                                    break;
                                  case "==":
                                    ret = this.getExpression(exp[0]) == this.getExpression(exp[1]);
                                    break;
                                  case ">=":
                                    ret = this.getExpression(exp[0]) >= this.getExpression(exp[1]);
                                    break;
                                  case "<=":
                                    ret = this.getExpression(exp[0]) <= this.getExpression(exp[1]);
                                    break;
                                  case "!=":
                                    ret = this.getExpression(exp[0]) != this.getExpression(exp[1]);
                                    break;
                                  case "minus":
                                    ret = -this.getExpression(exp[0]);
                                    break;
                                  case "not":
                                    ret = !this.getExpression(exp[0]);
                                    break;
                                  case "parenthesis":
                                    ret = this.getExpression(exp[0]);
                                    break;
                                  default:
                                    return;
                                }
                                return ret;
                            } else {
                                return this.getLiteral(ast);
                            }
                        }
                    });
                }(Velocity, utils);
                !function(Velocity, utils) {
                    utils.mixin(Velocity.prototype, {
                        getLiteral: function(literal) {
                            var type = literal.type;
                            var ret = "";
                            if (type == "string") {
                                ret = this.getString(literal);
                            } else if (type == "integer") {
                                ret = parseInt(literal.value, 10);
                            } else if (type == "decimal") {
                                ret = parseFloat(literal.value, 10);
                            } else if (type == "array") {
                                ret = this.getArray(literal);
                            } else if (type == "map") {
                                ret = {};
                                var map = literal.value;
                                utils.forEach(map, function(exp, key) {
                                    ret[key] = this.getLiteral(exp);
                                }, this);
                            } else if (type == "bool") {
                                if (literal.value === "null") {
                                    ret = null;
                                } else if (literal.value === "false") {
                                    ret = false;
                                } else if (literal.value === "true") {
                                    ret = true;
                                }
                            } else {
                                return this.getReferences(literal);
                            }
                            return ret;
                        },
                        getString: function(literal) {
                            var val = literal.value;
                            var ret = val;
                            if (literal.isEval && (val.indexOf("#") !== -1 || val.indexOf("$") !== -1)) {
                                ret = this.evalStr(val);
                            }
                            return ret;
                        },
                        getArray: function(literal) {
                            var ret = [];
                            if (literal.isRange) {
                                var begin = literal.value[0];
                                if (begin.type === "references") {
                                    begin = this.getReferences(begin);
                                }
                                var end = literal.value[1];
                                if (end.type === "references") {
                                    end = this.getReferences(end);
                                }
                                end = parseInt(end, 10);
                                begin = parseInt(begin, 10);
                                var i;
                                if (!isNaN(begin) && !isNaN(end)) {
                                    if (begin < end) {
                                        for (i = begin; i <= end; i++) ret.push(i);
                                    } else {
                                        for (i = begin; i >= end; i--) ret.push(i);
                                    }
                                }
                            } else {
                                utils.forEach(literal.value, function(exp) {
                                    ret.push(this.getLiteral(exp));
                                }, this);
                            }
                            return ret;
                        },
                        evalStr: function(str) {
                            if (Velocity.Parser) {
                                var asts = Velocity.Parser.parse(str);
                                ret = this._render(asts);
                            } else {
                                var ret = str;
                                var reg = /\$\{{0,1}([_a-z][a-z_\-0-9.]*)\}{0,1}/gi;
                                var self = this;
                                ret = ret.replace(reg, function() {
                                    return self._getFromVarname(arguments[1]);
                                });
                            }
                            return ret;
                        },
                        _getFromVarname: function(varname) {
                            var varPath = varname.split(".");
                            var ast = {
                                type: "references",
                                id: varPath[0],
                                leader: "$"
                            };
                            var path = [];
                            for (var i = 1; i < varPath.length; i++) {
                                path.push({
                                    type: "property",
                                    id: varPath[i]
                                });
                            }
                            if (path.length) ast.path = path;
                            return this.getReferences(ast);
                        }
                    });
                }(Velocity, utils);
                !function(Velocity, utils) {
                    function getSize(obj) {
                        if (utils.isArray(obj)) {
                            return obj.length;
                        } else if (utils.isObject(obj)) {
                            return utils.keys(obj).length;
                        }
                        return undefined;
                    }
                    utils.mixin(Velocity.prototype, {
                        getReferences: function(ast, isVal) {
                            var isSilent = this.silence || ast.leader === "$!";
                            var isfn = ast.args !== undefined;
                            var context = this.context;
                            var ret = context[ast.id];
                            var local = this.getLocal(ast);
                            if (ret !== undefined && isfn) {
                                ret = this.getPropMethod(ast, context);
                            }
                            if (local.isLocaled) ret = local["value"];
                            var isSet = this.hasSetMethod(ast, ret);
                            if (isSet !== false) {
                                if (!context[ast.id]) context[ast.id] = {};
                                utils.mixin(context[ast.id], isSet);
                                return "";
                            }
                            if (ast.path && ret !== undefined) {
                                utils.some(ast.path, function(property, i) {
                                    ret = this.getAttributes(property, ret);
                                    return ret === undefined;
                                }, this);
                            }
                            if (isVal && ret === undefined) ret = isSilent ? "" : Velocity.Helper.getRefText(ast);
                            return ret;
                        },
                        hasSetMethod: function(ast, context) {
                            var tools = {
                                control: true
                            };
                            var len = ast.path && ast.path.length;
                            if (!len || tools[ast.id]) return false;
                            var lastId = "" + ast.path[len - 1].id;
                            if (lastId.indexOf("set") !== 0) {
                                return false;
                            } else {
                                context = context || {};
                                utils.forEach(ast.path, function(ast) {
                                    if (ast.type === "method" && ast.id.indexOf("set") === 0) {
                                        context[ast.id.slice(3)] = this.getLiteral(ast.args[0]);
                                    } else {
                                        context[ast.id] = context[ast.id] || {};
                                    }
                                }, this);
                                return context;
                            }
                        },
                        getLocal: function(ast) {
                            var id = ast.id;
                            var local = this.local;
                            var ret = false;
                            var isLocaled = utils.some(this.conditions, function(contextId) {
                                var _local = local[contextId];
                                if (id in _local) {
                                    ret = _local[id];
                                    return true;
                                }
                                return false;
                            }, this);
                            return {
                                value: ret,
                                isLocaled: isLocaled
                            };
                        },
                        getAttributes: function(property, baseRef) {
                            var type = property.type;
                            var ret;
                            var id = property.id;
                            if (type === "method") {
                                ret = this.getPropMethod(property, baseRef);
                            } else if (type === "property") {
                                ret = baseRef[id];
                            } else {
                                ret = this.getPropIndex(property, baseRef);
                            }
                            return ret;
                        },
                        getPropIndex: function(property, baseRef) {
                            var ast = property.id;
                            var key;
                            if (ast.type === "references") {
                                key = this.getReferences(ast);
                            } else if (ast.type === "integer") {
                                key = ast.value;
                            } else {
                                key = ast.value;
                            }
                            return baseRef[key];
                        },
                        getPropMethod: function(property, baseRef) {
                            var id = property.id;
                            var ret = "";
                            var _id = id.slice(3);
                            if (id.indexOf("get") === 0 && !(id in baseRef)) {
                                if (_id) {
                                    ret = baseRef[_id];
                                } else {
                                    _id = this.getLiteral(property.args[0]);
                                    ret = baseRef[_id];
                                }
                                return ret;
                            } else if (id.indexOf("is") === 0 && !(id in baseRef)) {
                                _id = id.slice(2);
                                ret = baseRef[_id];
                                return ret;
                            } else if (id === "keySet") {
                                return utils.keys(baseRef);
                            } else if (id === "entrySet") {
                                ret = [];
                                utils.forEach(baseRef, function(value, key) {
                                    ret.push({
                                        key: key,
                                        value: value
                                    });
                                });
                                return ret;
                            } else if (id === "size") {
                                return getSize(baseRef);
                            } else {
                                ret = baseRef[id];
                                var args = [];
                                utils.forEach(property.args, function(exp) {
                                    args.push(this.getLiteral(exp));
                                }, this);
                                if (ret && ret.call) {
                                    var that = this;
                                    baseRef.eval = function() {
                                        return that.eval.apply(that, arguments);
                                    };
                                    ret = ret.apply(baseRef, args);
                                } else {
                                    ret = undefined;
                                }
                            }
                            return ret;
                        }
                    });
                }(Velocity, utils);
                !function(Velocity, utils) {
                    utils.mixin(Velocity.prototype, {
                        getContext: function() {
                            var condition = this.condition;
                            var local = this.local;
                            if (condition) {
                                return local[condition];
                            } else {
                                return this.context;
                            }
                        },
                        setValue: function(ast) {
                            var ref = ast.equal[0];
                            var context = this.context;
                            var valAst = ast.equal[1];
                            var val;
                            if (valAst.type === "math") {
                                val = this.getExpression(valAst);
                            } else {
                                val = this.getLiteral(ast.equal[1]);
                            }
                            if (!ref.path) {
                                context[ref.id] = val;
                            } else {
                                var baseRef = context[ref.id];
                                if (typeof baseRef != "object") {
                                    baseRef = {};
                                }
                                context[ref.id] = baseRef;
                                var len = ref.path ? ref.path.length : 0;
                                utils.forEach(ref.path, function(exp, i) {
                                    var isEnd = len === i + 1;
                                    var key = exp.id;
                                    if (exp.type === "index") {
                                        if (key.type === "references") {
                                            key.value = context[key.id];
                                        }
                                        key = key.value;
                                    }
                                    baseRef[key] = isEnd ? val : {};
                                    baseRef = baseRef[key];
                                });
                            }
                        }
                    });
                }(Velocity, utils);
                return Velocity;
            }(KISSY);
            var velocity = function(S) {
                var velocity = function() {
                    var parser = {
                        trace: function trace() {},
                        yy: {},
                        symbols_: {
                            error: 2,
                            root: 3,
                            statements: 4,
                            EOF: 5,
                            statement: 6,
                            references: 7,
                            directives: 8,
                            content: 9,
                            COMMENT: 10,
                            set: 11,
                            "if": 12,
                            elseif: 13,
                            "else": 14,
                            end: 15,
                            foreach: 16,
                            "break": 17,
                            define: 18,
                            HASH: 19,
                            NOESCAPE: 20,
                            PARENTHESIS: 21,
                            CLOSE_PARENTHESIS: 22,
                            macro: 23,
                            macro_call: 24,
                            SET: 25,
                            equal: 26,
                            IF: 27,
                            expression: 28,
                            ELSEIF: 29,
                            ELSE: 30,
                            END: 31,
                            FOREACH: 32,
                            DOLLAR: 33,
                            ID: 34,
                            IN: 35,
                            array: 36,
                            BREAK: 37,
                            DEFINE: 38,
                            MACRO: 39,
                            macro_args: 40,
                            macro_call_args_all: 41,
                            macro_call_args: 42,
                            literals: 43,
                            SPACE: 44,
                            COMMA: 45,
                            EQUAL: 46,
                            map: 47,
                            math: 48,
                            "||": 49,
                            "&&": 50,
                            "+": 51,
                            "-": 52,
                            "*": 53,
                            "/": 54,
                            "%": 55,
                            ">": 56,
                            "<": 57,
                            "==": 58,
                            ">=": 59,
                            "<=": 60,
                            "!=": 61,
                            parenthesis: 62,
                            "!": 63,
                            literal: 64,
                            brace_begin: 65,
                            attributes: 66,
                            brace_end: 67,
                            methodbd: 68,
                            VAR_BEGIN: 69,
                            MAP_BEGIN: 70,
                            VAR_END: 71,
                            MAP_END: 72,
                            attribute: 73,
                            method: 74,
                            index: 75,
                            property: 76,
                            DOT: 77,
                            params: 78,
                            CONTENT: 79,
                            BRACKET: 80,
                            CLOSE_BRACKET: 81,
                            string: 82,
                            number: 83,
                            BOOL: 84,
                            integer: 85,
                            INTEGER: 86,
                            DECIMAL_POINT: 87,
                            STRING: 88,
                            EVAL_STRING: 89,
                            range: 90,
                            RANGE: 91,
                            map_item: 92,
                            MAP_SPLIT: 93,
                            $accept: 0,
                            $end: 1
                        },
                        terminals_: {
                            2: "error",
                            5: "EOF",
                            10: "COMMENT",
                            19: "HASH",
                            20: "NOESCAPE",
                            21: "PARENTHESIS",
                            22: "CLOSE_PARENTHESIS",
                            25: "SET",
                            27: "IF",
                            29: "ELSEIF",
                            30: "ELSE",
                            31: "END",
                            32: "FOREACH",
                            33: "DOLLAR",
                            34: "ID",
                            35: "IN",
                            37: "BREAK",
                            38: "DEFINE",
                            39: "MACRO",
                            44: "SPACE",
                            45: "COMMA",
                            46: "EQUAL",
                            49: "||",
                            50: "&&",
                            51: "+",
                            52: "-",
                            53: "*",
                            54: "/",
                            55: "%",
                            56: ">",
                            57: "<",
                            58: "==",
                            59: ">=",
                            60: "<=",
                            61: "!=",
                            63: "!",
                            69: "VAR_BEGIN",
                            70: "MAP_BEGIN",
                            71: "VAR_END",
                            72: "MAP_END",
                            77: "DOT",
                            79: "CONTENT",
                            80: "BRACKET",
                            81: "CLOSE_BRACKET",
                            84: "BOOL",
                            86: "INTEGER",
                            87: "DECIMAL_POINT",
                            88: "STRING",
                            89: "EVAL_STRING",
                            91: "RANGE",
                            93: "MAP_SPLIT"
                        },
                        productions_: [ 0, [ 3, 2 ], [ 4, 1 ], [ 4, 2 ], [ 6, 1 ], [ 6, 1 ], [ 6, 1 ], [ 6, 1 ], [ 8, 1 ], [ 8, 1 ], [ 8, 1 ], [ 8, 1 ], [ 8, 1 ], [ 8, 1 ], [ 8, 1 ], [ 8, 1 ], [ 8, 4 ], [ 8, 1 ], [ 8, 1 ], [ 11, 5 ], [ 12, 5 ], [ 13, 5 ], [ 14, 2 ], [ 15, 2 ], [ 16, 8 ], [ 16, 8 ], [ 17, 2 ], [ 18, 6 ], [ 23, 6 ], [ 23, 5 ], [ 40, 1 ], [ 40, 2 ], [ 24, 5 ], [ 24, 4 ], [ 42, 1 ], [ 42, 1 ], [ 42, 3 ], [ 42, 3 ], [ 42, 3 ], [ 42, 3 ], [ 41, 1 ], [ 41, 2 ], [ 41, 3 ], [ 41, 2 ], [ 26, 3 ], [ 28, 1 ], [ 28, 1 ], [ 28, 1 ], [ 48, 3 ], [ 48, 3 ], [ 48, 3 ], [ 48, 3 ], [ 48, 3 ], [ 48, 3 ], [ 48, 3 ], [ 48, 3 ], [ 48, 3 ], [ 48, 3 ], [ 48, 3 ], [ 48, 3 ], [ 48, 3 ], [ 48, 1 ], [ 48, 2 ], [ 48, 2 ], [ 48, 1 ], [ 48, 1 ], [ 62, 3 ], [ 7, 5 ], [ 7, 3 ], [ 7, 5 ], [ 7, 3 ], [ 7, 2 ], [ 7, 4 ], [ 7, 2 ], [ 7, 4 ], [ 65, 1 ], [ 65, 1 ], [ 67, 1 ], [ 67, 1 ], [ 66, 1 ], [ 66, 2 ], [ 73, 1 ], [ 73, 1 ], [ 73, 1 ], [ 74, 2 ], [ 68, 4 ], [ 68, 3 ], [ 78, 1 ], [ 78, 1 ], [ 78, 3 ], [ 78, 3 ], [ 76, 2 ], [ 76, 2 ], [ 75, 3 ], [ 75, 3 ], [ 75, 3 ], [ 75, 2 ], [ 75, 2 ], [ 64, 1 ], [ 64, 1 ], [ 64, 1 ], [ 83, 1 ], [ 83, 3 ], [ 83, 4 ], [ 85, 1 ], [ 85, 2 ], [ 82, 1 ], [ 82, 1 ], [ 43, 1 ], [ 43, 1 ], [ 43, 1 ], [ 36, 3 ], [ 36, 1 ], [ 36, 2 ], [ 90, 5 ], [ 90, 5 ], [ 90, 5 ], [ 90, 5 ], [ 47, 3 ], [ 47, 2 ], [ 92, 3 ], [ 92, 3 ], [ 92, 2 ], [ 92, 5 ], [ 92, 5 ], [ 9, 1 ], [ 9, 1 ], [ 9, 2 ], [ 9, 3 ], [ 9, 3 ], [ 9, 2 ] ],
                        performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$) {
                            var $0 = $$.length - 1;
                            switch (yystate) {
                              case 1:
                                return $$[$0 - 1];
                                break;
                              case 2:
                                this.$ = [ $$[$0] ];
                                break;
                              case 3:
                                this.$ = [].concat($$[$0 - 1], $$[$0]);
                                break;
                              case 4:
                                this.$ = $$[$0];
                                break;
                              case 5:
                                this.$ = $$[$0];
                                break;
                              case 6:
                                this.$ = $$[$0];
                                break;
                              case 7:
                                this.$ = {
                                    type: "comment",
                                    value: $$[$0]
                                };
                                break;
                              case 8:
                                this.$ = $$[$0];
                                break;
                              case 9:
                                this.$ = $$[$0];
                                break;
                              case 10:
                                this.$ = $$[$0];
                                break;
                              case 11:
                                this.$ = $$[$0];
                                break;
                              case 12:
                                this.$ = $$[$0];
                                break;
                              case 13:
                                this.$ = $$[$0];
                                break;
                              case 14:
                                this.$ = $$[$0];
                                break;
                              case 15:
                                this.$ = $$[$0];
                                break;
                              case 16:
                                this.$ = {
                                    type: "noescape"
                                };
                                break;
                              case 17:
                                this.$ = $$[$0];
                                break;
                              case 18:
                                this.$ = $$[$0];
                                break;
                              case 19:
                                this.$ = {
                                    type: "set",
                                    equal: $$[$0 - 1]
                                };
                                break;
                              case 20:
                                this.$ = {
                                    type: "if",
                                    condition: $$[$0 - 1]
                                };
                                break;
                              case 21:
                                this.$ = {
                                    type: "elseif",
                                    condition: $$[$0 - 1]
                                };
                                break;
                              case 22:
                                this.$ = {
                                    type: "else"
                                };
                                break;
                              case 23:
                                this.$ = {
                                    type: "end"
                                };
                                break;
                              case 24:
                                this.$ = {
                                    type: "foreach",
                                    to: $$[$0 - 3],
                                    from: $$[$0 - 1]
                                };
                                break;
                              case 25:
                                this.$ = {
                                    type: "foreach",
                                    to: $$[$0 - 3],
                                    from: $$[$0 - 1]
                                };
                                break;
                              case 26:
                                this.$ = {
                                    type: $$[$0]
                                };
                                break;
                              case 27:
                                this.$ = {
                                    type: "define",
                                    id: $$[$0 - 1]
                                };
                                break;
                              case 28:
                                this.$ = {
                                    type: "macro",
                                    id: $$[$0 - 2],
                                    args: $$[$0 - 1]
                                };
                                break;
                              case 29:
                                this.$ = {
                                    type: "macro",
                                    id: $$[$0 - 1]
                                };
                                break;
                              case 30:
                                this.$ = [ $$[$0] ];
                                break;
                              case 31:
                                this.$ = [].concat($$[$0 - 1], $$[$0]);
                                break;
                              case 32:
                                this.$ = {
                                    type: "macro_call",
                                    id: $$[$0 - 3].replace(/^\s+|\s+$/g, ""),
                                    args: $$[$0 - 1]
                                };
                                break;
                              case 33:
                                this.$ = {
                                    type: "macro_call",
                                    id: $$[$0 - 2].replace(/^\s+|\s+$/g, "")
                                };
                                break;
                              case 34:
                                this.$ = [ $$[$0] ];
                                break;
                              case 35:
                                this.$ = [ $$[$0] ];
                                break;
                              case 36:
                                this.$ = [].concat($$[$0 - 2], $$[$0]);
                                break;
                              case 37:
                                this.$ = [].concat($$[$0 - 2], $$[$0]);
                                break;
                              case 38:
                                this.$ = [].concat($$[$0 - 2], $$[$0]);
                                break;
                              case 39:
                                this.$ = [].concat($$[$0 - 2], $$[$0]);
                                break;
                              case 40:
                                this.$ = $$[$0];
                                break;
                              case 41:
                                this.$ = $$[$0];
                                break;
                              case 42:
                                this.$ = $$[$0 - 1];
                                break;
                              case 43:
                                this.$ = $$[$0 - 1];
                                break;
                              case 44:
                                this.$ = [ $$[$0 - 2], $$[$0] ];
                                break;
                              case 45:
                                this.$ = $$[$0];
                                break;
                              case 46:
                                this.$ = $$[$0];
                                break;
                              case 47:
                                this.$ = $$[$0];
                                break;
                              case 48:
                                this.$ = {
                                    type: "math",
                                    expression: [ $$[$0 - 2], $$[$0] ],
                                    operator: $$[$0 - 1]
                                };
                                break;
                              case 49:
                                this.$ = {
                                    type: "math",
                                    expression: [ $$[$0 - 2], $$[$0] ],
                                    operator: $$[$0 - 1]
                                };
                                break;
                              case 50:
                                this.$ = {
                                    type: "math",
                                    expression: [ $$[$0 - 2], $$[$0] ],
                                    operator: $$[$0 - 1]
                                };
                                break;
                              case 51:
                                this.$ = {
                                    type: "math",
                                    expression: [ $$[$0 - 2], $$[$0] ],
                                    operator: $$[$0 - 1]
                                };
                                break;
                              case 52:
                                this.$ = {
                                    type: "math",
                                    expression: [ $$[$0 - 2], $$[$0] ],
                                    operator: $$[$0 - 1]
                                };
                                break;
                              case 53:
                                this.$ = {
                                    type: "math",
                                    expression: [ $$[$0 - 2], $$[$0] ],
                                    operator: $$[$0 - 1]
                                };
                                break;
                              case 54:
                                this.$ = {
                                    type: "math",
                                    expression: [ $$[$0 - 2], $$[$0] ],
                                    operator: $$[$0 - 1]
                                };
                                break;
                              case 55:
                                this.$ = {
                                    type: "math",
                                    expression: [ $$[$0 - 2], $$[$0] ],
                                    operator: $$[$0 - 1]
                                };
                                break;
                              case 56:
                                this.$ = {
                                    type: "math",
                                    expression: [ $$[$0 - 2], $$[$0] ],
                                    operator: $$[$0 - 1]
                                };
                                break;
                              case 57:
                                this.$ = {
                                    type: "math",
                                    expression: [ $$[$0 - 2], $$[$0] ],
                                    operator: $$[$0 - 1]
                                };
                                break;
                              case 58:
                                this.$ = {
                                    type: "math",
                                    expression: [ $$[$0 - 2], $$[$0] ],
                                    operator: $$[$0 - 1]
                                };
                                break;
                              case 59:
                                this.$ = {
                                    type: "math",
                                    expression: [ $$[$0 - 2], $$[$0] ],
                                    operator: $$[$0 - 1]
                                };
                                break;
                              case 60:
                                this.$ = {
                                    type: "math",
                                    expression: [ $$[$0 - 2], $$[$0] ],
                                    operator: $$[$0 - 1]
                                };
                                break;
                              case 61:
                                this.$ = $$[$0];
                                break;
                              case 62:
                                this.$ = {
                                    type: "math",
                                    expression: [ $$[$0] ],
                                    operator: "minus"
                                };
                                break;
                              case 63:
                                this.$ = {
                                    type: "math",
                                    expression: [ $$[$0] ],
                                    operator: "not"
                                };
                                break;
                              case 64:
                                this.$ = $$[$0];
                                break;
                              case 65:
                                this.$ = $$[$0];
                                break;
                              case 66:
                                this.$ = {
                                    type: "math",
                                    expression: [ $$[$0 - 1] ],
                                    operator: "parenthesis"
                                };
                                break;
                              case 67:
                                this.$ = {
                                    type: "references",
                                    id: $$[$0 - 2],
                                    path: $$[$0 - 1],
                                    isWraped: true,
                                    leader: $$[$0 - 4]
                                };
                                break;
                              case 68:
                                this.$ = {
                                    type: "references",
                                    id: $$[$0 - 1],
                                    path: $$[$0],
                                    leader: $$[$0 - 2]
                                };
                                break;
                              case 69:
                                this.$ = {
                                    type: "references",
                                    id: $$[$0 - 2].id,
                                    path: $$[$0 - 1],
                                    isWraped: true,
                                    leader: $$[$0 - 4],
                                    args: $$[$0 - 2].args
                                };
                                break;
                              case 70:
                                this.$ = {
                                    type: "references",
                                    id: $$[$0 - 1].id,
                                    path: $$[$0],
                                    leader: $$[$0 - 2],
                                    args: $$[$0 - 1].args
                                };
                                break;
                              case 71:
                                this.$ = {
                                    type: "references",
                                    id: $$[$0],
                                    leader: $$[$0 - 1]
                                };
                                break;
                              case 72:
                                this.$ = {
                                    type: "references",
                                    id: $$[$0 - 1],
                                    isWraped: true,
                                    leader: $$[$0 - 3]
                                };
                                break;
                              case 73:
                                this.$ = {
                                    type: "references",
                                    id: $$[$0].id,
                                    leader: $$[$0 - 1],
                                    args: $$[$0].args
                                };
                                break;
                              case 74:
                                this.$ = {
                                    type: "references",
                                    id: $$[$0 - 1].id,
                                    isWraped: true,
                                    args: $$[$0 - 1].args,
                                    leader: $$[$0 - 3]
                                };
                                break;
                              case 75:
                                this.$ = $$[$0];
                                break;
                              case 76:
                                this.$ = $$[$0];
                                break;
                              case 77:
                                this.$ = $$[$0];
                                break;
                              case 78:
                                this.$ = $$[$0];
                                break;
                              case 79:
                                this.$ = [ $$[$0] ];
                                break;
                              case 80:
                                this.$ = [].concat($$[$0 - 1], $$[$0]);
                                break;
                              case 81:
                                this.$ = {
                                    type: "method",
                                    id: $$[$0].id,
                                    args: $$[$0].args
                                };
                                break;
                              case 82:
                                this.$ = {
                                    type: "index",
                                    id: $$[$0]
                                };
                                break;
                              case 83:
                                this.$ = {
                                    type: "property",
                                    id: $$[$0]
                                };
                                if ($$[$0].type === "content") this.$ = $$[$0];
                                break;
                              case 84:
                                this.$ = $$[$0];
                                break;
                              case 85:
                                this.$ = {
                                    id: $$[$0 - 3],
                                    args: $$[$0 - 1]
                                };
                                break;
                              case 86:
                                this.$ = {
                                    id: $$[$0 - 2],
                                    args: false
                                };
                                break;
                              case 87:
                                this.$ = [ $$[$0] ];
                                break;
                              case 88:
                                this.$ = [ $$[$0] ];
                                break;
                              case 89:
                                this.$ = [].concat($$[$0 - 2], $$[$0]);
                                break;
                              case 90:
                                this.$ = [].concat($$[$0 - 2], $$[$0]);
                                break;
                              case 91:
                                this.$ = $$[$0];
                                break;
                              case 92:
                                this.$ = {
                                    type: "content",
                                    value: $$[$0 - 1] + $$[$0]
                                };
                                break;
                              case 93:
                                this.$ = $$[$0 - 1];
                                break;
                              case 94:
                                this.$ = $$[$0 - 1];
                                break;
                              case 95:
                                this.$ = {
                                    type: "content",
                                    value: $$[$0 - 2] + $$[$0 - 1].value + $$[$0]
                                };
                                break;
                              case 96:
                                this.$ = {
                                    type: "content",
                                    value: $$[$0 - 1] + $$[$0]
                                };
                                break;
                              case 97:
                                this.$ = {
                                    type: "content",
                                    value: $$[$0 - 1] + $$[$0]
                                };
                                break;
                              case 98:
                                this.$ = $$[$0];
                                break;
                              case 99:
                                this.$ = $$[$0];
                                break;
                              case 100:
                                this.$ = {
                                    type: "bool",
                                    value: $$[$0]
                                };
                                break;
                              case 101:
                                this.$ = {
                                    type: "integer",
                                    value: $$[$0]
                                };
                                break;
                              case 102:
                                this.$ = {
                                    type: "decimal",
                                    value: +($$[$0 - 2] + "." + $$[$0])
                                };
                                break;
                              case 103:
                                this.$ = {
                                    type: "decimal",
                                    value: -($$[$0 - 2] + "." + $$[$0])
                                };
                                break;
                              case 104:
                                this.$ = $$[$0];
                                break;
                              case 105:
                                this.$ = -parseInt($$[$0], 10);
                                break;
                              case 106:
                                this.$ = {
                                    type: "string",
                                    value: $$[$0]
                                };
                                break;
                              case 107:
                                this.$ = {
                                    type: "string",
                                    value: $$[$0],
                                    isEval: true
                                };
                                break;
                              case 108:
                                this.$ = $$[$0];
                                break;
                              case 109:
                                this.$ = $$[$0];
                                break;
                              case 110:
                                this.$ = $$[$0];
                                break;
                              case 111:
                                this.$ = {
                                    type: "array",
                                    value: $$[$0 - 1]
                                };
                                break;
                              case 112:
                                this.$ = $$[$0];
                                break;
                              case 113:
                                this.$ = {
                                    type: "array",
                                    value: []
                                };
                                break;
                              case 114:
                                this.$ = {
                                    type: "array",
                                    isRange: true,
                                    value: [ $$[$0 - 3], $$[$0 - 1] ]
                                };
                                break;
                              case 115:
                                this.$ = {
                                    type: "array",
                                    isRange: true,
                                    value: [ $$[$0 - 3], $$[$0 - 1] ]
                                };
                                break;
                              case 116:
                                this.$ = {
                                    type: "array",
                                    isRange: true,
                                    value: [ $$[$0 - 3], $$[$0 - 1] ]
                                };
                                break;
                              case 117:
                                this.$ = {
                                    type: "array",
                                    isRange: true,
                                    value: [ $$[$0 - 3], $$[$0 - 1] ]
                                };
                                break;
                              case 118:
                                this.$ = {
                                    type: "map",
                                    value: $$[$0 - 1]
                                };
                                break;
                              case 119:
                                this.$ = {
                                    type: "map"
                                };
                                break;
                              case 120:
                                this.$ = {};
                                this.$[$$[$0 - 2].value] = $$[$0];
                                break;
                              case 121:
                                this.$ = {};
                                this.$[$$[$0 - 2].value] = $$[$0];
                                break;
                              case 122:
                                this.$ = {};
                                this.$[$$[$0 - 1].value] = $$[$01];
                                break;
                              case 123:
                                this.$ = $$[$0 - 4];
                                this.$[$$[$0 - 2].value] = $$[$0];
                                break;
                              case 124:
                                this.$ = $$[$0 - 4];
                                this.$[$$[$0 - 2].value] = $$[$0];
                                break;
                              case 125:
                                this.$ = $$[$0];
                                break;
                              case 126:
                                this.$ = $$[$0];
                                break;
                              case 127:
                                this.$ = $$[$0 - 1] + $$[$0];
                                break;
                              case 128:
                                this.$ = $$[$0 - 2] + $$[$0 - 1] + $$[$0];
                                break;
                              case 129:
                                this.$ = $$[$0 - 2] + $$[$0 - 1];
                                break;
                              case 130:
                                this.$ = $$[$0 - 1] + $$[$0];
                                break;
                            }
                        },
                        table: [ {
                            3: 1,
                            4: 2,
                            6: 3,
                            7: 4,
                            8: 5,
                            9: 6,
                            10: [ 1, 7 ],
                            11: 9,
                            12: 10,
                            13: 11,
                            14: 12,
                            15: 13,
                            16: 14,
                            17: 15,
                            18: 16,
                            19: [ 1, 17 ],
                            23: 18,
                            24: 19,
                            33: [ 1, 8 ],
                            34: [ 1, 21 ],
                            79: [ 1, 20 ]
                        }, {
                            1: [ 3 ]
                        }, {
                            5: [ 1, 22 ],
                            6: 23,
                            7: 4,
                            8: 5,
                            9: 6,
                            10: [ 1, 7 ],
                            11: 9,
                            12: 10,
                            13: 11,
                            14: 12,
                            15: 13,
                            16: 14,
                            17: 15,
                            18: 16,
                            19: [ 1, 17 ],
                            23: 18,
                            24: 19,
                            33: [ 1, 8 ],
                            34: [ 1, 21 ],
                            79: [ 1, 20 ]
                        }, {
                            5: [ 2, 2 ],
                            10: [ 2, 2 ],
                            19: [ 2, 2 ],
                            33: [ 2, 2 ],
                            34: [ 2, 2 ],
                            79: [ 2, 2 ]
                        }, {
                            5: [ 2, 4 ],
                            10: [ 2, 4 ],
                            19: [ 2, 4 ],
                            33: [ 2, 4 ],
                            34: [ 2, 4 ],
                            79: [ 2, 4 ]
                        }, {
                            5: [ 2, 5 ],
                            10: [ 2, 5 ],
                            19: [ 2, 5 ],
                            33: [ 2, 5 ],
                            34: [ 2, 5 ],
                            79: [ 2, 5 ]
                        }, {
                            5: [ 2, 6 ],
                            10: [ 2, 6 ],
                            19: [ 2, 6 ],
                            33: [ 2, 6 ],
                            34: [ 2, 6 ],
                            79: [ 2, 6 ]
                        }, {
                            5: [ 2, 7 ],
                            10: [ 2, 7 ],
                            19: [ 2, 7 ],
                            33: [ 2, 7 ],
                            34: [ 2, 7 ],
                            79: [ 2, 7 ]
                        }, {
                            34: [ 1, 25 ],
                            65: 24,
                            67: 27,
                            68: 26,
                            69: [ 1, 29 ],
                            70: [ 1, 30 ],
                            71: [ 1, 31 ],
                            72: [ 1, 32 ],
                            79: [ 1, 28 ]
                        }, {
                            5: [ 2, 8 ],
                            10: [ 2, 8 ],
                            19: [ 2, 8 ],
                            33: [ 2, 8 ],
                            34: [ 2, 8 ],
                            79: [ 2, 8 ]
                        }, {
                            5: [ 2, 9 ],
                            10: [ 2, 9 ],
                            19: [ 2, 9 ],
                            33: [ 2, 9 ],
                            34: [ 2, 9 ],
                            79: [ 2, 9 ]
                        }, {
                            5: [ 2, 10 ],
                            10: [ 2, 10 ],
                            19: [ 2, 10 ],
                            33: [ 2, 10 ],
                            34: [ 2, 10 ],
                            79: [ 2, 10 ]
                        }, {
                            5: [ 2, 11 ],
                            10: [ 2, 11 ],
                            19: [ 2, 11 ],
                            33: [ 2, 11 ],
                            34: [ 2, 11 ],
                            79: [ 2, 11 ]
                        }, {
                            5: [ 2, 12 ],
                            10: [ 2, 12 ],
                            19: [ 2, 12 ],
                            33: [ 2, 12 ],
                            34: [ 2, 12 ],
                            79: [ 2, 12 ]
                        }, {
                            5: [ 2, 13 ],
                            10: [ 2, 13 ],
                            19: [ 2, 13 ],
                            33: [ 2, 13 ],
                            34: [ 2, 13 ],
                            79: [ 2, 13 ]
                        }, {
                            5: [ 2, 14 ],
                            10: [ 2, 14 ],
                            19: [ 2, 14 ],
                            33: [ 2, 14 ],
                            34: [ 2, 14 ],
                            79: [ 2, 14 ]
                        }, {
                            5: [ 2, 15 ],
                            10: [ 2, 15 ],
                            19: [ 2, 15 ],
                            33: [ 2, 15 ],
                            34: [ 2, 15 ],
                            79: [ 2, 15 ]
                        }, {
                            20: [ 1, 33 ],
                            25: [ 1, 36 ],
                            27: [ 1, 37 ],
                            29: [ 1, 38 ],
                            30: [ 1, 39 ],
                            31: [ 1, 40 ],
                            32: [ 1, 41 ],
                            34: [ 1, 35 ],
                            37: [ 1, 42 ],
                            38: [ 1, 43 ],
                            39: [ 1, 44 ],
                            79: [ 1, 34 ]
                        }, {
                            5: [ 2, 17 ],
                            10: [ 2, 17 ],
                            19: [ 2, 17 ],
                            33: [ 2, 17 ],
                            34: [ 2, 17 ],
                            79: [ 2, 17 ]
                        }, {
                            5: [ 2, 18 ],
                            10: [ 2, 18 ],
                            19: [ 2, 18 ],
                            33: [ 2, 18 ],
                            34: [ 2, 18 ],
                            79: [ 2, 18 ]
                        }, {
                            5: [ 2, 125 ],
                            10: [ 2, 125 ],
                            19: [ 2, 125 ],
                            33: [ 2, 125 ],
                            34: [ 2, 125 ],
                            79: [ 2, 125 ]
                        }, {
                            5: [ 2, 126 ],
                            10: [ 2, 126 ],
                            19: [ 2, 126 ],
                            33: [ 2, 126 ],
                            34: [ 2, 126 ],
                            79: [ 2, 126 ]
                        }, {
                            1: [ 2, 1 ]
                        }, {
                            5: [ 2, 3 ],
                            10: [ 2, 3 ],
                            19: [ 2, 3 ],
                            33: [ 2, 3 ],
                            34: [ 2, 3 ],
                            79: [ 2, 3 ]
                        }, {
                            34: [ 1, 45 ],
                            68: 46
                        }, {
                            5: [ 2, 71 ],
                            10: [ 2, 71 ],
                            19: [ 2, 71 ],
                            21: [ 1, 48 ],
                            22: [ 2, 71 ],
                            33: [ 2, 71 ],
                            34: [ 2, 71 ],
                            44: [ 2, 71 ],
                            45: [ 2, 71 ],
                            46: [ 2, 71 ],
                            49: [ 2, 71 ],
                            50: [ 2, 71 ],
                            51: [ 2, 71 ],
                            52: [ 2, 71 ],
                            53: [ 2, 71 ],
                            54: [ 2, 71 ],
                            55: [ 2, 71 ],
                            56: [ 2, 71 ],
                            57: [ 2, 71 ],
                            58: [ 2, 71 ],
                            59: [ 2, 71 ],
                            60: [ 2, 71 ],
                            61: [ 2, 71 ],
                            66: 47,
                            72: [ 2, 71 ],
                            73: 49,
                            74: 50,
                            75: 51,
                            76: 52,
                            77: [ 1, 53 ],
                            79: [ 2, 71 ],
                            80: [ 1, 54 ],
                            81: [ 2, 71 ],
                            91: [ 2, 71 ]
                        }, {
                            5: [ 2, 73 ],
                            10: [ 2, 73 ],
                            19: [ 2, 73 ],
                            22: [ 2, 73 ],
                            33: [ 2, 73 ],
                            34: [ 2, 73 ],
                            44: [ 2, 73 ],
                            45: [ 2, 73 ],
                            46: [ 2, 73 ],
                            49: [ 2, 73 ],
                            50: [ 2, 73 ],
                            51: [ 2, 73 ],
                            52: [ 2, 73 ],
                            53: [ 2, 73 ],
                            54: [ 2, 73 ],
                            55: [ 2, 73 ],
                            56: [ 2, 73 ],
                            57: [ 2, 73 ],
                            58: [ 2, 73 ],
                            59: [ 2, 73 ],
                            60: [ 2, 73 ],
                            61: [ 2, 73 ],
                            66: 55,
                            72: [ 2, 73 ],
                            73: 49,
                            74: 50,
                            75: 51,
                            76: 52,
                            77: [ 1, 53 ],
                            79: [ 2, 73 ],
                            80: [ 1, 54 ],
                            81: [ 2, 73 ],
                            91: [ 2, 73 ]
                        }, {
                            34: [ 1, 57 ],
                            68: 56
                        }, {
                            5: [ 2, 130 ],
                            10: [ 2, 130 ],
                            19: [ 2, 130 ],
                            33: [ 2, 130 ],
                            34: [ 2, 130 ],
                            79: [ 2, 130 ]
                        }, {
                            34: [ 2, 75 ]
                        }, {
                            34: [ 2, 76 ]
                        }, {
                            5: [ 2, 77 ],
                            10: [ 2, 77 ],
                            19: [ 2, 77 ],
                            22: [ 2, 77 ],
                            33: [ 2, 77 ],
                            34: [ 2, 77 ],
                            44: [ 2, 77 ],
                            45: [ 2, 77 ],
                            46: [ 2, 77 ],
                            49: [ 2, 77 ],
                            50: [ 2, 77 ],
                            51: [ 2, 77 ],
                            52: [ 2, 77 ],
                            53: [ 2, 77 ],
                            54: [ 2, 77 ],
                            55: [ 2, 77 ],
                            56: [ 2, 77 ],
                            57: [ 2, 77 ],
                            58: [ 2, 77 ],
                            59: [ 2, 77 ],
                            60: [ 2, 77 ],
                            61: [ 2, 77 ],
                            72: [ 2, 77 ],
                            79: [ 2, 77 ],
                            81: [ 2, 77 ],
                            91: [ 2, 77 ]
                        }, {
                            5: [ 2, 78 ],
                            10: [ 2, 78 ],
                            19: [ 2, 78 ],
                            22: [ 2, 78 ],
                            33: [ 2, 78 ],
                            34: [ 2, 78 ],
                            44: [ 2, 78 ],
                            45: [ 2, 78 ],
                            46: [ 2, 78 ],
                            49: [ 2, 78 ],
                            50: [ 2, 78 ],
                            51: [ 2, 78 ],
                            52: [ 2, 78 ],
                            53: [ 2, 78 ],
                            54: [ 2, 78 ],
                            55: [ 2, 78 ],
                            56: [ 2, 78 ],
                            57: [ 2, 78 ],
                            58: [ 2, 78 ],
                            59: [ 2, 78 ],
                            60: [ 2, 78 ],
                            61: [ 2, 78 ],
                            72: [ 2, 78 ],
                            79: [ 2, 78 ],
                            81: [ 2, 78 ],
                            91: [ 2, 78 ]
                        }, {
                            21: [ 1, 58 ]
                        }, {
                            5: [ 2, 127 ],
                            10: [ 2, 127 ],
                            19: [ 2, 127 ],
                            33: [ 2, 127 ],
                            34: [ 2, 127 ],
                            79: [ 2, 127 ]
                        }, {
                            5: [ 1, 60 ],
                            21: [ 1, 61 ],
                            79: [ 1, 59 ]
                        }, {
                            21: [ 1, 62 ]
                        }, {
                            21: [ 1, 63 ]
                        }, {
                            21: [ 1, 64 ]
                        }, {
                            5: [ 2, 22 ],
                            10: [ 2, 22 ],
                            19: [ 2, 22 ],
                            33: [ 2, 22 ],
                            34: [ 2, 22 ],
                            79: [ 2, 22 ]
                        }, {
                            5: [ 2, 23 ],
                            10: [ 2, 23 ],
                            19: [ 2, 23 ],
                            33: [ 2, 23 ],
                            34: [ 2, 23 ],
                            79: [ 2, 23 ]
                        }, {
                            21: [ 1, 65 ]
                        }, {
                            5: [ 2, 26 ],
                            10: [ 2, 26 ],
                            19: [ 2, 26 ],
                            33: [ 2, 26 ],
                            34: [ 2, 26 ],
                            79: [ 2, 26 ]
                        }, {
                            21: [ 1, 66 ]
                        }, {
                            21: [ 1, 67 ]
                        }, {
                            21: [ 1, 48 ],
                            66: 68,
                            67: 69,
                            71: [ 1, 31 ],
                            72: [ 1, 32 ],
                            73: 49,
                            74: 50,
                            75: 51,
                            76: 52,
                            77: [ 1, 53 ],
                            80: [ 1, 54 ]
                        }, {
                            66: 70,
                            73: 49,
                            74: 50,
                            75: 51,
                            76: 52,
                            77: [ 1, 53 ],
                            80: [ 1, 54 ]
                        }, {
                            5: [ 2, 68 ],
                            10: [ 2, 68 ],
                            19: [ 2, 68 ],
                            22: [ 2, 68 ],
                            33: [ 2, 68 ],
                            34: [ 2, 68 ],
                            44: [ 2, 68 ],
                            45: [ 2, 68 ],
                            46: [ 2, 68 ],
                            49: [ 2, 68 ],
                            50: [ 2, 68 ],
                            51: [ 2, 68 ],
                            52: [ 2, 68 ],
                            53: [ 2, 68 ],
                            54: [ 2, 68 ],
                            55: [ 2, 68 ],
                            56: [ 2, 68 ],
                            57: [ 2, 68 ],
                            58: [ 2, 68 ],
                            59: [ 2, 68 ],
                            60: [ 2, 68 ],
                            61: [ 2, 68 ],
                            72: [ 2, 68 ],
                            73: 71,
                            74: 50,
                            75: 51,
                            76: 52,
                            77: [ 1, 53 ],
                            79: [ 2, 68 ],
                            80: [ 1, 54 ],
                            81: [ 2, 68 ],
                            91: [ 2, 68 ]
                        }, {
                            7: 75,
                            22: [ 1, 73 ],
                            33: [ 1, 79 ],
                            36: 76,
                            43: 74,
                            47: 77,
                            52: [ 1, 90 ],
                            64: 78,
                            70: [ 1, 82 ],
                            78: 72,
                            80: [ 1, 80 ],
                            82: 83,
                            83: 84,
                            84: [ 1, 85 ],
                            85: 88,
                            86: [ 1, 89 ],
                            88: [ 1, 86 ],
                            89: [ 1, 87 ],
                            90: 81
                        }, {
                            5: [ 2, 79 ],
                            10: [ 2, 79 ],
                            19: [ 2, 79 ],
                            22: [ 2, 79 ],
                            33: [ 2, 79 ],
                            34: [ 2, 79 ],
                            44: [ 2, 79 ],
                            45: [ 2, 79 ],
                            46: [ 2, 79 ],
                            49: [ 2, 79 ],
                            50: [ 2, 79 ],
                            51: [ 2, 79 ],
                            52: [ 2, 79 ],
                            53: [ 2, 79 ],
                            54: [ 2, 79 ],
                            55: [ 2, 79 ],
                            56: [ 2, 79 ],
                            57: [ 2, 79 ],
                            58: [ 2, 79 ],
                            59: [ 2, 79 ],
                            60: [ 2, 79 ],
                            61: [ 2, 79 ],
                            71: [ 2, 79 ],
                            72: [ 2, 79 ],
                            77: [ 2, 79 ],
                            79: [ 2, 79 ],
                            80: [ 2, 79 ],
                            81: [ 2, 79 ],
                            91: [ 2, 79 ]
                        }, {
                            5: [ 2, 81 ],
                            10: [ 2, 81 ],
                            19: [ 2, 81 ],
                            22: [ 2, 81 ],
                            33: [ 2, 81 ],
                            34: [ 2, 81 ],
                            44: [ 2, 81 ],
                            45: [ 2, 81 ],
                            46: [ 2, 81 ],
                            49: [ 2, 81 ],
                            50: [ 2, 81 ],
                            51: [ 2, 81 ],
                            52: [ 2, 81 ],
                            53: [ 2, 81 ],
                            54: [ 2, 81 ],
                            55: [ 2, 81 ],
                            56: [ 2, 81 ],
                            57: [ 2, 81 ],
                            58: [ 2, 81 ],
                            59: [ 2, 81 ],
                            60: [ 2, 81 ],
                            61: [ 2, 81 ],
                            71: [ 2, 81 ],
                            72: [ 2, 81 ],
                            77: [ 2, 81 ],
                            79: [ 2, 81 ],
                            80: [ 2, 81 ],
                            81: [ 2, 81 ],
                            91: [ 2, 81 ]
                        }, {
                            5: [ 2, 82 ],
                            10: [ 2, 82 ],
                            19: [ 2, 82 ],
                            22: [ 2, 82 ],
                            33: [ 2, 82 ],
                            34: [ 2, 82 ],
                            44: [ 2, 82 ],
                            45: [ 2, 82 ],
                            46: [ 2, 82 ],
                            49: [ 2, 82 ],
                            50: [ 2, 82 ],
                            51: [ 2, 82 ],
                            52: [ 2, 82 ],
                            53: [ 2, 82 ],
                            54: [ 2, 82 ],
                            55: [ 2, 82 ],
                            56: [ 2, 82 ],
                            57: [ 2, 82 ],
                            58: [ 2, 82 ],
                            59: [ 2, 82 ],
                            60: [ 2, 82 ],
                            61: [ 2, 82 ],
                            71: [ 2, 82 ],
                            72: [ 2, 82 ],
                            77: [ 2, 82 ],
                            79: [ 2, 82 ],
                            80: [ 2, 82 ],
                            81: [ 2, 82 ],
                            91: [ 2, 82 ]
                        }, {
                            5: [ 2, 83 ],
                            10: [ 2, 83 ],
                            19: [ 2, 83 ],
                            22: [ 2, 83 ],
                            33: [ 2, 83 ],
                            34: [ 2, 83 ],
                            44: [ 2, 83 ],
                            45: [ 2, 83 ],
                            46: [ 2, 83 ],
                            49: [ 2, 83 ],
                            50: [ 2, 83 ],
                            51: [ 2, 83 ],
                            52: [ 2, 83 ],
                            53: [ 2, 83 ],
                            54: [ 2, 83 ],
                            55: [ 2, 83 ],
                            56: [ 2, 83 ],
                            57: [ 2, 83 ],
                            58: [ 2, 83 ],
                            59: [ 2, 83 ],
                            60: [ 2, 83 ],
                            61: [ 2, 83 ],
                            71: [ 2, 83 ],
                            72: [ 2, 83 ],
                            77: [ 2, 83 ],
                            79: [ 2, 83 ],
                            80: [ 2, 83 ],
                            81: [ 2, 83 ],
                            91: [ 2, 83 ]
                        }, {
                            34: [ 1, 92 ],
                            68: 91,
                            79: [ 1, 93 ]
                        }, {
                            7: 95,
                            33: [ 1, 79 ],
                            52: [ 1, 90 ],
                            64: 94,
                            79: [ 1, 96 ],
                            81: [ 1, 97 ],
                            82: 83,
                            83: 84,
                            84: [ 1, 85 ],
                            85: 88,
                            86: [ 1, 89 ],
                            88: [ 1, 86 ],
                            89: [ 1, 87 ]
                        }, {
                            5: [ 2, 70 ],
                            10: [ 2, 70 ],
                            19: [ 2, 70 ],
                            22: [ 2, 70 ],
                            33: [ 2, 70 ],
                            34: [ 2, 70 ],
                            44: [ 2, 70 ],
                            45: [ 2, 70 ],
                            46: [ 2, 70 ],
                            49: [ 2, 70 ],
                            50: [ 2, 70 ],
                            51: [ 2, 70 ],
                            52: [ 2, 70 ],
                            53: [ 2, 70 ],
                            54: [ 2, 70 ],
                            55: [ 2, 70 ],
                            56: [ 2, 70 ],
                            57: [ 2, 70 ],
                            58: [ 2, 70 ],
                            59: [ 2, 70 ],
                            60: [ 2, 70 ],
                            61: [ 2, 70 ],
                            72: [ 2, 70 ],
                            73: 71,
                            74: 50,
                            75: 51,
                            76: 52,
                            77: [ 1, 53 ],
                            79: [ 2, 70 ],
                            80: [ 1, 54 ],
                            81: [ 2, 70 ],
                            91: [ 2, 70 ]
                        }, {
                            67: 98,
                            71: [ 1, 31 ],
                            72: [ 1, 32 ]
                        }, {
                            21: [ 1, 48 ]
                        }, {
                            22: [ 1, 99 ]
                        }, {
                            5: [ 2, 128 ],
                            10: [ 2, 128 ],
                            19: [ 2, 128 ],
                            33: [ 2, 128 ],
                            34: [ 2, 128 ],
                            79: [ 2, 128 ]
                        }, {
                            5: [ 2, 129 ],
                            10: [ 2, 129 ],
                            19: [ 2, 129 ],
                            33: [ 2, 129 ],
                            34: [ 2, 129 ],
                            79: [ 2, 129 ]
                        }, {
                            7: 105,
                            22: [ 1, 101 ],
                            33: [ 1, 79 ],
                            36: 76,
                            41: 100,
                            42: 102,
                            43: 104,
                            44: [ 1, 103 ],
                            47: 77,
                            52: [ 1, 90 ],
                            64: 78,
                            70: [ 1, 82 ],
                            80: [ 1, 80 ],
                            82: 83,
                            83: 84,
                            84: [ 1, 85 ],
                            85: 88,
                            86: [ 1, 89 ],
                            88: [ 1, 86 ],
                            89: [ 1, 87 ],
                            90: 81
                        }, {
                            7: 107,
                            26: 106,
                            33: [ 1, 79 ]
                        }, {
                            7: 115,
                            21: [ 1, 117 ],
                            28: 108,
                            33: [ 1, 79 ],
                            36: 109,
                            47: 110,
                            48: 111,
                            52: [ 1, 113 ],
                            62: 112,
                            63: [ 1, 114 ],
                            64: 116,
                            70: [ 1, 82 ],
                            80: [ 1, 80 ],
                            82: 83,
                            83: 84,
                            84: [ 1, 85 ],
                            85: 88,
                            86: [ 1, 89 ],
                            88: [ 1, 86 ],
                            89: [ 1, 87 ],
                            90: 81
                        }, {
                            7: 115,
                            21: [ 1, 117 ],
                            28: 118,
                            33: [ 1, 79 ],
                            36: 109,
                            47: 110,
                            48: 111,
                            52: [ 1, 113 ],
                            62: 112,
                            63: [ 1, 114 ],
                            64: 116,
                            70: [ 1, 82 ],
                            80: [ 1, 80 ],
                            82: 83,
                            83: 84,
                            84: [ 1, 85 ],
                            85: 88,
                            86: [ 1, 89 ],
                            88: [ 1, 86 ],
                            89: [ 1, 87 ],
                            90: 81
                        }, {
                            33: [ 1, 119 ]
                        }, {
                            33: [ 1, 120 ]
                        }, {
                            34: [ 1, 121 ]
                        }, {
                            67: 122,
                            71: [ 1, 31 ],
                            72: [ 1, 32 ],
                            73: 71,
                            74: 50,
                            75: 51,
                            76: 52,
                            77: [ 1, 53 ],
                            80: [ 1, 54 ]
                        }, {
                            5: [ 2, 72 ],
                            10: [ 2, 72 ],
                            19: [ 2, 72 ],
                            22: [ 2, 72 ],
                            33: [ 2, 72 ],
                            34: [ 2, 72 ],
                            44: [ 2, 72 ],
                            45: [ 2, 72 ],
                            46: [ 2, 72 ],
                            49: [ 2, 72 ],
                            50: [ 2, 72 ],
                            51: [ 2, 72 ],
                            52: [ 2, 72 ],
                            53: [ 2, 72 ],
                            54: [ 2, 72 ],
                            55: [ 2, 72 ],
                            56: [ 2, 72 ],
                            57: [ 2, 72 ],
                            58: [ 2, 72 ],
                            59: [ 2, 72 ],
                            60: [ 2, 72 ],
                            61: [ 2, 72 ],
                            72: [ 2, 72 ],
                            79: [ 2, 72 ],
                            81: [ 2, 72 ],
                            91: [ 2, 72 ]
                        }, {
                            67: 123,
                            71: [ 1, 31 ],
                            72: [ 1, 32 ],
                            73: 71,
                            74: 50,
                            75: 51,
                            76: 52,
                            77: [ 1, 53 ],
                            80: [ 1, 54 ]
                        }, {
                            5: [ 2, 80 ],
                            10: [ 2, 80 ],
                            19: [ 2, 80 ],
                            22: [ 2, 80 ],
                            33: [ 2, 80 ],
                            34: [ 2, 80 ],
                            44: [ 2, 80 ],
                            45: [ 2, 80 ],
                            46: [ 2, 80 ],
                            49: [ 2, 80 ],
                            50: [ 2, 80 ],
                            51: [ 2, 80 ],
                            52: [ 2, 80 ],
                            53: [ 2, 80 ],
                            54: [ 2, 80 ],
                            55: [ 2, 80 ],
                            56: [ 2, 80 ],
                            57: [ 2, 80 ],
                            58: [ 2, 80 ],
                            59: [ 2, 80 ],
                            60: [ 2, 80 ],
                            61: [ 2, 80 ],
                            71: [ 2, 80 ],
                            72: [ 2, 80 ],
                            77: [ 2, 80 ],
                            79: [ 2, 80 ],
                            80: [ 2, 80 ],
                            81: [ 2, 80 ],
                            91: [ 2, 80 ]
                        }, {
                            22: [ 1, 124 ],
                            45: [ 1, 125 ]
                        }, {
                            5: [ 2, 86 ],
                            10: [ 2, 86 ],
                            19: [ 2, 86 ],
                            22: [ 2, 86 ],
                            33: [ 2, 86 ],
                            34: [ 2, 86 ],
                            44: [ 2, 86 ],
                            45: [ 2, 86 ],
                            46: [ 2, 86 ],
                            49: [ 2, 86 ],
                            50: [ 2, 86 ],
                            51: [ 2, 86 ],
                            52: [ 2, 86 ],
                            53: [ 2, 86 ],
                            54: [ 2, 86 ],
                            55: [ 2, 86 ],
                            56: [ 2, 86 ],
                            57: [ 2, 86 ],
                            58: [ 2, 86 ],
                            59: [ 2, 86 ],
                            60: [ 2, 86 ],
                            61: [ 2, 86 ],
                            71: [ 2, 86 ],
                            72: [ 2, 86 ],
                            77: [ 2, 86 ],
                            79: [ 2, 86 ],
                            80: [ 2, 86 ],
                            81: [ 2, 86 ],
                            91: [ 2, 86 ]
                        }, {
                            22: [ 2, 87 ],
                            45: [ 2, 87 ],
                            81: [ 2, 87 ]
                        }, {
                            22: [ 2, 88 ],
                            45: [ 2, 88 ]
                        }, {
                            22: [ 2, 108 ],
                            44: [ 2, 108 ],
                            45: [ 2, 108 ],
                            72: [ 2, 108 ],
                            81: [ 2, 108 ]
                        }, {
                            22: [ 2, 109 ],
                            44: [ 2, 109 ],
                            45: [ 2, 109 ],
                            72: [ 2, 109 ],
                            81: [ 2, 109 ]
                        }, {
                            22: [ 2, 110 ],
                            44: [ 2, 110 ],
                            45: [ 2, 110 ],
                            72: [ 2, 110 ],
                            81: [ 2, 110 ]
                        }, {
                            34: [ 1, 25 ],
                            65: 24,
                            67: 27,
                            68: 26,
                            69: [ 1, 29 ],
                            70: [ 1, 30 ],
                            71: [ 1, 31 ],
                            72: [ 1, 32 ]
                        }, {
                            7: 129,
                            33: [ 1, 79 ],
                            36: 76,
                            43: 74,
                            47: 77,
                            52: [ 1, 90 ],
                            64: 78,
                            70: [ 1, 82 ],
                            78: 126,
                            80: [ 1, 80 ],
                            81: [ 1, 127 ],
                            82: 83,
                            83: 84,
                            84: [ 1, 85 ],
                            85: 128,
                            86: [ 1, 89 ],
                            88: [ 1, 86 ],
                            89: [ 1, 87 ],
                            90: 81
                        }, {
                            22: [ 2, 112 ],
                            44: [ 2, 112 ],
                            45: [ 2, 112 ],
                            72: [ 2, 112 ],
                            81: [ 2, 112 ]
                        }, {
                            72: [ 1, 131 ],
                            82: 132,
                            88: [ 1, 86 ],
                            89: [ 1, 87 ],
                            92: 130
                        }, {
                            22: [ 2, 98 ],
                            44: [ 2, 98 ],
                            45: [ 2, 98 ],
                            49: [ 2, 98 ],
                            50: [ 2, 98 ],
                            51: [ 2, 98 ],
                            52: [ 2, 98 ],
                            53: [ 2, 98 ],
                            54: [ 2, 98 ],
                            55: [ 2, 98 ],
                            56: [ 2, 98 ],
                            57: [ 2, 98 ],
                            58: [ 2, 98 ],
                            59: [ 2, 98 ],
                            60: [ 2, 98 ],
                            61: [ 2, 98 ],
                            72: [ 2, 98 ],
                            79: [ 2, 98 ],
                            81: [ 2, 98 ]
                        }, {
                            22: [ 2, 99 ],
                            44: [ 2, 99 ],
                            45: [ 2, 99 ],
                            49: [ 2, 99 ],
                            50: [ 2, 99 ],
                            51: [ 2, 99 ],
                            52: [ 2, 99 ],
                            53: [ 2, 99 ],
                            54: [ 2, 99 ],
                            55: [ 2, 99 ],
                            56: [ 2, 99 ],
                            57: [ 2, 99 ],
                            58: [ 2, 99 ],
                            59: [ 2, 99 ],
                            60: [ 2, 99 ],
                            61: [ 2, 99 ],
                            72: [ 2, 99 ],
                            79: [ 2, 99 ],
                            81: [ 2, 99 ]
                        }, {
                            22: [ 2, 100 ],
                            44: [ 2, 100 ],
                            45: [ 2, 100 ],
                            49: [ 2, 100 ],
                            50: [ 2, 100 ],
                            51: [ 2, 100 ],
                            52: [ 2, 100 ],
                            53: [ 2, 100 ],
                            54: [ 2, 100 ],
                            55: [ 2, 100 ],
                            56: [ 2, 100 ],
                            57: [ 2, 100 ],
                            58: [ 2, 100 ],
                            59: [ 2, 100 ],
                            60: [ 2, 100 ],
                            61: [ 2, 100 ],
                            72: [ 2, 100 ],
                            79: [ 2, 100 ],
                            81: [ 2, 100 ]
                        }, {
                            22: [ 2, 106 ],
                            44: [ 2, 106 ],
                            45: [ 2, 106 ],
                            49: [ 2, 106 ],
                            50: [ 2, 106 ],
                            51: [ 2, 106 ],
                            52: [ 2, 106 ],
                            53: [ 2, 106 ],
                            54: [ 2, 106 ],
                            55: [ 2, 106 ],
                            56: [ 2, 106 ],
                            57: [ 2, 106 ],
                            58: [ 2, 106 ],
                            59: [ 2, 106 ],
                            60: [ 2, 106 ],
                            61: [ 2, 106 ],
                            72: [ 2, 106 ],
                            79: [ 2, 106 ],
                            81: [ 2, 106 ],
                            93: [ 2, 106 ]
                        }, {
                            22: [ 2, 107 ],
                            44: [ 2, 107 ],
                            45: [ 2, 107 ],
                            49: [ 2, 107 ],
                            50: [ 2, 107 ],
                            51: [ 2, 107 ],
                            52: [ 2, 107 ],
                            53: [ 2, 107 ],
                            54: [ 2, 107 ],
                            55: [ 2, 107 ],
                            56: [ 2, 107 ],
                            57: [ 2, 107 ],
                            58: [ 2, 107 ],
                            59: [ 2, 107 ],
                            60: [ 2, 107 ],
                            61: [ 2, 107 ],
                            72: [ 2, 107 ],
                            79: [ 2, 107 ],
                            81: [ 2, 107 ],
                            93: [ 2, 107 ]
                        }, {
                            22: [ 2, 101 ],
                            44: [ 2, 101 ],
                            45: [ 2, 101 ],
                            49: [ 2, 101 ],
                            50: [ 2, 101 ],
                            51: [ 2, 101 ],
                            52: [ 2, 101 ],
                            53: [ 2, 101 ],
                            54: [ 2, 101 ],
                            55: [ 2, 101 ],
                            56: [ 2, 101 ],
                            57: [ 2, 101 ],
                            58: [ 2, 101 ],
                            59: [ 2, 101 ],
                            60: [ 2, 101 ],
                            61: [ 2, 101 ],
                            72: [ 2, 101 ],
                            79: [ 2, 101 ],
                            81: [ 2, 101 ]
                        }, {
                            22: [ 2, 104 ],
                            44: [ 2, 104 ],
                            45: [ 2, 104 ],
                            49: [ 2, 104 ],
                            50: [ 2, 104 ],
                            51: [ 2, 104 ],
                            52: [ 2, 104 ],
                            53: [ 2, 104 ],
                            54: [ 2, 104 ],
                            55: [ 2, 104 ],
                            56: [ 2, 104 ],
                            57: [ 2, 104 ],
                            58: [ 2, 104 ],
                            59: [ 2, 104 ],
                            60: [ 2, 104 ],
                            61: [ 2, 104 ],
                            72: [ 2, 104 ],
                            79: [ 2, 104 ],
                            81: [ 2, 104 ],
                            87: [ 1, 133 ],
                            91: [ 2, 104 ]
                        }, {
                            86: [ 1, 134 ]
                        }, {
                            5: [ 2, 84 ],
                            10: [ 2, 84 ],
                            19: [ 2, 84 ],
                            22: [ 2, 84 ],
                            33: [ 2, 84 ],
                            34: [ 2, 84 ],
                            44: [ 2, 84 ],
                            45: [ 2, 84 ],
                            46: [ 2, 84 ],
                            49: [ 2, 84 ],
                            50: [ 2, 84 ],
                            51: [ 2, 84 ],
                            52: [ 2, 84 ],
                            53: [ 2, 84 ],
                            54: [ 2, 84 ],
                            55: [ 2, 84 ],
                            56: [ 2, 84 ],
                            57: [ 2, 84 ],
                            58: [ 2, 84 ],
                            59: [ 2, 84 ],
                            60: [ 2, 84 ],
                            61: [ 2, 84 ],
                            71: [ 2, 84 ],
                            72: [ 2, 84 ],
                            77: [ 2, 84 ],
                            79: [ 2, 84 ],
                            80: [ 2, 84 ],
                            81: [ 2, 84 ],
                            91: [ 2, 84 ]
                        }, {
                            5: [ 2, 91 ],
                            10: [ 2, 91 ],
                            19: [ 2, 91 ],
                            21: [ 1, 48 ],
                            22: [ 2, 91 ],
                            33: [ 2, 91 ],
                            34: [ 2, 91 ],
                            44: [ 2, 91 ],
                            45: [ 2, 91 ],
                            46: [ 2, 91 ],
                            49: [ 2, 91 ],
                            50: [ 2, 91 ],
                            51: [ 2, 91 ],
                            52: [ 2, 91 ],
                            53: [ 2, 91 ],
                            54: [ 2, 91 ],
                            55: [ 2, 91 ],
                            56: [ 2, 91 ],
                            57: [ 2, 91 ],
                            58: [ 2, 91 ],
                            59: [ 2, 91 ],
                            60: [ 2, 91 ],
                            61: [ 2, 91 ],
                            71: [ 2, 91 ],
                            72: [ 2, 91 ],
                            77: [ 2, 91 ],
                            79: [ 2, 91 ],
                            80: [ 2, 91 ],
                            81: [ 2, 91 ],
                            91: [ 2, 91 ]
                        }, {
                            5: [ 2, 92 ],
                            10: [ 2, 92 ],
                            19: [ 2, 92 ],
                            22: [ 2, 92 ],
                            33: [ 2, 92 ],
                            34: [ 2, 92 ],
                            44: [ 2, 92 ],
                            45: [ 2, 92 ],
                            46: [ 2, 92 ],
                            49: [ 2, 92 ],
                            50: [ 2, 92 ],
                            51: [ 2, 92 ],
                            52: [ 2, 92 ],
                            53: [ 2, 92 ],
                            54: [ 2, 92 ],
                            55: [ 2, 92 ],
                            56: [ 2, 92 ],
                            57: [ 2, 92 ],
                            58: [ 2, 92 ],
                            59: [ 2, 92 ],
                            60: [ 2, 92 ],
                            61: [ 2, 92 ],
                            71: [ 2, 92 ],
                            72: [ 2, 92 ],
                            77: [ 2, 92 ],
                            79: [ 2, 92 ],
                            80: [ 2, 92 ],
                            81: [ 2, 92 ],
                            91: [ 2, 92 ]
                        }, {
                            79: [ 1, 136 ],
                            81: [ 1, 135 ]
                        }, {
                            81: [ 1, 137 ]
                        }, {
                            5: [ 2, 96 ],
                            10: [ 2, 96 ],
                            19: [ 2, 96 ],
                            22: [ 2, 96 ],
                            33: [ 2, 96 ],
                            34: [ 2, 96 ],
                            44: [ 2, 96 ],
                            45: [ 2, 96 ],
                            46: [ 2, 96 ],
                            49: [ 2, 96 ],
                            50: [ 2, 96 ],
                            51: [ 2, 96 ],
                            52: [ 2, 96 ],
                            53: [ 2, 96 ],
                            54: [ 2, 96 ],
                            55: [ 2, 96 ],
                            56: [ 2, 96 ],
                            57: [ 2, 96 ],
                            58: [ 2, 96 ],
                            59: [ 2, 96 ],
                            60: [ 2, 96 ],
                            61: [ 2, 96 ],
                            71: [ 2, 96 ],
                            72: [ 2, 96 ],
                            77: [ 2, 96 ],
                            79: [ 2, 96 ],
                            80: [ 2, 96 ],
                            81: [ 2, 96 ],
                            91: [ 2, 96 ]
                        }, {
                            5: [ 2, 97 ],
                            10: [ 2, 97 ],
                            19: [ 2, 97 ],
                            22: [ 2, 97 ],
                            33: [ 2, 97 ],
                            34: [ 2, 97 ],
                            44: [ 2, 97 ],
                            45: [ 2, 97 ],
                            46: [ 2, 97 ],
                            49: [ 2, 97 ],
                            50: [ 2, 97 ],
                            51: [ 2, 97 ],
                            52: [ 2, 97 ],
                            53: [ 2, 97 ],
                            54: [ 2, 97 ],
                            55: [ 2, 97 ],
                            56: [ 2, 97 ],
                            57: [ 2, 97 ],
                            58: [ 2, 97 ],
                            59: [ 2, 97 ],
                            60: [ 2, 97 ],
                            61: [ 2, 97 ],
                            71: [ 2, 97 ],
                            72: [ 2, 97 ],
                            77: [ 2, 97 ],
                            79: [ 2, 97 ],
                            80: [ 2, 97 ],
                            81: [ 2, 97 ],
                            91: [ 2, 97 ]
                        }, {
                            5: [ 2, 74 ],
                            10: [ 2, 74 ],
                            19: [ 2, 74 ],
                            22: [ 2, 74 ],
                            33: [ 2, 74 ],
                            34: [ 2, 74 ],
                            44: [ 2, 74 ],
                            45: [ 2, 74 ],
                            46: [ 2, 74 ],
                            49: [ 2, 74 ],
                            50: [ 2, 74 ],
                            51: [ 2, 74 ],
                            52: [ 2, 74 ],
                            53: [ 2, 74 ],
                            54: [ 2, 74 ],
                            55: [ 2, 74 ],
                            56: [ 2, 74 ],
                            57: [ 2, 74 ],
                            58: [ 2, 74 ],
                            59: [ 2, 74 ],
                            60: [ 2, 74 ],
                            61: [ 2, 74 ],
                            72: [ 2, 74 ],
                            79: [ 2, 74 ],
                            81: [ 2, 74 ],
                            91: [ 2, 74 ]
                        }, {
                            5: [ 2, 16 ],
                            10: [ 2, 16 ],
                            19: [ 2, 16 ],
                            33: [ 2, 16 ],
                            34: [ 2, 16 ],
                            79: [ 2, 16 ]
                        }, {
                            22: [ 1, 138 ]
                        }, {
                            5: [ 2, 33 ],
                            10: [ 2, 33 ],
                            19: [ 2, 33 ],
                            33: [ 2, 33 ],
                            34: [ 2, 33 ],
                            79: [ 2, 33 ]
                        }, {
                            22: [ 2, 40 ],
                            44: [ 1, 139 ],
                            45: [ 1, 140 ]
                        }, {
                            7: 105,
                            33: [ 1, 79 ],
                            36: 76,
                            42: 141,
                            43: 104,
                            47: 77,
                            52: [ 1, 90 ],
                            64: 78,
                            70: [ 1, 82 ],
                            80: [ 1, 80 ],
                            82: 83,
                            83: 84,
                            84: [ 1, 85 ],
                            85: 88,
                            86: [ 1, 89 ],
                            88: [ 1, 86 ],
                            89: [ 1, 87 ],
                            90: 81
                        }, {
                            22: [ 2, 34 ],
                            44: [ 2, 34 ],
                            45: [ 2, 34 ]
                        }, {
                            22: [ 2, 35 ],
                            44: [ 2, 35 ],
                            45: [ 2, 35 ]
                        }, {
                            22: [ 1, 142 ]
                        }, {
                            46: [ 1, 143 ]
                        }, {
                            22: [ 1, 144 ]
                        }, {
                            22: [ 2, 45 ]
                        }, {
                            22: [ 2, 46 ]
                        }, {
                            22: [ 2, 47 ],
                            49: [ 1, 145 ],
                            50: [ 1, 146 ],
                            51: [ 1, 147 ],
                            52: [ 1, 148 ],
                            53: [ 1, 149 ],
                            54: [ 1, 150 ],
                            55: [ 1, 151 ],
                            56: [ 1, 152 ],
                            57: [ 1, 153 ],
                            58: [ 1, 154 ],
                            59: [ 1, 155 ],
                            60: [ 1, 156 ],
                            61: [ 1, 157 ]
                        }, {
                            22: [ 2, 61 ],
                            49: [ 2, 61 ],
                            50: [ 2, 61 ],
                            51: [ 2, 61 ],
                            52: [ 2, 61 ],
                            53: [ 2, 61 ],
                            54: [ 2, 61 ],
                            55: [ 2, 61 ],
                            56: [ 2, 61 ],
                            57: [ 2, 61 ],
                            58: [ 2, 61 ],
                            59: [ 2, 61 ],
                            60: [ 2, 61 ],
                            61: [ 2, 61 ]
                        }, {
                            21: [ 1, 117 ],
                            62: 158,
                            86: [ 1, 134 ]
                        }, {
                            7: 115,
                            21: [ 1, 117 ],
                            33: [ 1, 79 ],
                            48: 159,
                            52: [ 1, 113 ],
                            62: 112,
                            63: [ 1, 114 ],
                            64: 116,
                            82: 83,
                            83: 84,
                            84: [ 1, 85 ],
                            85: 88,
                            86: [ 1, 89 ],
                            88: [ 1, 86 ],
                            89: [ 1, 87 ]
                        }, {
                            22: [ 2, 64 ],
                            49: [ 2, 64 ],
                            50: [ 2, 64 ],
                            51: [ 2, 64 ],
                            52: [ 2, 64 ],
                            53: [ 2, 64 ],
                            54: [ 2, 64 ],
                            55: [ 2, 64 ],
                            56: [ 2, 64 ],
                            57: [ 2, 64 ],
                            58: [ 2, 64 ],
                            59: [ 2, 64 ],
                            60: [ 2, 64 ],
                            61: [ 2, 64 ]
                        }, {
                            22: [ 2, 65 ],
                            49: [ 2, 65 ],
                            50: [ 2, 65 ],
                            51: [ 2, 65 ],
                            52: [ 2, 65 ],
                            53: [ 2, 65 ],
                            54: [ 2, 65 ],
                            55: [ 2, 65 ],
                            56: [ 2, 65 ],
                            57: [ 2, 65 ],
                            58: [ 2, 65 ],
                            59: [ 2, 65 ],
                            60: [ 2, 65 ],
                            61: [ 2, 65 ]
                        }, {
                            7: 115,
                            21: [ 1, 117 ],
                            33: [ 1, 79 ],
                            48: 160,
                            52: [ 1, 113 ],
                            62: 112,
                            63: [ 1, 114 ],
                            64: 116,
                            82: 83,
                            83: 84,
                            84: [ 1, 85 ],
                            85: 88,
                            86: [ 1, 89 ],
                            88: [ 1, 86 ],
                            89: [ 1, 87 ]
                        }, {
                            22: [ 1, 161 ]
                        }, {
                            34: [ 1, 162 ]
                        }, {
                            34: [ 1, 163 ]
                        }, {
                            7: 166,
                            22: [ 1, 165 ],
                            33: [ 1, 79 ],
                            40: 164
                        }, {
                            5: [ 2, 67 ],
                            10: [ 2, 67 ],
                            19: [ 2, 67 ],
                            22: [ 2, 67 ],
                            33: [ 2, 67 ],
                            34: [ 2, 67 ],
                            44: [ 2, 67 ],
                            45: [ 2, 67 ],
                            46: [ 2, 67 ],
                            49: [ 2, 67 ],
                            50: [ 2, 67 ],
                            51: [ 2, 67 ],
                            52: [ 2, 67 ],
                            53: [ 2, 67 ],
                            54: [ 2, 67 ],
                            55: [ 2, 67 ],
                            56: [ 2, 67 ],
                            57: [ 2, 67 ],
                            58: [ 2, 67 ],
                            59: [ 2, 67 ],
                            60: [ 2, 67 ],
                            61: [ 2, 67 ],
                            72: [ 2, 67 ],
                            79: [ 2, 67 ],
                            81: [ 2, 67 ],
                            91: [ 2, 67 ]
                        }, {
                            5: [ 2, 69 ],
                            10: [ 2, 69 ],
                            19: [ 2, 69 ],
                            22: [ 2, 69 ],
                            33: [ 2, 69 ],
                            34: [ 2, 69 ],
                            44: [ 2, 69 ],
                            45: [ 2, 69 ],
                            46: [ 2, 69 ],
                            49: [ 2, 69 ],
                            50: [ 2, 69 ],
                            51: [ 2, 69 ],
                            52: [ 2, 69 ],
                            53: [ 2, 69 ],
                            54: [ 2, 69 ],
                            55: [ 2, 69 ],
                            56: [ 2, 69 ],
                            57: [ 2, 69 ],
                            58: [ 2, 69 ],
                            59: [ 2, 69 ],
                            60: [ 2, 69 ],
                            61: [ 2, 69 ],
                            72: [ 2, 69 ],
                            79: [ 2, 69 ],
                            81: [ 2, 69 ],
                            91: [ 2, 69 ]
                        }, {
                            5: [ 2, 85 ],
                            10: [ 2, 85 ],
                            19: [ 2, 85 ],
                            22: [ 2, 85 ],
                            33: [ 2, 85 ],
                            34: [ 2, 85 ],
                            44: [ 2, 85 ],
                            45: [ 2, 85 ],
                            46: [ 2, 85 ],
                            49: [ 2, 85 ],
                            50: [ 2, 85 ],
                            51: [ 2, 85 ],
                            52: [ 2, 85 ],
                            53: [ 2, 85 ],
                            54: [ 2, 85 ],
                            55: [ 2, 85 ],
                            56: [ 2, 85 ],
                            57: [ 2, 85 ],
                            58: [ 2, 85 ],
                            59: [ 2, 85 ],
                            60: [ 2, 85 ],
                            61: [ 2, 85 ],
                            71: [ 2, 85 ],
                            72: [ 2, 85 ],
                            77: [ 2, 85 ],
                            79: [ 2, 85 ],
                            80: [ 2, 85 ],
                            81: [ 2, 85 ],
                            91: [ 2, 85 ]
                        }, {
                            7: 168,
                            33: [ 1, 79 ],
                            36: 76,
                            43: 167,
                            47: 77,
                            52: [ 1, 90 ],
                            64: 78,
                            70: [ 1, 82 ],
                            80: [ 1, 80 ],
                            82: 83,
                            83: 84,
                            84: [ 1, 85 ],
                            85: 88,
                            86: [ 1, 89 ],
                            88: [ 1, 86 ],
                            89: [ 1, 87 ],
                            90: 81
                        }, {
                            45: [ 1, 125 ],
                            81: [ 1, 169 ]
                        }, {
                            22: [ 2, 113 ],
                            44: [ 2, 113 ],
                            45: [ 2, 113 ],
                            72: [ 2, 113 ],
                            81: [ 2, 113 ]
                        }, {
                            45: [ 2, 101 ],
                            81: [ 2, 101 ],
                            91: [ 1, 170 ]
                        }, {
                            45: [ 2, 88 ],
                            81: [ 2, 88 ],
                            91: [ 1, 171 ]
                        }, {
                            45: [ 1, 173 ],
                            72: [ 1, 172 ]
                        }, {
                            22: [ 2, 119 ],
                            44: [ 2, 119 ],
                            45: [ 2, 119 ],
                            72: [ 2, 119 ],
                            81: [ 2, 119 ]
                        }, {
                            93: [ 1, 174 ]
                        }, {
                            86: [ 1, 175 ]
                        }, {
                            22: [ 2, 105 ],
                            44: [ 2, 105 ],
                            45: [ 2, 105 ],
                            49: [ 2, 105 ],
                            50: [ 2, 105 ],
                            51: [ 2, 105 ],
                            52: [ 2, 105 ],
                            53: [ 2, 105 ],
                            54: [ 2, 105 ],
                            55: [ 2, 105 ],
                            56: [ 2, 105 ],
                            57: [ 2, 105 ],
                            58: [ 2, 105 ],
                            59: [ 2, 105 ],
                            60: [ 2, 105 ],
                            61: [ 2, 105 ],
                            72: [ 2, 105 ],
                            79: [ 2, 105 ],
                            81: [ 2, 105 ],
                            87: [ 1, 176 ],
                            91: [ 2, 105 ]
                        }, {
                            5: [ 2, 93 ],
                            10: [ 2, 93 ],
                            19: [ 2, 93 ],
                            22: [ 2, 93 ],
                            33: [ 2, 93 ],
                            34: [ 2, 93 ],
                            44: [ 2, 93 ],
                            45: [ 2, 93 ],
                            46: [ 2, 93 ],
                            49: [ 2, 93 ],
                            50: [ 2, 93 ],
                            51: [ 2, 93 ],
                            52: [ 2, 93 ],
                            53: [ 2, 93 ],
                            54: [ 2, 93 ],
                            55: [ 2, 93 ],
                            56: [ 2, 93 ],
                            57: [ 2, 93 ],
                            58: [ 2, 93 ],
                            59: [ 2, 93 ],
                            60: [ 2, 93 ],
                            61: [ 2, 93 ],
                            71: [ 2, 93 ],
                            72: [ 2, 93 ],
                            77: [ 2, 93 ],
                            79: [ 2, 93 ],
                            80: [ 2, 93 ],
                            81: [ 2, 93 ],
                            91: [ 2, 93 ]
                        }, {
                            5: [ 2, 95 ],
                            10: [ 2, 95 ],
                            19: [ 2, 95 ],
                            22: [ 2, 95 ],
                            33: [ 2, 95 ],
                            34: [ 2, 95 ],
                            44: [ 2, 95 ],
                            45: [ 2, 95 ],
                            46: [ 2, 95 ],
                            49: [ 2, 95 ],
                            50: [ 2, 95 ],
                            51: [ 2, 95 ],
                            52: [ 2, 95 ],
                            53: [ 2, 95 ],
                            54: [ 2, 95 ],
                            55: [ 2, 95 ],
                            56: [ 2, 95 ],
                            57: [ 2, 95 ],
                            58: [ 2, 95 ],
                            59: [ 2, 95 ],
                            60: [ 2, 95 ],
                            61: [ 2, 95 ],
                            71: [ 2, 95 ],
                            72: [ 2, 95 ],
                            77: [ 2, 95 ],
                            79: [ 2, 95 ],
                            80: [ 2, 95 ],
                            81: [ 2, 95 ],
                            91: [ 2, 95 ]
                        }, {
                            5: [ 2, 94 ],
                            10: [ 2, 94 ],
                            19: [ 2, 94 ],
                            22: [ 2, 94 ],
                            33: [ 2, 94 ],
                            34: [ 2, 94 ],
                            44: [ 2, 94 ],
                            45: [ 2, 94 ],
                            46: [ 2, 94 ],
                            49: [ 2, 94 ],
                            50: [ 2, 94 ],
                            51: [ 2, 94 ],
                            52: [ 2, 94 ],
                            53: [ 2, 94 ],
                            54: [ 2, 94 ],
                            55: [ 2, 94 ],
                            56: [ 2, 94 ],
                            57: [ 2, 94 ],
                            58: [ 2, 94 ],
                            59: [ 2, 94 ],
                            60: [ 2, 94 ],
                            61: [ 2, 94 ],
                            71: [ 2, 94 ],
                            72: [ 2, 94 ],
                            77: [ 2, 94 ],
                            79: [ 2, 94 ],
                            80: [ 2, 94 ],
                            81: [ 2, 94 ],
                            91: [ 2, 94 ]
                        }, {
                            5: [ 2, 32 ],
                            10: [ 2, 32 ],
                            19: [ 2, 32 ],
                            33: [ 2, 32 ],
                            34: [ 2, 32 ],
                            79: [ 2, 32 ]
                        }, {
                            7: 178,
                            22: [ 2, 43 ],
                            33: [ 1, 79 ],
                            36: 76,
                            43: 177,
                            47: 77,
                            52: [ 1, 90 ],
                            64: 78,
                            70: [ 1, 82 ],
                            80: [ 1, 80 ],
                            82: 83,
                            83: 84,
                            84: [ 1, 85 ],
                            85: 88,
                            86: [ 1, 89 ],
                            88: [ 1, 86 ],
                            89: [ 1, 87 ],
                            90: 81
                        }, {
                            7: 180,
                            33: [ 1, 79 ],
                            36: 76,
                            43: 179,
                            47: 77,
                            52: [ 1, 90 ],
                            64: 78,
                            70: [ 1, 82 ],
                            80: [ 1, 80 ],
                            82: 83,
                            83: 84,
                            84: [ 1, 85 ],
                            85: 88,
                            86: [ 1, 89 ],
                            88: [ 1, 86 ],
                            89: [ 1, 87 ],
                            90: 81
                        }, {
                            22: [ 2, 41 ],
                            44: [ 1, 181 ],
                            45: [ 1, 140 ]
                        }, {
                            5: [ 2, 19 ],
                            10: [ 2, 19 ],
                            19: [ 2, 19 ],
                            33: [ 2, 19 ],
                            34: [ 2, 19 ],
                            79: [ 2, 19 ]
                        }, {
                            7: 115,
                            21: [ 1, 117 ],
                            28: 182,
                            33: [ 1, 79 ],
                            36: 109,
                            47: 110,
                            48: 111,
                            52: [ 1, 113 ],
                            62: 112,
                            63: [ 1, 114 ],
                            64: 116,
                            70: [ 1, 82 ],
                            80: [ 1, 80 ],
                            82: 83,
                            83: 84,
                            84: [ 1, 85 ],
                            85: 88,
                            86: [ 1, 89 ],
                            88: [ 1, 86 ],
                            89: [ 1, 87 ],
                            90: 81
                        }, {
                            5: [ 2, 20 ],
                            10: [ 2, 20 ],
                            19: [ 2, 20 ],
                            33: [ 2, 20 ],
                            34: [ 2, 20 ],
                            79: [ 2, 20 ]
                        }, {
                            7: 115,
                            21: [ 1, 117 ],
                            33: [ 1, 79 ],
                            48: 183,
                            52: [ 1, 113 ],
                            62: 112,
                            63: [ 1, 114 ],
                            64: 116,
                            82: 83,
                            83: 84,
                            84: [ 1, 85 ],
                            85: 88,
                            86: [ 1, 89 ],
                            88: [ 1, 86 ],
                            89: [ 1, 87 ]
                        }, {
                            7: 115,
                            21: [ 1, 117 ],
                            33: [ 1, 79 ],
                            48: 184,
                            52: [ 1, 113 ],
                            62: 112,
                            63: [ 1, 114 ],
                            64: 116,
                            82: 83,
                            83: 84,
                            84: [ 1, 85 ],
                            85: 88,
                            86: [ 1, 89 ],
                            88: [ 1, 86 ],
                            89: [ 1, 87 ]
                        }, {
                            7: 115,
                            21: [ 1, 117 ],
                            33: [ 1, 79 ],
                            48: 185,
                            52: [ 1, 113 ],
                            62: 112,
                            63: [ 1, 114 ],
                            64: 116,
                            82: 83,
                            83: 84,
                            84: [ 1, 85 ],
                            85: 88,
                            86: [ 1, 89 ],
                            88: [ 1, 86 ],
                            89: [ 1, 87 ]
                        }, {
                            7: 115,
                            21: [ 1, 117 ],
                            33: [ 1, 79 ],
                            48: 186,
                            52: [ 1, 113 ],
                            62: 112,
                            63: [ 1, 114 ],
                            64: 116,
                            82: 83,
                            83: 84,
                            84: [ 1, 85 ],
                            85: 88,
                            86: [ 1, 89 ],
                            88: [ 1, 86 ],
                            89: [ 1, 87 ]
                        }, {
                            7: 115,
                            21: [ 1, 117 ],
                            33: [ 1, 79 ],
                            48: 187,
                            52: [ 1, 113 ],
                            62: 112,
                            63: [ 1, 114 ],
                            64: 116,
                            82: 83,
                            83: 84,
                            84: [ 1, 85 ],
                            85: 88,
                            86: [ 1, 89 ],
                            88: [ 1, 86 ],
                            89: [ 1, 87 ]
                        }, {
                            7: 115,
                            21: [ 1, 117 ],
                            33: [ 1, 79 ],
                            48: 188,
                            52: [ 1, 113 ],
                            62: 112,
                            63: [ 1, 114 ],
                            64: 116,
                            82: 83,
                            83: 84,
                            84: [ 1, 85 ],
                            85: 88,
                            86: [ 1, 89 ],
                            88: [ 1, 86 ],
                            89: [ 1, 87 ]
                        }, {
                            7: 115,
                            21: [ 1, 117 ],
                            33: [ 1, 79 ],
                            48: 189,
                            52: [ 1, 113 ],
                            62: 112,
                            63: [ 1, 114 ],
                            64: 116,
                            82: 83,
                            83: 84,
                            84: [ 1, 85 ],
                            85: 88,
                            86: [ 1, 89 ],
                            88: [ 1, 86 ],
                            89: [ 1, 87 ]
                        }, {
                            7: 115,
                            21: [ 1, 117 ],
                            33: [ 1, 79 ],
                            48: 190,
                            52: [ 1, 113 ],
                            62: 112,
                            63: [ 1, 114 ],
                            64: 116,
                            82: 83,
                            83: 84,
                            84: [ 1, 85 ],
                            85: 88,
                            86: [ 1, 89 ],
                            88: [ 1, 86 ],
                            89: [ 1, 87 ]
                        }, {
                            7: 115,
                            21: [ 1, 117 ],
                            33: [ 1, 79 ],
                            48: 191,
                            52: [ 1, 113 ],
                            62: 112,
                            63: [ 1, 114 ],
                            64: 116,
                            82: 83,
                            83: 84,
                            84: [ 1, 85 ],
                            85: 88,
                            86: [ 1, 89 ],
                            88: [ 1, 86 ],
                            89: [ 1, 87 ]
                        }, {
                            7: 115,
                            21: [ 1, 117 ],
                            33: [ 1, 79 ],
                            48: 192,
                            52: [ 1, 113 ],
                            62: 112,
                            63: [ 1, 114 ],
                            64: 116,
                            82: 83,
                            83: 84,
                            84: [ 1, 85 ],
                            85: 88,
                            86: [ 1, 89 ],
                            88: [ 1, 86 ],
                            89: [ 1, 87 ]
                        }, {
                            7: 115,
                            21: [ 1, 117 ],
                            33: [ 1, 79 ],
                            48: 193,
                            52: [ 1, 113 ],
                            62: 112,
                            63: [ 1, 114 ],
                            64: 116,
                            82: 83,
                            83: 84,
                            84: [ 1, 85 ],
                            85: 88,
                            86: [ 1, 89 ],
                            88: [ 1, 86 ],
                            89: [ 1, 87 ]
                        }, {
                            7: 115,
                            21: [ 1, 117 ],
                            33: [ 1, 79 ],
                            48: 194,
                            52: [ 1, 113 ],
                            62: 112,
                            63: [ 1, 114 ],
                            64: 116,
                            82: 83,
                            83: 84,
                            84: [ 1, 85 ],
                            85: 88,
                            86: [ 1, 89 ],
                            88: [ 1, 86 ],
                            89: [ 1, 87 ]
                        }, {
                            7: 115,
                            21: [ 1, 117 ],
                            33: [ 1, 79 ],
                            48: 195,
                            52: [ 1, 113 ],
                            62: 112,
                            63: [ 1, 114 ],
                            64: 116,
                            82: 83,
                            83: 84,
                            84: [ 1, 85 ],
                            85: 88,
                            86: [ 1, 89 ],
                            88: [ 1, 86 ],
                            89: [ 1, 87 ]
                        }, {
                            22: [ 2, 62 ],
                            49: [ 2, 62 ],
                            50: [ 2, 62 ],
                            51: [ 2, 62 ],
                            52: [ 2, 62 ],
                            53: [ 2, 62 ],
                            54: [ 2, 62 ],
                            55: [ 2, 62 ],
                            56: [ 2, 62 ],
                            57: [ 2, 62 ],
                            58: [ 2, 62 ],
                            59: [ 2, 62 ],
                            60: [ 2, 62 ],
                            61: [ 2, 62 ]
                        }, {
                            22: [ 2, 63 ],
                            49: [ 2, 63 ],
                            50: [ 2, 63 ],
                            51: [ 2, 63 ],
                            52: [ 2, 63 ],
                            53: [ 2, 63 ],
                            54: [ 2, 63 ],
                            55: [ 2, 63 ],
                            56: [ 2, 63 ],
                            57: [ 2, 63 ],
                            58: [ 2, 63 ],
                            59: [ 2, 63 ],
                            60: [ 2, 63 ],
                            61: [ 2, 63 ]
                        }, {
                            22: [ 1, 196 ],
                            49: [ 1, 145 ],
                            50: [ 1, 146 ],
                            51: [ 1, 147 ],
                            52: [ 1, 148 ],
                            53: [ 1, 149 ],
                            54: [ 1, 150 ],
                            55: [ 1, 151 ],
                            56: [ 1, 152 ],
                            57: [ 1, 153 ],
                            58: [ 1, 154 ],
                            59: [ 1, 155 ],
                            60: [ 1, 156 ],
                            61: [ 1, 157 ]
                        }, {
                            5: [ 2, 21 ],
                            10: [ 2, 21 ],
                            19: [ 2, 21 ],
                            33: [ 2, 21 ],
                            34: [ 2, 21 ],
                            79: [ 2, 21 ]
                        }, {
                            35: [ 1, 197 ]
                        }, {
                            22: [ 1, 198 ]
                        }, {
                            7: 200,
                            22: [ 1, 199 ],
                            33: [ 1, 79 ]
                        }, {
                            5: [ 2, 29 ],
                            10: [ 2, 29 ],
                            19: [ 2, 29 ],
                            33: [ 2, 29 ],
                            34: [ 2, 29 ],
                            79: [ 2, 29 ]
                        }, {
                            22: [ 2, 30 ],
                            33: [ 2, 30 ]
                        }, {
                            22: [ 2, 89 ],
                            45: [ 2, 89 ],
                            81: [ 2, 89 ]
                        }, {
                            22: [ 2, 90 ],
                            45: [ 2, 90 ],
                            81: [ 2, 90 ]
                        }, {
                            22: [ 2, 111 ],
                            44: [ 2, 111 ],
                            45: [ 2, 111 ],
                            72: [ 2, 111 ],
                            81: [ 2, 111 ]
                        }, {
                            7: 202,
                            33: [ 1, 79 ],
                            52: [ 1, 204 ],
                            85: 201,
                            86: [ 1, 203 ]
                        }, {
                            7: 206,
                            33: [ 1, 79 ],
                            52: [ 1, 204 ],
                            85: 205,
                            86: [ 1, 203 ]
                        }, {
                            22: [ 2, 118 ],
                            44: [ 2, 118 ],
                            45: [ 2, 118 ],
                            72: [ 2, 118 ],
                            81: [ 2, 118 ]
                        }, {
                            82: 207,
                            88: [ 1, 86 ],
                            89: [ 1, 87 ]
                        }, {
                            7: 209,
                            33: [ 1, 79 ],
                            36: 76,
                            43: 208,
                            45: [ 2, 122 ],
                            47: 77,
                            52: [ 1, 90 ],
                            64: 78,
                            70: [ 1, 82 ],
                            72: [ 2, 122 ],
                            80: [ 1, 80 ],
                            82: 83,
                            83: 84,
                            84: [ 1, 85 ],
                            85: 88,
                            86: [ 1, 89 ],
                            88: [ 1, 86 ],
                            89: [ 1, 87 ],
                            90: 81
                        }, {
                            22: [ 2, 102 ],
                            44: [ 2, 102 ],
                            45: [ 2, 102 ],
                            49: [ 2, 102 ],
                            50: [ 2, 102 ],
                            51: [ 2, 102 ],
                            52: [ 2, 102 ],
                            53: [ 2, 102 ],
                            54: [ 2, 102 ],
                            55: [ 2, 102 ],
                            56: [ 2, 102 ],
                            57: [ 2, 102 ],
                            58: [ 2, 102 ],
                            59: [ 2, 102 ],
                            60: [ 2, 102 ],
                            61: [ 2, 102 ],
                            72: [ 2, 102 ],
                            79: [ 2, 102 ],
                            81: [ 2, 102 ]
                        }, {
                            86: [ 1, 210 ]
                        }, {
                            22: [ 2, 36 ],
                            44: [ 2, 36 ],
                            45: [ 2, 36 ]
                        }, {
                            22: [ 2, 39 ],
                            44: [ 2, 39 ],
                            45: [ 2, 39 ]
                        }, {
                            22: [ 2, 37 ],
                            44: [ 2, 37 ],
                            45: [ 2, 37 ]
                        }, {
                            22: [ 2, 38 ],
                            44: [ 2, 38 ],
                            45: [ 2, 38 ]
                        }, {
                            7: 178,
                            22: [ 2, 42 ],
                            33: [ 1, 79 ],
                            36: 76,
                            43: 177,
                            47: 77,
                            52: [ 1, 90 ],
                            64: 78,
                            70: [ 1, 82 ],
                            80: [ 1, 80 ],
                            82: 83,
                            83: 84,
                            84: [ 1, 85 ],
                            85: 88,
                            86: [ 1, 89 ],
                            88: [ 1, 86 ],
                            89: [ 1, 87 ],
                            90: 81
                        }, {
                            22: [ 2, 44 ]
                        }, {
                            22: [ 2, 48 ],
                            49: [ 2, 48 ],
                            50: [ 2, 48 ],
                            51: [ 1, 147 ],
                            52: [ 1, 148 ],
                            53: [ 1, 149 ],
                            54: [ 1, 150 ],
                            55: [ 1, 151 ],
                            56: [ 1, 152 ],
                            57: [ 1, 153 ],
                            58: [ 1, 154 ],
                            59: [ 1, 155 ],
                            60: [ 1, 156 ],
                            61: [ 1, 157 ]
                        }, {
                            22: [ 2, 49 ],
                            49: [ 2, 49 ],
                            50: [ 2, 49 ],
                            51: [ 1, 147 ],
                            52: [ 1, 148 ],
                            53: [ 1, 149 ],
                            54: [ 1, 150 ],
                            55: [ 1, 151 ],
                            56: [ 1, 152 ],
                            57: [ 1, 153 ],
                            58: [ 1, 154 ],
                            59: [ 1, 155 ],
                            60: [ 1, 156 ],
                            61: [ 1, 157 ]
                        }, {
                            22: [ 2, 50 ],
                            49: [ 2, 50 ],
                            50: [ 2, 50 ],
                            51: [ 2, 50 ],
                            52: [ 2, 50 ],
                            53: [ 1, 149 ],
                            54: [ 1, 150 ],
                            55: [ 1, 151 ],
                            56: [ 2, 50 ],
                            57: [ 2, 50 ],
                            58: [ 2, 50 ],
                            59: [ 2, 50 ],
                            60: [ 2, 50 ],
                            61: [ 2, 50 ]
                        }, {
                            22: [ 2, 51 ],
                            49: [ 2, 51 ],
                            50: [ 2, 51 ],
                            51: [ 2, 51 ],
                            52: [ 2, 51 ],
                            53: [ 1, 149 ],
                            54: [ 1, 150 ],
                            55: [ 1, 151 ],
                            56: [ 2, 51 ],
                            57: [ 2, 51 ],
                            58: [ 2, 51 ],
                            59: [ 2, 51 ],
                            60: [ 2, 51 ],
                            61: [ 2, 51 ]
                        }, {
                            22: [ 2, 52 ],
                            49: [ 2, 52 ],
                            50: [ 2, 52 ],
                            51: [ 2, 52 ],
                            52: [ 2, 52 ],
                            53: [ 2, 52 ],
                            54: [ 2, 52 ],
                            55: [ 2, 52 ],
                            56: [ 2, 52 ],
                            57: [ 2, 52 ],
                            58: [ 2, 52 ],
                            59: [ 2, 52 ],
                            60: [ 2, 52 ],
                            61: [ 2, 52 ]
                        }, {
                            22: [ 2, 53 ],
                            49: [ 2, 53 ],
                            50: [ 2, 53 ],
                            51: [ 2, 53 ],
                            52: [ 2, 53 ],
                            53: [ 2, 53 ],
                            54: [ 2, 53 ],
                            55: [ 2, 53 ],
                            56: [ 2, 53 ],
                            57: [ 2, 53 ],
                            58: [ 2, 53 ],
                            59: [ 2, 53 ],
                            60: [ 2, 53 ],
                            61: [ 2, 53 ]
                        }, {
                            22: [ 2, 54 ],
                            49: [ 2, 54 ],
                            50: [ 2, 54 ],
                            51: [ 2, 54 ],
                            52: [ 2, 54 ],
                            53: [ 2, 54 ],
                            54: [ 2, 54 ],
                            55: [ 2, 54 ],
                            56: [ 2, 54 ],
                            57: [ 2, 54 ],
                            58: [ 2, 54 ],
                            59: [ 2, 54 ],
                            60: [ 2, 54 ],
                            61: [ 2, 54 ]
                        }, {
                            22: [ 2, 55 ],
                            49: [ 2, 55 ],
                            50: [ 2, 55 ],
                            51: [ 1, 147 ],
                            52: [ 1, 148 ],
                            53: [ 1, 149 ],
                            54: [ 1, 150 ],
                            55: [ 1, 151 ],
                            56: [ 2, 55 ],
                            57: [ 2, 55 ],
                            58: [ 2, 55 ],
                            59: [ 2, 55 ],
                            60: [ 2, 55 ],
                            61: [ 2, 55 ]
                        }, {
                            22: [ 2, 56 ],
                            49: [ 2, 56 ],
                            50: [ 2, 56 ],
                            51: [ 1, 147 ],
                            52: [ 1, 148 ],
                            53: [ 1, 149 ],
                            54: [ 1, 150 ],
                            55: [ 1, 151 ],
                            56: [ 2, 56 ],
                            57: [ 2, 56 ],
                            58: [ 2, 56 ],
                            59: [ 2, 56 ],
                            60: [ 2, 56 ],
                            61: [ 2, 56 ]
                        }, {
                            22: [ 2, 57 ],
                            49: [ 2, 57 ],
                            50: [ 2, 57 ],
                            51: [ 1, 147 ],
                            52: [ 1, 148 ],
                            53: [ 1, 149 ],
                            54: [ 1, 150 ],
                            55: [ 1, 151 ],
                            56: [ 2, 57 ],
                            57: [ 2, 57 ],
                            58: [ 2, 57 ],
                            59: [ 2, 57 ],
                            60: [ 2, 57 ],
                            61: [ 2, 57 ]
                        }, {
                            22: [ 2, 58 ],
                            49: [ 2, 58 ],
                            50: [ 2, 58 ],
                            51: [ 1, 147 ],
                            52: [ 1, 148 ],
                            53: [ 1, 149 ],
                            54: [ 1, 150 ],
                            55: [ 1, 151 ],
                            56: [ 2, 58 ],
                            57: [ 2, 58 ],
                            58: [ 2, 58 ],
                            59: [ 2, 58 ],
                            60: [ 2, 58 ],
                            61: [ 2, 58 ]
                        }, {
                            22: [ 2, 59 ],
                            49: [ 2, 59 ],
                            50: [ 2, 59 ],
                            51: [ 1, 147 ],
                            52: [ 1, 148 ],
                            53: [ 1, 149 ],
                            54: [ 1, 150 ],
                            55: [ 1, 151 ],
                            56: [ 2, 59 ],
                            57: [ 2, 59 ],
                            58: [ 2, 59 ],
                            59: [ 2, 59 ],
                            60: [ 2, 59 ],
                            61: [ 2, 59 ]
                        }, {
                            22: [ 2, 60 ],
                            49: [ 2, 60 ],
                            50: [ 2, 60 ],
                            51: [ 1, 147 ],
                            52: [ 1, 148 ],
                            53: [ 1, 149 ],
                            54: [ 1, 150 ],
                            55: [ 1, 151 ],
                            56: [ 2, 60 ],
                            57: [ 2, 60 ],
                            58: [ 2, 60 ],
                            59: [ 2, 60 ],
                            60: [ 2, 60 ],
                            61: [ 2, 60 ]
                        }, {
                            22: [ 2, 66 ],
                            49: [ 2, 66 ],
                            50: [ 2, 66 ],
                            51: [ 2, 66 ],
                            52: [ 2, 66 ],
                            53: [ 2, 66 ],
                            54: [ 2, 66 ],
                            55: [ 2, 66 ],
                            56: [ 2, 66 ],
                            57: [ 2, 66 ],
                            58: [ 2, 66 ],
                            59: [ 2, 66 ],
                            60: [ 2, 66 ],
                            61: [ 2, 66 ]
                        }, {
                            7: 211,
                            33: [ 1, 79 ],
                            36: 212,
                            80: [ 1, 80 ],
                            90: 81
                        }, {
                            5: [ 2, 27 ],
                            10: [ 2, 27 ],
                            19: [ 2, 27 ],
                            33: [ 2, 27 ],
                            34: [ 2, 27 ],
                            79: [ 2, 27 ]
                        }, {
                            5: [ 2, 28 ],
                            10: [ 2, 28 ],
                            19: [ 2, 28 ],
                            33: [ 2, 28 ],
                            34: [ 2, 28 ],
                            79: [ 2, 28 ]
                        }, {
                            22: [ 2, 31 ],
                            33: [ 2, 31 ]
                        }, {
                            81: [ 1, 213 ]
                        }, {
                            81: [ 1, 214 ]
                        }, {
                            81: [ 2, 104 ]
                        }, {
                            86: [ 1, 215 ]
                        }, {
                            81: [ 1, 216 ]
                        }, {
                            81: [ 1, 217 ]
                        }, {
                            93: [ 1, 218 ]
                        }, {
                            45: [ 2, 120 ],
                            72: [ 2, 120 ]
                        }, {
                            45: [ 2, 121 ],
                            72: [ 2, 121 ]
                        }, {
                            22: [ 2, 103 ],
                            44: [ 2, 103 ],
                            45: [ 2, 103 ],
                            49: [ 2, 103 ],
                            50: [ 2, 103 ],
                            51: [ 2, 103 ],
                            52: [ 2, 103 ],
                            53: [ 2, 103 ],
                            54: [ 2, 103 ],
                            55: [ 2, 103 ],
                            56: [ 2, 103 ],
                            57: [ 2, 103 ],
                            58: [ 2, 103 ],
                            59: [ 2, 103 ],
                            60: [ 2, 103 ],
                            61: [ 2, 103 ],
                            72: [ 2, 103 ],
                            79: [ 2, 103 ],
                            81: [ 2, 103 ]
                        }, {
                            22: [ 1, 219 ]
                        }, {
                            22: [ 1, 220 ]
                        }, {
                            22: [ 2, 114 ],
                            44: [ 2, 114 ],
                            45: [ 2, 114 ],
                            72: [ 2, 114 ],
                            81: [ 2, 114 ]
                        }, {
                            22: [ 2, 116 ],
                            44: [ 2, 116 ],
                            45: [ 2, 116 ],
                            72: [ 2, 116 ],
                            81: [ 2, 116 ]
                        }, {
                            81: [ 2, 105 ]
                        }, {
                            22: [ 2, 115 ],
                            44: [ 2, 115 ],
                            45: [ 2, 115 ],
                            72: [ 2, 115 ],
                            81: [ 2, 115 ]
                        }, {
                            22: [ 2, 117 ],
                            44: [ 2, 117 ],
                            45: [ 2, 117 ],
                            72: [ 2, 117 ],
                            81: [ 2, 117 ]
                        }, {
                            7: 221,
                            33: [ 1, 79 ],
                            36: 76,
                            43: 222,
                            47: 77,
                            52: [ 1, 90 ],
                            64: 78,
                            70: [ 1, 82 ],
                            80: [ 1, 80 ],
                            82: 83,
                            83: 84,
                            84: [ 1, 85 ],
                            85: 88,
                            86: [ 1, 89 ],
                            88: [ 1, 86 ],
                            89: [ 1, 87 ],
                            90: 81
                        }, {
                            5: [ 2, 24 ],
                            10: [ 2, 24 ],
                            19: [ 2, 24 ],
                            33: [ 2, 24 ],
                            34: [ 2, 24 ],
                            79: [ 2, 24 ]
                        }, {
                            5: [ 2, 25 ],
                            10: [ 2, 25 ],
                            19: [ 2, 25 ],
                            33: [ 2, 25 ],
                            34: [ 2, 25 ],
                            79: [ 2, 25 ]
                        }, {
                            45: [ 2, 123 ],
                            72: [ 2, 123 ]
                        }, {
                            45: [ 2, 124 ],
                            72: [ 2, 124 ]
                        } ],
                        defaultActions: {
                            22: [ 2, 1 ],
                            29: [ 2, 75 ],
                            30: [ 2, 76 ],
                            109: [ 2, 45 ],
                            110: [ 2, 46 ],
                            182: [ 2, 44 ],
                            203: [ 2, 104 ],
                            215: [ 2, 105 ]
                        },
                        parseError: function parseError(str, hash) {
                            throw new Error(str);
                        },
                        parse: function parse(input) {
                            var self = this, stack = [ 0 ], vstack = [ null ], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
                            this.lexer.setInput(input);
                            this.lexer.yy = this.yy;
                            this.yy.lexer = this.lexer;
                            this.yy.parser = this;
                            if (typeof this.lexer.yylloc == "undefined") this.lexer.yylloc = {};
                            var yyloc = this.lexer.yylloc;
                            lstack.push(yyloc);
                            var ranges = this.lexer.options && this.lexer.options.ranges;
                            if (typeof this.yy.parseError === "function") this.parseError = this.yy.parseError;
                            function popStack(n) {
                                stack.length = stack.length - 2 * n;
                                vstack.length = vstack.length - n;
                                lstack.length = lstack.length - n;
                            }
                            function lex() {
                                var token;
                                token = self.lexer.lex() || 1;
                                if (typeof token !== "number") {
                                    token = self.symbols_[token] || token;
                                }
                                return token;
                            }
                            var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
                            while (true) {
                                state = stack[stack.length - 1];
                                if (this.defaultActions[state]) {
                                    action = this.defaultActions[state];
                                } else {
                                    if (symbol === null || typeof symbol == "undefined") {
                                        symbol = lex();
                                    }
                                    action = table[state] && table[state][symbol];
                                }
                                if (typeof action === "undefined" || !action.length || !action[0]) {
                                    var errStr = "";
                                    if (!recovering) {
                                        expected = [];
                                        for (p in table[state]) if (this.terminals_[p] && p > 2) {
                                            expected.push("'" + this.terminals_[p] + "'");
                                        }
                                        if (this.lexer.showPosition) {
                                            errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
                                        } else {
                                            errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == 1 ? "end of input" : "'" + (this.terminals_[symbol] || symbol) + "'");
                                        }
                                        this.parseError(errStr, {
                                            text: this.lexer.match,
                                            token: this.terminals_[symbol] || symbol,
                                            line: this.lexer.yylineno,
                                            loc: yyloc,
                                            expected: expected
                                        });
                                    }
                                }
                                if (action[0] instanceof Array && action.length > 1) {
                                    throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
                                }
                                switch (action[0]) {
                                  case 1:
                                    stack.push(symbol);
                                    vstack.push(this.lexer.yytext);
                                    lstack.push(this.lexer.yylloc);
                                    stack.push(action[1]);
                                    symbol = null;
                                    if (!preErrorSymbol) {
                                        yyleng = this.lexer.yyleng;
                                        yytext = this.lexer.yytext;
                                        yylineno = this.lexer.yylineno;
                                        yyloc = this.lexer.yylloc;
                                        if (recovering > 0) recovering--;
                                    } else {
                                        symbol = preErrorSymbol;
                                        preErrorSymbol = null;
                                    }
                                    break;
                                  case 2:
                                    len = this.productions_[action[1]][1];
                                    yyval.$ = vstack[vstack.length - len];
                                    yyval._$ = {
                                        first_line: lstack[lstack.length - (len || 1)].first_line,
                                        last_line: lstack[lstack.length - 1].last_line,
                                        first_column: lstack[lstack.length - (len || 1)].first_column,
                                        last_column: lstack[lstack.length - 1].last_column
                                    };
                                    if (ranges) {
                                        yyval._$.range = [ lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1] ];
                                    }
                                    r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
                                    if (typeof r !== "undefined") {
                                        return r;
                                    }
                                    if (len) {
                                        stack = stack.slice(0, -1 * len * 2);
                                        vstack = vstack.slice(0, -1 * len);
                                        lstack = lstack.slice(0, -1 * len);
                                    }
                                    stack.push(this.productions_[action[1]][0]);
                                    vstack.push(yyval.$);
                                    lstack.push(yyval._$);
                                    newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
                                    stack.push(newState);
                                    break;
                                  case 3:
                                    return true;
                                }
                            }
                            return true;
                        }
                    };
                    var lexer = function() {
                        var lexer = {
                            EOF: 1,
                            parseError: function parseError(str, hash) {
                                if (this.yy.parser) {
                                    this.yy.parser.parseError(str, hash);
                                } else {
                                    throw new Error(str);
                                }
                            },
                            setInput: function(input) {
                                this._input = input;
                                this._more = this._less = this.done = false;
                                this.yylineno = this.yyleng = 0;
                                this.yytext = this.matched = this.match = "";
                                this.conditionStack = [ "INITIAL" ];
                                this.yylloc = {
                                    first_line: 1,
                                    first_column: 0,
                                    last_line: 1,
                                    last_column: 0
                                };
                                if (this.options.ranges) this.yylloc.range = [ 0, 0 ];
                                this.offset = 0;
                                return this;
                            },
                            input: function() {
                                var ch = this._input[0];
                                this.yytext += ch;
                                this.yyleng++;
                                this.offset++;
                                this.match += ch;
                                this.matched += ch;
                                var lines = ch.match(/(?:\r\n?|\n).*/g);
                                if (lines) {
                                    this.yylineno++;
                                    this.yylloc.last_line++;
                                } else {
                                    this.yylloc.last_column++;
                                }
                                if (this.options.ranges) this.yylloc.range[1]++;
                                this._input = this._input.slice(1);
                                return ch;
                            },
                            unput: function(ch) {
                                var len = ch.length;
                                var lines = ch.split(/(?:\r\n?|\n)/g);
                                this._input = ch + this._input;
                                this.yytext = this.yytext.substr(0, this.yytext.length - len - 1);
                                this.offset -= len;
                                var oldLines = this.match.split(/(?:\r\n?|\n)/g);
                                this.match = this.match.substr(0, this.match.length - 1);
                                this.matched = this.matched.substr(0, this.matched.length - 1);
                                if (lines.length - 1) this.yylineno -= lines.length - 1;
                                var r = this.yylloc.range;
                                this.yylloc = {
                                    first_line: this.yylloc.first_line,
                                    last_line: this.yylineno + 1,
                                    first_column: this.yylloc.first_column,
                                    last_column: lines ? (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length : this.yylloc.first_column - len
                                };
                                if (this.options.ranges) {
                                    this.yylloc.range = [ r[0], r[0] + this.yyleng - len ];
                                }
                                return this;
                            },
                            more: function() {
                                this._more = true;
                                return this;
                            },
                            less: function(n) {
                                this.unput(this.match.slice(n));
                            },
                            pastInput: function() {
                                var past = this.matched.substr(0, this.matched.length - this.match.length);
                                return (past.length > 20 ? "..." : "") + past.substr(-20).replace(/\n/g, "");
                            },
                            upcomingInput: function() {
                                var next = this.match;
                                if (next.length < 20) {
                                    next += this._input.substr(0, 20 - next.length);
                                }
                                return (next.substr(0, 20) + (next.length > 20 ? "..." : "")).replace(/\n/g, "");
                            },
                            showPosition: function() {
                                var pre = this.pastInput();
                                var c = (new Array(pre.length + 1)).join("-");
                                return pre + this.upcomingInput() + "\n" + c + "^";
                            },
                            next: function() {
                                if (this.done) {
                                    return this.EOF;
                                }
                                if (!this._input) this.done = true;
                                var token, match, tempMatch, index, col, lines;
                                if (!this._more) {
                                    this.yytext = "";
                                    this.match = "";
                                }
                                var rules = this._currentRules();
                                for (var i = 0; i < rules.length; i++) {
                                    tempMatch = this._input.match(this.rules[rules[i]]);
                                    if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                                        match = tempMatch;
                                        index = i;
                                        if (!this.options.flex) break;
                                    }
                                }
                                if (match) {
                                    lines = match[0].match(/(?:\r\n?|\n).*/g);
                                    if (lines) this.yylineno += lines.length;
                                    this.yylloc = {
                                        first_line: this.yylloc.last_line,
                                        last_line: this.yylineno + 1,
                                        first_column: this.yylloc.last_column,
                                        last_column: lines ? lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length
                                    };
                                    this.yytext += match[0];
                                    this.match += match[0];
                                    this.matches = match;
                                    this.yyleng = this.yytext.length;
                                    if (this.options.ranges) {
                                        this.yylloc.range = [ this.offset, this.offset += this.yyleng ];
                                    }
                                    this._more = false;
                                    this._input = this._input.slice(match[0].length);
                                    this.matched += match[0];
                                    token = this.performAction.call(this, this.yy, this, rules[index], this.conditionStack[this.conditionStack.length - 1]);
                                    if (this.done && this._input) this.done = false;
                                    if (token) return token; else return;
                                }
                                if (this._input === "") {
                                    return this.EOF;
                                } else {
                                    return this.parseError("Lexical error on line " + (this.yylineno + 1) + ". Unrecognized text.\n" + this.showPosition(), {
                                        text: "",
                                        token: null,
                                        line: this.yylineno
                                    });
                                }
                            },
                            lex: function lex() {
                                var r = this.next();
                                if (typeof r !== "undefined") {
                                    return r;
                                } else {
                                    return this.lex();
                                }
                            },
                            begin: function begin(condition) {
                                this.conditionStack.push(condition);
                            },
                            popState: function popState() {
                                return this.conditionStack.pop();
                            },
                            _currentRules: function _currentRules() {
                                return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
                            },
                            topState: function() {
                                return this.conditionStack[this.conditionStack.length - 2];
                            },
                            pushState: function begin(condition) {
                                this.begin(condition);
                            }
                        };
                        lexer.options = {};
                        lexer.performAction = function anonymous(yy, yy_, $avoiding_name_collisions, YY_START) {
                            var YYSTATE = YY_START;
                            switch ($avoiding_name_collisions) {
                              case 0:
                                var _reg = /\\+$/;
                                var _esc = yy_.yytext.match(_reg);
                                var _num = _esc ? _esc[0].length : null;
                                if (!_num || !(_num % 2)) {
                                    this.begin("mu");
                                } else {
                                    yy_.yytext = yy_.yytext.replace(/\\$/, "");
                                    this.begin("esc");
                                }
                                if (_num > 1) yy_.yytext = yy_.yytext.replace(/(\\\\)+$/, "\\");
                                if (yy_.yytext) return 79;
                                break;
                              case 1:
                                var _reg = /\\+$/;
                                var _esc = yy_.yytext.match(_reg);
                                var _num = _esc ? _esc[0].length : null;
                                if (!_num || !(_num % 2)) {
                                    this.begin("h");
                                } else {
                                    yy_.yytext = yy_.yytext.replace(/\\$/, "");
                                    this.begin("esc");
                                }
                                if (_num > 1) yy_.yytext = yy_.yytext.replace(/(\\\\)+$/, "\\");
                                if (yy_.yytext) return 79;
                                break;
                              case 2:
                                return 79;
                                break;
                              case 3:
                                this.popState();
                                return 10;
                                break;
                              case 4:
                                this.popState();
                                yy_.yytext = yy_.yytext.replace(/^#\[\[|\]\]#$/g, "");
                                return 79;
                                break;
                              case 5:
                                this.popState();
                                return 10;
                                break;
                              case 6:
                                return 19;
                                break;
                              case 7:
                                return 25;
                                break;
                              case 8:
                                return 27;
                                break;
                              case 9:
                                return 29;
                                break;
                              case 10:
                                this.popState();
                                return 30;
                                break;
                              case 11:
                                this.popState();
                                return 30;
                                break;
                              case 12:
                                this.popState();
                                return 31;
                                break;
                              case 13:
                                this.popState();
                                return 37;
                                break;
                              case 14:
                                return 32;
                                break;
                              case 15:
                                return 20;
                                break;
                              case 16:
                                return 38;
                                break;
                              case 17:
                                return 39;
                                break;
                              case 18:
                                return 35;
                                break;
                              case 19:
                                return yy_.yytext;
                                break;
                              case 20:
                                return yy_.yytext;
                                break;
                              case 21:
                                return yy_.yytext;
                                break;
                              case 22:
                                return yy_.yytext;
                                break;
                              case 23:
                                return yy_.yytext;
                                break;
                              case 24:
                                return yy_.yytext;
                                break;
                              case 25:
                                return yy_.yytext;
                                break;
                              case 26:
                                return yy_.yytext;
                                break;
                              case 27:
                                return 33;
                                break;
                              case 28:
                                return 33;
                                break;
                              case 29:
                                return yy_.yytext;
                                break;
                              case 30:
                                return 46;
                                break;
                              case 31:
                                var conditionStack = this.conditionStack;
                                var len = conditionStack.length;
                                if (len >= 2 && conditionStack[len - 1] === "c" && conditionStack[len - 2] === "run") {
                                    return 44;
                                }
                                break;
                              case 32:
                                break;
                              case 33:
                                return 70;
                                break;
                              case 34:
                                return 72;
                                break;
                              case 35:
                                return 93;
                                break;
                              case 36:
                                yy.begin = true;
                                return 69;
                                break;
                              case 37:
                                this.popState();
                                if (yy.begin === true) {
                                    yy.begin = false;
                                    return 71;
                                } else {
                                    return "CONTENT";
                                }
                                break;
                              case 38:
                                this.begin("c");
                                return 21;
                                break;
                              case 39:
                                if (this.popState() === "c") {
                                    var conditionStack = this.conditionStack;
                                    var len = conditionStack.length;
                                    if (conditionStack[len - 1] === "run") {
                                        this.popState();
                                        len = len - 1;
                                    }
                                    if (len === 2 && conditionStack[1] === "h") {
                                        this.popState();
                                    } else if (len === 3 && conditionStack[1] === "mu" && conditionStack[2] === "h") {
                                        this.popState();
                                        this.popState();
                                    }
                                    return 22;
                                } else {
                                    return "CONTENT";
                                }
                                break;
                              case 40:
                                this.begin("i");
                                return 80;
                                break;
                              case 41:
                                if (this.popState() === "i") {
                                    return 81;
                                } else {
                                    return "CONTENT";
                                }
                                break;
                              case 42:
                                return 91;
                                break;
                              case 43:
                                return 77;
                                break;
                              case 44:
                                return 87;
                                break;
                              case 45:
                                return 45;
                                break;
                              case 46:
                                yy_.yytext = yy_.yytext.substr(1, yy_.yyleng - 2).replace(/\\"/g, '"');
                                return 89;
                                break;
                              case 47:
                                yy_.yytext = yy_.yytext.substr(1, yy_.yyleng - 2).replace(/\\'/g, "'");
                                return 88;
                                break;
                              case 48:
                                return 84;
                                break;
                              case 49:
                                return 84;
                                break;
                              case 50:
                                return 84;
                                break;
                              case 51:
                                return 86;
                                break;
                              case 52:
                                return 34;
                                break;
                              case 53:
                                this.begin("run");
                                return 34;
                                break;
                              case 54:
                                this.begin("h");
                                return 19;
                                break;
                              case 55:
                                this.popState();
                                return 79;
                                break;
                              case 56:
                                this.popState();
                                return 79;
                                break;
                              case 57:
                                this.popState();
                                return 79;
                                break;
                              case 58:
                                this.popState();
                                return 5;
                                break;
                              case 59:
                                return 5;
                                break;
                            }
                        };
                        lexer.rules = [ /^(?:[^#]*?(?=\$))/, /^(?:[^\$]*?(?=#))/, /^(?:[^\x00]+)/, /^(?:#\*[\s\S]+?\*#)/, /^(?:#\[\[[\s\S]+?\]\]#)/, /^(?:##[^\n]+)/, /^(?:#(?=[a-zA-Z{]))/, /^(?:set[ ]*)/, /^(?:if[ ]*)/, /^(?:elseif[ ]*)/, /^(?:else\b)/, /^(?:\{else\})/, /^(?:end\b)/, /^(?:break\b)/, /^(?:foreach[ ]*)/, /^(?:noescape\b)/, /^(?:define[ ]*)/, /^(?:macro[ ]*)/, /^(?:in\b)/, /^(?:[%\+\-\*/])/, /^(?:<=)/, /^(?:>=)/, /^(?:[><])/, /^(?:==)/, /^(?:\|\|)/, /^(?:&&)/, /^(?:!=)/, /^(?:\$!(?=[{a-zA-Z_]))/, /^(?:\$(?=[{a-zA-Z_]))/, /^(?:!)/, /^(?:=)/, /^(?:[ ]+(?=[^,]))/, /^(?:\s+)/, /^(?:\{)/, /^(?:\})/, /^(?::)/, /^(?:\{)/, /^(?:\})/, /^(?:\([\s]*(?=[$'"\[\{\-0-9\w()!]))/, /^(?:\))/, /^(?:\[[\s]*(?=[\-$"'0-9{\[\]]+))/, /^(?:\])/, /^(?:\.\.)/, /^(?:\.(?=[a-zA-Z_]))/, /^(?:\.(?=[\d]))/, /^(?:,[ ]*)/, /^(?:"(\\"|[^\"])*")/, /^(?:'(\\'|[^\'])*')/, /^(?:null\b)/, /^(?:false\b)/, /^(?:true\b)/, /^(?:[0-9]+)/, /^(?:[_a-zA-Z][a-zA-Z0-9_\-]*)/, /^(?:[_a-zA-Z][a-zA-Z0-9_\-]*[ ]*(?=\())/, /^(?:#)/, /^(?:.)/, /^(?:\s+)/, /^(?:[\$#])/, /^(?:$)/, /^(?:$)/ ];
                        lexer.conditions = {
                            mu: {
                                rules: [ 5, 27, 28, 36, 37, 38, 39, 40, 41, 43, 52, 54, 55, 56, 58 ],
                                inclusive: false
                            },
                            c: {
                                rules: [ 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 38, 39, 40, 41, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52 ],
                                inclusive: false
                            },
                            i: {
                                rules: [ 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 32, 33, 33, 34, 34, 35, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52 ],
                                inclusive: false
                            },
                            h: {
                                rules: [ 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 27, 28, 29, 30, 35, 38, 39, 40, 41, 43, 51, 53, 55, 56, 58 ],
                                inclusive: false
                            },
                            esc: {
                                rules: [ 57 ],
                                inclusive: false
                            },
                            run: {
                                rules: [ 27, 28, 29, 31, 32, 33, 34, 35, 38, 39, 40, 41, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 55, 56, 58 ],
                                inclusive: false
                            },
                            INITIAL: {
                                rules: [ 0, 1, 2, 59 ],
                                inclusive: true
                            }
                        };
                        return lexer;
                    }();
                    parser.lexer = lexer;
                    function Parser() {
                        this.yy = {};
                    }
                    Parser.prototype = parser;
                    parser.Parser = Parser;
                    return new Parser;
                }();
                function makeLevel(block, index) {
                    var blockTypes = {
                        "if": 1,
                        foreach: 1,
                        macro: 1,
                        noescape: 1,
                        define: 1
                    };
                    var len = block.length;
                    index = index || 0;
                    var ret = [];
                    var ignore = index - 1;
                    for (var i = index; i < len; i++) {
                        if (i <= ignore) continue;
                        var ast = block[i];
                        var type = ast.type;
                        if (!blockTypes[type] && type !== "end") {
                            ret.push(ast);
                        } else if (type === "end") {
                            return {
                                arr: ret,
                                step: i
                            };
                        } else {
                            var _ret = makeLevel(block, i + 1);
                            ignore = _ret.step;
                            _ret.arr.unshift(block[i]);
                            ret.push(_ret.arr);
                        }
                    }
                    return ret;
                }
                velocity._parse = velocity.parse;
                velocity.parse = function(str) {
                    var asts = velocity._parse(str);
                    return makeLevel(asts);
                };
                return velocity;
            }();
            var velocityjs = {
                render: function(tmpl, context) {
                    var ast = velocity.parse(tmpl);
                    var html = (new Velocity(ast)).render(context);
                    return html;
                }
            };
            module.exports = velocityjs;
        })(require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/underscore-1.8.2.js"));
    });
    define("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/cookie.js", function(require, exports, module) {
        module.exports = {
            get: function(name, encode) {
                var arg = name + "=";
                var alen = arg.length;
                var clen = document.cookie.length;
                var i = 0;
                var j = 0;
                while (i < clen) {
                    j = i + alen;
                    if (document.cookie.substring(i, j) == arg) return this.getCookieVal(j, encode);
                    i = document.cookie.indexOf(" ", i) + 1;
                    if (i == 0) break;
                }
                return null;
            },
            set: function(name, value, expires, path, domain, secure) {
                var argv = arguments;
                var argc = arguments.length;
                var now = new Date;
                var expires = argc > 2 ? argv[2] : new Date(now.getFullYear(), now.getMonth() + 1, now.getUTCDate());
                var path = argc > 3 ? argv[3] : "/";
                var domain = argc > 4 ? argv[4] : "";
                var secure = argc > 5 ? argv[5] : false;
                document.cookie = name + "=" + escape(value) + (expires == null ? "" : "; expires=" + expires.toGMTString()) + (path == null ? "" : "; path=" + path) + (domain == null ? "" : "; domain=" + domain) + (secure == true ? "; secure" : "");
            },
            remove: function(name) {
                if (this.get(name)) this.set(name, "", new Date(1970, 1, 1));
            },
            getCookieVal: function(offset, encode) {
                var endstr = document.cookie.indexOf(";", offset);
                if (endstr == -1) {
                    endstr = document.cookie.length;
                }
                if (encode == false) return document.cookie.substring(offset, endstr); else return unescape(document.cookie.substring(offset, endstr));
            },
            cookie: function(key, value, options) {
                try {
                    if (arguments.length > 1 && String(value) !== "[object Object]") {
                        if (value === null || value === undefined) {
                            options.expires = -1;
                        }
                        if (typeof options.expires === "number") {
                            var days = options.expires, t = options.expires = new Date;
                            t.setDate(t.getDate() + days);
                        }
                        value = String(value);
                        return document.cookie = [ encodeURIComponent(key), "=", options.raw ? value : encodeURIComponent(value), options.expires ? "; expires=" + options.expires.toUTCString() : "", options.path ? "; path=" + options.path : "", options.domain ? "; domain=" + options.domain : "", options.secure ? "; secure" : "" ].join("");
                    }
                    options = value || {};
                    var result, decode = options.raw ? function(s) {
                        return s;
                    } : decodeURIComponent;
                    return (result = (new RegExp("(?:^|; )" + encodeURIComponent(key) + "=([^;]*)")).exec(document.cookie)) ? decode(result[1]) : null;
                } catch (e) {}
            }
        };
    });
    define("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/changyan-overlay.js", function(require, exports, module) {
        require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/changyan-overlay.css");
        var $ = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/jquery-1.7.0.js");
        var _ = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/underscore-1.8.2.js");
        var closeOverlay = function() {
            $("#SOHUCS #SOHU_MAIN .changyan-overlay").remove();
            $("html").removeClass("changyan-overlay-lock");
            $(window).off("resize.changyan-overlay");
        };
        var closeDialog = function() {
            closeOverlay();
            $("#SOHUCS #SOHU_MAIN .changyan-overlay-outer").remove();
        };
        var creteOverlay = function() {
            var $overlay = $(".changyan-overlay").length ? $(".changyan-overlay") : $('<div class="changyan-overlay changyan-overlay-fixed"></div>').appendTo("#SOHUCS #SOHU_MAIN");
            $("html").addClass("changyan-overlay-lock");
            $overlay.on("click", function(e) {
                if ($(e.target).closest(".changyan-overlay-outer").length) {
                    return;
                }
                $overlay.off("click");
                closeDialog();
            });
        };
        var createDialog = function(dom, fn) {
            var $dom;
            if (_.isElement(dom) || _.isString(dom)) {
                $dom = $(dom);
            }
            creteOverlay();
            var $outer = $('<div class="changyan-overlay-outer"></div>');
            var $wrapper = $outer.html($(dom));
            $("#SOHUCS #SOHU_MAIN").append($wrapper);
            var cssObj = {
                top: ($(window).height() - $wrapper.height()) / 2,
                left: ($(window).width() - $wrapper.width()) / 2,
                opacity: 1
            };
            $wrapper.css(cssObj);
            $wrapper.show();
            $(window).on("resize.changyan-overlay", function() {
                $wrapper.css({
                    top: ($(window).height() - $wrapper.height()) / 2,
                    left: ($(window).width() - $wrapper.width()) / 2
                });
            });
            setTimeout(function() {
                $wrapper.css({
                    top: ($(window).height() - $wrapper.height()) / 2,
                    left: ($(window).width() - $wrapper.width()) / 2
                });
            }, 1e3);
            if (_.isFunction(fn)) {
                fn();
            }
        };
        var Dialog = {
            show: function(contet) {
                createDialog(contet);
            },
            close: function() {
                closeDialog();
            }
        };
        module.exports = Dialog;
    });
    define("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/changyan-overlay.css", function(require, exports, module) {
        var cssText = ".changyan-overlay-lock{overflow:hidden!important;width:auto}.changyan-overlay-lock .changyan-overlay{overflow:auto;overflow-y:scroll}.changyan-overlay{position:absolute;top:0;left:0;overflow:hidden;z-index:2147483641;background:#000;filter:alpha(opacity=50);opacity:.5;width:auto;height:auto;display:block}.changyan-overlay-fixed{position:fixed;bottom:0;right:0}.changyan-overlay-outer{position:fixed;z-index:2147483645;top:0;left:0;filter:alpha(opacity=1);opacity:.01}";
        var document = window.document;
        var styleTag = document.createElement("style");
        styleTag.setAttribute("type", "text/css");
        if (document.all) {
            styleTag.styleSheet.cssText = cssText;
        } else {
            styleTag.innerHTML = cssText;
        }
        document.getElementsByTagName("head").item(0).appendChild(styleTag);
    });
    define("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/util/wechat-qrcode.js", function(require, exports, module) {
        var api = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/data.js"), $ = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/jquery-1.7.0.js");
        var url = {
            getQrcode: api.getConfig("protocol") + "lab.changyan.sohu.com/api/weixin/qrcode",
            proxyQrcode: api.getConfig("protocol") + "lab.changyan.sohu.com/api/weixin/proxy/qrcode",
            connectUrl: api.getConfig("protocol") + "lab.changyan.sohu.com/api/weixin/long/connection",
            failImageUrl: api.getConfig("protocol") + "0d077ef9e74d8.cdn.sohucs.com/q0DF8Cm_png"
        };
        var timer = null;
        var QRCODE_EXPIRE = 12e4;
        var sendAjax = function(options, successFn, failFn) {
            options.success = function(data) {
                successFn(data);
                delete options.success;
                delete options.success;
            };
            options.error = function(data) {
                failFn(data);
                delete options.error;
                delete options.error;
            };
            $.ajax(options);
        };
        var getScript = function(url, fn) {
            $.getScript(url, fn);
        };
        var WechatQrcode = function(_type, _commentId) {
            this.type = _type;
            this.commentId = _commentId ? _commentId : 0;
            if (!window.longPull) {
                var jsDomain = api.getConfig("base");
                getScript(jsDomain + "/mdevp/extensions/longloop/003/longloop.js", function() {});
            }
        };
        WechatQrcode.prototype = {
            refresh: function(successFn, failFn) {
                var that = this;
                var data = {};
                var success = function(data) {
                    var params = {};
                    if (that.type === "bind" || that.type === "login") {
                        params.type = that.type;
                        params.sceneId = data.sceneId;
                        params.client_id = api.getAppid();
                    } else {
                        params.type = that.type;
                        params.sceneId = data.sceneId;
                        params.client_id = api.getAppid();
                        params.comment_id = that.commentId;
                    }
                    var connectionUrl = url.connectUrl;
                    connectionUrl += "?";
                    for (var k in params) {
                        connectionUrl += "&" + k + "=" + params[k];
                    }
                    window.longPull.connect(connectionUrl, function(data) {
                        that.onSuccess(data);
                    }, function(e) {});
                    if (timer) {
                        clearTimeout(timer);
                    }
                    timer = window.setTimeout(function() {
                        that.onExpire && that.onExpire();
                    }, QRCODE_EXPIRE);
                    successFn && successFn(data);
                };
                sendAjax({
                    cache: false,
                    dataType: "jsonp",
                    timeout: 3e4,
                    type: "GET",
                    url: url.getQrcode,
                    data: data
                }, success, failFn);
            },
            abort: function() {
                window.longPull.abort();
            },
            onExpire: function() {},
            onSuccess: function() {},
            onFail: function() {}
        };
        if (!window.longPull) {
            var jsDomain = api.getConfig("base");
            getScript(jsDomain + "/mdevp/extensions/longloop/002/longloop.js", function() {});
        }
        module.exports = WechatQrcode;
    });
    define("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/data.js", function(require, exports, module) {
        var $$data = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/util/data-center.js");
        var dataApi = {
            getAppid: function() {
                return $$data.get("feConfig:appid");
            },
            getTopicId: function() {
                return $$data.get("topic:topic_id");
            },
            getUUID: function() {
                return $$data.get("cookie:debug_uuid");
            },
            getSid: function() {
                return $$data.get("feConfig:sid");
            },
            getCategoryId: function() {
                return $$data.get("topic:topic_category_id");
            },
            getCommentNum: function() {
                return $$data.get("topic:cmt_sum") || 0;
            },
            getParticipationNum: function() {
                return $$data.get("topic:participation_sum") || 0;
            },
            getPageNo: function() {
                return $$data.get("topic:page_no") || 1;
            },
            getPageNum: function() {
                return $$data.get("topic:total_page_no") || 0;
            },
            getBeConfig: function(key) {
                if (key === undefined) {
                    return $$data.get("beConfig");
                } else {
                    return $$data.get("beConfig:" + key);
                }
            },
            getFeConfig: function(key) {
                return $$data.get("feConfig:" + key);
            },
            getConfig: function(key) {
                return $$data.get("config:" + key);
            },
            getCommentMode: function() {
                return $$data.get("topic:mode") || 0;
            },
            getIsvAuditMode: function() {
                var isvAuditMode = parseInt($$data.get("config:isvAuditMode"), 10);
                return isvAuditMode;
            },
            getIsHidePrompt: function() {
                return $$data.get("cookie:debug_hidden_first_prompt");
            },
            getCommentsNum: function() {
                return $$data.get("topic:cmt_sum") || 0;
            },
            getIsFirstWap: function() {
                return $$data.get("cookie:debug_wap_first_prompt");
            }
        };
        module.exports = dataApi;
    });
    define("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/user.js", function(require, exports, module) {
        var _ = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/underscore-1.8.2.js"), $ = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/jquery-1.7.0.js"), $$data = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/util/data-center.js"), $$event = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/events.js"), $$util = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/util/util.js"), $$asyncLoadExtension = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/async-load-extension.js"), $$login = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/login-normal.js"), $$sso = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/sso/sso-init.js");
        var loadScripts = function() {
            return function(urls) {
                var ret = [];
                for (var i = 0; i < urls.length; i++) {
                    ret[i] = $.getScript(urls[i]);
                }
                return $.when.apply($, ret);
            };
        }();
        var userApi = {
            getUserInfo: function(fn, update) {
                function goDeep() {
                    if ($$data.get("beConfig:sso") !== "true") {
                        if (update) {
                            $$data.del("userInfo:changyan");
                        }
                        $$login.getUserInfo(fn);
                    } else {
                        if (update) {
                            $$data.del("userInfo:sso");
                        }
                        $$sso.getIsvUserInfo(fn, update);
                    }
                }
                if ($$data.get("feConfig:appid") == "cyqemw6s1" && $$data.get("feConfig:sohu_ui_type") == "1") {
                    if (document.cookie) {
                        var spinfo = false;
                        var ppinfo = false;
                        var cookieStr = document.cookie;
                        var cookies = cookieStr.split(";");
                        for (var i = 0; i < cookies.length; i++) {
                            var temp = cookies[i].split("=");
                            if (temp[0].trim() === "spinfo") {
                                spinfo = true;
                            }
                            if (temp[0].trim() === "ppinf") {
                                ppinfo = true;
                            }
                        }
                        if (spinfo && !ppinfo) {
                            $$login.logout();
                            if (_.isFunction(fn)) {
                                fn({
                                    error_code: 10207,
                                    error_msg: "user doesn't login"
                                });
                            }
                        } else if (!spinfo && ppinfo) {
                            var hiddenImg = document.createElement("img");
                            hiddenImg.src = "https://plus.sohu.com/account/seed";
                            setTimeout(goDeep, 1e3);
                        } else {
                            goDeep();
                        }
                    }
                } else {
                    goDeep();
                }
            },
            logout: function() {
                $$login.logout();
                if ($$data.get("beConfig:sso") === "true") {
                    $$sso.logoutIsv();
                }
            },
            login: function(platformId, params, fn) {
                if (!_.contains([ 2, 3, 11, 13, 14, 15 ], platformId)) {
                    throw "platformId不存在";
                }
                if ($$data.get("feConfig:ismobile") === true) {
                    if (_.contains([ 2, 3, 11, 13, 14, 15 ], platformId)) {
                        require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/login-platform.js").login(platformId, params, fn);
                        return;
                    }
                } else {
                    if (_.contains([ 2, 3, 11 ], platformId)) {
                        require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/login-platform.js").login(platformId);
                        return;
                    }
                    if (_.contains([ 15 ], platformId)) {
                        $$asyncLoadExtension.openLoginDialog("true");
                        return;
                    }
                    if (_.contains([ 14 ], platformId)) {
                        require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/login-sso.js")();
                        return;
                    }
                }
            }
        };
        return userApi;
    });
    define("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/events.js", function(require, exports, module) {
        var _ = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/underscore-1.8.2.js");
        var events = {};
        var triggers = [];
        var listens = [];
        var extensionsReady = false;
        var eventApi = {
            listen: function(key, fn) {
                if (!_.isString(key) || !_.isFunction(fn)) {
                    throw "监听事件参数错误";
                    return;
                }
                if (!extensionsReady) {
                    listens.push({
                        key: key,
                        fn: fn
                    });
                    return;
                }
                if (extensionsReady) {
                    events[key] = events[key] || [];
                    events[key].push(fn);
                }
            },
            trigger: function() {
                var key = arguments[0];
                var args = [].slice.call(arguments, 1);
                var fnList = events[key] || [];
                triggers.push({
                    key: key,
                    params: args[0] || undefined
                });
                _.each(fnList, function(item) {
                    if (_.isFunction(item)) {
                        try {
                            if (extensionsReady) {
                                item.apply(window, args);
                            }
                        } catch (e) {
                            if (console) {
                                console.error(e + ": " + key + "监听事件执行出错");
                            }
                        }
                    }
                });
            },
            register: function(namespace, key) {
                var extensionsWhiteList = [ "changyan", "cmt-header", "cmt-list", "cmt-box", "cmt-float-bar", "cmt-footer", "cy-user-page", "cy-user-info", "mobile-cmt-list", "mobile-login-box", "mobile-cmt-barrage" ];
                if (!_.isString(namespace) || !_.isString(key)) {
                    throw "注册事件参数错误";
                    return;
                }
                if (!_.contains(extensionsWhiteList, namespace)) {
                    throw namespace + "事件不在注册白名单内";
                }
                if (!/^[a-z\-]*$/g.test(namespace + key)) {
                    throw '注册事件命名只能为小写字母和"-"';
                    return;
                }
                if (extensionsReady === true) {
                    throw "请事先注册事件" + namespace + ":" + key;
                    return;
                }
                if (!namespace.match(/^changyan/)) {
                    namespace = "changyan:" + namespace;
                }
                events[namespace + ":" + key] = events[namespace + key] || [];
                return namespace + ":" + key;
            }
        };
        (function() {
            eventApi.register("changyan", "login");
            eventApi.register("changyan", "logout");
            eventApi.register("changyan", "login-cancel");
            eventApi.register("changyan", "submit");
            eventApi.register("changyan", "submit-before");
            eventApi.register("changyan", "extensions-ready");
            eventApi.register("changyan", "on-topic-lod");
            eventApi.register("changyan", "cy-refresh");
        })();
        var ready = function() {
            extensionsReady = true;
            var key;
            _.each(listens, function(item) {
                eventApi.listen(item.key, item.fn);
            });
            _.each(triggers, function(item) {
                eventApi.trigger(item.key, item.params);
            });
            triggers = [];
            eventApi.trigger("changyan:extensions-ready");
        };
        window.changyan.event = eventApi;
        module.exports = {
            event: eventApi,
            ready: ready
        };
    });
    define("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/async-load-extension.js", function(require, exports, module) {
        var $ = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/jquery-1.7.0.js");
        _ = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/underscore-1.8.2.js"), velocity = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/velocity.fe.js"), $$data = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/util/data-center.js"), $$util = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/util/util.js");
        var asyncApi = {
            doWinLogin: function(winUrl, fn) {
                if (window.changyan.childWindow !== undefined) {
                    return;
                }
                var h = typeof window.screenX != "undefined" ? window.screenX : window.screenLeft, e = typeof window.screenY != "undefined" ? window.screenY : window.screenTop, m = typeof window.outerWidth != "undefined" ? window.outerWidth : document.documentElement.clientWidth, j = typeof window.outerHeight != "undefined" ? window.outerHeight : document.documentElement.clientHeight - 22, width = 754, height = 537, left = parseInt(h + (m - width) / 2, 10), top = parseInt(e + (j - height) / 2.5, 10);
                window.changyan.childWindow = window.open(winUrl, "", "alwaysRaised=yes,left=" + left + ",top=" + top + ",width=" + width + ",height=" + height + ",scrollbars=no,z-look=yes");
                var timer;
                var response = function() {
                    window.clearInterval(timer);
                    window.changyan.childWindow = undefined;
                    SOHUCS.reset(fn);
                };
                timer = window.setInterval(function() {
                    if (!window.XMLHttpRequest) {
                        (function() {
                            var rt = "";
                            var key;
                            try {
                                for (key in window.changyan.childWindow) {
                                    rt += key;
                                }
                            } catch (e) {}
                            if (rt.length < 10) {
                                response();
                            }
                        })();
                    } else {
                        try {
                            if (window.changyan.childWindow.closed === false) {
                                return;
                            } else {
                                response();
                            }
                        } catch (ex) {
                            response();
                        }
                    }
                }, 500);
            },
            ssoLoginfn: function(code) {
                eval(code);
            },
            LoginMode: function(tag) {
                var that = this;
                if ($$data.get("beConfig:sso") + "" === "true" && !$$data.get("feConfig:ismobile") && $$data.get("beConfig:sso_loginstyle_open_only") + "" === "true") {
                    require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/login-sso.js")();
                } else {
                    window.changyan.loginDialog(tag);
                }
            },
            openLoginDialog: function(tag) {
                var that = this;
                if (window.changyan.loginDialog) {
                    that.LoginMode(tag);
                } else {
                    if ($$data.get("beConfig:extensions_key").indexOf("v3.2") >= 0) {
                        $$util.loadJs($$data.get("config:base") + "mdevp/extensions/login-dialog/048/login-dialog.js", function() {
                            that.LoginMode(tag);
                        });
                    } else if ($$data.get("beConfig:extensions_key") == "sohu") {
                        var $$ = window.jQuery ? window.jQuery : $;
                        $$("#SOHUCS").trigger("openLoginDialog");
                    } else if ($$data.get("beConfig:extensions_key") == "17173") {
                        if (Passport && Passport.Dialog && Passport.Dialog.show) {
                            Passport.Dialog.show();
                        }
                    } else if ($$data.get("beConfig:extensions_key") == "simple" || $$data.get("beConfig:extensions_key") == "simplest") {
                        $$util.loadJs($$data.get("config:base") + "mdevp/extensions/login-dialog/048/login-dialog.js", function() {
                            that.LoginMode(tag);
                        });
                    } else {
                        $$util.loadJs($$data.get("config:base") + "mdevp/extensions/login-dialog/010/login-dialog.js", function() {
                            that.LoginMode(tag);
                        });
                    }
                }
            }
        };
        module.exports = asyncApi;
    });
    define("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/login-sso.js", function(require, exports, module) {
        var $ = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/jquery-1.7.0.js");
        var _ = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/underscore-1.8.2.js");
        var $$data = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/util/data-center.js");
        var $$event = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/events.js");
        var $$sso = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/sso/sso-init.js");
        var ssoLogin = function() {
            if (!$$data.get("beConfig:sso")) {
                return;
            }
            if ($$data.get("beConfig:sso_button_action_type") === "1") {
                var url = $$data.get("beConfig:sso_button_action");
                var width = 760;
                var height = 570;
                var openWindow = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/util/open-window.js").openWindow;
                openWindow(url, width, height, function() {
                    $$sso.getIsvUserInfo(function(data) {
                        if (data && data.error_code) {} else {
                            $$event.event.trigger("changyan:login");
                        }
                    });
                });
            }
            var action = $$data.get("beConfig:sso_button_action");
            if ($$data.get("beConfig:sso_button_action_type") === "2") {
                try {
                    eval(action);
                } catch (e) {
                    throw '单点登录执行错误: "' + action + '"' + e;
                }
            }
        };
        module.exports = ssoLogin;
    });
    define("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/sso/sso-init.js", function(require, exports, module) {
        var $ = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/jquery-1.7.0.js"), _ = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/underscore-1.8.2.js"), $$data = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/util/data-center.js"), $$event = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/events.js"), $$util = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/util/util.js"), $$login = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/login-normal.js");
        var loadScripts = function() {
            return function(urls) {
                var ret = [];
                for (var i = 0; i < urls.length; i++) {
                    ret[i] = $.getScript(urls[i]);
                }
                return $.when.apply($, ret);
            };
        }();
        var logoutIsv = function() {
            $.ajax({
                url: $$data.get("beConfig:sso_isv_logout"),
                dataType: "jsonp",
                jsonp: "callback",
                jsonpCallback: "isv_logout_cb",
                success: function(data) {
                    $$data.set("userInfo:sso", {
                        is_login: 0
                    });
                    if (data && data.code != 1) {
                        window.location.reload();
                    }
                    if (data && data.code == 1 && _.isArray(data.js_src)) {
                        loadScripts(data.js_src).always(function() {
                            if (data.reload_page === 1) {
                                window.location.reload();
                            }
                        });
                    } else {
                        if (data.reload_page === 1) {
                            window.location.reload();
                        }
                    }
                    if (data.reload_page === 1) {
                        window.setTimeout(function() {
                            window.location.reload();
                        }, 2e3);
                    }
                }
            });
        };
        var fnGetIsvUserInfo = function(data, fn, update) {
            if (data.is_login) {
                $$data.set("userInfo:loginCyanTag", false);
                require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/sso/isv-logined.js")(data, fn, update);
            } else if ($$data.get("beConfig:sso_type") === "1") {
                require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/sso/completely-sso.js")(fn, update);
            } else {
                $$login.getUserInfo(function(info) {
                    fn && fn(info);
                }, update);
            }
        };
        var getIsvUserInfo = function(fn, update) {
            var cache = $$data.get("userInfo:sso");
            if (!update && cache && cache.is_login) {
                fnGetIsvUserInfo(cache, fn);
                return;
            }
            $.ajax({
                url: decodeURIComponent($$data.get("beConfig:sso_isv_userInfo")),
                cache: false,
                dataType: "jsonp",
                jsonp: "callback",
                success: function(data) {
                    data = $$util.UrlSwitchHttps(data);
                    $$data.set("userInfo:sso", data);
                    fnGetIsvUserInfo(data, fn, update);
                },
                error: function(err) {
                    $$login.getUserInfo(function(info) {
                        fn && fn(info);
                    }, update);
                }
            });
        };
        module.exports = {
            getIsvUserInfo: getIsvUserInfo,
            logoutIsv: logoutIsv
        };
    });
    define("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/login-normal.js", function(require, exports, module) {
        var $ = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/jquery-1.7.0.js");
        var _ = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/underscore-1.8.2.js");
        var $$data = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/util/data-center.js");
        var $$event = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/events.js");
        var $$util = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/util/util.js");
        var loginTerminal = "PC";
        if (window.screen.width < 800) {
            loginTerminal = "mobile";
        }
        var login = {
            getUserInfo: function(fn, update) {
                var cache = $$data.get("userInfo:changyan");
                if (!update && cache && cache.user_id) {
                    fn(cache);
                    return;
                }
                var param = {
                    client_id: $$data.get("feConfig:appid"),
                    login_terminal: loginTerminal
                };
                $.ajax({
                    url: $$data.get("config:api") + "api/2/user/info",
                    dataType: "jsonp",
                    cache: false,
                    scriptCharset: "utf-8",
                    timeout: 1e3,
                    data: param,
                    success: function(data) {
                        data = $$util.UrlSwitchHttps(data);
                        if (data.error_code !== 10207) {
                            $$data.set("userInfo:changyan", data);
                        }
                        if (_.isFunction(fn)) {
                            fn(data);
                        }
                    }
                });
            },
            logout: function() {
                var loadScripts = function() {
                    return function(urls) {
                        var ret = [];
                        for (var i = 0; i < urls.length; i++) {
                            ret[i] = $.getScript(urls[i]);
                        }
                        return $.when.apply($, ret);
                    };
                }();
                window.changyanQuit = function() {};
                window.changyanLogout = function() {};
                var sohuplus_logout = $$data.get("config:protocol") + "plus.sohu.com/a/spassport/logoutservice?cb=changyanQuit";
                var passport_logout = $$data.get("config:protocol") + "passport.sohu.com/sso/logout.jsp";
                var cyan_logout_api = $$data.get("config:protocol") + "changyan.sohu.com/api/2/logout?callback=changyanLogout&client_id=" + $$data.get("feConfig:appid");
                var urls = [ sohuplus_logout, passport_logout, cyan_logout_api ];
                loadScripts(urls).done(function() {
                    $$data.set("userInfo:changyan", {
                        error_code: 10207,
                        error_msg: "'user doesn't login"
                    });
                    $$event.event.trigger("changyan:logout");
                });
            }
        };
        module.exports = login;
    });
    define("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/sso/isv-logined.js", function(require, exports, module) {
        var $ = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/jquery-1.7.0.js"), _ = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/underscore-1.8.2.js"), $$data = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/util/data-center.js");
        var loginCyan = function(data, fn, update) {
            var loginTerminal = "PC";
            if (window.screen.width < 800) {
                loginTerminal = "mobile";
            }
            var cache = $$data.get("userInfo:changyan");
            if (!update && cache && cache.user_id) {
                fn(cache);
                return;
            }
            var params = {
                client_id: $$data.get("feConfig:appid"),
                nickname: data.user.nickname,
                img_url: data.user.img_url,
                profile_url: data.user.profile_url,
                isv_user_id: data.user.user_id,
                sign: data.sign,
                login_terminal: loginTerminal
            };
            $.ajax({
                url: $$data.get("config:api") + "api/2/login/isv",
                cache: false,
                dataType: "jsonp",
                jsonp: "callback",
                data: params,
                success: function(datas) {
                    if (datas.error_code) {
                        if ($$data.get("userInfo:loginCyanTag")) {
                            fn({
                                error_code: 10207,
                                error_msg: "user doesn't login"
                            });
                            return;
                        }
                        $.ajax({
                            url: datas.error_msg,
                            cache: false,
                            dataType: "jsonp",
                            jsonp: "cb",
                            jsonpCallback: "cb",
                            success: function() {
                                $$data.set("userInfo:loginCyanTag", true);
                                loginCyan(data, fn);
                            }
                        });
                    } else {
                        $$data.set("userInfo:changyan", datas);
                        fn(datas);
                    }
                }
            });
        };
        module.exports = loginCyan;
    });
    define("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/sso/completely-sso.js", function(require, exports, module) {
        var $ = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/jquery-1.7.0.js"), _ = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/underscore-1.8.2.js"), $$data = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/util/data-center.js"), $$event = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/events.js"), $$login = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/login-normal.js");
        var loadScripts = function() {
            return function(urls) {
                var ret = [];
                for (var i = 0; i < urls.length; i++) {
                    ret[i] = $.getScript(urls[i]);
                }
                return $.when.apply($, ret);
            };
        }();
        var loginIsv = function(params, fn) {
            $.ajax({
                url: $$data.get("beConfig:sso_isv_login"),
                dataType: "jsonp",
                data: params,
                jsonp: "callback",
                jsonpCallback: "isv_login_cb",
                success: function(data) {
                    if (data && _.isArray(data.js_src)) {
                        loadScripts(data.js_src).always(function() {
                            if (data.reload_page === 1) {
                                window.location.reload();
                            }
                        });
                    } else {
                        if (data.reload_page === 1) {
                            window.location.reload();
                        }
                    }
                    if (data.reload_page === 1) {
                        window.setTimeout(function() {
                            window.location.reload();
                        }, 2e3);
                    }
                }
            });
        };
        var completelySso = function(fn, update) {
            $$login.getUserInfo(function(userInfo) {
                if (!userInfo.error_code) {
                    fn(userInfo);
                    var params = {
                        cy_user_id: userInfo.user_id,
                        user_id: userInfo.isv_refer_id,
                        nickname: encodeURIComponent(userInfo.nickname),
                        img_url: encodeURIComponent(userInfo.img_url),
                        profile_url: encodeURIComponent(userInfo.profile_url),
                        sign: encodeURIComponent(userInfo.sign)
                    };
                    loginIsv(params);
                } else {
                    fn(userInfo);
                }
            }, update);
        };
        module.exports = completelySso;
    });
    define("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/util/open-window.js", function(require, exports, module) {
        var childWindow;
        var openWindow = function(url, width, height, fn) {
            if (childWindow !== undefined) {
                return;
            }
            var h = typeof window.screenX != "undefined" ? window.screenX : window.screenLeft, e = typeof window.screenY != "undefined" ? window.screenY : window.screenTop, m = typeof window.outerWidth != "undefined" ? window.outerWidth : document.documentElement.clientWidth, j = typeof window.outerHeight != "undefined" ? window.outerHeight : document.documentElement.clientHeight - 22, left = parseInt(h + (m - width) / 2, 10), top = parseInt(e + (j - height) / 2.5, 10);
            childWindow = window.open(url, "", "alwaysRaised=yes, left=" + left + ", top=" + top + ", width=" + width + ", height=" + height + ", scrollbars=no, z-look=yes");
            var timer;
            var response = function() {
                window.clearInterval(timer);
                childWindow = undefined;
                fn && fn();
            };
            timer = window.setInterval(function() {
                try {
                    if (childWindow.closed === false) {
                        return;
                    } else {
                        response();
                    }
                } catch (ex) {
                    response();
                }
            }, 500);
        };
        exports.openWindow = openWindow;
    });
    define("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/login-platform.js", function(require, exports, module) {
        var $$data = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/util/data-center.js");
        var $$event = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/events.js");
        var login = function(id, params, fn) {
            var url = $$data.get("config:api") + "api/2/login/passport?client_id=" + $$data.get("feConfig:appid") + "&platform_id=" + id;
            var width = 760;
            var height = 570;
            if ($$data.get("feConfig:ismobile") === true) {
                var $$loginMobile = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/login-platform-mobile.js");
                var mobileParameter = {
                    id: id,
                    params: params,
                    fn: fn
                };
                $$loginMobile.init(mobileParameter);
            } else {
                var openWindow = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/util/open-window.js").openWindow;
                openWindow(url, width, height, function() {
                    var getUserInfo = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/login-normal.js").getUserInfo;
                    getUserInfo(function(data) {
                        if (data && data.error_code) {
                            console.log("not login.");
                        } else {
                            $$event.event.trigger("changyan:login");
                            console.log("success.");
                        }
                    });
                });
            }
        };
        exports.login = login;
    });
    define("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/login-platform-mobile.js", function(require, exports, module) {
        var $$data = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/util/data-center.js");
        var $$event = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/events.js");
        var $ = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/jquery-1.7.0.js");
        var $$ua = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/util/ua.js");
        var mobileLogin = {
            init: function(data) {
                var _this = this;
                if (data.id === 15) {
                    _this.phone(data);
                } else if (data.id === 14) {
                    _this.sso();
                } else {
                    _this.other(data.id);
                }
            },
            phone: function(phoneData) {
                var protocl = $$ua.browser === "weixin" ? "http://" : "https://";
                var loginData = {
                    mobile: phoneData.params.mobile,
                    passwd: phoneData.params.passwd,
                    client_id: $$data.get("feConfig:appid")
                };
                $.ajax({
                    url: protocl + "changyan.sohu.com/api/2/login/phone",
                    dataType: "json",
                    type: "post",
                    data: loginData,
                    crossDomain: true,
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data) {
                        if (data.error_code === 10212) {
                            $.ajax({
                                cache: false,
                                url: data.error_msg,
                                type: "get",
                                dataType: "jsonp",
                                jsonp: "cb",
                                success: function(msg) {
                                    if (msg.msg === "seed success") {
                                        phoneData.fn(msg);
                                        $$event.event.trigger("changyan:login");
                                        window.location.reload();
                                    }
                                }
                            });
                        } else {
                            var msg = {
                                msg: "seed fail"
                            };
                            phoneData.fn(msg);
                        }
                    },
                    error: function() {
                        var msg = {
                            msg: "seed fail"
                        };
                        phoneData.fn(msg);
                    }
                });
            },
            sso: function() {
                window.location.href = $$data.get("beConfig:mobile_isv_login_url") + "?from=" + encodeURIComponent($$data.get("feConfig:url"));
            },
            other: function(platform_id) {
                var params = {
                    clientId: $$data.get("feConfig:appid"),
                    platform_id: platform_id,
                    url: encodeURIComponent(encodeURIComponent(window.location.href))
                };
                window.location.href = "https://changyan.sohu.com/api/2/login/passport?client_id=" + params.clientId + "&platform_id=" + params.platform_id + "&url=" + params.url + "&isMobile=true&connName=changyan_wap";
            }
        };
        module.exports = mobileLogin;
    });
    define("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/util/ua.js", function(require, exports, module) {
        var win = typeof window !== "undefined" ? window : {}, undef, doc = win.document, ua = win.navigator && win.navigator.userAgent || "", _ = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/underscore-1.8.2.js");
        function numberify(s) {
            var c = 0;
            return parseFloat(s.replace(/\./g, function() {
                return c++ === 0 ? "." : "";
            }));
        }
        function setTridentVersion(ua, UA) {
            var core, m;
            UA[core = "trident"] = .1;
            if ((m = ua.match(/Trident\/([\d.]*)/)) && m[1]) {
                UA[core] = numberify(m[1]);
            }
            UA.core = core;
        }
        function getIEVersion(ua) {
            var m, v;
            if ((m = ua.match(/MSIE ([^;]*)|Trident.*; rv(?:\s|:)?([0-9.]+)/)) && (v = m[1] || m[2])) {
                return numberify(v);
            }
            return 0;
        }
        function getBrowers(ua, UA) {
            var browerArr = {
                UC: [ "UCBrowser" ],
                weixin: [ "MicroMessenger" ],
                qq: [ "MQQBrowser" ],
                QQ: [ "QQ" ],
                baidu: [ "baiduboxapp" ],
                360: [ "360 Aphone Browser", "QHBrowser" ],
                sogou: [ "SogouMobileBrowser" ],
                chrome: [ "CriOS" ]
            };
            var item;
            for (item in browerArr) {
                var thisItem = browerArr[item], i;
                for (i = 0; i < thisItem.length; i++) {
                    if (ua.match(thisItem[i])) {
                        UA.browser = item;
                        var reg = eval("/(" + thisItem[i] + "\\/([\\d.]*)|" + thisItem[i] + " \\(([\\d.]*)" + ")/");
                        UA.browserVersion = ua.match(reg)[1] || {};
                        var ind;
                        if (UA.browserVersion.indexOf("/") >= 0) {
                            ind = UA.browserVersion.indexOf("/");
                        } else if (UA.browserVersion.indexOf("(") >= 0) {
                            ind = UA.browserVersion.indexOf("(");
                        } else {
                            ind = -1;
                        }
                        UA.browserVersion = UA.browserVersion.substring(ind + 1, UA.browserVersion.length);
                        return;
                    }
                }
            }
            UA.browser = null;
            UA.browserVersion = null;
        }
        function getDescriptorFromUserAgent(ua) {
            var EMPTY = "", os, core = EMPTY, shell = EMPTY, m, IE_DETECT_RANGE = [ 6, 9 ], ieVersion, v, end, VERSION_PLACEHOLDER = "{{version}}", IE_DETECT_TPL = "<!--[if IE " + VERSION_PLACEHOLDER + "]><" + "s></s><![endif]-->", div = doc && doc.createElement("div"), s = [];
            var UA = {
                webkit: undef,
                trident: undef,
                gecko: undef,
                presto: undef,
                chrome: undef,
                safari: undef,
                firefox: undef,
                ie: undef,
                ieMode: undef,
                opera: undef,
                mobile: undef,
                core: undef,
                shell: undef,
                phantomjs: undef,
                os: undef,
                ipad: undef,
                iphone: undef,
                ipod: undef,
                ios: undef,
                android: undef,
                nodejs: undef,
                browser: undef,
                browserVersion: undef
            };
            if (div && div.getElementsByTagName) {
                div.innerHTML = IE_DETECT_TPL.replace(VERSION_PLACEHOLDER, "");
                s = div.getElementsByTagName("s");
            }
            if (s.length > 0) {
                setTridentVersion(ua, UA);
                for (v = IE_DETECT_RANGE[0], end = IE_DETECT_RANGE[1]; v <= end; v++) {
                    div.innerHTML = IE_DETECT_TPL.replace(VERSION_PLACEHOLDER, v);
                    if (s.length > 0) {
                        UA[shell = "ie"] = v;
                        break;
                    }
                }
                if (!UA.ie && (ieVersion = getIEVersion(ua))) {
                    UA[shell = "ie"] = ieVersion;
                }
            } else {
                if (((m = ua.match(/AppleWebKit\/([\d.]*)/)) || (m = ua.match(/Safari\/([\d.]*)/))) && m[1]) {
                    UA[core = "webkit"] = numberify(m[1]);
                    if ((m = ua.match(/OPR\/(\d+\.\d+)/)) && m[1]) {
                        UA[shell = "opera"] = numberify(m[1]);
                    } else if ((m = ua.match(/Chrome\/([\d.]*)/)) && m[1]) {
                        UA[shell = "chrome"] = numberify(m[1]);
                    } else if ((m = ua.match(/\/([\d.]*) Safari/)) && m[1]) {
                        UA[shell = "safari"] = numberify(m[1]);
                    } else {
                        UA.safari = UA.webkit;
                    }
                    if (/ Mobile\//.test(ua) && ua.match(/iPad|iPod|iPhone/)) {
                        UA.mobile = "apple";
                        m = ua.match(/OS ([^\s]*)/);
                        if (m && m[1]) {
                            UA.ios = numberify(m[1].replace("_", "."));
                        }
                        os = "ios";
                        m = ua.match(/iPad|iPod|iPhone/);
                        if (m && m[0]) {
                            UA[m[0].toLowerCase()] = UA.ios;
                        }
                    } else if (/ Android/i.test(ua)) {
                        if (/Mobile/.test(ua)) {
                            os = UA.mobile = "android";
                        }
                        m = ua.match(/Android ([^\s]*);/);
                        if (m && m[1]) {
                            UA.android = numberify(m[1]);
                        }
                    } else if (m = ua.match(/NokiaN[^\/]*|Android \d\.\d|webOS\/\d\.\d/)) {
                        UA.mobile = m[0].toLowerCase();
                    }
                    if ((m = ua.match(/PhantomJS\/([^\s]*)/)) && m[1]) {
                        UA.phantomjs = numberify(m[1]);
                    }
                } else {
                    if ((m = ua.match(/Presto\/([\d.]*)/)) && m[1]) {
                        UA[core = "presto"] = numberify(m[1]);
                        if ((m = ua.match(/Opera\/([\d.]*)/)) && m[1]) {
                            UA[shell = "opera"] = numberify(m[1]);
                            if ((m = ua.match(/Opera\/.* Version\/([\d.]*)/)) && m[1]) {
                                UA[shell] = numberify(m[1]);
                            }
                            if ((m = ua.match(/Opera Mini[^;]*/)) && m) {
                                UA.mobile = m[0].toLowerCase();
                            } else if ((m = ua.match(/Opera Mobi[^;]*/)) && m) {
                                UA.mobile = m[0];
                            }
                        }
                    } else {
                        if (ieVersion = getIEVersion(ua)) {
                            UA[shell = "ie"] = ieVersion;
                            setTridentVersion(ua, UA);
                        } else {
                            if (m = ua.match(/Gecko/)) {
                                UA[core = "gecko"] = .1;
                                if ((m = ua.match(/rv:([\d.]*)/)) && m[1]) {
                                    UA[core] = numberify(m[1]);
                                    if (/Mobile|Tablet/.test(ua)) {
                                        UA.mobile = "firefox";
                                    }
                                }
                                if ((m = ua.match(/Firefox\/([\d.]*)/)) && m[1]) {
                                    UA[shell = "firefox"] = numberify(m[1]);
                                }
                            }
                        }
                    }
                }
            }
            if (!os) {
                if (/windows|win32/i.test(ua)) {
                    os = "windows";
                } else if (/macintosh|mac_powerpc/i.test(ua)) {
                    os = "macintosh";
                } else if (/linux/i.test(ua)) {
                    os = "linux";
                } else if (/rhino/i.test(ua)) {
                    os = "rhino";
                }
            }
            UA.os = os;
            UA.core = UA.core || core;
            UA.shell = shell;
            UA.ieMode = UA.ie && doc.documentMode || UA.ie;
            getBrowers(ua, UA);
            if (!UA.browser) {
                var brArr = [ "chrome", "firefox", "safari", "ie", "opera" ], i;
                for (i = 0; i < brArr.length; i++) {
                    if (UA[brArr[i]]) {
                        UA.browser = brArr[i];
                        UA.browserVersion = UA[brArr[i]];
                        return UA;
                    }
                }
            }
            return UA;
        }
        var UA = getDescriptorFromUserAgent(ua);
        if (typeof process === "object") {
            var versions, nodeVersion;
            if ((versions = process.versions) && (nodeVersion = versions.node)) {
                UA.os = process.platform;
                UA.nodejs = numberify(nodeVersion);
            }
        }
        UA.getDescriptorFromUserAgent = getDescriptorFromUserAgent;
        module.exports = UA;
    });
    define("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/comment.js", function(require, exports, module) {
        
        var _ = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/underscore-1.8.2.js"), $$data = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/util/data-center.js"), $ = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/jquery-1.7.0.js"), $$util = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/util/util.js"), $$user = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/user.js"), $$events = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/events.js"), $$commentsCache = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/cache/comments-cache.js"), $$asyncLoadExtension = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/async-load-extension.js"), JSON = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/json2.js"), isloginListenReady = false;
        var showLoginDialog = function() {
            if (!isloginListenReady) {
                $$events.event.listen("changyan:login", function(e) {
                    var submitCache = $$data.get("topic:submitCache");
                    if (submitCache) {
                        commentApi[submitCache.type](submitCache.params, submitCache.fn);
                        $$data.set("topic:submitCache", undefined);
                    }
                });
            }
            $$asyncLoadExtension.openLoginDialog("false");
        };
        var CrossDomainSubmit = function(_params, params, fn) {
            window.iframeCrossDomain.get($$data.get("config:api") + "api/2/comment/submit", $$util.queryObject(_params), function(data) {
                var data = JSON.parse(data);
                dataFormat = JSON.parse(data.xhr.responseText);
                $$commentsCache.submitCommentCache(dataFormat, _params, params, fn);
                fn(dataFormat);
            });
        };
        var commentApi = {
            getHotCommentList: function() {
                return $$data.get("topic:hots");
            },
            getCommentList: function(pageNo, fn) {
                if (!_.isNumber(pageNo) || !_.isFunction(fn)) {
                    throw "API-->getCommentList arguments error";
                }
                $$commentsCache.getCommentListCache(pageNo, fn);
            },
            submitComment: function(params, fn, noSubmitCache) {
                if (!_.isObject(params) || !_.isFunction(fn)) {
                    throw "API-->submitComment arguments error";
                }
                var topic_id = $$data.get("topic:topic_id"), ms_version = $.browser.version, _params = {
                    client_id: $$data.get("feConfig:appid"),
                    topic_id: topic_id,
                    topic_title: $$data.get("feConfig:title"),
                    topic_url: $$data.get("feConfig:url")
                };
                var submit = function() {
                    _params = _.extend(_params, params);
                    if (!params.client_id) {
                        $$events.event.trigger("changyan:submit-before", _params);
                    }
                    if (ms_version === "7.0" || ms_version === "8.0" || ms_version === "9.0") {
                        if (window.iframeCrossDomain) {
                            CrossDomainSubmit(_params, params, fn);
                        } else {
                            $$util.loadJs($$data.get("config:base") + "mdevp/extensions/cross-domain/002/cross-domain.js", function() {
                                CrossDomainSubmit(_params, params, fn);
                            });
                        }
                    } else {
                        $.ajax({
                            url: $$data.get("config:api") + "api/2/comment/submit",
                            dataType: "json",
                            type: "post",
                            data: _params,
                            crossDomain: true,
                            xhrFields: {
                                withCredentials: true
                            },
                            success: function(data) {
                                $$user.getUserInfo(function(info) {
                                    if ($$data.get("beConfig:forum_redirect_open") === "1") {
                                        $.ajax({
                                            url: $$data.get("config:protocol") + "changyan.sohu.com/api/3/user/redirectKuaizhan",
                                            data: {
                                                client_id: _params.client_id,
                                                topic_id: topic_id,
                                                type: "submit",
                                                platform_id: info.platform_id,
                                                plat: $$data.get("feConfig:ismobile") ? "wap" : "pc"
                                            },
                                            dataType: "jsonp",
                                            success: function(data) {
                                                if (data.url) {
                                                    $$events.event.trigger("changyan:cmt-header:jump-kz", data.url);
                                                }
                                            },
                                            error: function() {}
                                        });
                                    }
                                });
                                if (!noSubmitCache && ($$data.get("topic:topic_category_id") !== "45231123" || $$data.get("feConfig:appid") !== "cyqemw6s1")) {
                                    $$commentsCache.submitCommentCache(data, _params, params, fn);
                                }
                                fn(data);
                            },
                            error: function() {
                                fn(0);
                            }
                        });
                    }
                };
                $$user.getUserInfo(function(data) {
                    if (data.error_code) {
                        $$data.set("topic:submitCache", {
                            type: "submitComment",
                            _params: _params,
                            params: params,
                            fn: fn
                        });
                        showLoginDialog();
                    } else {
                        submit();
                    }
                });
            },
            supportComment: function(params, fn) {
                if (!_.isObject(params) || !_.isFunction(fn)) {
                    throw "API-->supportComment arguments error";
                }
                var _params = {
                    client_id: $$data.get("feConfig:appid"),
                    topic_id: $$data.get("topic:topic_id"),
                    action_type: 1
                };
                var support = function() {
                    params = _.extend(_params, params);
                    $.ajax({
                        url: $$data.get("config:api") + "api/2/comment/action",
                        dataType: "jsonp",
                        jsonp: "callback",
                        cache: false,
                        data: params,
                        timeout: 1e3,
                        success: function(data) {
                            $$commentsCache.supportCache(params);
                            fn(data);
                        },
                        error: function() {
                            fn(0);
                        }
                    });
                };
                if ($$data.get("feConfig:appid") === "cyqvqDTV5") {
                    support();
                } else {
                    $$user.getUserInfo(function(data) {
                        if (data.error_code) {
                            $$data.set("topic:submitCache", {
                                type: "supportComment",
                                _params: _params,
                                params: params,
                                fn: fn
                            });
                            showLoginDialog();
                        } else {
                            support();
                        }
                    });
                }
            },
            unsupportComment: function(params, fn) {
                if (!_.isObject(params) || !_.isFunction(fn)) {
                    throw "API-->unsuportComment arguments error";
                }
                var _params = {
                    client_id: $$data.get("feConfig:appid"),
                    topic_id: $$data.get("topic:topic_id"),
                    action_type: 2
                };
                var unSuport = function() {
                    params = _.extend(_params, params);
                    $.ajax({
                        url: $$data.get("config:api") + "api/2/comment/action",
                        dataType: "jsonp",
                        jsonp: "callback",
                        cache: false,
                        data: params,
                        timeout: 1e3,
                        success: function(data) {
                            $$commentsCache.supportCache(params);
                            fn(data);
                        },
                        error: function() {
                            fn(0);
                        }
                    });
                };
                $$user.getUserInfo(function(data) {
                    if (data.error_code) {
                        $$data.set("topic:submitCache", {
                            type: "unsupportComment",
                            _params: _params,
                            params: params,
                            fn: fn
                        });
                        showLoginDialog();
                    } else {
                        unSuport();
                    }
                });
            }
        };
        module.exports = commentApi;
    });
    define("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/cache/comments-cache.js", function(require, exports, module) {
        var _ = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/underscore-1.8.2.js"), $$data = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/util/data-center.js"), $ = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/jquery-1.7.0.js"), $$event = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/events.js");
        $$util = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/util/util.js");
        var getCommentListCache = function(pageNo, fn) {
            var page_size;
            if ($$data.get("feConfig:ismobile") === true) {
                page_size = $$data.get("feConfig:mobile_latest_page_num") || $$data.get("beConfig:mobile_latest_page_num");
            } else {
                page_size = $$data.get("feConfig:latest_page_num") || $$data.get("beConfig:latest_page_num");
            }
            var topic_id = $$data.get("topic:topic_id"), comments = $$data.get("topic:comments"), cacheComments = $$data.get("topic:cacheComments"), cacheHots = $$data.get("topic:cacheHots"), rangeStart = (pageNo - 1) * page_size, rangeEnd = pageNo * page_size, range = _.range(rangeStart, rangeEnd);
            var requestComments = function(fn) {
                if (topic_id !== undefined) {
                    $.ajax({
                        url: $$data.get("config:api") + "api/2/topic/comments",
                        dataType: "jsonp",
                        jsonp: "callback",
                        scriptCharset: "utf-8",
                        cache: false,
                        timeout: 1e3,
                        data: {
                            client_id: $$data.get("feConfig:appid"),
                            page_size: page_size,
                            topic_id: topic_id,
                            page_no: pageNo || 1
                        },
                        success: function(data) {
                            data = $$util.UrlSwitchHttps(data);
                            fn(data);
                        },
                        error: function() {
                            fn(0);
                        }
                    });
                }
            };
            if (!cacheComments) {
                cacheComments = {};
            }
            if (!cacheComments[topic_id]) {
                cacheComments[topic_id] = {};
                _.each(comments, function(item, index) {
                    cacheComments[topic_id][index] = item;
                });
                $$data.set("topic:cacheComments", cacheComments);
            }
            range = _.map(range, function(num) {
                return num.toString();
            });
            if (!_.difference(range, _.keys(cacheComments[topic_id])).length) {
                comments = [];
                _.each(range, function(item, index) {
                    comments.push(cacheComments[topic_id][item]);
                });
                _.each(comments, function(item, index) {
                    item.content = fnEncode(item.content);
                });
                fn({
                    comments: comments
                });
            } else {
                requestComments(function(data) {
                    if (data.comments) {
                        _.each(range, function(item, index) {
                            if (data.comments[index]) {
                                cacheComments[topic_id][item] = data.comments[index];
                            }
                        });
                        $$data.set("topic:cacheComments", cacheComments);
                        _.each(data.comments, function(item, index) {
                            item.content = fnEncode(item.content);
                        });
                        fn({
                            comments: data.comments
                        });
                    } else {
                        fn(data);
                    }
                });
            }
        };
        var submitCommentCache = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/cache/submit-cache.js");
        var supportCache = function(params) {
            var topic_id = params.topic_id, support_id = params.comment_id, cacheComments = $$data.get("topic:cacheComments"), comments = _.values(cacheComments[topic_id]), hots = $$data.get("topic:hots"), comment = _.find(comments, function(item) {
                return item.comment_id == support_id;
            }), hot = _.find(hots, function(item) {
                return item.comment_id == support_id;
            }), support_comment = comment ? comment : hot, index, participation_sum = $$data.get("topic:participation_sum");
            if (!support_comment) {
                return;
            }
            $$data.set("topic:participation_sum", ++participation_sum);
            if (params.action_type === 2) {
                support_comment.oppose_count++;
            } else {
                support_comment.support_count++;
            }
            if (comment) {
                index = _.findKey(comments, function(item) {
                    return item.comment_id == support_id;
                });
                cacheComments[topic_id][index] = support_comment;
                $$data.set("topic:cacheComments", cacheComments);
            }
            if (hot) {
                index = _.findIndex(hots, function(item) {
                    return item.comment_id == support_id;
                });
                hots[index] = support_comment;
                $$data.set("topic:hots", hots);
            }
        };
        var fnEncode = function(s) {
            return s.replace(/<|%3C/gi, "&lt;").replace(/>|%3E/gi, "&gt;").replace(/"|%22/g, "&quot;").replace(/&lt;br&gt;/g, "<br>").replace(/&amp;/g, "&").replace(/&quot;/g, "");
        };
        module.exports = {
            getCommentListCache: getCommentListCache,
            submitCommentCache: submitCommentCache,
            supportCache: supportCache
        };
    });
    define("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/cache/submit-cache.js", function(require, exports, module) {
        var _ = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/underscore-1.8.2.js"), $$data = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/util/data-center.js"), $ = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/jquery-1.7.0.js"), $$event = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/events.js");
        var submitCommentCache = function(data, _params, params, fn) {
            var user = $$data.get("userInfo:changyan");
            var item = {
                attachments: _params.attachment_urls ? [ {
                    type: 1,
                    url: _params.attachment_urls
                } ] : [],
                comment_id: data.id,
                comments: [],
                content: _params.content,
                create_time: +(new Date),
                elite: false,
                floor_count: 0,
                from: "",
                hide: false,
                hide_floor: false,
                highlight: false,
                ip: "123.126.70.242",
                ip_location: "",
                metadata: '{"clientPort":"61296"}',
                metadataAsJson: {
                    clientPort: "61296"
                },
                oppose_count: 0,
                passport: {
                    expired: false,
                    fee: 0,
                    followers_count: 0,
                    from: "",
                    grant: false,
                    img_url: user.img_url,
                    is_official: false,
                    is_shared: false,
                    isv_refer_id: "561f798bfe994f1ad405e6d5",
                    nickname: user.nickname,
                    platform_id: 3,
                    profile_url: "",
                    user_id: user.user_id
                },
                quick: false,
                reply_count: 0,
                reply_id: 0,
                score: 0,
                status: 0,
                support_count: 0,
                top: false,
                userScore: {
                    isvId: 0,
                    level: 4,
                    levelUp: 0,
                    privilege: {
                        bold: "true"
                    },
                    score: 414,
                    title: "活跃",
                    userId: 0
                },
                user_id: 182002183
            };
            var topic_id = $$data.get("topic:topic_id"), cacheComments = $$data.get("topic:cacheComments"), reply_id = _params.reply_id;
            if (reply_id != "0" && !_.isUndefined(reply_id)) {
                var hots = $$data.get("topic:hots"), comments = _.values(cacheComments[topic_id]);
                comment = _.find(comments, function(item) {
                    return item.comment_id == reply_id;
                }), hot = _.find(hots, function(item) {
                    return item.comment_id == reply_id;
                }), reply_comment = comment ? comment : hot;
                if (!reply_comment) {
                    return;
                }
                var temp = {};
                floorComments = reply_comment.comments;
                reply_comment.comments = [];
                floorComments.unshift(reply_comment);
                item.comments = floorComments;
                item.floor_count = floorComments.length;
            }
            if (data.recom_img && data.recom_img.length) {
                item.attachments = data.recom_img;
            }
            var temp = {};
            _.each(_.keys(cacheComments[topic_id]), function(item, index) {
                temp[(parseInt(item) + 1).toString()] = cacheComments[topic_id][item];
            });
            cacheComments[topic_id] = temp;
            cacheComments[topic_id]["0"] = item;
            $$data.set("topic:cacheComments", cacheComments);
            $$data.set("topic:participation_sum", $$data.get("topic:participation_sum") + 1);
            $$data.set("topic:cmt_sum", $$data.get("topic:cmt_sum") + 1);
            var page_size = $$data.get("feConfig:latest_page_num") || $$data.get("beConfig:latest_page_num");
            $$data.set("topic:total_page_no", Math.ceil($$data.get("topic:cmt_sum") / page_size));
            if (!params.client_id) {
                $$event.event.trigger("changyan:submit", item, _params);
            }
        };
        module.exports = submitCommentCache;
    });
    define("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/json2.js", function(require, exports, module) {
        var JSON;
        if (!JSON) {
            JSON = {};
        }
        (function() {
            
            function f(n) {
                return n < 10 ? "0" + n : n;
            }
            if (typeof Date.prototype.toJSON !== "function") {
                Date.prototype.toJSON = function(key) {
                    return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null;
                };
                String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function(key) {
                    return this.valueOf();
                };
            }
            var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = {
                "\b": "\\b",
                "\t": "\\t",
                "\n": "\\n",
                "\f": "\\f",
                "\r": "\\r",
                '"': '\\"',
                "\\": "\\\\"
            }, rep;
            function quote(string) {
                escapable.lastIndex = 0;
                return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
                    var c = meta[a];
                    return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
                }) + '"' : '"' + string + '"';
            }
            function str(key, holder) {
                var i, k, v, length, mind = gap, partial, value = holder[key];
                if (value && typeof value === "object" && typeof value.toJSON === "function") {
                    value = value.toJSON(key);
                }
                if (typeof rep === "function") {
                    value = rep.call(holder, key, value);
                }
                switch (typeof value) {
                  case "string":
                    return quote(value);
                  case "number":
                    return isFinite(value) ? String(value) : "null";
                  case "boolean":
                  case "null":
                    return String(value);
                  case "object":
                    if (!value) {
                        return "null";
                    }
                    gap += indent;
                    partial = [];
                    if (Object.prototype.toString.apply(value) === "[object Array]") {
                        length = value.length;
                        for (i = 0; i < length; i += 1) {
                            partial[i] = str(i, value) || "null";
                        }
                        v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
                        gap = mind;
                        return v;
                    }
                    if (rep && typeof rep === "object") {
                        length = rep.length;
                        for (i = 0; i < length; i += 1) {
                            if (typeof rep[i] === "string") {
                                k = rep[i];
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (gap ? ": " : ":") + v);
                                }
                            }
                        }
                    } else {
                        for (k in value) {
                            if (Object.prototype.hasOwnProperty.call(value, k)) {
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (gap ? ": " : ":") + v);
                                }
                            }
                        }
                    }
                    v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
                    gap = mind;
                    return v;
                }
            }
            if (typeof JSON.stringify !== "function") {
                JSON.stringify = function(value, replacer, space) {
                    var i;
                    gap = "";
                    indent = "";
                    if (typeof space === "number") {
                        for (i = 0; i < space; i += 1) {
                            indent += " ";
                        }
                    } else if (typeof space === "string") {
                        indent = space;
                    }
                    rep = replacer;
                    if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
                        throw new Error("JSON.stringify");
                    }
                    return str("", {
                        "": value
                    });
                };
            }
            if (typeof JSON.parse !== "function") {
                JSON.parse = function(text, reviver) {
                    var j;
                    function walk(holder, key) {
                        var k, v, value = holder[key];
                        if (value && typeof value === "object") {
                            for (k in value) {
                                if (Object.prototype.hasOwnProperty.call(value, k)) {
                                    v = walk(value, k);
                                    if (v !== undefined) {
                                        value[k] = v;
                                    } else {
                                        delete value[k];
                                    }
                                }
                            }
                        }
                        return reviver.call(holder, key, value);
                    }
                    text = String(text);
                    cx.lastIndex = 0;
                    if (cx.test(text)) {
                        text = text.replace(cx, function(a) {
                            return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
                        });
                    }
                    if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
                        j = eval("(" + text + ")");
                        return typeof reviver === "function" ? walk({
                            "": j
                        }, "") : j;
                    }
                    throw new SyntaxError("JSON.parse");
                };
            }
        })();
        module.exports = JSON;
    });
    define("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/log.js", function(require, exports, module) {
        var _ = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/underscore-1.8.2.js"), $ = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/jquery-1.7.0.js"), $$data = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/util/data-center.js"), $$util = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/util/util.js");
        var lurl = $$data.get("config:api") + "stat/event?clientid=" + $$data.get("feConfig:appid");
        var api = {
            log: function(typeValue) {
                if (typeof typeValue !== "string" || typeValue === "") {
                    return;
                }
                var url = lurl;
                url += "&uuid=" + $$data.get("cookie:debug_uuid") || "NULL";
                url += "&topicId=" + $$data.get("topic:topic_id") || "0";
                url += "&type=LOG-V3-" + $$util.upper(typeValue);
                var img = new Image, rnd_id = "_img_" + Math.random();
                window[rnd_id] = img;
                img.onload = img.onerror = function() {
                    window[rnd_id] = null;
                };
                img.src = url;
            }
        };
        return api;
    });
    define("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/hack-wap.js", function(require, exports, module) {
        var _ = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/underscore-1.8.2.js");
        var $ = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/jquery-1.7.0.js");
        var $$data = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/util/data-center.js");
        var $$event = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/events.js").event;
        var $$util = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/util/util.js");
        (function() {
            var _sso = $$data.get("feConfig:sso") || {}, _mobile = $$data.get("feConfig:mobile") || {}, feConfig;
            $$data.get("beConfig:sso") === "true" ? "true" : _sso && _sso.isvLogin && _sso.isvLogout && _sso.isvUserInfo && _mobile.isvLoginUrl ? $$data.set("beConfig:sso", "true") : $$data.set("beConfig:sso", "false");
            if ($$data.get("feConfig:sso") && $$data.get("feConfig:sso:isvLogin")) {
                $$data.set("beConfig:sso_isv_login", $$data.get("feConfig:sso:isvLogin"));
            }
            if ($$data.get("feConfig:sso") && $$data.get("feConfig:sso:isvLogout")) {
                $$data.set("beConfig:sso_isv_logout", $$data.get("feConfig:sso:isvLogout"));
            }
            if ($$data.get("feConfig:sso") && $$data.get("feConfig:sso:isvUserInfo")) {
                $$data.set("beConfig:sso_isv_userInfo", $$data.get("feConfig:sso:isvUserInfo"));
            }
            if ($$data.get("feConfig:sso") && $$data.get("feConfig:sso:ssoType")) {
                $$data.set("beConfig:sso_type", $$data.get("feConfig:sso:ssoType"));
            }
            if ($$data.get("feConfig:sso") && $$data.get("feConfig:sso:onlySSO")) {
                $$data.set("beConfig:only_sso", $$data.get("feConfig:sso:onlySSO"));
            }
            if ($$data.get("beConfig:sso") === "true") {
                $$data.set("beConfig:mobile_isv_login_icon", $$data.get("feConfig:mobile:isvLoginIcon") || $$data.get("beConfig:mobile_isv_login_icon") || undefined);
            }
            if ($$data.get("beConfig:sso") === "true") {
                $$data.set("beConfig:mobile_isv_login_url", $$data.get("feConfig:mobile:isvLoginUrl") || $$data.get("beConfig:mobile_isv_login_url") || undefined);
            }
            $$data.set("beConfig:mobile_hot_page_num", $$data.get("feConfig:hot_size_force") || $$data.get("feConfig:hot_size") || $$data.get("beConfig:mobile_hot_page_num"));
            $$data.set("beConfig:mobile_latest_page_num", $$data.get("feConfig:page_size") || $$data.get("beConfig:mobile_latest_page_num"));
            feConfig = $$data.get("feConfig");
            delete feConfig.sso;
            delete feConfig.mobile;
            delete feConfig.hot_size_force;
            delete feConfig.hot_size;
            delete feConfig.page_size;
            delete feConfig.hot_size_force;
            $$data.set("feConfig", feConfig);
        })();
        (function() {
            if (_.isFunction($$data.get("feConfig:login_callback"))) {
                $$event.listen("changyan:login", function() {
                    $$data.get("feConfig:login_callback")();
                });
                $$event.listen("changyan:logout", function() {
                    $$data.get("feConfig:logout_callback")();
                });
            }
            window.cyan.api.ready(function(api) {
                api.barrageRefresh = function() {
                    $$event.trigger("changyan:mobile-cmt-barrage:refresh");
                };
                api.barrageSwitch = function(switchStr) {
                    if (switchStr === "open") {
                        $$event.trigger("changyan:mobile-cmt-barrage:open");
                    } else if (switchStr === "close") {
                        $$event.trigger("changyan:mobile-cmt-barrage:close");
                    }
                };
                api.run = function(obj) {
                    if (_.isObject(obj) && _.isString(obj.sid)) {
                        $$data.set("feConfig:sid", obj.sid);
                        var page_size = $$data.get("feConfig:latest_page_num") || $$data.get("beConfig:latest_page_num");
                        var hot_size = $$data.get("feConfig:mobile_hot_page_num") || $$data.get("beConfig:mobile_hot_page_num");
                        var data = {
                            client_id: $$data.get("feConfig:appid"),
                            topic_url: $$data.get("feConfig:url"),
                            topic_title: $$data.get("feConfig:title"),
                            topic_category_id: $$data.get("feConfig:category_id"),
                            page_size: page_size,
                            hot_size: hot_size
                        };
                        if ($$data.get("feConfig:sid")) {
                            data.topic_source_id = $$data.get("feConfig:sid");
                        }
                        $.ajax({
                            url: $$data.get("config:api") + "api/3/topic/liteload",
                            dataType: "jsonp",
                            scriptCharset: "utf-8",
                            cache: false,
                            timeout: 3e4,
                            data: data,
                            success: function(data) {
                                data = $$util.UrlSwitchHttps(data);
                                $$data.set("topic", data);
                                $$event.trigger("changyan:cy-refresh");
                                $$event.trigger("changyan:mobile-cmt-barrage:refresh");
                                $$event.trigger("changyan:on-topic-lod");
                            }
                        });
                    }
                };
            });
        })();
    });
    define("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/hack.js", function(require, exports, module) {
        var _ = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/underscore-1.8.2.js");
        var $ = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/jquery-1.7.0.js");
        var $$event = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/events.js").event;
        var $$data = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/util/data-center.js");
        if ($$data.get("beConfig:v3_hack") !== "true") {
            return;
        }
        (function() {
            window.SOHUCS = window.SOHUCS || {};
            window.SOHUCS.reset = function() {
                $$data.set("userInfo:changyan", undefined);
                var $$user = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/user.js");
                $$user.getUserInfo(function(data) {
                    if (!data.error_code) {
                        $$event.trigger("changyan:login");
                    } else {
                        $$event.trigger("changyan:logout");
                    }
                });
            };
            var runReadyFn = function() {
                if (window.changyan.tmpHandles && window.changyan.tmpHandles.length) {
                    for (var i = 0; i < window.changyan.tmpHandles.length; i++) {
                        var _fn = window.changyan.tmpHandles[i];
                        _fn && _fn();
                    }
                    window.changyan.tmpHandles = [];
                }
            };
            window.changyan.rendered = false;
            $$event.listen("changyan:cmt-header:header-rendered", function() {
                if (!window.changyan.rendered) {
                    runReadyFn();
                    window.changyan.rendered = true;
                }
            });
            $$event.listen("changyan:mobile-cmt-list:list-render", function() {
                if (!window.changyan.rendered) {
                    runReadyFn();
                    window.changyan.rendered = true;
                }
            });
            $$event.listen("changyan:cmt-box:box-render", function() {
                if (!window.changyan.rendered) {
                    runReadyFn();
                    window.changyan.rendered = true;
                }
            });
        })();
        (function() {
            window.changyan = window.changyan || {};
            window.changyan.api = window.changyan.api || {};
            window.changyan.api.quit = function() {
                var $$user = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/user.js");
                $$user.logout();
            };
        })();
        (function() {
            if (!window._config) {
                return;
            }
            if (window._config.hasOwnProperty("sUrl") && $$data.get("feConfig:url") === undefined) {
                $$data.set("feConfig:url", window._config.sUrl);
            }
            if (window._config.hasOwnProperty("categoryId") && $$data.get("feConfig:category_id") === undefined) {
                $$data.set("feConfig:category_id", window._config.categoryId);
            }
            if (window._config.hasOwnProperty("showScore") && $$data.get("feConfig:show_score") === undefined) {
                $$data.set("feConfig:show_score", window._config.showScore.toString());
            }
            if (window._config.hasOwnProperty("simpleCbox") && $$data.get("feConfig:simple_cbox") === undefined) {
                $$data.set("feConfig:simple_cbox", window._config.simpleCbox.toString());
            }
            if (window._config.hasOwnProperty("displayFloatBar") && $$data.get("feConfig:footer_fix_cbox") === undefined) {
                $$data.set("feConfig:footer_fix_cbox", window._config.displayFloatBar.toString());
            }
            if (window._config.hasOwnProperty("pageSize") && $$data.get("feConfig:latest_page_num") === undefined) {
                $$data.set("feConfig:latest_page_num", window._config.pageSize.toString());
            }
            if (window._config.hasOwnProperty("hotSize") && $$data.get("feConfig:hot_page_num") === undefined) {
                $$data.set("feConfig:hot_page_num", window._config.hotSize.toString());
            }
            if (window._config.hasOwnProperty("jumpUrl") && $$data.get("feConfig:jump_url") === undefined) {
                $$data.set("feConfig:jump_url", window._config.jumpUrl.toString());
            }
            if (window._config.hasOwnProperty("sohuUIType") && $$data.get("feconfig:sohu_ui_type") === undefined) {
                $$data.set("feConfig:sohu_ui_type", window._config.sohuUIType);
            }
            if (window._config.hasOwnProperty("skin") && $$data.get("feConfig:custom_css_type") === undefined) {
                (function() {
                    var skin = window._config.skin;
                    var val = "11";
                    if (skin === "red") {
                        val = "12";
                    }
                    if (skin === "orange") {
                        val = "13";
                    }
                    if (skin === "black") {
                        val = "14";
                    }
                    if (skin === "green") {
                        val = "15";
                    }
                    if (skin === "grey") {
                        val = "16";
                    }
                    if (skin === "blackblue") {
                        val = "21";
                    }
                    if (skin === "Blackred") {
                        val = "22";
                    }
                    if (skin === "Blackwhite") {
                        val = "23";
                    }
                    if (skin === "gold") {
                        val = "31";
                    }
                    if (skin === "fashion") {
                        val = "31";
                    }
                    if (skin === "business") {
                        val = "32";
                    }
                    if (skin === "it") {
                        val = "33";
                    }
                    if (skin === "cul") {
                        val = "34";
                    }
                    if (skin === "history") {
                        val = "35";
                    }
                    if (skin === "learning") {
                        val = "36";
                    }
                    if (skin === "auto") {
                        val = "37";
                    }
                    if (skin === "astro") {
                        val = "38";
                    }
                    if (skin === "news") {
                        val = "39";
                    }
                    if (skin === "sports") {
                        val = "40";
                    }
                    if (skin === "pets") {
                        val = "41";
                    }
                    if (skin === "yule") {
                        val = "42";
                    }
                    if (skin === "dm") {
                        val = "43";
                    }
                    if (skin === "joke") {
                        val = "44";
                    }
                    if (skin === "17173") {
                        val = "91";
                    }
                    $$data.set("feConfig:custom_css_type", val);
                })();
            }
        })();
    });
    define("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/extensions.js", function(require, exports, module) {
        var $ = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/jquery-1.7.0.js");
        var _ = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/lib/underscore-1.8.2.js");
        var $$data = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/util/data-center.js");
        var $$util = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/util/util.js");
        var fnGetExtensionList = function(extensions, base) {
            extensions = extensions || "";
            extensions = extensions.split(",");
            var extensionsList = [];
            _.each(extensions, function(item) {
                item = $.trim(item);
                if (item && item !== "") {
                    if (!item.match(/^http/)) {
                        item = base + item;
                    }
                    extensionsList.push(item);
                }
            });
            return extensionsList;
        };
        var fnMergeExtensionList = function(extensionsList) {
            var protocol = "";
            if (window.location.protocol === "https:") {
                protocol = window.location.protocol;
            } else {
                protocol = "http:";
            }
            var extension = protocol + "//changyan.itc.cn/mdevp/extensions/??";
            var list = [];
            var str = "";
            _.each(extensionsList, function(item) {
                if (item.indexOf("http") === -1) {
                    str += item + ",";
                } else {
                    if (str !== "") {
                        str = extension + str.slice(0, -1);
                        list.push(str);
                        str = "";
                    }
                    list.push(item);
                }
            });
            if (str) {
                str = extension + str.slice(0, -1);
                list.push(str);
            }
            return list;
        };
        var fnLoadExtensions = function(extensionsList, debug) {
            var request = function() {
                if (!extensionsList.length) {
                    require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/events.js").ready();
                    return;
                }
                if (debug === true) {
                    seajs.use(extensionsList.shift(), function() {
                        if (extensionsList.length) {
                            request();
                        } else {
                            require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/events.js").ready();
                        }
                    });
                } else {
                    $$util.loadJs(extensionsList.shift(), function() {
                        if (extensionsList.length) {
                            request();
                        } else {
                            require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/api/events.js").ready();
                        }
                    });
                }
            };
            request();
        };
        var fnInit = function() {
            var $$data = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/util/data-center.js");
            var feConfig = $$data.get("feConfig");
            var beConfig = $$data.get("beConfig");
            var cookie = $$data.get("cookie");
            var extensionsMap = require("/opt/jenkins/workspace/changyan-fe-frontend-v3/version/extensions.json.js");
            var getIEVersion = function() {
                var v = null;
                if (window.navigator.appName === "Microsoft Internet Explorer") {
                    var reg = /MSIE ([0-9]{1,}[\.0-9]{0,})/;
                    v = reg.exec(window.navigator.userAgent) && parseFloat(RegExp.$1);
                }
                return v;
            };
            var IEVersion = getIEVersion();
            if (IEVersion > 0 && IEVersion <= 8 && (beConfig.extensions_key === "prop-v3.2" || beConfig.extensions_key === "v3.2")) {
                beConfig.extensions_key = "board";
            }
            if ($$data.get("topic:topic_category_id") !== undefined && feConfig.appid === "cyqemw6s1") {
                if (feConfig.sohu_ui_type == 1) {
                    beConfig.extensions_key = "sohu";
                } else if ($$data.get("topic:topic_category_id") === "45231123") {
                    if ($$data.get("feConfig:ismobile") === true) {
                        beConfig.mobile_extensions_key = "wap-simplest";
                    } else {
                        beConfig.extensions_key = "simplest";
                    }
                } else {
                    var category_id = $$data.get("topic:topic_category_id");
                    var chanelGroup = [ "373993807", "349370213", "324766639", "143746642", "258991918", "257528084", "257528053", "200466343", "200057137", "123", "390221349", "9090911195", "201066330", "224586132", "322576792", "244608874", "219445970" ];
                    var mainCategory = "373993807";
                    if (_.indexOf(category_id, "|") >= 0) {
                        mainCategory = category_id.split("|")[0];
                    } else if (_.indexOf(category_id, ";") >= 0) {
                        mainCategory = category_id.split(";")[0];
                    } else if (category_id && category_id !== "") {
                        mainCategory = category_id;
                    }
                    if (_.indexOf(chanelGroup, mainCategory) < 0) {
                        beConfig.extensions_key = "prop-v3.2";
                        if (feConfig.ismobile) {
                            beConfig.extensions_key = "wap-prop";
                        }
                        (function() {
                            var lurl = $$data.get("config:api") + "stat/event?clientid=" + $$data.get("feConfig:appid");
                            var api = {
                                log: function(typeValue) {
                                    if (typeof typeValue !== "string" || typeValue === "") {
                                        return;
                                    }
                                    var url = lurl;
                                    url += "&uuid=" + $$data.get("cookie:debug_uuid") || "NULL";
                                    url += "&topicId=" + $$data.get("topic:topic_id") || "0";
                                    url += "&type=LOG-V3-" + $$util.upper(typeValue);
                                    var img = window.document.createElement("img");
                                    img.setAttribute("src", url);
                                }
                            };
                            api.log("sohu-prop-chanel");
                        })();
                    }
                }
            }
            var extensions = extensionsMap[beConfig.extensions_key] || extensionsMap["v3"];
            if (feConfig.ismobile) {
                if (beConfig.mobile_extensions_key === "wap_prop") {
                    beConfig.mobile_extensions_key = "wap-prop";
                }
                if (beConfig.mobile_extensions_key === "wap_simplest") {
                    beConfig.mobile_extensions_key = "wap-simplest";
                }
                if (beConfig.mobile_extensions_key === "test") {
                    beConfig.mobile_extensions_key = "test";
                }
                extensions = extensionsMap[beConfig.mobile_extensions_key] || extensionsMap["wap-prop"];
            }
            if (feConfig.extensions) {
                extensions = feConfig.extensions;
            }
            var isCookie = false;
            if (typeof cookie.debug_extension === "string" && typeof cookie.debug_extensions === "string") {
                isCookie = true;
                if (cookie.debug_extension === "overflow") {
                    extensions = cookie.debug_extensions;
                }
                if (cookie.debug_extension === "replace") {
                    (function() {
                        var oriArr = extensions.split(",");
                        var newArr = cookie.debug_extensions.split(",");
                        var arr = [];
                        _.each(newArr, function(item) {
                            var i = item.lastIndexOf("/");
                            var moduleName = item.substr(i + 1);
                            var has = false;
                            _.each(oriArr, function(item1, j) {
                                var i1 = item1.lastIndexOf("/");
                                var moduleName1 = item1.substr(i1 + 1);
                                if (moduleName === moduleName1) {
                                    oriArr[j] = item;
                                    has = true;
                                }
                            });
                            if (!has) {
                                oriArr.push(item);
                            }
                        });
                        extensions = oriArr.join(",");
                    })();
                }
            }
            var config = $$data.get("config");
            var extensionsList = fnGetExtensionList(extensions, config.base + "mdevp/extensions/");
            if (cookie.debug_extension === "close") {
                extensionsList = fnMergeExtensionList(extensions.split(","));
            }
            if (isCookie) {
                $.getScript(config.res + "lib/sea.v1.2.0.js", function() {
                    fnLoadExtensions(extensionsList, true);
                });
            } else {
                fnLoadExtensions(extensionsList, false);
            }
        };
        fnInit();
    });
    define("/opt/jenkins/workspace/changyan-fe-frontend-v3/version/extensions.json.js", function(require, exports, module) {
        module.exports = {
            v3: "cy-skin/003/cy-skin.js,cmt-header/033/cmt-header.js,cmt-box/022/cmt-box.js,cmt-list/025/cmt-list.js,cmt-footer/023/cmt-footer.js,hot-topic/015/hot-topic.js,face/007/face.js,cmt-float-bar/018/cmt-float-bar.js,cy-user-page/018/cy-user-page.js,cy-user-info/025/cy-user-info.js,cy-user-avatar/010/cy-user-avatar.js,cy-user-view/014/cy-user-view.js,cy-user-footprint/004/cy-user-footprint.js,cy-report/009/cy-report.js,cy-user-notice/024/cy-user-notice.js,cy-user-feedback/033/cy-user-feedback.js,cmt-notice-no-task-msg/005/cmt-notice-no-task-msg.js,cy-grade/005/cy-grade.js,cy-score/003/cy-score.js,jump-url/005/jump-url.js,disable-user-photo/005/disable-user-photo.js,sohu-treaty/003/sohu-treaty.js,cy-auto-recommand/003/cy-auto-recommand.js,phone-verify/002/phone-verify.js",
            prop: "cy-skin/003/cy-skin.js,cmt-header/033/cmt-header.js,cmt-box/022/cmt-box.js,cmt-list/025/cmt-list.js,cmt-footer/023/cmt-footer.js,hot-topic/015/hot-topic.js,face/007/face.js,cmt-float-bar/018/cmt-float-bar.js,cy-user-page/018/cy-user-page.js,cy-user-info/025/cy-user-info.js,cy-user-avatar/010/cy-user-avatar.js,cy-user-view/014/cy-user-view.js,cy-user-task/016/cy-user-task.js,cy-user-footprint/004/cy-user-footprint.js,cy-user-mall/006/cy-user-mall.js,cy-prop/035/cy-prop.js,cy-report/009/cy-report.js,cy-user-notice/024/cy-user-notice.js,cy-user-feedback/033/cy-user-feedback.js,cmt-notice/016/cmt-notice.js,cy-grade/005/cy-grade.js,cy-score/003/cy-score.js,jump-url/005/jump-url.js,disable-user-photo/005/disable-user-photo.js,cy-auto-recommand/003/cy-auto-recommand.js,phone-verify/002/phone-verify.js",
            cyqE875ep: "cy-skin/003/cy-skin.js,cmt-header/033/cmt-header.js,cmt-box/022/cmt-box.js,cmt-list/025/cmt-list.js,hot-topic/015/hot-topic.js,cmt-footer/023/cmt-footer.js,face/007/face.js,cmt-float-bar/018/cmt-float-bar.js,cy-report/009/cy-report.js,cy-grade/005/cy-grade.js,cy-score/003/cy-score.js,jump-url/005/jump-url.js,disable-user-photo/005/disable-user-photo.js",
            "v3.2": "cy-skin/028/cy-skin.js,cmt-header/081/cmt-header.js,cmt-box/067/cmt-box.js,cmt-list/061/cmt-list.js,cmt-advert/064/cmt-advert.js,cmt-footer/048/cmt-footer.js,hot-topic/021/hot-topic.js,face/015/face.js,cmt-float-bar/029/cmt-float-bar.js,cy-user-page/035/cy-user-page.js,cy-user-info/067/cy-user-info.js,cy-user-avatar/014/cy-user-avatar.js,cy-user-view/033/cy-user-view.js,cy-report/022/cy-report.js,cy-user-notice/045/cy-user-notice.js,cy-user-feedback/048/cy-user-feedback.js,cy-user-set/025/cy-user-set.js,cmt-notice-no-task-msg/007/cmt-notice-no-task-msg.js,cy-grade/008/cy-grade.js,cy-score/006/cy-score.js,jump-url/008/jump-url.js,disable-user-photo/007/disable-user-photo.js,sohu-treaty/007/sohu-treaty.js,cy-auto-recommand/005/cy-auto-recommand.js,phone-verify/004/phone-verify.js,first-login-prompt/003/first-login-prompt.js",
            17173: "simple-cy-skin/002/simple-cy-skin.js,simple-cmt-header/004/simple-cmt-header.js,simple-cmt-box/003/simple-cmt-box.js,simple-cmt-list/002/simple-cmt-list.js,simple-cmt-footer/003/simple-cmt-footer.js,simple-jump-url/001/simple-jump-url.js,simple-cy-report/001/simple-cy-report.js,face/015/face.js,cy-user-page/035/cy-user-page.js,cy-user-info/067/cy-user-info.js,cy-user-avatar/014/cy-user-avatar.js,cy-user-view/033/cy-user-view.js,cy-user-footprint/016/cy-user-footprint.js,cy-user-notice/045/cy-user-notice.js,cy-user-feedback/048/cy-user-feedback.js,cy-user-set/025/cy-user-set.js,cy-auto-recommand/005/cy-auto-recommand.js,phone-verify/004/phone-verify.js,first-login-prompt/003/first-login-prompt.js,http://ue.17173cdn.com/a/lib/chanyan/passport.js",
            "prop-v3.2": "cy-skin/028/cy-skin.js,cmt-header/081/cmt-header.js,cmt-box/067/cmt-box.js,cmt-list/061/cmt-list.js,cmt-advert/064/cmt-advert.js,cmt-footer/048/cmt-footer.js,hot-topic/021/hot-topic.js,face/015/face.js,cmt-float-bar/029/cmt-float-bar.js,cy-user-page/035/cy-user-page.js,cy-user-info/067/cy-user-info.js,cy-user-avatar/014/cy-user-avatar.js,cy-user-view/033/cy-user-view.js,cy-user-task/032/cy-user-task.js,cy-prop/051/cy-prop.js,cy-report/022/cy-report.js,cy-user-notice/045/cy-user-notice.js,cy-user-feedback/048/cy-user-feedback.js,cy-user-set/025/cy-user-set.js,cmt-notice/023/cmt-notice.js,cy-grade/008/cy-grade.js,cy-score/006/cy-score.js,jump-url/008/jump-url.js,disable-user-photo/007/disable-user-photo.js,sohu-treaty/007/sohu-treaty.js,cy-auto-recommand/005/cy-auto-recommand.js,phone-verify/004/phone-verify.js,first-login-prompt/003/first-login-prompt.js",
            "cyqE875ep-v3.2": "cy-skin/028/cy-skin.js,cmt-header/081/cmt-header.js,cmt-box/067/cmt-box.js,cmt-list/061/cmt-list.js,hot-topic/021/hot-topic.js,cmt-footer/048/cmt-footer.js,face/015/face.js,cmt-float-bar/029/cmt-float-bar.js,cy-report/022/cy-report.js,cy-grade/008/cy-grade.js,cy-score/006/cy-score.js,jump-url/008/jump-url.js,disable-user-photo/007/disable-user-photo.js",
            "wap-prop": "mobile-enter/051/mobile-enter.js,mobile-skin/025/mobile-skin.js,mobile-cmt-box/053/mobile-cmt-box.js,mobile-cmt-header/047/mobile-cmt-header.js,mobile-cmt-advert/033/mobile-cmt-advert.js,mobile-cmt-list/068/mobile-cmt-list.js,mobile-login-box/027/mobile-login-box.js,mobile-user-center/047/mobile-user-center.js,mobile-cmt-float-bar/025/mobile-cmt-float-bar.js,mobile-task/016/mobile-task.js,mobile-cmt-barrage/017/mobile-cmt-barrage.js,mobile-auto-recommand/013/mobile-auto-recommand.js",
            sohu: "sohu-cy-skin/011/sohu-cy-skin.js,sohu-cmt-header/013/sohu-cmt-header.js,sohu-cmt-box/022/sohu-cmt-box.js,sohu-cmt-list/008/sohu-cmt-list.js,sohu-cmt-footer/006/sohu-cmt-footer.js,sohu-cy-report/004/sohu-cy-report.js,sohu-jump-url/004/sohu-jump-url.js,sohu-face/003/sohu-face.js,sohu-new-treaty/002/sohu-new-treaty.js",
            test: "cy-skin/028/cy-skin.js,cmt-header/081/cmt-header.js,cmt-box/067/cmt-box.js,cmt-list/061/cmt-list.js,cmt-footer/048/cmt-footer.js,hot-topic/021/hot-topic.js,face/015/face.js,cmt-float-bar/029/cmt-float-bar.js,cy-user-page/035/cy-user-page.js,cy-user-info/067/cy-user-info.js,cy-user-avatar/014/cy-user-avatar.js,cy-user-view/033/cy-user-view.js,cy-user-task/032/cy-user-task.js,cy-prop/051/cy-prop.js,cy-report/022/cy-report.js,cy-user-notice/045/cy-user-notice.js,cy-user-feedback/048/cy-user-feedback.js,cy-user-set/025/cy-user-set.js,cmt-notice/023/cmt-notice.js,cy-grade/008/cy-grade.js,cy-score/006/cy-score.js,jump-url/008/jump-url.js,disable-user-photo/007/disable-user-photo.js,sohu-treaty/007/sohu-treaty.js,cy-auto-recommand/005/cy-auto-recommand.js,phone-verify/004/phone-verify.js,first-login-prompt/003/first-login-prompt.js",
            simple: "simple-cy-skin/002/simple-cy-skin.js,simple-cmt-header/004/simple-cmt-header.js,simple-cmt-box/003/simple-cmt-box.js,simple-cmt-list/002/simple-cmt-list.js,simple-cmt-footer/003/simple-cmt-footer.js,simple-jump-url/001/simple-jump-url.js,simple-cy-report/001/simple-cy-report.js,face/015/face.js,cy-user-page/035/cy-user-page.js,cy-user-info/067/cy-user-info.js,cy-user-avatar/014/cy-user-avatar.js,cy-user-view/033/cy-user-view.js,cy-user-footprint/016/cy-user-footprint.js,cy-user-notice/045/cy-user-notice.js,cy-user-feedback/048/cy-user-feedback.js,cy-user-set/025/cy-user-set.js,cy-auto-recommand/005/cy-auto-recommand.js,phone-verify/004/phone-verify.js,first-login-prompt/003/first-login-prompt.js",
            simplest: "cy-skin/028/cy-skin.js,cmt-header/081/cmt-header.js,cmt-box/067/cmt-box.js,cy-user-page/035/cy-user-page.js,cy-user-info/067/cy-user-info.js,cy-user-set/025/cy-user-set.js",
            "wap-simplest": "mobile-enter/051/mobile-enter.js,mobile-skin/025/mobile-skin.js,mobile-cmt-box/053/mobile-cmt-box.js,mobile-cmt-header/047/mobile-cmt-header.js,mobile-login-box/027/mobile-login-box.js,mobile-user-center/047/mobile-user-center.js",
            "user-define": "mobile-enter/051/mobile-enter.js,mobile-login-box/027/mobile-login-box.js",
            board: "cy-skin/028/cy-skin.js,cmt-header/081/cmt-header.js,cmt-box/067/cmt-box.js,cmt-list/061/cmt-list.js,cmt-footer/048/cmt-footer.js,face/015/face.js"
        };
    });
    run("/opt/jenkins/workspace/changyan-fe-frontend-v3/src/start.js");
        window.changyan.api.getModules = function (module) {            var key = "/opt/jenkins/workspace/changyan-fe-frontend-v3/src/" + module;            return require(key);        };        }());    