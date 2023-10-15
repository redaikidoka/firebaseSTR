import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as sgMail from "@sendgrid/mail";

// const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

// const API_KEY = functions.config();
// sgMail.setApiKey(API_KEY);

const API_KEY = functions.config().sendgrid.key;
const TEMPLATE_ID = functions.config().sendgrid.template;
sgMail.setApiKey(API_KEY);

export const scoreEmail = functions.https.onCall(async (data, context) => {
	console.log("Passed in ", data, context);
	if (!context.auth && !context.auth.token.email) {
		throw new functions.https.HttpsError("failed-precondition", "user not logged in");
	}
	const msg = {
		to: data.toEmail,
		from: context.auth.token.email,
		templateId: TEMPLATE_ID,
		dynamic_template_data: {
			functionVersion: 2,
			toEmail: data.toEmail,
			userName: data.userName,
			requesterEmail: data.requesterEmail,
			requesterName: data.requesterName,
			customMessage: data.customMessage,
			baseUrl: data.baseUrl,
			reviewUrl: data.reviewUrl,
		},
	};

	await sgMail.send(msg);

	// handle errors here

	return { success: true };
});

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
