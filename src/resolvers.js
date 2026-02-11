// src/resolvers.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';

import { User } from './models/User.js';
import { Employee } from './models/Employee.js';

import {
  validateSignup,
  validateLogin,
  validateEmployeeCreate,
  validateEmployeeUpdate,
} from './validators.js';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

if (!JWT_SECRET) throw new Error('JWT_SECRET missing');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

function requireAuth(context) {
  if (!context?.userId) throw new Error('Unauthorized');
}

async function uploadEmployeePhotoIfAny(employee_photo) {
  if (!employee_photo) return null;

  const res = await cloudinary.uploader.upload(employee_photo, {
    folder: 'comp3133/employees',
    resource_type: 'image',
  });

  return res.secure_url;
}

export const resolvers = {
  Query: {
    health: () => 'OK',

    async login(parent, { usernameOrEmail, password }) {
      await validateLogin({ usernameOrEmail, password });

      const user = await User.findOne({
        $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      });

      const ok = user ? await bcrypt.compare(password, user.password) : false;
      if (!user || !ok) throw new Error('Invalid credentials');

      const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
      });

      return { user, token };
    },

    async getAllEmployees(parent, args, context) {
      requireAuth(context);
      return Employee.find().sort({ created_at: -1 });
    },

    async searchEmployeeByEid(parent, { eid }, context) {
      requireAuth(context);
      return Employee.findById(eid);
    },

    async searchEmployeeByDesignationOrDepartment(parent, { designation, department }, context) {
      requireAuth(context);

      const filter = {};
      if (designation) filter.designation = designation;
      if (department) filter.department = department;

      return Employee.find(filter).sort({ created_at: -1 });
    },
  },

  Mutation: {
    async signup(parent, { username, email, password }) {
      await validateSignup({ username, email, password });

      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) throw new Error('Username or email already exists');

      const user = new User({ username, email, password });
      await user.save();

      const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
      });

      return { user, token };
    },

    async addNewEmployee(parent, { input }, context) {
      requireAuth(context);
      await validateEmployeeCreate(input);

      const photoUrl = await uploadEmployeePhotoIfAny(input.employee_photo);

      const employee = new Employee({
        ...input,
        employee_photo: photoUrl ?? undefined,
        date_of_joining: new Date(input.date_of_joining),
      });

      await employee.save();
      return employee;
    },

    async updateEmployeeByEid(parent, { eid, input }, context) {
      requireAuth(context);
      await validateEmployeeUpdate(input);

      const employee = await Employee.findById(eid);
      if (!employee) throw new Error('Employee not found');

      if (input.employee_photo) {
        employee.employee_photo = await uploadEmployeePhotoIfAny(input.employee_photo);
      }

      if (input.date_of_joining) employee.date_of_joining = new Date(input.date_of_joining);

      for (const key of ['first_name', 'last_name', 'email', 'gender', 'designation', 'salary', 'department']) {
        if (input[key] !== undefined) employee[key] = input[key];
      }

      await employee.save();
      return employee;
    },

    async deleteEmployeeByEid(parent, { eid }, context) {
      requireAuth(context);

      const res = await Employee.findByIdAndDelete(eid);
      return !!res;
    },
  },
};
