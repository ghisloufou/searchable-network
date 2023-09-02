import * as jsonPath from "jsonpath";
console.log("Service worker is running");

export const SERVICE_WORKER_PORT_NAME = "searchableNetwork";

export type PathSearchResponse =
  | {
      pathsFound: string[][];
      pathsToOpen: string[][];
    }
  | undefined;

export type PathSearchInput = {
  searchValue: string;
  content: {
    [key: string]: unknown;
  };
};

function isPathSearchMessage(request: unknown): request is PathSearchInput {
  return (
    typeof request === "object" &&
    "searchValue" in request &&
    "content" in request
  );
}

const panelListener = (port: chrome.runtime.Port) => {
  if (port.name === SERVICE_WORKER_PORT_NAME) {
    console.log("Connection received on port " + SERVICE_WORKER_PORT_NAME);
    port.onMessage.addListener(async (request) => {
      console.log(
        "🚀 ~ file: serviceWorker.ts:32 ~ port.onMessage.addListener ~ request:",
        request
      );
      if (!isPathSearchMessage(request)) {
        port.postMessage(undefined);
        return;
      }

      const result = await calculatePaths(request);
      port.postMessage(result);
    });
  }
};

chrome.runtime.onConnect.addListener(panelListener);

async function calculatePaths({
  content,
  searchValue,
}: PathSearchInput): Promise<PathSearchResponse> {
  try {
    const foundStringValuePaths =
      searchValue !== ""
        ? jsonPath.paths(content, `$..[?(/^${searchValue}$/i.test(@))]`)
        : [];

    const foundOtherValuePaths =
      searchValue !== ""
        ? jsonPath.paths(content, `$..['[?(@ === ${searchValue})]']`)
        : [];

    const caseInsensitivePropertyPath = await new Promise<
      jsonPath.PathComponent[][]
    >((resolve, reject) => {
      try {
        const result = jsonPath
          .paths(content, "$..*")
          .filter(
            (path) =>
              searchValue.toLowerCase() === path.at(-1).toString().toLowerCase()
          );
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });

    const rawFoundPaths = foundStringValuePaths.concat(
      foundOtherValuePaths,
      caseInsensitivePropertyPath
    );
    const pathsFound = rawFoundPaths.map(transformPath);
    console.log("🚀 ~ file: serviceWorker.ts:94 ~ pathsFound:", pathsFound);

    const pathsToOpen = [];

    if (pathsFound.length) {
      pathsFound.forEach((foundPath, index) => {
        const rawPath = rawFoundPaths[index];

        const rawChildPaths = jsonPath.paths(
          content,
          jsonPath.stringify(rawPath) + ".*"
        );
        const childPaths = rawChildPaths.map(transformPath);

        if (childPaths.length) {
          childPaths.forEach((childPath, childIndex) => {
            const rawChildPath = rawChildPaths[childIndex];
            if (typeof rawChildPath[rawChildPath.length - 1] === "number") {
              const grandChildPaths = jsonPath
                .paths(content, jsonPath.stringify(rawChildPath) + ".*")
                .map(transformPath);

              if (grandChildPaths.length) {
                grandChildPaths.forEach((grandChildPath) => {
                  pathsToOpen.push(grandChildPath);
                });
              }
            } else {
              pathsToOpen.push(childPath);
            }
          });
        } else {
          pathsToOpen.push(foundPath);
        }
      });

      pathsToOpen.push(pathsFound[0]);
    }

    return {
      pathsFound,
      pathsToOpen,
    };
  } catch (error) {
    console.error("An error ocurred while searching in the json", error);
    return undefined;
  }
}

function transformPath(path: jsonPath.PathComponent[]): string[] {
  return path.slice(2).map((element) => String(element));
}
