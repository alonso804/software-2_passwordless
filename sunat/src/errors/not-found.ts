import BaseError from './base-error';

class NotFound extends BaseError {
  constructor(model: 'server' | 'user', id: string) {
    super(400, `${model} with id <${id}> not found`);
  }
}

export default NotFound;
