// src/services/resources.js
// This file handles all API calls to your resources endpoints

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-backend-url.com'; // Update with your actual backend URL

export const resourcesAPI = {
  // Get all resource categories
  getCategories: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/resources/categories`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      return await response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      return { categories: [] };
    }
  },

  // Get resources by category (faith, professional, self-help, community)
  getResourcesByCategory: async (category) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/resources/${category}`);
      if (!response.ok) throw new Error(`Failed to fetch ${category} resources`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${category} resources:`, error);
      return { resources: [] };
    }
  },

  // Get all resources
  getAllResources: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/resources`);
      if (!response.ok) throw new Error('Failed to fetch resources');
      return await response.json();
    } catch (error) {
      console.error('Error fetching all resources:', error);
      return {};
    }
  },

  // Get therapists (optionally filtered by parish)
  getTherapists: async (parish = null) => {
    try {
      const url = parish 
        ? `${API_BASE_URL}/api/therapists?parish=${encodeURIComponent(parish)}`
        : `${API_BASE_URL}/api/therapists`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch therapists');
      return await response.json();
    } catch (error) {
      console.error('Error fetching therapists:', error);
      return { therapists: [] };
    }
  },

  // Get available parishes
  getParishes: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/therapists/parishes`);
      if (!response.ok) throw new Error('Failed to fetch parishes');
      return await response.json();
    } catch (error) {
      console.error('Error fetching parishes:', error);
      return { parishes: [] };
    }
  },

  // Get specific resource by ID
  getResourceById: async (resourceId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/resource/${resourceId}`);
      if (!response.ok) throw new Error('Resource not found');
      return await response.json();
    } catch (error) {
      console.error('Error fetching resource:', error);
      return null;
    }
  }
};