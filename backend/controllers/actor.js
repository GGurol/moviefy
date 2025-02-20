const { isValidObjectId } = require('mongoose');
const Actor = require('../models/actor');
const {
  sendError,
  uploadImageToCloud,
  formateActor,
} = require('../utils/helper');
const cloudinary = require('../cloud');

exports.createActor = async (req, res) => {
  const { name, about, gender } = req.body;
  const { file } = req;

  const newActor = new Actor({ name, about, gender });
  console.log(file);

  if (file) {
    const { url, public_id } = await uploadImageToCloud(file.path);
    newActor.avatar = { url, public_id };
  }

  await newActor.save();
  res.status(201).json({ actor: formateActor(newActor) });
};

exports.updateActor = async (req, res) => {
  const { name, about, gender } = req.body;
  const { file } = req;
  const { actorId } = req.params;

  if (!isValidObjectId(actorId)) return sendError(res, 'Invalid Actor Id!');
  const actor = await Actor.findById(actorId);
  if (!actor) return sendError(res, 'Invalid request, record not found!');

  const public_id = actor.avatar?.public_id;

  // remove old image if there was one
  if (public_id && file) {
    const { result } = await cloudinary.uploader.destroy(public_id);
    console.log(result);
    if (result !== 'ok') {
      return sendError(res, 'Could not remove image from cloud');
    }
  }

  // upload new avatar if there is one
  if (file) {
    const { url, public_id } = await uploadImageToCloud(file.path);
    actor.avatar = {
      url,
      public_id,
    };
  }

  actor.name = name;
  actor.about = about;
  actor.gender = gender;

  await actor.save();

  res.status(201).json({ actor: formateActor(actor) });
};

exports.removeActor = async (req, res) => {
  const { actorId } = req.params;

  if (!isValidObjectId(actorId)) return sendError(res, 'Invalid Actor Id!');

  const actor = await Actor.findById(actorId);
  if (!actor) return sendError(res, 'Invalid request, record not found!');

  const public_id = actor.avatar?.public_id;

  // remove old image if there was one
  if (public_id) {
    const { result } = await cloudinary.uploader.destroy(public_id);
    if (result !== 'ok') {
      return sendError(res, 'Could not remove image from cloud');
    }
  }

  await Actor.findByIdAndDelete(actorId);

  res.json({ message: 'Record removed successfully!' });
};

exports.searchActor = async (req, res) => {
  // const result = await Actor.find({ $text: { $search: `"${query.name}"` } });
  // const { name } = req.query;
  // if (!name.trim()) return sendError(res, 'Invalid request!');
  const { query } = req;
  const result = await Actor.find({
    name: { $regex: query.name, $options: 'i' },
  });

  const actors = result.map((actor) => formateActor(actor));

  res.json({ results: actors });
};

exports.getLatestActors = async (req, res) => {
  const result = await Actor.find().sort({ createdAt: 'desc' }).limit(12);

  const actors = result.map((actor) => formateActor(actor));

  res.json(actors);
};

exports.getSingleActor = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) return sendError(res, 'Invalid request!');

  const actor = await Actor.findById(id);
  if (!actor) return sendError(res, 'Invalid request, actor not found!', 404);
  res.json({ actor: formateActor(actor) });
};

exports.getActors = async (req, res) => {
  const { pageNo, limit } = req.query;

  const actors = await Actor.find({})
    .sort({ createdAt: -1 })
    .skip(parseInt(pageNo) * parseInt(limit))
    .limit(parseInt(limit));

  const profiles = actors.map((actor) => formateActor(actor));
  res.json({
    profiles,
  });
};
