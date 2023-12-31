import { ITask } from "../api/types";

export const parseJsonErrorMessage = (error: string) => {
  try {
    const parsedError = JSON.parse(error);

    return `Status: ${parsedError.status} \n Message: ${parsedError.message}`;
  } catch {
    return error;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getObjectValue = (obj: any, keyString: string) => {
  const keys = keyString.split(".");

  let value = obj;

  for (const key of keys) {
    value = value[key];

    if (value === undefined) {
      return undefined;
    }
  }

  return value;
};

export const makeFirstLetterUppercase = (str: string) => {
  if (!str) return str;

  return str.charAt(0).toUpperCase() + str.slice(1);
};

export function createObjectWithoutKeys(
  originalObject: Record<string, string>,
  keysToExclude: string[]
) {
  const newObject: Record<string, string> = {};

  for (const key in originalObject) {
    if (
      !keysToExclude.includes(key) &&
      !(key === "workspace" && originalObject[key] == null)
    ) {
      newObject[key] = originalObject[key];
    }
  }

  return newObject;
}

export const substitutePlaceholders = (
  string: string,
  obj: Record<string, string>
) => {
  for (const [key, value] of Object.entries(obj)) {
    string = string.replace(new RegExp(`__${key}__`, "g"), value);
  }
  return string;
};

export const putColumnKeysNewObj = (data: ITask) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newObj: any = {};

  Object.keys(data).forEach((key) => {
    if (key.endsWith("_customField")) {
      newObj.customFields = newObj.customFields || [];

      newObj.customFields.push({
        id: key.replace("_customField", ""),
        value: data[key as keyof typeof data] as string,
      });
    } else if (key.endsWith("_date")) {
      newObj.dates = newObj.dates || {};

      newObj.dates[key.replace("_date", "") as keyof typeof newObj.dates] =
        data[key as keyof typeof data] as string;
    } else {
      newObj[key as keyof typeof newObj] = data[
        key as keyof typeof data
      ] as (typeof newObj)[keyof typeof newObj];
    }
  });

  return newObj;
};

export const mutateDangerouslySetHTML = (htmlString?: string): string => {
  if (!htmlString) {
    return "-";
  }

  if (typeof DOMParser === "undefined") {
    return htmlString;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  const links = doc.getElementsByTagName("a");

  for (let i = 0; i < links.length; i++) {
    links[i].setAttribute("target", "_blank");
  }

  const images = doc.getElementsByTagName("img");

  for (let i = 0; i < images.length; i++) {
    images[i].setAttribute("style", "max-width: 100%;");
  }

  if (doc.getElementsByTagName("*").length === 3) {
    const urlPattern = /https?:\/\/\S+/g;

    // Replace URLs with anchor tags
    const replacedText = doc
      .getElementsByTagName("body")[0]
      .innerHTML.replace(urlPattern, (match) => {
        return `<a href="${match}" target="_blank">${match}</a>`;
      });

    doc.getElementsByTagName("body")[0].innerHTML = replacedText;
  }

  return doc.documentElement.outerHTML;
};
