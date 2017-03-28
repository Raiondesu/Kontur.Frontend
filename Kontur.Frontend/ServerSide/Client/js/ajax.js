function ajax (type, url, data, successCallback, errorCallback) {
	var xhr = new XMLHttpRequest();
	xhr.open(type, url, true);
	xhr.onload = function() {
		if (xhr.response) {
			if (xhr.status >= 200 && xhr.status < 400) {
				console.log(xhr.status);
				var result;
				try { result = JSON.parse(xhr.response).result; }
				catch (e) { result = xhr.response.result; }
				if (successCallback)
					successCallback(result);
			} else {
				console.error(xhr.response.error);
				if (errorCallback)
					errorCallback(xhr.status, xhr.response.error);
			}
		} else {
			console.error('Response is absent!');
		}	
	}
	xhr.onerror = function() {
		console.error(xhr.status);
		if (errorCallback)
			errorCallback(xhr.status);
	}
	xhr.responseType = 'json';
	xhr.send(JSON.stringify(data));
}

function get(url, successCallback, errorCallback) { ajax("GET", url, '', successCallback, errorCallback); }
