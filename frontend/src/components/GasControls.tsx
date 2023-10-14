interface GasControlsProps {
  selectedGas: string;
  setSelectedGas: (gas: string) => void;
}

export const GasControls = ({
  selectedGas,
  setSelectedGas,
}: GasControlsProps) => {
  return (
    <div className="control-wrapper gas-controls">
      <select
        className="control-input"
        onChange={(e) => setSelectedGas(e.target.value)}
        value={selectedGas}
      >
        <option value="Ch4">Methane (CH4)</option>
        <option value="C2H6">Ethane (C2H6)</option>
      </select>
    </div>
  );
};
