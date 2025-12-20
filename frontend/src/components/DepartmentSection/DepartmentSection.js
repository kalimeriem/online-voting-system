import React from "react";
import { useNavigate } from "react-router-dom";
import "./DepartmentSection.css";
import DepartmentCard from "../DepartmentCard/DepartmentCard";

const DepartmentSection = ({ departments, currentUserEmail }) => {
  const navigate = useNavigate();

  return (
    <div className="team-sec">
      <div className="team-g">
        {departments.map((dept) => {
          // Normalize department data for DepartmentCard
          const normalizedDept = {
            id: dept.id,
            name: dept.name,
            description: dept.description,
            desc: dept.description,
            members: dept.members?.length || 0,
            role: dept.role || (dept.isManager ? 'Manager' : 'Member'),
            isManager: dept.isManager,
          };

          return (
            <DepartmentCard
              key={dept.id}
              department={normalizedDept}
              onClick={() => navigate(`/departments/${dept.id}`)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default DepartmentSection;
