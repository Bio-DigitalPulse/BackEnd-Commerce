const router = require('express').Router();
const {
  Product,
  Category,
  Tag,
  ProductTag
} = require('../../models');


router.get('/', async (req, res) => {   //Find all products asynchronous function
  try {
    const data = await Product.findAll({
      include: [{
        model: Category
      }, {
        model: Tag
      }],
    });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/:id', async (req, res) => {    //Find specific product by ID asynchronous function

  try {
    const data = await Product.findByPk(req.params.id, {
      include: [{
        model: Category
      }, {
        model: Tag
      }],
    });
    if (!data) {
      res.status(404).json({
        message: "No products found matching that ID."
      });
      return;
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', (req, res) => {    //Create new product asynchronous function

  Product.create(req.body)
    .then((product) => {
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.put('/:id', (req, res) => {    //Update product by specific ID asynchronous function

  Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    })
    .then((product) => {
      return ProductTag.findAll({
        where: {
          product_id: req.params.id
        }
      });
    })
    .then((productTags) => {
      const productTagIds = productTags.map(({
        tag_id
      }) => tag_id);
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      const productTagsToRemove = productTags
        .filter(({
          tag_id
        }) => !req.body.tagIds.includes(tag_id))
        .map(({
          id
        }) => id);

      return Promise.all([
        ProductTag.destroy({
          where: {
            id: productTagsToRemove
          }
        }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {   //Delete product by specific ID asynchronous function
  try {
    const data = await Product.destroy({
      where: {
        id: req.params.id
      }
    });
    if (!data) {
      res.status(400).json({
        message: "Product ID not found. Delete request canceled."
      })
      return;
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router;