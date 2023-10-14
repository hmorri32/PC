interface BufferControlsProps {
  bufferSize: number;
  disabled: boolean;
  handleSetBuffer: (e: React.FormEvent<HTMLFormElement>) => void;
  setBufferSize: (size: string) => void;
  postBufferData: (e: React.MouseEvent) => void;
}

export const BufferControls = ({
  bufferSize,
  disabled,
  handleSetBuffer,
  setBufferSize,
  postBufferData,
}: BufferControlsProps) => {
  return (
    <div className="control-wrapper buffer-controls">
      <form className="buffer-form" onSubmit={handleSetBuffer}>
        <input
          type="number"
          className="control-input"
          placeholder="Buffer Size (meters)"
          value={bufferSize}
          onChange={(e) => setBufferSize(e.target.value)}
        />
        <button disabled={!bufferSize} className="control-input" type="submit">
          Set Buffer
        </button>
        <button
          disabled={disabled}
          onClick={(e) => postBufferData(e)}
          className="control-input"
        >
          Save Buffer geom
        </button>
      </form>
    </div>
  );
};
