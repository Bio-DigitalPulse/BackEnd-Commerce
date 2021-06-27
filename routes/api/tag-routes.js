const router = require('express').Router();
const {
  Tag,
  Product,
  ProductTag
} = require('../../models');


router.get("/", async (req, res) => {   //Find all tags asynchronous function

  try {
    const data = await Tag.findAll({
      include: [{
        model: Product
      }],
    });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {    //Find product by specific ID asynchronous function

  try {
    const data = await Tag.findByPk(req.params.id, {
      include: [{
        model: Product
      }],
    });
    if (!data) {
      res
        .status(404)
        .json({
          message: "No tags have been assigned the provided ID."
        });
      return;
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {    //Create new tag asynchronous function

  try {
    const data = await Tag.create(req.body);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id", async (req, res) => {    //Update specific tag by ID asynchronous function

  try {
    const data = await Tag.update({
      tag_name: req.body.tag_name,
    }, {
      returning: true,
      where: {
        id: req.params.id,
      },
    });
    if (!data) {
      res
        .status(404)
        .json({
          message: "Tag ID not located. Update request canceled."
        });
      return;
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {   //Delete tag by specified ID asynchronous function

  try {
    const data = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(data);

    if (!data) {
      res
        .status(404)
        .json({
          message: "Tag ID not located. Delete request canceled.",
        });
      return;
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;