export function ErrorrableTd({
  value, title, isError,
}: {
  value: string | number;
  title?: string;
  isError: boolean;
}) {
  return (
    <td
      title={title}
      className={`${isError ? "text-danger" : ""} text-truncate`}
    >
      {value}
    </td>
  );
}
