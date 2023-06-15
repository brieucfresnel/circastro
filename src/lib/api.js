import dotenv from 'dotenv';
dotenv.config();
const API_URL = process.env.WP_URL;

async function fetchAPI(endpoint, params) {
  const headers = { 'Content-Type': 'application/json' };

  const url = API_URL + endpoint;

  const options = {
    method: 'GET',
    headers
  }

  if (params) {
    options.method = 'POST'
    options.body = JSON.stringify(params);
  }

  const res = await fetch(url, options);

  const json = await res.json();

  if (json.errors) {
    console.log(json.errors);
    throw new Error('Failed to fetch API');
  }

  return json;
}

export async function getAllPages() {
  const data = await fetchAPI('/pages?per_page=100')
  return data;
}

export async function getPageBySlug(slug) {
  const data = await fetchAPI(`/pages?slug=${slug}`)
  return data;
}