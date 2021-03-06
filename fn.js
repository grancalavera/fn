var _ = require('lodash')

function always()   { return true   }
function never()    { return false  }

function validate(validator, error) {
    error = error || new Error('Boom!')
    return function(value) {
        if (validator(value)) { return value }
        // throw?
        else { throw error }
    }
}

function get_set(validate, host, record) {
    return function(value) {
        if (!arguments.length) return record
        record = validate(value)
        return host
    }
}

var property = _.curry(function(get_set, host, record) {
    return get_set(host, record)
})

,   validateAlways      = validate(always)
,   validateNumber      = validate(_.isNumber, new Error('"value" must be Number.'))
,   validateReadOnly    = validate(never, new Error('Unable to set read-only property.'))

,   get_set_any         = _.partial(get_set, validateAlways)
,   get_set_number      = _.partial(get_set, validateNumber)
,   get_set_read_only   = _.partial(get_set, validateReadOnly)

,   any         = property(get_set_any)
,   number      = property(get_set_number)
,   read_only   = property(get_set_read_only)

module.exports.a = function() {

    var width   = 720
    ,   height  = 80
    ,   version = '0.0.1'
    ,   whatevs = ':D'

    ,   a       = any(fn)
    ,   n       = number(fn)
    ,   r_o     = read_only(fn)

    function fn() {
        return [width, height, version, whatevs]
    }

    fn.width    = n(width)
    fn.height   = n(height)
    fn.whatevs  = a(whatevs)
    fn.version  = r_o(version)

    return fn
}

module.exports.b = function() {

    var x
    ,   y
    ,   a = any(fn)

    function fn() {
        return [['x', x], ['y', y]]
    }

    fn.x = a(x)

    fn.y = function(value) {
        if (!arguments.length) return y
        y = value
        return fn
    }

    return fn
}
