import router from "router";
function index() {
	router.get("/", function(req, res) {
		res.render("/", {});
	});
}

index();
