/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import { PagedAsyncIterableIterator } from "@azure/core-paging";
import {
  ManagedHsmKey,
  ManagedHsmKeysListOptionalParams,
  ManagedHsmKeysListVersionsOptionalParams,
  ManagedHsmKeyCreateParameters,
  ManagedHsmKeysCreateIfNotExistOptionalParams,
  ManagedHsmKeysCreateIfNotExistResponse,
  ManagedHsmKeysGetOptionalParams,
  ManagedHsmKeysGetResponse,
  ManagedHsmKeysGetVersionOptionalParams,
  ManagedHsmKeysGetVersionResponse
} from "../models";

/// <reference lib="esnext.asynciterable" />
/** Interface representing a ManagedHsmKeys. */
export interface ManagedHsmKeys {
  /**
   * Lists the keys in the specified managed HSM.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param name The name of the Managed HSM Pool within the specified resource group.
   * @param options The options parameters.
   */
  list(
    resourceGroupName: string,
    name: string,
    options?: ManagedHsmKeysListOptionalParams
  ): PagedAsyncIterableIterator<ManagedHsmKey>;
  /**
   * Lists the versions of the specified key in the specified managed HSM.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param name The name of the Managed HSM Pool within the specified resource group.
   * @param keyName The name of the key to be created. The value you provide may be copied globally for
   *                the purpose of running the service. The value provided should not include personally identifiable or
   *                sensitive information.
   * @param options The options parameters.
   */
  listVersions(
    resourceGroupName: string,
    name: string,
    keyName: string,
    options?: ManagedHsmKeysListVersionsOptionalParams
  ): PagedAsyncIterableIterator<ManagedHsmKey>;
  /**
   * Creates the first version of a new key if it does not exist. If it already exists, then the existing
   * key is returned without any write operations being performed. This API does not create subsequent
   * versions, and does not update existing keys.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param name The name of the Managed HSM Pool within the specified resource group.
   * @param keyName The name of the key to be created. The value you provide may be copied globally for
   *                the purpose of running the service. The value provided should not include personally identifiable or
   *                sensitive information.
   * @param parameters The parameters used to create the specified key.
   * @param options The options parameters.
   */
  createIfNotExist(
    resourceGroupName: string,
    name: string,
    keyName: string,
    parameters: ManagedHsmKeyCreateParameters,
    options?: ManagedHsmKeysCreateIfNotExistOptionalParams
  ): Promise<ManagedHsmKeysCreateIfNotExistResponse>;
  /**
   * Gets the current version of the specified key from the specified managed HSM.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param name The name of the Managed HSM Pool within the specified resource group.
   * @param keyName The name of the key to be created. The value you provide may be copied globally for
   *                the purpose of running the service. The value provided should not include personally identifiable or
   *                sensitive information.
   * @param options The options parameters.
   */
  get(
    resourceGroupName: string,
    name: string,
    keyName: string,
    options?: ManagedHsmKeysGetOptionalParams
  ): Promise<ManagedHsmKeysGetResponse>;
  /**
   * Gets the specified version of the specified key in the specified managed HSM.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param name The name of the Managed HSM Pool within the specified resource group.
   * @param keyName The name of the key to be created. The value you provide may be copied globally for
   *                the purpose of running the service. The value provided should not include personally identifiable or
   *                sensitive information.
   * @param keyVersion The version of the key to be retrieved.
   * @param options The options parameters.
   */
  getVersion(
    resourceGroupName: string,
    name: string,
    keyName: string,
    keyVersion: string,
    options?: ManagedHsmKeysGetVersionOptionalParams
  ): Promise<ManagedHsmKeysGetVersionResponse>;
}