const News = require("../models/News");

// ==========================================
// CREATE NEWS
// ==========================================
const createNews = async (req, res) => {
  try {
    const {
      title_en,
      title_so,
      content_en,
      content_so,
      image,
      category,
      author
    } = req.body;

    if (
      !title_en ||
      !title_so ||
      !content_en ||
      !content_so
    ) {
      return res.status(400).json({
        message:
          "English and Somali titles and content are required"
      });
    }

    const news = await News.create({
      title_en: title_en.trim(),
      title_so: title_so.trim(),
      content_en: content_en.trim(),
      content_so: content_so.trim(),
      image: image?.trim() || "",
      category: category?.trim() || "",
      author: author?.trim() || "",
      publishedAt: new Date(),
      is_published: true
    });

    return res.status(201).json({
      message: "News created successfully",
      news
    });

  } catch (error) {
    console.error("CREATE NEWS ERROR:", error.message);

    return res.status(500).json({
      message: "Server error while creating news"
    });
  }
};


// ==========================================
// GET PUBLISHED NEWS
// ==========================================
const getNews = async (req, res) => {
  try {
    const news = await News.find({
      is_published: true
    }).sort({
      publishedAt: -1
    });

    return res.status(200).json({
      count: news.length,
      news
    });

  } catch (error) {
    console.error("GET NEWS ERROR:", error.message);

    return res.status(500).json({
      message: "Server error while fetching news"
    });
  }
};


// ==========================================
// GET SINGLE NEWS
// ==========================================
const getSingleNews = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await News.findOne({
      _id: id,
      is_published: true
    });

    if (!news) {
      return res.status(404).json({
        message: "News not found"
      });
    }

    return res.status(200).json({
      news
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error while fetching news"
    });
  }
};


// ==========================================
// GET ALL NEWS - ADMIN
// ==========================================
const getAllNews = async (req, res) => {
  try {
    const news = await News.find()
      .sort({
        createdAt: -1
      });

    return res.status(200).json({
      count: news.length,
      news
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error while fetching all news"
    });
  }
};


// ==========================================
// UPDATE NEWS
// ==========================================
const updateNews = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await News.findById(id);

    if (!news) {
      return res.status(404).json({
        message: "News not found"
      });
    }

    const {
      title_en,
      title_so,
      content_en,
      content_so,
      image,
      category,
      author,
      publishedAt
    } = req.body;

    if (title_en !== undefined)
      news.title_en = title_en.trim();

    if (title_so !== undefined)
      news.title_so = title_so.trim();

    if (content_en !== undefined)
      news.content_en = content_en.trim();

    if (content_so !== undefined)
      news.content_so = content_so.trim();

    if (image !== undefined)
      news.image = image.trim();

    if (category !== undefined)
      news.category = category.trim();

    if (author !== undefined)
      news.author = author.trim();

    if (publishedAt !== undefined)
      news.publishedAt = publishedAt;

    await news.save();

    return res.status(200).json({
      message: "News updated successfully",
      news
    });

  } catch (error) {
    console.error("UPDATE NEWS ERROR:", error.message);

    return res.status(500).json({
      message: "Server error while updating news"
    });
  }
};


// ==========================================
// DELETE NEWS
// ==========================================
const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await News.findById(id);

    if (!news) {
      return res.status(404).json({
        message: "News not found"
      });
    }

    await News.findByIdAndDelete(id);

    return res.status(200).json({
      message: "News deleted successfully"
    });

  } catch (error) {
    console.error("DELETE NEWS ERROR:", error.message);

    return res.status(500).json({
      message: "Server error while deleting news"
    });
  }
};


// ==========================================
// TOGGLE PUBLISH STATUS
// ==========================================
const toggleNewsStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await News.findById(id);

    if (!news) {
      return res.status(404).json({
        message: "News not found"
      });
    }

    news.is_published = !news.is_published;

    await news.save();

    return res.status(200).json({
      message: news.is_published
        ? "News published successfully"
        : "News unpublished successfully",
      news
    });

  } catch (error) {
    console.error("TOGGLE NEWS ERROR:", error.message);

    return res.status(500).json({
      message: "Server error while changing news status"
    });
  }
};


module.exports = {
  createNews,
  getNews,
  getSingleNews,
  getAllNews,
  updateNews,
  deleteNews,
  toggleNewsStatus
};