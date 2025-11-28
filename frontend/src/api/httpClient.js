export const httpClient = {
  post: async (url, data) => {
    const response = await fetch(`https://api.example.com${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw result;
    return result;
  },
};