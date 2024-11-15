import { host } from "../globalRoutes";

export const fetchProjectsRoute = `${host}/research_procedures/api/get-projects/`;
export const fetchUsernameRoute = `${host}/research_procedures/api/get-user/`;
export const expenditureFormSubmissionRoute = (role, rspc_admin, rspc_admin_designation) =>
    `${host}/research_procedures/api/create-expenditure/?u_d=${role}&r=${rspc_admin}&r_d=${rspc_admin_designation}`;
export const staffFormSubmissionRoute = (role, rspc_admin, rspc_admin_designation) =>
    `${host}/research_procedures/api/create-staff/?u_d=${role}&r=${rspc_admin}&r_d=${rspc_admin_designation}`;
export const fetchPIDsRoute = (username) => `${host}/research_procedures/api/get-PIDs/?lead_id=${username}`;
export const fetchExpenditureRequestsRoute = (pid) => `${host}/research_procedures/api/get-expenditure/?pid=${pid}`;
export const fetchStaffRequestsRoute = (pid) => `${host}/research_procedures/api/get-staff/?pid=${pid}`;
export const fetchInboxRoute = (username, designation) => `${host}/research_procedures/api/get-inbox/?username=${username}&designation=${designation}`;