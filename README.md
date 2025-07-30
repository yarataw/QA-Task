# QA Test Suite - Web UI & API Testing

A comprehensive automated test suite built with Playwright that validates both web UI functionality and API endpoints.

## Project Structure

```
qa-test-suite/
├── tests/
│   ├── ui/
│   │   └── upload.spec.js          # UI tests for file upload functionality
│   └── api/
│       └── jsonplaceholder.spec.js # API tests for JSONPlaceholder endpoints
├── utils/
│   ├── test-data.js                # Test data generators and fixtures
│   └── api-helpers.js              # API utility functions
├── test-results/                   # Test execution reports
├── playwright.config.js            # Playwright configuration
├── package.json                    # Dependencies and scripts
└── README.md                       # This file
```

## Test Coverage

### Part 1: Web UI Testing
- **Target**: https://the-internet.herokuapp.com/upload
- **Scenarios Covered**:
  - File upload functionality
  - Drag and drop file upload
  - Multiple file uploads
  - Invalid file handling
  - UI element validation
  - Success message verification

### Part 2: API Testing
- **Target**: https://jsonplaceholder.typicode.com/
- **Endpoints Covered**:
  - `GET /posts` - Retrieve all posts
  - `GET /posts/{id}` - Retrieve specific post
  - `POST /posts` - Create new post
  - `PUT /posts/{id}` - Update entire post
  - `PATCH /posts/{id}` - Partial post update
  - `DELETE /posts/{id}` - Delete post

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

## Setup Instructions

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Install Playwright browsers**
   ```bash
   npx playwright install
   ```

## Running Tests

### Run All Tests
```bash
 npx playwright test
```

### Run UI Tests Only
```bash
 npx playwright test tests/ui/upload.spec.js
```

### Run API Tests Only
```bash
npx playwright test tests/api/jsonplaceholder.spec.js
```

### Run Tests in Headed Mode (with browser visible)
```bash
npm run test:headed
```

### Run Tests with HTML Report
```bash
npm run test:report
```

### Run Tests in Debug Mode
```bash
npm run test:debug
```

## Test Reports

After running tests, reports are generated in the `test-results/` directory:
- HTML reports: `test-results/html-report/`
- JSON reports: `test-results/json-report/`
- JUnit XML: `test-results/junit.xml`

To view the HTML report:
```bash
npx playwright show-report
```

## Configuration

The test suite uses `playwright.config.js` for configuration. Key settings include:
- Multiple browser support (Chromium, Firefox, WebKit)
- Parallel test execution
- Retry logic for flaky tests
- Screenshot and video capture on failure
- Custom timeouts and base URLs

## Test Architecture

### UI Tests (`tests/ui/upload.spec.js`)
- Uses Page Object Model pattern for maintainability
- Implements proper wait strategies
- Includes cross-browser compatibility
- Handles file upload scenarios comprehensively

### API Tests (`tests/api/jsonplaceholder.spec.js`)
- RESTful API testing with proper HTTP method coverage
- Request/response validation
- Status code verification
- JSON schema validation
- Error handling scenarios

### Utility Functions
- **test-data.js**: Generates dynamic test data and fixtures
- **api-helpers.js**: Common API operations and validations

## Challenges Encountered & Solutions

1. **File Upload Testing**
   - Challenge: Handling different file types and sizes
   - Solution: Created dynamic file generation utilities

2. **API Response Validation**
   - Challenge: Ensuring response structure consistency
   - Solution: Implemented JSON schema validation

3. **Cross-browser Compatibility**
   - Challenge: Different behavior across browsers
   - Solution: Browser-specific configurations and waits

4. **Test Data Management**
   - Challenge: Managing test data across different environments
   - Solution: Dynamic data generation and cleanup utilities
  

5. **Mock API validity**
   - Challenge: Mock API that doesn't actually validate if resources exist
   - Solution: Update expectations to match actual behaviour 

6. **Browser interacting**
   - Challenge: Drag and drop scenario can't be simulated
   - Solution: Use Dropzone.js library 
  
     
## Best Practices Implemented

- **Separation of Concerns**: UI and API tests are separated
- **DRY Principle**: Reusable utility functions and helpers
- **Proper Error Handling**: Comprehensive error scenarios
- **Detailed Reporting**: Multiple report formats for different stakeholders
- **Parallel Execution**: Tests run in parallel for faster feedback
- **Clean Test Data**: Proper setup and teardown procedures

## CI/CD Integration

The test suite is designed to integrate with CI/CD pipelines:
```bash
# Example CI command
npm ci && npx playwright install --with-deps && npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests following the existing patterns
4. Ensure all tests pass
5. Submit a pull request with clear commit messages

## Environment Variables

Optional environment variables for configuration:
- `BASE_URL`: Override base URL for UI tests
- `API_BASE_URL`: Override API base URL
- `HEADLESS`: Set to 'false' to run tests in headed mode
- `BROWSER`: Specify browser (chromium, firefox, webkit)

## Troubleshooting

### Common Issues

1. **Tests failing due to timeouts**
   - Increase timeout values in `playwright.config.js`
   - Check network connectivity

2. **File upload not working**
   - Ensure test files exist in the correct directory
   - Check file permissions

3. **API tests failing**
   - Verify API endpoint availability
   - Check network connectivity and firewall settings

### Debug Mode
Run tests in debug mode to step through execution:
```bash
npx playwright test --debug
```

## License

This project is licensed under the MIT License.
