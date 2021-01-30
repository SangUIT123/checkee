import mongoose from "mongoose";

const { MONGODB_URI } = process.env

async function dbConnect() {
	if (mongoose.connection.readyState >= 1) {
		console.log("MongoDB readyState: " + mongoose.connection.readyState);
		return;
	}

	try {
		await mongoose.connect(MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false,
		});

		console.log("MongoDB Connected: " + mongoose.connection.readyState);
	} catch (error) {
		console.log(error);
	}
};

export default dbConnect