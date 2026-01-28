const Project = require('../models/Project.js');
const Client = require('../models/Client.js');

const {
	GraphQLObjectType,
	GraphQLID,
	GraphQLString,
	GraphQLSchema,
	GraphQLList,
	GraphQLNonNull,
	GraphQLEnumType,
} = require('graphql');

// Project Type Enum
const ProjectStatusEnum = new GraphQLEnumType({
	name: 'ProjectStatus',
	values: {
		NEW: { value: 'Not Started' },
		IN_PROGRESS: { value: 'In Progress' },
		COMPLETE: { value: 'Completed' },
	},
});

// Client Type
const ClientType = new GraphQLObjectType({
	name: 'Client',
	fields: () => ({
		id: { type: GraphQLNonNull(GraphQLID) },
		name: { type: GraphQLString },
		email: { type: GraphQLString },
		phone: { type: GraphQLString },
	}),
});

// Project Type
const ProjectType = new GraphQLObjectType({
	name: 'Project',
	fields: () => ({
		id: { type: GraphQLNonNull(GraphQLID) },
		name: { type: GraphQLString },
		description: { type: GraphQLString },
		status: { type: ProjectStatusEnum },
		client: {
			type: ClientType,
			resolve(parent, args) {
				return Client.findById(parent.clientId);
			},
		},
	}),
});

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		clients: {
			type: new GraphQLList(ClientType),
			resolve(parent, args) {
				return Client.find();
			},
		},
		client: {
			type: ClientType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				return Client.findById(args.id);
			},
		},
		projects: {
			type: new GraphQLList(ProjectType),
			resolve(parent, args) {
				return Project.find();
			},
		},
		project: {
			type: ProjectType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				return Project.findById(args.id);
			},
		},
	},
});

// Mutations
const mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		// Client CRUD
		addClient: {
			type: ClientType,
			args: {
				name: { type: GraphQLNonNull(GraphQLString) },
				email: { type: GraphQLNonNull(GraphQLString) },
				phone: { type: GraphQLNonNull(GraphQLString) },
			},
			resolve(parent, args) {
				const client = new Client({
					name: args.name,
					email: args.email,
					phone: args.phone,
				});

				return client.save();
			},
		},
		deleteClient: {
			type: ClientType,
			args: {
				id: { type: GraphQLNonNull(GraphQLID) },
			},
			resolve(parent, args) {
				return Client.findByIdAndDelete(args.id);
			},
		},
		updateClient: {
			type: ClientType,
			args: {
				id: { type: GraphQLNonNull(GraphQLID) },
				name: { type: GraphQLString },
				email: { type: GraphQLString },
				phone: { type: GraphQLString },
			},
			resolve(parents, args) {
				const updates = {};

				if (args.name !== undefined) updates.name = args.name;
				if (args.email !== undefined) updates.email = args.email;
				if (args.phone !== undefined) updates.phone = args.phone;

				return Client.findByIdAndUpdate(args.id, updates, { new: true });
			},
		},
		// Project CRUD
		addProject: {
			type: ProjectType,
			args: {
				name: { type: GraphQLNonNull(GraphQLString) },
				description: { type: GraphQLNonNull(GraphQLString) },
				status: {
					type: ProjectStatusEnum,
					defaultValue: 'Not Started',
				},
				clientId: { type: GraphQLNonNull(GraphQLID) },
			},
			resolve(parent, args) {
				const project = new Project({
					name: args.name,
					description: args.description,
					status: args.status,
					clientId: args.clientId,
				});

				return project.save();
			},
		},
		deleteProject: {
			type: ProjectType,
			args: {
				id: { type: GraphQLNonNull(GraphQLID) },
			},
			resolve(parent, args) {
				return Project.findByIdAndDelete(args.id);
			},
		},
		updateProject: {
			type: ProjectType,
			args: {
				id: { type: GraphQLNonNull(GraphQLID) },
				name: { type: GraphQLString },
				description: { type: GraphQLString },
				status: { type: ProjectStatusEnum },
			},
			resolve(parent, args) {
				const updates = {};

				if (args.name !== undefined) updates.name = args.name;
				if (args.description !== undefined) updates.description = args.description;
				if (args.status !== undefined) updates.status = args.status;

				return Project.findByIdAndUpdate(args.id, updates, { new: true });
			},
		},
	},
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation,
});
