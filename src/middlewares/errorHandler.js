const { fail } = require('./responses');
module.exports = (err, req, res, next) => {
  if (err.name === 'ValidationError' || err.name === 'CastError' || err instanceof SyntaxError && 'body' in err)
    return fail(res, 400, 'VALIDATION', err.message);
  if (err.code === 11000)
    return res.status(409).json({ ok: false, error: { code: 'DUPLICATE', message: 'Registro duplicado', fields: err.keyValue } });
  console.error(err);
  return fail(res, 500, 'SERVER_ERROR', 'Error interno');
};
