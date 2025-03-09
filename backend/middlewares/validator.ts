import { check, validationResult, body } from "express-validator";
import genres from "../utils/genres";
import { isValidObjectId } from "mongoose";

// ValidationChain
// https://express-validator.github.io/docs/api/validation-chain
export const userValidator = [
  check("name").trim().notEmpty().withMessage("Name is missing"),
  check("email").normalizeEmail().isEmail().withMessage("Email is invalid"),
  check("password")
    .trim()
    .notEmpty()
    .withMessage("Password is missing")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be between 8 to 20 characters long"),
];

export const validatePassword = [
  check("newPassword")
    .trim()
    .notEmpty()
    .withMessage("Password is missing!")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be between 8 to 20 characters long"),
];

export const signInValidator = [
  check("email").normalizeEmail().isEmail().withMessage("Email is invalid"),
  check("password").trim().notEmpty().withMessage("Password is missing"),
];

export const actorInfoValidator = [
  check("name").trim().notEmpty().withMessage("Actor name is missing"),
  check("about").trim().notEmpty().withMessage("About is a required field"),
  check("gender").trim().notEmpty().withMessage("Gender is a required field"),
];

export const validateMovie = [
  // check('title').trim().notEmpty().withMessage('Title is missing!'),
  body("title", "Title is missing").trim().notEmpty(),
  body("storyLine").trim().notEmpty().withMessage("Storyline is missing"),
  body("language").trim().notEmpty().withMessage("Language is missing"),
  // body("releaseDate").isDate().withMessage("Release date is missing"),
  body("status").isIn(["public", "private"]).withMessage("Movie status must be public or private"),
  body("type").trim().notEmpty().withMessage("Movie type is missing"),
  body("genres")
    .isArray()
    .withMessage("Genres must be an array")
    .custom((value) => {
      for (let g of value) {
        if (!genres.includes(g)) throw Error("Invalid genre");
      }
      return true;
    }),
  body("tags")
    .isArray({ min: 1 })
    .withMessage("Tags must be an array of strings")
    .custom((tags) => {
      for (let tag of tags) {
        if (typeof tag !== "string") throw Error("Tags must be an array of strings");
      }
      return true;
    }),
  body("cast")
    .isArray()
    // .withMessage("Cast must be an array of objects!")
    .withMessage("Cast must be an array of string")
    .custom((cast) => {
      for (let c of cast) {
        if (!isValidObjectId(c)) throw Error("Invalid actor ID inside cast");
        // if (!c.roleAs?.trim()) throw Error("Role as is missing!");
        // if (typeof c.leadActor !== "boolean") throw Error("Only accept boolean value for leadActor");
      }
      return true;
    }),

  // check('poster').custom((_, { req }) => {
  //   if (!req.file) throw Error('Poster file is missing!');
  //   return true;
  // }),
];

// export const validateTrailer = check("trailer")
//   .isObject()
//   .withMessage("Trailer must be an object with url and public_id!")
//   .custom(({ url, public_id }) => {
//     try {
//       const result = new URL(url);
//       if (!result.protocol.includes("http")) throw Error("Invalid url!");

//       const arr = url.split("/");
//       const publicId = arr[arr.length - 1].split(".")[0];

//       if (public_id !== publicId) throw Error("Trailer public_id is invalid");
//       return true;
//     } catch (error) {
//       throw Error("Invalid url!!!!!!!!");
//     }
//   });

export const validateRatings = check("rating", "Rating must be a number between 0 and 10").isFloat({ min: 0, max: 10 });

export const validate = (req, res, next) => {
  // validationResult
  // https://express-validator.github.io/docs/api/validation-result
  const error = validationResult(req).array();
  // console.log('validate error', error);
  if (error.length) {
    return res.json({ error: error[0].msg });
  }
  next();
};
