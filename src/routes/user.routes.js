const router = require('express').Router();
const c = require('../controllers/user.controller');
const wrap = require('../middlewares/asyncHandler');
const validateId = require('../middlewares/validateObjectId');
router.post('/', wrap(c.create));
router.get('/', wrap(c.list));
router.get('/:id', validateId, wrap(c.get));
router.patch('/:id/status', validateId, wrap(c.changeStatus));
module.exports = router;
