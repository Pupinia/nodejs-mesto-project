import NotFoundError from '../errors/not-found-err';

export default () => {
  throw new NotFoundError('Роут не найден');
};
