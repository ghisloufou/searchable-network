type ToolbarProps = {
  onToggleJsonParse: () => void;
  onClear: () => void;
};

export const Toolbar = ({ onToggleJsonParse, onClear }: ToolbarProps) => {
  return (
    <>
      <a href="#">
        <label
          className="icon"
          title="Toggle JSON Parsing (See Panel Settings)"
        >
          <i className="icon-embed"></i>
          <input
            type="checkbox"
            name="toggleJsonParsing"
            onClick={onToggleJsonParse}
          />
        </label>
      </a>

      <button title="Clear" onClick={onClear}>
        Clear
        <i className="icon-blocked"></i>
      </button>
    </>
  );
};
