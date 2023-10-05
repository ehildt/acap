type Langkify = {
  [k: string]: Array<string>;
};

function valueReducer(str: string) {
  const whiteSpaces = str.includes(' ');
  return str
    .split('')
    .filter((char) => char.match(/[A-Z]/))
    .reduce((acc, char) => (whiteSpaces ? acc : acc.replaceAll(char, `.${char.toLocaleLowerCase()}`)), str);
}

function keyReducer(str: string) {
  const capital = str.charAt(0).match(/[A-Z]/);
  return str
    .split('')
    .filter((char) => char.match(/[A-Z]/))
    .reduce(
      (acc, char) =>
        capital
          ? acc.replace(char, `${char.toLocaleLowerCase()}`)
          : acc.replaceAll(char, `.${char.toLocaleLowerCase()}`),
      str,
    );
}

function spaceReducer(key: string) {
  return `${key.charAt(0).toLocaleLowerCase()}${key.slice(1)}`
    .split(' ')
    .reduce((acc, val) => `${acc}${val.charAt(0).toLocaleUpperCase()}${val.substring(1)}`);
}

function dictionaryReducer(str: string) {
  return (prev: Record<string, unknown>, key: string) => ({
    ...prev,
    [spaceReducer(key)]: `${keyReducer(str)}.${valueReducer(key)}`,
  });
}

function rootReducer() {
  return (prev: Record<string, unknown>, key: string) => ({
    ...prev,
    [spaceReducer(key)]: valueReducer(key),
  });
}

export function langkify<T = Record<string, any>>(...args: Array<Langkify | Array<string>>): T {
  return args.reduce(
    (acc, arg: Langkify | Array<string>) => ({
      ...acc,
      ...(Array.isArray(arg)
        ? arg.reduce(rootReducer(), {})
        : Object.keys(arg).reduce(
            (prev, space) => ({
              ...prev,
              [space]: arg[space].reduce(dictionaryReducer(space), {}),
            }),
            {},
          )),
    }),
    {} as T,
  );
}
