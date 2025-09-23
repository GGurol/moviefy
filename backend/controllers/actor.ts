import { isValidObjectId } from "mongoose";
import Actor from "../models/actor";
import { sendError, saveImageLocally, formateActor } from "../utils/helper";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url"; // Import this helper

// --- ADDED: ES Module-compatible way to get __dirname ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createActor = async (req, res) => {
  const { name, about, gender } = req.body;
  const { file } = req;

  const newActor = new Actor({ name, about, gender });

  if (file) {
    const avatarUrl = saveImageLocally(file);
    newActor.avatar = avatarUrl;
  }

  await newActor.save();
  res.status(201).json({ actor: formateActor(newActor) });
};

export const updateActor = async (req, res) => {
  const { name, about, gender } = req.body;
  const { file } = req;
  const { actorId } = req.params;

  if (!isValidObjectId(actorId)) return sendError(res, "Invalid Actor ID");
  const actor = await Actor.findById(actorId);
  if (!actor) return sendError(res, "Invalid request, actor not found");

  const oldAvatarPath = actor.avatar;

  if (oldAvatarPath && file) {
    try {
      const fullPath = path.join(__dirname, "../../", oldAvatarPath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } catch (error) {
      console.error("Failed to remove old avatar:", error);
    }
  }

  if (file) {
    const newAvatarUrl = saveImageLocally(file);
    actor.avatar = newAvatarUrl;
  }

  actor.name = name;
  actor.about = about;
  actor.gender = gender;

  await actor.save();

  res.status(201).json({ actor: formateActor(actor) });
};

export const removeActor = async (req, res) => {
  const { actorId } = req.params;

  if (!isValidObjectId(actorId)) return sendError(res, "Invalid Actor ID");

  const actor = await Actor.findById(actorId);
  if (!actor) return sendError(res, "Invalid request, actor not found");

  const avatarPath = actor.avatar;

  if (avatarPath) {
    try {
      const fullPath = path.join(__dirname, "../../", avatarPath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } catch (error) {
      console.error("Failed to remove avatar on delete:", error);
    }
  }

  await Actor.findByIdAndDelete(actorId);

  res.json({ message: "Actor removed successfully" });
};

export const searchActor = async (req, res) => {
  const { name } = req.query;
  if (!name || !(name as string).trim()) return sendError(res, 'Invalid request!');
  
  const result = await Actor.find({
    name: { $regex: name, $options: "i" },
  });

  const actors = result.map((actor) => formateActor(actor));

  res.json({ results: actors });
};

export const getLatestActors = async (req, res) => {
  const result = await Actor.find().sort({ createdAt: "desc" }).limit(12);
  const actors = result.map((actor) => formateActor(actor));
  res.json(actors);
};

export const getSingleActor = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) return sendError(res, "Invalid request");
  const actor = await Actor.findById(id);
  if (!actor) return sendError(res, "Invalid request, actor not found", 404);
  res.json({ actor: formateActor(actor) });
};

export const getActors = async (req, res) => {
  const { pageNo = '0', limit = '10' } = req.query;
  
  const actors = await Actor.find({})
    .sort({ createdAt: -1 })
    .skip(parseInt(pageNo as string) * parseInt(limit as string))
    .limit(parseInt(limit as string));

  const profiles = actors.map((actor) => formateActor(actor));
  res.json({
    profiles,
  });
};