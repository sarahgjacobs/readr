const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');


const resolvers = {
  Query: {
    me: async (parent, args, context) => {
        if(context.user) {
          const userData = await User.findOne({_id: context.user._id})
          return userData;
        }
        throw new AuthenticationError('Not logged in');
    },
   
  },
  Mutation: {
    login: async (parent, {email, password} ) => {
      const user = await User.findOne({email})
      if (!user) {
        throw new AuthenticationError('Incorrect email')
      }
      const correctPassword = await user.isCorrectPassword(password)
      if (!correctPassword) {
        throw new AuthenticationError('Incorrect password')
      }
      const token = signToken(user)
      return {token, user};
    }
    ,
    addUser: async (parent, args) => {
      const user = await User.create(args)
      const token = signToken(user)
      return {token, user}
    }
    ,
    // saveBook:
    // ,
    // removeBook:
    // createMatchup: async (parent, args) => {
    //   const matchup = await Matchup.create(args);
    //   return matchup;
    // },
    // createVote: async (parent, { _id, techNum }) => {
    //   const vote = await Matchup.findOneAndUpdate(
    //     { _id },
    //     { $inc: { [`tech${techNum}_votes`]: 1 } },
    //     { new: true }
    //   );
    //   return vote;
    // },
  },
};

module.exports = resolvers;
