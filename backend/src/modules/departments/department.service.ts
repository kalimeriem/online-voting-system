import prisma from "../../db/prisma";
import type { Department, DepartmentMember } from "@prisma/client";


export const createDepartment = async (
  name: string,
  description: string,
  creatorId: number
): Promise<Department> => {
  const department = await prisma.department.create({
    data: {
      name,
      description,
      members: {
        create: {
          userId: creatorId,
          isManager: true
        }
      }
    },
    include: { members: true }
  });

  return department;
};

export const getUserDepartments = async (userId: number): Promise<Department[]> => {
  const departments = await prisma.departmentMember.findMany({
    where: { userId },
    include: { department: true }
  });

  return departments.map((d: DepartmentMember & { department: Department }) => d.department);
};
