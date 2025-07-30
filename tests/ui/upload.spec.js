const { test, expect } = require('@playwright/test');
const { generateTestFile, cleanup } = require('../../utils/test-data');
const path = require('path');
const fs = require('fs');

test.describe('File Upload Functionality', () => {
  let testFiles = [];

  test.beforeEach(async ({ page }) => {
    // Navigate to the upload page
    await page.goto(' https://the-internet.herokuapp.com/upload');
    
    // Verify page loaded correctly
    await expect(page.locator('h3')).toHaveText('File Uploader');
  });

  test.afterEach(async () => {
    // Clean up test files
    await cleanup(testFiles);
    testFiles = [];
  });

  test('should display upload page elements correctly', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle(/The Internet/);
    
    // Verify main heading
    await expect(page.locator('h3')).toBeVisible();
    
    // Verify file input exists
    await expect(page.locator('#file-upload')).toBeVisible();
    
    // Verify upload button exists
    await expect(page.locator('#file-submit')).toBeVisible();
    
    // Verify drag and drop area
    await expect(page.locator('#drag-drop-upload')).toBeVisible();
  });

  test('should upload a single text file successfully', async ({ page }) => {
    // Generate test file
    const testFile = await generateTestFile('test-file.txt', 'This is a test file content');
    testFiles.push(testFile);

    // Upload file using input field
    await page.locator('#file-upload').setInputFiles(testFile);
    
    // Click upload button
    await page.locator('#file-submit').click();
    
    
    await expect(page.locator('#uploaded-files')).toContainText('test-file.txt');
    await page.waitForURL(/.*upload/, { timeout: 10000 });
  });


  test('should handle different file types', async ({ page }) => {
    // Test with different file extensions
    const fileTypes = [
      { name: 'document.pdf', content: 'PDF content' },
      { name: 'image.jpg', content: 'JPEG content' },
      { name: 'data.csv', content: 'name,age\nJohn,30' }
    ];

    for (const fileType of fileTypes) {
      const testFile = await generateTestFile(fileType.name, fileType.content);
      testFiles.push(testFile);

      await page.locator('#file-upload').setInputFiles(testFile);
      await page.locator('#file-submit').click();
      
      // Wait for processing
      await page.waitForTimeout(1000);
      
      // Navigate back to upload page for next iteration
      await page.goto('https://the-internet.herokuapp.com/upload');
    }
  });

  test('should handle large file upload', async ({ page }) => {
    // Generate a larger test file (1MB)
    const largeContent = 'A'.repeat(1024 * 1024); // 1MB of 'A's
    const testFile = await generateTestFile('large-file.txt', largeContent);
    testFiles.push(testFile);

    await page.locator('#file-upload').setInputFiles(testFile);
    await page.locator('#file-submit').click();
    
    // Wait longer for large file upload
    await page.waitForLoadState('networkidle', { timeout: 30000 });
  });

 test('should test drag and drop functionality', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/upload');

  // Create test file
  const fileBuffer = Buffer.from('Test file content for drag and drop');

  // Listen for file dialog and provide file
  page.on('filechooser', async filechooser => {
    await filechooser.setFiles({
      name: 'drag-drop-test.txt',
      mimeType: 'text/plain',
      buffer: fileBuffer
    });
  });

  // Trigger file chooser (if there's a button that opens file dialog)
  await page.click('[data-testid="upload-button"]'); // Adjust selector

  // Wait for file name to appear
  const fileNameSpan = page.locator('span[data-dz-name]');
  await expect(fileNameSpan).toHaveText('drag-drop-test.txt', { timeout: 10000 });
});

  test('should validate file input behavior', async ({ page }) => {
    const fileInput = page.locator('#file-upload');
    const uploadButton = page.locator('#file-submit');
    
    // Verify initial state
    await expect(fileInput).toBeVisible();
    await expect(uploadButton).toBeVisible();
    
    // Test clicking upload without selecting file
    await uploadButton.click();
    
  
    await page.waitForTimeout(1000);
  });

  test('should handle file upload errors gracefully', async ({ page }) => {
    // Create an empty file to test edge case
    const emptyFile = await generateTestFile('empty-file.txt', '');
    testFiles.push(emptyFile);

    await page.locator('#file-upload').setInputFiles(emptyFile);
    await page.locator('#file-submit').click();
    
    // Wait for response
    await page.waitForLoadState('networkidle');
    
    
  });

  test('should verify upload button states', async ({ page }) => {
    const uploadButton = page.locator('#file-submit');
    const fileInput = page.locator('#file-upload');
    
    // Check initial button state
    await expect(uploadButton).toBeEnabled();
    
    // Add file and verify button remains enabled
    const testFile = await generateTestFile('button-test.txt', 'Button test content');
    testFiles.push(testFile);
    
    await fileInput.setInputFiles(testFile);
    await expect(uploadButton).toBeEnabled();
  });

  test('should test file input clearing', async ({ page }) => {
    const testFile = await generateTestFile('clear-test.txt', 'Clear test content');
    testFiles.push(testFile);

    const fileInput = page.locator('#file-upload');
    
    // Upload file
    await fileInput.setInputFiles(testFile);
    
    // Clear file input
    await fileInput.setInputFiles([]);
    

  });

  test('should verify page navigation after upload', async ({ page }) => {
    const testFile = await generateTestFile('navigation-test.txt', 'Navigation test content');
    testFiles.push(testFile);

    await page.locator('#file-upload').setInputFiles(testFile);
    await page.locator('#file-submit').click();
    
    // Wait for navigation
    await page.waitForLoadState('networkidle');
    
    // Verify we're still on the correct domain
    expect(page.url()).toContain('herokuapp.com');
    
  
  });
});