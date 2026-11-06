exports.fail = (res, status, code, message) => res.status(status).json({ ok: false, error: { code, message } });
exports.validId = value => typeof value === 'string' && /^[0-9a-fA-F]{24}$/.test(value);
