const router = require('express').Router();
const categoryRoutes = require('./category-routes');
const productRoutes = require('./product-routes');
const tagRoutes = require('./tag-routes');

router.use('/categories', categoryRoutes);      //Routes for the applicable data used to navigate the application
router.use('/products', productRoutes);
router.use('/tags', tagRoutes);

module.exports = router;