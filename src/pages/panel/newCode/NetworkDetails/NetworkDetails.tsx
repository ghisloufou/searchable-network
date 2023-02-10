import { useContext } from "react";
import { RequestContext } from "../Panel";
import { JsonView } from "./JsonView/JsonView";

export function NetworkDetails() {
  const { selectedRequest } = useContext(RequestContext);

  if (!selectedRequest) {
    return null;
  }

  return <JsonView />;
}

// const [isComparisonMode, setIsComparisonMode] = useState<boolean>(false);

// const newStyles = {
//   variables: {
//     dark: {
//       highlightBackground: "#fefed5",
//       highlightGutterBackground: "#ffcd3c",
//     },
//   },
//   line: {
//     padding: "10px 2px",
//     "&:hover": {
//       background: "#a26ea1",
//     },
//   },
// };

// With Comparison Mode, disabled because it is not practical at the moment
// return (
//   <section>
//     <ul className="nav nav-tabs">
//       <li className="nav-item">
//         <button
//           className={`nav-link text-white ${
//             isComparisonMode ? "" : "active"
//           }`}
//           onClick={() => setIsComparisonMode(false)}
//         >
//           View mode
//         </button>
//       </li>
//       <li className="nav-item">
//         <button
//           className={`nav-link text-white ${
//             isComparisonMode ? "active" : ""
//           }`}
//           onClick={() => setIsComparisonMode(true)}
//         >
//           Compare mode
//         </button>
//       </li>
//     </ul>

//     {isComparisonMode ? (
//       <ReactDiffViewer
//         oldValue={selectedRequest?.request?.requestContent}
//         newValue={selectedRequest?.response?.responseContent}
//         splitView={true}
//         useDarkTheme={isDarkModeEnabled}
//         compareMethod={DiffMethod.JSON}
//         leftTitle="Request content"
//         rightTitle="Response content"
//         styles={newStyles}
//         disableWordDiff={true}
//       />
//     ) : (
//       <JsonView />
//     )}
//   </section>
// );
