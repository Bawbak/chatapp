const mongoose = require('mongoose');
module.exports = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/chatapp', {
      useNewUrlParser: true
    });
  } catch (err) {
    console.log(error.message);
    process.exit(1);
  }
};
