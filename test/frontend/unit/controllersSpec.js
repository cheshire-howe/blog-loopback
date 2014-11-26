/* global expect */
/* global spyOn */
'use strict';

describe('Blog controllers', function() {
    
  var scope, ctrl, $httpBackend, $stateParams, Post;
  
  var url = '/api/Posts';
  
  var mockData = [
    {
      title: "Blog title first",
      content: "Blog content"
    },
    {
      title: "Blog title second",
      content: "Blog content second"
    }
  ];
  
  beforeEach(function() {
    this.addMatchers({
      toEqualData: function(expected) {
        return angular.equals(this.actual, expected);
      }
    });
  });
  
  beforeEach(module('blogApp'));
  beforeEach(module('lbServices'));
  
  beforeEach(inject(function(_$httpBackend_, $rootScope) {
      $httpBackend = _$httpBackend_;
      scope = $rootScope.$new();
  }));
  
  describe('PostCtrl', function() {
    
    beforeEach(inject(function($controller) {
      $httpBackend.expectGET(url)
        .respond(mockData);
      ctrl = $controller('PostCtrl', { $scope: scope });
    }));
    
    
    it('should fetch 2 posts from xhr', function() {
      expect(scope.posts).toEqualData([]);
      
      $httpBackend.flush();
      expect(scope.posts).toEqualData([
        {
          title: "Blog title first",
          content: "Blog content"
        },
        {
          title: "Blog title second",
          content: "Blog content second"
        }
      ]);
    });
    
    it('should return them in order', function() {
      $httpBackend.flush();
      
      expect(scope.posts[0].title).toEqual("Blog title first");
      expect(scope.posts[1].title).toEqual("Blog title second");
    });
    
  });

  
  describe('PostCreateCtrl', function() {
    
    var mockPostData = {title: 'One', content: 'One'};
    
    beforeEach(inject(function($controller, _Post_) {
      Post = _Post_;
      
      ctrl = $controller('PostCreateCtrl', {
        $scope: scope, Post: Post
      });
    }));
    
    it('should send post data to the server', function() {
      // .expectPOST(url, expectedInput) needs the correct input
      // when mockPostData is the second argument
      $httpBackend.expectPOST(url, mockPostData)
        .respond(mockData.push(mockPostData));
      $httpBackend.expectGET('js/blog/templates/posts.html')
        .respond('');
      
      scope.newPost = mockPostData;
      scope.addPost();
      $httpBackend.flush();
      
      expect(mockData.length).toBe(3);
    });
    
    it('should trigger Post.create', function() {
      spyOn(Post, 'create').andCallThrough();
      
      scope.addPost();
      expect(Post.create).toHaveBeenCalled();
    });
    
    it('should make xhr request on success', function() {
      $httpBackend.expectGET('js/blog/templates/posts.html')
        .respond('');
      
      $httpBackend.flush();
    });
    
  });
  
  describe('PostDetailCtrl', function() {
    
    var detailUrl = '/api/Posts/1';
    
    var singleMockData = {
      title: 'One',
      id: 1,
      content: 'One'
    };
      
    var stateParams = {
      id: 1
    };
    
    beforeEach(inject(function($controller, _Post_) {
      
      Post = _Post_;
      
      ctrl = $controller('PostDetailCtrl', {
        $scope: scope,
        $stateParams: stateParams,
        Post: Post
      });
      
      $httpBackend.expectGET(detailUrl)
        .respond(singleMockData);
      $httpBackend.expectGET(detailUrl + '/comments')
        .respond('');
    }));
    
    it('should get a single blog post', function() {
      $httpBackend.expectGET('js/blog/templates/posts.html')
        .respond('');
      expect(scope.post).toEqualData({});
      $httpBackend.flush();
      expect(scope.post).toEqualData(singleMockData);
    });
    
    it('should delete the blog post by id and redirect', function() {
      $httpBackend.expectDELETE(detailUrl)
        .respond(204);
      $httpBackend.expectGET('js/blog/templates/posts.html')
        .respond('');
      
      scope.deletePost(stateParams.id);
      $httpBackend.flush();
    });
    
  });
  
  
  describe('PostEditCtrl', function() {
    
    var putUrl = '/api/Posts?id=1';
    var getUrl = '/api/Posts/1';
    
    beforeEach(inject(function($controller, _Post_) {
      
      Post = _Post_;
    
      var stateParams = {
        id: 1
      };
      
      var initialPutData = {
        title: 'One',
        id: 1,
        content: 'One'
      };
      
      ctrl = $controller('PostEditCtrl', {
        $scope: scope,
        $stateParams: stateParams,
        Post: Post
      });
      
      $httpBackend.expectGET(getUrl)
        .respond(initialPutData);
    }));
    
    it('should send post data to the server', function() {
      var editedPutData = new Post({
        title: 'Two',
        id: 1,
        content: 'One'
      });
      
      $httpBackend.expectPUT(putUrl, editedPutData)
        .respond(editedPutData);
      $httpBackend.expectGET('js/blog/templates/posts.html')
        .respond('');
      
      scope.newPost = editedPutData;
      scope.editPost();
      $httpBackend.flush();
    });
    
  });
});
