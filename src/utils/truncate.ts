type Options = {
  length?: number;
  ending?: string;
};

type Truncate = (str: string, opt?: Options) => string;

const truncate: Truncate = (str, options = {}) => {
  const { length = 10, ending = "..." } = options;

  return (str.length <= length) ? str : str.slice(0, length) + ending;
}

export { truncate };
