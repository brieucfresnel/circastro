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
  return await fetchAPI('/wp/v2/pages?per_page=100&_embedded')
}

export async function getAllPageSlugs() {
  return await fetchAPI('/dot/page-slugs');
}

export async function getPageBySlug(slug) {
  return await fetchAPI(`/wp/v2/pages?slug=${slug}&_embedded`)
}

export async function getMenu(location) {
  return await fetchAPI(`/menus/v1/locations/${location}`)
}

export async function getOptions() {
  return await fetchAPI('/dot/options/all');
}

export async function getOption(slug) {
  return fetchAPI(`/dot/options/${slug}`)
}

export async function getMedia(id) {
  return fetchAPI(`/wp/v2/media/${id}`);
}