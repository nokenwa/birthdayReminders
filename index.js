require("dotenv").config();
const Twilio = require("twilio")(
	process.env.TWILIO_ACCOUNT_SID,
	process.env.TWILIO_AUTH_TOKEN
);
const Airtable = require("airtable");
const twilio = require("twilio");
const base = new Airtable({ apiKey: "key5aqKhmVFW6P2d7" }).base(
	"appsci2g30qRDdb4Y"
);

base("Friends")
	.select()
	.all()
	.then((records) => {
		// Filter out records where birth days are unknown
		const knownBdays = records.filter(
			(record) =>
				record.fields["Birthday Month"] && record.fields["Birthday Day"]
		);
		// Map useful information to new array
		const birthdays = knownBdays.map((record) => {
			return {
				name: `${record.fields["First Name"]} ${record.fields["Last Name"]}`,
				bdayMonth: record.fields["Birthday Month"],
				bdayDay: record.fields["Birthday Day"],
			};
		});
		// Filter out Birthdays that are not today
		const today = new Date();
		const todayBirthdays = birthdays.filter(
			(record) =>
				record.bdayMonth === today.getMonth() + 1 &&
				record.bdayDay === today.getDate()
		);
		todayBirthdays.forEach((friend) => {
			Twilio.messages.create({
				from: process.env.TWILIO_NUMBER,
				to: process.env.MOBILE_NUMBER,
				body: `It is ${friend.name}'s birthday today. Don't forget to wish them a Happy Birthday.`,
			});
		});
	});
