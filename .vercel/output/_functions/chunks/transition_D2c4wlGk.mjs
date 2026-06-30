import { clsx } from 'clsx';
import { decodeBase64, encodeBase64, decodeHex, encodeHexUpperCase } from '@oslojs/encoding';
import * as z from 'zod/v4';
import { escape } from 'html-escaper';

function normalizeLF(code) {
  return code.replace(/\r\n|\r(?!\n)|\n/g, "\n");
}

function codeFrame(src, loc) {
  if (!loc || loc.line === void 0 || loc.column === void 0) {
    return "";
  }
  const lines = normalizeLF(src).split("\n").map((ln) => ln.replace(/\t/g, "  "));
  const visibleLines = [];
  for (let n = -2; n <= 2; n++) {
    if (lines[loc.line + n]) visibleLines.push(loc.line + n);
  }
  let gutterWidth = 0;
  for (const lineNo of visibleLines) {
    let w = `> ${lineNo}`;
    if (w.length > gutterWidth) gutterWidth = w.length;
  }
  let output = "";
  for (const lineNo of visibleLines) {
    const isFocusedLine = lineNo === loc.line - 1;
    output += isFocusedLine ? "> " : "  ";
    output += `${lineNo + 1} | ${lines[lineNo]}
`;
    if (isFocusedLine)
      output += `${Array.from({ length: gutterWidth }).join(" ")}  | ${Array.from({
        length: loc.column
      }).join(" ")}^
`;
  }
  return output;
}

class AstroError extends Error {
  loc;
  title;
  hint;
  frame;
  type = "AstroError";
  constructor(props, options) {
    const { name, title, message, stack, location, hint, frame } = props;
    super(message, options);
    this.title = title;
    this.name = name;
    if (message) this.message = message;
    this.stack = stack ? stack : this.stack;
    this.loc = location;
    this.hint = hint;
    this.frame = frame;
  }
  setLocation(location) {
    this.loc = location;
  }
  setName(name) {
    this.name = name;
  }
  setMessage(message) {
    this.message = message;
  }
  setHint(hint) {
    this.hint = hint;
  }
  setFrame(source, location) {
    this.frame = codeFrame(source, location);
  }
  static is(err) {
    return err?.type === "AstroError";
  }
}

const ClientAddressNotAvailable = {
  name: "ClientAddressNotAvailable",
  title: "`Astro.clientAddress` is not available in current adapter.",
  message: (adapterName) => `\`Astro.clientAddress\` is not available in the \`${adapterName}\` adapter. File an issue with the adapter to add support.`
};
const PrerenderClientAddressNotAvailable = {
  name: "PrerenderClientAddressNotAvailable",
  title: "`Astro.clientAddress` cannot be used inside prerendered routes.",
  message: (name) => `\`Astro.clientAddress\` cannot be used inside prerendered route ${name}.`
};
const StaticClientAddressNotAvailable = {
  name: "StaticClientAddressNotAvailable",
  title: "`Astro.clientAddress` is not available in prerendered pages.",
  message: "`Astro.clientAddress` is only available on pages that are server-rendered.",
  hint: "See https://docs.astro.build/en/guides/on-demand-rendering/ for more information on how to enable SSR."
};
const NoMatchingStaticPathFound = {
  name: "NoMatchingStaticPathFound",
  title: "No static path found for requested path.",
  message: (pathName) => `A \`getStaticPaths()\` route pattern was matched, but no matching static path was found for requested path \`${pathName}\`.`,
  hint: (possibleRoutes) => `Possible dynamic routes being matched: ${possibleRoutes.join(", ")}.`
};
const OnlyResponseCanBeReturned = {
  name: "OnlyResponseCanBeReturned",
  title: "Invalid type returned by Astro page.",
  message: (route, returnedValue) => `Route \`${route ? route : ""}\` returned a \`${returnedValue}\`. Only a [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) can be returned from Astro files.`,
  hint: "See https://docs.astro.build/en/guides/on-demand-rendering/#response for more information."
};
const MissingMediaQueryDirective = {
  name: "MissingMediaQueryDirective",
  title: "Missing value for `client:media` directive.",
  message: 'Media query not provided for `client:media` directive. A media query similar to `client:media="(max-width: 600px)"` must be provided.'
};
const NoMatchingRenderer = {
  name: "NoMatchingRenderer",
  title: "No matching renderer found.",
  message: (componentName, componentExtension, plural, validRenderersCount) => `Unable to render \`${componentName}\`.

${validRenderersCount > 0 ? `There ${plural ? "are" : "is"} ${validRenderersCount} renderer${plural ? "s" : ""} configured in your \`astro.config.mjs\` file,
but ${plural ? "none were" : "it was not"} able to server-side render \`${componentName}\`.` : `No valid renderer was found ${componentExtension ? `for the \`.${componentExtension}\` file extension.` : `for this file extension.`}`}`,
  hint: (probableRenderers) => `Did you mean to enable the ${probableRenderers} integration?

See https://docs.astro.build/en/guides/framework-components/ for more information on how to install and configure integrations.`
};
const NoClientOnlyHint = {
  name: "NoClientOnlyHint",
  title: "Missing hint on client:only directive.",
  message: (componentName) => `Unable to render \`${componentName}\`. When using the \`client:only\` hydration strategy, Astro needs a hint to use the correct renderer.`,
  hint: (probableRenderers) => `Did you mean to pass \`client:only="${probableRenderers}"\`? See https://docs.astro.build/en/reference/directives-reference/#clientonly for more information on \`client:only\`.`
};
const InvalidGetStaticPathsEntry = {
  name: "InvalidGetStaticPathsEntry",
  title: "Invalid entry inside `getStaticPaths()`'s return value.",
  message: (entryType) => `Invalid entry returned by \`getStaticPaths()\`. Expected an object, got \`${entryType}\`.`,
  hint: "If you're using a `.map` call, you might be looking for `.flatMap()` instead. See https://docs.astro.build/en/reference/routing-reference/#getstaticpaths for more information on `getStaticPaths()`."
};
const InvalidGetStaticPathsReturn = {
  name: "InvalidGetStaticPathsReturn",
  title: "Invalid value returned by `getStaticPaths()`.",
  message: (returnType) => `Invalid type returned by \`getStaticPaths()\`. Expected an \`array\`, got \`${returnType}\`.`,
  hint: "See https://docs.astro.build/en/reference/routing-reference/#getstaticpaths for more information on `getStaticPaths()`."
};
const GetStaticPathsExpectedParams = {
  name: "GetStaticPathsExpectedParams",
  title: "Missing params property on `getStaticPaths()` route.",
  message: "Missing or empty required `params` property on `getStaticPaths()` route.",
  hint: "See https://docs.astro.build/en/reference/routing-reference/#getstaticpaths for more information on `getStaticPaths()`."
};
const GetStaticPathsInvalidRouteParam = {
  name: "GetStaticPathsInvalidRouteParam",
  title: "Invalid route parameter returned by `getStaticPaths()`.",
  message: (key, value, valueType) => `Invalid \`getStaticPaths()\` route parameter for \`${key}\`. Expected a string or undefined, received \`${valueType}\` (\`${value}\`).`,
  hint: "See https://docs.astro.build/en/reference/routing-reference/#getstaticpaths for more information on `getStaticPaths()`."
};
const GetStaticPathsRequired = {
  name: "GetStaticPathsRequired",
  title: "`getStaticPaths()` function required for dynamic routes.",
  message: "`getStaticPaths()` function is required for dynamic routes. Make sure that you `export` a `getStaticPaths()` function from your dynamic route.",
  hint: `See https://docs.astro.build/en/guides/routing/#dynamic-routes for more information on dynamic routes.

	If you meant for this route to be server-rendered, set \`export const prerender = false;\` in the page.`
};
const ReservedSlotName = {
  name: "ReservedSlotName",
  title: "Invalid slot name.",
  message: (slotName) => `Unable to create a slot named \`${slotName}\`. \`${slotName}\` is a reserved slot name. Please update the name of this slot.`
};
const NoMatchingImport = {
  name: "NoMatchingImport",
  title: "No import found for component.",
  message: (componentName) => `Could not render \`${componentName}\`. No matching import has been found for \`${componentName}\`.`,
  hint: "Please make sure the component is properly imported."
};
const InvalidComponentArgs = {
  name: "InvalidComponentArgs",
  title: "Invalid component arguments.",
  message: (name) => `Invalid arguments passed to${name ? ` <${name}>` : ""} component.`,
  hint: "Astro components cannot be rendered directly via function call, such as `Component()` or `{items.map(Component)}`."
};
const PageNumberParamNotFound = {
  name: "PageNumberParamNotFound",
  title: "Page number param not found.",
  message: (paramName) => `[paginate()] page number param \`${paramName}\` not found in your filepath.`,
  hint: "Rename your file to `[page].astro` or `[...page].astro`."
};
const ImageMissingAlt = {
  name: "ImageMissingAlt",
  title: 'Image missing required "alt" property.',
  message: 'Image missing "alt" property. "alt" text is required to describe important images on the page.',
  hint: 'Use an empty string ("") for decorative images.'
};
const InvalidImageService = {
  name: "InvalidImageService",
  title: "Error while loading image service.",
  message: "There was an error loading the configured image service. Please see the stack trace for more information."
};
const MissingImageDimension = {
  name: "MissingImageDimension",
  title: "Missing image dimensions.",
  message: (missingDimension, imageURL) => `Missing ${missingDimension === "both" ? "width and height attributes" : `${missingDimension} attribute`} for ${imageURL}. When using remote images, both dimensions are required in order to avoid CLS.`,
  hint: "If your image is inside your `src` folder, you probably meant to import it instead. See [the Imports guide for more information](https://docs.astro.build/en/guides/imports/#other-assets). You can also use `inferSize={true}` for remote images to get the original dimensions."
};
const FailedToFetchRemoteImageDimensions = {
  name: "FailedToFetchRemoteImageDimensions",
  title: "Failed to retrieve remote image dimensions.",
  message: (imageURL) => `Failed to get the dimensions for ${imageURL}.`,
  hint: "Verify your remote image URL is accurate, and that you are not using `inferSize` with a file located in your `public/` folder."
};
const RemoteImageNotAllowed = {
  name: "RemoteImageNotAllowed",
  title: "Remote image is not allowed.",
  message: (imageURL) => `Remote image ${imageURL} is not allowed by your image configuration.`,
  hint: "Update `image.domains` or `image.remotePatterns`, or remove `inferSize` for this image."
};
const UnsupportedImageFormat = {
  name: "UnsupportedImageFormat",
  title: "Unsupported image format.",
  message: (format, imagePath, supportedFormats) => `Received unsupported format \`${format}\` from \`${imagePath}\`. Currently only ${supportedFormats.join(
    ", "
  )} are supported by our image services.`,
  hint: "Using an `img` tag directly instead of the `Image` component might be what you're looking for."
};
const UnsupportedImageConversion = {
  name: "UnsupportedImageConversion",
  title: "Unsupported image conversion.",
  message: "Converting between vector (such as SVGs) and raster (such as PNGs and JPEGs) images is not currently supported."
};
const PrerenderDynamicEndpointPathCollide = {
  name: "PrerenderDynamicEndpointPathCollide",
  title: "Prerendered dynamic endpoint has path collision.",
  message: (pathname) => `Could not render \`${pathname}\` with an \`undefined\` param as the generated path will collide during prerendering. Prevent passing \`undefined\` as \`params\` for the endpoint's \`getStaticPaths()\` function, or add an additional extension to the endpoint's filename.`,
  hint: (filename) => `Rename \`${filename}\` to \`${filename.replace(/\.(?:js|ts)/, (m) => `.json` + m)}\``
};
const ExpectedImage = {
  name: "ExpectedImage",
  title: "Expected src to be an image.",
  message: (src, typeofOptions, fullOptions) => `Expected \`src\` property for \`getImage\` or \`<Image />\` to be either an ESM imported image or a string with the path of a remote image. Received \`${src}\` (type: \`${typeofOptions}\`).

Full serialized options received: \`${fullOptions}\`.`,
  hint: "This error can often happen because of a wrong path. Make sure the path to your image is correct. If you're passing an async function, make sure to call and await it."
};
const ExpectedImageOptions = {
  name: "ExpectedImageOptions",
  title: "Expected image options.",
  message: (options) => `Expected \`getImage()\` parameter to be an object. Received \`${options}\`.`
};
const ExpectedNotESMImage = {
  name: "ExpectedNotESMImage",
  title: "Expected image options, not an ESM-imported image.",
  message: "An ESM-imported image cannot be passed directly to `getImage()`. Instead, pass an object with the image in the `src` property.",
  hint: "Try changing `getImage(myImage)` to `getImage({ src: myImage })`"
};
const IncompatibleDescriptorOptions = {
  name: "IncompatibleDescriptorOptions",
  title: "Cannot set both `densities` and `widths`.",
  message: "Only one of `densities` or `widths` can be specified. In most cases, you'll probably want to use only `widths` if you require specific widths.",
  hint: "Those attributes are used to construct a `srcset` attribute, which cannot have both `x` and `w` descriptors."
};
const NoImageMetadata = {
  name: "NoImageMetadata",
  title: "Could not process image metadata.",
  message: (imagePath) => `Could not process image metadata${imagePath ? ` for \`${imagePath}\`` : ""}.`,
  hint: "This is often caused by a corrupted or malformed image. Re-exporting the image from your image editor may fix this issue."
};
const ResponseSentError = {
  name: "ResponseSentError",
  title: "Unable to set response.",
  message: "The response has already been sent to the browser and cannot be altered."
};
const MiddlewareNoDataOrNextCalled = {
  name: "MiddlewareNoDataOrNextCalled",
  title: "The middleware didn't return a `Response`.",
  message: "Make sure your middleware returns a `Response` object, either directly or by returning the `Response` from calling the `next` function."
};
const MiddlewareNotAResponse = {
  name: "MiddlewareNotAResponse",
  title: "The middleware returned something that is not a `Response` object.",
  message: "Any data returned from middleware must be a valid `Response` object."
};
const EndpointDidNotReturnAResponse = {
  name: "EndpointDidNotReturnAResponse",
  title: "The endpoint did not return a `Response`.",
  message: "An endpoint must return either a `Response`, or a `Promise` that resolves with a `Response`."
};
const LocalsNotAnObject = {
  name: "LocalsNotAnObject",
  title: "Value assigned to `locals` is not accepted.",
  message: "`locals` can only be assigned to an object. Other values like numbers, strings, etc. are not accepted.",
  hint: "If you tried to remove some information from the `locals` object, try to use `delete` or set the property to `undefined`."
};
const LocalsReassigned = {
  name: "LocalsReassigned",
  title: "`locals` must not be reassigned.",
  message: "`locals` cannot be assigned directly.",
  hint: "Set a `locals` property instead."
};
const AstroResponseHeadersReassigned = {
  name: "AstroResponseHeadersReassigned",
  title: "`Astro.response.headers` must not be reassigned.",
  message: "Individual headers can be added to and removed from `Astro.response.headers`, but it must not be replaced with another instance of `Headers` altogether.",
  hint: "Consider using `Astro.response.headers.add()`, and `Astro.response.headers.delete()`."
};
const LocalImageUsedWrongly = {
  name: "LocalImageUsedWrongly",
  title: "Local images must be imported.",
  message: (imageFilePath) => `\`Image\`'s and \`getImage\`'s \`src\` parameter must be an imported image or a URL, it cannot be a string filepath. Received \`${imageFilePath}\`.`,
  hint: "If you want to use an image from your `src` folder, you need to either import it or if the image is coming from a content collection, use the [image() schema helper](https://docs.astro.build/en/guides/images/#images-in-content-collections). See https://docs.astro.build/en/reference/modules/astro-assets/#src-required for more information on the `src` property."
};
const MissingSharp = {
  name: "MissingSharp",
  title: "Could not find Sharp.",
  message: "Could not find Sharp. Please install Sharp (`sharp`) manually into your project or migrate to another image service.",
  hint: "See Sharp's installation instructions for more information: https://sharp.pixelplumbing.com/install. If you are not relying on `astro:assets` to optimize, transform, or process any images, you can configure a passthrough image service instead of installing Sharp. See https://docs.astro.build/en/reference/errors/missing-sharp for more information.\n\nSee https://docs.astro.build/en/guides/images/#default-image-service for more information on how to migrate to another image service."
};
const i18nNoLocaleFoundInPath = {
  name: "i18nNoLocaleFoundInPath",
  title: "The path doesn't contain any locale.",
  message: "You tried to use an i18n utility on a path that doesn't contain any locale. You can use `pathHasLocale` first to determine if the path has a locale."
};
const RewriteWithBodyUsed = {
  name: "RewriteWithBodyUsed",
  title: "Cannot use `Astro.rewrite()` after the request body has been read.",
  message: "`Astro.rewrite()` cannot be used if the request body has already been read. If you need to read the body, first clone the request."
};
const ForbiddenRewrite = {
  name: "ForbiddenRewrite",
  title: "Forbidden rewrite to a static route.",
  message: (from, to, component) => `You tried to rewrite the on-demand route '${from}' with the static route '${to}', when using the 'server' output. 

The static route '${to}' is rendered by the component
'${component}', which is marked as prerendered. This is a forbidden operation because during the build, the component '${component}' is compiled to an
HTML file, which can't be retrieved at runtime by Astro.`,
  hint: (component) => `Add \`export const prerender = false\` to the component '${component}', or use \`Astro.redirect()\`.`
};
const FontFamilyNotFound = {
  name: "FontFamilyNotFound",
  title: "Font family not found.",
  message: (family) => `No data was found for the \`"${family}"\` family passed to the \`<Font>\` component.`,
  hint: "This is often caused by a typo. Check that the `<Font />` component is using a `cssVariable` specified in your config."
};
const MissingGetFontFileRequestUrl = {
  name: "MissingGetFontFileRequestUrl",
  title: "`experimental_getFontFileURL()` requires the request URL with on-demand rendering.",
  hint: "Pass the request URL as the 2nd argument, for example `Astro.url`."
};
const UnableToLoadLogger = {
  name: "UnableToLoadLogger",
  title: "Unable to load the logger.",
  message: (path) => `Couldn't load the logger at given path "${path}".`
};
const ActionsReturnedInvalidDataError = {
  name: "ActionsReturnedInvalidDataError",
  title: "Action handler returned invalid data.",
  message: (error) => `Action handler returned invalid data. Handlers should return serializable data types like objects, arrays, strings, and numbers. Parse error: ${error}`,
  hint: "See the devalue library for all supported types: https://github.com/rich-harris/devalue"
};
const ActionNotFoundError = {
  name: "ActionNotFoundError",
  title: "Action not found.",
  message: (actionName) => `The server received a request for an action named \`${actionName}\` but could not find a match. If you renamed an action, check that you've updated your \`actions/index\` file and your calling code to match.`,
  hint: "You can run `astro check` to detect type errors caused by mismatched action names."
};
const SessionStorageInitError = {
  name: "SessionStorageInitError",
  title: "Session storage could not be initialized.",
  message: (error, driver) => `Error when initializing session storage${driver ? ` with driver \`${driver}\`` : ""}. \`${error ?? ""}\``,
  hint: "For more information, see https://docs.astro.build/en/guides/sessions/"
};
const SessionStorageSaveError = {
  name: "SessionStorageSaveError",
  title: "Session data could not be saved.",
  message: (error, driver) => `Error when saving session data${driver ? ` with driver \`${driver}\`` : ""}. \`${error ?? ""}\``,
  hint: "For more information, see https://docs.astro.build/en/guides/sessions/"
};
const CacheNotEnabled = {
  name: "CacheNotEnabled",
  title: "Cache is not enabled.",
  message: "`Astro.cache` is not available because the cache feature is not enabled. To use caching, configure a cache provider in your Astro config under `experimental.cache`.",
  hint: 'Use an adapter that provides a default cache provider, or set one explicitly: `experimental: { cache: { provider: "..." } }`. See https://docs.astro.build/en/reference/experimental-flags/route-caching/.'
};

