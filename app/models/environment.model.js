module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      temperature: Number,
      terraintype: String,
      humidity: Float32Array
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Environment = mongoose.model("environment", schema);
  return Environment;
};
