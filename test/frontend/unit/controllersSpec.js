/* global expect */
/* global spyOn */
'use strict';

describe('Blog controllers', function() {
    
  var scope, ctrl, $httpBackend, Post;
  
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
  
  describe('BlogCtrl', function() {
    
    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET(url)
        .respond(mockData);
      
      scope = $rootScope.$new();
      ctrl = $controller('BlogCtrl', { $scope: scope });
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
    
    beforeEach(inject(function(_$httpBackend_,
                                $rootScope,
                                $controller,
                                _Post_) {
      $httpBackend = _$httpBackend_;
      Post = _Post_;
      
      scope = $rootScope.$new();
      ctrl = $controller('PostCreateCtrl', {
        $scope: scope, Post: Post
      });
    }));
    
    it('should send post data to the server', function() {
      $httpBackend.expectPOST(url, mockPostData)
        .respond(mockData.push(mockPostData));
      
      scope.newPost = mockPostData;
      scope.addPost();
      
      expect(mockData.length).toBe(3);
    });
    
    it('should trigger Post.create', function() {
      spyOn(Post, 'create').andCallThrough();
      
      scope.addPost();
      expect(Post.create).toHaveBeenCalled();
    });
    
    it('should make xhr request on success', function() {
      $httpBackend.expectGET('js/blog/templates/blog.html')
        .respond('<html></html>');
      
      $httpBackend.flush();
    });
    
  });
});
