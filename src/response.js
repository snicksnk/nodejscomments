module.exports = {
	error(response){
		return (error) => 
			response.send({
				status: "fail",
				error: error.message
			});
	},
	success(response){
		return (data) => 
			response.send({
				status: "success",
				data: data
			});
	}
};