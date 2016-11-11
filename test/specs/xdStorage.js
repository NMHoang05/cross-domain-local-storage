/**
 * Created by Ofir_Dagan on 4/17/14.
 */
'use strict';

describe('xdStorage test', function () {

  var service;

  beforeEach(function () {
    xdStorage.local.clear();
    xdStorage.session.clear();
  });

  // local
  it('should set value to local storage', function (done) {
    xdStorage.local.setItem('itemKey', 'value', function (res) {
      expect(res.success).toBe(true);
      done();
    });
  });


  it('should get value to local storage', function (done) {
    xdStorage.local.getItem('itemKey', function (res) {
      expect(res.value).toBe(null);
      xdStorage.local.setItem('itemKey', 'value', function () {
        xdStorage.local.getItem('itemKey', function (res) {
          expect(res.value).toBe('value');
          done();
        })
      });
    });
  });

  it('should clear all values after clear is called', function (done) {
    xdStorage.local.setItem('itemKey', 'value', function () {
      xdStorage.local.setItem('itemKey2', 'value2', function () {
        xdStorage.local.getItem('itemKey', function (res) {
          expect(res.value).toBe('value');
          xdStorage.local.getItem('itemKey2', function (res) {
            expect(res.value).toBe('value2');
            xdStorage.local.clear(function () {
              xdStorage.local.getItem('itemKey', function (res) {
                expect(res.value).toBe(null);
                xdStorage.local.getItem('itemKey2', function (res) {
                  expect(res.value).toBe(null);
                  done();
                });
              });
            });
          });
        });
      });
    });
  });

  it('should remove value from local storage', function (done) {
    xdStorage.local.setItem('itemKey', 'value', function () {
      xdStorage.local.getItem('itemKey', function (res) {
        expect(res.value).toBe('value');
        xdStorage.local.removeItem('itemKey', function () {
          xdStorage.local.getItem('itemKey', function (res) {
            expect(res.value).toBe(null);
            done();
          });
        });
      })
    });
  });

  it('should return key name when calling key() with right key index ', function (done) {
    xdStorage.local.setItem('itemKey', 'value', function () {
      xdStorage.local.key(0, function (res) {
        expect(res.key).toBe('itemKey');
        done();
      });
    });
  });

  it('should return the size of local storage', function (done) {
    var dummyLocalStorage = {itemKey: 'value'};
    xdStorage.local.setItem('itemKey', 'value', function () {
      xdStorage.local.getSize(function (res) {
        expect(res.size).toBe(JSON.stringify(dummyLocalStorage).length);
        done();
      });
    });
  });

  it('should return the number of keys of local storage', function (done) {
    xdStorage.local.setItem('itemKey', 'value', function () {
      xdStorage.local.setItem('itemKey2', 'value2', function () {
        xdStorage.local.getLength(function (res) {
          expect(res.length).toBe(2);
          xdStorage.local.removeItem('itemKey', function () {
            xdStorage.local.getLength(function (res) {
              expect(res.length).toBe(1);
              done();
            });
          });
        });
      });
    });
  });

  // session

  it('should set value to session storage', function (done) {
    xdStorage.session.setItem('itemKey', 'value', function (res) {
      expect(res.success).toBe(true);
      done();
    });
  });


  it('should get value to session storage', function (done) {
    xdStorage.session.getItem('itemKey', function (res) {
      expect(res.value).toBe(null);
      xdStorage.session.setItem('itemKey', 'value', function () {
        xdStorage.session.getItem('itemKey', function (res) {
          expect(res.value).toBe('value');
          done();
        })
      });
    });
  });

  it('should clear all values after clear is called', function (done) {
    xdStorage.session.setItem('itemKey', 'value', function () {
      xdStorage.session.setItem('itemKey2', 'value2', function () {
        xdStorage.session.getItem('itemKey', function (res) {
          expect(res.value).toBe('value');
          xdStorage.session.getItem('itemKey2', function (res) {
            expect(res.value).toBe('value2');
            xdStorage.session.clear(function () {
              xdStorage.session.getItem('itemKey', function (res) {
                expect(res.value).toBe(null);
                xdStorage.session.getItem('itemKey2', function (res) {
                  expect(res.value).toBe(null);
                  done();
                });
              });
            });
          });
        });
      });
    });
  });

  it('should remove value from session storage', function (done) {
    xdStorage.session.setItem('itemKey', 'value', function () {
      xdStorage.session.getItem('itemKey', function (res) {
        expect(res.value).toBe('value');
        xdStorage.session.removeItem('itemKey', function () {
          xdStorage.session.getItem('itemKey', function (res) {
            expect(res.value).toBe(null);
            done();
          });
        });
      })
    });
  });

  it('should return key name when calling key() with right key index ', function (done) {
    xdStorage.session.setItem('itemKey', 'value', function () {
      xdStorage.session.key(0, function (res) {
        expect(res.key).toBe('itemKey');
        done();
      });
    });
  });

  it('should return the size of session storage', function (done) {
    var dummyLocalStorage = {itemKey: 'value'};
    xdStorage.session.setItem('itemKey', 'value', function () {
      xdStorage.session.getSize(function (res) {
        expect(res.size).toBe(JSON.stringify(dummyLocalStorage).length);
        done();
      });
    });
  });

  it('should return the number of keys of session storage', function (done) {
    xdStorage.session.setItem('itemKey', 'value', function () {
      xdStorage.session.setItem('itemKey2', 'value2', function () {
        xdStorage.session.getLength(function (res) {
          expect(res.length).toBe(2);
          xdStorage.session.removeItem('itemKey', function () {
            xdStorage.session.getLength(function (res) {
              expect(res.length).toBe(1);
              done();
            });
          });
        });
      });
    });
  });
});
