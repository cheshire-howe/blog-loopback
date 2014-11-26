/* global expect */
/* global spyOn */
'use strict';

describe('Blog controllers', function() {
    
  var scope, state, ctrl, $httpBackend, $stateParams, Post;
  
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
  beforeEach(module('stateMock'));
  
  beforeEach(inject(function(_$httpBackend_, $rootScope, $state) {
    $httpBackend = _$httpBackend_;
    scope = $rootScope.$new();
    state = $state;
  }));
  
  describe('PostCtrl', function() {
  
    var url = '/api/Posts';
    
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
  
    var url = '/api/Posts';
    
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
      $httpBackend.expectPOST(url, mockPostData)
        .respond(mockData.push(mockPostData));
      scope.newPost = mockPostData;
      scope.addPost();
      $httpBackend.flush();
      state.expectTransitionTo('blog');
    });
    
  });
  
  describe('PostDetailCtrl', function() {
    
    var detailUrl = '/api/Posts/1';
    
    var singleMockData = {
      title: 'One',
      id: 1,
      content: 'One'
    };
    
    var commentMockData = [
      {
        id: 1,
        postId: 1,
        content: "Hello"
      },
      {
        id: 2,
        postId: 1,
        content: "World"
      }
    ];
    
    var newCommentMockData = {
      content: "Foo"
    };
      
    var stateParams = {
      id: 1
    };
    
    var mockCommentForm = {
      $setPristine: function() {}
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
        .respond(commentMockData);
    }));
    
    it('should get a single blog post', function() {
      expect(scope.post).toEqualData({});
      $httpBackend.flush();
      expect(scope.post).toEqualData(singleMockData);
    });
    
    it('should delete the blog post by id and redirect', function() {
      $httpBackend.expectDELETE(detailUrl)
        .respond(204);
      
      scope.deletePost(stateParams.id);
      state.expectTransitionTo('blog');
    });
    
    it('should get all the comments', function() {
      $httpBackend.flush();
      expect(scope.comments.length).toEqual(2);
    });
    
    it('should send a new comment to the server ' +
       'and addComment() should do its thing', function() {
      $httpBackend.expectPOST(detailUrl + '/comments', newCommentMockData)
        .respond(newCommentMockData);
      $httpBackend.expectGET(detailUrl + '/comments')
        .respond(commentMockData);
      
      scope.commentForm = mockCommentForm;
      scope.post.id = 1;
      scope.newComment = newCommentMockData;
      scope.addComment();
      $httpBackend.flush();
      state.ensureAllTransitionsHappened();
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
      
      scope.newPost = editedPutData;
      scope.editPost();
      state.expectTransitionTo('blog');
      $httpBackend.flush();
      state.ensureAllTransitionsHappened();
    });
    
  });
});
