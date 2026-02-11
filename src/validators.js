// src/validators.js
import { checkSchema, validationResult } from 'express-validator';
import { GraphQLError } from 'graphql';

async function runValidation(schema, data) {
  const req = { body: data }; // fake req object for express-validator
  const chains = checkSchema(schema);

  for (const chain of chains) {
    await chain.run(req);
  }

  const result = validationResult(req);
  if (!result.isEmpty()) {
    throw new GraphQLError('Validation failed', {
      extensions: {
        code: 'BAD_USER_INPUT',
        errors: result.array(), // [{ msg, path, ... }]
      },
    });
  }
}

// Schemas (keep short + match assignment constraints)
export const validateSignup = (input) =>
  runValidation(
    {
      username: { in: ['body'], notEmpty: { errorMessage: 'username is required' } },
      email: { in: ['body'], isEmail: { errorMessage: 'email must be valid' } },
      password: {
        in: ['body'],
        isLength: { options: { min: 6 }, errorMessage: 'password must be at least 6 chars' },
      },
    },
    input
  );

export const validateLogin = (input) =>
  runValidation(
    {
      usernameOrEmail: { in: ['body'], notEmpty: { errorMessage: 'usernameOrEmail is required' } },
      password: { in: ['body'], notEmpty: { errorMessage: 'password is required' } },
    },
    input
  );

export const validateEmployeeCreate = (input) =>
  runValidation(
    {
      first_name: { in: ['body'], notEmpty: { errorMessage: 'first_name is required' } },
      last_name: { in: ['body'], notEmpty: { errorMessage: 'last_name is required' } },
      email: { in: ['body'], isEmail: { errorMessage: 'email must be valid' } },
      gender: {
        in: ['body'],
        isIn: { options: [['Male', 'Female', 'Other']], errorMessage: 'gender must be Male/Female/Other' },
      },
      designation: { in: ['body'], notEmpty: { errorMessage: 'designation is required' } },
      salary: {
        in: ['body'],
        isFloat: { options: { min: 1000 }, errorMessage: 'salary must be >= 1000' },
      },
      date_of_joining: { in: ['body'], notEmpty: { errorMessage: 'date_of_joining is required' } },
      department: { in: ['body'], notEmpty: { errorMessage: 'department is required' } },
    },
    input
  );

export const validateEmployeeUpdate = (input) =>
  runValidation(
    {
      email: { in: ['body'], optional: true, isEmail: { errorMessage: 'email must be valid' } },
      gender: {
        in: ['body'],
        optional: true,
        isIn: { options: [['Male', 'Female', 'Other']], errorMessage: 'gender must be Male/Female/Other' },
      },
      salary: {
        in: ['body'],
        optional: true,
        isFloat: { options: { min: 1000 }, errorMessage: 'salary must be >= 1000' },
      },
    },
    input
  );
