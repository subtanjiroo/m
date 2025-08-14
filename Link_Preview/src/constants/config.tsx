export const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN || "https://platform.leandix.com";

export const API_ENDPOINTS = {
  	LOGIN: `${API_DOMAIN}/api/authentication/login`,
	REGISTER: `${API_DOMAIN}/api/authentication/register`,					// POST
	VERIFY_USER: `${API_DOMAIN}/api/authentication/verify_user`,			// POST
	LOGIN_STATUS: `${API_DOMAIN}/api/authentication/login_status`,			// GET
	LOGOUT: `${API_DOMAIN}/api/authentication/logout`,						// POST
	REFRESH_TOKEN: `${API_DOMAIN}/api/authentication/refresh_token`,		// ĐỢI ANH THỊNH XEM XÉT LẠI!!!
	
	// Chat
	CHAT: `${API_DOMAIN}/api/chat/`,										// POST
	GET_CHAT_TASK: `${API_DOMAIN}/api/chat/task/`,							// POST
	GET_CHAT_HISTORY: `${API_DOMAIN}/api/chat/history/`,					// GET
	GET_MESSAGE: `${API_DOMAIN}/api/chat/history/`,							// GET
	DELETE_CHAT: `${API_DOMAIN}/api/chat/history/`,							// DELETE
	GET_CHAT_STATUS: `${API_DOMAIN}/api/chat/history/share/status/`,		// GET
	PUT_SHARE_CHAT: `${API_DOMAIN}/api/chat/history/share/status/`,			// PUT
	GET_SHARE_CHAT: `${API_DOMAIN}/api/chat/history/share/`,				// GET
	GET_CHAT_MODEL: `${API_DOMAIN}/api/chat/model/`,						// GET

	// API Keys
	PR_API_CREATE: `${API_DOMAIN}/api/api_key_management/private/`,	// POST
	PR_API_LIST: `${API_DOMAIN}/api/api_key_management/private/`,			// GET
	PR_API_STATUS_TOGGLE: `${API_DOMAIN}/api/api_key_management/private/status/`,			// PUT 
	PR_API_DELETE: `${API_DOMAIN}/api/api_key_management/private/`,			// DELETE /{id}

	// Tasks
	GET_TASK_LIST: `${API_DOMAIN}/api/task/`,								// GET
	CREATE_TASK: `${API_DOMAIN}/api/task`,									// POST
	UPDATE_TASK: `${API_DOMAIN}/api/task`,									// PUT
	GET_TASK_CONV: `${API_DOMAIN}/api/task`,// /task/{task_id}/conversations | GET

	// User
	GET_USER: `${API_DOMAIN}/api/user/info`,								// GET
	UPDATE_USER: `${API_DOMAIN}/api/user/info`,								// PUT
	GET_USER_USAGE: `${API_DOMAIN}/api/user/usage`,							// GET
}
