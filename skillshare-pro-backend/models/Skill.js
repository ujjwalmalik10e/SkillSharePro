import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  level: { 
    type: String, 
    enum: ["beginner", "intermediate", "advanced"], 
    default: "beginner" 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Skill = mongoose.model("Skill", skillSchema);
export default Skill;
