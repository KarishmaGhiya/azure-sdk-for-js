/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import { PagedAsyncIterableIterator, PageSettings } from "@azure/core-paging";
import { Roles } from "../operationsInterfaces";
import * as coreClient from "@azure/core-client";
import * as Mappers from "../models/mappers";
import * as Parameters from "../models/parameters";
import { CosmosDBForPostgreSQL } from "../cosmosDBForPostgreSQL";
import {
  SimplePollerLike,
  OperationState,
  createHttpPoller
} from "@azure/core-lro";
import { createLroSpec } from "../lroImpl";
import {
  Role,
  RolesListByClusterOptionalParams,
  RolesListByClusterResponse,
  RolesGetOptionalParams,
  RolesGetResponse,
  RolesCreateOptionalParams,
  RolesCreateResponse,
  RolesDeleteOptionalParams,
  RolesDeleteResponse
} from "../models";

/// <reference lib="esnext.asynciterable" />
/** Class containing Roles operations. */
export class RolesImpl implements Roles {
  private readonly client: CosmosDBForPostgreSQL;

  /**
   * Initialize a new instance of the class Roles class.
   * @param client Reference to the service client
   */
  constructor(client: CosmosDBForPostgreSQL) {
    this.client = client;
  }

  /**
   * List all the roles in a given cluster.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param clusterName The name of the cluster.
   * @param options The options parameters.
   */
  public listByCluster(
    resourceGroupName: string,
    clusterName: string,
    options?: RolesListByClusterOptionalParams
  ): PagedAsyncIterableIterator<Role> {
    const iter = this.listByClusterPagingAll(
      resourceGroupName,
      clusterName,
      options
    );
    return {
      next() {
        return iter.next();
      },
      [Symbol.asyncIterator]() {
        return this;
      },
      byPage: (settings?: PageSettings) => {
        if (settings?.maxPageSize) {
          throw new Error("maxPageSize is not supported by this operation.");
        }
        return this.listByClusterPagingPage(
          resourceGroupName,
          clusterName,
          options,
          settings
        );
      }
    };
  }

  private async *listByClusterPagingPage(
    resourceGroupName: string,
    clusterName: string,
    options?: RolesListByClusterOptionalParams,
    _settings?: PageSettings
  ): AsyncIterableIterator<Role[]> {
    let result: RolesListByClusterResponse;
    result = await this._listByCluster(resourceGroupName, clusterName, options);
    yield result.value || [];
  }

  private async *listByClusterPagingAll(
    resourceGroupName: string,
    clusterName: string,
    options?: RolesListByClusterOptionalParams
  ): AsyncIterableIterator<Role> {
    for await (const page of this.listByClusterPagingPage(
      resourceGroupName,
      clusterName,
      options
    )) {
      yield* page;
    }
  }

