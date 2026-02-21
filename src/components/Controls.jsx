const CONTROLS = [
  { key: '←', description: '左に移動' },
  { key: '→', description: '右に移動' },
  { key: '↓', description: '下に移動' },
  { key: '↑', description: '回転' },
];

export const Controls = () => {
  return (
    <div className="panel">
      <p className="panel-title">Controls</p>
      <ul className="controls-list">
        {CONTROLS.map(({ key, description }) => (
          <li key={key}>
            <span className="key-badge">{key}</span>
            {description}
          </li>
        ))}
      </ul>
    </div>
  );
};