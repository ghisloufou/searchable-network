type ToolbarProps = {
  onToggleJsonParse: () => void;
  onDonwload: () => void;
  onClear: () => void;
};

export const Toolbar = ({
  onToggleJsonParse,
  onDonwload,
  onClear,
}: ToolbarProps) => {
  return (
    <>
      <a href="#">
        <label
          className="icon"
          title="Toggle JSON Parsing (See Panel Settings)"
        >
          <i className="icon-embed"></i>
          Toggle JSON Parsing (See Panel Settings)
          <input
            type="checkbox"
            name="toggleJsonParsing"
            onClick={onToggleJsonParse}
          />
        </label>
      </a>

      <button title="Download" onClick={onDonwload}>
        Download
        <i className="icon-download3"></i>
      </button>

      <button title="Clear" onClick={onClear}>
        Clear
        <i className="icon-blocked"></i>
      </button>
    </>
  );
};
