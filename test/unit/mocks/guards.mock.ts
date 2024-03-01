export interface ExecutionContextMock {
  getType: jest.Mock<any, any>;
  switchToHttp: jest.Mock<any, any>;
  getRequest: jest.Mock<any, any>;
  getClass: jest.Mock<any, any>;
  getHandler: jest.Mock<any, any>;
  getArgs: jest.Mock<any, any>;
  getArgByIndex: jest.Mock<any, any>;
  switchToRpc: jest.Mock<any, any>;
  switchToWs: jest.Mock<any, any>;
}

/**
 * creates a mock object for ExecutionContext
 */
export const buildExecutionContextMock = (): ExecutionContextMock => ({
  getType: jest.fn(),
  switchToHttp: jest.fn().mockReturnThis(),
  getRequest: jest.fn(),
  getClass: jest.fn(),
  getHandler: jest.fn(),
  getArgs: jest.fn(),
  getArgByIndex: jest.fn(),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
});
