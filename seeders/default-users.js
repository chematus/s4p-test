module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Users', [{
      name: 'John Doe',
      username: 'john',
      password: '',
      email: 'john@mail.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Bob Clark',
      username: 'bob',
      password: '',
      email: 'bob@mail.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
