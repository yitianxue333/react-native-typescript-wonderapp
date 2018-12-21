export interface UserAuth {
  uid: string | null;
  token: string | null;
}

export default interface UserCredentials {
  email: string;
  password: string;
  onSuccess?: Function;
}

interface UserCredentialsResponsePayload {
  sub: string;
}

export interface UserCredentialsResponse {
  payload: UserCredentialsResponsePayload;
  token: string;
}
