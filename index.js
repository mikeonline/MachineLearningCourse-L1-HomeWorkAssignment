const webcamElement = document.getElementById('webcam');
const classifier = knnClassifier.create();

let net;

async function app() {
  	console.log('Loading mobilenet..');
  	// Load the model.
  	net = await mobilenet.load();
  	console.log('Sucessfully loaded model');
  	// call to the webcam
	await setupWebcam();
	const addExample = classId => {
		const activation = net.infer(webcamElement, 'cov_preds');
		classifier.addExample(activation,classId);
	};

	document.getElementById('class-a').addEventListener('click', () => addExample(0));
	document.getElementById('class-b').addEventListener('click', () => addExample(1));
	document.getElementById('class-c').addEventListener('click', () => addExample(2));			

	while (true) {
		if (classifier.getNumClasses() > 0) {
			const activation = net.infer(webcamElement, 'cov_preds');
			const result = await classifier.predictClass(activation);
			const classes = ['A','B','C'];
			document.getElementById('console').innerText = `
			prediction: ${classes[result.classIndex]}\n
			prediction: ${result.confidences[result.classIndex]}
			`;			
		}
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