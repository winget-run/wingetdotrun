import crypto from "node:crypto";

export const createMd5Hash = (value: string) => {
	const hash = crypto.createHash("md5");
	hash.setEncoding("hex");
	hash.write(value);
	hash.end();

	return hash.read();
};

// TODO: make this more comprehensive (good place for tests?)
export const compareVersionString = (a: string, b: string) => {
	if (a < b) {
		return 1;
	}

	if (a > b) {
		return -1;
	}

	return 0;
};
