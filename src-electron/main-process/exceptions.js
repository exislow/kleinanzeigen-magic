export class RemoteSystemError extends Error {
  constructor(args){
    super(args);
    this.name = 'RemoteSystemError';
  }
}

export class AxiosError extends Error {
  constructor(args){
    super(args);
    this.name = 'AxiosError';
  }
}

export class AttributeError extends Error {
  constructor(args){
    super(args);
    this.name = 'AttributeError';
  }
}

export class AuthorizationError extends Error {
  constructor(args){
    super(args);
    this.name = 'AuthorizationError';
  }
}

export class RemoteNotFound extends Error {
  constructor(args){
    super(args);
    this.name = 'RemoteNotFound';
  }
}
