const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint

// get all products
router.get("/", (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  Product.findAll({
    include: [
      {
        model: Category,
      },
      {
        model: Tag,
      },
    ],
  })
    .then((dbProductsData) => {
      res.json(dbProductsData);
    })

    .catch((err) => {
      res.status(500).json(err);
    });
});

// get one product
router.get("/:id", (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  Product.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Category,
      },
      {
        model: Tag,
      },
    ],
  })
    .then((dbProduct) => {
      if (!dbProduct) {
        res.status(404).json({ message: "Product was not found." });
        return;
      }

      res.json(dbProduct);
    })
    .catch((err) => {
      console.log(err);
      res.status(422).json(err);
    });
});

// create new product
router.post("/", (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      category_id: 6
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            // pair the assigned product id with the ProductTag product_id attribute
            product_id: product.id,
            tag_id,
          };
        });
        // associate each tag_id with product_id under the product_tag through table
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put("/:id", (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // checking if tagIds were provided in update request
      if (req.body.tagIds) {
        // find all previously associated tags from ProductTag
        return ProductTag.findAll({ where: { product_id: req.params.id } })

          .then((productTags) => {
            // get list of current tag_ids previously related to product
            const productTagIds = productTags.map(({ tag_id }) => tag_id);
            // create filtered list of new tag_ids submitted with
            const newProductTags = req.body.tagIds
              .filter((tag_id) => !productTagIds.includes(tag_id))
              .map((tag_id) => {
                return {
                  product_id: req.params.id,
                  tag_id,
                };
              });
            // figure out which ones to remove
            const productTagsToRemove = productTags
              .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
              .map(({ id }) => id);

            // run both actions
            return Promise.all([
              ProductTag.destroy({ where: { id: productTagsToRemove } }),
              ProductTag.bulkCreate(newProductTags),
            ]);
          })
          .then((updatedProductTags) => res.json(updatedProductTags));
      } else {
        // if tagIds not available returning success status response for updating other product fields
        res.status(200).json(product);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(422).json(err);
    });
});

router.delete("/:id", (req, res) => {
  // delete one product by its `id` value
  Product.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((productToDelete) => {
      if (!productToDelete) {
        res.status(404).json({ message: "Product not found." });
        return;
      }
      res.json(productToDelete);
    })
    .catch((err) => {
      console.log(err);
      res.status(424).json(err);
    });
});

module.exports = router;
