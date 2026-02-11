// src/schema.js
export const typeDefs = `#graphql
  type User {
    _id: ID!
    username: String!
    email: String!
    createdAt: String
    updatedAt: String
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  type Employee {
    _id: ID!
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    designation: String!
    salary: Float!
    date_of_joining: String!
    department: String!
    employee_photo: String
    created_at: String
    updated_at: String
  }

  input EmployeeInput {
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    designation: String!
    salary: Float!
    date_of_joining: String!
    department: String!
    employee_photo: String
  }

  input EmployeeUpdateInput {
    first_name: String
    last_name: String
    email: String
    gender: String
    designation: String
    salary: Float
    date_of_joining: String
    department: String
    employee_photo: String
  }

  type Query {
    health: String!

    # required auth/login query in your resolvers
    login(usernameOrEmail: String!, password: String!): AuthPayload!

    getAllEmployees: [Employee!]!
    searchEmployeeByEid(eid: ID!): Employee
    searchEmployeeByDesignationOrDepartment(designation: String, department: String): [Employee!]!
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): AuthPayload!

    addNewEmployee(input: EmployeeInput!): Employee!
    updateEmployeeByEid(eid: ID!, input: EmployeeUpdateInput!): Employee!
    deleteEmployeeByEid(eid: ID!): Boolean!
  }
`;
