import app from '../src/app';

test('app', () => {
  app();
  const header = document.querySelector('h1');
  expect(header).toBeInTheDocument();
  expect(header).toContainHTML('Hello world');
});
