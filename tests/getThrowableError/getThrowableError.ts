import { expect } from 'chai';

import { ThrowableError, getThrowableError } from '../../src/index';

const simpleErrorTests = (
  ErrClass: any,
  errorName: string,
  parentName = 'ThrowableError',
) => {
  it('should return errors with proper "constructor.name"', () => {
    const err = new ErrClass('test');
    expect(err.constructor.name).to.equal(parentName);
  });

  it('should return errors with proper "name"', () => {
    const err = new ErrClass('test');
    expect(err.name).to.equal(errorName);
  });

  it('should return errors with proper "message"', () => {
    const err = new ErrClass('test');
    expect(err.message).to.equal('test');
  });

  it('should return errors meeting "instanceof ThrowableError"', () => {
    const err = new ErrClass('test');
    expect(err instanceof ThrowableError).to.equal(true);
  });

  it('should return errors meeting "instanceof TestErrClass"', () => {
    const err = new ErrClass('test');
    expect(err instanceof ErrClass).to.equal(true);
  });

  it('should return errors meeting "instanceof Error"', () => {
    const err = new ErrClass('test');
    expect(err instanceof Error).to.equal(true);
  });
};

describe('getThrowableError', () => {
  const TestErrClass = getThrowableError('TestError');

  const ChildTestErrClass = getThrowableError('ChildTestError', {
    extendFrom: TestErrClass,
  });

  const ChildChildTestErrClass = getThrowableError('ChildChildTestError', {
    extendFrom: ChildTestErrClass,
  });

  describe(' # simple error', () => {
    simpleErrorTests(TestErrClass, 'TestError');
  });

  describe(' # inherited error', () => {
    simpleErrorTests(ChildTestErrClass, 'ChildTestError', 'TestError');

    it('should return errors meeting "instanceof parent class"', () => {
      const err = new ChildTestErrClass('test');
      expect(err instanceof TestErrClass).to.equal(true);
    });
  });

  describe(' # multiple inherited error', () => {
    simpleErrorTests(
      ChildChildTestErrClass,
      'ChildChildTestError',
      'ChildTestError',
    );

    it('should return errors meeting "instanceof parent class"', () => {
      const err = new ChildChildTestErrClass('test');
      expect(err instanceof ChildTestErrClass).to.equal(true);
    });

    it('should return errors meeting "instanceof parent-parent class"', () => {
      const err = new ChildChildTestErrClass('test');
      expect(err instanceof TestErrClass).to.equal(true);
    });
  });
});
