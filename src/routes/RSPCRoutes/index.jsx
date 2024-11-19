import { host } from "../globalRoutes";

export const fetchProjectsRoute = `${host}/research_procedures/api/get-projects/`;
export const fetchUsernameRoute = `${host}/research_procedures/api/get-user/`;
export const projectFormSubmissionRoute = `${host}/research_procedures/api/add-project/`;
export const projectEditRoute = `${host}/research_procedures/api/edit-project/`;
export const expenditureFormSubmissionRoute = (
  role,
  rspc_admin,
  rspc_admin_designation,
) =>
  `${host}/research_procedures/api/create-expenditure/?u_d=${role}&r=${rspc_admin}&r_d=${rspc_admin_designation}`;
export const staffFormSubmissionRoute = (
  role,
  rspc_admin,
  rspc_admin_designation,
) =>
  `${host}/research_procedures/api/create-staff/?u_d=${role}&r=${rspc_admin}&r_d=${rspc_admin_designation}`;
export const fetchPIDsRoute = (username) =>
  `${host}/research_procedures/api/get-PIDs/?lead_id=${username}`;
export const fetchExpenditureRequestsRoute = (pid) =>
  `${host}/research_procedures/api/get-expenditure/?pid=${pid}`;
export const fetchStaffRequestsRoute = (pid) =>
  `${host}/research_procedures/api/get-staff/?pid=${pid}`;
export const fetchInboxRoute = (username, designation) =>
  `${host}/research_procedures/api/get-inbox/?username=${username}&designation=${designation}`;
export const fetchProcessedRoute = (username, designation) =>
  `${host}/research_procedures/api/get-processed/?username=${username}&designation=${designation}`;
export const fetchFileRoute = (fileID) =>
  `${host}/research_procedures/api/get-file/?file_id=${fileID}`;
export const forwardFileRoute = `${host}/research_procedures/api/forward-file/`;
export const fetchFileTrackingHistoryRoute = (fileID) =>
  `${host}/research_procedures/api/get-history/?file_id=${fileID}`;
export const rejectFileRoute = (fileID) =>
  `${host}/research_procedures/api/reject-file/?file_id=${fileID}`;
export const approveFileRoute = (fileID) =>
  `${host}/research_procedures/api/approve-file/?file_id=${fileID}`;
export const endProjectRoute = (rspc_admin) =>
  `${host}/research_procedures/api/end-project/?r=${rspc_admin}`;
export const acceptProjectCompletionRoute = (pid) =>
  `${host}/research_procedures/api/accept-completion/?pid=${pid}`;
