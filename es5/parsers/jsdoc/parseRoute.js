'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (doc) {

  var route = getRoute(doc);
  if (!route) {
    return null;
  }

  route.description = doc.description;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;

  var _iteratorError = void 0;

  try {
    for (var _iterator = doc.customTags[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var tagMeta = _step.value;
      var tag = tagMeta.tag;
      var value = tagMeta.value;


      if (_Route2.default.METHODS.includes(tag)) {
        continue;
      }

      if (tag.endsWith('param')) {
        var parameterKindName = tag.substr(0, tag.length - 'param'.length);
        var parameterKind = _Route2.default.PARAMETER_KINDS[parameterKindName.toLocaleUpperCase()];

        if (parameterKind === void 0) {
          throw new Error('Unknown parameter tag @' + tag);
        }

        var type = (0, _parseType.parseTypeString)(value);
        route.addParameter(parameterKind, type);
        continue;
      }

      if (tag === 'consumes') {
        route.consumes = value;
        continue;
      }

      if (tag === 'produces') {
        route.produces = value;
        continue;
      }

      if (tag === 'responds') {
        var _type = (0, _parseType.parseTypeString)(value);

        var httpCode = Number(_type.name);
        if (Number.isNaN(httpCode)) {
          throw new Error('Invalid HTTP code in @responds ' + value + '. Format is @responds <type> <code> - <description>');
        }

        route.addResponse(httpCode, _type);
        continue;
      }

      // TODO authenticate
      console.log('UNKNOWN TAG', tag);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return route;
};

var _Route = require('../../lib/Route');

var _Route2 = _interopRequireDefault(_Route);

var _parseType = require('./type/parseType');

var _BaseType = require('../../lib/types/abstract/BaseType');

var _BaseType2 = _interopRequireDefault(_BaseType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Attempts creating a route using the JSDoc comment.
 *
 * @param {!Object} doc - The JSDoc comment.
 * @returns {Route} The route or null if none could be created.
 */
function getRoute(doc) {
  if (!doc.customTags) {
    return null;
  }

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;

  var _iteratorError2 = void 0;

  try {
    for (var _iterator2 = doc.customTags[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var tag = _step2.value;

      if (_Route2.default.METHODS.includes(tag.tag)) {
        return new _Route2.default(tag.tag, tag.value);
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return null;
}

/**
 * Extracts a route from a parsed JSDoc comment.
 *
 * @param {!JsDocFunction} doc - The JSDoc comment.
 * @returns {Route} The route or null if the comment does not contain a valid tag.
 */