/**
 * Created by yaojliu on 8/22/14.
 */
/**
 * @module nx
 */

var nx = {
    VERSION: '0.7.0',
    DEBUG: false,
    global: (function() {
        return this;
    }).call(null)
};

(function(nx) {
    /**
     * @class nx
     * @static
     */


    var isArray = Array.isArray || function(target) {
        return target && target.constructor === Array;
    };

    /**
     * Extend target with properties from sources.
     * @method extend
     * @param target {Object} The target object to be extended.
     * @param source* {Object} The source objects.
     * @returns {Object}
     */
    nx.extend = function(target) {
        for (var i = 1, length = arguments.length; i < length; i++) {
            var arg = arguments[i];
            for (var key in arg) {
                if (arg.hasOwnProperty(key)) {
                    target[key] = arg[key];
                }
            }
        }

        return target;
    };

    /**
     * Iterate over target and execute the callback with context.
     * @method each
     * @param target {Object|Array|Iterable} The target object to be iterate over.
     * @param callback {Function} The callback function to execute.
     * @param context {Object} The context object which act as 'this'.
     */
    nx.each = function(target, callback, context) {
        if (target && callback) {
            if (target.__each__) {
                target.__each__(callback, context);
            }
            else {
                var length = target.length;
                if (length >= 0) {
                    for (var i = 0; i < length; i++) {
                        callback.call(context, target[i], i);
                    }
                }
                else {
                    for (var key in target) {
                        if (target.hasOwnProperty(key)) {
                            callback.call(context, target[key], key);
                        }
                    }
                }
            }
        }
    };

    /**
     * Shallow clone target object.
     * @method clone
     * @param target {Object|Array} The target object to be cloned.
     * @returns {Object} The cloned object.
     */
    nx.clone = function(target) {
        if (target) {
            if (target.__clone__) {
                return target.__clone__();
            }
            else {
                if (nx.is(target, 'Array')) {
                    return target.slice(0);
                }
                else {
                    var result = {};
                    for (var key in target) {
                        if (target.hasOwnProperty(key)) {
                            result[key] = target[key];
                        }
                    }

                    return result;
                }
            }
        }
        else {
            return target;
        }
    };

    /**
     * Check whether target is specified type.
     * @method is
     * @param target {Object} The target object to be checked.
     * @param type {String|Function} The type could either be a string or a class object.
     * @returns {Boolean}
     */
    nx.is = function(target, type) {
        if (target && target.__is__) {
            return target.__is__(type);
        }
        else {
            switch (type) {
                case 'Undefined':
                    return target === undefined;
                case 'Null':
                    return target === null;
                case 'Object':
                    return target && (typeof target === 'object');
                case 'String':
                case 'Boolean':
                case 'Number':
                case 'Function':
                    return typeof target === type.toLowerCase();
                case 'Array':
                    return isArray(target);
                default:
                    return target instanceof type;
            }
        }
    };

    /**
     * Get the specified property value of target.
     * @method get
     * @param target {Object} The target object.
     * @param name {String} The property name.
     * @returns {*} The value.
     */
    nx.get = function(target, name) {
        if (target) {
            if (target.__get__) {
                return target.__get__(name);
            }
            else {
                return target[name];
            }
        }
    };

    /**
     * Set the specified property of target with value.
     * @method set
     * @param target {Object} The target object.
     * @param name {String} The property name.
     * @param value {*} The value to be set.
     */
    nx.set = function(target, name, value) {
        if (target) {
            if (target.__set__) {
                target.__set__(name);
            }
            else {
                target[name] = value;
            }
        }
    };

    /**
     * Get all properties of target.
     * @method gets
     * @param target {Object} The target Object.
     * @returns {Object} An object contains all keys and values of target.
     */
    nx.gets = function(target) {
        if (target) {
            if (target.__gets__) {
                return target.__gets__();
            }
            else {
                var result = {};
                for (var key in target) {
                    if (target.hasOwnProperty(key)) {
                        result[key] = target[key];
                    }
                }
                return result;
            }
        }
    };

    /**
     * Set a bunch of properties for target.
     * @method sets
     * @param target {Object} The target object.
     * @param dict {Object} An object contains all keys and values to be set.
     */
    nx.sets = function(target, dict) {
        if (target && dict) {
            if (target.__sets__) {
                target.__sets__(dict);
            }
            else {
                for (var key in dict) {
                    if (dict.hasOwnProperty(key)) {
                        target[key] = dict[key];
                    }
                }
            }
        }
    };

    /**
     * Check whether target has specified property.
     * @method has
     * @param target {Object} The target object.
     * @param name {String} The property name.
     * @returns {Boolean}
     */
    nx.has = function(target, name) {
        if (target) {
            if (target.__has__) {
                return target.__has__(name);
            }
            else {
                return name in target;
            }
        }
        else {
            return false;
        }
    };

    /**
     * Compare target and source.
     * @method compare
     * @param target {Object} The target object.
     * @param source {Object} The source object.
     * @returns {Number} The result could be -1,0,1 which indicates the comparison result.
     */
    nx.compare = function(target, source) {
        if (target && target.__compare__) {
            return target.__compare__(source);
        }
        else {
            if (target === source) {
                return 0;
            }
            else if (target > source) {
                return 1;
            }
            else if (target < source) {
                return -1;
            }

            return 1;
        }
    };

    /**
     * Get value from target specified by a path and optionally set a value for it.
     * @method path
     * @param target {Object} The target object.
     * @param path {String} The path.
     * @param [value] {*} The value to be set.
     * @returns {*}
     */
    nx.path = function(target, path, value) {
        var result = target;
        if (path) {
            var tokens = path.split('.'), token,
                i = 0, length = tokens.length;

            if (value === undefined) {
                for (; result && i < length; i++) {
                    token = tokens[i];
                    if (result.__get__) {
                        result = result.__get__(token);
                    }
                    else {
                        result = result[token];
                    }
                }
            }
            else {
                length -= 1;
                for (; result && i < length; i++) {
                    token = tokens[i];
                    if (result.__get__) {
                        result = result.__get__(token);
                    }
                    else {
                        result = result[token] = result[token] || {};
                    }
                }

                token = tokens[i];
                if (result) {
                    if (result.__set__) {
                        result.__set__(token, value);
                    }
                    else {
                        result[token] = value;
                    }

                    result = value;
                }
            }
        }

        return result;
    };

})(nx);
(function(nx) {

    var classId = 1,
        instanceId = 1,
        metaPrefix = '@',
        eventPrefix = 'on',
        classes = {},
        global = nx.global;

    /**
     * The base of any Classes defined in nx framework.
     * @class nx.Object
     * @constructor
     */
    function NXObject() {
    }

    var NXPrototype = NXObject.prototype = {
        constructor: NXObject,
        /**
         * Dispose current object.
         * @method dispose
         */
        dispose: function() {
            this.__listeners__ = {};
        },
        /**
         * Destroy current object.
         * @method destroy
         */
        destroy: function() {
            this.dispose();
        },
        /**
         * Call overridden method from super class
         * @method inherited
         */
        inherited: function() {
            var base = this.inherited.caller.__super__;
            if (base) {
                return base.apply(this, arguments);
            }
        },
        /**
         * Check whether current object is specified type.
         * @method is
         * @param type {String|Function}
         * @returns {Boolean}
         */
        is: function(type) {
            if (typeof type === 'string') {
                type = nx.path(global, type);
            }

            if (type) {
                if (this instanceof type) {
                    return true;
                }
                else {
                    var mixins = this.__mixins__;
                    for (var i = 0, len = mixins.length; i < len; i++) {
                        var mixin = mixins[i];
                        if (type === mixin) {
                            return true;
                        }
                    }
                }
            }

            return false;
        },
        /**
         * Check whether current object has specified property.
         * @method has
         * @param name {String}
         * @returns {Boolean}
         */
        has: function(name) {
            var member = this[name];
            return member && member.__type__ == 'property';
        },
        /**
         * Get specified property value.
         * @method get
         * @param name {String}
         * @returns {*}
         */
        get: function(name) {
            var member = this[name];
            if (member !== undefined) {
                if (member.__type__ == 'property') {
                    return member.call(this);
                }
                else {
                    return member;
                }
            }
        },
        /**
         * Set specified property value.
         * @method set
         * @param name {String}
         * @param value {*}
         */
        set: function(name, value) {
            var member = this[name];
            if (member !== undefined) {
                if (member.__type__ == 'property') {
                    return member.call(this, value);
                }
                else {
                    this[name] = value;
                }
            }
            else {
                this[name] = value;
            }
        },
        /**
         * Get all properties.
         * @method gets
         * @returns {Object}
         */
        gets: function() {
            var result = {};
            nx.each(this.__properties__, function(name) {
                result[name] = this.get(name);
            }, this);

            return result;
        },
        /**
         * Set a bunch of properties.
         * @method sets
         * @param dict {Object}
         */
        sets: function(dict) {
            if (dict) {
                for (var name in dict) {
                    if (dict.hasOwnProperty(name)) {
                        this.set(name, dict[name]);
                    }
                }
            }
        },
        /**
         * Check whether current object has specified event.
         * @method can
         * @param name {String}
         * @returns {Boolean}
         */
        can: function(name) {
            var member = this[eventPrefix + name];
            return member && member.__type__ == 'event';
        },
        /**
         * Add an event handler.
         * @method on
         * @param name {String}
         * @param handler {Function}
         * @param [context] {Object}
         */
        on: function(name, handler, context) {
            var map = this.__listeners__;
            var listeners = map[name] = map[name] || [
                {owner: null,handler: null,context: null}
            ];

            listeners.push({
                owner: this,
                handler: handler,
                context: context || this
            });
        },
        /**
         * Remove an event handler.
         * @method off
         * @param name {String}
         * @param [handler] {Function}
         * @param [context] {Object}
         */
        off: function(name, handler, context) {
            var listeners = this.__listeners__[name], listener;
            if (listeners) {
                if (handler) {
                    context = context || this;
                    for (var i = 0, length = listeners.length; i < length; i++) {
                        listener = listeners[i];
                        if (listener.handler == handler && listener.context == context) {
                            listeners.splice(i, 1);
                            break;
                        }
                    }
                }
                else {
                    listeners.length = 1;
                }
            }
        },
        /**
         * Add a single event handler.
         * @method upon
         * @param name {String}
         * @param handler {Function}
         * @param [context] {Object}
         */
        upon: function(name, handler, context) {
            var map = this.__listeners__;
            var listeners = map[name] = map[name] || [
                {owner: null,handler: null,context: null}
            ];

            listeners[0] = {
                owner: this,
                handler: handler,
                context: context
            };
        },
        /**
         * Trigger an event.
         * @method fire
         * @param name {String}
         * @param [data] {*}
         */
        fire: function(name, data) {
            var listeners = this.__listeners__[name], listener, result;
            if (listeners) {
                for (var i = 0, length = listeners.length; i < length; i++) {
                    listener = listeners[i];
                    if (listener && listener.handler) {
                        result = listener.handler.call(listener.context, listener.owner, data);
                        if (result === false) {
                            return false;
                        }
                    }
                }
            }
        },
        __is__: function(type) {
            return this.is(type);
        },
        __has__: function(name) {
            return this.has(name);
        },
        __get__: function(name) {
            return this.get(name);
        },
        __set__: function(name, value) {
            return this.set(name, value);
        },
        __gets__: function() {
            return this.gets();
        },
        __sets__: function(dict) {
            return this.sets(dict);
        }
    };

    NXObject.__classId__ = NXPrototype.__classId__ = 0;
    NXObject.__className__ = NXPrototype.__className__ = 'nx.Object';
    NXObject.__events__ = NXPrototype.__events__ = [];
    NXObject.__properties__ = NXPrototype.__properties__ = [];
    NXObject.__methods__ = NXPrototype.__methods__ = [];
    NXObject.__defaults__ = NXPrototype.__defaults__ = {};
    NXObject.__mixins__ = NXPrototype.__mixins__ = [];
    NXObject.extendEvent = extendEvent;
    NXObject.extendProperty = extendProperty;
    NXObject.extendMethod = extendMethod;

    /**
     * Define an event and attach to target.
     * @method extendEvent
     * @static
     * @param target {Object}
     * @param name {String}
     */
    function extendEvent(target, name) {
        var eventName = eventPrefix + name;
        var exist = target[eventName] && target[eventName].__type__ == 'event';
        var fn = target[eventName] = function(handler, context) {
            var map = this.__listeners__;
            var listeners = map[name] = map[name] || [
                {owner: null,handler: null,context: null}
            ];

            listeners[0] = {
                owner: this,
                handler: handler,
                context: context
            };
        };

        fn.__name__ = name;
        fn.__type__ = 'event';

        if (!exist) {
            target.__events__.push(name);
        }

        return fn;
    }

    /**
     * Define a property and attach to target.
     * @method extendProperty
     * @static
     * @param target {Object}
     * @param name {String}
     * @param meta {Object}
     */
    function extendProperty(target, name, meta) {
        var defaultValue;
        var exist = target[name] && target[name].__type__ == 'property';
        if (nx.is(meta, 'Object')) {
            defaultValue = meta.value;
        }
        else {
            defaultValue = meta;
            meta = {
                value: defaultValue
            };
        }

        if (target[name] && meta.inherits) {
            meta = nx.extend({}, target[name].__meta__, meta);
        }

        var fn = target[name] = function(value, params) {
            if (value === undefined && arguments.length === 0) {
                return fn.__getter__.call(this, params);
            }
            else {
                return fn.__setter__.call(this, value, params);
            }
        };

        fn.__name__ = name;
        fn.__type__ = 'property';
        fn.__meta__ = meta;
        fn.__getter__ = meta.get || function() {
            return this['_' + name];
        };

        fn.__setter__ = meta.set || function(value) {
            this['_' + name] = value;
        };

        fn.getMeta = function(key) {
            return key ? fn.__meta__[key] : fn.__meta__;
        };

        if (defaultValue !== undefined) {
            target.__defaults__[name] = defaultValue;
        }

        if (!exist) {
            target.__properties__.push(name);
        }

        return fn;
    }

    /**
     * Define a method and attach to target.
     * @method extendMethod
     * @static
     * @param target {Object}
     * @param name {String}
     * @param method {Function}
     */
    function extendMethod(target, name, method) {
        var exist = target[name] && target[name].__type__ == 'method';

        if (target[name] && target[name] !== method) {
            method.__super__ = target[name];
        }

        method.__name__ = name;
        method.__type__ = 'method';
        method.__meta__ = {};

        target[name] = method;

        if (!exist) {
            target.__methods__.push(name);
        }
    }

    /**
     * Define a class
     * @method define
     * @param [type] {String}
     * @param [parent] {Function}
     * @param [members] {Object}
     * @returns {Function}
     */
    function define(type, parent, members) {
        if (!members) {
            if (nx.is(parent, 'Object')) {
                members = parent;
                parent = null;

                if (nx.is(type, 'Function')) {
                    parent = type;
                    type = null;
                }
            }
            else if (!parent) {
                if (nx.is(type, 'Object')) {
                    members = type;
                    type = null;
                }
                else if (nx.is(type, 'Function')) {
                    parent = type;
                    type = null;
                }
            }
        }

        members = members || {};

        var sup = parent || NXObject;
        var mixins = members.mixins || [];
        var events = members.events || [];
        var props = members.properties || {};
        var methods = members.methods || {};
        var static = members.static || false;
        var statics = members.statics || {};
        var prototype;
        var key, i, length;
        var Class, SuperClass;

        if (nx.is(mixins, 'Function')) {
            mixins = [mixins];
        }

        if (sup.__static__) {
            throw new Error('Static class cannot be inherited.');
        }

        if (static) {
            Class = function() {
                throw new Error('Cannot instantiate static class.');
            };

            Class.__classId__ = classId++;
            Class.__className__ = type ? type : 'Anonymous';
            Class.__static__ = true;
            Class.__events__ = [];
            Class.__properties__ = [];
            Class.__methods__ = [];
            Class.__defaults__ = {};

            for (i = 0, length = events.length; i < length; i++) {
                extendEvent(Class, events[i]);
            }

            for (key in props) {
                if (props.hasOwnProperty(key)) {
                    extendProperty(Class, key, props[key]);
                }
            }

            for (key in methods) {
                if (methods.hasOwnProperty(key)) {
                    extendMethod(Class, key, methods[key]);
                }
            }

            for (key in statics) {
                if (statics.hasOwnProperty(key)) {
                    Class[key] = statics[key];
                }
            }

            nx.each(Class.__defaults__, function(value, name) {
                Class['_' + name] = nx.is(value, 'Function') ? value.call(this) : value;
            }, this);

            if (methods.init) {
                methods.init.call(Class);
            }
        }
        else {
            Class = function() {
                var mixins = this.__mixins__;
                this.__id__ = instanceId++;
                this.__listeners__ = {};

                this.__initializing__ = true;

                for (var i = 0, length = mixins.length; i < length; i++) {
                    var ctor = mixins[i].__ctor__;
                    if (ctor) {
                        ctor.call(this);
                    }
                }

                nx.each(Class.__defaults__, function(value, name) {
                    this['_' + name] = nx.is(value, 'Function') ? value.call(this) : value;
                }, this);

                if (this.__ctor__) {
                    this.__ctor__.apply(this, arguments);
                }

                this.__initializing__ = false;
            };

            SuperClass = function() {
            };

            SuperClass.prototype = sup.prototype;
            prototype = new SuperClass();
            prototype.constructor = Class;
            prototype.__events__ = sup.__events__.slice(0);
            prototype.__properties__ = sup.__properties__.slice(0);
            prototype.__methods__ = sup.__methods__.slice(0);
            prototype.__defaults__ = nx.clone(sup.__defaults__);
            prototype.__mixins__ = sup.__mixins__.concat(mixins);

            Class.__classId__ = classId++;
            Class.__className__ = prototype.__className__ = type ? type : 'Anonymous';
            Class.__super__ = prototype.__super__ = sup;
            Class.prototype = prototype;

            if (methods.init) {
                prototype.__ctor__ = methods.init;
            }

            for (key in members) {
                if (members.hasOwnProperty(key)) {
                    prototype[metaPrefix + key] = Class[metaPrefix + key] = members[key];
                }
            }

            nx.each(mixins, function(mixin) {
                var mixinPrototype = mixin.prototype;

                nx.each(mixin.__events__, function(name) {
                    extendEvent(prototype, name);
                });

                nx.each(mixin.__properties__, function(name) {
                    extendProperty(prototype, name, mixinPrototype[name].__meta__);
                });

                nx.each(mixin.__methods__, function(name) {
                    if (name !== 'init') {
                        extendMethod(prototype, name, mixinPrototype[name]);
                    }
                });
            });

            for (i = 0, length = events.length; i < length; i++) {
                extendEvent(prototype, events[i]);
            }

            for (key in props) {
                if (props.hasOwnProperty(key)) {
                    extendProperty(prototype, key, props[key]);
                }
            }

            for (key in methods) {
                if (methods.hasOwnProperty(key)) {
                    extendMethod(prototype, key, methods[key]);
                }
            }

            for (key in statics) {
                if (statics.hasOwnProperty(key)) {
                    Class[key] = statics[key];
                }
            }

            Class.__ctor__ = prototype.__ctor__;
            Class.__events__ = prototype.__events__;
            Class.__properties__ = prototype.__properties__;
            Class.__methods__ = prototype.__methods__;
            Class.__defaults__ = prototype.__defaults__;
            Class.__mixins__ = prototype.__mixins__;
        }

        if (type) {
            nx.path(global, type, Class);
        }

        classes[Class.__classId__] = Class;
        return Class;
    }

    nx.Object = NXObject;
    nx.define = define;
    nx.classes = classes;

})(nx);

