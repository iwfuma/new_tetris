export const NextTetromino = ({ tetromino }) => {
  if (!tetromino) return null;

  const blockSize = 30;

  return (
    <div id="next-tetromino-container">
      <h3>NEXT</h3>
      <div id="next-tetromino">
        {tetromino.shape.map((row, r) =>
          row.map((cell, c) => {
            if (cell !== 0) {
              return (
                <div
                  key={`${r}-${c}`}
                  style={{
                    width: `${blockSize}px`,
                    height: `${blockSize}px`,
                    backgroundColor: tetromino.color,
                    position: 'absolute',
                    top: `${r * blockSize}px`,
                    left: `${c * blockSize}px`,
                    border: '1px solid #000'
                  }}
                />
              );
            }
            return null;
          })
        )}
      </div>
    </div>
  );
};
