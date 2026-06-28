export async function cloneFormData(source: FormData) {
  const formData = new FormData();

  for (const [key, value] of source.entries()) {
    if (value instanceof File) {
      formData.append(key, value, value.name);
      continue;
    }

    formData.append(key, value);
  }

  return formData;
}
