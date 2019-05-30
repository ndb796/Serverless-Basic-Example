const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
  title: String,
  body: String
});

global.Story = global.Story || mongoose.model('Story', StorySchema);
module.exports = global.Story;