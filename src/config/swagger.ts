import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0', 
    info: {
      title: 'DynamicForms API',
      version: '1.0.0',
      description: 'API Documentation for the Multi-tenant Backend',
    },
    servers: [
      {
        url: '/api/v1', 
        description: 'Version 1 API',
      },
    ],
  },

  apis: ['./src/routes/*.ts'], 
};

export const swaggerSpec = swaggerJSDoc(options);