export function appendIfValid(formData, key, value) {
  if (value !== undefined && value !== null && value !== 'undefined' && value !== 'null' && value !== ''){
    return formData.append(key, value);
  }
};
