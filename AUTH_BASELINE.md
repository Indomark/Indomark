# Indomark authentication baseline

This repository uses one canonical authentication flow.

Login: Firebase email/password -> IndoVerification login OTP -> OTP verification -> local session/profile sync -> home.

Signup: collect details -> IndoVerification signup OTP -> Firebase account creation -> profile sync -> home.

Frontend must persist the backend `challengeId` returned by OTP request/resend and send that same challengeId during verification.

Do not add OTP bypasses, hard-coded OTPs, alternate verification paths, or second authentication implementations.

Email templates and auth behavior are owned by the IndoVerification backend. Future changes must be additive and must not restore older commits.
