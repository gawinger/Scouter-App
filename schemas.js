const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");


// added joi options
const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAtributes: {},
        });
        if (clean !== value) return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

// configure joi restrictions for spots
module.exports.spotSchema = Joi.object({
  spot: Joi.object({
    title: Joi.string().required().escapeHTML(),
    description: Joi.string().required().escapeHTML(),
    location: Joi.string().required().escapeHTML(),
    address: Joi.string().allow("").optional().escapeHTML(),
    images: Joi.array().max(10),
  }).required(),
});

// configure joi restrictions for reviews
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    text: Joi.string().optional().allow("").escapeHTML(),
  }).required(),
});
