const _ = require('lodash');
const Ajv = require('ajv');
const ajv = new Ajv();

// merge y into x
const merge = {
    schema(x, y, context = { path: '#' }) {
        if(_.isEmpty(x)) {
            return y || {};
        }
        if(_.isEmpty(y)) {
            return x || {};
        }
        const newContext = _.assign({}, context);
        // validate JSON Schema at the first level
        if (context.path === '#') {
            ajv.compile(x);
            ajv.compile(y);
            _.assign(newContext, { rootX: x, rootY: y });
        }
        // parse $ref
        const parsedX = merge._parse(x, newContext.rootX);
        const parsedY = merge._parse(y, newContext.rootY);
        // if parsedY is not empty Object
        if(parsedY.type) {
            // if merge[parsedX.type] exist
            if(merge[parsedX.type]) {
                if(parsedX.type === parsedY.type) {
                    return merge[parsedX.type](parsedX, parsedY, newContext);
                }
            // if merge[parsedX.type] does not exist
            } else {
                return merge._default(parsedX, parsedY, newContext)
            }
        }
        return parsedY;
    },
    _parse(x, root) {
        if (_.has(x, '$ref')) {
            const path = x.$ref.substr(2).replace('/', '.');
            const ref = merge._parse(_.get(root, path), root);
            return _.assign({}, ref);
        } else {
            return _.assign({}, x);
        }
    },
    _default(x, y, context) {
        return y;
    },
    object(x, y, context) {
        const mergedSchema = Object.assign({}, y);
        const { required: xr = [], definitions: xd = {}, properties: xp = {} } = x;
        const { required: yr = [], definitions: yd = {}, properties: yp = {} } = y;
        // merge required
        const mergedRequired = _.union(xr, yr);
        if (mergedRequired.length) {
            mergedSchema.required = mergedRequired;
        }
        // merge definitions
        const dk = _.union(_.keys(xd), _.keys(yd));
        for(const p of dk ) {
            mergedSchema.definitions[p] = merge.schema(xd[p], yd[p], _.assign({}, context, { path: context.path + '/definitions/' + p }));
        }
        // merge properties
        const pk = _.union(_.keys(xp), _.keys(yp));
        for(const p of pk ) {
            mergedSchema.properties[p] = merge.schema(xp[p], yp[p], _.assign({}, context, { path: context.path + '/properties/' + p }));
        }
        return mergedSchema;
    },
    type(x, y, context) {
        return y;
    },
    string(x, y, context) {
        return y;
    },
    number(x, y, context) {
        return y;
    },
    array(x, y, context) {
        return y;
    },
}

module.exports = merge.schema;

