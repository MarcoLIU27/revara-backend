import { TuserUpdateSchema } from './../types/zod';
import { db } from '../utils/db.server';
import { TloginRead, TloginRequest } from '../types/general';

export const getUserByUsername = async (username: string): Promise<TloginRead | null> => {
  return db.users.findUnique({
    where: {
      username: username,
    },
    select: {
      id: true,
      full_name: true,
      username: true,
      email: true,
      password: true,
      role: true,
      status: true,
      email_verified: true,
      profile_image: true,
      credits: true,
    },
  });
};

export const getUserByEmail = async (email: string): Promise<TloginRead | null> => {
  return db.users.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
      full_name: true,
      username: true,
      email: true,
      role: true,
      password: true,
      status: true,
      email_verified: true,
      profile_image: true,
      credits: true,
    },
  });
};

export const getUserByID = async (id: string): Promise<TloginRead | null> => {
  return db.users.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      full_name: true,
      username: true,
      email: true,
      role: true,
      password: true,
      status: true,
      email_verified: true,
      profile_image: true,
      credits: true,
    },
  });
};

export const createUser = async (userData: {
  fullName: string;
  username: string;
  email: string;
  password: string;
}): Promise<TloginRequest> => {
  return db.users.create({
    data: {
      full_name: userData.fullName,
      username: userData.username,
      email: userData.email,
      password: userData.password,
    },
    select: {
      id: true,
      full_name: true,
      username: true,
      email: true,
      role: true,
      status: true,
      email_verified: true,
      profile_image: true,
      credits: true,
    },
  });
};

export const updateUserByID = async (
  id: string,
  data: Partial<TuserUpdateSchema>
): Promise<Omit<TloginRequest, 'id'> | null> => {
  return db.users.update({
    where: { id },
    data: {
      full_name: data.fullName,
      password: data.password,
    },
    select: {
      full_name: true,
      username: true,
      email: true,
      role: true,
      status: true,
      email_verified: true,
      profile_image: true,
      credits: true,
    },
  });
};

