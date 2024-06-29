require('dotenv').config();
const express = require('express');
const axios = require('axios');
const qs = require('qs');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/discordProxy', async (req, res) => {
	const { url, method, headers, data } = req.body;
	
	const secretKey = headers?headers.secretKey:'';
	if(headers){
		delete headers.secretKey;
	}
	if(process.env.SECRET_KEY!=secretKey){
		res.status(200).json({msg:'An error occurred while processing the request.'});
	}
	else {
		
		try {
			const response = await axios({
				url,
				method,
				headers: {
					'Authorization':headers.Authorization
				},
				data
			});
			res.status(response.status).json(response.data);
			
		} catch (error) {
			console.log(error);
			if (error.response) {
				res.status(error.response.status).send(error.response.data);
			} else {
				res.status(500).send('An error occurred while processing the request.');
			}
		}
	}
	
});

app.listen(port, () => {
	console.log(`Proxy server running at http://localhost:${port}`);
});
