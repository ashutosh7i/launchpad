import { api, client, hasError } from '@/adapter';
import { useAuthStore } from '@/store/auth';

const login = async (username: string, password: string): Promise<any> => {
  return api({
    url: "login",
    method: "post",
    data: {
      'USERNAME': username,
      'PASSWORD': password
    }
  });
}

const getUserProfile = async (token: any): Promise<any> => {
  const authStore = useAuthStore()
  const baseURL = authStore.getBaseUrl

  try {
    const resp = await client({
      url: "user-profile",
      method: "get",
      baseURL,
      headers: {
        Authorization:  'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    });
    if (hasError(resp)) return Promise.reject("Error getting user profile: " + JSON.stringify(resp.data));
    return Promise.resolve(resp.data)
  } catch(error: any) {
    return Promise.reject(error)
  }
}

const checkLoginOptions = async (): Promise<any> => {
  return api({
    url: "/checkLoginOptions",
    method: "GET"
  });
}

const getUserPermissions = async (token: any): Promise<any> => {
  const authStore = useAuthStore()
  const baseURL = authStore.getBaseUrl
  let userPermissions = [] as any;
  const payload = {
    "viewIndex": 0,
    "viewSize": 200,
    "permissionIds": [
      "COMMERCEUSER_VIEW",
    ]
  }

  try {
    const resp = await client({
      url: "getPermissions",
      method: "post",
      baseURL,
      data: payload,
      headers: {
        Authorization:  'Bearer ' + token,
        'Content-Type': 'application/json'
      },
    });
    
    if (resp.status === 200 && resp.data.docs?.length && !hasError(resp)) {
      userPermissions = resp.data.docs.map((permission: any) => permission.permissionId);
    }

    return userPermissions;
  } catch(error: any) {
    return Promise.reject(error)
  }
}

export const UserService = {
  getUserProfile,
  checkLoginOptions,
  login,
  getUserPermissions
}