(function(nx) {

    /**
     * @class Comparable
     * @namespace nx
     */
    var Comparable = nx.define('nx.Comparable', {
        methods: {
            /**
             * Compare with the source.
             * @method compare
             * @param source
             * @returns {Number}
             */
            compare: function(source) {
                if (this === source) {
                    return 0;
                }
                else if (this > source) {
                    return 1;
                }
                else if (this < source) {
                    return -1;
                }

                return 1;
            },
            __compare__: function(source) {
                return this.compare(source);
            }
        }
    });
})(nx);
(function(nx) {

    /**
     * @class Iterable
     * @namespace nx
     */
    var Iterable = nx.define('nx.Iterable', {
        statics: {
            /**
             * Get the iteration function from an iterable object.
             * @method getIterator
             * @static
             * @param iter {Object|Array|nx.Iterable}
             * @returns {Function}
             */
            getIterator: function(iter) {
                if (nx.is(iter, Iterable)) {
                    return function(callback, context) {
                        iter.each(callback, context);
                    };
                }
                else {
                    return function(callback, context) {
                        nx.each(iter, callback, context);
                    };
                }
            },
            /**
             * Convert the iterable object to an array.
             * @method toArray
             * @static
             * @param iter {Object|Array|nx.Iterable}
             * @returns {Array}
             */
            toArray: function(iter) {
                if (nx.is(iter, Iterable)) {
                    return iter.toArray();
                }
                else if (nx.is(iter, 'Array')) {
                    return iter.slice(0);
                }
                else {
                    var result = [];
                    nx.each(iter, function(item) {
                        result.push(item);
                    });

                    return result;
                }
            }
        },
        properties: {
            /**
             * @property count {Number}
             */
            count: {
                get: function() {
                    return this.toArray().length;
                }
            }
        },
        methods: {
            /**
             * @method each
             * @param callback
             * @param context
             */
            each: function(callback, context) {
                throw new Error('Not Implemented.');
            },
            /**
             * @method toArray
             * @returns {Array}
             */
            toArray: function() {
                var result = [];
                this.each(function(item) {
                    result.push(item);
                });

                return result;
            },
            __each__: function(callback, context) {
                return this.each(callback, context);
            }
        }
    });
})(nx);
(function(nx) {
    /**
     * @class Observable
     * @namespace nx
     */
    var Observable = nx.define('nx.Observable', {
        statics: {
            extendProperty: function extendProperty(target, name, meta) {
                var property = nx.Object.extendProperty(target, name, meta);
                if (property && property.__type__ == 'property') {
                    if (!property._watched) {
                        var setter = property.__setter__;
                        var deps = property.getMeta('dependencies');
                        var refs = property._refs = property._refs || [];
                        refs.push(name);
                        nx.each(deps, function(dep) {
                            var depProp = this[dep];
                            if (depProp) {
                                var depRefs = depProp._refs = depProp._refs || [];
                                depRefs.push(name);
                            }
                        }, this);

                        property.__setter__ = function(value, params) {
                            var oldValue = this.get(name);
                            if (oldValue !== value) {
                                if (setter.call(this, value, params) !== false) {
                                    return this.notify(refs, oldValue);
                                }
                            }

                            return false;
                        };

                        property._watched = true;
                    }
                }

                return property;
            }
        },
        methods: {
            /**
             * @constructor
             */
            init: function() {
                this.__bindings__ = {};
                this.__watchers__ = {};
            },
            /**
             * Dispose current object.
             * @method dispose
             */
            dispose: function() {
                this.inherited();
                nx.each(this.__bindings__, function(binding) {
                    binding.dispose();
                });
                this.__bindings__ = {};
                this.__watchers__ = {};
            },
            /**
             * @method
             * @param names
             * @param handler
             * @param context
             */
            watch: function(names, handler, context) {
                nx.each(names == '*' ? this.__properties__ : (nx.is(names, 'Array') ? names : [names]), function(name) {
                    this._watch(name, handler, context);
                }, this);
            },
            /**
             * @method unwatch
             * @param names
             * @param handler
             * @param context
             */
            unwatch: function(names, handler, context) {
                nx.each(names == '*' ? this.__properties__ : (nx.is(names, 'Array') ? names : [names]), function(name) {
                    this._unwatch(name, handler, context);
                }, this);
            },
            /**
             * @method notify
             * @param names
             * @param oldValue
             */
            notify: function(names, oldValue) {
                if (names == '*') {
                    nx.each(this.__watchers__, function(value, name) {
                        this._notify(name, oldValue);
                    }, this);
                }
                else {
                    nx.each(nx.is(names, 'Array') ? names : [names], function(name) {
                        this._notify(name, oldValue);
                    }, this);
                }

            },
            /**
             * Get existing binding object for specified property.
             * @method getBinding
             * @param prop
             * @returns {*}
             */
            getBinding: function(prop) {
                return this.__bindings__[prop];
            },
            /**
             * Set binding for specified property.
             * @method setBinding
             * @param prop
             * @param expr
             * @param source
             */
            setBinding: function(prop, expr, source) {
                var binding = this.__bindings__[prop];
                var params = {};

                if (nx.is(expr, 'String')) {
                    var tokens = expr.split(',');
                    var path = tokens[0];
                    var i = 1, length = tokens.length;

                    for (; i < length; i++) {
                        var pair = tokens[i].split('=');
                        params[pair[0]] = pair[1];
                    }

                    params.target = this;
                    params.targetPath = prop;
                    params.sourcePath = path;
                    params.source = source;
                    params.converter = Binding.converters[params.converter];
                }
                else {
                    params = nx.clone(expr);
                    params.target = this;
                    params.targetPath = prop;
                    params.source = params.source || this;
                }

                if (binding) {
                    binding.destroy();
                }

                this.__bindings__[prop] = new Binding(params);
            },
            /**
             * Clear binding for specified property.
             * @method clearBinding
             * @param prop
             */
            clearBinding: function(prop) {
                var binding = this.__bindings__[prop];
                if (binding) {
                    binding.destroy();
                    this.__bindings__[prop] = null;
                }
            },
            _watch: function(name, handler, context) {
                var map = this.__watchers__;
                var watchers = map[name] = map[name] || [];
                var property = this[name];

                watchers.push({
                    owner: this,
                    handler: handler,
                    context: context
                });

                if (property && property.__type__ == 'property') {
                    if (!property._watched) {
                        var setter = property.__setter__;
                        var deps = property.getMeta('dependencies');
                        var refs = property._refs = property._refs || [];
                        refs.push(name);
                        nx.each(deps, function(dep) {
                            var depProp = this[dep];
                            if (depProp) {
                                var depRefs = depProp._refs = depProp._refs || [];
                                depRefs.push(name);
                            }
                        }, this);

                        property.__setter__ = function(value, params) {
                            var oldValue = this.get(name);
                            if (oldValue !== value || (params && params.force)) {
                                if (setter.call(this, value, params) !== false) {
                                    return this.notify(refs, oldValue);
                                }
                            }

                            return false;
                        };

                        property._watched = true;
                    }
                }
            },
            _unwatch: function(name, handler, context) {
                var map = this.__watchers__;
                var watchers = map[name], watcher;

                if (watchers) {
                    if (handler) {
                        for (var i = 0, length = watchers.length; i < length; i++) {
                            watcher = watchers[i];
                            if (watcher.handler == handler && watcher.context == context) {
                                watchers.splice(i, 1);
                                break;
                            }
                        }
                    }
                    else {
                        watchers.length = 0;
                    }
                }
            },
            _notify: function(name, oldValue) {
                var map = this.__watchers__;
                nx.each(map[name], function(watcher) {
                    if (watcher && watcher.handler) {
                        watcher.handler.call(watcher.context, name, this.get(name), oldValue, watcher.owner);
                    }
                }, this);
            }
        }
    });

    var Binding = nx.define('nx.Binding', Observable, {
        statics: {
            converters: {
                boolean: {
                    convert: function(value) {
                        return !!value;
                    },
                    convertBack: function(value) {
                        return !!value;
                    }
                },
                inverted: {
                    convert: function(value) {
                        return !value;
                    },
                    convertBack: function(value) {
                        return !value;
                    }
                },
                number: {
                    convert: function(value) {
                        return Number(value);
                    },
                    convertBack: function(value) {
                        return value;
                    }
                }
            },
            /**
             * @static
             */
            format: function(expr, target) {
                if (expr) {
                    return expr.replace('{0}', target);
                }
                else {
                    return '';
                }
            }
        },
        properties: {
            /**
             * Get the target object of current binding.
             */
            target: {
                value: null
            },
            /**
             * Get the target path of current binding.
             */
            targetPath: {
                value: ''
            },
            /**
             * Get the source path of current binding.
             */
            sourcePath: {
                value: ''
            },
            /**
             * Get or set the source of current binding.
             */
            source: {
                get: function() {
                    return this._source;
                },
                set: function(value) {
                    if (this._initialized && this._source !== value) {
                        this._rebind(0, value);
                        this._updateTarget();
                        this._source = value;
                    }
                }
            },
            /**
             * Get or set the binding type.
             */
            bindingType: {
                value: 'auto'
            },
            /**
             * Get the direction for current binding.
             */
            direction: {
                value: 'auto'
            },
            /**
             * Get the trigger for current binding.
             */
            trigger: {
                value: 'auto'
            },
            /**
             * Get the format for current binding.
             */
            format: {
                value: 'auto'
            },
            /**
             * Get the converter for current binding.
             */
            converter: {
                value: 'auto'
            }
        },
        methods: {
            init: function(config) {
                this.sets(config);
                if (config.target) {
                    var target = this.target();
                    var targetPath = this.targetPath();
                    var sourcePath = this.sourcePath();
                    var bindingType = this.bindingType();
                    var direction = this.direction();
                    var format = this.format();
                    var converter = this.converter();
                    var targetMember = target[targetPath];
                    var watchers = this._watchers = [];
                    var keys = this._keys = sourcePath.split('.'), key;
                    var i = 0, length = keys.length;
                    var self = this;

                    if (targetMember) {
                        var bindingMeta = targetMember.__meta__.binding;

                        if (bindingType == 'auto') {
                            bindingType = targetMember.__type__;
                        }

                        if (direction == 'auto') {
                            direction = (bindingMeta && bindingMeta.direction) || '<-';
                        }

                        if (format == 'auto') {
                            format = bindingMeta && bindingMeta.format;
                        }

                        if (converter == 'auto') {
                            converter = bindingMeta && bindingMeta.converter;
                        }
                    }
                    else {
                        if (bindingType == 'auto') {
                            bindingType = target.can(targetPath) ? 'event' : 'property';
                        }

                        if (direction == 'auto') {
                            direction = '<-';
                        }

                        if (format == 'auto') {
                            format = null;
                        }

                        if (converter == 'auto') {
                            converter = null;
                        }
                    }

                    if (converter) {
                        if (nx.is(converter, 'Function')) {
                            converter = {
                                convert: converter,
                                convertBack: function(value) {
                                    return value;
                                }
                            };
                        }
                    }

                    if (direction[0] == '<') {
                        for (; i < length; i++) {
                            watchers.push({
                                key: keys[i],
                                /*jshint -W083*/
                                handler: (function(index) {
                                    return function(property, value) {
                                        self._rebind(index, value);
                                        self._updateTarget();
                                    };
                                })(i + 1)
                            });
                        }
                    }

                    if (bindingType == 'event') {
                        key = watchers[length - 1].key;
                        watchers.length--;
                        this._updateTarget = function() {
                            var actualValue = this._actualValue;
                            if (actualValue) {
                                target.upon(targetPath, actualValue[key], actualValue);
                            }
                        };
                    }
                    else {
                        this._updateTarget = function() {
                            var actualValue = this._actualValue;
                            if (converter) {
                                actualValue = converter.convert.call(this, actualValue);
                            }

                            if (format) {
                                actualValue = Binding.format(format, actualValue);
                            }

                            nx.path(target, targetPath, actualValue);
                        };
                    }

                    if (direction[1] == '>') {
                        if (target.watch && target.watch.__type__ === 'method') {
                            target.watch(targetPath, this._onTargetChanged = function(property, value) {
                                var actualValue = value;
                                if (converter) {
                                    actualValue = converter.convertBack.call(this, actualValue);
                                }
                                nx.path(this.source(), sourcePath, actualValue);
                            }, this);
                        }
                    }

                    this._initialized = true;
                    this.source(config.source);
                }
            },
            dispose: function() {
                var target = this._target;
                this._rebind(0, null);
            },
            _rebind: function(index, value) {
                var watchers = this._watchers;
                var newSource = value, oldSource;

                for (var i = index, length = watchers.length; i < length; i++) {
                    var watcher = watchers[i];
                    var key = watcher.key;
                    var handler = watcher.handler;

                    oldSource = watcher.source;

                    if (oldSource && oldSource.unwatch && oldSource.unwatch.__type__ === 'method') {
                        oldSource.unwatch(key, handler, this);
                    }

                    watcher.source = newSource;

                    if (newSource) {
                        if (newSource.watch && newSource.watch.__type__ === 'method') {
                            newSource.watch(key, handler, this);
                        }

                        if (newSource.get) {
                            newSource = newSource.get(key);
                        }
                        else {
                            newSource = newSource[key];
                        }
                    }
                }

                this._actualValue = newSource;
            }
        }
    });

})(nx);

