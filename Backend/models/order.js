const mongoos = require("mongoose");
const order = new mongoos.Schema(
  {
    user: {
      type: mongoos.Types.ObjectId,
      ref: "user",
    },
    services: {
      type: mongoos.Types.ObjectId,
      ref: "services"
    },
    status: {
      type: String,
      default: "Request Placed",
      enum: ["Request placed", "Services is coming", "Resolved", "Canceled"],
    },
  }, { timestamps: true }
);
module.exports = mongoos.model("order", order);