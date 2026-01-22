import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0', // Standard version
    info: {
      title: 'DynamicForms API',
      version: '1.0.0',
      description: 'API Documentation for the Multi-tenant Backend',
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1', // This matches your routes
        description: 'Local Development Server',
      },
    ],
  },
  // CRITICAL: This tells Swagger to read comments in your route files
  apis: ['./src/routes/*.ts'], 
};

export const swaggerSpec = swaggerJSDoc(options);