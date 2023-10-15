interface BufferControlsProps {
  bufferSize: number;
  disabled: boolean;
  handleSetBuffer: (e: React.FormEvent<HTMLFormElement>) => void;
  setBufferSize: (size: string) => void;
  postBufferData: (e: React.MouseEvent) => void;
}

export const BufferControls = ({
  bufferSize,
  setBufferSize,
  postBufferData,
}: BufferControlsProps) => {
  return (
    <div className="control-wrapper buffer-controls">
      <form className="buffer-form">
        <input
          type="number"
          className="control-input"
          placeholder="Buffer Size (meters)"
          value={bufferSize}
          onChange={(e) => setBufferSize(e.target.value)}
        />
        <button
          disabled={bufferSize < 1}
          onClick={(e) => postBufferData(e)}
          className="control-input"
        >
          Save Buffer geom
        </button>
      </form>
    </div>
  );
};
