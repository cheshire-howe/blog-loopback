/* global expect */
/* global spyOn */
'use strict';

describe('Blog controllers', function() {
    
  var scope, state, ctrl, $httpBackend, $stateParams, Post;
  
  var mockData = {
    posts: [
      {
        title: "Blog title first",
        content: "Blog content"
      },
      {
        title: "Blog title second",
        content: "Blog content second"
      }
    ]
  };
  
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
  beforeEach(module('xeditable'));
  
  beforeEach(inject(function(_$httpBackend_, $rootScope, $state) {
    $httpBackend = _$httpBackend_;
    scope = $rootScope.$new();
    state = $state;
  }));
  
  describe('PostCtrl', function() {
  
    var url = '/api/Posts/findAll';
    
    beforeEach(inject(function($controller) {
      $httpBackend.expectGET(url)
        .respond(mockData);
      ctrl = $controller('PostCtrl', {});
    }));
    
    
    it('should fetch 2 posts from xhr', function() {
      expect(ctrl.posts).toEqualData([]);
      
      $httpBackend.flush();
      expect(ctrl.posts).toEqualData([
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
      
      expect(ctrl.posts[0].title).toEqual("Blog title first");
      expect(ctrl.posts[1].title).toEqual("Blog title second");
    });
    
  });

  
  describe('PostCreateCtrl', function() {
  
    var url = '/api/Posts';
    
    var mockPostData = {title: 'One', content: 'One', userId: 1};
    var mockPostResonseData = mockData.posts;
    
    beforeEach(inject(function($controller, _Post_) {
      Post = _Post_;
      
      ctrl = $controller('PostCreateCtrl', {
        Post: Post
      });
    }));
    
    it('should send post data to the server', function() {
      // .expectPOST(url, expectedInput) needs the correct input
      // when mockPostData is the second argument
      $httpBackend.expectPOST(url, mockPostData)
        .respond(mockPostResonseData.push(mockPostData));
      
      ctrl.newPost = mockPostData;
      ctrl.addPost();
      $httpBackend.flush();
      
      expect(mockPostResonseData.length).toBe(3);
    });
    
    it('should trigger Post.create', function() {      
      spyOn(Post, 'create').andCallThrough();
      
      ctrl.newPost = mockPostData;
      ctrl.addPost();
      expect(Post.create).toHaveBeenCalled();
    });
    
    it('should make xhr request on success', function() {
      $httpBackend.expectPOST(url, mockPostData)
        .respond(mockPostResonseData.push(mockPostData));
      ctrl.newPost = mockPostData;
      ctrl.addPost();
      $httpBackend.flush();
      state.expectTransitionTo('blog');
    });
    
  });
  
  describe('PostDetailCtrl', function() {
    
    var detailUrl = '/api/Posts/1/findSingle';
    
    var singleMockData = {
      title: 'One',
      id: 1,
      content: 'One'
    };
    
    var singleMockResponseData = {
      post: {
        title: 'One',
        id: 1,
        content: 'One'
      }
    };
    
    var commentMockData = [
      {
        id: 1,
        postId: 1,
        content: "Hello",
        userId: 1
      },
      {
        id: 2,
        postId: 1,
        content: "World",
        userId: 1
      }
    ];
    
    var newCommentMockData = {
      content: "Foo"
    };
    
    var editCommentMockData = {
      content: "Bar"
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
        .respond(singleMockResponseData);
      /*$httpBackend.expectGET(commentsUrl)
        .respond(commentMockData);*/
    }));
    
    it('should get a single blog post', function() {
      expect(ctrl.post).toEqualData({});
      $httpBackend.flush();
      expect(ctrl.post).toEqualData(singleMockData);
    });
    
    it('should delete the blog post by id and redirect', function() {
      $httpBackend.expectDELETE(detailUrl)
        .respond(204);
      
      ctrl.deletePost(stateParams.id);
      state.expectTransitionTo('blog');
    });
    
    /*it('should get all the comments', function() {
      $httpBackend.flush();
      expect(scope.comments.length).toEqual(2);
    });
    
    it('should send a new comment to the server ' +
       'and addComment() should do its thing', function() {
      $httpBackend.expectPOST(commentsUrl, newCommentMockData)
        .respond(newCommentMockData);
      $httpBackend.expectGET(commentsUrl)
        .respond(commentMockData);
      
      scope.commentForm = mockCommentForm;
      scope.post.id = 1;
      scope.newComment = newCommentMockData;
      scope.addComment();
      $httpBackend.flush();
    });
    
    it('should send a PUT request to the server', function() {
      $httpBackend.expectPUT(commentsUrl + '/' + commentMockData[0].id)
        .respond('');
      
      scope.post.id = singleMockData.id;
      scope.editComment(editCommentMockData, commentMockData[0].id);
      $httpBackend.flush();
    });
    
    it('should send a DELETE request and refresh comments', function() {
      $httpBackend.expectDELETE(commentsUrl + '/' + commentMockData[0].id)
        .respond(204);
      $httpBackend.expectGET(commentsUrl)
        .respond('');
      
      scope.post.id = singleMockData.id;
      scope.deleteComment(commentMockData[0].id);
      $httpBackend.flush();
    });*/
    
  });
  
  
  describe('PostEditCtrl', function() {
    
    var putUrl = '/api/users/1/posts/1';
    var getUrl = '/api/Posts/1/findSingle';
    
    beforeEach(inject(function($controller, _Post_) {
      
      Post = _Post_;
    
      var stateParams = {
        id: 1
      };
      
      var initialPutData = {
        title: 'One',
        content: 'One'
      };
      
      ctrl = $controller('PostEditCtrl', {
        $stateParams: stateParams,
        Post: Post
      });
      
      $httpBackend.expectGET(getUrl)
        .respond(initialPutData);
    }));
    
    it('should send post data to the server', function() {
      var editedPutData = new Post({
        title: 'Two',
        content: 'One'
      });
      
      $httpBackend.expectPUT(putUrl, editedPutData)
        .respond(editedPutData);
      state.expectTransitionTo('postDetail');
      
      ctrl.userId = 1;
      ctrl.editPost(editedPutData);
      
      $httpBackend.flush();
      state.ensureAllTransitionsHappened();
    });
    
  });
  
  describe('UserRegisterCtrl', function() {
    var urlUsers, mockResponseUserData, User;
    var mockUserData = {
      email: 'josh@gmail.com',
      password: 'foobar'
    };
    
    beforeEach(inject(function($controller, _User_) {
      User = _User_;
      urlUsers = '/api/users';
      mockResponseUserData = {
        email: 'josh@gmail.com',
        id: 1
      };
      
      ctrl = $controller('UserRegisterCtrl', {
        User: User
      });
    }));
    
    it('should send the data to create a user' +
       'and log the user in', function() {
      $httpBackend.expectPOST(urlUsers, mockUserData)
        .respond(mockResponseUserData);
      $httpBackend.expectPOST(urlUsers + '/login?include=user')
        .respond(mockUserData);
      state.expectTransitionTo('blog');
      
      ctrl.newUser = mockUserData;
      ctrl.register();
      
      $httpBackend.flush();
    });
  });
  
  describe('UserLoginCtrl', function() {
    var urlUsers, mockUserData, User;
    
    beforeEach(inject(function($controller, _User_) {
      User = _User_;
      urlUsers = '/api/users';
      mockUserData = {
        email: 'josh@gmail.com',
        password: 'foobar'
      };
      
      ctrl = $controller('UserLoginCtrl', {
        User: User
      });
    }));
    
    it('should log a user in', function() {
      $httpBackend.expectPOST(urlUsers + '/login?include=user')
        .respond(mockUserData);
      state.expectTransitionTo('blog');
      
      ctrl.user = mockUserData;
      ctrl.login();
      
      $httpBackend.flush();
    });
    
  });
  
});
