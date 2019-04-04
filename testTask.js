const $button = document.getElementById("calc");
let milBits = '';
let sequence = '';
const bit = [ '0', '1'];
const doubleBits = [ '00', '01', '10', '11'];
const tripleBits = [ '001', '010', '011', '100',
					'101', '110', '111', '000'];

let dataForRequest = [
	{
		key: "08de0aa7-ade4-4061-91aa-1b2ff1ee3910",
		idR: "23726"
	},{
		key: "47d07793-df2f-43b3-914d-5ec7ddf14fc1",
		idR: "12616"
	},{
		key: "4839e503-2c66-4fec-9933-2b9fe532e9dd",
		idR: "5402"
	},{
		key: "c6d67160-f318-4628-9e24-befb0af568f4",
		idR: "21854"
	},{
		key: "f4c3fd72-0358-4505-9053-74ae0e4d744c",
		idR: "20343"
	}
];

$button.addEventListener('click', function() {
	request (dataForRequest);
});

function request (arrReq) {
	let requestLoad = [];
	let count = 0;

	arrReq.forEach(function(item, ind) {
		let requestDataRes = requestData(item.key,item.idR);
		let promise = fetch("https://api.random.org/json-rpc/2/invoke", {
			method: 'post',
			headers: {"Content-type": "application/json; charset=utf-8"},
			body: JSON.stringify(requestDataRes),
			dataType: 'json',
		})

		promise.then(function (response) {return response.json();})
				.then(function (res) {
					requestLoad[ind] = '';
					console.log(res);
					for (let k = 0; k < res.result.random.data.length; k++) {
						requestLoad[ind] = requestLoad[ind] 
										+ res.result.random.data[k];
					}

					sequence = sequence + requestLoad[ind];
					count++;

					if (count === arrReq.length) {
						cleanSequence ();
						samplingValuesBit (bit);
						samplingValuesDoubleBits (doubleBits);
						samplingValuesTripleBits (tripleBits);
					}
				})
				.catch (function (error) {
					console.log('Request failed', error);
				})
		});	
}

function requestData (key, id) {
	let data = {
		"jsonrpc": "2.0",
		"method": "generateIntegerSequences",
		"params": {
			"apiKey": key,
			"n": 100,
			"length": 400,
			"min": 1,
		"max": 10,
		"replacement": true,
		"base": 2
		},
		"id": id
};

	return data;
}


function cleanSequence () {
	for (let i = 0; i < sequence.length; i++) {
		if (sequence[i] === '0' || sequence[i] === '1') {
			milBits = milBits + sequence[i];
		}
	}
}

function samplingValuesBit (arr) {
	arr.forEach(function (item) {
		let counter = 0;
		let ratio;

		for (let i = 0; i < milBits.length; i++) {
			if (item === milBits[i]) {
				counter++;
			}
		}

		ratio = (counter/milBits.length) * 100;
		console.log("number of '" + item  + "'=" + counter);
		console.log(item + " - " + ratio.toFixed(2) + "%");
	})
}

function samplingValuesDoubleBits (arr) {
	arr.forEach(function (item) {
		let counter = 0;

		for (let i = 0; i < (milBits.length - 1); i++) {
			if (item === (milBits[i] + milBits[i+1])) {
				counter++;
			}
		}

		ratio = (counter/milBits.length) * 100;
		console.log("number of '" + item  + "'=" + counter);
		console.log(item + " - " + ratio.toFixed(2) + "%");
	})
}

function samplingValuesTripleBits(arr) {
	arr.forEach(function (item) {
		let counter = 0;

		for (let i = 0; i < (milBits.length - 2); i++) {
			if (item === (milBits[i] + milBits[i+1] + milBits[i+2])) {
				counter++;
			}
		}

		ratio = (counter/milBits.length) * 100;
		console.log("number of '" + item  + "'=" + counter);
		console.log(item + " - " + ratio.toFixed(2) + "%");
	})
}