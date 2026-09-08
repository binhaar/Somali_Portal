const express = require("express");

const {
  globalSearch
} = require("../controllers/searchController");

const router = express.Router();


// GLOBAL SEARCH
router.get("/", globalSearch);


module.exports = router;