function isPromise(value) {
  return !!value && typeof value === "object" && "then" in value && typeof value.then === "function";
}
async function* streamAsyncIterator(stream) {
  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) return;
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}

const escapeHTML = escape;
function stringifyForScript(value) {
  return JSON.stringify(value)?.replace(/</g, "\\u003c");
}
class HTMLBytes extends Uint8Array {
}
Object.defineProperty(HTMLBytes.prototype, Symbol.toStringTag, {
  get() {
    return "HTMLBytes";
  }
});
const htmlStringSymbol = /* @__PURE__ */ Symbol.for("astro:html-string");
class HTMLString extends String {
  [htmlStringSymbol] = true;
}
const markHTMLString = (value) => {
  if (isHTMLString(value)) {
    return value;
  }
  if (typeof value === "string") {
    return new HTMLString(value);
  }
  return value;
};
function isHTMLString(value) {
  return !!value?.[htmlStringSymbol];
}
function markHTMLBytes(bytes) {
  return new HTMLBytes(bytes);
}
function hasGetReader(obj) {
  return typeof obj.getReader === "function";
}
async function* unescapeChunksAsync(iterable) {
  if (hasGetReader(iterable)) {
    for await (const chunk of streamAsyncIterator(iterable)) {
      yield unescapeHTML(chunk);
    }
  } else {
    for await (const chunk of iterable) {
      yield unescapeHTML(chunk);
    }
  }
}
function* unescapeChunks(iterable) {
  for (const chunk of iterable) {
    yield unescapeHTML(chunk);
  }
}
function unescapeHTML(str) {
  if (!!str && typeof str === "object") {
    if (str instanceof Uint8Array) {
      return markHTMLBytes(str);
    } else if (str instanceof Response && str.body) {
      const body = str.body;
      return unescapeChunksAsync(body);
    } else if (typeof str.then === "function") {
      return Promise.resolve(str).then((value) => {
        return unescapeHTML(value);
      });
    } else if (str[/* @__PURE__ */ Symbol.for("astro:slot-string")]) {
      return str;
    } else if (Symbol.iterator in str) {
      return unescapeChunks(str);
    } else if (Symbol.asyncIterator in str || hasGetReader(str)) {
      return unescapeChunksAsync(str);
    }
  }
  return markHTMLString(str);
}

function resolvePropagationHint(input) {
  const explicitHint = input.factoryHint ?? "none";
  if (explicitHint !== "none") {
    return explicitHint;
  }
  if (!input.moduleId) {
    return "none";
  }
  return input.metadataLookup(input.moduleId) ?? "none";
}
function isPropagatingHint(hint) {
  return hint === "self" || hint === "in-tree";
}
function getPropagationHint$1(result, factory) {
  return resolvePropagationHint({
    factoryHint: factory.propagation,
    moduleId: factory.moduleId,
    metadataLookup: (moduleId) => result.componentMetadata.get(moduleId)?.propagation
  });
}

function isAstroComponentFactory(obj) {
  return obj == null ? false : obj.isAstroComponentFactory === true;
}
function isAPropagatingComponent(result, factory) {
  return isPropagatingHint(getPropagationHint(result, factory));
}
function getPropagationHint(result, factory) {
  return getPropagationHint$1(result, factory);
}

const PROP_TYPE = {
  Value: 0,
  JSON: 1,
  // Actually means Array
  RegExp: 2,
  Date: 3,
  Map: 4,
  Set: 5,
  BigInt: 6,
  URL: 7,
  Uint8Array: 8,
  Uint16Array: 9,
  Uint32Array: 10,
  Infinity: 11
};
function serializeArray(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = value.map((v) => {
    return convertToSerializedForm(v, metadata, parents);
  });
  parents.delete(value);
  return serialized;
}
function serializeObject(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = Object.fromEntries(
    Object.entries(value).map(([k, v]) => {
      return [k, convertToSerializedForm(v, metadata, parents)];
    })
  );
  parents.delete(value);
  return serialized;
}
function convertToSerializedForm(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  const tag = Object.prototype.toString.call(value);
  switch (tag) {
    case "[object Date]": {
      return [PROP_TYPE.Date, value.toISOString()];
    }
    case "[object RegExp]": {
      return [PROP_TYPE.RegExp, value.source];
    }
    case "[object Map]": {
      return [PROP_TYPE.Map, serializeArray(Array.from(value), metadata, parents)];
    }
    case "[object Set]": {
      return [PROP_TYPE.Set, serializeArray(Array.from(value), metadata, parents)];
    }
    case "[object BigInt]": {
      return [PROP_TYPE.BigInt, value.toString()];
    }
    case "[object URL]": {
      return [PROP_TYPE.URL, value.toString()];
    }
    case "[object Array]": {
      return [PROP_TYPE.JSON, serializeArray(value, metadata, parents)];
    }
    case "[object Uint8Array]": {
      return [PROP_TYPE.Uint8Array, Array.from(value)];
    }
    case "[object Uint16Array]": {
      return [PROP_TYPE.Uint16Array, Array.from(value)];
    }
    case "[object Uint32Array]": {
      return [PROP_TYPE.Uint32Array, Array.from(value)];
    }
    default: {
      if (value !== null && typeof value === "object") {
        return [PROP_TYPE.Value, serializeObject(value, metadata, parents)];
      }
      if (value === Number.POSITIVE_INFINITY) {
        return [PROP_TYPE.Infinity, 1];
      }
      if (value === Number.NEGATIVE_INFINITY) {
        return [PROP_TYPE.Infinity, -1];
      }
      if (value === void 0) {
        return [PROP_TYPE.Value];
      }
      return [PROP_TYPE.Value, value];
    }
  }
}
function serializeProps(props, metadata) {
  const serialized = JSON.stringify(serializeObject(props, metadata));
  return serialized;
}

