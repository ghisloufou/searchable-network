import { NetworkRequestEnhanced } from "../Panel";

// export async function getNetworkRequestWithContent(
//   request: NetworkRequestEnhanced
// ): Promise<NetworkRequestEnhanced> {
//   let requestWithResponseContent = request;
//   const responseContent = await getResponseContent(request);
//   requestWithResponseContent = {
//     ...request,
//     response: {
//       ...request.response,
//       responseContent,
//     },
//   };
//   return requestWithResponseContent;
// }

export async function getNetworkRequestWithContent(
  request: NetworkRequestEnhanced
): Promise<NetworkRequestEnhanced> {
  if (request.response.responseContent === undefined) {
    const responseContent = await getResponseContent(request);
    request.response.responseContent = responseContent;
  }
  return request;
}

const getResponseContent = (request: NetworkRequestEnhanced) => {
  return new Promise((resolve) => {
    if (!request.getContent) {
      resolve({ Error: "Cannot get response content." });
    }
    request.getContent((content) => {
      let responseContent = {} as any;
      try {
        responseContent = JSON.parse(content);
      } catch {
        responseContent = { "Response content": "not found" };
      }
      resolve(responseContent);
    });
  });
}
