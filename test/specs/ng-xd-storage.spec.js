/**
 * Created by Ofir_Dagan on 4/24/15.
 */
describe('xdStorage test', function () {

  beforeEach(function () {
    module('xdStorage')
  });

  afterEach(inject(function (xdStorage) {
    xdStorage.local.clear();
  }));


  it('should get item after init', function (done) {
    inject(function (xdStorage) {
      var spy = jasmine.createSpy();
      xdStorage.init({
        iframeUrl: 'base/app/views/cross-domain-storage.html'
      }).then(function () {
        spy();
      });
      xdStorage.local.setItem('myLocalKey', 1).then(function () {
        xdStorage.local.getItem('myLocalKey').then(function (response) {
          expect(response.value).toBe('1');
          expect(spy).toHaveBeenCalled();
          done();
        })
      });
      xdStorage.session.setItem('mySessionKey', 1).then(function () {
        xdStorage.session.getItem('mySessionKey').then(function (response) {
          expect(response.value).toBe('1');
          expect(spy).toHaveBeenCalled();
          done();
        })
      });
    });
  });

});