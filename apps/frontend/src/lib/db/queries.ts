import { API_URL } from '../constants';
import { AiLanguage, Project, ProjectType, Query, Table } from '../types';
import { errorResponse, successResponse } from '../utils';

export async function login({ email, password }: { email: string; password: string }) {
	try {
		const response = await fetch(`${API_URL}/auth/login`, {
			method: 'POST',
			body: JSON.stringify({ email, password }),
		});

		if (!response.ok) return errorResponse(response.statusText);

		const jsonResponse = await response.json();

		if (jsonResponse.status === 500) return errorResponse(jsonResponse.message);

		return successResponse(jsonResponse.data);
	} catch (error: unknown) {
		return errorResponse(error instanceof Error ? error.message : 'Error signing in an user');
	}
}

export async function register({ email, password }: { email: string; password: string }) {
	try {
		const response = await fetch(`${API_URL}/auth/register`, {
			method: 'POST',
			body: JSON.stringify({ email, password }),
		});

		if (!response.ok) return errorResponse(response.statusText);

		const jsonResponse = await response.json();

		if (jsonResponse.status === 500) return errorResponse(jsonResponse.message);

		return successResponse(jsonResponse.message);
	} catch (error: unknown) {
		return errorResponse(error instanceof Error ? error.message : 'Error registering in an user');
	}
}

export async function listProjects({ token }: { token: string }) {
	try {
		const response = await fetch(`${API_URL}/project`, {
			headers: {
				Authorization: token,
			},
		});

		if (!response.ok) return errorResponse(response.statusText);

		const jsonResponse = await response.json();

		if (jsonResponse.status === 500) return errorResponse(jsonResponse.message);

		const dataResponse = jsonResponse.data as { projects: Project[] };

		return successResponse(dataResponse);
	} catch (error: unknown) {
		return errorResponse(error instanceof Error ? error.message : 'Error listing projects');
	}
}

export async function createProject({
	databaseUrl,
	type,
	projectTitle,
	userToken,
}: {
	databaseUrl: string;
	type: ProjectType;
	projectTitle: string;
	userToken: string;
}) {
	try {
		const response = await fetch(`${API_URL}/project`, {
			method: 'POST',
			body: JSON.stringify({ databaseUrl, type, projectTitle }),
			headers: {
				Authorization: userToken,
			},
		});

		if (!response.ok) return errorResponse(response.statusText);

		const jsonResponse = await response.json();

		if (jsonResponse.status === 500) return errorResponse(jsonResponse.message);

		const dataResponse = { projectId: jsonResponse.data.projectId, message: jsonResponse.message } as {
			projectId: string;
			message: string;
		};

		return successResponse(dataResponse);
	} catch (error: unknown) {
		return errorResponse(error instanceof Error ? error.message : 'Error creatting project');
	}
}

export async function editProject({
	projectId,
	projectTitle,
	userToken,
}: {
	projectId: string;
	projectTitle: string;
	userToken: string;
}) {
	try {
		const response = await fetch(`${API_URL}/project/${projectId}`, {
			method: 'PATCH',
			body: JSON.stringify({ title: projectTitle }),
			headers: {
				Authorization: userToken,
			},
		});

		if (!response.ok) return errorResponse(response.statusText);

		const jsonResponse = await response.json();

		if (jsonResponse.status === 500) return errorResponse(jsonResponse.message);

		const dataResponse = { message: jsonResponse.message } as {
			message: string;
		};

		return successResponse(dataResponse);
	} catch (error: unknown) {
		return errorResponse(error instanceof Error ? error.message : 'Error editting project');
	}
}

export async function describeProject({ projectId, userToken }: { projectId: string; userToken: string }) {
	try {
		const response = await fetch(`${API_URL}/project/${projectId}`, {
			headers: {
				Authorization: userToken,
			},
			cache: 'no-store',
			next: { tags: ['describeProject'] },
		});

		if (!response.ok) return errorResponse(response.statusText);

		const jsonResponse = await response.json();

		if (jsonResponse.status === 500) return errorResponse(jsonResponse.message);

		const dataResponse = {
			type: jsonResponse.data.type,
			title: jsonResponse.data.title,
			tables: jsonResponse.data.tables,
			message: jsonResponse.message,
		} as {
			type: ProjectType;
			title: string;
			tables: Table[];
			message: string;
		};

		return successResponse(dataResponse);
	} catch (error: unknown) {
		return errorResponse(error instanceof Error ? error.message : 'Error listing projects');
	}
}

