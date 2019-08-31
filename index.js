const webcamElement = document.getElementById('webcam');

let net;

async function app() {
  	console.log('Loading mobilenet..');
  	// Load the model.
  	net = await mobilenet.load();
  	console.log('Sucessfully loaded model');
  	// call to the webcam
	await setupWebcam();
	while (true) {
		const result = await net.classify(webcamElement);
		document.getElementById('console').innerText = `
		prediction: ${result[0].className}\n
		prediction: ${result[0].probability}
		`;
		// TensorFlow: Returns a promise that resolve when a requestAnimationFrame has completed.
		await tf.nextFrame();
	}
}

async function setupWebcam() {
	return new Promise((resolve, reject) => {
		const navigationAny = navigator;
		navigator.getUserMedia = navigator.getUserMedia 
									|| navigatorAny.mozGetUserMidea 
									|| navigatorAny.msGetUserMedia;
		if (navigator.getUserMedia) {
			navigator.getUserMedia(
				{video: true}
				, stream => {
					webcamElement.srcObject = stream;
					webcamElement.addEventListener('loadeddata', () => resolve(), false);			
				}
				,error => reject()
			);
		}		
	});
}

app();