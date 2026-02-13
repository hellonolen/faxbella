/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as coverPage from "../coverPage.js";
import type * as customers from "../customers.js";
import type * as faxRouting from "../faxRouting.js";
import type * as fileAccess from "../fileAccess.js";
import type * as http from "../http.js";
import type * as inboundFaxes from "../inboundFaxes.js";
import type * as notifications from "../notifications.js";
import type * as outboundFax from "../outboundFax.js";
import type * as passkeys from "../passkeys.js";
import type * as r2 from "../r2.js";
import type * as recipients from "../recipients.js";
import type * as stripe from "../stripe.js";
import type * as whop from "../whop.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  coverPage: typeof coverPage;
  customers: typeof customers;
  faxRouting: typeof faxRouting;
  fileAccess: typeof fileAccess;
  http: typeof http;
  inboundFaxes: typeof inboundFaxes;
  notifications: typeof notifications;
  outboundFax: typeof outboundFax;
  passkeys: typeof passkeys;
  r2: typeof r2;
  recipients: typeof recipients;
  stripe: typeof stripe;
  whop: typeof whop;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
