(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define('svelte/snapshots', factory) :
	(global = global || self, global.snapshots = factory());
}(this, function () { 'use strict';

	function createCommonjsModule(fn, basedir, module) {
		return module = {
		  path: basedir,
		  exports: {},
		  require: function (path, base) {
	      return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
	    }
		}, fn(module, module.exports), module.exports;
	}

	function commonjsRequire () {
		throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
	}

	var _typeof_1 = createCommonjsModule(function (module) {
	  function _typeof(obj) {
	    "@babel/helpers - typeof";

	    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
	      module.exports = _typeof = function _typeof(obj) {
	        return typeof obj;
	      };
	    } else {
	      module.exports = _typeof = function _typeof(obj) {
	        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	      };
	    }

	    return _typeof(obj);
	  }

	  module.exports = _typeof;
	});

	function noop() {}

	function assign(tar, src) {
	  for (var k in src) {
	    tar[k] = src[k];
	  }

	  return tar;
	}

	function assignTrue(tar, src) {
	  for (var k in src) {
	    tar[k] = 1;
	  }

	  return tar;
	}

	function addLoc(element, file, line, column, char) {
	  element.__svelte_meta = {
	    loc: {
	      file: file,
	      line: line,
	      column: column,
	      char: char
	    }
	  };
	}

	function append(target, node) {
	  target.appendChild(node);
	}

	function insert(target, node, anchor) {
	  target.insertBefore(node, anchor);
	}

	function detachNode(node) {
	  node.parentNode.removeChild(node);
	}

	function destroyEach(iterations, detach) {
	  for (var i = 0; i < iterations.length; i += 1) {
	    if (iterations[i]) iterations[i].d(detach);
	  }
	}

	function createElement(name) {
	  return document.createElement(name);
	}

	function createText(data) {
	  return document.createTextNode(data);
	}

	function addListener(node, event, handler, options) {
	  node.addEventListener(event, handler, options);
	}

	function removeListener(node, event, handler, options) {
	  node.removeEventListener(event, handler, options);
	}

	function toggleClass(element, name, toggle) {
	  element.classList[toggle ? 'add' : 'remove'](name);
	}

	function blankObject() {
	  return Object.create(null);
	}

	function destroy(detach) {
	  this.destroy = noop;
	  this.fire('destroy');
	  this.set = noop;

	  this._fragment.d(detach !== false);

	  this._fragment = null;
	  this._state = {};
	}

	function destroyDev(detach) {
	  destroy.call(this, detach);

	  this.destroy = function () {
	    console.warn('Component was already destroyed');
	  };
	}

	function _differs(a, b) {
	  return a != a ? b == b : a !== b || a && _typeof_1(a) === 'object' || typeof a === 'function';
	}

	function _differsImmutable(a, b) {
	  return a != a ? b == b : a !== b;
	}

	function fire(eventName, data) {
	  var handlers = eventName in this._handlers && this._handlers[eventName].slice();

	  if (!handlers) return;

	  for (var i = 0; i < handlers.length; i += 1) {
	    var handler = handlers[i];

	    if (!handler.__calling) {
	      try {
	        handler.__calling = true;
	        handler.call(this, data);
	      } finally {
	        handler.__calling = false;
	      }
	    }
	  }
	}

	function flush(component) {
	  component._lock = true;
	  callAll(component._beforecreate);
	  callAll(component._oncreate);
	  callAll(component._aftercreate);
	  component._lock = false;
	}

	function get() {
	  return this._state;
	}

	function init(component, options) {
	  component._handlers = blankObject();
	  component._slots = blankObject();
	  component._bind = options._bind;
	  component._staged = {};
	  component.options = options;
	  component.root = options.root || component;
	  component.store = options.store || component.root.store;

	  if (!options.root) {
	    component._beforecreate = [];
	    component._oncreate = [];
	    component._aftercreate = [];
	  }
	}

	function on(eventName, handler) {
	  var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
	  handlers.push(handler);
	  return {
	    cancel: function cancel() {
	      var index = handlers.indexOf(handler);
	      if (~index) handlers.splice(index, 1);
	    }
	  };
	}

	function set(newState) {
	  this._set(assign({}, newState));

	  if (this.root._lock) return;
	  flush(this.root);
	}

	function _set(newState) {
	  var oldState = this._state,
	      changed = {},
	      dirty = false;
	  newState = assign(this._staged, newState);
	  this._staged = {};

	  for (var key in newState) {
	    if (this._differs(newState[key], oldState[key])) changed[key] = dirty = true;
	  }

	  if (!dirty) return;
	  this._state = assign(assign({}, oldState), newState);

	  this._recompute(changed, this._state);

	  if (this._bind) this._bind(changed, this._state);

	  if (this._fragment) {
	    this.fire("state", {
	      changed: changed,
	      current: this._state,
	      previous: oldState
	    });

	    this._fragment.p(changed, this._state);

	    this.fire("update", {
	      changed: changed,
	      current: this._state,
	      previous: oldState
	    });
	  }
	}

	function _stage(newState) {
	  assign(this._staged, newState);
	}

	function setDev(newState) {
	  if (_typeof_1(newState) !== 'object') {
	    throw new Error(this._debugName + '.set was called without an object of data key-values to update.');
	  }

	  this._checkReadOnly(newState);

	  set.call(this, newState);
	}

	function callAll(fns) {
	  while (fns && fns.length) {
	    fns.shift()();
	  }
	}

	function _mount(target, anchor) {
	  this._fragment[this._fragment.i ? 'i' : 'm'](target, anchor || null);
	}
	var protoDev = {
	  destroy: destroyDev,
	  get: get,
	  fire: fire,
	  on: on,
	  set: setDev,
	  _recompute: noop,
	  _set: _set,
	  _stage: _stage,
	  _mount: _mount,
	  _differs: _differs
	};

	/**
	 * Clones an object
	 *
	 * @exports clone
	 * @kind function
	 *
	 * @param {*} object - the thing that should be cloned
	 * @returns {*} - the cloned thing
	 */
	function clone(o) {
	  if (!o || _typeof_1(o) !== 'object') return o;

	  try {
	    return JSON.parse(JSON.stringify(o));
	  } catch (e) {
	    return o;
	  }
	}

	/* snapshots/App.html generated by Svelte v2.16.1 */
	/* globals chart */

	function data() {
	  return {
	    snapshots: [],
	    current: -1
	  };
	}
	var methods = {
	  getSnapshot: function getSnapshot() {
	    return {
	      title: chart.get('title'),
	      annotate: clone(chart.getMetadata('annotate')),
	      describe: clone(chart.getMetadata('describe')),
	      visualize: clone(chart.getMetadata('visualize')),
	      axes: clone(chart.getMetadata('axes'))
	    };
	  },
	  setSnapshot: function setSnapshot(snapshot) {
	    console.log({
	      snapshot: snapshot
	    });
	    chart.set('title', snapshot.title);
	    chart.setMetadata('annotate', clone(snapshot.annotate));
	    chart.setMetadata('describe', clone(snapshot.describe));
	    chart.setMetadata('visualize', clone(snapshot.visualize));
	    chart.setMetadata('axes', clone(snapshot.axes));
	  },
	  addSnapshot: function addSnapshot() {
	    var _this$get = this.get(),
	        snapshots = _this$get.snapshots;

	    snapshots.push(this.getSnapshot());
	    this.set({
	      snapshots: snapshots,
	      current: snapshots.length - 1
	    });
	  },
	  restoreSnapshot: function restoreSnapshot(i) {
	    var _this$get2 = this.get(),
	        snapshots = _this$get2.snapshots;

	    this.setSnapshot(snapshots[i]);
	    this.set({
	      current: i
	    });
	  },
	  replaceSnapshot: function replaceSnapshot(i) {
	    var _this$get3 = this.get(),
	        snapshots = _this$get3.snapshots;

	    snapshots[i] = this.getSnapshot();
	    this.set({
	      snapshots: snapshots
	    });
	  },
	  removeSnapshot: function removeSnapshot(i) {
	    var _this$get4 = this.get(),
	        snapshots = _this$get4.snapshots;

	    if (i > -1) {
	      snapshots.splice(i, 1);
	      this.set({
	        snapshots: snapshots
	      });
	    }
	  }
	};

	function oncreate() {
	  // todo: load snapshots from local storage?
	  var backup = window.localStorage.getItem("snapshots-".concat(chart.get('id')));

	  if (backup) {
	    this.set({
	      snapshots: JSON.parse(backup)
	    });
	    this.restoreSnapshot(0);
	  }
	}

	function onupdate(_ref) {
	  var changed = _ref.changed,
	      current = _ref.current;

	  if (changed.snapshots) {
	    window.localStorage.setItem("snapshots-".concat(chart.get('id')), JSON.stringify(current.snapshots));
	  }
	}
	var file = "snapshots/App.html";

	function click_handler(event) {
	  var _this$_svelte = this._svelte,
	      component = _this$_svelte.component,
	      ctx = _this$_svelte.ctx;
	  component.restoreSnapshot(ctx.i);
	}

	function get_each_context(ctx, list, i) {
	  var child_ctx = Object.create(ctx);
	  child_ctx.snapshot = list[i];
	  child_ctx.i = i;
	  return child_ctx;
	}

	function create_main_fragment(component, ctx) {
	  var div3, ul, li, div0, text0, button, text2, div1, text3, div2;

	  function click_handler(event) {
	    component.addSnapshot();
	  }

	  var each_value = ctx.snapshots;
	  var each_blocks = [];

	  for (var i = 0; i < each_value.length; i += 1) {
	    each_blocks[i] = create_each_block(component, get_each_context(ctx, each_value, i));
	  }

	  var if_block = ctx.current > -1 && create_if_block(component, ctx);
	  return {
	    c: function create() {
	      div3 = createElement("div");
	      ul = createElement("ul");
	      li = createElement("li");
	      div0 = createElement("div");
	      text0 = createText("snapshots\n                ");
	      button = createElement("button");
	      button.textContent = "add";
	      text2 = createText("\n            ");
	      div1 = createElement("div");

	      for (var i = 0; i < each_blocks.length; i += 1) {
	        each_blocks[i].c();
	      }

	      text3 = createText("\n            ");
	      div2 = createElement("div");
	      if (if_block) if_block.c();
	      addListener(button, "click", click_handler);
	      button.className = "btn btn-small";
	      addLoc(button, file, 5, 16, 129);
	      div0.className = "svelte-of9ge0";
	      addLoc(div0, file, 3, 12, 81);
	      div1.className = "svelte-of9ge0";
	      addLoc(div1, file, 7, 12, 228);
	      div2.className = "svelte-of9ge0";
	      addLoc(div2, file, 12, 12, 462);
	      li.className = "svelte-of9ge0";
	      addLoc(li, file, 2, 8, 64);
	      ul.className = "unstyled";
	      addLoc(ul, file, 1, 4, 34);
	      div3.className = "chart-snapshots svelte-of9ge0";
	      addLoc(div3, file, 0, 0, 0);
	    },
	    m: function mount(target, anchor) {
	      insert(target, div3, anchor);
	      append(div3, ul);
	      append(ul, li);
	      append(li, div0);
	      append(div0, text0);
	      append(div0, button);
	      append(li, text2);
	      append(li, div1);

	      for (var i = 0; i < each_blocks.length; i += 1) {
	        each_blocks[i].m(div1, null);
	      }

	      append(li, text3);
	      append(li, div2);
	      if (if_block) if_block.m(div2, null);
	    },
	    p: function update(changed, ctx) {
	      if (changed.current || changed.snapshots) {
	        each_value = ctx.snapshots;

	        for (var i = 0; i < each_value.length; i += 1) {
	          var child_ctx = get_each_context(ctx, each_value, i);

	          if (each_blocks[i]) {
	            each_blocks[i].p(changed, child_ctx);
	          } else {
	            each_blocks[i] = create_each_block(component, child_ctx);
	            each_blocks[i].c();
	            each_blocks[i].m(div1, null);
	          }
	        }

	        for (; i < each_blocks.length; i += 1) {
	          each_blocks[i].d(1);
	        }

	        each_blocks.length = each_value.length;
	      }

	      if (ctx.current > -1) {
	        if (if_block) {
	          if_block.p(changed, ctx);
	        } else {
	          if_block = create_if_block(component, ctx);
	          if_block.c();
	          if_block.m(div2, null);
	        }
	      } else if (if_block) {
	        if_block.d(1);
	        if_block = null;
	      }
	    },
	    d: function destroy(detach) {
	      if (detach) {
	        detachNode(div3);
	      }

	      removeListener(button, "click", click_handler);
	      destroyEach(each_blocks, detach);
	      if (if_block) if_block.d();
	    }
	  };
	} // (9:16) {#each snapshots as snapshot,i}


	function create_each_block(component, ctx) {
	  var button,
	      text_value = ctx.i + 1,
	      text;
	  return {
	    c: function create() {
	      button = createElement("button");
	      text = createText(text_value);
	      button._svelte = {
	        component: component,
	        ctx: ctx
	      };
	      addListener(button, "click", click_handler);
	      button.className = "btn btn-small";
	      toggleClass(button, "btn-primary", ctx.current === ctx.i);
	      addLoc(button, file, 9, 16, 298);
	    },
	    m: function mount(target, anchor) {
	      insert(target, button, anchor);
	      append(button, text);
	    },
	    p: function update(changed, _ctx) {
	      ctx = _ctx;
	      button._svelte.ctx = ctx;

	      if (changed.current) {
	        toggleClass(button, "btn-primary", ctx.current === ctx.i);
	      }
	    },
	    d: function destroy(detach) {
	      if (detach) {
	        detachNode(button);
	      }

	      removeListener(button, "click", click_handler);
	    }
	  };
	} // (14:16) {#if current > -1}


	function create_if_block(component, ctx) {
	  var button0, text_1, button1;

	  function click_handler_1(event) {
	    component.replaceSnapshot(ctx.current);
	  }

	  function click_handler_2(event) {
	    component.removeSnapshot(ctx.current);
	  }

	  return {
	    c: function create() {
	      button0 = createElement("button");
	      button0.textContent = "update";
	      text_1 = createText("\n                ");
	      button1 = createElement("button");
	      button1.textContent = "remove";
	      addListener(button0, "click", click_handler_1);
	      button0.className = "btn btn-small";
	      addLoc(button0, file, 14, 16, 519);
	      addListener(button1, "click", click_handler_2);
	      button1.className = "btn btn-small";
	      addLoc(button1, file, 15, 16, 617);
	    },
	    m: function mount(target, anchor) {
	      insert(target, button0, anchor);
	      insert(target, text_1, anchor);
	      insert(target, button1, anchor);
	    },
	    p: function update(changed, _ctx) {
	      ctx = _ctx;
	    },
	    d: function destroy(detach) {
	      if (detach) {
	        detachNode(button0);
	      }

	      removeListener(button0, "click", click_handler_1);

	      if (detach) {
	        detachNode(text_1);
	        detachNode(button1);
	      }

	      removeListener(button1, "click", click_handler_2);
	    }
	  };
	}

	function App(options) {
	  var _this = this;

	  this._debugName = '<App>';

	  if (!options || !options.target && !options.root) {
	    throw new Error("'target' is a required option");
	  }

	  init(this, options);
	  this._state = assign(data(), options.data);
	  if (!('snapshots' in this._state)) console.warn("<App> was created without expected data property 'snapshots'");
	  if (!('current' in this._state)) console.warn("<App> was created without expected data property 'current'");
	  this._intro = true;
	  this._handlers.update = [onupdate];
	  this._fragment = create_main_fragment(this, this._state);

	  this.root._oncreate.push(function () {
	    oncreate.call(_this);

	    _this.fire("update", {
	      changed: assignTrue({}, _this._state),
	      current: _this._state
	    });
	  });

	  if (options.target) {
	    if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");

	    this._fragment.c();

	    this._mount(options.target, options.anchor);

	    flush(this);
	  }
	}

	assign(App.prototype, protoDev);
	assign(App.prototype, methods);

	App.prototype._checkReadOnly = function _checkReadOnly(newState) {};

	function Store(state, options) {
	  this._handlers = {};
	  this._dependents = [];
	  this._computed = blankObject();
	  this._sortedComputedProperties = [];
	  this._state = assign({}, state);
	  this._differs = options && options.immutable ? _differsImmutable : _differs;
	}

	assign(Store.prototype, {
	  _add: function _add(component, props) {
	    this._dependents.push({
	      component: component,
	      props: props
	    });
	  },
	  _init: function _init(props) {
	    var state = {};

	    for (var i = 0; i < props.length; i += 1) {
	      var prop = props[i];
	      state['$' + prop] = this._state[prop];
	    }

	    return state;
	  },
	  _remove: function _remove(component) {
	    var i = this._dependents.length;

	    while (i--) {
	      if (this._dependents[i].component === component) {
	        this._dependents.splice(i, 1);

	        return;
	      }
	    }
	  },
	  _set: function _set(newState, changed) {
	    var _this = this;

	    var previous = this._state;
	    this._state = assign(assign({}, previous), newState);

	    for (var i = 0; i < this._sortedComputedProperties.length; i += 1) {
	      this._sortedComputedProperties[i].update(this._state, changed);
	    }

	    this.fire('state', {
	      changed: changed,
	      previous: previous,
	      current: this._state
	    });

	    this._dependents.filter(function (dependent) {
	      var componentState = {};
	      var dirty = false;

	      for (var j = 0; j < dependent.props.length; j += 1) {
	        var prop = dependent.props[j];

	        if (prop in changed) {
	          componentState['$' + prop] = _this._state[prop];
	          dirty = true;
	        }
	      }

	      if (dirty) {
	        dependent.component._stage(componentState);

	        return true;
	      }
	    }).forEach(function (dependent) {
	      dependent.component.set({});
	    });

	    this.fire('update', {
	      changed: changed,
	      previous: previous,
	      current: this._state
	    });
	  },
	  _sortComputedProperties: function _sortComputedProperties() {
	    var computed = this._computed;
	    var sorted = this._sortedComputedProperties = [];
	    var visited = blankObject();
	    var currentKey;

	    function visit(key) {
	      var c = computed[key];

	      if (c) {
	        c.deps.forEach(function (dep) {
	          if (dep === currentKey) {
	            throw new Error("Cyclical dependency detected between ".concat(dep, " <-> ").concat(key));
	          }

	          visit(dep);
	        });

	        if (!visited[key]) {
	          visited[key] = true;
	          sorted.push(c);
	        }
	      }
	    }

	    for (var key in this._computed) {
	      visit(currentKey = key);
	    }
	  },
	  compute: function compute(key, deps, fn) {
	    var _this2 = this;

	    var value;
	    var c = {
	      deps: deps,
	      update: function update(state, changed, dirty) {
	        var values = deps.map(function (dep) {
	          if (dep in changed) dirty = true;
	          return state[dep];
	        });

	        if (dirty) {
	          var newValue = fn.apply(null, values);

	          if (_this2._differs(newValue, value)) {
	            value = newValue;
	            changed[key] = true;
	            state[key] = value;
	          }
	        }
	      }
	    };
	    this._computed[key] = c;

	    this._sortComputedProperties();

	    var state = assign({}, this._state);
	    var changed = {};
	    c.update(state, changed, true);

	    this._set(state, changed);
	  },
	  fire: fire,
	  get: get,
	  on: on,
	  set: function set(newState) {
	    var oldState = this._state;
	    var changed = this._changed = {};
	    var dirty = false;

	    for (var key in newState) {
	      if (this._computed[key]) throw new Error("'".concat(key, "' is a read-only computed property"));
	      if (this._differs(newState[key], oldState[key])) changed[key] = dirty = true;
	    }

	    if (!dirty) return;

	    this._set(newState, changed);
	  }
	});

	var store = new Store({});
	var main = {
	  App: App,
	  store: store
	};

	return main;

}));
//# sourceMappingURL=snapshots.js.map