export async function applyQuery({
	projectId,
	query,
	language,
	userToken,
}: {
	projectId: string;
	query: string;
	language: AiLanguage;
	userToken: string;
}) {
	try {
		const response = await fetch(`${API_URL}/query/${projectId}`, {
			method: 'POST',
			body: JSON.stringify({ query, language }),
			headers: {
				Authorization: userToken,
			},
		});

		if (!response.ok) return errorResponse(response.statusText);

		const jsonResponse = await response.json();

		if (jsonResponse.status === 500) return errorResponse(jsonResponse.message);

		const dataResponse = { response: jsonResponse.data.response, message: jsonResponse.message } as {
			response: string;
			message: string;
		};

		return successResponse(dataResponse);
	} catch (error: unknown) {
		return errorResponse(error instanceof Error ? error.message : 'Error applying query, please try again later');
	}
}

export async function updateQuery({
	projectId,
	queryId,
	query,
	language,
	userToken,
}: {
	projectId: string;
	queryId: string;
	query: string;
	language: AiLanguage;
	userToken: string;
}) {
	try {
		const response = await fetch(`${API_URL}/query/${projectId}`, {
			method: 'POST',
			body: JSON.stringify({ queryId, query, language }),
			headers: {
				Authorization: userToken,
			},
		});

		if (!response.ok) return errorResponse(response.statusText);

		const jsonResponse = await response.json();

		if (jsonResponse.status === 500) return errorResponse(jsonResponse.message);

		const dataResponse = { response: jsonResponse.data.response, message: jsonResponse.message } as {
			response: string;
			message: string;
		};

		return successResponse(dataResponse);
	} catch (error: unknown) {
		return errorResponse(error instanceof Error ? error.message : 'Error applying query, please try again later');
	}
}

export async function listQueries({ token, projectId }: { token: string; projectId: string }) {
	try {
		const response = await fetch(`${API_URL}/query/list/${projectId}`, {
			headers: {
				Authorization: token,
			},
			next: { tags: ['listQueries'] },
		});

		if (!response.ok) return errorResponse(response.statusText);

		const jsonResponse = await response.json();

		if (jsonResponse.status === 500) return errorResponse(jsonResponse.message);

		const dataResponse = jsonResponse.data as { queries: Query[] };

		return successResponse(dataResponse);
	} catch (error: unknown) {
		return errorResponse(error instanceof Error ? error.message : 'Error listing queries');
	}
}

export async function deleteQuery({ queryId, token }: { queryId: string; token: string }) {
	try {
		const response = await fetch(`${API_URL}/query/${queryId}`, {
			method: 'DELETE',
			headers: {
				Authorization: token,
			},
		});

		if (!response.ok) return errorResponse(response.statusText);

		const jsonResponse = await response.json();

		if (jsonResponse.status === 500) return errorResponse(jsonResponse.message);

		return successResponse('Query successfully deleted');
	} catch (error: unknown) {
		return errorResponse(error instanceof Error ? error.message : 'Error deletting query');
	}
}

export async function describeTable({
	projectId,
	tableTitle,
	userToken,
}: {
	projectId: string;
	tableTitle: string;
	userToken: string;
}) {
	try {
		const response = await fetch(`${API_URL}/table/${projectId}/${tableTitle}`, {
			headers: {
				Authorization: userToken,
			},
		});

		if (!response.ok) return errorResponse(response.statusText);

		const jsonResponse = await response.json();

		if (jsonResponse.status === 500) return errorResponse(jsonResponse.message);

		const dataResponse = {
			data: jsonResponse.data,
			message: jsonResponse.message,
		} as {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			data: {
				key: string;
				value: string;
			}[][];
			message: string;
		};

		return successResponse(dataResponse);
	} catch (error: unknown) {
		return errorResponse(error instanceof Error ? error.message : 'Error listing projects');
	}
}

export async function deleteProject({ projectId, token }: { projectId: string; token: string }) {
	try {
		const response = await fetch(`${API_URL}/project/${projectId}`, {
			method: 'DELETE',
			headers: {
				Authorization: token,
			},
		});

		if (!response.ok) return errorResponse(response.statusText);

		const jsonResponse = await response.json();

		if (jsonResponse.status === 500) return errorResponse(jsonResponse.message);

		return successResponse('Project successfully deleted');
	} catch (error: unknown) {
		return errorResponse(error instanceof Error ? error.message : 'Error deletting project');
	}
}
