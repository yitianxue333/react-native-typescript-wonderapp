import NavigatorService from '../../services/navigation';
import { select, call, put, takeEvery } from 'redux-saga/effects';
import { createAction, Action } from 'redux-actions';
import api from '../../services/api';
import { persistUser, persistAuth } from '../actions/user';

import { Toast } from 'native-base';
import {
  resetRegistration,
  persistRegistrationInfo
} from '../reducers/registration';
import { persistUserPhone } from '../reducers/user';
import WonderAppState from '../../models/wonder-app-state';
import User from '../../models/user';
import UserCredentials from '../../models/user-credentials';
import ProfileImage from '../../models/profile-image';
import { handleAxiosError } from './utils';

export const GET_VERIFICATION = 'GET_VERIFICATION';
export const getVerification = createAction(GET_VERIFICATION);
export function* getVerificationSaga(action: Action<any>) {
  try {
    const state: WonderAppState = yield select();

    const { data }: { data: User } = yield call(api, {
      method: 'POST',
      url: '/verifications',
      data: {
        verify: {
          country_code: '1',
          phone_number: action.payload
        }
      }
    });
    yield put(persistUserPhone(action.payload));
    NavigatorService.navigate('Verify');
  } catch (error) {
    handleAxiosError(error);
  }
}

export function* watchGetVerificationSaga() {
  yield takeEvery(GET_VERIFICATION, getVerificationSaga);
}

export const DEACTIVATE_ACCOUNT = 'DEACTIVATE_ACCOUNT';
export const deactivateAccount = createAction(DEACTIVATE_ACCOUNT);
export function* deactivateAccountSaga(action: Action<any>) {
  try {
    const state: WonderAppState = yield select();
    const { id, token }: { id: number; token: string } = action.payload;

    const authHeader = {
      auth: {
        token
      }
    };

    const deleteRes = yield call(
      api,
      {
        method: 'DELETE',
        url: `/users/${id}`,
        data: {
          user: {
            push_device_id: '',
            push_device_type: ''
          }
        }
      },
      authHeader
    );
    // log user out
    yield put(persistAuth({}));
    yield put(persistUser({}));

    NavigatorService.reset('Onboarding', null);
  } catch (error) {
    handleAxiosError(error);
  }
}

export function* watchDeactivateAccount() {
  yield takeEvery(DEACTIVATE_ACCOUNT, deactivateAccountSaga);
}

export const REGISTER_USER = 'REGISTER_USER';
export const registerUser = createAction(REGISTER_USER);
export function* registerUserSaga() {
  try {
    const state: WonderAppState = yield select();

    const { data }: { data: User } = yield call(api, {
      method: 'POST',
      url: '/users',
      data: {
        user: state.registration
      }
    });

    yield put(persistRegistrationInfo(data));
    NavigatorService.navigate('Register3');

    // yield put(loginUser({ email, password }));
  } catch (error) {
    handleAxiosError(error);
  }
}

export function* watchRegisterUser() {
  yield takeEvery(REGISTER_USER, registerUserSaga);
}

// send forgot password
export const FORGOT_PASSWORD = 'FORGOT_PASSWORD';
export const forgotPassword = createAction(FORGOT_PASSWORD);

export function* forgotPasswordSaga(action: Action<any>) {
  try {
    if (action.payload) {
      const { forgotEmail } = action.payload;
      Toast.show({ text: `Email sent to ${forgotEmail}` });
    }
  } catch (error) {
    handleAxiosError(error);
  }
}

export function* watchForgotPassword() {
  yield takeEvery(FORGOT_PASSWORD, forgotPasswordSaga);
}

export const LOGIN_USER = 'LOGIN_USER';
export const loginUser = createAction(LOGIN_USER);
export function* loginUserSaga(action: Action<UserCredentials>) {
  try {
    if (action.payload) {
      const { phone, code } = action.payload;
      const response = yield call(api, {
        method: 'POST',
        url: '/user_tokens',
        data: {
          phone_auth: {
            country_code: '1',
            phone_number: phone,
            verification_code: code
          }
        }
      });

      yield put(persistAuth(response.data));
      yield put(resetRegistration());
      NavigatorService.reset('Main', null);
    }
  } catch (error) {
    handleAxiosError(error);
  }
}

export function* watchLoginUser() {
  yield takeEvery(LOGIN_USER, loginUserSaga);
}

const LOGOUT_USER = 'LOGOUT_USER';
export const logoutUser = createAction(LOGOUT_USER);
export function* logoutUserSaga(action: Action<any>) {
  try {
    // try to clean push token, but do not blocks user from logout
    const { id, token }: { id: number; token: string } = action.payload;

    const authHeader = {
      auth: {
        token
      }
    };

    yield call(
      api,
      {
        method: 'PUT',
        url: `/users/${id}`,
        data: {
          user: {
            push_device_id: '',
            push_device_type: ''
          }
        }
      },
      authHeader
    );
  } catch (error) {}

  yield put(persistAuth({}));
  yield put(persistUser({}));
  NavigatorService.reset('Onboarding', null);
}

export function* watchLogoutUser() {
  yield takeEvery(LOGOUT_USER, logoutUserSaga);
}

