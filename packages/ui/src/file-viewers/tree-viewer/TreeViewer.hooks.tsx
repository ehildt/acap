export const useMapKeyValueToTreeData = (value: any = {}, key: string | number = 'ROOT'): any => {
  if (value === null)
    return {
      name: key ?? 'null',
      attributes: {
        null: 'null',
      },
    };

  if (value === undefined)
    return {
      name: key ?? 'undefined',
      attributes: {
        null: 'undefined',
      },
    };

  if (typeof value === 'string')
    return {
      name: key,
      attributes: {
        string: value,
      },
    };

  if (typeof value === 'number')
    return {
      name: key,
      attributes: {
        number: value,
      },
    };

  if (typeof value === 'boolean')
    return {
      name: key,
      attributes: {
        boolean: value,
      },
    };

  if (Array.isArray(value))
    return {
      name: key,
      children: value.map((item, index) => useMapKeyValueToTreeData(item, index)),
    };

  if (typeof value === 'object')
    return {
      name: key,
      children: Object.keys(value).map((key, index) => useMapKeyValueToTreeData(value[key], key ?? index)),
    };
};
