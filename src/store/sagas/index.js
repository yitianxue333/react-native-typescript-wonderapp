import { all } from "redux-saga/effects";
import { watchGetTopics } from "./topics";
import {
  watchLoginUser,
  watchLogoutUser,
  watchGetUser,
  watchForgotPassword,
  watchUpdateUser,
  watchRegisterUser,
  watchUpdateImage,
  watchUpdateVideo,
  watchDeleteProfileImageSaga,
  watchDeleteProfileVideoSaga,
  watchDeactivateAccount,
  watchGetVerificationSaga
} from "./user";
import {
  watchGetNewProposal,
  watchRateProposal,
  watchGetNextProposal,
} from "./proposal";
import {
  watchCreateAppointment,
  watchGetAppointments,
  watchConfirmtAppointment,
  watchcancelAppointmentSaga,
  watchDeclineAppointmentSaga,
} from "./appointment";
import {
  watchGetPartners,
  watchGetPartnerActivities,
  watchGetActivityDetails,
  watchBlockUser,
} from "./partner";
import {
  watchGetConversation,
  watchGetConversations,
  watchSendMessage,
  watchGhostContact,
} from "./conversations";
import { watchSubmitFeedback } from "./feedback";
import {
  watchGetAttendances,
  watchDeleteAttendance,
  watchReviewDateSaga,
} from "./attendance";

export default function* rootSaga() {
  yield all([
    watchGetTopics(),

    // User
    watchLoginUser(),
    watchGetUser(),
    watchUpdateUser(),
    watchDeleteProfileImageSaga(),
    watchDeleteProfileVideoSaga(),
    watchUpdateImage(),
    watchUpdateVideo(),
    watchRegisterUser(),
    watchLogoutUser(),
    watchForgotPassword(),
    watchDeactivateAccount(),
    watchGetVerificationSaga(),

    // Proposals
    watchGetNewProposal(),
    watchRateProposal(),
    watchGetNextProposal(),

    // Appointments
    watchGetAppointments(),
    watchCreateAppointment(),
    watchConfirmtAppointment(),
    watchcancelAppointmentSaga(),
    watchDeclineAppointmentSaga(),
    // Attendances
    watchGetAttendances(),
    watchDeleteAttendance(),
    watchReviewDateSaga(),

    // Partners
    watchGetPartners(),
    watchGetPartnerActivities(),
    watchGetActivityDetails(),
    watchBlockUser(),

    // Conversation
    watchGetConversation(),
    watchGetConversations(),
    watchSendMessage(),
    watchGhostContact(),

    // Feedback
    watchSubmitFeedback(),
  ]);
}
