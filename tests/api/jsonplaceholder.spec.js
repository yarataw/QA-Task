// tests/api/jsonplaceholder.spec.js
const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://jsonplaceholder.typicode.com';

test.describe('JSONPlaceholder API Tests', () => {
  
  test.describe('GET /posts', () => {
    test('should get all posts successfully', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/posts`);
      
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('application/json');
      
      const posts = await response.json();
      expect(Array.isArray(posts)).toBeTruthy();
      expect(posts.length).toBe(100);
      
      // Verify structure of first post
      const firstPost = posts[0];
      expect(firstPost).toHaveProperty('userId');
      expect(firstPost).toHaveProperty('id');
      expect(firstPost).toHaveProperty('title');
      expect(firstPost).toHaveProperty('body');
      expect(typeof firstPost.userId).toBe('number');
      expect(typeof firstPost.id).toBe('number');
      expect(typeof firstPost.title).toBe('string');
      expect(typeof firstPost.body).toBe('string');
    });

    test('should support query parameters', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/posts?userId=1`);
      
      expect(response.status()).toBe(200);
      
      const posts = await response.json();
      expect(Array.isArray(posts)).toBeTruthy();
      expect(posts.length).toBeGreaterThan(0);
      
      // All posts should belong to userId 1
      posts.forEach(post => {
        expect(post.userId).toBe(1);
      });
    });

    test('should handle pagination with _limit parameter', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/posts?_limit=10`);
      
      expect(response.status()).toBe(200);
      
      const posts = await response.json();
      expect(posts.length).toBe(10);
    });
  });

  test.describe('GET /posts/{id}', () => {
    test('should get a specific post by ID', async ({ request }) => {
      const postId = 1;
      const response = await request.get(`${BASE_URL}/posts/${postId}`);
      
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('application/json');
      
      const post = await response.json();
      expect(post.id).toBe(postId);
      expect(post).toHaveProperty('userId');
      expect(post).toHaveProperty('title');
      expect(post).toHaveProperty('body');
      expect(typeof post.userId).toBe('number');
      expect(typeof post.title).toBe('string');
      expect(typeof post.body).toBe('string');
    });

    test('should return 404 for non-existent post', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/posts/999999`);
      
      expect(response.status()).toBe(404);
    });

    test('should handle invalid post ID format', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/posts/invalid`);
      
      expect(response.status()).toBe(404);
    });

    test('should get multiple specific posts by ID', async ({ request }) => {
      const postIds = [1, 5, 10];
      
      for (const id of postIds) {
        const response = await request.get(`${BASE_URL}/posts/${id}`);
        expect(response.status()).toBe(200);
        
        const post = await response.json();
        expect(post.id).toBe(id);
      }
    });
  });

  test.describe('POST /posts', () => {
    test('should create a new post successfully', async ({ request }) => {
      const newPost = {
        title: 'Test Post Title',
        body: 'This is a test post body content.',
        userId: 1
      };

      const response = await request.post(`${BASE_URL}/posts`, {
        data: newPost,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      expect(response.status()).toBe(201);
      expect(response.headers()['content-type']).toContain('application/json');

      const createdPost = await response.json();
      expect(createdPost.title).toBe(newPost.title);
      expect(createdPost.body).toBe(newPost.body);
      expect(createdPost.userId).toBe(newPost.userId);
      expect(createdPost).toHaveProperty('id');
      expect(typeof createdPost.id).toBe('number');
      expect(createdPost.id).toBe(101); // JSONPlaceholder returns 101 for new posts
    });

    test('should handle post creation with minimal data', async ({ request }) => {
      const minimalPost = {
        title: 'Minimal Post',
        userId: 2
      };

      const response = await request.post(`${BASE_URL}/posts`, {
        data: minimalPost,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      expect(response.status()).toBe(201);
      
      const createdPost = await response.json();
      expect(createdPost.title).toBe(minimalPost.title);
      expect(createdPost.userId).toBe(minimalPost.userId);
      expect(createdPost).toHaveProperty('id');
    });

    test('should handle empty post creation', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/posts`, {
        data: {},
        headers: {
          'Content-Type': 'application/json'
        }
      });

      expect(response.status()).toBe(201);
      
      const createdPost = await response.json();
      expect(createdPost).toHaveProperty('id');
    });

    test('should handle post creation with extra fields', async ({ request }) => {
      const postWithExtra = {
        title: 'Post with Extra Fields',
        body: 'Post body',
        userId: 1,
        extraField: 'This should be ignored',
        anotherExtra: 123
      };

      const response = await request.post(`${BASE_URL}/posts`, {
        data: postWithExtra,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      expect(response.status()).toBe(201);
      
      const createdPost = await response.json();
      expect(createdPost.title).toBe(postWithExtra.title);
      expect(createdPost.body).toBe(postWithExtra.body);
      expect(createdPost.userId).toBe(postWithExtra.userId);
    });
  });

  test.describe('PUT /posts/{id}', () => {
    test('should update a post completely with PUT', async ({ request }) => {
      const postId = 1;
      const updatedPost = {
        id: postId,
        title: 'Updated Post Title',
        body: 'This is the updated post body.',
        userId: 2
      };

      const response = await request.put(`${BASE_URL}/posts/${postId}`, {
        data: updatedPost,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('application/json');

      const returnedPost = await response.json();
      expect(returnedPost.id).toBe(postId);
      expect(returnedPost.title).toBe(updatedPost.title);
      expect(returnedPost.body).toBe(updatedPost.body);
      expect(returnedPost.userId).toBe(updatedPost.userId);
    });

    test('should handle PUT with missing fields', async ({ request }) => {
      const postId = 2;
      const partialUpdate = {
        title: 'Only Title Updated'
      };

      const response = await request.put(`${BASE_URL}/posts/${postId}`, {
        data: partialUpdate,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      expect(response.status()).toBe(200);
      
      const returnedPost = await response.json();
      expect(returnedPost.id).toBe(postId);
      expect(returnedPost.title).toBe(partialUpdate.title);
    });

    test('should handle PUT for non-existent post', async ({ request }) => {
      const nonExistentId = 999;
      const updatedPost = {
        id: nonExistentId,
        title: 'Non-existent Post',
        body: 'This post does not exist.',
        userId: 1
      };

      const response = await request.put(`${BASE_URL}/posts/${nonExistentId}`, {
        data: updatedPost,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      expect(response.status()).toBe(500);
    });
  });

  test.describe('PATCH /posts/{id}', () => {
    test('should partially update a post with PATCH', async ({ request }) => {
      const postId = 1;
      const partialUpdate = {
        title: 'Partially Updated Title'
      };

      const response = await request.patch(`${BASE_URL}/posts/${postId}`, {
        data: partialUpdate,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('application/json');

      const returnedPost = await response.json();
      expect(returnedPost.id).toBe(postId);
      expect(returnedPost.title).toBe(partialUpdate.title);
      // Other fields should remain (though JSONPlaceholder is a mock API)
      expect(returnedPost).toHaveProperty('body');
      expect(returnedPost).toHaveProperty('userId');
    });

    test('should update multiple fields with PATCH', async ({ request }) => {
      const postId = 3;
      const multiFieldUpdate = {
        title: 'Updated Title via PATCH',
        body: 'Updated body content via PATCH'
      };

      const response = await request.patch(`${BASE_URL}/posts/${postId}`, {
        data: multiFieldUpdate,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      expect(response.status()).toBe(200);
      
      const returnedPost = await response.json();
      expect(returnedPost.id).toBe(postId);
      expect(returnedPost.title).toBe(multiFieldUpdate.title);
      expect(returnedPost.body).toBe(multiFieldUpdate.body);
    });

  
  });

  test.describe('DELETE /posts/{id}', () => {
    test('should delete a post successfully', async ({ request }) => {
      const postId = 1;
      
      const response = await request.delete(`${BASE_URL}/posts/${postId}`);

      expect(response.status()).toBe(200);
      
      // JSONPlaceholder returns an empty object on successful deletion
      const responseBody = await response.json();
      expect(responseBody).toEqual({});
    });

    test('should handle deletion of non-existent post', async ({ request }) => {
      const nonExistentId = 777;
      
      const response = await request.delete(`${BASE_URL}/posts/${nonExistentId}`);

      expect(response.status()).toBe(200);
      
      const responseBody = await response.json();
      expect(responseBody).toEqual({});
    });

    test('should delete multiple posts', async ({ request }) => {
      const postIds = [5, 10, 15];
      
      for (const id of postIds) {
        const response = await request.delete(`${BASE_URL}/posts/${id}`);
        expect(response.status()).toBe(200);
        
        const responseBody = await response.json();
        expect(responseBody).toEqual({});
      }
    });

    test('should handle invalid post ID in delete request', async ({ request }) => {
      const response = await request.delete(`${BASE_URL}/posts/invalid-id`);
      
      expect(response.status()).toBe(200);
      
      const responseBody = await response.json();
      expect(responseBody).toEqual({});
    });
  });

  test.describe('Edge Cases and Error Handling', () => {
  

    test('should handle missing Content-Type header', async ({ request }) => {
      const newPost = {
        title: 'No Content-Type Header',
        body: 'Testing without content type',
        userId: 1
      };

      const response = await request.post(`${BASE_URL}/posts`, {
        data: newPost
        // No Content-Type header
      });

      expect(response.status()).toBe(201);
    });

    test('should verify response times are reasonable', async ({ request }) => {
      const startTime = Date.now();
      
      const response = await request.get(`${BASE_URL}/posts`);
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      expect(response.status()).toBe(200);
      expect(responseTime).toBeLessThan(5000); // Should respond within 5 seconds
    });

    test('should handle concurrent requests', async ({ request }) => {
      const requests = [];
      
      // Create 5 concurrent requests
      for (let i = 1; i <= 5; i++) {
        requests.push(request.get(`${BASE_URL}/posts/${i}`));
      }
      
      const responses = await Promise.all(requests);
      
      responses.forEach((response, index) => {
        expect(response.status()).toBe(200);
      });
    });
  });
});