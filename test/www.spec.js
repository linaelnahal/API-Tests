process.env.NODE_ENV = 'test';

import chai from 'chai';
import chaiHttp from 'chai-http';
import { server, normalizePort, onError } from '../bin/www';

const { expect } = chai;

chai.use(chaiHttp);

describe('WWW server', () => {
  describe('NormalizePort Function', () => {
    beforeAll(() => {
      process.env.NODE_ENV = 'test';
    });

    afterAll(() => {
      process.env.NODE_ENV = 'default';
    });

    it('should return the default port when no argument is passed', () => {
      const port = normalizePort();
      expect(port).to.be.a('number');
      expect(port).to.equal(3001); // Make sure this matches your default
    });

    it('should return false for invalid port', () => {
      const port = normalizePort(-3001);
      expect(port).to.equal(false);
    });

    it('should return number for valid port', () => {
      const port = normalizePort('4500');
      expect(port).to.be.a('number');
      expect(port).to.equal(4500);
    });

    it('should return input string for non-numeric input', () => {
      const port = normalizePort('isNaN');
      expect(port).to.equal('isNaN');
    });
  });

  describe('OnError Function', () => {
    it('should throw exception for unknown syscall', () => {
      let error;
      try {
        onError({ syscall: 'isNotSyscall' });
      } catch (err) {
        error = err; // Capture the error
      }
      expect(error).to.be.an('error');
      expect(error.syscall).to.equal('isNotSyscall');
    });

    it('should throw an error for EADDRINUSE', () => {
      let error;
      try {
        onError({ syscall: 'listen', code: 'EADDRINUSE' });
      } catch (err) {
        error = err; // Capture the error
      }
      expect(error).to.be.an('error');
      expect(error.message).to.equal('Port 3001 is already in use'); // Adjust the message as needed
    });

    it('should catch default error', () => {
      let error;
      try {
        onError({ syscall: 'listen', code: 'Default' });
      } catch (err) {
        error = err; // Capture the error
      }
      expect(error).to.be.an('error');
      expect(error.code).to.equal('Default');
    });
  });
});
