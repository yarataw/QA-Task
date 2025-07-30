const fs = require('fs').promises;
const path = require('path');

/**
 * Generate a test file with specified name and content
 * @param {string} filename - Name of the file to create
 * @param {string} content - Content to write to the file
 * @returns {string} - Path to the created file
 */
async function generateTestFile(filename, content) {
  const testDir = path.join(__dirname, '..', 'temp-test-files');
  
  // Ensure test directory exists
  try {
    await fs.mkdir(testDir, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
  
  const filePath = path.join(testDir, filename);
  await fs.writeFile(filePath, content, 'utf8');
  
  return filePath;
}

/**
 * Clean up test files
 * @param {Array|string} filePaths - Array of file paths or single file path to clean up
 */
async function cleanup(filePaths) {
  const paths = Array.isArray(filePaths) ? filePaths : [filePaths];
  
  for (const filePath of paths) {
    if (filePath) {
      try {
        await fs.unlink(filePath);
      } catch (error) {
        console.warn(`Could not delete file: ${filePath}`, error.message);
      }
    }
  }
}

module.exports = {
  generateTestFile,
  cleanup
};