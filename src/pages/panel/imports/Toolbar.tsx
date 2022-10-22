import { useState } from "react";
import { useOldCode } from "./useOldCode";
type ToolbarButton = {
  icon: string;
  name: string;
  input: boolean;
  toggle?: boolean;
  callback: () => void;
  selected?: boolean;
};

type ToolbarProps = {};

export const Toolbar = ({}: ToolbarProps) => {
  const { onClear, onDonwload, onToggleJsonParse } = useOldCode();

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
            onClick={() => {
              onToggleJsonParse();
            }}
          />
        </label>
      </a>

      <button
        title="Download"
        onClick={() => {
          onDonwload();
        }}
      >
        <i className="icon-download3"></i>
      </button>

      <button
        title="Clear"
        onClick={() => {
          onClear();
        }}
      >
        <i className="icon-blocked"></i>
      </button>
    </>
  );
};
