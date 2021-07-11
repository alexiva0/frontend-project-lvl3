const render = (state) => {
  const header = document.createElement('h1');
  header.textContent = state.header;
  document.body.append(header);
};

const app = () => {
  const state = {
    header: 'Hello world!',
  };

  render(state);
};

export default app;
