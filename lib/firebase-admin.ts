import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const serviceAccount = require("../private/firebase-service-account.json");

const adminApp =
  getApps().find((app) => app.name === "admin") ||
  initializeApp(
    {
      credential: cert(serviceAccount),
    },
    "admin"
  );

export const adminAuth = getAuth(adminApp);