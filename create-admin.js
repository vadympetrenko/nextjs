const mongoose = require('mongoose');
const yargs = require('yargs');
const bcryptjs = require('bcryptjs')
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI);

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: [true, "Email should be unique"]
  },
  name: {
    type: String,
    required: [true, 'Please provide an username'],
    unique: [true, "username should be unique"]
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: [String],
    required: true
  },
});

const argv = yargs
  .option('email', {
    alias: 'e',
    description: 'Email address',
    type: 'string'
  })
  .option('password', {
    alias: 'p',
    description: 'Password',
    type: 'string'
  })
  .option('name', {
    alias: 'n',
    description: 'name',
    type: 'string'
  })
  .option('role', {
    alias: 'r',
    description: 'role',
    type: 'array'
  })
  .help()
  .alias('help', 'h')
  .argv;


const hashedPassword = bcryptjs.hashSync(argv.password, bcryptjs.genSaltSync(10));
const Admin = mongoose.models.admin || mongoose.model("admin", adminSchema)
const admin = new Admin({
  email: argv.email,
  username: argv.username,
  password: hashedPassword,
  role: argv.role,
});

admin.save()
  .then((data) => {
    console.log('admin user is created');
    mongoose.disconnect();
  })
  .catch((error) => {
    console.error('Error during the process:', error);
    mongoose.disconnect();
  });