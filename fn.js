var _ = require('lodash')

function always()   { return true   }
function never()    { return false  }

function maybe(type, value) {
    if (type(value)) return value
}

var number  = _.partial(maybe, _.isNumber)
var string  = _.partial(maybe, _.isString)
var any     = _.partial(maybe, always)
var none    = _.partial(maybe, never)

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

,   get_set_any     = _.partial(get_set, validateAlways)
,   get_set_number  = _.partial(get_set, validateNumber)
,   read_only       = _.partial(get_set, validateReadOnly)

,   any         = property(get_set_any)
,   number      = property(get_set_number)
,   read_only   = property(read_only)

module.exports = function() {

    var width   = 720
    ,   height  = 80
    ,   version = '0.0.1'
    ,   whatevs = ':D'

    ,   a       = any(fn)
    ,   n       = number(fn)
    ,   r_o     = read_only(fn)

    function fn() {}

    fn.width    = n(width)
    fn.height   = n(height)
    fn.version  = r_o(version)
    fn.whatevs  = a(whatevs)

    return fn
}
