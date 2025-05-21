import prisma from '../utils/prismaClient.js';

export const resolvers = {
  Query: {
    me: async (_, __, { userId }) => {
      if (!userId) return null;
      return prisma.user.findUnique({ where: { id: userId } });
    },
    todos: async (_, __, { userId }) => {
      if (!userId) return [];
      return prisma.todo.findMany({ where: { userId } });
    },
  },
  Mutation: {
    signup: async (_, { username, password }, { req }) => {
      const user = await prisma.user.create({ data: { username, password } });
      req.session.userId = user.id;
      return user;
    },
    login: async (_, { username, password }, { req }) => {
      const user = await prisma.user.findUnique({ where: { username } });
      if (!user || user.password !== password) throw new Error('Invalid credentials');
      req.session.userId = user.id;
      return user;
    },
    addTodo: async (_, { title }, { userId }) => {
      if (!userId) throw new Error('Not authenticated');
      return prisma.todo.create({ data: { title, completed: false, userId } });
    },
    toggleTodo: async (_, { id }, { userId }) => {
      if (!userId) throw new Error('Not authenticated');
      const todo = await prisma.todo.findUnique({ where: { id } });
      if (!todo || todo.userId !== userId) throw new Error('Not found');
      return prisma.todo.update({ where: { id }, data: { completed: !todo.completed } });
    },
    deleteTodo: async (_, { id }, { userId }) => {
      if (!userId) throw new Error('Not authenticated');
      const todo = await prisma.todo.findUnique({ where: { id } });
      if (!todo || todo.userId !== userId) throw new Error('Not found');
      await prisma.todo.delete({ where: { id } });
      return true;
    },
  },
};
