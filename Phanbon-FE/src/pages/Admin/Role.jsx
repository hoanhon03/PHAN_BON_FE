import React from "react";
import useFetchRoles from "../../hooks/useFetchRoles";

const Role = () => {
  const role = useFetchRoles();
  return <div>{role && role.length}</div>;
};

export default Role;
