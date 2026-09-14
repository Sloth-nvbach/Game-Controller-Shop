const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(endpoint, options = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export async function getControllers(params = {}) {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set("page", params.page);
  if (params.limit) searchParams.set("limit", params.limit);
  if (params.search) searchParams.set("search", params.search);
  if (params.brand) searchParams.set("brand", params.brand);
  if (params.minPrice) searchParams.set("minPrice", params.minPrice);
  if (params.maxPrice) searchParams.set("maxPrice", params.maxPrice);
  if (params.connection) searchParams.set("connection", params.connection);
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

  const queryString = searchParams.toString();
  return request(`/controllers${queryString ? `?${queryString}` : ""}`);
}

export async function getControllerById(id) {
  return request(`/controllers/${id}`);
}

export async function createController(productData, authHeader) {
  return request("/controllers", {
    method: "POST",
    headers: authHeader,
    body: JSON.stringify(productData),
  });
}

export async function updateController(id, productData, authHeader) {
  return request(`/controllers/${id}`, {
    method: "PUT",
    headers: authHeader,
    body: JSON.stringify(productData),
  });
}

export async function deleteController(id, authHeader) {
  return request(`/controllers/${id}`, {
    method: "DELETE",
    headers: authHeader,
  });
}