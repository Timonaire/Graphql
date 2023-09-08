const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('./models'); // Replace with your actual User model import
const APP_SECRET = require('../utils')

const resolvers = {
  Query: {
    // Query to fetch the currently authenticated user
    currentUser: async (_, __, { user }) => {
      // 'user' is available because of authentication middleware
      if (!user) {
        throw new Error('Authentication required.');
      }
      return user;
    },
  },

  Mutation: {
    // Mutation for user Signup
    signup: async (_, { username, email, password }) => {
      try {
        // Check if a user with the provided email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new Error('User with this email already exists.');
        }

        // Hash the password for security
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
          email,
          password: hashedPassword,
        });

        await newUser.save();

        // Create a JWT token
        const token = jwt.sign({ userId: newUser.id }, APP_SECRET);

        return { token, user: newUser };
      } catch (error) {
        throw new Error(error.message);
      }
    },

    // Mutation for user login
    login: async (_, { email, password }) => {
      try {
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
          throw new Error('User not found.');
        }

        // Check if the provided password matches the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          throw new Error('Invalid password.');
        }

        // Create a JWT token
        const token = jwt.sign({ userId: user.id }, APP_SECRET);

        return { token, user };
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
};

module.exports = resolvers;
