const { User, Organization, Order, Tag } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_TEST_API_KEY); //NEED TEST API KEY
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

const resolvers = {
  Query: {
    getSingleUser: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findOne({ _id: context.user._id }).populate({
          path: 'savedOrganizations',
          populate: [
            { path: 'userId' }, // Populate the 'userId' field in each organization
            { path: 'tag' },     // Populate the 'tag' field in each organization
          ],
        }).populate('orderHistory');
        console.log(user)
        return user
      }
      throw AuthenticationError;
    },
    getAllUsers: async (parent, args) => {

        return User.find().populate('savedOrganizations').populate('orderHistory');

    },
    getSingleOrganization: async (parent, { organizationId }) => {
      return Organization.findOne({ _id: organizationId }).populate('userId').populate('tag');
    },
    getOrganizations: async () => {
      return Organization.find().sort({ createdAt: -1 }).populate('userId').populate('tag');
    },
    getOrgsByTagId: async (parent, {tagId}, context) => {
        return Organization.find({ tag: { _id: tagId } }).populate('userId').populate('tag');
    },
    getSearch: async (parent, {searchParams}) => {
      if (searchParams) {
        const regex = new RegExp(escapeRegex(searchParams), "gi");
        return orgsByName = Organization.find(
          {$or:[{name: regex},{description: regex}]}).populate('userId').populate('tag');
      }
    },
    getOrdersByUserId: async (parent, args, context) => {
      if (context.user) {
        return Order.find({ userId: context.user._id })
      }
      throw AuthenticationError;
    },
    getOrdersByOrgName: async (parent, {organizationName}) => {
      return Order.find({ organizationName: organizationName })
    },
    getSingleOrder: async (parent, { orderId }, context) => {
      if (context.user) {
        console.log(orderId);
        return Order.findOne({ _id: orderId })
      }
      throw AuthenticationError;
    },
    getSingleTag: async (parent, { tagId }) => {
      return Tag.findOne({ _id: tagId })
    },
    getTagByName: async (parent, { tagName }) => {
      return Tag.findOne({ name: tagName })
    },
    getAllTags: async () => {
      return Tag.find();
    },
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw AuthenticationError;
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user);

      return { token, user };
    },
    addUser: async (parent, { input }) => {
      const user = await User.create({
        username: input.username,
        email: input.email,
        password: input.password,
        isAdmin: input.isAdmin,
        image: input.image
      });
      const token = signToken(user);
      return { token, user };
    },
    saveOrganization: async (parent, { input }, context) => {
      if (context.user) {
        const newOrganization = {
          _id: input._id,
          name: input.name,
          description: input.description,
          image: input.image || null,
          link: input.link || null,
        }
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedOrganizations: newOrganization } },
          { new: true, runValidators: true }
        ).populate('savedOrganizations');
        return updatedUser;
      }
      throw AuthenticationError;
    },
    updateFundingAmount: async (parent, {myOrganization, fundraisingAmount}) => {

        const updatedOrg = await Organization.findOneAndUpdate(
          { _id: myOrganization },
          { $set: { fundraisingAmount: fundraisingAmount } },
          { new: true, runValidators: true }
        )
        return updatedOrg;

    },
    removeOrganization: async (parent, { organizationId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedOrganizations: { _id: organizationId } } },
          { new: true, runValidators: true }
        );

        return updatedUser;
      }
      throw AuthenticationError;
    },
    updateUser: async (parent, { input }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $set: {input} },
          { new: true, runValidators: true }
        );

        return updatedUser;
      }
      throw AuthenticationError;
    },
    updateUserOrgId: async (parent, { myOrganizationId }, context) => {
      console.log(myOrganizationId)
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $set: { myOrganizationId: myOrganizationId },
          },
          {
            new: true,
            runValidators: true,
          }
        );
      }

      throw AuthenticationError;
    },
    addOrganization: async (parent, { input }, context) => {
      if (context.user) {
        const organization = await Organization.create({
          userId: context.user._id,
          name: input.name,
          description: input.description,
          image: input.image,
          link: input.link,
          tag: input.tag,
          fundraisingGoal: input.fundraisingGoal,
          fundraisingAmount:0
        });

        const userUpdate = await User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $set: { myOrganizationId: organization._id },
          },
          {
            new: true,
            runValidators: true,
          }
        );
        const populatedOrganization = await Organization.findById(organization._id);
        console.log(populatedOrganization);
        return populatedOrganization
      }
      throw AuthenticationError;
    },
    addOrder: async (parent, { input }, context) => {
      if (context.user) {
        const url = new URL(context.headers.referer).origin;

        const order = await Order.create({
          orderId: input.orderId,
          userId: context.user._id,
          orderTotal: input.orderTotal,
          orderDate: input.orderDate,
          paymentStatus: input.paymentStatus,
          organizationName: input.organizationName
        });

        const line_items = []
        line_items.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: order.organizationName,
            },
            unit_amount: order.orderTotal * 100,
          },
          quantity: 1
        });
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items,
          mode: 'payment',
          success_url: `${url}/profile/${context.user.id}`,
          cancel_url: `${url}/`,
        });

        const updatedOrder = await Order.findOneAndUpdate(
          { orderId: '' },
          { $set: { orderId: session.id  } },
          { new: true, runValidators: true }
        );

        const updatedOrg = await Organization.findOneAndUpdate(
          { name: order.organizationName },
          { $inc: { fundraisingAmount: order.orderTotal  } },
          { new: true, runValidators: true }
        );

        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { orderHistory: order } },
          { new: true, runValidators: true }
        ).populate('orderHistory');

        console.log(updatedUser);
        console.log(updatedOrder);
        return updatedOrder
      }
      throw AuthenticationError;
    }
  },
};

module.exports = resolvers;
