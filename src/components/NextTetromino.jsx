const BLOCK_SIZE = 28;

export const NextTetromino = ({ tetromino }) => {
  return (
    <div className="panel">
      <p className="panel-title">Next</p>
      <div className="next-tetromino-wrapper">
        {tetromino?.shape.map((row, r) =>
          row.map((cell, c) => {
            if (cell === 0) return null;
            return (
              <div
                key={`${r}-${c}`}
                style={{
                  width: BLOCK_SIZE,
                  height: BLOCK_SIZE,
                  backgroundColor: tetromino.color,
                  position: 'absolute',
                  top: r * BLOCK_SIZE,
                  left: c * BLOCK_SIZE,
                  borderTop: '3px solid rgba(255,255,255,0.3)',
                  borderLeft: '3px solid rgba(255,255,255,0.3)',
                  borderBottom: '3px solid rgba(0,0,0,0.3)',
                  borderRight: '3px solid rgba(0,0,0,0.3)',
                  borderRadius: 2,
                }}
              />
            );
          })
        )}
      </div>
    </div>
  );
};