const transitionDirectivesToCopyOnIsland = Object.freeze([
  "data-astro-transition-scope",
  "data-astro-transition-persist",
  "data-astro-transition-persist-props"
]);
function extractDirectives(inputProps, clientDirectives) {
  let extracted = {
    isPage: false,
    hydration: null,
    props: {},
    propsWithoutTransitionAttributes: {}
  };
  for (const [key, value] of Object.entries(inputProps)) {
    if (key.startsWith("server:")) {
      if (key === "server:root") {
        extracted.isPage = true;
      }
    }
    if (key.startsWith("client:")) {
      if (!extracted.hydration) {
        extracted.hydration = {
          directive: "",
          value: "",
          componentUrl: "",
          componentExport: { value: "" }
        };
      }
      switch (key) {
        case "client:component-path": {
          extracted.hydration.componentUrl = value;
          break;
        }
        case "client:component-export": {
          extracted.hydration.componentExport.value = value;
          break;
        }
        // This is a special prop added to prove that the client hydration method
        // was added statically.
        case "client:component-hydration": {
          break;
        }
        case "client:display-name": {
          break;
        }
        default: {
          extracted.hydration.directive = key.split(":")[1];
          extracted.hydration.value = value;
          if (!clientDirectives.has(extracted.hydration.directive)) {
            const hydrationMethods = Array.from(clientDirectives.keys()).map((d) => `client:${d}`).join(", ");
            throw new Error(
              `Error: invalid hydration directive "${key}". Supported hydration methods: ${hydrationMethods}`
            );
          }
          if (extracted.hydration.directive === "media" && typeof extracted.hydration.value !== "string") {
            throw new AstroError(MissingMediaQueryDirective);
          }
          break;
        }
      }
    } else {
      extracted.props[key] = value;
      if (!transitionDirectivesToCopyOnIsland.includes(key)) {
        extracted.propsWithoutTransitionAttributes[key] = value;
      }
    }
  }
  for (const sym of Object.getOwnPropertySymbols(inputProps)) {
    extracted.props[sym] = inputProps[sym];
    extracted.propsWithoutTransitionAttributes[sym] = inputProps[sym];
  }
  return extracted;
}
async function generateHydrateScript(scriptOptions, metadata) {
  const { renderer, result, astroId, props, attrs } = scriptOptions;
  const { hydrate, componentUrl, componentExport } = metadata;
  if (!componentExport.value) {
    throw new AstroError({
      ...NoMatchingImport,
      message: NoMatchingImport.message(metadata.displayName)
    });
  }
  const island = {
    children: "",
    props: {
      // This is for HMR, probably can avoid it in prod
      uid: astroId
    }
  };
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      island.props[key] = escapeHTML(value);
    }
  }
  island.props["component-url"] = await result.resolve(decodeURI(componentUrl));
  if (renderer.clientEntrypoint) {
    island.props["component-export"] = componentExport.value;
    island.props["renderer-url"] = await result.resolve(
      decodeURI(renderer.clientEntrypoint.toString())
    );
    island.props["props"] = escapeHTML(serializeProps(props, metadata));
  }
  island.props["ssr"] = "";
  island.props["client"] = hydrate;
  let beforeHydrationUrl = await result.resolve("astro:scripts/before-hydration.js");
  if (beforeHydrationUrl.length) {
    island.props["before-hydration-url"] = beforeHydrationUrl;
  }
  island.props["opts"] = escapeHTML(
    JSON.stringify({
      name: metadata.displayName,
      value: metadata.hydrateArgs || ""
    })
  );
  transitionDirectivesToCopyOnIsland.forEach((name) => {
    if (typeof props[name] !== "undefined") {
      island.props[name] = props[name];
    }
  });
  return island;
}

/**
 * shortdash - https://github.com/bibig/node-shorthash
 *
 * @license
 *
 * (The MIT License)
 *
 * Copyright (c) 2013 Bibig <bibig@me.com>
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
const dictionary = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY";
const binary = dictionary.length;
function bitwise(str) {
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = (hash << 5) - hash + ch;
    hash = hash & hash;
  }
  return hash;
}
function shorthash(text) {
  let num;
  let result = "";
  let integer = bitwise(text);
  const sign = integer < 0 ? "Z" : "";
  integer = Math.abs(integer);
  while (integer >= binary) {
    num = integer % binary;
    integer = Math.floor(integer / binary);
    result = dictionary[num] + result;
  }
  if (integer > 0) {
    result = dictionary[integer] + result;
  }
  return sign + result;
}

const headAndContentSym = /* @__PURE__ */ Symbol.for("astro.headAndContent");
function isHeadAndContent(obj) {
  return typeof obj === "object" && obj !== null && !!obj[headAndContentSym];
}
function createThinHead() {
  return {
    [headAndContentSym]: true
  };
}

var astro_island_prebuilt_default = `(()=>{var g=Object.defineProperty;var w=(c,s,d)=>s in c?g(c,s,{enumerable:!0,configurable:!0,writable:!0,value:d}):c[s]=d;var l=(c,s,d)=>w(c,typeof s!="symbol"?s+"":s,d);var E=new Set(["__proto__","constructor","prototype"]);{let c={0:t=>y(t),1:t=>d(t),2:t=>new RegExp(t),3:t=>new Date(t),4:t=>new Map(d(t)),5:t=>new Set(d(t)),6:t=>BigInt(t),7:t=>new URL(t),8:t=>new Uint8Array(t),9:t=>new Uint16Array(t),10:t=>new Uint32Array(t),11:t=>Number.POSITIVE_INFINITY*t},s=t=>{let[p,e]=t;return p in c?c[p](e):void 0},d=t=>t.map(s),y=t=>typeof t!="object"||t===null?t:Object.fromEntries(Object.entries(t).map(([p,e])=>[p,s(e)]));class f extends HTMLElement{constructor(){super(...arguments);l(this,"Component");l(this,"hydrator");l(this,"hydrate",async()=>{var b;if(!this.hydrator||!this.isConnected)return;let e=(b=this.parentElement)==null?void 0:b.closest("astro-island[ssr]");if(e){e.addEventListener("astro:hydrate",this.hydrate,{once:!0});return}let n=this.querySelectorAll("astro-slot"),r={},i=this.querySelectorAll("template[data-astro-template]");for(let o of i){let a=o.closest(this.tagName);a!=null&&a.isSameNode(this)&&(r[o.getAttribute("data-astro-template")||"default"]=o.innerHTML,o.remove())}for(let o of n){let a=o.closest(this.tagName);a!=null&&a.isSameNode(this)&&(r[o.getAttribute("name")||"default"]=o.innerHTML)}let u;try{u=this.hasAttribute("props")?y(JSON.parse(this.getAttribute("props"))):{}}catch(o){let a=this.getAttribute("component-url")||"<unknown>",v=this.getAttribute("component-export");throw v&&(a+=\` (export \${v})\`),console.error(\`[hydrate] Error parsing props for component \${a}\`,this.getAttribute("props"),o),o}let h;await this.hydrator(this)(this.Component,u,r,{client:this.getAttribute("client")}),this.removeAttribute("ssr"),this.dispatchEvent(new CustomEvent("astro:hydrate"))});l(this,"unmount",()=>{this.isConnected||this.dispatchEvent(new CustomEvent("astro:unmount"))})}disconnectedCallback(){document.removeEventListener("astro:after-swap",this.unmount),document.addEventListener("astro:after-swap",this.unmount,{once:!0})}connectedCallback(){if(!this.hasAttribute("await-children")||document.readyState==="interactive"||document.readyState==="complete")this.childrenConnectedCallback();else{let e=()=>{document.removeEventListener("DOMContentLoaded",e),n.disconnect(),this.childrenConnectedCallback()},n=new MutationObserver(()=>{var r;((r=this.lastChild)==null?void 0:r.nodeType)===Node.COMMENT_NODE&&this.lastChild.nodeValue==="astro:end"&&(this.lastChild.remove(),e())});n.observe(this,{childList:!0}),document.addEventListener("DOMContentLoaded",e)}}async childrenConnectedCallback(){let e=this.getAttribute("before-hydration-url");e&&await import(e),this.start()}getRetryImportUrl(e){let n=new URL(e,document.baseURI),r=\`astro-retry=\${Date.now()}\`,i=n.hash.replace(/^#/,"");return n.hash=i?\`\${i}&\${r}\`:r,n.toString()}async importWithRetry(e){try{return await import(e)}catch(n){return await new Promise(r=>setTimeout(r,1e3)),import(this.getRetryImportUrl(e))}}handleHydrationError(e){let n=this.getAttribute("component-url"),r=new CustomEvent("astro:hydration-error",{cancelable:!0,bubbles:!0,composed:!0,detail:{error:e,componentUrl:n}});this.dispatchEvent(r)&&console.error(\`[astro-island] Error hydrating \${n}\`,e)}async start(){let e=JSON.parse(this.getAttribute("opts")),n=this.getAttribute("client");if(Astro[n]===void 0){window.addEventListener(\`astro:\${n}\`,()=>this.start(),{once:!0});return}try{await Astro[n](async()=>{let r=this.getAttribute("renderer-url");try{let[i,{default:u}]=await Promise.all([this.importWithRetry(this.getAttribute("component-url")),r?this.importWithRetry(r):Promise.resolve({default:()=>()=>{}})]),h=this.getAttribute("component-export")||"default";if(h.includes(".")){this.Component=i;for(let m of h.split(".")){if(E.has(m)||!this.Component||typeof this.Component!="object"&&typeof this.Component!="function"||!Object.hasOwn(this.Component,m))throw new Error(\`Invalid component export path: \${h}\`);this.Component=this.Component[m]}}else{if(E.has(h))throw new Error(\`Invalid component export path: \${h}\`);this.Component=i[h]}return this.hydrator=u,this.hydrate}catch(i){return this.handleHydrationError(i),()=>{}}},e,this)}catch(r){this.handleHydrationError(r)}}attributeChangedCallback(){this.hydrate()}}l(f,"observedAttributes",["props"]),customElements.get("astro-island")||customElements.define("astro-island",f)}})();`;

