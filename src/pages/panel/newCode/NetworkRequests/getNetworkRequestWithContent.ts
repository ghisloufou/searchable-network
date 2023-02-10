import { NetworkRequestEnhanced } from "../Panel";

export async function getNetworkRequestWithContent(
  request: NetworkRequestEnhanced
): Promise<NetworkRequestEnhanced> {
  let requestWithResponseContent = request;
  await getResponseContent(request).then((responseContent) => {
    requestWithResponseContent = {
      ...request,
      response: {
        ...request.response,
        responseContent,
      },
    };
  });
  return requestWithResponseContent;
}

const getResponseContent = (request: NetworkRequestEnhanced) =>
  new Promise((resolve) => {
    if (!request.getContent) {
      resolve({ Error: "Cannot get response content." });
    }
    request.getContent((res) => {
      let responseContent = {} as any;
      try {
        responseContent = JSON.parse(res);
      } catch {
        responseContent = { "Response content": "not found" };
      }
      resolve(responseContent);
    });
  });
