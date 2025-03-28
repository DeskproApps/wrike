/** Date */
export const LOCALE = "en-GB";

/** Deskpro */
export const APP_PREFIX = "wrike";

export const ENTITY = "linkedWrikeTasks";

export const DEFAULT_ERROR = "There was an error!";

export const LOG_IN_TYPE_STATE = 'wrikeLogInType';

export const logInTypes = {
  ACCESS_TOKEN: 'accessToken',
  OAUTH2: 'oauth2'
};

export const GLOBAL_CLIENT_ID = '8U2Rv3l2';

export const OAUTH2_ACCESS_TOKEN_PATH = 'oauth2/access_token';

export const OAUTH2_REFRESH_TOKEN_PATH = 'oauth2/refresh_token';

export const placeholders = {
  ACCESS_TOKEN: "__access_token__",
  OAUTH: `[user[${OAUTH2_ACCESS_TOKEN_PATH}]]`
};

/** Wrike */
export const BASE_URL = "https://www.wrike.com";

export const CustomFieldsMap = {
  Text: "Text",
  Numeric: "Numeric",
  Currency: "Currency",
  Percentage: "Percentage",
  Duration: "Duration",
  Date: "Date",
  Checkbox: "Checkbox",
  Contacts: "Contacts",
  DropDown: "DropDown",
  Multiple: "Multiple",
};

export const IMPORTANCES = ["High", "Normal", "Low"];