(function(nx) {
    /**
     * @class Serializable
     * @namespace nx
     */
    var Serializable = nx.define('nx.Serializable', {
        methods: {
            /**
             * @method serialize
             * @returns {any}
             */
            serialize: function() {
                var result = {};
                nx.each(this.__properties__, function(name) {
                    var prop = this[name];
                    var value = prop.call(this);

                    if (prop.getMeta('serializable') !== false) {
                        if (nx.is(value, Serializable)) {
                            result[name] = value.serialize();
                        }
                        else {
                            result[name] = value;
                        }
                    }
                }, this);

                return result;
            }
        }
    });
})(nx);
(function(nx) {
    var Iterable = nx.Iterable;

    /**
     * @class Collection
     * @namespace nx.data
     * @extends nx.Iterable
     * @constructor
     * @param iter
     */
    var Collection = nx.define('nx.data.Collection', Iterable, {
        properties: {
            /**
             * @property count
             * @type {Number}
             */
            count: {
                get: function() {
                    return this._data.length;
                }
            }
        },
        methods: {
            init: function(iter) {
                var data = this._data = [];
                if (nx.is(iter, Iterable)) {
                    this._data = iter.toArray();
                }
                else {
                    Iterable.getIterator(iter)(function(item) {
                        data.push(item);
                    });
                }
            },
            /**
             * Add an item.
             * @method add
             * @param item
             */
            add: function(item) {
                this._data.push(item);
            },
            /**
             * Add multiple items.
             * @method addRange
             * @param iter
             * @returns {*}
             */
            addRange: function(iter) {
                var data = this._data;
                var items = Iterable.toArray(iter);
                data.splice.apply(data, [data.length, 0].concat(items));

                return items;
            },
            /**
             * @method remove
             * @param item
             * @returns {*}
             */
            remove: function(item) {
                var index = this.indexOf(item);
                if (index >= 0) {
                    this._data.splice(index, 1);
                    return index;
                }
                else {
                    return -1;
                }
            },
            /**
             * @method removeAt
             * @param index
             * @returns {*}
             */
            removeAt: function(index) {
                return this._data.splice(index, 1)[0];
            },
            /**
             * @method insert
             * @param item
             * @param index
             */
            insert: function(item, index) {
                this._data.splice(index, 0, item);
            },
            /**
             * @method insertRange
             * @param index
             * @param iter
             * @returns {*}
             */
            insertRange: function(iter, index) {
                var data = this._data;
                var items = Iterable.toArray(iter);
                data.splice.apply(data, [index, 0].concat(items));

                return items;
            },
            /**
             * @method clear
             * @returns {*}
             */
            clear: function() {
                var items = this._data.slice();

                this._data.length = 0;
                return items;
            },
            /**
             * @method getItem
             * @param index
             * @returns {*}
             */
            getItem: function(index) {
                return this._data[index];
            },
            /**
             * @method getRange
             * @param index
             * @param count
             * @returns {Collection}
             */
            getRange: function(index, count) {
                return new Collection(this._data.slice(index, index + count));
            },
            /**
             * @method indexOf
             * @param item
             * @returns {*}
             */
            indexOf: function(item) {
                var data = this._data;
                if (data.indexOf) {
                    return data.indexOf(item);
                }
                else {
                    for (var i = 0, length = data.length; i < length; i++) {
                        if (nx.compare(data[i], item) === 0) {
                            return i;
                        }
                    }

                    return -1;
                }
            },
            /**
             * @method lastIndexOf
             * @param item
             * @returns {*}
             */
            lastIndexOf: function(item) {
                var data = this._data;
                if (data.lastIndexOf) {
                    return data.lastIndexOf(item);
                }
                else {
                    for (var i = data.length - 1; i >= 0; i--) {
                        if (nx.compare(data[i], item) === 0) {
                            return i;
                        }
                    }

                    return -1;
                }
            },
            /**
             * @method contains
             * @param item
             * @returns {boolean}
             */
            contains: function(item) {
                return this.indexOf(item) >= 0;
            },
            /**
             * @method sort
             * @param comp
             * @returns {Array}
             */
            sort: function(comp) {
                return this._data.sort(comp);
            },
            /**
             * @method each
             * @param callback
             * @param context
             */
            each: function(callback, context) {
                nx.each(this._data, callback, context);
            },
            /**
             * @method  toArray
             * @returns {Array}
             */
            toArray: function() {
                return this._data.slice(0);
            }
        }
    });
})(nx);
(function(nx) {
    var Iterable = nx.Iterable;

    var DictionaryItem = nx.define({
        properties: {
            key: {
                get: function() {
                    return this._key;
                }
            },
            value: {
                get: function() {
                    return this._dict.getItem(this._key);
                },
                set: function(value) {
                    this._dict.setItem(this._key, value);
                }
            }
        },
        methods: {
            init: function(dict, key) {
                this._dict = dict;
                this._key = key;
            }
        }
    });

    var KeyIterator = nx.define(Iterable, {
        methods: {
            init: function(dict) {
                this._dict = dict;
            },
            each: function(callback, context) {
                this._dict.each(function(item) {
                    callback.call(context, item.key());
                });
            }
        }
    });

    var ValueIterator = nx.define(Iterable, {
        methods: {
            init: function(dict) {
                this._dict = dict;
            },
            each: function(callback, context) {
                this._dict.each(function(item) {
                    callback.call(context, item.value());
                });
            }
        }
    });

    /**
     * @class Dictionary
     * @namespace nx.data
     * @extends nx.Iterable
     * @constructor
     * @param dict
     */
    var Dictionary = nx.define('nx.data.Dictionary', Iterable, {
        properties: {
            /**
             * @property count
             * @type {Number}
             */
            count: {
                get: function() {
                    var count = 0;
                    this.each(function() {
                        count++;
                    });

                    return count;
                }
            },
            /**
             * @property keys
             * @type {Iterable}
             */
            keys: {
                get: function() {
                    return this._keys;
                }
            },
            /**
             * @property values
             * @type {Iterable}
             */
            values: {
                get: function() {
                    return this._values;
                }
            }
        },
        methods: {
            init: function(dict) {
                var map = this._map = {};
                if (dict) {
                    nx.each(dict, function(value, key) {
                        map[key] = new DictionaryItem(this, '' + key);
                        map[key]._value = value;
                    }, this);
                }

                this._keys = new KeyIterator(this);
                this._values = new ValueIterator(this);
            },
            /**
             * @method contains
             * @param key {String}
             * @returns {Boolean}
             */
            contains: function(key) {
                return key in this._map;
            },
            /**
             * @method getItem
             * @param key {String}
             * @returns {*}
             */
            getItem: function(key) {
                var item = this._map[key];
                return item && item._value;
            },
            /**
             * @method setItem
             * @param key {String}
             * @param value {any}
             */
            setItem: function(key, value) {
                var item = this._map[key] = new DictionaryItem(this, '' + key);
                item._value = value;

                return item;
            },
            /**
             * @method removeItem
             * @param key {String}
             */
            removeItem: function(key) {
                var item = this._map[key];
                delete this._map[key];
                return item;
            },
            /**
             * @method clear
             */
            clear: function() {
                var items = this.toArray();
                this._map = {};
                return items;
            },
            /**
             * @method each
             * @param callback {Function}
             * @param [context] {Object}
             */
            each: function(callback, context) {
                nx.each(this._map, callback, context);
            },
            /**
             * @method toArray
             * @returns {Array}
             */
            toArray: function() {
                var result = [];
                this.each(function(item) {
                    result.push(item);
                });

                return result;
            },
            /**
             * @method toObject
             * @returns {Object}
             */
            toObject: function() {
                var result = {};
                this.each(function(item) {
                    result[item.key()] = item.value();
                });

                return result;
            }
        }
    });
})(nx);
(function(nx) {

    /**
     * @class ObservableObject
     * @namespace nx.data
     * @extends nx.Observable
     */
    nx.define('nx.data.ObservableObject', nx.Observable, {
        methods: {
            init: function(data) {
                this.inherited();
                this._data = data || {};
            },
            /**
             * Dispose current object.
             * @method dispose
             */
            dispose: function() {
                this.inherited();
                this._data = null;
            },
            /**
             * Check whether current object has specified property.
             * @method has
             * @param name {String}
             * @returns {Boolean}
             */
            has: function(name) {
                var member = this[name];
                return (member && member.__type__ == 'property') || (name in this._data);
            },
            /**
             * Get specified property value.
             * @method get
             * @param name {String}
             * @returns {*}
             */
            get: function(name) {
                var member = this[name];
                if (member === undefined) {
                    return this._data[name];
                }
                else if (member.__type__ == 'property') {
                    return member.call(this);
                }
            },
            /**
             * Set specified property value.
             * @method set
             * @param name {String}
             * @param value {*}
             */
            set: function(name, value) {
                var member = this[name];
                if (member === undefined) {
                    if (this._data[name] !== value) {
                        this._data[name] = value;
                        this.notify(name);
                        return true;
                    }
                }
                else if (member.__type__ == 'property') {
                    return member.call(this, value);
                }
            },
            /**
             * Get all properties.
             * @method gets
             * @returns {Object}
             */
            gets: function() {
                var result = nx.clone(this._data);
                nx.each(this.__properties__, function(name) {
                    result[name] = this.get(name);
                }, this);

                return result;
            }
        }
    });
})(nx);
(function(nx) {

    /**
     * @class ObservableCollection
     * @namespace nx.data
     * @extends nx.data.Collection
     * @uses nx.Observable
     */
    nx.define('nx.data.ObservableCollection', nx.data.Collection, {
        mixins: nx.Observable,
        events: ['change'],
        methods: {
            /**
             * Add an item.
             * @method add
             * @param item
             */
            add: function(item) {
                this.inherited(item);
                this.notify('count');
                this.fire('change', {
                    action: 'add',
                    items: [item]
                });

                return item;
            },
            /**
             * @method addRange
             * @param iter
             */
            addRange: function(iter) {
                var items = this.inherited(iter);
                this.notify('count');
                this.fire('change', {
                    action: 'add',
                    items: items
                });

                return items;
            },
            /**
             * @method insert
             * @param item
             * @param index
             */
            insert: function(item, index) {
                this.inherited(item, index);
                this.notify('count');
                this.fire('change', {
                    action: 'add',
                    items: [item],
                    index: index
                });
            },
            /**
             * @method insertRange
             * @param iter
             * @param index
             */
            insertRange: function(iter, index) {
                var result = this.inherited(iter, index);
                this.notify('count');
                this.fire('change', {
                    action: 'add',
                    items: result,
                    index: index
                });
            },
            /**
             * @method remove
             * @param item
             */
            remove: function(item) {
                var result = this.inherited(item);
                if (result >= 0) {
                    this.notify('count');
                    this.fire('change', {
                        action: 'remove',
                        items: [item],
                        index: result
                    });
                }

                return result;
            },
            /**
             * @method removeAt
             * @param index
             */
            removeAt: function(index) {
                var result = this.inherited(index);
                if (result !== undefined) {
                    this.notify('count');
                    this.fire('change', {
                        action: 'remove',
                        items: [result],
                        index: index
                    });
                }

                return result;
            },
            /**
             * @method clear
             */
            clear: function() {
                var result = this.inherited();
                this.notify('count');
                this.fire('change', {
                    action: 'clear',
                    items: result
                });
            },
            /**
             * @method sort
             * @param comp
             */
            sort: function(comp) {
                var result = this.inherited(comp);
                this.notify('count');
                this.fire('change', {
                    action: 'sort',
                    comparator: comp || function(a, b) {
                        if (a > b) {
                            return 1;
                        }
                        else if (a < b) {
                            return -1;
                        }
                        else {
                            return 0;
                        }
                    }
                });

                return result;
            }
        }
    });
})(nx);
(function(nx) {

    var Observable = nx.Observable;
    var Dictionary = nx.data.Dictionary;

    /**
     * @class ObservableDictionary
     * @namespace nx.data
     * @extends nx.data.Dictionary
     * @constructor
     * @param dict
     */
    nx.define('nx.data.ObservableDictionary', Dictionary, {
        mixins: Observable,
        events: ['change'],
        methods: {
            /**
             * @method setItem
             * @param key {String}
             * @param value {any}
             */
            setItem: function(key, value) {
                var map = this._map;
                if (key in map) {
                    var oldItem = map[key];
                    var newItem = this.inherited(key, value);
                    this.fire('change', {
                        action: 'replace',
                        oldItem: oldItem,
                        newItem: newItem
                    });
                }
                else {
                    var item = this.inherited(key, value);
                    this.notify('count');
                    this.fire('change', {
                        action: 'add',
                        items: [item]
                    });
                }
            },
            /**
             * @method removeItem
             * @param key {String}
             */
            removeItem: function(key) {
                var map = this._map;
                if (key in map) {
                    var item = map[key];
                    delete map[key];
                    this.notify('count');
                    this.fire('change', {
                        action: 'remove',
                        items: [item]
                    });
                }
            },
            /**
             * @method clear
             */
            clear: function() {
                var items = this.inherited();
                this.notify('count');
                this.fire('change', {
                    action: 'clear',
                    items: items
                });
            }
        }
    });
})(nx);
(function(nx) {
    var Iterable = nx.Iterable;
    var ArrayPrototype = Array.prototype;
    var every = ArrayPrototype.every;
    var some = ArrayPrototype.some;
    var filter = ArrayPrototype.filter;
    var map = ArrayPrototype.map;
    var reduce = ArrayPrototype.reduce;

    /**
     * @class Query
     * @namespace nx.data
     * @extend nx.Iterable
     */
    var Query = nx.define('nx.data.Query', nx.Iterable, {
        methods: {
            /**
             * @constructor
             * @param iter
             */
            init: function(iter) {
                this._iter = iter;
                this.reset();
            },
            /**
             * Reset the query.
             * @method reset
             */
            reset: function() {
                this._where = null;
                this._orderBy = null;
                this._unions = [];
                this._joins = [];
                this._begin = 0;
                this._end = null;
            },
            /**
             * @method where
             * @param expr
             * @chainable
             */
            where: function(expr) {
                this._where = expr;
                return this;
            },
            /**
             * method orderBy
             * @param expr
             * @param desc
             * @chainable
             */
            orderBy: function(expr, desc) {
                if (nx.is(expr, 'Function')) {
                    this._orderBy = desc ? function(a, b) {
                        return expr(b, a);
                    } : expr;
                }
                else {
                    this._orderBy = desc ? function(a, b) {
                        return nx.compare(nx.path(b, expr), nx.path(a, expr));
                    } : function(a, b) {
                        return nx.compare(nx.path(a, expr), nx.path(b, expr));
                    };
                }

                return this;
            },
            /**
             * @method groupBy
             * @param expr
             * @chainable
             */
            groupBy: function(expr) {
                throw new Error('Not Implemented');
            },
            /**
             * @method distinct
             * @param expr
             * @chainable
             */
            distinct: function(expr) {
                throw new Error('Not Implemented');
            },
            /**
             * @method skip
             * @param count
             * @chainable
             */
            skip: function(count) {
                this._begin = count;

                if (this._end) {
                    this._end += count;
                }

                return this;
            },
            /**
             * @method take
             * @param count
             * @chainable
             */
            take: function(count) {
                this._end = this._begin + count;

                return this;
            },
            /**
             * @method join
             * @param iter
             * @param on
             * @chainable
             */
            join: function(iter, on) {
                this._join = function() {

                };
                throw new Error('Not Implemented');
            },
            /**
             * @method select
             * @param expr
             * @returns {Array}
             */
            select: function(expr) {
                var arr = this.toArray();
                if (nx.is(expr, 'Function')) {
                    return map.call(arr, expr);
                }
                else if (nx.is(expr, 'String')) {
                    return map.call(arr, function(item) {
                        return nx.path(item, expr);
                    });
                }
                else if (nx.is(expr, 'Array')) {
                    return map.call(arr, function(item) {
                        var result = {};
                        nx.each(expr, function(path) {
                            nx.path(result, path, nx.path(item, path));
                        });

                        return result;
                    });
                }
                else {
                    return arr;
                }
            },
            /**
             * @method first
             * @param expr
             * @returns {any}
             */
            first: function(expr) {
                var arr = this.toArray();
                if (expr) {
                    for (var i = 0, length = arr.length; i < length; i++) {
                        var item = arr[i];
                        if (expr(item)) {
                            return item;
                        }
                    }
                }
                else {
                    return arr[0];
                }
            },
            /**
             * @method last
             * @param expr
             * @returns {any}
             */
            last: function(expr) {
                var arr = this.toArray();
                if (expr) {
                    for (var i = arr.length - 1; i >= 0; i--) {
                        var item = arr[i];
                        if (expr(item)) {
                            return item;
                        }
                    }
                }
                else {
                    return arr[arr.length - 1];
                }
            },
            /**
             * @method all
             * @param expr
             * @returns {Boolean}
             */
            all: function(expr) {
                return every.call(this.toArray(), expr);
            },
            /**
             * @method any
             * @param expr
             * @returns {Boolean}
             */
            any: function(expr) {
                return some.call(this.toArray(), expr);
            },
            /**
             * @method max
             * @param expr
             * @returns {Number}
             */
            max: function(expr) {
                return reduce.call(this.toArray(), function(pre, cur, index, arr) {
                    return pre > cur ? pre : cur;
                });
            },
            /**
             * @method min
             * @param expr
             * @returns {Number}
             */
            min: function(expr) {
                return reduce.call(this.toArray(), function(pre, cur, index, arr) {
                    return pre < cur ? pre : cur;
                });
            },
            /**
             * @method sum
             * @param expr
             * @returns {Number}
             */
            sum: function(expr) {
                return reduce.call(this.toArray(), function(pre, cur, index, arr) {
                    return pre + cur;
                });
            },
            /**
             * @method average
             * @param expr
             * @returns {Number}
             */
            average: function(expr) {
                var arr = this.toArray();
                return reduce.call(arr, function(pre, cur, index, arr) {
                    return pre + cur;
                }) / arr.length;
            },
            /**
             * @method toArray
             * @returns {Array}
             */
            toArray: function() {
                var arr = Iterable.toArray(this._iter);

                nx.each(this._unions, function(union) {
                    arr.concat(Iterable.toArray(union));
                });

                if (this._where) {
                    arr = filter.call(arr, this._where);
                }

                if (this._orderBy) {
                    arr = arr.sort(this._orderBy);
                }

                if (this._end > 0) {
                    arr = arr.slice(this._begin, this._end);
                }
                else {
                    arr = arr.slice(this._begin);
                }

                this.reset();
                return arr;
            }
        }
    });
})(nx);
(function(nx) {
    //@https://github.com/yui/yui3/blob/master/src/yui/js/yui-ua.js
    var window = nx.global,
        document = window.document,
        documentMode = document.documentMode || 0,
        compatMode = document.compatMode,
        navigator = window.navigator,
        location = window.location,
        userAgent = navigator.userAgent.toLowerCase(),
        protocol = location.protocol.toLowerCase();
    var tempElement = document.createElement('div'),
        tempStyle = tempElement.style,
        result,
        ie = (result = userAgent.match(/msie (\d+)\./)) && result[1];

    //test opacity:
    tempStyle.cssText = "opacity:.55";

    var vendorPrefixMap = {
        'webkit': ['webkit', '-webkit-'],
        'gecko': ['Moz', '-moz-'],
        'presto': ['O', '-o-'],
        'trident': ['ms', '-ms-']
    };

    var osPatternMap = {
        'windows': /windows|win32/,
        'macintosh': /macintosh|mac_powerpc/,
        'linux': /linux/
    };

    var browserPatternMap = {
        ie: {
            is: 'msie',
            exclude: 'opera',
            version: 'msie '
        },
        firefox: {
            is: 'gecko',
            exclude: 'webkit',
            version: '\\bfirefox\/'
        },
        chrome: {
            is: '\\bchrome\\b',
            exclude: null,
            version: '\\bchrome\/'
        },
        safari: {
            is: 'safari',
            exclude: '\\bchrome\\b',
            version: 'version\/'
        },
        opera: {
            is: 'opera',
            exclude: null,
            version: 'version\/'
        }
    };


    var supportMap = {
        addEventListener: !!document.addEventListener,
        dispatchEvent: !!document.dispatchEvent,
        getBoundingClientRect: !!document.documentElement.getBoundingClientRect,
        onmousewheel: 'onmousewheel' in document,
        XDomainRequest: !!window.XDomainRequest,
        crossDomain: !!(window.XDomainRequest || window.XMLHttpRequest),
        getComputedStyle: 'getComputedStyle' in window,
        iePropertyChange: !!(ie && ie < 9),
        w3cChange: !ie || ie > 8,
        w3cFocus: !ie || ie > 8,
        w3cInput: !ie || ie > 9,
        innerText: 'innerText' in tempElement,
        firstElementChild: 'firstElementChild' in tempElement,
        cssFloat: 'cssFloat' in tempStyle,
        opacity: (/^0.55$/).test(tempStyle.opacity),
        filter: 'filter' in tempStyle,
        classList: !!tempElement.classList,
        removeProperty: 'removeProperty' in tempStyle
    };

    var engineMap = {
        firefox: function() {
            return {
                name: 'gecko',
                version: getVersion('rv:')
            };
        },
        opera: function() {
            var version = getVersion('presto\\/');
            var engineName = 'presto';
            if (!version) {
                engineName = 'webkit';
                version = getVersion('webkit\\/');
            }
            return {
                name: engineName,
                version: version
            };
        },
        ie: function() {
            return {
                name: 'trident',
                version: getVersion('trident\\/') || 4
            };
        },
        'default': function() {
            return {
                name: 'webkit',
                version: getVersion('webkit\\/')
            };
        }
    };

    function getVersion(pattern) {
        var regexp = new RegExp(pattern + '(\\d+\\.\\d+)');
        var regexResult;
        return (regexResult = regexp.exec(userAgent)) ? parseFloat(regexResult[1]) : 0;
    }

    var os = (function() {
        var osName;
        for (osName in osPatternMap) {
            if (osPatternMap[osName].test(userAgent)) {
                break;
            }
        }
        return {
            name: osName
        };
    })();

    var browser = (function() {
        var browserName,
            item,
            checkIs,
            checkExclude,
            browserVersion = 0;

        for (browserName in browserPatternMap) {
            item = browserPatternMap[browserName];
            checkIs = (new RegExp(item.is)).test(userAgent);
            checkExclude = (new RegExp(item.exclude)).test(userAgent);
            if (checkIs && !checkExclude) {
                if (userAgent.indexOf('opr/') > -1) {
                    browserName = 'opera';
                    item.version = '\\bopr\/';
                }
                browserVersion = getVersion(item.version);
                break;
            }
        }

        return {
            name: browserName,
            version: browserVersion
        };
    })();

    var engine = (engineMap[browser] || engineMap['default'])();

    /**
     * Environment and check behavior support
     * @class nx.Env
     * @constructor
     */
    nx.define('nx.Env', {
        static: true,
        properties: {
            /**
             * Document mode
             * @property documentMode
             * @type {Number}
             * @default 0
             */
            documentMode: {
                value: documentMode
            },
            /**
             * Document compatMode
             * @property compatMode
             * @type {String}
             * @default "CSS1Compat"
             */
            compatMode: {
                value: compatMode
            },
            /**
             * User agent string
             * @property userAgent
             * @type {String}
             * @default ""
             */
            userAgent: {
                value: userAgent
            },
            /**
             * Browser render model CSS1Compat
             * @property strict
             * @type {Boolean}
             * @default true
             */
            strict: {
                value: compatMode === 'CSS1Compat'
            },
            /**
             * If it is secure
             * @property strict
             * @type {Boolean}
             * @default false
             */
            secure: {
                value: protocol.indexOf('https') === 0
            },
            /**
             * Get operating system information
             * @property os
             * @type {Object}
             * @default {}
             */
            os: {
                value: os
            },
            /**
             * Get specific prefix
             * @property prefix
             * @type {Array}
             * @default ['webkit','-webkit-']
             */
            prefix: {
                value: vendorPrefixMap[engine.name]
            },
            /**
             * Get browser's render engine information
             * @property engine
             * @type {Object}
             * @default {}
             */
            engine: {
                value: engine
            },
            /**
             * Get basic browser information
             * @property browser
             * @type {Object}
             * @default {}
             */
            browser: {
                value: browser
            }
        },
        methods: {
            /**
             * Whether the property is support
             * @method support
             * @param inName
             * @returns {*}
             */
            support: function(inName) {
                return supportMap[inName];
            },
            /**
             * Support map for debug
             * @method getSupportMap
             * @returns {{addEventListener: boolean, dispatchEvent: boolean, getBoundingClientRect: boolean, onmousewheel: boolean, XDomainRequest: boolean, crossDomain: boolean, getComputedStyle: boolean, iePropertyChange: boolean, w3cChange: boolean, w3cFocus: boolean, w3cInput: boolean, innerText: boolean, firstElementChild: boolean, cssFloat: boolean, opacity: boolean, filter: boolean, removeProperty: boolean}}
             */
            getSupportMap: function() {
                return supportMap;
            },
            /**
             * Register a support item
             * @method registerSupport
             * @param inName
             * @param inValue
             */
            registerSupport: function(inName, inValue) {
                if (!(inName in supportMap)) {
                    supportMap[inName] = inValue;
                }
            }
        }
    });

})(nx);
(function(nx) {
    var global = nx.global,
        document = global.document,
        env = nx.Env;

    var tempElement = document.createElement('div'),
        tempStyle = tempElement.style;
    var rsizeElement = /width|height|top|right|bottom|left|size|margin|padding/i,
        rHasUnit = /[c-x%]/,
        PX = 'px',
        rUpperCameCase = /(?:^|-)([a-z])/g,
        rDeCameCase = /([A-Z])/g;

    var cssNumber = {
        'lineHeight': true,
        'zIndex': true,
        'zoom': true
    };


    var styleHooks = {
        float: 'cssFloat'
    };

    var stylePropCache = {};
    var styleNameCache = {};

    /**
     * This is Util
     * @class nx.Util
     * @constructor
     */
    var util = nx.define('nx.Util', {
        static: true,
        methods: {
            /**
             * Get a string which is join by an style object.
             * @method getCssText
             * @param inStyles
             * @returns {string}
             */
            getCssText: function(inStyles) {
                var cssText = [''];
                nx.each(inStyles, function(styleValue, styleName) {
                    cssText.push(this.getStyleProperty(styleName, true) + ':' + this.getStyleValue(styleName, styleValue));
                }, this);
                return cssText.join(';');
            },
            /**
             * Get real value of the style name.
             * @method getStyleValue
             * @param inName
             * @param inValue
             * @returns {*}
             */
            getStyleValue: function(inName, inValue) {
                var property = this.getStyleProperty(inName);
                var value = inValue;
                if (rsizeElement.test(property)) {
                    if (!rHasUnit.test(inValue) && !cssNumber[property]) {
                        value += PX;
                    }
                }
                return value;
            },
            /**
             * Get compatible css property.
             * @method getStyleProperty
             * @param inName
             * @param isLowerCase
             * @returns {*}
             */
            getStyleProperty: function(inName, isLowerCase) {
                if (isLowerCase) {
                    if (inName in styleNameCache) {
                        return styleNameCache[inName];
                    }
                }
                else {
                    if (inName in stylePropCache) {
                        return stylePropCache[inName];
                    }
                }

                var property = styleHooks[inName] || this.lowerCamelCase(inName);
                if (property in tempStyle) {
                    if (isLowerCase) {
                        property = this.deCamelCase(inName);
                        styleNameCache[inName] = property;
                    }
                } else {
                    if (isLowerCase) {
                        property = env.prefix()[1] + inName;
                        styleNameCache[inName] = property;
                    } else {
                        property = env.prefix()[0] + this.upperCamelCase(inName);
                        stylePropCache[inName] = property;
                    }
                }
                return property;
            },
            /**
             * Lower camel case.
             * @method lowerCamelCase
             * @param inName
             * @returns {string}
             */
            lowerCamelCase: function(inName) {
                var _camelizeString = this.upperCamelCase(inName);
                return _camelizeString.charAt(0).toLowerCase() + _camelizeString.substring(1);
            },
            /**
             * Upper camel case.
             * @method upperCamelCase
             * @param inName
             * @returns {*|string|void}
             */
            upperCamelCase: function(inName) {
                return inName.replace(rUpperCameCase, function(match, group1) {
                    return group1.toUpperCase();
                });
            },
            /**
             * Decode camel case to '-' model.
             * @method deCamelCase
             * @param inName
             * @returns {*|string|void}
             */
            deCamelCase: function(inName) {
                return inName.replace(rDeCameCase, function(match, group1) {
                    return '-' + group1.toLowerCase();
                });
            },
            /**
             * Upper first word of a string.
             * @method capitalize
             * @param inString
             * @returns {string}
             */
            capitalize: function(inString) {
                return inString.charAt(0).toUpperCase() + inString.slice(1);
            }
        }
    });
})(nx);
(function(nx) {
    /**
     * Ajax http client
     * @class nx.HttpClient
     * @constructor
     */
    var HttpClient = nx.define('nx.HttpClient', {
        static: true,
        methods: {
            /**
             * Ajax send.
             * @method send
             * @param options
             */
            send: function(options) {
                var xhr = new XMLHttpRequest();
                var callback = options.callback || function() {
                };

                xhr.open(
                        options.method || 'GET',
                    options.url,
                    true
                );

                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4) {
                        var type = xhr.getResponseHeader('Content-Type');
                        var result = (type.indexOf('application/json') >= 0) ? JSON.parse(xhr.responseText) : xhr.responseText;
                        callback(result);
                    }
                };

                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(nx.is(options.data, 'Object') ? JSON.stringify(options.data) : options.data);
            },
            /**
             * Get request
             * @method GET
             * @param url
             * @param callback
             * @constructor
             */
            GET: function(url, callback) {
                this.send({
                    url: url,
                    method: 'GET',
                    callback: callback
                });
            },
            /**
             * Post request
             * @method POST
             * @param url
             * @param data
             * @param callback
             * @constructor
             */
            POST: function(url, data, callback) {
                this.send({
                    url: url,
                    method: 'POST',
                    data: data,
                    callback: callback
                });
            },
            /**
             * Put request
             * @method PUT
             * @param url
             * @param data
             * @param callback
             * @constructor
             */
            PUT: function(url, data, callback) {
                this.send({
                    url: url,
                    method: 'PUT',
                    data: data,
                    callback: callback
                });
            },
            /**
             * Delete request
             * @method DELETE
             * @param url
             * @param callback
             * @constructor
             */
            DELETE: function(url, callback) {
                this.send({
                    url: url,
                    method: 'DELETE',
                    callback: callback
                });
            }
        }
    });
})(nx);
(function(nx) {
    var Collection = nx.data.Collection;
    /**
     * Dom Node
     * @class nx.dom.Node
     * @constructor
     */
    var Node = nx.define('nx.dom.Node', nx.Comparable, {
        methods: {
            /**
             * Set $dom as an attribute for node
             * @param node
             */
            init: function(node) {
                this.$dom = node;
            },
            /**
             * Whether target is current dom element
             * @param target
             * @returns {number}
             */
            compare: function(target) {
                if (target && this.$dom === target.$dom) {
                    return 0;
                }
                else {
                    return -1;
                }
            },
            /**
             * Whether target is a element
             * @returns {boolean}
             */
            isElement: function() {
                return this.$dom.nodeType === 1;
            },
            /**
             * Get current element's index
             * @returns {number}
             */
            index: function() {
                var node,
                    index = 0;
                if (this.parentNode() !== null) {
                    while ((node = this.previousSibling()) !== null) {
                        ++index;
                    }
                } else {
                    index = -1;
                }
                return index;
            },
            /**
             * Get the index child element
             * @param inIndex
             * @returns {null}
             */
            childAt: function(inIndex) {
                var node = null;
                if (inIndex >= 0) {
                    node = this.firstChild();
                    while (node && --inIndex >= 0) {
                        node = node.nextSibling();
                        break;
                    }
                }
                return node;
            },
            /**
             * Compare dom element position
             * @param inTarget
             * @returns {*}
             */
            contains: function(inTarget) {
                return this.$dom.contains(inTarget.$dom);
            },
            /**
             * Get first element child
             * @returns {this.constructor}
             */
            firstChild: function() {
                return new this.constructor(this.$dom.firstElementChild);
            },
            /**
             * Get last element child
             * @returns {this.constructor}
             */
            lastChild: function() {
                return new this.constructor(this.$dom.lastElementChild);
            },
            /**
             * Get previous element
             * @returns {this.constructor}
             */
            previousSibling: function() {
                return new this.constructor(this.$dom.previousElementSibling);
            },
            /**
             * Get next element
             * @returns {this.constructor}
             */
            nextSibling: function() {
                return new this.constructor(this.$dom.nextElementSibling);
            },
            /**
             * Get parent element
             * @returns {this.constructor}
             */
            parentNode: function() {
                return new this.constructor(this.$dom.parentNode);
            },
            /**
             * Get element children
             * @returns {nx.data.Collection}
             */
            children: function() {
                var result = new Collection();
                nx.each(this.$dom.children, function(child) {
                    result.add(new this.constructor(child));
                }, this);
                return result;
            },
            /**
             * Clone an element node
             * @param deep
             * @returns {this.constructor}
             */
            cloneNode: function(deep) {
                return new this.constructor(this.$dom.cloneNode(deep));
            },
            /**
             * Whether the element has child.
             * @param child
             * @returns {boolean}
             */
            hasChild: function(child) {
                return child.$dom.parentNode == this.$dom;
            },
            /**
             * Adds a node to the end of the list of children of a specified parent node
             * @param child
             */
            appendChild: function(child) {
                this.$dom.appendChild(child.$dom);
            },
            /**
             * Inserts the specified node before a reference element as a child of the current node
             * @param child
             * @param ref
             */
            insertBefore: function(child, ref) {
                this.$dom.insertBefore(child.$dom, ref.$dom);
            },
            /**
             * Removes a child node from the DOM
             * @param child
             */
            removeChild: function(child) {
                if (this.hasChild(child)) {
                    this.$dom.removeChild(child.$dom);
                }
            },
            /**
             * Remove all child nodes
             */
            empty: function() {
                this.children().each(function(child) {
                    this.removeChild(child);
                }, this);
            }
        }
    });
})(nx);
(function(nx) {
    /**
     * Text Node
     * @class nx.dom.Text
     * @constructor
     */
    nx.define('nx.dom.Text', nx.dom.Node);
})(nx);
(function(nx) {
    var global = nx.global,
        document = global.document,
        env = nx.Env,
        util = nx.Util;
    var rTableElement = /^t(?:able|d|h)$/i,
        rBlank = /\s+/,
        borderMap = {
            thin: '2px',
            medium: '4px',
            thick: '6px'
        },
        isGecko = env.engine().name === 'gecko';
    var MARGIN = 'margin',
        PADDING = 'padding',
        BORDER = 'border',
        POSITION = 'position',
        FIXED = 'fixed';

    var Collection = nx.data.Collection;
    //======attrHooks start======//
    var attrHooks = {
        value: {
            set: function(inElement, inValue) {
                var type = inElement.type;
                switch (type) {
                    case 'checkbox':
                    case 'radio':
                        inElement.checked = !!inValue;
                        break;
                    default:
                        inElement.value = inValue;
                }
            },
            get: function(inElement) {
                var type = inElement.type;
                var value = inElement.value;
                switch (type) {
                    case 'checkbox':
                    case 'radio':
                        value = !!inElement.checked;
                        break;
                    default:
                        value = inElement.value;
                }
                return value;
            }
        }
    };
    var baseAttrHooks = {
        'class': 'className',
        'for': 'htmlFor'
    };
    var booleanAttrHooks = {
        disabled: 'disabled',
        readonly: 'readonly',
        checked: 'checked'
    };
    //registerAttrHooks for Element
    (function registerAttrHooks() {

        //baseAttrHooks
        nx.each(baseAttrHooks, function(hookValue, hookKey) {
            attrHooks[hookKey] = {
                set: function(inElement, inValue) {
                    inElement[hookValue] = inValue;
                },
                get: function(inElement) {
                    return inElement[hookValue];
                }
            };
        });

        //booleanAttrHooks
        nx.each(booleanAttrHooks, function(hookValue, hookKey) {
            attrHooks[hookKey] = {
                set: function(inElement, inValue) {
                    if (!inValue) {
                        inElement.removeAttribute(hookKey);
                    } else {
                        inElement.setAttribute(hookKey, hookKey);
                    }
                    inElement[hookValue] = !!inValue;
                },
                get: function(inElement) {
                    return !!inElement[hookValue];
                }
            };
        });
    }());


    function getClsPos(inElement, inClassName) {
        return (' ' + inElement.className + ' ').indexOf(' ' + inClassName + ' ');
    }

    //======attrHooks end ======//
    /**
     * Dom Element
     * @class nx.dom.Element
     * @constructor
     */
    var Element = nx.define('nx.dom.Element', nx.dom.Node, {
        methods: {
            /**
             * Get an attribute from element
             * @method get
             * @param name
             * @returns {*}
             */
            get: function(name) {
                if (name === 'text') {
                    return this.getText();
                }
                else if (name == 'html') {
                    return this.getHtml();
                }
                else {
                    return this.getAttribute(name);
                }
            },
            /**
             * Set an attribute for an element
             * @method set
             * @param name
             * @param value
             */
            set: function(name, value) {
                if (name === 'text') {
                    this.setText(value);
                }
                else if (name == 'html') {
                    this.setHtml(value);
                }
                else {
                    this.setAttribute(name, value);
                }
            },
            /**
             * Get an element by selector.
             * @method get
             * @param inSelector
             * @returns {HTMLElement}
             */
            select: function(inSelector) {
                var element = this.$dom.querySelector(inSelector);
                return new Element(element);
            },
            /**
             * Get a collection by selector
             * @method selectAll
             * @param inSelector
             * @returns {nx.data.Collection}
             */
            selectAll: function(inSelector) {
                var elements = this.$dom.querySelectorAll(inSelector),
                    i = 0,
                    element = elements[i];
                var nxElements = new Collection();
                for (; element; i++) {
                    element = elements[i];
                    nxElements.add(new Element(element));
                }
                return nxElements;
            },
            /**
             * Focus an element
             * @method focus
             */
            focus: function() {
                this.$dom.focus();
            },
            /**
             * Blur form an element
             * @method blur
             */
            blur: function() {
                this.$dom.blur();
            },
            /**
             * Show an element
             * @method show
             */
            show: function() {
                this.setAttribute('nx-status', '');
            },
            /**
             * Hide an element
             * @method hide
             */
            hide: function() {
                this.setAttribute('nx-status', 'hidden');
            },
            /**
             * Whether the element has the class
             * @method hasClass
             * @param inClassName
             * @returns {boolean}
             */
            hasClass: function(inClassName) {
                var element = this.$dom;
                if (nx.Env.support('classList')) {
                    return this.$dom.classList.contains(inClassName);
                } else {
                    return getClsPos(element, inClassName) > -1;
                }
            },
            /**
             * Add class for element
             * @method addClass
             * @returns {*}
             */
            addClass: function() {
                var element = this.$dom;
                var args = arguments,
                    classList = element.classList;
                if (nx.Env.support('classList')) {
                    if (args.length === 1 && args[0].search(rBlank) > -1) {
                        args = args[0].split(rBlank);
                    }
                    return classList.add.apply(classList, args);
                } else {
                    if (!this.hasClass(args[0])) {
                        var curCls = element.className;
                        /* jslint -W093 */
                        return element.className = curCls ? (curCls + ' ' + args[0]) : args[0];
                    }
                }
            },
            /**
             * Remove class from element
             * @method removeClass
             * @returns {*}
             */
            removeClass: function() {
                var element = this.$dom;
                if (nx.Env.support('classList')) {
                    var classList = this.$dom.classList;
                    return classList.remove.apply(classList, arguments);
                } else {
                    var curCls = element.className,
                        index = getClsPos(element, arguments[0]),
                        className = arguments[0];
                    if (index > -1) {
                        if (index === 0) {
                            if (curCls !== className) {
                                className = className + ' ';
                            }
                        } else {
                            className = ' ' + className;
                        }
                        element.className = curCls.replace(className, '');
                    }
                }
            },
            /**
             * Toggle a class on element
             * @method toggleClass
             * @param inClassName
             * @returns {*}
             */
            toggleClass: function(inClassName) {
                var element = this.$dom;
                if (nx.Env.support('classList')) {
                    return this.$dom.classList.toggle(inClassName);
                } else {
                    if (this.hasClass(inClassName)) {
                        this.removeClass(inClassName);
                    } else {
                        this.addClass(inClassName);
                    }
                }
            },
            /**
             * Get document
             * @method getDocument
             * @returns {*}
             */
            getDocument: function() {
                var element = this.$dom;
                var doc = document;
                if (element) {
                    doc = (element.nodeType === 9) ? element :  // element === document
                        element.ownerDocument ||  // element === DOM node
                        element.document; // element === window
                }
                return doc;
            },
            /**
             * Get window
             * @method getWindow
             * @returns {DocumentView|window|*}
             */
            getWindow: function() {
                var doc = this.getDocument();
                return doc.defaultView || doc.parentWindow || global;
            },
            /**
             * Get root element
             * @method getRoot
             * @returns {Element}
             */
            getRoot: function() {
                return env.strict() ? document.documentElement : document.body;
            },
            /**
             * Get element position information
             * @method getBound
             * @returns {{top: number, right: Number, bottom: Number, left: number, width: Number, height: Number}}
             */
            getBound: function() {
                var box = this.$dom.getBoundingClientRect(),
                    root = this.getRoot(),
                    clientTop = root.clientTop || 0,
                    clientLeft = root.clientLeft || 0;
                return {
                    top: box.top - clientTop,
                    right: box.right,
                    bottom: box.bottom,
                    left: box.left - clientLeft,
                    width: box.width,
                    height: box.height
                };
            },
            /**
             * Get margin distance information
             * @method margin
             * @param inDirection
             * @returns {*}
             */
            margin: function(inDirection) {
                return this._getBoxWidth(MARGIN, inDirection);
            },
            /**
             * Get padding distance information
             * @method padding
             * @param inDirection
             * @returns {*}
             */
            padding: function(inDirection) {
                return this._getBoxWidth(PADDING, inDirection);
            },
            /**
             * Get border width information
             * @method border
             * @param inDirection
             * @returns {*}
             */
            border: function(inDirection) {
                return this._getBoxWidth(BORDER, inDirection);
            },
            /**
             * Get offset information
             * @method getOffset
             * @returns {{top: number, left: number}}
             */
            getOffset: function() {
                var box = this.$dom.getBoundingClientRect(),
                    root = this.getRoot(),
                    clientTop = root.clientTop || 0,
                    clientLeft = root.clientLeft || 0;
                return {
                    'top': box.top + (global.pageYOffset || root.scrollTop) - clientTop,
                    'left': box.left + (global.pageXOffset || root.scrollLeft) - clientLeft
                };
            },
            /**
             * Set offset style
             * @method setOffset
             * @param inStyleObj
             */
            setOffset: function(inStyleObj) {
                var elPosition = this.getStyle(POSITION), styleObj = inStyleObj;
                var scrollXY = {
                    left: Math.max((global.pageXOffset || 0), root.scrollLeft),
                    top: Math.max((global.pageYOffset || 0), root.scrollTop)
                };
                if (elPosition === FIXED) {
                    styleObj = {
                        left: parseFloat(styleObj) + scrollXY.scrollX,
                        top: parseFloat(styleObj) + scrollXY.scrollY
                    };
                }
                this.setStyles(styleObj);
            },
            /**
             * Has in line style
             * @method hasStyle
             * @param inName
             * @returns {boolean}
             */
            hasStyle: function(inName) {
                var cssText = this.$dom.style.cssText;
                return cssText.indexOf(inName + ':') > -1;
            },
            /**
             * Get computed style
             * @method getStyle
             * @param inName
             * @param isInline
             * @returns {*}
             */
            getStyle: function(inName, isInline) {
                var property = util.getStyleProperty(inName);
                if (isInline) {
                    return this.$dom.style[property];
                } else {
                    var styles = getComputedStyle(this.$dom, null);
                    return styles[property] || '';
                }
            },
            /**
             * Set style for element
             * @method setStyle
             * @param inName
             * @param inValue
             */
            setStyle: function(inName, inValue) {
                var property = util.getStyleProperty(inName);
                this.$dom.style[property] = util.getStyleValue(inName, inValue);
            },
            /**
             * Remove inline style
             * @method removeStyle
             * @param inName
             */
            removeStyle: function(inName) {
                var property = util.getStyleProperty(inName, true);
                this.$dom.style.removeProperty(property);
            },
            /**
             * Set style by style object
             * @method setStyles
             * @param inStyles
             */
            setStyles: function(inStyles) {
                this.$dom.style.cssText += util.getCssText(inStyles);
            },
            /**
             * Get attribute
             * @method getAttribute
             * @param inName
             * @returns {*}
             */
            getAttribute: function(inName) {
                var hook = attrHooks[inName];
                if (hook) {
                    if (hook.get) {
                        return hook.get(this.$dom);
                    } else {
                        return this.$dom.getAttribute(hook);
                    }
                }
                return this.$dom.getAttribute(inName);
            },
            /**
             * Set attribute
             * @method setAttribute
             * @param inName
             * @param inValue
             * @returns {*}
             */
            setAttribute: function(inName, inValue) {
                if (inValue !== null && inValue !== undefined) {
                    var hook = attrHooks[inName];
                    if (hook) {
                        if (hook.set) {
                            return hook.set(this.$dom, inValue);
                        } else {
                            return this.$dom.setAttribute(hook, inValue);
                        }
                    }
                    return this.$dom.setAttribute(inName, inValue);
                }
            },
            /**
             * Remove attribute
             * @method removeAttribute
             * @param inName
             */
            removeAttribute: function(inName) {
                this.$dom.removeAttribute(baseAttrHooks[inName] || inName);
            },
            /**
             * Get all attributes
             * @method getAttributes
             * @returns {{}}
             */
            getAttributes: function() {
                var attrs = {};
                nx.each(this.$dom.attributes, function(attr) {
                    attrs[attr.name] = attr.value;
                });
                return attrs;
            },
            /**
             * Set attributes
             * @method setAttributes
             * @param attrs
             */
            setAttributes: function(attrs) {
                nx.each(attrs, function(value, key) {
                    this.setAttribute(key, value);
                }, this);
            },
            /**
             * Get inner text
             * @method getText
             * @returns {*}
             */
            getText: function() {
                return this.$dom.textContent;
            },
            /**
             * Set inner text
             * @method setText
             * @param text
             */
            setText: function(text) {
                this.$dom.textContent = text;
            },
            /**
             * Get inner html
             * @method getHtml
             * @returns {*|string}
             */
            getHtml: function() {
                return this.$dom.innerHTML;
            },
            /**
             * Set inner html
             * @method setHtml
             * @param html
             */
            setHtml: function(html) {
                this.$dom.innerHTML = html;
            },
            /**
             * Add event listener
             * @method addEventListener
             * @param name
             * @param listener
             * @param useCapture
             */
            addEventListener: function(name, listener, useCapture) {
                this.$dom.addEventListener(name, listener, useCapture || false);
            },
            /**
             * Remove event listener
             * @method removeEventListener
             * @param name
             * @param listener
             * @param useCapture
             */
            removeEventListener: function(name, listener, useCapture) {
                this.$dom.removeEventListener(name, listener, useCapture || false);
            },
            _getBoxWidth: function(inBox, inDirection) {
                var boxWidth, styleResult;
                var element = this.$dom;
                switch (inBox) {
                    case PADDING:
                    case MARGIN:
                        styleResult = this.getStyle(inBox + "-" + inDirection);
                        boxWidth = parseFloat(styleResult);
                        break;
                    default:
                        styleResult = this.getStyle('border-' + inDirection + '-width');
                        if (isGecko) {
                            if (rTableElement.test(element.tagName)) {
                                styleResult = 0;
                            }
                        }
                        boxWidth = parseFloat(styleResult) || borderMap[styleResult];
                }
                return boxWidth || 0;
            }
        }
    });
})(nx);
(function(nx) {

    var Collection = nx.data.Collection;
    /**
     * Dom Fragment
     * @class nx.dom.Fragment
     * @constructor
     */
    nx.define('nx.dom.Fragment', nx.dom.Node, {
        methods: {
            /**
             * Get collection child nodes.
             * @returns {nx.data.Collection}
             */
            children: function() {
                var result = new Collection();
                nx.each(this.$dom.childNodes, function(child) {
                    result.add(new this.constructor(child));
                }, this);
                return result;
            }
        }
    });
})(nx);
(function(nx) {
    var Element = nx.dom.Element;
    var Fragment = nx.dom.Fragment;
    var Text = nx.dom.Text,
        global = nx.global,
        document = global.document,
        util = nx.Util;

    var readyModel = {
        topFrame: null,
        hasReady: false,
        queue: []
    };

    var readyService = {
        setHasReady: function(inValue) {
            readyModel.hasReady = inValue;
        },
        getHasReady: function() {
            return readyModel.hasReady;
        },
        addQueue: function(inHandler) {
            readyModel.queue.push(inHandler);
        },
        clearQueue: function() {
            readyModel.queue.length = 0;
        },
        execQueue: function() {
            var i = 0,
                length = readyModel.queue.length;
            for (; i < length; i++) {
                readyModel.queue[i]();
            }
        },
        setTopFrame: function(inValue) {
            readyModel.topFrame = inValue;
        },
        getTopFrame: function() {
            return readyModel.topFrame;
        }
    };

    var readyController = {
        initReady: function(inHandler) {
            readyService.addQueue(inHandler); //save the event
            return readyController.isReady();
        },
        fireReady: function() {
            readyService.execQueue();
            readyService.clearQueue();
        },
        setTopFrame: function() {
            // If IE and not a frame
            // continually check to see if the document is ready
            try {
                readyService.setTopFrame(global.frameElement === null && document.documentElement);
            } catch (e) {
            }
        },
        doScrollCheck: function() {
            var topFrame = readyService.getTopFrame();
            if (topFrame && topFrame.doScroll) {
                try {
                    // Use the trick by Diego Perini
                    // http://javascript.nwbox.com/IEContentLoaded/
                    topFrame.doScroll("left");
                } catch (e) {
                    return setTimeout(readyController.doScrollCheck, 50);
                }

                // and execute any waiting functions
                readyController.fireReady();
            }
        },
        isOnLoad: function(inEvent) {
            return (inEvent || global.event).type === 'load';
        },
        isReady: function() {
            return readyService.getHasReady() || document.readyState === "complete";
        },
        detach: function() {
            if (document.addEventListener) {
                document.removeEventListener("DOMContentLoaded", readyController.completed, false);
                global.removeEventListener("load", readyController.completed, false);
            } else {
                document.detachEvent("onreadystatechange", readyController.completed);
                global.detachEvent("onload", readyController.completed);
            }
        },
        w3cReady: function() {
            document.addEventListener('DOMContentLoaded', readyController.completed, false);
            global.addEventListener('load', readyController.completed, false);
        },
        ieReady: function() {
            document.attachEvent("onreadystatechange", readyController.completed);
            global.attachEvent("onload", readyController.completed);
            readyController.setTopFrame();
            readyController.doScrollCheck();
        },
        readyMain: function() {
            if (document.readyState === "complete") {
                return setTimeout(readyController.readyMain);
            } else {
                if (document.addEventListener) {
                    //w3c
                    readyController.w3cReady();
                } else {
                    //old ie
                    readyController.ieReady();
                }
            }
        },
        completed: function(inEvent) {
            if (readyController.isReady() || readyController.isOnLoad(inEvent)) {
                readyService.setHasReady(true);
                readyController.detach();
                readyController.fireReady();
            }
        }
    };

    var nsMap = {
        svg: "http://www.w3.org/2000/svg",
        xlink: "http://www.w3.org/1999/xlink"
    };

    /**
     * Document Element
     * @class nx.dom.Document
     * @constructor
     */
    var Document = nx.define('nx.dom.Document', {
        static: true,
        properties: {
            /**
             * Get/set next cssStyle sheet
             * @property cssStyleSheet
             * @type {Object}
             * @default {}
             */
            cssStyleSheet: {
                get: function() {
                    var nxCssStyleSheet = this._cssStyleSheet;
                    if (!nxCssStyleSheet) {
                        var styleNode = document.getElementById('nx-style') || this._createStyleNode();
                        nxCssStyleSheet = this._cssStyleSheet = this._getCSSStyleSheetInstance(styleNode);
                    }
                    return nxCssStyleSheet;
                }
            },
            /**
             * Get document root element
             * @property root
             * @type {Object}
             * @default {}
             */
            root: {
                get: function() {
                    return document.documentElement;
                }
            },
            /**
             * Get next body element
             * @property body
             * @type {Object}
             * @default {}
             */
            body: {
                get: function() {
                    return new Element(document.body);
                }
            },
            html: {
                get: function() {
                    return new Element(document.getElementsByTagName('html')[0]);
                }
            }
        },
        methods: {
            /**
             * Add an event listener
             * @method on
             * @param name
             * @param handler
             * @param context
             */
            on: function(name, handler, context) {
                this._attachDocumentListeners(name);
                this.inherited(name, handler, context);
            },
            /**
             * Add an event listener when you need not remove it.
             * @method upon
             * @param name
             * @param handler
             * @param context
             */
            upon: function(name, handler, context) {
                this._attachDocumentListeners(name);
                this.inherited(name, handler, context);
            },
            /**
             * Register html tag namespace
             * @method registerNS
             * @param key
             * @param value
             */
            registerNS: function(key, value) {
                nsMap[key] = value;
            },
            /**
             * Get a tag namespace value
             * @method resolveNS
             * @param key
             * @returns {*}
             */
            resolveNS: function(key) {
                return nsMap[key];
            },
            /**
             * Create document fragment
             * @method createFragment
             * @returns {nx.dom.Fragment}
             */
            createFragment: function() {
                return new Fragment(document.createDocumentFragment());
            },
            /**
             * Create element
             * @method createElement
             * @param tag
             * @returns {nx.dom.Element}
             */
            createElement: function(tag) {
                return new Element(document.createElement(tag));
            },
            /**
             * Create text node.
             * @method createText
             * @param text
             * @returns {nx.dom.Text}
             */
            createText: function(text) {
                return new Text(document.createTextNode(text));
            },
            /**
             * Create element by namespace
             * @method createElementNS
             * @param ns
             * @param tag
             * @returns {nx.dom.Element}
             */
            createElementNS: function(ns, tag) {
                var uri = Document.resolveNS(ns);
                if (uri) {
                    return new Element(document.createElementNS(uri, tag));
                }
                else {
                    throw new Error('The namespace ' + ns + ' is not registered.');
                }
            },
            /**
             * Wrap dom element to next element
             * @method wrap
             * @param dom
             * @returns {*}
             */
            wrap: function(dom) {
                if (nx.is(dom, Node)) {
                    return dom;
                }
                else {

                }
            },
            /**
             * Get document position information
             * @method docRect
             * @returns {{width: (Function|number), height: (Function|number), scrollWidth: *, scrollHeight: *, scrollX: *, scrollY: *}}
             */
            docRect: function() {
                var root = this.root(),
                    height = global.innerHeight || 0,
                    width = global.innerWidth || 0,
                    scrollW = root.scrollWidth,
                    scrollH = root.scrollHeight,
                    scrollXY = {
                        left: Math.max((global.pageXOffset || 0), root.scrollLeft),
                        top: Math.max((global.pageYOffset || 0), root.scrollTop)
                    };
                scrollW = Math.max(scrollW, width);
                scrollH = Math.max(scrollH, height);
                return {
                    width: width,
                    height: height,
                    scrollWidth: scrollW,
                    scrollHeight: scrollH,
                    scrollX: scrollXY.left,
                    scrollY: scrollXY.top
                };
            },
            /**
             * Dom ready
             * @method ready
             * @param inHandler
             */
            ready: function(inHandler) {
                //add handler to queue:
                if (readyController.initReady(inHandler)) {
                    setTimeout(readyController.fireReady, 1);
                } else {
                    readyController.readyMain();
                }
            },
            /**
             * Add a rule to next style sheet
             * @method addRule
             * @param inSelector
             * @param inCssText
             * @param inIndex
             * @returns {*}
             */
            addRule: function(inSelector, inCssText, inIndex) {
                return this._ruleAction('add', [inSelector, inCssText, inIndex]);
            },
            /**
             * insert a rule to next style sheet
             * @method insertRule
             * @param inFullCssText
             * @param inIndex
             * @returns {*}
             */
            insertRule: function(inFullCssText, inIndex) {
                return this._ruleAction('insert', [inFullCssText, inIndex]);
            },
            /**
             * Delete a rule from next style sheet at last line
             * @method deleteRule
             * @param inIndex
             * @returns {*}
             */
            deleteRule: function(inIndex) {
                return this._ruleAction('delete', [inIndex]);
            },
            /**
             * Remove a rule from next style sheet
             * @method removeRule
             * @param inSelector
             * @param inIndex
             * @returns {*}
             */
            removeRule: function(inSelector, inIndex) {
                return this._ruleAction('remove', [inSelector, inIndex]);
            },
            /**
             * Add multi rules
             * @method addRules
             * @param inRules
             */
            addRules: function(inRules) {
                nx.each(inRules, function(rule, selector) {
                    this.addRule(selector, util.getCssText(rule), null);
                }, this);
            },
            /**
             * Delete all rules
             * @method deleteRules
             */
            deleteRules: function() {
                var defLength = this.cssStyleSheet().rules.length;
                while (defLength--) {
                    this.deleteRule(0);
                }
            },
            _ruleAction: function(inAction, inArgs) {
                var styleSheet = this.cssStyleSheet();
                var lastIndex = inArgs.length - 1;
                //set default index
                inArgs[lastIndex] = this._defRuleIndex(styleSheet, inArgs[lastIndex]);
                styleSheet[inAction + 'Rule'].apply(styleSheet, inArgs);
                return this._defRuleIndex(styleSheet, null);
            },
            _defRuleIndex: function(inStyleSheet, inIndex) {
                return inIndex === null ? inStyleSheet.rules.length : inIndex;
            },
            _createStyleNode: function() {
                var styleNode = document.createElement("style");
                styleNode.type = "text/css";
                styleNode.id = "nx-style";
                (document.head || document.getElementsByTagName("head")[0] || document.documentElement).appendChild(styleNode);
                return styleNode;
            },
            _getCSSStyleSheetInstance: function(inStyleNode) {
                var styleSheets = document.styleSheets,
                    key,
                    sheet = null;
                for (key in styleSheets) {
                    sheet = styleSheets[key];
                    if (sheet.ownerNode === inStyleNode) {
                        break;
                    }
                }
                return sheet;
            },
            _attachDocumentListeners: function(name) {
                var documentListeners = this._documentListeners;
                if (!(name in documentListeners)) {
                    var self = this;
                    var listener = documentListeners[name] = function(event) {
                        self.fire(name, event);
                    };

                    document.addEventListener(name, listener);
                }
            }
        }
    });
})(nx);