var astro_island_prebuilt_dev_default = `(()=>{var g=Object.defineProperty;var w=(d,s,h)=>s in d?g(d,s,{enumerable:!0,configurable:!0,writable:!0,value:h}):d[s]=h;var l=(d,s,h)=>w(d,typeof s!="symbol"?s+"":s,h);var E=new Set(["__proto__","constructor","prototype"]);{let d={0:t=>y(t),1:t=>h(t),2:t=>new RegExp(t),3:t=>new Date(t),4:t=>new Map(h(t)),5:t=>new Set(h(t)),6:t=>BigInt(t),7:t=>new URL(t),8:t=>new Uint8Array(t),9:t=>new Uint16Array(t),10:t=>new Uint32Array(t),11:t=>Number.POSITIVE_INFINITY*t},s=t=>{let[p,e]=t;return p in d?d[p](e):void 0},h=t=>t.map(s),y=t=>typeof t!="object"||t===null?t:Object.fromEntries(Object.entries(t).map(([p,e])=>[p,s(e)]));class f extends HTMLElement{constructor(){super(...arguments);l(this,"Component");l(this,"hydrator");l(this,"hydrate",async()=>{var b;if(!this.hydrator||!this.isConnected)return;let e=(b=this.parentElement)==null?void 0:b.closest("astro-island[ssr]");if(e){e.addEventListener("astro:hydrate",this.hydrate,{once:!0});return}let n=this.querySelectorAll("astro-slot"),r={},i=this.querySelectorAll("template[data-astro-template]");for(let o of i){let c=o.closest(this.tagName);c!=null&&c.isSameNode(this)&&(r[o.getAttribute("data-astro-template")||"default"]=o.innerHTML,o.remove())}for(let o of n){let c=o.closest(this.tagName);c!=null&&c.isSameNode(this)&&(r[o.getAttribute("name")||"default"]=o.innerHTML)}let m;try{m=this.hasAttribute("props")?y(JSON.parse(this.getAttribute("props"))):{}}catch(o){let c=this.getAttribute("component-url")||"<unknown>",v=this.getAttribute("component-export");throw v&&(c+=\` (export \${v})\`),console.error(\`[hydrate] Error parsing props for component \${c}\`,this.getAttribute("props"),o),o}let a,u=this.hydrator(this);a=performance.now(),await u(this.Component,m,r,{client:this.getAttribute("client")}),a&&this.setAttribute("client-render-time",(performance.now()-a).toString()),this.removeAttribute("ssr"),this.dispatchEvent(new CustomEvent("astro:hydrate"))});l(this,"unmount",()=>{this.isConnected||this.dispatchEvent(new CustomEvent("astro:unmount"))})}disconnectedCallback(){document.removeEventListener("astro:after-swap",this.unmount),document.addEventListener("astro:after-swap",this.unmount,{once:!0})}connectedCallback(){if(!this.hasAttribute("await-children")||document.readyState==="interactive"||document.readyState==="complete")this.childrenConnectedCallback();else{let e=()=>{document.removeEventListener("DOMContentLoaded",e),n.disconnect(),this.childrenConnectedCallback()},n=new MutationObserver(()=>{var r;((r=this.lastChild)==null?void 0:r.nodeType)===Node.COMMENT_NODE&&this.lastChild.nodeValue==="astro:end"&&(this.lastChild.remove(),e())});n.observe(this,{childList:!0}),document.addEventListener("DOMContentLoaded",e)}}async childrenConnectedCallback(){let e=this.getAttribute("before-hydration-url");e&&await import(e),this.start()}getRetryImportUrl(e){let n=new URL(e,document.baseURI),r=\`astro-retry=\${Date.now()}\`,i=n.hash.replace(/^#/,"");return n.hash=i?\`\${i}&\${r}\`:r,n.toString()}async importWithRetry(e){try{return await import(e)}catch(n){return await new Promise(r=>setTimeout(r,1e3)),import(this.getRetryImportUrl(e))}}handleHydrationError(e){let n=this.getAttribute("component-url"),r=new CustomEvent("astro:hydration-error",{cancelable:!0,bubbles:!0,composed:!0,detail:{error:e,componentUrl:n}});this.dispatchEvent(r)&&console.error(\`[astro-island] Error hydrating \${n}\`,e)}async start(){let e=JSON.parse(this.getAttribute("opts")),n=this.getAttribute("client");if(Astro[n]===void 0){window.addEventListener(\`astro:\${n}\`,()=>this.start(),{once:!0});return}try{await Astro[n](async()=>{let r=this.getAttribute("renderer-url");try{let[i,{default:m}]=await Promise.all([this.importWithRetry(this.getAttribute("component-url")),r?this.importWithRetry(r):Promise.resolve({default:()=>()=>{}})]),a=this.getAttribute("component-export")||"default";if(a.includes(".")){this.Component=i;for(let u of a.split(".")){if(E.has(u)||!this.Component||typeof this.Component!="object"&&typeof this.Component!="function"||!Object.hasOwn(this.Component,u))throw new Error(\`Invalid component export path: \${a}\`);this.Component=this.Component[u]}}else{if(E.has(a))throw new Error(\`Invalid component export path: \${a}\`);this.Component=i[a]}return this.hydrator=m,this.hydrate}catch(i){return this.handleHydrationError(i),()=>{}}},e,this)}catch(r){this.handleHydrationError(r)}}attributeChangedCallback(){this.hydrate()}}l(f,"observedAttributes",["props"]),customElements.get("astro-island")||customElements.define("astro-island",f)}})();`;

const ISLAND_STYLES = "astro-island,astro-slot,astro-static-slot{display:contents}";

function determineIfNeedsHydrationScript(result) {
  if (result._metadata.templateDepth > 0) {
    return !result._metadata.hasHydrationScript;
  }
  if (result._metadata.hasHydrationScript) {
    return false;
  }
  return result._metadata.hasHydrationScript = true;
}
function determinesIfNeedsDirectiveScript(result, directive) {
  if (result._metadata.templateDepth > 0) {
    return !result._metadata.hasDirectives.has(directive);
  }
  if (result._metadata.hasDirectives.has(directive)) {
    return false;
  }
  result._metadata.hasDirectives.add(directive);
  return true;
}
function getDirectiveScriptText(result, directive) {
  const clientDirectives = result.clientDirectives;
  const clientDirective = clientDirectives.get(directive);
  if (!clientDirective) {
    throw new Error(`Unknown directive: ${directive}`);
  }
  return clientDirective;
}
function getPrescripts(result, type, directive) {
  switch (type) {
    case "both":
      return `<style>${ISLAND_STYLES}</style><script>${getDirectiveScriptText(result, directive)}</script><script>${process.env.NODE_ENV === "development" ? astro_island_prebuilt_dev_default : astro_island_prebuilt_default}</script>`;
    case "directive":
      return `<script>${getDirectiveScriptText(result, directive)}</script>`;
  }
}

async function collectPropagatedHeadParts(input) {
  const collectedHeadParts = [];
  const iterator = input.propagators.values();
  while (true) {
    const { value, done } = iterator.next();
    if (done) {
      break;
    }
    const returnValue = await value.init(input.result);
    if (input.isHeadAndContent(returnValue) && returnValue.head) {
      collectedHeadParts.push(returnValue.head);
    }
  }
  return collectedHeadParts;
}

function shouldRenderHeadInstruction(state) {
  return !state.hasRenderedHead && !state.partial;
}
function shouldRenderMaybeHeadInstruction(state) {
  return !state.hasRenderedHead && !state.headInTree && !state.partial;
}
function shouldRenderInstruction$1(type, state) {
  return type === "head" ? shouldRenderHeadInstruction(state) : shouldRenderMaybeHeadInstruction(state);
}

function registerIfPropagating(result, factory, instance) {
  if (factory.propagation === "self" || factory.propagation === "in-tree") {
    result._metadata.propagators.add(
      instance
    );
    return;
  }
  if (factory.moduleId) {
    const hint = result.componentMetadata.get(factory.moduleId)?.propagation;
    if (isPropagatingHint(hint ?? "none")) {
      result._metadata.propagators.add(
        instance
      );
    }
  }
}
async function bufferPropagatedHead(result) {
  const collected = await collectPropagatedHeadParts({
    propagators: result._metadata.propagators,
    result,
    isHeadAndContent
  });
  result._metadata.extraHead.push(...collected);
}
function shouldRenderInstruction(type, state) {
  return shouldRenderInstruction$1(type, state);
}
function getInstructionRenderState(result) {
  return {
    hasRenderedHead: result._metadata.hasRenderedHead,
    headInTree: result._metadata.headInTree,
    partial: result.partial
  };
}

function renderCspContent(result) {
  const finalScriptHashes = /* @__PURE__ */ new Set();
  const finalStyleHashes = /* @__PURE__ */ new Set();
  for (const scriptHash of result.scriptHashes) {
    finalScriptHashes.add(`'${scriptHash}'`);
  }
  for (const styleHash of result.styleHashes) {
    finalStyleHashes.add(`'${styleHash}'`);
  }
  for (const styleHash of result._metadata.extraStyleHashes) {
    finalStyleHashes.add(`'${styleHash}'`);
  }
  for (const scriptHash of result._metadata.extraScriptHashes) {
    finalScriptHashes.add(`'${scriptHash}'`);
  }
  let directives;
  if (result.directives.length > 0) {
    directives = result.directives.join(";") + ";";
  }
  let scriptResources = "'self'";
  if (result.scriptResources.length > 0) {
    scriptResources = result.scriptResources.map((r) => `${r}`).join(" ");
  }
  let styleResources = "'self'";
  if (result.styleResources.length > 0) {
    styleResources = result.styleResources.map((r) => `${r}`).join(" ");
  }
  const strictDynamic = result.isStrictDynamic ? ` 'strict-dynamic'` : "";
  const scriptSrc = `script-src ${scriptResources} ${Array.from(finalScriptHashes).join(" ")}${strictDynamic};`;
  const styleSrc = `style-src ${styleResources} ${Array.from(finalStyleHashes).join(" ")};`;
  return [directives, scriptSrc, styleSrc].filter(Boolean).join(" ");
}

const RenderInstructionSymbol = /* @__PURE__ */ Symbol.for("astro:render");
function createRenderInstruction(instruction) {
  return Object.defineProperty(instruction, RenderInstructionSymbol, {
    value: true
  });
}
function isRenderInstruction(chunk) {
  return chunk && typeof chunk === "object" && chunk[RenderInstructionSymbol];
}

const voidElementNames = /^(area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/i;
const htmlBooleanAttributes = /^(?:allowfullscreen|async|autofocus|autoplay|checked|controls|default|defer|disabled|disablepictureinpicture|disableremoteplayback|formnovalidate|inert|loop|muted|nomodule|novalidate|open|playsinline|readonly|required|reversed|scoped|seamless|selected|itemscope)$/i;
const AMPERSAND_REGEX = /&/g;
const DOUBLE_QUOTE_REGEX = /"/g;
const STATIC_DIRECTIVES = /* @__PURE__ */ new Set(["set:html", "set:text"]);
const INVALID_ATTR_NAME_CHAR = /[\s"'>/=]/;
const toIdent = (k) => k.trim().replace(/(?!^)\b\w|\s+|\W+/g, (match, index) => {
  if (/\W/.test(match)) return "";
  return index === 0 ? match : match.toUpperCase();
});
const toAttributeString = (value, shouldEscape = true) => shouldEscape ? String(value).replace(AMPERSAND_REGEX, "&amp;").replace(DOUBLE_QUOTE_REGEX, "&quot;") : value;
const kebab = (k) => k.toLowerCase() === k ? k : k.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
const toStyleString = (obj) => Object.entries(obj).filter(([_, v]) => typeof v === "string" && v.trim() || typeof v === "number").map(([k, v]) => {
  if (k[0] !== "-" && k[1] !== "-") return `${kebab(k)}:${v}`;
  return `${k}:${v}`;
}).join(";");
function defineScriptVars(vars) {
  let output = "";
  for (const [key, value] of Object.entries(vars)) {
    output += `const ${toIdent(key)} = ${stringifyForScript(value)};
`;
  }
  return markHTMLString(output);
}
function formatList(values) {
  if (values.length === 1) {
    return values[0];
  }
  return `${values.slice(0, -1).join(", ")} or ${values[values.length - 1]}`;
}
function isCustomElement(tagName) {
  return tagName.includes("-");
}
function handleBooleanAttribute(key, value, shouldEscape, tagName) {
  if (tagName && isCustomElement(tagName)) {
    return markHTMLString(` ${key}="${toAttributeString(value, shouldEscape)}"`);
  }
  return markHTMLString(value ? ` ${key}` : "");
}
function addAttribute(value, key, shouldEscape = true, tagName = "") {
  if (value == null) {
    return "";
  }
  if (INVALID_ATTR_NAME_CHAR.test(key)) {
    return "";
  }
  if (STATIC_DIRECTIVES.has(key)) {
    console.warn(`[astro] The "${key}" directive cannot be applied dynamically at runtime. It will not be rendered as an attribute.

Make sure to use the static attribute syntax (\`${key}={value}\`) instead of the dynamic spread syntax (\`{...{ "${key}": value }}\`).`);
    return "";
  }
  if (key === "class:list") {
    const listValue = toAttributeString(clsx(value), shouldEscape);
    if (listValue === "") {
      return "";
    }
    return markHTMLString(` ${key.slice(0, -5)}="${listValue}"`);
  }
  if (key === "style" && !(value instanceof HTMLString)) {
    if (Array.isArray(value) && value.length === 2) {
      return markHTMLString(
        ` ${key}="${toAttributeString(`${toStyleString(value[0])};${value[1]}`, shouldEscape)}"`
      );
    }
    if (typeof value === "object") {
      return markHTMLString(` ${key}="${toAttributeString(toStyleString(value), shouldEscape)}"`);
    }
  }
  if (key === "className") {
    return markHTMLString(` class="${toAttributeString(value, shouldEscape)}"`);
  }
  if (htmlBooleanAttributes.test(key)) {
    return handleBooleanAttribute(key, value, shouldEscape, tagName);
  }
  if (value === "") {
    return markHTMLString(` ${key}`);
  }
  if (key === "popover" && typeof value === "boolean") {
    return handleBooleanAttribute(key, value, shouldEscape, tagName);
  }
  if (key === "download" && typeof value === "boolean") {
    return handleBooleanAttribute(key, value, shouldEscape, tagName);
  }
  if (key === "hidden" && typeof value === "boolean") {
    return handleBooleanAttribute(key, value, shouldEscape, tagName);
  }
  return markHTMLString(` ${key}="${toAttributeString(value, shouldEscape)}"`);
}
function internalSpreadAttributes(values, shouldEscape = true, tagName) {
  let output = "";
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, shouldEscape, tagName);
  }
  return markHTMLString(output);
}
function renderElement(name, { props: _props, children = "" }, shouldEscape = true) {
  const { lang: _, "data-astro-id": astroId, "define:vars": defineVars, ...props } = _props;
  if (defineVars) {
    if (name === "style") {
      delete props["is:global"];
      delete props["is:scoped"];
    }
    if (name === "script") {
      delete props.hoist;
      children = defineScriptVars(defineVars) + "\n" + children;
    }
  }
  if ((children == null || children === "") && voidElementNames.test(name)) {
    return `<${name}${internalSpreadAttributes(props, shouldEscape, name)}>`;
  }
  return `<${name}${internalSpreadAttributes(props, shouldEscape, name)}>${children}</${name}>`;
}
const noop = () => {
};
class BufferedRenderer {
  chunks = [];
  renderPromise;
  destination;
  /**
   * Determines whether buffer has been flushed
   * to the final destination.
   */
  flushed = false;
  constructor(destination, renderFunction) {
    this.destination = destination;
    this.renderPromise = renderFunction(this);
    if (isPromise(this.renderPromise)) {
      Promise.resolve(this.renderPromise).catch(noop);
    }
  }
  write(chunk) {
    if (this.flushed) {
      this.destination.write(chunk);
    } else {
      this.chunks.push(chunk);
    }
  }
  flush() {
    if (this.flushed) {
      throw new Error("The render buffer has already been flushed.");
    }
    this.flushed = true;
    for (const chunk of this.chunks) {
      this.destination.write(chunk);
    }
    return this.renderPromise;
  }
}
function createBufferedRenderer(destination, renderFunction) {
  return new BufferedRenderer(destination, renderFunction);
}
const isNode = typeof process !== "undefined" && Object.prototype.toString.call(process) === "[object process]";
const isDeno = typeof Deno !== "undefined";
function promiseWithResolvers() {
  let resolve, reject;
  const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  return {
    promise,
    resolve,
    reject
  };
}

