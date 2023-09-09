'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("dictionary-settings", "sourceLanguage", {
      type: Sequelize.STRING(5),
      defaultValue: "",
      allowNull: false
    });

    await queryInterface.addColumn("dictionary-settings", "isActive", {
      type: Sequelize.BOOLEAN(2),
      defaultValue: false,
      allowNull: false
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
