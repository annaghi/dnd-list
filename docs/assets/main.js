(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.bo.aH === region.bB.aH)
	{
		return 'on line ' + region.bo.aH;
	}
	return 'on lines ' + region.bo.aH + ' through ' + region.bB.aH;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.c9,
		impl.b9,
		impl.b5,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	result = init(result.a);
	var model = result.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		result = A2(update, msg, model);
		stepper(model = result.a, viewMetadata);
		_Platform_enqueueEffects(managers, result.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, result.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		T: func(record.T),
		bp: record.bp,
		bj: record.bj
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.T;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.bp;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.bj) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.c9,
		impl.b9,
		impl.b5,
		function(sendToApp, initialModel) {
			var view = impl.d3;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.c9,
		impl.b9,
		impl.b5,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.bm && impl.bm(sendToApp)
			var view = impl.d3;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.cy);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.aA) && (_VirtualDom_doc.title = title = doc.aA);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.dp;
	var onUrlRequest = impl.dq;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		bm: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.bZ === next.bZ
							&& curr.bI === next.bI
							&& curr.bW.a === next.bW.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		c9: function(flags)
		{
			return A3(impl.c9, flags, _Browser_getUrl(), key);
		},
		d3: impl.d3,
		b9: impl.b9,
		b5: impl.b5
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { c3: 'hidden', cH: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { c3: 'mozHidden', cH: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { c3: 'msHidden', cH: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { c3: 'webkitHidden', cH: 'webkitvisibilitychange' }
		: { c3: 'hidden', cH: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		b2: _Browser_getScene(),
		cc: {
			Y: _Browser_window.pageXOffset,
			Z: _Browser_window.pageYOffset,
			d4: _Browser_doc.documentElement.clientWidth,
			c2: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		d4: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		c2: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			b2: {
				d4: node.scrollWidth,
				c2: node.scrollHeight
			},
			cc: {
				Y: node.scrollLeft,
				Z: node.scrollTop,
				d4: node.clientWidth,
				c2: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			b2: _Browser_getScene(),
			cc: {
				Y: x,
				Z: y,
				d4: _Browser_doc.documentElement.clientWidth,
				c2: _Browser_doc.documentElement.clientHeight
			},
			cW: {
				Y: x + rect.left,
				Z: y + rect.top,
				d4: rect.width,
				c2: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});



function _Time_now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

var _Time_setInterval = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

function _Time_here()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2($elm$time$Time$customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}


function _Time_getZoneName()
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = $elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = $elm$time$Time$Offset(new Date().getTimezoneOffset());
		}
		callback(_Scheduler_succeed(name));
	});
}


function _Url_percentEncode(string)
{
	return encodeURIComponent(string);
}

function _Url_percentDecode(string)
{
	try
	{
		return $elm$core$Maybe$Just(decodeURIComponent(string));
	}
	catch (e)
	{
		return $elm$core$Maybe$Nothing;
	}
}var $author$project$Main$LinkClicked = function (a) {
	return {$: 1, a: a};
};
var $author$project$Main$UrlChanged = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.c) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.f),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.f);
		} else {
			var treeLen = builder.c * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.g) : builder.g;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.c);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.f) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.f);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{g: nodeList, c: (len / $elm$core$Array$branchFactor) | 0, f: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {bE: fragment, bI: host, z: path, bW: port_, bZ: protocol, b_: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$application = _Browser_application;
var $author$project$Main$NotFound = {$: 0};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Config$Root$Movement = function (a) {
	return {$: 0, a: a};
};
var $author$project$Config$Root$OperationsOnDrag = function (a) {
	return {$: 1, a: a};
};
var $author$project$Config$Root$OperationsOnDrop = function (a) {
	return {$: 2, a: a};
};
var $author$project$Config$Movement$Root$FreeOnDrag = function (a) {
	return {$: 0, a: a};
};
var $author$project$Config$Movement$Root$FreeOnDrop = function (a) {
	return {$: 1, a: a};
};
var $author$project$Config$Movement$Root$HorizontalOnDrag = function (a) {
	return {$: 2, a: a};
};
var $author$project$Config$Movement$Root$HorizontalOnDrop = function (a) {
	return {$: 3, a: a};
};
var $author$project$Config$Movement$Root$VerticalOnDrag = function (a) {
	return {$: 4, a: a};
};
var $author$project$Config$Movement$Root$VerticalOnDrop = function (a) {
	return {$: 5, a: a};
};
var $author$project$Config$Movement$FreeOnDrag$data = A2(
	$elm$core$List$map,
	$elm$core$String$fromInt,
	A2($elm$core$List$range, 1, 9));
var $author$project$Config$Movement$FreeOnDrag$MyMsg = function (a) {
	return {$: 0, a: a};
};
var $author$project$DnDList$Free = 0;
var $author$project$DnDList$OnDrag = 0;
var $author$project$DnDList$Swap = 3;
var $author$project$Config$Movement$FreeOnDrag$config = {
	cv: F3(
		function (_v0, _v1, list) {
			return list;
		}),
	dg: 0,
	dk: 0,
	ds: 3
};
var $author$project$DnDList$Model = $elm$core$Basics$identity;
var $author$project$DnDList$GotDragElement = function (a) {
	return {$: 6, a: a};
};
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$core$Task$onError = _Scheduler_onError;
var $elm$core$Task$attempt = F2(
	function (resultToMessage, task) {
		return $elm$core$Task$command(
			A2(
				$elm$core$Task$onError,
				A2(
					$elm$core$Basics$composeL,
					A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
					$elm$core$Result$Err),
				A2(
					$elm$core$Task$andThen,
					A2(
						$elm$core$Basics$composeL,
						A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
						$elm$core$Result$Ok),
					task)));
	});
var $elm$browser$Browser$Dom$getElement = _Browser_getElement;
var $author$project$DnDList$dragElementCommands = F2(
	function (stepMsg, state) {
		var _v0 = state.R;
		if (_v0.$ === 1) {
			return A2(
				$elm$core$Task$attempt,
				A2($elm$core$Basics$composeL, stepMsg, $author$project$DnDList$GotDragElement),
				$elm$browser$Browser$Dom$getElement(state.aq));
		} else {
			return $elm$core$Platform$Cmd$none;
		}
	});
var $author$project$DnDList$GotDropElement = function (a) {
	return {$: 7, a: a};
};
var $author$project$DnDList$dropElementCommands = F2(
	function (stepMsg, state) {
		return (!state.n) ? A2(
			$elm$core$Task$attempt,
			A2($elm$core$Basics$composeL, stepMsg, $author$project$DnDList$GotDropElement),
			$elm$browser$Browser$Dom$getElement(state.ad)) : $elm$core$Platform$Cmd$none;
	});
var $author$project$DnDList$commands = F2(
	function (stepMsg, _v0) {
		var model = _v0;
		if (model.$ === 1) {
			return $elm$core$Platform$Cmd$none;
		} else {
			var state = model.a;
			return $elm$core$Platform$Cmd$batch(
				_List_fromArray(
					[
						A2($author$project$DnDList$dragElementCommands, stepMsg, state),
						A2($author$project$DnDList$dropElementCommands, stepMsg, state)
					]));
		}
	});
var $author$project$DnDList$DragStart = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $author$project$Internal$Common$Utils$Position = F2(
	function (x, y) {
		return {Y: x, Z: y};
	});
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $author$project$Internal$Common$Utils$pageX = A2($elm$json$Json$Decode$field, 'pageX', $elm$json$Json$Decode$float);
var $author$project$Internal$Common$Utils$pageY = A2($elm$json$Json$Decode$field, 'pageY', $elm$json$Json$Decode$float);
var $author$project$Internal$Common$Utils$decodeCoordinates = A3($elm$json$Json$Decode$map2, $author$project$Internal$Common$Utils$Position, $author$project$Internal$Common$Utils$pageX, $author$project$Internal$Common$Utils$pageY);
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$fail = _Json_fail;
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $author$project$Internal$Common$Utils$decodeMainMouseButton = function (decoder) {
	return A2(
		$elm$json$Json$Decode$andThen,
		function (button) {
			return (!button) ? decoder : $elm$json$Json$Decode$fail('Event is only relevant when the main mouse button was pressed.');
		},
		A2($elm$json$Json$Decode$field, 'button', $elm$json$Json$Decode$int));
};
var $author$project$Internal$Common$Utils$decodeCoordinatesWithButtonCheck = $author$project$Internal$Common$Utils$decodeMainMouseButton($author$project$Internal$Common$Utils$decodeCoordinates);
var $elm$virtual_dom$VirtualDom$MayPreventDefault = function (a) {
	return {$: 2, a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$preventDefaultOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayPreventDefault(decoder));
	});
var $author$project$DnDList$dragEvents = F3(
	function (stepMsg, dragIndex, dragElementId) {
		return _List_fromArray(
			[
				A2(
				$elm$html$Html$Events$preventDefaultOn,
				'mousedown',
				A2(
					$elm$json$Json$Decode$map,
					function (msg) {
						return _Utils_Tuple2(msg, true);
					},
					A2(
						$elm$json$Json$Decode$map,
						A2(
							$elm$core$Basics$composeL,
							stepMsg,
							A2($author$project$DnDList$DragStart, dragIndex, dragElementId)),
						$author$project$Internal$Common$Utils$decodeCoordinatesWithButtonCheck)))
			]);
	});
var $author$project$DnDList$DragEnter = function (a) {
	return {$: 3, a: a};
};
var $author$project$DnDList$DragLeave = {$: 4};
var $author$project$DnDList$DragOver = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onMouseEnter = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mouseenter',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$Events$onMouseLeave = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mouseleave',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$Events$onMouseOver = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mouseover',
		$elm$json$Json$Decode$succeed(msg));
};
var $author$project$DnDList$dropEvents = F3(
	function (stepMsg, dropIndex, dropElementId) {
		return _List_fromArray(
			[
				$elm$html$Html$Events$onMouseOver(
				stepMsg(
					A2($author$project$DnDList$DragOver, dropIndex, dropElementId))),
				$elm$html$Html$Events$onMouseEnter(
				stepMsg(
					$author$project$DnDList$DragEnter(dropIndex))),
				$elm$html$Html$Events$onMouseLeave(
				stepMsg($author$project$DnDList$DragLeave))
			]);
	});
var $author$project$Internal$Common$Utils$px = function (n) {
	return $elm$core$String$fromInt(n) + 'px';
};
var $elm$core$Basics$round = _Basics_round;
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $author$project$Internal$Common$Utils$translate = F2(
	function (x, y) {
		return 'translate3d(' + ($author$project$Internal$Common$Utils$px(x) + (', ' + ($author$project$Internal$Common$Utils$px(y) + ', 0)')));
	});
var $author$project$DnDList$ghostStyles = F2(
	function (movement, _v0) {
		var model = _v0;
		if (model.$ === 1) {
			return _List_Nil;
		} else {
			var state = model.a;
			var _v2 = state.R;
			if (!_v2.$) {
				var element = _v2.a.cW;
				var transform = function () {
					switch (movement) {
						case 1:
							return A2(
								$elm$html$Html$Attributes$style,
								'transform',
								A2(
									$author$project$Internal$Common$Utils$translate,
									$elm$core$Basics$round((state.w.Y - state.J.Y) + element.Y),
									$elm$core$Basics$round(element.Z)));
						case 2:
							return A2(
								$elm$html$Html$Attributes$style,
								'transform',
								A2(
									$author$project$Internal$Common$Utils$translate,
									$elm$core$Basics$round(element.Y),
									$elm$core$Basics$round((state.w.Z - state.J.Z) + element.Z)));
						default:
							return A2(
								$elm$html$Html$Attributes$style,
								'transform',
								A2(
									$author$project$Internal$Common$Utils$translate,
									$elm$core$Basics$round((state.w.Y - state.J.Y) + element.Y),
									$elm$core$Basics$round((state.w.Z - state.J.Z) + element.Z)));
					}
				}();
				var baseStyles = _List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
						A2($elm$html$Html$Attributes$style, 'top', '0'),
						A2($elm$html$Html$Attributes$style, 'left', '0'),
						A2(
						$elm$html$Html$Attributes$style,
						'height',
						$author$project$Internal$Common$Utils$px(
							$elm$core$Basics$round(element.c2))),
						A2(
						$elm$html$Html$Attributes$style,
						'width',
						$author$project$Internal$Common$Utils$px(
							$elm$core$Basics$round(element.d4))),
						A2($elm$html$Html$Attributes$style, 'pointer-events', 'none')
					]);
				return A2($elm$core$List$cons, transform, baseStyles);
			} else {
				return _List_Nil;
			}
		}
	});
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (!maybeValue.$) {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Maybe$map2 = F3(
	function (func, ma, mb) {
		if (ma.$ === 1) {
			return $elm$core$Maybe$Nothing;
		} else {
			var a = ma.a;
			if (mb.$ === 1) {
				return $elm$core$Maybe$Nothing;
			} else {
				var b = mb.a;
				return $elm$core$Maybe$Just(
					A2(func, a, b));
			}
		}
	});
var $author$project$DnDList$info = function (_v0) {
	var model = _v0;
	return A2(
		$elm$core$Maybe$andThen,
		function (state) {
			return A3(
				$elm$core$Maybe$map2,
				F2(
					function (dragElement, dropElement) {
						return {w: state.w, R: dragElement, aq: state.aq, a9: state.a9, ac: dropElement, ad: state.ad, cV: state.cV, J: state.J};
					}),
				state.R,
				state.ac);
		},
		model);
};
var $author$project$DnDList$Drag = function (a) {
	return {$: 1, a: a};
};
var $author$project$DnDList$DragEnd = {$: 5};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $elm$browser$Browser$Events$Document = 0;
var $elm$browser$Browser$Events$MySub = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$browser$Browser$Events$State = F2(
	function (subs, pids) {
		return {bV: pids, b4: subs};
	});
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$browser$Browser$Events$init = $elm$core$Task$succeed(
	A2($elm$browser$Browser$Events$State, _List_Nil, $elm$core$Dict$empty));
var $elm$browser$Browser$Events$nodeToKey = function (node) {
	if (!node) {
		return 'd_';
	} else {
		return 'w_';
	}
};
var $elm$browser$Browser$Events$addKey = function (sub) {
	var node = sub.a;
	var name = sub.b;
	return _Utils_Tuple2(
		_Utils_ap(
			$elm$browser$Browser$Events$nodeToKey(node),
			name),
		sub);
};
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === -2) {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$browser$Browser$Events$Event = F2(
	function (key, event) {
		return {bC: event, bf: key};
	});
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$browser$Browser$Events$spawn = F3(
	function (router, key, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var actualNode = function () {
			if (!node) {
				return _Browser_doc;
			} else {
				return _Browser_window;
			}
		}();
		return A2(
			$elm$core$Task$map,
			function (value) {
				return _Utils_Tuple2(key, value);
			},
			A3(
				_Browser_on,
				actualNode,
				name,
				function (event) {
					return A2(
						$elm$core$Platform$sendToSelf,
						router,
						A2($elm$browser$Browser$Events$Event, key, event));
				}));
	});
var $elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3($elm$core$Dict$foldl, $elm$core$Dict$insert, t2, t1);
	});
var $elm$browser$Browser$Events$onEffects = F3(
	function (router, subs, state) {
		var stepRight = F3(
			function (key, sub, _v6) {
				var deads = _v6.a;
				var lives = _v6.b;
				var news = _v6.c;
				return _Utils_Tuple3(
					deads,
					lives,
					A2(
						$elm$core$List$cons,
						A3($elm$browser$Browser$Events$spawn, router, key, sub),
						news));
			});
		var stepLeft = F3(
			function (_v4, pid, _v5) {
				var deads = _v5.a;
				var lives = _v5.b;
				var news = _v5.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, pid, deads),
					lives,
					news);
			});
		var stepBoth = F4(
			function (key, pid, _v2, _v3) {
				var deads = _v3.a;
				var lives = _v3.b;
				var news = _v3.c;
				return _Utils_Tuple3(
					deads,
					A3($elm$core$Dict$insert, key, pid, lives),
					news);
			});
		var newSubs = A2($elm$core$List$map, $elm$browser$Browser$Events$addKey, subs);
		var _v0 = A6(
			$elm$core$Dict$merge,
			stepLeft,
			stepBoth,
			stepRight,
			state.bV,
			$elm$core$Dict$fromList(newSubs),
			_Utils_Tuple3(_List_Nil, $elm$core$Dict$empty, _List_Nil));
		var deadPids = _v0.a;
		var livePids = _v0.b;
		var makeNewPids = _v0.c;
		return A2(
			$elm$core$Task$andThen,
			function (pids) {
				return $elm$core$Task$succeed(
					A2(
						$elm$browser$Browser$Events$State,
						newSubs,
						A2(
							$elm$core$Dict$union,
							livePids,
							$elm$core$Dict$fromList(pids))));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$sequence(makeNewPids);
				},
				$elm$core$Task$sequence(
					A2($elm$core$List$map, $elm$core$Process$kill, deadPids))));
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (!_v0.$) {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$browser$Browser$Events$onSelfMsg = F3(
	function (router, _v0, state) {
		var key = _v0.bf;
		var event = _v0.bC;
		var toMessage = function (_v2) {
			var subKey = _v2.a;
			var _v3 = _v2.b;
			var node = _v3.a;
			var name = _v3.b;
			var decoder = _v3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : $elm$core$Maybe$Nothing;
		};
		var messages = A2($elm$core$List$filterMap, toMessage, state.b4);
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Platform$sendToApp(router),
					messages)));
	});
var $elm$browser$Browser$Events$subMap = F2(
	function (func, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var decoder = _v0.c;
		return A3(
			$elm$browser$Browser$Events$MySub,
			node,
			name,
			A2($elm$json$Json$Decode$map, func, decoder));
	});
_Platform_effectManagers['Browser.Events'] = _Platform_createManager($elm$browser$Browser$Events$init, $elm$browser$Browser$Events$onEffects, $elm$browser$Browser$Events$onSelfMsg, 0, $elm$browser$Browser$Events$subMap);
var $elm$browser$Browser$Events$subscription = _Platform_leaf('Browser.Events');
var $elm$browser$Browser$Events$on = F3(
	function (node, name, decoder) {
		return $elm$browser$Browser$Events$subscription(
			A3($elm$browser$Browser$Events$MySub, node, name, decoder));
	});
var $elm$browser$Browser$Events$onMouseMove = A2($elm$browser$Browser$Events$on, 0, 'mousemove');
var $elm$browser$Browser$Events$onMouseUp = A2($elm$browser$Browser$Events$on, 0, 'mouseup');
var $author$project$DnDList$subscriptions = F2(
	function (stepMsg, _v0) {
		var model = _v0;
		if (model.$ === 1) {
			return $elm$core$Platform$Sub$none;
		} else {
			return $elm$core$Platform$Sub$batch(
				_List_fromArray(
					[
						$elm$browser$Browser$Events$onMouseMove(
						A2(
							$elm$json$Json$Decode$map,
							A2($elm$core$Basics$composeL, stepMsg, $author$project$DnDList$Drag),
							$author$project$Internal$Common$Utils$decodeCoordinates)),
						$elm$browser$Browser$Events$onMouseUp(
						$elm$json$Json$Decode$succeed(
							stepMsg($author$project$DnDList$DragEnd)))
					]));
		}
	});
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $author$project$Internal$Common$Operations$splitAt = F2(
	function (i, list) {
		return _Utils_Tuple2(
			A2($elm$core$List$take, i, list),
			A2($elm$core$List$drop, i, list));
	});
var $author$project$Internal$Common$Operations$afterBackward = F3(
	function (i, j, list) {
		var _v0 = A2($author$project$Internal$Common$Operations$splitAt, j + 1, list);
		var beginning = _v0.a;
		var rest = _v0.b;
		var _v1 = A2($author$project$Internal$Common$Operations$splitAt, (i - j) - 1, rest);
		var middle = _v1.a;
		var end = _v1.b;
		var _v2 = A2($author$project$Internal$Common$Operations$splitAt, 1, end);
		var head = _v2.a;
		var tail = _v2.b;
		return _Utils_ap(
			beginning,
			_Utils_ap(
				head,
				_Utils_ap(middle, tail)));
	});
var $author$project$Internal$Common$Operations$afterForward = F3(
	function (i, j, list) {
		var _v0 = A2($author$project$Internal$Common$Operations$splitAt, i, list);
		var beginning = _v0.a;
		var rest = _v0.b;
		var _v1 = A2($author$project$Internal$Common$Operations$splitAt, (j - i) + 1, rest);
		var middle = _v1.a;
		var end = _v1.b;
		var _v2 = A2($author$project$Internal$Common$Operations$splitAt, 1, middle);
		var head = _v2.a;
		var tail = _v2.b;
		return _Utils_ap(
			beginning,
			_Utils_ap(
				tail,
				_Utils_ap(head, end)));
	});
var $author$project$Internal$Common$Operations$insertAfter = F3(
	function (dragIndex, dropIndex, list) {
		return (_Utils_cmp(dragIndex, dropIndex) < 0) ? A3($author$project$Internal$Common$Operations$afterForward, dragIndex, dropIndex, list) : ((_Utils_cmp(dropIndex, dragIndex) < 0) ? A3($author$project$Internal$Common$Operations$afterBackward, dragIndex, dropIndex, list) : list);
	});
var $author$project$Internal$Common$Operations$beforeBackward = F3(
	function (i, j, list) {
		var _v0 = A2($author$project$Internal$Common$Operations$splitAt, j, list);
		var beginning = _v0.a;
		var rest = _v0.b;
		var _v1 = A2($author$project$Internal$Common$Operations$splitAt, i - j, rest);
		var middle = _v1.a;
		var end = _v1.b;
		var _v2 = A2($author$project$Internal$Common$Operations$splitAt, 1, end);
		var head = _v2.a;
		var tail = _v2.b;
		return _Utils_ap(
			beginning,
			_Utils_ap(
				head,
				_Utils_ap(middle, tail)));
	});
var $author$project$Internal$Common$Operations$beforeForward = F3(
	function (i, j, list) {
		var _v0 = A2($author$project$Internal$Common$Operations$splitAt, i, list);
		var beginning = _v0.a;
		var rest = _v0.b;
		var _v1 = A2($author$project$Internal$Common$Operations$splitAt, j - i, rest);
		var middle = _v1.a;
		var end = _v1.b;
		var _v2 = A2($author$project$Internal$Common$Operations$splitAt, 1, middle);
		var head = _v2.a;
		var tail = _v2.b;
		return _Utils_ap(
			beginning,
			_Utils_ap(
				tail,
				_Utils_ap(head, end)));
	});
var $author$project$Internal$Common$Operations$insertBefore = F3(
	function (dragIndex, dropIndex, list) {
		return (_Utils_cmp(dragIndex, dropIndex) < 0) ? A3($author$project$Internal$Common$Operations$beforeForward, dragIndex, dropIndex, list) : ((_Utils_cmp(dropIndex, dragIndex) < 0) ? A3($author$project$Internal$Common$Operations$beforeBackward, dragIndex, dropIndex, list) : list);
	});
var $author$project$Internal$Common$Operations$rotate = F3(
	function (dragIndex, dropIndex, list) {
		return (_Utils_cmp(dragIndex, dropIndex) < 0) ? A3($author$project$Internal$Common$Operations$afterForward, dragIndex, dropIndex, list) : ((_Utils_cmp(dropIndex, dragIndex) < 0) ? A3($author$project$Internal$Common$Operations$beforeBackward, dragIndex, dropIndex, list) : list);
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $author$project$Internal$Common$Operations$swapAt = F3(
	function (i, j, list) {
		var item_j = A2(
			$elm$core$List$take,
			1,
			A2($elm$core$List$drop, j, list));
		var item_i = A2(
			$elm$core$List$take,
			1,
			A2($elm$core$List$drop, i, list));
		return $elm$core$List$concat(
			A2(
				$elm$core$List$indexedMap,
				F2(
					function (index, item) {
						return _Utils_eq(index, i) ? item_j : (_Utils_eq(index, j) ? item_i : _List_fromArray(
							[item]));
					}),
				list));
	});
var $author$project$Internal$Common$Operations$swap = F3(
	function (dragIndex, dropIndex, list) {
		return (!_Utils_eq(dragIndex, dropIndex)) ? A3($author$project$Internal$Common$Operations$swapAt, dragIndex, dropIndex, list) : list;
	});
var $author$project$DnDList$listUpdate = F4(
	function (operation, dragIndex, dropIndex, list) {
		switch (operation) {
			case 0:
				return A3($author$project$Internal$Common$Operations$insertAfter, dragIndex, dropIndex, list);
			case 1:
				return A3($author$project$Internal$Common$Operations$insertBefore, dragIndex, dropIndex, list);
			case 2:
				return A3($author$project$Internal$Common$Operations$rotate, dragIndex, dropIndex, list);
			case 3:
				return A3($author$project$Internal$Common$Operations$swap, dragIndex, dropIndex, list);
			default:
				return list;
		}
	});
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$DnDList$stateUpdate = F3(
	function (operation, dropIndex, state) {
		switch (operation) {
			case 0:
				return _Utils_update(
					state,
					{
						n: 0,
						a9: (_Utils_cmp(dropIndex, state.a9) < 0) ? (dropIndex + 1) : dropIndex
					});
			case 1:
				return _Utils_update(
					state,
					{
						n: 0,
						a9: (_Utils_cmp(state.a9, dropIndex) < 0) ? (dropIndex - 1) : dropIndex
					});
			case 2:
				return _Utils_update(
					state,
					{n: 0, a9: dropIndex});
			case 3:
				return _Utils_update(
					state,
					{n: 0, a9: dropIndex});
			default:
				return _Utils_update(
					state,
					{n: 0});
		}
	});
var $author$project$DnDList$update = F4(
	function (_v0, msg, _v1, list) {
		var beforeUpdate = _v0.cv;
		var listen = _v0.dg;
		var operation = _v0.ds;
		var model = _v1;
		switch (msg.$) {
			case 0:
				var dragIndex = msg.a;
				var dragElementId = msg.b;
				var xy = msg.c;
				return _Utils_Tuple2(
					$elm$core$Maybe$Just(
						{w: xy, n: 0, R: $elm$core$Maybe$Nothing, aq: dragElementId, a9: dragIndex, ac: $elm$core$Maybe$Nothing, ad: dragElementId, cV: dragIndex, J: xy}),
					list);
			case 1:
				var xy = msg.a;
				return _Utils_Tuple2(
					A2(
						$elm$core$Maybe$map,
						function (state) {
							return _Utils_update(
								state,
								{w: xy, n: state.n + 1});
						},
						model),
					list);
			case 2:
				var dropIndex = msg.a;
				var dropElementId = msg.b;
				return _Utils_Tuple2(
					A2(
						$elm$core$Maybe$map,
						function (state) {
							return _Utils_update(
								state,
								{ad: dropElementId, cV: dropIndex});
						},
						model),
					list);
			case 3:
				var dropIndex = msg.a;
				var _v3 = _Utils_Tuple2(model, listen);
				if ((!_v3.a.$) && (!_v3.b)) {
					var state = _v3.a.a;
					var _v4 = _v3.b;
					return ((state.n > 1) && (!_Utils_eq(state.a9, dropIndex))) ? _Utils_Tuple2(
						$elm$core$Maybe$Just(
							A3($author$project$DnDList$stateUpdate, operation, dropIndex, state)),
						A4(
							$author$project$DnDList$listUpdate,
							operation,
							state.a9,
							dropIndex,
							A3(beforeUpdate, state.a9, dropIndex, list))) : _Utils_Tuple2(model, list);
				} else {
					return _Utils_Tuple2(
						A2(
							$elm$core$Maybe$map,
							function (state) {
								return _Utils_update(
									state,
									{n: 0});
							},
							model),
						list);
				}
			case 4:
				return _Utils_Tuple2(
					A2(
						$elm$core$Maybe$map,
						function (state) {
							return _Utils_update(
								state,
								{cV: state.a9});
						},
						model),
					list);
			case 5:
				var _v5 = _Utils_Tuple2(model, listen);
				if ((!_v5.a.$) && (_v5.b === 1)) {
					var state = _v5.a.a;
					var _v6 = _v5.b;
					return (!_Utils_eq(state.a9, state.cV)) ? _Utils_Tuple2(
						$elm$core$Maybe$Nothing,
						A4(
							$author$project$DnDList$listUpdate,
							operation,
							state.a9,
							state.cV,
							A3(beforeUpdate, state.a9, state.cV, list))) : _Utils_Tuple2($elm$core$Maybe$Nothing, list);
				} else {
					return _Utils_Tuple2($elm$core$Maybe$Nothing, list);
				}
			case 6:
				if (msg.a.$ === 1) {
					return _Utils_Tuple2(model, list);
				} else {
					var dragElement = msg.a.a;
					return _Utils_Tuple2(
						A2(
							$elm$core$Maybe$map,
							function (state) {
								return _Utils_update(
									state,
									{
										R: $elm$core$Maybe$Just(dragElement),
										ac: $elm$core$Maybe$Just(dragElement)
									});
							},
							model),
						list);
				}
			default:
				if (msg.a.$ === 1) {
					return _Utils_Tuple2(model, list);
				} else {
					var dropElement = msg.a.a;
					return _Utils_Tuple2(
						A2(
							$elm$core$Maybe$map,
							function (state) {
								return _Utils_update(
									state,
									{
										ac: $elm$core$Maybe$Just(dropElement)
									});
							},
							model),
						list);
				}
		}
	});
var $author$project$DnDList$create = F2(
	function (config, stepMsg) {
		return {
			cM: $author$project$DnDList$commands(stepMsg),
			cT: $author$project$DnDList$dragEvents(stepMsg),
			cU: $author$project$DnDList$dropEvents(stepMsg),
			c$: $author$project$DnDList$ghostStyles(config.dk),
			be: $author$project$DnDList$info,
			dj: $elm$core$Maybe$Nothing,
			b5: $author$project$DnDList$subscriptions(stepMsg),
			b9: $author$project$DnDList$update(config)
		};
	});
var $author$project$Config$Movement$FreeOnDrag$system = A2($author$project$DnDList$create, $author$project$Config$Movement$FreeOnDrag$config, $author$project$Config$Movement$FreeOnDrag$MyMsg);
var $author$project$Config$Movement$FreeOnDrag$initialModel = {K: _List_Nil, Q: $author$project$Config$Movement$FreeOnDrag$system.dj, au: $author$project$Config$Movement$FreeOnDrag$data};
var $author$project$Config$Movement$FreeOnDrop$data = A2(
	$elm$core$List$map,
	$elm$core$String$fromInt,
	A2($elm$core$List$range, 1, 9));
var $author$project$Config$Movement$FreeOnDrop$MyMsg = function (a) {
	return {$: 0, a: a};
};
var $author$project$DnDList$OnDrop = 1;
var $author$project$Config$Movement$FreeOnDrop$config = {
	cv: F3(
		function (_v0, _v1, list) {
			return list;
		}),
	dg: 1,
	dk: 0,
	ds: 3
};
var $author$project$Config$Movement$FreeOnDrop$system = A2($author$project$DnDList$create, $author$project$Config$Movement$FreeOnDrop$config, $author$project$Config$Movement$FreeOnDrop$MyMsg);
var $author$project$Config$Movement$FreeOnDrop$initialModel = {K: _List_Nil, Q: $author$project$Config$Movement$FreeOnDrop$system.dj, au: $author$project$Config$Movement$FreeOnDrop$data};
var $author$project$Config$Movement$HorizontalOnDrag$data = A2(
	$elm$core$List$map,
	$elm$core$String$fromInt,
	A2($elm$core$List$range, 1, 7));
var $author$project$Config$Movement$HorizontalOnDrag$MyMsg = function (a) {
	return {$: 0, a: a};
};
var $author$project$DnDList$Horizontal = 1;
var $author$project$Config$Movement$HorizontalOnDrag$config = {
	cv: F3(
		function (_v0, _v1, list) {
			return list;
		}),
	dg: 0,
	dk: 1,
	ds: 3
};
var $author$project$Config$Movement$HorizontalOnDrag$system = A2($author$project$DnDList$create, $author$project$Config$Movement$HorizontalOnDrag$config, $author$project$Config$Movement$HorizontalOnDrag$MyMsg);
var $author$project$Config$Movement$HorizontalOnDrag$initialModel = {K: _List_Nil, Q: $author$project$Config$Movement$HorizontalOnDrag$system.dj, au: $author$project$Config$Movement$HorizontalOnDrag$data};
var $author$project$Config$Movement$HorizontalOnDrop$data = A2(
	$elm$core$List$map,
	$elm$core$String$fromInt,
	A2($elm$core$List$range, 1, 7));
var $author$project$Config$Movement$HorizontalOnDrop$MyMsg = function (a) {
	return {$: 0, a: a};
};
var $author$project$Config$Movement$HorizontalOnDrop$config = {
	cv: F3(
		function (_v0, _v1, list) {
			return list;
		}),
	dg: 1,
	dk: 1,
	ds: 3
};
var $author$project$Config$Movement$HorizontalOnDrop$system = A2($author$project$DnDList$create, $author$project$Config$Movement$HorizontalOnDrop$config, $author$project$Config$Movement$HorizontalOnDrop$MyMsg);
var $author$project$Config$Movement$HorizontalOnDrop$initialModel = {K: _List_Nil, Q: $author$project$Config$Movement$HorizontalOnDrop$system.dj, au: $author$project$Config$Movement$HorizontalOnDrop$data};
var $author$project$Config$Movement$VerticalOnDrag$data = A2(
	$elm$core$List$map,
	$elm$core$String$fromInt,
	A2($elm$core$List$range, 1, 7));
var $author$project$Config$Movement$VerticalOnDrag$MyMsg = function (a) {
	return {$: 0, a: a};
};
var $author$project$DnDList$Vertical = 2;
var $author$project$Config$Movement$VerticalOnDrag$config = {
	cv: F3(
		function (_v0, _v1, list) {
			return list;
		}),
	dg: 0,
	dk: 2,
	ds: 3
};
var $author$project$Config$Movement$VerticalOnDrag$system = A2($author$project$DnDList$create, $author$project$Config$Movement$VerticalOnDrag$config, $author$project$Config$Movement$VerticalOnDrag$MyMsg);
var $author$project$Config$Movement$VerticalOnDrag$initialModel = {K: _List_Nil, Q: $author$project$Config$Movement$VerticalOnDrag$system.dj, au: $author$project$Config$Movement$VerticalOnDrag$data};
var $author$project$Config$Movement$VerticalOnDrop$data = A2(
	$elm$core$List$map,
	$elm$core$String$fromInt,
	A2($elm$core$List$range, 1, 7));
var $author$project$Config$Movement$VerticalOnDrop$MyMsg = function (a) {
	return {$: 0, a: a};
};
var $author$project$Config$Movement$VerticalOnDrop$config = {
	cv: F3(
		function (_v0, _v1, list) {
			return list;
		}),
	dg: 1,
	dk: 2,
	ds: 3
};
var $author$project$Config$Movement$VerticalOnDrop$system = A2($author$project$DnDList$create, $author$project$Config$Movement$VerticalOnDrop$config, $author$project$Config$Movement$VerticalOnDrop$MyMsg);
var $author$project$Config$Movement$VerticalOnDrop$initialModel = {K: _List_Nil, Q: $author$project$Config$Movement$VerticalOnDrop$system.dj, au: $author$project$Config$Movement$VerticalOnDrop$data};
var $author$project$Config$Movement$Root$initialModel = {
	S: _List_fromArray(
		[
			$author$project$Config$Movement$Root$FreeOnDrag($author$project$Config$Movement$FreeOnDrag$initialModel),
			$author$project$Config$Movement$Root$FreeOnDrop($author$project$Config$Movement$FreeOnDrop$initialModel),
			$author$project$Config$Movement$Root$HorizontalOnDrag($author$project$Config$Movement$HorizontalOnDrag$initialModel),
			$author$project$Config$Movement$Root$HorizontalOnDrop($author$project$Config$Movement$HorizontalOnDrop$initialModel),
			$author$project$Config$Movement$Root$VerticalOnDrag($author$project$Config$Movement$VerticalOnDrag$initialModel),
			$author$project$Config$Movement$Root$VerticalOnDrop($author$project$Config$Movement$VerticalOnDrop$initialModel)
		]),
	at: 0
};
var $author$project$Config$OperationsOnDrag$Root$InsertAfter = function (a) {
	return {$: 0, a: a};
};
var $author$project$Config$OperationsOnDrag$Root$InsertBefore = function (a) {
	return {$: 1, a: a};
};
var $author$project$Config$OperationsOnDrag$Root$Rotate = function (a) {
	return {$: 2, a: a};
};
var $author$project$Config$OperationsOnDrag$Root$Swap = function (a) {
	return {$: 3, a: a};
};
var $author$project$Config$OperationsOnDrag$Root$Unaltered = function (a) {
	return {$: 4, a: a};
};
var $author$project$Config$OperationsOnDrag$InsertAfter$Item = F2(
	function (value, color) {
		return {aV: color, aB: value};
	});
var $author$project$Config$OperationsOnDrag$InsertAfter$baseColor = 'dimgray';
var $author$project$Config$OperationsOnDrag$InsertAfter$data = A2(
	$elm$core$List$map,
	function (i) {
		return A2(
			$author$project$Config$OperationsOnDrag$InsertAfter$Item,
			$elm$core$String$fromInt(i),
			$author$project$Config$OperationsOnDrag$InsertAfter$baseColor);
	},
	A2($elm$core$List$range, 1, 9));
var $author$project$Config$OperationsOnDrag$InsertAfter$MyMsg = function (a) {
	return {$: 0, a: a};
};
var $author$project$DnDList$InsertAfter = 0;
var $author$project$Config$OperationsOnDrag$InsertAfter$affectedColor = 'purple';
var $author$project$Config$OperationsOnDrag$InsertAfter$dragColor = 'red';
var $author$project$Config$OperationsOnDrag$InsertAfter$dropColor = 'green';
var $author$project$Config$OperationsOnDrag$InsertAfter$beforeUpdate = F3(
	function (dragIndex, dropIndex, items) {
		return (_Utils_cmp(dragIndex, dropIndex) < 0) ? A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, _v0) {
					var value = _v0.aB;
					var color = _v0.aV;
					return _Utils_eq(i, dragIndex) ? A2($author$project$Config$OperationsOnDrag$InsertAfter$Item, value, $author$project$Config$OperationsOnDrag$InsertAfter$dragColor) : (_Utils_eq(i, dropIndex) ? A2($author$project$Config$OperationsOnDrag$InsertAfter$Item, value, $author$project$Config$OperationsOnDrag$InsertAfter$dropColor) : (((_Utils_cmp(dragIndex, i) < 0) && (_Utils_cmp(i, dropIndex) < 0)) ? A2($author$project$Config$OperationsOnDrag$InsertAfter$Item, value, $author$project$Config$OperationsOnDrag$InsertAfter$affectedColor) : A2($author$project$Config$OperationsOnDrag$InsertAfter$Item, value, color)));
				}),
			items) : ((_Utils_cmp(dragIndex, dropIndex) > 0) ? A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, _v1) {
					var value = _v1.aB;
					var color = _v1.aV;
					return _Utils_eq(i, dragIndex) ? A2($author$project$Config$OperationsOnDrag$InsertAfter$Item, value, $author$project$Config$OperationsOnDrag$InsertAfter$dragColor) : (_Utils_eq(i, dropIndex) ? A2($author$project$Config$OperationsOnDrag$InsertAfter$Item, value, $author$project$Config$OperationsOnDrag$InsertAfter$dropColor) : (((_Utils_cmp(dropIndex, i) < 0) && (_Utils_cmp(i, dragIndex) < 0)) ? A2($author$project$Config$OperationsOnDrag$InsertAfter$Item, value, $author$project$Config$OperationsOnDrag$InsertAfter$affectedColor) : A2($author$project$Config$OperationsOnDrag$InsertAfter$Item, value, color)));
				}),
			items) : items);
	});
var $author$project$Config$OperationsOnDrag$InsertAfter$config = {cv: $author$project$Config$OperationsOnDrag$InsertAfter$beforeUpdate, dg: 0, dk: 0, ds: 0};
var $author$project$Config$OperationsOnDrag$InsertAfter$system = A2($author$project$DnDList$create, $author$project$Config$OperationsOnDrag$InsertAfter$config, $author$project$Config$OperationsOnDrag$InsertAfter$MyMsg);
var $author$project$Config$OperationsOnDrag$InsertAfter$initialModel = {Q: $author$project$Config$OperationsOnDrag$InsertAfter$system.dj, au: $author$project$Config$OperationsOnDrag$InsertAfter$data};
var $author$project$Config$OperationsOnDrag$InsertBefore$Item = F2(
	function (value, color) {
		return {aV: color, aB: value};
	});
var $author$project$Config$OperationsOnDrag$InsertBefore$baseColor = 'dimgray';
var $author$project$Config$OperationsOnDrag$InsertBefore$data = A2(
	$elm$core$List$map,
	function (i) {
		return A2(
			$author$project$Config$OperationsOnDrag$InsertBefore$Item,
			$elm$core$String$fromInt(i),
			$author$project$Config$OperationsOnDrag$InsertBefore$baseColor);
	},
	A2($elm$core$List$range, 1, 9));
var $author$project$Config$OperationsOnDrag$InsertBefore$MyMsg = function (a) {
	return {$: 0, a: a};
};
var $author$project$DnDList$InsertBefore = 1;
var $author$project$Config$OperationsOnDrag$InsertBefore$affectedColor = 'purple';
var $author$project$Config$OperationsOnDrag$InsertBefore$dragColor = 'red';
var $author$project$Config$OperationsOnDrag$InsertBefore$dropColor = 'green';
var $author$project$Config$OperationsOnDrag$InsertBefore$beforeUpdate = F3(
	function (dragIndex, dropIndex, items) {
		return (_Utils_cmp(dragIndex, dropIndex) < 0) ? A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, _v0) {
					var value = _v0.aB;
					var color = _v0.aV;
					return _Utils_eq(i, dragIndex) ? A2($author$project$Config$OperationsOnDrag$InsertBefore$Item, value, $author$project$Config$OperationsOnDrag$InsertBefore$dragColor) : (_Utils_eq(i, dropIndex) ? A2($author$project$Config$OperationsOnDrag$InsertBefore$Item, value, $author$project$Config$OperationsOnDrag$InsertBefore$dropColor) : (((_Utils_cmp(dragIndex, i) < 0) && (_Utils_cmp(i, dropIndex) < 0)) ? A2($author$project$Config$OperationsOnDrag$InsertBefore$Item, value, $author$project$Config$OperationsOnDrag$InsertBefore$affectedColor) : A2($author$project$Config$OperationsOnDrag$InsertBefore$Item, value, color)));
				}),
			items) : ((_Utils_cmp(dragIndex, dropIndex) > 0) ? A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, _v1) {
					var value = _v1.aB;
					var color = _v1.aV;
					return _Utils_eq(i, dragIndex) ? A2($author$project$Config$OperationsOnDrag$InsertBefore$Item, value, $author$project$Config$OperationsOnDrag$InsertBefore$dragColor) : (_Utils_eq(i, dropIndex) ? A2($author$project$Config$OperationsOnDrag$InsertBefore$Item, value, $author$project$Config$OperationsOnDrag$InsertBefore$dropColor) : (((_Utils_cmp(dropIndex, i) < 0) && (_Utils_cmp(i, dragIndex) < 0)) ? A2($author$project$Config$OperationsOnDrag$InsertBefore$Item, value, $author$project$Config$OperationsOnDrag$InsertBefore$affectedColor) : A2($author$project$Config$OperationsOnDrag$InsertBefore$Item, value, color)));
				}),
			items) : items);
	});
var $author$project$Config$OperationsOnDrag$InsertBefore$config = {cv: $author$project$Config$OperationsOnDrag$InsertBefore$beforeUpdate, dg: 0, dk: 0, ds: 1};
var $author$project$Config$OperationsOnDrag$InsertBefore$system = A2($author$project$DnDList$create, $author$project$Config$OperationsOnDrag$InsertBefore$config, $author$project$Config$OperationsOnDrag$InsertBefore$MyMsg);
var $author$project$Config$OperationsOnDrag$InsertBefore$initialModel = {Q: $author$project$Config$OperationsOnDrag$InsertBefore$system.dj, au: $author$project$Config$OperationsOnDrag$InsertBefore$data};
var $author$project$Config$OperationsOnDrag$Rotate$Item = F2(
	function (value, color) {
		return {aV: color, aB: value};
	});
var $author$project$Config$OperationsOnDrag$Rotate$baseColor = 'dimgray';
var $author$project$Config$OperationsOnDrag$Rotate$data = A2(
	$elm$core$List$map,
	function (i) {
		return A2(
			$author$project$Config$OperationsOnDrag$Rotate$Item,
			$elm$core$String$fromInt(i),
			$author$project$Config$OperationsOnDrag$Rotate$baseColor);
	},
	A2($elm$core$List$range, 1, 9));
var $author$project$Config$OperationsOnDrag$Rotate$MyMsg = function (a) {
	return {$: 0, a: a};
};
var $author$project$DnDList$Rotate = 2;
var $author$project$Config$OperationsOnDrag$Rotate$affectedColor = 'purple';
var $author$project$Config$OperationsOnDrag$Rotate$dragColor = 'red';
var $author$project$Config$OperationsOnDrag$Rotate$dropColor = 'green';
var $author$project$Config$OperationsOnDrag$Rotate$beforeUpdate = F3(
	function (dragIndex, dropIndex, items) {
		return (_Utils_cmp(dragIndex, dropIndex) < 0) ? A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, _v0) {
					var value = _v0.aB;
					var color = _v0.aV;
					return _Utils_eq(i, dragIndex) ? A2($author$project$Config$OperationsOnDrag$Rotate$Item, value, $author$project$Config$OperationsOnDrag$Rotate$dragColor) : (_Utils_eq(i, dropIndex) ? A2($author$project$Config$OperationsOnDrag$Rotate$Item, value, $author$project$Config$OperationsOnDrag$Rotate$dropColor) : (((_Utils_cmp(dragIndex, i) < 0) && (_Utils_cmp(i, dropIndex) < 0)) ? A2($author$project$Config$OperationsOnDrag$Rotate$Item, value, $author$project$Config$OperationsOnDrag$Rotate$affectedColor) : A2($author$project$Config$OperationsOnDrag$Rotate$Item, value, color)));
				}),
			items) : ((_Utils_cmp(dragIndex, dropIndex) > 0) ? A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, _v1) {
					var value = _v1.aB;
					var color = _v1.aV;
					return _Utils_eq(i, dragIndex) ? A2($author$project$Config$OperationsOnDrag$Rotate$Item, value, $author$project$Config$OperationsOnDrag$Rotate$dragColor) : (_Utils_eq(i, dropIndex) ? A2($author$project$Config$OperationsOnDrag$Rotate$Item, value, $author$project$Config$OperationsOnDrag$Rotate$dropColor) : (((_Utils_cmp(dropIndex, i) < 0) && (_Utils_cmp(i, dragIndex) < 0)) ? A2($author$project$Config$OperationsOnDrag$Rotate$Item, value, $author$project$Config$OperationsOnDrag$Rotate$affectedColor) : A2($author$project$Config$OperationsOnDrag$Rotate$Item, value, color)));
				}),
			items) : items);
	});
var $author$project$Config$OperationsOnDrag$Rotate$config = {cv: $author$project$Config$OperationsOnDrag$Rotate$beforeUpdate, dg: 0, dk: 0, ds: 2};
var $author$project$Config$OperationsOnDrag$Rotate$system = A2($author$project$DnDList$create, $author$project$Config$OperationsOnDrag$Rotate$config, $author$project$Config$OperationsOnDrag$Rotate$MyMsg);
var $author$project$Config$OperationsOnDrag$Rotate$initialModel = {Q: $author$project$Config$OperationsOnDrag$Rotate$system.dj, au: $author$project$Config$OperationsOnDrag$Rotate$data};
var $author$project$Config$OperationsOnDrag$Swap$Item = F2(
	function (value, color) {
		return {aV: color, aB: value};
	});
var $author$project$Config$OperationsOnDrag$Swap$baseColor = 'dimgray';
var $author$project$Config$OperationsOnDrag$Swap$data = A2(
	$elm$core$List$map,
	function (i) {
		return A2(
			$author$project$Config$OperationsOnDrag$Swap$Item,
			$elm$core$String$fromInt(i),
			$author$project$Config$OperationsOnDrag$Swap$baseColor);
	},
	A2($elm$core$List$range, 1, 9));
var $author$project$Config$OperationsOnDrag$Swap$MyMsg = function (a) {
	return {$: 0, a: a};
};
var $author$project$Config$OperationsOnDrag$Swap$dragColor = 'red';
var $author$project$Config$OperationsOnDrag$Swap$dropColor = 'green';
var $author$project$Config$OperationsOnDrag$Swap$beforeUpdate = F3(
	function (dragIndex, dropIndex, items) {
		return (!_Utils_eq(dragIndex, dropIndex)) ? A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, _v0) {
					var value = _v0.aB;
					var color = _v0.aV;
					return _Utils_eq(i, dropIndex) ? A2($author$project$Config$OperationsOnDrag$Swap$Item, value, $author$project$Config$OperationsOnDrag$Swap$dropColor) : (_Utils_eq(i, dragIndex) ? A2($author$project$Config$OperationsOnDrag$Swap$Item, value, $author$project$Config$OperationsOnDrag$Swap$dragColor) : A2($author$project$Config$OperationsOnDrag$Swap$Item, value, color));
				}),
			items) : items;
	});
var $author$project$Config$OperationsOnDrag$Swap$config = {cv: $author$project$Config$OperationsOnDrag$Swap$beforeUpdate, dg: 0, dk: 0, ds: 3};
var $author$project$Config$OperationsOnDrag$Swap$system = A2($author$project$DnDList$create, $author$project$Config$OperationsOnDrag$Swap$config, $author$project$Config$OperationsOnDrag$Swap$MyMsg);
var $author$project$Config$OperationsOnDrag$Swap$initialModel = {Q: $author$project$Config$OperationsOnDrag$Swap$system.dj, au: $author$project$Config$OperationsOnDrag$Swap$data};
var $author$project$Config$OperationsOnDrag$Unaltered$Item = F2(
	function (value, color) {
		return {aV: color, aB: value};
	});
var $author$project$Config$OperationsOnDrag$Unaltered$baseColor = 'dimgray';
var $author$project$Config$OperationsOnDrag$Unaltered$data = A2(
	$elm$core$List$map,
	function (i) {
		return A2(
			$author$project$Config$OperationsOnDrag$Unaltered$Item,
			$elm$core$String$fromInt(i),
			$author$project$Config$OperationsOnDrag$Unaltered$baseColor);
	},
	A2($elm$core$List$range, 1, 9));
var $author$project$Config$OperationsOnDrag$Unaltered$MyMsg = function (a) {
	return {$: 0, a: a};
};
var $author$project$DnDList$Unaltered = 4;
var $author$project$Config$OperationsOnDrag$Unaltered$dragColor = 'red';
var $author$project$Config$OperationsOnDrag$Unaltered$dropColor = 'green';
var $author$project$Config$OperationsOnDrag$Unaltered$beforeUpdate = F3(
	function (dragIndex, dropIndex, items) {
		return (!_Utils_eq(dragIndex, dropIndex)) ? A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, _v0) {
					var value = _v0.aB;
					var color = _v0.aV;
					return _Utils_eq(i, dragIndex) ? A2($author$project$Config$OperationsOnDrag$Unaltered$Item, value, $author$project$Config$OperationsOnDrag$Unaltered$dragColor) : (_Utils_eq(i, dropIndex) ? A2($author$project$Config$OperationsOnDrag$Unaltered$Item, value, $author$project$Config$OperationsOnDrag$Unaltered$dropColor) : A2($author$project$Config$OperationsOnDrag$Unaltered$Item, value, color));
				}),
			items) : items;
	});
var $author$project$Config$OperationsOnDrag$Unaltered$config = {cv: $author$project$Config$OperationsOnDrag$Unaltered$beforeUpdate, dg: 0, dk: 0, ds: 4};
var $author$project$Config$OperationsOnDrag$Unaltered$system = A2($author$project$DnDList$create, $author$project$Config$OperationsOnDrag$Unaltered$config, $author$project$Config$OperationsOnDrag$Unaltered$MyMsg);
var $author$project$Config$OperationsOnDrag$Unaltered$initialModel = {Q: $author$project$Config$OperationsOnDrag$Unaltered$system.dj, au: $author$project$Config$OperationsOnDrag$Unaltered$data};
var $author$project$Config$OperationsOnDrag$Root$initialModel = {
	S: _List_fromArray(
		[
			$author$project$Config$OperationsOnDrag$Root$InsertAfter($author$project$Config$OperationsOnDrag$InsertAfter$initialModel),
			$author$project$Config$OperationsOnDrag$Root$InsertBefore($author$project$Config$OperationsOnDrag$InsertBefore$initialModel),
			$author$project$Config$OperationsOnDrag$Root$Rotate($author$project$Config$OperationsOnDrag$Rotate$initialModel),
			$author$project$Config$OperationsOnDrag$Root$Swap($author$project$Config$OperationsOnDrag$Swap$initialModel),
			$author$project$Config$OperationsOnDrag$Root$Unaltered($author$project$Config$OperationsOnDrag$Unaltered$initialModel)
		]),
	at: 0
};
var $author$project$Config$OperationsOnDrop$Root$InsertAfter = function (a) {
	return {$: 0, a: a};
};
var $author$project$Config$OperationsOnDrop$Root$InsertBefore = function (a) {
	return {$: 1, a: a};
};
var $author$project$Config$OperationsOnDrop$Root$Rotate = function (a) {
	return {$: 2, a: a};
};
var $author$project$Config$OperationsOnDrop$Root$Swap = function (a) {
	return {$: 3, a: a};
};
var $author$project$Config$OperationsOnDrop$Root$Unaltered = function (a) {
	return {$: 4, a: a};
};
var $author$project$Config$OperationsOnDrop$InsertAfter$Item = F2(
	function (value, color) {
		return {aV: color, aB: value};
	});
var $author$project$Config$OperationsOnDrop$InsertAfter$baseColor = 'dimgray';
var $author$project$Config$OperationsOnDrop$InsertAfter$data = A2(
	$elm$core$List$map,
	function (i) {
		return A2(
			$author$project$Config$OperationsOnDrop$InsertAfter$Item,
			$elm$core$String$fromInt(i),
			$author$project$Config$OperationsOnDrop$InsertAfter$baseColor);
	},
	A2($elm$core$List$range, 1, 9));
var $author$project$Config$OperationsOnDrop$InsertAfter$MyMsg = function (a) {
	return {$: 0, a: a};
};
var $author$project$Config$OperationsOnDrop$InsertAfter$affectedColor = 'purple';
var $author$project$Config$OperationsOnDrop$InsertAfter$dragColor = 'red';
var $author$project$Config$OperationsOnDrop$InsertAfter$dropColor = 'green';
var $author$project$Config$OperationsOnDrop$InsertAfter$beforeUpdate = F3(
	function (dragIndex, dropIndex, items) {
		return (_Utils_cmp(dragIndex, dropIndex) < 0) ? A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, _v0) {
					var value = _v0.aB;
					return _Utils_eq(i, dragIndex) ? A2($author$project$Config$OperationsOnDrop$InsertAfter$Item, value, $author$project$Config$OperationsOnDrop$InsertAfter$dragColor) : (_Utils_eq(i, dropIndex) ? A2($author$project$Config$OperationsOnDrop$InsertAfter$Item, value, $author$project$Config$OperationsOnDrop$InsertAfter$dropColor) : (((_Utils_cmp(dragIndex, i) < 0) && (_Utils_cmp(i, dropIndex) < 0)) ? A2($author$project$Config$OperationsOnDrop$InsertAfter$Item, value, $author$project$Config$OperationsOnDrop$InsertAfter$affectedColor) : A2($author$project$Config$OperationsOnDrop$InsertAfter$Item, value, $author$project$Config$OperationsOnDrop$InsertAfter$baseColor)));
				}),
			items) : ((_Utils_cmp(dragIndex, dropIndex) > 0) ? A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, _v1) {
					var value = _v1.aB;
					return _Utils_eq(i, dragIndex) ? A2($author$project$Config$OperationsOnDrop$InsertAfter$Item, value, $author$project$Config$OperationsOnDrop$InsertAfter$dragColor) : (_Utils_eq(i, dropIndex) ? A2($author$project$Config$OperationsOnDrop$InsertAfter$Item, value, $author$project$Config$OperationsOnDrop$InsertAfter$dropColor) : (((_Utils_cmp(dropIndex, i) < 0) && (_Utils_cmp(i, dragIndex) < 0)) ? A2($author$project$Config$OperationsOnDrop$InsertAfter$Item, value, $author$project$Config$OperationsOnDrop$InsertAfter$affectedColor) : A2($author$project$Config$OperationsOnDrop$InsertAfter$Item, value, $author$project$Config$OperationsOnDrop$InsertAfter$baseColor)));
				}),
			items) : items);
	});
var $author$project$Config$OperationsOnDrop$InsertAfter$config = {cv: $author$project$Config$OperationsOnDrop$InsertAfter$beforeUpdate, dg: 1, dk: 0, ds: 0};
var $author$project$Config$OperationsOnDrop$InsertAfter$system = A2($author$project$DnDList$create, $author$project$Config$OperationsOnDrop$InsertAfter$config, $author$project$Config$OperationsOnDrop$InsertAfter$MyMsg);
var $author$project$Config$OperationsOnDrop$InsertAfter$initialModel = {Q: $author$project$Config$OperationsOnDrop$InsertAfter$system.dj, au: $author$project$Config$OperationsOnDrop$InsertAfter$data};
var $author$project$Config$OperationsOnDrop$InsertBefore$Item = F2(
	function (value, color) {
		return {aV: color, aB: value};
	});
var $author$project$Config$OperationsOnDrop$InsertBefore$baseColor = 'dimgray';
var $author$project$Config$OperationsOnDrop$InsertBefore$data = A2(
	$elm$core$List$map,
	function (i) {
		return A2(
			$author$project$Config$OperationsOnDrop$InsertBefore$Item,
			$elm$core$String$fromInt(i),
			$author$project$Config$OperationsOnDrop$InsertBefore$baseColor);
	},
	A2($elm$core$List$range, 1, 9));
var $author$project$Config$OperationsOnDrop$InsertBefore$MyMsg = function (a) {
	return {$: 0, a: a};
};
var $author$project$Config$OperationsOnDrop$InsertBefore$affectedColor = 'purple';
var $author$project$Config$OperationsOnDrop$InsertBefore$dragColor = 'red';
var $author$project$Config$OperationsOnDrop$InsertBefore$dropColor = 'green';
var $author$project$Config$OperationsOnDrop$InsertBefore$beforeUpdate = F3(
	function (dragIndex, dropIndex, items) {
		return (_Utils_cmp(dragIndex, dropIndex) < 0) ? A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, _v0) {
					var value = _v0.aB;
					return _Utils_eq(i, dragIndex) ? A2($author$project$Config$OperationsOnDrop$InsertBefore$Item, value, $author$project$Config$OperationsOnDrop$InsertBefore$dragColor) : (_Utils_eq(i, dropIndex) ? A2($author$project$Config$OperationsOnDrop$InsertBefore$Item, value, $author$project$Config$OperationsOnDrop$InsertBefore$dropColor) : (((_Utils_cmp(dragIndex, i) < 0) && (_Utils_cmp(i, dropIndex) < 0)) ? A2($author$project$Config$OperationsOnDrop$InsertBefore$Item, value, $author$project$Config$OperationsOnDrop$InsertBefore$affectedColor) : A2($author$project$Config$OperationsOnDrop$InsertBefore$Item, value, $author$project$Config$OperationsOnDrop$InsertBefore$baseColor)));
				}),
			items) : ((_Utils_cmp(dragIndex, dropIndex) > 0) ? A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, _v1) {
					var value = _v1.aB;
					return _Utils_eq(i, dragIndex) ? A2($author$project$Config$OperationsOnDrop$InsertBefore$Item, value, $author$project$Config$OperationsOnDrop$InsertBefore$dragColor) : (_Utils_eq(i, dropIndex) ? A2($author$project$Config$OperationsOnDrop$InsertBefore$Item, value, $author$project$Config$OperationsOnDrop$InsertBefore$dropColor) : (((_Utils_cmp(dropIndex, i) < 0) && (_Utils_cmp(i, dragIndex) < 0)) ? A2($author$project$Config$OperationsOnDrop$InsertBefore$Item, value, $author$project$Config$OperationsOnDrop$InsertBefore$affectedColor) : A2($author$project$Config$OperationsOnDrop$InsertBefore$Item, value, $author$project$Config$OperationsOnDrop$InsertBefore$baseColor)));
				}),
			items) : items);
	});
var $author$project$Config$OperationsOnDrop$InsertBefore$config = {cv: $author$project$Config$OperationsOnDrop$InsertBefore$beforeUpdate, dg: 1, dk: 0, ds: 1};
var $author$project$Config$OperationsOnDrop$InsertBefore$system = A2($author$project$DnDList$create, $author$project$Config$OperationsOnDrop$InsertBefore$config, $author$project$Config$OperationsOnDrop$InsertBefore$MyMsg);
var $author$project$Config$OperationsOnDrop$InsertBefore$initialModel = {Q: $author$project$Config$OperationsOnDrop$InsertBefore$system.dj, au: $author$project$Config$OperationsOnDrop$InsertBefore$data};
var $author$project$Config$OperationsOnDrop$Rotate$Item = F2(
	function (value, color) {
		return {aV: color, aB: value};
	});
var $author$project$Config$OperationsOnDrop$Rotate$baseColor = 'dimgray';
var $author$project$Config$OperationsOnDrop$Rotate$data = A2(
	$elm$core$List$map,
	function (i) {
		return A2(
			$author$project$Config$OperationsOnDrop$Rotate$Item,
			$elm$core$String$fromInt(i),
			$author$project$Config$OperationsOnDrop$Rotate$baseColor);
	},
	A2($elm$core$List$range, 1, 9));
var $author$project$Config$OperationsOnDrop$Rotate$MyMsg = function (a) {
	return {$: 0, a: a};
};
var $author$project$Config$OperationsOnDrop$Rotate$affectedColor = 'purple';
var $author$project$Config$OperationsOnDrop$Rotate$dragColor = 'red';
var $author$project$Config$OperationsOnDrop$Rotate$dropColor = 'green';
var $author$project$Config$OperationsOnDrop$Rotate$beforeUpdate = F3(
	function (dragIndex, dropIndex, items) {
		return (_Utils_cmp(dragIndex, dropIndex) < 0) ? A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, _v0) {
					var value = _v0.aB;
					return _Utils_eq(i, dragIndex) ? A2($author$project$Config$OperationsOnDrop$Rotate$Item, value, $author$project$Config$OperationsOnDrop$Rotate$dragColor) : (_Utils_eq(i, dropIndex) ? A2($author$project$Config$OperationsOnDrop$Rotate$Item, value, $author$project$Config$OperationsOnDrop$Rotate$dropColor) : (((_Utils_cmp(dragIndex, i) < 0) && (_Utils_cmp(i, dropIndex) < 0)) ? A2($author$project$Config$OperationsOnDrop$Rotate$Item, value, $author$project$Config$OperationsOnDrop$Rotate$affectedColor) : A2($author$project$Config$OperationsOnDrop$Rotate$Item, value, $author$project$Config$OperationsOnDrop$Rotate$baseColor)));
				}),
			items) : ((_Utils_cmp(dragIndex, dropIndex) > 0) ? A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, _v1) {
					var value = _v1.aB;
					return _Utils_eq(i, dragIndex) ? A2($author$project$Config$OperationsOnDrop$Rotate$Item, value, $author$project$Config$OperationsOnDrop$Rotate$dragColor) : (_Utils_eq(i, dropIndex) ? A2($author$project$Config$OperationsOnDrop$Rotate$Item, value, $author$project$Config$OperationsOnDrop$Rotate$dropColor) : (((_Utils_cmp(dropIndex, i) < 0) && (_Utils_cmp(i, dragIndex) < 0)) ? A2($author$project$Config$OperationsOnDrop$Rotate$Item, value, $author$project$Config$OperationsOnDrop$Rotate$affectedColor) : A2($author$project$Config$OperationsOnDrop$Rotate$Item, value, $author$project$Config$OperationsOnDrop$Rotate$baseColor)));
				}),
			items) : items);
	});
var $author$project$Config$OperationsOnDrop$Rotate$config = {cv: $author$project$Config$OperationsOnDrop$Rotate$beforeUpdate, dg: 1, dk: 0, ds: 2};
var $author$project$Config$OperationsOnDrop$Rotate$system = A2($author$project$DnDList$create, $author$project$Config$OperationsOnDrop$Rotate$config, $author$project$Config$OperationsOnDrop$Rotate$MyMsg);
var $author$project$Config$OperationsOnDrop$Rotate$initialModel = {Q: $author$project$Config$OperationsOnDrop$Rotate$system.dj, au: $author$project$Config$OperationsOnDrop$Rotate$data};
var $author$project$Config$OperationsOnDrop$Swap$Item = F2(
	function (value, color) {
		return {aV: color, aB: value};
	});
var $author$project$Config$OperationsOnDrop$Swap$baseColor = 'dimgray';
var $author$project$Config$OperationsOnDrop$Swap$data = A2(
	$elm$core$List$map,
	function (i) {
		return A2(
			$author$project$Config$OperationsOnDrop$Swap$Item,
			$elm$core$String$fromInt(i),
			$author$project$Config$OperationsOnDrop$Swap$baseColor);
	},
	A2($elm$core$List$range, 1, 9));
var $author$project$Config$OperationsOnDrop$Swap$MyMsg = function (a) {
	return {$: 0, a: a};
};
var $author$project$Config$OperationsOnDrop$Swap$dragColor = 'red';
var $author$project$Config$OperationsOnDrop$Swap$dropColor = 'green';
var $author$project$Config$OperationsOnDrop$Swap$beforeUpdate = F3(
	function (dragIndex, dropIndex, items) {
		return (!_Utils_eq(dragIndex, dropIndex)) ? A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, _v0) {
					var value = _v0.aB;
					return _Utils_eq(i, dropIndex) ? A2($author$project$Config$OperationsOnDrop$Swap$Item, value, $author$project$Config$OperationsOnDrop$Swap$dropColor) : (_Utils_eq(i, dragIndex) ? A2($author$project$Config$OperationsOnDrop$Swap$Item, value, $author$project$Config$OperationsOnDrop$Swap$dragColor) : A2($author$project$Config$OperationsOnDrop$Swap$Item, value, $author$project$Config$OperationsOnDrop$Swap$baseColor));
				}),
			items) : items;
	});
var $author$project$Config$OperationsOnDrop$Swap$config = {cv: $author$project$Config$OperationsOnDrop$Swap$beforeUpdate, dg: 1, dk: 0, ds: 3};
var $author$project$Config$OperationsOnDrop$Swap$system = A2($author$project$DnDList$create, $author$project$Config$OperationsOnDrop$Swap$config, $author$project$Config$OperationsOnDrop$Swap$MyMsg);
var $author$project$Config$OperationsOnDrop$Swap$initialModel = {Q: $author$project$Config$OperationsOnDrop$Swap$system.dj, au: $author$project$Config$OperationsOnDrop$Swap$data};
var $author$project$Config$OperationsOnDrop$Unaltered$Item = F2(
	function (value, color) {
		return {aV: color, aB: value};
	});
var $author$project$Config$OperationsOnDrop$Unaltered$baseColor = 'dimgray';
var $author$project$Config$OperationsOnDrop$Unaltered$data = A2(
	$elm$core$List$map,
	function (i) {
		return A2(
			$author$project$Config$OperationsOnDrop$Unaltered$Item,
			$elm$core$String$fromInt(i),
			$author$project$Config$OperationsOnDrop$Unaltered$baseColor);
	},
	A2($elm$core$List$range, 1, 9));
var $author$project$Config$OperationsOnDrop$Unaltered$MyMsg = function (a) {
	return {$: 0, a: a};
};
var $author$project$Config$OperationsOnDrop$Unaltered$dragColor = 'red';
var $author$project$Config$OperationsOnDrop$Unaltered$dropColor = 'green';
var $author$project$Config$OperationsOnDrop$Unaltered$beforeUpdate = F3(
	function (dragIndex, dropIndex, items) {
		return (!_Utils_eq(dragIndex, dropIndex)) ? A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, _v0) {
					var value = _v0.aB;
					return _Utils_eq(i, dragIndex) ? A2($author$project$Config$OperationsOnDrop$Unaltered$Item, value, $author$project$Config$OperationsOnDrop$Unaltered$dragColor) : (_Utils_eq(i, dropIndex) ? A2($author$project$Config$OperationsOnDrop$Unaltered$Item, value, $author$project$Config$OperationsOnDrop$Unaltered$dropColor) : A2($author$project$Config$OperationsOnDrop$Unaltered$Item, value, $author$project$Config$OperationsOnDrop$Unaltered$baseColor));
				}),
			items) : items;
	});
var $author$project$Config$OperationsOnDrop$Unaltered$config = {cv: $author$project$Config$OperationsOnDrop$Unaltered$beforeUpdate, dg: 1, dk: 0, ds: 4};
var $author$project$Config$OperationsOnDrop$Unaltered$system = A2($author$project$DnDList$create, $author$project$Config$OperationsOnDrop$Unaltered$config, $author$project$Config$OperationsOnDrop$Unaltered$MyMsg);
var $author$project$Config$OperationsOnDrop$Unaltered$initialModel = {Q: $author$project$Config$OperationsOnDrop$Unaltered$system.dj, au: $author$project$Config$OperationsOnDrop$Unaltered$data};
var $author$project$Config$OperationsOnDrop$Root$initialModel = {
	S: _List_fromArray(
		[
			$author$project$Config$OperationsOnDrop$Root$InsertAfter($author$project$Config$OperationsOnDrop$InsertAfter$initialModel),
			$author$project$Config$OperationsOnDrop$Root$InsertBefore($author$project$Config$OperationsOnDrop$InsertBefore$initialModel),
			$author$project$Config$OperationsOnDrop$Root$Rotate($author$project$Config$OperationsOnDrop$Rotate$initialModel),
			$author$project$Config$OperationsOnDrop$Root$Swap($author$project$Config$OperationsOnDrop$Swap$initialModel),
			$author$project$Config$OperationsOnDrop$Root$Unaltered($author$project$Config$OperationsOnDrop$Unaltered$initialModel)
		]),
	at: 0
};
var $author$project$Config$Root$toExample = function (slug) {
	switch (slug) {
		case 'movement':
			return $author$project$Config$Root$Movement($author$project$Config$Movement$Root$initialModel);
		case 'operations-drag':
			return $author$project$Config$Root$OperationsOnDrag($author$project$Config$OperationsOnDrag$Root$initialModel);
		case 'operations-drop':
			return $author$project$Config$Root$OperationsOnDrop($author$project$Config$OperationsOnDrop$Root$initialModel);
		default:
			return $author$project$Config$Root$Movement($author$project$Config$Movement$Root$initialModel);
	}
};
var $author$project$Config$Root$init = function (slug) {
	return _Utils_Tuple2(
		$author$project$Config$Root$toExample(slug),
		$elm$core$Platform$Cmd$none);
};
var $author$project$ConfigGroups$Root$OperationsOnDrag = function (a) {
	return {$: 0, a: a};
};
var $author$project$ConfigGroups$Root$OperationsOnDrop = function (a) {
	return {$: 1, a: a};
};
var $author$project$ConfigGroups$OperationsOnDrag$Root$InsertAfter = function (a) {
	return {$: 0, a: a};
};
var $author$project$ConfigGroups$OperationsOnDrag$Root$InsertBefore = function (a) {
	return {$: 1, a: a};
};
var $author$project$ConfigGroups$OperationsOnDrag$Root$Rotate = function (a) {
	return {$: 2, a: a};
};
var $author$project$ConfigGroups$OperationsOnDrag$Root$Swap = function (a) {
	return {$: 3, a: a};
};
var $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$Item = F3(
	function (group, value, color) {
		return {aV: color, t: group, aB: value};
	});
var $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$baseColor = 'dimgray';
var $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$transparent = 'transparent';
var $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$preparedData = _List_fromArray(
	[
		A3($author$project$ConfigGroups$OperationsOnDrag$InsertAfter$Item, 1, '', $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$transparent),
		A3($author$project$ConfigGroups$OperationsOnDrag$InsertAfter$Item, 1, '1', $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrag$InsertAfter$Item, 2, '', $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$transparent),
		A3($author$project$ConfigGroups$OperationsOnDrag$InsertAfter$Item, 2, '2', $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrag$InsertAfter$Item, 2, '3', $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrag$InsertAfter$Item, 2, '4', $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrag$InsertAfter$Item, 3, '', $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$transparent),
		A3($author$project$ConfigGroups$OperationsOnDrag$InsertAfter$Item, 3, '5', $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrag$InsertAfter$Item, 3, '6', $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrag$InsertAfter$Item, 3, '7', $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrag$InsertAfter$Item, 3, '8', $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrag$InsertAfter$Item, 3, '9', $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$baseColor)
	]);
var $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$MyMsg = function (a) {
	return {$: 0, a: a};
};
var $author$project$DnDList$Groups$InsertAfter = 0;
var $author$project$DnDList$Groups$OnDrag = 0;
var $author$project$DnDList$Groups$Unaltered = 4;
var $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$affectedColor = 'purple';
var $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$dragColor = 'red';
var $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$dropColor = 'green';
var $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$beforeUpdate = F3(
	function (dragIndex, dropIndex, items) {
		return (_Utils_cmp(dragIndex, dropIndex) < 0) ? A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, item) {
					return _Utils_eq(i, dragIndex) ? _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$dragColor}) : (_Utils_eq(i, dropIndex) ? _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$dropColor}) : (((_Utils_cmp(dragIndex, i) < 0) && (_Utils_cmp(i, dropIndex) < 0)) ? _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$affectedColor}) : item));
				}),
			items) : ((_Utils_cmp(dragIndex, dropIndex) > 0) ? A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, item) {
					return _Utils_eq(i, dragIndex) ? _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$dragColor}) : (_Utils_eq(i, dropIndex) ? _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$dropColor}) : (((_Utils_cmp(dropIndex, i) < 0) && (_Utils_cmp(i, dragIndex) < 0)) ? _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$affectedColor}) : item));
				}),
			items) : items);
	});
var $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$comparator = F2(
	function (item1, item2) {
		return _Utils_eq(item1.t, item2.t);
	});
var $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$setter = F2(
	function (item1, item2) {
		return _Utils_update(
			item2,
			{t: item1.t});
	});
var $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$config = {
	cv: $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$beforeUpdate,
	c1: {cN: $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$comparator, dg: 0, ds: 0, dC: $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$setter},
	dg: 0,
	ds: 4
};
var $author$project$DnDList$Groups$Model = $elm$core$Basics$identity;
var $author$project$DnDList$Groups$GotDragElement = function (a) {
	return {$: 6, a: a};
};
var $author$project$DnDList$Groups$dragElementCommands = F2(
	function (stepMsg, state) {
		var _v0 = state.R;
		if (_v0.$ === 1) {
			return A2(
				$elm$core$Task$attempt,
				A2($elm$core$Basics$composeL, stepMsg, $author$project$DnDList$Groups$GotDragElement),
				$elm$browser$Browser$Dom$getElement(state.aq));
		} else {
			return $elm$core$Platform$Cmd$none;
		}
	});
var $author$project$DnDList$Groups$GotDropElement = function (a) {
	return {$: 7, a: a};
};
var $author$project$DnDList$Groups$dropElementCommands = F2(
	function (stepMsg, state) {
		return (!state.n) ? A2(
			$elm$core$Task$attempt,
			A2($elm$core$Basics$composeL, stepMsg, $author$project$DnDList$Groups$GotDropElement),
			$elm$browser$Browser$Dom$getElement(state.ad)) : $elm$core$Platform$Cmd$none;
	});
var $author$project$DnDList$Groups$commands = F2(
	function (stepMsg, _v0) {
		var model = _v0;
		if (model.$ === 1) {
			return $elm$core$Platform$Cmd$none;
		} else {
			var state = model.a;
			return $elm$core$Platform$Cmd$batch(
				_List_fromArray(
					[
						A2($author$project$DnDList$Groups$dragElementCommands, stepMsg, state),
						A2($author$project$DnDList$Groups$dropElementCommands, stepMsg, state)
					]));
		}
	});
var $author$project$DnDList$Groups$DragStart = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $author$project$DnDList$Groups$dragEvents = F3(
	function (stepMsg, dragIndex, dragElementId) {
		return _List_fromArray(
			[
				A2(
				$elm$html$Html$Events$preventDefaultOn,
				'mousedown',
				A2(
					$elm$json$Json$Decode$map,
					function (msg) {
						return _Utils_Tuple2(msg, true);
					},
					A2(
						$elm$json$Json$Decode$map,
						A2(
							$elm$core$Basics$composeL,
							stepMsg,
							A2($author$project$DnDList$Groups$DragStart, dragIndex, dragElementId)),
						$author$project$Internal$Common$Utils$decodeCoordinatesWithButtonCheck)))
			]);
	});
var $author$project$DnDList$Groups$DragEnter = function (a) {
	return {$: 3, a: a};
};
var $author$project$DnDList$Groups$DragLeave = {$: 4};
var $author$project$DnDList$Groups$DragOver = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $author$project$DnDList$Groups$dropEvents = F3(
	function (stepMsg, dropIndex, dropElementId) {
		return _List_fromArray(
			[
				$elm$html$Html$Events$onMouseOver(
				stepMsg(
					A2($author$project$DnDList$Groups$DragOver, dropIndex, dropElementId))),
				$elm$html$Html$Events$onMouseEnter(
				stepMsg(
					$author$project$DnDList$Groups$DragEnter(dropIndex))),
				$elm$html$Html$Events$onMouseLeave(
				stepMsg($author$project$DnDList$Groups$DragLeave))
			]);
	});
var $author$project$DnDList$Groups$ghostStyles = function (_v0) {
	var model = _v0;
	if (model.$ === 1) {
		return _List_Nil;
	} else {
		var state = model.a;
		var _v2 = state.R;
		if (!_v2.$) {
			var element = _v2.a.cW;
			return _List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
					A2($elm$html$Html$Attributes$style, 'left', '0'),
					A2($elm$html$Html$Attributes$style, 'top', '0'),
					A2(
					$elm$html$Html$Attributes$style,
					'transform',
					A2(
						$author$project$Internal$Common$Utils$translate,
						$elm$core$Basics$round((state.w.Y - state.J.Y) + element.Y),
						$elm$core$Basics$round((state.w.Z - state.J.Z) + element.Z))),
					A2(
					$elm$html$Html$Attributes$style,
					'height',
					$author$project$Internal$Common$Utils$px(
						$elm$core$Basics$round(element.c2))),
					A2(
					$elm$html$Html$Attributes$style,
					'width',
					$author$project$Internal$Common$Utils$px(
						$elm$core$Basics$round(element.d4))),
					A2($elm$html$Html$Attributes$style, 'pointer-events', 'none')
				]);
		} else {
			return _List_Nil;
		}
	}
};
var $author$project$DnDList$Groups$info = function (_v0) {
	var model = _v0;
	return A2(
		$elm$core$Maybe$andThen,
		function (state) {
			return A3(
				$elm$core$Maybe$map2,
				F2(
					function (dragElement, dropElement) {
						return {w: state.w, R: dragElement, aq: state.aq, a9: state.a9, ac: dropElement, ad: state.ad, cV: state.cV, J: state.J};
					}),
				state.R,
				state.ac);
		},
		model);
};
var $author$project$DnDList$Groups$Drag = function (a) {
	return {$: 1, a: a};
};
var $author$project$DnDList$Groups$DragEnd = {$: 5};
var $author$project$DnDList$Groups$subscriptions = F2(
	function (stepMsg, _v0) {
		var model = _v0;
		if (model.$ === 1) {
			return $elm$core$Platform$Sub$none;
		} else {
			return $elm$core$Platform$Sub$batch(
				_List_fromArray(
					[
						$elm$browser$Browser$Events$onMouseMove(
						A2(
							$elm$json$Json$Decode$map,
							A2($elm$core$Basics$composeL, stepMsg, $author$project$DnDList$Groups$Drag),
							$author$project$Internal$Common$Utils$decodeCoordinates)),
						$elm$browser$Browser$Events$onMouseUp(
						$elm$json$Json$Decode$succeed(
							stepMsg($author$project$DnDList$Groups$DragEnd)))
					]));
		}
	});
var $author$project$DnDList$Groups$OnDrop = 1;
var $author$project$Internal$Groups$drags = F2(
	function (dragIndex, list) {
		return A2(
			$elm$core$List$take,
			1,
			A2($elm$core$List$drop, dragIndex, list));
	});
var $author$project$Internal$Groups$drops = F2(
	function (dropIndex, list) {
		return A2(
			$elm$core$List$take,
			1,
			A2($elm$core$List$drop, dropIndex, list));
	});
var $author$project$Internal$Groups$equalGroups = F4(
	function (comparator, dragIndex, dropIndex, list) {
		return A3(
			$elm$core$List$foldl,
			$elm$core$Basics$or,
			false,
			A3(
				$elm$core$List$map2,
				F2(
					function (dragItem, dropItem) {
						return A2(comparator, dragItem, dropItem);
					}),
				A2($author$project$Internal$Groups$drags, dragIndex, list),
				A2($author$project$Internal$Groups$drops, dropIndex, list)));
	});
var $author$project$Internal$Groups$allGroupUpdate = F4(
	function (fn, i, j, l) {
		var middle = A2(
			$elm$core$List$take,
			(j - i) + 1,
			A2($elm$core$List$drop, i, l));
		var end = A2($elm$core$List$drop, j + 1, l);
		var beginning = A2($elm$core$List$take, i, l);
		return _Utils_ap(
			beginning,
			_Utils_ap(
				fn(middle),
				end));
	});
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $author$project$Internal$Groups$sublistByFirstItem = F2(
	function (comparator, list) {
		if (!list.b) {
			return _List_Nil;
		} else {
			var x = list.a;
			return A2(
				$elm$core$List$filter,
				function (item) {
					return A2(comparator, x, item);
				},
				list);
		}
	});
var $author$project$Internal$Groups$bubbleGroupRecursive = F3(
	function (comparator, setter, list) {
		if (!list.b) {
			return _List_Nil;
		} else {
			if (!list.b.b) {
				var x = list.a;
				return _List_fromArray(
					[x]);
			} else {
				var x = list.a;
				var xs = list.b;
				var sublist = A2($author$project$Internal$Groups$sublistByFirstItem, comparator, list);
				return (!_Utils_eq(sublist, _List_Nil)) ? _Utils_ap(
					$elm$core$List$reverse(
						A2($elm$core$List$drop, 1, sublist)),
					_Utils_ap(
						A3(
							$elm$core$List$map2,
							F2(
								function (prev, next) {
									return A2(setter, next, prev);
								}),
							A2($elm$core$List$take, 1, sublist),
							A2(
								$elm$core$List$take,
								1,
								A2(
									$elm$core$List$drop,
									$elm$core$List$length(sublist) - 1,
									xs))),
						A3(
							$author$project$Internal$Groups$bubbleGroupRecursive,
							comparator,
							setter,
							_Utils_ap(
								A3(
									$elm$core$List$map2,
									F2(
										function (prev, next) {
											return A2(setter, prev, next);
										}),
									A2($elm$core$List$take, 1, sublist),
									A2(
										$elm$core$List$take,
										1,
										A2(
											$elm$core$List$drop,
											$elm$core$List$length(sublist) - 1,
											xs))),
								A2(
									$elm$core$List$drop,
									$elm$core$List$length(sublist),
									xs))))) : A2($elm$core$List$cons, x, xs);
			}
		}
	});
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $author$project$Internal$Groups$dragAndDropGroupUpdate = F4(
	function (setter, dragIndex, dropIndex, list) {
		var dropItem = A2($author$project$Internal$Groups$drops, dropIndex, list);
		var dragItem = A2($author$project$Internal$Groups$drags, dragIndex, list);
		return $elm$core$List$concat(
			A2(
				$elm$core$List$indexedMap,
				F2(
					function (index, item) {
						return _Utils_eq(index, dragIndex) ? A3(
							$elm$core$List$map2,
							setter,
							dropItem,
							_List_fromArray(
								[item])) : (_Utils_eq(index, dropIndex) ? A3(
							$elm$core$List$map2,
							setter,
							dragItem,
							_List_fromArray(
								[item])) : _List_fromArray(
							[item]));
					}),
				list));
	});
var $author$project$Internal$Groups$dragGroupUpdate = F4(
	function (setter, dragIndex, dropIndex, list) {
		var dropItem = A2($author$project$Internal$Groups$drops, dropIndex, list);
		return $elm$core$List$concat(
			A2(
				$elm$core$List$indexedMap,
				F2(
					function (index, item) {
						return _Utils_eq(index, dragIndex) ? A3(
							$elm$core$List$map2,
							setter,
							dropItem,
							_List_fromArray(
								[item])) : _List_fromArray(
							[item]);
					}),
				list));
	});
var $author$project$DnDList$Groups$listUpdate = F6(
	function (operation, comparator, setter, dragIndex, dropIndex, list) {
		switch (operation) {
			case 0:
				return A3(
					$author$project$Internal$Common$Operations$insertAfter,
					dragIndex,
					dropIndex,
					A4($author$project$Internal$Groups$dragGroupUpdate, setter, dragIndex, dropIndex, list));
			case 1:
				return A3(
					$author$project$Internal$Common$Operations$insertBefore,
					dragIndex,
					dropIndex,
					A4($author$project$Internal$Groups$dragGroupUpdate, setter, dragIndex, dropIndex, list));
			case 2:
				return (_Utils_cmp(dragIndex, dropIndex) < 0) ? A3(
					$author$project$Internal$Common$Operations$rotate,
					dragIndex,
					dropIndex,
					A4(
						$author$project$Internal$Groups$allGroupUpdate,
						A2(
							$elm$core$Basics$composeR,
							$elm$core$List$reverse,
							A2(
								$elm$core$Basics$composeR,
								A2($author$project$Internal$Groups$bubbleGroupRecursive, comparator, setter),
								$elm$core$List$reverse)),
						dragIndex,
						dropIndex,
						list)) : ((_Utils_cmp(dropIndex, dragIndex) < 0) ? A3(
					$author$project$Internal$Common$Operations$rotate,
					dragIndex,
					dropIndex,
					A4(
						$author$project$Internal$Groups$allGroupUpdate,
						A2($author$project$Internal$Groups$bubbleGroupRecursive, comparator, setter),
						dropIndex,
						dragIndex,
						list)) : list);
			case 3:
				return A3(
					$author$project$Internal$Common$Operations$swap,
					dragIndex,
					dropIndex,
					A4($author$project$Internal$Groups$dragAndDropGroupUpdate, setter, dragIndex, dropIndex, list));
			default:
				return list;
		}
	});
var $elm$core$Basics$not = _Basics_not;
var $author$project$DnDList$Groups$stateUpdate = F3(
	function (operation, dropIndex, state) {
		switch (operation) {
			case 0:
				return _Utils_update(
					state,
					{
						n: 0,
						a9: (_Utils_cmp(dropIndex, state.a9) < 0) ? (dropIndex + 1) : dropIndex
					});
			case 1:
				return _Utils_update(
					state,
					{
						n: 0,
						a9: (_Utils_cmp(state.a9, dropIndex) < 0) ? (dropIndex - 1) : dropIndex
					});
			case 2:
				return _Utils_update(
					state,
					{n: 0, a9: dropIndex});
			case 3:
				return _Utils_update(
					state,
					{n: 0, a9: dropIndex});
			default:
				return _Utils_update(
					state,
					{n: 0});
		}
	});
var $author$project$DnDList$Groups$sublistUpdate = F4(
	function (operation, dragIndex, dropIndex, list) {
		switch (operation) {
			case 0:
				return A3($author$project$Internal$Common$Operations$insertAfter, dragIndex, dropIndex, list);
			case 1:
				return A3($author$project$Internal$Common$Operations$insertBefore, dragIndex, dropIndex, list);
			case 2:
				return A3($author$project$Internal$Common$Operations$rotate, dragIndex, dropIndex, list);
			case 3:
				return A3($author$project$Internal$Common$Operations$swap, dragIndex, dropIndex, list);
			default:
				return list;
		}
	});
var $author$project$DnDList$Groups$update = F4(
	function (_v0, msg, _v1, list) {
		var beforeUpdate = _v0.cv;
		var listen = _v0.dg;
		var operation = _v0.ds;
		var groups = _v0.c1;
		var model = _v1;
		switch (msg.$) {
			case 0:
				var dragIndex = msg.a;
				var dragElementId = msg.b;
				var xy = msg.c;
				return _Utils_Tuple2(
					$elm$core$Maybe$Just(
						{w: xy, n: 0, R: $elm$core$Maybe$Nothing, aq: dragElementId, a9: dragIndex, ac: $elm$core$Maybe$Nothing, ad: dragElementId, cV: dragIndex, J: xy}),
					list);
			case 1:
				var xy = msg.a;
				return _Utils_Tuple2(
					A2(
						$elm$core$Maybe$map,
						function (state) {
							return _Utils_update(
								state,
								{w: xy, n: state.n + 1});
						},
						model),
					list);
			case 2:
				var dropIndex = msg.a;
				var dropElementId = msg.b;
				return _Utils_Tuple2(
					A2(
						$elm$core$Maybe$map,
						function (state) {
							return _Utils_update(
								state,
								{ad: dropElementId, cV: dropIndex});
						},
						model),
					list);
			case 3:
				var dropIndex = msg.a;
				if (!model.$) {
					var state = model.a;
					if ((state.n > 1) && (!_Utils_eq(state.a9, dropIndex))) {
						var equalGroups = A4($author$project$Internal$Groups$equalGroups, groups.cN, state.a9, dropIndex, list);
						return ((!listen) && equalGroups) ? _Utils_Tuple2(
							$elm$core$Maybe$Just(
								A3($author$project$DnDList$Groups$stateUpdate, operation, dropIndex, state)),
							A4(
								$author$project$DnDList$Groups$sublistUpdate,
								operation,
								state.a9,
								dropIndex,
								A3(beforeUpdate, state.a9, dropIndex, list))) : (((!groups.dg) && (!equalGroups)) ? _Utils_Tuple2(
							$elm$core$Maybe$Just(
								A3($author$project$DnDList$Groups$stateUpdate, groups.ds, dropIndex, state)),
							A6(
								$author$project$DnDList$Groups$listUpdate,
								groups.ds,
								groups.cN,
								groups.dC,
								state.a9,
								dropIndex,
								A3(beforeUpdate, state.a9, dropIndex, list))) : _Utils_Tuple2(
							$elm$core$Maybe$Just(
								_Utils_update(
									state,
									{n: 0})),
							list));
					} else {
						return _Utils_Tuple2(model, list);
					}
				} else {
					return _Utils_Tuple2(model, list);
				}
			case 4:
				return _Utils_Tuple2(
					A2(
						$elm$core$Maybe$map,
						function (state) {
							return _Utils_update(
								state,
								{cV: state.a9});
						},
						model),
					list);
			case 5:
				if (!model.$) {
					var state = model.a;
					if (!_Utils_eq(state.a9, state.cV)) {
						var equalGroups = A4($author$project$Internal$Groups$equalGroups, groups.cN, state.a9, state.cV, list);
						return ((listen === 1) && equalGroups) ? _Utils_Tuple2(
							$elm$core$Maybe$Nothing,
							A4(
								$author$project$DnDList$Groups$sublistUpdate,
								operation,
								state.a9,
								state.cV,
								A3(beforeUpdate, state.a9, state.cV, list))) : (((groups.dg === 1) && (!equalGroups)) ? _Utils_Tuple2(
							$elm$core$Maybe$Nothing,
							A6(
								$author$project$DnDList$Groups$listUpdate,
								groups.ds,
								groups.cN,
								groups.dC,
								state.a9,
								state.cV,
								A3(beforeUpdate, state.a9, state.cV, list))) : _Utils_Tuple2($elm$core$Maybe$Nothing, list));
					} else {
						return _Utils_Tuple2($elm$core$Maybe$Nothing, list);
					}
				} else {
					return _Utils_Tuple2($elm$core$Maybe$Nothing, list);
				}
			case 6:
				if (msg.a.$ === 1) {
					return _Utils_Tuple2(model, list);
				} else {
					var dragElement = msg.a.a;
					return _Utils_Tuple2(
						A2(
							$elm$core$Maybe$map,
							function (state) {
								return _Utils_update(
									state,
									{
										R: $elm$core$Maybe$Just(dragElement),
										ac: $elm$core$Maybe$Just(dragElement)
									});
							},
							model),
						list);
				}
			default:
				if (msg.a.$ === 1) {
					return _Utils_Tuple2(model, list);
				} else {
					var dropElement = msg.a.a;
					return _Utils_Tuple2(
						A2(
							$elm$core$Maybe$map,
							function (state) {
								return _Utils_update(
									state,
									{
										ac: $elm$core$Maybe$Just(dropElement)
									});
							},
							model),
						list);
				}
		}
	});
var $author$project$DnDList$Groups$create = F2(
	function (config, stepMsg) {
		return {
			cM: $author$project$DnDList$Groups$commands(stepMsg),
			cT: $author$project$DnDList$Groups$dragEvents(stepMsg),
			cU: $author$project$DnDList$Groups$dropEvents(stepMsg),
			c$: $author$project$DnDList$Groups$ghostStyles,
			be: $author$project$DnDList$Groups$info,
			dj: $elm$core$Maybe$Nothing,
			b5: $author$project$DnDList$Groups$subscriptions(stepMsg),
			b9: $author$project$DnDList$Groups$update(config)
		};
	});
var $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$system = A2($author$project$DnDList$Groups$create, $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$config, $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$MyMsg);
var $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$initialModel = {Q: $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$system.dj, au: $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$preparedData};
var $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$Item = F3(
	function (group, value, color) {
		return {aV: color, t: group, aB: value};
	});
var $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$baseColor = 'dimgray';
var $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$transparent = 'transparent';
var $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$preparedData = _List_fromArray(
	[
		A3($author$project$ConfigGroups$OperationsOnDrag$InsertBefore$Item, 1, '1', $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrag$InsertBefore$Item, 1, '', $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$transparent),
		A3($author$project$ConfigGroups$OperationsOnDrag$InsertBefore$Item, 2, '2', $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrag$InsertBefore$Item, 2, '3', $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrag$InsertBefore$Item, 2, '4', $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrag$InsertBefore$Item, 2, '', $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$transparent),
		A3($author$project$ConfigGroups$OperationsOnDrag$InsertBefore$Item, 3, '5', $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrag$InsertBefore$Item, 3, '6', $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrag$InsertBefore$Item, 3, '7', $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrag$InsertBefore$Item, 3, '8', $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrag$InsertBefore$Item, 3, '9', $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrag$InsertBefore$Item, 3, '', $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$transparent)
	]);
var $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$MyMsg = function (a) {
	return {$: 0, a: a};
};
var $author$project$DnDList$Groups$InsertBefore = 1;
var $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$affectedColor = 'purple';
var $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$dragColor = 'red';
var $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$dropColor = 'green';
var $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$beforeUpdate = F3(
	function (dragIndex, dropIndex, items) {
		return (_Utils_cmp(dragIndex, dropIndex) < 0) ? A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, item) {
					return _Utils_eq(i, dragIndex) ? _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$dragColor}) : (_Utils_eq(i, dropIndex) ? _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$dropColor}) : (((_Utils_cmp(dragIndex, i) < 0) && (_Utils_cmp(i, dropIndex) < 0)) ? _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$affectedColor}) : item));
				}),
			items) : ((_Utils_cmp(dragIndex, dropIndex) > 0) ? A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, item) {
					return _Utils_eq(i, dragIndex) ? _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$dragColor}) : (_Utils_eq(i, dropIndex) ? _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$dropColor}) : (((_Utils_cmp(dropIndex, i) < 0) && (_Utils_cmp(i, dragIndex) < 0)) ? _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$affectedColor}) : item));
				}),
			items) : items);
	});
var $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$comparator = F2(
	function (item1, item2) {
		return _Utils_eq(item1.t, item2.t);
	});
var $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$setter = F2(
	function (item1, item2) {
		return _Utils_update(
			item2,
			{t: item1.t});
	});
var $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$config = {
	cv: $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$beforeUpdate,
	c1: {cN: $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$comparator, dg: 0, ds: 1, dC: $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$setter},
	dg: 0,
	ds: 4
};
var $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$system = A2($author$project$DnDList$Groups$create, $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$config, $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$MyMsg);
var $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$initialModel = {Q: $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$system.dj, au: $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$preparedData};
var $author$project$ConfigGroups$OperationsOnDrag$Rotate$Item = F3(
	function (group, value, color) {
		return {aV: color, t: group, aB: value};
	});
var $author$project$ConfigGroups$OperationsOnDrag$Rotate$baseColor = 'dimgray';
var $author$project$ConfigGroups$OperationsOnDrag$Rotate$gatheredData = _List_fromArray(
	[
		A3($author$project$ConfigGroups$OperationsOnDrag$Rotate$Item, 1, '1', $author$project$ConfigGroups$OperationsOnDrag$Rotate$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrag$Rotate$Item, 2, '2', $author$project$ConfigGroups$OperationsOnDrag$Rotate$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrag$Rotate$Item, 2, '3', $author$project$ConfigGroups$OperationsOnDrag$Rotate$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrag$Rotate$Item, 2, '4', $author$project$ConfigGroups$OperationsOnDrag$Rotate$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrag$Rotate$Item, 3, '5', $author$project$ConfigGroups$OperationsOnDrag$Rotate$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrag$Rotate$Item, 3, '6', $author$project$ConfigGroups$OperationsOnDrag$Rotate$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrag$Rotate$Item, 3, '7', $author$project$ConfigGroups$OperationsOnDrag$Rotate$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrag$Rotate$Item, 3, '8', $author$project$ConfigGroups$OperationsOnDrag$Rotate$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrag$Rotate$Item, 3, '9', $author$project$ConfigGroups$OperationsOnDrag$Rotate$baseColor)
	]);
var $author$project$ConfigGroups$OperationsOnDrag$Rotate$MyMsg = function (a) {
	return {$: 0, a: a};
};
var $author$project$DnDList$Groups$Rotate = 2;
var $author$project$ConfigGroups$OperationsOnDrag$Rotate$affectedColor = 'purple';
var $author$project$ConfigGroups$OperationsOnDrag$Rotate$dragColor = 'red';
var $author$project$ConfigGroups$OperationsOnDrag$Rotate$dropColor = 'green';
var $author$project$ConfigGroups$OperationsOnDrag$Rotate$beforeUpdate = F3(
	function (dragIndex, dropIndex, items) {
		return (_Utils_cmp(dragIndex, dropIndex) < 0) ? A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, item) {
					return _Utils_eq(i, dragIndex) ? _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrag$Rotate$dragColor}) : (_Utils_eq(i, dropIndex) ? _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrag$Rotate$dropColor}) : (((_Utils_cmp(dragIndex, i) < 0) && (_Utils_cmp(i, dropIndex) < 0)) ? _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrag$Rotate$affectedColor}) : item));
				}),
			items) : ((_Utils_cmp(dragIndex, dropIndex) > 0) ? A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, item) {
					return _Utils_eq(i, dragIndex) ? _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrag$Rotate$dragColor}) : (_Utils_eq(i, dropIndex) ? _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrag$Rotate$dropColor}) : (((_Utils_cmp(dropIndex, i) < 0) && (_Utils_cmp(i, dragIndex) < 0)) ? _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrag$Rotate$affectedColor}) : item));
				}),
			items) : items);
	});
var $author$project$ConfigGroups$OperationsOnDrag$Rotate$comparator = F2(
	function (item1, item2) {
		return _Utils_eq(item1.t, item2.t);
	});
var $author$project$ConfigGroups$OperationsOnDrag$Rotate$setter = F2(
	function (item1, item2) {
		return _Utils_update(
			item2,
			{t: item1.t});
	});
var $author$project$ConfigGroups$OperationsOnDrag$Rotate$config = {
	cv: $author$project$ConfigGroups$OperationsOnDrag$Rotate$beforeUpdate,
	c1: {cN: $author$project$ConfigGroups$OperationsOnDrag$Rotate$comparator, dg: 0, ds: 2, dC: $author$project$ConfigGroups$OperationsOnDrag$Rotate$setter},
	dg: 0,
	ds: 4
};
var $author$project$ConfigGroups$OperationsOnDrag$Rotate$system = A2($author$project$DnDList$Groups$create, $author$project$ConfigGroups$OperationsOnDrag$Rotate$config, $author$project$ConfigGroups$OperationsOnDrag$Rotate$MyMsg);
var $author$project$ConfigGroups$OperationsOnDrag$Rotate$initialModel = {Q: $author$project$ConfigGroups$OperationsOnDrag$Rotate$system.dj, au: $author$project$ConfigGroups$OperationsOnDrag$Rotate$gatheredData};
var $author$project$ConfigGroups$OperationsOnDrag$Swap$Item = F3(
	function (group, value, color) {
		return {aV: color, t: group, aB: value};
	});
var $author$project$ConfigGroups$OperationsOnDrag$Swap$baseColor = 'dimgray';
var $author$project$ConfigGroups$OperationsOnDrag$Swap$gatheredData = _List_fromArray(
	[
		A3($author$project$ConfigGroups$OperationsOnDrag$Swap$Item, 1, '1', $author$project$ConfigGroups$OperationsOnDrag$Swap$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrag$Swap$Item, 2, '2', $author$project$ConfigGroups$OperationsOnDrag$Swap$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrag$Swap$Item, 2, '3', $author$project$ConfigGroups$OperationsOnDrag$Swap$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrag$Swap$Item, 2, '4', $author$project$ConfigGroups$OperationsOnDrag$Swap$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrag$Swap$Item, 3, '5', $author$project$ConfigGroups$OperationsOnDrag$Swap$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrag$Swap$Item, 3, '6', $author$project$ConfigGroups$OperationsOnDrag$Swap$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrag$Swap$Item, 3, '7', $author$project$ConfigGroups$OperationsOnDrag$Swap$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrag$Swap$Item, 3, '8', $author$project$ConfigGroups$OperationsOnDrag$Swap$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrag$Swap$Item, 3, '9', $author$project$ConfigGroups$OperationsOnDrag$Swap$baseColor)
	]);
var $author$project$ConfigGroups$OperationsOnDrag$Swap$MyMsg = function (a) {
	return {$: 0, a: a};
};
var $author$project$DnDList$Groups$Swap = 3;
var $author$project$ConfigGroups$OperationsOnDrag$Swap$dragColor = 'red';
var $author$project$ConfigGroups$OperationsOnDrag$Swap$dropColor = 'green';
var $author$project$ConfigGroups$OperationsOnDrag$Swap$beforeUpdate = F3(
	function (dragIndex, dropIndex, items) {
		return (!_Utils_eq(dragIndex, dropIndex)) ? A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, item) {
					return _Utils_eq(i, dropIndex) ? _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrag$Swap$dropColor}) : (_Utils_eq(i, dragIndex) ? _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrag$Swap$dragColor}) : item);
				}),
			items) : items;
	});
var $author$project$ConfigGroups$OperationsOnDrag$Swap$comparator = F2(
	function (item1, item2) {
		return _Utils_eq(item1.t, item2.t);
	});
var $author$project$ConfigGroups$OperationsOnDrag$Swap$setter = F2(
	function (item1, item2) {
		return _Utils_update(
			item2,
			{t: item1.t});
	});
var $author$project$ConfigGroups$OperationsOnDrag$Swap$config = {
	cv: $author$project$ConfigGroups$OperationsOnDrag$Swap$beforeUpdate,
	c1: {cN: $author$project$ConfigGroups$OperationsOnDrag$Swap$comparator, dg: 0, ds: 3, dC: $author$project$ConfigGroups$OperationsOnDrag$Swap$setter},
	dg: 0,
	ds: 4
};
var $author$project$ConfigGroups$OperationsOnDrag$Swap$system = A2($author$project$DnDList$Groups$create, $author$project$ConfigGroups$OperationsOnDrag$Swap$config, $author$project$ConfigGroups$OperationsOnDrag$Swap$MyMsg);
var $author$project$ConfigGroups$OperationsOnDrag$Swap$initialModel = {Q: $author$project$ConfigGroups$OperationsOnDrag$Swap$system.dj, au: $author$project$ConfigGroups$OperationsOnDrag$Swap$gatheredData};
var $author$project$ConfigGroups$OperationsOnDrag$Root$initialModel = {
	S: _List_fromArray(
		[
			$author$project$ConfigGroups$OperationsOnDrag$Root$InsertAfter($author$project$ConfigGroups$OperationsOnDrag$InsertAfter$initialModel),
			$author$project$ConfigGroups$OperationsOnDrag$Root$InsertBefore($author$project$ConfigGroups$OperationsOnDrag$InsertBefore$initialModel),
			$author$project$ConfigGroups$OperationsOnDrag$Root$Rotate($author$project$ConfigGroups$OperationsOnDrag$Rotate$initialModel),
			$author$project$ConfigGroups$OperationsOnDrag$Root$Swap($author$project$ConfigGroups$OperationsOnDrag$Swap$initialModel)
		]),
	at: 0
};
var $author$project$ConfigGroups$OperationsOnDrop$Root$InsertAfter = function (a) {
	return {$: 0, a: a};
};
var $author$project$ConfigGroups$OperationsOnDrop$Root$InsertBefore = function (a) {
	return {$: 1, a: a};
};
var $author$project$ConfigGroups$OperationsOnDrop$Root$Rotate = function (a) {
	return {$: 2, a: a};
};
var $author$project$ConfigGroups$OperationsOnDrop$Root$Swap = function (a) {
	return {$: 3, a: a};
};
var $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$Item = F3(
	function (group, value, color) {
		return {aV: color, t: group, aB: value};
	});
var $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$baseColor = 'dimgray';
var $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$transparent = 'transparent';
var $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$preparedData = _List_fromArray(
	[
		A3($author$project$ConfigGroups$OperationsOnDrop$InsertAfter$Item, 1, '', $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$transparent),
		A3($author$project$ConfigGroups$OperationsOnDrop$InsertAfter$Item, 1, '1', $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrop$InsertAfter$Item, 2, '', $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$transparent),
		A3($author$project$ConfigGroups$OperationsOnDrop$InsertAfter$Item, 2, '2', $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrop$InsertAfter$Item, 2, '3', $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrop$InsertAfter$Item, 2, '4', $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrop$InsertAfter$Item, 3, '', $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$transparent),
		A3($author$project$ConfigGroups$OperationsOnDrop$InsertAfter$Item, 3, '5', $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrop$InsertAfter$Item, 3, '6', $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrop$InsertAfter$Item, 3, '7', $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrop$InsertAfter$Item, 3, '8', $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrop$InsertAfter$Item, 3, '9', $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$baseColor)
	]);
var $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$MyMsg = function (a) {
	return {$: 0, a: a};
};
var $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$affectedColor = 'purple';
var $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$dragColor = 'red';
var $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$dropColor = 'green';
var $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$beforeUpdate = F3(
	function (dragIndex, dropIndex, items) {
		return (_Utils_cmp(dragIndex, dropIndex) < 0) ? A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, item) {
					return _Utils_eq(i, dragIndex) ? _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$dragColor}) : (_Utils_eq(i, dropIndex) ? _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$dropColor}) : (((_Utils_cmp(dragIndex, i) < 0) && (_Utils_cmp(i, dropIndex) < 0)) ? _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$affectedColor}) : _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$baseColor})));
				}),
			items) : ((_Utils_cmp(dragIndex, dropIndex) > 0) ? A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, item) {
					return _Utils_eq(i, dragIndex) ? _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$dragColor}) : (_Utils_eq(i, dropIndex) ? _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$dropColor}) : (((_Utils_cmp(dropIndex, i) < 0) && (_Utils_cmp(i, dragIndex) < 0)) ? _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$affectedColor}) : _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$baseColor})));
				}),
			items) : items);
	});
var $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$comparator = F2(
	function (item1, item2) {
		return _Utils_eq(item1.t, item2.t);
	});
var $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$setter = F2(
	function (item1, item2) {
		return _Utils_update(
			item2,
			{t: item1.t});
	});
var $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$config = {
	cv: $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$beforeUpdate,
	c1: {cN: $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$comparator, dg: 1, ds: 0, dC: $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$setter},
	dg: 1,
	ds: 4
};
var $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$system = A2($author$project$DnDList$Groups$create, $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$config, $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$MyMsg);
var $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$initialModel = {Q: $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$system.dj, au: $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$preparedData};
var $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$Item = F3(
	function (group, value, color) {
		return {aV: color, t: group, aB: value};
	});
var $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$baseColor = 'dimgray';
var $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$transparent = 'transparent';
var $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$preparedData = _List_fromArray(
	[
		A3($author$project$ConfigGroups$OperationsOnDrop$InsertBefore$Item, 1, '1', $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrop$InsertBefore$Item, 1, '', $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$transparent),
		A3($author$project$ConfigGroups$OperationsOnDrop$InsertBefore$Item, 2, '2', $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrop$InsertBefore$Item, 2, '3', $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrop$InsertBefore$Item, 2, '4', $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrop$InsertBefore$Item, 2, '', $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$transparent),
		A3($author$project$ConfigGroups$OperationsOnDrop$InsertBefore$Item, 3, '5', $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrop$InsertBefore$Item, 3, '6', $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrop$InsertBefore$Item, 3, '7', $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrop$InsertBefore$Item, 3, '8', $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrop$InsertBefore$Item, 3, '9', $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrop$InsertBefore$Item, 3, '', $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$transparent)
	]);
var $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$MyMsg = function (a) {
	return {$: 0, a: a};
};
var $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$affectedColor = 'purple';
var $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$dragColor = 'red';
var $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$dropColor = 'green';
var $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$beforeUpdate = F3(
	function (dragIndex, dropIndex, items) {
		return (_Utils_cmp(dragIndex, dropIndex) < 0) ? A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, item) {
					return _Utils_eq(i, dragIndex) ? _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$dragColor}) : (_Utils_eq(i, dropIndex) ? _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$dropColor}) : (((_Utils_cmp(dragIndex, i) < 0) && (_Utils_cmp(i, dropIndex) < 0)) ? _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$affectedColor}) : _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$baseColor})));
				}),
			items) : ((_Utils_cmp(dragIndex, dropIndex) > 0) ? A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, item) {
					return _Utils_eq(i, dragIndex) ? _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$dragColor}) : (_Utils_eq(i, dropIndex) ? _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$dropColor}) : (((_Utils_cmp(dropIndex, i) < 0) && (_Utils_cmp(i, dragIndex) < 0)) ? _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$affectedColor}) : _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$baseColor})));
				}),
			items) : items);
	});
var $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$comparator = F2(
	function (item1, item2) {
		return _Utils_eq(item1.t, item2.t);
	});
var $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$setter = F2(
	function (item1, item2) {
		return _Utils_update(
			item2,
			{t: item1.t});
	});
var $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$config = {
	cv: $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$beforeUpdate,
	c1: {cN: $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$comparator, dg: 1, ds: 1, dC: $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$setter},
	dg: 1,
	ds: 4
};
var $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$system = A2($author$project$DnDList$Groups$create, $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$config, $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$MyMsg);
var $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$initialModel = {Q: $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$system.dj, au: $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$preparedData};
var $author$project$ConfigGroups$OperationsOnDrop$Rotate$Item = F3(
	function (group, value, color) {
		return {aV: color, t: group, aB: value};
	});
var $author$project$ConfigGroups$OperationsOnDrop$Rotate$baseColor = 'dimgray';
var $author$project$ConfigGroups$OperationsOnDrop$Rotate$gatheredData = _List_fromArray(
	[
		A3($author$project$ConfigGroups$OperationsOnDrop$Rotate$Item, 1, '1', $author$project$ConfigGroups$OperationsOnDrop$Rotate$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrop$Rotate$Item, 2, '2', $author$project$ConfigGroups$OperationsOnDrop$Rotate$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrop$Rotate$Item, 2, '3', $author$project$ConfigGroups$OperationsOnDrop$Rotate$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrop$Rotate$Item, 2, '4', $author$project$ConfigGroups$OperationsOnDrop$Rotate$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrop$Rotate$Item, 3, '5', $author$project$ConfigGroups$OperationsOnDrop$Rotate$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrop$Rotate$Item, 3, '6', $author$project$ConfigGroups$OperationsOnDrop$Rotate$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrop$Rotate$Item, 3, '7', $author$project$ConfigGroups$OperationsOnDrop$Rotate$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrop$Rotate$Item, 3, '8', $author$project$ConfigGroups$OperationsOnDrop$Rotate$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrop$Rotate$Item, 3, '9', $author$project$ConfigGroups$OperationsOnDrop$Rotate$baseColor)
	]);
var $author$project$ConfigGroups$OperationsOnDrop$Rotate$MyMsg = function (a) {
	return {$: 0, a: a};
};
var $author$project$ConfigGroups$OperationsOnDrop$Rotate$affectedColor = 'purple';
var $author$project$ConfigGroups$OperationsOnDrop$Rotate$dragColor = 'red';
var $author$project$ConfigGroups$OperationsOnDrop$Rotate$dropColor = 'green';
var $author$project$ConfigGroups$OperationsOnDrop$Rotate$beforeUpdate = F3(
	function (dragIndex, dropIndex, items) {
		return (_Utils_cmp(dragIndex, dropIndex) < 0) ? A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, item) {
					return _Utils_eq(i, dragIndex) ? _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrop$Rotate$dragColor}) : (_Utils_eq(i, dropIndex) ? _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrop$Rotate$dropColor}) : (((_Utils_cmp(dragIndex, i) < 0) && (_Utils_cmp(i, dropIndex) < 0)) ? _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrop$Rotate$affectedColor}) : _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrop$Rotate$baseColor})));
				}),
			items) : ((_Utils_cmp(dragIndex, dropIndex) > 0) ? A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, item) {
					return _Utils_eq(i, dragIndex) ? _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrop$Rotate$dragColor}) : (_Utils_eq(i, dropIndex) ? _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrop$Rotate$dropColor}) : (((_Utils_cmp(dropIndex, i) < 0) && (_Utils_cmp(i, dragIndex) < 0)) ? _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrop$Rotate$affectedColor}) : _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrop$Rotate$baseColor})));
				}),
			items) : items);
	});
var $author$project$ConfigGroups$OperationsOnDrop$Rotate$comparator = F2(
	function (item1, item2) {
		return _Utils_eq(item1.t, item2.t);
	});
var $author$project$ConfigGroups$OperationsOnDrop$Rotate$setter = F2(
	function (item1, item2) {
		return _Utils_update(
			item2,
			{t: item1.t});
	});
var $author$project$ConfigGroups$OperationsOnDrop$Rotate$config = {
	cv: $author$project$ConfigGroups$OperationsOnDrop$Rotate$beforeUpdate,
	c1: {cN: $author$project$ConfigGroups$OperationsOnDrop$Rotate$comparator, dg: 1, ds: 2, dC: $author$project$ConfigGroups$OperationsOnDrop$Rotate$setter},
	dg: 1,
	ds: 4
};
var $author$project$ConfigGroups$OperationsOnDrop$Rotate$system = A2($author$project$DnDList$Groups$create, $author$project$ConfigGroups$OperationsOnDrop$Rotate$config, $author$project$ConfigGroups$OperationsOnDrop$Rotate$MyMsg);
var $author$project$ConfigGroups$OperationsOnDrop$Rotate$initialModel = {Q: $author$project$ConfigGroups$OperationsOnDrop$Rotate$system.dj, au: $author$project$ConfigGroups$OperationsOnDrop$Rotate$gatheredData};
var $author$project$ConfigGroups$OperationsOnDrop$Swap$Item = F3(
	function (group, value, color) {
		return {aV: color, t: group, aB: value};
	});
var $author$project$ConfigGroups$OperationsOnDrop$Swap$baseColor = 'dimgray';
var $author$project$ConfigGroups$OperationsOnDrop$Swap$gatheredData = _List_fromArray(
	[
		A3($author$project$ConfigGroups$OperationsOnDrop$Swap$Item, 1, '1', $author$project$ConfigGroups$OperationsOnDrop$Swap$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrop$Swap$Item, 2, '2', $author$project$ConfigGroups$OperationsOnDrop$Swap$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrop$Swap$Item, 2, '3', $author$project$ConfigGroups$OperationsOnDrop$Swap$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrop$Swap$Item, 2, '4', $author$project$ConfigGroups$OperationsOnDrop$Swap$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrop$Swap$Item, 3, '5', $author$project$ConfigGroups$OperationsOnDrop$Swap$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrop$Swap$Item, 3, '6', $author$project$ConfigGroups$OperationsOnDrop$Swap$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrop$Swap$Item, 3, '7', $author$project$ConfigGroups$OperationsOnDrop$Swap$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrop$Swap$Item, 3, '8', $author$project$ConfigGroups$OperationsOnDrop$Swap$baseColor),
		A3($author$project$ConfigGroups$OperationsOnDrop$Swap$Item, 3, '9', $author$project$ConfigGroups$OperationsOnDrop$Swap$baseColor)
	]);
var $author$project$ConfigGroups$OperationsOnDrop$Swap$MyMsg = function (a) {
	return {$: 0, a: a};
};
var $author$project$ConfigGroups$OperationsOnDrop$Swap$dragColor = 'red';
var $author$project$ConfigGroups$OperationsOnDrop$Swap$dropColor = 'green';
var $author$project$ConfigGroups$OperationsOnDrop$Swap$beforeUpdate = F3(
	function (dragIndex, dropIndex, items) {
		return (!_Utils_eq(dragIndex, dropIndex)) ? A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, item) {
					return _Utils_eq(i, dropIndex) ? _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrop$Swap$dropColor}) : (_Utils_eq(i, dragIndex) ? _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrop$Swap$dragColor}) : _Utils_update(
						item,
						{aV: $author$project$ConfigGroups$OperationsOnDrop$Swap$baseColor}));
				}),
			items) : items;
	});
var $author$project$ConfigGroups$OperationsOnDrop$Swap$comparator = F2(
	function (item1, item2) {
		return _Utils_eq(item1.t, item2.t);
	});
var $author$project$ConfigGroups$OperationsOnDrop$Swap$setter = F2(
	function (item1, item2) {
		return _Utils_update(
			item2,
			{t: item1.t});
	});
var $author$project$ConfigGroups$OperationsOnDrop$Swap$config = {
	cv: $author$project$ConfigGroups$OperationsOnDrop$Swap$beforeUpdate,
	c1: {cN: $author$project$ConfigGroups$OperationsOnDrop$Swap$comparator, dg: 1, ds: 3, dC: $author$project$ConfigGroups$OperationsOnDrop$Swap$setter},
	dg: 1,
	ds: 4
};
var $author$project$ConfigGroups$OperationsOnDrop$Swap$system = A2($author$project$DnDList$Groups$create, $author$project$ConfigGroups$OperationsOnDrop$Swap$config, $author$project$ConfigGroups$OperationsOnDrop$Swap$MyMsg);
var $author$project$ConfigGroups$OperationsOnDrop$Swap$initialModel = {Q: $author$project$ConfigGroups$OperationsOnDrop$Swap$system.dj, au: $author$project$ConfigGroups$OperationsOnDrop$Swap$gatheredData};
var $author$project$ConfigGroups$OperationsOnDrop$Root$initialModel = {
	S: _List_fromArray(
		[
			$author$project$ConfigGroups$OperationsOnDrop$Root$InsertAfter($author$project$ConfigGroups$OperationsOnDrop$InsertAfter$initialModel),
			$author$project$ConfigGroups$OperationsOnDrop$Root$InsertBefore($author$project$ConfigGroups$OperationsOnDrop$InsertBefore$initialModel),
			$author$project$ConfigGroups$OperationsOnDrop$Root$Rotate($author$project$ConfigGroups$OperationsOnDrop$Rotate$initialModel),
			$author$project$ConfigGroups$OperationsOnDrop$Root$Swap($author$project$ConfigGroups$OperationsOnDrop$Swap$initialModel)
		]),
	at: 0
};
var $author$project$ConfigGroups$Root$toExample = function (slug) {
	switch (slug) {
		case 'operations-drag':
			return $author$project$ConfigGroups$Root$OperationsOnDrag($author$project$ConfigGroups$OperationsOnDrag$Root$initialModel);
		case 'operations-drop':
			return $author$project$ConfigGroups$Root$OperationsOnDrop($author$project$ConfigGroups$OperationsOnDrop$Root$initialModel);
		default:
			return $author$project$ConfigGroups$Root$OperationsOnDrag($author$project$ConfigGroups$OperationsOnDrag$Root$initialModel);
	}
};
var $author$project$ConfigGroups$Root$init = function (slug) {
	return _Utils_Tuple2(
		$author$project$ConfigGroups$Root$toExample(slug),
		$elm$core$Platform$Cmd$none);
};
var $author$project$Gallery$Root$PuzzleMsg = function (a) {
	return {$: 1, a: a};
};
var $author$project$Gallery$Puzzle$NewGame = function (a) {
	return {$: 0, a: a};
};
var $elm$random$Random$Generate = $elm$core$Basics$identity;
var $elm$random$Random$Seed = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$random$Random$next = function (_v0) {
	var state0 = _v0.a;
	var incr = _v0.b;
	return A2($elm$random$Random$Seed, ((state0 * 1664525) + incr) >>> 0, incr);
};
var $elm$random$Random$initialSeed = function (x) {
	var _v0 = $elm$random$Random$next(
		A2($elm$random$Random$Seed, 0, 1013904223));
	var state1 = _v0.a;
	var incr = _v0.b;
	var state2 = (state1 + x) >>> 0;
	return $elm$random$Random$next(
		A2($elm$random$Random$Seed, state2, incr));
};
var $elm$time$Time$Name = function (a) {
	return {$: 0, a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 1, a: a};
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$customZone = $elm$time$Time$Zone;
var $elm$time$Time$Posix = $elm$core$Basics$identity;
var $elm$time$Time$millisToPosix = $elm$core$Basics$identity;
var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
var $elm$time$Time$posixToMillis = function (_v0) {
	var millis = _v0;
	return millis;
};
var $elm$random$Random$init = A2(
	$elm$core$Task$andThen,
	function (time) {
		return $elm$core$Task$succeed(
			$elm$random$Random$initialSeed(
				$elm$time$Time$posixToMillis(time)));
	},
	$elm$time$Time$now);
var $elm$random$Random$step = F2(
	function (_v0, seed) {
		var generator = _v0;
		return generator(seed);
	});
var $elm$random$Random$onEffects = F3(
	function (router, commands, seed) {
		if (!commands.b) {
			return $elm$core$Task$succeed(seed);
		} else {
			var generator = commands.a;
			var rest = commands.b;
			var _v1 = A2($elm$random$Random$step, generator, seed);
			var value = _v1.a;
			var newSeed = _v1.b;
			return A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$random$Random$onEffects, router, rest, newSeed);
				},
				A2($elm$core$Platform$sendToApp, router, value));
		}
	});
var $elm$random$Random$onSelfMsg = F3(
	function (_v0, _v1, seed) {
		return $elm$core$Task$succeed(seed);
	});
var $elm$random$Random$Generator = $elm$core$Basics$identity;
var $elm$random$Random$map = F2(
	function (func, _v0) {
		var genA = _v0;
		return function (seed0) {
			var _v1 = genA(seed0);
			var a = _v1.a;
			var seed1 = _v1.b;
			return _Utils_Tuple2(
				func(a),
				seed1);
		};
	});
var $elm$random$Random$cmdMap = F2(
	function (func, _v0) {
		var generator = _v0;
		return A2($elm$random$Random$map, func, generator);
	});
_Platform_effectManagers['Random'] = _Platform_createManager($elm$random$Random$init, $elm$random$Random$onEffects, $elm$random$Random$onSelfMsg, $elm$random$Random$cmdMap);
var $elm$random$Random$command = _Platform_leaf('Random');
var $elm$random$Random$generate = F2(
	function (tagger, generator) {
		return $elm$random$Random$command(
			A2($elm$random$Random$map, tagger, generator));
	});
var $elm$random$Random$andThen = F2(
	function (callback, _v0) {
		var genA = _v0;
		return function (seed) {
			var _v1 = genA(seed);
			var result = _v1.a;
			var newSeed = _v1.b;
			var _v2 = callback(result);
			var genB = _v2;
			return genB(newSeed);
		};
	});
var $elm$random$Random$constant = function (value) {
	return function (seed) {
		return _Utils_Tuple2(value, seed);
	};
};
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Gallery$Puzzle$get = F2(
	function (index, list) {
		return $elm$core$List$head(
			A2($elm$core$List$drop, index, list));
	});
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$Bitwise$xor = _Bitwise_xor;
var $elm$random$Random$peel = function (_v0) {
	var state = _v0.a;
	var word = (state ^ (state >>> ((state >>> 28) + 4))) * 277803737;
	return ((word >>> 22) ^ word) >>> 0;
};
var $elm$random$Random$int = F2(
	function (a, b) {
		return function (seed0) {
			var _v0 = (_Utils_cmp(a, b) < 0) ? _Utils_Tuple2(a, b) : _Utils_Tuple2(b, a);
			var lo = _v0.a;
			var hi = _v0.b;
			var range = (hi - lo) + 1;
			if (!((range - 1) & range)) {
				return _Utils_Tuple2(
					(((range - 1) & $elm$random$Random$peel(seed0)) >>> 0) + lo,
					$elm$random$Random$next(seed0));
			} else {
				var threshhold = (((-range) >>> 0) % range) >>> 0;
				var accountForBias = function (seed) {
					accountForBias:
					while (true) {
						var x = $elm$random$Random$peel(seed);
						var seedN = $elm$random$Random$next(seed);
						if (_Utils_cmp(x, threshhold) < 0) {
							var $temp$seed = seedN;
							seed = $temp$seed;
							continue accountForBias;
						} else {
							return _Utils_Tuple2((x % range) + lo, seedN);
						}
					}
				};
				return accountForBias(seed0);
			}
		};
	});
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $author$project$Gallery$Puzzle$choose = function (list) {
	if ($elm$core$List$isEmpty(list)) {
		return $elm$random$Random$constant(
			_Utils_Tuple2($elm$core$Maybe$Nothing, list));
	} else {
		var lastIndex = $elm$core$List$length(list) - 1;
		var gen = A2($elm$random$Random$int, 0, lastIndex);
		var front = function (i) {
			return A2($elm$core$List$take, i, list);
		};
		var back = function (i) {
			return A2($elm$core$List$drop, i + 1, list);
		};
		return A2(
			$elm$random$Random$map,
			function (index) {
				return _Utils_Tuple2(
					A2($author$project$Gallery$Puzzle$get, index, list),
					A2(
						$elm$core$List$append,
						front(index),
						back(index)));
			},
			gen);
	}
};
var $author$project$Gallery$Puzzle$shuffle = function (list) {
	if ($elm$core$List$isEmpty(list)) {
		return $elm$random$Random$constant(list);
	} else {
		var helper = function (_v0) {
			var done = _v0.a;
			var remaining = _v0.b;
			return A2(
				$elm$random$Random$andThen,
				function (_v1) {
					var m_val = _v1.a;
					var shorter = _v1.b;
					if (m_val.$ === 1) {
						return $elm$random$Random$constant(
							_Utils_Tuple2(done, shorter));
					} else {
						var val = m_val.a;
						return helper(
							_Utils_Tuple2(
								A2($elm$core$List$cons, val, done),
								shorter));
					}
				},
				$author$project$Gallery$Puzzle$choose(remaining));
		};
		return A2(
			$elm$random$Random$map,
			$elm$core$Tuple$first,
			helper(
				_Utils_Tuple2(_List_Nil, list)));
	}
};
var $author$project$Gallery$Puzzle$Item = F3(
	function (group, value, color) {
		return {aV: color, t: group, aB: value};
	});
var $author$project$Gallery$Puzzle$blue = '#448ff8';
var $author$project$Gallery$Puzzle$cyan = '#44bcf8';
var $author$project$Gallery$Puzzle$indigo = '#4462f8';
var $author$project$Gallery$Puzzle$purple = '#5344f8';
var $author$project$Gallery$Puzzle$solution = _List_fromArray(
	[
		A3($author$project$Gallery$Puzzle$Item, 0, 'A', $author$project$Gallery$Puzzle$cyan),
		A3($author$project$Gallery$Puzzle$Item, 0, 'B', $author$project$Gallery$Puzzle$cyan),
		A3($author$project$Gallery$Puzzle$Item, 0, 'C', $author$project$Gallery$Puzzle$cyan),
		A3($author$project$Gallery$Puzzle$Item, 0, 'D', $author$project$Gallery$Puzzle$cyan),
		A3($author$project$Gallery$Puzzle$Item, 1, 'Ա', $author$project$Gallery$Puzzle$blue),
		A3($author$project$Gallery$Puzzle$Item, 1, 'Բ', $author$project$Gallery$Puzzle$blue),
		A3($author$project$Gallery$Puzzle$Item, 1, 'Գ', $author$project$Gallery$Puzzle$blue),
		A3($author$project$Gallery$Puzzle$Item, 1, 'Դ', $author$project$Gallery$Puzzle$blue),
		A3($author$project$Gallery$Puzzle$Item, 2, '1', $author$project$Gallery$Puzzle$indigo),
		A3($author$project$Gallery$Puzzle$Item, 2, '2', $author$project$Gallery$Puzzle$indigo),
		A3($author$project$Gallery$Puzzle$Item, 2, '3', $author$project$Gallery$Puzzle$indigo),
		A3($author$project$Gallery$Puzzle$Item, 2, '4', $author$project$Gallery$Puzzle$indigo),
		A3($author$project$Gallery$Puzzle$Item, 3, 'α', $author$project$Gallery$Puzzle$purple),
		A3($author$project$Gallery$Puzzle$Item, 3, 'β', $author$project$Gallery$Puzzle$purple),
		A3($author$project$Gallery$Puzzle$Item, 3, 'γ', $author$project$Gallery$Puzzle$purple),
		A3($author$project$Gallery$Puzzle$Item, 3, 'δ', $author$project$Gallery$Puzzle$purple)
	]);
var $author$project$Gallery$Puzzle$commands = A2(
	$elm$random$Random$generate,
	$author$project$Gallery$Puzzle$NewGame,
	$author$project$Gallery$Puzzle$shuffle($author$project$Gallery$Puzzle$solution));
var $elm$core$Platform$Cmd$map = _Platform_map;
var $author$project$Gallery$Root$commands = A2($elm$core$Platform$Cmd$map, $author$project$Gallery$Root$PuzzleMsg, $author$project$Gallery$Puzzle$commands);
var $author$project$Gallery$Root$Hanoi = function (a) {
	return {$: 0, a: a};
};
var $author$project$Gallery$Root$Knight = function (a) {
	return {$: 3, a: a};
};
var $author$project$Gallery$Root$Puzzle = function (a) {
	return {$: 1, a: a};
};
var $author$project$Gallery$Root$Shapes = function (a) {
	return {$: 2, a: a};
};
var $author$project$Gallery$Root$TaskBoard = function (a) {
	return {$: 5, a: a};
};
var $author$project$Gallery$Root$TryOn = function (a) {
	return {$: 4, a: a};
};
var $author$project$Gallery$Hanoi$Disk = F4(
	function (tower, width, startColor, solvedColor) {
		return {bn: solvedColor, a1: startColor, aP: tower, d4: width};
	});
var $author$project$Gallery$Hanoi$data = _List_fromArray(
	[
		A4($author$project$Gallery$Hanoi$Disk, 0, 300, 'transparent', 'transparent'),
		A4($author$project$Gallery$Hanoi$Disk, 0, 60, '#ff8918', '#fffd18'),
		A4($author$project$Gallery$Hanoi$Disk, 0, 120, '#ff7618', '#ffea18'),
		A4($author$project$Gallery$Hanoi$Disk, 0, 180, '#ff6218', '#ffd618'),
		A4($author$project$Gallery$Hanoi$Disk, 0, 240, '#ff4f18', '#ffc318'),
		A4($author$project$Gallery$Hanoi$Disk, 1, 300, 'transparent', 'transparent'),
		A4($author$project$Gallery$Hanoi$Disk, 2, 300, 'transparent', 'transparent')
	]);
var $author$project$Gallery$Hanoi$MyMsg = $elm$core$Basics$identity;
var $author$project$Gallery$Hanoi$updateTower = F3(
	function (dragIndex, dropIndex, list) {
		var drops = A2(
			$elm$core$List$take,
			1,
			A2($elm$core$List$drop, dropIndex, list));
		return $elm$core$List$concat(
			A2(
				$elm$core$List$indexedMap,
				F2(
					function (index, item) {
						return _Utils_eq(index, dragIndex) ? A3(
							$elm$core$List$map2,
							F2(
								function (dragDisk, dropDisk) {
									return _Utils_update(
										dragDisk,
										{aP: dropDisk.aP});
								}),
							_List_fromArray(
								[item]),
							drops) : _List_fromArray(
							[item]);
					}),
				list));
	});
var $author$project$Gallery$Hanoi$config = {cv: $author$project$Gallery$Hanoi$updateTower, dg: 1, dk: 0, ds: 0};
var $author$project$Gallery$Hanoi$system = A2($author$project$DnDList$create, $author$project$Gallery$Hanoi$config, $elm$core$Basics$identity);
var $author$project$Gallery$Hanoi$initialModel = {P: $author$project$Gallery$Hanoi$data, Q: $author$project$Gallery$Hanoi$system.dj, aL: false};
var $author$project$Gallery$Knight$squares5x5 = A2(
	$elm$core$List$map,
	function (index5) {
		return (index5 === 12) ? 'N' : '';
	},
	A2($elm$core$List$range, 0, 24));
var $author$project$Gallery$Knight$MyMsg = $elm$core$Basics$identity;
var $author$project$Gallery$Knight$beforeUpdate = F3(
	function (dragIndex, dropIndex, squares) {
		return A2(
			$elm$core$List$indexedMap,
			F2(
				function (index5, square) {
					return _Utils_eq(index5, dragIndex) ? 'N' : (_Utils_eq(index5, dropIndex) ? '×' : square);
				}),
			squares);
	});
var $author$project$Gallery$Knight$config = {cv: $author$project$Gallery$Knight$beforeUpdate, dg: 1, dk: 0, ds: 3};
var $author$project$Gallery$Knight$system = A2($author$project$DnDList$create, $author$project$Gallery$Knight$config, $elm$core$Basics$identity);
var $author$project$Gallery$Knight$initialModel = {Q: $author$project$Gallery$Knight$system.dj, aL: false, az: $author$project$Gallery$Knight$squares5x5};
var $author$project$Gallery$Puzzle$MyMsg = function (a) {
	return {$: 1, a: a};
};
var $author$project$Gallery$Puzzle$comparator = F2(
	function (item1, item2) {
		return _Utils_eq(item1.t, item2.t);
	});
var $author$project$Gallery$Puzzle$setter = F2(
	function (item1, item2) {
		return _Utils_update(
			item2,
			{t: item1.t});
	});
var $author$project$Gallery$Puzzle$config = {
	cv: F3(
		function (_v0, _v1, list) {
			return list;
		}),
	c1: {cN: $author$project$Gallery$Puzzle$comparator, dg: 1, ds: 3, dC: $author$project$Gallery$Puzzle$setter},
	dg: 0,
	ds: 3
};
var $author$project$Gallery$Puzzle$system = A2($author$project$DnDList$Groups$create, $author$project$Gallery$Puzzle$config, $author$project$Gallery$Puzzle$MyMsg);
var $author$project$Gallery$Puzzle$initialModel = {Q: $author$project$Gallery$Puzzle$system.dj, au: _List_Nil};
var $author$project$Gallery$Shapes$Circle = 0;
var $author$project$Gallery$Shapes$Cross = 1;
var $author$project$Gallery$Shapes$Item = F4(
	function (shape, color, attempts, solved) {
		return {am: attempts, aV: color, ax: shape, aL: solved};
	});
var $author$project$Gallery$Shapes$Square = 2;
var $author$project$Gallery$Shapes$Triangle = 3;
var $author$project$Gallery$Shapes$data = _List_fromArray(
	[
		A4($author$project$Gallery$Shapes$Item, 0, '#d82775', 0, false),
		A4($author$project$Gallery$Shapes$Item, 1, '#ffcf00', 0, false),
		A4($author$project$Gallery$Shapes$Item, 3, '#00b2d4', 0, false),
		A4($author$project$Gallery$Shapes$Item, 2, '#90e200', 0, false),
		A4($author$project$Gallery$Shapes$Item, 3, 'dimgray', 0, false),
		A4($author$project$Gallery$Shapes$Item, 2, 'dimgray', 0, false),
		A4($author$project$Gallery$Shapes$Item, 1, 'dimgray', 0, false),
		A4($author$project$Gallery$Shapes$Item, 0, 'dimgray', 0, false)
	]);
var $author$project$Gallery$Shapes$MyMsg = $elm$core$Basics$identity;
var $author$project$Gallery$Shapes$updateShapes = F3(
	function (dragIndex, dropIndex, list) {
		var drops = A2(
			$elm$core$List$take,
			1,
			A2($elm$core$List$drop, dropIndex, list));
		var drags = A2(
			$elm$core$List$take,
			1,
			A2($elm$core$List$drop, dragIndex, list));
		var fit = A3(
			$elm$core$List$foldl,
			$elm$core$Basics$or,
			false,
			A3(
				$elm$core$List$map2,
				F2(
					function (dragItem, dropItem) {
						return _Utils_eq(dragItem.ax, dropItem.ax);
					}),
				drags,
				drops));
		return $elm$core$List$concat(
			A2(
				$elm$core$List$indexedMap,
				F2(
					function (index, item) {
						return (_Utils_eq(index, dragIndex) && fit) ? _List_fromArray(
							[
								_Utils_update(
								item,
								{aV: 'transparent', aL: true})
							]) : ((_Utils_eq(index, dropIndex) && fit) ? A3(
							$elm$core$List$map2,
							F2(
								function (dragItem, dropItem) {
									return _Utils_update(
										dropItem,
										{am: dropItem.am + 1, aV: dragItem.aV, aL: true});
								}),
							drags,
							_List_fromArray(
								[item])) : ((_Utils_eq(index, dropIndex) && (!fit)) ? _List_fromArray(
							[
								_Utils_update(
								item,
								{am: item.am + 1})
							]) : _List_fromArray(
							[item])));
					}),
				list));
	});
var $author$project$Gallery$Shapes$config = {cv: $author$project$Gallery$Shapes$updateShapes, dg: 1, dk: 0, ds: 4};
var $author$project$Gallery$Shapes$system = A2($author$project$DnDList$create, $author$project$Gallery$Shapes$config, $elm$core$Basics$identity);
var $author$project$Gallery$Shapes$initialModel = {Q: $author$project$Gallery$Shapes$system.dj, au: $author$project$Gallery$Shapes$data};
var $author$project$Gallery$TaskBoard$CardMoved = function (a) {
	return {$: 0, a: a};
};
var $author$project$Gallery$TaskBoard$comparator = F2(
	function (card1, card2) {
		return _Utils_eq(card1.r, card2.r);
	});
var $author$project$Gallery$TaskBoard$setter = F2(
	function (card1, card2) {
		return _Utils_update(
			card2,
			{r: card1.r});
	});
var $author$project$Gallery$TaskBoard$cardConfig = {
	cv: F3(
		function (_v0, _v1, list) {
			return list;
		}),
	c1: {cN: $author$project$Gallery$TaskBoard$comparator, dg: 0, ds: 1, dC: $author$project$Gallery$TaskBoard$setter},
	dg: 0,
	ds: 2
};
var $author$project$Gallery$TaskBoard$cardSystem = A2($author$project$DnDList$Groups$create, $author$project$Gallery$TaskBoard$cardConfig, $author$project$Gallery$TaskBoard$CardMoved);
var $author$project$Gallery$TaskBoard$ColumnMoved = function (a) {
	return {$: 1, a: a};
};
var $author$project$Gallery$TaskBoard$columnConfig = {
	cv: F3(
		function (_v0, _v1, list) {
			return list;
		}),
	dg: 0,
	dk: 0,
	ds: 2
};
var $author$project$Gallery$TaskBoard$columnSystem = A2($author$project$DnDList$create, $author$project$Gallery$TaskBoard$columnConfig, $author$project$Gallery$TaskBoard$ColumnMoved);
var $author$project$Gallery$TaskBoard$Card = F2(
	function (activity, description) {
		return {r: activity, aG: description};
	});
var $author$project$Gallery$TaskBoard$Doing = 1;
var $author$project$Gallery$TaskBoard$Done = 2;
var $author$project$Gallery$TaskBoard$ToDo = 0;
var $author$project$Gallery$TaskBoard$data = _List_fromArray(
	[
		A2($author$project$Gallery$TaskBoard$Card, 0, 'D'),
		A2($author$project$Gallery$TaskBoard$Card, 0, 'B'),
		A2($author$project$Gallery$TaskBoard$Card, 0, 'A'),
		A2($author$project$Gallery$TaskBoard$Card, 0, ''),
		A2($author$project$Gallery$TaskBoard$Card, 1, 'C'),
		A2($author$project$Gallery$TaskBoard$Card, 1, 'F'),
		A2($author$project$Gallery$TaskBoard$Card, 1, ''),
		A2($author$project$Gallery$TaskBoard$Card, 2, 'G'),
		A2($author$project$Gallery$TaskBoard$Card, 2, 'E'),
		A2($author$project$Gallery$TaskBoard$Card, 2, '')
	]);
var $author$project$Gallery$TaskBoard$initialModel = {C: $author$project$Gallery$TaskBoard$cardSystem.dj, D: $author$project$Gallery$TaskBoard$data, E: $author$project$Gallery$TaskBoard$columnSystem.dj};
var $author$project$Gallery$TryOn$Color = 0;
var $author$project$Gallery$TryOn$Item = F4(
	function (id, property, size, color) {
		return {aV: color, at: id, aI: property, aJ: size};
	});
var $author$project$Gallery$TryOn$Size = 1;
var $author$project$Gallery$TryOn$data = _List_fromArray(
	[
		A4($author$project$Gallery$TryOn$Item, 'id-1', 0, 1, '#2ba218'),
		A4($author$project$Gallery$TryOn$Item, 'id-2', 0, 1, '#70a218'),
		A4($author$project$Gallery$TryOn$Item, 'id-3', 0, 1, '#a28f18'),
		A4($author$project$Gallery$TryOn$Item, 'id-4', 0, 1, '#a24b18'),
		A4($author$project$Gallery$TryOn$Item, 'id-5', 1, 1, 'dimgray'),
		A4($author$project$Gallery$TryOn$Item, 'id-6', 1, 2, 'dimgray'),
		A4($author$project$Gallery$TryOn$Item, 'id-7', 1, 3, 'dimgray'),
		A4($author$project$Gallery$TryOn$Item, 'id-8', 1, 4, 'dimgray'),
		A4($author$project$Gallery$TryOn$Item, 'id-9', 1, 5, 'dimgray')
	]);
var $author$project$Gallery$TryOn$MyMsg = $elm$core$Basics$identity;
var $author$project$Gallery$TryOn$updateColor = F3(
	function (dragIndex, dropIndex, list) {
		var drags = A2(
			$elm$core$List$take,
			1,
			A2($elm$core$List$drop, dragIndex, list));
		return $elm$core$List$concat(
			A2(
				$elm$core$List$indexedMap,
				F2(
					function (index, item) {
						if (_Utils_eq(index, dropIndex)) {
							return A3(
								$elm$core$List$map2,
								F2(
									function (dragItem, dropItem) {
										return _Utils_update(
											dropItem,
											{aV: dragItem.aV});
									}),
								drags,
								_List_fromArray(
									[item]));
						} else {
							if (_Utils_eq(index, dragIndex)) {
								var _v0 = item.aI;
								if (_v0 === 1) {
									return _List_fromArray(
										[
											_Utils_update(
											item,
											{aV: 'dimgray'})
										]);
								} else {
									return _List_fromArray(
										[item]);
								}
							} else {
								return _List_fromArray(
									[item]);
							}
						}
					}),
				list));
	});
var $author$project$Gallery$TryOn$config = {cv: $author$project$Gallery$TryOn$updateColor, dg: 1, dk: 0, ds: 4};
var $author$project$Gallery$TryOn$system = A2($author$project$DnDList$create, $author$project$Gallery$TryOn$config, $elm$core$Basics$identity);
var $author$project$Gallery$TryOn$initialModel = {Q: $author$project$Gallery$TryOn$system.dj, au: $author$project$Gallery$TryOn$data};
var $author$project$Gallery$Root$toExample = function (slug) {
	switch (slug) {
		case 'hanoi':
			return $author$project$Gallery$Root$Hanoi($author$project$Gallery$Hanoi$initialModel);
		case 'puzzle':
			return $author$project$Gallery$Root$Puzzle($author$project$Gallery$Puzzle$initialModel);
		case 'shapes':
			return $author$project$Gallery$Root$Shapes($author$project$Gallery$Shapes$initialModel);
		case 'knight':
			return $author$project$Gallery$Root$Knight($author$project$Gallery$Knight$initialModel);
		case 'try-on':
			return $author$project$Gallery$Root$TryOn($author$project$Gallery$TryOn$initialModel);
		case 'taskboard':
			return $author$project$Gallery$Root$TaskBoard($author$project$Gallery$TaskBoard$initialModel);
		default:
			return $author$project$Gallery$Root$Hanoi($author$project$Gallery$Hanoi$initialModel);
	}
};
var $author$project$Gallery$Root$init = function (slug) {
	return _Utils_Tuple2(
		$author$project$Gallery$Root$toExample(slug),
		$author$project$Gallery$Root$commands);
};
var $author$project$Introduction$Root$MasonryMsg = function (a) {
	return {$: 5, a: a};
};
var $author$project$Introduction$Masonry$NewMasonry = function (a) {
	return {$: 0, a: a};
};
var $author$project$Introduction$Masonry$colors = _List_fromArray(
	['#acfe2f', '#cefe2f', '#f0fe2f', '#feea2f', '#fec72f', '#fea52f', '#fe832f', '#fe612f', '#fe3f2f']);
var $elm$random$Random$listHelp = F4(
	function (revList, n, gen, seed) {
		listHelp:
		while (true) {
			if (n < 1) {
				return _Utils_Tuple2(revList, seed);
			} else {
				var _v0 = gen(seed);
				var value = _v0.a;
				var newSeed = _v0.b;
				var $temp$revList = A2($elm$core$List$cons, value, revList),
					$temp$n = n - 1,
					$temp$gen = gen,
					$temp$seed = newSeed;
				revList = $temp$revList;
				n = $temp$n;
				gen = $temp$gen;
				seed = $temp$seed;
				continue listHelp;
			}
		}
	});
var $elm$random$Random$list = F2(
	function (n, _v0) {
		var gen = _v0;
		return function (seed) {
			return A4($elm$random$Random$listHelp, _List_Nil, n, gen, seed);
		};
	});
var $author$project$Introduction$Masonry$commands = A2(
	$elm$random$Random$generate,
	$author$project$Introduction$Masonry$NewMasonry,
	A2(
		$elm$random$Random$list,
		$elm$core$List$length($author$project$Introduction$Masonry$colors),
		A2($elm$random$Random$int, 50, 200)));
var $author$project$Introduction$Root$commands = A2($elm$core$Platform$Cmd$map, $author$project$Introduction$Root$MasonryMsg, $author$project$Introduction$Masonry$commands);
var $author$project$Introduction$Root$Basic = function (a) {
	return {$: 0, a: a};
};
var $author$project$Introduction$Root$BasicElmUI = function (a) {
	return {$: 1, a: a};
};
var $author$project$Introduction$Root$Groups = function (a) {
	return {$: 8, a: a};
};
var $author$project$Introduction$Root$Handle = function (a) {
	return {$: 2, a: a};
};
var $author$project$Introduction$Root$Independents = function (a) {
	return {$: 7, a: a};
};
var $author$project$Introduction$Root$Keyed = function (a) {
	return {$: 3, a: a};
};
var $author$project$Introduction$Root$Margins = function (a) {
	return {$: 4, a: a};
};
var $author$project$Introduction$Root$Masonry = function (a) {
	return {$: 5, a: a};
};
var $author$project$Introduction$Root$Resize = function (a) {
	return {$: 6, a: a};
};
var $author$project$Introduction$Basic$data = _List_fromArray(
	['Apples', 'Bananas', 'Cherries', 'Dates']);
var $author$project$Introduction$Basic$MyMsg = $elm$core$Basics$identity;
var $author$project$Introduction$Basic$config = {
	cv: F3(
		function (_v0, _v1, list) {
			return list;
		}),
	dg: 0,
	dk: 0,
	ds: 2
};
var $author$project$Introduction$Basic$system = A2($author$project$DnDList$create, $author$project$Introduction$Basic$config, $elm$core$Basics$identity);
var $author$project$Introduction$Basic$initialModel = {Q: $author$project$Introduction$Basic$system.dj, au: $author$project$Introduction$Basic$data};
var $author$project$Introduction$BasicElmUI$data = _List_fromArray(
	['Apples', 'Bananas', 'Cherries', 'Dates']);
var $author$project$Introduction$BasicElmUI$MyMsg = $elm$core$Basics$identity;
var $author$project$Introduction$BasicElmUI$config = {
	cv: F3(
		function (_v0, _v1, list) {
			return list;
		}),
	dg: 0,
	dk: 0,
	ds: 2
};
var $author$project$Introduction$BasicElmUI$system = A2($author$project$DnDList$create, $author$project$Introduction$BasicElmUI$config, $elm$core$Basics$identity);
var $author$project$Introduction$BasicElmUI$initialModel = {Q: $author$project$Introduction$BasicElmUI$system.dj, au: $author$project$Introduction$BasicElmUI$data};
var $author$project$Introduction$Groups$Item = F3(
	function (group, value, color) {
		return {aV: color, t: group, aB: value};
	});
var $author$project$Introduction$Groups$Left = 0;
var $author$project$Introduction$Groups$Right = 1;
var $author$project$Introduction$Groups$blue = '#0067c3';
var $author$project$Introduction$Groups$red = '#c30005';
var $author$project$Introduction$Groups$transparent = 'transparent';
var $author$project$Introduction$Groups$preparedData = _List_fromArray(
	[
		A3($author$project$Introduction$Groups$Item, 0, 'C', $author$project$Introduction$Groups$blue),
		A3($author$project$Introduction$Groups$Item, 0, '2', $author$project$Introduction$Groups$red),
		A3($author$project$Introduction$Groups$Item, 0, 'A', $author$project$Introduction$Groups$blue),
		A3($author$project$Introduction$Groups$Item, 0, 'footer', $author$project$Introduction$Groups$transparent),
		A3($author$project$Introduction$Groups$Item, 1, '3', $author$project$Introduction$Groups$red),
		A3($author$project$Introduction$Groups$Item, 1, '1', $author$project$Introduction$Groups$red),
		A3($author$project$Introduction$Groups$Item, 1, 'B', $author$project$Introduction$Groups$blue),
		A3($author$project$Introduction$Groups$Item, 1, 'footer', $author$project$Introduction$Groups$transparent)
	]);
var $author$project$Introduction$Groups$MyMsg = $elm$core$Basics$identity;
var $author$project$Introduction$Groups$comparator = F2(
	function (item1, item2) {
		return _Utils_eq(item1.t, item2.t);
	});
var $author$project$Introduction$Groups$setter = F2(
	function (item1, item2) {
		return _Utils_update(
			item2,
			{t: item1.t});
	});
var $author$project$Introduction$Groups$config = {
	cv: F3(
		function (_v0, _v1, list) {
			return list;
		}),
	c1: {cN: $author$project$Introduction$Groups$comparator, dg: 0, ds: 1, dC: $author$project$Introduction$Groups$setter},
	dg: 0,
	ds: 2
};
var $author$project$Introduction$Groups$system = A2($author$project$DnDList$Groups$create, $author$project$Introduction$Groups$config, $elm$core$Basics$identity);
var $author$project$Introduction$Groups$initialModel = {Q: $author$project$Introduction$Groups$system.dj, au: $author$project$Introduction$Groups$preparedData};
var $author$project$Introduction$Handle$data = _List_fromArray(
	['Apples', 'Bananas', 'Cherries', 'Dates']);
var $author$project$Introduction$Handle$MyMsg = $elm$core$Basics$identity;
var $author$project$Introduction$Handle$config = {
	cv: F3(
		function (_v0, _v1, list) {
			return list;
		}),
	dg: 0,
	dk: 0,
	ds: 3
};
var $author$project$Introduction$Handle$system = A2($author$project$DnDList$create, $author$project$Introduction$Handle$config, $elm$core$Basics$identity);
var $author$project$Introduction$Handle$initialModel = {Q: $author$project$Introduction$Handle$system.dj, as: $author$project$Introduction$Handle$data};
var $author$project$Introduction$Independents$blueData = _List_fromArray(
	['A', 'B', 'C', 'D']);
var $author$project$Introduction$Independents$BlueMsg = function (a) {
	return {$: 1, a: a};
};
var $author$project$Introduction$Independents$blueConfig = {
	cv: F3(
		function (_v0, _v1, list) {
			return list;
		}),
	dg: 0,
	dk: 0,
	ds: 3
};
var $author$project$Introduction$Independents$blueSystem = A2($author$project$DnDList$create, $author$project$Introduction$Independents$blueConfig, $author$project$Introduction$Independents$BlueMsg);
var $author$project$Introduction$Independents$redData = _List_fromArray(
	['1', '2', '3', '4']);
var $author$project$Introduction$Independents$RedMsg = function (a) {
	return {$: 0, a: a};
};
var $author$project$Introduction$Independents$redConfig = {
	cv: F3(
		function (_v0, _v1, list) {
			return list;
		}),
	dg: 0,
	dk: 0,
	ds: 3
};
var $author$project$Introduction$Independents$redSystem = A2($author$project$DnDList$create, $author$project$Introduction$Independents$redConfig, $author$project$Introduction$Independents$RedMsg);
var $author$project$Introduction$Independents$initialModel = {M: $author$project$Introduction$Independents$blueSystem.dj, an: $author$project$Introduction$Independents$blueData, W: $author$project$Introduction$Independents$redSystem.dj, aw: $author$project$Introduction$Independents$redData};
var $author$project$Introduction$Keyed$data = A2(
	$elm$core$List$map,
	function (v) {
		return _Utils_Tuple2('key-' + v, v);
	},
	_List_fromArray(
		['A', 'B', 'C', 'D']));
var $author$project$Introduction$Keyed$MyMsg = $elm$core$Basics$identity;
var $author$project$Introduction$Keyed$config = {
	cv: F3(
		function (_v0, _v1, list) {
			return list;
		}),
	dg: 0,
	dk: 0,
	ds: 3
};
var $author$project$Introduction$Keyed$system = A2($author$project$DnDList$create, $author$project$Introduction$Keyed$config, $elm$core$Basics$identity);
var $author$project$Introduction$Keyed$initialModel = {Q: $author$project$Introduction$Keyed$system.dj, au: $author$project$Introduction$Keyed$data};
var $author$project$Introduction$Margins$data = _List_fromArray(
	['A', 'B', 'C', 'D']);
var $author$project$Introduction$Margins$MyMsg = $elm$core$Basics$identity;
var $author$project$Introduction$Margins$config = {
	cv: F3(
		function (_v0, _v1, list) {
			return list;
		}),
	dg: 0,
	dk: 0,
	ds: 3
};
var $author$project$Introduction$Margins$system = A2($author$project$DnDList$create, $author$project$Introduction$Margins$config, $elm$core$Basics$identity);
var $author$project$Introduction$Margins$initialModel = {Q: $author$project$Introduction$Margins$system.dj, au: $author$project$Introduction$Margins$data};
var $author$project$Introduction$Masonry$MyMsg = function (a) {
	return {$: 1, a: a};
};
var $author$project$Introduction$Masonry$config = {
	cv: F3(
		function (_v0, _v1, list) {
			return list;
		}),
	dg: 0,
	dk: 0,
	ds: 3
};
var $author$project$Introduction$Masonry$system = A2($author$project$DnDList$create, $author$project$Introduction$Masonry$config, $author$project$Introduction$Masonry$MyMsg);
var $author$project$Introduction$Masonry$initialModel = {Q: $author$project$Introduction$Masonry$system.dj, au: _List_Nil};
var $author$project$Introduction$Resize$blue = '#0696c5';
var $author$project$Introduction$Resize$green = '#768402';
var $author$project$Introduction$Resize$orange = '#e9513e';
var $author$project$Introduction$Resize$pink = '#c151a7';
var $author$project$Introduction$Resize$yellow = '#efa500';
var $author$project$Introduction$Resize$data = _List_fromArray(
	[$author$project$Introduction$Resize$yellow, $author$project$Introduction$Resize$pink, $author$project$Introduction$Resize$blue, $author$project$Introduction$Resize$green, $author$project$Introduction$Resize$orange]);
var $author$project$Introduction$Resize$MyMsg = $elm$core$Basics$identity;
var $author$project$Introduction$Resize$config = {
	cv: F3(
		function (_v0, _v1, list) {
			return list;
		}),
	dg: 0,
	dk: 0,
	ds: 3
};
var $author$project$Introduction$Resize$system = A2($author$project$DnDList$create, $author$project$Introduction$Resize$config, $elm$core$Basics$identity);
var $author$project$Introduction$Resize$initialModel = {ap: $author$project$Introduction$Resize$data, Q: $author$project$Introduction$Resize$system.dj};
var $author$project$Introduction$Root$toExample = function (slug) {
	switch (slug) {
		case 'basic':
			return $author$project$Introduction$Root$Basic($author$project$Introduction$Basic$initialModel);
		case 'basic-elm-ui':
			return $author$project$Introduction$Root$BasicElmUI($author$project$Introduction$BasicElmUI$initialModel);
		case 'handle':
			return $author$project$Introduction$Root$Handle($author$project$Introduction$Handle$initialModel);
		case 'keyed':
			return $author$project$Introduction$Root$Keyed($author$project$Introduction$Keyed$initialModel);
		case 'margins':
			return $author$project$Introduction$Root$Margins($author$project$Introduction$Margins$initialModel);
		case 'masonry':
			return $author$project$Introduction$Root$Masonry($author$project$Introduction$Masonry$initialModel);
		case 'resize':
			return $author$project$Introduction$Root$Resize($author$project$Introduction$Resize$initialModel);
		case 'independents':
			return $author$project$Introduction$Root$Independents($author$project$Introduction$Independents$initialModel);
		case 'groups':
			return $author$project$Introduction$Root$Groups($author$project$Introduction$Groups$initialModel);
		default:
			return $author$project$Introduction$Root$Basic($author$project$Introduction$Basic$initialModel);
	}
};
var $author$project$Introduction$Root$init = function (slug) {
	return _Utils_Tuple2(
		$author$project$Introduction$Root$toExample(slug),
		$author$project$Introduction$Root$commands);
};
var $elm$url$Url$Parser$Parser = $elm$core$Basics$identity;
var $elm$url$Url$Parser$State = F5(
	function (visited, unvisited, params, frag, value) {
		return {ae: frag, ai: params, X: unvisited, aB: value, al: visited};
	});
var $elm$url$Url$Parser$mapState = F2(
	function (func, _v0) {
		var value = _v0.aB;
		var frag = _v0.ae;
		var params = _v0.ai;
		var unvisited = _v0.X;
		var visited = _v0.al;
		return A5(
			$elm$url$Url$Parser$State,
			visited,
			unvisited,
			params,
			frag,
			func(value));
	});
var $elm$url$Url$Parser$map = F2(
	function (subValue, _v0) {
		var parseArg = _v0;
		return function (_v1) {
			var value = _v1.aB;
			var frag = _v1.ae;
			var params = _v1.ai;
			var unvisited = _v1.X;
			var visited = _v1.al;
			return A2(
				$elm$core$List$map,
				$elm$url$Url$Parser$mapState(value),
				parseArg(
					A5($elm$url$Url$Parser$State, visited, unvisited, params, frag, subValue)));
		};
	});
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $elm$url$Url$Parser$oneOf = function (parsers) {
	return function (state) {
		return A2(
			$elm$core$List$concatMap,
			function (_v0) {
				var parser = _v0;
				return parser(state);
			},
			parsers);
	};
};
var $elm$url$Url$Parser$getFirstMatch = function (states) {
	getFirstMatch:
	while (true) {
		if (!states.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var state = states.a;
			var rest = states.b;
			var _v1 = state.X;
			if (!_v1.b) {
				return $elm$core$Maybe$Just(state.aB);
			} else {
				if ((_v1.a === '') && (!_v1.b.b)) {
					return $elm$core$Maybe$Just(state.aB);
				} else {
					var $temp$states = rest;
					states = $temp$states;
					continue getFirstMatch;
				}
			}
		}
	}
};
var $elm$url$Url$Parser$removeFinalEmpty = function (segments) {
	if (!segments.b) {
		return _List_Nil;
	} else {
		if ((segments.a === '') && (!segments.b.b)) {
			return _List_Nil;
		} else {
			var segment = segments.a;
			var rest = segments.b;
			return A2(
				$elm$core$List$cons,
				segment,
				$elm$url$Url$Parser$removeFinalEmpty(rest));
		}
	}
};
var $elm$url$Url$Parser$preparePath = function (path) {
	var _v0 = A2($elm$core$String$split, '/', path);
	if (_v0.b && (_v0.a === '')) {
		var segments = _v0.b;
		return $elm$url$Url$Parser$removeFinalEmpty(segments);
	} else {
		var segments = _v0;
		return $elm$url$Url$Parser$removeFinalEmpty(segments);
	}
};
var $elm$url$Url$Parser$addToParametersHelp = F2(
	function (value, maybeList) {
		if (maybeList.$ === 1) {
			return $elm$core$Maybe$Just(
				_List_fromArray(
					[value]));
		} else {
			var list = maybeList.a;
			return $elm$core$Maybe$Just(
				A2($elm$core$List$cons, value, list));
		}
	});
var $elm$url$Url$percentDecode = _Url_percentDecode;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === -1) && (dict.d.$ === -1)) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.e.d.$ === -1) && (!dict.e.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.d.d.$ === -1) && (!dict.d.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === -1) && (!left.a)) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === -1) && (right.a === 1)) {
					if (right.d.$ === -1) {
						if (right.d.a === 1) {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === -1) && (dict.d.$ === -1)) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor === 1) {
			if ((lLeft.$ === -1) && (!lLeft.a)) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === -1) {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === -1) && (left.a === 1)) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === -1) && (!lLeft.a)) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === -1) {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === -1) {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === -1) {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (!_v0.$) {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $elm$url$Url$Parser$addParam = F2(
	function (segment, dict) {
		var _v0 = A2($elm$core$String$split, '=', segment);
		if ((_v0.b && _v0.b.b) && (!_v0.b.b.b)) {
			var rawKey = _v0.a;
			var _v1 = _v0.b;
			var rawValue = _v1.a;
			var _v2 = $elm$url$Url$percentDecode(rawKey);
			if (_v2.$ === 1) {
				return dict;
			} else {
				var key = _v2.a;
				var _v3 = $elm$url$Url$percentDecode(rawValue);
				if (_v3.$ === 1) {
					return dict;
				} else {
					var value = _v3.a;
					return A3(
						$elm$core$Dict$update,
						key,
						$elm$url$Url$Parser$addToParametersHelp(value),
						dict);
				}
			}
		} else {
			return dict;
		}
	});
var $elm$url$Url$Parser$prepareQuery = function (maybeQuery) {
	if (maybeQuery.$ === 1) {
		return $elm$core$Dict$empty;
	} else {
		var qry = maybeQuery.a;
		return A3(
			$elm$core$List$foldr,
			$elm$url$Url$Parser$addParam,
			$elm$core$Dict$empty,
			A2($elm$core$String$split, '&', qry));
	}
};
var $elm$url$Url$Parser$parse = F2(
	function (_v0, url) {
		var parser = _v0;
		return $elm$url$Url$Parser$getFirstMatch(
			parser(
				A5(
					$elm$url$Url$Parser$State,
					_List_Nil,
					$elm$url$Url$Parser$preparePath(url.z),
					$elm$url$Url$Parser$prepareQuery(url.b_),
					url.bE,
					$elm$core$Basics$identity)));
	});
var $author$project$Path$rootPath = 'dnd-list';
var $elm$url$Url$Parser$s = function (str) {
	return function (_v0) {
		var value = _v0.aB;
		var frag = _v0.ae;
		var params = _v0.ai;
		var unvisited = _v0.X;
		var visited = _v0.al;
		if (!unvisited.b) {
			return _List_Nil;
		} else {
			var next = unvisited.a;
			var rest = unvisited.b;
			return _Utils_eq(next, str) ? _List_fromArray(
				[
					A5(
					$elm$url$Url$Parser$State,
					A2($elm$core$List$cons, next, visited),
					rest,
					params,
					frag,
					value)
				]) : _List_Nil;
		}
	};
};
var $elm$url$Url$Parser$slash = F2(
	function (_v0, _v1) {
		var parseBefore = _v0;
		var parseAfter = _v1;
		return function (state) {
			return A2(
				$elm$core$List$concatMap,
				parseAfter,
				parseBefore(state));
		};
	});
var $elm$url$Url$Parser$custom = F2(
	function (tipe, stringToSomething) {
		return function (_v0) {
			var value = _v0.aB;
			var frag = _v0.ae;
			var params = _v0.ai;
			var unvisited = _v0.X;
			var visited = _v0.al;
			if (!unvisited.b) {
				return _List_Nil;
			} else {
				var next = unvisited.a;
				var rest = unvisited.b;
				var _v2 = stringToSomething(next);
				if (!_v2.$) {
					var nextValue = _v2.a;
					return _List_fromArray(
						[
							A5(
							$elm$url$Url$Parser$State,
							A2($elm$core$List$cons, next, visited),
							rest,
							params,
							frag,
							value(nextValue))
						]);
				} else {
					return _List_Nil;
				}
			}
		};
	});
var $author$project$Main$slug_ = A2($elm$url$Url$Parser$custom, 'SLUG', $elm$core$Maybe$Just);
var $author$project$Main$Config = function (a) {
	return {$: 3, a: a};
};
var $author$project$Main$ConfigMsg = function (a) {
	return {$: 5, a: a};
};
var $author$project$Main$stepConfig = F2(
	function (model, _v0) {
		var mo = _v0.a;
		var cmds = _v0.b;
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					s: $author$project$Main$Config(mo)
				}),
			A2($elm$core$Platform$Cmd$map, $author$project$Main$ConfigMsg, cmds));
	});
var $author$project$Main$ConfigGroups = function (a) {
	return {$: 4, a: a};
};
var $author$project$Main$ConfigGroupsMsg = function (a) {
	return {$: 6, a: a};
};
var $author$project$Main$stepConfigGroups = F2(
	function (model, _v0) {
		var mo = _v0.a;
		var cmds = _v0.b;
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					s: $author$project$Main$ConfigGroups(mo)
				}),
			A2($elm$core$Platform$Cmd$map, $author$project$Main$ConfigGroupsMsg, cmds));
	});
var $author$project$Main$Gallery = function (a) {
	return {$: 5, a: a};
};
var $author$project$Main$GalleryMsg = function (a) {
	return {$: 7, a: a};
};
var $author$project$Main$stepGallery = F2(
	function (model, _v0) {
		var mo = _v0.a;
		var cmds = _v0.b;
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					s: $author$project$Main$Gallery(mo)
				}),
			A2($elm$core$Platform$Cmd$map, $author$project$Main$GalleryMsg, cmds));
	});
var $author$project$Main$Introduction = function (a) {
	return {$: 2, a: a};
};
var $author$project$Main$IntroductionMsg = function (a) {
	return {$: 4, a: a};
};
var $author$project$Main$stepIntroduction = F2(
	function (model, _v0) {
		var mo = _v0.a;
		var cmds = _v0.b;
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					s: $author$project$Main$Introduction(mo)
				}),
			A2($elm$core$Platform$Cmd$map, $author$project$Main$IntroductionMsg, cmds));
	});
var $elm$url$Url$Parser$top = function (state) {
	return _List_fromArray(
		[state]);
};
var $author$project$Main$stepUrl = F2(
	function (url, model) {
		var parser = $elm$url$Url$Parser$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$url$Url$Parser$map,
					A2(
						$author$project$Main$stepGallery,
						model,
						$author$project$Gallery$Root$init('hanoi')),
					$elm$url$Url$Parser$top),
					A2(
					$elm$url$Url$Parser$map,
					A2(
						$author$project$Main$stepGallery,
						model,
						$author$project$Gallery$Root$init('hanoi')),
					$elm$url$Url$Parser$s($author$project$Path$rootPath)),
					A2(
					$elm$url$Url$Parser$map,
					function (slug) {
						return A2(
							$author$project$Main$stepIntroduction,
							model,
							$author$project$Introduction$Root$init(slug));
					},
					A2(
						$elm$url$Url$Parser$slash,
						$elm$url$Url$Parser$s($author$project$Path$rootPath),
						A2(
							$elm$url$Url$Parser$slash,
							$elm$url$Url$Parser$s('introduction'),
							$author$project$Main$slug_))),
					A2(
					$elm$url$Url$Parser$map,
					function (slug) {
						return A2(
							$author$project$Main$stepConfig,
							model,
							$author$project$Config$Root$init(slug));
					},
					A2(
						$elm$url$Url$Parser$slash,
						$elm$url$Url$Parser$s($author$project$Path$rootPath),
						A2(
							$elm$url$Url$Parser$slash,
							$elm$url$Url$Parser$s('config'),
							$author$project$Main$slug_))),
					A2(
					$elm$url$Url$Parser$map,
					function (slug) {
						return A2(
							$author$project$Main$stepConfigGroups,
							model,
							$author$project$ConfigGroups$Root$init(slug));
					},
					A2(
						$elm$url$Url$Parser$slash,
						$elm$url$Url$Parser$s($author$project$Path$rootPath),
						A2(
							$elm$url$Url$Parser$slash,
							$elm$url$Url$Parser$s('config-groups'),
							$author$project$Main$slug_))),
					A2(
					$elm$url$Url$Parser$map,
					function (slug) {
						return A2(
							$author$project$Main$stepGallery,
							model,
							$author$project$Gallery$Root$init(slug));
					},
					A2(
						$elm$url$Url$Parser$slash,
						$elm$url$Url$Parser$s($author$project$Path$rootPath),
						A2(
							$elm$url$Url$Parser$slash,
							$elm$url$Url$Parser$s('gallery'),
							$author$project$Main$slug_)))
				]));
		var _v0 = A2($elm$url$Url$Parser$parse, parser, url);
		if (_v0.$ === 1) {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{s: $author$project$Main$NotFound}),
				$elm$core$Platform$Cmd$none);
		} else {
			var answer = _v0.a;
			return answer;
		}
	});
var $elm$url$Url$Builder$toQueryPair = function (_v0) {
	var key = _v0.a;
	var value = _v0.b;
	return key + ('=' + value);
};
var $elm$url$Url$Builder$toQuery = function (parameters) {
	if (!parameters.b) {
		return '';
	} else {
		return '?' + A2(
			$elm$core$String$join,
			'&',
			A2($elm$core$List$map, $elm$url$Url$Builder$toQueryPair, parameters));
	}
};
var $elm$url$Url$Builder$absolute = F2(
	function (pathSegments, parameters) {
		return '/' + (A2($elm$core$String$join, '/', pathSegments) + $elm$url$Url$Builder$toQuery(parameters));
	});
var $author$project$Main$toPath = function (url) {
	return (_Utils_eq(url.z, '/' + $author$project$Path$rootPath) || _Utils_eq(url.z, '/' + ($author$project$Path$rootPath + '/'))) ? A2(
		$elm$url$Url$Builder$absolute,
		_List_fromArray(
			[$author$project$Path$rootPath, 'gallery', 'hanoi']),
		_List_Nil) : url.z;
};
var $author$project$Main$init = F3(
	function (flags, url, key) {
		return A2(
			$author$project$Main$stepUrl,
			url,
			{
				s: $author$project$Main$NotFound,
				bf: key,
				z: $author$project$Main$toPath(url)
			});
	});
var $author$project$Main$HomeMsg = function (a) {
	return {$: 3, a: a};
};
var $elm$core$Platform$Sub$map = _Platform_map;
var $author$project$Config$Root$MovementMsg = function (a) {
	return {$: 0, a: a};
};
var $author$project$Config$Root$OperationsOnDragMsg = function (a) {
	return {$: 1, a: a};
};
var $author$project$Config$Root$OperationsOnDropMsg = function (a) {
	return {$: 2, a: a};
};
var $author$project$Config$Movement$Root$FreeOnDragMsg = function (a) {
	return {$: 1, a: a};
};
var $author$project$Config$Movement$Root$FreeOnDropMsg = function (a) {
	return {$: 2, a: a};
};
var $author$project$Config$Movement$Root$HorizontalOnDragMsg = function (a) {
	return {$: 3, a: a};
};
var $author$project$Config$Movement$Root$HorizontalOnDropMsg = function (a) {
	return {$: 4, a: a};
};
var $author$project$Config$Movement$Root$VerticalOnDragMsg = function (a) {
	return {$: 5, a: a};
};
var $author$project$Config$Movement$Root$VerticalOnDropMsg = function (a) {
	return {$: 6, a: a};
};
var $author$project$Config$Movement$FreeOnDrag$subscriptions = function (model) {
	return $author$project$Config$Movement$FreeOnDrag$system.b5(model.Q);
};
var $author$project$Config$Movement$FreeOnDrop$subscriptions = function (model) {
	return $author$project$Config$Movement$FreeOnDrop$system.b5(model.Q);
};
var $author$project$Config$Movement$HorizontalOnDrag$subscriptions = function (model) {
	return $author$project$Config$Movement$HorizontalOnDrag$system.b5(model.Q);
};
var $author$project$Config$Movement$HorizontalOnDrop$subscriptions = function (model) {
	return $author$project$Config$Movement$HorizontalOnDrop$system.b5(model.Q);
};
var $author$project$Config$Movement$VerticalOnDrag$subscriptions = function (model) {
	return $author$project$Config$Movement$VerticalOnDrag$system.b5(model.Q);
};
var $author$project$Config$Movement$VerticalOnDrop$subscriptions = function (model) {
	return $author$project$Config$Movement$VerticalOnDrop$system.b5(model.Q);
};
var $author$project$Config$Movement$Root$subscriptions = function (model) {
	return $elm$core$Platform$Sub$batch(
		A2(
			$elm$core$List$map,
			function (example) {
				switch (example.$) {
					case 0:
						var mo = example.a;
						return A2(
							$elm$core$Platform$Sub$map,
							$author$project$Config$Movement$Root$FreeOnDragMsg,
							$author$project$Config$Movement$FreeOnDrag$subscriptions(mo));
					case 1:
						var mo = example.a;
						return A2(
							$elm$core$Platform$Sub$map,
							$author$project$Config$Movement$Root$FreeOnDropMsg,
							$author$project$Config$Movement$FreeOnDrop$subscriptions(mo));
					case 2:
						var mo = example.a;
						return A2(
							$elm$core$Platform$Sub$map,
							$author$project$Config$Movement$Root$HorizontalOnDragMsg,
							$author$project$Config$Movement$HorizontalOnDrag$subscriptions(mo));
					case 3:
						var mo = example.a;
						return A2(
							$elm$core$Platform$Sub$map,
							$author$project$Config$Movement$Root$HorizontalOnDropMsg,
							$author$project$Config$Movement$HorizontalOnDrop$subscriptions(mo));
					case 4:
						var mo = example.a;
						return A2(
							$elm$core$Platform$Sub$map,
							$author$project$Config$Movement$Root$VerticalOnDragMsg,
							$author$project$Config$Movement$VerticalOnDrag$subscriptions(mo));
					default:
						var mo = example.a;
						return A2(
							$elm$core$Platform$Sub$map,
							$author$project$Config$Movement$Root$VerticalOnDropMsg,
							$author$project$Config$Movement$VerticalOnDrop$subscriptions(mo));
				}
			},
			model.S));
};
var $author$project$Config$OperationsOnDrag$Root$InsertAfterMsg = function (a) {
	return {$: 1, a: a};
};
var $author$project$Config$OperationsOnDrag$Root$InsertBeforeMsg = function (a) {
	return {$: 2, a: a};
};
var $author$project$Config$OperationsOnDrag$Root$RotateMsg = function (a) {
	return {$: 3, a: a};
};
var $author$project$Config$OperationsOnDrag$Root$SwapMsg = function (a) {
	return {$: 4, a: a};
};
var $author$project$Config$OperationsOnDrag$Root$UnalteredMsg = function (a) {
	return {$: 5, a: a};
};
var $author$project$Config$OperationsOnDrag$InsertAfter$subscriptions = function (model) {
	return $author$project$Config$OperationsOnDrag$InsertAfter$system.b5(model.Q);
};
var $author$project$Config$OperationsOnDrag$InsertBefore$subscriptions = function (model) {
	return $author$project$Config$OperationsOnDrag$InsertBefore$system.b5(model.Q);
};
var $author$project$Config$OperationsOnDrag$Rotate$subscriptions = function (model) {
	return $author$project$Config$OperationsOnDrag$Rotate$system.b5(model.Q);
};
var $author$project$Config$OperationsOnDrag$Swap$subscriptions = function (model) {
	return $author$project$Config$OperationsOnDrag$Swap$system.b5(model.Q);
};
var $author$project$Config$OperationsOnDrag$Unaltered$subscriptions = function (model) {
	return $author$project$Config$OperationsOnDrag$Unaltered$system.b5(model.Q);
};
var $author$project$Config$OperationsOnDrag$Root$subscriptions = function (model) {
	return $elm$core$Platform$Sub$batch(
		A2(
			$elm$core$List$map,
			function (example) {
				switch (example.$) {
					case 0:
						var mo = example.a;
						return A2(
							$elm$core$Platform$Sub$map,
							$author$project$Config$OperationsOnDrag$Root$InsertAfterMsg,
							$author$project$Config$OperationsOnDrag$InsertAfter$subscriptions(mo));
					case 1:
						var mo = example.a;
						return A2(
							$elm$core$Platform$Sub$map,
							$author$project$Config$OperationsOnDrag$Root$InsertBeforeMsg,
							$author$project$Config$OperationsOnDrag$InsertBefore$subscriptions(mo));
					case 2:
						var mo = example.a;
						return A2(
							$elm$core$Platform$Sub$map,
							$author$project$Config$OperationsOnDrag$Root$RotateMsg,
							$author$project$Config$OperationsOnDrag$Rotate$subscriptions(mo));
					case 3:
						var mo = example.a;
						return A2(
							$elm$core$Platform$Sub$map,
							$author$project$Config$OperationsOnDrag$Root$SwapMsg,
							$author$project$Config$OperationsOnDrag$Swap$subscriptions(mo));
					default:
						var mo = example.a;
						return A2(
							$elm$core$Platform$Sub$map,
							$author$project$Config$OperationsOnDrag$Root$UnalteredMsg,
							$author$project$Config$OperationsOnDrag$Unaltered$subscriptions(mo));
				}
			},
			model.S));
};
var $author$project$Config$OperationsOnDrop$Root$InsertAfterMsg = function (a) {
	return {$: 1, a: a};
};
var $author$project$Config$OperationsOnDrop$Root$InsertBeforeMsg = function (a) {
	return {$: 2, a: a};
};
var $author$project$Config$OperationsOnDrop$Root$RotateMsg = function (a) {
	return {$: 3, a: a};
};
var $author$project$Config$OperationsOnDrop$Root$SwapMsg = function (a) {
	return {$: 4, a: a};
};
var $author$project$Config$OperationsOnDrop$Root$UnalteredMsg = function (a) {
	return {$: 5, a: a};
};
var $author$project$Config$OperationsOnDrop$InsertAfter$subscriptions = function (model) {
	return $author$project$Config$OperationsOnDrop$InsertAfter$system.b5(model.Q);
};
var $author$project$Config$OperationsOnDrop$InsertBefore$subscriptions = function (model) {
	return $author$project$Config$OperationsOnDrop$InsertBefore$system.b5(model.Q);
};
var $author$project$Config$OperationsOnDrop$Rotate$subscriptions = function (model) {
	return $author$project$Config$OperationsOnDrop$Rotate$system.b5(model.Q);
};
var $author$project$Config$OperationsOnDrop$Swap$subscriptions = function (model) {
	return $author$project$Config$OperationsOnDrop$Swap$system.b5(model.Q);
};
var $author$project$Config$OperationsOnDrop$Unaltered$subscriptions = function (model) {
	return $author$project$Config$OperationsOnDrop$Unaltered$system.b5(model.Q);
};
var $author$project$Config$OperationsOnDrop$Root$subscriptions = function (model) {
	return $elm$core$Platform$Sub$batch(
		A2(
			$elm$core$List$map,
			function (example) {
				switch (example.$) {
					case 0:
						var mo = example.a;
						return A2(
							$elm$core$Platform$Sub$map,
							$author$project$Config$OperationsOnDrop$Root$InsertAfterMsg,
							$author$project$Config$OperationsOnDrop$InsertAfter$subscriptions(mo));
					case 1:
						var mo = example.a;
						return A2(
							$elm$core$Platform$Sub$map,
							$author$project$Config$OperationsOnDrop$Root$InsertBeforeMsg,
							$author$project$Config$OperationsOnDrop$InsertBefore$subscriptions(mo));
					case 2:
						var mo = example.a;
						return A2(
							$elm$core$Platform$Sub$map,
							$author$project$Config$OperationsOnDrop$Root$RotateMsg,
							$author$project$Config$OperationsOnDrop$Rotate$subscriptions(mo));
					case 3:
						var mo = example.a;
						return A2(
							$elm$core$Platform$Sub$map,
							$author$project$Config$OperationsOnDrop$Root$SwapMsg,
							$author$project$Config$OperationsOnDrop$Swap$subscriptions(mo));
					default:
						var mo = example.a;
						return A2(
							$elm$core$Platform$Sub$map,
							$author$project$Config$OperationsOnDrop$Root$UnalteredMsg,
							$author$project$Config$OperationsOnDrop$Unaltered$subscriptions(mo));
				}
			},
			model.S));
};
var $author$project$Config$Root$subscriptions = function (model) {
	switch (model.$) {
		case 0:
			var mo = model.a;
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Config$Root$MovementMsg,
				$author$project$Config$Movement$Root$subscriptions(mo));
		case 1:
			var mo = model.a;
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Config$Root$OperationsOnDragMsg,
				$author$project$Config$OperationsOnDrag$Root$subscriptions(mo));
		default:
			var mo = model.a;
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Config$Root$OperationsOnDropMsg,
				$author$project$Config$OperationsOnDrop$Root$subscriptions(mo));
	}
};
var $author$project$ConfigGroups$Root$OperationsOnDragMsg = function (a) {
	return {$: 0, a: a};
};
var $author$project$ConfigGroups$Root$OperationsOnDropMsg = function (a) {
	return {$: 1, a: a};
};
var $author$project$ConfigGroups$OperationsOnDrag$Root$InsertAfterMsg = function (a) {
	return {$: 1, a: a};
};
var $author$project$ConfigGroups$OperationsOnDrag$Root$InsertBeforeMsg = function (a) {
	return {$: 2, a: a};
};
var $author$project$ConfigGroups$OperationsOnDrag$Root$RotateMsg = function (a) {
	return {$: 3, a: a};
};
var $author$project$ConfigGroups$OperationsOnDrag$Root$SwapMsg = function (a) {
	return {$: 4, a: a};
};
var $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$subscriptions = function (model) {
	return $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$system.b5(model.Q);
};
var $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$subscriptions = function (model) {
	return $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$system.b5(model.Q);
};
var $author$project$ConfigGroups$OperationsOnDrag$Rotate$subscriptions = function (model) {
	return $author$project$ConfigGroups$OperationsOnDrag$Rotate$system.b5(model.Q);
};
var $author$project$ConfigGroups$OperationsOnDrag$Swap$subscriptions = function (model) {
	return $author$project$ConfigGroups$OperationsOnDrag$Swap$system.b5(model.Q);
};
var $author$project$ConfigGroups$OperationsOnDrag$Root$subscriptions = function (model) {
	return $elm$core$Platform$Sub$batch(
		A2(
			$elm$core$List$map,
			function (example) {
				switch (example.$) {
					case 0:
						var mo = example.a;
						return A2(
							$elm$core$Platform$Sub$map,
							$author$project$ConfigGroups$OperationsOnDrag$Root$InsertAfterMsg,
							$author$project$ConfigGroups$OperationsOnDrag$InsertAfter$subscriptions(mo));
					case 1:
						var mo = example.a;
						return A2(
							$elm$core$Platform$Sub$map,
							$author$project$ConfigGroups$OperationsOnDrag$Root$InsertBeforeMsg,
							$author$project$ConfigGroups$OperationsOnDrag$InsertBefore$subscriptions(mo));
					case 2:
						var mo = example.a;
						return A2(
							$elm$core$Platform$Sub$map,
							$author$project$ConfigGroups$OperationsOnDrag$Root$RotateMsg,
							$author$project$ConfigGroups$OperationsOnDrag$Rotate$subscriptions(mo));
					default:
						var mo = example.a;
						return A2(
							$elm$core$Platform$Sub$map,
							$author$project$ConfigGroups$OperationsOnDrag$Root$SwapMsg,
							$author$project$ConfigGroups$OperationsOnDrag$Swap$subscriptions(mo));
				}
			},
			model.S));
};
var $author$project$ConfigGroups$OperationsOnDrop$Root$InsertAfterMsg = function (a) {
	return {$: 1, a: a};
};
var $author$project$ConfigGroups$OperationsOnDrop$Root$InsertBeforeMsg = function (a) {
	return {$: 2, a: a};
};
var $author$project$ConfigGroups$OperationsOnDrop$Root$RotateMsg = function (a) {
	return {$: 3, a: a};
};
var $author$project$ConfigGroups$OperationsOnDrop$Root$SwapMsg = function (a) {
	return {$: 4, a: a};
};
var $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$subscriptions = function (model) {
	return $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$system.b5(model.Q);
};
var $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$subscriptions = function (model) {
	return $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$system.b5(model.Q);
};
var $author$project$ConfigGroups$OperationsOnDrop$Rotate$subscriptions = function (model) {
	return $author$project$ConfigGroups$OperationsOnDrop$Rotate$system.b5(model.Q);
};
var $author$project$ConfigGroups$OperationsOnDrop$Swap$subscriptions = function (model) {
	return $author$project$ConfigGroups$OperationsOnDrop$Swap$system.b5(model.Q);
};
var $author$project$ConfigGroups$OperationsOnDrop$Root$subscriptions = function (model) {
	return $elm$core$Platform$Sub$batch(
		A2(
			$elm$core$List$map,
			function (example) {
				switch (example.$) {
					case 0:
						var mo = example.a;
						return A2(
							$elm$core$Platform$Sub$map,
							$author$project$ConfigGroups$OperationsOnDrop$Root$InsertAfterMsg,
							$author$project$ConfigGroups$OperationsOnDrop$InsertAfter$subscriptions(mo));
					case 1:
						var mo = example.a;
						return A2(
							$elm$core$Platform$Sub$map,
							$author$project$ConfigGroups$OperationsOnDrop$Root$InsertBeforeMsg,
							$author$project$ConfigGroups$OperationsOnDrop$InsertBefore$subscriptions(mo));
					case 2:
						var mo = example.a;
						return A2(
							$elm$core$Platform$Sub$map,
							$author$project$ConfigGroups$OperationsOnDrop$Root$RotateMsg,
							$author$project$ConfigGroups$OperationsOnDrop$Rotate$subscriptions(mo));
					default:
						var mo = example.a;
						return A2(
							$elm$core$Platform$Sub$map,
							$author$project$ConfigGroups$OperationsOnDrop$Root$SwapMsg,
							$author$project$ConfigGroups$OperationsOnDrop$Swap$subscriptions(mo));
				}
			},
			model.S));
};
var $author$project$ConfigGroups$Root$subscriptions = function (model) {
	if (!model.$) {
		var mo = model.a;
		return A2(
			$elm$core$Platform$Sub$map,
			$author$project$ConfigGroups$Root$OperationsOnDragMsg,
			$author$project$ConfigGroups$OperationsOnDrag$Root$subscriptions(mo));
	} else {
		var mo = model.a;
		return A2(
			$elm$core$Platform$Sub$map,
			$author$project$ConfigGroups$Root$OperationsOnDropMsg,
			$author$project$ConfigGroups$OperationsOnDrop$Root$subscriptions(mo));
	}
};
var $author$project$Gallery$Root$HanoiMsg = function (a) {
	return {$: 0, a: a};
};
var $author$project$Gallery$Root$KnightMsg = function (a) {
	return {$: 3, a: a};
};
var $author$project$Gallery$Root$ShapesMsg = function (a) {
	return {$: 2, a: a};
};
var $author$project$Gallery$Root$TaskBoardMsg = function (a) {
	return {$: 5, a: a};
};
var $author$project$Gallery$Root$TryOnMsg = function (a) {
	return {$: 4, a: a};
};
var $author$project$Gallery$Hanoi$subscriptions = function (model) {
	return $author$project$Gallery$Hanoi$system.b5(model.Q);
};
var $author$project$Gallery$Knight$subscriptions = function (model) {
	return $author$project$Gallery$Knight$system.b5(model.Q);
};
var $author$project$Gallery$Puzzle$subscriptions = function (model) {
	return $author$project$Gallery$Puzzle$system.b5(model.Q);
};
var $author$project$Gallery$Shapes$subscriptions = function (model) {
	return $author$project$Gallery$Shapes$system.b5(model.Q);
};
var $author$project$Gallery$TaskBoard$subscriptions = function (model) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				$author$project$Gallery$TaskBoard$cardSystem.b5(model.C),
				$author$project$Gallery$TaskBoard$columnSystem.b5(model.E)
			]));
};
var $author$project$Gallery$TryOn$subscriptions = function (model) {
	return $author$project$Gallery$TryOn$system.b5(model.Q);
};
var $author$project$Gallery$Root$subscriptions = function (model) {
	switch (model.$) {
		case 0:
			var mo = model.a;
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Gallery$Root$HanoiMsg,
				$author$project$Gallery$Hanoi$subscriptions(mo));
		case 1:
			var mo = model.a;
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Gallery$Root$PuzzleMsg,
				$author$project$Gallery$Puzzle$subscriptions(mo));
		case 2:
			var mo = model.a;
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Gallery$Root$ShapesMsg,
				$author$project$Gallery$Shapes$subscriptions(mo));
		case 3:
			var mo = model.a;
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Gallery$Root$KnightMsg,
				$author$project$Gallery$Knight$subscriptions(mo));
		case 4:
			var mo = model.a;
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Gallery$Root$TryOnMsg,
				$author$project$Gallery$TryOn$subscriptions(mo));
		default:
			var mo = model.a;
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Gallery$Root$TaskBoardMsg,
				$author$project$Gallery$TaskBoard$subscriptions(mo));
	}
};
var $author$project$Home$subscriptions = function (model) {
	return $elm$core$Platform$Sub$none;
};
var $author$project$Introduction$Root$BasicElmUIMsg = function (a) {
	return {$: 1, a: a};
};
var $author$project$Introduction$Root$BasicMsg = function (a) {
	return {$: 0, a: a};
};
var $author$project$Introduction$Root$GroupsMsg = function (a) {
	return {$: 8, a: a};
};
var $author$project$Introduction$Root$HandleMsg = function (a) {
	return {$: 2, a: a};
};
var $author$project$Introduction$Root$IndependentsMsg = function (a) {
	return {$: 7, a: a};
};
var $author$project$Introduction$Root$KeyedMsg = function (a) {
	return {$: 3, a: a};
};
var $author$project$Introduction$Root$MarginsMsg = function (a) {
	return {$: 4, a: a};
};
var $author$project$Introduction$Root$ResizeMsg = function (a) {
	return {$: 6, a: a};
};
var $author$project$Introduction$Basic$subscriptions = function (model) {
	return $author$project$Introduction$Basic$system.b5(model.Q);
};
var $author$project$Introduction$BasicElmUI$subscriptions = function (model) {
	return $author$project$Introduction$BasicElmUI$system.b5(model.Q);
};
var $author$project$Introduction$Groups$subscriptions = function (model) {
	return $author$project$Introduction$Groups$system.b5(model.Q);
};
var $author$project$Introduction$Handle$subscriptions = function (model) {
	return $author$project$Introduction$Handle$system.b5(model.Q);
};
var $author$project$Introduction$Independents$subscriptions = function (model) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				$author$project$Introduction$Independents$redSystem.b5(model.W),
				$author$project$Introduction$Independents$blueSystem.b5(model.M)
			]));
};
var $author$project$Introduction$Keyed$subscriptions = function (model) {
	return $author$project$Introduction$Keyed$system.b5(model.Q);
};
var $author$project$Introduction$Margins$subscriptions = function (model) {
	return $author$project$Introduction$Margins$system.b5(model.Q);
};
var $author$project$Introduction$Masonry$subscriptions = function (model) {
	return $author$project$Introduction$Masonry$system.b5(model.Q);
};
var $author$project$Introduction$Resize$subscriptions = function (model) {
	return $author$project$Introduction$Resize$system.b5(model.Q);
};
var $author$project$Introduction$Root$subscriptions = function (model) {
	switch (model.$) {
		case 0:
			var mo = model.a;
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Introduction$Root$BasicMsg,
				$author$project$Introduction$Basic$subscriptions(mo));
		case 1:
			var mo = model.a;
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Introduction$Root$BasicElmUIMsg,
				$author$project$Introduction$BasicElmUI$subscriptions(mo));
		case 2:
			var mo = model.a;
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Introduction$Root$HandleMsg,
				$author$project$Introduction$Handle$subscriptions(mo));
		case 3:
			var mo = model.a;
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Introduction$Root$KeyedMsg,
				$author$project$Introduction$Keyed$subscriptions(mo));
		case 4:
			var mo = model.a;
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Introduction$Root$MarginsMsg,
				$author$project$Introduction$Margins$subscriptions(mo));
		case 5:
			var mo = model.a;
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Introduction$Root$MasonryMsg,
				$author$project$Introduction$Masonry$subscriptions(mo));
		case 6:
			var mo = model.a;
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Introduction$Root$ResizeMsg,
				$author$project$Introduction$Resize$subscriptions(mo));
		case 7:
			var mo = model.a;
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Introduction$Root$IndependentsMsg,
				$author$project$Introduction$Independents$subscriptions(mo));
		default:
			var mo = model.a;
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Introduction$Root$GroupsMsg,
				$author$project$Introduction$Groups$subscriptions(mo));
	}
};
var $author$project$Main$subscriptions = function (model) {
	var _v0 = model.s;
	switch (_v0.$) {
		case 0:
			return $elm$core$Platform$Sub$none;
		case 1:
			var mo = _v0.a;
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Main$HomeMsg,
				$author$project$Home$subscriptions(mo));
		case 2:
			var mo = _v0.a;
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Main$IntroductionMsg,
				$author$project$Introduction$Root$subscriptions(mo));
		case 3:
			var mo = _v0.a;
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Main$ConfigMsg,
				$author$project$Config$Root$subscriptions(mo));
		case 4:
			var mo = _v0.a;
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Main$ConfigGroupsMsg,
				$author$project$ConfigGroups$Root$subscriptions(mo));
		default:
			var mo = _v0.a;
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Main$GalleryMsg,
				$author$project$Gallery$Root$subscriptions(mo));
	}
};
var $author$project$Main$NoOp = {$: 0};
var $elm$browser$Browser$Dom$getViewportOf = _Browser_getViewportOf;
var $elm$browser$Browser$Dom$setViewportOf = _Browser_setViewportOf;
var $author$project$Main$jumpToTop = function (id) {
	return A2(
		$elm$core$Task$attempt,
		function (_v1) {
			return $author$project$Main$NoOp;
		},
		A2(
			$elm$core$Task$andThen,
			function (_v0) {
				return A3($elm$browser$Browser$Dom$setViewportOf, id, 0, 0);
			},
			$elm$browser$Browser$Dom$getViewportOf(id)));
};
var $elm$browser$Browser$Navigation$load = _Browser_load;
var $elm$browser$Browser$Navigation$pushUrl = _Browser_pushUrl;
var $author$project$Main$Home = function (a) {
	return {$: 1, a: a};
};
var $author$project$Main$stepHome = F2(
	function (model, _v0) {
		var mo = _v0.a;
		var cmds = _v0.b;
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					s: $author$project$Main$Home(mo)
				}),
			A2($elm$core$Platform$Cmd$map, $author$project$Main$HomeMsg, cmds));
	});
var $elm$url$Url$addPort = F2(
	function (maybePort, starter) {
		if (maybePort.$ === 1) {
			return starter;
		} else {
			var port_ = maybePort.a;
			return starter + (':' + $elm$core$String$fromInt(port_));
		}
	});
var $elm$url$Url$addPrefixed = F3(
	function (prefix, maybeSegment, starter) {
		if (maybeSegment.$ === 1) {
			return starter;
		} else {
			var segment = maybeSegment.a;
			return _Utils_ap(
				starter,
				_Utils_ap(prefix, segment));
		}
	});
var $elm$url$Url$toString = function (url) {
	var http = function () {
		var _v0 = url.bZ;
		if (!_v0) {
			return 'http://';
		} else {
			return 'https://';
		}
	}();
	return A3(
		$elm$url$Url$addPrefixed,
		'#',
		url.bE,
		A3(
			$elm$url$Url$addPrefixed,
			'?',
			url.b_,
			_Utils_ap(
				A2(
					$elm$url$Url$addPort,
					url.bW,
					_Utils_ap(http, url.bI)),
				url.z)));
};
var $author$project$Config$Root$stepMovement = function (_v0) {
	var mo = _v0.a;
	var cmds = _v0.b;
	return _Utils_Tuple2(
		$author$project$Config$Root$Movement(mo),
		A2($elm$core$Platform$Cmd$map, $author$project$Config$Root$MovementMsg, cmds));
};
var $author$project$Config$Root$stepOperationsOnDrag = function (_v0) {
	var mo = _v0.a;
	var cmds = _v0.b;
	return _Utils_Tuple2(
		$author$project$Config$Root$OperationsOnDrag(mo),
		A2($elm$core$Platform$Cmd$map, $author$project$Config$Root$OperationsOnDragMsg, cmds));
};
var $author$project$Config$Root$stepOperationsOnDrop = function (_v0) {
	var mo = _v0.a;
	var cmds = _v0.b;
	return _Utils_Tuple2(
		$author$project$Config$Root$OperationsOnDrop(mo),
		A2($elm$core$Platform$Cmd$map, $author$project$Config$Root$OperationsOnDropMsg, cmds));
};
var $author$project$Config$Movement$Root$stepFreeOnDrag = function (_v0) {
	var mo = _v0.a;
	var cmds = _v0.b;
	return _Utils_Tuple2(
		$author$project$Config$Movement$Root$FreeOnDrag(mo),
		A2($elm$core$Platform$Cmd$map, $author$project$Config$Movement$Root$FreeOnDragMsg, cmds));
};
var $author$project$Config$Movement$Root$stepFreeOnDrop = function (_v0) {
	var mo = _v0.a;
	var cmds = _v0.b;
	return _Utils_Tuple2(
		$author$project$Config$Movement$Root$FreeOnDrop(mo),
		A2($elm$core$Platform$Cmd$map, $author$project$Config$Movement$Root$FreeOnDropMsg, cmds));
};
var $author$project$Config$Movement$Root$stepHorizontalOnDrag = function (_v0) {
	var mo = _v0.a;
	var cmds = _v0.b;
	return _Utils_Tuple2(
		$author$project$Config$Movement$Root$HorizontalOnDrag(mo),
		A2($elm$core$Platform$Cmd$map, $author$project$Config$Movement$Root$HorizontalOnDragMsg, cmds));
};
var $author$project$Config$Movement$Root$stepHorizontalOnDrop = function (_v0) {
	var mo = _v0.a;
	var cmds = _v0.b;
	return _Utils_Tuple2(
		$author$project$Config$Movement$Root$HorizontalOnDrop(mo),
		A2($elm$core$Platform$Cmd$map, $author$project$Config$Movement$Root$HorizontalOnDropMsg, cmds));
};
var $author$project$Config$Movement$Root$stepVerticalOnDrag = function (_v0) {
	var mo = _v0.a;
	var cmds = _v0.b;
	return _Utils_Tuple2(
		$author$project$Config$Movement$Root$VerticalOnDrag(mo),
		A2($elm$core$Platform$Cmd$map, $author$project$Config$Movement$Root$VerticalOnDragMsg, cmds));
};
var $author$project$Config$Movement$Root$stepVerticalOnDrop = function (_v0) {
	var mo = _v0.a;
	var cmds = _v0.b;
	return _Utils_Tuple2(
		$author$project$Config$Movement$Root$VerticalOnDrop(mo),
		A2($elm$core$Platform$Cmd$map, $author$project$Config$Movement$Root$VerticalOnDropMsg, cmds));
};
var $elm$core$List$unzip = function (pairs) {
	var step = F2(
		function (_v0, _v1) {
			var x = _v0.a;
			var y = _v0.b;
			var xs = _v1.a;
			var ys = _v1.b;
			return _Utils_Tuple2(
				A2($elm$core$List$cons, x, xs),
				A2($elm$core$List$cons, y, ys));
		});
	return A3(
		$elm$core$List$foldr,
		step,
		_Utils_Tuple2(_List_Nil, _List_Nil),
		pairs);
};
var $author$project$Config$Movement$FreeOnDrag$update = F2(
	function (message, model) {
		if (!message.$) {
			var msg = message.a;
			var _v1 = A3($author$project$Config$Movement$FreeOnDrag$system.b9, msg, model.Q, model.au);
			var dnd = _v1.a;
			var items = _v1.b;
			var affected = function () {
				var _v2 = $author$project$Config$Movement$FreeOnDrag$system.be(dnd);
				if (!_v2.$) {
					var dragIndex = _v2.a.a9;
					var dropIndex = _v2.a.cV;
					return (!_Utils_eq(dragIndex, dropIndex)) ? A2(
						$elm$core$List$cons,
						dragIndex,
						A2($elm$core$List$cons, dropIndex, model.K)) : model.K;
				} else {
					return model.K;
				}
			}();
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{K: affected, Q: dnd, au: items}),
				$author$project$Config$Movement$FreeOnDrag$system.cM(model.Q));
		} else {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{K: _List_Nil}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Config$Movement$FreeOnDrop$update = F2(
	function (message, model) {
		if (!message.$) {
			var msg = message.a;
			var _v1 = A3($author$project$Config$Movement$FreeOnDrop$system.b9, msg, model.Q, model.au);
			var dnd = _v1.a;
			var items = _v1.b;
			var affected = function () {
				var _v2 = $author$project$Config$Movement$FreeOnDrop$system.be(dnd);
				if (!_v2.$) {
					var dragIndex = _v2.a.a9;
					var dropIndex = _v2.a.cV;
					return (!_Utils_eq(dragIndex, dropIndex)) ? _List_fromArray(
						[dragIndex, dropIndex]) : _List_Nil;
				} else {
					return model.K;
				}
			}();
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{K: affected, Q: dnd, au: items}),
				$author$project$Config$Movement$FreeOnDrop$system.cM(model.Q));
		} else {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{K: _List_Nil}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Config$Movement$HorizontalOnDrag$update = F2(
	function (message, model) {
		if (!message.$) {
			var msg = message.a;
			var _v1 = A3($author$project$Config$Movement$HorizontalOnDrag$system.b9, msg, model.Q, model.au);
			var dnd = _v1.a;
			var items = _v1.b;
			var affected = function () {
				var _v2 = $author$project$Config$Movement$HorizontalOnDrag$system.be(dnd);
				if (!_v2.$) {
					var dragIndex = _v2.a.a9;
					var dropIndex = _v2.a.cV;
					return (!_Utils_eq(dragIndex, dropIndex)) ? A2(
						$elm$core$List$cons,
						dragIndex,
						A2($elm$core$List$cons, dropIndex, model.K)) : model.K;
				} else {
					return model.K;
				}
			}();
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{K: affected, Q: dnd, au: items}),
				$author$project$Config$Movement$HorizontalOnDrag$system.cM(model.Q));
		} else {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{K: _List_Nil}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Config$Movement$HorizontalOnDrop$update = F2(
	function (message, model) {
		if (!message.$) {
			var msg = message.a;
			var _v1 = A3($author$project$Config$Movement$HorizontalOnDrop$system.b9, msg, model.Q, model.au);
			var dnd = _v1.a;
			var items = _v1.b;
			var affected = function () {
				var _v2 = $author$project$Config$Movement$HorizontalOnDrop$system.be(dnd);
				if (!_v2.$) {
					var dragIndex = _v2.a.a9;
					var dropIndex = _v2.a.cV;
					return (!_Utils_eq(dragIndex, dropIndex)) ? _List_fromArray(
						[dragIndex, dropIndex]) : _List_Nil;
				} else {
					return model.K;
				}
			}();
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{K: affected, Q: dnd, au: items}),
				$author$project$Config$Movement$HorizontalOnDrop$system.cM(model.Q));
		} else {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{K: _List_Nil}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Config$Movement$VerticalOnDrag$update = F2(
	function (message, model) {
		if (!message.$) {
			var msg = message.a;
			var _v1 = A3($author$project$Config$Movement$VerticalOnDrag$system.b9, msg, model.Q, model.au);
			var dnd = _v1.a;
			var items = _v1.b;
			var affected = function () {
				var _v2 = $author$project$Config$Movement$VerticalOnDrag$system.be(dnd);
				if (!_v2.$) {
					var dragIndex = _v2.a.a9;
					var dropIndex = _v2.a.cV;
					return (!_Utils_eq(dragIndex, dropIndex)) ? A2(
						$elm$core$List$cons,
						dragIndex,
						A2($elm$core$List$cons, dropIndex, model.K)) : model.K;
				} else {
					return model.K;
				}
			}();
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{K: affected, Q: dnd, au: items}),
				$author$project$Config$Movement$VerticalOnDrag$system.cM(model.Q));
		} else {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{K: _List_Nil}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Config$Movement$VerticalOnDrop$update = F2(
	function (message, model) {
		if (!message.$) {
			var msg = message.a;
			var _v1 = A3($author$project$Config$Movement$VerticalOnDrop$system.b9, msg, model.Q, model.au);
			var dnd = _v1.a;
			var items = _v1.b;
			var affected = function () {
				var _v2 = $author$project$Config$Movement$VerticalOnDrop$system.be(dnd);
				if (!_v2.$) {
					var dragIndex = _v2.a.a9;
					var dropIndex = _v2.a.cV;
					return (!_Utils_eq(dragIndex, dropIndex)) ? _List_fromArray(
						[dragIndex, dropIndex]) : _List_Nil;
				} else {
					return model.K;
				}
			}();
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{K: affected, Q: dnd, au: items}),
				$author$project$Config$Movement$VerticalOnDrop$system.cM(model.Q));
		} else {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{K: _List_Nil}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Config$Movement$Root$update = F2(
	function (message, model) {
		if (!message.$) {
			var id = message.a;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{at: id}),
				$elm$core$Platform$Cmd$none);
		} else {
			return function (_v2) {
				var examples = _v2.a;
				var cmds = _v2.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{S: examples}),
					$elm$core$Platform$Cmd$batch(cmds));
			}(
				$elm$core$List$unzip(
					A2(
						$elm$core$List$map,
						function (example) {
							var _v1 = _Utils_Tuple2(message, example);
							_v1$6:
							while (true) {
								switch (_v1.b.$) {
									case 0:
										if (_v1.a.$ === 1) {
											var msg = _v1.a.a;
											var mo = _v1.b.a;
											return $author$project$Config$Movement$Root$stepFreeOnDrag(
												A2($author$project$Config$Movement$FreeOnDrag$update, msg, mo));
										} else {
											break _v1$6;
										}
									case 1:
										if (_v1.a.$ === 2) {
											var msg = _v1.a.a;
											var mo = _v1.b.a;
											return $author$project$Config$Movement$Root$stepFreeOnDrop(
												A2($author$project$Config$Movement$FreeOnDrop$update, msg, mo));
										} else {
											break _v1$6;
										}
									case 2:
										if (_v1.a.$ === 3) {
											var msg = _v1.a.a;
											var mo = _v1.b.a;
											return $author$project$Config$Movement$Root$stepHorizontalOnDrag(
												A2($author$project$Config$Movement$HorizontalOnDrag$update, msg, mo));
										} else {
											break _v1$6;
										}
									case 3:
										if (_v1.a.$ === 4) {
											var msg = _v1.a.a;
											var mo = _v1.b.a;
											return $author$project$Config$Movement$Root$stepHorizontalOnDrop(
												A2($author$project$Config$Movement$HorizontalOnDrop$update, msg, mo));
										} else {
											break _v1$6;
										}
									case 4:
										if (_v1.a.$ === 5) {
											var msg = _v1.a.a;
											var mo = _v1.b.a;
											return $author$project$Config$Movement$Root$stepVerticalOnDrag(
												A2($author$project$Config$Movement$VerticalOnDrag$update, msg, mo));
										} else {
											break _v1$6;
										}
									default:
										if (_v1.a.$ === 6) {
											var msg = _v1.a.a;
											var mo = _v1.b.a;
											return $author$project$Config$Movement$Root$stepVerticalOnDrop(
												A2($author$project$Config$Movement$VerticalOnDrop$update, msg, mo));
										} else {
											break _v1$6;
										}
								}
							}
							return _Utils_Tuple2(example, $elm$core$Platform$Cmd$none);
						},
						model.S)));
		}
	});
var $author$project$Config$OperationsOnDrag$Root$stepInsertAfter = function (_v0) {
	var mo = _v0.a;
	var cmds = _v0.b;
	return _Utils_Tuple2(
		$author$project$Config$OperationsOnDrag$Root$InsertAfter(mo),
		A2($elm$core$Platform$Cmd$map, $author$project$Config$OperationsOnDrag$Root$InsertAfterMsg, cmds));
};
var $author$project$Config$OperationsOnDrag$Root$stepInsertBefore = function (_v0) {
	var mo = _v0.a;
	var cmds = _v0.b;
	return _Utils_Tuple2(
		$author$project$Config$OperationsOnDrag$Root$InsertBefore(mo),
		A2($elm$core$Platform$Cmd$map, $author$project$Config$OperationsOnDrag$Root$InsertBeforeMsg, cmds));
};
var $author$project$Config$OperationsOnDrag$Root$stepRotate = function (_v0) {
	var mo = _v0.a;
	var cmds = _v0.b;
	return _Utils_Tuple2(
		$author$project$Config$OperationsOnDrag$Root$Rotate(mo),
		A2($elm$core$Platform$Cmd$map, $author$project$Config$OperationsOnDrag$Root$RotateMsg, cmds));
};
var $author$project$Config$OperationsOnDrag$Root$stepSwap = function (_v0) {
	var mo = _v0.a;
	var cmds = _v0.b;
	return _Utils_Tuple2(
		$author$project$Config$OperationsOnDrag$Root$Swap(mo),
		A2($elm$core$Platform$Cmd$map, $author$project$Config$OperationsOnDrag$Root$SwapMsg, cmds));
};
var $author$project$Config$OperationsOnDrag$Root$stepUnaltered = function (_v0) {
	var mo = _v0.a;
	var cmds = _v0.b;
	return _Utils_Tuple2(
		$author$project$Config$OperationsOnDrag$Root$Unaltered(mo),
		A2($elm$core$Platform$Cmd$map, $author$project$Config$OperationsOnDrag$Root$UnalteredMsg, cmds));
};
var $author$project$Config$OperationsOnDrag$InsertAfter$update = F2(
	function (message, model) {
		if (!message.$) {
			var msg = message.a;
			var _v1 = A3($author$project$Config$OperationsOnDrag$InsertAfter$system.b9, msg, model.Q, model.au);
			var dnd = _v1.a;
			var items = _v1.b;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{Q: dnd, au: items}),
				$author$project$Config$OperationsOnDrag$InsertAfter$system.cM(model.Q));
		} else {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						au: A2(
							$elm$core$List$map,
							function (_v2) {
								var value = _v2.aB;
								return A2($author$project$Config$OperationsOnDrag$InsertAfter$Item, value, $author$project$Config$OperationsOnDrag$InsertAfter$baseColor);
							},
							model.au)
					}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Config$OperationsOnDrag$InsertBefore$update = F2(
	function (message, model) {
		if (!message.$) {
			var msg = message.a;
			var _v1 = A3($author$project$Config$OperationsOnDrag$InsertBefore$system.b9, msg, model.Q, model.au);
			var dnd = _v1.a;
			var items = _v1.b;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{Q: dnd, au: items}),
				$author$project$Config$OperationsOnDrag$InsertBefore$system.cM(model.Q));
		} else {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						au: A2(
							$elm$core$List$map,
							function (_v2) {
								var value = _v2.aB;
								return A2($author$project$Config$OperationsOnDrag$InsertBefore$Item, value, $author$project$Config$OperationsOnDrag$InsertBefore$baseColor);
							},
							model.au)
					}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Config$OperationsOnDrag$Rotate$update = F2(
	function (message, model) {
		if (!message.$) {
			var msg = message.a;
			var _v1 = A3($author$project$Config$OperationsOnDrag$Rotate$system.b9, msg, model.Q, model.au);
			var dnd = _v1.a;
			var items = _v1.b;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{Q: dnd, au: items}),
				$author$project$Config$OperationsOnDrag$Rotate$system.cM(model.Q));
		} else {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						au: A2(
							$elm$core$List$map,
							function (_v2) {
								var value = _v2.aB;
								return A2($author$project$Config$OperationsOnDrag$Rotate$Item, value, $author$project$Config$OperationsOnDrag$Rotate$baseColor);
							},
							model.au)
					}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Config$OperationsOnDrag$Swap$update = F2(
	function (message, model) {
		if (!message.$) {
			var msg = message.a;
			var _v1 = A3($author$project$Config$OperationsOnDrag$Swap$system.b9, msg, model.Q, model.au);
			var dnd = _v1.a;
			var items = _v1.b;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{Q: dnd, au: items}),
				$author$project$Config$OperationsOnDrag$Swap$system.cM(model.Q));
		} else {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						au: A2(
							$elm$core$List$map,
							function (_v2) {
								var value = _v2.aB;
								return A2($author$project$Config$OperationsOnDrag$Swap$Item, value, $author$project$Config$OperationsOnDrag$Swap$baseColor);
							},
							model.au)
					}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Config$OperationsOnDrag$Unaltered$update = F2(
	function (message, model) {
		if (!message.$) {
			var msg = message.a;
			var _v1 = A3($author$project$Config$OperationsOnDrag$Unaltered$system.b9, msg, model.Q, model.au);
			var dnd = _v1.a;
			var items = _v1.b;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{Q: dnd, au: items}),
				$author$project$Config$OperationsOnDrag$Unaltered$system.cM(model.Q));
		} else {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						au: A2(
							$elm$core$List$map,
							function (_v2) {
								var value = _v2.aB;
								return A2($author$project$Config$OperationsOnDrag$Unaltered$Item, value, $author$project$Config$OperationsOnDrag$Unaltered$baseColor);
							},
							model.au)
					}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Config$OperationsOnDrag$Root$update = F2(
	function (message, model) {
		if (!message.$) {
			var id = message.a;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{at: id}),
				$elm$core$Platform$Cmd$none);
		} else {
			return function (_v2) {
				var examples = _v2.a;
				var cmds = _v2.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{S: examples}),
					$elm$core$Platform$Cmd$batch(cmds));
			}(
				$elm$core$List$unzip(
					A2(
						$elm$core$List$map,
						function (example) {
							var _v1 = _Utils_Tuple2(message, example);
							_v1$5:
							while (true) {
								switch (_v1.b.$) {
									case 0:
										if (_v1.a.$ === 1) {
											var msg = _v1.a.a;
											var mo = _v1.b.a;
											return $author$project$Config$OperationsOnDrag$Root$stepInsertAfter(
												A2($author$project$Config$OperationsOnDrag$InsertAfter$update, msg, mo));
										} else {
											break _v1$5;
										}
									case 1:
										if (_v1.a.$ === 2) {
											var msg = _v1.a.a;
											var mo = _v1.b.a;
											return $author$project$Config$OperationsOnDrag$Root$stepInsertBefore(
												A2($author$project$Config$OperationsOnDrag$InsertBefore$update, msg, mo));
										} else {
											break _v1$5;
										}
									case 2:
										if (_v1.a.$ === 3) {
											var msg = _v1.a.a;
											var mo = _v1.b.a;
											return $author$project$Config$OperationsOnDrag$Root$stepRotate(
												A2($author$project$Config$OperationsOnDrag$Rotate$update, msg, mo));
										} else {
											break _v1$5;
										}
									case 3:
										if (_v1.a.$ === 4) {
											var msg = _v1.a.a;
											var mo = _v1.b.a;
											return $author$project$Config$OperationsOnDrag$Root$stepSwap(
												A2($author$project$Config$OperationsOnDrag$Swap$update, msg, mo));
										} else {
											break _v1$5;
										}
									default:
										if (_v1.a.$ === 5) {
											var msg = _v1.a.a;
											var mo = _v1.b.a;
											return $author$project$Config$OperationsOnDrag$Root$stepUnaltered(
												A2($author$project$Config$OperationsOnDrag$Unaltered$update, msg, mo));
										} else {
											break _v1$5;
										}
								}
							}
							return _Utils_Tuple2(example, $elm$core$Platform$Cmd$none);
						},
						model.S)));
		}
	});
var $author$project$Config$OperationsOnDrop$Root$stepInsertAfter = function (_v0) {
	var mo = _v0.a;
	var cmds = _v0.b;
	return _Utils_Tuple2(
		$author$project$Config$OperationsOnDrop$Root$InsertAfter(mo),
		A2($elm$core$Platform$Cmd$map, $author$project$Config$OperationsOnDrop$Root$InsertAfterMsg, cmds));
};
var $author$project$Config$OperationsOnDrop$Root$stepInsertBefore = function (_v0) {
	var mo = _v0.a;
	var cmds = _v0.b;
	return _Utils_Tuple2(
		$author$project$Config$OperationsOnDrop$Root$InsertBefore(mo),
		A2($elm$core$Platform$Cmd$map, $author$project$Config$OperationsOnDrop$Root$InsertBeforeMsg, cmds));
};
var $author$project$Config$OperationsOnDrop$Root$stepRotate = function (_v0) {
	var mo = _v0.a;
	var cmds = _v0.b;
	return _Utils_Tuple2(
		$author$project$Config$OperationsOnDrop$Root$Rotate(mo),
		A2($elm$core$Platform$Cmd$map, $author$project$Config$OperationsOnDrop$Root$RotateMsg, cmds));
};
var $author$project$Config$OperationsOnDrop$Root$stepSwap = function (_v0) {
	var mo = _v0.a;
	var cmds = _v0.b;
	return _Utils_Tuple2(
		$author$project$Config$OperationsOnDrop$Root$Swap(mo),
		A2($elm$core$Platform$Cmd$map, $author$project$Config$OperationsOnDrop$Root$SwapMsg, cmds));
};
var $author$project$Config$OperationsOnDrop$Root$stepUnaltered = function (_v0) {
	var mo = _v0.a;
	var cmds = _v0.b;
	return _Utils_Tuple2(
		$author$project$Config$OperationsOnDrop$Root$Unaltered(mo),
		A2($elm$core$Platform$Cmd$map, $author$project$Config$OperationsOnDrop$Root$UnalteredMsg, cmds));
};
var $author$project$Config$OperationsOnDrop$InsertAfter$update = F2(
	function (message, model) {
		if (!message.$) {
			var msg = message.a;
			var _v1 = A3($author$project$Config$OperationsOnDrop$InsertAfter$system.b9, msg, model.Q, model.au);
			var dnd = _v1.a;
			var items = _v1.b;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{Q: dnd, au: items}),
				$author$project$Config$OperationsOnDrop$InsertAfter$system.cM(model.Q));
		} else {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						au: A2(
							$elm$core$List$map,
							function (_v2) {
								var value = _v2.aB;
								return A2($author$project$Config$OperationsOnDrop$InsertAfter$Item, value, $author$project$Config$OperationsOnDrop$InsertAfter$baseColor);
							},
							model.au)
					}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Config$OperationsOnDrop$InsertBefore$update = F2(
	function (message, model) {
		if (!message.$) {
			var msg = message.a;
			var _v1 = A3($author$project$Config$OperationsOnDrop$InsertBefore$system.b9, msg, model.Q, model.au);
			var dnd = _v1.a;
			var items = _v1.b;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{Q: dnd, au: items}),
				$author$project$Config$OperationsOnDrop$InsertBefore$system.cM(model.Q));
		} else {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						au: A2(
							$elm$core$List$map,
							function (_v2) {
								var value = _v2.aB;
								return A2($author$project$Config$OperationsOnDrop$InsertBefore$Item, value, $author$project$Config$OperationsOnDrop$InsertBefore$baseColor);
							},
							model.au)
					}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Config$OperationsOnDrop$Rotate$update = F2(
	function (message, model) {
		if (!message.$) {
			var msg = message.a;
			var _v1 = A3($author$project$Config$OperationsOnDrop$Rotate$system.b9, msg, model.Q, model.au);
			var dnd = _v1.a;
			var items = _v1.b;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{Q: dnd, au: items}),
				$author$project$Config$OperationsOnDrop$Rotate$system.cM(model.Q));
		} else {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						au: A2(
							$elm$core$List$map,
							function (_v2) {
								var value = _v2.aB;
								return A2($author$project$Config$OperationsOnDrop$Rotate$Item, value, $author$project$Config$OperationsOnDrop$Rotate$baseColor);
							},
							model.au)
					}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Config$OperationsOnDrop$Swap$update = F2(
	function (message, model) {
		if (!message.$) {
			var msg = message.a;
			var _v1 = A3($author$project$Config$OperationsOnDrop$Swap$system.b9, msg, model.Q, model.au);
			var dnd = _v1.a;
			var items = _v1.b;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{Q: dnd, au: items}),
				$author$project$Config$OperationsOnDrop$Swap$system.cM(model.Q));
		} else {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						au: A2(
							$elm$core$List$map,
							function (_v2) {
								var value = _v2.aB;
								return A2($author$project$Config$OperationsOnDrop$Swap$Item, value, $author$project$Config$OperationsOnDrop$Swap$baseColor);
							},
							model.au)
					}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Config$OperationsOnDrop$Unaltered$update = F2(
	function (message, model) {
		if (!message.$) {
			var msg = message.a;
			var _v1 = A3($author$project$Config$OperationsOnDrop$Unaltered$system.b9, msg, model.Q, model.au);
			var dnd = _v1.a;
			var items = _v1.b;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{Q: dnd, au: items}),
				$author$project$Config$OperationsOnDrop$Unaltered$system.cM(model.Q));
		} else {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						au: A2(
							$elm$core$List$map,
							function (_v2) {
								var value = _v2.aB;
								return A2($author$project$Config$OperationsOnDrop$Unaltered$Item, value, $author$project$Config$OperationsOnDrop$Unaltered$baseColor);
							},
							model.au)
					}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Config$OperationsOnDrop$Root$update = F2(
	function (message, model) {
		if (!message.$) {
			var id = message.a;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{at: id}),
				$elm$core$Platform$Cmd$none);
		} else {
			return function (_v2) {
				var examples = _v2.a;
				var cmds = _v2.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{S: examples}),
					$elm$core$Platform$Cmd$batch(cmds));
			}(
				$elm$core$List$unzip(
					A2(
						$elm$core$List$map,
						function (example) {
							var _v1 = _Utils_Tuple2(message, example);
							_v1$5:
							while (true) {
								switch (_v1.b.$) {
									case 0:
										if (_v1.a.$ === 1) {
											var msg = _v1.a.a;
											var mo = _v1.b.a;
											return $author$project$Config$OperationsOnDrop$Root$stepInsertAfter(
												A2($author$project$Config$OperationsOnDrop$InsertAfter$update, msg, mo));
										} else {
											break _v1$5;
										}
									case 1:
										if (_v1.a.$ === 2) {
											var msg = _v1.a.a;
											var mo = _v1.b.a;
											return $author$project$Config$OperationsOnDrop$Root$stepInsertBefore(
												A2($author$project$Config$OperationsOnDrop$InsertBefore$update, msg, mo));
										} else {
											break _v1$5;
										}
									case 2:
										if (_v1.a.$ === 3) {
											var msg = _v1.a.a;
											var mo = _v1.b.a;
											return $author$project$Config$OperationsOnDrop$Root$stepRotate(
												A2($author$project$Config$OperationsOnDrop$Rotate$update, msg, mo));
										} else {
											break _v1$5;
										}
									case 3:
										if (_v1.a.$ === 4) {
											var msg = _v1.a.a;
											var mo = _v1.b.a;
											return $author$project$Config$OperationsOnDrop$Root$stepSwap(
												A2($author$project$Config$OperationsOnDrop$Swap$update, msg, mo));
										} else {
											break _v1$5;
										}
									default:
										if (_v1.a.$ === 5) {
											var msg = _v1.a.a;
											var mo = _v1.b.a;
											return $author$project$Config$OperationsOnDrop$Root$stepUnaltered(
												A2($author$project$Config$OperationsOnDrop$Unaltered$update, msg, mo));
										} else {
											break _v1$5;
										}
								}
							}
							return _Utils_Tuple2(example, $elm$core$Platform$Cmd$none);
						},
						model.S)));
		}
	});
var $author$project$Config$Root$update = F2(
	function (message, model) {
		var _v0 = _Utils_Tuple2(message, model);
		_v0$3:
		while (true) {
			switch (_v0.a.$) {
				case 0:
					if (!_v0.b.$) {
						var msg = _v0.a.a;
						var mo = _v0.b.a;
						return $author$project$Config$Root$stepMovement(
							A2($author$project$Config$Movement$Root$update, msg, mo));
					} else {
						break _v0$3;
					}
				case 1:
					if (_v0.b.$ === 1) {
						var msg = _v0.a.a;
						var mo = _v0.b.a;
						return $author$project$Config$Root$stepOperationsOnDrag(
							A2($author$project$Config$OperationsOnDrag$Root$update, msg, mo));
					} else {
						break _v0$3;
					}
				default:
					if (_v0.b.$ === 2) {
						var msg = _v0.a.a;
						var mo = _v0.b.a;
						return $author$project$Config$Root$stepOperationsOnDrop(
							A2($author$project$Config$OperationsOnDrop$Root$update, msg, mo));
					} else {
						break _v0$3;
					}
			}
		}
		return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	});
var $author$project$ConfigGroups$Root$stepOperationsOnDrag = function (_v0) {
	var mo = _v0.a;
	var cmds = _v0.b;
	return _Utils_Tuple2(
		$author$project$ConfigGroups$Root$OperationsOnDrag(mo),
		A2($elm$core$Platform$Cmd$map, $author$project$ConfigGroups$Root$OperationsOnDragMsg, cmds));
};
var $author$project$ConfigGroups$Root$stepOperationsOnDrop = function (_v0) {
	var mo = _v0.a;
	var cmds = _v0.b;
	return _Utils_Tuple2(
		$author$project$ConfigGroups$Root$OperationsOnDrop(mo),
		A2($elm$core$Platform$Cmd$map, $author$project$ConfigGroups$Root$OperationsOnDropMsg, cmds));
};
var $author$project$ConfigGroups$OperationsOnDrag$Root$stepInsertAfter = function (_v0) {
	var mo = _v0.a;
	var cmds = _v0.b;
	return _Utils_Tuple2(
		$author$project$ConfigGroups$OperationsOnDrag$Root$InsertAfter(mo),
		A2($elm$core$Platform$Cmd$map, $author$project$ConfigGroups$OperationsOnDrag$Root$InsertAfterMsg, cmds));
};
var $author$project$ConfigGroups$OperationsOnDrag$Root$stepInsertBefore = function (_v0) {
	var mo = _v0.a;
	var cmds = _v0.b;
	return _Utils_Tuple2(
		$author$project$ConfigGroups$OperationsOnDrag$Root$InsertBefore(mo),
		A2($elm$core$Platform$Cmd$map, $author$project$ConfigGroups$OperationsOnDrag$Root$InsertBeforeMsg, cmds));
};
var $author$project$ConfigGroups$OperationsOnDrag$Root$stepRotate = function (_v0) {
	var mo = _v0.a;
	var cmds = _v0.b;
	return _Utils_Tuple2(
		$author$project$ConfigGroups$OperationsOnDrag$Root$Rotate(mo),
		A2($elm$core$Platform$Cmd$map, $author$project$ConfigGroups$OperationsOnDrag$Root$RotateMsg, cmds));
};
var $author$project$ConfigGroups$OperationsOnDrag$Root$stepSwap = function (_v0) {
	var mo = _v0.a;
	var cmds = _v0.b;
	return _Utils_Tuple2(
		$author$project$ConfigGroups$OperationsOnDrag$Root$Swap(mo),
		A2($elm$core$Platform$Cmd$map, $author$project$ConfigGroups$OperationsOnDrag$Root$SwapMsg, cmds));
};
var $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$update = F2(
	function (message, model) {
		if (!message.$) {
			var msg = message.a;
			var _v1 = A3($author$project$ConfigGroups$OperationsOnDrag$InsertAfter$system.b9, msg, model.Q, model.au);
			var dnd = _v1.a;
			var items = _v1.b;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{Q: dnd, au: items}),
				$author$project$ConfigGroups$OperationsOnDrag$InsertAfter$system.cM(model.Q));
		} else {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						au: A2(
							$elm$core$List$map,
							function (_v2) {
								var group = _v2.t;
								var value = _v2.aB;
								return A3($author$project$ConfigGroups$OperationsOnDrag$InsertAfter$Item, group, value, $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$baseColor);
							},
							model.au)
					}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$update = F2(
	function (message, model) {
		if (!message.$) {
			var msg = message.a;
			var _v1 = A3($author$project$ConfigGroups$OperationsOnDrag$InsertBefore$system.b9, msg, model.Q, model.au);
			var dnd = _v1.a;
			var items = _v1.b;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{Q: dnd, au: items}),
				$author$project$ConfigGroups$OperationsOnDrag$InsertBefore$system.cM(model.Q));
		} else {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						au: A2(
							$elm$core$List$map,
							function (_v2) {
								var group = _v2.t;
								var value = _v2.aB;
								return A3($author$project$ConfigGroups$OperationsOnDrag$InsertBefore$Item, group, value, $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$baseColor);
							},
							model.au)
					}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$ConfigGroups$OperationsOnDrag$Rotate$update = F2(
	function (message, model) {
		if (!message.$) {
			var msg = message.a;
			var _v1 = A3($author$project$ConfigGroups$OperationsOnDrag$Rotate$system.b9, msg, model.Q, model.au);
			var dnd = _v1.a;
			var items = _v1.b;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{Q: dnd, au: items}),
				$author$project$ConfigGroups$OperationsOnDrag$Rotate$system.cM(model.Q));
		} else {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						au: A2(
							$elm$core$List$map,
							function (_v2) {
								var group = _v2.t;
								var value = _v2.aB;
								return A3($author$project$ConfigGroups$OperationsOnDrag$Rotate$Item, group, value, $author$project$ConfigGroups$OperationsOnDrag$Rotate$baseColor);
							},
							model.au)
					}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$ConfigGroups$OperationsOnDrag$Swap$update = F2(
	function (message, model) {
		if (!message.$) {
			var msg = message.a;
			var _v1 = A3($author$project$ConfigGroups$OperationsOnDrag$Swap$system.b9, msg, model.Q, model.au);
			var dnd = _v1.a;
			var items = _v1.b;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{Q: dnd, au: items}),
				$author$project$ConfigGroups$OperationsOnDrag$Swap$system.cM(model.Q));
		} else {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						au: A2(
							$elm$core$List$map,
							function (_v2) {
								var group = _v2.t;
								var value = _v2.aB;
								return A3($author$project$ConfigGroups$OperationsOnDrag$Swap$Item, group, value, $author$project$ConfigGroups$OperationsOnDrag$Swap$baseColor);
							},
							model.au)
					}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$ConfigGroups$OperationsOnDrag$Root$update = F2(
	function (message, model) {
		if (!message.$) {
			var id = message.a;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{at: id}),
				$elm$core$Platform$Cmd$none);
		} else {
			return function (_v2) {
				var examples = _v2.a;
				var cmds = _v2.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{S: examples}),
					$elm$core$Platform$Cmd$batch(cmds));
			}(
				$elm$core$List$unzip(
					A2(
						$elm$core$List$map,
						function (example) {
							var _v1 = _Utils_Tuple2(message, example);
							_v1$4:
							while (true) {
								switch (_v1.b.$) {
									case 0:
										if (_v1.a.$ === 1) {
											var msg = _v1.a.a;
											var mo = _v1.b.a;
											return $author$project$ConfigGroups$OperationsOnDrag$Root$stepInsertAfter(
												A2($author$project$ConfigGroups$OperationsOnDrag$InsertAfter$update, msg, mo));
										} else {
											break _v1$4;
										}
									case 1:
										if (_v1.a.$ === 2) {
											var msg = _v1.a.a;
											var mo = _v1.b.a;
											return $author$project$ConfigGroups$OperationsOnDrag$Root$stepInsertBefore(
												A2($author$project$ConfigGroups$OperationsOnDrag$InsertBefore$update, msg, mo));
										} else {
											break _v1$4;
										}
									case 2:
										if (_v1.a.$ === 3) {
											var msg = _v1.a.a;
											var mo = _v1.b.a;
											return $author$project$ConfigGroups$OperationsOnDrag$Root$stepRotate(
												A2($author$project$ConfigGroups$OperationsOnDrag$Rotate$update, msg, mo));
										} else {
											break _v1$4;
										}
									default:
										if (_v1.a.$ === 4) {
											var msg = _v1.a.a;
											var mo = _v1.b.a;
											return $author$project$ConfigGroups$OperationsOnDrag$Root$stepSwap(
												A2($author$project$ConfigGroups$OperationsOnDrag$Swap$update, msg, mo));
										} else {
											break _v1$4;
										}
								}
							}
							return _Utils_Tuple2(example, $elm$core$Platform$Cmd$none);
						},
						model.S)));
		}
	});
var $author$project$ConfigGroups$OperationsOnDrop$Root$stepInsertAfter = function (_v0) {
	var mo = _v0.a;
	var cmds = _v0.b;
	return _Utils_Tuple2(
		$author$project$ConfigGroups$OperationsOnDrop$Root$InsertAfter(mo),
		A2($elm$core$Platform$Cmd$map, $author$project$ConfigGroups$OperationsOnDrop$Root$InsertAfterMsg, cmds));
};
var $author$project$ConfigGroups$OperationsOnDrop$Root$stepInsertBefore = function (_v0) {
	var mo = _v0.a;
	var cmds = _v0.b;
	return _Utils_Tuple2(
		$author$project$ConfigGroups$OperationsOnDrop$Root$InsertBefore(mo),
		A2($elm$core$Platform$Cmd$map, $author$project$ConfigGroups$OperationsOnDrop$Root$InsertBeforeMsg, cmds));
};
var $author$project$ConfigGroups$OperationsOnDrop$Root$stepRotate = function (_v0) {
	var mo = _v0.a;
	var cmds = _v0.b;
	return _Utils_Tuple2(
		$author$project$ConfigGroups$OperationsOnDrop$Root$Rotate(mo),
		A2($elm$core$Platform$Cmd$map, $author$project$ConfigGroups$OperationsOnDrop$Root$RotateMsg, cmds));
};
var $author$project$ConfigGroups$OperationsOnDrop$Root$stepSwap = function (_v0) {
	var mo = _v0.a;
	var cmds = _v0.b;
	return _Utils_Tuple2(
		$author$project$ConfigGroups$OperationsOnDrop$Root$Swap(mo),
		A2($elm$core$Platform$Cmd$map, $author$project$ConfigGroups$OperationsOnDrop$Root$SwapMsg, cmds));
};
var $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$update = F2(
	function (message, model) {
		if (!message.$) {
			var msg = message.a;
			var _v1 = A3($author$project$ConfigGroups$OperationsOnDrop$InsertAfter$system.b9, msg, model.Q, model.au);
			var dnd = _v1.a;
			var items = _v1.b;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{Q: dnd, au: items}),
				$author$project$ConfigGroups$OperationsOnDrop$InsertAfter$system.cM(model.Q));
		} else {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						au: A2(
							$elm$core$List$map,
							function (_v2) {
								var group = _v2.t;
								var value = _v2.aB;
								return A3($author$project$ConfigGroups$OperationsOnDrop$InsertAfter$Item, group, value, $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$baseColor);
							},
							model.au)
					}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$update = F2(
	function (message, model) {
		if (!message.$) {
			var msg = message.a;
			var _v1 = A3($author$project$ConfigGroups$OperationsOnDrop$InsertBefore$system.b9, msg, model.Q, model.au);
			var dnd = _v1.a;
			var items = _v1.b;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{Q: dnd, au: items}),
				$author$project$ConfigGroups$OperationsOnDrop$InsertBefore$system.cM(model.Q));
		} else {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						au: A2(
							$elm$core$List$map,
							function (_v2) {
								var group = _v2.t;
								var value = _v2.aB;
								return A3($author$project$ConfigGroups$OperationsOnDrop$InsertBefore$Item, group, value, $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$baseColor);
							},
							model.au)
					}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$ConfigGroups$OperationsOnDrop$Rotate$update = F2(
	function (message, model) {
		if (!message.$) {
			var msg = message.a;
			var _v1 = A3($author$project$ConfigGroups$OperationsOnDrop$Rotate$system.b9, msg, model.Q, model.au);
			var dnd = _v1.a;
			var items = _v1.b;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{Q: dnd, au: items}),
				$author$project$ConfigGroups$OperationsOnDrop$Rotate$system.cM(model.Q));
		} else {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						au: A2(
							$elm$core$List$map,
							function (_v2) {
								var group = _v2.t;
								var value = _v2.aB;
								return A3($author$project$ConfigGroups$OperationsOnDrop$Rotate$Item, group, value, $author$project$ConfigGroups$OperationsOnDrop$Rotate$baseColor);
							},
							model.au)
					}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$ConfigGroups$OperationsOnDrop$Swap$update = F2(
	function (message, model) {
		if (!message.$) {
			var msg = message.a;
			var _v1 = A3($author$project$ConfigGroups$OperationsOnDrop$Swap$system.b9, msg, model.Q, model.au);
			var dnd = _v1.a;
			var items = _v1.b;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{Q: dnd, au: items}),
				$author$project$ConfigGroups$OperationsOnDrop$Swap$system.cM(model.Q));
		} else {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						au: A2(
							$elm$core$List$map,
							function (_v2) {
								var group = _v2.t;
								var value = _v2.aB;
								return A3($author$project$ConfigGroups$OperationsOnDrop$Swap$Item, group, value, $author$project$ConfigGroups$OperationsOnDrop$Swap$baseColor);
							},
							model.au)
					}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$ConfigGroups$OperationsOnDrop$Root$update = F2(
	function (message, model) {
		if (!message.$) {
			var id = message.a;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{at: id}),
				$elm$core$Platform$Cmd$none);
		} else {
			return function (_v2) {
				var examples = _v2.a;
				var cmds = _v2.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{S: examples}),
					$elm$core$Platform$Cmd$batch(cmds));
			}(
				$elm$core$List$unzip(
					A2(
						$elm$core$List$map,
						function (example) {
							var _v1 = _Utils_Tuple2(message, example);
							_v1$4:
							while (true) {
								switch (_v1.b.$) {
									case 0:
										if (_v1.a.$ === 1) {
											var msg = _v1.a.a;
											var mo = _v1.b.a;
											return $author$project$ConfigGroups$OperationsOnDrop$Root$stepInsertAfter(
												A2($author$project$ConfigGroups$OperationsOnDrop$InsertAfter$update, msg, mo));
										} else {
											break _v1$4;
										}
									case 1:
										if (_v1.a.$ === 2) {
											var msg = _v1.a.a;
											var mo = _v1.b.a;
											return $author$project$ConfigGroups$OperationsOnDrop$Root$stepInsertBefore(
												A2($author$project$ConfigGroups$OperationsOnDrop$InsertBefore$update, msg, mo));
										} else {
											break _v1$4;
										}
									case 2:
										if (_v1.a.$ === 3) {
											var msg = _v1.a.a;
											var mo = _v1.b.a;
											return $author$project$ConfigGroups$OperationsOnDrop$Root$stepRotate(
												A2($author$project$ConfigGroups$OperationsOnDrop$Rotate$update, msg, mo));
										} else {
											break _v1$4;
										}
									default:
										if (_v1.a.$ === 4) {
											var msg = _v1.a.a;
											var mo = _v1.b.a;
											return $author$project$ConfigGroups$OperationsOnDrop$Root$stepSwap(
												A2($author$project$ConfigGroups$OperationsOnDrop$Swap$update, msg, mo));
										} else {
											break _v1$4;
										}
								}
							}
							return _Utils_Tuple2(example, $elm$core$Platform$Cmd$none);
						},
						model.S)));
		}
	});
var $author$project$ConfigGroups$Root$update = F2(
	function (message, model) {
		var _v0 = _Utils_Tuple2(message, model);
		_v0$2:
		while (true) {
			if (!_v0.a.$) {
				if (!_v0.b.$) {
					var msg = _v0.a.a;
					var mo = _v0.b.a;
					return $author$project$ConfigGroups$Root$stepOperationsOnDrag(
						A2($author$project$ConfigGroups$OperationsOnDrag$Root$update, msg, mo));
				} else {
					break _v0$2;
				}
			} else {
				if (_v0.b.$ === 1) {
					var msg = _v0.a.a;
					var mo = _v0.b.a;
					return $author$project$ConfigGroups$Root$stepOperationsOnDrop(
						A2($author$project$ConfigGroups$OperationsOnDrop$Root$update, msg, mo));
				} else {
					break _v0$2;
				}
			}
		}
		return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	});
var $author$project$Gallery$Root$stepHanoi = function (_v0) {
	var mo = _v0.a;
	var cmds = _v0.b;
	return _Utils_Tuple2(
		$author$project$Gallery$Root$Hanoi(mo),
		A2($elm$core$Platform$Cmd$map, $author$project$Gallery$Root$HanoiMsg, cmds));
};
var $author$project$Gallery$Root$stepKnight = function (_v0) {
	var mo = _v0.a;
	var cmds = _v0.b;
	return _Utils_Tuple2(
		$author$project$Gallery$Root$Knight(mo),
		A2($elm$core$Platform$Cmd$map, $author$project$Gallery$Root$KnightMsg, cmds));
};
var $author$project$Gallery$Root$stepPuzzle = function (_v0) {
	var mo = _v0.a;
	var cmds = _v0.b;
	return _Utils_Tuple2(
		$author$project$Gallery$Root$Puzzle(mo),
		A2($elm$core$Platform$Cmd$map, $author$project$Gallery$Root$PuzzleMsg, cmds));
};
var $author$project$Gallery$Root$stepShapes = function (_v0) {
	var mo = _v0.a;
	var cmds = _v0.b;
	return _Utils_Tuple2(
		$author$project$Gallery$Root$Shapes(mo),
		A2($elm$core$Platform$Cmd$map, $author$project$Gallery$Root$ShapesMsg, cmds));
};
var $author$project$Gallery$Root$stepTaskBoard = function (_v0) {
	var mo = _v0.a;
	var cmds = _v0.b;
	return _Utils_Tuple2(
		$author$project$Gallery$Root$TaskBoard(mo),
		A2($elm$core$Platform$Cmd$map, $author$project$Gallery$Root$TaskBoardMsg, cmds));
};
var $author$project$Gallery$Root$stepTryOn = function (_v0) {
	var mo = _v0.a;
	var cmds = _v0.b;
	return _Utils_Tuple2(
		$author$project$Gallery$Root$TryOn(mo),
		A2($elm$core$Platform$Cmd$map, $author$project$Gallery$Root$TryOnMsg, cmds));
};
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			$elm$core$List$any,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, isOkay),
			list);
	});
var $author$project$Gallery$Hanoi$update = F2(
	function (message, model) {
		var msg = message;
		var _v1 = A3($author$project$Gallery$Hanoi$system.b9, msg, model.Q, model.P);
		var dnd = _v1.a;
		var disks = _v1.b;
		var solved = A2(
			$elm$core$List$all,
			function (disk) {
				return disk.a1 === 'transparent';
			},
			A2($elm$core$List$take, 3, disks));
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{P: disks, Q: dnd, aL: solved}),
			$author$project$Gallery$Hanoi$system.cM(model.Q));
	});
var $author$project$Gallery$Knight$update = F2(
	function (message, model) {
		var msg = message;
		var _v1 = A3($author$project$Gallery$Knight$system.b9, msg, model.Q, model.az);
		var dnd = _v1.a;
		var squares = _v1.b;
		var solved = $elm$core$List$length(
			A2(
				$elm$core$List$filter,
				function (square) {
					return square === '×';
				},
				squares)) === 24;
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{Q: dnd, aL: solved, az: squares}),
			$author$project$Gallery$Knight$system.cM(model.Q));
	});
var $elm$core$Basics$modBy = _Basics_modBy;
var $elm$core$List$sortBy = _List_sortBy;
var $author$project$Gallery$Puzzle$update = F2(
	function (message, model) {
		if (!message.$) {
			var shuffled = message.a;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						au: A2(
							$elm$core$List$sortBy,
							function ($) {
								return $.t;
							},
							A2(
								$elm$core$List$indexedMap,
								F2(
									function (i, _v1) {
										var value = _v1.aB;
										var color = _v1.aV;
										var _v2 = A2($elm$core$Basics$modBy, 4, i);
										switch (_v2) {
											case 0:
												return A3($author$project$Gallery$Puzzle$Item, 0, value, color);
											case 1:
												return A3($author$project$Gallery$Puzzle$Item, 1, value, color);
											case 2:
												return A3($author$project$Gallery$Puzzle$Item, 2, value, color);
											case 3:
												return A3($author$project$Gallery$Puzzle$Item, 3, value, color);
											default:
												return A3($author$project$Gallery$Puzzle$Item, 3, value, color);
										}
									}),
								shuffled))
					}),
				$elm$core$Platform$Cmd$none);
		} else {
			var msg = message.a;
			var _v3 = A3($author$project$Gallery$Puzzle$system.b9, msg, model.Q, model.au);
			var dnd = _v3.a;
			var items = _v3.b;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{Q: dnd, au: items}),
				$author$project$Gallery$Puzzle$system.cM(model.Q));
		}
	});
var $author$project$Gallery$Shapes$update = F2(
	function (message, model) {
		var msg = message;
		var _v1 = A3($author$project$Gallery$Shapes$system.b9, msg, model.Q, model.au);
		var dnd = _v1.a;
		var items = _v1.b;
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{Q: dnd, au: items}),
			$author$project$Gallery$Shapes$system.cM(model.Q));
	});
var $author$project$Gallery$TaskBoard$gatherByActivity = function (cards) {
	return A3(
		$elm$core$List$foldr,
		F2(
			function (x, acc) {
				if (!acc.b) {
					return _List_fromArray(
						[
							_List_fromArray(
							[x])
						]);
				} else {
					if (acc.a.b) {
						var _v1 = acc.a;
						var y = _v1.a;
						var restOfGroup = _v1.b;
						var groups = acc.b;
						return _Utils_eq(x.r, y.r) ? A2(
							$elm$core$List$cons,
							A2(
								$elm$core$List$cons,
								x,
								A2($elm$core$List$cons, y, restOfGroup)),
							groups) : A2(
							$elm$core$List$cons,
							_List_fromArray(
								[x]),
							acc);
					} else {
						return acc;
					}
				}
			}),
		_List_Nil,
		cards);
};
var $author$project$Gallery$TaskBoard$update = F2(
	function (message, model) {
		if (!message.$) {
			var msg = message.a;
			var _v1 = A3($author$project$Gallery$TaskBoard$cardSystem.b9, msg, model.C, model.D);
			var cardDnD = _v1.a;
			var cards = _v1.b;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{C: cardDnD, D: cards}),
				$author$project$Gallery$TaskBoard$cardSystem.cM(model.C));
		} else {
			var msg = message.a;
			var _v2 = A3(
				$author$project$Gallery$TaskBoard$columnSystem.b9,
				msg,
				model.E,
				$author$project$Gallery$TaskBoard$gatherByActivity(model.D));
			var columnDnD = _v2.a;
			var columns = _v2.b;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						D: $elm$core$List$concat(columns),
						E: columnDnD
					}),
				$author$project$Gallery$TaskBoard$columnSystem.cM(model.E));
		}
	});
var $author$project$Gallery$TryOn$update = F2(
	function (message, model) {
		var msg = message;
		var _v1 = A3($author$project$Gallery$TryOn$system.b9, msg, model.Q, model.au);
		var dnd = _v1.a;
		var items = _v1.b;
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{Q: dnd, au: items}),
			$author$project$Gallery$TryOn$system.cM(model.Q));
	});
var $author$project$Gallery$Root$update = F2(
	function (message, model) {
		var _v0 = _Utils_Tuple2(message, model);
		_v0$6:
		while (true) {
			switch (_v0.a.$) {
				case 0:
					if (!_v0.b.$) {
						var msg = _v0.a.a;
						var mo = _v0.b.a;
						return $author$project$Gallery$Root$stepHanoi(
							A2($author$project$Gallery$Hanoi$update, msg, mo));
					} else {
						break _v0$6;
					}
				case 1:
					if (_v0.b.$ === 1) {
						var msg = _v0.a.a;
						var mo = _v0.b.a;
						return $author$project$Gallery$Root$stepPuzzle(
							A2($author$project$Gallery$Puzzle$update, msg, mo));
					} else {
						break _v0$6;
					}
				case 2:
					if (_v0.b.$ === 2) {
						var msg = _v0.a.a;
						var mo = _v0.b.a;
						return $author$project$Gallery$Root$stepShapes(
							A2($author$project$Gallery$Shapes$update, msg, mo));
					} else {
						break _v0$6;
					}
				case 3:
					if (_v0.b.$ === 3) {
						var msg = _v0.a.a;
						var mo = _v0.b.a;
						return $author$project$Gallery$Root$stepKnight(
							A2($author$project$Gallery$Knight$update, msg, mo));
					} else {
						break _v0$6;
					}
				case 4:
					if (_v0.b.$ === 4) {
						var msg = _v0.a.a;
						var mo = _v0.b.a;
						return $author$project$Gallery$Root$stepTryOn(
							A2($author$project$Gallery$TryOn$update, msg, mo));
					} else {
						break _v0$6;
					}
				default:
					if (_v0.b.$ === 5) {
						var msg = _v0.a.a;
						var mo = _v0.b.a;
						return $author$project$Gallery$Root$stepTaskBoard(
							A2($author$project$Gallery$TaskBoard$update, msg, mo));
					} else {
						break _v0$6;
					}
			}
		}
		return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	});
var $author$project$Home$update = F2(
	function (message, model) {
		return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	});
var $author$project$Introduction$Root$stepBasic = function (_v0) {
	var mo = _v0.a;
	var cmds = _v0.b;
	return _Utils_Tuple2(
		$author$project$Introduction$Root$Basic(mo),
		A2($elm$core$Platform$Cmd$map, $author$project$Introduction$Root$BasicMsg, cmds));
};
var $author$project$Introduction$Root$stepBasicElmUI = function (_v0) {
	var mo = _v0.a;
	var cmds = _v0.b;
	return _Utils_Tuple2(
		$author$project$Introduction$Root$BasicElmUI(mo),
		A2($elm$core$Platform$Cmd$map, $author$project$Introduction$Root$BasicElmUIMsg, cmds));
};
var $author$project$Introduction$Root$stepGroups = function (_v0) {
	var mo = _v0.a;
	var cmds = _v0.b;
	return _Utils_Tuple2(
		$author$project$Introduction$Root$Groups(mo),
		A2($elm$core$Platform$Cmd$map, $author$project$Introduction$Root$GroupsMsg, cmds));
};
var $author$project$Introduction$Root$stepHandle = function (_v0) {
	var mo = _v0.a;
	var cmds = _v0.b;
	return _Utils_Tuple2(
		$author$project$Introduction$Root$Handle(mo),
		A2($elm$core$Platform$Cmd$map, $author$project$Introduction$Root$HandleMsg, cmds));
};
var $author$project$Introduction$Root$stepIndependents = function (_v0) {
	var mo = _v0.a;
	var cmds = _v0.b;
	return _Utils_Tuple2(
		$author$project$Introduction$Root$Independents(mo),
		A2($elm$core$Platform$Cmd$map, $author$project$Introduction$Root$IndependentsMsg, cmds));
};
var $author$project$Introduction$Root$stepKeyed = function (_v0) {
	var mo = _v0.a;
	var cmds = _v0.b;
	return _Utils_Tuple2(
		$author$project$Introduction$Root$Keyed(mo),
		A2($elm$core$Platform$Cmd$map, $author$project$Introduction$Root$KeyedMsg, cmds));
};
var $author$project$Introduction$Root$stepMargins = function (_v0) {
	var mo = _v0.a;
	var cmds = _v0.b;
	return _Utils_Tuple2(
		$author$project$Introduction$Root$Margins(mo),
		A2($elm$core$Platform$Cmd$map, $author$project$Introduction$Root$MarginsMsg, cmds));
};
var $author$project$Introduction$Root$stepMasonry = function (_v0) {
	var mo = _v0.a;
	var cmds = _v0.b;
	return _Utils_Tuple2(
		$author$project$Introduction$Root$Masonry(mo),
		A2($elm$core$Platform$Cmd$map, $author$project$Introduction$Root$MasonryMsg, cmds));
};
var $author$project$Introduction$Root$stepResize = function (_v0) {
	var mo = _v0.a;
	var cmds = _v0.b;
	return _Utils_Tuple2(
		$author$project$Introduction$Root$Resize(mo),
		A2($elm$core$Platform$Cmd$map, $author$project$Introduction$Root$ResizeMsg, cmds));
};
var $author$project$Introduction$Basic$update = F2(
	function (message, model) {
		var msg = message;
		var _v1 = A3($author$project$Introduction$Basic$system.b9, msg, model.Q, model.au);
		var dnd = _v1.a;
		var items = _v1.b;
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{Q: dnd, au: items}),
			$author$project$Introduction$Basic$system.cM(model.Q));
	});
var $author$project$Introduction$BasicElmUI$update = F2(
	function (message, model) {
		var msg = message;
		var _v1 = A3($author$project$Introduction$BasicElmUI$system.b9, msg, model.Q, model.au);
		var dnd = _v1.a;
		var items = _v1.b;
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{Q: dnd, au: items}),
			$author$project$Introduction$BasicElmUI$system.cM(model.Q));
	});
var $author$project$Introduction$Groups$update = F2(
	function (message, model) {
		var msg = message;
		var _v1 = A3($author$project$Introduction$Groups$system.b9, msg, model.Q, model.au);
		var dnd = _v1.a;
		var items = _v1.b;
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{Q: dnd, au: items}),
			$author$project$Introduction$Groups$system.cM(model.Q));
	});
var $author$project$Introduction$Handle$update = F2(
	function (message, model) {
		var msg = message;
		var _v1 = A3($author$project$Introduction$Handle$system.b9, msg, model.Q, model.as);
		var dnd = _v1.a;
		var fruits = _v1.b;
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{Q: dnd, as: fruits}),
			$author$project$Introduction$Handle$system.cM(model.Q));
	});
var $author$project$Introduction$Independents$update = F2(
	function (message, model) {
		if (!message.$) {
			var msg = message.a;
			var _v1 = A3($author$project$Introduction$Independents$redSystem.b9, msg, model.W, model.aw);
			var redDnD = _v1.a;
			var reds = _v1.b;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{W: redDnD, aw: reds}),
				$author$project$Introduction$Independents$redSystem.cM(model.W));
		} else {
			var msg = message.a;
			var _v2 = A3($author$project$Introduction$Independents$blueSystem.b9, msg, model.M, model.an);
			var blueDnD = _v2.a;
			var blues = _v2.b;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{M: blueDnD, an: blues}),
				$author$project$Introduction$Independents$blueSystem.cM(model.M));
		}
	});
var $author$project$Introduction$Keyed$update = F2(
	function (message, model) {
		var msg = message;
		var _v1 = A3($author$project$Introduction$Keyed$system.b9, msg, model.Q, model.au);
		var dnd = _v1.a;
		var items = _v1.b;
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{Q: dnd, au: items}),
			$author$project$Introduction$Keyed$system.cM(model.Q));
	});
var $author$project$Introduction$Margins$update = F2(
	function (message, model) {
		var msg = message;
		var _v1 = A3($author$project$Introduction$Margins$system.b9, msg, model.Q, model.au);
		var dnd = _v1.a;
		var items = _v1.b;
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{Q: dnd, au: items}),
			$author$project$Introduction$Margins$system.cM(model.Q));
	});
var $author$project$Introduction$Masonry$Item = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Introduction$Masonry$update = F2(
	function (message, model) {
		if (!message.$) {
			var widths = message.a;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						au: A3(
							$elm$core$List$map2,
							F2(
								function (color, width) {
									return A2($author$project$Introduction$Masonry$Item, color, width);
								}),
							$author$project$Introduction$Masonry$colors,
							widths)
					}),
				$elm$core$Platform$Cmd$none);
		} else {
			var msg = message.a;
			var _v1 = A3($author$project$Introduction$Masonry$system.b9, msg, model.Q, model.au);
			var dnd = _v1.a;
			var items = _v1.b;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{Q: dnd, au: items}),
				$author$project$Introduction$Masonry$system.cM(model.Q));
		}
	});
var $author$project$Introduction$Resize$update = F2(
	function (message, model) {
		var msg = message;
		var _v1 = A3($author$project$Introduction$Resize$system.b9, msg, model.Q, model.ap);
		var dnd = _v1.a;
		var colors = _v1.b;
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{ap: colors, Q: dnd}),
			$author$project$Introduction$Resize$system.cM(model.Q));
	});
var $author$project$Introduction$Root$update = F2(
	function (message, model) {
		var _v0 = _Utils_Tuple2(message, model);
		_v0$9:
		while (true) {
			switch (_v0.a.$) {
				case 0:
					if (!_v0.b.$) {
						var msg = _v0.a.a;
						var mo = _v0.b.a;
						return $author$project$Introduction$Root$stepBasic(
							A2($author$project$Introduction$Basic$update, msg, mo));
					} else {
						break _v0$9;
					}
				case 1:
					if (_v0.b.$ === 1) {
						var msg = _v0.a.a;
						var mo = _v0.b.a;
						return $author$project$Introduction$Root$stepBasicElmUI(
							A2($author$project$Introduction$BasicElmUI$update, msg, mo));
					} else {
						break _v0$9;
					}
				case 2:
					if (_v0.b.$ === 2) {
						var msg = _v0.a.a;
						var mo = _v0.b.a;
						return $author$project$Introduction$Root$stepHandle(
							A2($author$project$Introduction$Handle$update, msg, mo));
					} else {
						break _v0$9;
					}
				case 3:
					if (_v0.b.$ === 3) {
						var msg = _v0.a.a;
						var mo = _v0.b.a;
						return $author$project$Introduction$Root$stepKeyed(
							A2($author$project$Introduction$Keyed$update, msg, mo));
					} else {
						break _v0$9;
					}
				case 4:
					if (_v0.b.$ === 4) {
						var msg = _v0.a.a;
						var mo = _v0.b.a;
						return $author$project$Introduction$Root$stepMargins(
							A2($author$project$Introduction$Margins$update, msg, mo));
					} else {
						break _v0$9;
					}
				case 5:
					if (_v0.b.$ === 5) {
						var msg = _v0.a.a;
						var mo = _v0.b.a;
						return $author$project$Introduction$Root$stepMasonry(
							A2($author$project$Introduction$Masonry$update, msg, mo));
					} else {
						break _v0$9;
					}
				case 6:
					if (_v0.b.$ === 6) {
						var msg = _v0.a.a;
						var mo = _v0.b.a;
						return $author$project$Introduction$Root$stepResize(
							A2($author$project$Introduction$Resize$update, msg, mo));
					} else {
						break _v0$9;
					}
				case 7:
					if (_v0.b.$ === 7) {
						var msg = _v0.a.a;
						var mo = _v0.b.a;
						return $author$project$Introduction$Root$stepIndependents(
							A2($author$project$Introduction$Independents$update, msg, mo));
					} else {
						break _v0$9;
					}
				default:
					if (_v0.b.$ === 8) {
						var msg = _v0.a.a;
						var mo = _v0.b.a;
						return $author$project$Introduction$Root$stepGroups(
							A2($author$project$Introduction$Groups$update, msg, mo));
					} else {
						break _v0$9;
					}
			}
		}
		return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	});
var $author$project$Main$update = F2(
	function (message, model) {
		var _v0 = _Utils_Tuple2(message, model.s);
		_v0$8:
		while (true) {
			switch (_v0.a.$) {
				case 0:
					var _v1 = _v0.a;
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				case 1:
					var urlRequest = _v0.a.a;
					if (!urlRequest.$) {
						var url = urlRequest.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									z: $author$project$Main$toPath(url)
								}),
							$elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[
										A2(
										$elm$browser$Browser$Navigation$pushUrl,
										model.bf,
										$elm$url$Url$toString(url)),
										$author$project$Main$jumpToTop('main')
									])));
					} else {
						var href = urlRequest.a;
						return _Utils_Tuple2(
							model,
							$elm$browser$Browser$Navigation$load(href));
					}
				case 2:
					var url = _v0.a.a;
					return A2($author$project$Main$stepUrl, url, model);
				case 3:
					if (_v0.b.$ === 1) {
						var msg = _v0.a.a;
						var mo = _v0.b.a;
						return A2(
							$author$project$Main$stepHome,
							model,
							A2($author$project$Home$update, msg, mo));
					} else {
						break _v0$8;
					}
				case 4:
					if (_v0.b.$ === 2) {
						var msg = _v0.a.a;
						var mo = _v0.b.a;
						return A2(
							$author$project$Main$stepIntroduction,
							model,
							A2($author$project$Introduction$Root$update, msg, mo));
					} else {
						break _v0$8;
					}
				case 5:
					if (_v0.b.$ === 3) {
						var msg = _v0.a.a;
						var mo = _v0.b.a;
						return A2(
							$author$project$Main$stepConfig,
							model,
							A2($author$project$Config$Root$update, msg, mo));
					} else {
						break _v0$8;
					}
				case 6:
					if (_v0.b.$ === 4) {
						var msg = _v0.a.a;
						var mo = _v0.b.a;
						return A2(
							$author$project$Main$stepConfigGroups,
							model,
							A2($author$project$ConfigGroups$Root$update, msg, mo));
					} else {
						break _v0$8;
					}
				default:
					if (_v0.b.$ === 5) {
						var msg = _v0.a.a;
						var mo = _v0.b.a;
						return A2(
							$author$project$Main$stepGallery,
							model,
							A2($author$project$Gallery$Root$update, msg, mo));
					} else {
						break _v0$8;
					}
			}
		}
		return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	});
var $elm$html$Html$a = _VirtualDom_node('a');
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $elm$html$Html$header = _VirtualDom_node('header');
var $elm$json$Json$Encode$string = _Json_wrap;
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $elm$html$Html$p = _VirtualDom_node('p');
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $author$project$Main$cardView = A2(
	$elm$html$Html$header,
	_List_Nil,
	_List_fromArray(
		[
			A2(
			$elm$html$Html$h1,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$href(
							A2(
								$elm$url$Url$Builder$absolute,
								_List_fromArray(
									[$author$project$Path$rootPath]),
								_List_Nil))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('dnd-list')
						]))
				])),
			A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$href('https://github.com/annaghi/dnd-list')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('GitHub')
						])),
					$elm$html$Html$text(' | '),
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$href('https://package.elm-lang.org/packages/annaghi/dnd-list/latest')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Docs')
						]))
				])),
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('Drag and Drop for sortable lists in Elm web apps with mouse support')
				]))
		]));
var $elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$node = $elm$virtual_dom$VirtualDom$node;
var $author$project$CustomElement$elmCode = F2(
	function (attrs, elems) {
		return A3($elm$html$Html$node, 'elm-code', attrs, elems);
	});
var $elm$virtual_dom$VirtualDom$property = F2(
	function (key, value) {
		return A2(
			_VirtualDom_property,
			_VirtualDom_noInnerHtmlOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$property = $elm$virtual_dom$VirtualDom$property;
var $author$project$CustomElement$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$property,
		'href',
		$elm$json$Json$Encode$string(url));
};
var $author$project$Config$Root$toCode = function (url) {
	return A2(
		$author$project$CustomElement$elmCode,
		_List_fromArray(
			[
				$author$project$CustomElement$href(url)
			]),
		_List_Nil);
};
var $author$project$Config$Movement$Root$url = function (id) {
	switch (id) {
		case 0:
			return 'https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Config/Movement/FreeOnDrag.elm';
		case 1:
			return 'https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Config/Movement/FreeOnDrop.elm';
		case 2:
			return 'https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Config/Movement/HorizontalOnDrag.elm';
		case 3:
			return 'https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Config/Movement/HorizontalOnDrop.elm';
		case 4:
			return 'https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Config/Movement/VerticalOnDrag.elm';
		case 5:
			return 'https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Config/Movement/VerticalOnDrop.elm';
		default:
			return '';
	}
};
var $author$project$Config$OperationsOnDrag$Root$url = function (id) {
	switch (id) {
		case 0:
			return 'https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Config/OperationsOnDrag/InsertAfter.elm';
		case 1:
			return 'https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Config/OperationsOnDrag/InsertBefore.elm';
		case 2:
			return 'https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Config/OperationsOnDrag/Rotate.elm';
		case 3:
			return 'https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Config/OperationsOnDrag/Swap.elm';
		case 4:
			return 'https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Config/OperationsOnDrag/Unaltered.elm';
		default:
			return '';
	}
};
var $author$project$Config$OperationsOnDrop$Root$url = function (id) {
	switch (id) {
		case 0:
			return 'https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Config/OperationsOnDrop/InsertAfter.elm';
		case 1:
			return 'https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Config/OperationsOnDrop/InsertBefore.elm';
		case 2:
			return 'https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Config/OperationsOnDrop/Rotate.elm';
		case 3:
			return 'https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Config/OperationsOnDrop/Swap.elm';
		case 4:
			return 'https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Config/OperationsOnDrop/Unaltered.elm';
		default:
			return '';
	}
};
var $author$project$Config$Root$codeView = function (model) {
	switch (model.$) {
		case 0:
			var mo = model.a;
			return $author$project$Config$Root$toCode(
				$author$project$Config$Movement$Root$url(mo.at));
		case 1:
			var mo = model.a;
			return $author$project$Config$Root$toCode(
				$author$project$Config$OperationsOnDrag$Root$url(mo.at));
		default:
			var mo = model.a;
			return $author$project$Config$Root$toCode(
				$author$project$Config$OperationsOnDrop$Root$url(mo.at));
	}
};
var $author$project$ConfigGroups$Root$toCode = function (url) {
	return A2(
		$author$project$CustomElement$elmCode,
		_List_fromArray(
			[
				$author$project$CustomElement$href(url)
			]),
		_List_Nil);
};
var $author$project$ConfigGroups$OperationsOnDrag$Root$url = function (id) {
	switch (id) {
		case 0:
			return 'https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/ConfigGroups/OperationsOnDrag/InsertAfter.elm';
		case 1:
			return 'https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/ConfigGroups/OperationsOnDrag/InsertBefore.elm';
		case 2:
			return 'https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/ConfigGroups/OperationsOnDrag/Rotate.elm';
		case 3:
			return 'https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/ConfigGroups/OperationsOnDrag/Swap.elm';
		default:
			return '';
	}
};
var $author$project$ConfigGroups$OperationsOnDrop$Root$url = function (id) {
	switch (id) {
		case 0:
			return 'https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/ConfigGroups/OperationsOnDrop/InsertAfter.elm';
		case 1:
			return 'https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/ConfigGroups/OperationsOnDrop/InsertBefore.elm';
		case 2:
			return 'https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/ConfigGroups/OperationsOnDrop/Rotate.elm';
		case 3:
			return 'https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/ConfigGroups/OperationsOnDrop/Swap.elm';
		default:
			return '';
	}
};
var $author$project$ConfigGroups$Root$codeView = function (model) {
	if (!model.$) {
		var mo = model.a;
		return $author$project$ConfigGroups$Root$toCode(
			$author$project$ConfigGroups$OperationsOnDrag$Root$url(mo.at));
	} else {
		var mo = model.a;
		return $author$project$ConfigGroups$Root$toCode(
			$author$project$ConfigGroups$OperationsOnDrop$Root$url(mo.at));
	}
};
var $author$project$Gallery$Root$toCode = function (url) {
	return A2(
		$author$project$CustomElement$elmCode,
		_List_fromArray(
			[
				$author$project$CustomElement$href(url)
			]),
		_List_Nil);
};
var $author$project$Gallery$Root$codeView = function (model) {
	switch (model.$) {
		case 0:
			return $author$project$Gallery$Root$toCode('https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Gallery/Hanoi.elm');
		case 1:
			return $author$project$Gallery$Root$toCode('https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Gallery/Puzzle.elm');
		case 2:
			return $author$project$Gallery$Root$toCode('https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Gallery/Shapes.elm');
		case 3:
			return $author$project$Gallery$Root$toCode('https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Gallery/Knight.elm');
		case 4:
			return $author$project$Gallery$Root$toCode('https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Gallery/TryOn.elm');
		default:
			return $author$project$Gallery$Root$toCode('https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Gallery/TaskBoard.elm');
	}
};
var $author$project$Introduction$Root$toCode = function (url) {
	return A2(
		$author$project$CustomElement$elmCode,
		_List_fromArray(
			[
				$author$project$CustomElement$href(url)
			]),
		_List_Nil);
};
var $author$project$Introduction$Root$codeView = function (model) {
	switch (model.$) {
		case 0:
			return $author$project$Introduction$Root$toCode('https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Introduction/Basic.elm');
		case 1:
			return $author$project$Introduction$Root$toCode('https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Introduction/BasicElmUI.elm');
		case 2:
			return $author$project$Introduction$Root$toCode('https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Introduction/Handle.elm');
		case 3:
			return $author$project$Introduction$Root$toCode('https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Introduction/Keyed.elm');
		case 4:
			return $author$project$Introduction$Root$toCode('https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Introduction/Margins.elm');
		case 5:
			return $author$project$Introduction$Root$toCode('https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Introduction/Masonry.elm');
		case 6:
			return $author$project$Introduction$Root$toCode('https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Introduction/Resize.elm');
		case 7:
			return $author$project$Introduction$Root$toCode('https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Introduction/Independents.elm');
		default:
			return $author$project$Introduction$Root$toCode('https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Introduction/Groups.elm');
	}
};
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $elm$html$Html$map = $elm$virtual_dom$VirtualDom$map;
var $author$project$Config$Movement$Root$LinkClicked = function (a) {
	return {$: 0, a: a};
};
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $elm$html$Html$Attributes$classList = function (classes) {
	return $elm$html$Html$Attributes$class(
		A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				A2($elm$core$List$filter, $elm$core$Tuple$second, classes))));
};
var $author$project$Config$Movement$FreeOnDrag$ClearAffected = {$: 1};
var $author$project$Config$Movement$FreeOnDrag$containerStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'grid'),
		A2($elm$html$Html$Attributes$style, 'grid-template-columns', '50px 50px 50px'),
		A2($elm$html$Html$Attributes$style, 'grid-template-rows', '50px 50px 50px'),
		A2($elm$html$Html$Attributes$style, 'grid-gap', '1em'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'center')
	]);
var $author$project$Config$Movement$FreeOnDrag$ghostStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'background-color', '#1e9daa')
	]);
var $author$project$Config$Movement$FreeOnDrag$itemStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'background-color', '#aa1e9d'),
		A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
		A2($elm$html$Html$Attributes$style, 'color', 'white'),
		A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
		A2($elm$html$Html$Attributes$style, 'font-size', '1.2em'),
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'center')
	]);
var $author$project$Config$Movement$FreeOnDrag$ghostView = F2(
	function (dnd, items) {
		var maybeDragItem = A2(
			$elm$core$Maybe$andThen,
			function (_v1) {
				var dragIndex = _v1.a9;
				return $elm$core$List$head(
					A2($elm$core$List$drop, dragIndex, items));
			},
			$author$project$Config$Movement$FreeOnDrag$system.be(dnd));
		if (!maybeDragItem.$) {
			var item = maybeDragItem.a;
			return A2(
				$elm$html$Html$div,
				_Utils_ap(
					$author$project$Config$Movement$FreeOnDrag$itemStyles,
					_Utils_ap(
						$author$project$Config$Movement$FreeOnDrag$ghostStyles,
						$author$project$Config$Movement$FreeOnDrag$system.c$(dnd))),
				_List_fromArray(
					[
						$elm$html$Html$text(item)
					]));
		} else {
			return $elm$html$Html$text('');
		}
	});
var $author$project$Config$Movement$FreeOnDrag$affectedStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'background-color', '#691361')
	]);
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $author$project$Config$Movement$FreeOnDrag$placeholderStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'background-color', 'dimgray')
	]);
var $author$project$Config$Movement$FreeOnDrag$itemView = F4(
	function (dnd, affected, index, item) {
		var itemId = 'frdrag-' + item;
		var attrs = A2(
			$elm$core$List$cons,
			$elm$html$Html$Attributes$id(itemId),
			_Utils_ap(
				$author$project$Config$Movement$FreeOnDrag$itemStyles,
				A2($elm$core$List$member, index, affected) ? $author$project$Config$Movement$FreeOnDrag$affectedStyles : _List_Nil));
		var _v0 = $author$project$Config$Movement$FreeOnDrag$system.be(dnd);
		if (!_v0.$) {
			var dragIndex = _v0.a.a9;
			return (!_Utils_eq(dragIndex, index)) ? A2(
				$elm$html$Html$div,
				_Utils_ap(
					attrs,
					A2($author$project$Config$Movement$FreeOnDrag$system.cU, index, itemId)),
				_List_fromArray(
					[
						$elm$html$Html$text(item)
					])) : A2(
				$elm$html$Html$div,
				_Utils_ap(attrs, $author$project$Config$Movement$FreeOnDrag$placeholderStyles),
				_List_Nil);
		} else {
			return A2(
				$elm$html$Html$div,
				_Utils_ap(
					attrs,
					A2($author$project$Config$Movement$FreeOnDrag$system.cT, index, itemId)),
				_List_fromArray(
					[
						$elm$html$Html$text(item)
					]));
		}
	});
var $elm$html$Html$Events$onMouseDown = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mousedown',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$section = _VirtualDom_node('section');
var $author$project$Config$Movement$FreeOnDrag$view = function (model) {
	return A2(
		$elm$html$Html$section,
		_List_fromArray(
			[
				$elm$html$Html$Events$onMouseDown($author$project$Config$Movement$FreeOnDrag$ClearAffected)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				$author$project$Config$Movement$FreeOnDrag$containerStyles,
				A2(
					$elm$core$List$indexedMap,
					A2($author$project$Config$Movement$FreeOnDrag$itemView, model.Q, model.K),
					model.au)),
				A2($author$project$Config$Movement$FreeOnDrag$ghostView, model.Q, model.au)
			]));
};
var $author$project$Config$Movement$FreeOnDrop$ClearAffected = {$: 1};
var $author$project$Config$Movement$FreeOnDrop$containerStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'grid'),
		A2($elm$html$Html$Attributes$style, 'grid-template-columns', '50px 50px 50px'),
		A2($elm$html$Html$Attributes$style, 'grid-template-rows', '50px 50px 50px'),
		A2($elm$html$Html$Attributes$style, 'grid-gap', '1em'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'center')
	]);
var $author$project$Config$Movement$FreeOnDrop$ghostStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'background-color', '#aa1e9d')
	]);
var $author$project$Config$Movement$FreeOnDrop$itemStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'background-color', '#1e9daa'),
		A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
		A2($elm$html$Html$Attributes$style, 'color', 'white'),
		A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
		A2($elm$html$Html$Attributes$style, 'font-size', '1.2em'),
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'center')
	]);
var $author$project$Config$Movement$FreeOnDrop$ghostView = F2(
	function (dnd, items) {
		var maybeDragItem = A2(
			$elm$core$Maybe$andThen,
			function (_v1) {
				var dragIndex = _v1.a9;
				return $elm$core$List$head(
					A2($elm$core$List$drop, dragIndex, items));
			},
			$author$project$Config$Movement$FreeOnDrop$system.be(dnd));
		if (!maybeDragItem.$) {
			var item = maybeDragItem.a;
			return A2(
				$elm$html$Html$div,
				_Utils_ap(
					$author$project$Config$Movement$FreeOnDrop$itemStyles,
					_Utils_ap(
						$author$project$Config$Movement$FreeOnDrop$ghostStyles,
						$author$project$Config$Movement$FreeOnDrop$system.c$(dnd))),
				_List_fromArray(
					[
						$elm$html$Html$text(item)
					]));
		} else {
			return $elm$html$Html$text('');
		}
	});
var $author$project$Config$Movement$FreeOnDrop$affectedStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'background-color', '#136169')
	]);
var $author$project$Config$Movement$FreeOnDrop$overedStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'background-color', '#63bdc7')
	]);
var $author$project$Config$Movement$FreeOnDrop$placeholderStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'background-color', 'dimgray')
	]);
var $author$project$Config$Movement$FreeOnDrop$itemView = F4(
	function (dnd, affected, index, item) {
		var itemId = 'frdrop-' + item;
		var attrs = A2(
			$elm$core$List$cons,
			$elm$html$Html$Attributes$id(itemId),
			_Utils_ap(
				$author$project$Config$Movement$FreeOnDrop$itemStyles,
				A2($elm$core$List$member, index, affected) ? $author$project$Config$Movement$FreeOnDrop$affectedStyles : _List_Nil));
		var _v0 = $author$project$Config$Movement$FreeOnDrop$system.be(dnd);
		if (!_v0.$) {
			var dragIndex = _v0.a.a9;
			var dropIndex = _v0.a.cV;
			return ((!_Utils_eq(dragIndex, index)) && (!_Utils_eq(dropIndex, index))) ? A2(
				$elm$html$Html$div,
				_Utils_ap(
					attrs,
					A2($author$project$Config$Movement$FreeOnDrop$system.cU, index, itemId)),
				_List_fromArray(
					[
						$elm$html$Html$text(item)
					])) : (((!_Utils_eq(dragIndex, index)) && _Utils_eq(dropIndex, index)) ? A2(
				$elm$html$Html$div,
				_Utils_ap(
					attrs,
					_Utils_ap(
						$author$project$Config$Movement$FreeOnDrop$overedStyles,
						A2($author$project$Config$Movement$FreeOnDrop$system.cU, index, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(item)
					])) : A2(
				$elm$html$Html$div,
				_Utils_ap(attrs, $author$project$Config$Movement$FreeOnDrop$placeholderStyles),
				_List_Nil));
		} else {
			return A2(
				$elm$html$Html$div,
				_Utils_ap(
					attrs,
					A2($author$project$Config$Movement$FreeOnDrop$system.cT, index, itemId)),
				_List_fromArray(
					[
						$elm$html$Html$text(item)
					]));
		}
	});
var $author$project$Config$Movement$FreeOnDrop$view = function (model) {
	return A2(
		$elm$html$Html$section,
		_List_fromArray(
			[
				$elm$html$Html$Events$onMouseDown($author$project$Config$Movement$FreeOnDrop$ClearAffected)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				$author$project$Config$Movement$FreeOnDrop$containerStyles,
				A2(
					$elm$core$List$indexedMap,
					A2($author$project$Config$Movement$FreeOnDrop$itemView, model.Q, model.K),
					model.au)),
				A2($author$project$Config$Movement$FreeOnDrop$ghostView, model.Q, model.au)
			]));
};
var $author$project$Config$Movement$HorizontalOnDrag$ClearAffected = {$: 1};
var $author$project$Config$Movement$HorizontalOnDrag$containerStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex')
	]);
var $author$project$Config$Movement$HorizontalOnDrag$ghostStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'background-color', '#1e9daa')
	]);
var $author$project$Config$Movement$HorizontalOnDrag$itemStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'background-color', '#aa1e9d'),
		A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
		A2($elm$html$Html$Attributes$style, 'color', 'white'),
		A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
		A2($elm$html$Html$Attributes$style, 'font-size', '1.2em'),
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
		A2($elm$html$Html$Attributes$style, 'margin', '0 1.5em 1.5em 0'),
		A2($elm$html$Html$Attributes$style, 'width', '50px'),
		A2($elm$html$Html$Attributes$style, 'height', '50px')
	]);
var $author$project$Config$Movement$HorizontalOnDrag$ghostView = F2(
	function (dnd, items) {
		var maybeDragItem = A2(
			$elm$core$Maybe$andThen,
			function (_v1) {
				var dragIndex = _v1.a9;
				return $elm$core$List$head(
					A2($elm$core$List$drop, dragIndex, items));
			},
			$author$project$Config$Movement$HorizontalOnDrag$system.be(dnd));
		if (!maybeDragItem.$) {
			var item = maybeDragItem.a;
			return A2(
				$elm$html$Html$div,
				_Utils_ap(
					$author$project$Config$Movement$HorizontalOnDrag$itemStyles,
					_Utils_ap(
						$author$project$Config$Movement$HorizontalOnDrag$ghostStyles,
						$author$project$Config$Movement$HorizontalOnDrag$system.c$(dnd))),
				_List_fromArray(
					[
						$elm$html$Html$text(item)
					]));
		} else {
			return $elm$html$Html$text('');
		}
	});
var $author$project$Config$Movement$HorizontalOnDrag$affectedStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'background-color', '#691361')
	]);
var $author$project$Config$Movement$HorizontalOnDrag$placeholderStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'background-color', 'dimgray')
	]);
var $author$project$Config$Movement$HorizontalOnDrag$itemView = F4(
	function (dnd, affected, index, item) {
		var itemId = 'hrdrag-' + item;
		var attrs = A2(
			$elm$core$List$cons,
			$elm$html$Html$Attributes$id(itemId),
			_Utils_ap(
				$author$project$Config$Movement$HorizontalOnDrag$itemStyles,
				A2($elm$core$List$member, index, affected) ? $author$project$Config$Movement$HorizontalOnDrag$affectedStyles : _List_Nil));
		var _v0 = $author$project$Config$Movement$HorizontalOnDrag$system.be(dnd);
		if (!_v0.$) {
			var dragIndex = _v0.a.a9;
			return (!_Utils_eq(dragIndex, index)) ? A2(
				$elm$html$Html$div,
				_Utils_ap(
					attrs,
					A2($author$project$Config$Movement$HorizontalOnDrag$system.cU, index, itemId)),
				_List_fromArray(
					[
						$elm$html$Html$text(item)
					])) : A2(
				$elm$html$Html$div,
				_Utils_ap(attrs, $author$project$Config$Movement$HorizontalOnDrag$placeholderStyles),
				_List_Nil);
		} else {
			return A2(
				$elm$html$Html$div,
				_Utils_ap(
					attrs,
					A2($author$project$Config$Movement$HorizontalOnDrag$system.cT, index, itemId)),
				_List_fromArray(
					[
						$elm$html$Html$text(item)
					]));
		}
	});
var $author$project$Config$Movement$HorizontalOnDrag$view = function (model) {
	return A2(
		$elm$html$Html$section,
		_List_fromArray(
			[
				$elm$html$Html$Events$onMouseDown($author$project$Config$Movement$HorizontalOnDrag$ClearAffected)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				$author$project$Config$Movement$HorizontalOnDrag$containerStyles,
				A2(
					$elm$core$List$indexedMap,
					A2($author$project$Config$Movement$HorizontalOnDrag$itemView, model.Q, model.K),
					model.au)),
				A2($author$project$Config$Movement$HorizontalOnDrag$ghostView, model.Q, model.au)
			]));
};
var $author$project$Config$Movement$HorizontalOnDrop$ClearAffected = {$: 1};
var $author$project$Config$Movement$HorizontalOnDrop$containerStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex')
	]);
var $author$project$Config$Movement$HorizontalOnDrop$ghostStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'background-color', '#aa1e9d')
	]);
var $author$project$Config$Movement$HorizontalOnDrop$itemStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'background-color', '#1e9daa'),
		A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
		A2($elm$html$Html$Attributes$style, 'color', 'white'),
		A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
		A2($elm$html$Html$Attributes$style, 'font-size', '1.2em'),
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
		A2($elm$html$Html$Attributes$style, 'margin', '0 1.5em 1.5em 0'),
		A2($elm$html$Html$Attributes$style, 'width', '50px'),
		A2($elm$html$Html$Attributes$style, 'height', '50px')
	]);
var $author$project$Config$Movement$HorizontalOnDrop$ghostView = F2(
	function (dnd, items) {
		var maybeDragItem = A2(
			$elm$core$Maybe$andThen,
			function (_v1) {
				var dragIndex = _v1.a9;
				return $elm$core$List$head(
					A2($elm$core$List$drop, dragIndex, items));
			},
			$author$project$Config$Movement$HorizontalOnDrop$system.be(dnd));
		if (!maybeDragItem.$) {
			var item = maybeDragItem.a;
			return A2(
				$elm$html$Html$div,
				_Utils_ap(
					$author$project$Config$Movement$HorizontalOnDrop$itemStyles,
					_Utils_ap(
						$author$project$Config$Movement$HorizontalOnDrop$ghostStyles,
						$author$project$Config$Movement$HorizontalOnDrop$system.c$(dnd))),
				_List_fromArray(
					[
						$elm$html$Html$text(item)
					]));
		} else {
			return $elm$html$Html$text('');
		}
	});
var $author$project$Config$Movement$HorizontalOnDrop$affectedStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'background-color', '#136169')
	]);
var $author$project$Config$Movement$HorizontalOnDrop$overedStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'background-color', '#63bdc7')
	]);
var $author$project$Config$Movement$HorizontalOnDrop$placeholderStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'background-color', 'dimgray')
	]);
var $author$project$Config$Movement$HorizontalOnDrop$itemView = F4(
	function (dnd, affected, index, item) {
		var itemId = 'hrdrop-' + item;
		var attrs = A2(
			$elm$core$List$cons,
			$elm$html$Html$Attributes$id(itemId),
			_Utils_ap(
				$author$project$Config$Movement$HorizontalOnDrop$itemStyles,
				A2($elm$core$List$member, index, affected) ? $author$project$Config$Movement$HorizontalOnDrop$affectedStyles : _List_Nil));
		var _v0 = $author$project$Config$Movement$HorizontalOnDrop$system.be(dnd);
		if (!_v0.$) {
			var dragIndex = _v0.a.a9;
			var dropIndex = _v0.a.cV;
			return ((!_Utils_eq(dragIndex, index)) && (!_Utils_eq(dropIndex, index))) ? A2(
				$elm$html$Html$div,
				_Utils_ap(
					attrs,
					A2($author$project$Config$Movement$HorizontalOnDrop$system.cU, index, itemId)),
				_List_fromArray(
					[
						$elm$html$Html$text(item)
					])) : (((!_Utils_eq(dragIndex, index)) && _Utils_eq(dropIndex, index)) ? A2(
				$elm$html$Html$div,
				_Utils_ap(
					attrs,
					_Utils_ap(
						$author$project$Config$Movement$HorizontalOnDrop$overedStyles,
						A2($author$project$Config$Movement$HorizontalOnDrop$system.cU, index, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(item)
					])) : A2(
				$elm$html$Html$div,
				_Utils_ap(attrs, $author$project$Config$Movement$HorizontalOnDrop$placeholderStyles),
				_List_Nil));
		} else {
			return A2(
				$elm$html$Html$div,
				_Utils_ap(
					attrs,
					A2($author$project$Config$Movement$HorizontalOnDrop$system.cT, index, itemId)),
				_List_fromArray(
					[
						$elm$html$Html$text(item)
					]));
		}
	});
var $author$project$Config$Movement$HorizontalOnDrop$view = function (model) {
	return A2(
		$elm$html$Html$section,
		_List_fromArray(
			[
				$elm$html$Html$Events$onMouseDown($author$project$Config$Movement$HorizontalOnDrop$ClearAffected)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				$author$project$Config$Movement$HorizontalOnDrop$containerStyles,
				A2(
					$elm$core$List$indexedMap,
					A2($author$project$Config$Movement$HorizontalOnDrop$itemView, model.Q, model.K),
					model.au)),
				A2($author$project$Config$Movement$HorizontalOnDrop$ghostView, model.Q, model.au)
			]));
};
var $author$project$Config$Movement$VerticalOnDrag$ClearAffected = {$: 1};
var $author$project$Config$Movement$VerticalOnDrag$containerStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'flex-direction', 'column')
	]);
var $author$project$Config$Movement$VerticalOnDrag$ghostStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'background-color', '#1e9daa')
	]);
var $author$project$Config$Movement$VerticalOnDrag$itemStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'background-color', '#aa1e9d'),
		A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
		A2($elm$html$Html$Attributes$style, 'color', 'white'),
		A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
		A2($elm$html$Html$Attributes$style, 'font-size', '1.2em'),
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
		A2($elm$html$Html$Attributes$style, 'margin', '0 0 1.5em 0'),
		A2($elm$html$Html$Attributes$style, 'width', '50px'),
		A2($elm$html$Html$Attributes$style, 'height', '50px')
	]);
var $author$project$Config$Movement$VerticalOnDrag$ghostView = F2(
	function (dnd, items) {
		var maybeDragItem = A2(
			$elm$core$Maybe$andThen,
			function (_v1) {
				var dragIndex = _v1.a9;
				return $elm$core$List$head(
					A2($elm$core$List$drop, dragIndex, items));
			},
			$author$project$Config$Movement$VerticalOnDrag$system.be(dnd));
		if (!maybeDragItem.$) {
			var item = maybeDragItem.a;
			return A2(
				$elm$html$Html$div,
				_Utils_ap(
					$author$project$Config$Movement$VerticalOnDrag$itemStyles,
					_Utils_ap(
						$author$project$Config$Movement$VerticalOnDrag$ghostStyles,
						$author$project$Config$Movement$VerticalOnDrag$system.c$(dnd))),
				_List_fromArray(
					[
						$elm$html$Html$text(item)
					]));
		} else {
			return $elm$html$Html$text('');
		}
	});
var $author$project$Config$Movement$VerticalOnDrag$affectedStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'background-color', '#691361')
	]);
var $author$project$Config$Movement$VerticalOnDrag$placeholderStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'background-color', 'dimgray')
	]);
var $author$project$Config$Movement$VerticalOnDrag$itemView = F4(
	function (dnd, affected, index, item) {
		var itemId = 'vrdrag-' + item;
		var attrs = A2(
			$elm$core$List$cons,
			$elm$html$Html$Attributes$id(itemId),
			_Utils_ap(
				$author$project$Config$Movement$VerticalOnDrag$itemStyles,
				A2($elm$core$List$member, index, affected) ? $author$project$Config$Movement$VerticalOnDrag$affectedStyles : _List_Nil));
		var _v0 = $author$project$Config$Movement$VerticalOnDrag$system.be(dnd);
		if (!_v0.$) {
			var dragIndex = _v0.a.a9;
			return (!_Utils_eq(dragIndex, index)) ? A2(
				$elm$html$Html$div,
				_Utils_ap(
					attrs,
					A2($author$project$Config$Movement$VerticalOnDrag$system.cU, index, itemId)),
				_List_fromArray(
					[
						$elm$html$Html$text(item)
					])) : A2(
				$elm$html$Html$div,
				_Utils_ap(attrs, $author$project$Config$Movement$VerticalOnDrag$placeholderStyles),
				_List_Nil);
		} else {
			return A2(
				$elm$html$Html$div,
				_Utils_ap(
					attrs,
					A2($author$project$Config$Movement$VerticalOnDrag$system.cT, index, itemId)),
				_List_fromArray(
					[
						$elm$html$Html$text(item)
					]));
		}
	});
var $author$project$Config$Movement$VerticalOnDrag$view = function (model) {
	return A2(
		$elm$html$Html$section,
		_List_fromArray(
			[
				$elm$html$Html$Events$onMouseDown($author$project$Config$Movement$VerticalOnDrag$ClearAffected)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				$author$project$Config$Movement$VerticalOnDrag$containerStyles,
				A2(
					$elm$core$List$indexedMap,
					A2($author$project$Config$Movement$VerticalOnDrag$itemView, model.Q, model.K),
					model.au)),
				A2($author$project$Config$Movement$VerticalOnDrag$ghostView, model.Q, model.au)
			]));
};
var $author$project$Config$Movement$VerticalOnDrop$ClearAffected = {$: 1};
var $author$project$Config$Movement$VerticalOnDrop$containerStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'flex-direction', 'column')
	]);
var $author$project$Config$Movement$VerticalOnDrop$ghostStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'background-color', '#aa1e9d')
	]);
var $author$project$Config$Movement$VerticalOnDrop$itemStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'background-color', '#1e9daa'),
		A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
		A2($elm$html$Html$Attributes$style, 'color', 'white'),
		A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
		A2($elm$html$Html$Attributes$style, 'font-size', '1.2em'),
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
		A2($elm$html$Html$Attributes$style, 'margin', '0 0 1.5em 0'),
		A2($elm$html$Html$Attributes$style, 'width', '50px'),
		A2($elm$html$Html$Attributes$style, 'height', '50px')
	]);
var $author$project$Config$Movement$VerticalOnDrop$ghostView = F2(
	function (dnd, items) {
		var maybeDragItem = A2(
			$elm$core$Maybe$andThen,
			function (_v1) {
				var dragIndex = _v1.a9;
				return $elm$core$List$head(
					A2($elm$core$List$drop, dragIndex, items));
			},
			$author$project$Config$Movement$VerticalOnDrop$system.be(dnd));
		if (!maybeDragItem.$) {
			var item = maybeDragItem.a;
			return A2(
				$elm$html$Html$div,
				_Utils_ap(
					$author$project$Config$Movement$VerticalOnDrop$itemStyles,
					_Utils_ap(
						$author$project$Config$Movement$VerticalOnDrop$ghostStyles,
						$author$project$Config$Movement$VerticalOnDrop$system.c$(dnd))),
				_List_fromArray(
					[
						$elm$html$Html$text(item)
					]));
		} else {
			return $elm$html$Html$text('');
		}
	});
var $author$project$Config$Movement$VerticalOnDrop$affectedStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'background-color', '#136169')
	]);
var $author$project$Config$Movement$VerticalOnDrop$overedStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'background-color', '#63bdc7')
	]);
var $author$project$Config$Movement$VerticalOnDrop$placeholderStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'background-color', 'dimgray')
	]);
var $author$project$Config$Movement$VerticalOnDrop$itemView = F4(
	function (dnd, affected, index, item) {
		var itemId = 'vrdrop-' + item;
		var attrs = A2(
			$elm$core$List$cons,
			$elm$html$Html$Attributes$id(itemId),
			_Utils_ap(
				$author$project$Config$Movement$VerticalOnDrop$itemStyles,
				A2($elm$core$List$member, index, affected) ? $author$project$Config$Movement$VerticalOnDrop$affectedStyles : _List_Nil));
		var _v0 = $author$project$Config$Movement$VerticalOnDrop$system.be(dnd);
		if (!_v0.$) {
			var dragIndex = _v0.a.a9;
			var dropIndex = _v0.a.cV;
			return ((!_Utils_eq(dragIndex, index)) && (!_Utils_eq(dropIndex, index))) ? A2(
				$elm$html$Html$div,
				_Utils_ap(
					attrs,
					A2($author$project$Config$Movement$VerticalOnDrop$system.cU, index, itemId)),
				_List_fromArray(
					[
						$elm$html$Html$text(item)
					])) : (((!_Utils_eq(dragIndex, index)) && _Utils_eq(dropIndex, index)) ? A2(
				$elm$html$Html$div,
				_Utils_ap(
					attrs,
					_Utils_ap(
						$author$project$Config$Movement$VerticalOnDrop$overedStyles,
						A2($author$project$Config$Movement$VerticalOnDrop$system.cU, index, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(item)
					])) : A2(
				$elm$html$Html$div,
				_Utils_ap(attrs, $author$project$Config$Movement$VerticalOnDrop$placeholderStyles),
				_List_Nil));
		} else {
			return A2(
				$elm$html$Html$div,
				_Utils_ap(
					attrs,
					A2($author$project$Config$Movement$VerticalOnDrop$system.cT, index, itemId)),
				_List_fromArray(
					[
						$elm$html$Html$text(item)
					]));
		}
	});
var $author$project$Config$Movement$VerticalOnDrop$view = function (model) {
	return A2(
		$elm$html$Html$section,
		_List_fromArray(
			[
				$elm$html$Html$Events$onMouseDown($author$project$Config$Movement$VerticalOnDrop$ClearAffected)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				$author$project$Config$Movement$VerticalOnDrop$containerStyles,
				A2(
					$elm$core$List$indexedMap,
					A2($author$project$Config$Movement$VerticalOnDrop$itemView, model.Q, model.K),
					model.au)),
				A2($author$project$Config$Movement$VerticalOnDrop$ghostView, model.Q, model.au)
			]));
};
var $author$project$Config$Movement$Root$demoView = function (example) {
	switch (example.$) {
		case 0:
			var mo = example.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Config$Movement$Root$FreeOnDragMsg,
				$author$project$Config$Movement$FreeOnDrag$view(mo));
		case 1:
			var mo = example.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Config$Movement$Root$FreeOnDropMsg,
				$author$project$Config$Movement$FreeOnDrop$view(mo));
		case 2:
			var mo = example.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Config$Movement$Root$HorizontalOnDragMsg,
				$author$project$Config$Movement$HorizontalOnDrag$view(mo));
		case 3:
			var mo = example.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Config$Movement$Root$HorizontalOnDropMsg,
				$author$project$Config$Movement$HorizontalOnDrop$view(mo));
		case 4:
			var mo = example.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Config$Movement$Root$VerticalOnDragMsg,
				$author$project$Config$Movement$VerticalOnDrag$view(mo));
		default:
			var mo = example.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Config$Movement$Root$VerticalOnDropMsg,
				$author$project$Config$Movement$VerticalOnDrop$view(mo));
	}
};
var $author$project$Config$Movement$Root$info = function (example) {
	switch (example.$) {
		case 0:
			return 'Free on drag';
		case 1:
			return 'Free on drop';
		case 2:
			return 'Horizontal on drag';
		case 3:
			return 'Horizontal on drop';
		case 4:
			return 'Vertical on drag';
		default:
			return 'Vertical on drop';
	}
};
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $author$project$Config$Movement$Root$demoWrapperView = F4(
	function (offset, currentId, id, example) {
		var globalId = offset + id;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
					A2($elm$html$Html$Attributes$style, 'margin', '4em 0')
				]),
			_List_fromArray(
				[
					$author$project$Config$Movement$Root$demoView(example),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$classList(
							_List_fromArray(
								[
									_Utils_Tuple2('link', true),
									_Utils_Tuple2(
									'is-active',
									_Utils_eq(globalId, currentId))
								])),
							$elm$html$Html$Events$onClick(
							$author$project$Config$Movement$Root$LinkClicked(globalId))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							$author$project$Config$Movement$Root$info(example))
						]))
				]));
	});
var $author$project$Config$Movement$Root$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$section,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'display', 'flex'),
						A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
						A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
						A2($elm$html$Html$Attributes$style, 'padding-top', '2em')
					]),
				A2(
					$elm$core$List$indexedMap,
					A2($author$project$Config$Movement$Root$demoWrapperView, 0, model.at),
					A2($elm$core$List$take, 2, model.S))),
				A2(
				$elm$html$Html$section,
				_List_Nil,
				A2(
					$elm$core$List$indexedMap,
					A2($author$project$Config$Movement$Root$demoWrapperView, 2, model.at),
					A2(
						$elm$core$List$take,
						2,
						A2($elm$core$List$drop, 2, model.S)))),
				A2(
				$elm$html$Html$section,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'display', 'flex'),
						A2($elm$html$Html$Attributes$style, 'justify-content', 'center')
					]),
				A2(
					$elm$core$List$indexedMap,
					A2($author$project$Config$Movement$Root$demoWrapperView, 4, model.at),
					A2(
						$elm$core$List$take,
						2,
						A2($elm$core$List$drop, 4, model.S))))
			]));
};
var $author$project$Config$OperationsOnDrag$Root$LinkClicked = function (a) {
	return {$: 0, a: a};
};
var $author$project$Config$OperationsOnDrag$InsertAfter$ResetColors = {$: 1};
var $author$project$Config$OperationsOnDrag$InsertAfter$containerStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
		A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'center')
	]);
var $author$project$Config$OperationsOnDrag$InsertAfter$itemStyles = function (color) {
	return _List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'background-color', color),
			A2($elm$html$Html$Attributes$style, 'color', 'white'),
			A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
			A2($elm$html$Html$Attributes$style, 'display', 'flex'),
			A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
			A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
			A2($elm$html$Html$Attributes$style, 'margin', '0 1.5em 1.5em 0'),
			A2($elm$html$Html$Attributes$style, 'width', '50px'),
			A2($elm$html$Html$Attributes$style, 'height', '50px')
		]);
};
var $author$project$Config$OperationsOnDrag$InsertAfter$ghostView = F2(
	function (dnd, items) {
		var maybeDragItem = A2(
			$elm$core$Maybe$andThen,
			function (_v1) {
				var dragIndex = _v1.a9;
				return $elm$core$List$head(
					A2($elm$core$List$drop, dragIndex, items));
			},
			$author$project$Config$OperationsOnDrag$InsertAfter$system.be(dnd));
		if (!maybeDragItem.$) {
			var value = maybeDragItem.a.aB;
			return A2(
				$elm$html$Html$div,
				_Utils_ap(
					$author$project$Config$OperationsOnDrag$InsertAfter$itemStyles($author$project$Config$OperationsOnDrag$InsertAfter$dragColor),
					$author$project$Config$OperationsOnDrag$InsertAfter$system.c$(dnd)),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					]));
		} else {
			return $elm$html$Html$text('');
		}
	});
var $author$project$Config$OperationsOnDrag$InsertAfter$itemView = F3(
	function (dnd, index, _v0) {
		var value = _v0.aB;
		var color = _v0.aV;
		var itemId = 'insertafter-' + value;
		var _v1 = $author$project$Config$OperationsOnDrag$InsertAfter$system.be(dnd);
		if (!_v1.$) {
			var dragIndex = _v1.a.a9;
			var dropIndex = _v1.a.cV;
			return ((!_Utils_eq(index, dragIndex)) && (!_Utils_eq(index, dropIndex))) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$Config$OperationsOnDrag$InsertAfter$itemStyles(color),
						A2($author$project$Config$OperationsOnDrag$InsertAfter$system.cU, index, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					])) : (((!_Utils_eq(index, dragIndex)) && _Utils_eq(index, dropIndex)) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$Config$OperationsOnDrag$InsertAfter$itemStyles($author$project$Config$OperationsOnDrag$InsertAfter$dropColor),
						A2($author$project$Config$OperationsOnDrag$InsertAfter$system.cU, index, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					])) : A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					$author$project$Config$OperationsOnDrag$InsertAfter$itemStyles($author$project$Config$OperationsOnDrag$InsertAfter$dropColor)),
				_List_Nil));
		} else {
			return A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$Config$OperationsOnDrag$InsertAfter$itemStyles(color),
						A2($author$project$Config$OperationsOnDrag$InsertAfter$system.cT, index, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					]));
		}
	});
var $author$project$Config$OperationsOnDrag$InsertAfter$view = function (model) {
	return A2(
		$elm$html$Html$section,
		_List_fromArray(
			[
				$elm$html$Html$Events$onMouseDown($author$project$Config$OperationsOnDrag$InsertAfter$ResetColors)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				$author$project$Config$OperationsOnDrag$InsertAfter$containerStyles,
				A2(
					$elm$core$List$indexedMap,
					$author$project$Config$OperationsOnDrag$InsertAfter$itemView(model.Q),
					model.au)),
				A2($author$project$Config$OperationsOnDrag$InsertAfter$ghostView, model.Q, model.au)
			]));
};
var $author$project$Config$OperationsOnDrag$InsertBefore$ResetColors = {$: 1};
var $author$project$Config$OperationsOnDrag$InsertBefore$containerStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
		A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'center')
	]);
var $author$project$Config$OperationsOnDrag$InsertBefore$itemStyles = function (color) {
	return _List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'background-color', color),
			A2($elm$html$Html$Attributes$style, 'color', 'white'),
			A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
			A2($elm$html$Html$Attributes$style, 'display', 'flex'),
			A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
			A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
			A2($elm$html$Html$Attributes$style, 'margin', '0 1.5em 1.5em 0'),
			A2($elm$html$Html$Attributes$style, 'width', '50px'),
			A2($elm$html$Html$Attributes$style, 'height', '50px')
		]);
};
var $author$project$Config$OperationsOnDrag$InsertBefore$ghostView = F2(
	function (dnd, items) {
		var maybeDragItem = A2(
			$elm$core$Maybe$andThen,
			function (_v1) {
				var dragIndex = _v1.a9;
				return $elm$core$List$head(
					A2($elm$core$List$drop, dragIndex, items));
			},
			$author$project$Config$OperationsOnDrag$InsertBefore$system.be(dnd));
		if (!maybeDragItem.$) {
			var value = maybeDragItem.a.aB;
			return A2(
				$elm$html$Html$div,
				_Utils_ap(
					$author$project$Config$OperationsOnDrag$InsertBefore$itemStyles($author$project$Config$OperationsOnDrag$InsertBefore$dragColor),
					$author$project$Config$OperationsOnDrag$InsertBefore$system.c$(dnd)),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					]));
		} else {
			return $elm$html$Html$text('');
		}
	});
var $author$project$Config$OperationsOnDrag$InsertBefore$itemView = F3(
	function (dnd, index, _v0) {
		var value = _v0.aB;
		var color = _v0.aV;
		var itemId = 'insertbefore-' + value;
		var _v1 = $author$project$Config$OperationsOnDrag$InsertBefore$system.be(dnd);
		if (!_v1.$) {
			var dragIndex = _v1.a.a9;
			var dropIndex = _v1.a.cV;
			return ((!_Utils_eq(index, dragIndex)) && (!_Utils_eq(index, dropIndex))) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$Config$OperationsOnDrag$InsertBefore$itemStyles(color),
						A2($author$project$Config$OperationsOnDrag$InsertBefore$system.cU, index, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					])) : (((!_Utils_eq(index, dragIndex)) && _Utils_eq(index, dropIndex)) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$Config$OperationsOnDrag$InsertBefore$itemStyles($author$project$Config$OperationsOnDrag$InsertBefore$dropColor),
						A2($author$project$Config$OperationsOnDrag$InsertBefore$system.cU, index, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					])) : A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					$author$project$Config$OperationsOnDrag$InsertBefore$itemStyles($author$project$Config$OperationsOnDrag$InsertBefore$dropColor)),
				_List_Nil));
		} else {
			return A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$Config$OperationsOnDrag$InsertBefore$itemStyles(color),
						A2($author$project$Config$OperationsOnDrag$InsertBefore$system.cT, index, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					]));
		}
	});
var $author$project$Config$OperationsOnDrag$InsertBefore$view = function (model) {
	return A2(
		$elm$html$Html$section,
		_List_fromArray(
			[
				$elm$html$Html$Events$onMouseDown($author$project$Config$OperationsOnDrag$InsertBefore$ResetColors)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				$author$project$Config$OperationsOnDrag$InsertBefore$containerStyles,
				A2(
					$elm$core$List$indexedMap,
					$author$project$Config$OperationsOnDrag$InsertBefore$itemView(model.Q),
					model.au)),
				A2($author$project$Config$OperationsOnDrag$InsertBefore$ghostView, model.Q, model.au)
			]));
};
var $author$project$Config$OperationsOnDrag$Rotate$ResetColors = {$: 1};
var $author$project$Config$OperationsOnDrag$Rotate$containerStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
		A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'center')
	]);
var $author$project$Config$OperationsOnDrag$Rotate$itemStyles = function (color) {
	return _List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'background-color', color),
			A2($elm$html$Html$Attributes$style, 'color', 'white'),
			A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
			A2($elm$html$Html$Attributes$style, 'display', 'flex'),
			A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
			A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
			A2($elm$html$Html$Attributes$style, 'margin', '0 1.5em 1.5em 0'),
			A2($elm$html$Html$Attributes$style, 'width', '50px'),
			A2($elm$html$Html$Attributes$style, 'height', '50px')
		]);
};
var $author$project$Config$OperationsOnDrag$Rotate$ghostView = F2(
	function (dnd, items) {
		var maybeDragItem = A2(
			$elm$core$Maybe$andThen,
			function (_v1) {
				var dragIndex = _v1.a9;
				return $elm$core$List$head(
					A2($elm$core$List$drop, dragIndex, items));
			},
			$author$project$Config$OperationsOnDrag$Rotate$system.be(dnd));
		if (!maybeDragItem.$) {
			var value = maybeDragItem.a.aB;
			return A2(
				$elm$html$Html$div,
				_Utils_ap(
					$author$project$Config$OperationsOnDrag$Rotate$itemStyles($author$project$Config$OperationsOnDrag$Rotate$dragColor),
					$author$project$Config$OperationsOnDrag$Rotate$system.c$(dnd)),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					]));
		} else {
			return $elm$html$Html$text('');
		}
	});
var $author$project$Config$OperationsOnDrag$Rotate$itemView = F3(
	function (dnd, index, _v0) {
		var value = _v0.aB;
		var color = _v0.aV;
		var itemId = 'rotateout-' + value;
		var _v1 = $author$project$Config$OperationsOnDrag$Rotate$system.be(dnd);
		if (!_v1.$) {
			var dragIndex = _v1.a.a9;
			var dropIndex = _v1.a.cV;
			return ((!_Utils_eq(index, dragIndex)) && (!_Utils_eq(index, dropIndex))) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$Config$OperationsOnDrag$Rotate$itemStyles(color),
						A2($author$project$Config$OperationsOnDrag$Rotate$system.cU, index, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					])) : A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					$author$project$Config$OperationsOnDrag$Rotate$itemStyles($author$project$Config$OperationsOnDrag$Rotate$dropColor)),
				_List_Nil);
		} else {
			return A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$Config$OperationsOnDrag$Rotate$itemStyles(color),
						A2($author$project$Config$OperationsOnDrag$Rotate$system.cT, index, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					]));
		}
	});
var $author$project$Config$OperationsOnDrag$Rotate$view = function (model) {
	return A2(
		$elm$html$Html$section,
		_List_fromArray(
			[
				$elm$html$Html$Events$onMouseDown($author$project$Config$OperationsOnDrag$Rotate$ResetColors)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				$author$project$Config$OperationsOnDrag$Rotate$containerStyles,
				A2(
					$elm$core$List$indexedMap,
					$author$project$Config$OperationsOnDrag$Rotate$itemView(model.Q),
					model.au)),
				A2($author$project$Config$OperationsOnDrag$Rotate$ghostView, model.Q, model.au)
			]));
};
var $author$project$Config$OperationsOnDrag$Swap$ResetColors = {$: 1};
var $author$project$Config$OperationsOnDrag$Swap$containerStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
		A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'center')
	]);
var $author$project$Config$OperationsOnDrag$Swap$itemStyles = function (color) {
	return _List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'background-color', color),
			A2($elm$html$Html$Attributes$style, 'color', 'white'),
			A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
			A2($elm$html$Html$Attributes$style, 'display', 'flex'),
			A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
			A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
			A2($elm$html$Html$Attributes$style, 'margin', '0 1.5em 1.5em 0'),
			A2($elm$html$Html$Attributes$style, 'width', '50px'),
			A2($elm$html$Html$Attributes$style, 'height', '50px')
		]);
};
var $author$project$Config$OperationsOnDrag$Swap$ghostView = F2(
	function (dnd, items) {
		var maybeDragItem = A2(
			$elm$core$Maybe$andThen,
			function (_v1) {
				var dragIndex = _v1.a9;
				return $elm$core$List$head(
					A2($elm$core$List$drop, dragIndex, items));
			},
			$author$project$Config$OperationsOnDrag$Swap$system.be(dnd));
		if (!maybeDragItem.$) {
			var value = maybeDragItem.a.aB;
			return A2(
				$elm$html$Html$div,
				_Utils_ap(
					$author$project$Config$OperationsOnDrag$Swap$itemStyles($author$project$Config$OperationsOnDrag$Swap$dragColor),
					$author$project$Config$OperationsOnDrag$Swap$system.c$(dnd)),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					]));
		} else {
			return $elm$html$Html$text('');
		}
	});
var $author$project$Config$OperationsOnDrag$Swap$itemView = F3(
	function (dnd, index, _v0) {
		var value = _v0.aB;
		var color = _v0.aV;
		var itemId = 'swap-' + value;
		var _v1 = $author$project$Config$OperationsOnDrag$Swap$system.be(dnd);
		if (!_v1.$) {
			var dragIndex = _v1.a.a9;
			var dropIndex = _v1.a.cV;
			return ((!_Utils_eq(index, dragIndex)) && (!_Utils_eq(index, dropIndex))) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$Config$OperationsOnDrag$Swap$itemStyles(color),
						A2($author$project$Config$OperationsOnDrag$Swap$system.cU, index, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					])) : A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					$author$project$Config$OperationsOnDrag$Swap$itemStyles($author$project$Config$OperationsOnDrag$Swap$dropColor)),
				_List_Nil);
		} else {
			return A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$Config$OperationsOnDrag$Swap$itemStyles(color),
						A2($author$project$Config$OperationsOnDrag$Swap$system.cT, index, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					]));
		}
	});
var $author$project$Config$OperationsOnDrag$Swap$view = function (model) {
	return A2(
		$elm$html$Html$section,
		_List_fromArray(
			[
				$elm$html$Html$Events$onMouseDown($author$project$Config$OperationsOnDrag$Swap$ResetColors)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				$author$project$Config$OperationsOnDrag$Swap$containerStyles,
				A2(
					$elm$core$List$indexedMap,
					$author$project$Config$OperationsOnDrag$Swap$itemView(model.Q),
					model.au)),
				A2($author$project$Config$OperationsOnDrag$Swap$ghostView, model.Q, model.au)
			]));
};
var $author$project$Config$OperationsOnDrag$Unaltered$ResetColors = {$: 1};
var $author$project$Config$OperationsOnDrag$Unaltered$containerStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
		A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'center')
	]);
var $author$project$Config$OperationsOnDrag$Unaltered$itemStyles = function (color) {
	return _List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'background-color', color),
			A2($elm$html$Html$Attributes$style, 'color', 'white'),
			A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
			A2($elm$html$Html$Attributes$style, 'display', 'flex'),
			A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
			A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
			A2($elm$html$Html$Attributes$style, 'margin', '0 1.5em 1.5em 0'),
			A2($elm$html$Html$Attributes$style, 'width', '50px'),
			A2($elm$html$Html$Attributes$style, 'height', '50px')
		]);
};
var $author$project$Config$OperationsOnDrag$Unaltered$ghostView = F2(
	function (dnd, items) {
		var maybeDragItem = A2(
			$elm$core$Maybe$andThen,
			function (_v1) {
				var dragIndex = _v1.a9;
				return $elm$core$List$head(
					A2($elm$core$List$drop, dragIndex, items));
			},
			$author$project$Config$OperationsOnDrag$Unaltered$system.be(dnd));
		if (!maybeDragItem.$) {
			var value = maybeDragItem.a.aB;
			return A2(
				$elm$html$Html$div,
				_Utils_ap(
					$author$project$Config$OperationsOnDrag$Unaltered$itemStyles($author$project$Config$OperationsOnDrag$Unaltered$dragColor),
					$author$project$Config$OperationsOnDrag$Unaltered$system.c$(dnd)),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					]));
		} else {
			return $elm$html$Html$text('');
		}
	});
var $author$project$Config$OperationsOnDrag$Unaltered$itemView = F3(
	function (dnd, index, _v0) {
		var value = _v0.aB;
		var color = _v0.aV;
		var itemId = 'unaltered-' + value;
		var _v1 = $author$project$Config$OperationsOnDrag$Unaltered$system.be(dnd);
		if (!_v1.$) {
			var dragIndex = _v1.a.a9;
			var dropIndex = _v1.a.cV;
			return ((!_Utils_eq(index, dragIndex)) && (!_Utils_eq(index, dropIndex))) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$Config$OperationsOnDrag$Unaltered$itemStyles(color),
						A2($author$project$Config$OperationsOnDrag$Unaltered$system.cU, index, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					])) : (((!_Utils_eq(index, dragIndex)) && _Utils_eq(index, dropIndex)) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$Config$OperationsOnDrag$Unaltered$itemStyles($author$project$Config$OperationsOnDrag$Unaltered$dropColor),
						A2($author$project$Config$OperationsOnDrag$Unaltered$system.cU, index, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					])) : A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					$author$project$Config$OperationsOnDrag$Unaltered$itemStyles($author$project$Config$OperationsOnDrag$Unaltered$dropColor)),
				_List_Nil));
		} else {
			return A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$Config$OperationsOnDrag$Unaltered$itemStyles(color),
						A2($author$project$Config$OperationsOnDrag$Unaltered$system.cT, index, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					]));
		}
	});
var $author$project$Config$OperationsOnDrag$Unaltered$view = function (model) {
	return A2(
		$elm$html$Html$section,
		_List_fromArray(
			[
				$elm$html$Html$Events$onMouseDown($author$project$Config$OperationsOnDrag$Unaltered$ResetColors)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				$author$project$Config$OperationsOnDrag$Unaltered$containerStyles,
				A2(
					$elm$core$List$indexedMap,
					$author$project$Config$OperationsOnDrag$Unaltered$itemView(model.Q),
					model.au)),
				A2($author$project$Config$OperationsOnDrag$Unaltered$ghostView, model.Q, model.au)
			]));
};
var $author$project$Config$OperationsOnDrag$Root$demoView = function (example) {
	switch (example.$) {
		case 0:
			var mo = example.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Config$OperationsOnDrag$Root$InsertAfterMsg,
				$author$project$Config$OperationsOnDrag$InsertAfter$view(mo));
		case 1:
			var mo = example.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Config$OperationsOnDrag$Root$InsertBeforeMsg,
				$author$project$Config$OperationsOnDrag$InsertBefore$view(mo));
		case 2:
			var mo = example.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Config$OperationsOnDrag$Root$RotateMsg,
				$author$project$Config$OperationsOnDrag$Rotate$view(mo));
		case 3:
			var mo = example.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Config$OperationsOnDrag$Root$SwapMsg,
				$author$project$Config$OperationsOnDrag$Swap$view(mo));
		default:
			var mo = example.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Config$OperationsOnDrag$Root$UnalteredMsg,
				$author$project$Config$OperationsOnDrag$Unaltered$view(mo));
	}
};
var $author$project$Config$OperationsOnDrag$Root$info = function (example) {
	switch (example.$) {
		case 0:
			return 'Insert after';
		case 1:
			return 'Insert before';
		case 2:
			return 'Rotate';
		case 3:
			return 'Swap';
		default:
			return 'Unaltered';
	}
};
var $author$project$Config$OperationsOnDrag$Root$demoWrapperView = F3(
	function (currentId, id, example) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
					A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
					A2($elm$html$Html$Attributes$style, 'margin', '4em 0')
				]),
			_List_fromArray(
				[
					$author$project$Config$OperationsOnDrag$Root$demoView(example),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$classList(
							_List_fromArray(
								[
									_Utils_Tuple2('link', true),
									_Utils_Tuple2(
									'is-active',
									_Utils_eq(id, currentId))
								])),
							$elm$html$Html$Events$onClick(
							$author$project$Config$OperationsOnDrag$Root$LinkClicked(id))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							$author$project$Config$OperationsOnDrag$Root$info(example))
						]))
				]));
	});
var $author$project$Config$OperationsOnDrag$Root$view = function (model) {
	return A2(
		$elm$html$Html$section,
		_List_Nil,
		A2(
			$elm$core$List$indexedMap,
			$author$project$Config$OperationsOnDrag$Root$demoWrapperView(model.at),
			model.S));
};
var $author$project$Config$OperationsOnDrop$Root$LinkClicked = function (a) {
	return {$: 0, a: a};
};
var $author$project$Config$OperationsOnDrop$InsertAfter$ResetColors = {$: 1};
var $author$project$Config$OperationsOnDrop$InsertAfter$containerStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
		A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'center')
	]);
var $author$project$Config$OperationsOnDrop$InsertAfter$itemStyles = function (color) {
	return _List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'background-color', color),
			A2($elm$html$Html$Attributes$style, 'color', 'white'),
			A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
			A2($elm$html$Html$Attributes$style, 'display', 'flex'),
			A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
			A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
			A2($elm$html$Html$Attributes$style, 'margin', '0 1.5em 1.5em 0'),
			A2($elm$html$Html$Attributes$style, 'width', '50px'),
			A2($elm$html$Html$Attributes$style, 'height', '50px')
		]);
};
var $author$project$Config$OperationsOnDrop$InsertAfter$ghostView = F2(
	function (dnd, items) {
		var maybeDragItem = A2(
			$elm$core$Maybe$andThen,
			function (_v1) {
				var dragIndex = _v1.a9;
				return $elm$core$List$head(
					A2($elm$core$List$drop, dragIndex, items));
			},
			$author$project$Config$OperationsOnDrop$InsertAfter$system.be(dnd));
		if (!maybeDragItem.$) {
			var value = maybeDragItem.a.aB;
			return A2(
				$elm$html$Html$div,
				_Utils_ap(
					$author$project$Config$OperationsOnDrop$InsertAfter$itemStyles($author$project$Config$OperationsOnDrop$InsertAfter$dragColor),
					$author$project$Config$OperationsOnDrop$InsertAfter$system.c$(dnd)),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					]));
		} else {
			return $elm$html$Html$text('');
		}
	});
var $author$project$Config$OperationsOnDrop$InsertAfter$itemView = F3(
	function (dnd, index, _v0) {
		var value = _v0.aB;
		var color = _v0.aV;
		var itemId = 'insertafter-' + value;
		var _v1 = $author$project$Config$OperationsOnDrop$InsertAfter$system.be(dnd);
		if (!_v1.$) {
			var dragIndex = _v1.a.a9;
			var dropIndex = _v1.a.cV;
			return ((!_Utils_eq(index, dragIndex)) && (!_Utils_eq(index, dropIndex))) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$Config$OperationsOnDrop$InsertAfter$itemStyles(color),
						A2($author$project$Config$OperationsOnDrop$InsertAfter$system.cU, index, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					])) : (((!_Utils_eq(index, dragIndex)) && _Utils_eq(index, dropIndex)) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$Config$OperationsOnDrop$InsertAfter$itemStyles($author$project$Config$OperationsOnDrop$InsertAfter$dropColor),
						A2($author$project$Config$OperationsOnDrop$InsertAfter$system.cU, index, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					])) : A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					$author$project$Config$OperationsOnDrop$InsertAfter$itemStyles($author$project$Config$OperationsOnDrop$InsertAfter$dropColor)),
				_List_Nil));
		} else {
			return A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$Config$OperationsOnDrop$InsertAfter$itemStyles(color),
						A2($author$project$Config$OperationsOnDrop$InsertAfter$system.cT, index, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					]));
		}
	});
var $author$project$Config$OperationsOnDrop$InsertAfter$view = function (model) {
	return A2(
		$elm$html$Html$section,
		_List_fromArray(
			[
				$elm$html$Html$Events$onMouseDown($author$project$Config$OperationsOnDrop$InsertAfter$ResetColors)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				$author$project$Config$OperationsOnDrop$InsertAfter$containerStyles,
				A2(
					$elm$core$List$indexedMap,
					$author$project$Config$OperationsOnDrop$InsertAfter$itemView(model.Q),
					model.au)),
				A2($author$project$Config$OperationsOnDrop$InsertAfter$ghostView, model.Q, model.au)
			]));
};
var $author$project$Config$OperationsOnDrop$InsertBefore$ResetColors = {$: 1};
var $author$project$Config$OperationsOnDrop$InsertBefore$containerStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
		A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'center')
	]);
var $author$project$Config$OperationsOnDrop$InsertBefore$itemStyles = function (color) {
	return _List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'background-color', color),
			A2($elm$html$Html$Attributes$style, 'color', 'white'),
			A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
			A2($elm$html$Html$Attributes$style, 'display', 'flex'),
			A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
			A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
			A2($elm$html$Html$Attributes$style, 'margin', '0 1.5em 1.5em 0'),
			A2($elm$html$Html$Attributes$style, 'width', '50px'),
			A2($elm$html$Html$Attributes$style, 'height', '50px')
		]);
};
var $author$project$Config$OperationsOnDrop$InsertBefore$ghostView = F2(
	function (dnd, items) {
		var maybeDragItem = A2(
			$elm$core$Maybe$andThen,
			function (_v1) {
				var dragIndex = _v1.a9;
				return $elm$core$List$head(
					A2($elm$core$List$drop, dragIndex, items));
			},
			$author$project$Config$OperationsOnDrop$InsertBefore$system.be(dnd));
		if (!maybeDragItem.$) {
			var value = maybeDragItem.a.aB;
			return A2(
				$elm$html$Html$div,
				_Utils_ap(
					$author$project$Config$OperationsOnDrop$InsertBefore$itemStyles($author$project$Config$OperationsOnDrop$InsertBefore$dragColor),
					$author$project$Config$OperationsOnDrop$InsertBefore$system.c$(dnd)),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					]));
		} else {
			return $elm$html$Html$text('');
		}
	});
var $author$project$Config$OperationsOnDrop$InsertBefore$itemView = F3(
	function (dnd, index, _v0) {
		var value = _v0.aB;
		var color = _v0.aV;
		var itemId = 'insertbefore-' + value;
		var _v1 = $author$project$Config$OperationsOnDrop$InsertBefore$system.be(dnd);
		if (!_v1.$) {
			var dragIndex = _v1.a.a9;
			var dropIndex = _v1.a.cV;
			return ((!_Utils_eq(index, dragIndex)) && (!_Utils_eq(index, dropIndex))) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$Config$OperationsOnDrop$InsertBefore$itemStyles(color),
						A2($author$project$Config$OperationsOnDrop$InsertBefore$system.cU, index, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					])) : (((!_Utils_eq(index, dragIndex)) && _Utils_eq(index, dropIndex)) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$Config$OperationsOnDrop$InsertBefore$itemStyles($author$project$Config$OperationsOnDrop$InsertBefore$dropColor),
						A2($author$project$Config$OperationsOnDrop$InsertBefore$system.cU, index, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					])) : A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					$author$project$Config$OperationsOnDrop$InsertBefore$itemStyles($author$project$Config$OperationsOnDrop$InsertBefore$dropColor)),
				_List_Nil));
		} else {
			return A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$Config$OperationsOnDrop$InsertBefore$itemStyles(color),
						A2($author$project$Config$OperationsOnDrop$InsertBefore$system.cT, index, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					]));
		}
	});
var $author$project$Config$OperationsOnDrop$InsertBefore$view = function (model) {
	return A2(
		$elm$html$Html$section,
		_List_fromArray(
			[
				$elm$html$Html$Events$onMouseDown($author$project$Config$OperationsOnDrop$InsertBefore$ResetColors)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				$author$project$Config$OperationsOnDrop$InsertBefore$containerStyles,
				A2(
					$elm$core$List$indexedMap,
					$author$project$Config$OperationsOnDrop$InsertBefore$itemView(model.Q),
					model.au)),
				A2($author$project$Config$OperationsOnDrop$InsertBefore$ghostView, model.Q, model.au)
			]));
};
var $author$project$Config$OperationsOnDrop$Rotate$ResetColors = {$: 1};
var $author$project$Config$OperationsOnDrop$Rotate$containerStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
		A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'center')
	]);
var $author$project$Config$OperationsOnDrop$Rotate$itemStyles = function (color) {
	return _List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'background-color', color),
			A2($elm$html$Html$Attributes$style, 'color', 'white'),
			A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
			A2($elm$html$Html$Attributes$style, 'display', 'flex'),
			A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
			A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
			A2($elm$html$Html$Attributes$style, 'margin', '0 1.5em 1.5em 0'),
			A2($elm$html$Html$Attributes$style, 'width', '50px'),
			A2($elm$html$Html$Attributes$style, 'height', '50px')
		]);
};
var $author$project$Config$OperationsOnDrop$Rotate$ghostView = F2(
	function (dnd, items) {
		var maybeDragItem = A2(
			$elm$core$Maybe$andThen,
			function (_v1) {
				var dragIndex = _v1.a9;
				return $elm$core$List$head(
					A2($elm$core$List$drop, dragIndex, items));
			},
			$author$project$Config$OperationsOnDrop$Rotate$system.be(dnd));
		if (!maybeDragItem.$) {
			var value = maybeDragItem.a.aB;
			return A2(
				$elm$html$Html$div,
				_Utils_ap(
					$author$project$Config$OperationsOnDrop$Rotate$itemStyles($author$project$Config$OperationsOnDrop$Rotate$dragColor),
					$author$project$Config$OperationsOnDrop$Rotate$system.c$(dnd)),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					]));
		} else {
			return $elm$html$Html$text('');
		}
	});
var $author$project$Config$OperationsOnDrop$Rotate$itemView = F3(
	function (dnd, index, _v0) {
		var value = _v0.aB;
		var color = _v0.aV;
		var itemId = 'rotateout-' + value;
		var _v1 = $author$project$Config$OperationsOnDrop$Rotate$system.be(dnd);
		if (!_v1.$) {
			var dragIndex = _v1.a.a9;
			var dropIndex = _v1.a.cV;
			return ((!_Utils_eq(index, dragIndex)) && (!_Utils_eq(index, dropIndex))) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$Config$OperationsOnDrop$Rotate$itemStyles(color),
						A2($author$project$Config$OperationsOnDrop$Rotate$system.cU, index, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					])) : (((!_Utils_eq(index, dragIndex)) && _Utils_eq(index, dropIndex)) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$Config$OperationsOnDrop$Rotate$itemStyles($author$project$Config$OperationsOnDrop$Rotate$dropColor),
						A2($author$project$Config$OperationsOnDrop$Rotate$system.cU, index, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					])) : A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					$author$project$Config$OperationsOnDrop$Rotate$itemStyles($author$project$Config$OperationsOnDrop$Rotate$dropColor)),
				_List_Nil));
		} else {
			return A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$Config$OperationsOnDrop$Rotate$itemStyles(color),
						A2($author$project$Config$OperationsOnDrop$Rotate$system.cT, index, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					]));
		}
	});
var $author$project$Config$OperationsOnDrop$Rotate$view = function (model) {
	return A2(
		$elm$html$Html$section,
		_List_fromArray(
			[
				$elm$html$Html$Events$onMouseDown($author$project$Config$OperationsOnDrop$Rotate$ResetColors)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				$author$project$Config$OperationsOnDrop$Rotate$containerStyles,
				A2(
					$elm$core$List$indexedMap,
					$author$project$Config$OperationsOnDrop$Rotate$itemView(model.Q),
					model.au)),
				A2($author$project$Config$OperationsOnDrop$Rotate$ghostView, model.Q, model.au)
			]));
};
var $author$project$Config$OperationsOnDrop$Swap$ResetColors = {$: 1};
var $author$project$Config$OperationsOnDrop$Swap$containerStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
		A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'center')
	]);
var $author$project$Config$OperationsOnDrop$Swap$itemStyles = function (color) {
	return _List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'background-color', color),
			A2($elm$html$Html$Attributes$style, 'color', 'white'),
			A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
			A2($elm$html$Html$Attributes$style, 'display', 'flex'),
			A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
			A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
			A2($elm$html$Html$Attributes$style, 'margin', '0 1.5em 1.5em 0'),
			A2($elm$html$Html$Attributes$style, 'width', '50px'),
			A2($elm$html$Html$Attributes$style, 'height', '50px')
		]);
};
var $author$project$Config$OperationsOnDrop$Swap$ghostView = F2(
	function (dnd, items) {
		var maybeDragItem = A2(
			$elm$core$Maybe$andThen,
			function (_v1) {
				var dragIndex = _v1.a9;
				return $elm$core$List$head(
					A2($elm$core$List$drop, dragIndex, items));
			},
			$author$project$Config$OperationsOnDrop$Swap$system.be(dnd));
		if (!maybeDragItem.$) {
			var value = maybeDragItem.a.aB;
			return A2(
				$elm$html$Html$div,
				_Utils_ap(
					$author$project$Config$OperationsOnDrop$Swap$itemStyles($author$project$Config$OperationsOnDrop$Swap$dragColor),
					$author$project$Config$OperationsOnDrop$Swap$system.c$(dnd)),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					]));
		} else {
			return $elm$html$Html$text('');
		}
	});
var $author$project$Config$OperationsOnDrop$Swap$itemView = F3(
	function (dnd, index, _v0) {
		var value = _v0.aB;
		var color = _v0.aV;
		var itemId = 'swap-' + value;
		var _v1 = $author$project$Config$OperationsOnDrop$Swap$system.be(dnd);
		if (!_v1.$) {
			var dragIndex = _v1.a.a9;
			var dropIndex = _v1.a.cV;
			return ((!_Utils_eq(index, dragIndex)) && (!_Utils_eq(index, dropIndex))) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$Config$OperationsOnDrop$Swap$itemStyles(color),
						A2($author$project$Config$OperationsOnDrop$Swap$system.cU, index, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					])) : (((!_Utils_eq(index, dragIndex)) && _Utils_eq(index, dropIndex)) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$Config$OperationsOnDrop$Swap$itemStyles($author$project$Config$OperationsOnDrop$Swap$dropColor),
						A2($author$project$Config$OperationsOnDrop$Swap$system.cU, index, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					])) : A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					$author$project$Config$OperationsOnDrop$Swap$itemStyles($author$project$Config$OperationsOnDrop$Swap$dropColor)),
				_List_Nil));
		} else {
			return A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$Config$OperationsOnDrop$Swap$itemStyles(color),
						A2($author$project$Config$OperationsOnDrop$Swap$system.cT, index, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					]));
		}
	});
var $author$project$Config$OperationsOnDrop$Swap$view = function (model) {
	return A2(
		$elm$html$Html$section,
		_List_fromArray(
			[
				$elm$html$Html$Events$onMouseDown($author$project$Config$OperationsOnDrop$Swap$ResetColors)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				$author$project$Config$OperationsOnDrop$Swap$containerStyles,
				A2(
					$elm$core$List$indexedMap,
					$author$project$Config$OperationsOnDrop$Swap$itemView(model.Q),
					model.au)),
				A2($author$project$Config$OperationsOnDrop$Swap$ghostView, model.Q, model.au)
			]));
};
var $author$project$Config$OperationsOnDrop$Unaltered$ResetColors = {$: 1};
var $author$project$Config$OperationsOnDrop$Unaltered$containerStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
		A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'center')
	]);
var $author$project$Config$OperationsOnDrop$Unaltered$itemStyles = function (color) {
	return _List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'background-color', color),
			A2($elm$html$Html$Attributes$style, 'color', 'white'),
			A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
			A2($elm$html$Html$Attributes$style, 'display', 'flex'),
			A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
			A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
			A2($elm$html$Html$Attributes$style, 'margin', '0 1.5em 1.5em 0'),
			A2($elm$html$Html$Attributes$style, 'width', '50px'),
			A2($elm$html$Html$Attributes$style, 'height', '50px')
		]);
};
var $author$project$Config$OperationsOnDrop$Unaltered$ghostView = F2(
	function (dnd, items) {
		var maybeDragItem = A2(
			$elm$core$Maybe$andThen,
			function (_v1) {
				var dragIndex = _v1.a9;
				return $elm$core$List$head(
					A2($elm$core$List$drop, dragIndex, items));
			},
			$author$project$Config$OperationsOnDrop$Unaltered$system.be(dnd));
		if (!maybeDragItem.$) {
			var value = maybeDragItem.a.aB;
			return A2(
				$elm$html$Html$div,
				_Utils_ap(
					$author$project$Config$OperationsOnDrop$Unaltered$itemStyles($author$project$Config$OperationsOnDrop$Unaltered$dragColor),
					$author$project$Config$OperationsOnDrop$Unaltered$system.c$(dnd)),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					]));
		} else {
			return $elm$html$Html$text('');
		}
	});
var $author$project$Config$OperationsOnDrop$Unaltered$itemView = F3(
	function (dnd, index, _v0) {
		var value = _v0.aB;
		var color = _v0.aV;
		var itemId = 'unaltered-' + value;
		var _v1 = $author$project$Config$OperationsOnDrop$Unaltered$system.be(dnd);
		if (!_v1.$) {
			var dragIndex = _v1.a.a9;
			var dropIndex = _v1.a.cV;
			return ((!_Utils_eq(index, dragIndex)) && (!_Utils_eq(index, dropIndex))) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$Config$OperationsOnDrop$Unaltered$itemStyles(color),
						A2($author$project$Config$OperationsOnDrop$Unaltered$system.cU, index, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					])) : (((!_Utils_eq(index, dragIndex)) && _Utils_eq(index, dropIndex)) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$Config$OperationsOnDrop$Unaltered$itemStyles($author$project$Config$OperationsOnDrop$Unaltered$dropColor),
						A2($author$project$Config$OperationsOnDrop$Unaltered$system.cU, index, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					])) : A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					$author$project$Config$OperationsOnDrop$Unaltered$itemStyles($author$project$Config$OperationsOnDrop$Unaltered$dropColor)),
				_List_Nil));
		} else {
			return A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$Config$OperationsOnDrop$Unaltered$itemStyles(color),
						A2($author$project$Config$OperationsOnDrop$Unaltered$system.cT, index, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					]));
		}
	});
var $author$project$Config$OperationsOnDrop$Unaltered$view = function (model) {
	return A2(
		$elm$html$Html$section,
		_List_fromArray(
			[
				$elm$html$Html$Events$onMouseDown($author$project$Config$OperationsOnDrop$Unaltered$ResetColors)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				$author$project$Config$OperationsOnDrop$Unaltered$containerStyles,
				A2(
					$elm$core$List$indexedMap,
					$author$project$Config$OperationsOnDrop$Unaltered$itemView(model.Q),
					model.au)),
				A2($author$project$Config$OperationsOnDrop$Unaltered$ghostView, model.Q, model.au)
			]));
};
var $author$project$Config$OperationsOnDrop$Root$demoView = function (example) {
	switch (example.$) {
		case 0:
			var mo = example.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Config$OperationsOnDrop$Root$InsertAfterMsg,
				$author$project$Config$OperationsOnDrop$InsertAfter$view(mo));
		case 1:
			var mo = example.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Config$OperationsOnDrop$Root$InsertBeforeMsg,
				$author$project$Config$OperationsOnDrop$InsertBefore$view(mo));
		case 2:
			var mo = example.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Config$OperationsOnDrop$Root$RotateMsg,
				$author$project$Config$OperationsOnDrop$Rotate$view(mo));
		case 3:
			var mo = example.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Config$OperationsOnDrop$Root$SwapMsg,
				$author$project$Config$OperationsOnDrop$Swap$view(mo));
		default:
			var mo = example.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Config$OperationsOnDrop$Root$UnalteredMsg,
				$author$project$Config$OperationsOnDrop$Unaltered$view(mo));
	}
};
var $author$project$Config$OperationsOnDrop$Root$info = function (example) {
	switch (example.$) {
		case 0:
			return 'Insert after';
		case 1:
			return 'Insert before';
		case 2:
			return 'Rotate';
		case 3:
			return 'Swap';
		default:
			return 'Unaltered';
	}
};
var $author$project$Config$OperationsOnDrop$Root$demoWrapperView = F3(
	function (currentId, id, example) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
					A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
					A2($elm$html$Html$Attributes$style, 'margin', '4em 0')
				]),
			_List_fromArray(
				[
					$author$project$Config$OperationsOnDrop$Root$demoView(example),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$classList(
							_List_fromArray(
								[
									_Utils_Tuple2('link', true),
									_Utils_Tuple2(
									'is-active',
									_Utils_eq(id, currentId))
								])),
							$elm$html$Html$Events$onClick(
							$author$project$Config$OperationsOnDrop$Root$LinkClicked(id))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							$author$project$Config$OperationsOnDrop$Root$info(example))
						]))
				]));
	});
var $author$project$Config$OperationsOnDrop$Root$view = function (model) {
	return A2(
		$elm$html$Html$section,
		_List_Nil,
		A2(
			$elm$core$List$indexedMap,
			$author$project$Config$OperationsOnDrop$Root$demoWrapperView(model.at),
			model.S));
};
var $author$project$Config$Root$demoView = function (model) {
	switch (model.$) {
		case 0:
			var mo = model.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Config$Root$MovementMsg,
				$author$project$Config$Movement$Root$view(mo));
		case 1:
			var mo = model.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Config$Root$OperationsOnDragMsg,
				$author$project$Config$OperationsOnDrag$Root$view(mo));
		default:
			var mo = model.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Config$Root$OperationsOnDropMsg,
				$author$project$Config$OperationsOnDrop$Root$view(mo));
	}
};
var $author$project$ConfigGroups$OperationsOnDrag$Root$LinkClicked = function (a) {
	return {$: 0, a: a};
};
var $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$ResetColors = {$: 1};
var $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$itemStyles = function (color) {
	return _List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'width', '50px'),
			A2($elm$html$Html$Attributes$style, 'height', '50px'),
			A2($elm$html$Html$Attributes$style, 'color', 'white'),
			A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
			A2($elm$html$Html$Attributes$style, 'margin-right', '1.5rem'),
			A2($elm$html$Html$Attributes$style, 'display', 'flex'),
			A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
			A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
			A2($elm$html$Html$Attributes$style, 'background-color', color)
		]);
};
var $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$maybeDragItem = function (_v0) {
	var dnd = _v0.Q;
	var items = _v0.au;
	return A2(
		$elm$core$Maybe$andThen,
		function (_v1) {
			var dragIndex = _v1.a9;
			return $elm$core$List$head(
				A2($elm$core$List$drop, dragIndex, items));
		},
		$author$project$ConfigGroups$OperationsOnDrag$InsertAfter$system.be(dnd));
};
var $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$ghostView = function (model) {
	var _v0 = $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$maybeDragItem(model);
	if (!_v0.$) {
		var value = _v0.a.aB;
		return A2(
			$elm$html$Html$div,
			_Utils_ap(
				$author$project$ConfigGroups$OperationsOnDrag$InsertAfter$itemStyles($author$project$ConfigGroups$OperationsOnDrag$InsertAfter$dragColor),
				$author$project$ConfigGroups$OperationsOnDrag$InsertAfter$system.c$(model.Q)),
			_List_fromArray(
				[
					$elm$html$Html$text(value)
				]));
	} else {
		return $elm$html$Html$text('');
	}
};
var $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$calculateOffset = F3(
	function (index, group, list) {
		calculateOffset:
		while (true) {
			if (!list.b) {
				return 0;
			} else {
				var x = list.a;
				var xs = list.b;
				if (_Utils_eq(x.t, group)) {
					return index;
				} else {
					var $temp$index = index + 1,
						$temp$group = group,
						$temp$list = xs;
					index = $temp$index;
					group = $temp$group;
					list = $temp$list;
					continue calculateOffset;
				}
			}
		}
	});
var $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$groupStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
		A2($elm$html$Html$Attributes$style, 'padding-bottom', '4rem')
	]);
var $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$auxiliaryItemStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'flex-grow', '1'),
		A2($elm$html$Html$Attributes$style, 'box-sizing', 'border-box'),
		A2($elm$html$Html$Attributes$style, 'margin-right', '1.5rem'),
		A2($elm$html$Html$Attributes$style, 'width', 'auto'),
		A2($elm$html$Html$Attributes$style, 'height', '50px'),
		A2($elm$html$Html$Attributes$style, 'min-width', '50px'),
		A2($elm$html$Html$Attributes$style, 'border', '3px dashed gray'),
		A2($elm$html$Html$Attributes$style, 'background-color', 'transparent')
	]);
var $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$itemView = F4(
	function (model, offset, localIndex, _v0) {
		var group = _v0.t;
		var value = _v0.aB;
		var color = _v0.aV;
		var globalIndex = offset + localIndex;
		var itemId = 'insertafter-' + $elm$core$String$fromInt(globalIndex);
		var _v1 = _Utils_Tuple2(
			$author$project$ConfigGroups$OperationsOnDrag$InsertAfter$system.be(model.Q),
			$author$project$ConfigGroups$OperationsOnDrag$InsertAfter$maybeDragItem(model));
		if ((!_v1.a.$) && (!_v1.b.$)) {
			var dragIndex = _v1.a.a.a9;
			var dropIndex = _v1.a.a.cV;
			var dragItem = _v1.b.a;
			return ((value === '') && (!_Utils_eq(group, dragItem.t))) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$ConfigGroups$OperationsOnDrag$InsertAfter$auxiliaryItemStyles,
						A2($author$project$ConfigGroups$OperationsOnDrag$InsertAfter$system.cU, globalIndex, itemId))),
				_List_Nil) : (((value === '') && _Utils_eq(group, dragItem.t)) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					$author$project$ConfigGroups$OperationsOnDrag$InsertAfter$auxiliaryItemStyles),
				_List_Nil) : (((!_Utils_eq(globalIndex, dragIndex)) && (!_Utils_eq(globalIndex, dropIndex))) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$ConfigGroups$OperationsOnDrag$InsertAfter$itemStyles(color),
						A2($author$project$ConfigGroups$OperationsOnDrag$InsertAfter$system.cU, globalIndex, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					])) : (((!_Utils_eq(globalIndex, dragIndex)) && _Utils_eq(globalIndex, dropIndex)) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$ConfigGroups$OperationsOnDrag$InsertAfter$itemStyles($author$project$ConfigGroups$OperationsOnDrag$InsertAfter$dropColor),
						A2($author$project$ConfigGroups$OperationsOnDrag$InsertAfter$system.cU, globalIndex, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					])) : A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					$author$project$ConfigGroups$OperationsOnDrag$InsertAfter$itemStyles($author$project$ConfigGroups$OperationsOnDrag$InsertAfter$dropColor)),
				_List_Nil))));
		} else {
			return (value === '') ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					$author$project$ConfigGroups$OperationsOnDrag$InsertAfter$auxiliaryItemStyles),
				_List_Nil) : A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$ConfigGroups$OperationsOnDrag$InsertAfter$itemStyles(color),
						A2($author$project$ConfigGroups$OperationsOnDrag$InsertAfter$system.cT, globalIndex, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					]));
		}
	});
var $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$groupView = F2(
	function (model, currentGroup) {
		return A2(
			$elm$html$Html$div,
			$author$project$ConfigGroups$OperationsOnDrag$InsertAfter$groupStyles,
			A2(
				$elm$core$List$indexedMap,
				A2(
					$author$project$ConfigGroups$OperationsOnDrag$InsertAfter$itemView,
					model,
					A3($author$project$ConfigGroups$OperationsOnDrag$InsertAfter$calculateOffset, 0, currentGroup, model.au)),
				A2(
					$elm$core$List$filter,
					function (_v0) {
						var group = _v0.t;
						return _Utils_eq(group, currentGroup);
					},
					model.au)));
	});
var $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$sectionStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
		A2($elm$html$Html$Attributes$style, 'width', '800px')
	]);
var $author$project$ConfigGroups$OperationsOnDrag$InsertAfter$view = function (model) {
	return A2(
		$elm$html$Html$section,
		A2(
			$elm$core$List$cons,
			$elm$html$Html$Events$onMouseDown($author$project$ConfigGroups$OperationsOnDrag$InsertAfter$ResetColors),
			$author$project$ConfigGroups$OperationsOnDrag$InsertAfter$sectionStyles),
		_List_fromArray(
			[
				A2($author$project$ConfigGroups$OperationsOnDrag$InsertAfter$groupView, model, 1),
				A2($author$project$ConfigGroups$OperationsOnDrag$InsertAfter$groupView, model, 2),
				A2($author$project$ConfigGroups$OperationsOnDrag$InsertAfter$groupView, model, 3),
				$author$project$ConfigGroups$OperationsOnDrag$InsertAfter$ghostView(model)
			]));
};
var $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$ResetColors = {$: 1};
var $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$itemStyles = function (color) {
	return _List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'width', '50px'),
			A2($elm$html$Html$Attributes$style, 'height', '50px'),
			A2($elm$html$Html$Attributes$style, 'color', 'white'),
			A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
			A2($elm$html$Html$Attributes$style, 'margin-right', '1.5rem'),
			A2($elm$html$Html$Attributes$style, 'display', 'flex'),
			A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
			A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
			A2($elm$html$Html$Attributes$style, 'background-color', color)
		]);
};
var $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$maybeDragItem = function (_v0) {
	var dnd = _v0.Q;
	var items = _v0.au;
	return A2(
		$elm$core$Maybe$andThen,
		function (_v1) {
			var dragIndex = _v1.a9;
			return $elm$core$List$head(
				A2($elm$core$List$drop, dragIndex, items));
		},
		$author$project$ConfigGroups$OperationsOnDrag$InsertBefore$system.be(dnd));
};
var $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$ghostView = function (model) {
	var _v0 = $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$maybeDragItem(model);
	if (!_v0.$) {
		var value = _v0.a.aB;
		return A2(
			$elm$html$Html$div,
			_Utils_ap(
				$author$project$ConfigGroups$OperationsOnDrag$InsertBefore$itemStyles($author$project$ConfigGroups$OperationsOnDrag$InsertBefore$dragColor),
				$author$project$ConfigGroups$OperationsOnDrag$InsertBefore$system.c$(model.Q)),
			_List_fromArray(
				[
					$elm$html$Html$text(value)
				]));
	} else {
		return $elm$html$Html$text('');
	}
};
var $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$calculateOffset = F3(
	function (index, group, list) {
		calculateOffset:
		while (true) {
			if (!list.b) {
				return 0;
			} else {
				var x = list.a;
				var xs = list.b;
				if (_Utils_eq(x.t, group)) {
					return index;
				} else {
					var $temp$index = index + 1,
						$temp$group = group,
						$temp$list = xs;
					index = $temp$index;
					group = $temp$group;
					list = $temp$list;
					continue calculateOffset;
				}
			}
		}
	});
var $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$groupStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
		A2($elm$html$Html$Attributes$style, 'padding-bottom', '4rem')
	]);
var $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$auxiliaryItemStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'flex-grow', '1'),
		A2($elm$html$Html$Attributes$style, 'box-sizing', 'border-box'),
		A2($elm$html$Html$Attributes$style, 'margin-right', '1.5rem'),
		A2($elm$html$Html$Attributes$style, 'width', 'auto'),
		A2($elm$html$Html$Attributes$style, 'height', '50px'),
		A2($elm$html$Html$Attributes$style, 'min-width', '50px'),
		A2($elm$html$Html$Attributes$style, 'border', '3px dashed gray'),
		A2($elm$html$Html$Attributes$style, 'background-color', 'transparent')
	]);
var $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$itemView = F4(
	function (model, offset, localIndex, _v0) {
		var group = _v0.t;
		var value = _v0.aB;
		var color = _v0.aV;
		var globalIndex = offset + localIndex;
		var itemId = 'insertbefore-' + $elm$core$String$fromInt(globalIndex);
		var _v1 = _Utils_Tuple2(
			$author$project$ConfigGroups$OperationsOnDrag$InsertBefore$system.be(model.Q),
			$author$project$ConfigGroups$OperationsOnDrag$InsertBefore$maybeDragItem(model));
		if ((!_v1.a.$) && (!_v1.b.$)) {
			var dragIndex = _v1.a.a.a9;
			var dropIndex = _v1.a.a.cV;
			var dragItem = _v1.b.a;
			return ((value === '') && (!_Utils_eq(group, dragItem.t))) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$ConfigGroups$OperationsOnDrag$InsertBefore$auxiliaryItemStyles,
						A2($author$project$ConfigGroups$OperationsOnDrag$InsertBefore$system.cU, globalIndex, itemId))),
				_List_Nil) : (((value === '') && _Utils_eq(group, dragItem.t)) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					$author$project$ConfigGroups$OperationsOnDrag$InsertBefore$auxiliaryItemStyles),
				_List_Nil) : (((!_Utils_eq(globalIndex, dragIndex)) && (!_Utils_eq(globalIndex, dropIndex))) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$ConfigGroups$OperationsOnDrag$InsertBefore$itemStyles(color),
						A2($author$project$ConfigGroups$OperationsOnDrag$InsertBefore$system.cU, globalIndex, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					])) : (((!_Utils_eq(globalIndex, dragIndex)) && _Utils_eq(globalIndex, dropIndex)) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$ConfigGroups$OperationsOnDrag$InsertBefore$itemStyles($author$project$ConfigGroups$OperationsOnDrag$InsertBefore$dropColor),
						A2($author$project$ConfigGroups$OperationsOnDrag$InsertBefore$system.cU, globalIndex, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					])) : A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					$author$project$ConfigGroups$OperationsOnDrag$InsertBefore$itemStyles($author$project$ConfigGroups$OperationsOnDrag$InsertBefore$dropColor)),
				_List_Nil))));
		} else {
			return (value === '') ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					$author$project$ConfigGroups$OperationsOnDrag$InsertBefore$auxiliaryItemStyles),
				_List_Nil) : A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$ConfigGroups$OperationsOnDrag$InsertBefore$itemStyles(color),
						A2($author$project$ConfigGroups$OperationsOnDrag$InsertBefore$system.cT, globalIndex, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					]));
		}
	});
var $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$groupView = F2(
	function (model, currentGroup) {
		return A2(
			$elm$html$Html$div,
			$author$project$ConfigGroups$OperationsOnDrag$InsertBefore$groupStyles,
			A2(
				$elm$core$List$indexedMap,
				A2(
					$author$project$ConfigGroups$OperationsOnDrag$InsertBefore$itemView,
					model,
					A3($author$project$ConfigGroups$OperationsOnDrag$InsertBefore$calculateOffset, 0, currentGroup, model.au)),
				A2(
					$elm$core$List$filter,
					function (_v0) {
						var group = _v0.t;
						return _Utils_eq(group, currentGroup);
					},
					model.au)));
	});
var $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$sectionStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
		A2($elm$html$Html$Attributes$style, 'width', '800px')
	]);
var $author$project$ConfigGroups$OperationsOnDrag$InsertBefore$view = function (model) {
	return A2(
		$elm$html$Html$section,
		A2(
			$elm$core$List$cons,
			$elm$html$Html$Events$onMouseDown($author$project$ConfigGroups$OperationsOnDrag$InsertBefore$ResetColors),
			$author$project$ConfigGroups$OperationsOnDrag$InsertBefore$sectionStyles),
		_List_fromArray(
			[
				A2($author$project$ConfigGroups$OperationsOnDrag$InsertBefore$groupView, model, 1),
				A2($author$project$ConfigGroups$OperationsOnDrag$InsertBefore$groupView, model, 2),
				A2($author$project$ConfigGroups$OperationsOnDrag$InsertBefore$groupView, model, 3),
				$author$project$ConfigGroups$OperationsOnDrag$InsertBefore$ghostView(model)
			]));
};
var $author$project$ConfigGroups$OperationsOnDrag$Rotate$ResetColors = {$: 1};
var $author$project$ConfigGroups$OperationsOnDrag$Rotate$itemStyles = function (color) {
	return _List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'width', '50px'),
			A2($elm$html$Html$Attributes$style, 'height', '50px'),
			A2($elm$html$Html$Attributes$style, 'color', 'white'),
			A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
			A2($elm$html$Html$Attributes$style, 'margin-right', '1.5rem'),
			A2($elm$html$Html$Attributes$style, 'display', 'flex'),
			A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
			A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
			A2($elm$html$Html$Attributes$style, 'background-color', color)
		]);
};
var $author$project$ConfigGroups$OperationsOnDrag$Rotate$maybeDragItem = function (_v0) {
	var dnd = _v0.Q;
	var items = _v0.au;
	return A2(
		$elm$core$Maybe$andThen,
		function (_v1) {
			var dragIndex = _v1.a9;
			return $elm$core$List$head(
				A2($elm$core$List$drop, dragIndex, items));
		},
		$author$project$ConfigGroups$OperationsOnDrag$Rotate$system.be(dnd));
};
var $author$project$ConfigGroups$OperationsOnDrag$Rotate$ghostView = function (model) {
	var _v0 = $author$project$ConfigGroups$OperationsOnDrag$Rotate$maybeDragItem(model);
	if (!_v0.$) {
		var value = _v0.a.aB;
		return A2(
			$elm$html$Html$div,
			_Utils_ap(
				$author$project$ConfigGroups$OperationsOnDrag$Rotate$itemStyles($author$project$ConfigGroups$OperationsOnDrag$Rotate$dragColor),
				$author$project$ConfigGroups$OperationsOnDrag$Rotate$system.c$(model.Q)),
			_List_fromArray(
				[
					$elm$html$Html$text(value)
				]));
	} else {
		return $elm$html$Html$text('');
	}
};
var $author$project$ConfigGroups$OperationsOnDrag$Rotate$calculateOffset = F3(
	function (index, group, list) {
		calculateOffset:
		while (true) {
			if (!list.b) {
				return 0;
			} else {
				var x = list.a;
				var xs = list.b;
				if (_Utils_eq(x.t, group)) {
					return index;
				} else {
					var $temp$index = index + 1,
						$temp$group = group,
						$temp$list = xs;
					index = $temp$index;
					group = $temp$group;
					list = $temp$list;
					continue calculateOffset;
				}
			}
		}
	});
var $author$project$ConfigGroups$OperationsOnDrag$Rotate$groupStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
		A2($elm$html$Html$Attributes$style, 'padding-bottom', '4rem')
	]);
var $author$project$ConfigGroups$OperationsOnDrag$Rotate$itemView = F4(
	function (model, offset, localIndex, _v0) {
		var value = _v0.aB;
		var color = _v0.aV;
		var globalIndex = offset + localIndex;
		var itemId = 'rotate-' + $elm$core$String$fromInt(globalIndex);
		var _v1 = $author$project$ConfigGroups$OperationsOnDrag$Rotate$system.be(model.Q);
		if (!_v1.$) {
			var dragIndex = _v1.a.a9;
			var dropIndex = _v1.a.cV;
			return ((!_Utils_eq(globalIndex, dragIndex)) && (!_Utils_eq(globalIndex, dropIndex))) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$ConfigGroups$OperationsOnDrag$Rotate$itemStyles(color),
						A2($author$project$ConfigGroups$OperationsOnDrag$Rotate$system.cU, globalIndex, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					])) : A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					$author$project$ConfigGroups$OperationsOnDrag$Rotate$itemStyles($author$project$ConfigGroups$OperationsOnDrag$Rotate$dropColor)),
				_List_Nil);
		} else {
			return A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$ConfigGroups$OperationsOnDrag$Rotate$itemStyles(color),
						A2($author$project$ConfigGroups$OperationsOnDrag$Rotate$system.cT, globalIndex, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					]));
		}
	});
var $author$project$ConfigGroups$OperationsOnDrag$Rotate$groupView = F2(
	function (model, currentGroup) {
		return A2(
			$elm$html$Html$div,
			$author$project$ConfigGroups$OperationsOnDrag$Rotate$groupStyles,
			A2(
				$elm$core$List$indexedMap,
				A2(
					$author$project$ConfigGroups$OperationsOnDrag$Rotate$itemView,
					model,
					A3($author$project$ConfigGroups$OperationsOnDrag$Rotate$calculateOffset, 0, currentGroup, model.au)),
				A2(
					$elm$core$List$filter,
					function (_v0) {
						var group = _v0.t;
						return _Utils_eq(group, currentGroup);
					},
					model.au)));
	});
var $author$project$ConfigGroups$OperationsOnDrag$Rotate$sectionStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
		A2($elm$html$Html$Attributes$style, 'width', '800px')
	]);
var $author$project$ConfigGroups$OperationsOnDrag$Rotate$view = function (model) {
	return A2(
		$elm$html$Html$section,
		A2(
			$elm$core$List$cons,
			$elm$html$Html$Events$onMouseDown($author$project$ConfigGroups$OperationsOnDrag$Rotate$ResetColors),
			$author$project$ConfigGroups$OperationsOnDrag$Rotate$sectionStyles),
		_List_fromArray(
			[
				A2($author$project$ConfigGroups$OperationsOnDrag$Rotate$groupView, model, 1),
				A2($author$project$ConfigGroups$OperationsOnDrag$Rotate$groupView, model, 2),
				A2($author$project$ConfigGroups$OperationsOnDrag$Rotate$groupView, model, 3),
				$author$project$ConfigGroups$OperationsOnDrag$Rotate$ghostView(model)
			]));
};
var $author$project$ConfigGroups$OperationsOnDrag$Swap$ResetColors = {$: 1};
var $author$project$ConfigGroups$OperationsOnDrag$Swap$itemStyles = function (color) {
	return _List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'width', '50px'),
			A2($elm$html$Html$Attributes$style, 'height', '50px'),
			A2($elm$html$Html$Attributes$style, 'color', 'white'),
			A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
			A2($elm$html$Html$Attributes$style, 'margin-right', '1.5rem'),
			A2($elm$html$Html$Attributes$style, 'display', 'flex'),
			A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
			A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
			A2($elm$html$Html$Attributes$style, 'background-color', color)
		]);
};
var $author$project$ConfigGroups$OperationsOnDrag$Swap$maybeDragItem = function (_v0) {
	var dnd = _v0.Q;
	var items = _v0.au;
	return A2(
		$elm$core$Maybe$andThen,
		function (_v1) {
			var dragIndex = _v1.a9;
			return $elm$core$List$head(
				A2($elm$core$List$drop, dragIndex, items));
		},
		$author$project$ConfigGroups$OperationsOnDrag$Swap$system.be(dnd));
};
var $author$project$ConfigGroups$OperationsOnDrag$Swap$ghostView = function (model) {
	var _v0 = $author$project$ConfigGroups$OperationsOnDrag$Swap$maybeDragItem(model);
	if (!_v0.$) {
		var value = _v0.a.aB;
		return A2(
			$elm$html$Html$div,
			_Utils_ap(
				$author$project$ConfigGroups$OperationsOnDrag$Swap$itemStyles($author$project$ConfigGroups$OperationsOnDrag$Swap$dragColor),
				$author$project$ConfigGroups$OperationsOnDrag$Swap$system.c$(model.Q)),
			_List_fromArray(
				[
					$elm$html$Html$text(value)
				]));
	} else {
		return $elm$html$Html$text('');
	}
};
var $author$project$ConfigGroups$OperationsOnDrag$Swap$calculateOffset = F3(
	function (index, group, list) {
		calculateOffset:
		while (true) {
			if (!list.b) {
				return 0;
			} else {
				var x = list.a;
				var xs = list.b;
				if (_Utils_eq(x.t, group)) {
					return index;
				} else {
					var $temp$index = index + 1,
						$temp$group = group,
						$temp$list = xs;
					index = $temp$index;
					group = $temp$group;
					list = $temp$list;
					continue calculateOffset;
				}
			}
		}
	});
var $author$project$ConfigGroups$OperationsOnDrag$Swap$groupStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
		A2($elm$html$Html$Attributes$style, 'padding-bottom', '4rem')
	]);
var $author$project$ConfigGroups$OperationsOnDrag$Swap$itemView = F4(
	function (model, offset, localIndex, _v0) {
		var value = _v0.aB;
		var color = _v0.aV;
		var globalIndex = offset + localIndex;
		var itemId = 'swap-' + $elm$core$String$fromInt(globalIndex);
		var _v1 = $author$project$ConfigGroups$OperationsOnDrag$Swap$system.be(model.Q);
		if (!_v1.$) {
			var dragIndex = _v1.a.a9;
			var dropIndex = _v1.a.cV;
			return ((!_Utils_eq(globalIndex, dragIndex)) && (!_Utils_eq(globalIndex, dropIndex))) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$ConfigGroups$OperationsOnDrag$Swap$itemStyles(color),
						A2($author$project$ConfigGroups$OperationsOnDrag$Swap$system.cU, globalIndex, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					])) : A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					$author$project$ConfigGroups$OperationsOnDrag$Swap$itemStyles($author$project$ConfigGroups$OperationsOnDrag$Swap$dropColor)),
				_List_Nil);
		} else {
			return A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$ConfigGroups$OperationsOnDrag$Swap$itemStyles(color),
						A2($author$project$ConfigGroups$OperationsOnDrag$Swap$system.cT, globalIndex, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					]));
		}
	});
var $author$project$ConfigGroups$OperationsOnDrag$Swap$groupView = F2(
	function (model, currentGroup) {
		return A2(
			$elm$html$Html$div,
			$author$project$ConfigGroups$OperationsOnDrag$Swap$groupStyles,
			A2(
				$elm$core$List$indexedMap,
				A2(
					$author$project$ConfigGroups$OperationsOnDrag$Swap$itemView,
					model,
					A3($author$project$ConfigGroups$OperationsOnDrag$Swap$calculateOffset, 0, currentGroup, model.au)),
				A2(
					$elm$core$List$filter,
					function (_v0) {
						var group = _v0.t;
						return _Utils_eq(group, currentGroup);
					},
					model.au)));
	});
var $author$project$ConfigGroups$OperationsOnDrag$Swap$sectionStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
		A2($elm$html$Html$Attributes$style, 'width', '800px')
	]);
var $author$project$ConfigGroups$OperationsOnDrag$Swap$view = function (model) {
	return A2(
		$elm$html$Html$section,
		A2(
			$elm$core$List$cons,
			$elm$html$Html$Events$onMouseDown($author$project$ConfigGroups$OperationsOnDrag$Swap$ResetColors),
			$author$project$ConfigGroups$OperationsOnDrag$Swap$sectionStyles),
		_List_fromArray(
			[
				A2($author$project$ConfigGroups$OperationsOnDrag$Swap$groupView, model, 1),
				A2($author$project$ConfigGroups$OperationsOnDrag$Swap$groupView, model, 2),
				A2($author$project$ConfigGroups$OperationsOnDrag$Swap$groupView, model, 3),
				$author$project$ConfigGroups$OperationsOnDrag$Swap$ghostView(model)
			]));
};
var $author$project$ConfigGroups$OperationsOnDrag$Root$demoView = function (example) {
	switch (example.$) {
		case 0:
			var mo = example.a;
			return A2(
				$elm$html$Html$map,
				$author$project$ConfigGroups$OperationsOnDrag$Root$InsertAfterMsg,
				$author$project$ConfigGroups$OperationsOnDrag$InsertAfter$view(mo));
		case 1:
			var mo = example.a;
			return A2(
				$elm$html$Html$map,
				$author$project$ConfigGroups$OperationsOnDrag$Root$InsertBeforeMsg,
				$author$project$ConfigGroups$OperationsOnDrag$InsertBefore$view(mo));
		case 2:
			var mo = example.a;
			return A2(
				$elm$html$Html$map,
				$author$project$ConfigGroups$OperationsOnDrag$Root$RotateMsg,
				$author$project$ConfigGroups$OperationsOnDrag$Rotate$view(mo));
		default:
			var mo = example.a;
			return A2(
				$elm$html$Html$map,
				$author$project$ConfigGroups$OperationsOnDrag$Root$SwapMsg,
				$author$project$ConfigGroups$OperationsOnDrag$Swap$view(mo));
	}
};
var $author$project$ConfigGroups$OperationsOnDrag$Root$info = function (example) {
	switch (example.$) {
		case 0:
			return 'Insert after';
		case 1:
			return 'Insert before';
		case 2:
			return 'Rotate';
		default:
			return 'Swap';
	}
};
var $author$project$ConfigGroups$OperationsOnDrag$Root$demoWrapperView = F3(
	function (currentId, id, example) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
					A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
					A2($elm$html$Html$Attributes$style, 'margin', '4em 0')
				]),
			_List_fromArray(
				[
					$author$project$ConfigGroups$OperationsOnDrag$Root$demoView(example),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$classList(
							_List_fromArray(
								[
									_Utils_Tuple2('link', true),
									_Utils_Tuple2(
									'is-active',
									_Utils_eq(id, currentId))
								])),
							$elm$html$Html$Events$onClick(
							$author$project$ConfigGroups$OperationsOnDrag$Root$LinkClicked(id))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							$author$project$ConfigGroups$OperationsOnDrag$Root$info(example))
						]))
				]));
	});
var $author$project$ConfigGroups$OperationsOnDrag$Root$view = function (model) {
	return A2(
		$elm$html$Html$section,
		_List_Nil,
		A2(
			$elm$core$List$indexedMap,
			$author$project$ConfigGroups$OperationsOnDrag$Root$demoWrapperView(model.at),
			model.S));
};
var $author$project$ConfigGroups$OperationsOnDrop$Root$LinkClicked = function (a) {
	return {$: 0, a: a};
};
var $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$ResetColors = {$: 1};
var $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$itemStyles = function (color) {
	return _List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'width', '50px'),
			A2($elm$html$Html$Attributes$style, 'height', '50px'),
			A2($elm$html$Html$Attributes$style, 'color', 'white'),
			A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
			A2($elm$html$Html$Attributes$style, 'margin-right', '1.5rem'),
			A2($elm$html$Html$Attributes$style, 'display', 'flex'),
			A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
			A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
			A2($elm$html$Html$Attributes$style, 'background-color', color)
		]);
};
var $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$maybeDragItem = function (_v0) {
	var dnd = _v0.Q;
	var items = _v0.au;
	return A2(
		$elm$core$Maybe$andThen,
		function (_v1) {
			var dragIndex = _v1.a9;
			return $elm$core$List$head(
				A2($elm$core$List$drop, dragIndex, items));
		},
		$author$project$ConfigGroups$OperationsOnDrop$InsertAfter$system.be(dnd));
};
var $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$ghostView = function (model) {
	var _v0 = $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$maybeDragItem(model);
	if (!_v0.$) {
		var value = _v0.a.aB;
		return A2(
			$elm$html$Html$div,
			_Utils_ap(
				$author$project$ConfigGroups$OperationsOnDrop$InsertAfter$itemStyles($author$project$ConfigGroups$OperationsOnDrop$InsertAfter$dragColor),
				$author$project$ConfigGroups$OperationsOnDrop$InsertAfter$system.c$(model.Q)),
			_List_fromArray(
				[
					$elm$html$Html$text(value)
				]));
	} else {
		return $elm$html$Html$text('');
	}
};
var $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$calculateOffset = F3(
	function (index, group, list) {
		calculateOffset:
		while (true) {
			if (!list.b) {
				return 0;
			} else {
				var x = list.a;
				var xs = list.b;
				if (_Utils_eq(x.t, group)) {
					return index;
				} else {
					var $temp$index = index + 1,
						$temp$group = group,
						$temp$list = xs;
					index = $temp$index;
					group = $temp$group;
					list = $temp$list;
					continue calculateOffset;
				}
			}
		}
	});
var $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$groupStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
		A2($elm$html$Html$Attributes$style, 'padding-bottom', '4rem')
	]);
var $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$auxiliaryItemStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'flex-grow', '1'),
		A2($elm$html$Html$Attributes$style, 'box-sizing', 'border-box'),
		A2($elm$html$Html$Attributes$style, 'margin-right', '1.5rem'),
		A2($elm$html$Html$Attributes$style, 'width', 'auto'),
		A2($elm$html$Html$Attributes$style, 'height', '50px'),
		A2($elm$html$Html$Attributes$style, 'min-width', '50px'),
		A2($elm$html$Html$Attributes$style, 'border', '3px dashed gray'),
		A2($elm$html$Html$Attributes$style, 'background-color', 'transparent')
	]);
var $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$itemView = F4(
	function (model, offset, localIndex, _v0) {
		var group = _v0.t;
		var value = _v0.aB;
		var color = _v0.aV;
		var globalIndex = offset + localIndex;
		var itemId = 'insertafter-' + $elm$core$String$fromInt(globalIndex);
		var _v1 = _Utils_Tuple2(
			$author$project$ConfigGroups$OperationsOnDrop$InsertAfter$system.be(model.Q),
			$author$project$ConfigGroups$OperationsOnDrop$InsertAfter$maybeDragItem(model));
		if ((!_v1.a.$) && (!_v1.b.$)) {
			var dragIndex = _v1.a.a.a9;
			var dropIndex = _v1.a.a.cV;
			var dragItem = _v1.b.a;
			return ((value === '') && (!_Utils_eq(group, dragItem.t))) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$ConfigGroups$OperationsOnDrop$InsertAfter$auxiliaryItemStyles,
						A2($author$project$ConfigGroups$OperationsOnDrop$InsertAfter$system.cU, globalIndex, itemId))),
				_List_Nil) : (((value === '') && _Utils_eq(group, dragItem.t)) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					$author$project$ConfigGroups$OperationsOnDrop$InsertAfter$auxiliaryItemStyles),
				_List_Nil) : (((!_Utils_eq(globalIndex, dragIndex)) && (!_Utils_eq(globalIndex, dropIndex))) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$ConfigGroups$OperationsOnDrop$InsertAfter$itemStyles(color),
						A2($author$project$ConfigGroups$OperationsOnDrop$InsertAfter$system.cU, globalIndex, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					])) : (((!_Utils_eq(globalIndex, dragIndex)) && _Utils_eq(globalIndex, dropIndex)) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$ConfigGroups$OperationsOnDrop$InsertAfter$itemStyles($author$project$ConfigGroups$OperationsOnDrop$InsertAfter$dropColor),
						A2($author$project$ConfigGroups$OperationsOnDrop$InsertAfter$system.cU, globalIndex, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					])) : A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					$author$project$ConfigGroups$OperationsOnDrop$InsertAfter$itemStyles($author$project$ConfigGroups$OperationsOnDrop$InsertAfter$dropColor)),
				_List_Nil))));
		} else {
			return (value === '') ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					$author$project$ConfigGroups$OperationsOnDrop$InsertAfter$auxiliaryItemStyles),
				_List_Nil) : A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$ConfigGroups$OperationsOnDrop$InsertAfter$itemStyles(color),
						A2($author$project$ConfigGroups$OperationsOnDrop$InsertAfter$system.cT, globalIndex, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					]));
		}
	});
var $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$groupView = F2(
	function (model, currentGroup) {
		return A2(
			$elm$html$Html$div,
			$author$project$ConfigGroups$OperationsOnDrop$InsertAfter$groupStyles,
			A2(
				$elm$core$List$indexedMap,
				A2(
					$author$project$ConfigGroups$OperationsOnDrop$InsertAfter$itemView,
					model,
					A3($author$project$ConfigGroups$OperationsOnDrop$InsertAfter$calculateOffset, 0, currentGroup, model.au)),
				A2(
					$elm$core$List$filter,
					function (_v0) {
						var group = _v0.t;
						return _Utils_eq(group, currentGroup);
					},
					model.au)));
	});
var $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$sectionStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
		A2($elm$html$Html$Attributes$style, 'width', '800px')
	]);
var $author$project$ConfigGroups$OperationsOnDrop$InsertAfter$view = function (model) {
	return A2(
		$elm$html$Html$section,
		A2(
			$elm$core$List$cons,
			$elm$html$Html$Events$onMouseDown($author$project$ConfigGroups$OperationsOnDrop$InsertAfter$ResetColors),
			$author$project$ConfigGroups$OperationsOnDrop$InsertAfter$sectionStyles),
		_List_fromArray(
			[
				A2($author$project$ConfigGroups$OperationsOnDrop$InsertAfter$groupView, model, 1),
				A2($author$project$ConfigGroups$OperationsOnDrop$InsertAfter$groupView, model, 2),
				A2($author$project$ConfigGroups$OperationsOnDrop$InsertAfter$groupView, model, 3),
				$author$project$ConfigGroups$OperationsOnDrop$InsertAfter$ghostView(model)
			]));
};
var $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$ResetColors = {$: 1};
var $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$itemStyles = function (color) {
	return _List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'width', '50px'),
			A2($elm$html$Html$Attributes$style, 'height', '50px'),
			A2($elm$html$Html$Attributes$style, 'color', 'white'),
			A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
			A2($elm$html$Html$Attributes$style, 'margin-right', '1.5rem'),
			A2($elm$html$Html$Attributes$style, 'display', 'flex'),
			A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
			A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
			A2($elm$html$Html$Attributes$style, 'background-color', color)
		]);
};
var $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$maybeDragItem = function (_v0) {
	var dnd = _v0.Q;
	var items = _v0.au;
	return A2(
		$elm$core$Maybe$andThen,
		function (_v1) {
			var dragIndex = _v1.a9;
			return $elm$core$List$head(
				A2($elm$core$List$drop, dragIndex, items));
		},
		$author$project$ConfigGroups$OperationsOnDrop$InsertBefore$system.be(dnd));
};
var $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$ghostView = function (model) {
	var _v0 = $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$maybeDragItem(model);
	if (!_v0.$) {
		var value = _v0.a.aB;
		return A2(
			$elm$html$Html$div,
			_Utils_ap(
				$author$project$ConfigGroups$OperationsOnDrop$InsertBefore$itemStyles($author$project$ConfigGroups$OperationsOnDrop$InsertBefore$dragColor),
				$author$project$ConfigGroups$OperationsOnDrop$InsertBefore$system.c$(model.Q)),
			_List_fromArray(
				[
					$elm$html$Html$text(value)
				]));
	} else {
		return $elm$html$Html$text('');
	}
};
var $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$calculateOffset = F3(
	function (index, group, list) {
		calculateOffset:
		while (true) {
			if (!list.b) {
				return 0;
			} else {
				var x = list.a;
				var xs = list.b;
				if (_Utils_eq(x.t, group)) {
					return index;
				} else {
					var $temp$index = index + 1,
						$temp$group = group,
						$temp$list = xs;
					index = $temp$index;
					group = $temp$group;
					list = $temp$list;
					continue calculateOffset;
				}
			}
		}
	});
var $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$groupStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
		A2($elm$html$Html$Attributes$style, 'padding-bottom', '4rem')
	]);
var $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$auxiliaryItemStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'flex-grow', '1'),
		A2($elm$html$Html$Attributes$style, 'box-sizing', 'border-box'),
		A2($elm$html$Html$Attributes$style, 'margin-right', '1.5rem'),
		A2($elm$html$Html$Attributes$style, 'width', 'auto'),
		A2($elm$html$Html$Attributes$style, 'height', '50px'),
		A2($elm$html$Html$Attributes$style, 'min-width', '50px'),
		A2($elm$html$Html$Attributes$style, 'border', '3px dashed gray'),
		A2($elm$html$Html$Attributes$style, 'background-color', 'transparent')
	]);
var $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$itemView = F4(
	function (model, offset, localIndex, _v0) {
		var group = _v0.t;
		var value = _v0.aB;
		var color = _v0.aV;
		var globalIndex = offset + localIndex;
		var itemId = 'insertbefore-' + $elm$core$String$fromInt(globalIndex);
		var _v1 = _Utils_Tuple2(
			$author$project$ConfigGroups$OperationsOnDrop$InsertBefore$system.be(model.Q),
			$author$project$ConfigGroups$OperationsOnDrop$InsertBefore$maybeDragItem(model));
		if ((!_v1.a.$) && (!_v1.b.$)) {
			var dragIndex = _v1.a.a.a9;
			var dropIndex = _v1.a.a.cV;
			var dragItem = _v1.b.a;
			return ((value === '') && (!_Utils_eq(group, dragItem.t))) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$ConfigGroups$OperationsOnDrop$InsertBefore$auxiliaryItemStyles,
						A2($author$project$ConfigGroups$OperationsOnDrop$InsertBefore$system.cU, globalIndex, itemId))),
				_List_Nil) : (((value === '') && _Utils_eq(group, dragItem.t)) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					$author$project$ConfigGroups$OperationsOnDrop$InsertBefore$auxiliaryItemStyles),
				_List_Nil) : (((!_Utils_eq(globalIndex, dragIndex)) && (!_Utils_eq(globalIndex, dropIndex))) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$ConfigGroups$OperationsOnDrop$InsertBefore$itemStyles(color),
						A2($author$project$ConfigGroups$OperationsOnDrop$InsertBefore$system.cU, globalIndex, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					])) : (((!_Utils_eq(globalIndex, dragIndex)) && _Utils_eq(globalIndex, dropIndex)) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$ConfigGroups$OperationsOnDrop$InsertBefore$itemStyles($author$project$ConfigGroups$OperationsOnDrop$InsertBefore$dropColor),
						A2($author$project$ConfigGroups$OperationsOnDrop$InsertBefore$system.cU, globalIndex, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					])) : A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					$author$project$ConfigGroups$OperationsOnDrop$InsertBefore$itemStyles($author$project$ConfigGroups$OperationsOnDrop$InsertBefore$dropColor)),
				_List_Nil))));
		} else {
			return (value === '') ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					$author$project$ConfigGroups$OperationsOnDrop$InsertBefore$auxiliaryItemStyles),
				_List_Nil) : A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$ConfigGroups$OperationsOnDrop$InsertBefore$itemStyles(color),
						A2($author$project$ConfigGroups$OperationsOnDrop$InsertBefore$system.cT, globalIndex, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					]));
		}
	});
var $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$groupView = F2(
	function (model, currentGroup) {
		return A2(
			$elm$html$Html$div,
			$author$project$ConfigGroups$OperationsOnDrop$InsertBefore$groupStyles,
			A2(
				$elm$core$List$indexedMap,
				A2(
					$author$project$ConfigGroups$OperationsOnDrop$InsertBefore$itemView,
					model,
					A3($author$project$ConfigGroups$OperationsOnDrop$InsertBefore$calculateOffset, 0, currentGroup, model.au)),
				A2(
					$elm$core$List$filter,
					function (_v0) {
						var group = _v0.t;
						return _Utils_eq(group, currentGroup);
					},
					model.au)));
	});
var $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$sectionStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
		A2($elm$html$Html$Attributes$style, 'width', '800px')
	]);
var $author$project$ConfigGroups$OperationsOnDrop$InsertBefore$view = function (model) {
	return A2(
		$elm$html$Html$section,
		A2(
			$elm$core$List$cons,
			$elm$html$Html$Events$onMouseDown($author$project$ConfigGroups$OperationsOnDrop$InsertBefore$ResetColors),
			$author$project$ConfigGroups$OperationsOnDrop$InsertBefore$sectionStyles),
		_List_fromArray(
			[
				A2($author$project$ConfigGroups$OperationsOnDrop$InsertBefore$groupView, model, 1),
				A2($author$project$ConfigGroups$OperationsOnDrop$InsertBefore$groupView, model, 2),
				A2($author$project$ConfigGroups$OperationsOnDrop$InsertBefore$groupView, model, 3),
				$author$project$ConfigGroups$OperationsOnDrop$InsertBefore$ghostView(model)
			]));
};
var $author$project$ConfigGroups$OperationsOnDrop$Rotate$ResetColors = {$: 1};
var $author$project$ConfigGroups$OperationsOnDrop$Rotate$itemStyles = function (color) {
	return _List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'width', '50px'),
			A2($elm$html$Html$Attributes$style, 'height', '50px'),
			A2($elm$html$Html$Attributes$style, 'color', 'white'),
			A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
			A2($elm$html$Html$Attributes$style, 'margin-right', '1.5rem'),
			A2($elm$html$Html$Attributes$style, 'display', 'flex'),
			A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
			A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
			A2($elm$html$Html$Attributes$style, 'background-color', color)
		]);
};
var $author$project$ConfigGroups$OperationsOnDrop$Rotate$maybeDragItem = function (_v0) {
	var dnd = _v0.Q;
	var items = _v0.au;
	return A2(
		$elm$core$Maybe$andThen,
		function (_v1) {
			var dragIndex = _v1.a9;
			return $elm$core$List$head(
				A2($elm$core$List$drop, dragIndex, items));
		},
		$author$project$ConfigGroups$OperationsOnDrop$Rotate$system.be(dnd));
};
var $author$project$ConfigGroups$OperationsOnDrop$Rotate$ghostView = function (model) {
	var _v0 = $author$project$ConfigGroups$OperationsOnDrop$Rotate$maybeDragItem(model);
	if (!_v0.$) {
		var value = _v0.a.aB;
		return A2(
			$elm$html$Html$div,
			_Utils_ap(
				$author$project$ConfigGroups$OperationsOnDrop$Rotate$itemStyles($author$project$ConfigGroups$OperationsOnDrop$Rotate$dragColor),
				$author$project$ConfigGroups$OperationsOnDrop$Rotate$system.c$(model.Q)),
			_List_fromArray(
				[
					$elm$html$Html$text(value)
				]));
	} else {
		return $elm$html$Html$text('');
	}
};
var $author$project$ConfigGroups$OperationsOnDrop$Rotate$calculateOffset = F3(
	function (index, group, list) {
		calculateOffset:
		while (true) {
			if (!list.b) {
				return 0;
			} else {
				var x = list.a;
				var xs = list.b;
				if (_Utils_eq(x.t, group)) {
					return index;
				} else {
					var $temp$index = index + 1,
						$temp$group = group,
						$temp$list = xs;
					index = $temp$index;
					group = $temp$group;
					list = $temp$list;
					continue calculateOffset;
				}
			}
		}
	});
var $author$project$ConfigGroups$OperationsOnDrop$Rotate$groupStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
		A2($elm$html$Html$Attributes$style, 'padding-bottom', '4rem')
	]);
var $author$project$ConfigGroups$OperationsOnDrop$Rotate$itemView = F4(
	function (model, offset, localIndex, _v0) {
		var value = _v0.aB;
		var color = _v0.aV;
		var globalIndex = offset + localIndex;
		var itemId = 'rotate-' + $elm$core$String$fromInt(globalIndex);
		var _v1 = $author$project$ConfigGroups$OperationsOnDrop$Rotate$system.be(model.Q);
		if (!_v1.$) {
			var dragIndex = _v1.a.a9;
			var dropIndex = _v1.a.cV;
			return ((!_Utils_eq(globalIndex, dragIndex)) && (!_Utils_eq(globalIndex, dropIndex))) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$ConfigGroups$OperationsOnDrop$Rotate$itemStyles(color),
						A2($author$project$ConfigGroups$OperationsOnDrop$Rotate$system.cU, globalIndex, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					])) : (((!_Utils_eq(globalIndex, dragIndex)) && _Utils_eq(globalIndex, dropIndex)) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$ConfigGroups$OperationsOnDrop$Rotate$itemStyles($author$project$ConfigGroups$OperationsOnDrop$Rotate$dropColor),
						A2($author$project$ConfigGroups$OperationsOnDrop$Rotate$system.cU, globalIndex, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					])) : A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					$author$project$ConfigGroups$OperationsOnDrop$Rotate$itemStyles($author$project$ConfigGroups$OperationsOnDrop$Rotate$dropColor)),
				_List_Nil));
		} else {
			return A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$ConfigGroups$OperationsOnDrop$Rotate$itemStyles(color),
						A2($author$project$ConfigGroups$OperationsOnDrop$Rotate$system.cT, globalIndex, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					]));
		}
	});
var $author$project$ConfigGroups$OperationsOnDrop$Rotate$groupView = F2(
	function (model, currentGroup) {
		return A2(
			$elm$html$Html$div,
			$author$project$ConfigGroups$OperationsOnDrop$Rotate$groupStyles,
			A2(
				$elm$core$List$indexedMap,
				A2(
					$author$project$ConfigGroups$OperationsOnDrop$Rotate$itemView,
					model,
					A3($author$project$ConfigGroups$OperationsOnDrop$Rotate$calculateOffset, 0, currentGroup, model.au)),
				A2(
					$elm$core$List$filter,
					function (_v0) {
						var group = _v0.t;
						return _Utils_eq(group, currentGroup);
					},
					model.au)));
	});
var $author$project$ConfigGroups$OperationsOnDrop$Rotate$sectionStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
		A2($elm$html$Html$Attributes$style, 'width', '800px')
	]);
var $author$project$ConfigGroups$OperationsOnDrop$Rotate$view = function (model) {
	return A2(
		$elm$html$Html$section,
		A2(
			$elm$core$List$cons,
			$elm$html$Html$Events$onMouseDown($author$project$ConfigGroups$OperationsOnDrop$Rotate$ResetColors),
			$author$project$ConfigGroups$OperationsOnDrop$Rotate$sectionStyles),
		_List_fromArray(
			[
				A2($author$project$ConfigGroups$OperationsOnDrop$Rotate$groupView, model, 1),
				A2($author$project$ConfigGroups$OperationsOnDrop$Rotate$groupView, model, 2),
				A2($author$project$ConfigGroups$OperationsOnDrop$Rotate$groupView, model, 3),
				$author$project$ConfigGroups$OperationsOnDrop$Rotate$ghostView(model)
			]));
};
var $author$project$ConfigGroups$OperationsOnDrop$Swap$ResetColors = {$: 1};
var $author$project$ConfigGroups$OperationsOnDrop$Swap$itemStyles = function (color) {
	return _List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'width', '50px'),
			A2($elm$html$Html$Attributes$style, 'height', '50px'),
			A2($elm$html$Html$Attributes$style, 'color', 'white'),
			A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
			A2($elm$html$Html$Attributes$style, 'margin-right', '1.5rem'),
			A2($elm$html$Html$Attributes$style, 'display', 'flex'),
			A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
			A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
			A2($elm$html$Html$Attributes$style, 'background-color', color)
		]);
};
var $author$project$ConfigGroups$OperationsOnDrop$Swap$maybeDragItem = function (_v0) {
	var dnd = _v0.Q;
	var items = _v0.au;
	return A2(
		$elm$core$Maybe$andThen,
		function (_v1) {
			var dragIndex = _v1.a9;
			return $elm$core$List$head(
				A2($elm$core$List$drop, dragIndex, items));
		},
		$author$project$ConfigGroups$OperationsOnDrop$Swap$system.be(dnd));
};
var $author$project$ConfigGroups$OperationsOnDrop$Swap$ghostView = function (model) {
	var _v0 = $author$project$ConfigGroups$OperationsOnDrop$Swap$maybeDragItem(model);
	if (!_v0.$) {
		var value = _v0.a.aB;
		return A2(
			$elm$html$Html$div,
			_Utils_ap(
				$author$project$ConfigGroups$OperationsOnDrop$Swap$itemStyles($author$project$ConfigGroups$OperationsOnDrop$Swap$dragColor),
				$author$project$ConfigGroups$OperationsOnDrop$Swap$system.c$(model.Q)),
			_List_fromArray(
				[
					$elm$html$Html$text(value)
				]));
	} else {
		return $elm$html$Html$text('');
	}
};
var $author$project$ConfigGroups$OperationsOnDrop$Swap$calculateOffset = F3(
	function (index, group, list) {
		calculateOffset:
		while (true) {
			if (!list.b) {
				return 0;
			} else {
				var x = list.a;
				var xs = list.b;
				if (_Utils_eq(x.t, group)) {
					return index;
				} else {
					var $temp$index = index + 1,
						$temp$group = group,
						$temp$list = xs;
					index = $temp$index;
					group = $temp$group;
					list = $temp$list;
					continue calculateOffset;
				}
			}
		}
	});
var $author$project$ConfigGroups$OperationsOnDrop$Swap$groupStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
		A2($elm$html$Html$Attributes$style, 'padding-bottom', '4rem')
	]);
var $author$project$ConfigGroups$OperationsOnDrop$Swap$itemView = F4(
	function (model, offset, localIndex, _v0) {
		var value = _v0.aB;
		var color = _v0.aV;
		var globalIndex = offset + localIndex;
		var itemId = 'swap-' + $elm$core$String$fromInt(globalIndex);
		var _v1 = $author$project$ConfigGroups$OperationsOnDrop$Swap$system.be(model.Q);
		if (!_v1.$) {
			var dragIndex = _v1.a.a9;
			var dropIndex = _v1.a.cV;
			return ((!_Utils_eq(globalIndex, dragIndex)) && (!_Utils_eq(globalIndex, dropIndex))) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$ConfigGroups$OperationsOnDrop$Swap$itemStyles(color),
						A2($author$project$ConfigGroups$OperationsOnDrop$Swap$system.cU, globalIndex, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					])) : (((!_Utils_eq(globalIndex, dragIndex)) && _Utils_eq(globalIndex, dropIndex)) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$ConfigGroups$OperationsOnDrop$Swap$itemStyles($author$project$ConfigGroups$OperationsOnDrop$Swap$dropColor),
						A2($author$project$ConfigGroups$OperationsOnDrop$Swap$system.cU, globalIndex, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					])) : A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					$author$project$ConfigGroups$OperationsOnDrop$Swap$itemStyles($author$project$ConfigGroups$OperationsOnDrop$Swap$dropColor)),
				_List_Nil));
		} else {
			return A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$ConfigGroups$OperationsOnDrop$Swap$itemStyles(color),
						A2($author$project$ConfigGroups$OperationsOnDrop$Swap$system.cT, globalIndex, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					]));
		}
	});
var $author$project$ConfigGroups$OperationsOnDrop$Swap$groupView = F2(
	function (model, currentGroup) {
		return A2(
			$elm$html$Html$div,
			$author$project$ConfigGroups$OperationsOnDrop$Swap$groupStyles,
			A2(
				$elm$core$List$indexedMap,
				A2(
					$author$project$ConfigGroups$OperationsOnDrop$Swap$itemView,
					model,
					A3($author$project$ConfigGroups$OperationsOnDrop$Swap$calculateOffset, 0, currentGroup, model.au)),
				A2(
					$elm$core$List$filter,
					function (_v0) {
						var group = _v0.t;
						return _Utils_eq(group, currentGroup);
					},
					model.au)));
	});
var $author$project$ConfigGroups$OperationsOnDrop$Swap$sectionStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
		A2($elm$html$Html$Attributes$style, 'width', '800px')
	]);
var $author$project$ConfigGroups$OperationsOnDrop$Swap$view = function (model) {
	return A2(
		$elm$html$Html$section,
		A2(
			$elm$core$List$cons,
			$elm$html$Html$Events$onMouseDown($author$project$ConfigGroups$OperationsOnDrop$Swap$ResetColors),
			$author$project$ConfigGroups$OperationsOnDrop$Swap$sectionStyles),
		_List_fromArray(
			[
				A2($author$project$ConfigGroups$OperationsOnDrop$Swap$groupView, model, 1),
				A2($author$project$ConfigGroups$OperationsOnDrop$Swap$groupView, model, 2),
				A2($author$project$ConfigGroups$OperationsOnDrop$Swap$groupView, model, 3),
				$author$project$ConfigGroups$OperationsOnDrop$Swap$ghostView(model)
			]));
};
var $author$project$ConfigGroups$OperationsOnDrop$Root$demoView = function (example) {
	switch (example.$) {
		case 0:
			var mo = example.a;
			return A2(
				$elm$html$Html$map,
				$author$project$ConfigGroups$OperationsOnDrop$Root$InsertAfterMsg,
				$author$project$ConfigGroups$OperationsOnDrop$InsertAfter$view(mo));
		case 1:
			var mo = example.a;
			return A2(
				$elm$html$Html$map,
				$author$project$ConfigGroups$OperationsOnDrop$Root$InsertBeforeMsg,
				$author$project$ConfigGroups$OperationsOnDrop$InsertBefore$view(mo));
		case 2:
			var mo = example.a;
			return A2(
				$elm$html$Html$map,
				$author$project$ConfigGroups$OperationsOnDrop$Root$RotateMsg,
				$author$project$ConfigGroups$OperationsOnDrop$Rotate$view(mo));
		default:
			var mo = example.a;
			return A2(
				$elm$html$Html$map,
				$author$project$ConfigGroups$OperationsOnDrop$Root$SwapMsg,
				$author$project$ConfigGroups$OperationsOnDrop$Swap$view(mo));
	}
};
var $author$project$ConfigGroups$OperationsOnDrop$Root$info = function (example) {
	switch (example.$) {
		case 0:
			return 'Insert after';
		case 1:
			return 'Insert before';
		case 2:
			return 'Rotate';
		default:
			return 'Swap';
	}
};
var $author$project$ConfigGroups$OperationsOnDrop$Root$demoWrapperView = F3(
	function (currentId, id, example) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
					A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
					A2($elm$html$Html$Attributes$style, 'margin', '4em 0')
				]),
			_List_fromArray(
				[
					$author$project$ConfigGroups$OperationsOnDrop$Root$demoView(example),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$classList(
							_List_fromArray(
								[
									_Utils_Tuple2('link', true),
									_Utils_Tuple2(
									'is-active',
									_Utils_eq(id, currentId))
								])),
							$elm$html$Html$Events$onClick(
							$author$project$ConfigGroups$OperationsOnDrop$Root$LinkClicked(id))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							$author$project$ConfigGroups$OperationsOnDrop$Root$info(example))
						]))
				]));
	});
var $author$project$ConfigGroups$OperationsOnDrop$Root$view = function (model) {
	return A2(
		$elm$html$Html$section,
		_List_Nil,
		A2(
			$elm$core$List$indexedMap,
			$author$project$ConfigGroups$OperationsOnDrop$Root$demoWrapperView(model.at),
			model.S));
};
var $author$project$ConfigGroups$Root$demoView = function (model) {
	if (!model.$) {
		var mo = model.a;
		return A2(
			$elm$html$Html$map,
			$author$project$ConfigGroups$Root$OperationsOnDragMsg,
			$author$project$ConfigGroups$OperationsOnDrag$Root$view(mo));
	} else {
		var mo = model.a;
		return A2(
			$elm$html$Html$map,
			$author$project$ConfigGroups$Root$OperationsOnDropMsg,
			$author$project$ConfigGroups$OperationsOnDrop$Root$view(mo));
	}
};
var $author$project$Gallery$Hanoi$cursorStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
	]);
var $author$project$Gallery$Hanoi$diskStyles = F2(
	function (width, color) {
		return _List_fromArray(
			[
				A2(
				$elm$html$Html$Attributes$style,
				'width',
				$elm$core$String$fromInt(width) + 'px'),
				A2($elm$html$Html$Attributes$style, 'min-height', '50px'),
				A2($elm$html$Html$Attributes$style, 'background-color', color),
				A2($elm$html$Html$Attributes$style, 'margin-bottom', '10px')
			]);
	});
var $author$project$Gallery$Hanoi$maybeDragDisk = F2(
	function (dnd, disks) {
		return A2(
			$elm$core$Maybe$andThen,
			function (_v0) {
				var dragIndex = _v0.a9;
				return $elm$core$List$head(
					A2($elm$core$List$drop, dragIndex, disks));
			},
			$author$project$Gallery$Hanoi$system.be(dnd));
	});
var $author$project$Gallery$Hanoi$paint = F3(
	function (solved, startColor, solvedColor) {
		return solved ? solvedColor : startColor;
	});
var $author$project$Gallery$Hanoi$ghostDiskView = function (model) {
	var _v0 = A2($author$project$Gallery$Hanoi$maybeDragDisk, model.Q, model.P);
	if (!_v0.$) {
		var width = _v0.a.d4;
		var startColor = _v0.a.a1;
		var solvedColor = _v0.a.bn;
		return A2(
			$elm$html$Html$div,
			_Utils_ap(
				A2(
					$author$project$Gallery$Hanoi$diskStyles,
					width,
					A3($author$project$Gallery$Hanoi$paint, model.aL, startColor, solvedColor)),
				_Utils_ap(
					$author$project$Gallery$Hanoi$cursorStyles,
					$author$project$Gallery$Hanoi$system.c$(model.Q))),
			_List_Nil);
	} else {
		return $elm$html$Html$text('');
	}
};
var $author$project$Gallery$Hanoi$sectionStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
		A2($elm$html$Html$Attributes$style, 'padding-bottom', '2em')
	]);
var $author$project$Gallery$Hanoi$calculateOffset = F3(
	function (index, tower, list) {
		calculateOffset:
		while (true) {
			if (!list.b) {
				return 0;
			} else {
				var x = list.a;
				var xs = list.b;
				if (_Utils_eq(x.aP, tower)) {
					return index;
				} else {
					var $temp$index = index + 1,
						$temp$tower = tower,
						$temp$list = xs;
					index = $temp$index;
					tower = $temp$tower;
					list = $temp$list;
					continue calculateOffset;
				}
			}
		}
	});
var $author$project$Gallery$Hanoi$auxiliaryStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'flex-grow', '1'),
		A2($elm$html$Html$Attributes$style, 'margin-bottom', '0'),
		A2($elm$html$Html$Attributes$style, 'height', 'auto')
	]);
var $author$project$Gallery$Hanoi$placeholderStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'background-color', 'transparent')
	]);
var $author$project$Gallery$Hanoi$diskView = F5(
	function (model, maybeTopDisk_, offset, localIndex, _v0) {
		var width = _v0.d4;
		var startColor = _v0.a1;
		var solvedColor = _v0.bn;
		var globalIndex = offset + localIndex;
		var diskId = 'id-' + $elm$core$String$fromInt(globalIndex);
		var color = A3($author$project$Gallery$Hanoi$paint, model.aL, startColor, solvedColor);
		var _v1 = $author$project$Gallery$Hanoi$system.be(model.Q);
		if (!_v1.$) {
			var dragIndex = _v1.a.a9;
			if (!localIndex) {
				var _v2 = _Utils_Tuple2(
					A2($author$project$Gallery$Hanoi$maybeDragDisk, model.Q, model.P),
					maybeTopDisk_);
				if ((!_v2.a.$) && (!_v2.b.$)) {
					var dragDisk = _v2.a.a;
					var topDisk = _v2.b.a;
					return (_Utils_cmp(dragDisk.d4, topDisk.d4) < 0) ? A2(
						$elm$html$Html$div,
						A2(
							$elm$core$List$cons,
							$elm$html$Html$Attributes$id(diskId),
							_Utils_ap(
								A2($author$project$Gallery$Hanoi$diskStyles, width, color),
								_Utils_ap(
									$author$project$Gallery$Hanoi$auxiliaryStyles,
									A2($author$project$Gallery$Hanoi$system.cU, globalIndex, diskId)))),
						_List_Nil) : A2(
						$elm$html$Html$div,
						A2(
							$elm$core$List$cons,
							$elm$html$Html$Attributes$id(diskId),
							_Utils_ap(
								A2($author$project$Gallery$Hanoi$diskStyles, width, color),
								$author$project$Gallery$Hanoi$auxiliaryStyles)),
						_List_Nil);
				} else {
					return A2(
						$elm$html$Html$div,
						A2(
							$elm$core$List$cons,
							$elm$html$Html$Attributes$id(diskId),
							_Utils_ap(
								A2($author$project$Gallery$Hanoi$diskStyles, width, color),
								_Utils_ap(
									$author$project$Gallery$Hanoi$auxiliaryStyles,
									A2($author$project$Gallery$Hanoi$system.cU, globalIndex, diskId)))),
						_List_Nil);
				}
			} else {
				if (_Utils_eq(globalIndex, dragIndex)) {
					return A2(
						$elm$html$Html$div,
						A2(
							$elm$core$List$cons,
							$elm$html$Html$Attributes$id(diskId),
							_Utils_ap(
								A2($author$project$Gallery$Hanoi$diskStyles, width, color),
								$author$project$Gallery$Hanoi$placeholderStyles)),
						_List_Nil);
				} else {
					return A2(
						$elm$html$Html$div,
						A2(
							$elm$core$List$cons,
							$elm$html$Html$Attributes$id(diskId),
							A2($author$project$Gallery$Hanoi$diskStyles, width, color)),
						_List_Nil);
				}
			}
		} else {
			return (!localIndex) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(diskId),
					_Utils_ap(
						A2($author$project$Gallery$Hanoi$diskStyles, width, color),
						$author$project$Gallery$Hanoi$auxiliaryStyles)),
				_List_Nil) : ((localIndex === 1) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(diskId),
					_Utils_ap(
						A2($author$project$Gallery$Hanoi$diskStyles, width, color),
						_Utils_ap(
							$author$project$Gallery$Hanoi$cursorStyles,
							A2($author$project$Gallery$Hanoi$system.cT, globalIndex, diskId)))),
				_List_Nil) : A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(diskId),
					A2($author$project$Gallery$Hanoi$diskStyles, width, color)),
				_List_Nil));
		}
	});
var $author$project$Gallery$Hanoi$maybeTopDisk = function (disks) {
	return $elm$core$List$head(
		A2($elm$core$List$drop, 1, disks));
};
var $author$project$Gallery$Hanoi$towerStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
		A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'flex-end'),
		A2($elm$html$Html$Attributes$style, 'box-shadow', '0 10px 0 0 dimgray'),
		A2($elm$html$Html$Attributes$style, 'margin-right', '5em'),
		A2($elm$html$Html$Attributes$style, 'width', '300px'),
		A2($elm$html$Html$Attributes$style, 'height', '320px')
	]);
var $author$project$Gallery$Hanoi$towerView = F2(
	function (model, currentTower) {
		var disks = A2(
			$elm$core$List$filter,
			function (_v0) {
				var tower = _v0.aP;
				return _Utils_eq(tower, currentTower);
			},
			model.P);
		return A2(
			$elm$html$Html$div,
			$author$project$Gallery$Hanoi$towerStyles,
			A2(
				$elm$core$List$indexedMap,
				A3(
					$author$project$Gallery$Hanoi$diskView,
					model,
					$author$project$Gallery$Hanoi$maybeTopDisk(disks),
					A3($author$project$Gallery$Hanoi$calculateOffset, 0, currentTower, model.P)),
				disks));
	});
var $author$project$Gallery$Hanoi$view = function (model) {
	return A2(
		$elm$html$Html$section,
		$author$project$Gallery$Hanoi$sectionStyles,
		_List_fromArray(
			[
				A2($author$project$Gallery$Hanoi$towerView, model, 0),
				A2($author$project$Gallery$Hanoi$towerView, model, 1),
				A2($author$project$Gallery$Hanoi$towerView, model, 2),
				$author$project$Gallery$Hanoi$ghostDiskView(model)
			]));
};
var $author$project$Gallery$Knight$containerStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'grid'),
		A2($elm$html$Html$Attributes$style, 'grid-gap', '0'),
		A2($elm$html$Html$Attributes$style, 'grid-template-columns', 'repeat(5, [col] 5rem)'),
		A2($elm$html$Html$Attributes$style, 'grid-template-rows', 'repeat(5, [row] 5rem)'),
		A2($elm$html$Html$Attributes$style, 'margin', '8rem auto'),
		A2($elm$html$Html$Attributes$style, 'padding', '2rem'),
		A2($elm$html$Html$Attributes$style, 'background-color', 'white'),
		A2($elm$html$Html$Attributes$style, 'width', '25rem')
	]);
var $author$project$Gallery$Knight$squareStyles = function (color) {
	return _List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'background-color', color),
			A2($elm$html$Html$Attributes$style, 'color', 'black'),
			A2($elm$html$Html$Attributes$style, 'font-size', '4.6rem'),
			A2($elm$html$Html$Attributes$style, 'line-height', '1'),
			A2($elm$html$Html$Attributes$style, 'display', 'flex'),
			A2($elm$html$Html$Attributes$style, 'justify-content', 'center')
		]);
};
var $author$project$Gallery$Knight$ghostView = F2(
	function (dnd, squares) {
		var maybeDragSquare = A2(
			$elm$core$Maybe$andThen,
			function (_v1) {
				var dragIndex = _v1.a9;
				return $elm$core$List$head(
					A2($elm$core$List$drop, dragIndex, squares));
			},
			$author$project$Gallery$Knight$system.be(dnd));
		if (!maybeDragSquare.$) {
			var square = maybeDragSquare.a;
			return A2(
				$elm$html$Html$div,
				_Utils_ap(
					$author$project$Gallery$Knight$squareStyles('transparent'),
					$author$project$Gallery$Knight$system.c$(dnd)),
				_List_fromArray(
					[
						$elm$html$Html$text('♞')
					]));
		} else {
			return $elm$html$Html$text('');
		}
	});
var $author$project$Gallery$Knight$indices8x8 = A2(
	$elm$core$List$filterMap,
	function (index8) {
		return ((A2($elm$core$Basics$modBy, 8, index8) < 5) && (index8 < 39)) ? $elm$core$Maybe$Just(index8) : $elm$core$Maybe$Nothing;
	},
	A2($elm$core$List$range, 0, 63));
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $author$project$Gallery$Knight$cursorStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
	]);
var $elm$html$Html$img = _VirtualDom_node('img');
var $author$project$Gallery$Knight$knightMoves = _List_fromArray(
	[-17, -15, -10, -6, 6, 10, 15, 17]);
var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $author$project$Gallery$Knight$squareView = F4(
	function (dnd, solved, index5, _v0) {
		var index8 = _v0.a;
		var square = _v0.b;
		var legalKnightMoves = function (position) {
			return A2(
				$elm$core$List$map,
				$elm$core$Basics$add(position),
				$author$project$Gallery$Knight$knightMoves);
		};
		var knight = solved ? A2(
			$elm$html$Html$img,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$src(
					A2(
						$elm$url$Url$Builder$absolute,
						_List_fromArray(
							[$author$project$Path$rootPath, 'assets', 'images', 'gallery', 'pegasus.png']),
						_List_Nil)),
					A2($elm$html$Html$Attributes$style, 'z-index', '9')
				]),
			_List_Nil) : $elm$html$Html$text('♞');
		var id = 'id-' + $elm$core$String$fromInt(index8);
		var color = (!(!(1 & (index8 ^ (index8 >> 3))))) ? '#d18b47' : '#ffce9e';
		var _v1 = $author$project$Gallery$Knight$system.be(dnd);
		if (!_v1.$) {
			var dragIndex = _v1.a.a9;
			return ((square !== '×') && A2(
				$elm$core$List$member,
				index8,
				legalKnightMoves(dragIndex + (((dragIndex / 5) | 0) * 3)))) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(id),
					_Utils_ap(
						$author$project$Gallery$Knight$squareStyles(color),
						A2($author$project$Gallery$Knight$system.cU, index5, id))),
				_List_fromArray(
					[
						$elm$html$Html$text('●')
					])) : (_Utils_eq(dragIndex, index5) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(id),
					$author$project$Gallery$Knight$squareStyles(color)),
				_List_fromArray(
					[
						$elm$html$Html$text('○')
					])) : A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(id),
					$author$project$Gallery$Knight$squareStyles(color)),
				_List_fromArray(
					[
						$elm$html$Html$text(square)
					])));
		} else {
			return (square === 'N') ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(id),
					_Utils_ap(
						$author$project$Gallery$Knight$squareStyles(color),
						_Utils_ap(
							$author$project$Gallery$Knight$cursorStyles,
							A2($author$project$Gallery$Knight$system.cT, index5, id)))),
				_List_fromArray(
					[knight])) : A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(id),
					$author$project$Gallery$Knight$squareStyles(color)),
				_List_fromArray(
					[
						$elm$html$Html$text(square)
					]));
		}
	});
var $author$project$Gallery$Knight$view = function (model) {
	return A2(
		$elm$html$Html$section,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				$author$project$Gallery$Knight$containerStyles,
				A2(
					$elm$core$List$indexedMap,
					A2($author$project$Gallery$Knight$squareView, model.Q, model.aL),
					A3($elm$core$List$map2, $elm$core$Tuple$pair, $author$project$Gallery$Knight$indices8x8, model.az))),
				A2($author$project$Gallery$Knight$ghostView, model.Q, model.az)
			]));
};
var $author$project$Gallery$Puzzle$containerStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'grid'),
		A2($elm$html$Html$Attributes$style, 'grid-template-columns', '12em 12em'),
		A2($elm$html$Html$Attributes$style, 'grid-template-rows', '12em 12em'),
		A2($elm$html$Html$Attributes$style, 'grid-gap', '2em'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
		A2($elm$html$Html$Attributes$style, 'padding', '3em 0')
	]);
var $author$project$Gallery$Puzzle$itemStyles = function (color) {
	return _List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'background-color', color),
			A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
			A2($elm$html$Html$Attributes$style, 'color', 'white'),
			A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
			A2($elm$html$Html$Attributes$style, 'display', 'flex'),
			A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
			A2($elm$html$Html$Attributes$style, 'justify-content', 'center')
		]);
};
var $author$project$Gallery$Puzzle$ghostView = F2(
	function (dnd, items) {
		var maybeDragItem = A2(
			$elm$core$Maybe$andThen,
			function (_v1) {
				var dragIndex = _v1.a9;
				return $elm$core$List$head(
					A2($elm$core$List$drop, dragIndex, items));
			},
			$author$project$Gallery$Puzzle$system.be(dnd));
		if (!maybeDragItem.$) {
			var value = maybeDragItem.a.aB;
			var color = maybeDragItem.a.aV;
			return A2(
				$elm$html$Html$div,
				_Utils_ap(
					$author$project$Gallery$Puzzle$itemStyles(color),
					$author$project$Gallery$Puzzle$system.c$(dnd)),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					]));
		} else {
			return $elm$html$Html$text('');
		}
	});
var $author$project$Gallery$Puzzle$groupColor = function (index) {
	switch (index) {
		case 0:
			return $author$project$Gallery$Puzzle$cyan;
		case 1:
			return $author$project$Gallery$Puzzle$blue;
		case 2:
			return $author$project$Gallery$Puzzle$indigo;
		case 3:
			return $author$project$Gallery$Puzzle$purple;
		default:
			return $author$project$Gallery$Puzzle$purple;
	}
};
var $author$project$Gallery$Puzzle$transparent = 'transparent';
var $author$project$Gallery$Puzzle$groupStyles = F2(
	function (color, solved) {
		var bgColor = solved ? color : $author$project$Gallery$Puzzle$transparent;
		return _List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'background-color', bgColor),
				A2($elm$html$Html$Attributes$style, 'box-shadow', '0 0 0 4px ' + color),
				A2($elm$html$Html$Attributes$style, 'display', 'grid'),
				A2($elm$html$Html$Attributes$style, 'grid-template-columns', '4em 4em'),
				A2($elm$html$Html$Attributes$style, 'grid-template-rows', '4em 4em'),
				A2($elm$html$Html$Attributes$style, 'grid-gap', '1.4em'),
				A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
				A2($elm$html$Html$Attributes$style, 'padding', '1.3em')
			]);
	});
var $author$project$Gallery$Puzzle$dropStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'opacity', '0.6')
	]);
var $author$project$Gallery$Puzzle$gray = 'dimgray';
var $author$project$Gallery$Puzzle$itemView = F4(
	function (dnd, offset, localIndex, _v0) {
		var value = _v0.aB;
		var color = _v0.aV;
		var globalIndex = offset + localIndex;
		var itemId = 'id-' + $elm$core$String$fromInt(globalIndex);
		var _v1 = $author$project$Gallery$Puzzle$system.be(dnd);
		if (!_v1.$) {
			var dragIndex = _v1.a.a9;
			var dropIndex = _v1.a.cV;
			return ((!_Utils_eq(dragIndex, globalIndex)) && (!_Utils_eq(dropIndex, globalIndex))) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$Gallery$Puzzle$itemStyles(color),
						A2($author$project$Gallery$Puzzle$system.cU, globalIndex, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					])) : (((!_Utils_eq(dragIndex, globalIndex)) && _Utils_eq(dropIndex, globalIndex)) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$Gallery$Puzzle$itemStyles(color),
						_Utils_ap(
							$author$project$Gallery$Puzzle$dropStyles,
							A2($author$project$Gallery$Puzzle$system.cU, globalIndex, itemId)))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					])) : A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					$author$project$Gallery$Puzzle$itemStyles($author$project$Gallery$Puzzle$gray)),
				_List_Nil));
		} else {
			return A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$Gallery$Puzzle$itemStyles(color),
						A2($author$project$Gallery$Puzzle$system.cT, globalIndex, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					]));
		}
	});
var $author$project$Gallery$Puzzle$groupView = F4(
	function (dnd, quads, offset, index) {
		return A2(
			$elm$html$Html$div,
			A2(
				$author$project$Gallery$Puzzle$groupStyles,
				$author$project$Gallery$Puzzle$groupColor(index),
				_Utils_eq(
					quads,
					A2(
						$elm$core$List$take,
						4,
						A2($elm$core$List$drop, offset, $author$project$Gallery$Puzzle$solution)))),
			A2(
				$elm$core$List$indexedMap,
				A2($author$project$Gallery$Puzzle$itemView, dnd, offset),
				quads));
	});
var $author$project$Gallery$Puzzle$view = function (model) {
	return A2(
		$elm$html$Html$section,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				$author$project$Gallery$Puzzle$containerStyles,
				A2(
					$elm$core$List$map,
					function (i) {
						return A4(
							$author$project$Gallery$Puzzle$groupView,
							model.Q,
							A2(
								$elm$core$List$take,
								4,
								A2($elm$core$List$drop, i * 4, model.au)),
							i * 4,
							i);
					},
					A2($elm$core$List$range, 0, 3))),
				A2($author$project$Gallery$Puzzle$ghostView, model.Q, model.au)
			]));
};
var $author$project$Gallery$Shapes$containerStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
		A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'center')
	]);
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$circle = $elm$svg$Svg$trustedNode('circle');
var $elm$svg$Svg$Attributes$cx = _VirtualDom_attribute('cx');
var $elm$svg$Svg$Attributes$cy = _VirtualDom_attribute('cy');
var $elm$svg$Svg$Attributes$fill = _VirtualDom_attribute('fill');
var $elm$svg$Svg$Attributes$r = _VirtualDom_attribute('r');
var $author$project$Gallery$Shapes$circle = function (color) {
	return A2(
		$elm$svg$Svg$circle,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$cx('50%'),
				$elm$svg$Svg$Attributes$cy('50%'),
				$elm$svg$Svg$Attributes$r('49'),
				$elm$svg$Svg$Attributes$fill(color)
			]),
		_List_Nil);
};
var $elm$svg$Svg$g = $elm$svg$Svg$trustedNode('g');
var $elm$svg$Svg$line = $elm$svg$Svg$trustedNode('line');
var $elm$svg$Svg$Attributes$stroke = _VirtualDom_attribute('stroke');
var $elm$svg$Svg$Attributes$strokeWidth = _VirtualDom_attribute('stroke-width');
var $elm$svg$Svg$Attributes$x1 = _VirtualDom_attribute('x1');
var $elm$svg$Svg$Attributes$x2 = _VirtualDom_attribute('x2');
var $elm$svg$Svg$Attributes$y1 = _VirtualDom_attribute('y1');
var $elm$svg$Svg$Attributes$y2 = _VirtualDom_attribute('y2');
var $author$project$Gallery$Shapes$cross = function (color) {
	return A2(
		$elm$svg$Svg$g,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$line,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x1('10'),
						$elm$svg$Svg$Attributes$y1('10'),
						$elm$svg$Svg$Attributes$x2('90'),
						$elm$svg$Svg$Attributes$y2('90'),
						$elm$svg$Svg$Attributes$strokeWidth('40'),
						$elm$svg$Svg$Attributes$stroke(color)
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$line,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x1('90'),
						$elm$svg$Svg$Attributes$y1('10'),
						$elm$svg$Svg$Attributes$x2('10'),
						$elm$svg$Svg$Attributes$y2('90'),
						$elm$svg$Svg$Attributes$strokeWidth('40'),
						$elm$svg$Svg$Attributes$stroke(color)
					]),
				_List_Nil)
			]));
};
var $elm$svg$Svg$Attributes$height = _VirtualDom_attribute('height');
var $elm$svg$Svg$rect = $elm$svg$Svg$trustedNode('rect');
var $elm$svg$Svg$Attributes$width = _VirtualDom_attribute('width');
var $author$project$Gallery$Shapes$rectangle = function (color) {
	return A2(
		$elm$svg$Svg$rect,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$width('100'),
				$elm$svg$Svg$Attributes$height('100'),
				$elm$svg$Svg$Attributes$fill(color)
			]),
		_List_Nil);
};
var $elm$svg$Svg$svg = $elm$svg$Svg$trustedNode('svg');
var $elm$svg$Svg$Attributes$points = _VirtualDom_attribute('points');
var $elm$svg$Svg$polygon = $elm$svg$Svg$trustedNode('polygon');
var $author$project$Gallery$Shapes$triangle = function (color) {
	return A2(
		$elm$svg$Svg$polygon,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$points('50,0 100,100 0,100'),
				$elm$svg$Svg$Attributes$fill(color)
			]),
		_List_Nil);
};
var $elm$svg$Svg$Attributes$viewBox = _VirtualDom_attribute('viewBox');
var $author$project$Gallery$Shapes$svgView = F3(
	function (shape, color, dnd) {
		return A2(
			$elm$svg$Svg$svg,
			_Utils_ap(
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$width('100'),
						$elm$svg$Svg$Attributes$height('100'),
						$elm$svg$Svg$Attributes$viewBox('0 0 100 100')
					]),
				dnd),
			_List_fromArray(
				[
					function () {
					switch (shape) {
						case 0:
							return $author$project$Gallery$Shapes$circle(color);
						case 1:
							return $author$project$Gallery$Shapes$cross(color);
						case 2:
							return $author$project$Gallery$Shapes$rectangle(color);
						default:
							return $author$project$Gallery$Shapes$triangle(color);
					}
				}()
				]));
	});
var $author$project$Gallery$Shapes$ghostView = F2(
	function (dnd, items) {
		var maybeDragItem = A2(
			$elm$core$Maybe$andThen,
			function (_v1) {
				var dragIndex = _v1.a9;
				return $elm$core$List$head(
					A2($elm$core$List$drop, dragIndex, items));
			},
			$author$project$Gallery$Shapes$system.be(dnd));
		if (!maybeDragItem.$) {
			var shape = maybeDragItem.a.ax;
			var color = maybeDragItem.a.aV;
			return A3(
				$author$project$Gallery$Shapes$svgView,
				shape,
				color,
				$author$project$Gallery$Shapes$system.c$(dnd));
		} else {
			return $elm$html$Html$text('');
		}
	});
var $author$project$Gallery$Shapes$shapeNumber = 4;
var $author$project$Gallery$Shapes$wrapperStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'width', '160px'),
		A2($elm$html$Html$Attributes$style, 'height', '160px'),
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'center')
	]);
var $author$project$Gallery$Shapes$holeView = F3(
	function (dnd, index, _v0) {
		var shape = _v0.ax;
		var color = _v0.aV;
		var globalIndex = $author$project$Gallery$Shapes$shapeNumber + index;
		var itemId = 'hole-' + $elm$core$String$fromInt(globalIndex);
		var _v1 = $author$project$Gallery$Shapes$system.be(dnd);
		if (!_v1.$) {
			return A2(
				$elm$html$Html$div,
				$author$project$Gallery$Shapes$wrapperStyles,
				_List_fromArray(
					[
						A3(
						$author$project$Gallery$Shapes$svgView,
						shape,
						color,
						A2(
							$elm$core$List$cons,
							$elm$html$Html$Attributes$id(itemId),
							A2($author$project$Gallery$Shapes$system.cU, globalIndex, itemId)))
					]));
		} else {
			return A2(
				$elm$html$Html$div,
				$author$project$Gallery$Shapes$wrapperStyles,
				_List_fromArray(
					[
						A3(
						$author$project$Gallery$Shapes$svgView,
						shape,
						color,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id(itemId)
							]))
					]));
		}
	});
var $author$project$Gallery$Shapes$scoreView = function (items) {
	var attempts = $elm$core$String$fromInt(
		A3(
			$elm$core$List$foldl,
			A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.am;
				},
				$elm$core$Basics$add),
			0,
			A2($elm$core$List$drop, $author$project$Gallery$Shapes$shapeNumber, items)));
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'padding-bottom', '3em'),
				A2($elm$html$Html$Attributes$style, 'text-align', 'center')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text('Attempts: ' + attempts)
			]));
};
var $author$project$Gallery$Shapes$shapeView = F3(
	function (dnd, index, _v0) {
		var shape = _v0.ax;
		var color = _v0.aV;
		var solved = _v0.aL;
		var itemId = 'shape-' + $elm$core$String$fromInt(index);
		var _v1 = $author$project$Gallery$Shapes$system.be(dnd);
		if (!_v1.$) {
			var dragIndex = _v1.a.a9;
			return (!_Utils_eq(dragIndex, index)) ? A2(
				$elm$html$Html$div,
				$author$project$Gallery$Shapes$wrapperStyles,
				_List_fromArray(
					[
						A3(
						$author$project$Gallery$Shapes$svgView,
						shape,
						color,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id(itemId)
							]))
					])) : A2($elm$html$Html$div, $author$project$Gallery$Shapes$wrapperStyles, _List_Nil);
		} else {
			return solved ? A2($elm$html$Html$div, $author$project$Gallery$Shapes$wrapperStyles, _List_Nil) : A2(
				$elm$html$Html$div,
				$author$project$Gallery$Shapes$wrapperStyles,
				_List_fromArray(
					[
						A3(
						$author$project$Gallery$Shapes$svgView,
						shape,
						color,
						A2(
							$elm$core$List$cons,
							$elm$html$Html$Attributes$id(itemId),
							A2($author$project$Gallery$Shapes$system.cT, index, itemId)))
					]));
		}
	});
var $author$project$Gallery$Shapes$view = function (model) {
	return A2(
		$elm$html$Html$section,
		_List_Nil,
		_List_fromArray(
			[
				$author$project$Gallery$Shapes$scoreView(model.au),
				A2(
				$elm$html$Html$div,
				$author$project$Gallery$Shapes$containerStyles,
				A2(
					$elm$core$List$indexedMap,
					$author$project$Gallery$Shapes$shapeView(model.Q),
					A2($elm$core$List$take, $author$project$Gallery$Shapes$shapeNumber, model.au))),
				A2(
				$elm$html$Html$div,
				$author$project$Gallery$Shapes$containerStyles,
				A2(
					$elm$core$List$indexedMap,
					$author$project$Gallery$Shapes$holeView(model.Q),
					A2($elm$core$List$drop, $author$project$Gallery$Shapes$shapeNumber, model.au))),
				A2($author$project$Gallery$Shapes$ghostView, model.Q, model.au)
			]));
};
var $author$project$Gallery$TaskBoard$boardStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
		A2($elm$html$Html$Attributes$style, 'margin', '0 auto'),
		A2($elm$html$Html$Attributes$style, 'min-height', '600px'),
		A2($elm$html$Html$Attributes$style, 'padding', '2em 0')
	]);
var $author$project$Gallery$TaskBoard$cardStyles = function (color) {
	return _List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'background-color', color),
			A2($elm$html$Html$Attributes$style, 'color', 'black'),
			A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
			A2($elm$html$Html$Attributes$style, 'display', 'flex'),
			A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
			A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
			A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px'),
			A2($elm$html$Html$Attributes$style, 'width', '170px'),
			A2($elm$html$Html$Attributes$style, 'height', '60px')
		]);
};
var $author$project$Gallery$TaskBoard$cursorStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
	]);
var $author$project$Gallery$TaskBoard$maybeDragCard = function (_v0) {
	var cardDnD = _v0.C;
	var cards = _v0.D;
	return A2(
		$elm$core$Maybe$andThen,
		function (_v1) {
			var dragIndex = _v1.a9;
			return $elm$core$List$head(
				A2($elm$core$List$drop, dragIndex, cards));
		},
		$author$project$Gallery$TaskBoard$cardSystem.be(cardDnD));
};
var $author$project$Gallery$TaskBoard$yellow = '#ffdf76';
var $author$project$Gallery$TaskBoard$cardGhostView = function (model) {
	var _v0 = $author$project$Gallery$TaskBoard$maybeDragCard(model);
	if (!_v0.$) {
		var description = _v0.a.aG;
		return A2(
			$elm$html$Html$div,
			_Utils_ap(
				$author$project$Gallery$TaskBoard$cardStyles($author$project$Gallery$TaskBoard$yellow),
				_Utils_ap(
					$author$project$Gallery$TaskBoard$cursorStyles,
					$author$project$Gallery$TaskBoard$cardSystem.c$(model.C))),
			_List_fromArray(
				[
					$elm$html$Html$text(description)
				]));
	} else {
		return $elm$html$Html$text('');
	}
};
var $author$project$Gallery$TaskBoard$columnHeadingStyles = function (color) {
	return _List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'background-color', color),
			A2($elm$html$Html$Attributes$style, 'color', 'white'),
			A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
			A2($elm$html$Html$Attributes$style, 'height', '60px'),
			A2($elm$html$Html$Attributes$style, 'margin', '0'),
			A2($elm$html$Html$Attributes$style, 'display', 'flex'),
			A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
			A2($elm$html$Html$Attributes$style, 'justify-content', 'center')
		]);
};
var $author$project$Gallery$TaskBoard$columnStyles = function (color) {
	return _List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'background-color', color),
			A2($elm$html$Html$Attributes$style, 'box-shadow', '0 0 0 1px black'),
			A2($elm$html$Html$Attributes$style, 'width', '220px')
		]);
};
var $author$project$Gallery$TaskBoard$containerStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'background-color', '#999999'),
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
		A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
		A2($elm$html$Html$Attributes$style, 'height', 'calc(100% - 80px)'),
		A2($elm$html$Html$Attributes$style, 'padding-top', '20px')
	]);
var $author$project$Gallery$TaskBoard$auxiliaryCardStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'background-color', 'transparent'),
		A2($elm$html$Html$Attributes$style, 'flex-grow', '1'),
		A2($elm$html$Html$Attributes$style, 'width', '220px'),
		A2($elm$html$Html$Attributes$style, 'height', 'auto'),
		A2($elm$html$Html$Attributes$style, 'min-height', '60px')
	]);
var $author$project$Gallery$TaskBoard$eventlessCardView = function (_v0) {
	var description = _v0.aG;
	return (description === '') ? A2($elm$html$Html$div, $author$project$Gallery$TaskBoard$auxiliaryCardStyles, _List_Nil) : A2(
		$elm$html$Html$div,
		$author$project$Gallery$TaskBoard$cardStyles($author$project$Gallery$TaskBoard$yellow),
		_List_fromArray(
			[
				$elm$html$Html$text(description)
			]));
};
var $author$project$Gallery$TaskBoard$Heading = F2(
	function (title, color) {
		return {aV: color, aA: title};
	});
var $author$project$Gallery$TaskBoard$blue = '#055b8f';
var $author$project$Gallery$TaskBoard$green = '#5b8f05';
var $author$project$Gallery$TaskBoard$red = '#8f055b';
var $author$project$Gallery$TaskBoard$getActivity = function (cards) {
	if (!cards.b) {
		return A2($author$project$Gallery$TaskBoard$Heading, '', '');
	} else {
		var card = cards.a;
		var _v1 = card.r;
		switch (_v1) {
			case 0:
				return A2($author$project$Gallery$TaskBoard$Heading, 'To Do', $author$project$Gallery$TaskBoard$blue);
			case 1:
				return A2($author$project$Gallery$TaskBoard$Heading, 'Doing', $author$project$Gallery$TaskBoard$red);
			default:
				return A2($author$project$Gallery$TaskBoard$Heading, 'Done', $author$project$Gallery$TaskBoard$green);
		}
	}
};
var $elm$html$Html$h3 = _VirtualDom_node('h3');
var $author$project$Gallery$TaskBoard$maybeDragColumn = function (_v0) {
	var columnDnD = _v0.E;
	var cards = _v0.D;
	return A2(
		$elm$core$Maybe$andThen,
		function (_v1) {
			var dragIndex = _v1.a9;
			return $elm$core$List$head(
				A2(
					$elm$core$List$drop,
					dragIndex,
					$author$project$Gallery$TaskBoard$gatherByActivity(cards)));
		},
		$author$project$Gallery$TaskBoard$columnSystem.be(columnDnD));
};
var $author$project$Gallery$TaskBoard$columnGhostView = function (model) {
	var _v0 = $author$project$Gallery$TaskBoard$maybeDragColumn(model);
	if (!_v0.$) {
		var cards = _v0.a;
		var heading = $author$project$Gallery$TaskBoard$getActivity(
			A2($elm$core$List$take, 1, cards));
		return A2(
			$elm$html$Html$div,
			_Utils_ap(
				$author$project$Gallery$TaskBoard$columnStyles('transparent'),
				$author$project$Gallery$TaskBoard$columnSystem.c$(model.E)),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$h3,
					$author$project$Gallery$TaskBoard$columnHeadingStyles(heading.aV),
					_List_fromArray(
						[
							$elm$html$Html$text(heading.aA)
						])),
					A2(
					$elm$html$Html$div,
					$author$project$Gallery$TaskBoard$containerStyles,
					A2($elm$core$List$map, $author$project$Gallery$TaskBoard$eventlessCardView, cards))
				]));
	} else {
		return $elm$html$Html$text('');
	}
};
var $author$project$Gallery$TaskBoard$gray = '#a5a5a5';
var $author$project$Gallery$TaskBoard$eventfulCardView = F4(
	function (model, offset, localIndex, _v0) {
		var activity = _v0.r;
		var description = _v0.aG;
		var globalIndex = offset + localIndex;
		var cardId = 'card-' + $elm$core$String$fromInt(globalIndex);
		var _v1 = _Utils_Tuple2(
			$author$project$Gallery$TaskBoard$cardSystem.be(model.C),
			$author$project$Gallery$TaskBoard$maybeDragCard(model));
		if ((!_v1.a.$) && (!_v1.b.$)) {
			var dragIndex = _v1.a.a.a9;
			var dragCard = _v1.b.a;
			return ((description === '') && (!_Utils_eq(activity, dragCard.r))) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(cardId),
					_Utils_ap(
						$author$project$Gallery$TaskBoard$auxiliaryCardStyles,
						A2($author$project$Gallery$TaskBoard$cardSystem.cU, globalIndex, cardId))),
				_List_Nil) : (((description === '') && _Utils_eq(activity, dragCard.r)) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(cardId),
					$author$project$Gallery$TaskBoard$auxiliaryCardStyles),
				_List_Nil) : ((!_Utils_eq(globalIndex, dragIndex)) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(cardId),
					_Utils_ap(
						$author$project$Gallery$TaskBoard$cardStyles($author$project$Gallery$TaskBoard$yellow),
						A2($author$project$Gallery$TaskBoard$cardSystem.cU, globalIndex, cardId))),
				_List_fromArray(
					[
						$elm$html$Html$text(description)
					])) : A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(cardId),
					$author$project$Gallery$TaskBoard$cardStyles($author$project$Gallery$TaskBoard$gray)),
				_List_Nil)));
		} else {
			return (description === '') ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(cardId),
					$author$project$Gallery$TaskBoard$auxiliaryCardStyles),
				_List_Nil) : A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(cardId),
					_Utils_ap(
						$author$project$Gallery$TaskBoard$cardStyles($author$project$Gallery$TaskBoard$yellow),
						_Utils_ap(
							$author$project$Gallery$TaskBoard$cursorStyles,
							A2($author$project$Gallery$TaskBoard$cardSystem.cT, globalIndex, cardId)))),
				_List_fromArray(
					[
						$elm$html$Html$text(description)
					]));
		}
	});
var $author$project$Gallery$TaskBoard$columnView = F4(
	function (model, offset, index, cards) {
		var heading = $author$project$Gallery$TaskBoard$getActivity(
			A2($elm$core$List$take, 1, cards));
		var columnId = 'column-' + $elm$core$String$fromInt(index);
		var _v0 = $author$project$Gallery$TaskBoard$columnSystem.be(model.E);
		if (!_v0.$) {
			var dragIndex = _v0.a.a9;
			var dragElement = _v0.a.R;
			if (!_Utils_eq(dragIndex, index)) {
				return A2(
					$elm$html$Html$div,
					A2(
						$elm$core$List$cons,
						$elm$html$Html$Attributes$id(columnId),
						_Utils_ap(
							$author$project$Gallery$TaskBoard$columnStyles('transparent'),
							A2($author$project$Gallery$TaskBoard$columnSystem.cU, index, columnId))),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$h3,
							$author$project$Gallery$TaskBoard$columnHeadingStyles(heading.aV),
							_List_fromArray(
								[
									$elm$html$Html$text(heading.aA)
								])),
							A2(
							$elm$html$Html$div,
							$author$project$Gallery$TaskBoard$containerStyles,
							A2($elm$core$List$map, $author$project$Gallery$TaskBoard$eventlessCardView, cards))
						]));
			} else {
				var height = $elm$core$String$fromInt(
					$elm$core$Basics$round(dragElement.cW.c2));
				return A2(
					$elm$html$Html$div,
					A2(
						$elm$core$List$cons,
						$elm$html$Html$Attributes$id(columnId),
						_Utils_ap(
							$author$project$Gallery$TaskBoard$columnStyles($author$project$Gallery$TaskBoard$gray),
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'height', height + 'px')
								]))),
					_List_Nil);
			}
		} else {
			return A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(columnId),
					$author$project$Gallery$TaskBoard$columnStyles('transparent')),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h3,
						_Utils_ap(
							$author$project$Gallery$TaskBoard$columnHeadingStyles(heading.aV),
							A2($author$project$Gallery$TaskBoard$columnSystem.cT, index, columnId)),
						_List_fromArray(
							[
								$elm$html$Html$text(heading.aA)
							])),
						A2(
						$elm$html$Html$div,
						$author$project$Gallery$TaskBoard$containerStyles,
						A2(
							$elm$core$List$indexedMap,
							A2($author$project$Gallery$TaskBoard$eventfulCardView, model, offset),
							cards))
					]));
		}
	});
var $author$project$Gallery$TaskBoard$view = function (model) {
	var columns = $author$project$Gallery$TaskBoard$gatherByActivity(model.D);
	var calculateOffset = function (columnIndex) {
		return A3(
			$elm$core$List$foldl,
			$elm$core$Basics$add,
			0,
			A2(
				$elm$core$List$take,
				columnIndex,
				A2($elm$core$List$map, $elm$core$List$length, columns)));
	};
	return A2(
		$elm$html$Html$section,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				$author$project$Gallery$TaskBoard$boardStyles,
				A2(
					$elm$core$List$indexedMap,
					F2(
						function (i, column) {
							return A4(
								$author$project$Gallery$TaskBoard$columnView,
								model,
								calculateOffset(i),
								i,
								column);
						}),
					columns)),
				$author$project$Gallery$TaskBoard$columnGhostView(model),
				$author$project$Gallery$TaskBoard$cardGhostView(model)
			]));
};
var $author$project$Gallery$TryOn$colorGroupStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
		A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
		A2($elm$html$Html$Attributes$style, 'padding-right', '3rem')
	]);
var $author$project$Gallery$TryOn$colorStyles = F3(
	function (width, height, color) {
		return _List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
				A2($elm$html$Html$Attributes$style, 'margin', '0 3rem 3rem 0'),
				A2($elm$html$Html$Attributes$style, 'background-color', color),
				A2(
				$elm$html$Html$Attributes$style,
				'width',
				$elm$core$String$fromInt(width) + 'rem'),
				A2(
				$elm$html$Html$Attributes$style,
				'height',
				$elm$core$String$fromInt(height) + 'rem')
			]);
	});
var $author$project$Gallery$TryOn$colorView = F3(
	function (model, index, item) {
		var width = item.aJ * 4;
		var id = 'color-' + $elm$core$String$fromInt(index);
		var height = item.aJ * 4;
		var _v0 = $author$project$Gallery$TryOn$system.be(model.Q);
		if (!_v0.$) {
			return A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(id),
					_Utils_ap(
						A3($author$project$Gallery$TryOn$colorStyles, width, height, item.aV),
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
							]))),
				_List_Nil);
		} else {
			return A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(id),
					_Utils_ap(
						A3($author$project$Gallery$TryOn$colorStyles, width, height, item.aV),
						A2(
							$elm$core$List$cons,
							A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
							A2($author$project$Gallery$TryOn$system.cT, index, id)))),
				_List_Nil);
		}
	});
var $author$project$Gallery$TryOn$maybeDragItem = function (_v0) {
	var dnd = _v0.Q;
	var items = _v0.au;
	return A2(
		$elm$core$Maybe$andThen,
		function (_v1) {
			var dragIndex = _v1.a9;
			return $elm$core$List$head(
				A2($elm$core$List$drop, dragIndex, items));
		},
		$author$project$Gallery$TryOn$system.be(dnd));
};
var $elm$svg$Svg$Attributes$d = _VirtualDom_attribute('d');
var $elm$svg$Svg$path = $elm$svg$Svg$trustedNode('path');
var $author$project$Gallery$TryOn$svgView = F4(
	function (width, height, color, dnd) {
		return A2(
			$elm$svg$Svg$svg,
			_Utils_ap(
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$width(
						$elm$core$String$fromInt(width)),
						$elm$svg$Svg$Attributes$height(
						$elm$core$String$fromInt(height)),
						$elm$svg$Svg$Attributes$viewBox('0 0 295.526 295.526')
					]),
				dnd),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$g,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$fill(color)
						]),
					_List_fromArray(
						[
							A2(
							$elm$svg$Svg$path,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$d('M147.763,44.074c12.801,0,23.858-8.162,27.83-20.169c-7.578,2.086-17.237,3.345-27.83,3.345c-10.592,0-20.251-1.259-27.828-3.345C123.905,35.911,134.961,44.074,147.763,44.074z')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$path,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$d('M295.158,58.839c-0.608-1.706-1.873-3.109-3.521-3.873l-56.343-26.01c-11.985-4.06-24.195-7.267-36.524-9.611c-0.434-0.085-0.866-0.126-1.292-0.126c-3.052,0-5.785,2.107-6.465,5.197c-4.502,19.82-22.047,34.659-43.251,34.659c-21.203,0-38.749-14.838-43.25-34.659c-0.688-3.09-3.416-5.197-6.466-5.197c-0.426,0-0.858,0.041-1.292,0.126c-12.328,2.344-24.538,5.551-36.542,9.611L3.889,54.965c-1.658,0.764-2.932,2.167-3.511,3.873c-0.599,1.726-0.491,3.589,0.353,5.217l24.46,48.272c1.145,2.291,3.474,3.666,5.938,3.666c0.636,0,1.281-0.092,1.917-0.283l27.167-8.052v161.97c0,3.678,3.001,6.678,6.689,6.678h161.723c3.678,0,6.67-3.001,6.67-6.678V107.66l27.186,8.052c0.636,0.191,1.28,0.283,1.915,0.283c2.459,0,4.779-1.375,5.94-3.666l24.469-48.272C295.629,62.428,295.747,60.565,295.158,58.839z')
								]),
							_List_Nil)
						]))
				]));
	});
var $author$project$Gallery$TryOn$ghostView = function (model) {
	var _v0 = _Utils_Tuple2(
		$author$project$Gallery$TryOn$system.be(model.Q),
		$author$project$Gallery$TryOn$maybeDragItem(model));
	if ((!_v0.a.$) && (!_v0.b.$)) {
		var dropElement = _v0.a.a.ac;
		var color = _v0.b.a.aV;
		var baseFontSize = 14;
		var height = $elm$core$Basics$round(dropElement.cW.c2 / baseFontSize);
		var width = $elm$core$Basics$round(dropElement.cW.d4 / baseFontSize);
		return A4(
			$author$project$Gallery$TryOn$svgView,
			width,
			height,
			color,
			_Utils_ap(
				$author$project$Gallery$TryOn$system.c$(model.Q),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$Attributes$style,
						'width',
						$elm$core$String$fromInt(width) + 'rem'),
						A2(
						$elm$html$Html$Attributes$style,
						'height',
						$elm$core$String$fromInt(height) + 'rem'),
						A2($elm$html$Html$Attributes$style, 'transition', 'width 0.5s, height 0.5s')
					])));
	} else {
		return $elm$html$Html$text('');
	}
};
var $author$project$Gallery$TryOn$sectionStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
		A2($elm$html$Html$Attributes$style, 'padding-top', '2rem')
	]);
var $author$project$Gallery$TryOn$sizeGroupStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
		A2($elm$html$Html$Attributes$style, 'align-items', 'baseline'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'center')
	]);
var $author$project$Gallery$TryOn$wrapperStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
		A2($elm$html$Html$Attributes$style, 'margin-right', '2rem')
	]);
var $author$project$Gallery$TryOn$sizeView = F4(
	function (model, offset, localIndex, item) {
		var width = item.aJ * 50;
		var id = 'size-' + $elm$core$String$fromInt(localIndex);
		var height = item.aJ * 50;
		var globalIndex = offset + localIndex;
		var _v0 = $author$project$Gallery$TryOn$system.be(model.Q);
		if (!_v0.$) {
			var dragIndex = _v0.a.a9;
			return (!_Utils_eq(dragIndex, globalIndex)) ? A2(
				$elm$html$Html$div,
				$author$project$Gallery$TryOn$wrapperStyles,
				_List_fromArray(
					[
						A4(
						$author$project$Gallery$TryOn$svgView,
						width,
						height,
						item.aV,
						A2(
							$elm$core$List$cons,
							$elm$html$Html$Attributes$id(id),
							A2($author$project$Gallery$TryOn$system.cU, globalIndex, id)))
					])) : A2(
				$elm$html$Html$div,
				$author$project$Gallery$TryOn$wrapperStyles,
				_List_fromArray(
					[
						A4(
						$author$project$Gallery$TryOn$svgView,
						width,
						height,
						'dimgray',
						A2(
							$elm$core$List$cons,
							$elm$html$Html$Attributes$id(id),
							A2($author$project$Gallery$TryOn$system.cU, globalIndex, id)))
					]));
		} else {
			return (item.aV !== 'dimgray') ? A2(
				$elm$html$Html$div,
				$author$project$Gallery$TryOn$wrapperStyles,
				_List_fromArray(
					[
						A4(
						$author$project$Gallery$TryOn$svgView,
						width,
						height,
						item.aV,
						A2(
							$elm$core$List$cons,
							$elm$html$Html$Attributes$id(id),
							A2(
								$elm$core$List$cons,
								A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
								A2($author$project$Gallery$TryOn$system.cT, globalIndex, id))))
					])) : A2(
				$elm$html$Html$div,
				$author$project$Gallery$TryOn$wrapperStyles,
				_List_fromArray(
					[
						A4(
						$author$project$Gallery$TryOn$svgView,
						width,
						height,
						item.aV,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id(id)
							]))
					]));
		}
	});
var $author$project$Gallery$TryOn$view = function (model) {
	return A2(
		$elm$html$Html$section,
		$author$project$Gallery$TryOn$sectionStyles,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				$author$project$Gallery$TryOn$colorGroupStyles,
				A2(
					$elm$core$List$indexedMap,
					$author$project$Gallery$TryOn$colorView(model),
					A2(
						$elm$core$List$filter,
						function (item) {
							return !item.aI;
						},
						model.au))),
				A2(
				$elm$html$Html$div,
				$author$project$Gallery$TryOn$sizeGroupStyles,
				A2(
					$elm$core$List$indexedMap,
					A2(
						$author$project$Gallery$TryOn$sizeView,
						model,
						$elm$core$List$length(
							A2(
								$elm$core$List$filter,
								function (item) {
									return !item.aI;
								},
								model.au))),
					A2(
						$elm$core$List$filter,
						function (item) {
							return item.aI === 1;
						},
						model.au))),
				$author$project$Gallery$TryOn$ghostView(model)
			]));
};
var $author$project$Gallery$Root$demoView = function (model) {
	switch (model.$) {
		case 0:
			var mo = model.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Gallery$Root$HanoiMsg,
				$author$project$Gallery$Hanoi$view(mo));
		case 1:
			var mo = model.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Gallery$Root$PuzzleMsg,
				$author$project$Gallery$Puzzle$view(mo));
		case 2:
			var mo = model.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Gallery$Root$ShapesMsg,
				$author$project$Gallery$Shapes$view(mo));
		case 3:
			var mo = model.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Gallery$Root$KnightMsg,
				$author$project$Gallery$Knight$view(mo));
		case 4:
			var mo = model.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Gallery$Root$TryOnMsg,
				$author$project$Gallery$TryOn$view(mo));
		default:
			var mo = model.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Gallery$Root$TaskBoardMsg,
				$author$project$Gallery$TaskBoard$view(mo));
	}
};
var $author$project$Introduction$Basic$ghostView = F2(
	function (dnd, items) {
		var maybeDragItem = A2(
			$elm$core$Maybe$andThen,
			function (_v1) {
				var dragIndex = _v1.a9;
				return $elm$core$List$head(
					A2($elm$core$List$drop, dragIndex, items));
			},
			$author$project$Introduction$Basic$system.be(dnd));
		if (!maybeDragItem.$) {
			var item = maybeDragItem.a;
			return A2(
				$elm$html$Html$div,
				$author$project$Introduction$Basic$system.c$(dnd),
				_List_fromArray(
					[
						$elm$html$Html$text(item)
					]));
		} else {
			return $elm$html$Html$text('');
		}
	});
var $author$project$Introduction$Basic$itemView = F3(
	function (dnd, index, item) {
		var itemId = 'id-' + item;
		var _v0 = $author$project$Introduction$Basic$system.be(dnd);
		if (!_v0.$) {
			var dragIndex = _v0.a.a9;
			return (!_Utils_eq(dragIndex, index)) ? A2(
				$elm$html$Html$p,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					A2($author$project$Introduction$Basic$system.cU, index, itemId)),
				_List_fromArray(
					[
						$elm$html$Html$text(item)
					])) : A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id(itemId)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('[---------]')
					]));
		} else {
			return A2(
				$elm$html$Html$p,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					A2($author$project$Introduction$Basic$system.cT, index, itemId)),
				_List_fromArray(
					[
						$elm$html$Html$text(item)
					]));
		}
	});
var $author$project$Introduction$Basic$view = function (model) {
	return A2(
		$elm$html$Html$section,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'text-align', 'center')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_Nil,
				A2(
					$elm$core$List$indexedMap,
					$author$project$Introduction$Basic$itemView(model.Q),
					model.au)),
				A2($author$project$Introduction$Basic$ghostView, model.Q, model.au)
			]));
};
var $mdgriffith$elm_ui$Internal$Model$AlignX = function (a) {
	return {$: 6, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$CenterX = 1;
var $mdgriffith$elm_ui$Element$centerX = $mdgriffith$elm_ui$Internal$Model$AlignX(1);
var $mdgriffith$elm_ui$Internal$Model$AlignY = function (a) {
	return {$: 5, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$CenterY = 1;
var $mdgriffith$elm_ui$Element$centerY = $mdgriffith$elm_ui$Internal$Model$AlignY(1);
var $mdgriffith$elm_ui$Internal$Model$Unkeyed = function (a) {
	return {$: 0, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$AsColumn = 1;
var $mdgriffith$elm_ui$Internal$Model$asColumn = 1;
var $mdgriffith$elm_ui$Internal$Style$classes = {cg: 'a', a4: 'atv', ci: 'ab', cj: 'cx', ck: 'cy', cl: 'acb', cm: 'accx', cn: 'accy', co: 'acr', bu: 'al', bv: 'ar', cp: 'at', a5: 'ah', a6: 'av', cr: 's', cw: 'bh', cx: 'b', cz: 'w7', cB: 'bd', cC: 'bdt', aS: 'bn', cD: 'bs', aT: 'cpe', cI: 'cp', cJ: 'cpx', cK: 'cpy', N: 'c', aW: 'ctr', aX: 'cb', aY: 'ccx', O: 'ccy', aF: 'cl', aZ: 'cr', cO: 'ct', cP: 'cptr', cQ: 'ctxt', cZ: 'fcs', bD: 'focus-within', c_: 'fs', c0: 'g', bb: 'hbh', bc: 'hc', bG: 'he', bd: 'hf', bH: 'hfp', c4: 'hv', c6: 'ic', c8: 'fr', da: 'iml', db: 'imlf', dc: 'imlp', dd: 'implw', de: 'it', df: 'i', bM: 'lnk', av: 'nb', bP: 'notxt', dm: 'ol', $7: 'or', ah: 'oq', dt: 'oh', bT: 'pg', bU: 'p', du: 'ppe', dw: 'ui', A: 'r', dy: 'sb', dz: 'sbx', dA: 'sby', dB: 'sbt', dE: 'e', dF: 'cap', dG: 'sev', dM: 'sk', q: 't', dO: 'tc', dP: 'w8', dQ: 'w2', dR: 'w9', dS: 'tj', a2: 'tja', dT: 'tl', dU: 'w3', dV: 'w5', dW: 'w4', dX: 'tr', dY: 'w6', dZ: 'w1', d_: 'tun', b8: 'ts', ak: 'clr', d2: 'u', bq: 'wc', cd: 'we', br: 'wf', ce: 'wfp', bs: 'wrp'};
var $mdgriffith$elm_ui$Internal$Model$Generic = {$: 0};
var $mdgriffith$elm_ui$Internal$Model$div = $mdgriffith$elm_ui$Internal$Model$Generic;
var $mdgriffith$elm_ui$Internal$Model$NoNearbyChildren = {$: 0};
var $mdgriffith$elm_ui$Internal$Model$columnClass = $mdgriffith$elm_ui$Internal$Style$classes.cr + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.N);
var $mdgriffith$elm_ui$Internal$Model$gridClass = $mdgriffith$elm_ui$Internal$Style$classes.cr + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.c0);
var $mdgriffith$elm_ui$Internal$Model$pageClass = $mdgriffith$elm_ui$Internal$Style$classes.cr + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.bT);
var $mdgriffith$elm_ui$Internal$Model$paragraphClass = $mdgriffith$elm_ui$Internal$Style$classes.cr + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.bU);
var $mdgriffith$elm_ui$Internal$Model$rowClass = $mdgriffith$elm_ui$Internal$Style$classes.cr + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.A);
var $mdgriffith$elm_ui$Internal$Model$singleClass = $mdgriffith$elm_ui$Internal$Style$classes.cr + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.dE);
var $mdgriffith$elm_ui$Internal$Model$contextClasses = function (context) {
	switch (context) {
		case 0:
			return $mdgriffith$elm_ui$Internal$Model$rowClass;
		case 1:
			return $mdgriffith$elm_ui$Internal$Model$columnClass;
		case 2:
			return $mdgriffith$elm_ui$Internal$Model$singleClass;
		case 3:
			return $mdgriffith$elm_ui$Internal$Model$gridClass;
		case 4:
			return $mdgriffith$elm_ui$Internal$Model$paragraphClass;
		default:
			return $mdgriffith$elm_ui$Internal$Model$pageClass;
	}
};
var $mdgriffith$elm_ui$Internal$Model$Keyed = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$NoStyleSheet = {$: 0};
var $mdgriffith$elm_ui$Internal$Model$Styled = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$Unstyled = function (a) {
	return {$: 0, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$addChildren = F2(
	function (existing, nearbyChildren) {
		switch (nearbyChildren.$) {
			case 0:
				return existing;
			case 1:
				var behind = nearbyChildren.a;
				return _Utils_ap(behind, existing);
			case 2:
				var inFront = nearbyChildren.a;
				return _Utils_ap(existing, inFront);
			default:
				var behind = nearbyChildren.a;
				var inFront = nearbyChildren.b;
				return _Utils_ap(
					behind,
					_Utils_ap(existing, inFront));
		}
	});
var $mdgriffith$elm_ui$Internal$Model$addKeyedChildren = F3(
	function (key, existing, nearbyChildren) {
		switch (nearbyChildren.$) {
			case 0:
				return existing;
			case 1:
				var behind = nearbyChildren.a;
				return _Utils_ap(
					A2(
						$elm$core$List$map,
						function (x) {
							return _Utils_Tuple2(key, x);
						},
						behind),
					existing);
			case 2:
				var inFront = nearbyChildren.a;
				return _Utils_ap(
					existing,
					A2(
						$elm$core$List$map,
						function (x) {
							return _Utils_Tuple2(key, x);
						},
						inFront));
			default:
				var behind = nearbyChildren.a;
				var inFront = nearbyChildren.b;
				return _Utils_ap(
					A2(
						$elm$core$List$map,
						function (x) {
							return _Utils_Tuple2(key, x);
						},
						behind),
					_Utils_ap(
						existing,
						A2(
							$elm$core$List$map,
							function (x) {
								return _Utils_Tuple2(key, x);
							},
							inFront)));
		}
	});
var $mdgriffith$elm_ui$Internal$Model$AsEl = 2;
var $mdgriffith$elm_ui$Internal$Model$asEl = 2;
var $mdgriffith$elm_ui$Internal$Model$AsParagraph = 4;
var $mdgriffith$elm_ui$Internal$Model$asParagraph = 4;
var $mdgriffith$elm_ui$Internal$Flag$Flag = function (a) {
	return {$: 0, a: a};
};
var $mdgriffith$elm_ui$Internal$Flag$Second = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $mdgriffith$elm_ui$Internal$Flag$flag = function (i) {
	return (i > 31) ? $mdgriffith$elm_ui$Internal$Flag$Second(1 << (i - 32)) : $mdgriffith$elm_ui$Internal$Flag$Flag(1 << i);
};
var $mdgriffith$elm_ui$Internal$Flag$alignBottom = $mdgriffith$elm_ui$Internal$Flag$flag(41);
var $mdgriffith$elm_ui$Internal$Flag$alignRight = $mdgriffith$elm_ui$Internal$Flag$flag(40);
var $mdgriffith$elm_ui$Internal$Flag$centerX = $mdgriffith$elm_ui$Internal$Flag$flag(42);
var $mdgriffith$elm_ui$Internal$Flag$centerY = $mdgriffith$elm_ui$Internal$Flag$flag(43);
var $elm$core$Set$Set_elm_builtin = $elm$core$Basics$identity;
var $elm$core$Set$empty = $elm$core$Dict$empty;
var $mdgriffith$elm_ui$Internal$Model$lengthClassName = function (x) {
	switch (x.$) {
		case 0:
			var px = x.a;
			return $elm$core$String$fromInt(px) + 'px';
		case 1:
			return 'auto';
		case 2:
			var i = x.a;
			return $elm$core$String$fromInt(i) + 'fr';
		case 3:
			var min = x.a;
			var len = x.b;
			return 'min' + ($elm$core$String$fromInt(min) + $mdgriffith$elm_ui$Internal$Model$lengthClassName(len));
		default:
			var max = x.a;
			var len = x.b;
			return 'max' + ($elm$core$String$fromInt(max) + $mdgriffith$elm_ui$Internal$Model$lengthClassName(len));
	}
};
var $mdgriffith$elm_ui$Internal$Model$floatClass = function (x) {
	return $elm$core$String$fromInt(
		$elm$core$Basics$round(x * 255));
};
var $mdgriffith$elm_ui$Internal$Model$transformClass = function (transform) {
	switch (transform.$) {
		case 0:
			return $elm$core$Maybe$Nothing;
		case 1:
			var _v1 = transform.a;
			var x = _v1.a;
			var y = _v1.b;
			var z = _v1.c;
			return $elm$core$Maybe$Just(
				'mv-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(x) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(y) + ('-' + $mdgriffith$elm_ui$Internal$Model$floatClass(z))))));
		default:
			var _v2 = transform.a;
			var tx = _v2.a;
			var ty = _v2.b;
			var tz = _v2.c;
			var _v3 = transform.b;
			var sx = _v3.a;
			var sy = _v3.b;
			var sz = _v3.c;
			var _v4 = transform.c;
			var ox = _v4.a;
			var oy = _v4.b;
			var oz = _v4.c;
			var angle = transform.d;
			return $elm$core$Maybe$Just(
				'tfrm-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(tx) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(ty) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(tz) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(sx) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(sy) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(sz) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(ox) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(oy) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(oz) + ('-' + $mdgriffith$elm_ui$Internal$Model$floatClass(angle))))))))))))))))))));
	}
};
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $mdgriffith$elm_ui$Internal$Model$getStyleName = function (style) {
	switch (style.$) {
		case 13:
			var name = style.a;
			return name;
		case 12:
			var name = style.a;
			var o = style.b;
			return name;
		case 0:
			var _class = style.a;
			return _class;
		case 1:
			var name = style.a;
			return name;
		case 2:
			var i = style.a;
			return 'font-size-' + $elm$core$String$fromInt(i);
		case 3:
			var _class = style.a;
			return _class;
		case 4:
			var _class = style.a;
			return _class;
		case 5:
			var cls = style.a;
			var x = style.b;
			var y = style.c;
			return cls;
		case 7:
			var cls = style.a;
			var top = style.b;
			var right = style.c;
			var bottom = style.d;
			var left = style.e;
			return cls;
		case 6:
			var cls = style.a;
			var top = style.b;
			var right = style.c;
			var bottom = style.d;
			var left = style.e;
			return cls;
		case 8:
			var template = style.a;
			return 'grid-rows-' + (A2(
				$elm$core$String$join,
				'-',
				A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$lengthClassName, template.dx)) + ('-cols-' + (A2(
				$elm$core$String$join,
				'-',
				A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$lengthClassName, template.F)) + ('-space-x-' + ($mdgriffith$elm_ui$Internal$Model$lengthClassName(template.dH.a) + ('-space-y-' + $mdgriffith$elm_ui$Internal$Model$lengthClassName(template.dH.b)))))));
		case 9:
			var pos = style.a;
			return 'gp grid-pos-' + ($elm$core$String$fromInt(pos.A) + ('-' + ($elm$core$String$fromInt(pos.cL) + ('-' + ($elm$core$String$fromInt(pos.d4) + ('-' + $elm$core$String$fromInt(pos.c2)))))));
		case 11:
			var selector = style.a;
			var subStyle = style.b;
			var name = function () {
				switch (selector) {
					case 0:
						return 'fs';
					case 1:
						return 'hv';
					default:
						return 'act';
				}
			}();
			return A2(
				$elm$core$String$join,
				' ',
				A2(
					$elm$core$List$map,
					function (sty) {
						var _v1 = $mdgriffith$elm_ui$Internal$Model$getStyleName(sty);
						if (_v1 === '') {
							return '';
						} else {
							var styleName = _v1;
							return styleName + ('-' + name);
						}
					},
					subStyle));
		default:
			var x = style.a;
			return A2(
				$elm$core$Maybe$withDefault,
				'',
				$mdgriffith$elm_ui$Internal$Model$transformClass(x));
	}
};
var $elm$core$Set$insert = F2(
	function (key, _v0) {
		var dict = _v0;
		return A3($elm$core$Dict$insert, key, 0, dict);
	});
var $elm$core$Dict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$get, key, dict);
		if (!_v0.$) {
			return true;
		} else {
			return false;
		}
	});
var $elm$core$Set$member = F2(
	function (key, _v0) {
		var dict = _v0;
		return A2($elm$core$Dict$member, key, dict);
	});
var $mdgriffith$elm_ui$Internal$Model$reduceStyles = F2(
	function (style, nevermind) {
		var cache = nevermind.a;
		var existing = nevermind.b;
		var styleName = $mdgriffith$elm_ui$Internal$Model$getStyleName(style);
		return A2($elm$core$Set$member, styleName, cache) ? nevermind : _Utils_Tuple2(
			A2($elm$core$Set$insert, styleName, cache),
			A2($elm$core$List$cons, style, existing));
	});
var $mdgriffith$elm_ui$Internal$Model$Property = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$Style = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$dot = function (c) {
	return '.' + c;
};
var $elm$core$String$fromFloat = _String_fromNumber;
var $mdgriffith$elm_ui$Internal$Model$formatColor = function (_v0) {
	var red = _v0.a;
	var green = _v0.b;
	var blue = _v0.c;
	var alpha = _v0.d;
	return 'rgba(' + ($elm$core$String$fromInt(
		$elm$core$Basics$round(red * 255)) + ((',' + $elm$core$String$fromInt(
		$elm$core$Basics$round(green * 255))) + ((',' + $elm$core$String$fromInt(
		$elm$core$Basics$round(blue * 255))) + (',' + ($elm$core$String$fromFloat(alpha) + ')')))));
};
var $mdgriffith$elm_ui$Internal$Model$formatBoxShadow = function (shadow) {
	return A2(
		$elm$core$String$join,
		' ',
		A2(
			$elm$core$List$filterMap,
			$elm$core$Basics$identity,
			_List_fromArray(
				[
					shadow.bK ? $elm$core$Maybe$Just('inset') : $elm$core$Maybe$Nothing,
					$elm$core$Maybe$Just(
					$elm$core$String$fromFloat(shadow.bQ.a) + 'px'),
					$elm$core$Maybe$Just(
					$elm$core$String$fromFloat(shadow.bQ.b) + 'px'),
					$elm$core$Maybe$Just(
					$elm$core$String$fromFloat(shadow.ao) + 'px'),
					$elm$core$Maybe$Just(
					$elm$core$String$fromFloat(shadow.aJ) + 'px'),
					$elm$core$Maybe$Just(
					$mdgriffith$elm_ui$Internal$Model$formatColor(shadow.aV))
				])));
};
var $elm$core$Tuple$mapFirst = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			func(x),
			y);
	});
var $elm$core$Tuple$mapSecond = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			x,
			func(y));
	});
var $mdgriffith$elm_ui$Internal$Model$renderFocusStyle = function (focus) {
	return _List_fromArray(
		[
			A2(
			$mdgriffith$elm_ui$Internal$Model$Style,
			$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bD) + ':focus-within',
			A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				_List_fromArray(
					[
						A2(
						$elm$core$Maybe$map,
						function (color) {
							return A2(
								$mdgriffith$elm_ui$Internal$Model$Property,
								'border-color',
								$mdgriffith$elm_ui$Internal$Model$formatColor(color));
						},
						focus.cA),
						A2(
						$elm$core$Maybe$map,
						function (color) {
							return A2(
								$mdgriffith$elm_ui$Internal$Model$Property,
								'background-color',
								$mdgriffith$elm_ui$Internal$Model$formatColor(color));
						},
						focus.ct),
						A2(
						$elm$core$Maybe$map,
						function (shadow) {
							return A2(
								$mdgriffith$elm_ui$Internal$Model$Property,
								'box-shadow',
								$mdgriffith$elm_ui$Internal$Model$formatBoxShadow(
									{
										ao: shadow.ao,
										aV: shadow.aV,
										bK: false,
										bQ: A2(
											$elm$core$Tuple$mapSecond,
											$elm$core$Basics$toFloat,
											A2($elm$core$Tuple$mapFirst, $elm$core$Basics$toFloat, shadow.bQ)),
										aJ: shadow.aJ
									}));
						},
						focus.dD),
						$elm$core$Maybe$Just(
						A2($mdgriffith$elm_ui$Internal$Model$Property, 'outline', 'none'))
					]))),
			A2(
			$mdgriffith$elm_ui$Internal$Model$Style,
			$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cr) + (':focus .focusable, ' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cr) + '.focusable:focus')),
			A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				_List_fromArray(
					[
						A2(
						$elm$core$Maybe$map,
						function (color) {
							return A2(
								$mdgriffith$elm_ui$Internal$Model$Property,
								'border-color',
								$mdgriffith$elm_ui$Internal$Model$formatColor(color));
						},
						focus.cA),
						A2(
						$elm$core$Maybe$map,
						function (color) {
							return A2(
								$mdgriffith$elm_ui$Internal$Model$Property,
								'background-color',
								$mdgriffith$elm_ui$Internal$Model$formatColor(color));
						},
						focus.ct),
						A2(
						$elm$core$Maybe$map,
						function (shadow) {
							return A2(
								$mdgriffith$elm_ui$Internal$Model$Property,
								'box-shadow',
								$mdgriffith$elm_ui$Internal$Model$formatBoxShadow(
									{
										ao: shadow.ao,
										aV: shadow.aV,
										bK: false,
										bQ: A2(
											$elm$core$Tuple$mapSecond,
											$elm$core$Basics$toFloat,
											A2($elm$core$Tuple$mapFirst, $elm$core$Basics$toFloat, shadow.bQ)),
										aJ: shadow.aJ
									}));
						},
						focus.dD),
						$elm$core$Maybe$Just(
						A2($mdgriffith$elm_ui$Internal$Model$Property, 'outline', 'none'))
					])))
		]);
};
var $mdgriffith$elm_ui$Internal$Style$Batch = function (a) {
	return {$: 5, a: a};
};
var $mdgriffith$elm_ui$Internal$Style$Child = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$Class = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$Descriptor = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$Left = 3;
var $mdgriffith$elm_ui$Internal$Style$Prop = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$Right = 2;
var $mdgriffith$elm_ui$Internal$Style$Self = $elm$core$Basics$identity;
var $mdgriffith$elm_ui$Internal$Style$Supports = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$Content = $elm$core$Basics$identity;
var $mdgriffith$elm_ui$Internal$Style$Bottom = 1;
var $mdgriffith$elm_ui$Internal$Style$CenterX = 4;
var $mdgriffith$elm_ui$Internal$Style$CenterY = 5;
var $mdgriffith$elm_ui$Internal$Style$Top = 0;
var $mdgriffith$elm_ui$Internal$Style$alignments = _List_fromArray(
	[0, 1, 2, 3, 4, 5]);
var $mdgriffith$elm_ui$Internal$Style$contentName = function (desc) {
	switch (desc) {
		case 0:
			var _v1 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cO);
		case 1:
			var _v2 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.aX);
		case 2:
			var _v3 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.aZ);
		case 3:
			var _v4 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.aF);
		case 4:
			var _v5 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.aY);
		default:
			var _v6 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.O);
	}
};
var $mdgriffith$elm_ui$Internal$Style$selfName = function (desc) {
	switch (desc) {
		case 0:
			var _v1 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cp);
		case 1:
			var _v2 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ci);
		case 2:
			var _v3 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bv);
		case 3:
			var _v4 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bu);
		case 4:
			var _v5 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cj);
		default:
			var _v6 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ck);
	}
};
var $mdgriffith$elm_ui$Internal$Style$describeAlignment = function (values) {
	var createDescription = function (alignment) {
		var _v0 = values(alignment);
		var content = _v0.a;
		var indiv = _v0.b;
		return _List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$contentName(alignment),
				content),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Child,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cr),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$selfName(alignment),
						indiv)
					]))
			]);
	};
	return $mdgriffith$elm_ui$Internal$Style$Batch(
		A2($elm$core$List$concatMap, createDescription, $mdgriffith$elm_ui$Internal$Style$alignments));
};
var $mdgriffith$elm_ui$Internal$Style$elDescription = _List_fromArray(
	[
		A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
		A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'column'),
		A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'pre'),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Descriptor,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bb),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '0'),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Child,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cw),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '-1')
					]))
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Descriptor,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dB),
		_List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Internal$Style$Child,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.q),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bd),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.br),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'auto !important')
							]))
					]))
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Child,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bc),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', 'auto')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Child,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bd),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '100000')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Child,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.br),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Child,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ce),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Child,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bq),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-start')
			])),
		$mdgriffith$elm_ui$Internal$Style$describeAlignment(
		function (alignment) {
			switch (alignment) {
				case 0:
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-start')
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', '0 !important')
							]));
				case 1:
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-end')
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', '0 !important')
							]));
				case 2:
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-end')
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-end')
							]));
				case 3:
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-start')
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-start')
							]));
				case 4:
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'center')
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'center')
							]));
				default:
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cr),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto')
									]))
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important')
							]));
			}
		})
	]);
var $mdgriffith$elm_ui$Internal$Style$gridAlignments = function (values) {
	var createDescription = function (alignment) {
		return _List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Internal$Style$Child,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cr),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$selfName(alignment),
						values(alignment))
					]))
			]);
	};
	return $mdgriffith$elm_ui$Internal$Style$Batch(
		A2($elm$core$List$concatMap, createDescription, $mdgriffith$elm_ui$Internal$Style$alignments));
};
var $mdgriffith$elm_ui$Internal$Style$Above = 0;
var $mdgriffith$elm_ui$Internal$Style$Behind = 5;
var $mdgriffith$elm_ui$Internal$Style$Below = 1;
var $mdgriffith$elm_ui$Internal$Style$OnLeft = 3;
var $mdgriffith$elm_ui$Internal$Style$OnRight = 2;
var $mdgriffith$elm_ui$Internal$Style$Within = 4;
var $mdgriffith$elm_ui$Internal$Style$locations = function () {
	var loc = 0;
	var _v0 = function () {
		switch (loc) {
			case 0:
				return 0;
			case 1:
				return 0;
			case 2:
				return 0;
			case 3:
				return 0;
			case 4:
				return 0;
			default:
				return 0;
		}
	}();
	return _List_fromArray(
		[0, 1, 2, 3, 4, 5]);
}();
var $mdgriffith$elm_ui$Internal$Style$baseSheet = _List_fromArray(
	[
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		'html,body',
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'padding', '0'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		_Utils_ap(
			$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cr),
			_Utils_ap(
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dE),
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.c6))),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'block')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cr) + ':focus',
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'outline', 'none')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dw),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', 'auto'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'min-height', '100%'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '0'),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				_Utils_ap(
					$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cr),
					$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bd)),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bd),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Child,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.c8),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.av),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'fixed')
							]))
					]))
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.av),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'relative'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border', 'none'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'row'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto'),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dE),
				$mdgriffith$elm_ui$Internal$Style$elDescription),
				$mdgriffith$elm_ui$Internal$Style$Batch(
				function (fn) {
					return A2($elm$core$List$map, fn, $mdgriffith$elm_ui$Internal$Style$locations);
				}(
					function (loc) {
						switch (loc) {
							case 0:
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cg),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'bottom', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '20'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bd),
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', 'auto')
												])),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.br),
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
												])),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												]))
										]));
							case 1:
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cx),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'bottom', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '20'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												])),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bd),
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', 'auto')
												]))
										]));
							case 2:
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.$7),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'top', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '20'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												]))
										]));
							case 3:
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dm),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'right', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'top', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '20'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												]))
										]));
							case 4:
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.c8),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'top', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												]))
										]));
							default:
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cw),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'top', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												]))
										]));
						}
					}))
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cr),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'relative'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border', 'none'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '0'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'row'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'resize', 'none'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-feature-settings', 'inherit'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'box-sizing', 'border-box'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'padding', '0'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-width', '0'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-style', 'solid'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-size', 'inherit'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'color', 'inherit'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-family', 'inherit'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'line-height', '1'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', 'inherit'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration', 'none'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-style', 'inherit'),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bs),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-wrap', 'wrap')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bP),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, '-moz-user-select', 'none'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, '-webkit-user-select', 'none'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, '-ms-user-select', 'none'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'user-select', 'none')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cP),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'cursor', 'pointer')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cQ),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'cursor', 'text')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.du),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none !important')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.aT),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto !important')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ak),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '0')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ah),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '1')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.c4, $mdgriffith$elm_ui$Internal$Style$classes.ak)) + ':hover',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '0')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.c4, $mdgriffith$elm_ui$Internal$Style$classes.ah)) + ':hover',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '1')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.cZ, $mdgriffith$elm_ui$Internal$Style$classes.ak)) + ':focus',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '0')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.cZ, $mdgriffith$elm_ui$Internal$Style$classes.ah)) + ':focus',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '1')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.a4, $mdgriffith$elm_ui$Internal$Style$classes.ak)) + ':active',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '0')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.a4, $mdgriffith$elm_ui$Internal$Style$classes.ah)) + ':active',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '1')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.b8),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Prop,
						'transition',
						A2(
							$elm$core$String$join,
							', ',
							A2(
								$elm$core$List$map,
								function (x) {
									return x + ' 160ms';
								},
								_List_fromArray(
									['transform', 'opacity', 'filter', 'background-color', 'color', 'font-size']))))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dy),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow', 'auto'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '1')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dz),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow-x', 'auto'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.A),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '1')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dA),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow-y', 'auto'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.N),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '1')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dE),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '1')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cI),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow', 'hidden')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cJ),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow-x', 'hidden')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cK),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow-y', 'hidden')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bq),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', 'auto')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.aS),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-width', '0')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cB),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-style', 'dashed')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cC),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-style', 'dotted')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cD),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-style', 'solid')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.q),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'pre'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline-block')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.de),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'line-height', '1.05'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'background', 'transparent')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dE),
				$mdgriffith$elm_ui$Internal$Style$elDescription),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.A),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'row'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cr),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', '0%'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cd),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bM),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bd),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'stretch !important')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bH),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'stretch !important')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.br),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '100000')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.aW),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'stretch')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'u:first-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.co,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:first-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.cm,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cj),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-left', 'auto !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:last-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.cm,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cj),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-right', 'auto !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:only-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.cm,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ck),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:last-of-type.' + ($mdgriffith$elm_ui$Internal$Style$classes.cm + ' ~ u'),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'u:first-of-type.' + ($mdgriffith$elm_ui$Internal$Style$classes.co + (' ~ s.' + $mdgriffith$elm_ui$Internal$Style$classes.cm)),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						$mdgriffith$elm_ui$Internal$Style$describeAlignment(
						function (alignment) {
							switch (alignment) {
								case 0:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-start')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-start')
											]));
								case 1:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-end')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-end')
											]));
								case 2:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-end')
											]),
										_List_Nil);
								case 3:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-start')
											]),
										_List_Nil);
								case 4:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'center')
											]),
										_List_Nil);
								default:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'center')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'center')
											]));
							}
						}),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dG),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'space-between')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.N),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'column'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cr),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', '0%'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bG),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.N),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bd),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '100000')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.br),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ce),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bq),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-start')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'u:first-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.cl,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:first-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.cn,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ck),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', '0 !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:last-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.cn,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ck),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', '0 !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:only-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.cn,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ck),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:last-of-type.' + ($mdgriffith$elm_ui$Internal$Style$classes.cn + ' ~ u'),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'u:first-of-type.' + ($mdgriffith$elm_ui$Internal$Style$classes.cl + (' ~ s.' + $mdgriffith$elm_ui$Internal$Style$classes.cn)),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						$mdgriffith$elm_ui$Internal$Style$describeAlignment(
						function (alignment) {
							switch (alignment) {
								case 0:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-start')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto')
											]));
								case 1:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-end')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto')
											]));
								case 2:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-end')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-end')
											]));
								case 3:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-start')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-start')
											]));
								case 4:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'center')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'center')
											]));
								default:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'center')
											]),
										_List_Nil);
							}
						}),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.aW),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'stretch !important')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dG),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'space-between')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.c0),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', '-ms-grid'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'.gp',
						_List_fromArray(
							[
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cr),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Supports,
						_Utils_Tuple2('display', 'grid'),
						_List_fromArray(
							[
								_Utils_Tuple2('display', 'grid')
							])),
						$mdgriffith$elm_ui$Internal$Style$gridAlignments(
						function (alignment) {
							switch (alignment) {
								case 0:
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-start')
										]);
								case 1:
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-end')
										]);
								case 2:
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-end')
										]);
								case 3:
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-start')
										]);
								case 4:
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'center')
										]);
								default:
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'center')
										]);
							}
						})
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bT),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'block'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cr + ':first-child'),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot(
							$mdgriffith$elm_ui$Internal$Style$classes.cr + ($mdgriffith$elm_ui$Internal$Style$selfName(3) + (':first-child + .' + $mdgriffith$elm_ui$Internal$Style$classes.cr))),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot(
							$mdgriffith$elm_ui$Internal$Style$classes.cr + ($mdgriffith$elm_ui$Internal$Style$selfName(2) + (':first-child + .' + $mdgriffith$elm_ui$Internal$Style$classes.cr))),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important')
							])),
						$mdgriffith$elm_ui$Internal$Style$describeAlignment(
						function (alignment) {
							switch (alignment) {
								case 0:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								case 1:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								case 2:
									return _Utils_Tuple2(
										_List_Nil,
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'float', 'right'),
												A2(
												$mdgriffith$elm_ui$Internal$Style$Descriptor,
												'::after',
												_List_fromArray(
													[
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'content', '\"\"'),
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'table'),
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'clear', 'both')
													]))
											]));
								case 3:
									return _Utils_Tuple2(
										_List_Nil,
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'float', 'left'),
												A2(
												$mdgriffith$elm_ui$Internal$Style$Descriptor,
												'::after',
												_List_fromArray(
													[
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'content', '\"\"'),
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'table'),
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'clear', 'both')
													]))
											]));
								case 4:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								default:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
							}
						})
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.da),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'pre-wrap'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'background-color', 'transparent')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dd),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dE),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dc),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'pre-wrap'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'cursor', 'text'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.db),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'pre-wrap'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'color', 'transparent')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bU),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'block'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'normal'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bb),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '0'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cw),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '-1')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.q),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'normal')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dE),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'normal'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.c8),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cw),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cg),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cx),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.$7),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dm),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.q),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'normal')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dE),
								_List_fromArray(
									[
										A2(
										$mdgriffith$elm_ui$Internal$Style$Child,
										$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.q),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline'),
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'normal')
											]))
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.A),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline-flex')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.N),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline-flex')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.c0),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline-grid')
							])),
						$mdgriffith$elm_ui$Internal$Style$describeAlignment(
						function (alignment) {
							switch (alignment) {
								case 0:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								case 1:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								case 2:
									return _Utils_Tuple2(
										_List_Nil,
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'float', 'right')
											]));
								case 3:
									return _Utils_Tuple2(
										_List_Nil,
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'float', 'left')
											]));
								case 4:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								default:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
							}
						})
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				'.hidden',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'none')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dZ),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '100')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dQ),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '200')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dU),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '300')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dW),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '400')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dV),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '500')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dY),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '600')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cz),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '700')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dP),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '800')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dR),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '900')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.df),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-style', 'italic')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dM),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration', 'line-through')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.d2),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration', 'underline'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration-skip-ink', 'auto'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration-skip', 'ink')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				_Utils_ap(
					$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.d2),
					$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dM)),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration', 'line-through underline'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration-skip-ink', 'auto'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration-skip', 'ink')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.d_),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-style', 'normal')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dS),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'justify')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.a2),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'justify-all')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dO),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'center')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dX),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'right')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dT),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'left')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				'.modal',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'fixed'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '0'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'top', '0'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none')
					]))
			]))
	]);
var $mdgriffith$elm_ui$Internal$Style$fontVariant = function (_var) {
	return _List_fromArray(
		[
			A2(
			$mdgriffith$elm_ui$Internal$Style$Class,
			'.v-' + _var,
			_List_fromArray(
				[
					A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-feature-settings', '\"' + (_var + '\"'))
				])),
			A2(
			$mdgriffith$elm_ui$Internal$Style$Class,
			'.v-' + (_var + '-off'),
			_List_fromArray(
				[
					A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-feature-settings', '\"' + (_var + '\" 0'))
				]))
		]);
};
var $mdgriffith$elm_ui$Internal$Style$commonValues = $elm$core$List$concat(
	_List_fromArray(
		[
			A2(
			$elm$core$List$map,
			function (x) {
				return A2(
					$mdgriffith$elm_ui$Internal$Style$Class,
					'.border-' + $elm$core$String$fromInt(x),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Style$Prop,
							'border-width',
							$elm$core$String$fromInt(x) + 'px')
						]));
			},
			A2($elm$core$List$range, 0, 6)),
			A2(
			$elm$core$List$map,
			function (i) {
				return A2(
					$mdgriffith$elm_ui$Internal$Style$Class,
					'.font-size-' + $elm$core$String$fromInt(i),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Style$Prop,
							'font-size',
							$elm$core$String$fromInt(i) + 'px')
						]));
			},
			A2($elm$core$List$range, 8, 32)),
			A2(
			$elm$core$List$map,
			function (i) {
				return A2(
					$mdgriffith$elm_ui$Internal$Style$Class,
					'.p-' + $elm$core$String$fromInt(i),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Style$Prop,
							'padding',
							$elm$core$String$fromInt(i) + 'px')
						]));
			},
			A2($elm$core$List$range, 0, 24)),
			_List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Internal$Style$Class,
				'.v-smcp',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-variant', 'small-caps')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Class,
				'.v-smcp-off',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-variant', 'normal')
					]))
			]),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('zero'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('onum'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('liga'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('dlig'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('ordn'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('tnum'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('afrc'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('frac')
		]));
var $mdgriffith$elm_ui$Internal$Style$explainer = '\n.explain {\n    border: 6px solid rgb(174, 121, 15) !important;\n}\n.explain > .' + ($mdgriffith$elm_ui$Internal$Style$classes.cr + (' {\n    border: 4px dashed rgb(0, 151, 167) !important;\n}\n\n.ctr {\n    border: none !important;\n}\n.explain > .ctr > .' + ($mdgriffith$elm_ui$Internal$Style$classes.cr + ' {\n    border: 4px dashed rgb(0, 151, 167) !important;\n}\n\n')));
var $mdgriffith$elm_ui$Internal$Style$inputTextReset = '\ninput[type="search"],\ninput[type="search"]::-webkit-search-decoration,\ninput[type="search"]::-webkit-search-cancel-button,\ninput[type="search"]::-webkit-search-results-button,\ninput[type="search"]::-webkit-search-results-decoration {\n  -webkit-appearance:none;\n}\n';
var $mdgriffith$elm_ui$Internal$Style$sliderReset = '\ninput[type=range] {\n  -webkit-appearance: none; \n  background: transparent;\n  position:absolute;\n  left:0;\n  top:0;\n  z-index:10;\n  width: 100%;\n  outline: dashed 1px;\n  height: 100%;\n  opacity: 0;\n}\n';
var $mdgriffith$elm_ui$Internal$Style$thumbReset = '\ninput[type=range]::-webkit-slider-thumb {\n    -webkit-appearance: none;\n    opacity: 0.5;\n    width: 80px;\n    height: 80px;\n    background-color: black;\n    border:none;\n    border-radius: 5px;\n}\ninput[type=range]::-moz-range-thumb {\n    opacity: 0.5;\n    width: 80px;\n    height: 80px;\n    background-color: black;\n    border:none;\n    border-radius: 5px;\n}\ninput[type=range]::-ms-thumb {\n    opacity: 0.5;\n    width: 80px;\n    height: 80px;\n    background-color: black;\n    border:none;\n    border-radius: 5px;\n}\ninput[type=range][orient=vertical]{\n    writing-mode: bt-lr; /* IE */\n    -webkit-appearance: slider-vertical;  /* WebKit */\n}\n';
var $mdgriffith$elm_ui$Internal$Style$trackReset = '\ninput[type=range]::-moz-range-track {\n    background: transparent;\n    cursor: pointer;\n}\ninput[type=range]::-ms-track {\n    background: transparent;\n    cursor: pointer;\n}\ninput[type=range]::-webkit-slider-runnable-track {\n    background: transparent;\n    cursor: pointer;\n}\n';
var $mdgriffith$elm_ui$Internal$Style$overrides = '@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cr) + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.A) + (' > ' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cr) + (' { flex-basis: auto !important; } ' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cr) + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.A) + (' > ' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cr) + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.aW) + (' { flex-basis: auto !important; }}' + ($mdgriffith$elm_ui$Internal$Style$inputTextReset + ($mdgriffith$elm_ui$Internal$Style$sliderReset + ($mdgriffith$elm_ui$Internal$Style$trackReset + ($mdgriffith$elm_ui$Internal$Style$thumbReset + $mdgriffith$elm_ui$Internal$Style$explainer)))))))))))))));
var $elm$core$String$concat = function (strings) {
	return A2($elm$core$String$join, '', strings);
};
var $mdgriffith$elm_ui$Internal$Style$Intermediate = $elm$core$Basics$identity;
var $mdgriffith$elm_ui$Internal$Style$emptyIntermediate = F2(
	function (selector, closing) {
		return {aU: closing, j: _List_Nil, V: _List_Nil, I: selector};
	});
var $mdgriffith$elm_ui$Internal$Style$renderRules = F2(
	function (_v0, rulesToRender) {
		var parent = _v0;
		var generateIntermediates = F2(
			function (rule, rendered) {
				switch (rule.$) {
					case 0:
						var name = rule.a;
						var val = rule.b;
						return _Utils_update(
							rendered,
							{
								V: A2(
									$elm$core$List$cons,
									_Utils_Tuple2(name, val),
									rendered.V)
							});
					case 2:
						var _v2 = rule.a;
						var prop = _v2.a;
						var value = _v2.b;
						var props = rule.b;
						return _Utils_update(
							rendered,
							{
								j: A2(
									$elm$core$List$cons,
									{aU: '\n}', j: _List_Nil, V: props, I: '@supports (' + (prop + (':' + (value + (') {' + parent.I))))},
									rendered.j)
							});
					case 4:
						var selector = rule.a;
						var adjRules = rule.b;
						return _Utils_update(
							rendered,
							{
								j: A2(
									$elm$core$List$cons,
									A2(
										$mdgriffith$elm_ui$Internal$Style$renderRules,
										A2($mdgriffith$elm_ui$Internal$Style$emptyIntermediate, parent.I + (' + ' + selector), ''),
										adjRules),
									rendered.j)
							});
					case 1:
						var child = rule.a;
						var childRules = rule.b;
						return _Utils_update(
							rendered,
							{
								j: A2(
									$elm$core$List$cons,
									A2(
										$mdgriffith$elm_ui$Internal$Style$renderRules,
										A2($mdgriffith$elm_ui$Internal$Style$emptyIntermediate, parent.I + (' > ' + child), ''),
										childRules),
									rendered.j)
							});
					case 3:
						var descriptor = rule.a;
						var descriptorRules = rule.b;
						return _Utils_update(
							rendered,
							{
								j: A2(
									$elm$core$List$cons,
									A2(
										$mdgriffith$elm_ui$Internal$Style$renderRules,
										A2(
											$mdgriffith$elm_ui$Internal$Style$emptyIntermediate,
											_Utils_ap(parent.I, descriptor),
											''),
										descriptorRules),
									rendered.j)
							});
					default:
						var batched = rule.a;
						return _Utils_update(
							rendered,
							{
								j: A2(
									$elm$core$List$cons,
									A2(
										$mdgriffith$elm_ui$Internal$Style$renderRules,
										A2($mdgriffith$elm_ui$Internal$Style$emptyIntermediate, parent.I, ''),
										batched),
									rendered.j)
							});
				}
			});
		return A3($elm$core$List$foldr, generateIntermediates, parent, rulesToRender);
	});
var $mdgriffith$elm_ui$Internal$Style$renderCompact = function (styleClasses) {
	var renderValues = function (values) {
		return $elm$core$String$concat(
			A2(
				$elm$core$List$map,
				function (_v3) {
					var x = _v3.a;
					var y = _v3.b;
					return x + (':' + (y + ';'));
				},
				values));
	};
	var renderClass = function (rule) {
		var _v2 = rule.V;
		if (!_v2.b) {
			return '';
		} else {
			return rule.I + ('{' + (renderValues(rule.V) + (rule.aU + '}')));
		}
	};
	var renderIntermediate = function (_v0) {
		var rule = _v0;
		return _Utils_ap(
			renderClass(rule),
			$elm$core$String$concat(
				A2($elm$core$List$map, renderIntermediate, rule.j)));
	};
	return $elm$core$String$concat(
		A2(
			$elm$core$List$map,
			renderIntermediate,
			A3(
				$elm$core$List$foldr,
				F2(
					function (_v1, existing) {
						var name = _v1.a;
						var styleRules = _v1.b;
						return A2(
							$elm$core$List$cons,
							A2(
								$mdgriffith$elm_ui$Internal$Style$renderRules,
								A2($mdgriffith$elm_ui$Internal$Style$emptyIntermediate, name, ''),
								styleRules),
							existing);
					}),
				_List_Nil,
				styleClasses)));
};
var $mdgriffith$elm_ui$Internal$Style$rules = _Utils_ap(
	$mdgriffith$elm_ui$Internal$Style$overrides,
	$mdgriffith$elm_ui$Internal$Style$renderCompact(
		_Utils_ap($mdgriffith$elm_ui$Internal$Style$baseSheet, $mdgriffith$elm_ui$Internal$Style$commonValues)));
var $mdgriffith$elm_ui$Internal$Model$staticRoot = function (opts) {
	var _v0 = opts.di;
	switch (_v0) {
		case 0:
			return A3(
				$elm$virtual_dom$VirtualDom$node,
				'div',
				_List_Nil,
				_List_fromArray(
					[
						A3(
						$elm$virtual_dom$VirtualDom$node,
						'style',
						_List_Nil,
						_List_fromArray(
							[
								$elm$virtual_dom$VirtualDom$text($mdgriffith$elm_ui$Internal$Style$rules)
							]))
					]));
		case 1:
			return $elm$virtual_dom$VirtualDom$text('');
		default:
			return A3(
				$elm$virtual_dom$VirtualDom$node,
				'elm-ui-static-rules',
				_List_fromArray(
					[
						A2(
						$elm$virtual_dom$VirtualDom$property,
						'rules',
						$elm$json$Json$Encode$string($mdgriffith$elm_ui$Internal$Style$rules))
					]),
				_List_Nil);
	}
};
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(0),
				entries));
	});
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(0),
			pairs));
};
var $mdgriffith$elm_ui$Internal$Model$fontName = function (font) {
	switch (font.$) {
		case 0:
			return 'serif';
		case 1:
			return 'sans-serif';
		case 2:
			return 'monospace';
		case 3:
			var name = font.a;
			return '\"' + (name + '\"');
		case 4:
			var name = font.a;
			var url = font.b;
			return '\"' + (name + '\"');
		default:
			var name = font.a.dl;
			return '\"' + (name + '\"');
	}
};
var $mdgriffith$elm_ui$Internal$Model$isSmallCaps = function (_var) {
	switch (_var.$) {
		case 0:
			var name = _var.a;
			return name === 'smcp';
		case 1:
			var name = _var.a;
			return false;
		default:
			var name = _var.a;
			var index = _var.b;
			return (name === 'smcp') && (index === 1);
	}
};
var $mdgriffith$elm_ui$Internal$Model$hasSmallCaps = function (typeface) {
	if (typeface.$ === 5) {
		var font = typeface.a;
		return A2($elm$core$List$any, $mdgriffith$elm_ui$Internal$Model$isSmallCaps, font.ca);
	} else {
		return false;
	}
};
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $mdgriffith$elm_ui$Internal$Model$renderProps = F3(
	function (force, _v0, existing) {
		var key = _v0.a;
		var val = _v0.b;
		return force ? (existing + ('\n  ' + (key + (': ' + (val + ' !important;'))))) : (existing + ('\n  ' + (key + (': ' + (val + ';')))));
	});
var $mdgriffith$elm_ui$Internal$Model$renderStyle = F4(
	function (options, maybePseudo, selector, props) {
		if (maybePseudo.$ === 1) {
			return _List_fromArray(
				[
					selector + ('{' + (A3(
					$elm$core$List$foldl,
					$mdgriffith$elm_ui$Internal$Model$renderProps(false),
					'',
					props) + '\n}'))
				]);
		} else {
			var pseudo = maybePseudo.a;
			switch (pseudo) {
				case 1:
					var _v2 = options.c4;
					switch (_v2) {
						case 0:
							return _List_Nil;
						case 2:
							return _List_fromArray(
								[
									selector + ('-hv {' + (A3(
									$elm$core$List$foldl,
									$mdgriffith$elm_ui$Internal$Model$renderProps(true),
									'',
									props) + '\n}'))
								]);
						default:
							return _List_fromArray(
								[
									selector + ('-hv:hover {' + (A3(
									$elm$core$List$foldl,
									$mdgriffith$elm_ui$Internal$Model$renderProps(false),
									'',
									props) + '\n}'))
								]);
					}
				case 0:
					var renderedProps = A3(
						$elm$core$List$foldl,
						$mdgriffith$elm_ui$Internal$Model$renderProps(false),
						'',
						props);
					return _List_fromArray(
						[selector + ('-fs:focus {' + (renderedProps + '\n}')), '.' + ($mdgriffith$elm_ui$Internal$Style$classes.cr + (':focus ~ ' + (selector + ('-fs:not(.focus)  {' + (renderedProps + '\n}'))))), '.' + ($mdgriffith$elm_ui$Internal$Style$classes.cr + (':focus ' + (selector + ('-fs  {' + (renderedProps + '\n}'))))), selector + ('-fs:focus-within {' + (renderedProps + '\n}')), '.focusable-parent:focus ~ ' + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.cr + (' ' + (selector + ('-fs {' + (renderedProps + '\n}'))))))]);
				default:
					return _List_fromArray(
						[
							selector + ('-act:active {' + (A3(
							$elm$core$List$foldl,
							$mdgriffith$elm_ui$Internal$Model$renderProps(false),
							'',
							props) + '\n}'))
						]);
			}
		}
	});
var $mdgriffith$elm_ui$Internal$Model$renderVariant = function (_var) {
	switch (_var.$) {
		case 0:
			var name = _var.a;
			return '\"' + (name + '\"');
		case 1:
			var name = _var.a;
			return '\"' + (name + '\" 0');
		default:
			var name = _var.a;
			var index = _var.b;
			return '\"' + (name + ('\" ' + $elm$core$String$fromInt(index)));
	}
};
var $mdgriffith$elm_ui$Internal$Model$renderVariants = function (typeface) {
	if (typeface.$ === 5) {
		var font = typeface.a;
		return $elm$core$Maybe$Just(
			A2(
				$elm$core$String$join,
				', ',
				A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$renderVariant, font.ca)));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $mdgriffith$elm_ui$Internal$Model$transformValue = function (transform) {
	switch (transform.$) {
		case 0:
			return $elm$core$Maybe$Nothing;
		case 1:
			var _v1 = transform.a;
			var x = _v1.a;
			var y = _v1.b;
			var z = _v1.c;
			return $elm$core$Maybe$Just(
				'translate3d(' + ($elm$core$String$fromFloat(x) + ('px, ' + ($elm$core$String$fromFloat(y) + ('px, ' + ($elm$core$String$fromFloat(z) + 'px)'))))));
		default:
			var _v2 = transform.a;
			var tx = _v2.a;
			var ty = _v2.b;
			var tz = _v2.c;
			var _v3 = transform.b;
			var sx = _v3.a;
			var sy = _v3.b;
			var sz = _v3.c;
			var _v4 = transform.c;
			var ox = _v4.a;
			var oy = _v4.b;
			var oz = _v4.c;
			var angle = transform.d;
			var translate = 'translate3d(' + ($elm$core$String$fromFloat(tx) + ('px, ' + ($elm$core$String$fromFloat(ty) + ('px, ' + ($elm$core$String$fromFloat(tz) + 'px)')))));
			var scale = 'scale3d(' + ($elm$core$String$fromFloat(sx) + (', ' + ($elm$core$String$fromFloat(sy) + (', ' + ($elm$core$String$fromFloat(sz) + ')')))));
			var rotate = 'rotate3d(' + ($elm$core$String$fromFloat(ox) + (', ' + ($elm$core$String$fromFloat(oy) + (', ' + ($elm$core$String$fromFloat(oz) + (', ' + ($elm$core$String$fromFloat(angle) + 'rad)')))))));
			return $elm$core$Maybe$Just(translate + (' ' + (scale + (' ' + rotate))));
	}
};
var $mdgriffith$elm_ui$Internal$Model$renderStyleRule = F3(
	function (options, rule, maybePseudo) {
		switch (rule.$) {
			case 0:
				var selector = rule.a;
				var props = rule.b;
				return A4($mdgriffith$elm_ui$Internal$Model$renderStyle, options, maybePseudo, selector, props);
			case 13:
				var name = rule.a;
				var prop = rule.b;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
					maybePseudo,
					'.' + name,
					_List_fromArray(
						[
							A2($mdgriffith$elm_ui$Internal$Model$Property, 'box-shadow', prop)
						]));
			case 12:
				var name = rule.a;
				var transparency = rule.b;
				var opacity = A2(
					$elm$core$Basics$max,
					0,
					A2($elm$core$Basics$min, 1, 1 - transparency));
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
					maybePseudo,
					'.' + name,
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Model$Property,
							'opacity',
							$elm$core$String$fromFloat(opacity))
						]));
			case 2:
				var i = rule.a;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
					maybePseudo,
					'.font-size-' + $elm$core$String$fromInt(i),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Model$Property,
							'font-size',
							$elm$core$String$fromInt(i) + 'px')
						]));
			case 1:
				var name = rule.a;
				var typefaces = rule.b;
				var features = A2(
					$elm$core$String$join,
					', ',
					A2($elm$core$List$filterMap, $mdgriffith$elm_ui$Internal$Model$renderVariants, typefaces));
				var families = _List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Model$Property,
						'font-family',
						A2(
							$elm$core$String$join,
							', ',
							A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$fontName, typefaces))),
						A2($mdgriffith$elm_ui$Internal$Model$Property, 'font-feature-settings', features),
						A2(
						$mdgriffith$elm_ui$Internal$Model$Property,
						'font-variant',
						A2($elm$core$List$any, $mdgriffith$elm_ui$Internal$Model$hasSmallCaps, typefaces) ? 'small-caps' : 'normal')
					]);
				return A4($mdgriffith$elm_ui$Internal$Model$renderStyle, options, maybePseudo, '.' + name, families);
			case 3:
				var _class = rule.a;
				var prop = rule.b;
				var val = rule.c;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
					maybePseudo,
					'.' + _class,
					_List_fromArray(
						[
							A2($mdgriffith$elm_ui$Internal$Model$Property, prop, val)
						]));
			case 4:
				var _class = rule.a;
				var prop = rule.b;
				var color = rule.c;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
					maybePseudo,
					'.' + _class,
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Model$Property,
							prop,
							$mdgriffith$elm_ui$Internal$Model$formatColor(color))
						]));
			case 5:
				var cls = rule.a;
				var x = rule.b;
				var y = rule.c;
				var yPx = $elm$core$String$fromInt(y) + 'px';
				var xPx = $elm$core$String$fromInt(x) + 'px';
				var single = '.' + $mdgriffith$elm_ui$Internal$Style$classes.dE;
				var row = '.' + $mdgriffith$elm_ui$Internal$Style$classes.A;
				var wrappedRow = '.' + ($mdgriffith$elm_ui$Internal$Style$classes.bs + row);
				var right = '.' + $mdgriffith$elm_ui$Internal$Style$classes.bv;
				var paragraph = '.' + $mdgriffith$elm_ui$Internal$Style$classes.bU;
				var page = '.' + $mdgriffith$elm_ui$Internal$Style$classes.bT;
				var left = '.' + $mdgriffith$elm_ui$Internal$Style$classes.bu;
				var halfY = $elm$core$String$fromFloat(y / 2) + 'px';
				var halfX = $elm$core$String$fromFloat(x / 2) + 'px';
				var column = '.' + $mdgriffith$elm_ui$Internal$Style$classes.N;
				var _class = '.' + cls;
				var any = '.' + $mdgriffith$elm_ui$Internal$Style$classes.cr;
				return $elm$core$List$concat(
					_List_fromArray(
						[
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (row + (' > ' + (any + (' + ' + any)))),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-left', xPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (wrappedRow + (' > ' + any)),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin', halfY + (' ' + halfX))
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (column + (' > ' + (any + (' + ' + any)))),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-top', yPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (page + (' > ' + (any + (' + ' + any)))),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-top', yPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (page + (' > ' + left)),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-right', xPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (page + (' > ' + right)),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-left', xPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_Utils_ap(_class, paragraph),
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Internal$Model$Property,
									'line-height',
									'calc(1em + ' + ($elm$core$String$fromInt(y) + 'px)'))
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							'textarea' + (any + _class),
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Internal$Model$Property,
									'line-height',
									'calc(1em + ' + ($elm$core$String$fromInt(y) + 'px)')),
									A2(
									$mdgriffith$elm_ui$Internal$Model$Property,
									'height',
									'calc(100% + ' + ($elm$core$String$fromInt(y) + 'px)'))
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (paragraph + (' > ' + left)),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-right', xPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (paragraph + (' > ' + right)),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-left', xPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (paragraph + '::after'),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'content', '\'\''),
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'display', 'block'),
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'height', '0'),
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'width', '0'),
									A2(
									$mdgriffith$elm_ui$Internal$Model$Property,
									'margin-top',
									$elm$core$String$fromInt((-1) * ((y / 2) | 0)) + 'px')
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (paragraph + '::before'),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'content', '\'\''),
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'display', 'block'),
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'height', '0'),
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'width', '0'),
									A2(
									$mdgriffith$elm_ui$Internal$Model$Property,
									'margin-bottom',
									$elm$core$String$fromInt((-1) * ((y / 2) | 0)) + 'px')
								]))
						]));
			case 7:
				var cls = rule.a;
				var top = rule.b;
				var right = rule.c;
				var bottom = rule.d;
				var left = rule.e;
				var _class = '.' + cls;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
					maybePseudo,
					_class,
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Model$Property,
							'padding',
							$elm$core$String$fromInt(top) + ('px ' + ($elm$core$String$fromInt(right) + ('px ' + ($elm$core$String$fromInt(bottom) + ('px ' + ($elm$core$String$fromInt(left) + 'px')))))))
						]));
			case 6:
				var cls = rule.a;
				var top = rule.b;
				var right = rule.c;
				var bottom = rule.d;
				var left = rule.e;
				var _class = '.' + cls;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
					maybePseudo,
					_class,
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Model$Property,
							'border-width',
							$elm$core$String$fromInt(top) + ('px ' + ($elm$core$String$fromInt(right) + ('px ' + ($elm$core$String$fromInt(bottom) + ('px ' + ($elm$core$String$fromInt(left) + 'px')))))))
						]));
			case 8:
				var template = rule.a;
				var toGridLengthHelper = F3(
					function (minimum, maximum, x) {
						toGridLengthHelper:
						while (true) {
							switch (x.$) {
								case 0:
									var px = x.a;
									return $elm$core$String$fromInt(px) + 'px';
								case 1:
									var _v2 = _Utils_Tuple2(minimum, maximum);
									if (_v2.a.$ === 1) {
										if (_v2.b.$ === 1) {
											var _v3 = _v2.a;
											var _v4 = _v2.b;
											return 'max-content';
										} else {
											var _v6 = _v2.a;
											var maxSize = _v2.b.a;
											return 'minmax(max-content, ' + ($elm$core$String$fromInt(maxSize) + 'px)');
										}
									} else {
										if (_v2.b.$ === 1) {
											var minSize = _v2.a.a;
											var _v5 = _v2.b;
											return 'minmax(' + ($elm$core$String$fromInt(minSize) + ('px, ' + 'max-content)'));
										} else {
											var minSize = _v2.a.a;
											var maxSize = _v2.b.a;
											return 'minmax(' + ($elm$core$String$fromInt(minSize) + ('px, ' + ($elm$core$String$fromInt(maxSize) + 'px)')));
										}
									}
								case 2:
									var i = x.a;
									var _v7 = _Utils_Tuple2(minimum, maximum);
									if (_v7.a.$ === 1) {
										if (_v7.b.$ === 1) {
											var _v8 = _v7.a;
											var _v9 = _v7.b;
											return $elm$core$String$fromInt(i) + 'fr';
										} else {
											var _v11 = _v7.a;
											var maxSize = _v7.b.a;
											return 'minmax(max-content, ' + ($elm$core$String$fromInt(maxSize) + 'px)');
										}
									} else {
										if (_v7.b.$ === 1) {
											var minSize = _v7.a.a;
											var _v10 = _v7.b;
											return 'minmax(' + ($elm$core$String$fromInt(minSize) + ('px, ' + ($elm$core$String$fromInt(i) + ('fr' + 'fr)'))));
										} else {
											var minSize = _v7.a.a;
											var maxSize = _v7.b.a;
											return 'minmax(' + ($elm$core$String$fromInt(minSize) + ('px, ' + ($elm$core$String$fromInt(maxSize) + 'px)')));
										}
									}
								case 3:
									var m = x.a;
									var len = x.b;
									var $temp$minimum = $elm$core$Maybe$Just(m),
										$temp$maximum = maximum,
										$temp$x = len;
									minimum = $temp$minimum;
									maximum = $temp$maximum;
									x = $temp$x;
									continue toGridLengthHelper;
								default:
									var m = x.a;
									var len = x.b;
									var $temp$minimum = minimum,
										$temp$maximum = $elm$core$Maybe$Just(m),
										$temp$x = len;
									minimum = $temp$minimum;
									maximum = $temp$maximum;
									x = $temp$x;
									continue toGridLengthHelper;
							}
						}
					});
				var toGridLength = function (x) {
					return A3(toGridLengthHelper, $elm$core$Maybe$Nothing, $elm$core$Maybe$Nothing, x);
				};
				var xSpacing = toGridLength(template.dH.a);
				var ySpacing = toGridLength(template.dH.b);
				var rows = function (x) {
					return 'grid-template-rows: ' + (x + ';');
				}(
					A2(
						$elm$core$String$join,
						' ',
						A2($elm$core$List$map, toGridLength, template.dx)));
				var msRows = function (x) {
					return '-ms-grid-rows: ' + (x + ';');
				}(
					A2(
						$elm$core$String$join,
						ySpacing,
						A2($elm$core$List$map, toGridLength, template.F)));
				var msColumns = function (x) {
					return '-ms-grid-columns: ' + (x + ';');
				}(
					A2(
						$elm$core$String$join,
						ySpacing,
						A2($elm$core$List$map, toGridLength, template.F)));
				var gapY = 'grid-row-gap:' + (toGridLength(template.dH.b) + ';');
				var gapX = 'grid-column-gap:' + (toGridLength(template.dH.a) + ';');
				var columns = function (x) {
					return 'grid-template-columns: ' + (x + ';');
				}(
					A2(
						$elm$core$String$join,
						' ',
						A2($elm$core$List$map, toGridLength, template.F)));
				var _class = '.grid-rows-' + (A2(
					$elm$core$String$join,
					'-',
					A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$lengthClassName, template.dx)) + ('-cols-' + (A2(
					$elm$core$String$join,
					'-',
					A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$lengthClassName, template.F)) + ('-space-x-' + ($mdgriffith$elm_ui$Internal$Model$lengthClassName(template.dH.a) + ('-space-y-' + $mdgriffith$elm_ui$Internal$Model$lengthClassName(template.dH.b)))))));
				var modernGrid = _class + ('{' + (columns + (rows + (gapX + (gapY + '}')))));
				var supports = '@supports (display:grid) {' + (modernGrid + '}');
				var base = _class + ('{' + (msColumns + (msRows + '}')));
				return _List_fromArray(
					[base, supports]);
			case 9:
				var position = rule.a;
				var msPosition = A2(
					$elm$core$String$join,
					' ',
					_List_fromArray(
						[
							'-ms-grid-row: ' + ($elm$core$String$fromInt(position.A) + ';'),
							'-ms-grid-row-span: ' + ($elm$core$String$fromInt(position.c2) + ';'),
							'-ms-grid-column: ' + ($elm$core$String$fromInt(position.cL) + ';'),
							'-ms-grid-column-span: ' + ($elm$core$String$fromInt(position.d4) + ';')
						]));
				var modernPosition = A2(
					$elm$core$String$join,
					' ',
					_List_fromArray(
						[
							'grid-row: ' + ($elm$core$String$fromInt(position.A) + (' / ' + ($elm$core$String$fromInt(position.A + position.c2) + ';'))),
							'grid-column: ' + ($elm$core$String$fromInt(position.cL) + (' / ' + ($elm$core$String$fromInt(position.cL + position.d4) + ';')))
						]));
				var _class = '.grid-pos-' + ($elm$core$String$fromInt(position.A) + ('-' + ($elm$core$String$fromInt(position.cL) + ('-' + ($elm$core$String$fromInt(position.d4) + ('-' + $elm$core$String$fromInt(position.c2)))))));
				var modernGrid = _class + ('{' + (modernPosition + '}'));
				var supports = '@supports (display:grid) {' + (modernGrid + '}');
				var base = _class + ('{' + (msPosition + '}'));
				return _List_fromArray(
					[base, supports]);
			case 11:
				var _class = rule.a;
				var styles = rule.b;
				var renderPseudoRule = function (style) {
					return A3(
						$mdgriffith$elm_ui$Internal$Model$renderStyleRule,
						options,
						style,
						$elm$core$Maybe$Just(_class));
				};
				return A2($elm$core$List$concatMap, renderPseudoRule, styles);
			default:
				var transform = rule.a;
				var val = $mdgriffith$elm_ui$Internal$Model$transformValue(transform);
				var _class = $mdgriffith$elm_ui$Internal$Model$transformClass(transform);
				var _v12 = _Utils_Tuple2(_class, val);
				if ((!_v12.a.$) && (!_v12.b.$)) {
					var cls = _v12.a.a;
					var v = _v12.b.a;
					return A4(
						$mdgriffith$elm_ui$Internal$Model$renderStyle,
						options,
						maybePseudo,
						'.' + cls,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Model$Property, 'transform', v)
							]));
				} else {
					return _List_Nil;
				}
		}
	});
var $mdgriffith$elm_ui$Internal$Model$encodeStyles = F2(
	function (options, stylesheet) {
		return $elm$json$Json$Encode$object(
			A2(
				$elm$core$List$map,
				function (style) {
					var styled = A3($mdgriffith$elm_ui$Internal$Model$renderStyleRule, options, style, $elm$core$Maybe$Nothing);
					return _Utils_Tuple2(
						$mdgriffith$elm_ui$Internal$Model$getStyleName(style),
						A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, styled));
				},
				stylesheet));
	});
var $mdgriffith$elm_ui$Internal$Model$bracket = F2(
	function (selector, rules) {
		var renderPair = function (_v0) {
			var name = _v0.a;
			var val = _v0.b;
			return name + (': ' + (val + ';'));
		};
		return selector + (' {' + (A2(
			$elm$core$String$join,
			'',
			A2($elm$core$List$map, renderPair, rules)) + '}'));
	});
var $mdgriffith$elm_ui$Internal$Model$fontRule = F3(
	function (name, modifier, _v0) {
		var parentAdj = _v0.a;
		var textAdjustment = _v0.b;
		return _List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Model$bracket, '.' + (name + ('.' + (modifier + (', ' + ('.' + (name + (' .' + modifier))))))), parentAdj),
				A2($mdgriffith$elm_ui$Internal$Model$bracket, '.' + (name + ('.' + (modifier + ('> .' + ($mdgriffith$elm_ui$Internal$Style$classes.q + (', .' + (name + (' .' + (modifier + (' > .' + $mdgriffith$elm_ui$Internal$Style$classes.q)))))))))), textAdjustment)
			]);
	});
var $mdgriffith$elm_ui$Internal$Model$renderFontAdjustmentRule = F3(
	function (fontToAdjust, _v0, otherFontName) {
		var full = _v0.a;
		var capital = _v0.b;
		var name = _Utils_eq(fontToAdjust, otherFontName) ? fontToAdjust : (otherFontName + (' .' + fontToAdjust));
		return A2(
			$elm$core$String$join,
			' ',
			_Utils_ap(
				A3($mdgriffith$elm_ui$Internal$Model$fontRule, name, $mdgriffith$elm_ui$Internal$Style$classes.dF, capital),
				A3($mdgriffith$elm_ui$Internal$Model$fontRule, name, $mdgriffith$elm_ui$Internal$Style$classes.c_, full)));
	});
var $mdgriffith$elm_ui$Internal$Model$renderNullAdjustmentRule = F2(
	function (fontToAdjust, otherFontName) {
		var name = _Utils_eq(fontToAdjust, otherFontName) ? fontToAdjust : (otherFontName + (' .' + fontToAdjust));
		return A2(
			$elm$core$String$join,
			' ',
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Internal$Model$bracket,
					'.' + (name + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.dF + (', ' + ('.' + (name + (' .' + $mdgriffith$elm_ui$Internal$Style$classes.dF))))))),
					_List_fromArray(
						[
							_Utils_Tuple2('line-height', '1')
						])),
					A2(
					$mdgriffith$elm_ui$Internal$Model$bracket,
					'.' + (name + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.dF + ('> .' + ($mdgriffith$elm_ui$Internal$Style$classes.q + (', .' + (name + (' .' + ($mdgriffith$elm_ui$Internal$Style$classes.dF + (' > .' + $mdgriffith$elm_ui$Internal$Style$classes.q)))))))))),
					_List_fromArray(
						[
							_Utils_Tuple2('vertical-align', '0'),
							_Utils_Tuple2('line-height', '1')
						]))
				]));
	});
var $mdgriffith$elm_ui$Internal$Model$adjust = F3(
	function (size, height, vertical) {
		return {c2: height / size, aJ: size, cb: vertical};
	});
var $elm$core$List$maximum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$max, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$List$minimum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$min, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $mdgriffith$elm_ui$Internal$Model$convertAdjustment = function (adjustment) {
	var lines = _List_fromArray(
		[adjustment.cG, adjustment.cu, adjustment.cR, adjustment.dh]);
	var lineHeight = 1.5;
	var normalDescender = (lineHeight - 1) / 2;
	var oldMiddle = lineHeight / 2;
	var descender = A2(
		$elm$core$Maybe$withDefault,
		adjustment.cR,
		$elm$core$List$minimum(lines));
	var newBaseline = A2(
		$elm$core$Maybe$withDefault,
		adjustment.cu,
		$elm$core$List$minimum(
			A2(
				$elm$core$List$filter,
				function (x) {
					return !_Utils_eq(x, descender);
				},
				lines)));
	var base = lineHeight;
	var ascender = A2(
		$elm$core$Maybe$withDefault,
		adjustment.cG,
		$elm$core$List$maximum(lines));
	var capitalSize = 1 / (ascender - newBaseline);
	var capitalVertical = 1 - ascender;
	var fullSize = 1 / (ascender - descender);
	var fullVertical = 1 - ascender;
	var newCapitalMiddle = ((ascender - newBaseline) / 2) + newBaseline;
	var newFullMiddle = ((ascender - descender) / 2) + descender;
	return {
		cG: A3($mdgriffith$elm_ui$Internal$Model$adjust, capitalSize, ascender - newBaseline, capitalVertical),
		bF: A3($mdgriffith$elm_ui$Internal$Model$adjust, fullSize, ascender - descender, fullVertical)
	};
};
var $mdgriffith$elm_ui$Internal$Model$fontAdjustmentRules = function (converted) {
	return _Utils_Tuple2(
		_List_fromArray(
			[
				_Utils_Tuple2('display', 'block')
			]),
		_List_fromArray(
			[
				_Utils_Tuple2('display', 'inline-block'),
				_Utils_Tuple2(
				'line-height',
				$elm$core$String$fromFloat(converted.c2)),
				_Utils_Tuple2(
				'vertical-align',
				$elm$core$String$fromFloat(converted.cb) + 'em'),
				_Utils_Tuple2(
				'font-size',
				$elm$core$String$fromFloat(converted.aJ) + 'em')
			]));
};
var $mdgriffith$elm_ui$Internal$Model$typefaceAdjustment = function (typefaces) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (face, found) {
				if (found.$ === 1) {
					if (face.$ === 5) {
						var _with = face.a;
						var _v2 = _with.ch;
						if (_v2.$ === 1) {
							return found;
						} else {
							var adjustment = _v2.a;
							return $elm$core$Maybe$Just(
								_Utils_Tuple2(
									$mdgriffith$elm_ui$Internal$Model$fontAdjustmentRules(
										function ($) {
											return $.bF;
										}(
											$mdgriffith$elm_ui$Internal$Model$convertAdjustment(adjustment))),
									$mdgriffith$elm_ui$Internal$Model$fontAdjustmentRules(
										function ($) {
											return $.cG;
										}(
											$mdgriffith$elm_ui$Internal$Model$convertAdjustment(adjustment)))));
						}
					} else {
						return found;
					}
				} else {
					return found;
				}
			}),
		$elm$core$Maybe$Nothing,
		typefaces);
};
var $mdgriffith$elm_ui$Internal$Model$renderTopLevelValues = function (rules) {
	var withImport = function (font) {
		if (font.$ === 4) {
			var url = font.b;
			return $elm$core$Maybe$Just('@import url(\'' + (url + '\');'));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	};
	var fontImports = function (_v2) {
		var name = _v2.a;
		var typefaces = _v2.b;
		var imports = A2(
			$elm$core$String$join,
			'\n',
			A2($elm$core$List$filterMap, withImport, typefaces));
		return imports;
	};
	var allNames = A2($elm$core$List$map, $elm$core$Tuple$first, rules);
	var fontAdjustments = function (_v1) {
		var name = _v1.a;
		var typefaces = _v1.b;
		var _v0 = $mdgriffith$elm_ui$Internal$Model$typefaceAdjustment(typefaces);
		if (_v0.$ === 1) {
			return A2(
				$elm$core$String$join,
				'',
				A2(
					$elm$core$List$map,
					$mdgriffith$elm_ui$Internal$Model$renderNullAdjustmentRule(name),
					allNames));
		} else {
			var adjustment = _v0.a;
			return A2(
				$elm$core$String$join,
				'',
				A2(
					$elm$core$List$map,
					A2($mdgriffith$elm_ui$Internal$Model$renderFontAdjustmentRule, name, adjustment),
					allNames));
		}
	};
	return _Utils_ap(
		A2(
			$elm$core$String$join,
			'\n',
			A2($elm$core$List$map, fontImports, rules)),
		A2(
			$elm$core$String$join,
			'\n',
			A2($elm$core$List$map, fontAdjustments, rules)));
};
var $mdgriffith$elm_ui$Internal$Model$topLevelValue = function (rule) {
	if (rule.$ === 1) {
		var name = rule.a;
		var typefaces = rule.b;
		return $elm$core$Maybe$Just(
			_Utils_Tuple2(name, typefaces));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $mdgriffith$elm_ui$Internal$Model$toStyleSheetString = F2(
	function (options, stylesheet) {
		var combine = F2(
			function (style, rendered) {
				return {
					a0: _Utils_ap(
						rendered.a0,
						A3($mdgriffith$elm_ui$Internal$Model$renderStyleRule, options, style, $elm$core$Maybe$Nothing)),
					aO: function () {
						var _v1 = $mdgriffith$elm_ui$Internal$Model$topLevelValue(style);
						if (_v1.$ === 1) {
							return rendered.aO;
						} else {
							var topLevel = _v1.a;
							return A2($elm$core$List$cons, topLevel, rendered.aO);
						}
					}()
				};
			});
		var _v0 = A3(
			$elm$core$List$foldl,
			combine,
			{a0: _List_Nil, aO: _List_Nil},
			stylesheet);
		var topLevel = _v0.aO;
		var rules = _v0.a0;
		return _Utils_ap(
			$mdgriffith$elm_ui$Internal$Model$renderTopLevelValues(topLevel),
			$elm$core$String$concat(rules));
	});
var $mdgriffith$elm_ui$Internal$Model$toStyleSheet = F2(
	function (options, styleSheet) {
		var _v0 = options.di;
		switch (_v0) {
			case 0:
				return A3(
					$elm$virtual_dom$VirtualDom$node,
					'div',
					_List_Nil,
					_List_fromArray(
						[
							A3(
							$elm$virtual_dom$VirtualDom$node,
							'style',
							_List_Nil,
							_List_fromArray(
								[
									$elm$virtual_dom$VirtualDom$text(
									A2($mdgriffith$elm_ui$Internal$Model$toStyleSheetString, options, styleSheet))
								]))
						]));
			case 1:
				return A3(
					$elm$virtual_dom$VirtualDom$node,
					'div',
					_List_Nil,
					_List_fromArray(
						[
							A3(
							$elm$virtual_dom$VirtualDom$node,
							'style',
							_List_Nil,
							_List_fromArray(
								[
									$elm$virtual_dom$VirtualDom$text(
									A2($mdgriffith$elm_ui$Internal$Model$toStyleSheetString, options, styleSheet))
								]))
						]));
			default:
				return A3(
					$elm$virtual_dom$VirtualDom$node,
					'elm-ui-rules',
					_List_fromArray(
						[
							A2(
							$elm$virtual_dom$VirtualDom$property,
							'rules',
							A2($mdgriffith$elm_ui$Internal$Model$encodeStyles, options, styleSheet))
						]),
					_List_Nil);
		}
	});
var $mdgriffith$elm_ui$Internal$Model$embedKeyed = F4(
	function (_static, opts, styles, children) {
		var dynamicStyleSheet = A2(
			$mdgriffith$elm_ui$Internal$Model$toStyleSheet,
			opts,
			A3(
				$elm$core$List$foldl,
				$mdgriffith$elm_ui$Internal$Model$reduceStyles,
				_Utils_Tuple2(
					$elm$core$Set$empty,
					$mdgriffith$elm_ui$Internal$Model$renderFocusStyle(opts.cZ)),
				styles).b);
		return _static ? A2(
			$elm$core$List$cons,
			_Utils_Tuple2(
				'static-stylesheet',
				$mdgriffith$elm_ui$Internal$Model$staticRoot(opts)),
			A2(
				$elm$core$List$cons,
				_Utils_Tuple2('dynamic-stylesheet', dynamicStyleSheet),
				children)) : A2(
			$elm$core$List$cons,
			_Utils_Tuple2('dynamic-stylesheet', dynamicStyleSheet),
			children);
	});
var $mdgriffith$elm_ui$Internal$Model$embedWith = F4(
	function (_static, opts, styles, children) {
		var dynamicStyleSheet = A2(
			$mdgriffith$elm_ui$Internal$Model$toStyleSheet,
			opts,
			A3(
				$elm$core$List$foldl,
				$mdgriffith$elm_ui$Internal$Model$reduceStyles,
				_Utils_Tuple2(
					$elm$core$Set$empty,
					$mdgriffith$elm_ui$Internal$Model$renderFocusStyle(opts.cZ)),
				styles).b);
		return _static ? A2(
			$elm$core$List$cons,
			$mdgriffith$elm_ui$Internal$Model$staticRoot(opts),
			A2($elm$core$List$cons, dynamicStyleSheet, children)) : A2($elm$core$List$cons, dynamicStyleSheet, children);
	});
var $mdgriffith$elm_ui$Internal$Flag$heightBetween = $mdgriffith$elm_ui$Internal$Flag$flag(45);
var $mdgriffith$elm_ui$Internal$Flag$heightFill = $mdgriffith$elm_ui$Internal$Flag$flag(37);
var $elm$virtual_dom$VirtualDom$keyedNode = function (tag) {
	return _VirtualDom_keyedNode(
		_VirtualDom_noScript(tag));
};
var $mdgriffith$elm_ui$Internal$Flag$present = F2(
	function (myFlag, _v0) {
		var fieldOne = _v0.a;
		var fieldTwo = _v0.b;
		if (!myFlag.$) {
			var first = myFlag.a;
			return _Utils_eq(first & fieldOne, first);
		} else {
			var second = myFlag.a;
			return _Utils_eq(second & fieldTwo, second);
		}
	});
var $elm$html$Html$s = _VirtualDom_node('s');
var $elm$html$Html$u = _VirtualDom_node('u');
var $mdgriffith$elm_ui$Internal$Flag$widthBetween = $mdgriffith$elm_ui$Internal$Flag$flag(44);
var $mdgriffith$elm_ui$Internal$Flag$widthFill = $mdgriffith$elm_ui$Internal$Flag$flag(39);
var $mdgriffith$elm_ui$Internal$Model$finalizeNode = F6(
	function (has, node, attributes, children, embedMode, parentContext) {
		var createNode = F2(
			function (nodeName, attrs) {
				if (children.$ === 1) {
					var keyed = children.a;
					return A3(
						$elm$virtual_dom$VirtualDom$keyedNode,
						nodeName,
						attrs,
						function () {
							switch (embedMode.$) {
								case 0:
									return keyed;
								case 2:
									var opts = embedMode.a;
									var styles = embedMode.b;
									return A4($mdgriffith$elm_ui$Internal$Model$embedKeyed, false, opts, styles, keyed);
								default:
									var opts = embedMode.a;
									var styles = embedMode.b;
									return A4($mdgriffith$elm_ui$Internal$Model$embedKeyed, true, opts, styles, keyed);
							}
						}());
				} else {
					var unkeyed = children.a;
					return A2(
						function () {
							switch (nodeName) {
								case 'div':
									return $elm$html$Html$div;
								case 'p':
									return $elm$html$Html$p;
								default:
									return $elm$virtual_dom$VirtualDom$node(nodeName);
							}
						}(),
						attrs,
						function () {
							switch (embedMode.$) {
								case 0:
									return unkeyed;
								case 2:
									var opts = embedMode.a;
									var styles = embedMode.b;
									return A4($mdgriffith$elm_ui$Internal$Model$embedWith, false, opts, styles, unkeyed);
								default:
									var opts = embedMode.a;
									var styles = embedMode.b;
									return A4($mdgriffith$elm_ui$Internal$Model$embedWith, true, opts, styles, unkeyed);
							}
						}());
				}
			});
		var html = function () {
			switch (node.$) {
				case 0:
					return A2(createNode, 'div', attributes);
				case 1:
					var nodeName = node.a;
					return A2(createNode, nodeName, attributes);
				default:
					var nodeName = node.a;
					var internal = node.b;
					return A3(
						$elm$virtual_dom$VirtualDom$node,
						nodeName,
						attributes,
						_List_fromArray(
							[
								A2(
								createNode,
								internal,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class($mdgriffith$elm_ui$Internal$Style$classes.cr + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.dE))
									]))
							]));
			}
		}();
		switch (parentContext) {
			case 0:
				return (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$widthFill, has) && (!A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$widthBetween, has))) ? html : (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$alignRight, has) ? A2(
					$elm$html$Html$u,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(
							A2(
								$elm$core$String$join,
								' ',
								_List_fromArray(
									[$mdgriffith$elm_ui$Internal$Style$classes.cr, $mdgriffith$elm_ui$Internal$Style$classes.dE, $mdgriffith$elm_ui$Internal$Style$classes.aW, $mdgriffith$elm_ui$Internal$Style$classes.O, $mdgriffith$elm_ui$Internal$Style$classes.co])))
						]),
					_List_fromArray(
						[html])) : (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$centerX, has) ? A2(
					$elm$html$Html$s,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(
							A2(
								$elm$core$String$join,
								' ',
								_List_fromArray(
									[$mdgriffith$elm_ui$Internal$Style$classes.cr, $mdgriffith$elm_ui$Internal$Style$classes.dE, $mdgriffith$elm_ui$Internal$Style$classes.aW, $mdgriffith$elm_ui$Internal$Style$classes.O, $mdgriffith$elm_ui$Internal$Style$classes.cm])))
						]),
					_List_fromArray(
						[html])) : html));
			case 1:
				return (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$heightFill, has) && (!A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$heightBetween, has))) ? html : (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$centerY, has) ? A2(
					$elm$html$Html$s,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(
							A2(
								$elm$core$String$join,
								' ',
								_List_fromArray(
									[$mdgriffith$elm_ui$Internal$Style$classes.cr, $mdgriffith$elm_ui$Internal$Style$classes.dE, $mdgriffith$elm_ui$Internal$Style$classes.aW, $mdgriffith$elm_ui$Internal$Style$classes.cn])))
						]),
					_List_fromArray(
						[html])) : (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$alignBottom, has) ? A2(
					$elm$html$Html$u,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(
							A2(
								$elm$core$String$join,
								' ',
								_List_fromArray(
									[$mdgriffith$elm_ui$Internal$Style$classes.cr, $mdgriffith$elm_ui$Internal$Style$classes.dE, $mdgriffith$elm_ui$Internal$Style$classes.aW, $mdgriffith$elm_ui$Internal$Style$classes.cl])))
						]),
					_List_fromArray(
						[html])) : html));
			default:
				return html;
		}
	});
var $mdgriffith$elm_ui$Internal$Model$textElementClasses = $mdgriffith$elm_ui$Internal$Style$classes.cr + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.q + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.bq + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.bc)))));
var $mdgriffith$elm_ui$Internal$Model$textElement = function (str) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class($mdgriffith$elm_ui$Internal$Model$textElementClasses)
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(str)
			]));
};
var $mdgriffith$elm_ui$Internal$Model$textElementFillClasses = $mdgriffith$elm_ui$Internal$Style$classes.cr + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.q + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.br + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.bd)))));
var $mdgriffith$elm_ui$Internal$Model$textElementFill = function (str) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class($mdgriffith$elm_ui$Internal$Model$textElementFillClasses)
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(str)
			]));
};
var $mdgriffith$elm_ui$Internal$Model$createElement = F3(
	function (context, children, rendered) {
		var gatherKeyed = F2(
			function (_v8, _v9) {
				var key = _v8.a;
				var child = _v8.b;
				var htmls = _v9.a;
				var existingStyles = _v9.b;
				switch (child.$) {
					case 0:
						var html = child.a;
						return _Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asParagraph) ? _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									key,
									html(context)),
								htmls),
							existingStyles) : _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									key,
									html(context)),
								htmls),
							existingStyles);
					case 1:
						var styled = child.a;
						return _Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asParagraph) ? _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									key,
									A2(styled.c5, $mdgriffith$elm_ui$Internal$Model$NoStyleSheet, context)),
								htmls),
							$elm$core$List$isEmpty(existingStyles) ? styled.dN : _Utils_ap(styled.dN, existingStyles)) : _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									key,
									A2(styled.c5, $mdgriffith$elm_ui$Internal$Model$NoStyleSheet, context)),
								htmls),
							$elm$core$List$isEmpty(existingStyles) ? styled.dN : _Utils_ap(styled.dN, existingStyles));
					case 2:
						var str = child.a;
						return _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									key,
									_Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asEl) ? $mdgriffith$elm_ui$Internal$Model$textElementFill(str) : $mdgriffith$elm_ui$Internal$Model$textElement(str)),
								htmls),
							existingStyles);
					default:
						return _Utils_Tuple2(htmls, existingStyles);
				}
			});
		var gather = F2(
			function (child, _v6) {
				var htmls = _v6.a;
				var existingStyles = _v6.b;
				switch (child.$) {
					case 0:
						var html = child.a;
						return _Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asParagraph) ? _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								html(context),
								htmls),
							existingStyles) : _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								html(context),
								htmls),
							existingStyles);
					case 1:
						var styled = child.a;
						return _Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asParagraph) ? _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								A2(styled.c5, $mdgriffith$elm_ui$Internal$Model$NoStyleSheet, context),
								htmls),
							$elm$core$List$isEmpty(existingStyles) ? styled.dN : _Utils_ap(styled.dN, existingStyles)) : _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								A2(styled.c5, $mdgriffith$elm_ui$Internal$Model$NoStyleSheet, context),
								htmls),
							$elm$core$List$isEmpty(existingStyles) ? styled.dN : _Utils_ap(styled.dN, existingStyles));
					case 2:
						var str = child.a;
						return _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asEl) ? $mdgriffith$elm_ui$Internal$Model$textElementFill(str) : $mdgriffith$elm_ui$Internal$Model$textElement(str),
								htmls),
							existingStyles);
					default:
						return _Utils_Tuple2(htmls, existingStyles);
				}
			});
		if (children.$ === 1) {
			var keyedChildren = children.a;
			var _v1 = A3(
				$elm$core$List$foldr,
				gatherKeyed,
				_Utils_Tuple2(_List_Nil, _List_Nil),
				keyedChildren);
			var keyed = _v1.a;
			var styles = _v1.b;
			var newStyles = $elm$core$List$isEmpty(styles) ? rendered.dN : _Utils_ap(rendered.dN, styles);
			if (!newStyles.b) {
				return $mdgriffith$elm_ui$Internal$Model$Unstyled(
					A5(
						$mdgriffith$elm_ui$Internal$Model$finalizeNode,
						rendered.af,
						rendered.ag,
						rendered._,
						$mdgriffith$elm_ui$Internal$Model$Keyed(
							A3($mdgriffith$elm_ui$Internal$Model$addKeyedChildren, 'nearby-element-pls', keyed, rendered.aa)),
						$mdgriffith$elm_ui$Internal$Model$NoStyleSheet));
			} else {
				var allStyles = newStyles;
				return $mdgriffith$elm_ui$Internal$Model$Styled(
					{
						c5: A4(
							$mdgriffith$elm_ui$Internal$Model$finalizeNode,
							rendered.af,
							rendered.ag,
							rendered._,
							$mdgriffith$elm_ui$Internal$Model$Keyed(
								A3($mdgriffith$elm_ui$Internal$Model$addKeyedChildren, 'nearby-element-pls', keyed, rendered.aa))),
						dN: allStyles
					});
			}
		} else {
			var unkeyedChildren = children.a;
			var _v3 = A3(
				$elm$core$List$foldr,
				gather,
				_Utils_Tuple2(_List_Nil, _List_Nil),
				unkeyedChildren);
			var unkeyed = _v3.a;
			var styles = _v3.b;
			var newStyles = $elm$core$List$isEmpty(styles) ? rendered.dN : _Utils_ap(rendered.dN, styles);
			if (!newStyles.b) {
				return $mdgriffith$elm_ui$Internal$Model$Unstyled(
					A5(
						$mdgriffith$elm_ui$Internal$Model$finalizeNode,
						rendered.af,
						rendered.ag,
						rendered._,
						$mdgriffith$elm_ui$Internal$Model$Unkeyed(
							A2($mdgriffith$elm_ui$Internal$Model$addChildren, unkeyed, rendered.aa)),
						$mdgriffith$elm_ui$Internal$Model$NoStyleSheet));
			} else {
				var allStyles = newStyles;
				return $mdgriffith$elm_ui$Internal$Model$Styled(
					{
						c5: A4(
							$mdgriffith$elm_ui$Internal$Model$finalizeNode,
							rendered.af,
							rendered.ag,
							rendered._,
							$mdgriffith$elm_ui$Internal$Model$Unkeyed(
								A2($mdgriffith$elm_ui$Internal$Model$addChildren, unkeyed, rendered.aa))),
						dN: allStyles
					});
			}
		}
	});
var $mdgriffith$elm_ui$Internal$Model$Single = F3(
	function (a, b, c) {
		return {$: 3, a: a, b: b, c: c};
	});
var $mdgriffith$elm_ui$Internal$Model$Transform = function (a) {
	return {$: 10, a: a};
};
var $mdgriffith$elm_ui$Internal$Flag$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$core$Bitwise$or = _Bitwise_or;
var $mdgriffith$elm_ui$Internal$Flag$add = F2(
	function (myFlag, _v0) {
		var one = _v0.a;
		var two = _v0.b;
		if (!myFlag.$) {
			var first = myFlag.a;
			return A2($mdgriffith$elm_ui$Internal$Flag$Field, first | one, two);
		} else {
			var second = myFlag.a;
			return A2($mdgriffith$elm_ui$Internal$Flag$Field, one, second | two);
		}
	});
var $mdgriffith$elm_ui$Internal$Model$ChildrenBehind = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$ChildrenBehindAndInFront = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$ChildrenInFront = function (a) {
	return {$: 2, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$nearbyElement = F2(
	function (location, elem) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					function () {
						switch (location) {
							case 0:
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.av, $mdgriffith$elm_ui$Internal$Style$classes.dE, $mdgriffith$elm_ui$Internal$Style$classes.cg]));
							case 1:
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.av, $mdgriffith$elm_ui$Internal$Style$classes.dE, $mdgriffith$elm_ui$Internal$Style$classes.cx]));
							case 2:
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.av, $mdgriffith$elm_ui$Internal$Style$classes.dE, $mdgriffith$elm_ui$Internal$Style$classes.$7]));
							case 3:
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.av, $mdgriffith$elm_ui$Internal$Style$classes.dE, $mdgriffith$elm_ui$Internal$Style$classes.dm]));
							case 4:
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.av, $mdgriffith$elm_ui$Internal$Style$classes.dE, $mdgriffith$elm_ui$Internal$Style$classes.c8]));
							default:
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.av, $mdgriffith$elm_ui$Internal$Style$classes.dE, $mdgriffith$elm_ui$Internal$Style$classes.cw]));
						}
					}())
				]),
			_List_fromArray(
				[
					function () {
					switch (elem.$) {
						case 3:
							return $elm$virtual_dom$VirtualDom$text('');
						case 2:
							var str = elem.a;
							return $mdgriffith$elm_ui$Internal$Model$textElement(str);
						case 0:
							var html = elem.a;
							return html($mdgriffith$elm_ui$Internal$Model$asEl);
						default:
							var styled = elem.a;
							return A2(styled.c5, $mdgriffith$elm_ui$Internal$Model$NoStyleSheet, $mdgriffith$elm_ui$Internal$Model$asEl);
					}
				}()
				]));
	});
var $mdgriffith$elm_ui$Internal$Model$addNearbyElement = F3(
	function (location, elem, existing) {
		var nearby = A2($mdgriffith$elm_ui$Internal$Model$nearbyElement, location, elem);
		switch (existing.$) {
			case 0:
				if (location === 5) {
					return $mdgriffith$elm_ui$Internal$Model$ChildrenBehind(
						_List_fromArray(
							[nearby]));
				} else {
					return $mdgriffith$elm_ui$Internal$Model$ChildrenInFront(
						_List_fromArray(
							[nearby]));
				}
			case 1:
				var existingBehind = existing.a;
				if (location === 5) {
					return $mdgriffith$elm_ui$Internal$Model$ChildrenBehind(
						A2($elm$core$List$cons, nearby, existingBehind));
				} else {
					return A2(
						$mdgriffith$elm_ui$Internal$Model$ChildrenBehindAndInFront,
						existingBehind,
						_List_fromArray(
							[nearby]));
				}
			case 2:
				var existingInFront = existing.a;
				if (location === 5) {
					return A2(
						$mdgriffith$elm_ui$Internal$Model$ChildrenBehindAndInFront,
						_List_fromArray(
							[nearby]),
						existingInFront);
				} else {
					return $mdgriffith$elm_ui$Internal$Model$ChildrenInFront(
						A2($elm$core$List$cons, nearby, existingInFront));
				}
			default:
				var existingBehind = existing.a;
				var existingInFront = existing.b;
				if (location === 5) {
					return A2(
						$mdgriffith$elm_ui$Internal$Model$ChildrenBehindAndInFront,
						A2($elm$core$List$cons, nearby, existingBehind),
						existingInFront);
				} else {
					return A2(
						$mdgriffith$elm_ui$Internal$Model$ChildrenBehindAndInFront,
						existingBehind,
						A2($elm$core$List$cons, nearby, existingInFront));
				}
		}
	});
var $mdgriffith$elm_ui$Internal$Model$Embedded = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$NodeName = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$addNodeName = F2(
	function (newNode, old) {
		switch (old.$) {
			case 0:
				return $mdgriffith$elm_ui$Internal$Model$NodeName(newNode);
			case 1:
				var name = old.a;
				return A2($mdgriffith$elm_ui$Internal$Model$Embedded, name, newNode);
			default:
				var x = old.a;
				var y = old.b;
				return A2($mdgriffith$elm_ui$Internal$Model$Embedded, x, y);
		}
	});
var $mdgriffith$elm_ui$Internal$Model$alignXName = function (align) {
	switch (align) {
		case 0:
			return $mdgriffith$elm_ui$Internal$Style$classes.a5 + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.bu);
		case 2:
			return $mdgriffith$elm_ui$Internal$Style$classes.a5 + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.bv);
		default:
			return $mdgriffith$elm_ui$Internal$Style$classes.a5 + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.cj);
	}
};
var $mdgriffith$elm_ui$Internal$Model$alignYName = function (align) {
	switch (align) {
		case 0:
			return $mdgriffith$elm_ui$Internal$Style$classes.a6 + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.cp);
		case 2:
			return $mdgriffith$elm_ui$Internal$Style$classes.a6 + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.ci);
		default:
			return $mdgriffith$elm_ui$Internal$Style$classes.a6 + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.ck);
	}
};
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $mdgriffith$elm_ui$Internal$Model$FullTransform = F4(
	function (a, b, c, d) {
		return {$: 2, a: a, b: b, c: c, d: d};
	});
var $mdgriffith$elm_ui$Internal$Model$Moved = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$composeTransformation = F2(
	function (transform, component) {
		switch (transform.$) {
			case 0:
				switch (component.$) {
					case 0:
						var x = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(x, 0, 0));
					case 1:
						var y = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(0, y, 0));
					case 2:
						var z = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(0, 0, z));
					case 3:
						var xyz = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(xyz);
					case 4:
						var xyz = component.a;
						var angle = component.b;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							_Utils_Tuple3(0, 0, 0),
							_Utils_Tuple3(1, 1, 1),
							xyz,
							angle);
					default:
						var xyz = component.a;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							_Utils_Tuple3(0, 0, 0),
							xyz,
							_Utils_Tuple3(0, 0, 1),
							0);
				}
			case 1:
				var moved = transform.a;
				var x = moved.a;
				var y = moved.b;
				var z = moved.c;
				switch (component.$) {
					case 0:
						var newX = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(newX, y, z));
					case 1:
						var newY = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(x, newY, z));
					case 2:
						var newZ = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(x, y, newZ));
					case 3:
						var xyz = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(xyz);
					case 4:
						var xyz = component.a;
						var angle = component.b;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							moved,
							_Utils_Tuple3(1, 1, 1),
							xyz,
							angle);
					default:
						var scale = component.a;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							moved,
							scale,
							_Utils_Tuple3(0, 0, 1),
							0);
				}
			default:
				var moved = transform.a;
				var x = moved.a;
				var y = moved.b;
				var z = moved.c;
				var scaled = transform.b;
				var origin = transform.c;
				var angle = transform.d;
				switch (component.$) {
					case 0:
						var newX = component.a;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							_Utils_Tuple3(newX, y, z),
							scaled,
							origin,
							angle);
					case 1:
						var newY = component.a;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							_Utils_Tuple3(x, newY, z),
							scaled,
							origin,
							angle);
					case 2:
						var newZ = component.a;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							_Utils_Tuple3(x, y, newZ),
							scaled,
							origin,
							angle);
					case 3:
						var newMove = component.a;
						return A4($mdgriffith$elm_ui$Internal$Model$FullTransform, newMove, scaled, origin, angle);
					case 4:
						var newOrigin = component.a;
						var newAngle = component.b;
						return A4($mdgriffith$elm_ui$Internal$Model$FullTransform, moved, scaled, newOrigin, newAngle);
					default:
						var newScale = component.a;
						return A4($mdgriffith$elm_ui$Internal$Model$FullTransform, moved, newScale, origin, angle);
				}
		}
	});
var $mdgriffith$elm_ui$Internal$Flag$height = $mdgriffith$elm_ui$Internal$Flag$flag(7);
var $mdgriffith$elm_ui$Internal$Flag$heightContent = $mdgriffith$elm_ui$Internal$Flag$flag(36);
var $mdgriffith$elm_ui$Internal$Flag$merge = F2(
	function (_v0, _v1) {
		var one = _v0.a;
		var two = _v0.b;
		var three = _v1.a;
		var four = _v1.b;
		return A2($mdgriffith$elm_ui$Internal$Flag$Field, one | three, two | four);
	});
var $mdgriffith$elm_ui$Internal$Flag$none = A2($mdgriffith$elm_ui$Internal$Flag$Field, 0, 0);
var $mdgriffith$elm_ui$Internal$Model$renderHeight = function (h) {
	switch (h.$) {
		case 0:
			var px = h.a;
			var val = $elm$core$String$fromInt(px);
			var name = 'height-px-' + val;
			return _Utils_Tuple3(
				$mdgriffith$elm_ui$Internal$Flag$none,
				$mdgriffith$elm_ui$Internal$Style$classes.bG + (' ' + name),
				_List_fromArray(
					[
						A3($mdgriffith$elm_ui$Internal$Model$Single, name, 'height', val + 'px')
					]));
		case 1:
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$heightContent, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.bc,
				_List_Nil);
		case 2:
			var portion = h.a;
			return (portion === 1) ? _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$heightFill, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.bd,
				_List_Nil) : _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$heightFill, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.bH + (' height-fill-' + $elm$core$String$fromInt(portion)),
				_List_fromArray(
					[
						A3(
						$mdgriffith$elm_ui$Internal$Model$Single,
						$mdgriffith$elm_ui$Internal$Style$classes.cr + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.N + (' > ' + $mdgriffith$elm_ui$Internal$Style$dot(
							'height-fill-' + $elm$core$String$fromInt(portion))))),
						'flex-grow',
						$elm$core$String$fromInt(portion * 100000))
					]));
		case 3:
			var minSize = h.a;
			var len = h.b;
			var cls = 'min-height-' + $elm$core$String$fromInt(minSize);
			var style = A3(
				$mdgriffith$elm_ui$Internal$Model$Single,
				cls,
				'min-height',
				$elm$core$String$fromInt(minSize) + 'px');
			var _v1 = $mdgriffith$elm_ui$Internal$Model$renderHeight(len);
			var newFlag = _v1.a;
			var newAttrs = _v1.b;
			var newStyle = _v1.c;
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$heightBetween, newFlag),
				cls + (' ' + newAttrs),
				A2($elm$core$List$cons, style, newStyle));
		default:
			var maxSize = h.a;
			var len = h.b;
			var cls = 'max-height-' + $elm$core$String$fromInt(maxSize);
			var style = A3(
				$mdgriffith$elm_ui$Internal$Model$Single,
				cls,
				'max-height',
				$elm$core$String$fromInt(maxSize) + 'px');
			var _v2 = $mdgriffith$elm_ui$Internal$Model$renderHeight(len);
			var newFlag = _v2.a;
			var newAttrs = _v2.b;
			var newStyle = _v2.c;
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$heightBetween, newFlag),
				cls + (' ' + newAttrs),
				A2($elm$core$List$cons, style, newStyle));
	}
};
var $mdgriffith$elm_ui$Internal$Flag$widthContent = $mdgriffith$elm_ui$Internal$Flag$flag(38);
var $mdgriffith$elm_ui$Internal$Model$renderWidth = function (w) {
	switch (w.$) {
		case 0:
			var px = w.a;
			return _Utils_Tuple3(
				$mdgriffith$elm_ui$Internal$Flag$none,
				$mdgriffith$elm_ui$Internal$Style$classes.cd + (' width-px-' + $elm$core$String$fromInt(px)),
				_List_fromArray(
					[
						A3(
						$mdgriffith$elm_ui$Internal$Model$Single,
						'width-px-' + $elm$core$String$fromInt(px),
						'width',
						$elm$core$String$fromInt(px) + 'px')
					]));
		case 1:
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$widthContent, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.bq,
				_List_Nil);
		case 2:
			var portion = w.a;
			return (portion === 1) ? _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$widthFill, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.br,
				_List_Nil) : _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$widthFill, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.ce + (' width-fill-' + $elm$core$String$fromInt(portion)),
				_List_fromArray(
					[
						A3(
						$mdgriffith$elm_ui$Internal$Model$Single,
						$mdgriffith$elm_ui$Internal$Style$classes.cr + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.A + (' > ' + $mdgriffith$elm_ui$Internal$Style$dot(
							'width-fill-' + $elm$core$String$fromInt(portion))))),
						'flex-grow',
						$elm$core$String$fromInt(portion * 100000))
					]));
		case 3:
			var minSize = w.a;
			var len = w.b;
			var cls = 'min-width-' + $elm$core$String$fromInt(minSize);
			var style = A3(
				$mdgriffith$elm_ui$Internal$Model$Single,
				cls,
				'min-width',
				$elm$core$String$fromInt(minSize) + 'px');
			var _v1 = $mdgriffith$elm_ui$Internal$Model$renderWidth(len);
			var newFlag = _v1.a;
			var newAttrs = _v1.b;
			var newStyle = _v1.c;
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$widthBetween, newFlag),
				cls + (' ' + newAttrs),
				A2($elm$core$List$cons, style, newStyle));
		default:
			var maxSize = w.a;
			var len = w.b;
			var cls = 'max-width-' + $elm$core$String$fromInt(maxSize);
			var style = A3(
				$mdgriffith$elm_ui$Internal$Model$Single,
				cls,
				'max-width',
				$elm$core$String$fromInt(maxSize) + 'px');
			var _v2 = $mdgriffith$elm_ui$Internal$Model$renderWidth(len);
			var newFlag = _v2.a;
			var newAttrs = _v2.b;
			var newStyle = _v2.c;
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$widthBetween, newFlag),
				cls + (' ' + newAttrs),
				A2($elm$core$List$cons, style, newStyle));
	}
};
var $mdgriffith$elm_ui$Internal$Flag$borderWidth = $mdgriffith$elm_ui$Internal$Flag$flag(27);
var $elm$core$Basics$ge = _Utils_ge;
var $mdgriffith$elm_ui$Internal$Model$skippable = F2(
	function (flag, style) {
		if (_Utils_eq(flag, $mdgriffith$elm_ui$Internal$Flag$borderWidth)) {
			if (style.$ === 3) {
				var val = style.c;
				switch (val) {
					case '0px':
						return true;
					case '1px':
						return true;
					case '2px':
						return true;
					case '3px':
						return true;
					case '4px':
						return true;
					case '5px':
						return true;
					case '6px':
						return true;
					default:
						return false;
				}
			} else {
				return false;
			}
		} else {
			switch (style.$) {
				case 2:
					var i = style.a;
					return (i >= 8) && (i <= 32);
				case 7:
					var name = style.a;
					var t = style.b;
					var r = style.c;
					var b = style.d;
					var l = style.e;
					return _Utils_eq(t, b) && (_Utils_eq(t, r) && (_Utils_eq(t, l) && ((t >= 0) && (t <= 24))));
				default:
					return false;
			}
		}
	});
var $mdgriffith$elm_ui$Internal$Flag$width = $mdgriffith$elm_ui$Internal$Flag$flag(6);
var $mdgriffith$elm_ui$Internal$Flag$xAlign = $mdgriffith$elm_ui$Internal$Flag$flag(30);
var $mdgriffith$elm_ui$Internal$Flag$yAlign = $mdgriffith$elm_ui$Internal$Flag$flag(29);
var $mdgriffith$elm_ui$Internal$Model$gatherAttrRecursive = F8(
	function (classes, node, has, transform, styles, attrs, children, elementAttrs) {
		gatherAttrRecursive:
		while (true) {
			if (!elementAttrs.b) {
				var _v1 = $mdgriffith$elm_ui$Internal$Model$transformClass(transform);
				if (_v1.$ === 1) {
					return {
						_: A2(
							$elm$core$List$cons,
							$elm$html$Html$Attributes$class(classes),
							attrs),
						aa: children,
						af: has,
						ag: node,
						dN: styles
					};
				} else {
					var _class = _v1.a;
					return {
						_: A2(
							$elm$core$List$cons,
							$elm$html$Html$Attributes$class(classes + (' ' + _class)),
							attrs),
						aa: children,
						af: has,
						ag: node,
						dN: A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Internal$Model$Transform(transform),
							styles)
					};
				}
			} else {
				var attribute = elementAttrs.a;
				var remaining = elementAttrs.b;
				switch (attribute.$) {
					case 0:
						var $temp$classes = classes,
							$temp$node = node,
							$temp$has = has,
							$temp$transform = transform,
							$temp$styles = styles,
							$temp$attrs = attrs,
							$temp$children = children,
							$temp$elementAttrs = remaining;
						classes = $temp$classes;
						node = $temp$node;
						has = $temp$has;
						transform = $temp$transform;
						styles = $temp$styles;
						attrs = $temp$attrs;
						children = $temp$children;
						elementAttrs = $temp$elementAttrs;
						continue gatherAttrRecursive;
					case 3:
						var flag = attribute.a;
						var exactClassName = attribute.b;
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, flag, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							var $temp$classes = exactClassName + (' ' + classes),
								$temp$node = node,
								$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, flag, has),
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						}
					case 1:
						var actualAttribute = attribute.a;
						var $temp$classes = classes,
							$temp$node = node,
							$temp$has = has,
							$temp$transform = transform,
							$temp$styles = styles,
							$temp$attrs = A2($elm$core$List$cons, actualAttribute, attrs),
							$temp$children = children,
							$temp$elementAttrs = remaining;
						classes = $temp$classes;
						node = $temp$node;
						has = $temp$has;
						transform = $temp$transform;
						styles = $temp$styles;
						attrs = $temp$attrs;
						children = $temp$children;
						elementAttrs = $temp$elementAttrs;
						continue gatherAttrRecursive;
					case 4:
						var flag = attribute.a;
						var style = attribute.b;
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, flag, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							if (A2($mdgriffith$elm_ui$Internal$Model$skippable, flag, style)) {
								var $temp$classes = $mdgriffith$elm_ui$Internal$Model$getStyleName(style) + (' ' + classes),
									$temp$node = node,
									$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, flag, has),
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							} else {
								var $temp$classes = $mdgriffith$elm_ui$Internal$Model$getStyleName(style) + (' ' + classes),
									$temp$node = node,
									$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, flag, has),
									$temp$transform = transform,
									$temp$styles = A2($elm$core$List$cons, style, styles),
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							}
						}
					case 10:
						var flag = attribute.a;
						var component = attribute.b;
						var $temp$classes = classes,
							$temp$node = node,
							$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, flag, has),
							$temp$transform = A2($mdgriffith$elm_ui$Internal$Model$composeTransformation, transform, component),
							$temp$styles = styles,
							$temp$attrs = attrs,
							$temp$children = children,
							$temp$elementAttrs = remaining;
						classes = $temp$classes;
						node = $temp$node;
						has = $temp$has;
						transform = $temp$transform;
						styles = $temp$styles;
						attrs = $temp$attrs;
						children = $temp$children;
						elementAttrs = $temp$elementAttrs;
						continue gatherAttrRecursive;
					case 7:
						var width = attribute.a;
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$width, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							switch (width.$) {
								case 0:
									var px = width.a;
									var $temp$classes = ($mdgriffith$elm_ui$Internal$Style$classes.cd + (' width-px-' + $elm$core$String$fromInt(px))) + (' ' + classes),
										$temp$node = node,
										$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$width, has),
										$temp$transform = transform,
										$temp$styles = A2(
										$elm$core$List$cons,
										A3(
											$mdgriffith$elm_ui$Internal$Model$Single,
											'width-px-' + $elm$core$String$fromInt(px),
											'width',
											$elm$core$String$fromInt(px) + 'px'),
										styles),
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
								case 1:
									var $temp$classes = classes + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.bq),
										$temp$node = node,
										$temp$has = A2(
										$mdgriffith$elm_ui$Internal$Flag$add,
										$mdgriffith$elm_ui$Internal$Flag$widthContent,
										A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$width, has)),
										$temp$transform = transform,
										$temp$styles = styles,
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
								case 2:
									var portion = width.a;
									if (portion === 1) {
										var $temp$classes = classes + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.br),
											$temp$node = node,
											$temp$has = A2(
											$mdgriffith$elm_ui$Internal$Flag$add,
											$mdgriffith$elm_ui$Internal$Flag$widthFill,
											A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$width, has)),
											$temp$transform = transform,
											$temp$styles = styles,
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									} else {
										var $temp$classes = classes + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.ce + (' width-fill-' + $elm$core$String$fromInt(portion)))),
											$temp$node = node,
											$temp$has = A2(
											$mdgriffith$elm_ui$Internal$Flag$add,
											$mdgriffith$elm_ui$Internal$Flag$widthFill,
											A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$width, has)),
											$temp$transform = transform,
											$temp$styles = A2(
											$elm$core$List$cons,
											A3(
												$mdgriffith$elm_ui$Internal$Model$Single,
												$mdgriffith$elm_ui$Internal$Style$classes.cr + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.A + (' > ' + $mdgriffith$elm_ui$Internal$Style$dot(
													'width-fill-' + $elm$core$String$fromInt(portion))))),
												'flex-grow',
												$elm$core$String$fromInt(portion * 100000)),
											styles),
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									}
								default:
									var _v4 = $mdgriffith$elm_ui$Internal$Model$renderWidth(width);
									var addToFlags = _v4.a;
									var newClass = _v4.b;
									var newStyles = _v4.c;
									var $temp$classes = classes + (' ' + newClass),
										$temp$node = node,
										$temp$has = A2(
										$mdgriffith$elm_ui$Internal$Flag$merge,
										addToFlags,
										A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$width, has)),
										$temp$transform = transform,
										$temp$styles = _Utils_ap(newStyles, styles),
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
							}
						}
					case 8:
						var height = attribute.a;
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$height, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							switch (height.$) {
								case 0:
									var px = height.a;
									var val = $elm$core$String$fromInt(px) + 'px';
									var name = 'height-px-' + val;
									var $temp$classes = $mdgriffith$elm_ui$Internal$Style$classes.bG + (' ' + (name + (' ' + classes))),
										$temp$node = node,
										$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$height, has),
										$temp$transform = transform,
										$temp$styles = A2(
										$elm$core$List$cons,
										A3($mdgriffith$elm_ui$Internal$Model$Single, name, 'height ', val),
										styles),
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
								case 1:
									var $temp$classes = $mdgriffith$elm_ui$Internal$Style$classes.bc + (' ' + classes),
										$temp$node = node,
										$temp$has = A2(
										$mdgriffith$elm_ui$Internal$Flag$add,
										$mdgriffith$elm_ui$Internal$Flag$heightContent,
										A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$height, has)),
										$temp$transform = transform,
										$temp$styles = styles,
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
								case 2:
									var portion = height.a;
									if (portion === 1) {
										var $temp$classes = $mdgriffith$elm_ui$Internal$Style$classes.bd + (' ' + classes),
											$temp$node = node,
											$temp$has = A2(
											$mdgriffith$elm_ui$Internal$Flag$add,
											$mdgriffith$elm_ui$Internal$Flag$heightFill,
											A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$height, has)),
											$temp$transform = transform,
											$temp$styles = styles,
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									} else {
										var $temp$classes = classes + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.bH + (' height-fill-' + $elm$core$String$fromInt(portion)))),
											$temp$node = node,
											$temp$has = A2(
											$mdgriffith$elm_ui$Internal$Flag$add,
											$mdgriffith$elm_ui$Internal$Flag$heightFill,
											A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$height, has)),
											$temp$transform = transform,
											$temp$styles = A2(
											$elm$core$List$cons,
											A3(
												$mdgriffith$elm_ui$Internal$Model$Single,
												$mdgriffith$elm_ui$Internal$Style$classes.cr + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.N + (' > ' + $mdgriffith$elm_ui$Internal$Style$dot(
													'height-fill-' + $elm$core$String$fromInt(portion))))),
												'flex-grow',
												$elm$core$String$fromInt(portion * 100000)),
											styles),
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									}
								default:
									var _v6 = $mdgriffith$elm_ui$Internal$Model$renderHeight(height);
									var addToFlags = _v6.a;
									var newClass = _v6.b;
									var newStyles = _v6.c;
									var $temp$classes = classes + (' ' + newClass),
										$temp$node = node,
										$temp$has = A2(
										$mdgriffith$elm_ui$Internal$Flag$merge,
										addToFlags,
										A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$height, has)),
										$temp$transform = transform,
										$temp$styles = _Utils_ap(newStyles, styles),
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
							}
						}
					case 2:
						var description = attribute.a;
						switch (description.$) {
							case 0:
								var $temp$classes = classes,
									$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'main', node),
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 1:
								var $temp$classes = classes,
									$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'nav', node),
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 2:
								var $temp$classes = classes,
									$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'footer', node),
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 3:
								var $temp$classes = classes,
									$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'aside', node),
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 4:
								var i = description.a;
								if (i <= 1) {
									var $temp$classes = classes,
										$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'h1', node),
										$temp$has = has,
										$temp$transform = transform,
										$temp$styles = styles,
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
								} else {
									if (i < 7) {
										var $temp$classes = classes,
											$temp$node = A2(
											$mdgriffith$elm_ui$Internal$Model$addNodeName,
											'h' + $elm$core$String$fromInt(i),
											node),
											$temp$has = has,
											$temp$transform = transform,
											$temp$styles = styles,
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									} else {
										var $temp$classes = classes,
											$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'h6', node),
											$temp$has = has,
											$temp$transform = transform,
											$temp$styles = styles,
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									}
								}
							case 9:
								var $temp$classes = classes,
									$temp$node = node,
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 8:
								var $temp$classes = classes,
									$temp$node = node,
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = A2(
									$elm$core$List$cons,
									A2($elm$virtual_dom$VirtualDom$attribute, 'role', 'button'),
									attrs),
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 5:
								var label = description.a;
								var $temp$classes = classes,
									$temp$node = node,
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = A2(
									$elm$core$List$cons,
									A2($elm$virtual_dom$VirtualDom$attribute, 'aria-label', label),
									attrs),
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 6:
								var $temp$classes = classes,
									$temp$node = node,
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = A2(
									$elm$core$List$cons,
									A2($elm$virtual_dom$VirtualDom$attribute, 'aria-live', 'polite'),
									attrs),
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							default:
								var $temp$classes = classes,
									$temp$node = node,
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = A2(
									$elm$core$List$cons,
									A2($elm$virtual_dom$VirtualDom$attribute, 'aria-live', 'assertive'),
									attrs),
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
						}
					case 9:
						var location = attribute.a;
						var elem = attribute.b;
						var newStyles = function () {
							switch (elem.$) {
								case 3:
									return styles;
								case 2:
									var str = elem.a;
									return styles;
								case 0:
									var html = elem.a;
									return styles;
								default:
									var styled = elem.a;
									return _Utils_ap(styles, styled.dN);
							}
						}();
						var $temp$classes = classes,
							$temp$node = node,
							$temp$has = has,
							$temp$transform = transform,
							$temp$styles = newStyles,
							$temp$attrs = attrs,
							$temp$children = A3($mdgriffith$elm_ui$Internal$Model$addNearbyElement, location, elem, children),
							$temp$elementAttrs = remaining;
						classes = $temp$classes;
						node = $temp$node;
						has = $temp$has;
						transform = $temp$transform;
						styles = $temp$styles;
						attrs = $temp$attrs;
						children = $temp$children;
						elementAttrs = $temp$elementAttrs;
						continue gatherAttrRecursive;
					case 6:
						var x = attribute.a;
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$xAlign, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							var $temp$classes = $mdgriffith$elm_ui$Internal$Model$alignXName(x) + (' ' + classes),
								$temp$node = node,
								$temp$has = function (flags) {
								switch (x) {
									case 1:
										return A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$centerX, flags);
									case 2:
										return A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$alignRight, flags);
									default:
										return flags;
								}
							}(
								A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$xAlign, has)),
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						}
					default:
						var y = attribute.a;
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$yAlign, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							var $temp$classes = $mdgriffith$elm_ui$Internal$Model$alignYName(y) + (' ' + classes),
								$temp$node = node,
								$temp$has = function (flags) {
								switch (y) {
									case 1:
										return A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$centerY, flags);
									case 2:
										return A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$alignBottom, flags);
									default:
										return flags;
								}
							}(
								A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$yAlign, has)),
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						}
				}
			}
		}
	});
var $mdgriffith$elm_ui$Internal$Model$Untransformed = {$: 0};
var $mdgriffith$elm_ui$Internal$Model$untransformed = $mdgriffith$elm_ui$Internal$Model$Untransformed;
var $mdgriffith$elm_ui$Internal$Model$element = F4(
	function (context, node, attributes, children) {
		return A3(
			$mdgriffith$elm_ui$Internal$Model$createElement,
			context,
			children,
			A8(
				$mdgriffith$elm_ui$Internal$Model$gatherAttrRecursive,
				$mdgriffith$elm_ui$Internal$Model$contextClasses(context),
				node,
				$mdgriffith$elm_ui$Internal$Flag$none,
				$mdgriffith$elm_ui$Internal$Model$untransformed,
				_List_Nil,
				_List_Nil,
				$mdgriffith$elm_ui$Internal$Model$NoNearbyChildren,
				$elm$core$List$reverse(attributes)));
	});
var $mdgriffith$elm_ui$Internal$Model$Height = function (a) {
	return {$: 8, a: a};
};
var $mdgriffith$elm_ui$Element$height = $mdgriffith$elm_ui$Internal$Model$Height;
var $mdgriffith$elm_ui$Internal$Model$Attr = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$htmlClass = function (cls) {
	return $mdgriffith$elm_ui$Internal$Model$Attr(
		$elm$html$Html$Attributes$class(cls));
};
var $mdgriffith$elm_ui$Internal$Model$Content = {$: 1};
var $mdgriffith$elm_ui$Element$shrink = $mdgriffith$elm_ui$Internal$Model$Content;
var $mdgriffith$elm_ui$Internal$Model$Width = function (a) {
	return {$: 7, a: a};
};
var $mdgriffith$elm_ui$Element$width = $mdgriffith$elm_ui$Internal$Model$Width;
var $mdgriffith$elm_ui$Element$column = F2(
	function (attrs, children) {
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asColumn,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.cO + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.aF)),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
						attrs))),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(children));
	});
var $mdgriffith$elm_ui$Internal$Model$Fill = function (a) {
	return {$: 2, a: a};
};
var $mdgriffith$elm_ui$Element$fill = $mdgriffith$elm_ui$Internal$Model$Fill(1);
var $mdgriffith$elm_ui$Element$el = F2(
	function (attrs, child) {
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asEl,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
					attrs)),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(
				_List_fromArray(
					[child])));
	});
var $mdgriffith$elm_ui$Element$htmlAttribute = $mdgriffith$elm_ui$Internal$Model$Attr;
var $mdgriffith$elm_ui$Internal$Model$Empty = {$: 3};
var $mdgriffith$elm_ui$Element$none = $mdgriffith$elm_ui$Internal$Model$Empty;
var $mdgriffith$elm_ui$Internal$Model$Text = function (a) {
	return {$: 2, a: a};
};
var $mdgriffith$elm_ui$Element$text = function (content) {
	return $mdgriffith$elm_ui$Internal$Model$Text(content);
};
var $author$project$Introduction$BasicElmUI$ghostView = F2(
	function (dnd, items) {
		var maybeDragItem = A2(
			$elm$core$Maybe$andThen,
			function (_v1) {
				var dragIndex = _v1.a9;
				return $elm$core$List$head(
					A2($elm$core$List$drop, dragIndex, items));
			},
			$author$project$Introduction$BasicElmUI$system.be(dnd));
		if (!maybeDragItem.$) {
			var item = maybeDragItem.a;
			return A2(
				$mdgriffith$elm_ui$Element$el,
				A2(
					$elm$core$List$map,
					$mdgriffith$elm_ui$Element$htmlAttribute,
					$author$project$Introduction$BasicElmUI$system.c$(dnd)),
				$mdgriffith$elm_ui$Element$text(item));
		} else {
			return $mdgriffith$elm_ui$Element$none;
		}
	});
var $mdgriffith$elm_ui$Internal$Model$InFront = 4;
var $mdgriffith$elm_ui$Internal$Model$Nearby = F2(
	function (a, b) {
		return {$: 9, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$NoAttribute = {$: 0};
var $mdgriffith$elm_ui$Element$createNearby = F2(
	function (loc, element) {
		if (element.$ === 3) {
			return $mdgriffith$elm_ui$Internal$Model$NoAttribute;
		} else {
			return A2($mdgriffith$elm_ui$Internal$Model$Nearby, loc, element);
		}
	});
var $mdgriffith$elm_ui$Element$inFront = function (element) {
	return A2($mdgriffith$elm_ui$Element$createNearby, 4, element);
};
var $author$project$Introduction$BasicElmUI$itemView = F3(
	function (dnd, index, item) {
		var itemId = 'id-' + item;
		var _v0 = $author$project$Introduction$BasicElmUI$system.be(dnd);
		if (!_v0.$) {
			var dragIndex = _v0.a.a9;
			return (!_Utils_eq(dragIndex, index)) ? A2(
				$mdgriffith$elm_ui$Element$el,
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$htmlAttribute(
						$elm$html$Html$Attributes$id(itemId)),
					A2(
						$elm$core$List$map,
						$mdgriffith$elm_ui$Element$htmlAttribute,
						A2($author$project$Introduction$BasicElmUI$system.cU, index, itemId))),
				$mdgriffith$elm_ui$Element$text(item)) : A2(
				$mdgriffith$elm_ui$Element$el,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$htmlAttribute(
						$elm$html$Html$Attributes$id(itemId))
					]),
				$mdgriffith$elm_ui$Element$text('[---------]'));
		} else {
			return A2(
				$mdgriffith$elm_ui$Element$el,
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$htmlAttribute(
						$elm$html$Html$Attributes$id(itemId)),
					A2(
						$elm$core$List$map,
						$mdgriffith$elm_ui$Element$htmlAttribute,
						A2($author$project$Introduction$BasicElmUI$system.cT, index, itemId))),
				$mdgriffith$elm_ui$Element$text(item));
		}
	});
var $mdgriffith$elm_ui$Internal$Model$OnlyDynamic = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$StaticRootAndDynamic = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$AllowHover = 1;
var $mdgriffith$elm_ui$Internal$Model$Layout = 0;
var $mdgriffith$elm_ui$Internal$Model$Rgba = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $mdgriffith$elm_ui$Internal$Model$focusDefaultStyle = {
	ct: $elm$core$Maybe$Nothing,
	cA: $elm$core$Maybe$Nothing,
	dD: $elm$core$Maybe$Just(
		{
			ao: 0,
			aV: A4($mdgriffith$elm_ui$Internal$Model$Rgba, 155 / 255, 203 / 255, 1, 1),
			bQ: _Utils_Tuple2(0, 0),
			aJ: 3
		})
};
var $mdgriffith$elm_ui$Internal$Model$optionsToRecord = function (options) {
	var combine = F2(
		function (opt, record) {
			switch (opt.$) {
				case 0:
					var hoverable = opt.a;
					var _v4 = record.c4;
					if (_v4.$ === 1) {
						return _Utils_update(
							record,
							{
								c4: $elm$core$Maybe$Just(hoverable)
							});
					} else {
						return record;
					}
				case 1:
					var focusStyle = opt.a;
					var _v5 = record.cZ;
					if (_v5.$ === 1) {
						return _Utils_update(
							record,
							{
								cZ: $elm$core$Maybe$Just(focusStyle)
							});
					} else {
						return record;
					}
				default:
					var renderMode = opt.a;
					var _v6 = record.di;
					if (_v6.$ === 1) {
						return _Utils_update(
							record,
							{
								di: $elm$core$Maybe$Just(renderMode)
							});
					} else {
						return record;
					}
			}
		});
	var andFinally = function (record) {
		return {
			cZ: function () {
				var _v0 = record.cZ;
				if (_v0.$ === 1) {
					return $mdgriffith$elm_ui$Internal$Model$focusDefaultStyle;
				} else {
					var focusable = _v0.a;
					return focusable;
				}
			}(),
			c4: function () {
				var _v1 = record.c4;
				if (_v1.$ === 1) {
					return 1;
				} else {
					var hoverable = _v1.a;
					return hoverable;
				}
			}(),
			di: function () {
				var _v2 = record.di;
				if (_v2.$ === 1) {
					return 0;
				} else {
					var actualMode = _v2.a;
					return actualMode;
				}
			}()
		};
	};
	return andFinally(
		A3(
			$elm$core$List$foldr,
			combine,
			{cZ: $elm$core$Maybe$Nothing, c4: $elm$core$Maybe$Nothing, di: $elm$core$Maybe$Nothing},
			options));
};
var $mdgriffith$elm_ui$Internal$Model$toHtml = F2(
	function (mode, el) {
		switch (el.$) {
			case 0:
				var html = el.a;
				return html($mdgriffith$elm_ui$Internal$Model$asEl);
			case 1:
				var styles = el.a.dN;
				var html = el.a.c5;
				return A2(
					html,
					mode(styles),
					$mdgriffith$elm_ui$Internal$Model$asEl);
			case 2:
				var text = el.a;
				return $mdgriffith$elm_ui$Internal$Model$textElement(text);
			default:
				return $mdgriffith$elm_ui$Internal$Model$textElement('');
		}
	});
var $mdgriffith$elm_ui$Internal$Model$renderRoot = F3(
	function (optionList, attributes, child) {
		var options = $mdgriffith$elm_ui$Internal$Model$optionsToRecord(optionList);
		var embedStyle = function () {
			var _v0 = options.di;
			if (_v0 === 1) {
				return $mdgriffith$elm_ui$Internal$Model$OnlyDynamic(options);
			} else {
				return $mdgriffith$elm_ui$Internal$Model$StaticRootAndDynamic(options);
			}
		}();
		return A2(
			$mdgriffith$elm_ui$Internal$Model$toHtml,
			embedStyle,
			A4(
				$mdgriffith$elm_ui$Internal$Model$element,
				$mdgriffith$elm_ui$Internal$Model$asEl,
				$mdgriffith$elm_ui$Internal$Model$div,
				attributes,
				$mdgriffith$elm_ui$Internal$Model$Unkeyed(
					_List_fromArray(
						[child]))));
	});
var $mdgriffith$elm_ui$Internal$Model$Colored = F3(
	function (a, b, c) {
		return {$: 4, a: a, b: b, c: c};
	});
var $mdgriffith$elm_ui$Internal$Model$FontFamily = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$FontSize = function (a) {
	return {$: 2, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$SansSerif = {$: 1};
var $mdgriffith$elm_ui$Internal$Model$StyleClass = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$Typeface = function (a) {
	return {$: 3, a: a};
};
var $mdgriffith$elm_ui$Internal$Flag$bgColor = $mdgriffith$elm_ui$Internal$Flag$flag(8);
var $mdgriffith$elm_ui$Internal$Flag$fontColor = $mdgriffith$elm_ui$Internal$Flag$flag(14);
var $mdgriffith$elm_ui$Internal$Flag$fontFamily = $mdgriffith$elm_ui$Internal$Flag$flag(5);
var $mdgriffith$elm_ui$Internal$Flag$fontSize = $mdgriffith$elm_ui$Internal$Flag$flag(4);
var $mdgriffith$elm_ui$Internal$Model$formatColorClass = function (_v0) {
	var red = _v0.a;
	var green = _v0.b;
	var blue = _v0.c;
	var alpha = _v0.d;
	return $mdgriffith$elm_ui$Internal$Model$floatClass(red) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(green) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(blue) + ('-' + $mdgriffith$elm_ui$Internal$Model$floatClass(alpha))))));
};
var $elm$core$String$toLower = _String_toLower;
var $elm$core$String$words = _String_words;
var $mdgriffith$elm_ui$Internal$Model$renderFontClassName = F2(
	function (font, current) {
		return _Utils_ap(
			current,
			function () {
				switch (font.$) {
					case 0:
						return 'serif';
					case 1:
						return 'sans-serif';
					case 2:
						return 'monospace';
					case 3:
						var name = font.a;
						return A2(
							$elm$core$String$join,
							'-',
							$elm$core$String$words(
								$elm$core$String$toLower(name)));
					case 4:
						var name = font.a;
						var url = font.b;
						return A2(
							$elm$core$String$join,
							'-',
							$elm$core$String$words(
								$elm$core$String$toLower(name)));
					default:
						var name = font.a.dl;
						return A2(
							$elm$core$String$join,
							'-',
							$elm$core$String$words(
								$elm$core$String$toLower(name)));
				}
			}());
	});
var $mdgriffith$elm_ui$Internal$Model$rootStyle = function () {
	var families = _List_fromArray(
		[
			$mdgriffith$elm_ui$Internal$Model$Typeface('Open Sans'),
			$mdgriffith$elm_ui$Internal$Model$Typeface('Helvetica'),
			$mdgriffith$elm_ui$Internal$Model$Typeface('Verdana'),
			$mdgriffith$elm_ui$Internal$Model$SansSerif
		]);
	return _List_fromArray(
		[
			A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$bgColor,
			A3(
				$mdgriffith$elm_ui$Internal$Model$Colored,
				'bg-' + $mdgriffith$elm_ui$Internal$Model$formatColorClass(
					A4($mdgriffith$elm_ui$Internal$Model$Rgba, 1, 1, 1, 0)),
				'background-color',
				A4($mdgriffith$elm_ui$Internal$Model$Rgba, 1, 1, 1, 0))),
			A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$fontColor,
			A3(
				$mdgriffith$elm_ui$Internal$Model$Colored,
				'fc-' + $mdgriffith$elm_ui$Internal$Model$formatColorClass(
					A4($mdgriffith$elm_ui$Internal$Model$Rgba, 0, 0, 0, 1)),
				'color',
				A4($mdgriffith$elm_ui$Internal$Model$Rgba, 0, 0, 0, 1))),
			A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$fontSize,
			$mdgriffith$elm_ui$Internal$Model$FontSize(20)),
			A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$fontFamily,
			A2(
				$mdgriffith$elm_ui$Internal$Model$FontFamily,
				A3($elm$core$List$foldl, $mdgriffith$elm_ui$Internal$Model$renderFontClassName, 'font-', families),
				families))
		]);
}();
var $mdgriffith$elm_ui$Element$layoutWith = F3(
	function (_v0, attrs, child) {
		var options = _v0.bR;
		return A3(
			$mdgriffith$elm_ui$Internal$Model$renderRoot,
			options,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Internal$Model$htmlClass(
					A2(
						$elm$core$String$join,
						' ',
						_List_fromArray(
							[$mdgriffith$elm_ui$Internal$Style$classes.dw, $mdgriffith$elm_ui$Internal$Style$classes.cr, $mdgriffith$elm_ui$Internal$Style$classes.dE]))),
				_Utils_ap($mdgriffith$elm_ui$Internal$Model$rootStyle, attrs)),
			child);
	});
var $mdgriffith$elm_ui$Element$layout = $mdgriffith$elm_ui$Element$layoutWith(
	{bR: _List_Nil});
var $mdgriffith$elm_ui$Internal$Model$PaddingStyle = F5(
	function (a, b, c, d, e) {
		return {$: 7, a: a, b: b, c: c, d: d, e: e};
	});
var $mdgriffith$elm_ui$Internal$Flag$padding = $mdgriffith$elm_ui$Internal$Flag$flag(2);
var $mdgriffith$elm_ui$Element$padding = function (x) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$padding,
		A5(
			$mdgriffith$elm_ui$Internal$Model$PaddingStyle,
			'p-' + $elm$core$String$fromInt(x),
			x,
			x,
			x,
			x));
};
var $mdgriffith$elm_ui$Internal$Model$SpacingStyle = F3(
	function (a, b, c) {
		return {$: 5, a: a, b: b, c: c};
	});
var $mdgriffith$elm_ui$Internal$Flag$spacing = $mdgriffith$elm_ui$Internal$Flag$flag(3);
var $mdgriffith$elm_ui$Internal$Model$spacingName = F2(
	function (x, y) {
		return 'spacing-' + ($elm$core$String$fromInt(x) + ('-' + $elm$core$String$fromInt(y)));
	});
var $mdgriffith$elm_ui$Element$spacing = function (x) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$spacing,
		A3(
			$mdgriffith$elm_ui$Internal$Model$SpacingStyle,
			A2($mdgriffith$elm_ui$Internal$Model$spacingName, x, x),
			x,
			x));
};
var $author$project$Introduction$BasicElmUI$view = function (model) {
	return A2(
		$elm$html$Html$section,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Element$layout,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
						$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
						$mdgriffith$elm_ui$Element$inFront(
						A2($author$project$Introduction$BasicElmUI$ghostView, model.Q, model.au))
					]),
				A2(
					$mdgriffith$elm_ui$Element$column,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$centerX,
							$mdgriffith$elm_ui$Element$centerY,
							$mdgriffith$elm_ui$Element$padding(10),
							$mdgriffith$elm_ui$Element$spacing(10)
						]),
					A2(
						$elm$core$List$indexedMap,
						$author$project$Introduction$BasicElmUI$itemView(model.Q),
						model.au)))
			]));
};
var $author$project$Introduction$Groups$itemStyles = function (color) {
	return _List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'width', '5rem'),
			A2($elm$html$Html$Attributes$style, 'height', '5rem'),
			A2($elm$html$Html$Attributes$style, 'background-color', color),
			A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
			A2($elm$html$Html$Attributes$style, 'color', '#ffffff'),
			A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
			A2($elm$html$Html$Attributes$style, 'margin', '0 auto 1rem auto'),
			A2($elm$html$Html$Attributes$style, 'display', 'flex'),
			A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
			A2($elm$html$Html$Attributes$style, 'justify-content', 'center')
		]);
};
var $author$project$Introduction$Groups$maybeDragItem = F2(
	function (dnd, items) {
		return A2(
			$elm$core$Maybe$andThen,
			function (_v0) {
				var dragIndex = _v0.a9;
				return $elm$core$List$head(
					A2($elm$core$List$drop, dragIndex, items));
			},
			$author$project$Introduction$Groups$system.be(dnd));
	});
var $author$project$Introduction$Groups$ghostView = F2(
	function (dnd, items) {
		var _v0 = A2($author$project$Introduction$Groups$maybeDragItem, dnd, items);
		if (!_v0.$) {
			var value = _v0.a.aB;
			var color = _v0.a.aV;
			return A2(
				$elm$html$Html$div,
				_Utils_ap(
					$author$project$Introduction$Groups$itemStyles(color),
					$author$project$Introduction$Groups$system.c$(dnd)),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					]));
		} else {
			return $elm$html$Html$text('');
		}
	});
var $author$project$Introduction$Groups$calculateOffset = F3(
	function (index, group, list) {
		calculateOffset:
		while (true) {
			if (!list.b) {
				return 0;
			} else {
				var x = list.a;
				var xs = list.b;
				if (_Utils_eq(x.t, group)) {
					return index;
				} else {
					var $temp$index = index + 1,
						$temp$group = group,
						$temp$list = xs;
					index = $temp$index;
					group = $temp$group;
					list = $temp$list;
					continue calculateOffset;
				}
			}
		}
	});
var $author$project$Introduction$Groups$groupStyles = function (color) {
	return _List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'display', 'flex'),
			A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
			A2($elm$html$Html$Attributes$style, 'background-color', color),
			A2($elm$html$Html$Attributes$style, 'padding-top', '2rem'),
			A2($elm$html$Html$Attributes$style, 'min-height', '19rem')
		]);
};
var $author$project$Introduction$Groups$auxiliaryStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'flex-grow', '1'),
		A2($elm$html$Html$Attributes$style, 'height', 'auto'),
		A2($elm$html$Html$Attributes$style, 'min-height', '1rem'),
		A2($elm$html$Html$Attributes$style, 'width', '8rem')
	]);
var $author$project$Introduction$Groups$gray = 'dimgray';
var $author$project$Introduction$Groups$itemView = F4(
	function (model, offset, localIndex, _v0) {
		var group = _v0.t;
		var value = _v0.aB;
		var color = _v0.aV;
		var globalIndex = offset + localIndex;
		var itemId = 'id-' + $elm$core$String$fromInt(globalIndex);
		var _v1 = _Utils_Tuple2(
			$author$project$Introduction$Groups$system.be(model.Q),
			A2($author$project$Introduction$Groups$maybeDragItem, model.Q, model.au));
		if ((!_v1.a.$) && (!_v1.b.$)) {
			var dragIndex = _v1.a.a.a9;
			var dragItem = _v1.b.a;
			return (_Utils_eq(color, $author$project$Introduction$Groups$transparent) && ((value === 'footer') && (!_Utils_eq(dragItem.t, group)))) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$Introduction$Groups$auxiliaryStyles,
						A2($author$project$Introduction$Groups$system.cU, globalIndex, itemId))),
				_List_Nil) : ((_Utils_eq(color, $author$project$Introduction$Groups$transparent) && ((value === 'footer') && _Utils_eq(dragItem.t, group))) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					$author$project$Introduction$Groups$auxiliaryStyles),
				_List_Nil) : ((!_Utils_eq(dragIndex, globalIndex)) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$Introduction$Groups$itemStyles(color),
						A2($author$project$Introduction$Groups$system.cU, globalIndex, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					])) : A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					$author$project$Introduction$Groups$itemStyles($author$project$Introduction$Groups$gray)),
				_List_Nil)));
		} else {
			return (_Utils_eq(color, $author$project$Introduction$Groups$transparent) && (value === 'footer')) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					$author$project$Introduction$Groups$auxiliaryStyles),
				_List_Nil) : A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$Introduction$Groups$itemStyles(color),
						A2($author$project$Introduction$Groups$system.cT, globalIndex, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					]));
		}
	});
var $author$project$Introduction$Groups$groupView = F3(
	function (model, group, color) {
		return A2(
			$elm$html$Html$div,
			$author$project$Introduction$Groups$groupStyles(color),
			A2(
				$elm$core$List$indexedMap,
				A2(
					$author$project$Introduction$Groups$itemView,
					model,
					A3($author$project$Introduction$Groups$calculateOffset, 0, group, model.au)),
				A2(
					$elm$core$List$filter,
					function (item) {
						return _Utils_eq(item.t, group);
					},
					model.au)));
	});
var $author$project$Introduction$Groups$lightBlue = '#88b0ea';
var $author$project$Introduction$Groups$lightRed = '#ea9088';
var $author$project$Introduction$Groups$sectionStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'align-items', 'top'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
		A2($elm$html$Html$Attributes$style, 'align-items', 'flex-start'),
		A2($elm$html$Html$Attributes$style, 'padding-top', '2rem'),
		A2($elm$html$Html$Attributes$style, 'height', '41rem')
	]);
var $author$project$Introduction$Groups$view = function (model) {
	return A2(
		$elm$html$Html$section,
		$author$project$Introduction$Groups$sectionStyles,
		_List_fromArray(
			[
				A3($author$project$Introduction$Groups$groupView, model, 0, $author$project$Introduction$Groups$lightRed),
				A3($author$project$Introduction$Groups$groupView, model, 1, $author$project$Introduction$Groups$lightBlue),
				A2($author$project$Introduction$Groups$ghostView, model.Q, model.au)
			]));
};
var $author$project$Introduction$Handle$containerStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
		A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
		A2($elm$html$Html$Attributes$style, 'padding-top', '4em')
	]);
var $author$project$Introduction$Handle$darkOrange = '#b4752b';
var $author$project$Introduction$Handle$handleStyles = function (color) {
	return _List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'width', '50px'),
			A2($elm$html$Html$Attributes$style, 'height', '50px'),
			A2($elm$html$Html$Attributes$style, 'background-color', color),
			A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
			A2($elm$html$Html$Attributes$style, 'margin', '20px'),
			A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
		]);
};
var $author$project$Introduction$Handle$itemStyles = function (color) {
	return _List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'width', '180px'),
			A2($elm$html$Html$Attributes$style, 'height', '100px'),
			A2($elm$html$Html$Attributes$style, 'background-color', color),
			A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
			A2($elm$html$Html$Attributes$style, 'color', '#000'),
			A2($elm$html$Html$Attributes$style, 'display', 'flex'),
			A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
			A2($elm$html$Html$Attributes$style, 'margin', '0 4em 4em 0')
		]);
};
var $author$project$Introduction$Handle$orange = '#dc9a39';
var $author$project$Introduction$Handle$ghostView = F2(
	function (dnd, fruits) {
		var maybeDragFruit = A2(
			$elm$core$Maybe$andThen,
			function (_v1) {
				var dragIndex = _v1.a9;
				return $elm$core$List$head(
					A2($elm$core$List$drop, dragIndex, fruits));
			},
			$author$project$Introduction$Handle$system.be(dnd));
		if (!maybeDragFruit.$) {
			var fruit = maybeDragFruit.a;
			return A2(
				$elm$html$Html$div,
				_Utils_ap(
					$author$project$Introduction$Handle$itemStyles($author$project$Introduction$Handle$orange),
					$author$project$Introduction$Handle$system.c$(dnd)),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						$author$project$Introduction$Handle$handleStyles($author$project$Introduction$Handle$darkOrange),
						_List_Nil),
						$elm$html$Html$text(fruit)
					]));
		} else {
			return $elm$html$Html$text('');
		}
	});
var $author$project$Introduction$Handle$darkGreen = '#afb42b';
var $author$project$Introduction$Handle$green = '#cddc39';
var $author$project$Introduction$Handle$itemView = F3(
	function (dnd, index, fruit) {
		var fruitId = 'id-' + fruit;
		var _v0 = $author$project$Introduction$Handle$system.be(dnd);
		if (!_v0.$) {
			var dragIndex = _v0.a.a9;
			return (!_Utils_eq(dragIndex, index)) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(fruitId),
					_Utils_ap(
						$author$project$Introduction$Handle$itemStyles($author$project$Introduction$Handle$green),
						A2($author$project$Introduction$Handle$system.cU, index, fruitId))),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						$author$project$Introduction$Handle$handleStyles($author$project$Introduction$Handle$darkGreen),
						_List_Nil),
						$elm$html$Html$text(fruit)
					])) : A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(fruitId),
					$author$project$Introduction$Handle$itemStyles('dimgray')),
				_List_Nil);
		} else {
			return A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(fruitId),
					$author$project$Introduction$Handle$itemStyles($author$project$Introduction$Handle$green)),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_Utils_ap(
							$author$project$Introduction$Handle$handleStyles($author$project$Introduction$Handle$darkGreen),
							A2($author$project$Introduction$Handle$system.cT, index, fruitId)),
						_List_Nil),
						$elm$html$Html$text(fruit)
					]));
		}
	});
var $author$project$Introduction$Handle$view = function (model) {
	return A2(
		$elm$html$Html$section,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				$author$project$Introduction$Handle$containerStyles,
				A2(
					$elm$core$List$indexedMap,
					$author$project$Introduction$Handle$itemView(model.Q),
					model.as)),
				A2($author$project$Introduction$Handle$ghostView, model.Q, model.as)
			]));
};
var $author$project$Introduction$Independents$blueGhost = '#0067c3';
var $author$project$Introduction$Independents$itemStyles = function (color) {
	return _List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'width', '5rem'),
			A2($elm$html$Html$Attributes$style, 'height', '5rem'),
			A2($elm$html$Html$Attributes$style, 'background-color', color),
			A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
			A2($elm$html$Html$Attributes$style, 'color', 'white'),
			A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
			A2($elm$html$Html$Attributes$style, 'margin', '0 2em 2em 0'),
			A2($elm$html$Html$Attributes$style, 'display', 'flex'),
			A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
			A2($elm$html$Html$Attributes$style, 'justify-content', 'center')
		]);
};
var $author$project$Introduction$Independents$blueGhostView = F2(
	function (dnd, items) {
		var maybeDragBlue = A2(
			$elm$core$Maybe$andThen,
			function (_v1) {
				var dragIndex = _v1.a9;
				return $elm$core$List$head(
					A2($elm$core$List$drop, dragIndex, items));
			},
			$author$project$Introduction$Independents$blueSystem.be(dnd));
		if (!maybeDragBlue.$) {
			var item = maybeDragBlue.a;
			return A2(
				$elm$html$Html$div,
				_Utils_ap(
					$author$project$Introduction$Independents$itemStyles($author$project$Introduction$Independents$blueGhost),
					$author$project$Introduction$Independents$blueSystem.c$(dnd)),
				_List_fromArray(
					[
						$elm$html$Html$text(item)
					]));
		} else {
			return $elm$html$Html$text('');
		}
	});
var $author$project$Introduction$Independents$blue = '#118eff';
var $author$project$Introduction$Independents$gray = 'dimgray';
var $author$project$Introduction$Independents$blueView = F3(
	function (dnd, index, item) {
		var itemId = 'blue-' + item;
		var _v0 = $author$project$Introduction$Independents$blueSystem.be(dnd);
		if (!_v0.$) {
			var dragIndex = _v0.a.a9;
			return (!_Utils_eq(dragIndex, index)) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$Introduction$Independents$itemStyles($author$project$Introduction$Independents$blue),
						A2($author$project$Introduction$Independents$blueSystem.cU, index, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(item)
					])) : A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					$author$project$Introduction$Independents$itemStyles($author$project$Introduction$Independents$gray)),
				_List_Nil);
		} else {
			return A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$Introduction$Independents$itemStyles($author$project$Introduction$Independents$blue),
						A2($author$project$Introduction$Independents$blueSystem.cT, index, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(item)
					]));
		}
	});
var $author$project$Introduction$Independents$containerStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'center')
	]);
var $author$project$Introduction$Independents$redGhost = '#c30005';
var $author$project$Introduction$Independents$redGhostView = F2(
	function (dnd, items) {
		var maybeDragRed = A2(
			$elm$core$Maybe$andThen,
			function (_v1) {
				var dragIndex = _v1.a9;
				return $elm$core$List$head(
					A2($elm$core$List$drop, dragIndex, items));
			},
			$author$project$Introduction$Independents$redSystem.be(dnd));
		if (!maybeDragRed.$) {
			var item = maybeDragRed.a;
			return A2(
				$elm$html$Html$div,
				_Utils_ap(
					$author$project$Introduction$Independents$itemStyles($author$project$Introduction$Independents$redGhost),
					$author$project$Introduction$Independents$redSystem.c$(dnd)),
				_List_fromArray(
					[
						$elm$html$Html$text(item)
					]));
		} else {
			return $elm$html$Html$text('');
		}
	});
var $author$project$Introduction$Independents$red = '#ff1117';
var $author$project$Introduction$Independents$redView = F3(
	function (dnd, index, item) {
		var itemId = 'red-' + item;
		var _v0 = $author$project$Introduction$Independents$redSystem.be(dnd);
		if (!_v0.$) {
			var dragIndex = _v0.a.a9;
			return (!_Utils_eq(dragIndex, index)) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$Introduction$Independents$itemStyles($author$project$Introduction$Independents$red),
						A2($author$project$Introduction$Independents$redSystem.cU, index, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(item)
					])) : A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					$author$project$Introduction$Independents$itemStyles($author$project$Introduction$Independents$gray)),
				_List_Nil);
		} else {
			return A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						$author$project$Introduction$Independents$itemStyles($author$project$Introduction$Independents$red),
						A2($author$project$Introduction$Independents$redSystem.cT, index, itemId))),
				_List_fromArray(
					[
						$elm$html$Html$text(item)
					]));
		}
	});
var $author$project$Introduction$Independents$sectionStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
		A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
		A2($elm$html$Html$Attributes$style, 'padding-top', '2em')
	]);
var $author$project$Introduction$Independents$view = function (model) {
	return A2(
		$elm$html$Html$section,
		$author$project$Introduction$Independents$sectionStyles,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				$author$project$Introduction$Independents$containerStyles,
				A2(
					$elm$core$List$indexedMap,
					$author$project$Introduction$Independents$redView(model.W),
					model.aw)),
				A2(
				$elm$html$Html$div,
				$author$project$Introduction$Independents$containerStyles,
				A2(
					$elm$core$List$indexedMap,
					$author$project$Introduction$Independents$blueView(model.M),
					model.an)),
				A2($author$project$Introduction$Independents$redGhostView, model.W, model.aw),
				A2($author$project$Introduction$Independents$blueGhostView, model.M, model.an)
			]));
};
var $author$project$Introduction$Keyed$containerStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
		A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
		A2($elm$html$Html$Attributes$style, 'padding-top', '2em')
	]);
var $author$project$Introduction$Keyed$ghostGreen = '#2f804e';
var $author$project$Introduction$Keyed$itemStyles = function (color) {
	return _List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'width', '5rem'),
			A2($elm$html$Html$Attributes$style, 'height', '5rem'),
			A2($elm$html$Html$Attributes$style, 'background-color', color),
			A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
			A2($elm$html$Html$Attributes$style, 'color', 'white'),
			A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
			A2($elm$html$Html$Attributes$style, 'margin', '0 2em 2em 0'),
			A2($elm$html$Html$Attributes$style, 'display', 'flex'),
			A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
			A2($elm$html$Html$Attributes$style, 'justify-content', 'center')
		]);
};
var $author$project$Introduction$Keyed$ghostView = F2(
	function (dnd, items) {
		var maybeDragItem = A2(
			$elm$core$Maybe$andThen,
			function (_v2) {
				var dragIndex = _v2.a9;
				return $elm$core$List$head(
					A2($elm$core$List$drop, dragIndex, items));
			},
			$author$project$Introduction$Keyed$system.be(dnd));
		if (!maybeDragItem.$) {
			var _v1 = maybeDragItem.a;
			var item = _v1.b;
			return A2(
				$elm$html$Html$div,
				_Utils_ap(
					$author$project$Introduction$Keyed$itemStyles($author$project$Introduction$Keyed$ghostGreen),
					$author$project$Introduction$Keyed$system.c$(dnd)),
				_List_fromArray(
					[
						$elm$html$Html$text(item)
					]));
		} else {
			return $elm$html$Html$text('');
		}
	});
var $author$project$Introduction$Keyed$green = '#3da565';
var $author$project$Introduction$Keyed$itemView = F3(
	function (dnd, index, _v0) {
		var key = _v0.a;
		var item = _v0.b;
		var itemId = 'id-' + item;
		var _v1 = $author$project$Introduction$Keyed$system.be(dnd);
		if (!_v1.$) {
			var dragIndex = _v1.a.a9;
			return (!_Utils_eq(dragIndex, index)) ? _Utils_Tuple2(
				key,
				A2(
					$elm$html$Html$div,
					A2(
						$elm$core$List$cons,
						$elm$html$Html$Attributes$id(itemId),
						_Utils_ap(
							$author$project$Introduction$Keyed$itemStyles($author$project$Introduction$Keyed$green),
							A2($author$project$Introduction$Keyed$system.cU, index, itemId))),
					_List_fromArray(
						[
							$elm$html$Html$text(item)
						]))) : _Utils_Tuple2(
				key,
				A2(
					$elm$html$Html$div,
					A2(
						$elm$core$List$cons,
						$elm$html$Html$Attributes$id(itemId),
						$author$project$Introduction$Keyed$itemStyles('dimgray')),
					_List_Nil));
		} else {
			return _Utils_Tuple2(
				key,
				A2(
					$elm$html$Html$div,
					A2(
						$elm$core$List$cons,
						$elm$html$Html$Attributes$id(itemId),
						_Utils_ap(
							$author$project$Introduction$Keyed$itemStyles($author$project$Introduction$Keyed$green),
							A2($author$project$Introduction$Keyed$system.cT, index, itemId))),
					_List_fromArray(
						[
							$elm$html$Html$text(item)
						])));
		}
	});
var $elm$html$Html$Keyed$node = $elm$virtual_dom$VirtualDom$keyedNode;
var $author$project$Introduction$Keyed$view = function (model) {
	return A2(
		$elm$html$Html$section,
		_List_Nil,
		_List_fromArray(
			[
				A3(
				$elm$html$Html$Keyed$node,
				'div',
				$author$project$Introduction$Keyed$containerStyles,
				A2(
					$elm$core$List$indexedMap,
					$author$project$Introduction$Keyed$itemView(model.Q),
					model.au)),
				A2($author$project$Introduction$Keyed$ghostView, model.Q, model.au)
			]));
};
var $author$project$Introduction$Margins$containerStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
		A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'center')
	]);
var $author$project$Introduction$Margins$ghostGreen = '#2f804e';
var $author$project$Introduction$Margins$itemStyles = function (color) {
	return _List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'width', '5rem'),
			A2($elm$html$Html$Attributes$style, 'height', '5rem'),
			A2($elm$html$Html$Attributes$style, 'background-color', color),
			A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
			A2($elm$html$Html$Attributes$style, 'color', 'white'),
			A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
			A2($elm$html$Html$Attributes$style, 'display', 'flex'),
			A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
			A2($elm$html$Html$Attributes$style, 'justify-content', 'center')
		]);
};
var $author$project$Introduction$Margins$ghostView = F2(
	function (dnd, items) {
		var maybeDragItem = A2(
			$elm$core$Maybe$andThen,
			function (_v1) {
				var dragIndex = _v1.a9;
				return $elm$core$List$head(
					A2($elm$core$List$drop, dragIndex, items));
			},
			$author$project$Introduction$Margins$system.be(dnd));
		if (!maybeDragItem.$) {
			var item = maybeDragItem.a;
			return A2(
				$elm$html$Html$div,
				_Utils_ap(
					$author$project$Introduction$Margins$itemStyles($author$project$Introduction$Margins$ghostGreen),
					$author$project$Introduction$Margins$system.c$(dnd)),
				_List_fromArray(
					[
						$elm$html$Html$text(item)
					]));
		} else {
			return $elm$html$Html$text('');
		}
	});
var $author$project$Introduction$Margins$green = '#3da565';
var $author$project$Introduction$Margins$itemView = F3(
	function (dnd, index, item) {
		var itemId = 'id-' + item;
		var _v0 = $author$project$Introduction$Margins$system.be(dnd);
		if (!_v0.$) {
			var dragIndex = _v0.a.a9;
			return (!_Utils_eq(dragIndex, index)) ? A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'margin', '2em')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						A2(
							$elm$core$List$cons,
							$elm$html$Html$Attributes$id(itemId),
							_Utils_ap(
								$author$project$Introduction$Margins$itemStyles($author$project$Introduction$Margins$green),
								A2($author$project$Introduction$Margins$system.cU, index, itemId))),
						_List_fromArray(
							[
								$elm$html$Html$text(item)
							]))
					])) : A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'margin', '2em')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						A2(
							$elm$core$List$cons,
							$elm$html$Html$Attributes$id(itemId),
							$author$project$Introduction$Margins$itemStyles('dimgray')),
						_List_Nil)
					]));
		} else {
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'margin', '2em')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						A2(
							$elm$core$List$cons,
							$elm$html$Html$Attributes$id(itemId),
							_Utils_ap(
								$author$project$Introduction$Margins$itemStyles($author$project$Introduction$Margins$green),
								A2($author$project$Introduction$Margins$system.cT, index, itemId))),
						_List_fromArray(
							[
								$elm$html$Html$text(item)
							]))
					]));
		}
	});
var $author$project$Introduction$Margins$view = function (model) {
	return A2(
		$elm$html$Html$section,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				$author$project$Introduction$Margins$containerStyles,
				A2(
					$elm$core$List$indexedMap,
					$author$project$Introduction$Margins$itemView(model.Q),
					model.au)),
				A2($author$project$Introduction$Margins$ghostView, model.Q, model.au)
			]));
};
var $author$project$Introduction$Masonry$containerStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
		A2($elm$html$Html$Attributes$style, 'margin', '0 auto'),
		A2($elm$html$Html$Attributes$style, 'max-width', '40em'),
		A2($elm$html$Html$Attributes$style, 'padding-top', '2em')
	]);
var $author$project$Introduction$Masonry$itemStyles = F2(
	function (color, width) {
		return _List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'background-color', color),
				A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
				A2($elm$html$Html$Attributes$style, 'flex', '1 0 auto'),
				A2($elm$html$Html$Attributes$style, 'height', '4.5rem'),
				A2($elm$html$Html$Attributes$style, 'margin', '0 1.5em 1.5em 0'),
				A2(
				$elm$html$Html$Attributes$style,
				'width',
				$elm$core$String$fromInt(width) + 'px')
			]);
	});
var $author$project$Introduction$Masonry$ghostView = F2(
	function (dnd, items) {
		var maybeDragItem = A2(
			$elm$core$Maybe$andThen,
			function (_v2) {
				var dragIndex = _v2.a9;
				return $elm$core$List$head(
					A2($elm$core$List$drop, dragIndex, items));
			},
			$author$project$Introduction$Masonry$system.be(dnd));
		if (!maybeDragItem.$) {
			var _v1 = maybeDragItem.a;
			var color = _v1.a;
			var width = _v1.b;
			return A2(
				$elm$html$Html$div,
				_Utils_ap(
					A2($author$project$Introduction$Masonry$itemStyles, color, width),
					$author$project$Introduction$Masonry$system.c$(dnd)),
				_List_Nil);
		} else {
			return $elm$html$Html$text('');
		}
	});
var $author$project$Introduction$Masonry$itemView = F3(
	function (dnd, index, _v0) {
		var color = _v0.a;
		var width = _v0.b;
		var itemId = 'id-' + color;
		var _v1 = $author$project$Introduction$Masonry$system.be(dnd);
		if (!_v1.$) {
			var dragIndex = _v1.a.a9;
			return (!_Utils_eq(dragIndex, index)) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						A2($author$project$Introduction$Masonry$itemStyles, color, width),
						A2($author$project$Introduction$Masonry$system.cU, index, itemId))),
				_List_Nil) : A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					A2($author$project$Introduction$Masonry$itemStyles, 'dimgray', width)),
				_List_Nil);
		} else {
			return A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						A2($author$project$Introduction$Masonry$itemStyles, color, width),
						A2($author$project$Introduction$Masonry$system.cT, index, itemId))),
				_List_Nil);
		}
	});
var $author$project$Introduction$Masonry$view = function (model) {
	return A2(
		$elm$html$Html$section,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				$author$project$Introduction$Masonry$containerStyles,
				A2(
					$elm$core$List$indexedMap,
					$author$project$Introduction$Masonry$itemView(model.Q),
					model.au)),
				A2($author$project$Introduction$Masonry$ghostView, model.Q, model.au)
			]));
};
var $author$project$Introduction$Resize$containerStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
		A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
		A2($elm$html$Html$Attributes$style, 'padding-top', '3em')
	]);
var $author$project$Introduction$Resize$handleStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'width', '60px'),
		A2($elm$html$Html$Attributes$style, 'height', '60px'),
		A2($elm$html$Html$Attributes$style, 'color', 'black'),
		A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'center')
	]);
var $author$project$Introduction$Resize$itemStyles = F3(
	function (width, height, color) {
		return _List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
				A2($elm$html$Html$Attributes$style, 'margin', '0 3em 3em 0'),
				A2($elm$html$Html$Attributes$style, 'display', 'flex'),
				A2($elm$html$Html$Attributes$style, 'align-items', 'flex-start'),
				A2($elm$html$Html$Attributes$style, 'justify-content', 'flex-start'),
				A2($elm$html$Html$Attributes$style, 'background-color', color),
				A2(
				$elm$html$Html$Attributes$style,
				'width',
				$elm$core$String$fromInt(width) + 'rem'),
				A2(
				$elm$html$Html$Attributes$style,
				'height',
				$elm$core$String$fromInt(height) + 'rem')
			]);
	});
var $author$project$Introduction$Resize$maybeDragItem = function (_v0) {
	var dnd = _v0.Q;
	var colors = _v0.ap;
	return A2(
		$elm$core$Maybe$andThen,
		function (_v1) {
			var dragIndex = _v1.a9;
			return $elm$core$List$head(
				A2($elm$core$List$drop, dragIndex, colors));
		},
		$author$project$Introduction$Resize$system.be(dnd));
};
var $author$project$Introduction$Resize$ghostView = function (model) {
	var _v0 = _Utils_Tuple2(
		$author$project$Introduction$Resize$system.be(model.Q),
		$author$project$Introduction$Resize$maybeDragItem(model));
	if ((!_v0.a.$) && (!_v0.b.$)) {
		var dropElement = _v0.a.a.ac;
		var color = _v0.b.a;
		var width = $elm$core$Basics$round(dropElement.cW.d4);
		var height = $elm$core$Basics$round(dropElement.cW.c2);
		return A2(
			$elm$html$Html$div,
			_Utils_ap(
				A3($author$project$Introduction$Resize$itemStyles, width, height, color),
				_Utils_ap(
					$author$project$Introduction$Resize$system.c$(model.Q),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$Attributes$style,
							'width',
							$elm$core$String$fromInt(width) + 'px'),
							A2(
							$elm$html$Html$Attributes$style,
							'height',
							$elm$core$String$fromInt(height) + 'px'),
							A2($elm$html$Html$Attributes$style, 'transition', 'width 0.5s, height 0.5s')
						]))),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					$author$project$Introduction$Resize$handleStyles,
					_List_fromArray(
						[
							$elm$html$Html$text('⠶')
						]))
				]));
	} else {
		return $elm$html$Html$text('');
	}
};
var $author$project$Introduction$Resize$gray = 'dimgray';
var $author$project$Introduction$Resize$itemView = F3(
	function (model, index, _v0) {
		var color = _v0.a;
		var spot = _v0.b;
		var width = spot.d4 * 5;
		var itemId = 'id-' + $elm$core$String$fromInt(index);
		var height = spot.c2 * 5;
		var _v1 = $author$project$Introduction$Resize$system.be(model.Q);
		if (!_v1.$) {
			var dragIndex = _v1.a.a9;
			return (!_Utils_eq(index, dragIndex)) ? A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					_Utils_ap(
						A3($author$project$Introduction$Resize$itemStyles, width, height, color),
						A2($author$project$Introduction$Resize$system.cU, index, itemId))),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						$author$project$Introduction$Resize$handleStyles,
						_List_fromArray(
							[
								$elm$html$Html$text('⠶')
							]))
					])) : A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					A3($author$project$Introduction$Resize$itemStyles, width, height, $author$project$Introduction$Resize$gray)),
				_List_Nil);
		} else {
			return A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(itemId),
					A3($author$project$Introduction$Resize$itemStyles, width, height, color)),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_Utils_ap(
							$author$project$Introduction$Resize$handleStyles,
							A2($author$project$Introduction$Resize$system.cT, index, itemId)),
						_List_fromArray(
							[
								$elm$html$Html$text('⠶')
							]))
					]));
		}
	});
var $author$project$Introduction$Resize$Spot = F2(
	function (width, height) {
		return {c2: height, d4: width};
	});
var $author$project$Introduction$Resize$spots = _List_fromArray(
	[
		A2($author$project$Introduction$Resize$Spot, 1, 1),
		A2($author$project$Introduction$Resize$Spot, 1, 3),
		A2($author$project$Introduction$Resize$Spot, 2, 2),
		A2($author$project$Introduction$Resize$Spot, 2, 1),
		A2($author$project$Introduction$Resize$Spot, 2, 3)
	]);
var $author$project$Introduction$Resize$view = function (model) {
	return A2(
		$elm$html$Html$section,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				$author$project$Introduction$Resize$containerStyles,
				A2(
					$elm$core$List$indexedMap,
					$author$project$Introduction$Resize$itemView(model),
					A3(
						$elm$core$List$map2,
						F2(
							function (color, spot) {
								return _Utils_Tuple2(color, spot);
							}),
						model.ap,
						$author$project$Introduction$Resize$spots))),
				$author$project$Introduction$Resize$ghostView(model)
			]));
};
var $author$project$Introduction$Root$demoView = function (model) {
	switch (model.$) {
		case 0:
			var mo = model.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Introduction$Root$BasicMsg,
				$author$project$Introduction$Basic$view(mo));
		case 1:
			var mo = model.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Introduction$Root$BasicElmUIMsg,
				$author$project$Introduction$BasicElmUI$view(mo));
		case 2:
			var mo = model.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Introduction$Root$HandleMsg,
				$author$project$Introduction$Handle$view(mo));
		case 3:
			var mo = model.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Introduction$Root$KeyedMsg,
				$author$project$Introduction$Keyed$view(mo));
		case 4:
			var mo = model.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Introduction$Root$MarginsMsg,
				$author$project$Introduction$Margins$view(mo));
		case 5:
			var mo = model.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Introduction$Root$MasonryMsg,
				$author$project$Introduction$Masonry$view(mo));
		case 6:
			var mo = model.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Introduction$Root$ResizeMsg,
				$author$project$Introduction$Resize$view(mo));
		case 7:
			var mo = model.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Introduction$Root$IndependentsMsg,
				$author$project$Introduction$Independents$view(mo));
		default:
			var mo = model.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Introduction$Root$GroupsMsg,
				$author$project$Introduction$Groups$view(mo));
	}
};
var $elm$html$Html$h2 = _VirtualDom_node('h2');
var $author$project$Config$Root$info = function (example) {
	switch (example.$) {
		case 0:
			return {aG: 'The behavior of the Free, Horizontal only and Vertical only drag movements with Swap list operation.', aK: 'movement', aA: 'Movement'};
		case 1:
			return {aG: 'Compare the list operations sorting on drag.', aK: 'operations-drag', aA: 'Operations on drag'};
		default:
			return {aG: 'Compare the list operations sorting on drop.', aK: 'operations-drop', aA: 'Operations on drop'};
	}
};
var $author$project$Config$Root$headerView = function (model) {
	var title = A2(
		$elm$core$Basics$composeR,
		$author$project$Config$Root$info,
		function ($) {
			return $.aA;
		})(model);
	var description = A2(
		$elm$core$Basics$composeR,
		$author$project$Config$Root$info,
		function ($) {
			return $.aG;
		})(model);
	return A2(
		$elm$html$Html$header,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h2,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(title)
					])),
				A2(
				$elm$html$Html$p,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(description)
					]))
			]));
};
var $author$project$ConfigGroups$Root$info = function (example) {
	if (!example.$) {
		return {aG: 'Compare the list operations with groups sorting on drag.', aK: 'operations-drag', aA: 'Operations on drag'};
	} else {
		return {aG: 'Compare the list operations with groups sorting on drop.', aK: 'operations-drop', aA: 'Operations on drop'};
	}
};
var $author$project$ConfigGroups$Root$headerView = function (model) {
	var title = A2(
		$elm$core$Basics$composeR,
		$author$project$ConfigGroups$Root$info,
		function ($) {
			return $.aA;
		})(model);
	var description = A2(
		$elm$core$Basics$composeR,
		$author$project$ConfigGroups$Root$info,
		function ($) {
			return $.aG;
		})(model);
	return A2(
		$elm$html$Html$header,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h2,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(title)
					])),
				A2(
				$elm$html$Html$p,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(description)
					]))
			]));
};
var $author$project$Gallery$Root$info = function (example) {
	switch (example.$) {
		case 0:
			return {aG: 'Flat list with auxiliary items.', aK: 'hanoi', aA: 'Towers of Hanoi'};
		case 1:
			return {aG: 'List with groups without auxiliary items.', aK: 'puzzle', aA: 'Puzzle'};
		case 2:
			return {aG: 'Flat list with the Unaltered operation and beforeUpdate.', aK: 'shapes', aA: 'Geometric shapes'};
		case 3:
			return {aG: 'Flat list with Swap. The top-left 5 × 5 sub-board is diced from the original 8 × 8 board.', aK: 'knight', aA: 'Knight\'s tour'};
		case 4:
			return {aG: 'Flat list with info.targetElement.', aK: 'try-on', aA: 'Try on'};
		default:
			return {aG: 'Two systems - one for the cards and one for the columns.', aK: 'taskboard', aA: 'Task board'};
	}
};
var $author$project$Gallery$Root$headerView = function (model) {
	var title = A2(
		$elm$core$Basics$composeR,
		$author$project$Gallery$Root$info,
		function ($) {
			return $.aA;
		})(model);
	var description = A2(
		$elm$core$Basics$composeR,
		$author$project$Gallery$Root$info,
		function ($) {
			return $.aG;
		})(model);
	return A2(
		$elm$html$Html$header,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h2,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(title)
					])),
				A2(
				$elm$html$Html$p,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(description)
					]))
			]));
};
var $author$project$Introduction$Root$info = function (example) {
	switch (example.$) {
		case 0:
			return {aG: 'Plain sortable list', aK: 'basic', aA: 'Basic'};
		case 1:
			return {aG: 'Designed with mdgriffith/elm-ui', aK: 'basic-elm-ui', aA: 'Basic + Elm UI'};
		case 2:
			return {aG: 'Use a subelement as a drag handle.', aK: 'handle', aA: 'Drag handle'};
		case 3:
			return {aG: 'Use Html.Keyed for optimized DOM updates.', aK: 'keyed', aA: 'Keyed nodes'};
		case 4:
			return {aG: 'Wrap elements in case top or left margins are needed.', aK: 'margins', aA: 'Margins'};
		case 5:
			return {aG: 'Simple horizontal masonry.', aK: 'masonry', aA: 'Masonry'};
		case 6:
			return {aG: 'Put a drag handle to the top-left corner with resizable ghost element.', aK: 'resize', aA: 'Resize'};
		case 7:
			return {aG: 'Without thinking: duplicate everything.', aK: 'independents', aA: 'Independent lists'};
		default:
			return {aG: 'The list state invariant is that the list is gathered by the grouping property, and the auxiliary items preserve their places.', aK: 'groups', aA: 'Groupable items'};
	}
};
var $author$project$Introduction$Root$headerView = function (model) {
	var title = A2(
		$elm$core$Basics$composeR,
		$author$project$Introduction$Root$info,
		function ($) {
			return $.aA;
		})(model);
	var description = A2(
		$elm$core$Basics$composeR,
		$author$project$Introduction$Root$info,
		function ($) {
			return $.aG;
		})(model);
	return A2(
		$elm$html$Html$header,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h2,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(title)
					])),
				A2(
				$elm$html$Html$p,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(description)
					]))
			]));
};
var $elm$html$Html$main_ = _VirtualDom_node('main');
var $elm$html$Html$nav = _VirtualDom_node('nav');
var $elm$html$Html$h4 = _VirtualDom_node('h4');
var $elm$html$Html$li = _VirtualDom_node('li');
var $author$project$Config$Root$linkView = F2(
	function (currentPath, example) {
		var path = A2(
			$elm$url$Url$Builder$absolute,
			_List_fromArray(
				[
					$author$project$Path$rootPath,
					'config',
					A2(
					$elm$core$Basics$composeR,
					$author$project$Config$Root$info,
					function ($) {
						return $.aK;
					})(example)
				]),
			_List_Nil);
		return A2(
			$elm$html$Html$li,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$classList(
							_List_fromArray(
								[
									_Utils_Tuple2(
									'is-active',
									_Utils_eq(path, currentPath))
								])),
							$elm$html$Html$Attributes$href(path)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							A2(
								$elm$core$Basics$composeR,
								$author$project$Config$Root$info,
								function ($) {
									return $.aA;
								})(example))
						]))
				]));
	});
var $elm$html$Html$ul = _VirtualDom_node('ul');
var $author$project$Config$Root$navigationView = function (currentPath) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('navigation')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h4,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('DnDList')
					])),
				A2(
				$elm$html$Html$ul,
				_List_Nil,
				A2(
					$elm$core$List$map,
					$author$project$Config$Root$linkView(currentPath),
					_List_fromArray(
						[
							$author$project$Config$Root$Movement($author$project$Config$Movement$Root$initialModel),
							$author$project$Config$Root$OperationsOnDrag($author$project$Config$OperationsOnDrag$Root$initialModel),
							$author$project$Config$Root$OperationsOnDrop($author$project$Config$OperationsOnDrop$Root$initialModel)
						])))
			]));
};
var $author$project$ConfigGroups$Root$linkView = F2(
	function (currentPath, example) {
		var path = A2(
			$elm$url$Url$Builder$absolute,
			_List_fromArray(
				[
					$author$project$Path$rootPath,
					'config-groups',
					A2(
					$elm$core$Basics$composeR,
					$author$project$ConfigGroups$Root$info,
					function ($) {
						return $.aK;
					})(example)
				]),
			_List_Nil);
		return A2(
			$elm$html$Html$li,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$classList(
							_List_fromArray(
								[
									_Utils_Tuple2(
									'is-active',
									_Utils_eq(path, currentPath))
								])),
							$elm$html$Html$Attributes$href(path)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							A2(
								$elm$core$Basics$composeR,
								$author$project$ConfigGroups$Root$info,
								function ($) {
									return $.aA;
								})(example))
						]))
				]));
	});
var $author$project$ConfigGroups$Root$navigationView = function (currentPath) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('navigation')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h4,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('DnDList.Groups')
					])),
				A2(
				$elm$html$Html$ul,
				_List_Nil,
				A2(
					$elm$core$List$map,
					$author$project$ConfigGroups$Root$linkView(currentPath),
					_List_fromArray(
						[
							$author$project$ConfigGroups$Root$OperationsOnDrag($author$project$ConfigGroups$OperationsOnDrag$Root$initialModel),
							$author$project$ConfigGroups$Root$OperationsOnDrop($author$project$ConfigGroups$OperationsOnDrop$Root$initialModel)
						])))
			]));
};
var $author$project$Gallery$Root$linkView = F2(
	function (currentPath, example) {
		var path = A2(
			$elm$url$Url$Builder$absolute,
			_List_fromArray(
				[
					$author$project$Path$rootPath,
					'gallery',
					A2(
					$elm$core$Basics$composeR,
					$author$project$Gallery$Root$info,
					function ($) {
						return $.aK;
					})(example)
				]),
			_List_Nil);
		return A2(
			$elm$html$Html$li,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$classList(
							_List_fromArray(
								[
									_Utils_Tuple2(
									'is-active',
									_Utils_eq(path, currentPath))
								])),
							$elm$html$Html$Attributes$href(path)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							A2(
								$elm$core$Basics$composeR,
								$author$project$Gallery$Root$info,
								function ($) {
									return $.aA;
								})(example))
						]))
				]));
	});
var $author$project$Gallery$Root$navigationView = function (currentPath) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('navigation')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h4,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Gallery')
					])),
				A2(
				$elm$html$Html$ul,
				_List_Nil,
				A2(
					$elm$core$List$map,
					$author$project$Gallery$Root$linkView(currentPath),
					_List_fromArray(
						[
							$author$project$Gallery$Root$Hanoi($author$project$Gallery$Hanoi$initialModel),
							$author$project$Gallery$Root$Puzzle($author$project$Gallery$Puzzle$initialModel),
							$author$project$Gallery$Root$Shapes($author$project$Gallery$Shapes$initialModel),
							$author$project$Gallery$Root$Knight($author$project$Gallery$Knight$initialModel),
							$author$project$Gallery$Root$TryOn($author$project$Gallery$TryOn$initialModel),
							$author$project$Gallery$Root$TaskBoard($author$project$Gallery$TaskBoard$initialModel)
						])))
			]));
};
var $author$project$Introduction$Root$linkView = F2(
	function (currentPath, example) {
		var path = A2(
			$elm$url$Url$Builder$absolute,
			_List_fromArray(
				[
					$author$project$Path$rootPath,
					'introduction',
					A2(
					$elm$core$Basics$composeR,
					$author$project$Introduction$Root$info,
					function ($) {
						return $.aK;
					})(example)
				]),
			_List_Nil);
		return A2(
			$elm$html$Html$li,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$classList(
							_List_fromArray(
								[
									_Utils_Tuple2(
									'is-active',
									_Utils_eq(path, currentPath))
								])),
							$elm$html$Html$Attributes$href(path)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							A2(
								$elm$core$Basics$composeR,
								$author$project$Introduction$Root$info,
								function ($) {
									return $.aA;
								})(example))
						]))
				]));
	});
var $author$project$Introduction$Root$navigationView = function (currentPath) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('navigation')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h4,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Introduction')
					])),
				A2(
				$elm$html$Html$ul,
				_List_Nil,
				A2(
					$elm$core$List$map,
					$author$project$Introduction$Root$linkView(currentPath),
					_List_fromArray(
						[
							$author$project$Introduction$Root$Basic($author$project$Introduction$Basic$initialModel),
							$author$project$Introduction$Root$BasicElmUI($author$project$Introduction$BasicElmUI$initialModel),
							$author$project$Introduction$Root$Handle($author$project$Introduction$Handle$initialModel),
							$author$project$Introduction$Root$Keyed($author$project$Introduction$Keyed$initialModel),
							$author$project$Introduction$Root$Margins($author$project$Introduction$Margins$initialModel),
							$author$project$Introduction$Root$Masonry($author$project$Introduction$Masonry$initialModel),
							$author$project$Introduction$Root$Resize($author$project$Introduction$Resize$initialModel),
							$author$project$Introduction$Root$Independents($author$project$Introduction$Independents$initialModel),
							$author$project$Introduction$Root$Groups($author$project$Introduction$Groups$initialModel)
						])))
			]));
};
var $author$project$Home$view = function (model) {
	return $elm$html$Html$text('');
};
var $author$project$Main$view = function (model) {
	return {
		cy: _List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('sidebar')
					]),
				_List_fromArray(
					[
						$author$project$Main$cardView,
						A2(
						$elm$html$Html$nav,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$map,
								$author$project$Main$IntroductionMsg,
								$author$project$Introduction$Root$navigationView(model.z)),
								A2(
								$elm$html$Html$map,
								$author$project$Main$ConfigMsg,
								$author$project$Config$Root$navigationView(model.z)),
								A2(
								$elm$html$Html$map,
								$author$project$Main$ConfigGroupsMsg,
								$author$project$ConfigGroups$Root$navigationView(model.z)),
								A2(
								$elm$html$Html$map,
								$author$project$Main$GalleryMsg,
								$author$project$Gallery$Root$navigationView(model.z))
							]))
					])),
				A2(
				$elm$html$Html$main_,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('main')
					]),
				function () {
					var _v0 = model.s;
					switch (_v0.$) {
						case 0:
							return _List_fromArray(
								[
									$elm$html$Html$text('Not found')
								]);
						case 1:
							var mo = _v0.a;
							return _List_fromArray(
								[
									A2(
									$elm$html$Html$map,
									$author$project$Main$HomeMsg,
									$author$project$Home$view(mo))
								]);
						case 2:
							var mo = _v0.a;
							return _List_fromArray(
								[
									A2(
									$elm$html$Html$map,
									$author$project$Main$IntroductionMsg,
									$author$project$Introduction$Root$headerView(mo)),
									A2(
									$elm$html$Html$map,
									$author$project$Main$IntroductionMsg,
									$author$project$Introduction$Root$demoView(mo)),
									A2(
									$elm$html$Html$map,
									$author$project$Main$IntroductionMsg,
									$author$project$Introduction$Root$codeView(mo))
								]);
						case 3:
							var mo = _v0.a;
							return _List_fromArray(
								[
									A2(
									$elm$html$Html$map,
									$author$project$Main$ConfigMsg,
									$author$project$Config$Root$headerView(mo)),
									A2(
									$elm$html$Html$map,
									$author$project$Main$ConfigMsg,
									$author$project$Config$Root$demoView(mo)),
									A2(
									$elm$html$Html$map,
									$author$project$Main$ConfigMsg,
									$author$project$Config$Root$codeView(mo))
								]);
						case 4:
							var mo = _v0.a;
							return _List_fromArray(
								[
									A2(
									$elm$html$Html$map,
									$author$project$Main$ConfigGroupsMsg,
									$author$project$ConfigGroups$Root$headerView(mo)),
									A2(
									$elm$html$Html$map,
									$author$project$Main$ConfigGroupsMsg,
									$author$project$ConfigGroups$Root$demoView(mo)),
									A2(
									$elm$html$Html$map,
									$author$project$Main$ConfigGroupsMsg,
									$author$project$ConfigGroups$Root$codeView(mo))
								]);
						default:
							var mo = _v0.a;
							return _List_fromArray(
								[
									A2(
									$elm$html$Html$map,
									$author$project$Main$GalleryMsg,
									$author$project$Gallery$Root$headerView(mo)),
									A2(
									$elm$html$Html$map,
									$author$project$Main$GalleryMsg,
									$author$project$Gallery$Root$demoView(mo)),
									A2(
									$elm$html$Html$map,
									$author$project$Main$GalleryMsg,
									$author$project$Gallery$Root$codeView(mo))
								]);
					}
				}())
			]),
		aA: 'annaghi | dnd-list'
	};
};
var $author$project$Main$main = $elm$browser$Browser$application(
	{c9: $author$project$Main$init, dp: $author$project$Main$UrlChanged, dq: $author$project$Main$LinkClicked, b5: $author$project$Main$subscriptions, b9: $author$project$Main$update, d3: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(0))(0)}});}(this));