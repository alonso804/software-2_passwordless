import BaseError from './base-error';

class NoPublcKey extends BaseError {
  constructor(id: string) {
    super(400, `Server with id <${id}> does not have a public key`);
  }
}

export default NoPublcKey;
