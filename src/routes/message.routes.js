const router = require('express').Router();
const c = require('../controllers/message.controller');
const wrap = require('../middlewares/asyncHandler');
const validateId = require('../middlewares/validateObjectId');
router.put('/:id', validateId, wrap(c.edit));
router.delete('/:id', validateId, wrap(c.remove));
module.exports = router;
