const getError = (err: Error): string|undefined => {
  try {
    const parsedError = JSON.parse(err.message);
    const parsedMessage = JSON.parse(parsedError.message)

    return parsedMessage?.errorDescription;
  } catch (e) {
    return undefined;
  }
};

export { getError };
