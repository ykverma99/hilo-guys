import mongoose from 'mongoose'

const interactionSchema = new mongoose.Schema({
  withUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserSchema",
  },
  currUserId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserSchema",
  },
  timestamp: { type: Date, default: Date.now },
});

const Interaction = mongoose.model("Interaction", interactionSchema);
export default Interaction