const { isObjectIdOrHexString } = require('mongoose');
const { fail } = require('./responses');
module.exports = (req, res, next) => isObjectIdOrHexString(req.params.id)
  ? next() : fail(res, 400, 'INVALID_ID', 'ID inválido');
