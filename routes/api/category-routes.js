const router = require('express').Router();
const {
  Category,
  Product
} = require('../../models');


router.get("/", async (req, res) => {   //Find all categories asynchronous function
  try {
    const data = await Category.findAll({
      include: [{
        model: Product
      }],
    });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {    //Find specific category by ID asynchronous function
  try {
    const data = await Category.findByPk(req.params.id, {
      include: [{
        model: Product
      }],
    });
    if (!data) {
      res
        .status(404)
        .json({
          message: "Category ID not located. Cannot complete find request."
        });
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {    //Create new category asynchronous function
  try {
    const data = await Category.create(req.body);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id", async (req, res) => {    //Update specific category by ID asynchronous function
  try {
    const data = await Category.update({
      category_name: req.body.category_name,
    }, {
      returning: true,
      where: {
        id: req.params.id,
      },
    });
    if (!data) {
      res.status(404).json({
        message: "Category ID not located. Cannot complete update request."
      });
      return;
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {   //Delete specific category by ID asynchronous function
  try {
    const data = await Category.destroy({
      where: {
        id: req.params.id
      }
    });
    if (!data) {
      res.status(404).json({
        message: "Category ID not located. Cannot complete delete request."
      });
      return;
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;