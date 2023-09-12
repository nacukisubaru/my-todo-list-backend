'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("dictionary-settings", "sourceISO", {
      type: Sequelize.STRING(100),
      defaultValue: "",
      allowNull: false
    });

    await queryInterface.addColumn("dictionary-settings", "targetISO", {
      type: Sequelize.STRING(100),
      defaultValue: "",
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
