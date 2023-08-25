import * as Hapi from "@hapi/hapi";
import { authenticateClient, advancedRecordSearch } from "opencrvs-api";
import { registrySyncSearchBuilder, operations } from "opencrvs-to-dci-builder";

export async function syncSearchHandler(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) {
  const payload =
    request.payload as operations["post_reg_sync_search"]["requestBody"]["content"]["application/json"];

  const token = await authenticateClient();
  const searchResult = await advancedRecordSearch(token, {
    parameters: { motherFamilyName: "Last" },
  });
  const resultTimestamp = new Date().toISOString();

  const dciStandardizedResult = registrySyncSearchBuilder(
    searchResult.body,
    payload,
    resultTimestamp
  );
  console.log(JSON.stringify(dciStandardizedResult, null, 4));
  return dciStandardizedResult;
}