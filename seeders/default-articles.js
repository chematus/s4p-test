module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Articles', [{
      name: 'Test title 1',
      data: 'Test content 1',
      isPublic: true,
      UserId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      name: 'Test title 2',
      data: 'Test content 2',
      isPublic: false,
      UserId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      name: 'Test title 3',
      data: 'Test content 3',
      isPublic: true,
      UserId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      name: 'Test title 4',
      data: 'Test content 4',
      isPublic: true,
      UserId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      name: 'Test title 5',
      data: 'Test content 5',
      isPublic: false,
      UserId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Articles', null, {});
  },
};
