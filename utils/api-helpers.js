const { expect } = require('@playwright/test');

/**
 * Validate the structure of a post object
 * @param {Object} post - Post object to validate
 */
function validatePostStructure(post) {
  expect(post).toHaveProperty('userId');
  expect(post).toHaveProperty('id');
  expect(post).toHaveProperty('title');
  expect(post).toHaveProperty('body');
  
  expect(typeof post.userId).toBe('number');
  expect(typeof post.id).toBe('number');
  expect(typeof post.title).toBe('string');
  expect(typeof post.body).toBe('string');
}

/**
 * Generate random test data for posts
 * @returns {Object} - Post data object
 */
function generatePostData() {
  return {
    title: `Test Post ${Date.now()}`,
    body: `Test body content ${new Date().toISOString()}`,
    userId: Math.floor(Math.random() * 10) + 1
  };
}

module.exports = {
  validatePostStructure,
  generatePostData
};