function stablePropsKey(props) {
  const keys = Object.keys(props).sort();
  let result = "{";
  for (let i = 0; i < keys.length; i++) {
    if (i > 0) result += ",";
    result += JSON.stringify(keys[i]) + ":" + JSON.stringify(props[keys[i]]);
  }
  result += "}";
  return result;
}
function deduplicateElements(elements) {
  if (elements.length <= 1) return elements;
  const seen = /* @__PURE__ */ new Set();
  return elements.filter((item) => {
    const key = stablePropsKey(item.props) + item.children;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
function renderAllHeadContent(result) {
  result._metadata.hasRenderedHead = true;
  let content = "";
  if (result.shouldInjectCspMetaTags && result.cspDestination === "meta") {
    content += renderElement(
      "meta",
      {
        props: {
          "http-equiv": "content-security-policy",
          content: renderCspContent(result)
        },
        children: ""
      },
      false
    );
  }
  const styles = deduplicateElements(Array.from(result.styles)).map(
    (style) => style.props.rel === "stylesheet" ? renderElement("link", style) : renderElement("style", style)
  );
  result.styles.clear();
  const scripts = deduplicateElements(Array.from(result.scripts)).map((script) => {
    if (result.userAssetsBase) {
      script.props.src = (result.base === "/" ? "" : result.base) + result.userAssetsBase + script.props.src;
    }
    return renderElement("script", script, false);
  });
  const links = deduplicateElements(Array.from(result.links)).map(
    (link) => renderElement("link", link, false)
  );
  content += styles.join("\n") + links.join("\n") + scripts.join("\n");
  content += result._metadata.extraHead.join("");
  return markHTMLString(content);
}
function renderHead() {
  return createRenderInstruction({ type: "head" });
}
function maybeRenderHead() {
  return createRenderInstruction({ type: "maybe-head" });
}

const ALGORITHMS = {
  "SHA-256": "sha256-",
  "SHA-384": "sha384-",
  "SHA-512": "sha512-"
};
const ALGORITHM_VALUES = Object.values(ALGORITHMS);
z.enum(Object.keys(ALGORITHMS)).optional().default("SHA-256");
z.custom((value) => {
  if (typeof value !== "string") {
    return false;
  }
  return ALGORITHM_VALUES.some((allowedValue) => {
    return value.startsWith(allowedValue);
  });
});
const ALLOWED_DIRECTIVES = [
  "base-uri",
  "child-src",
  "connect-src",
  "default-src",
  "fenced-frame-src",
  "font-src",
  "form-action",
  "frame-ancestors",
  "frame-src",
  "img-src",
  "manifest-src",
  "media-src",
  "object-src",
  "referrer",
  "report-to",
  "report-uri",
  "require-trusted-types-for",
  "sandbox",
  "trusted-types",
  "upgrade-insecure-requests",
  "worker-src"
];
z.custom((v) => typeof v === "string").superRefine((value, ctx) => {
  const isAllowed = ALLOWED_DIRECTIVES.some((allowedValue) => {
    return value.startsWith(allowedValue);
  });
  if (!isAllowed) {
    if (value.startsWith("script-src") || value.startsWith("style-src")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Directives \`script-src\` and \`style-src\` are not allowed in \`security.csp.directives\`. Please use \`security.csp.scriptDirective\` and \`security.csp.styleDirective\` instead.`,
        fatal: true
      });
    } else {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Invalid directive: "${value}". Allowed directives are: ${ALLOWED_DIRECTIVES.join(", ")}`,
        fatal: true
      });
    }
  }
});

const ALGORITHM = "AES-GCM";
async function decodeKey(encoded) {
  const bytes = decodeBase64(encoded);
  return crypto.subtle.importKey("raw", bytes.buffer, ALGORITHM, true, [
    "encrypt",
    "decrypt"
  ]);
}
const encoder$1 = new TextEncoder();
const decoder$1 = new TextDecoder();
const IV_LENGTH = 24;
async function encryptString(key, raw, additionalData) {
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH / 2));
  const data = encoder$1.encode(raw);
  const params = { name: ALGORITHM, iv };
  if (additionalData) {
    params.additionalData = encoder$1.encode(additionalData);
  }
  const buffer = await crypto.subtle.encrypt(params, key, data);
  return encodeHexUpperCase(iv) + encodeBase64(new Uint8Array(buffer));
}
async function decryptString(key, encoded, additionalData) {
  const iv = decodeHex(encoded.slice(0, IV_LENGTH));
  const dataArray = decodeBase64(encoded.slice(IV_LENGTH));
  const params = { name: ALGORITHM, iv };
  if (additionalData) {
    params.additionalData = encoder$1.encode(additionalData);
  }
  const decryptedBuffer = await crypto.subtle.decrypt(params, key, dataArray);
  const decryptedString = decoder$1.decode(decryptedBuffer);
  return decryptedString;
}
async function generateCspDigest(data, algorithm) {
  const hashBuffer = await crypto.subtle.digest(algorithm, encoder$1.encode(data));
  const hash = encodeBase64(new Uint8Array(hashBuffer));
  return `${ALGORITHMS[algorithm]}${hash}`;
}

const renderTemplateResultSym = /* @__PURE__ */ Symbol.for("astro.renderTemplateResult");
class RenderTemplateResult {
  [renderTemplateResultSym] = true;
  htmlParts;
  expressions;
  error;
  constructor(htmlParts, expressions) {
    this.htmlParts = htmlParts;
    this.error = void 0;
    this.expressions = expressions.map((expression) => {
      if (isPromise(expression)) {
        return Promise.resolve(expression).catch((err) => {
          if (!this.error) {
            this.error = err;
            throw err;
          }
        });
      }
      return expression;
    });
  }
  render(destination) {
    const { htmlParts, expressions } = this;
    for (let i = 0; i < htmlParts.length; i++) {
      const html = htmlParts[i];
      if (html) {
        destination.write(markHTMLString(html));
      }
      if (i >= expressions.length) break;
      const exp = expressions[i];
      if (!(exp || exp === 0)) continue;
      const result = renderChild(destination, exp);
      if (isPromise(result)) {
        const startIdx = i + 1;
        const remaining = expressions.length - startIdx;
        const flushers = new Array(remaining);
        for (let j = 0; j < remaining; j++) {
          const rExp = expressions[startIdx + j];
          flushers[j] = createBufferedRenderer(destination, (bufferDestination) => {
            if (rExp || rExp === 0) {
              return renderChild(bufferDestination, rExp);
            }
          });
        }
        return result.then(() => {
          let k = 0;
          const iterate = () => {
            while (k < flushers.length) {
              const rHtml = htmlParts[startIdx + k];
              if (rHtml) {
                destination.write(markHTMLString(rHtml));
              }
              const flushResult = flushers[k++].flush();
              if (isPromise(flushResult)) {
                return flushResult.then(iterate);
              }
            }
            const lastHtml = htmlParts[htmlParts.length - 1];
            if (lastHtml) {
              destination.write(markHTMLString(lastHtml));
            }
          };
          return iterate();
        });
      }
    }
  }
}
function isRenderTemplateResult(obj) {
  return typeof obj === "object" && obj !== null && !!obj[renderTemplateResultSym];
}
function renderTemplate(htmlParts, ...expressions) {
  return new RenderTemplateResult(htmlParts, expressions);
}

const slotString = /* @__PURE__ */ Symbol.for("astro:slot-string");
class SlotString extends HTMLString {
  instructions;
  [slotString];
  constructor(content, instructions) {
    super(content);
    this.instructions = instructions;
    this[slotString] = true;
  }
}
function isSlotString(str) {
  return !!str[slotString];
}
function mergeSlotInstructions(target, source) {
  if (source.instructions?.length) {
    target ??= [];
    target.push(...source.instructions);
  }
  return target;
}
function renderSlot(result, slotted, fallback) {
  if (!slotted && fallback) {
    return renderSlot(result, fallback);
  }
  return {
    async render(destination) {
      await renderChild(destination, typeof slotted === "function" ? slotted(result) : slotted);
    }
  };
}
async function renderSlotToString(result, slotted, fallback) {
  let content = "";
  let instructions = null;
  const temporaryDestination = {
    write(chunk) {
      if (chunk instanceof SlotString) {
        content += chunk;
        instructions = mergeSlotInstructions(instructions, chunk);
      } else if (chunk instanceof Response) return;
      else if (typeof chunk === "object" && "type" in chunk && typeof chunk.type === "string") {
        if (instructions === null) {
          instructions = [];
        }
        instructions.push(chunk);
      } else {
        content += chunkToString(result, chunk);
      }
    }
  };
  const renderInstance = renderSlot(result, slotted, fallback);
  await renderInstance.render(temporaryDestination);
  return markHTMLString(new SlotString(content, instructions));
}
async function renderSlots(result, slots = {}) {
  let slotInstructions = null;
  let children = {};
  if (slots) {
    await Promise.all(
      Object.entries(slots).map(
        ([key, value]) => renderSlotToString(result, value).then((output) => {
          if (output.instructions) {
            if (slotInstructions === null) {
              slotInstructions = [];
            }
            slotInstructions.push(...output.instructions);
          }
          children[key] = output;
        })
      )
    );
  }
  return { slotInstructions, children };
}
function createSlotValueFromString(content) {
  return function() {
    return renderTemplate`${unescapeHTML(content)}`;
  };
}

const internalProps = /* @__PURE__ */ new Set([
  "server:component-path",
  "server:component-export",
  "server:component-directive",
  "server:defer"
]);
function containsServerDirective(props) {
  return "server:component-directive" in props;
}
function createSearchParams(encryptedComponentExport, encryptedProps, slots) {
  const params = new URLSearchParams();
  params.set("e", encryptedComponentExport);
  params.set("p", encryptedProps);
  params.set("s", slots);
  return params;
}
function isWithinURLLimit(pathname, params) {
  const url = pathname + "?" + params.toString();
  const chars = url.length;
  return chars < 2048;
}
class ServerIslandComponent {
  result;
  props;
  slots;
  displayName;
  hostId;
  islandContent;
  componentPath;
  componentExport;
  componentId;
  constructor(result, props, slots, displayName) {
    this.result = result;
    this.props = props;
    this.slots = slots;
    this.displayName = displayName;
  }
  async init() {
    const content = await this.getIslandContent();
    if (this.result.cspDestination) {
      this.result._metadata.extraScriptHashes.push(
        await generateCspDigest(SERVER_ISLAND_REPLACER, this.result.cspAlgorithm)
      );
      const contentDigest = await generateCspDigest(content, this.result.cspAlgorithm);
      this.result._metadata.extraScriptHashes.push(contentDigest);
    }
    return createThinHead();
  }
  async render(destination) {
    const hostId = await this.getHostId();
    const islandContent = await this.getIslandContent();
    destination.write(createRenderInstruction({ type: "server-island-runtime" }));
    destination.write("<!--[if astro]>server-island-start<![endif]-->");
    for (const name in this.slots) {
      if (name === "fallback") {
        await renderChild(destination, this.slots.fallback(this.result));
      }
    }
    destination.write(
      `<script type="module" data-astro-rerun data-island-id="${hostId}">${islandContent}</script>`
    );
  }
  getComponentPath() {
    if (this.componentPath) {
      return this.componentPath;
    }
    const componentPath = this.props["server:component-path"];
    if (!componentPath) {
      throw new Error(`Could not find server component path`);
    }
    this.componentPath = componentPath;
    return componentPath;
  }
  getComponentExport() {
    if (this.componentExport) {
      return this.componentExport;
    }
    const componentExport = this.props["server:component-export"];
    if (!componentExport) {
      throw new Error(`Could not find server component export`);
    }
    this.componentExport = componentExport;
    return componentExport;
  }
  async getHostId() {
    if (!this.hostId) {
      this.hostId = await crypto.randomUUID();
    }
    return this.hostId;
  }
  async getIslandContent() {
    if (this.islandContent) {
      return this.islandContent;
    }
    const componentPath = this.getComponentPath();
    const componentExport = this.getComponentExport();
    const serverIslandNameMap = await this.result.getServerIslandNameMap();
    let componentId = serverIslandNameMap.get(componentPath);
    if (!componentId) {
      throw new Error(`Could not find server component name ${componentPath}`);
    }
    for (const key2 of Object.keys(this.props)) {
      if (internalProps.has(key2)) {
        delete this.props[key2];
      }
    }
    const renderedSlots = {};
    for (const name in this.slots) {
      if (name !== "fallback") {
        const content = await renderSlotToString(this.result, this.slots[name]);
        let slotHtml = content.toString();
        const slotContent = content;
        if (Array.isArray(slotContent.instructions)) {
          for (const instruction of slotContent.instructions) {
            if (instruction.type === "script") {
              slotHtml += instruction.content;
            }
          }
        }
        renderedSlots[name] = slotHtml;
      }
    }
    const key = await this.result.key;
    const componentExportEncrypted = await encryptString(
      key,
      componentExport,
      `export:${componentId}`
    );
    const propsEncrypted = Object.keys(this.props).length === 0 ? "" : await encryptString(key, JSON.stringify(this.props), `props:${componentId}`);
    const slotsEncrypted = Object.keys(renderedSlots).length === 0 ? "" : await encryptString(key, JSON.stringify(renderedSlots), `slots:${componentId}`);
    const hostId = await this.getHostId();
    const slash = this.result.base.endsWith("/") ? "" : "/";
    let serverIslandUrl = `${this.result.base}${slash}_server-islands/${componentId}${this.result.trailingSlash === "always" ? "/" : ""}`;
    const potentialSearchParams = createSearchParams(
      componentExportEncrypted,
      propsEncrypted,
      slotsEncrypted
    );
    const useGETRequest = isWithinURLLimit(serverIslandUrl, potentialSearchParams);
    if (useGETRequest) {
      serverIslandUrl += "?" + potentialSearchParams.toString();
      this.result._metadata.extraHead.push(
        markHTMLString(
          `<link rel="preload" as="fetch" href="${serverIslandUrl}" crossorigin="anonymous">`
        )
      );
    }
    const adapterHeaders = this.result.internalFetchHeaders || {};
    const headersJson = stringifyForScript(adapterHeaders);
    const method = useGETRequest ? (
      // GET request
      `const headers = new Headers(${headersJson});
let response = await fetch('${serverIslandUrl}', { headers });`
    ) : (
      // POST request
      `let data = {
	encryptedComponentExport: ${stringifyForScript(componentExportEncrypted)},
	encryptedProps: ${stringifyForScript(propsEncrypted)},
	encryptedSlots: ${stringifyForScript(slotsEncrypted)},
};
const headers = new Headers({ 'Content-Type': 'application/json', ...${headersJson} });
let response = await fetch('${serverIslandUrl}', {
	method: 'POST',
	body: JSON.stringify(data),
	headers,
});`
    );
    this.islandContent = `${method}replaceServerIsland('${hostId}', response);`;
    return this.islandContent;
  }
}
const renderServerIslandRuntime = () => {
  return `<script>${SERVER_ISLAND_REPLACER}</script>`;
};
const SERVER_ISLAND_REPLACER = markHTMLString(
  `async function replaceServerIsland(id, r) {
	let s = document.querySelector(\`script[data-island-id="\${id}"]\`);
	// If there's no matching script, or the request fails then return
	if (!s || r.status !== 200 || r.headers.get('content-type')?.split(';')[0].trim() !== 'text/html') return;
	// Load the HTML before modifying the DOM in case of errors
	let html = await r.text();
	// Remove any placeholder content before the island script
	while (s.previousSibling && s.previousSibling.nodeType !== 8 && s.previousSibling.data !== '[if astro]>server-island-start<![endif]')
		s.previousSibling.remove();
	s.previousSibling?.remove();
	// Insert the new HTML
	s.before(document.createRange().createContextualFragment(html));
	// Remove the script. Prior to v5.4.2, this was the trick to force rerun of scripts.  Keeping it to minimize change to the existing behavior.
	s.remove();
}`.split("\n").map((line) => line.trim()).filter((line) => line && !line.startsWith("//")).join(" ")
);

const Fragment = /* @__PURE__ */ Symbol.for("astro:fragment");
const Renderer = /* @__PURE__ */ Symbol.for("astro:renderer");
const encoder = new TextEncoder();
const decoder = new TextDecoder();
function stringifyChunk(result, chunk) {
  if (isRenderInstruction(chunk)) {
    const instruction = chunk;
    switch (instruction.type) {
      case "directive": {
        const { hydration } = instruction;
        const needsHydrationScript = hydration && determineIfNeedsHydrationScript(result);
        const needsDirectiveScript = hydration && determinesIfNeedsDirectiveScript(result, hydration.directive);
        if (needsHydrationScript) {
          const prescripts = getPrescripts(result, "both", hydration.directive);
          return markHTMLString(prescripts);
        } else if (needsDirectiveScript) {
          const prescripts = getPrescripts(result, "directive", hydration.directive);
          return markHTMLString(prescripts);
        } else {
          return "";
        }
      }
      case "head": {
        if (!shouldRenderInstruction("head", getInstructionRenderState(result))) {
          return "";
        }
        return renderAllHeadContent(result);
      }
      case "maybe-head": {
        if (!shouldRenderInstruction("maybe-head", getInstructionRenderState(result))) {
          return "";
        }
        return renderAllHeadContent(result);
      }
      case "renderer-hydration-script": {
        const { rendererSpecificHydrationScripts } = result._metadata;
        const { rendererName } = instruction;
        if (result._metadata.templateDepth > 0) {
          return instruction.render();
        }
        if (!rendererSpecificHydrationScripts.has(rendererName)) {
          rendererSpecificHydrationScripts.add(rendererName);
          return instruction.render();
        }
        return "";
      }
      case "server-island-runtime": {
        if (result._metadata.templateDepth > 0) {
          return renderServerIslandRuntime();
        }
        if (result._metadata.hasRenderedServerIslandRuntime) {
          return "";
        }
        result._metadata.hasRenderedServerIslandRuntime = true;
        return renderServerIslandRuntime();
      }
      case "script": {
        const { id, content } = instruction;
        if (result._metadata.templateDepth > 0) {
          return content;
        }
        if (result._metadata.renderedScripts.has(id)) {
          return "";
        }
        result._metadata.renderedScripts.add(id);
        return content;
      }
      case "template-enter": {
        result._metadata.templateDepth++;
        return "";
      }
      case "template-exit": {
        if (result._metadata.templateDepth <= 0) {
          throw new Error(
            "Unexpected template-exit instruction without a matching template-enter. This may indicate that the compiler emitted unbalanced template boundaries, or that a component manually injected a template-exit render instruction."
          );
        }
        result._metadata.templateDepth--;
        return "";
      }
      default: {
        throw new Error(`Unknown chunk type: ${chunk.type}`);
      }
    }
  } else if (chunk instanceof Response) {
    return "";
  } else if (isSlotString(chunk)) {
    let out = "";
    const c = chunk;
    if (c.instructions) {
      for (const instr of c.instructions) {
        out += stringifyChunk(result, instr);
      }
    }
    out += chunk.toString();
    return out;
  }
  return chunk.toString();
}
function chunkToString(result, chunk) {
  if (ArrayBuffer.isView(chunk)) {
    return decoder.decode(chunk);
  } else {
    return stringifyChunk(result, chunk);
  }
}
function chunkToByteArray(result, chunk) {
  if (ArrayBuffer.isView(chunk)) {
    return chunk;
  } else {
    const stringified = stringifyChunk(result, chunk);
    return encoder.encode(stringified.toString());
  }
}
function chunkToByteArrayOrString(result, chunk) {
  if (ArrayBuffer.isView(chunk)) {
    return chunk;
  } else {
    return stringifyChunk(result, chunk).toString();
  }
}
function isRenderInstance(obj) {
  return !!obj && typeof obj === "object" && "render" in obj && typeof obj.render === "function";
}

function renderChild(destination, child) {
  if (typeof child === "string") {
    destination.write(markHTMLString(escapeHTML(child)));
    return;
  }
  if (isPromise(child)) {
    return child.then((x) => renderChild(destination, x));
  }
  if (child instanceof SlotString) {
    destination.write(child);
    return;
  }
  if (isHTMLString(child)) {
    destination.write(child);
    return;
  }
  if (!child && child !== 0) {
    return;
  }
  if (Array.isArray(child)) {
    return renderArray(destination, child);
  }
  if (typeof child === "function") {
    return renderChild(destination, child());
  }
  if (isRenderInstance(child)) {
    return child.render(destination);
  }
  if (isRenderTemplateResult(child)) {
    return child.render(destination);
  }
  if (isAstroComponentInstance(child)) {
    return child.render(destination);
  }
  if (ArrayBuffer.isView(child)) {
    destination.write(child);
    return;
  }
  if (typeof child === "object" && (Symbol.asyncIterator in child || Symbol.iterator in child)) {
    if (Symbol.asyncIterator in child) {
      return renderAsyncIterable(destination, child);
    }
    return renderIterable(destination, child);
  }
  destination.write(child);
}
function renderArray(destination, children) {
  for (let i = 0; i < children.length; i++) {
    const result = renderChild(destination, children[i]);
    if (isPromise(result)) {
      if (i + 1 >= children.length) {
        return result;
      }
      const remaining = children.length - i - 1;
      const flushers = new Array(remaining);
      for (let j = 0; j < remaining; j++) {
        flushers[j] = createBufferedRenderer(destination, (bufferDestination) => {
          return renderChild(bufferDestination, children[i + 1 + j]);
        });
      }
      return result.then(() => {
        let k = 0;
        const iterate = () => {
          while (k < flushers.length) {
            const flushResult = flushers[k++].flush();
            if (isPromise(flushResult)) {
              return flushResult.then(iterate);
            }
          }
        };
        return iterate();
      });
    }
  }
}
function renderIterable(destination, children) {
  const iterator = children[Symbol.iterator]();
  const iterate = () => {
    for (; ; ) {
      const { value, done } = iterator.next();
      if (done) {
        break;
      }
      const result = renderChild(destination, value);
      if (isPromise(result)) {
        return result.then(iterate);
      }
    }
  };
  return iterate();
}
async function renderAsyncIterable(destination, children) {
  for await (const value of children) {
    await renderChild(destination, value);
  }
}

const astroComponentInstanceSym = /* @__PURE__ */ Symbol.for("astro.componentInstance");
class AstroComponentInstance {
  [astroComponentInstanceSym] = true;
  result;
  props;
  slotValues;
  factory;
  returnValue;
  constructor(result, props, slots, factory) {
    this.result = result;
    this.props = props;
    this.factory = factory;
    this.slotValues = {};
    for (const name in slots) {
      let didRender = false;
      let value = slots[name](result);
      this.slotValues[name] = () => {
        if (!didRender) {
          didRender = true;
          return value;
        }
        return slots[name](result);
      };
    }
  }
  init(result) {
    if (this.returnValue !== void 0) {
      return this.returnValue;
    }
    this.returnValue = this.factory(result, this.props, this.slotValues);
    if (isPromise(this.returnValue)) {
      this.returnValue.then((resolved) => {
        this.returnValue = resolved;
      }).catch(() => {
      });
    }
    return this.returnValue;
  }
  render(destination) {
    const returnValue = this.init(this.result);
    if (isPromise(returnValue)) {
      return returnValue.then((x) => this.renderImpl(destination, x));
    }
    return this.renderImpl(destination, returnValue);
  }
  renderImpl(destination, returnValue) {
    if (isHeadAndContent(returnValue)) {
      return returnValue.content.render(destination);
    } else {
      return renderChild(destination, returnValue);
    }
  }
}
function validateComponentProps(props, clientDirectives, displayName) {
  if (props != null) {
    const directives = [...clientDirectives.keys()].map((directive) => `client:${directive}`);
    for (const prop of Object.keys(props)) {
      if (directives.includes(prop)) {
        console.warn(
          `You are attempting to render <${displayName} ${prop} />, but ${displayName} is an Astro component. Astro components do not render in the client and should not have a hydration directive. Please use a framework component for client rendering.`
        );
      }
    }
  }
}
function createAstroComponentInstance(result, displayName, factory, props, slots = {}) {
  validateComponentProps(props, result.clientDirectives, displayName);
  const instance = new AstroComponentInstance(result, props, slots, factory);
  registerIfPropagating(result, factory, instance);
  return instance;
}
function isAstroComponentInstance(obj) {
  return typeof obj === "object" && obj !== null && !!obj[astroComponentInstanceSym];
}

const DOCTYPE_EXP = /<!doctype html/i;
async function renderToString(result, componentFactory, props, children, isPage = false, route) {
  const templateResult = await callComponentAsTemplateResultOrResponse(
    result,
    componentFactory,
    props,
    children,
    route
  );
  if (templateResult instanceof Response) return templateResult;
  let str = "";
  let renderedFirstPageChunk = false;
  if (isPage) {
    await bufferHeadContent(result);
  }
  const destination = {
    write(chunk) {
      if (isPage && !renderedFirstPageChunk) {
        renderedFirstPageChunk = true;
        if (!result.partial && !DOCTYPE_EXP.test(String(chunk))) {
          const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
          str += doctype;
        }
      }
      if (chunk instanceof Response) return;
      str += chunkToString(result, chunk);
    }
  };
  await templateResult.render(destination);
  return str;
}
async function renderToReadableStream(result, componentFactory, props, children, isPage = false, route) {
  const templateResult = await callComponentAsTemplateResultOrResponse(
    result,
    componentFactory,
    props,
    children,
    route
  );
  if (templateResult instanceof Response) return templateResult;
  let renderedFirstPageChunk = false;
  if (isPage) {
    await bufferHeadContent(result);
  }
  return new ReadableStream({
    start(controller) {
      const destination = {
        write(chunk) {
          if (isPage && !renderedFirstPageChunk) {
            renderedFirstPageChunk = true;
            if (!result.partial && !DOCTYPE_EXP.test(String(chunk))) {
              const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
              controller.enqueue(encoder.encode(doctype));
            }
          }
          if (chunk instanceof Response) {
            throw new AstroError({
              ...ResponseSentError
            });
          }
          const bytes = chunkToByteArray(result, chunk);
          controller.enqueue(bytes);
        }
      };
      (async () => {
        try {
          await templateResult.render(destination);
          controller.close();
        } catch (e) {
          if (AstroError.is(e) && !e.loc) {
            e.setLocation({
              file: route?.component
            });
          }
          setTimeout(() => controller.error(e), 0);
        }
      })();
    },
    cancel() {
      result.cancelled = true;
    }
  });
}
async function callComponentAsTemplateResultOrResponse(result, componentFactory, props, children, route) {
  const factoryResult = await componentFactory(result, props, children);
  if (factoryResult instanceof Response) {
    return factoryResult;
  } else if (isHeadAndContent(factoryResult)) {
    if (!isRenderTemplateResult(factoryResult.content)) {
      throw new AstroError({
        ...OnlyResponseCanBeReturned,
        message: OnlyResponseCanBeReturned.message(
          route?.route,
          typeof factoryResult
        ),
        location: {
          file: route?.component
        }
      });
    }
    return factoryResult.content;
  } else if (!isRenderTemplateResult(factoryResult)) {
    throw new AstroError({
      ...OnlyResponseCanBeReturned,
      message: OnlyResponseCanBeReturned.message(route?.route, typeof factoryResult),
      location: {
        file: route?.component
      }
    });
  }
  return factoryResult;
}
async function bufferHeadContent(result) {
  await bufferPropagatedHead(result);
}
async function renderToAsyncIterable(result, componentFactory, props, children, isPage = false, route) {
  const templateResult = await callComponentAsTemplateResultOrResponse(
    result,
    componentFactory,
    props,
    children,
    route
  );
  if (templateResult instanceof Response) return templateResult;
  let renderedFirstPageChunk = false;
  if (isPage) {
    await bufferHeadContent(result);
  }
  let error = null;
  let next = null;
  const buffer = [];
  let renderingComplete = false;
  const iterator = {
    async next() {
      if (result.cancelled) return { done: true, value: void 0 };
      if (next !== null) {
        await next.promise;
      } else if (!renderingComplete && !buffer.length) {
        next = promiseWithResolvers();
        await next.promise;
      }
      if (!renderingComplete) {
        next = promiseWithResolvers();
      }
      if (error) {
        throw error;
      }
      let length = 0;
      let stringToEncode = "";
      for (let i = 0, len = buffer.length; i < len; i++) {
        const bufferEntry = buffer[i];
        if (typeof bufferEntry === "string") {
          const nextIsString = i + 1 < len && typeof buffer[i + 1] === "string";
          stringToEncode += bufferEntry;
          if (!nextIsString) {
            const encoded = encoder.encode(stringToEncode);
            length += encoded.length;
            stringToEncode = "";
            buffer[i] = encoded;
          } else {
            buffer[i] = "";
          }
        } else {
          length += bufferEntry.length;
        }
      }
      let mergedArray = new Uint8Array(length);
      let offset = 0;
      for (let i = 0, len = buffer.length; i < len; i++) {
        const item = buffer[i];
        if (item === "") {
          continue;
        }
        mergedArray.set(item, offset);
        offset += item.length;
      }
      buffer.length = 0;
      const returnValue = {
        // The iterator is done when rendering has finished
        // and there are no more chunks to return.
        done: length === 0 && renderingComplete,
        value: mergedArray
      };
      return returnValue;
    },
    async return() {
      result.cancelled = true;
      return { done: true, value: void 0 };
    }
  };
  const destination = {
    write(chunk) {
      if (isPage && !renderedFirstPageChunk) {
        renderedFirstPageChunk = true;
        if (!result.partial && !DOCTYPE_EXP.test(String(chunk))) {
          const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
          buffer.push(encoder.encode(doctype));
        }
      }
      if (chunk instanceof Response) {
        throw new AstroError(ResponseSentError);
      }
      const bytes = chunkToByteArrayOrString(result, chunk);
      if (bytes.length > 0) {
        buffer.push(bytes);
        next?.resolve();
      } else if (buffer.length > 0) {
        next?.resolve();
      }
    }
  };
  const renderResult = toPromise(() => templateResult.render(destination));
  renderResult.catch((err) => {
    error = err;
  }).finally(() => {
    renderingComplete = true;
    next?.resolve();
  });
  return {
    [Symbol.asyncIterator]() {
      return iterator;
    }
  };
}
function toPromise(fn) {
  try {
    const result = fn();
    return isPromise(result) ? result : Promise.resolve(result);
  } catch (err) {
    return Promise.reject(err);
  }
}

function componentIsHTMLElement(Component) {
  return typeof HTMLElement !== "undefined" && HTMLElement.isPrototypeOf(Component);
}
async function renderHTMLElement(result, constructor, props, slots) {
  const name = getHTMLElementName(constructor);
  let attrHTML = "";
  for (const attr in props) {
    attrHTML += ` ${attr}="${toAttributeString(await props[attr])}"`;
  }
  return markHTMLString(
    `<${name}${attrHTML}>${await renderSlotToString(result, slots?.default)}</${name}>`
  );
}
function getHTMLElementName(constructor) {
  const definedName = customElements.getName(constructor);
  if (definedName) return definedName;
  const assignedName = constructor.name.replace(/^HTML|Element$/g, "").replace(/[A-Z]/g, "-$&").toLowerCase().replace(/^-/, "html-");
  return assignedName;
}

const needsHeadRenderingSymbol = /* @__PURE__ */ Symbol.for("astro.needsHeadRendering");
const rendererAliases = /* @__PURE__ */ new Map([["solid", "solid-js"]]);
const clientOnlyValues = /* @__PURE__ */ new Set(["solid-js", "react", "preact", "vue", "svelte"]);
function guessRenderers(componentUrl) {
  const extname = componentUrl?.split(".").pop();
  switch (extname) {
    case "svelte":
      return ["@astrojs/svelte"];
    case "vue":
      return ["@astrojs/vue"];
    case "jsx":
    case "tsx":
      return ["@astrojs/react", "@astrojs/preact", "@astrojs/solid-js", "@astrojs/vue (jsx)"];
    case void 0:
    default:
      return [
        "@astrojs/react",
        "@astrojs/preact",
        "@astrojs/solid-js",
        "@astrojs/vue",
        "@astrojs/svelte"
      ];
  }
}
function isFragmentComponent(Component) {
  return Component === Fragment;
}
function isHTMLComponent(Component) {
  return Component && Component["astro:html"] === true;
}
const ASTRO_SLOT_EXP = /<\/?astro-slot\b[^>]*>/g;
const ASTRO_STATIC_SLOT_EXP = /<\/?astro-static-slot\b[^>]*>/g;
function removeStaticAstroSlot(html, supportsAstroStaticSlot = true) {
  const exp = supportsAstroStaticSlot ? ASTRO_STATIC_SLOT_EXP : ASTRO_SLOT_EXP;
  return html.replace(exp, "");
}
async function renderFrameworkComponent(result, displayName, Component, _props, slots = {}) {
  if (!Component && "client:only" in _props === false) {
    throw new Error(
      `Unable to render ${displayName} because it is ${Component}!
Did you forget to import the component or is it possible there is a typo?`
    );
  }
  const { renderers, clientDirectives } = result;
  const metadata = {
    astroStaticSlot: true,
    displayName
  };
  const { hydration, isPage, props, propsWithoutTransitionAttributes } = extractDirectives(
    _props,
    clientDirectives
  );
  let html = "";
  let attrs = void 0;
  if (hydration) {
    metadata.hydrate = hydration.directive;
    metadata.hydrateArgs = hydration.value;
    metadata.componentExport = hydration.componentExport;
    metadata.componentUrl = hydration.componentUrl;
  }
  const probableRendererNames = guessRenderers(metadata.componentUrl);
  const validRenderers = renderers.filter((r) => r.name !== "astro:jsx");
  const { children, slotInstructions } = await renderSlots(result, slots);
  let renderer;
  if (metadata.hydrate !== "only") {
    let isTagged = false;
    try {
      isTagged = Component && Component[Renderer];
    } catch {
    }
    if (isTagged) {
      const rendererName = Component[Renderer];
      renderer = renderers.find(({ name }) => name === rendererName);
    }
    if (!renderer) {
      let error;
      for (const r of renderers) {
        try {
          if (await r.ssr.check.call({ result }, Component, props, children, metadata)) {
            renderer = r;
            break;
          }
        } catch (e) {
          error ??= e;
        }
      }
      if (!renderer && error) {
        throw error;
      }
    }
    if (!renderer && typeof HTMLElement === "function" && componentIsHTMLElement(Component)) {
      const output = await renderHTMLElement(
        result,
        Component,
        _props,
        slots
      );
      return {
        render(destination) {
          destination.write(output);
        }
      };
    }
  } else {
    if (metadata.hydrateArgs) {
      const rendererName = rendererAliases.has(metadata.hydrateArgs) ? rendererAliases.get(metadata.hydrateArgs) : metadata.hydrateArgs;
      if (clientOnlyValues.has(rendererName)) {
        renderer = renderers.find(
          ({ name }) => name === `@astrojs/${rendererName}` || name === rendererName
        );
      }
    }
    if (!renderer && validRenderers.length === 1) {
      renderer = validRenderers[0];
    }
    if (!renderer) {
      const extname = metadata.componentUrl?.split(".").pop();
      renderer = renderers.find(({ name }) => name === `@astrojs/${extname}` || name === extname);
    }
    if (!renderer && metadata.hydrateArgs) {
      const rendererName = metadata.hydrateArgs;
      if (typeof rendererName === "string") {
        renderer = renderers.find(({ name }) => name === rendererName);
      }
    }
  }
  let componentServerRenderEndTime;
  if (!renderer) {
    if (metadata.hydrate === "only") {
      const rendererName = rendererAliases.has(metadata.hydrateArgs) ? rendererAliases.get(metadata.hydrateArgs) : metadata.hydrateArgs;
      if (clientOnlyValues.has(rendererName)) {
        const plural = validRenderers.length > 1;
        throw new AstroError({
          ...NoMatchingRenderer,
          message: NoMatchingRenderer.message(
            metadata.displayName,
            metadata?.componentUrl?.split(".").pop(),
            plural,
            validRenderers.length
          ),
          hint: NoMatchingRenderer.hint(
            formatList(probableRendererNames.map((r) => "`" + r + "`"))
          )
        });
      } else {
        throw new AstroError({
          ...NoClientOnlyHint,
          message: NoClientOnlyHint.message(metadata.displayName),
          hint: NoClientOnlyHint.hint(
            probableRendererNames.map((r) => r.replace("@astrojs/", "")).join("|")
          )
        });
      }
    } else if (typeof Component !== "string") {
      const matchingRenderers = validRenderers.filter(
        (r) => probableRendererNames.includes(r.name)
      );
      const plural = validRenderers.length > 1;
      if (matchingRenderers.length === 0) {
        throw new AstroError({
          ...NoMatchingRenderer,
          message: NoMatchingRenderer.message(
            metadata.displayName,
            metadata?.componentUrl?.split(".").pop(),
            plural,
            validRenderers.length
          ),
          hint: NoMatchingRenderer.hint(
            formatList(probableRendererNames.map((r) => "`" + r + "`"))
          )
        });
      } else if (matchingRenderers.length === 1) {
        renderer = matchingRenderers[0];
        ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
          { result },
          Component,
          propsWithoutTransitionAttributes,
          children,
          metadata
        ));
      } else {
        throw new Error(`Unable to render ${metadata.displayName}!

This component likely uses ${formatList(probableRendererNames)},
but Astro encountered an error during server-side rendering.

Please ensure that ${metadata.displayName}:
1. Does not unconditionally access browser-specific globals like \`window\` or \`document\`.
   If this is unavoidable, use the \`client:only\` hydration directive.
2. Does not conditionally return \`null\` or \`undefined\` when rendered on the server.
3. If using multiple JSX frameworks at the same time (e.g. React + Preact), pass the correct \`include\`/\`exclude\` options to integrations.

If you're still stuck, please open an issue on GitHub or join us at https://astro.build/chat.`);
      }
    }
  } else {
    if (metadata.hydrate === "only") {
      html = await renderSlotToString(result, slots?.fallback);
    } else {
      const componentRenderStartTime = performance.now();
      ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
        { result },
        Component,
        propsWithoutTransitionAttributes,
        children,
        metadata
      ));
      if (process.env.NODE_ENV === "development")
        componentServerRenderEndTime = performance.now() - componentRenderStartTime;
    }
  }
  if (!html && typeof Component === "string") {
    const Tag = sanitizeElementName(Component);
    const childSlots = Object.values(children).join("");
    const renderTemplateResult = renderTemplate`<${Tag}${internalSpreadAttributes(
      props,
      true,
      Tag
    )}${markHTMLString(
      childSlots === "" && voidElementNames.test(Tag) ? `/>` : `>${childSlots}</${Tag}>`
    )}`;
    html = "";
    const destination = {
      write(chunk) {
        if (chunk instanceof Response) return;
        html += chunkToString(result, chunk);
      }
    };
    await renderTemplateResult.render(destination);
  }
  if (!hydration) {
    return {
      render(destination) {
        if (slotInstructions) {
          for (const instruction of slotInstructions) {
            destination.write(instruction);
          }
        }
        if (isPage || renderer?.name === "astro:jsx") {
          destination.write(html);
        } else if (html && html.length > 0) {
          destination.write(
            markHTMLString(removeStaticAstroSlot(html, renderer?.ssr?.supportsAstroStaticSlot))
          );
        }
      }
    };
  }
  const astroId = shorthash(
    `<!--${metadata.componentExport.value}:${metadata.componentUrl}-->
${html}
${serializeProps(
      props,
      metadata
    )}`
  );
  const island = await generateHydrateScript(
    { renderer, result, astroId, props, attrs },
    metadata
  );
  if (componentServerRenderEndTime && process.env.NODE_ENV === "development")
    island.props["server-render-time"] = componentServerRenderEndTime;
  let unrenderedSlots = [];
  if (html) {
    if (Object.keys(children).length > 0) {
      for (const key of Object.keys(children)) {
        let tagName = renderer?.ssr?.supportsAstroStaticSlot ? !!metadata.hydrate ? "astro-slot" : "astro-static-slot" : "astro-slot";
        let expectedHTML = key === "default" ? `<${tagName}>` : `<${tagName} name="${escapeHTML(key)}">`;
        if (!html.includes(expectedHTML)) {
          unrenderedSlots.push(key);
        }
      }
    }
  } else {
    unrenderedSlots = Object.keys(children);
  }
  const template = unrenderedSlots.length > 0 ? unrenderedSlots.map(
    (key) => `<template data-astro-template${key !== "default" ? `="${escapeHTML(key)}"` : ""}>${children[key]}</template>`
  ).join("") : "";
  island.children = `${html ?? ""}${template}`;
  if (island.children) {
    island.props["await-children"] = "";
    island.children += `<!--astro:end-->`;
  }
  return {
    render(destination) {
      if (slotInstructions) {
        for (const instruction of slotInstructions) {
          destination.write(instruction);
        }
      }
      destination.write(createRenderInstruction({ type: "directive", hydration }));
      if (hydration.directive !== "only" && renderer?.ssr.renderHydrationScript) {
        destination.write(
          createRenderInstruction({
            type: "renderer-hydration-script",
            rendererName: renderer.name,
            render: renderer.ssr.renderHydrationScript
          })
        );
      }
      const renderedElement = renderElement("astro-island", island, false);
      destination.write(markHTMLString(renderedElement));
    }
  };
}
function sanitizeElementName(tag) {
  const unsafe = /[&<>'"\s]+/;
  if (!unsafe.test(tag)) return tag;
  return tag.trim().split(unsafe)[0].trim();
}
function renderFragmentComponent(result, slots = {}) {
  const slot = slots?.default;
  const preRendered = slot?.(result);
  return {
    render(destination) {
      if (preRendered == null) return;
      return renderChild(destination, preRendered);
    }
  };
}
async function renderHTMLComponent(result, Component, _props, slots = {}) {
  const { slotInstructions, children } = await renderSlots(result, slots);
  const html = Component({ slots: children });
  const hydrationHtml = slotInstructions ? slotInstructions.map((instr) => chunkToString(result, instr)).join("") : "";
  return {
    render(destination) {
      destination.write(markHTMLString(hydrationHtml + html));
    }
  };
}
function renderAstroComponent(result, displayName, Component, props, slots = {}) {
  if (containsServerDirective(props)) {
    const serverIslandComponent = new ServerIslandComponent(result, props, slots, displayName);
    result._metadata.propagators.add(serverIslandComponent);
    return serverIslandComponent;
  }
  const instance = createAstroComponentInstance(result, displayName, Component, props, slots);
  return {
    render(destination) {
      return instance.render(destination);
    }
  };
}
function renderComponent(result, displayName, Component, props, slots = {}) {
  if (isPromise(Component)) {
    return Component.catch(handleCancellation).then((x) => {
      return renderComponent(result, displayName, x, props, slots);
    });
  }
  if (isFragmentComponent(Component)) {
    return renderFragmentComponent(result, slots);
  }
  props = normalizeProps(props);
  if (isHTMLComponent(Component)) {
    return renderHTMLComponent(result, Component, props, slots).catch(handleCancellation);
  }
  if (isAstroComponentFactory(Component)) {
    return renderAstroComponent(result, displayName, Component, props, slots);
  }
  return renderFrameworkComponent(result, displayName, Component, props, slots).catch(
    handleCancellation
  );
  function handleCancellation(e) {
    if (result.cancelled)
      return {
        render() {
        }
      };
    throw e;
  }
}
function normalizeProps(props) {
  if (props["class:list"] !== void 0) {
    const value = props["class:list"];
    delete props["class:list"];
    props["class"] = clsx(props["class"], value);
    if (props["class"] === "") {
      delete props["class"];
    }
  }
  return props;
}
async function renderComponentToString(result, displayName, Component, props, slots = {}, isPage = false, route) {
  let str = "";
  let renderedFirstPageChunk = false;
  let head = "";
  if (isPage && !result.partial && nonAstroPageNeedsHeadInjection(Component)) {
    head += chunkToString(result, maybeRenderHead());
  }
  try {
    const destination = {
      write(chunk) {
        if (isPage && !result.partial && !renderedFirstPageChunk) {
          renderedFirstPageChunk = true;
          if (!/<!doctype html/i.test(String(chunk))) {
            const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
            str += doctype + head;
          }
        }
        if (chunk instanceof Response) return;
        str += chunkToString(result, chunk);
      }
    };
    const renderInstance = await renderComponent(result, displayName, Component, props, slots);
    if (containsServerDirective(props)) {
      await bufferHeadContent(result);
    }
    await renderInstance.render(destination);
  } catch (e) {
    if (AstroError.is(e) && !e.loc) {
      e.setLocation({
        file: route?.component
      });
    }
    throw e;
  }
  return str;
}
function nonAstroPageNeedsHeadInjection(pageComponent) {
  return !!pageComponent?.[needsHeadRenderingSymbol];
}

"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_".split("").reduce((v, c) => (v[c.charCodeAt(0)] = c, v), []);
"-0123456789_".split("").reduce((v, c) => (v[c.charCodeAt(0)] = c, v), []);

export { generateCspDigest as $, ActionNotFoundError as A, renderToAsyncIterable as B, renderToReadableStream as C, renderToString as D, EndpointDidNotReturnAResponse as E, ForbiddenRewrite as F, GetStaticPathsInvalidRouteParam as G, HTMLString as H, InvalidGetStaticPathsReturn as I, addAttribute as J, decryptString as K, createSlotValueFromString as L, renderComponent as M, renderTemplate as N, NoMatchingStaticPathFound as O, PageNumberParamNotFound as P, PrerenderDynamicEndpointPathCollide as Q, ResponseSentError as R, SlotString as S, decodeKey as T, UnableToLoadLogger as U, ReservedSlotName as V, renderSlotToString as W, i18nNoLocaleFoundInPath as X, MiddlewareNoDataOrNextCalled as Y, MiddlewareNotAResponse as Z, CacheNotEnabled as _, AstroError as a, PrerenderClientAddressNotAvailable as a0, ClientAddressNotAvailable as a1, StaticClientAddressNotAvailable as a2, AstroResponseHeadersReassigned as a3, LocalsReassigned as a4, SessionStorageInitError as a5, SessionStorageSaveError as a6, LocalsNotAnObject as a7, NoImageMetadata as a8, FailedToFetchRemoteImageDimensions as a9, RemoteImageNotAllowed as aa, ExpectedImage as ab, LocalImageUsedWrongly as ac, MissingImageDimension as ad, UnsupportedImageFormat as ae, IncompatibleDescriptorOptions as af, UnsupportedImageConversion as ag, InvalidImageService as ah, ExpectedImageOptions as ai, ExpectedNotESMImage as aj, ImageMissingAlt as ak, maybeRenderHead as al, FontFamilyNotFound as am, unescapeHTML as an, MissingGetFontFileRequestUrl as ao, renderHead as ap, renderSlot as aq, createRenderInstruction as ar, InvalidComponentArgs as as, MissingSharp as at, ActionsReturnedInvalidDataError as b, RewriteWithBodyUsed as c, GetStaticPathsRequired as d, InvalidGetStaticPathsEntry as e, GetStaticPathsExpectedParams as f, markHTMLString as g, escapeHTML as h, isAstroComponentFactory as i, createAstroComponentInstance as j, isPromise as k, isHTMLString as l, mergeSlotInstructions as m, isRenderInstruction as n, isRenderTemplateResult as o, isAstroComponentInstance as p, isAPropagatingComponent as q, renderComponentToString as r, isHeadAndContent as s, isRenderInstance as t, chunkToString as u, voidElementNames as v, encoder as w, renderCspContent as x, isNode as y, isDeno as z };