const GET_USER = 'GET_USER';
export const getUser = createAction(GET_USER);
export function* getUserSaga() {
  try {
    const state: WonderAppState = yield select();
    const { auth } = state.user;
    const { auth_token, id } = state.registration;

    // if updating photo on registration
    if (!state.user.auth.token) {
      const uid = id;
      const authHeader = {
        auth: {
          token: auth_token.token
        }
      };

      const { data }: { data: User } = yield call(
        api,
        {
          method: 'GET',
          url: `/users/${uid}`
        },
        authHeader
      );

      console.log(`persisting user data:`, data);
      yield put(persistUser(data));
    } else {
      const { data }: { data: User } = yield call(
        api,
        {
          method: 'GET',
          url: `/users/${auth.uid}`
        },
        state.user
      );
      yield put(persistUser(data));
    }
  } catch (error) {
    handleAxiosError(error);
  }
}

export function* watchGetUser() {
  yield takeEvery(GET_USER, getUserSaga);
}

const UPDATE_USER = 'UPDATE_USER';
export const updateUser = createAction(UPDATE_USER);
export function* updateUserSaga(action: Action<any>) {
  try {
    const state: WonderAppState = yield select();
    const { auth } = state.user;

    const profile: Partial<User> = action.payload;

    const { data }: { data: User } = yield call(
      api,
      {
        method: 'PUT',
        url: `/users/${auth.uid}`,
        data: {
          user: profile
        }
      },
      state.user
    );

    yield put(persistUser(data));
  } catch (error) {
    handleAxiosError(error);
  } finally {
  }
}

export function* watchUpdateUser() {
  yield takeEvery(UPDATE_USER, updateUserSaga);
}

const UPDATE_IMAGE = 'UPDATE_IMAGE';
export const updateImage = createAction(UPDATE_IMAGE);
export function* updateImageSaga(action: Action<any>) {
  try {
    const state: WonderAppState = yield select();
    const { auth } = state.user;
    const { auth_token, id, phone } = state.registration;
    const body = new FormData();
    const profile: Partial<any> = action.payload;
    const photo = {
      uri: profile.uri,
      type: 'image/jpeg',
      name: Date.now() + '.jpg'
    };
    body.append('image', photo);
    const token = auth.token || auth_token.token;
    const uid = auth.uid || id;

    const authHeader = {
      auth: {
        token
      }
    };

    const { data }: { data: any } = yield call(
      api,
      {
        method: 'POST',
        url: `/users/${uid}/images`,
        data: body
      },
      authHeader
    );

    console.log(`posted another image:`, data);

    yield put(getUser());
  } catch (error) {
    handleAxiosError(error);
  } finally {
  }
}

export function* watchUpdateImage() {
  yield takeEvery(UPDATE_IMAGE, updateImageSaga);
}

const DELETE_PROFILE_IMAGE = 'DELETE_PROFILE_IMAGE';
export const deleteProfileImage = createAction(DELETE_PROFILE_IMAGE);
export function* deleteProfileImageSaga(action: Action<any>) {
  try {
    const asset: ProfileImage = action.payload;
    if (asset) {
      const state: WonderAppState = yield select();
      const { auth } = state.user;

      yield put(getUser());
    }
  } catch (error) {
    handleAxiosError(error);
  }
}

export function* watchDeleteProfileImageSaga() {
  yield takeEvery(DELETE_PROFILE_IMAGE, deleteProfileImageSaga);
}

const DELETE_PROFILE_VIDEO = 'DELETE_PROFILE_VIDEO';
export const deleteProfileVideo = createAction(DELETE_PROFILE_VIDEO);
export function* deleteProfileVideoSaga() {
  try {
    const state: WonderAppState = yield select();
    const { auth } = state.user;

    yield put(getUser());
  } catch (error) {
    handleAxiosError(error);
  }
}

export function* watchDeleteProfileVideoSaga() {
  yield takeEvery(DELETE_PROFILE_VIDEO, deleteProfileVideoSaga);
}

const UPDATE_VIDEO = 'UPDATE_VIDEO';
export const updateVideo = createAction(UPDATE_VIDEO);
export function* updateVideoSaga(action: Action<any>) {
  try {
    const state: WonderAppState = yield select();
    const { auth } = state.user;
    const { auth_token, id } = state.registration;

    const body = new FormData();
    const profile: Partial<any> = action.payload;
    const video = {
      uri: profile.uri,
      type: 'video/mp4',
      name: Date.now() + '.mp4'
    };
    body.append('video', video);

    const token = auth.token || auth_token.token;
    const uid = auth.uid || id;

    const authHeader = {
      auth: {
        token
      }
    };

    const { data }: { data: any } = yield call(
      api,
      {
        method: 'POST',
        url: `/users/${uid}/video`,
        data: body
      },
      authHeader
    );

    console.log(`posted a video:`, data);

    yield put(getUser());
  } catch (error) {
    handleAxiosError(error);
  } finally {
  }
}

export function* watchUpdateVideo() {
  yield takeEvery(UPDATE_VIDEO, updateVideoSaga);
}
