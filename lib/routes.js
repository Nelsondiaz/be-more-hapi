'use strict';
var hapi        = require('hapi'),
	Joi = require('joi'),
	handlers    = require('../lib/handlers.js'),
	routes,
	resultModel,
	sumModel,
	listModel;



resultModel = hapi.types.object({
	equals: hapi.types.number(),
}).options({
  className: 'Result'
});

sumModel = hapi.types.object({
	id: hapi.types.String().required(),
	a: hapi.types.number().required(),
	b: hapi.types.number().required(),
	operator: hapi.types.String().required().description('either +, -, /, or *'),
	equals: hapi.types.number().required(),
	created: hapi.types.string().required().isoDate().description('ISO date string'),
	modified: hapi.types.string().isoDate().description('ISO date string'),
}).options({
  className: 'Sum'
});

listModel = hapi.types.object({
	items: hapi.types.array().includes(sumModel),
	count: hapi.types.number().required(),
	pageSize: hapi.types.number().required(),
	page: hapi.types.number().required(),
	pageCount: hapi.types.number().required()
}).options({
  className: 'List'
});




// adds the routes and validation for api
routes = [{
		method: 'GET',
		path: '/',
		config: {
			handler: handlers.index
		}
	}, {
		method: 'GET',
		path: '/images/{file*}',
		handler:{
		    directory:{
			path:'./node_modules/hapi-swagger/public/swaggerui/images'
		    }
		}
	}, {
		method: 'PUT',
		path: '/sum/add/{a}/{b}',
		config: {
			handler: handlers.add,
			description: 'Add',
			tags: ['api'],
			jsonp: 'callback',
			notes: [
				'Adds together two numbers and return the result',
				'Error status codes',
				'400, bad request'
			],
			validate: { 
				path: {
					a: hapi.types.Number()
						.required()
						.description('the first number'),

					b: hapi.types.Number()
						.required()
						.description('the second number')
				}
			},
			response: {schema : resultModel}
		}
	},{
		method: 'PUT',
		path: '/sum/subtract/{a}/{b}',
		config: {
			handler: handlers.subtract,
			description: 'Subtract',
			notes: [
				'Subtracts the second number from the first and return the result',
				'Error status codes',
				'400, bad request'
			],
			tags: ['api'],
			jsonp: 'callback',
			validate: { 
				path: {
					a: hapi.types.Number()
						.required()
						.description('the first number'),

					b: hapi.types.Number()
						.required()
						.description('the second number')
				}
			},
			response: {schema : resultModel}
		}
	},{
		method: 'PUT',
		path: '/sum/divide/{a}/{b}',
		config: {
			handler: handlers.divide,
			description: 'Divide',
			notes: [
				'Divides the first number by the second and return the result',
				'Error status codes',
				'400, bad request'
			],
			tags: ['api'],
			jsonp: 'callback',
			validate: { 
				path: {
					a: hapi.types.Number()
						.required()
						.description('the first number - can NOT be 0'),

					b: hapi.types.Number()
						.required()
						.description('the second number - can NOT be 0')
				}
			},
			response: {schema : resultModel}
		}
	},{
		method: 'PUT',
		path: '/sum/multiple/{a}/{b}',
		config: {
			handler: handlers.multiple,
			description: 'Multiple',
			notes: [
				'Multiples the two numbers together and return the result',
				'Error status codes',
				'400, bad request'
			],
			tags: ['api'],
			jsonp: 'callback',
			validate: { 
				path: {
					a: hapi.types.Number()
						.required()
						.description('the first number'),

					b: hapi.types.Number()
						.required()
						.description('the second number')
				}
			},
			response: {schema : resultModel}
		}
	},{
		method: 'GET',
		path: '/store/',
		config: {
			handler: handlers.storeList,
			description: 'List sums',
			notes: [
				'List the sums in the data store',
				'Error status codes',
				'400, bad request'
			],
			tags: ['api'],
			jsonp: 'callback',
			validate: { 
				query: {
					page: hapi.types.Number()
						.description('the page number'),

					pagesize: hapi.types.Number()
						.description('the number of items to a page')
				}
			},
			response: {schema : listModel}
		}
	},  {
		method: 'GET',
		path: '/store/{id}',
		config: {
			handler: handlers.storeItem,
			description: 'Get sum',
			notes: [
				'Get a sum from the store',
				'Error status codes',
				'400, bad request',
				'404, sum not found'
			],
			tags: ['api'],
			jsonp: 'callback',
			validate: { 
				path: {
					id: hapi.types.String()
						.required()
						.description('the id of the sum in the store')
				}
			},
			response: {schema : sumModel}
		}
	},  {
		method: 'POST',
		path: '/store/',
		config: {
			handler: handlers.storeAdd,
			description: 'Add sum',
			notes: [
				'Adds a sum to the data store',
				'Error status codes',
				'400, bad request'
			],
			tags: ['api'],
			jsonp: 'callback',
			validate: { 
				query: {
					a: hapi.types.Number()
						.required()
						.description('the first number'),

					b: hapi.types.Number()
						.required()
						.description('the second number'),

					operator: hapi.types.String()
						.required()
						.description('the opertator i.e. + - / or *'),

					equals: hapi.types.Number()
						.required()
						.description('the result of the sum')
				}
			},
			response: {schema : sumModel}
		}
	},  {
		method: 'PUT',
		path: '/store/{id}',
		config: {
			handler: handlers.storeUpdate,
			description: 'Update sum',
			notes: [
				'Update a sum in our data store',
				'Error status codes',
				'400, bad request',
				'404, sum not found'
			],
			tags: ['api'],
			jsonp: 'callback',
			validate: {
				path: {
					id: hapi.types.String()
						.required()
						.description('the id of the sum in the store')
				}, 
				query: {
					a: hapi.types.Number()
						.required()
						.description('the first number'),

					b: hapi.types.Number()
						.required()
						.description('the second number'),

					operator: hapi.types.String()
						.required()
						.description('the opertator i.e. + - / or *'),

					equals: hapi.types.Number()
						.required()
						.description('the result of the sum')
				}
			},
			response: {schema : sumModel}
		}
	}, {
		method: 'DELETE',
		path: '/store/{id}',
		config: {
			handler: handlers.storeRemove,
			description: 'Delete sums',
			notes: [
				'Delete a sums from the data store',
				'Error status codes',
				'400, bad request',
				'404, sum not found'
			],
			tags: ['api'],
			jsonp: 'callback',
			validate: { 
				path: {
					id: hapi.types.String()
						.required()
						.description('the id of the sum in the store')
				}
			}
		}
	}, {
		method: 'GET',
		path: '/{path*}',
		handler: {
			directory: {
				path: './public',
				listing: false,
				index: true
			}
		}
	}];



/*    {
		method: 'POST',
		path: '/sum/batch',
		config: {
			handler: handlers.batch,
			description: 'Batch',
			notes: 'Run a batch of sum requests',
			tags: ['api'],
			jsonp: 'callback',
			validate: { 
				query: {
					requests: hapi.types.Array()
				}
			}
		}
	}, */


exports.routes = routes;
