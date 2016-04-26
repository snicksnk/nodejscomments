"use sctrict";



module.exports = {
	error(response){
		return (error) => 
		{
			var errorText = error.pubMessage?error.pubMessage:error.message;
			response.send({
				status: "fail",
				error: errorText
			});
		}
	},
	success(response){
		return (data) => 
			response.send({
				status: "success",
				data: data
			});
	},
	pubError(error){
		return {pubMessage: error};		
	}
};