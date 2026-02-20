/*
 * Copyright 2009-2026 C3 AI (www.c3.ai). All Rights Reserved.
 * Confidential and Proprietary C3 Materials.
 * This material, including without limitation any software, is the confidential trade secret and proprietary
 * information of C3 and its licensors. Reproduction, use and/or distribution of this material in any form is
 * strictly prohibited except as set forth in a written license agreement with C3 and/or its authorized distributors.
 * This material may be covered by one or more patents or pending patent applications.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from 'axios';

interface AxiosResponse {
  data: any;
}

/**
 * The function that allows communication with c3server APIs.
 * For calling APIs with arguments, action needs to be the function name and spec needs to be a list of arguments.
 * For fetching data, action needs to be `fetch` and spec needs to be an object that contains the Filter spec.
 * @param typeName The c3type to call
 * @param actionName The function to invoke
 * @param spec The arguments to the function
 * @returns The response from c3server
 */
export async function c3Action(typeName: string, actionName: string, spec?: any): Promise<any> {
  const url = `./api/8/${typeName}/${actionName}`;
  const payload = spec
    ? Array.isArray(spec) ? JSON.stringify([typeName, ...spec]) : JSON.stringify([typeName, spec])
    : undefined;

  const response: AxiosResponse = await axios.post(url, payload);
  return response.data;
}

/**
 * The function that allows communication with c3server APIs using functions like create().
 * For calling APIs with arguments, action needs to be the function name and spec needs to be a list of arguments.
 * @param typeName The c3type to call
 * @param actionName The function to invoke
 * @param spec The arguments to the function
 * @returns The response from c3server
 */
export async function c3CreateAction(typeName: string, actionName: string, spec: any): Promise<any> {
  const url = `./api/8/${typeName}/${actionName}`;
  const payload = JSON.stringify([spec]);
  const response: AxiosResponse = await axios.post(url, payload);
  return response.data;
}

/**
 * The function that allows communication with c3server APIs using member functions.
 * For calling APIs with arguments, action needs to be the member function name and spec needs
 * to be a list of arguments.
 * @param instance The c3type instance to call
 * @param actionName The member function to invoke
 * @param spec The arguments to the function
 * @returns The response from c3server
 */
export async function c3MemberAction(instance: any, actionName: string, spec?: any): Promise<any> {
  const typeName = instance.typeName();
  const url = `./api/8/${typeName}/${actionName}`;
  const payload = spec
    ? Array.isArray(spec) ? JSON.stringify([instance, ...spec]) : JSON.stringify([instance, spec])
    : undefined;

  const response: AxiosResponse = await axios.post(url, payload);
  return response.data;
}

export default c3Action;
