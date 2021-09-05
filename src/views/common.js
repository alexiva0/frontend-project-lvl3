const createHeader = (text) => {
  const containerEl = document.createElement('div');
  containerEl.classList.add('card-body');
  const headerEl = document.createElement('h2');
  headerEl.classList.add('card-title', 'h4');
  headerEl.textContent = text;
  containerEl.append(headerEl);
  return containerEl;
};

const createList = (items, createListItem) => {
  const listEl = document.createElement('ul');
  listEl.classList.add('list-group', 'border-0', 'rounded-0');

  items.forEach((item) => {
    const listItemEl = createListItem(item);
    listEl.append(listItemEl);
  });

  return listEl;
};

export { createHeader, createList };
