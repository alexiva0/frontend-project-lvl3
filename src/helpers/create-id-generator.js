const createIdGenerator = () => {
  let idCounter = 1;

  return () => {
    const id = idCounter;
    idCounter += 1;
    return id;
  };
};

export default createIdGenerator;
