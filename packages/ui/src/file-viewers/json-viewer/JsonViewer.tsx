import './JsonViewer.scss';

type JsonViewerProps = {
  json: string;
};

export function JsonViewer(props: JsonViewerProps) {
  const obj = JSON.parse(props.json);

  const renderValue = (key?: string, value?: any) => {
    if (typeof value === 'string') {
      return (
        <div className="row-string" key={key}>
          {key && <span style={{ backgroundColor: 'green', borderRadius: '0.2rem', padding: '0.2rem' }}>{key}</span>}
          <span style={{ color: 'lightgreen' }}>{value}</span>
        </div>
      );
    }

    if (typeof value === 'number') {
      return (
        <div className="row-number" key={key}>
          {key && <span style={{ backgroundColor: 'skyblue', borderRadius: '0.2rem', padding: '0.2rem' }}>{key}</span>}
          <span style={{ color: 'lightblue' }}>{value}</span>
        </div>
      );
    }

    if (typeof value === 'boolean') {
      return (
        <div className="row-boolean" key={key}>
          {key && <span className="row-key">{key}</span>}
          <span className="row-value">{value.toString()}</span>
        </div>
      );
    }

    if (Array.isArray(value)) {
      return (
        <div
          className="row-array"
          key={key}
          style={{
            borderRadius: '0.5rem',
            margin: '0.3rem',
            backgroundColor: `rgba(50,50,${(Math.floor(Math.random() * 255) * value?.length) % 255}, 1)`,
          }}
        >
          {key && <span>{`Array<${key}>`} </span>}
          <div>{value.map((item: any, index: number) => renderValue(undefined, item))}</div>
        </div>
      );
    }

    if (typeof value === 'object' && !Array.isArray(value)) {
      return (
        <div
          style={{
            borderRadius: '0.5rem',
            margin: '0.3rem',
            backgroundColor: `rgba(0,0,${Math.floor(Math.random() * 255) % 255}, 1)`,
          }}
          key={key}
        >
          {key && <span>{key}</span>}
          <div>
            {Object.keys(value).map((innerKey) => (
              <div key={innerKey}>{renderValue(innerKey, value[innerKey])}</div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div>
      {Object.keys(obj)
        .map((key) => renderValue(key, obj[key]))
        .filter((exists) => exists)}
    </div>
  );
}