(function(nx) {
    var global = nx.global;
    var Binding = nx.Binding;
    var Collection = nx.data.Collection;
    var Document = nx.dom.Document;

    function extractBindingExpression(value) {
        if (nx.is(value, 'String')) {
            var start = value.indexOf('{');
            var end = value.indexOf('}');

            if (start >= 0 && end > start) {
                return value.slice(start + 1, end);
            }
        }

        return null;
    }

    function setProperty(target, name, value, source, owner) {
        if (nx.is(value, Binding)) {
            target.setBinding(name, nx.extend(value.gets(), {
                bindingType: 'property'
            }));
        }
        else {
            var expr = extractBindingExpression(value);
            if (expr !== null) {
                if (expr[0] === '#') {
                    target.setBinding(name, expr.slice(1) + ',bindingType=property', owner || target);
                }
                else {
                    target.setBinding(name, (expr ? 'model.' + expr : 'model') + ',bindingType=property', source || target);
                }
            }
            else {
                target.set(name, value);
            }
        }
    }

    function setEvent(target, name, value, source, owner) {
        if (nx.is(value, Binding)) {
            target.setBinding(name, value.gets());
        }
        else {
            var expr = extractBindingExpression(value);
            if (expr !== null) {
                if (expr[0] === '#') {
                    target.setBinding(name, expr.slice(1) + ',bindingType=event', owner || target);
                }
                else {
                    target.setBinding(name, (expr ? 'model.' + expr : 'model') + ',bindingType=event', source || target);
                }
            }
            else {
                target.on(name, value, owner || target);
            }
        }
    }

    function createComponent(view, owner) {
        if (view) {
            var comp;
            if (nx.is(view, 'Array')) {
                comp = new DOMComponent('fragment');

                nx.each(view, function(child) {
                    createComponent(child, owner).attach(comp);
                });
            }
            else if (nx.is(view, 'Object')) {
                var type = view.type;
                if (type) {
                    var clazz = nx.is(type, 'String') ? nx.path(global, type) : type;
                    if (nx.is(clazz, 'Function')) {
                        comp = new clazz();
                    }
                    else {
                        throw new Error('Component "' + type + '" is not defined.');
                    }
                }
                else {
                    comp = new DOMComponent(view.tag || 'div');
                }

                var name = view.name;
                var props = view.props;
                var events = view.events;
                var content = view.content;

                if (name) {
                    comp.register('@name', name);
                }

                if (owner) {
                    comp.owner(owner);
                }

                nx.each(events, function(value, name) {
                    setEvent(comp, name, value, comp, owner);
                });

                nx.each(props, function(value, name) {
                    if (nx.is(value, 'Array')) {
                        nx.each(value, function(item) {
                            if (nx.is(item, 'Object')) {
                                item.__owner__ = owner;
                            }
                        });
                    }

                    if (nx.is(value, 'Object')) {
                        value.__owner__ = owner;
                    }

                    setProperty(comp, name, value, comp, owner);
                });

                if (content !== undefined) {
                    setProperty(comp, 'content', content, comp, owner);
                }
            }
            else if (view !== undefined) {
                comp = new DOMComponent('text', view);
            }

            return comp;
        }

        return null;
    }

    /**
     * @class Collection
     * @namespace nx.ui
     * @extends nx.Observable
     */
    var AbstractComponent = nx.define('nx.ui.AbstractComponent', nx.Observable, {
        abstract: true,
        statics: {
            /**
             * Create component by json view.
             * @method createComponent
             * @static
             */
            createComponent: createComponent
        },
        events: ['enter', 'leave', 'contententer', 'contentleave'],
        properties: {
            /**
             * @property count
             * @type {nx.data.Collection}
             */
            content: {
                get: function() {
                    return this._content;
                },
                set: function(value) {
                    nx.each(this._content.toArray(), function(c) {
                        c.destroy();
                    });
                    if (nx.is(value, AbstractComponent)) {
                        value.attach(this);
                    }
                    else if (nx.is(value, 'Array')) {
                        nx.each(value, function(v) {
                            createComponent(v, this.owner()).attach(this);
                        }, this);
                    }
                    else if (value) {
                        createComponent(value, this.owner()).attach(this);
                    }
                }
            },
            /**
             * @property model
             * @type {Any}
             */
            model: {
                get: function() {
                    return this._model || this._inheritedModel;
                },
                set: function(value, inherited) {
                    if (inherited) {
                        this._inheritedModel = value;
                    }
                    else {
                        this._model = value;
                    }

                    this._content.each(function(c) {
                        if (!nx.is(c, 'String')) {
                            c.model(value, true);
                        }
                    });
                }
            },
            /**
             * @property owner
             * @type {nx.ui.AbstractComponent}
             */
            owner: {
                value: null
            },
            /**
             * @property parent
             * @type {nx.ui.AbstractComponent}
             */
            parent: {
                value: null
            }
        },
        methods: {
            init: function() {
                this.inherited();
                this._resources = {};
                this._content = new Collection();
            },
            /**
             * Attach the component to parent.
             * @method attach
             * @param parent
             * @param index
             */
            attach: function(parent, index) {
                this.detach();

                if (nx.is(parent, AbstractComponent)) {
                    var name = this.resolve('@name');
                    var owner = this.owner() || parent;

                    if (name) {
                        owner.register(name, this);
                    }

                    this.onAttach(parent, index);
                    parent.onChildAttach(this, index);

                    if (index >= 0) {
                        parent.content().insert(this, index);
                    }
                    else {
                        parent.content().add(this);
                    }

                    this.parent(parent);
                    this.owner(owner);
                    parent.fire('contententer', {
                        content: this,
                        owner: owner
                    });
                    this.fire('enter', {
                        parent: parent,
                        owner: owner
                    });

                    this._attached = true;
                }
            },
            /**
             * Detach the component from parent.
             * @method detach
             */
            detach: function() {
                if (this._attached) {
                    var name = this.resolve('@name');
                    var owner = this.owner();
                    var parent = this.parent();

                    if (name) {
                        owner.unregister(name);
                    }

                    this.onDetach(parent);
                    parent.onChildDetach(this);
                    parent.content().remove(this);
                    this.parent(null);
                    this.owner(null);
                    parent.fire('contentleave', {
                        content: this,
                        owner: owner
                    });
                    this.fire('leave', {
                        parent: parent,
                        owner: owner
                    });
                    this._attached = false;
                }
            },
            /**
             * Register a resource.
             * @method register
             * @param name
             * @param value
             * @param force
             */
            register: function(name, value, force) {
                var resources = this._resources;
                if (!(name in resources) || force) {
                    resources[name] = value;
                }
            },
            /**
             * Unregister a resource.
             * @method unregister
             * @param name
             */
            unregister: function(name) {
                var resources = this._resources;
                if (name in resources) {
                    delete resources[name];
                }
            },
            /**
             * Resolve a resource.
             * @method resolve
             * @param name
             * @returns {Any}
             */
            resolve: function(name) {
                var resources = this._resources;
                if (resources && name in resources) {
                    return resources[name];
                }
            },
            /**
             * Get the container for component.
             * @method getContainer
             * @param comp
             * @returns {nx.dom.Element}
             */
            getContainer: function(comp) {
                if (this.resolve('@tag') === 'fragment') {
                    var parent = this.parent();
                    if (parent) {
                        return parent.getContainer(comp);
                    }
                }

                return this.resolve('@root');
            },
            /**
             * Dispose the component.
             * @method dispose
             */
            dispose: function() {
                this.inherited();
                if (this._content) {
                    this._content.each(function(content) {
                        content.dispose();
                    });
                }

                this._resources = null;
                this._content = null;
                this._model = null;
                this._inheritedModel = null;
                this.dispose = function() {
                };
            },
            /**
             * Destroy the component.
             * @method destroy
             */
            destroy: function() {
                this.detach();
                this.inherited();
            },
            /**
             * Template method for component attach.
             * @method onAttach
             */
            onAttach: function(parent, index) {
            },
            /**
             * Template method for component detach.
             * @method onDetach
             */
            onDetach: function(parent) {
            },
            /**
             * Template method for child component attach.
             * @method onChildAttach
             */
            onChildAttach: function(child, index) {
            },
            /**
             * Template method for child component detach.
             * @method onChildDetach
             */
            onChildDetach: function(child) {
            }
        }
    });

    /**
     * @class CssClass
     * @extends nx.Observable
     * @internal
     */
    var CssClass = nx.define(nx.Observable, {
        methods: {
            init: function(comp) {
                this.inherited();
                this._comp = comp;
                this._classList = [];
            },
            has: function(name) {
                return name in this._classList;
            },
            get: function(name) {
                return this._classList[name];
            },
            set: function(name, value) {
                this._classList[name] = value;
                this._comp.resolve('@root').set('class', this._classList.join(' '));
            },
            hasClass: function(name) {
                return this._classList.indexOf(name) >= 0;
            },
            addClass: function(name) {
                if (!this.hasClass(name)) {
                    this._classList.push(name);
                    this._comp.resolve('@root').set('class', this._classList.join(' '));
                }
            },
            removeClass: function(name) {
                var index = this._classList.indexOf(name);
                if (index >= 0) {
                    this._classList.splice(index, 1);
                    this._comp.resolve('@root').set('class', this._classList.join(' '));
                }
            },
            toggleClass: function(name) {
                var index = this._classList.indexOf(name);
                if (index >= 0) {
                    this._classList.splice(index, 1);
                }
                else {
                    this._classList.push(name);
                }

                this._comp.resolve('@root').set('class', this._classList.join(' '));
            },
            dispose: function() {
                this.inherited();
                this._comp = null;
                this._classList = null;
            }
        }
    });

    /**
     * @class CssStyle
     * @extends nx.Observable
     * @internal
     */
    var CssStyle = nx.define(nx.Observable, {
        methods: {
            init: function(comp) {
                this.inherited();
                this._comp = comp;
            },
            get: function(name) {
                return this._comp.resolve('@root').getStyle(name);
            },
            set: function(name, value) {
                this._comp.resolve('@root').setStyle(name, value);
            },
            dispose: function() {
                this.inherited();
                this._comp = null;
            }
        }
    });

    /**
     * @class DOMComponent
     * @extends nx.ui.AbstractComponent
     * @internal
     */
    var DOMComponent = nx.define(AbstractComponent, {
        final: true,
        events: ['generated'],
        properties: {
            /**
             * @property class
             * @type {CssClass}
             */
            'class': {
                get: function() {
                    return this._class;
                },
                set: function(value) {
                    var cssClass = this._class;
                    if (nx.is(value, 'Array')) {
                        nx.each(value, function(item, index) {
                            setProperty(cssClass, '' + index, item, this, value.__owner__ || this.owner());
                        }, this);
                    }
                    else if (nx.is(value, 'Object')) {
                        if (value.add) {
                            this._class.addClass(value.add);
                        }
                        if (value.remove) {
                            this._class.addClass(value.remove);
                        }
                        if (value.toggle) {
                            this._class.addClass(value.toggle);
                        }
                    }
                    else {
                        this.resolve('@root').set('class', value);
                    }
                }
            },
            /**
             * @property style
             * @type {CssStyle}
             */
            style: {
                get: function() {
                    return this._style;
                },
                set: function(value) {
                    if (nx.is(value, 'Object')) {
                        var cssStyle = this._style;
                        nx.each(value, function(v, k) {
                            setProperty(cssStyle, k, v, this, value.__owner__ || this.owner());
                        }, this);
                    }
                    else {
                        this.resolve('@root').set('style', value);
                    }
                }
            },
            /**
             * @property template
             */
            template: {
                get: function() {
                    return this._template;
                },
                set: function(value) {
                    this._template = value;
                    this._generateContent();
                }
            },
            /**
             * @property items
             */
            items: {
                get: function() {
                    return this._items;
                },
                set: function(value) {
                    var items = this._items;
                    if (items && items.off) {
                        items.off('change', this._onItemsChange, this);
                    }
                    items = this._items = value;
                    if (items && items.on) {
                        items.on('change', this._onItemsChange, this);
                    }

                    this._generateContent();
                }
            },
            /**
             * @property value
             */
            value: {
                get: function() {
                    return this.resolve('@root').get('value');
                },
                set: function(value) {
                    return this.resolve('@root').set('value', value);
                },
                binding: {
                    direction: '<>'
                }
            },
            /**
             * @property states
             */
            states: {
                value: null
            },
            /**
             * @property dom
             */
            dom: {
                get: function() {
                    return this.resolve('@root');
                }
            }
        },
        methods: {
            init: function(tag, text) {
                this.inherited();
                this._domListeners = {};
                this._resources = {};
                this._content = new Collection();
                this._class = new CssClass(this);
                this._style = new CssStyle(this);

                if (tag) {
                    var tokens = tag.split(':');
                    if (tokens.length === 2) {
                        var ns = tokens[0];
                        tag = tokens[1];
                        this.register('@ns', ns);
                        this.register('@root', Document.createElementNS(ns, tag));
                    }
                    else if (tag === 'text') {
                        this.register('@root', Document.createText(text));
                    }
                    else if (tag === 'fragment') {
                        this.register('@root', Document.createFragment());
                    }
                    else {
                        this.register('@root', Document.createElement(tag));
                    }

                    this.register('@tag', tag);
                }

                //Temp
                switch (tag) {
                    case 'input':
                    case 'textarea':
                        this.on('change', function(sender, event) {
                            switch (event.target.type) {
                                case 'checkbox':
                                case 'radio':
                                    this.notify('checked');
                                    break;
                                default:
                                    this.notify('value');
                                    break;
                            }
                        }, this);
                        this.on('input', function(sender, event) {
                            this.notify('value');
                        }, this);
                        break;
                    case 'select':
                        this.on('change', function(sender, event) {
                            this.notify('selectedIndex');
                            this.notify('value');
                        }, this);
                        break;
                }
            },
            get: function(name) {
                if (this.has(name) || name.indexOf(':') >= 0) {
                    return this.inherited(name);
                }
                else {
                    return this.resolve('@root').get(name);
                }
            },
            set: function(name, value) {
                if (this.has(name) || name.indexOf(':') >= 0) {
                    this.inherited(name, value);
                }
                else {
                    this.resolve('@root').set(name, value);
                    this.notify(name);
                }
            },
            on: function(name, handler, context) {
                this._attachDomListener(name);
                this.inherited(name, handler, context);
            },
            upon: function(name, handler, context) {
                this._attachDomListener(name);
                this.inherited(name, handler, context);
            },
            fire: function(name, data) {
                var listeners = this.__listeners__[name], listener, result;
                if (listeners) {
                    for (var i = 0, length = listeners.length; i < length; i++) {
                        listener = listeners[i];
                        if (listener && listener.handler) {
                            result = listener.handler.call(listener.context, listener.owner, data);
                            if (result === false) {
                                return false;
                            }
                        }
                    }
                }
            },
            dispose: function() {
                var root = this.resolve('@root');
                if (root) {
                    nx.each(this._domListeners, function(listener, name) {
                        if (name.charAt(0) === ':') {
                            root.removeEventListener(name.slice(1), listener, true);
                        }
                        else {
                            root.removeEventListener(name, listener);
                        }
                    });
                }
                this.items(null);
                this._class.dispose();
                this._style.dispose();
                this.inherited();
                this._domListeners = null;
            },
            onAttach: function(parent, index) {
                var root = this.resolve('@root');
                if (root) {
                    var container = parent.getContainer(this);

                    if (index >= 0) {
                        var ref = parent.content().getItem(index);

                        if (ref && ref.resolve('@tag') === 'fragment') {
                            ref = ref.content().getItem(0);
                        }

                        if (ref) {
                            container.insertBefore(root, ref.resolve('@root'));
                        }
                        else {
                            container.appendChild(root);
                        }
                    }
                    else {
                        container.appendChild(root);
                    }

                    var states = this.states();
                    var enterState = null;
                    if (states) {
                        enterState = states.enter;
                    }

                    if (enterState) {
                        var cssText = root.$dom.style.cssText;
                        var transition = 'all ' + (enterState.duration || 500) + 'ms';
                        root.setStyles(nx.extend({
                            transition: transition
                        }, enterState));
                        this.upon('transitionend', function() {
                            root.removeStyle('transition');
                        });
                        setTimeout(function() {
                            root.$dom.style.cssText = cssText + ';transition: ' + transition;
                        }, 10);
                    }
                }
            },
            onDetach: function(parent) {
                var root = this.resolve('@root');
                if (root) {
                    var tag = this.resolve('@tag');
                    var self = this;

                    if (tag === 'fragment') {
                        nx.each(self.content(), function(child) {
                            root.appendChild(child.resolve('@root'));
                        });
                    }
                    else {
                        var states = this.states();
                        var leaveState = null;
                        if (states) {
                            leaveState = states.leave;
                        }

                        if (leaveState) {
                            var cssText = root.$dom.style.cssText;
                            var transition = 'all ' + (leaveState.duration || 500) + 'ms';
                            root.setStyle('transition', transition);
                            setTimeout(function() {
                                root.setStyles(leaveState);
                            }, 10);
                            this.upon('transitionend', function() {
                                root.$dom.style.cssText = cssText;
                                parent.getContainer(this).removeChild(root);
                            });
                        }
                        else {
                            parent.getContainer(this).removeChild(root);
                        }
                    }
                }
            },
            _attachDomListener: function(name) {
                var domListeners = this._domListeners;
                if (!(name in domListeners)) {
                    var self = this;
                    var root = this.resolve('@root');
                    var listener = domListeners[name] = function(event) {
                        self.fire(name, event);
                    };

                    if (name.charAt(0) === ':') {
                        root.addEventListener(name.slice(1), listener, true);
                    }
                    else {
                        root.addEventListener(name, listener);
                    }
                }
            },
            _generateContent: function() {
                var template = this._template;
                var items = this._items;
                nx.each(this._content.toArray(), function(c) {
                    c.detach();
                    c.model(null);
                });

                if (template && items) {
                    nx.each(items, function(item) {
                        var comp = createComponent(template, this.owner());
                        comp.model(item);
                        comp.attach(this);
                    }, this);

                    this.fire('generated');
                }
            },
            _onItemsChange: function(sender, event) {
                var template = this._template;
                var action = event.action;
                var index = event.index;
                index = index >= 0 ? index : -1;
                if (action === 'add') {
                    nx.each(event.items, function(item, i) {
                        var comp = createComponent(template, this.owner());
                        comp.model(item);
                        comp.attach(this, index + i);
                    }, this);
                }
                else if (action === 'remove') {
                    nx.each(event.items, function(item) {
                        nx.each(this.content().toArray(), function(comp) {
                            if (comp.model() === item) {
                                comp.detach();
                            }
                        }, this);
                    }, this);
                }
                else if (action === 'replace') {
                    var oldItem = event.oldItem,
                        newItem = event.newItem;

                    nx.each(this.content().toArray(), function(comp) {
                        if (comp.model() === oldItem) {
                            comp.model(newItem);
                        }
                    }, this);
                }
                else if (action === 'sort') {
                    var comparator = event.comparator;
                    var sortedContent = this.content().toArray().sort(function(a, b) {
                        return comparator(a.model(), b.model());
                    });

                    nx.each(sortedContent, function(comp) {
                        comp.attach(this);
                    }, this);
                }
                else {
                    this._generateContent();
                }
            }
        }
    });
})(nx);
(function(nx) {
    var AbstractComponent = nx.ui.AbstractComponent;

    /**
     * @class Component
     * @namespace nx.ui
     * @extends nx.ui.AbstractComponent
     */
    nx.define('nx.ui.Component', AbstractComponent, {
        properties: {
            model: {
                get: function() {
                    return this._model || this._inheritedModel;
                },
                set: function(value, inherited) {
                    if (inherited) {
                        this._inheritedModel = value;
                    }
                    else {
                        this._model = value;
                    }

                    var view = this.view();
                    if (view) {
                        view.model(value, true);
                    }

                    var content = this._content;
                    if (content) {
                        content.each(function(c) {
                            if (!nx.is(c, 'String')) {
                                c.model(value, true);
                            }
                        });
                    }
                }
            },
            'class': {
                get: function() {
                    return this.view().get('class');
                },
                set: function(value) {
                    this.view().set('class', value);
                }
            },
            style: {
                get: function() {
                    return this.view().style();
                },
                set: function(value) {
                    this.view().style(value);
                }
            },
            dom: {
                get: function() {
                    return this.resolve('@root');
                }
            }
        },
        methods: {
            init: function() {
                this.inherited();
                var view = this['@view'];
                if (nx.is(view, 'Function')) {
                    var cls = this.constructor;
                    var superView;
                    while (cls) {
                        cls = cls.__super__;
                        superView = cls['@view'];
                        if (superView) {
                            break;
                        }
                    }
                    view = view.call(this, nx.clone(superView));
                }

                if (view) {
                    var comp = AbstractComponent.createComponent(view, this);
                    this.register('@root', comp.resolve('@root'));
                    this.register('@tag', comp.resolve('@tag'));
                    this.register('@comp', comp);
                }
            },
            view: function(name) {
                return this.resolve(name || '@comp');
            },
            get: function(name) {
                if (this.has(name)) {
                    return this.inherited(name);
                }
                else {
                    return this.view().get(name);
                }
            },
            set: function(name, value) {
                if (this.has(name)) {
                    this.inherited(name, value);
                }
                else {
                    this.view().set(name, value);
                    this.notify(name);
                }
            },
            onAttach: function(parent, index) {
                this.view().onAttach(parent, index);
            },
            onDetach: function() {
                this.view().onDetach(this.parent());
            },
            on: function(name, handler, context) {
                if (this.can(name)) {
                    this.inherited(name, handler, context);
                }
                else {
                    this.view().on(name, handler, context);
                }
            },
            upon: function(name, handler, context) {
                if (this.can(name)) {
                    this.inherited(name, handler, context);
                }
                else {
                    this.view().upon(name, handler, context);
                }
            },
            off: function(name, handler, context) {
                if (this.can(name)) {
                    this.inherited(name, handler, context);
                }
                else {
                    this.view().off(name, handler, context);
                }
            },
            dispose: function() {
                var comp = this.view();
                if (comp) {
                    comp.dispose();
                }

                this.inherited();
            }
        }
    });
})(nx);
(function(nx) {
    var global = nx.global;
    var Document = nx.dom.Document;

    /**
     * @class Application
     * @namespace nx.ui
     * @extends nx.ui.AbstractComponent
     */
    nx.define('nx.ui.Application', nx.ui.AbstractComponent, {
        properties: {
            container: {}
        },
        methods: {
            init: function() {
                this.inherited();
                var startFn = this.start;
                var stopFn = this.stop;
                var self = this;
                this.start = function(options) {
                    Document.ready(function() {
                        nx.app = self;
                        startFn.call(self, options);
                    });
                    return this;
                };

                this.stop = function() {
                    nx.app = null;
                    stopFn.call(self);
                };

                this._globalListeners = {};
            },
            /**
             * Start the application.
             * @method start
             */
            start: function() {
                throw new Error('Method "start" is not implemented');
            },
            /**
             * Stop the application.
             * @method stop
             */
            stop: function() {
                throw new Error('Method "stop" is not implemented');
            },
            getContainer: function() {
                if (this.container()) {
                    return new nx.dom.Element(this.container());
                } else {
                    return Document.body();
                }

            },
            on: function(name, handler, context) {
                if (!this.can(name)) {
                    this._attachGlobalListeners(name);
                }

                this.inherited(name, handler, context);
            },
            upon: function(name, handler, context) {
                if (!this.can(name)) {
                    this._attachGlobalListeners(name);
                }

                this.inherited(name, handler, context);
            },
            _attachGlobalListeners: function(name) {
                var globalListeners = this._globalListeners;
                if (!(name in globalListeners)) {
                    var self = this;
                    var listener = globalListeners[name] = function(event) {
                        self.fire(name, event);
                    };

                    window.addEventListener(name, listener);
                }
            }
        }
    });
})(nx);