  /**
   * Gets information about a cluster role.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param clusterName The name of the cluster.
   * @param roleName The name of the cluster role.
   * @param options The options parameters.
   */
  get(
    resourceGroupName: string,
    clusterName: string,
    roleName: string,
    options?: RolesGetOptionalParams
  ): Promise<RolesGetResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, clusterName, roleName, options },
      getOperationSpec
    );
  }

  /**
   * Creates a new role or updates an existing role.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param clusterName The name of the cluster.
   * @param roleName The name of the cluster role.
   * @param parameters The required parameters for creating or updating a role.
   * @param options The options parameters.
   */
  async beginCreate(
    resourceGroupName: string,
    clusterName: string,
    roleName: string,
    parameters: Role,
    options?: RolesCreateOptionalParams
  ): Promise<
    SimplePollerLike<OperationState<RolesCreateResponse>, RolesCreateResponse>
  > {
    const directSendOperation = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec
    ): Promise<RolesCreateResponse> => {
      return this.client.sendOperationRequest(args, spec);
    };
    const sendOperationFn = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec
    ) => {
      let currentRawResponse:
        | coreClient.FullOperationResponse
        | undefined = undefined;
      const providedCallback = args.options?.onResponse;
      const callback: coreClient.RawResponseCallback = (
        rawResponse: coreClient.FullOperationResponse,
        flatResponse: unknown
      ) => {
        currentRawResponse = rawResponse;
        providedCallback?.(rawResponse, flatResponse);
      };
      const updatedArgs = {
        ...args,
        options: {
          ...args.options,
          onResponse: callback
        }
      };
      const flatResponse = await directSendOperation(updatedArgs, spec);
      return {
        flatResponse,
        rawResponse: {
          statusCode: currentRawResponse!.status,
          body: currentRawResponse!.parsedBody,
          headers: currentRawResponse!.headers.toJSON()
        }
      };
    };

    const lro = createLroSpec({
      sendOperationFn,
      args: { resourceGroupName, clusterName, roleName, parameters, options },
      spec: createOperationSpec
    });
    const poller = await createHttpPoller<
      RolesCreateResponse,
      OperationState<RolesCreateResponse>
    >(lro, {
      restoreFrom: options?.resumeFrom,
      intervalInMs: options?.updateIntervalInMs,
      resourceLocationConfig: "azure-async-operation"
    });
    await poller.poll();
    return poller;
  }

  /**
   * Creates a new role or updates an existing role.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param clusterName The name of the cluster.
   * @param roleName The name of the cluster role.
   * @param parameters The required parameters for creating or updating a role.
   * @param options The options parameters.
   */
  async beginCreateAndWait(
    resourceGroupName: string,
    clusterName: string,
    roleName: string,
    parameters: Role,
    options?: RolesCreateOptionalParams
  ): Promise<RolesCreateResponse> {
    const poller = await this.beginCreate(
      resourceGroupName,
      clusterName,
      roleName,
      parameters,
      options
    );
    return poller.pollUntilDone();
  }

  /**
   * Deletes a cluster role.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param clusterName The name of the cluster.
   * @param roleName The name of the cluster role.
   * @param options The options parameters.
   */
  async beginDelete(
    resourceGroupName: string,
    clusterName: string,
    roleName: string,
    options?: RolesDeleteOptionalParams
  ): Promise<
    SimplePollerLike<OperationState<RolesDeleteResponse>, RolesDeleteResponse>
  > {
    const directSendOperation = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec
    ): Promise<RolesDeleteResponse> => {
      return this.client.sendOperationRequest(args, spec);
    };
    const sendOperationFn = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec
    ) => {
      let currentRawResponse:
        | coreClient.FullOperationResponse
        | undefined = undefined;
      const providedCallback = args.options?.onResponse;
      const callback: coreClient.RawResponseCallback = (
        rawResponse: coreClient.FullOperationResponse,
        flatResponse: unknown
      ) => {
        currentRawResponse = rawResponse;
        providedCallback?.(rawResponse, flatResponse);
      };
      const updatedArgs = {
        ...args,
        options: {
          ...args.options,
          onResponse: callback
        }
      };
      const flatResponse = await directSendOperation(updatedArgs, spec);
      return {
        flatResponse,
        rawResponse: {
          statusCode: currentRawResponse!.status,
          body: currentRawResponse!.parsedBody,
          headers: currentRawResponse!.headers.toJSON()
        }
      };
    };

    const lro = createLroSpec({
      sendOperationFn,
      args: { resourceGroupName, clusterName, roleName, options },
      spec: deleteOperationSpec
    });
    const poller = await createHttpPoller<
      RolesDeleteResponse,
      OperationState<RolesDeleteResponse>
    >(lro, {
      restoreFrom: options?.resumeFrom,
      intervalInMs: options?.updateIntervalInMs,
      resourceLocationConfig: "location"
    });
    await poller.poll();
    return poller;
  }

  /**
   * Deletes a cluster role.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param clusterName The name of the cluster.
   * @param roleName The name of the cluster role.
   * @param options The options parameters.
   */
  async beginDeleteAndWait(
    resourceGroupName: string,
    clusterName: string,
    roleName: string,
    options?: RolesDeleteOptionalParams
  ): Promise<RolesDeleteResponse> {
    const poller = await this.beginDelete(
      resourceGroupName,
      clusterName,
      roleName,
      options
    );
    return poller.pollUntilDone();
  }

  /**
   * List all the roles in a given cluster.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param clusterName The name of the cluster.
   * @param options The options parameters.
   */
  private _listByCluster(
    resourceGroupName: string,
    clusterName: string,
    options?: RolesListByClusterOptionalParams
  ): Promise<RolesListByClusterResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, clusterName, options },
      listByClusterOperationSpec
    );
  }
}
// Operation Specifications
const serializer = coreClient.createSerializer(Mappers, /* isXml */ false);

const getOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBforPostgreSQL/serverGroupsv2/{clusterName}/roles/{roleName}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.Role
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.clusterName,
    Parameters.roleName
  ],
  headerParameters: [Parameters.accept],
  serializer
};
const createOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBforPostgreSQL/serverGroupsv2/{clusterName}/roles/{roleName}",
  httpMethod: "PUT",
  responses: {
    200: {
      bodyMapper: Mappers.Role
    },
    201: {
      bodyMapper: Mappers.Role
    },
    202: {
      bodyMapper: Mappers.Role
    },
    204: {
      bodyMapper: Mappers.Role
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  requestBody: Parameters.parameters4,
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.clusterName,
    Parameters.roleName
  ],
  headerParameters: [Parameters.accept, Parameters.contentType],
  mediaType: "json",
  serializer
};
const deleteOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBforPostgreSQL/serverGroupsv2/{clusterName}/roles/{roleName}",
  httpMethod: "DELETE",
  responses: {
    200: {
      headersMapper: Mappers.RolesDeleteHeaders
    },
    201: {
      headersMapper: Mappers.RolesDeleteHeaders
    },
    202: {
      headersMapper: Mappers.RolesDeleteHeaders
    },
    204: {
      headersMapper: Mappers.RolesDeleteHeaders
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.clusterName,
    Parameters.roleName
  ],
  headerParameters: [Parameters.accept],
  serializer
};
const listByClusterOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBforPostgreSQL/serverGroupsv2/{clusterName}/roles",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.RoleListResult
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.clusterName
  ],
  headerParameters: [Parameters.accept],
  serializer
};