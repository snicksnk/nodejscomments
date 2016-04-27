"use sctrict";

module.exports = {
	error(response, status){
		status = status || 500;
		return (error) => {
			var errorText, err;
			if (process.env.NODE_ENV === 'development') {
				errorText = error.pubMessage?error.pubMessage:error.message;
				err = error;
			} else {
				errorText = error.pubMessage?error.pubMessage:'';
			}

			response.status = status;
			response.send({
				status: "fail",
				error: errorText,
				err: err
			});
		};
	},
	success(response){
		return (data) => 
			response.send({
				status: "success",
				data: data
			});
	},
	pubError(error, originalError){
		return {pubMessage: error, originalError: originalError};		
	}
};

