import * as url from 'node:url';
export const isValidUrl = (u: string): boolean => {
	try {
		new url.URL(u);
		return true;
	} catch (_) {
		return false;
	}
}